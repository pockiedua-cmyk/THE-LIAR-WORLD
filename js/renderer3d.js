const R3D=(function(){
  let scene,camera,renderer,container;
  let ambientLight,dirLight,playerLight;
  let tileGroup,entityGroup,particleGroup;
  let tileMeshes={};
  let playerMesh,playerShadow;
  let npcMeshes={},objMeshes={},npcLabels={};
  let currentRegion='pro';
  let fogColors={pro:0x1a1008,r1:0x0a1a0a,r2:0x08080f,r3:0x1a2030,r4:0x2a2010,r5:0x1a0808,r6:0x101828,r7:0x12081a};
  let ambientColors={pro:0x554433,r1:0x336633,r2:0x222233,r3:0x445566,r4:0x776644,r5:0x663333,r6:0x556688,r7:0x443366};
  let dirColors={pro:0xffaa66,r1:0xaaffaa,r2:0x8888cc,r3:0xccccdd,r4:0xffffcc,r5:0xff8866,r6:0xaabbff,r7:0xaa88cc};
  let pointLights=[];
  let particlePositions=[],particleSystems=[];
  let labelContainer;
  let clock;
  let eyeOverlay,eyeSweep;
  const TS=1;
  const THS=0.05;
  let lastMapKey=null;

  function hexToThree(hex){
    if(typeof hex==='number')return hex;
    if(!hex||hex.charAt(0)!=='#')return 0x888888;
    return parseInt(hex.slice(1),16);
  }

  function init(){
    container=document.getElementById('game3d');
    if(!container){console.error('No game3d container');return;}
    try{
    scene=new THREE.Scene();
    clock=new THREE.Clock();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,200);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.4;
    renderer.outputEncoding=THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    ambientLight=new THREE.AmbientLight(0x887766,0.8);
    scene.add(ambientLight);
    dirLight=new THREE.DirectionalLight(0xffcc88,1.0);
    dirLight.position.set(10,15,10);
    dirLight.castShadow=true;
    dirLight.shadow.mapSize.width=1024;
    dirLight.shadow.mapSize.height=1024;
    dirLight.shadow.camera.near=0.5;
    dirLight.shadow.camera.far=80;
    dirLight.shadow.camera.left=-30;
    dirLight.shadow.camera.right=30;
    dirLight.shadow.camera.top=30;
    dirLight.shadow.camera.bottom=-30;
    scene.add(dirLight);
    scene.add(dirLight.target);
    playerLight=new THREE.PointLight(0xffeedd,0.6,12);
    playerLight.position.set(0,2,0);
    scene.add(playerLight);
    tileGroup=new THREE.Group();scene.add(tileGroup);
    entityGroup=new THREE.Group();scene.add(entityGroup);
    particleGroup=new THREE.Group();scene.add(particleGroup);
    labelContainer=document.createElement('div');
    labelContainer.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;overflow:hidden;';
    document.body.appendChild(labelContainer);
    window.addEventListener('resize',onResize);
    scene.fog=new THREE.FogExp2(0x1a1008,0.008);
    buildSkybox();
    createPlayer();
    setRegion('pro');
    }catch(e){console.error('R3D init error:',e);}
  }

  function onResize(){
    if(!camera||!renderer)return;
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  }

  function buildSkybox(){
    const skyGeo=new THREE.SphereGeometry(100,16,16);
    const skyMat=new THREE.ShaderMaterial({
      uniforms:{
        topColor:{value:new THREE.Color(0x0a0520)},
        bottomColor:{value:new THREE.Color(0x15083a)},
        offset:{value:20},
        exponent:{value:0.5}
      },
      vertexShader:'varying vec3 vWorldPosition;void main(){vec4 worldPos=modelMatrix*vec4(position,1.0);vWorldPosition=worldPos.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;varying vec3 vWorldPosition;void main(){float h=normalize(vWorldPosition+offset).y;gl_FragColor=vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),exponent),0.0)),1.0);}',
      side:THREE.BackSide
    });
    scene.add(new THREE.Mesh(skyGeo,skyMat));
  }

  function setRegion(reg){
    currentRegion=reg;
    const ac=ambientColors[reg]||0x554433;
    ambientLight.color.setHex(ac);
    const dc=dirColors[reg]||0xffaa66;
    dirLight.color.setHex(dc);
    const fc=fogColors[reg]||0x1a1008;
    scene.fog.color.setHex(fc);
    if(renderer)renderer.setClearColor(fc);
    const exposure={pro:1.4,r1:1.5,r2:1.0,r3:1.3,r4:1.7,r5:1.3,r6:1.6,r7:1.1};
    renderer.toneMappingExposure=exposure[reg]||1.0;
  }

  function tileHeight(t){return(TILE_H[t]||0)*THS;}

  function buildMap(mapData,mapKey){
    if(lastMapKey===mapKey)return;
    clearMap();
    lastMapKey=mapKey;
    const m=GD[mapKey];
    if(!m)return;
    const rows=m.map.length;const cols=m.map[0].length;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const t=parseInt(m.map[r][c])||0;
        const mesh=createTile(t,c,r);
        if(mesh){
          tileGroup.add(mesh);
          const key=c+','+r;
          tileMeshes[key]=mesh;
        }
      }
    }
    pointLights.forEach(l=>scene.remove(l));
    pointLights=[];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const t=parseInt(m.map[r][c])||0;
        if(t===33||t===26||t===17){
          const pl=new THREE.PointLight(t===33?0xff8800:t===26?0xaa66ff:0xff4400,t===17?0.8:0.5,5);
          pl.position.set(c*TS,tileHeight(t)+0.5,r*TS);
          scene.add(pl);
          pointLights.push(pl);
        }
      }
    }
  }

  function clearMap(){
    while(tileGroup.children.length){
      const c=tileGroup.children[0];
      if(c.geometry)c.geometry.dispose();
      if(c.material){
        if(Array.isArray(c.material))c.material.forEach(m=>m.dispose());
        else c.material.dispose();
      }
      tileGroup.remove(c);
    }
    tileMeshes={};
    pointLights.forEach(l=>scene.remove(l));
    pointLights=[];
    lastMapKey=null;
  }

  function createTile(t,col,row){
    const th=tileHeight(t);
    const x=col*TS;const z=row*TS;
    let geo,mat,mesh;
    const tc=TC[t]||'#222';
    const c3=hexToThree(tc);
    switch(t){
      case 0:case 16:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        const col2=new THREE.Color(c3);
        col2.offsetHSL(0,0,(Math.random()-0.5)*0.04);
        mat=new THREE.MeshStandardMaterial({color:col2,roughness:0.9,metalness:0});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;
        if(Math.random()<0.3){
          const blade=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.08+Math.random()*0.06,0.02),new THREE.MeshStandardMaterial({color:0x4a8a2a,roughness:1}));
          blade.position.set(x+(Math.random()-0.5)*0.6,0.14,z+(Math.random()-0.5)*0.6);
          mesh.add(blade);
        }
        return mesh;}
      case 1:{
        geo=new THREE.BoxGeometry(1,0.08,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.95,metalness:0});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.04,z);mesh.receiveShadow=true;return mesh;}
      case 2:{
        geo=new THREE.BoxGeometry(1,0.05,1);
        mat=new THREE.MeshStandardMaterial({color:0x1a4a7a,roughness:0.2,metalness:0.3,transparent:true,opacity:0.7});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,-0.05,z);mesh.receiveShadow=true;
        mesh.userData={type:'water',origY:-0.05};return mesh;}
      case 3:{
        geo=new THREE.BoxGeometry(1,0.8,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.8,metalness:0.1});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.4,z);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;}
      case 4:{
        const grp=new THREE.Group();
        const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.6,6),new THREE.MeshStandardMaterial({color:0x5a3a1a,roughness:0.9}));
        trunk.position.set(0,0.3,0);trunk.castShadow=true;grp.add(trunk);
        const cols=[0x1a5a1a,0x2a6a2a,0x1a4a1a,0x3a7a2a];
        for(let i=0;i<3;i++){
          const r2=0.3-i*0.06;
          const canopy=new THREE.Mesh(new THREE.SphereGeometry(r2,7,5),new THREE.MeshStandardMaterial({color:cols[i],roughness:0.85}));
          canopy.position.set(0,0.65+i*0.15,0);canopy.scale.y=0.7;canopy.castShadow=true;grp.add(canopy);
        }
        grp.position.set(x,0,z);return grp;}
      case 5:{
        geo=new THREE.BoxGeometry(1,0.12,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.85,metalness:0});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.06,z);mesh.receiveShadow=true;return mesh;}
      case 6:{
        geo=new THREE.BoxGeometry(1,0.9,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.8,metalness:0.1});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.45,z);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;}
      case 7:{
        const grp=new THREE.Group();
        const door=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.6,0.08),new THREE.MeshStandardMaterial({color:0x8b6914,roughness:0.7}));
        door.position.set(0,0.3,0);grp.add(door);
        const knob=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6),new THREE.MeshStandardMaterial({color:0xddaa33,metalness:0.8,roughness:0.3}));
        knob.position.set(0.12,0.3,0.05);grp.add(knob);
        grp.position.set(x,0,z);return grp;}
      case 8:{
        geo=new THREE.BoxGeometry(0.5,0.3,0.4);
        mat=new THREE.MeshStandardMaterial({color:0xc8a020,roughness:0.5,metalness:0.4});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.15,z);mesh.castShadow=true;return mesh;}
      case 9:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
      case 10:{
        geo=new THREE.BoxGeometry(1,0.15,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.85});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.075,z);mesh.receiveShadow=true;return mesh;}
      case 11:{
        const grp=new THREE.Group();
        const awning=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.05,0.6),new THREE.MeshStandardMaterial({color:0xddaa33,roughness:0.7}));
        awning.position.set(0,0.55,0);grp.add(awning);
        const post=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.55,6),new THREE.MeshStandardMaterial({color:0x5a3a1a}));
        post.position.set(0.3,0.275,0.25);grp.add(post);
        const sign=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.15,0.02),new THREE.MeshStandardMaterial({color:0xddaa33}));
        sign.position.set(0,0.55,0.32);grp.add(sign);
        grp.position.set(x,0,z);return grp;}
      case 12:{
        const grp=new THREE.Group();
        const post=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.5,6),new THREE.MeshStandardMaterial({color:0x7a7a7a}));
        post.position.set(0,0.25,0);grp.add(post);
        const board=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.15,0.02),new THREE.MeshStandardMaterial({color:0x999999}));
        board.position.set(0,0.45,0);grp.add(board);
        grp.position.set(x,0,z);return grp;}
      case 13:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:0x2d5a1e,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);
        const fcols=[0xff6688,0xffaa44,0xff44aa,0xff88cc,0x44aaff,0xffff44];
        for(let i=0;i<5;i++){
          const f=new THREE.Mesh(new THREE.SphereGeometry(0.03,5,5),new THREE.MeshStandardMaterial({color:fcols[i%fcols.length]}));
          f.position.set((Math.random()-0.5)*0.6,0.12,(Math.random()-0.5)*0.6);
          mesh.add(f);
        }
        mesh.receiveShadow=true;return mesh;}
      case 14:{
        geo=new THREE.DodecahedronGeometry(0.3,0);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.9,metalness:0.05});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.25,z);mesh.castShadow=true;return mesh;}
      case 15:{
        geo=new THREE.BoxGeometry(1,0.15,1);
        mat=new THREE.MeshStandardMaterial({color:0x3a5a2a,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.075,z);
        for(let i=0;i<4;i++){
          const spike=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.12,4),new THREE.MeshStandardMaterial({color:0x2a4a1a}));
          spike.position.set((Math.random()-0.5)*0.6,0.15,(Math.random()-0.5)*0.6);
          mesh.add(spike);
        }
        mesh.receiveShadow=true;return mesh;}
      case 17:{
        geo=new THREE.BoxGeometry(1,0.08,1);
        mat=new THREE.MeshStandardMaterial({color:0xff4400,roughness:0.3,metalness:0.2,emissive:0xff2200,emissiveIntensity:0.4});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.04,z);mesh.receiveShadow=true;
        mesh.userData={type:'lava'};return mesh;}
      case 18:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:0xaaccdd,roughness:0.1,metalness:0.1,transparent:true,opacity:0.6});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
      case 19:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.95,metalness:0});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
      case 20:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:0xdde8f0,roughness:0.3,metalness:0.05});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
      case 21:{
        geo=new THREE.BoxGeometry(1,0.08,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.8});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.04,z);mesh.receiveShadow=true;return mesh;}
      case 22:{
        geo=new THREE.BoxGeometry(0.8,0.25,0.8);
        mat=new THREE.MeshStandardMaterial({color:0xc8a040,roughness:0.4,metalness:0.5,emissive:0x443300,emissiveIntensity:0.1});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.125,z);mesh.castShadow=true;return mesh;}
      case 23:{
        geo=new THREE.BoxGeometry(1,0.05,1);
        mat=new THREE.MeshStandardMaterial({color:0x6a1a1a,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.025,z);mesh.receiveShadow=true;return mesh;}
      case 24:{
        geo=new THREE.BoxGeometry(0.5,0.3,0.4);
        mat=new THREE.MeshStandardMaterial({color:0xc8a020,roughness:0.5,metalness:0.4});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.15,z);return mesh;}
      case 25:{
        const grp=new THREE.Group();
        const p1=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.3,5),new THREE.MeshStandardMaterial({color:0x5a4a3a}));
        p1.position.set(-0.15,0.15,0);grp.add(p1);
        const p2=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.3,5),new THREE.MeshStandardMaterial({color:0x5a4a3a}));
        p2.position.set(0.15,0.15,0);grp.add(p2);
        for(let i=0;i<3;i++){
          const rung=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.02,0.02),new THREE.MeshStandardMaterial({color:0x6a5a4a}));
          rung.position.set(0,0.05+i*0.1,0);grp.add(rung);
        }
        grp.position.set(x,0,z);return grp;}
      case 26:{
        const grp=new THREE.Group();
        for(let i=0;i<3;i++){
          const cr=new THREE.Mesh(new THREE.OctahedronGeometry(0.08+Math.random()*0.06,0),new THREE.MeshStandardMaterial({color:0xaa66ff,emissive:0x6622aa,emissiveIntensity:0.5,roughness:0.2,metalness:0.6,transparent:true,opacity:0.8}));
          cr.position.set((Math.random()-0.5)*0.2,0.15+i*0.12,(Math.random()-0.5)*0.2);
          cr.rotation.set(Math.random(),Math.random(),Math.random());
          grp.add(cr);
        }
        grp.position.set(x,0,z);return grp;}
      case 27:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:0x1a5a3a,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
      case 28:{
        geo=new THREE.BoxGeometry(0.6,0.4,0.6);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.85,metalness:0.05});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.2,z);mesh.castShadow=true;return mesh;}
      case 29:{
        const grp=new THREE.Group();
        const stone=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.4,0.06),new THREE.MeshStandardMaterial({color:c3,roughness:0.9}));
        stone.position.set(0,0.2,0);grp.add(stone);
        const bar=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.06,0.06),new THREE.MeshStandardMaterial({color:c3,roughness:0.9}));
        bar.position.set(0,0.3,0);grp.add(bar);
        grp.position.set(x,0,z);return grp;}
      case 30:{
        const grp=new THREE.Group();
        const ring=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.04,8,12),new THREE.MeshStandardMaterial({color:c3,roughness:0.8}));
        ring.rotation.x=Math.PI/2;ring.position.set(0,0.4,0);grp.add(ring);
        const water=new THREE.Mesh(new THREE.CircleGeometry(0.22,12),new THREE.MeshStandardMaterial({color:0x1a3a6a,roughness:0.1,metalness:0.3}));
        water.rotation.x=-Math.PI/2;water.position.set(0,0.38,0);grp.add(water);
        grp.position.set(x,0,z);return grp;}
      case 31:{
        const grp=new THREE.Group();
        const post1=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.35,5),new THREE.MeshStandardMaterial({color:0x6a4a2a}));
        post1.position.set(-0.4,0.175,0);grp.add(post1);
        const post2=post1.clone();post2.position.set(0.4,0.175,0);grp.add(post2);
        for(let i=0;i<2;i++){
          const rail=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.03,0.03),new THREE.MeshStandardMaterial({color:0x5a3a1a}));
          rail.position.set(0,0.1+i*0.15,0);grp.add(rail);
        }
        grp.position.set(x,0,z);return grp;}
      case 32:{
        geo=new THREE.BoxGeometry(0.3,0.6,0.3);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.6,metalness:0.2});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.3,z);mesh.castShadow=true;
        const orb=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8),new THREE.MeshStandardMaterial({color:0x6688cc,emissive:0x2244aa,emissiveIntensity:0.4}));
        orb.position.set(0,0.45,0);mesh.add(orb);
        return mesh;}
      case 33:{
        const grp=new THREE.Group();
        const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.03,0.5,6),new THREE.MeshStandardMaterial({color:0x5a3a1a}));
        pole.position.set(0,0.25,0);grp.add(pole);
        const flame=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),new THREE.MeshStandardMaterial({color:0xff8800,emissive:0xff4400,emissiveIntensity:1.0}));
        flame.position.set(0,0.55,0);grp.add(flame);
        const core=new THREE.Mesh(new THREE.SphereGeometry(0.03,5,5),new THREE.MeshStandardMaterial({color:0xffcc00,emissive:0xffaa00,emissiveIntensity:1.5}));
        core.position.set(0,0.57,0);grp.add(core);
        grp.position.set(x,0,z);grp.userData={type:'torch'};return grp;}
      case 34:{
        const grp=new THREE.Group();
        const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.7,6),new THREE.MeshStandardMaterial({color:0x5a3a1a}));
        pole.position.set(0,0.35,0);grp.add(pole);
        const flag=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.15),new THREE.MeshStandardMaterial({color:0xcc3333,side:THREE.DoubleSide}));
        flag.position.set(0.15,0.6,0);grp.add(flag);
        grp.position.set(x,0,z);return grp;}
      case 35:{
        geo=new THREE.CylinderGeometry(0.2,0.22,0.35,8);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.8,metalness:0.05});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.175,z);mesh.castShadow=true;return mesh;}
      default:{
        geo=new THREE.BoxGeometry(1,0.1,1);
        mat=new THREE.MeshStandardMaterial({color:c3,roughness:0.9});
        mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,0.05,z);mesh.receiveShadow=true;return mesh;}
    }
  }

  function createPlayer(){
    playerMesh=new THREE.Group();
    const skin=0xf0c8a0,darkSkin=0xd8a888;
    const cloak=0x2a3a5a,cloakDark=0x1a2a4a;
    const leather=0x6a4a30,leatherDk=0x4a3020;
    const cloth=0x3a4a6a,pants=0x2a3040;
    const hairColor=0x3a2210;
    const torso=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.16,0.28,10),new THREE.MeshStandardMaterial({color:cloak,roughness:0.7}));
    torso.position.y=0.54;torso.castShadow=true;torso.name='torso';playerMesh.add(torso);
    const shoulderL=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),new THREE.MeshStandardMaterial({color:cloak,roughness:0.7}));
    shoulderL.position.set(-0.18,0.64,0);playerMesh.add(shoulderL);
    const shoulderR=shoulderL.clone();shoulderR.position.set(0.18,0.64,0);playerMesh.add(shoulderR);
    const hip=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.1,0.1,8),new THREE.MeshStandardMaterial({color:pants,roughness:0.8}));
    hip.position.y=0.37;playerMesh.add(hip);
    const belt=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.03,10),new THREE.MeshStandardMaterial({color:leather,roughness:0.5,metalness:0.3}));
    belt.position.y=0.42;playerMesh.add(belt);
    const buckle=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.04),new THREE.MeshStandardMaterial({color:0xddaa44,metalness:0.8,roughness:0.3}));
    buckle.position.set(0,0.42,0.17);playerMesh.add(buckle);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.06,8),new THREE.MeshStandardMaterial({color:0xcc4444,roughness:0.8}));
    neck.position.y=0.7;playerMesh.add(neck);
    const head=new THREE.Mesh(new THREE.SphereGeometry(0.15,10,8),new THREE.MeshStandardMaterial({color:skin,roughness:0.7}));
    head.position.y=0.82;head.castShadow=true;head.name='head';playerMesh.add(head);
    const hairBase=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8,0,Math.PI*2,0,Math.PI*0.55),new THREE.MeshStandardMaterial({color:hairColor,roughness:0.9}));
    hairBase.position.y=0.84;playerMesh.add(hairBase);
    const hairSideL=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.08,0.12),new THREE.MeshStandardMaterial({color:hairColor,roughness:0.9}));
    hairSideL.position.set(-0.13,0.78,0.02);hairSideL.rotation.z=0.2;playerMesh.add(hairSideL);
    const hairSideR=hairSideL.clone();hairSideR.position.set(0.13,0.78,0.02);hairSideR.rotation.z=-0.2;playerMesh.add(hairSideR);
    const hairBack=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.06),new THREE.MeshStandardMaterial({color:hairColor,roughness:0.9}));
    hairBack.position.set(0,0.76,-0.12);playerMesh.add(hairBack);
    const eyeL=new THREE.Mesh(new THREE.SphereGeometry(0.028,6,6),new THREE.MeshStandardMaterial({color:0xffffff}));
    eyeL.position.set(-0.055,0.83,0.13);playerMesh.add(eyeL);
    const eyeR=eyeL.clone();eyeR.position.set(0.055,0.83,0.13);playerMesh.add(eyeR);
    const pupilL=new THREE.Mesh(new THREE.SphereGeometry(0.014,5,5),new THREE.MeshStandardMaterial({color:0x1a4488}));
    pupilL.position.set(-0.055,0.83,0.15);playerMesh.add(pupilL);
    const pupilR=pupilL.clone();pupilR.position.set(0.055,0.83,0.15);playerMesh.add(pupilR);
    const browL=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.008,0.015),new THREE.MeshStandardMaterial({color:0x3a2210}));
    browL.position.set(-0.055,0.86,0.145);browL.rotation.z=0.15;playerMesh.add(browL);
    const browR=browL.clone();browR.position.set(0.055,0.86,0.145);browR.rotation.z=-0.15;playerMesh.add(browR);
    const mouth=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.005,0.01),new THREE.MeshStandardMaterial({color:0xaa7766}));
    mouth.position.set(0,0.79,0.145);playerMesh.add(mouth);
    const legL=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.05,0.3,8),new THREE.MeshStandardMaterial({color:pants,roughness:0.8}));
    legL.position.set(-0.075,0.15,0);legL.name='legL';playerMesh.add(legL);
    const legR=legL.clone();legR.position.set(0.075,0.15,0);legR.name='legR';playerMesh.add(legR);
    const bootMat=new THREE.MeshStandardMaterial({color:leather,roughness:0.6,metalness:0.1});
    const bootL=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.06,6),bootMat);
    bootL.position.set(0,-0.15,0.02);bootL.name='bootL';legL.add(bootL);
    const bootR=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.06,6),bootMat);
    bootR.position.set(0,-0.15,0.02);bootR.name='bootR';legR.add(bootR);
    const strapL=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.26,0.02),new THREE.MeshStandardMaterial({color:leatherDk,roughness:0.6}));
    strapL.position.set(-0.08,0.55,0.06);strapL.rotation.z=0.15;playerMesh.add(strapL);
    const strapR=strapL.clone();strapR.position.set(0.08,0.55,0.06);strapR.rotation.z=-0.15;playerMesh.add(strapR);
    const armMat=new THREE.MeshStandardMaterial({color:cloth,roughness:0.7});
    const armL=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.04,0.28,8),armMat);
    armL.position.set(-0.22,0.56,0.02);armL.name='armL';armL.castShadow=true;playerMesh.add(armL);
    const armR=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.04,0.28,8),armMat);
    armR.position.set(0.22,0.56,0.02);armR.name='armR';armR.castShadow=true;playerMesh.add(armR);
    const handMat=new THREE.MeshStandardMaterial({color:skin,roughness:0.7});
    const handL=new THREE.Mesh(new THREE.SphereGeometry(0.025,5,5),handMat);
    handL.position.set(0,-0.14,0);handL.name='handL';armL.add(handL);
    const handR=new THREE.Mesh(new THREE.SphereGeometry(0.025,5,5),handMat);
    handR.position.set(0,-0.14,0);handR.name='handR';armR.add(handR);
    const cape=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.45,0.02),new THREE.MeshStandardMaterial({color:cloakDark,roughness:0.8,side:THREE.DoubleSide}));
    cape.position.set(0,0.55,-0.16);cape.name='cape';playerMesh.add(cape);
    const swordHandle=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.12,5),new THREE.MeshStandardMaterial({color:leather,roughness:0.5}));
    swordHandle.position.set(0.15,0.65,-0.18);swordHandle.rotation.z=0.3;playerMesh.add(swordHandle);
    const swordBlade=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.28,0.008),new THREE.MeshStandardMaterial({color:0xccccdd,metalness:0.8,roughness:0.2}));
    swordBlade.position.set(0.17,0.5,-0.18);swordBlade.rotation.z=0.3;playerMesh.add(swordBlade);
    const guard=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.015,0.03),new THREE.MeshStandardMaterial({color:0xddaa44,metalness:0.7,roughness:0.3}));
    guard.position.set(0.155,0.59,-0.18);guard.rotation.z=0.3;playerMesh.add(guard);
    playerShadow=new THREE.Mesh(new THREE.CircleGeometry(0.2,12),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.25,depthWrite:false}));
    playerShadow.rotation.x=-Math.PI/2;playerShadow.position.y=0.01;
    playerMesh.add(playerShadow);
    entityGroup.add(playerMesh);
  }

  function updatePlayer(px,py,dir,isMoving,walkFrame,name){
    if(!playerMesh)return;
    const targetX=px*TS;const targetZ=py*TS;
    playerMesh.position.x+=(targetX-playerMesh.position.x)*0.2;
    playerMesh.position.z+=(targetZ-playerMesh.position.z)*0.2;
    dirLight.position.set(playerMesh.position.x+10,15,playerMesh.position.z+10);
    dirLight.target.position.set(playerMesh.position.x,0,playerMesh.position.z);
    const rotY=[Math.PI,Math.PI/2,0,-Math.PI/2][dir]||0;
    const curRot=playerMesh.rotation.y;
    let diff=rotY-curRot;
    while(diff>Math.PI)diff-=Math.PI*2;
    while(diff<-Math.PI)diff+=Math.PI*2;
    playerMesh.rotation.y+=diff*0.15;
    const t=Date.now();
    const legL=playerMesh.getObjectByName('legL');
    const legR=playerMesh.getObjectByName('legR');
    const armL=playerMesh.getObjectByName('armL');
    const armR=playerMesh.getObjectByName('armR');
    const cape=playerMesh.getObjectByName('cape');
    const head=playerMesh.getObjectByName('head');
    if(isMoving){
      const swing=Math.sin(t*0.012)*0.25;
      const bob=Math.sin(t*0.012)*0.03;
      const sway=Math.sin(t*0.006)*0.03;
      playerMesh.position.y=bob;
      if(legL)legL.rotation.x=swing;
      if(legR)legR.rotation.x=-swing;
      if(armL)armL.rotation.x=-swing*0.6;
      if(armR)armR.rotation.x=swing*0.6;
      if(cape)cape.rotation.x=swing*0.15+0.1;
      if(head)head.rotation.z=sway;
    }else{
      const idle=Math.sin(t*0.002)*0.008;
      const breath=Math.sin(t*0.003)*0.01;
      playerMesh.position.y=idle;
      if(legL)legL.rotation.x=0;
      if(legR)legR.rotation.x=0;
      if(armL)armL.rotation.x=0;
      if(armR)armR.rotation.x=0;
      if(cape)cape.rotation.x=breath;
      if(head)head.rotation.z=0;
    }
    updatePlayerLabel(px,py,name);
    playerLight.position.set(playerMesh.position.x,1.5,playerMesh.position.z);
  }

  const playerLabel={el:null};
  function updatePlayerLabel(px,py,name){
    if(!playerLabel.el){
      playerLabel.el=document.createElement('div');
      playerLabel.el.style.cssText='position:absolute;text-align:center;pointer-events:none;transition:opacity 0.2s;font-family:monospace;';
      const bg=document.createElement('div');
      bg.style.cssText='background:rgba(0,0,0,0.6);border-radius:4px;padding:2px 8px;display:inline-block;';
      const txt=document.createElement('div');
      txt.style.cssText='color:#88ccff;font-weight:bold;font-size:11px;';
      bg.appendChild(txt);playerLabel.el.appendChild(bg);
      labelContainer.appendChild(playerLabel.el);
    }
    const pos=new THREE.Vector3(px*TS,1.3,py*TS);
    pos.project(camera);
    const x2=(pos.x*0.5+0.5)*window.innerWidth;
    const y2=(-pos.y*0.5+0.5)*window.innerHeight;
    playerLabel.el.style.left=x2+'px';
    playerLabel.el.style.top=y2+'px';
    playerLabel.el.style.transform='translate(-50%,-100%)';
    playerLabel.el.style.opacity=pos.z<1?'1':'0';
    playerLabel.el.querySelector('div div').textContent=name||'';
  }

  function updateNPCs(npcs,px,py,nearestNPC){
    const activeIds=new Set();
    const t=Date.now();
    (npcs||[]).forEach(n=>{
      activeIds.add(n.id);
      if(!npcMeshes[n.id]){
        npcMeshes[n.id]=createNPCMesh(n);
        entityGroup.add(npcMeshes[n.id].group);
      }
      const m=npcMeshes[n.id];
      const tx=n.x*TS;const tz=n.y*TS;
      m.group.position.x+=(tx-m.group.position.x)*0.15;
      m.group.position.z+=(tz-m.group.position.z)*0.15;
      const dx=px-n.x;const dy=py-n.y;
      let faceAngle=0;
      if(Math.abs(dx)>Math.abs(dy)){faceAngle=dx>0?-Math.PI/2:Math.PI/2;}
      else{faceAngle=dy>0?0:Math.PI;}
      const cr=m.group.rotation.y;let d=faceAngle-cr;
      while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;
      m.group.rotation.y+=d*0.08;
      if(m.body){
        const breathe=Math.sin(t*0.002+n.x*2.3+n.y*5.1);
        m.group.position.y=breathe*0.008;
        m.body.scale.x=1+breathe*0.012;
        m.body.scale.z=1+Math.sin(t*0.002+n.y*3.7)*0.012;
        const legL=m.group.getObjectByName('legL');
        const legR=m.group.getObjectByName('legR');
        if(legL){legL.rotation.x=Math.sin(t*0.0015+n.x)*0.05;}
        if(legR){legR.rotation.x=Math.sin(t*0.0015+n.x+Math.PI)*0.05;}
      } else {
        const bob=Math.sin(t*0.001+n.x*3.1+n.y*4.7)*0.01;
        m.group.position.y=bob;
        m.group.children[0]&&m.group.children[0].rotation&&(m.group.children[0].rotation.y+=0.01);
      }
      const isNearest=nearestNPC&&nearestNPC.id===n.id;
      updateNPCLabel(n,m.group,isNearest);
    });
    Object.keys(npcMeshes).forEach(id=>{
      if(!activeIds.has(id)){
        entityGroup.remove(npcMeshes[id].group);
        if(npcMeshes[id].label&&npcMeshes[id].label.parentNode)npcMeshes[id].label.parentNode.removeChild(npcMeshes[id].label);
        delete npcMeshes[id];
      }
    });
  }

  const NPC_STYLES={
    elder:{body:0xc8b898,skin:0xf0c8a0,hair:0xe0e0e0,hairStyle:'long',h:0.88,beard:true,cloak:0x8a7a6a,acc:'staff'},
    merchant:{body:0x6a5a3a,skin:0xf0c8a0,hair:0x5a3a20,hairStyle:'short',h:0.85,vest:0x9a7a4a,acc:'bag'},
    child:{body:0xcc4444,skin:0xf5d0b0,hair:0x7a4a20,hairStyle:'pigtails',h:0.58},
    drunk:{body:0x6a5a50,skin:0xe8b8a0,hair:0x8a7a6a,hairStyle:'messy',h:0.84,bottle:true},
    mira:{body:0x7a4a6a,skin:0xf0c8a0,hair:0xe0e0e0,hairStyle:'bun',h:0.78,shawl:0x9a6a8a,acc:'cane'},
    smith:{body:0x4a4a4a,skin:0xd8a888,hair:0x2a1a10,hairStyle:'short',h:0.92,apron:0x5a4a3a,muscular:true},
    guard:{body:0x3a4a6a,skin:0xf0c8a0,hair:0x3a2a1a,hairStyle:'helmet',h:0.9,armor:0x6a7a9a,weapon:'spear'},
    ghost:{body:0x8888cc,skin:0xaaaadd,hair:0x9999ee,hairStyle:'flowing',h:0.84,transparent:true,glow:0x6666cc},
    hermit:{body:0x4a6a3a,skin:0xd8c8a0,hair:0x999999,hairStyle:'long',h:0.84,beard:true,cloak:0x3a5a2a,acc:'staff'},
    gfarmer:{body:0x7a6a4a,skin:0xf0c8a0,hair:0x5a3a20,hairStyle:'strawhat',h:0.85,overalls:0x6a5a3a},
    ghunter:{body:0x3a5a3a,skin:0xe8c0a0,hair:0x2a1a10,hairStyle:'ponytail',h:0.87,leather:0x5a4a3a,weapon:'bow'},
    gchild:{body:0x55aa55,skin:0xf5d0b0,hair:0x3a2a1a,hairStyle:'short',h:0.55},
    gpriest:{body:0xeeeeee,skin:0xf0c8a0,hair:0xc0a060,hairStyle:'short',h:0.84,robe:0xddddcc,symbol:true},
    gmerch:{body:0x8a7a5a,skin:0xf0c8a0,hair:0x4a3a20,hairStyle:'short',h:0.85,vest:0xaa8a5a,acc:'bag'},
    ghostprior:{body:0x9999cc,skin:0xbbbbdd,hair:0xaaaadd,hairStyle:'bald',h:0.84,transparent:true,glow:0x7777bb,robe:0x8888bb},
    snova:{body:0xffffff,skin:0xf8e8d8,hair:0xc0a060,hairStyle:'bun',h:0.8,robe:0xeeeedd,symbol:true,glow:0xffffee},
    miner:{body:0x6a5a3a,skin:0xd8b898,hair:0x3a2a1a,hairStyle:'short',h:0.84,apron:0x5a4a2a,helmet:true},
    herb:{body:0x4a7a4a,skin:0xe8d0b0,hair:0x6a8a4a,hairStyle:'flowercrown',h:0.8,cloak:0x3a6a3a},
    bchild:{body:0x3a3a4a,skin:0xc8c8d8,hair:0x2a2a3a,hairStyle:'short',h:0.5,transparent:true,glow:0x4444aa},
    bhunt:{body:0x5a4a3a,skin:0xd8b898,hair:0x5a4a3a,hairStyle:'wild',h:0.92,fur:true,weapon:'axe'},
    bspirit:{body:0x44aa66,skin:0x88cc88,hair:0x66bb77,hairStyle:'flowing',h:0.84,transparent:true,glow:0x44aa66},
    bsurv:{body:0x7a6a5a,skin:0xc8b8a8,hair:0x5a4a3a,hairStyle:'messy',h:0.82,tattered:true},
    fkhnight:{body:0x8a8aaa,skin:0xf0c8a0,hair:0x3a2a1a,hairStyle:'short',h:0.92,armor:0xaabacc,cape:0xcc3333,weapon:'sword'},
    fchef:{body:0xf0f0f0,skin:0xf0c8a0,hair:0x5a3a20,hairStyle:'chefhat',h:0.84,apron:0xffffff},
    fmaid:{body:0x2a2a2a,skin:0xf8e8d8,hair:0xc0a060,hairStyle:'bun',h:0.76,maid:true,apron:0xeeeeee},
    fguard:{body:0x2a4a6a,skin:0xf0c8a0,hair:0x3a2a1a,hairStyle:'short',h:0.9,armor:0x4a6a8a,weapon:'sword'},
    fscholar:{body:0x6a5a4a,skin:0xf0c8a0,hair:0x8a5a30,hairStyle:'short',h:0.8,book:true,glasses:true},
    smerch:{body:0xcc8844,skin:0xd8b898,hair:0x2a1a10,hairStyle:'turban',h:0.84,veil:0xeecc88},
    sinform:{body:0x2a2a3a,skin:0xb8a898,hair:0x1a1a1a,hairStyle:'hood',h:0.84,cloak:0x1a1a2a,hidden:true},
    sguard:{body:0xaa8833,skin:0xd8b898,hair:0x2a1a10,hairStyle:'short',h:0.9,armor:0xccaa44,weapon:'spear'},
    swit1:{body:0xcc9966,skin:0xd8b898,hair:0x2a1a10,hairStyle:'long',h:0.78,shawl:0xddaa77},
    svizier:{body:0x6a2a6a,skin:0xd8b898,hair:0x2a1a10,hairStyle:'turban_tall',h:0.92,robe:0x8a3a8a,staff:true},
    ccapt:{body:0xaa2222,skin:0xf0c8a0,hair:0x2a1a10,hairStyle:'hat_captain',h:0.9,cape:0x882222,weapon:'sword',eyepatch:true},
    cfirst:{body:0x3a3a5a,skin:0xe8c0a0,hair:0x2a1a10,hairStyle:'bandana',h:0.86,weapon:'sword',scar:true},
    ccook:{body:0x9a7a5a,skin:0xd8b898,hair:0x5a3a20,hairStyle:'short',h:0.8,apron:0xccbb99,big:true},
    cnav:{body:0x4a4a7a,skin:0xf0c8a0,hair:0x1a1a2a,hairStyle:'short',h:0.84,acc:'compass'},
    xsci:{body:0x6a6a7a,skin:0xf0c8a0,hair:0x5a3a20,hairStyle:'short',h:0.84,glasses:true,toolbelt:true},
    xchild:{body:0x88aaff,skin:0xf8e8f8,hair:0xccccee,hairStyle:'floaty',h:0.48,transparent:true,glow:0x88aaff},
    xelder:{body:0xaaaadd,skin:0xe8e8ff,hair:0xccccff,hairStyle:'flowing',h:0.88,transparent:true,glow:0xaaaadd,robe:0x9999cc},
    xbuilder:{body:0x6a6a5a,skin:0xaaa898,hair:0x5a5a4a,hairStyle:'short',h:0.9,weapon:'hammer',muscular:true},
    zorigin:{body:0xffeedd,skin:0xffffff,hair:0xffffff,hairStyle:'flowing',h:0.88,transparent:true,glow:0xffeedd,robe:0xffffff},
    zguard:{body:0x88ccff,skin:0xaaddff,hair:0x66bbee,hairStyle:'crystal',h:0.92,transparent:true,glow:0x88ccff},
    zecho:{body:0x9999bb,skin:0xbbbbdd,hair:0xaaaacc,hairStyle:'flowing',h:0.84,transparent:true,glow:0x8888aa}
  };

  function getNPCStyle(id){
    const k=(id||'').toLowerCase();
    const match=Object.keys(NPC_STYLES).find(sk=>k.startsWith(sk));
    return match?NPC_STYLES[match]:null;
  }

  function buildHair(style,group,sy){
    const hc=style.hairColor||style.hair||0x6a4a30;
    const hMat=new THREE.MeshStandardMaterial({color:hc,roughness:0.9,transparent:!!style.transparent,opacity:style.transparent?0.65:1});
    switch(style.hairStyle){
      case'short':{
        const h=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,5,0,Math.PI*2,0,Math.PI*0.5),hMat);
        h.position.y=sy;group.add(h);break;}
      case'long':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.155,8,5,0,Math.PI*2,0,Math.PI*0.55),hMat);
        top.position.y=sy;group.add(top);
        const back=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.18,0.06),hMat);
        back.position.set(0,sy-0.1,-0.08);group.add(back);break;}
      case'pigtails':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,4,0,Math.PI*2,0,Math.PI*0.5),hMat);
        top.position.y=sy;group.add(top);
        const ptL=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.025,0.14,5),hMat);
        ptL.position.set(-0.14,sy-0.04,0);ptL.rotation.z=0.4;group.add(ptL);
        const ptR=ptL.clone();ptR.position.set(0.14,sy-0.04,0);ptR.rotation.z=-0.4;group.add(ptR);break;}
      case'bun':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.145,8,4,0,Math.PI*2,0,Math.PI*0.5),hMat);
        top.position.y=sy;group.add(top);
        const bun=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),hMat);
        bun.position.set(0,sy+0.04,-0.06);group.add(bun);break;}
      case'messy':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6,0,Math.PI*2,0,Math.PI*0.6),hMat);
        top.position.y=sy;group.add(top);
        const strand=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.1,0.03),hMat);
        strand.position.set(0.08,sy-0.02,0.06);strand.rotation.z=-0.3;group.add(strand);break;}
      case'flowing':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.155,8,6,0,Math.PI*2,0,Math.PI*0.55),hMat);
        top.position.y=sy;group.add(top);
        const flow=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.22,0.04),hMat);
        flow.position.set(0,sy-0.12,-0.06);group.add(flow);break;}
      case'wild':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,6,0,Math.PI*2,0,Math.PI*0.65),hMat);
        top.position.y=sy;group.add(top);
        for(let i=0;i<3;i++){
          const spike=new THREE.Mesh(new THREE.ConeGeometry(0.025,0.08,4),hMat);
          const a=(i-1)*0.5;
          spike.position.set(Math.sin(a)*0.1,sy+0.06,Math.cos(a)*0.06);
          spike.rotation.z=a*0.5;group.add(spike);}break;}
      case'ponytail':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.145,8,5,0,Math.PI*2,0,Math.PI*0.5),hMat);
        top.position.y=sy;group.add(top);
        const tail=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.03,0.16,5),hMat);
        tail.position.set(0,sy-0.06,-0.1);tail.rotation.x=0.4;group.add(tail);break;}
      case'helmet':{
        const helMat=new THREE.MeshStandardMaterial({color:style.armor||0x6a7a9a,roughness:0.3,metalness:0.6});
        const hel=new THREE.Mesh(new THREE.SphereGeometry(0.155,8,5,0,Math.PI*2,0,Math.PI*0.5),helMat);
        hel.position.y=sy;group.add(hel);
        const rim=new THREE.Mesh(new THREE.TorusGeometry(0.14,0.015,4,12),helMat);
        rim.position.y=sy-0.02;rim.rotation.x=Math.PI/2;group.add(rim);
        const nose=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.06,0.02),helMat);
        nose.position.set(0,sy-0.04,0.14);group.add(nose);break;}
      case'strawhat':{
        const hatMat=new THREE.MeshStandardMaterial({color:0xc8b060,roughness:0.9});
        const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.24,0.02,10),hatMat);
        brim.position.y=sy+0.01;group.add(brim);
        const crown=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.1,8),hatMat);
        crown.position.y=sy+0.07;group.add(crown);break;}
      case'chefhat':{
        const hatMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.5});
        const band=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.04,8),hatMat);
        band.position.y=sy;group.add(band);
        const puff=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),hatMat);
        puff.position.y=sy+0.09;group.add(puff);break;}
      case'turban':{
        const tMat=new THREE.MeshStandardMaterial({color:style.veil||0xddccaa,roughness:0.7});
        const tur=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,5,0,Math.PI*2,0,Math.PI*0.55),tMat);
        tur.position.y=sy;group.add(tur);
        const wrap=new THREE.Mesh(new THREE.TorusGeometry(0.13,0.025,4,10),tMat);
        wrap.position.y=sy+0.02;wrap.rotation.x=Math.PI/2;group.add(wrap);break;}
      case'turban_tall':{
        const tMat=new THREE.MeshStandardMaterial({color:0x8a3a8a,roughness:0.6,metalness:0.2});
        const tur=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.14,0.18,8),tMat);
        tur.position.y=sy+0.06;group.add(tur);
        const jewel=new THREE.Mesh(new THREE.SphereGeometry(0.02,6,6),new THREE.MeshStandardMaterial({color:0xff4444,metalness:0.9,roughness:0.1}));
        jewel.position.set(0,sy+0.04,0.13);group.add(jewel);break;}
      case'hat_captain':{
        const hatMat=new THREE.MeshStandardMaterial({color:0x222222,roughness:0.6});
        const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.2,0.02,10),hatMat);
        brim.position.y=sy+0.01;group.add(brim);
        const crown=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,0.08,8),hatMat);
        crown.position.y=sy+0.06;group.add(crown);
        const feather=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.1,0.03),new THREE.MeshStandardMaterial({color:0xcc2222}));
        feather.position.set(0.06,sy+0.1,0);feather.rotation.z=-0.3;group.add(feather);break;}
      case'bandana':{
        const bMat=new THREE.MeshStandardMaterial({color:0xcc3333,roughness:0.8});
        const band=new THREE.Mesh(new THREE.TorusGeometry(0.135,0.015,4,12),bMat);
        band.position.y=sy;band.rotation.x=Math.PI/2;group.add(band);
        const knot=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.02),bMat);
        knot.position.set(-0.12,sy-0.02,0);group.add(knot);break;}
      case'hood':{
        const hMat=new THREE.MeshStandardMaterial({color:style.cloak||0x1a1a2a,roughness:0.8,side:THREE.DoubleSide});
        const hood=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,5,0,Math.PI*2,0,Math.PI*0.6),hMat);
        hood.position.y=sy;group.add(hood);break;}
      case'floaty':{
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,6,0,Math.PI*2,0,Math.PI*0.5),hMat);
        top.position.y=sy;group.add(top);
        const orb=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6),new THREE.MeshStandardMaterial({color:0xaaddff,emissive:0x6688cc,emissiveIntensity:0.5,transparent:true,opacity:0.7}));
        orb.position.set(0,sy+0.12,0);group.add(orb);break;}
      case'crystal':{
        for(let i=0;i<4;i++){
          const ang=(i/4)*Math.PI*2;
          const crystal=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.12,4),new THREE.MeshStandardMaterial({color:0x88ccff,emissive:0x4488cc,emissiveIntensity:0.4,transparent:true,opacity:0.7}));
          crystal.position.set(Math.sin(ang)*0.1,sy+0.04,Math.cos(ang)*0.1);crystal.rotation.z=Math.sin(ang)*0.3;group.add(crystal);}
        const top=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,4,0,Math.PI*2,0,Math.PI*0.5),hMat);
        top.position.y=sy;group.add(top);break;}
      default:{
        const h=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,5,0,Math.PI*2,0,Math.PI*0.5),hMat);
        h.position.y=sy;group.add(h);}
    }
  }

  function buildAccessory(style,group,sh){
    if(style.helmet&&style.hairStyle!=='helmet'){
      const helMat=new THREE.MeshStandardMaterial({color:0x888866,roughness:0.4,metalness:0.5});
      const hel=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,4,0,Math.PI*2,0,Math.PI*0.45),helMat);
      hel.position.y=sh;group.add(hel);
      const light=new THREE.Mesh(new THREE.SphereGeometry(0.02,5,5),new THREE.MeshStandardMaterial({color:0xffffaa,emissive:0xffff44,emissiveIntensity:0.8}));
      light.position.set(0,sh-0.02,0.14);group.add(light);
    }
    if(style.beard){
      const bMat=new THREE.MeshStandardMaterial({color:style.hair||0x999999,roughness:0.9});
      const beard=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.12,5),bMat);
      beard.position.set(0,sh-0.12,0.06);beard.rotation.x=0.2;group.add(beard);
    }
    if(style.glasses){
      const gMat=new THREE.MeshStandardMaterial({color:0x88aacc,metalness:0.8,roughness:0.2,transparent:true,opacity:0.5});
      const glL=new THREE.Mesh(new THREE.TorusGeometry(0.025,0.004,4,8),gMat);
      glL.position.set(-0.05,sh+0.01,0.13);group.add(glL);
      const glR=glL.clone();glR.position.set(0.05,sh+0.01,0.13);group.add(glR);
      const bridge=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.004,0.004),gMat);
      bridge.position.set(0,sh+0.01,0.13);group.add(bridge);
    }
    if(style.symbol){
      const sMat=new THREE.MeshStandardMaterial({color:0xddaa44,metalness:0.7,roughness:0.3,emissive:0x664400,emissiveIntensity:0.2});
      const sym=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.04,0.01),sMat);
      sym.position.set(0,sh-0.12,0.14);group.add(sym);
    }
    if(style.hidden){
      const vMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9});
      const veil=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.1,0.12),vMat);
      veil.position.set(0,sh-0.04,0.04);group.add(veil);
    }
    if(style.muscular){
      const mMat=new THREE.MeshStandardMaterial({color:style.skin||0xd8a888,roughness:0.7});
      const armL=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.035,0.12,6),mMat);
      armL.position.set(-0.2,sh*0.35,0.03);group.add(armL);
      const armR=armL.clone();armR.position.set(0.2,sh*0.35,0.03);group.add(armR);
    }
    if(style.weapon==='sword'){
      const sMat=new THREE.MeshStandardMaterial({color:0xccccdd,metalness:0.8,roughness:0.2});
      const blade=new THREE.Mesh(new THREE.BoxGeometry(0.015,0.22,0.006),sMat);
      blade.position.set(0.18,sh-0.08,-0.14);blade.rotation.z=0.3;group.add(blade);
      const hilt=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.08,4),new THREE.MeshStandardMaterial({color:0x6a4a30,roughness:0.6}));
      hilt.position.set(0.16,sh+0.02,-0.14);hilt.rotation.z=0.3;group.add(hilt);
    }
    if(style.weapon==='spear'){
      const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.6,4),new THREE.MeshStandardMaterial({color:0x6a4a30,roughness:0.8}));
      shaft.position.set(0.2,sh-0.05,0);group.add(shaft);
      const tip=new THREE.Mesh(new THREE.ConeGeometry(0.02,0.08,4),new THREE.MeshStandardMaterial({color:0xaaaacc,metalness:0.7,roughness:0.3}));
      tip.position.set(0.2,sh+0.28,0);group.add(tip);
    }
    if(style.weapon==='bow'){
      const bowMat=new THREE.MeshStandardMaterial({color:0x8a6a30,roughness:0.7});
      const curve=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.008,4,8,Math.PI),bowMat);
      curve.position.set(-0.2,sh-0.05,0);curve.rotation.z=Math.PI/2;group.add(curve);
      const string=new THREE.Mesh(new THREE.CylinderGeometry(0.002,0.002,0.2,3),new THREE.MeshStandardMaterial({color:0xccccaa}));
      string.position.set(-0.2,sh-0.05,0);group.add(string);
    }
    if(style.weapon==='axe'){
      const handle=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.35,4),new THREE.MeshStandardMaterial({color:0x6a4a30,roughness:0.8}));
      handle.position.set(0.2,sh-0.05,0);group.add(handle);
      const blade=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.06,0.01),new THREE.MeshStandardMaterial({color:0x888899,metalness:0.7,roughness:0.3}));
      blade.position.set(0.22,sh+0.1,0);group.add(blade);
    }
    if(style.weapon==='hammer'){
      const handle=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.35,4),new THREE.MeshStandardMaterial({color:0x6a4a30,roughness:0.8}));
      handle.position.set(0.2,sh-0.05,0);group.add(handle);
      const head=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.06,0.06),new THREE.MeshStandardMaterial({color:0x7a7a7a,metalness:0.5,roughness:0.4}));
      head.position.set(0.2,sh+0.12,0);group.add(head);
    }
    if(style.bottle){
      const bottle=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.02,0.08,6),new THREE.MeshStandardMaterial({color:0x4a6a3a,roughness:0.3,transparent:true,opacity:0.8}));
      bottle.position.set(-0.15,sh-0.22,0.05);bottle.rotation.z=0.3;group.add(bottle);
    }
    if(style.book){
      const book=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.02),new THREE.MeshStandardMaterial({color:0x6a3a2a,roughness:0.6}));
      book.position.set(-0.18,sh-0.18,0.04);group.add(book);
    }
    if(style.toolbelt){
      const tb=new THREE.Mesh(new THREE.BoxGeometry(0.36,0.025,0.36),new THREE.MeshStandardMaterial({color:0x5a4a3a,roughness:0.6}));
      tb.position.y=sh-0.28;group.add(tb);
      const wrench=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.06,0.015),new THREE.MeshStandardMaterial({color:0x888899,metalness:0.7}));
      wrench.position.set(0.14,sh-0.25,0.08);group.add(wrench);
    }
    if(style.acc==='cane'){
      const cane=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.01,0.45,5),new THREE.MeshStandardMaterial({color:0x6a5a3a,roughness:0.7}));
      cane.position.set(-0.18,sh-0.2,0.05);group.add(cane);
    }
    if(style.acc==='staff'){
      const staff=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.015,0.7,5),new THREE.MeshStandardMaterial({color:0x5a4a2a,roughness:0.8}));
      staff.position.set(-0.2,sh-0.05,0);group.add(staff);
      const gem=new THREE.Mesh(new THREE.SphereGeometry(0.025,6,6),new THREE.MeshStandardMaterial({color:0x44cc88,emissive:0x228844,emissiveIntensity:0.4}));
      gem.position.set(-0.2,sh+0.32,0);group.add(gem);
    }
    if(style.acc==='bag'){
      const bag=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.06,0.06),new THREE.MeshStandardMaterial({color:0x8a6a40,roughness:0.7}));
      bag.position.set(0.16,sh-0.2,0.04);bag.rotation.y=0.3;group.add(bag);
    }
    if(style.acc==='compass'){
      const comp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.01,8),new THREE.MeshStandardMaterial({color:0xddaa44,metalness:0.7,roughness:0.3}));
      comp.position.set(0.18,sh-0.15,0.05);comp.rotation.x=Math.PI/2;group.add(comp);
    }
    if(style.staff){
      const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.6,5),new THREE.MeshStandardMaterial({color:0x8a6a3a,roughness:0.7}));
      st.position.set(0.2,sh-0.05,0);group.add(st);
      const orb=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6),new THREE.MeshStandardMaterial({color:0xcc88ff,emissive:0x8844cc,emissiveIntensity:0.3}));
      orb.position.set(0.2,sh+0.28,0);group.add(orb);
    }
  }

  function createObjectMesh(n){
    const g=new THREE.Group();
    const id=n.id;
    const wood=0x6a4a2a,stone=0x7a7a7a,iron=0x5a5a6a,bone=0xddccaa,blood=0x882222;
    const darkWood=0x4a3018,lightWood=0x8a6a3a,moss=0x3a6a2a,paper=0xe8dcc0;
    const cloth=0xcc3333,glowBlue=0x4488cc,glowGreen=0x44aa66,glowPurple=0x8a44cc;
    if(id==='burn1'){
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.5,0.6),new THREE.MeshStandardMaterial({color:0x2a1a0a,roughness:0.9}));
      base.position.y=0.25;g.add(base);
      for(let i=0;i<3;i++){
        const post=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.6,5),new THREE.MeshStandardMaterial({color:0x1a0a00}));
        post.position.set((i-1)*0.3,0.3,0);g.add(post);
      }
      const roof=new THREE.Mesh(new THREE.ConeGeometry(0.45,0.3,4),new THREE.MeshStandardMaterial({color:0x2a1a0a}));
      roof.position.y=0.7;roof.rotation.y=Math.PI/4;g.add(roof);
      for(let i=0;i<4;i++){
        const ember=new THREE.Mesh(new THREE.SphereGeometry(0.015,4,4),new THREE.MeshStandardMaterial({color:0xff4400,emissive:0xff2200,emissiveIntensity:0.8}));
        ember.position.set((Math.random()-0.5)*0.4,0.1+Math.random()*0.3,(Math.random()-0.5)*0.3);g.add(ember);
      }
    } else if(id==='burn2'){
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.35,0.55),new THREE.MeshStandardMaterial({color:0x2a1a0a,roughness:0.9}));
      base.position.y=0.18;g.add(base);
      const wall1=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.3,0.04),new THREE.MeshStandardMaterial({color:0x3a2a1a}));
      wall1.position.set(0,0.35,-0.26);g.add(wall1);
      const wall2=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.25,0.5),new THREE.MeshStandardMaterial({color:0x3a2a1a}));
      wall2.position.set(-0.3,0.3,0);g.add(wall2);
      for(let i=0;i<3;i++){
        const plank=new THREE.Mesh(new THREE.BoxGeometry(0.15+Math.random()*0.2,0.03,0.04),new THREE.MeshStandardMaterial({color:0x2a1a0a}));
        plank.position.set((Math.random()-0.5)*0.3,0.05,(Math.random()-0.5)*0.3);plank.rotation.z=Math.random()*0.3;g.add(plank);
      }
    } else if(id==='arrows'){
      for(let i=0;i<5;i++){
        const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.2,4),new THREE.MeshStandardMaterial({color:lightWood}));
        shaft.rotation.z=Math.PI/2-0.1-Math.random()*0.4;shaft.rotation.y=Math.random()*Math.PI;
        shaft.position.set((Math.random()-0.5)*0.2,0.02,(Math.random()-0.5)*0.2);g.add(shaft);
        const tip=new THREE.Mesh(new THREE.ConeGeometry(0.012,0.03,3),new THREE.MeshStandardMaterial({color:iron}));
        tip.position.set(0.1,0,0);shaft.add(tip);
      }
    } else if(id==='tracks'){
      for(let i=0;i<6;i++){
        const pad=new THREE.Mesh(new THREE.SphereGeometry(0.02,5,4),new THREE.MeshStandardMaterial({color:0x3a3a3a}));
        pad.scale.y=0.2;pad.position.set((Math.random()-0.5)*0.3,0.01,(Math.random()-0.5)*0.4-i*0.08);g.add(pad);
      }
    } else if(id==='oil'){
      const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.13,0.3,8),new THREE.MeshStandardMaterial({color:0x4a3a2a,roughness:0.7}));
      barrel.position.y=0.15;g.add(barrel);
      for(let i=0;i<2;i++){
        const band=new THREE.Mesh(new THREE.TorusGeometry(0.125,0.008,4,12),new THREE.MeshStandardMaterial({color:iron,metalness:0.5}));
        band.position.y=0.08+i*0.14;band.rotation.x=Math.PI/2;g.add(band);
      }
      const spill=new THREE.Mesh(new THREE.CircleGeometry(0.15,8),new THREE.MeshStandardMaterial({color:0x2a2a1a,roughness:0.3}));
      spill.rotation.x=-Math.PI/2;spill.position.y=0.005;g.add(spill);
    } else if(id==='crest'){
      const shield=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.02,6),new THREE.MeshStandardMaterial({color:0xccaa22,metalness:0.6,roughness:0.3}));
      shield.position.y=0.5;shield.rotation.x=0.1;g.add(shield);
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.5,5),new THREE.MeshStandardMaterial({color:darkWood}));
      pole.position.y=0.25;g.add(pole);
      const crown=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.01,4,6),new THREE.MeshStandardMaterial({color:0xddaa22,metalness:0.7}));
      crown.position.y=0.52;crown.rotation.x=Math.PI/2;g.add(crown);
    } else if(id==='sign1'||id==='gsign'){
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.03,0.6,6),new THREE.MeshStandardMaterial({color:darkWood}));
      post.position.y=0.3;g.add(post);
      const board=new THREE.Mesh(new THREE.BoxGeometry(0.35,0.18,0.03),new THREE.MeshStandardMaterial({color:lightWood}));
      board.position.set(0,0.52,0.02);g.add(board);
      const bar=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.18,0.04),new THREE.MeshStandardMaterial({color:darkWood}));
      bar.position.set(0,0.52,0);g.add(bar);
    } else if(id==='chest1'||id==='gchest'||id==='dchest'){
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,0.22),new THREE.MeshStandardMaterial({color:0x8a6a2a,roughness:0.6}));
      base.position.y=0.09;g.add(base);
      const lid=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.1,0.24),new THREE.MeshStandardMaterial({color:0x9a7a3a,roughness:0.6}));
      lid.position.set(0,0.23,0);lid.rotation.z=-0.1;g.add(lid);
      const lock=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.04),new THREE.MeshStandardMaterial({color:0xddaa22,metalness:0.7}));
      lock.position.set(0,0.16,0.12);g.add(lock);
      for(let i=0;i<2;i++){
        const band=new THREE.Mesh(new THREE.BoxGeometry(0.31,0.02,0.01),new THREE.MeshStandardMaterial({color:iron,metalness:0.4}));
        band.position.set(0,0.05+i*0.12,0.11);g.add(band);
      }
    } else if(id==='well1'||id==='gwell'){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.03,8,12),new THREE.MeshStandardMaterial({color:stone,roughness:0.8}));
      ring.position.y=0.35;ring.rotation.x=Math.PI/2;g.add(ring);
      for(let i=0;i<8;i++){
        const angle=i/8*Math.PI*2;
        const brick=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.06,0.06),new THREE.MeshStandardMaterial({color:stone}));
        brick.position.set(Math.cos(angle)*0.2,0.2,Math.sin(angle)*0.2);g.add(brick);
      }
      const water=new THREE.Mesh(new THREE.CircleGeometry(0.17,10),new THREE.MeshStandardMaterial({color:0x2244aa,roughness:0.1,transparent:true,opacity:0.7}));
      water.rotation.x=-Math.PI/2;water.position.y=0.22;g.add(water);
      const roof=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.5,5),new THREE.MeshStandardMaterial({color:darkWood}));
      roof.position.set(0.18,0.55,0);g.add(roof);
    } else if(id==='banner'){
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.7,5),new THREE.MeshStandardMaterial({color:darkWood}));
      pole.position.y=0.35;g.add(pole);
      const flag=new THREE.Mesh(new THREE.PlaneGeometry(0.25,0.15),new THREE.MeshStandardMaterial({color:cloth,side:THREE.DoubleSide}));
      flag.position.set(0.12,0.6,0);g.add(flag);
    } else if(id==='camp'){
      for(let i=0;i<5;i++){
        const angle=i/5*Math.PI*2;
        const rock=new THREE.Mesh(new THREE.SphereGeometry(0.04,5,4),new THREE.MeshStandardMaterial({color:stone}));
        rock.scale.y=0.5;rock.position.set(Math.cos(angle)*0.15,0.03,Math.sin(angle)*0.15);g.add(rock);
      }
      for(let i=0;i<3;i++){
        const stick=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.005,0.15,4),new THREE.MeshStandardMaterial({color:darkWood}));
        stick.position.set((Math.random()-0.5)*0.06,0.04,(Math.random()-0.5)*0.06);
        stick.rotation.z=(Math.random()-0.5)*0.5;stick.rotation.x=(Math.random()-0.5)*0.5;g.add(stick);
      }
      const ash=new THREE.Mesh(new THREE.CircleGeometry(0.08,6),new THREE.MeshStandardMaterial({color:0x3a3a3a}));
      ash.rotation.x=-Math.PI/2;ash.position.y=0.01;g.add(ash);
    } else if(id==='stone'){
      const stele=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.5,0.08),new THREE.MeshStandardMaterial({color:stone,roughness:0.9}));
      stele.position.y=0.25;g.add(stele);
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.06,0.12),new THREE.MeshStandardMaterial({color:stone}));
      base.position.y=0.03;g.add(base);
      for(let i=0;i<3;i++){
        const rune=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.01),new THREE.MeshStandardMaterial({color:glowBlue,emissive:glowBlue,emissiveIntensity:0.4}));
        rune.position.set(0,0.15+i*0.12,0.045);g.add(rune);
      }
    } else if(id==='gpedestal'){
      const base=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.18,0.1,8),new THREE.MeshStandardMaterial({color:stone}));
      base.position.y=0.05;g.add(base);
      const col=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,0.35,8),new THREE.MeshStandardMaterial({color:stone}));
      col.position.y=0.22;g.add(col);
      const top=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.15,0.05,8),new THREE.MeshStandardMaterial({color:stone}));
      top.position.y=0.42;g.add(top);
    } else if(id==='groots'){
      for(let i=0;i<4;i++){
        const root=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.015,0.3+Math.random()*0.2,5),new THREE.MeshStandardMaterial({color:0x4a3a1a}));
        root.position.set((Math.random()-0.5)*0.3,0.1,(Math.random()-0.5)*0.3);
        root.rotation.z=(Math.random()-0.5)*0.8;root.rotation.x=(Math.random()-0.5)*0.8;g.add(root);
      }
    } else if(id==='altara'||id==='zaltar2'){
      const slab=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.06,0.25),new THREE.MeshStandardMaterial({color:stone,roughness:0.8}));
      slab.position.y=0.3;g.add(slab);
      for(let i=0;i<2;i++){
        const leg=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.28,0.08),new THREE.MeshStandardMaterial({color:stone}));
        leg.position.set((i-0.5)*0.28,0.14,0);g.add(leg);
      }
      const glow=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),new THREE.MeshStandardMaterial({color:glowPurple,emissive:glowPurple,emissiveIntensity:0.8}));
      glow.position.y=0.38;g.add(glow);
    } else if(id==='diary'||id==='clog'){
      const cover=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.02,0.1),new THREE.MeshStandardMaterial({color:0x6a3a1a}));
      cover.position.y=0.02;g.add(cover);
      const pages=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.025,0.08),new THREE.MeshStandardMaterial({color:paper}));
      pages.position.y=0.035;g.add(pages);
    } else if(id==='bloodstain'||id==='scrime'){
      const stain=new THREE.Mesh(new THREE.CircleGeometry(0.12,8),new THREE.MeshStandardMaterial({color:blood,roughness:0.6}));
      stain.rotation.x=-Math.PI/2;stain.position.y=0.005;g.add(stain);
      for(let i=0;i<3;i++){
        const drop=new THREE.Mesh(new THREE.CircleGeometry(0.03+Math.random()*0.03,6),new THREE.MeshStandardMaterial({color:blood}));
        drop.rotation.x=-Math.PI/2;drop.position.set((Math.random()-0.5)*0.15,0.006,(Math.random()-0.5)*0.15);g.add(drop);
      }
    } else if(id==='crystal'||id==='zshard'){
      const shard=new THREE.Mesh(new THREE.OctahedronGeometry(0.1,0),new THREE.MeshStandardMaterial({color:glowGreen,emissive:glowGreen,emissiveIntensity:0.5,transparent:true,opacity:0.85}));
      shard.position.y=0.2;shard.rotation.y=Math.PI/4;g.add(shard);
      const glow=new THREE.PointLight(0x44aa66,0.4,2);glow.position.y=0.2;g.add(glow);
    } else if(id==='rootmass'){
      for(let i=0;i<6;i++){
        const root=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.02,0.4+Math.random()*0.3,5),new THREE.MeshStandardMaterial({color:0x3a2a10,roughness:0.9}));
        root.position.set((Math.random()-0.5)*0.3,0.15,(Math.random()-0.5)*0.3);
        root.rotation.z=(Math.random()-0.5)*0.6;root.rotation.x=(Math.random()-0.5)*0.6;g.add(root);
      }
    } else if(id==='bcabin'){
      for(let i=0;i<4;i++){
        const px=(i<2?-1:1)*0.25,pz=(i%2===0?-1:1)*0.2;
        const post=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.5,5),new THREE.MeshStandardMaterial({color:darkWood}));
        post.position.set(px,0.25,pz);g.add(post);
      }
      const roof=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.03,0.5),new THREE.MeshStandardMaterial({color:0x4a3a1a}));
      roof.position.y=0.52;g.add(roof);
      const plank=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.2,0.03),new THREE.MeshStandardMaterial({color:darkWood}));
      plank.position.set(0,0.35,0.23);g.add(plank);
    } else if(id==='bbones'){
      for(let i=0;i<5;i++){
        const bone=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.008,0.1+Math.random()*0.08,4),new THREE.MeshStandardMaterial({color:bone}));
        bone.position.set((Math.random()-0.5)*0.15,0.02,(Math.random()-0.5)*0.15);
        bone.rotation.z=Math.random()*Math.PI;bone.rotation.x=Math.random()*0.3;g.add(bone);
      }
      const skull=new THREE.Mesh(new THREE.SphereGeometry(0.035,6,5),new THREE.MeshStandardMaterial({color:bone}));
      skull.position.set(0.05,0.04,0.02);g.add(skull);
    } else if(id==='bherbs'){
      for(let i=0;i<5;i++){
        const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.005,0.005,0.1+Math.random()*0.06,4),new THREE.MeshStandardMaterial({color:moss}));
        stem.position.set((Math.random()-0.5)*0.2,0.06,(Math.random()-0.5)*0.2);g.add(stem);
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(0.02,4,3),new THREE.MeshStandardMaterial({color:0x55aa44}));
        leaf.scale.y=0.5;leaf.position.y=0.05;stem.add(leaf);
      }
    } else if(id==='bdrawing'){
      const sheet=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.005,0.14),new THREE.MeshStandardMaterial({color:paper}));
      sheet.position.y=0.005;g.add(sheet);
      for(let i=0;i<4;i++){
        const crayon=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.003,0.01),new THREE.MeshStandardMaterial({color:[0xff4444,0x4444ff,0x44aa44,0xffaa22][i]}));
        crayon.position.set((Math.random()-0.5)*0.1,0.006,(Math.random()-0.5)*0.08);crayon.rotation.z=Math.random()*0.5;g.add(crayon);
      }
    } else if(id==='bgrave'){
      const mound=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,5),new THREE.MeshStandardMaterial({color:0x5a4a2a,roughness:0.9}));
      mound.scale.y=0.3;g.add(mound);
      const cross1=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.2,0.02),new THREE.MeshStandardMaterial({color:darkWood}));
      cross1.position.set(0,0.1,-0.1);g.add(cross1);
      const cross2=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.02,0.02),new THREE.MeshStandardMaterial({color:darkWood}));
      cross2.position.set(0,0.15,-0.1);g.add(cross2);
    } else if(id==='fthrone'||id==='zthrone2'){
      const seat=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.06,0.25),new THREE.MeshStandardMaterial({color:stone}));
      seat.position.y=0.3;g.add(seat);
      const back=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.45,0.06),new THREE.MeshStandardMaterial({color:stone}));
      back.position.set(0,0.52,-0.1);g.add(back);
      for(let i=0;i<2;i++){
        const arm=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.08,0.2),new THREE.MeshStandardMaterial({color:stone}));
        arm.position.set((i-0.5)*0.28,0.36,0);g.add(arm);
      }
    } else if(id==='fletter'||id==='sletter'){
      const letter=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.005,0.08),new THREE.MeshStandardMaterial({color:paper}));
      letter.position.y=0.01;letter.rotation.y=0.2;g.add(letter);
    } else if(id==='ffrozen'){
      for(let i=0;i<4;i++){
        const flower=new THREE.Mesh(new THREE.SphereGeometry(0.025,5,4),new THREE.MeshStandardMaterial({color:0xaaddff,transparent:true,opacity:0.7,emissive:0x6688aa,emissiveIntensity:0.2}));
        flower.position.set((Math.random()-0.5)*0.15,0.03,(Math.random()-0.5)*0.15);g.add(flower);
      }
    } else if(id==='sshadow'){
      const mark=new THREE.Mesh(new THREE.CircleGeometry(0.1,8),new THREE.MeshStandardMaterial({color:0x1a1a2a,transparent:true,opacity:0.4}));
      mark.rotation.x=-Math.PI/2;mark.position.y=0.005;g.add(mark);
    } else if(id==='sdagger'){
      const blade=new THREE.Mesh(new THREE.BoxGeometry(0.015,0.15,0.005),new THREE.MeshStandardMaterial({color:0xaaaacc,metalness:0.8}));
      blade.position.y=0.1;blade.rotation.z=0.15;g.add(blade);
      const hilt=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.02,0.02),new THREE.MeshStandardMaterial({color:darkWood}));
      hilt.position.y=0.02;g.add(hilt);
    } else if(id==='cmark'){
      const slab=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.04),new THREE.MeshStandardMaterial({color:stone}));
      slab.position.y=0.3;slab.rotation.x=-0.1;g.add(slab);
      const mark=new THREE.Mesh(new THREE.TorusGeometry(0.08,0.008,4,8),new THREE.MeshStandardMaterial({color:glowPurple,emissive:glowPurple,emissiveIntensity:0.3}));
      mark.position.set(0,0.3,0.025);g.add(mark);
    } else if(id==='cstar'){
      const chart=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.005,0.15),new THREE.MeshStandardMaterial({color:0x1a1a3a}));
      chart.position.y=0.01;g.add(chart);
      for(let i=0;i<6;i++){
        const star=new THREE.Mesh(new THREE.SphereGeometry(0.008,4,4),new THREE.MeshStandardMaterial({color:0xffffaa,emissive:0xffffaa,emissiveIntensity:0.8}));
        star.position.set((Math.random()-0.5)*0.15,0.02,(Math.random()-0.5)*0.1);g.add(star);
      }
    } else if(id==='xengine'){
      const core=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.15,8),new THREE.MeshStandardMaterial({color:iron,metalness:0.6}));
      core.position.y=0.15;g.add(core);
      for(let i=0;i<3;i++){
        const gear=new THREE.Mesh(new THREE.TorusGeometry(0.08+Math.random()*0.04,0.01,4,8),new THREE.MeshStandardMaterial({color:0x666688,metalness:0.5}));
        gear.position.y=0.1+i*0.06;gear.rotation.x=Math.PI/2;gear.rotation.z=Math.random()*Math.PI;g.add(gear);
      }
    } else if(id==='xgravity'){
      const stone2=new THREE.Mesh(new THREE.DodecahedronGeometry(0.1,0),new THREE.MeshStandardMaterial({color:glowPurple,emissive:glowPurple,emissiveIntensity:0.4,transparent:true,opacity:0.8}));
      stone2.position.y=0.25;g.add(stone2);
      const glow2=new THREE.PointLight(0x8a44cc,0.3,2);glow2.position.y=0.25;g.add(glow2);
    } else if(id==='xblueprint'){
      const bp=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.005,0.16),new THREE.MeshStandardMaterial({color:0x1a2a5a}));
      bp.position.y=0.01;g.add(bp);
      for(let i=0;i<3;i++){
        const line=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.003,0.003),new THREE.MeshStandardMaterial({color:0xaabbdd}));
        line.position.set(0,0.015,(i-1)*0.04);g.add(line);
      }
    } else if(id==='dungeon'){
      const hole=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.05,10),new THREE.MeshStandardMaterial({color:0x1a1a1a}));
      hole.position.y=0.005;g.add(hole);
      for(let i=0;i<8;i++){
        const angle=i/8*Math.PI*2;
        const sBrick=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.08,0.06),new THREE.MeshStandardMaterial({color:stone}));
        sBrick.position.set(Math.cos(angle)*0.22,0.04,Math.sin(angle)*0.22);g.add(sBrick);
      }
      const glow3=new THREE.PointLight(0x4466aa,0.3,2);glow3.position.y=-0.1;g.add(glow3);
    } else if(id==='ladder'){
      for(let i=0;i<2;i++){
        const rail=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.6,5),new THREE.MeshStandardMaterial({color:darkWood}));
        rail.position.set((i-0.5)*0.15,0.3,0);g.add(rail);
      }
      for(let i=0;i<4;i++){
        const rung=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.15,4),new THREE.MeshStandardMaterial({color:lightWood}));
        rung.rotation.z=Math.PI/2;rung.position.set(0,0.08+i*0.12,0);g.add(rung);
      }
    } else {
      const marker=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),new THREE.MeshStandardMaterial({color:0xddaa22,emissive:0xaa8800,emissiveIntensity:0.3}));
      marker.position.y=0.15;g.add(marker);
    }
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(0.15,10),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.2,depthWrite:false}));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=0.01;g.add(shadow);
    const label=document.createElement('div');
    label.style.cssText='position:absolute;text-align:center;pointer-events:none;transition:opacity 0.2s;font-family:monospace;';
    const bg=document.createElement('div');
    bg.style.cssText='background:rgba(0,0,0,0.55);border-radius:4px;padding:2px 8px;display:inline-block;';
    const txt=document.createElement('div');
    txt.style.cssText='color:#ffffff;font-size:9px;';
    bg.appendChild(txt);label.appendChild(bg);
    labelContainer.appendChild(label);
    return{group:g,body:null,head:null,label:label,style:{},isObject:true};
  }

  function createNPCMesh(n){
    if(n.tp)return createObjectMesh(n);
    const style=getNPCStyle(n.id);
    const group=new THREE.Group();
    const skin=style?style.skin:0xf0c8a0;
    const bodyColor=style?style.body:0x888888;
    const h=style?style.h:0.82;
    const isGhost=!!(style&&style.transparent);
    const bodyMat=new THREE.MeshStandardMaterial({color:bodyColor,roughness:0.6,transparent:isGhost,opacity:isGhost?0.55:1});
    if(isGhost&&style.glow){bodyMat.emissive=style.glow;bodyMat.emissiveIntensity=0.3;}
    const bodyH=style&&style.big?0.3:style&&style.muscular?0.28:0.26;
    const bodyW=style&&style.muscular?0.34:0.3;
    const bodyR=style&&style.muscular?0.17:0.15;
    const body=new THREE.Mesh(new THREE.CylinderGeometry(bodyR*0.8,bodyR,bodyH,10),bodyMat);
    body.position.y=h*0.54;body.castShadow=!isGhost;body.name='body';group.add(body);
    if(style&&style.cloak){
      const cMat=new THREE.MeshStandardMaterial({color:style.cloak,roughness:0.8,side:THREE.DoubleSide,transparent:isGhost,opacity:isGhost?0.5:1});
      const cape=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.35,0.015),cMat);
      cape.position.set(0,h*0.6,-0.14);group.add(cape);
    }
    if(style&&style.robe){
      const rMat=new THREE.MeshStandardMaterial({color:style.robe,roughness:0.7,transparent:isGhost,opacity:isGhost?0.5:1});
      const robe=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.2,0.35,8),rMat);
      robe.position.y=h*0.28;group.add(robe);
    }
    if(style&&style.vest){
      const vMat=new THREE.MeshStandardMaterial({color:style.vest,roughness:0.6});
      const vest=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.18,0.18,8),vMat);
      vest.position.y=h*0.65;group.add(vest);
    }
    if(style&&style.apron){
      const aMat=new THREE.MeshStandardMaterial({color:style.apron,roughness:0.7});
      const apron=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.16,0.2,8),aMat);
      apron.position.set(0,h*0.5,0.01);group.add(apron);
    }
    if(style&&style.armor){
      const arMat=new THREE.MeshStandardMaterial({color:style.armor,roughness:0.3,metalness:0.5});
      const chest=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.17,0.24,8),arMat);
      chest.position.y=h*0.55;group.add(chest);
      const paulL=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),arMat);
      paulL.position.set(-0.2,h*0.75,0);group.add(paulL);
      const paulR=paulL.clone();paulR.position.set(0.2,h*0.75,0);group.add(paulR);
    }
    if(style&&style.maid){
      const mApt=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.16,0.16,8),new THREE.MeshStandardMaterial({color:0xeeeeee,roughness:0.7}));
      mApt.position.set(0,h*0.45,0.01);group.add(mApt);
    }
    if(style&&style.fur){
      const fur=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.17,0.22,8),new THREE.MeshStandardMaterial({color:0x6a5a4a,roughness:0.9}));
      fur.position.y=h*0.55;group.add(fur);
    }
    if(style&&style.tattered){
      for(let i=0;i<2;i++){
        const rip=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.06,0.02),bodyMat);
        rip.position.set((i-0.5)*0.12,h*0.4,0.04);group.add(rip);
      }
    }
    if(style&&style.veil){
      const vMat=new THREE.MeshStandardMaterial({color:style.veil,roughness:0.6,transparent:true,opacity:0.7});
      const veil=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.15,0.02),vMat);
      veil.position.set(0,h*0.75,0.04);group.add(veil);
    }
    if(style&&style.cape){
      const cpMat=new THREE.MeshStandardMaterial({color:style.cape,roughness:0.7,side:THREE.DoubleSide});
      const cape=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.4,0.015),cpMat);
      cape.position.set(0,h*0.6,-0.14);group.add(cape);
    }
    if(style&&style.eyepatch){
      const ep=new THREE.Mesh(new THREE.CircleGeometry(0.02,6),new THREE.MeshStandardMaterial({color:0x1a1a1a}));
      ep.position.set(0.05,h*0.92,0.14);ep.rotation.y=0.1;group.add(ep);
    }
    if(style&&style.scar){
      const scar=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.003,0.01),new THREE.MeshStandardMaterial({color:0xcc8888}));
      scar.position.set(0.04,h*0.92,0.14);scar.rotation.z=0.3;group.add(scar);
    }
    const skinMat=new THREE.MeshStandardMaterial({color:skin,roughness:0.7,transparent:isGhost,opacity:isGhost?0.55:1});
    const head=new THREE.Mesh(new THREE.SphereGeometry(0.14,10,8),skinMat);
    head.position.y=h*0.92;head.castShadow=!isGhost;head.name='head';group.add(head);
    const eMat=new THREE.MeshStandardMaterial({color:0xffffff,transparent:isGhost,opacity:isGhost?0.5:1});
    const eyeL=new THREE.Mesh(new THREE.SphereGeometry(0.022,5,5),eMat);
    eyeL.position.set(-0.045,h*0.93,0.12);group.add(eyeL);
    const eyeR=eyeL.clone();eyeR.position.set(0.045,h*0.93,0.12);group.add(eyeR);
    if(!isGhost){
      const pMat=new THREE.MeshStandardMaterial({color:style&&style.hair?0x1a1a2a:0x2244aa});
      const pL=new THREE.Mesh(new THREE.SphereGeometry(0.012,4,4),pMat);
      pL.position.set(-0.045,h*0.93,0.135);group.add(pL);
      const pR=pL.clone();pR.position.set(0.045,h*0.93,0.135);group.add(pR);
    }
    if(style)buildHair(style,group,h*0.92);
    const legMat=new THREE.MeshStandardMaterial({color:isGhost?bodyColor:0x4a4a5a,roughness:0.8,transparent:isGhost,opacity:isGhost?0.45:1});
    const legL=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.04,0.26,8),legMat);
    legL.position.set(-0.065,h*0.14,0);legL.name='legL';group.add(legL);
    const legR=legL.clone();legR.position.set(0.065,h*0.14,0);legR.name='legR';group.add(legR);
    if(style)buildAccessory(style,group,h);
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(isGhost?0.15:0.18,10),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:isGhost?0.1:0.2,depthWrite:false}));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=0.01;group.add(shadow);
    group.position.set(n.x*TS,0,n.y*TS);
    const label=document.createElement('div');
    label.style.cssText='position:absolute;text-align:center;pointer-events:none;transition:opacity 0.2s;font-family:monospace;';
    const bg=document.createElement('div');
    bg.style.cssText='background:rgba(0,0,0,0.55);border-radius:4px;padding:2px 8px;display:inline-block;';
    const txt=document.createElement('div');
    txt.style.cssText='color:#ffffff;font-size:9px;';
    bg.appendChild(txt);label.appendChild(bg);
    labelContainer.appendChild(label);
    return{group,body,head,label:label,style:style||{}};
  }

  function updateNPCLabel(n,group,isNearest){
    const m=npcMeshes[n.id];
    if(!m||!m.label)return;
    const pos=new THREE.Vector3(group.position.x,1.2,group.position.z);
    pos.project(camera);
    const x2=(pos.x*0.5+0.5)*window.innerWidth;
    const y2=(-pos.y*0.5+0.5)*window.innerHeight;
    m.label.style.left=x2+'px';m.label.style.top=y2+'px';
    m.label.style.transform='translate(-50%,-100%)';
    m.label.style.opacity=pos.z<1?'1':'0';
    m.label.querySelector('div div').textContent=isNearest?'[E] '+n.nm:n.nm;
    if(isNearest){
      m.label.querySelector('div').style.background='rgba(0,0,0,0.65)';
      m.label.querySelector('div div').style.color='#ffcc44';
      m.label.querySelector('div div').style.fontWeight='bold';
      m.label.querySelector('div div').style.fontSize='11px';
    }else{
      m.label.querySelector('div').style.background='rgba(0,0,0,0.55)';
      m.label.querySelector('div div').style.color='#ffffff';
      m.label.querySelector('div div').style.fontWeight='normal';
      m.label.querySelector('div div').style.fontSize='9px';
    }
  }

  function updateObjs(objs,nearestObj,eyeOn){
    const activeIds=new Set();
    (objs||[]).forEach(o=>{
      activeIds.add(o.id);
      if(!objMeshes[o.id]){
        const result=createObjectMesh(o);
        entityGroup.add(result.group);
        result.group.position.set(o.x*TS,0,o.y*TS);
        objMeshes[o.id]={mesh:result.group,label:result.label};
      }
      const m=objMeshes[o.id];
      m.mesh.position.y=Math.sin(Date.now()*0.003+o.x*5)*0.05;
      const isNearest=nearestObj&&nearestObj.id===o.id;
      const pos=new THREE.Vector3(o.x*TS,0.6,o.y*TS);
      pos.project(camera);
      const x2=(pos.x*0.5+0.5)*window.innerWidth;
      const y2=(-pos.y*0.5+0.5)*window.innerHeight;
      m.label.style.left=x2+'px';m.label.style.top=y2+'px';
      m.label.style.transform='translate(-50%,-100%)';
      m.label.style.opacity=(pos.z<1)?'1':'0';
      m.label.querySelector('div div').textContent=isNearest?'[E] '+o.nm:'';
      if(isNearest){
        m.label.querySelector('div div').style.color='#ffcc44';
        m.label.querySelector('div').style.background='rgba(0,0,0,0.6)';
      }
      if(eyeOn&&o.evid){
        m.mesh.traverse(child=>{if(child.material&&child.material.emissive){child.material.emissive.setHex(0xffaa00);child.material.emissiveIntensity=0.8+Math.sin(Date.now()*0.005)*0.4;}});
      } else {
        m.mesh.traverse(child=>{if(child.material&&child.material.emissive){child.material.emissiveIntensity=child.material.userData?child.material.userData.origEmissive||0.2:0.2;}});
      }
    });
    Object.keys(objMeshes).forEach(id=>{
      if(!activeIds.has(id)){
        entityGroup.remove(objMeshes[id].mesh);
        if(objMeshes[id].label.parentNode)objMeshes[id].label.parentNode.removeChild(objMeshes[id].label);
        delete objMeshes[id];
      }
    });
  }

  let camSnapped=false;
  let camLookX=0,camLookZ=0;
  function resetCamSnap(){camSnapped=false;camLookX=0;camLookZ=0;}
  function setCamera(px,py,angle){
    if(!camera)return;
    const dist=10;const height=7.5;
    const a=(angle||0);
    const camX=px*TS+Math.sin(a)*dist;
    const camZ=py*TS+Math.cos(a)*dist;
    const lookX=px*TS;const lookZ=py*TS;
    if(!camSnapped){
      camera.position.set(camX,height,camZ);
      camLookX=lookX;camLookZ=lookZ;
      camSnapped=true;
    }else{
      const spd=0.15;
      camera.position.x+=(camX-camera.position.x)*spd;
      camera.position.z+=(camZ-camera.position.z)*spd;
      camera.position.y+=(height-camera.position.y)*spd;
      camLookX+=(lookX-camLookX)*spd;
      camLookZ+=(lookZ-camLookZ)*spd;
    }
    camera.lookAt(camLookX,0.5,camLookZ);
  }

  function parseColor(str){
    const m=str.match(/(\d+)/g);
    if(m&&m.length>=3)return(new THREE.Color(+m[0]/255,+m[1]/255,+m[2]/255)).getHex();
    return 0xffffff;
  }

  function updateParticles(reg){
    const cfg=REGION_PARTICLES[reg];
    if(!cfg)return;
    while(particleGroup.children.length<cfg.count){
      const size=cfg.sizeMin+Math.random()*(cfg.sizeMax-cfg.sizeMin);
      const geo2=new THREE.SphereGeometry(size*0.01,4,4);
      const col=parseColor(cfg.color);
      const mat2=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.5});
      const p=new THREE.Mesh(geo2,mat2);
      p.position.set((Math.random()-0.5)*30,1+Math.random()*4,(Math.random()-0.5)*30);
      p.userData={vx:0,vy:0,type:cfg.type,cfg:cfg};
      particleGroup.add(p);
    }
    const t=Date.now()*0.001;
    particleGroup.children.forEach((p,i)=>{
      const d=p.userData;
      switch(d.type){
        case'fireflies':p.position.x+=Math.sin(t+i*0.7)*0.01;p.position.z+=Math.cos(t*0.8+i)*0.008;break;
        case'leaves':p.position.x+=d.cfg.speed*0.01+Math.sin(t+i)*0.005;p.position.z+=Math.cos(t*0.5+i)*0.003;break;
        case'mist':p.position.x+=d.cfg.speed*0.005;p.position.y+=Math.sin(t*0.3+i*0.5)*0.002;break;
        case'snow':p.position.x+=Math.sin(t+i)*0.003;p.position.y-=d.cfg.speed*0.005;break;
        case'sand':p.position.x+=d.cfg.speed*0.008;p.position.z+=Math.sin(t*2+i)*0.002;break;
        case'embers':p.position.x+=Math.sin(t*1.5+i)*0.004;p.position.y+=d.cfg.speed*0.003;break;
        case'crystals':p.scale.setScalar(0.8+Math.abs(Math.sin(t+i))*0.5);break;
        case'dark':p.position.x+=Math.sin(t+i)*0.006;p.position.z+=Math.cos(t+i)*0.004;break;
      }
      if(p.position.x>20)p.position.x=-20;if(p.position.x<-20)p.position.x=20;
      if(p.position.z>20)p.position.z=-20;if(p.position.z<-20)p.position.z=20;
      p.material.opacity=0.3+Math.sin(t+i)*0.2;
    });
  }

  function updateWater(){
    const t=Date.now()*0.001;
    tileGroup.children.forEach(child=>{
      if(child.userData&&child.userData.type==='water'){
        child.position.y=child.userData.origY+Math.sin(t*2+child.position.x*2+child.position.z*3)*0.02;
      }
      if(child.userData&&child.userData.type==='torch'&&child.children){
        const flame=child.children[1];
        if(flame){flame.scale.setScalar(0.8+Math.sin(t*8+child.position.x)*0.3);flame.position.y=0.55+Math.sin(t*6)*0.01;}
        const core=child.children[2];
        if(core){core.scale.setScalar(0.7+Math.sin(t*10+child.position.x)*0.3);}
      }
    });
  }

  function updatePointLights(){
    const t=Date.now()*0.001;
    pointLights.forEach((pl,i)=>{
      pl.intensity=pl.intensity>0.5?
        (0.5+Math.sin(t*4+i*2)*0.15):
        (0.3+Math.sin(t*3+i*1.5)*0.1);
    });
  }

  function eyeOfTruth(on){
    if(!eyeOverlay){
      eyeOverlay=document.createElement('div');
      eyeOverlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:30;display:none;';
      const pulse=document.createElement('div');
      pulse.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,200,50,0.04);';
      eyeOverlay.appendChild(pulse);
      const sweep=document.createElement('div');
      sweep.style.cssText='position:absolute;top:0;width:120px;height:100%;background:linear-gradient(90deg,rgba(255,220,80,0),rgba(255,220,80,0.06),rgba(255,220,80,0));';
      eyeOverlay.appendChild(sweep);
      document.body.appendChild(eyeOverlay);
    }
    eyeOverlay.style.display=on?'block':'none';
  }

  function animateEyeOverlay(){
    if(eyeOverlay&&eyeOverlay.style.display==='block'){
      const sweep=eyeOverlay.children[1];
      if(sweep){const x=(Date.now()*0.15)%(window.innerWidth+200)-100;sweep.style.left=x+'px';}
    }
  }

  function shake(intensity){
    if(!container)return;
    const ox=(Math.random()-0.5)*intensity;
    const oy=(Math.random()-0.5)*intensity;
    container.style.transform='translate('+ox+'px,'+oy+'px)';
  }

  function clearShake(){
    if(container)container.style.transform='';
  }

  function render(){
    if(!renderer||!scene||!camera)return;
    updateWater();
    updatePointLights();
    animateEyeOverlay();
    renderer.render(scene,camera);
  }

  function reset(){
    clearMap();
    Object.keys(npcMeshes).forEach(id=>{
      entityGroup.remove(npcMeshes[id].group);
      if(npcMeshes[id].label&&npcMeshes[id].label.parentNode)npcMeshes[id].label.parentNode.removeChild(npcMeshes[id].label);
    });
    npcMeshes={};
    Object.keys(objMeshes).forEach(id=>{
      entityGroup.remove(objMeshes[id].mesh);
      if(objMeshes[id].label.parentNode)objMeshes[id].label.parentNode.removeChild(objMeshes[id].label);
    });
    objMeshes={};
    lastMapKey=null;
  }

  function getRendererEl(){return renderer?renderer.domElement:null;}

  return{
    init,buildMap,clearMap,updatePlayer,updateNPCs,updateObjs,
    setCamera,setRegion,updateParticles,eyeOfTruth,shake,clearShake,render,
    onResize,reset,getRendererEl,resetCamSnap
  };
})();
