const T=32,CW=40,CH=25;
const IW=48,IH=24;
const TILE_H={3:16,4:14,6:14,14:8,15:3,30:10,31:8,32:14,35:10,7:4,8:6,12:6,29:8,33:4,34:6,26:12,10:2,25:2,11:3,24:6};
const MAX_TH=16;
const TL={GRASS:0,PATH:1,WATER:2,WALL:3,TREE:4,FLOOR:5,WTOP:6,DOOR:7,CHEST:8,BRIDGE:9,STAIRS:10,SHOP:11,SIGN:12,FLOWER:13,ROCK:14,BRAMBLE:15,DGRASS:16,LAVA:17,ICE:18,SAND:19,SNOW:20,CARPET:21,ALTAR:22,BLOOD:23,CHESTO:24,LADDER:25,CRYSTAL:26,MOSS:27,RUINS:28,GRAVE:29,WELL:30,FENCE:31,STATUE:32,TORCH:33,FLAG:34,BARREL:35};
const TC={0:'#2d5a1e',1:'#8b7355',2:'#1a4a7a',3:'#4a4a5a',4:'#1a4a1a',5:'#6a5a4a',6:'#5a5a6a',7:'#8b6914',8:'#c8a020',9:'#6a5a4a',10:'#5a4a3a',11:'#a08040',12:'#999',13:'#aa6aaa',14:'#7a7a7a',15:'#3a5a2a',16:'#1a4a1a',17:'#8b2500',18:'#aaccee',19:'#d4b87a',20:'#dde8f0',21:'#6a2a2a',22:'#c8a040',23:'#6a1a1a',24:'#c8a020',25:'#5a4a3a',26:'#8a6acd',27:'#1a5a3a',28:'#6a6a7a',29:'#5a5a5a',30:'#4a4a5a',31:'#6a5a3a',32:'#8a8a9a',33:'#ff8800',34:'#cc3333',35:'#8b6914'};
const SOL=new Set([3,4,6,14,15,17,30,31,32,35]);

const SP={};
const TILE_CANVAS={};

function tileHash(c,r){
  let h=Math.sin(c*127.1+r*311.7)*43758.5453;
  return h-Math.floor(h);
}

function drawTileTextures(){
  const CW2=IW,CH2=IH+MAX_TH;
  function hexToRgb(h){if(h&&h.startsWith('rgba')){const m=h.match(/[\d.]+/g);return[m?+m[0]:0,m?+m[1]:0,m?+m[2]:0];}const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return[r,g,b];}
  function rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
  function shade(hex,f){const[r,g,b]=hexToRgb(hex);return rgbToHex(r*f,g*f,b*f);}
  function lighter(hex,f){const[r,g,b]=hexToRgb(hex);return rgbToHex(r+(255-r)*f,g+(255-g)*f,b+(255-b)*f);}
  function diamondPath(c,ox,oy,w,h){
    c.beginPath();c.moveTo(ox+w/2,oy);c.lineTo(ox+w,oy+h/2);c.lineTo(ox+w/2,oy+h);c.lineTo(ox,oy+h/2);c.closePath();
  }
  function sideFaces(c,ox,oy,w,h,col,th){
    if(th<=0)return;
    const dk=shade(col,0.55),dk2=shade(col,0.38);
    c.fillStyle=dk2;c.beginPath();c.moveTo(ox,oy+h/2);c.lineTo(ox+w/2,oy+h);c.lineTo(ox+w/2,oy+h+th);c.lineTo(ox,oy+h/2+th);c.closePath();c.fill();
    c.fillStyle=dk;c.beginPath();c.moveTo(ox+w,oy+h/2);c.lineTo(ox+w/2,oy+h);c.lineTo(ox+w/2,oy+h+th);c.lineTo(ox+w,oy+h/2+th);c.closePath();c.fill();
    c.strokeStyle=shade(col,0.3);c.lineWidth=0.5;
    c.beginPath();c.moveTo(ox,oy+h/2);c.lineTo(ox,oy+h/2+th);c.stroke();
    c.beginPath();c.moveTo(ox+w,oy+h/2);c.lineTo(ox+w,oy+h/2+th);c.stroke();
    c.beginPath();c.moveTo(ox+w/2,oy+h);c.lineTo(ox+w/2,oy+h+th);c.stroke();
  }
  function noise1(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);}
  function noise2(x,y,s){let v=0,a=1,f=1;for(let i=0;i<4;i++){v+=noise1(x*f,y*f)*a;a*=0.5;f*=2;}return v;}
  const types=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
  types.forEach(id=>{
    const cv=document.createElement('canvas');cv.width=CW2;cv.height=CH2;
    const c=cv.getContext('2d');
    const bc=TC[id]||'#222';
    const th=TILE_H[id]||0;
    const ox=0,oy=0;
    switch(id){
      case 0:{
        const g=c.createLinearGradient(ox,oy,ox+CW2,oy+CH2);
        g.addColorStop(0,shade(bc,0.88));g.addColorStop(0.3,shade(bc,0.95));g.addColorStop(0.7,bc);g.addColorStop(1,shade(bc,0.82));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<14;i++){
          const hx=ox+IW*0.1+noise1(id*7+i,0)*IW*0.8;
          const hy=oy+IH*0.15+noise1(0,id*3+i)*IH*0.7;
          const gh=noise1(i,id)>0.5?shade(bc,0.75):lighter(bc,0.18);
          c.fillStyle=gh;
          const gw=1+noise1(i+20,id)*1.5;
          const gh2=2+noise1(i+50,id)*5;
          c.fillRect(hx,hy,gw,gh2);
          if(noise1(i+100,id)>0.6){c.fillStyle=lighter(bc,0.3);c.fillRect(hx,hy,gw*0.5,1);}
        }
        for(let i=0;i<5;i++){
          const fx=ox+IW*0.15+noise1(id+i,100)*IW*0.7;
          const fy=oy+IH*0.2+noise1(100,id+i)*IH*0.6;
          c.fillStyle=lighter(bc,0.25);
          c.beginPath();c.arc(fx,fy,0.8+noise1(i+80,id)*1,0,Math.PI*2);c.fill();
        }
        for(let i=0;i<2;i++){
          c.strokeStyle=lighter(bc,0.12);c.lineWidth=0.3;
          const fx=ox+IW*0.2+noise1(id+i+5,200)*IW*0.6;
          const fy=oy+IH*0.3+noise1(200,id+i+5)*IH*0.4;
          c.beginPath();c.moveTo(fx,fy);c.lineTo(fx+1.5,fy-2);c.stroke();
        }
        break;}
      case 1:{
        const g=c.createLinearGradient(ox,oy,ox+CW2,oy+CH2);
        g.addColorStop(0,lighter(bc,0.08));g.addColorStop(0.5,bc);g.addColorStop(1,shade(bc,0.92));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let row=0;row<4;row++){
          const yy=oy+IH*0.1+row*IH*0.22;
          const off=row%2===1?IW*0.06:0;
          for(let col=0;col<4;col++){
            const bx=ox+off+col*IW*0.24+noise1(col,row+id)*2;
            c.fillStyle=shade(bc,0.85+noise1(col,row)*0.15);
            c.fillRect(bx,yy,IW*0.2,IH*0.18);
            c.strokeStyle=shade(bc,0.65);c.lineWidth=0.3;
            c.strokeRect(bx,yy,IW*0.2,IH*0.18);
          }
        }
        c.fillStyle=lighter(bc,0.05);c.fillRect(ox+IW*0.05,oy+IH*0.48,IW*0.9,IH*0.04);
        break;}
      case 2:{
        const g=c.createLinearGradient(ox,oy+IH*0.2,ox+IW*0.3,oy+IH);
        g.addColorStop(0,lighter(bc,0.2));g.addColorStop(0.4,bc);g.addColorStop(1,shade(bc,0.75));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<5;i++){
          c.strokeStyle=`rgba(120,200,255,${0.15+noise1(i,3)*0.1})`;c.lineWidth=0.8;
          const wy=oy+IH*0.2+i*IH*0.15+noise1(i,2)*IH*0.1;
          const wx=IW*0.15+noise1(i,4)*IW*0.1;
          c.beginPath();
          c.moveTo(ox+wx,wy);
          c.bezierCurveTo(ox+IW*0.3,wy-2+noise1(i,5)*5,ox+IW*0.6,wy+1+noise1(i,6)*3,ox+IW*0.85-wx,wy);
          c.stroke();
        }
        c.fillStyle='rgba(180,230,255,0.08)';c.beginPath();c.ellipse(ox+IW*0.4,oy+IH*0.4,IW*0.15,IH*0.15,0,0,Math.PI*2);c.fill();
        break;}
      case 3:{
        c.fillStyle=bc;diamondPath(c,ox,oy,IW,IH);c.fill();
        const wg=c.createLinearGradient(ox+IW*0.2,oy,ox+IW*0.8,oy+IH);
        wg.addColorStop(0,lighter(bc,0.15));wg.addColorStop(0.5,bc);wg.addColorStop(1,shade(bc,0.85));
        c.fillStyle=wg;c.beginPath();
        c.moveTo(ox+IW*0.15,oy+IH*0.15);c.lineTo(ox+IW*0.85,oy+IH*0.15);c.lineTo(ox+IW*0.75,oy+IH*0.35);c.lineTo(ox+IW*0.25,oy+IH*0.35);c.closePath();c.fill();
        c.strokeStyle=shade(bc,0.55);c.lineWidth=0.4;
        for(let row=0;row<4;row++){
          const by=oy+IH*0.12+row*IH*0.06;
          c.beginPath();c.moveTo(ox+IW*0.12,by);c.lineTo(ox+IW*0.88,by);c.stroke();
        }
        c.fillStyle=shade(bc,0.7);
        for(let i=0;i<3;i++){
          const bx=ox+IW*0.2+i*IW*0.2;
          c.fillRect(bx,oy+IH*0.15,IW*0.14,IH*0.06);
        }
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 4:{
        c.fillStyle=shade(bc,0.7);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.55);c.fillRect(ox+IW*0.44,oy+IH*0.5,IW*0.12,th*0.5);
        c.fillStyle=shade(bc,0.65);c.fillRect(ox+IW*0.42,oy+IH*0.55,IW*0.16,th*0.35);
        const cols=[shade(bc,0.75),bc,lighter(bc,0.08),lighter(bc,0.15),shade(bc,0.6)];
        for(let layer=0;layer<3;layer++){
          const ly=oy+IH*0.05+layer*IH*0.12;
          const lr=IW*0.28+layer*IW*0.06;
          for(let i=0;i<5;i++){
            const a=(i/5)*Math.PI*2+layer*0.5;
            const fx=ox+IW*0.5+Math.cos(a)*lr*0.6;
            const fy=ly+IH*0.15+Math.sin(a)*lr*0.3;
            c.fillStyle=cols[(i+layer)%cols.length];
            c.beginPath();c.ellipse(fx,fy,3+noise1(i+layer*5,id)*3,2+noise1(i+layer*5,id+1)*2,0,0,Math.PI*2);c.fill();
          }
        }
        c.fillStyle=lighter(bc,0.12);
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.15,IW*0.18,IH*0.12,0,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(200,255,200,0.06)';c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.2,IW*0.22,IH*0.1,0,0,Math.PI*2);c.fill();
        sideFaces(c,ox,oy,IW,IH,shade(bc,0.6),th);
        break;}
      case 5:{
        const g=c.createLinearGradient(ox,oy,ox+IW,oy);
        g.addColorStop(0,shade(bc,0.92));g.addColorStop(0.3,lighter(bc,0.04));g.addColorStop(0.7,bc);g.addColorStop(1,shade(bc,0.88));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=shade(bc,0.72);c.lineWidth=0.4;
        for(let i=0;i<5;i++){
          const lx=ox+IW*0.08+i*IW*0.18;
          c.beginPath();c.moveTo(lx,oy+IH*0.12);c.lineTo(lx+IW*0.02,oy+IH*0.88);c.stroke();
        }
        c.strokeStyle=shade(bc,0.65);c.lineWidth=0.3;
        for(let i=0;i<4;i++){
          const ly=oy+IH*0.15+i*IH*0.22;
          c.beginPath();c.moveTo(ox+IW*0.08,ly);c.lineTo(ox+IW*0.92,ly);c.stroke();
        }
        break;}
      case 6:{
        c.fillStyle=lighter(bc,0.06);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=shade(bc,0.55);c.lineWidth=0.4;
        for(let r=0;r<3;r++)for(let col=0;col<3;col++){
          const bx=ox+IW*0.08+col*IW*0.28;const by=oy+IH*0.08+r*IH*0.28;
          c.strokeRect(bx,by,IW*0.25,IH*0.25);
          c.fillStyle=shade(bc,0.92);c.fillRect(bx+1,by+1,IW*0.22,IH*0.05);
        }
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 7:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        const dg=c.createLinearGradient(ox+IW*0.25,oy+IH*0.15,ox+IW*0.75,oy+IH*0.7);
        dg.addColorStop(0,lighter(bc,0.2));dg.addColorStop(1,bc);
        c.fillStyle=dg;
        c.fillRect(ox+IW*0.25,oy+IH*0.18,IW*0.5,IH*0.55);
        c.strokeStyle=shade(bc,0.5);c.lineWidth=0.5;
        c.strokeRect(ox+IW*0.25,oy+IH*0.18,IW*0.5,IH*0.55);
        c.fillStyle='#ddaa33';c.beginPath();c.arc(ox+IW*0.62,oy+IH*0.48,2.5,0,Math.PI*2);c.fill();
        c.fillStyle='#ffee66';c.beginPath();c.arc(ox+IW*0.62,oy+IH*0.47,1,0,Math.PI*2);c.fill();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 8:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.75);
        c.beginPath();c.moveTo(ox+IW*0.2,oy+IH*0.25);c.lineTo(ox+IW*0.8,oy+IH*0.25);c.lineTo(ox+IW*0.75,oy+IH*0.7);c.lineTo(ox+IW*0.25,oy+IH*0.7);c.closePath();c.fill();
        c.fillStyle=bc;
        c.fillRect(ox+IW*0.22,oy+IH*0.28,IW*0.56,IH*0.4);
        c.fillStyle=lighter(bc,0.25);c.fillRect(ox+IW*0.32,oy+IH*0.35,IW*0.36,IH*0.15);
        c.strokeStyle=shade(bc,0.55);c.lineWidth=0.5;
        c.strokeRect(ox+IW*0.22,oy+IH*0.28,IW*0.56,IH*0.4);
        c.fillStyle='#ddaa33';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.38,1.5,0,Math.PI*2);c.fill();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 9:{
        c.fillStyle=bc;diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=shade(bc,0.6);c.lineWidth=0.8;
        c.beginPath();c.moveTo(ox+IW*0.05,oy+IH*0.5);c.lineTo(ox+IW*0.95,oy+IH*0.5);c.stroke();
        c.strokeStyle=shade(bc,0.45);c.lineWidth=1.5;
        c.beginPath();c.moveTo(ox+IW*0.05,oy+IH*0.42);c.lineTo(ox+IW*0.95,oy+IH*0.42);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.05,oy+IH*0.58);c.lineTo(ox+IW*0.95,oy+IH*0.58);c.stroke();
        c.fillStyle=shade(bc,0.7);
        c.fillRect(ox+IW*0.05,oy+IH*0.42,IW*0.9,IH*0.02);
        break;}
      case 10:{
        c.fillStyle=bc;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<5;i++){
          const sy=oy+IH*0.08+i*IH*0.18;
          const sw=IW*0.7+i*IW*0.03;
          c.fillStyle=lighter(bc,0.06+i*0.02);
          c.fillRect(ox+(IW-sw)/2,sy,sw,IH*0.14);
          c.strokeStyle=shade(bc,0.65);c.lineWidth=0.3;
          c.strokeRect(ox+(IW-sw)/2,sy,sw,IH*0.14);
        }
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 11:{
        c.fillStyle=lighter(bc,0.08);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.6);
        c.beginPath();c.moveTo(ox+IW*0.15,oy+IH*0.15);c.lineTo(ox+IW*0.85,oy+IH*0.15);c.lineTo(ox+IW*0.8,oy+IH*0.45);c.lineTo(ox+IW*0.2,oy+IH*0.45);c.closePath();c.fill();
        c.fillStyle=bc;
        c.fillRect(ox+IW*0.2,oy+IH*0.2,IW*0.6,IH*0.25);
        c.fillStyle='#ddaa33';c.fillRect(ox+IW*0.3,oy+IH*0.12,IW*0.4,IH*0.18);
        c.fillStyle='#ffee66';c.fillRect(ox+IW*0.35,oy+IH*0.14,IW*0.3,IH*0.08);
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 12:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='#7a7a7a';c.fillRect(ox+IW*0.43,oy+IH*0.08,IW*0.14,IH*0.72);
        c.fillStyle='#999';c.fillRect(ox+IW*0.45,oy+IH*0.12,IW*0.1,IH*0.12);
        c.fillRect(ox+IW*0.45,oy+IH*0.35,IW*0.1,IH*0.12);
        c.fillRect(ox+IW*0.45,oy+IH*0.58,IW*0.1,IH*0.12);
        c.fillStyle='#aaa';c.fillRect(ox+IW*0.46,oy+IH*0.13,IW*0.08,IH*0.04);
        break;}
      case 13:{
        const g=c.createLinearGradient(ox,oy,ox,oy+IH);
        g.addColorStop(0,lighter(bc,0.06));g.addColorStop(1,shade(bc,0.92));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        const fcols=['#ff6688','#ffaa44','#ff44aa','#ff88cc','#44aaff','#ffff44','#ff6644'];
        for(let i=0;i<8;i++){
          const fx=ox+IW*0.12+noise1(i,13)*IW*0.76;
          const fy=oy+IH*0.15+noise1(13,i)*IH*0.7;
          c.fillStyle=fcols[i%fcols.length];
          c.beginPath();c.arc(fx,fy,1.2+noise1(i+10,13)*1.2,0,Math.PI*2);c.fill();
          c.fillStyle='rgba(255,255,255,0.3)';c.beginPath();c.arc(fx-0.3,fy-0.3,0.5,0,Math.PI*2);c.fill();
        }
        c.fillStyle='rgba(100,200,100,0.15)';
        for(let i=0;i<4;i++){
          const gx=ox+IW*0.2+noise1(i+20,13)*IW*0.6;
          const gy=oy+IH*0.2+noise1(13,i+20)*IH*0.6;
          c.beginPath();c.ellipse(gx,gy,2,1,noise1(i,99)*Math.PI,0,Math.PI*2);c.fill();
        }
        break;}
      case 14:{
        c.fillStyle=lighter(bc,0.04);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.78);
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.48,IW*0.24,IH*0.28,0,0,Math.PI*2);c.fill();
        c.fillStyle=lighter(bc,0.08);
        c.beginPath();c.ellipse(ox+IW*0.47,oy+IH*0.42,IW*0.14,IH*0.15,0.2,0,Math.PI*2);c.fill();
        c.fillStyle=shade(bc,0.6);
        c.beginPath();c.ellipse(ox+IW*0.52,oy+IH*0.55,IW*0.08,IH*0.06,0,0,Math.PI*2);c.fill();
        c.strokeStyle=shade(bc,0.45);c.lineWidth=0.4;
        c.beginPath();c.moveTo(ox+IW*0.38,oy+IH*0.38);c.lineTo(ox+IW*0.62,oy+IH*0.52);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.42,oy+IH*0.44);c.lineTo(ox+IW*0.58,oy+IH*0.42);c.stroke();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 15:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=shade(bc,0.45);c.lineWidth=0.8;
        for(let i=0;i<7;i++){
          const tx=ox+IW*0.12+noise1(i,15)*IW*0.76;
          const ty=oy+IH*0.15+noise1(15,i)*IH*0.55;
          c.beginPath();c.moveTo(tx,ty+5);c.lineTo(tx+2,ty);c.lineTo(tx+4,ty+5);c.stroke();
          c.fillStyle=shade(bc,0.6);c.beginPath();c.moveTo(tx+1,ty+4);c.lineTo(tx+2,ty+1);c.lineTo(tx+3,ty+4);c.fill();
        }
        c.fillStyle=lighter(bc,0.08);
        for(let i=0;i<3;i++){
          c.beginPath();c.ellipse(ox+IW*0.2+noise1(i+30,15)*IW*0.6,oy+IH*0.2+noise1(15,i+30)*IH*0.5,2,1,0,0,Math.PI*2);c.fill();
        }
        break;}
      case 16:{
        const g=c.createLinearGradient(ox,oy,ox+IW,oy+IH);
        g.addColorStop(0,shade(bc,0.82));g.addColorStop(0.5,shade(bc,0.9));g.addColorStop(1,shade(bc,0.78));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<10;i++){
          const dx=ox+IW*0.1+noise1(i,16)*IW*0.8;
          const dy=oy+IH*0.15+noise1(16,i)*IH*0.7;
          c.fillStyle=noise1(i+5,16)>0.5?shade(bc,0.65):shade(bc,0.75);
          c.fillRect(dx,dy,2+noise1(i+10,16)*2,2+noise1(i+20,16)*2);
        }
        c.strokeStyle=lighter(bc,0.08);c.lineWidth=0.3;
        for(let i=0;i<3;i++){
          c.beginPath();
          c.moveTo(ox+IW*0.2+noise1(i,200)*IW*0.6,oy+IH*0.3+noise1(200,i)*IH*0.4);
          c.lineTo(ox+IW*0.3+noise1(i+3,200)*IW*0.4,oy+IH*0.35+noise1(200,i+3)*IH*0.3);
          c.stroke();
        }
        break;}
      case 17:{
        const g=c.createLinearGradient(ox,oy+IH*0.2,ox+IW*0.3,oy+IH);
        g.addColorStop(0,'#ff5500');g.addColorStop(0.3,'#ee3300');g.addColorStop(0.6,'#cc2200');g.addColorStop(1,'#881100');
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<6;i++){
          c.strokeStyle=`rgba(255,${150+i*15},0,${0.2+noise1(i,17)*0.2})`;c.lineWidth=0.8;
          c.beginPath();
          const sy=oy+IH*0.3+i*IH*0.08;
          c.moveTo(ox+IW*0.15,sy);
          c.bezierCurveTo(ox+IW*0.3,sy-3+noise1(i,1)*6,ox+IW*0.6,sy+2+noise1(i,2)*5,ox+IW*0.85,sy+noise1(i,3)*3);
          c.stroke();
        }
        c.fillStyle='rgba(255,200,50,0.12)';diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='rgba(255,100,0,0.08)';c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.45,IW*0.2,IH*0.15,0,0,Math.PI*2);c.fill();
        break;}
      case 18:{
        const g=c.createLinearGradient(ox,oy,ox+IW,oy+IH);
        g.addColorStop(0,'#cce0ff');g.addColorStop(0.3,bc);g.addColorStop(0.7,'#aaccdd');g.addColorStop(1,'#99bbee');
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle='rgba(255,255,255,0.35)';c.lineWidth=0.6;
        c.beginPath();c.moveTo(ox+IW*0.15,oy+IH*0.3);c.lineTo(ox+IW*0.55,oy+IH*0.7);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.45,oy+IH*0.15);c.lineTo(ox+IW*0.85,oy+IH*0.55);c.stroke();
        c.strokeStyle='rgba(200,230,255,0.2)';c.lineWidth=0.4;
        c.beginPath();c.moveTo(ox+IW*0.3,oy+IH*0.2);c.lineTo(ox+IW*0.7,oy+IH*0.6);c.stroke();
        c.fillStyle='rgba(255,255,255,0.12)';c.beginPath();c.ellipse(ox+IW*0.4,oy+IH*0.4,IW*0.1,IH*0.08,0.5,0,Math.PI*2);c.fill();
        break;}
      case 19:{
        const g=c.createLinearGradient(ox,oy,ox+IW*0.8,oy+IH);
        g.addColorStop(0,lighter(bc,0.06));g.addColorStop(0.5,bc);g.addColorStop(1,shade(bc,0.9));
        c.fillStyle=g;diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<12;i++){
          c.fillStyle=noise1(i,19)>0.5?lighter(bc,0.06):shade(bc,0.88);
          c.fillRect(ox+IW*noise1(i+20,19),oy+IH*noise1(19,i+20),1.5,1.5);
        }
        c.strokeStyle=lighter(bc,0.08);c.lineWidth=0.4;
        for(let i=0;i<4;i++){
          const sy=oy+IH*0.2+i*IH*0.18;
          c.beginPath();c.moveTo(ox+IW*0.08,sy);c.bezierCurveTo(ox+IW*0.3,sy+1,ox+IW*0.6,sy-1,ox+IW*0.92,sy+noise1(i,19)*2);c.stroke();
        }
        break;}
      case 20:{
        c.fillStyle=lighter(bc,0.04);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='rgba(200,210,240,0.25)';
        for(let i=0;i<6;i++){
          c.fillRect(ox+IW*noise1(i,20)*0.8+IW*0.1,oy+IH*noise1(20,i)*0.6+IH*0.2,3,1.5);
        }
        c.fillStyle='rgba(255,255,255,0.4)';
        for(let i=0;i<4;i++){
          c.beginPath();c.arc(ox+IW*0.15+noise1(i+30,20)*IW*0.7,oy+IH*0.2+noise1(20,i+30)*IH*0.6,0.8+noise1(i,50)*0.8,0,Math.PI*2);c.fill();
        }
        c.fillStyle='rgba(255,255,255,0.15)';
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.45,IW*0.2,IH*0.12,0,0,Math.PI*2);c.fill();
        break;}
      case 21:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=lighter(bc,0.1);c.lineWidth=0.4;
        c.strokeRect(ox+IW*0.12,oy+IH*0.12,IW*0.76,IH*0.76);
        c.strokeRect(ox+IW*0.22,oy+IH*0.22,IW*0.56,IH*0.56);
        c.fillStyle=bc;c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.5,IW*0.1,0,Math.PI*2);c.fill();
        c.fillStyle=lighter(bc,0.15);c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.48,IW*0.05,0,Math.PI*2);c.fill();
        break;}
      case 22:{
        c.fillStyle=lighter(bc,0.06);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle='rgba(255,255,255,0.6)';c.lineWidth=0.8;
        c.beginPath();c.moveTo(ox+IW*0.5,oy+IH*0.15);c.lineTo(ox+IW*0.5,oy+IH*0.85);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.15,oy+IH*0.5);c.lineTo(ox+IW*0.85,oy+IH*0.5);c.stroke();
        c.strokeStyle=shade(bc,0.5);c.lineWidth=0.3;diamondPath(c,ox+IW*0.08,oy+IH*0.08,IW*0.84,IH*0.84);c.stroke();
        c.fillStyle='rgba(255,255,200,0.08)';diamondPath(c,ox+IW*0.15,oy+IH*0.15,IW*0.7,IH*0.7);c.fill();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 23:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<8;i++){
          const bx=ox+IW*0.15+noise1(i+3,23)*IW*0.7;
          const by=oy+IH*0.15+noise1(23,i+3)*IH*0.7;
          c.fillStyle=`rgba(100,15,15,${0.2+noise1(i,23)*0.5})`;
          c.beginPath();c.ellipse(bx,by,1.5+noise1(i,23)*3,1+noise1(i+1,23)*2,noise1(i,99)*Math.PI,0,Math.PI*2);c.fill();
        }
        c.fillStyle='rgba(80,10,10,0.08)';diamondPath(c,ox+IW*0.1,oy+IH*0.1,IW*0.8,IH*0.8);c.fill();
        break;}
      case 24:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=lighter(bc,0.15);
        c.fillRect(ox+IW*0.18,oy+IH*0.28,IW*0.64,IH*0.38);
        c.fillStyle=bc;
        c.fillRect(ox+IW*0.2,oy+IH*0.3,IW*0.6,IH*0.34);
        c.fillStyle=lighter(bc,0.2);c.fillRect(ox+IW*0.3,oy+IH*0.35,IW*0.4,IH*0.12);
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 25:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.strokeStyle=shade(bc,0.55);c.lineWidth=1.2;
        c.beginPath();c.moveTo(ox+IW*0.3,oy+IH*0.15);c.lineTo(ox+IW*0.3,oy+IH*0.85);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.7,oy+IH*0.15);c.lineTo(ox+IW*0.7,oy+IH*0.85);c.stroke();
        c.strokeStyle=shade(bc,0.6);c.lineWidth=0.8;
        for(let i=0;i<4;i++){
          const ry=oy+IH*0.2+i*IH*0.18;
          c.beginPath();c.moveTo(ox+IW*0.3,ry);c.lineTo(ox+IW*0.7,ry);c.stroke();
        }
        c.fillStyle=shade(bc,0.7);c.fillRect(ox+IW*0.3,oy+IH*0.12,IW*0.4,2);
        break;}
      case 26:{
        c.fillStyle='#08081a';diamondPath(c,ox,oy,IW,IH);c.fill();
        const ccols=['#aa66ff','#cc88ff','#8844dd','#bb77ee','#9955cc','#dd99ff'];
        for(let i=0;i<7;i++){
          const dx=ox+IW*0.15+noise1(i,26)*IW*0.7;
          const dy=oy+IH*0.15+noise1(26,i)*IH*0.6;
          c.fillStyle=ccols[i];
          c.save();c.translate(dx,dy);c.rotate(Math.PI/4+noise1(i,88)*0.3);
          c.fillRect(-2,-2,4,4);c.restore();
        }
        const rg=c.createRadialGradient(ox+IW*0.5,oy+IH*0.4,2,ox+IW*0.5,oy+IH*0.4,IW*0.25);
        rg.addColorStop(0,'rgba(200,160,255,0.2)');rg.addColorStop(1,'rgba(100,60,180,0)');
        c.fillStyle=rg;c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.4,IW*0.25,0,Math.PI*2);c.fill();
        sideFaces(c,ox,oy,IW,IH,'#2a1a4a',th);
        break;}
      case 27:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        for(let i=0;i<8;i++){
          c.fillStyle=shade(bc,0.65+noise1(i,27)*0.25);
          c.beginPath();c.arc(ox+IW*0.15+noise1(i+5,27)*IW*0.7,oy+IH*0.15+noise1(27,i+5)*IH*0.7,1.5+noise1(i,27)*2.5,0,Math.PI*2);c.fill();
        }
        c.fillStyle=lighter(bc,0.05);
        for(let i=0;i<3;i++){
          c.beginPath();c.ellipse(ox+IW*0.2+noise1(i+40,27)*IW*0.6,oy+IH*0.3+noise1(27,i+40)*IH*0.4,2,1,0,0,Math.PI*2);c.fill();
        }
        break;}
      case 28:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.65);
        c.fillRect(ox+IW*0.12,oy+IH*0.12,IW*0.28,IH*0.62);
        c.fillStyle=shade(bc,0.55);c.fillRect(ox+IW*0.12,oy+IH*0.12,IW*0.28,3);
        c.fillStyle=shade(bc,0.72);
        c.fillRect(ox+IW*0.58,oy+IH*0.22,IW*0.22,IH*0.52);
        c.fillStyle=shade(bc,0.6);c.fillRect(ox+IW*0.58,oy+IH*0.22,IW*0.22,2);
        c.strokeStyle=shade(bc,0.5);c.lineWidth=0.3;
        c.beginPath();c.moveTo(ox+IW*0.15,oy+IH*0.25);c.lineTo(ox+IW*0.35,oy+IH*0.25);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.15,oy+IH*0.35);c.lineTo(ox+IW*0.35,oy+IH*0.35);c.stroke();
        sideFaces(c,ox,oy,IW,IH,bc,th*0.5);
        break;}
      case 29:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.62);
        c.fillRect(ox+IW*0.3,oy+IH*0.08,IW*0.4,IH*0.68);
        c.fillStyle=shade(bc,0.72);c.fillRect(ox+IW*0.34,oy+IH*0.12,IW*0.32,IH*0.58);
        c.strokeStyle=shade(bc,0.48);c.lineWidth=0.4;
        c.beginPath();c.moveTo(ox+IW*0.5,oy+IH*0.22);c.lineTo(ox+IW*0.5,oy+IH*0.58);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.4,oy+IH*0.35);c.lineTo(ox+IW*0.6,oy+IH*0.35);c.stroke();
        c.fillStyle='rgba(200,200,200,0.15)';c.fillRect(ox+IW*0.34,oy+IH*0.12,IW*0.16,IH*0.25);
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 30:{
        c.fillStyle=shade(bc,0.88);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='#1a3a6a';c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.5,IW*0.3,IH*0.3,0,0,Math.PI*2);c.fill();
        c.fillStyle='#0a2a5a';c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.5,IW*0.24,IH*0.24,0,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(100,180,255,0.2)';c.beginPath();c.ellipse(ox+IW*0.44,oy+IH*0.42,IW*0.08,IH*0.06,0,0,Math.PI*2);c.fill();
        c.strokeStyle=shade(bc,0.55);c.lineWidth=0.5;
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.5,IW*0.3,IH*0.3,0,0,Math.PI*2);c.stroke();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 31:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='#6a4a2a';
        c.fillRect(ox+IW*0.08,oy+IH*0.18,3,IH*0.64);
        c.fillRect(ox+IW*0.88,oy+IH*0.18,3,IH*0.64);
        c.fillStyle='#5a3a1a';
        c.fillRect(ox+IW*0.08,oy+IH*0.18,3,3);
        c.fillRect(ox+IW*0.88,oy+IH*0.18,3,3);
        c.strokeStyle='#5a3a1a';c.lineWidth=1.2;
        c.beginPath();c.moveTo(ox+IW*0.10,oy+IH*0.32);c.lineTo(ox+IW*0.90,oy+IH*0.32);c.stroke();
        c.beginPath();c.moveTo(ox+IW*0.10,oy+IH*0.58);c.lineTo(ox+IW*0.90,oy+IH*0.58);c.stroke();
        c.strokeStyle='#7a5a3a';c.lineWidth=0.3;
        c.beginPath();c.moveTo(ox+IW*0.10,oy+IH*0.32);c.lineTo(ox+IW*0.90,oy+IH*0.32);c.stroke();
        break;}
      case 32:{
        c.fillStyle=lighter(bc,0.04);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.68);
        c.fillRect(ox+IW*0.26,oy+IH*0.08,IW*0.48,IH*0.72);
        c.fillStyle=lighter(bc,0.08);c.fillRect(ox+IW*0.31,oy+IH*0.13,IW*0.38,IH*0.58);
        c.fillStyle='#6688cc';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.32,IW*0.1,0,Math.PI*2);c.fill();
        c.fillStyle='#88aadd';c.beginPath();c.arc(ox+IW*0.48,oy+IH*0.3,IW*0.04,0,Math.PI*2);c.fill();
        c.strokeStyle=shade(bc,0.5);c.lineWidth=0.4;
        c.strokeRect(ox+IW*0.31,oy+IH*0.13,IW*0.38,IH*0.58);
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      case 33:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='#5a3a1a';c.fillRect(ox+IW*0.44,oy+IH*0.12,3,IH*0.62);
        c.fillStyle='#ff8800';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.14,4,0,Math.PI*2);c.fill();
        c.fillStyle='#ffcc00';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.12,2.5,0,Math.PI*2);c.fill();
        c.fillStyle='#ffffaa';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.11,1,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(255,150,0,0.1)';c.beginPath();c.arc(ox+IW*0.5,oy+IH*0.14,8,0,Math.PI*2);c.fill();
        break;}
      case 34:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle='#5a3a1a';c.fillRect(ox+IW*0.18,oy+IH*0.02,2.5,IH*0.88);
        c.fillStyle='#cc3333';
        c.beginPath();c.moveTo(ox+IW*0.20,oy+IH*0.06);c.lineTo(ox+IW*0.55,oy+IH*0.14);c.lineTo(ox+IW*0.20,oy+IH*0.22);c.closePath();c.fill();
        c.fillStyle=shade('#cc3333',0.8);
        c.beginPath();c.moveTo(ox+IW*0.20,oy+IH*0.14);c.lineTo(ox+IW*0.55,oy+IH*0.14);c.lineTo(ox+IW*0.20,oy+IH*0.22);c.closePath();c.fill();
        c.strokeStyle=shade('#cc3333',0.6);c.lineWidth=0.3;
        c.beginPath();c.moveTo(ox+IW*0.20,oy+IH*0.06);c.lineTo(ox+IW*0.55,oy+IH*0.14);c.stroke();
        break;}
      case 35:{
        c.fillStyle=shade(bc,0.92);diamondPath(c,ox,oy,IW,IH);c.fill();
        c.fillStyle=shade(bc,0.82);c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.45,IW*0.32,IH*0.32,0,0,Math.PI*2);c.fill();
        c.fillStyle=bc;c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.42,IW*0.26,IH*0.26,0,0,Math.PI*2);c.fill();
        c.fillStyle=shade(bc,0.78);c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.42,IW*0.2,IH*0.2,0,0,Math.PI*2);c.fill();
        c.strokeStyle=shade(bc,0.55);c.lineWidth=0.6;
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.32,IW*0.24,IH*0.07,0,0,Math.PI*2);c.stroke();
        c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.52,IW*0.24,IH*0.07,0,0,Math.PI*2);c.stroke();
        c.fillStyle=shade(bc,0.65);c.beginPath();c.ellipse(ox+IW*0.5,oy+IH*0.32,IW*0.2,IH*0.04,0,0,Math.PI*2);c.fill();
        sideFaces(c,ox,oy,IW,IH,bc,th);
        break;}
      default:{
        c.fillStyle=bc;diamondPath(c,ox,oy,IW,IH);c.fill();
        break;}
    }
    TILE_CANVAS[id]=cv;
  });
}

const PAL={
  player:{hair:'#4a3020',skin:'#f0c8a0',eye:'#2244aa',hairHi:'#7a5838',hairSh:'#2a1810',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#3366cc',o2:'#224499',o1Hi:'#5588ee',o2Sh:'#182a66',boot:'#5a4030',bootSh:'#3a2818',acc:'#ffcc33',accHi:'#ffee88',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#6688dd',outline:'#1a1018'},
  elder:{hair:'#e0e0e0',skin:'#e0b890',eye:'#666',hairHi:'#fff',hairSh:'#b0b0b0',skinHi:'#f8d8b8',skinSh:'#b89068',o1:'#7a5a3a',o2:'#6a4a2a',o1Hi:'#9a7a5a',o2Sh:'#4a3018',boot:'#4a3a2a',bootSh:'#2a1a10',acc:'#9a8a6a',accHi:'#c0b088',blush:'#ddaa88',mouth:'#bb8877',eyeHi:'#999',outline:'#3a2a1a'},
  merchant:{hair:'#6a4420',skin:'#f0c8a0',eye:'#443',hairHi:'#9a7450',hairSh:'#3a2410',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#338844',o2:'#226633',o1Hi:'#55aa66',o2Sh:'#184422',boot:'#6a5040',bootSh:'#4a3020',acc:'#ddaa33',accHi:'#ffcc66',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#887766',outline:'#2a1a10'},
  child:{hair:'#7a5a30',skin:'#f8d8b0',eye:'#333',hairHi:'#aa8a60',hairSh:'#4a3018',skinHi:'#fff0d8',skinSh:'#d0a878',o1:'#dd5555',o2:'#bb3333',o1Hi:'#ff7777',o2Sh:'#882222',boot:'#6a4030',bootSh:'#4a2818',acc:null,accHi:null,blush:'#ffaaaa',mouth:'#dd8877',eyeHi:'#666',outline:'#2a1810'},
  drunk:{hair:'#6a3010',skin:'#e0a880',eye:'#888',hairHi:'#9a6040',hairSh:'#3a1808',skinHi:'#f0c8a0',skinSh:'#b08858',o1:'#6a6a7a',o2:'#5a5a6a',o1Hi:'#8a8a9a',o2Sh:'#3a3a4a',boot:'#4a3a2a',bootSh:'#2a1a10',acc:'#9a7a4a',accHi:'#c0a070',blush:'#dd7766',mouth:'#aa6655',eyeHi:'#bbb',outline:'#2a1808'},
  mira:{hair:'#bbbbdd',skin:'#f0c8a0',eye:'#558',hairHi:'#ddddef',hairSh:'#8888aa',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#7a5a7a',o2:'#6a4a6a',o1Hi:'#aa7aaa',o2Sh:'#4a2a4a',boot:'#5a4030',bootSh:'#3a2818',acc:null,accHi:null,blush:'#ee8888',mouth:'#cc7766',eyeHi:'#88aacc',outline:'#2a2a3a'},
  smith:{hair:'#2a2a2a',skin:'#d0a878',eye:'#333',hairHi:'#5a5a5a',hairSh:'#0a0a0a',skinHi:'#e8c8a0',skinSh:'#a08050',o1:'#5a5a6a',o2:'#4a4a5a',o1Hi:'#7a7a8a',o2Sh:'#2a2a3a',boot:'#3a3a3a',bootSh:'#1a1a1a',acc:'#9a9a9a',accHi:'#c0c0c0',blush:'#cc9977',mouth:'#aa7766',eyeHi:'#666',outline:'#0a0a0a'},
  guard:{hair:'#3a3020',skin:'#e0b890',eye:'#444',hairHi:'#6a6050',hairSh:'#1a1008',skinHi:'#f0d0a8',skinSh:'#b89068',o1:'#4a5a6a',o2:'#3a4a5a',o1Hi:'#6a7a8a',o2Sh:'#1a2a3a',boot:'#3a3a3a',bootSh:'#1a1a1a',acc:'#999',accHi:'#ccc',blush:'#ddaa88',mouth:'#bb8877',eyeHi:'#777',outline:'#1a1008'},
  ghost:{hair:'rgba(180,180,220,0.5)',skin:'rgba(200,200,255,0.4)',eye:'rgba(100,100,255,0.7)',hairHi:'rgba(220,220,255,0.3)',hairSh:'rgba(120,120,180,0.3)',skinHi:'rgba(230,230,255,0.3)',skinSh:'rgba(140,140,200,0.3)',o1:'rgba(180,180,220,0.3)',o2:'rgba(160,160,200,0.2)',o1Hi:'rgba(210,210,240,0.2)',o2Sh:'rgba(100,100,160,0.2)',boot:'rgba(150,150,200,0.2)',bootSh:'rgba(80,80,140,0.2)',acc:'rgba(100,100,255,0.5)',accHi:'rgba(150,150,255,0.4)',blush:'rgba(150,150,220,0.3)',mouth:'rgba(120,120,200,0.4)',eyeHi:'rgba(180,180,255,0.5)',outline:'rgba(60,60,140,0.3)'},
  hermit:{hair:'#8a7a50',skin:'#e0b890',eye:'#557',hairHi:'#bb9a70',hairSh:'#5a4a28',skinHi:'#f0d0a8',skinSh:'#b89068',o1:'#4a6a4a',o2:'#3a5a3a',o1Hi:'#6a8a6a',o2Sh:'#1a3a1a',boot:'#5a4030',bootSh:'#3a2818',acc:'#9a7a4a',accHi:'#c0a070',blush:'#ddaa88',mouth:'#bb8877',eyeHi:'#88aacc',outline:'#2a2a18'},
  farmer:{hair:'#6a4420',skin:'#e0a880',eye:'#444',hairHi:'#9a7450',hairSh:'#3a2410',skinHi:'#f0c8a0',skinSh:'#b08858',o1:'#7a6a4a',o2:'#6a5a3a',o1Hi:'#9a8a6a',o2Sh:'#4a3a1a',boot:'#5a4030',bootSh:'#3a2818',acc:null,accHi:null,blush:'#dd9977',mouth:'#bb8877',eyeHi:'#777',outline:'#2a1a08'},
  hunter:{hair:'#3a3020',skin:'#d0a070',eye:'#333',hairHi:'#6a6050',hairSh:'#1a1008',skinHi:'#e8c090',skinSh:'#a07848',o1:'#3a6a3a',o2:'#2a5a2a',o1Hi:'#5a8a5a',o2Sh:'#1a3a1a',boot:'#4a3020',bootSh:'#2a1810',acc:'#6a4a30',accHi:'#9a7a60',blush:'#cc9977',mouth:'#aa7766',eyeHi:'#666',outline:'#1a1008'},
  priest:{hair:'#6a4a30',skin:'#f0c8a0',eye:'#557',hairHi:'#9a7a58',hairSh:'#3a2a18',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#eee',o2:'#ccc',o1Hi:'#fff',o2Sh:'#999',boot:'#9a8a7a',bootSh:'#7a6a5a',acc:'#ddaa33',accHi:'#ffcc66',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#88aacc',outline:'#3a2a1a'},
  knight:{hair:'#4a4a4a',skin:'#e0b890',eye:'#444',hairHi:'#7a7a7a',hairSh:'#2a2a2a',skinHi:'#f0d0a8',skinSh:'#b89068',o1:'#9a9aaa',o2:'#7a7a8a',o1Hi:'#babbdd',o2Sh:'#5a5a6a',boot:'#5a5a6a',bootSh:'#3a3a4a',acc:'#dde0e8',accHi:'#f0f0ff',blush:'#ddaa88',mouth:'#bb8877',eyeHi:'#777',outline:'#2a2a2a'},
  maid:{hair:'#6a4a30',skin:'#f8d8b0',eye:'#335',hairHi:'#9a7a58',hairSh:'#3a2a18',skinHi:'#fff0d8',skinSh:'#d0a878',o1:'#eee',o2:'#ccc',o1Hi:'#fff',o2Sh:'#999',boot:'#4a4a4a',bootSh:'#2a2a2a',acc:null,accHi:null,blush:'#ffaaaa',mouth:'#dd8877',eyeHi:'#88aacc',outline:'#2a1a10'},
  chef:{hair:'#2a2a2a',skin:'#f0c8a0',eye:'#444',hairHi:'#5a5a5a',hairSh:'#0a0a0a',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#f0f0f0',o2:'#ddd',o1Hi:'#fff',o2Sh:'#aaa',boot:'#3a3a3a',bootSh:'#1a1a1a',acc:'#fff',accHi:'#fff',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#777',outline:'#0a0a0a'},
  inform:{hair:'#2a2a3a',skin:'#d0a070',eye:'#333',hairHi:'#4a4a5a',hairSh:'#0a0a18',skinHi:'#e8c090',skinSh:'#a07848',o1:'#3a3a4a',o2:'#2a2a3a',o1Hi:'#5a5a6a',o2Sh:'#0a0a18',boot:'#2a2a2a',bootSh:'#0a0a0a',acc:'#9a3a3a',accHi:'#cc6666',blush:'#cc9977',mouth:'#aa7766',eyeHi:'#666',outline:'#0a0a18'},
  vizier:{hair:'#3a3a3a',skin:'#e0b890',eye:'#444',hairHi:'#6a6a6a',hairSh:'#1a1a1a',skinHi:'#f0d0a8',skinSh:'#b89068',o1:'#5a2a5a',o2:'#4a1a4a',o1Hi:'#7a4a7a',o2Sh:'#2a0a2a',boot:'#3a3a3a',bootSh:'#1a1a1a',acc:'#ddaa33',accHi:'#ffcc66',blush:'#ddaa88',mouth:'#bb8877',eyeHi:'#887766',outline:'#1a0a18'},
  captain:{hair:'#5a4a30',skin:'#e0a880',eye:'#333',hairHi:'#8a7a58',hairSh:'#2a1a08',skinHi:'#f0c8a0',skinSh:'#b08858',o1:'#2a4a6a',o2:'#1a3a5a',o1Hi:'#4a6a8a',o2Sh:'#0a1a3a',boot:'#4a3a30',bootSh:'#2a1a18',acc:'#ddaa33',accHi:'#ffcc66',blush:'#dd9977',mouth:'#bb8877',eyeHi:'#777',outline:'#1a1008'},
  cook:{hair:'#3a2a10',skin:'#f0c8a0',eye:'#444',hairHi:'#6a4a30',hairSh:'#1a0a00',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#9a7a5a',o2:'#8a6a4a',o1Hi:'#baa080',o2Sh:'#6a4a2a',boot:'#4a3a2a',bootSh:'#2a1a10',acc:null,accHi:null,blush:'#ee8888',mouth:'#cc7766',eyeHi:'#777',outline:'#1a0a00'},
  navigator:{hair:'#5a3a20',skin:'#f0c8a0',eye:'#557',hairHi:'#8a6a48',hairSh:'#2a1a08',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#4a4a7a',o2:'#3a3a6a',o1Hi:'#6a6a9a',o2Sh:'#1a1a3a',boot:'#4a4a5a',bootSh:'#2a2a3a',acc:'#9a9add',accHi:'#ccccff',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#88aacc',outline:'#1a1a2a'},
  scientist:{hair:'#6a6a6a',skin:'#f0c8a0',eye:'#557',hairHi:'#9a9a9a',hairSh:'#3a3a3a',skinHi:'#ffe0c0',skinSh:'#c89868',o1:'#6a6a7a',o2:'#5a5a6a',o1Hi:'#8a8a9a',o2Sh:'#3a3a4a',boot:'#4a4a5a',bootSh:'#2a2a3a',acc:'#cceeFF',accHi:'#eeffff',blush:'#ee8888',mouth:'#cc7766',eyeHi:'#88aacc',outline:'#2a2a2a'},
  builder:{hair:'#5a4a30',skin:'#d0a070',eye:'#444',hairHi:'#8a7a58',hairSh:'#2a1a08',skinHi:'#e8c090',skinSh:'#a07848',o1:'#7a6a4a',o2:'#6a5a3a',o1Hi:'#9a8a6a',o2Sh:'#4a3a1a',boot:'#4a3a2a',bootSh:'#2a1a10',acc:'#9a9a7a',accHi:'#c0c0a0',blush:'#cc9977',mouth:'#aa7766',eyeHi:'#777',outline:'#1a1008'},
  origin:{hair:'#e0d8f0',skin:'#f0d8c0',eye:'#77c',hairHi:'#fff',hairSh:'#b0a8d0',skinHi:'#fff0e0',skinSh:'#c8a888',o1:'#d8a0ff',o2:'#aa80dd',o1Hi:'#eeccff',o2Sh:'#7a50aa',boot:'#7a6a9a',bootSh:'#4a3a6a',acc:'#fff',accHi:'#fff',blush:'#ffaaaa',mouth:'#dd8877',eyeHi:'#aaccff',outline:'#4a3a5a'},
  spirit:{hair:'rgba(100,200,255,0.6)',skin:'rgba(150,220,255,0.5)',eye:'rgba(200,255,255,0.8)',hairHi:'rgba(180,240,255,0.4)',hairSh:'rgba(60,140,200,0.3)',skinHi:'rgba(200,240,255,0.4)',skinSh:'rgba(80,160,220,0.3)',o1:'rgba(100,180,255,0.4)',o2:'rgba(80,150,220,0.3)',o1Hi:'rgba(150,210,255,0.3)',o2Sh:'rgba(50,100,180,0.2)',boot:'rgba(80,150,220,0.2)',bootSh:'rgba(40,80,140,0.2)',acc:'#aaddff',accHi:'#cceeFF',blush:'rgba(180,200,255,0.3)',mouth:'rgba(120,180,240,0.4)',eyeHi:'rgba(230,255,255,0.6)',outline:'rgba(40,100,180,0.3)'}
};

function drawHumanoid(ctx,w,h,pal,opts={}){
  const dir=opts.dir||0;const wf=opts.wf||0;
  const S=w/16,T=h/24;
  const OL=pal.outline||'rgba(20,10,15,0.5)';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.beginPath();ctx.ellipse(w/2,h-1,w*0.3,3,0,0,Math.PI*2);ctx.fill();
  if(dir===0){
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,5*T,4.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.hair;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,4.8*T,4.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(3.5*S,2*T,9*S,4*T);
    ctx.fillRect(3*S,1*T,10*S,2*T);
    ctx.fillStyle=pal.hairHi||pal.hair;
    ctx.fillRect(4*S,0.5*T,3*S,1.5*T);
    ctx.fillRect(9*S,0.5*T,3*S,1.5*T);
    ctx.fillStyle=pal.hairSh||'rgba(0,0,0,0.1)';
    ctx.fillRect(3.5*S,5.2*T,9*S,0.8*T);
    ctx.fillStyle='rgba(255,255,255,0.08)';
    ctx.fillRect(4.5*S,0.5*T,2*S,T);
    if(opts.hat){ctx.fillStyle=pal.bootSh||pal.boot;ctx.fillRect(2*S,0,12*S,3.2*T);ctx.fillStyle=pal.boot;ctx.fillRect(2.5*S,0.2*T,11*S,2.6*T);ctx.fillRect(5*S,-2.5*T,6*S,3*T);ctx.fillStyle=pal.acc;ctx.fillRect(5*S,-2.5*T,6*S,1*T);ctx.fillStyle=pal.accHi;ctx.fillRect(5.5*S,-2.4*T,5*S,0.5*T);}
    if(opts.hood){ctx.fillStyle=pal.o2Sh||pal.o2;ctx.beginPath();ctx.ellipse(8*S,2*T,5.2*T,3.7*T,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=pal.o2;ctx.beginPath();ctx.ellipse(8*S,2.2*T,4.8*T,3.3*T,0,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.ellipse(8*S,5*T,4*T,3.7*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skin;
    ctx.beginPath();ctx.ellipse(8*S,5*T,3.8*T,3.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skinHi||pal.skin;
    ctx.beginPath();ctx.ellipse(7.8*S,4*T,2.5*T,1.8*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skinSh||'rgba(0,0,0,0.06)';
    ctx.beginPath();ctx.ellipse(8*S,7.2*T,2.8*T,1.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=0.5*S;
    ctx.beginPath();ctx.ellipse(6.2*S,4.7*T,1.6*T,1.7*T,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(9.8*S,4.7*T,1.6*T,1.7*T,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.93)';
    ctx.beginPath();ctx.ellipse(6.2*S,4.7*T,1.5*T,1.6*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(9.8*S,4.7*T,1.5*T,1.6*T,0,0,Math.PI*2);ctx.fill();
    const egL=ctx.createRadialGradient(6.2*S,4.9*T,0.1*T,6.2*S,4.9*T,1.2*T);
    egL.addColorStop(0,pal.eyeHi||pal.eye);egL.addColorStop(0.5,pal.eye);egL.addColorStop(1,OL);
    ctx.fillStyle=egL;ctx.beginPath();ctx.ellipse(6.2*S,4.9*T,1.2*T,1.4*T,0,0,Math.PI*2);ctx.fill();
    const egR=ctx.createRadialGradient(9.8*S,4.9*T,0.1*T,9.8*S,4.9*T,1.2*T);
    egR.addColorStop(0,pal.eyeHi||pal.eye);egR.addColorStop(0.5,pal.eye);egR.addColorStop(1,OL);
    ctx.fillStyle=egR;ctx.beginPath();ctx.ellipse(9.8*S,4.9*T,1.2*T,1.4*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath();ctx.ellipse(6.4*S,5*T,0.8*T,1*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S,5*T,0.8*T,1*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.93)';
    ctx.beginPath();ctx.arc(5.8*S,4.4*T,0.5*T,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(9.4*S,4.4*T,0.5*T,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(6.5*S,5.2*T,0.25*T,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(10.1*S,5.2*T,0.25*T,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=0.5*S;
    ctx.beginPath();ctx.moveTo(5*S,4.1*T);ctx.quadraticCurveTo(6.2*S,3.7*T,7.4*S,4.1*T);ctx.stroke();
    ctx.beginPath();ctx.moveTo(8.6*S,4.1*T);ctx.quadraticCurveTo(9.8*S,3.7*T,11*S,4.1*T);ctx.stroke();
    ctx.fillStyle=pal.blush;
    ctx.beginPath();ctx.ellipse(5.2*S,6*T,1*T,0.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10.8*S,6*T,1*T,0.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.mouth;
    ctx.beginPath();ctx.ellipse(8*S,6.8*T,0.8*T,0.3*T,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=0.4*S;
    ctx.beginPath();ctx.arc(8*S,6.8*T,0.6*T,0.15,Math.PI-0.15);ctx.stroke();
    if(opts.beard){ctx.fillStyle=pal.hairSh||pal.hair;ctx.beginPath();ctx.ellipse(8*S,8*T,2.5*T,2*T,0,0,Math.PI);ctx.fill();ctx.fillStyle=pal.hair;ctx.beginPath();ctx.ellipse(8*S,7.8*T,2.3*T,1.8*T,0,0,Math.PI);ctx.fill();}
    if(opts.mustache){ctx.fillStyle=pal.hairSh||pal.hair;ctx.fillRect(6.3*S,6.2*T,1.4*T,0.7*T);ctx.fillRect(9.3*S,6.2*T,1.4*T,0.7*T);ctx.fillStyle=pal.hair;ctx.fillRect(6.5*S,6.3*T,1.1*T,0.5*T);ctx.fillRect(9.5*S,6.3*T,1.1*T,0.5*T);}
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.moveTo(4.5*S,7.8*T);ctx.lineTo(11.5*S,7.8*T);ctx.lineTo(12.2*S,16.2*T);ctx.lineTo(3.8*S,16.2*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1;
    ctx.beginPath();ctx.moveTo(4.5*S,8*T);ctx.lineTo(11.5*S,8*T);ctx.lineTo(12*S,16*T);ctx.lineTo(4*S,16*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1Hi||pal.o1;
    ctx.fillRect(6.5*S,8*T,2*S,8*T);
    ctx.fillStyle=pal.o2;
    ctx.fillRect(4*S,8*T,2.5*S,8*T);ctx.fillRect(10.5*S,8*T,2.5*S,8*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(4*S,14*T,2.5*S,2*T);ctx.fillRect(10.5*S,14*T,2.5*S,2*T);
    if(opts.vest){ctx.fillStyle=pal.acc||pal.o2;ctx.fillRect(5.5*S,8.5*T,5*S,5.5*T);ctx.fillStyle=pal.accHi||pal.acc;ctx.fillRect(6*S,8.5*T,1.5*S,5*T);}
    if(opts.belt){ctx.fillStyle=pal.bootSh||pal.boot;ctx.fillRect(4*S,13.8*T,8*S,1.8*T);ctx.fillStyle=pal.boot;ctx.fillRect(4*S,14*T,8*S,1.3*T);ctx.fillStyle=pal.acc;ctx.fillRect(7.5*S,14*T,1*S,1.3*T);}
    if(opts.armor){
      ctx.fillStyle=pal.acc;ctx.fillRect(5*S,8*T,6*S,2*T);
      ctx.fillRect(4*S,9*T,2.5*S,4*T);ctx.fillRect(10.5*S,9*T,2.5*S,4*T);
      ctx.fillStyle=pal.accHi||'rgba(200,210,230,0.3)';ctx.fillRect(6*S,8*T,4*S,5*T);
    }
    const lo=wf===1?-1.2:wf===2?1.2:0;
    const ao=wf===1?1.2:wf===2?-1.2:0;
    ctx.fillStyle=pal.o2;
    ctx.fillRect(3.5*S+ao*S,8*T,2.5*S,7*T);ctx.fillRect(10*S-ao*S,8*T,2.5*S,7*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(3.5*S+ao*S,13*T,2.5*S,2*T);ctx.fillRect(10*S-ao*S,13*T,2.5*S,2*T);
    ctx.fillStyle=pal.skin;
    ctx.beginPath();ctx.ellipse(4.75*S+ao*S,15.5*T,1.2*S,1.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(11.25*S-ao*S,15.5*T,1.2*S,1.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.o2;
    ctx.fillRect(5*S+lo*S,16*T,3*S,4.5*T);ctx.fillRect(9*S-lo*S,16*T,3*S,4.5*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(5*S+lo*S,19*T,3*S,1.5*T);ctx.fillRect(9*S-lo*S,19*T,3*S,1.5*T);
    ctx.fillStyle=pal.bootSh||pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S-lo*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S-lo*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
  }else if(dir===2){
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,5*T,4.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.hair;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,4.8*T,4.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(3.5*S,2*T,9*S,5*T);ctx.fillRect(3*S,1*T,10*S,2*T);
    ctx.fillStyle=pal.hairSh||'rgba(0,0,0,0.1)';
    ctx.fillRect(3.5*S,5.5*T,9*S,1*T);
    ctx.fillStyle=pal.hairHi||pal.hair;
    ctx.fillRect(4*S,0.5*T,3*S,1.2*T);ctx.fillRect(9*S,0.5*T,3*S,1.2*T);
    if(opts.hat){ctx.fillStyle=pal.bootSh||pal.boot;ctx.fillRect(2*S,0,12*S,3.2*T);ctx.fillStyle=pal.boot;ctx.fillRect(2.5*S,0.2*T,11*S,2.6*T);ctx.fillRect(5*S,-2.5*T,6*S,3*T);}
    if(opts.hood){ctx.fillStyle=pal.o2Sh||pal.o2;ctx.beginPath();ctx.ellipse(8*S,2*T,5.2*T,3.7*T,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=pal.o2;ctx.beginPath();ctx.ellipse(8*S,2.2*T,4.8*T,3.3*T,0,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.moveTo(4.3*S,7.8*T);ctx.lineTo(11.7*S,7.8*T);ctx.lineTo(12.2*S,16.2*T);ctx.lineTo(3.8*S,16.2*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1;
    ctx.beginPath();ctx.moveTo(4.5*S,8*T);ctx.lineTo(11.5*S,8*T);ctx.lineTo(12*S,16*T);ctx.lineTo(4*S,16*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1Hi||pal.o1;
    ctx.fillRect(6.5*S,8*T,3*S,8*T);
    ctx.fillStyle=pal.o2;ctx.fillRect(4*S,8*T,2.5*S,8*T);ctx.fillRect(10.5*S,8*T,2.5*S,8*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(4*S,14*T,2.5*S,2*T);ctx.fillRect(10.5*S,14*T,2.5*S,2*T);
    if(opts.belt){ctx.fillStyle=pal.boot;ctx.fillRect(4*S,14*T,8*S,1.5*T);}
    const lo=wf===1?-1.2:wf===2?1.2:0;
    const ao=wf===1?1.2:wf===2?-1.2:0;
    ctx.fillStyle=pal.o2;
    ctx.fillRect(3.5*S+ao*S,8*T,2.5*S,7*T);ctx.fillRect(10*S-ao*S,8*T,2.5*S,7*T);
    ctx.fillStyle=pal.o2;
    ctx.fillRect(5*S+lo*S,16*T,3*S,4.5*T);ctx.fillRect(9*S-lo*S,16*T,3*S,4.5*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(5*S+lo*S,19*T,3*S,1.5*T);ctx.fillRect(9*S-lo*S,19*T,3*S,1.5*T);
    ctx.fillStyle=pal.bootSh||pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S-lo*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S-lo*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
    if(opts.cloak){ctx.fillStyle=pal.o2Sh||pal.o2;ctx.beginPath();ctx.moveTo(3*S,8*T);ctx.lineTo(13*S,8*T);ctx.lineTo(14*S,18*T);ctx.lineTo(2*S,18*T);ctx.closePath();ctx.fill();ctx.globalAlpha=0.15;ctx.fillRect(5*S,8*T,6*S,10*T);ctx.globalAlpha=1;}
  }else{
    const flip=dir===3;
    const sx=flip?-1:1;const ox=flip?w:0;
    ctx.save();ctx.translate(ox,0);ctx.scale(sx,1);
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,5*T,4.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.hair;
    ctx.beginPath();ctx.ellipse(8*S,3.5*T,4.8*T,4.2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(3.5*S,1*T,9*S,4*T);
    ctx.fillRect(4*S,0,3*S,2*T);
    ctx.fillStyle=pal.hairHi||pal.hair;
    ctx.fillRect(4.5*S,0.5*T,2*S,1.5*T);
    ctx.fillStyle=pal.hairSh||'rgba(0,0,0,0.1)';
    ctx.fillRect(3.5*S,4.8*T,9*S,0.8*T);
    if(opts.hat){ctx.fillStyle=pal.bootSh||pal.boot;ctx.fillRect(2*S,0,12*S,3.2*T);ctx.fillStyle=pal.boot;ctx.fillRect(2.5*S,0.2*T,11*S,2.6*T);ctx.fillRect(5*S,-2.5*T,6*S,3*T);}
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.ellipse(8*S,5*T,4*T,3.7*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skin;
    ctx.beginPath();ctx.ellipse(8*S,5*T,3.8*T,3.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skinHi||pal.skin;
    ctx.beginPath();ctx.ellipse(7.5*S,4.2*T,2.2*T,1.5*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.skinSh||'rgba(0,0,0,0.06)';
    ctx.beginPath();ctx.ellipse(8*S,7*T,2.5*T,1*T,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=0.5*S;
    ctx.beginPath();ctx.ellipse(7.5*S,4.7*T,1.4*T,1.6*T,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.93)';
    ctx.beginPath();ctx.ellipse(7.5*S,4.7*T,1.3*T,1.5*T,0,0,Math.PI*2);ctx.fill();
    const egS=ctx.createRadialGradient(7.5*S,4.9*T,0.1*T,7.5*S,4.9*T,1*T);
    egS.addColorStop(0,pal.eyeHi||pal.eye);egS.addColorStop(0.5,pal.eye);egS.addColorStop(1,OL);
    ctx.fillStyle=egS;ctx.beginPath();ctx.ellipse(7.5*S,4.9*T,1*T,1.3*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath();ctx.ellipse(7.7*S,5*T,0.7*T,0.9*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.93)';
    ctx.beginPath();ctx.arc(7.1*S,4.4*T,0.4*T,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(7.8*S,5.2*T,0.2*T,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=0.4*S;
    ctx.beginPath();ctx.moveTo(6.3*S,4.1*T);ctx.quadraticCurveTo(7.5*S,3.7*T,8.7*S,4.1*T);ctx.stroke();
    ctx.fillStyle=pal.blush;
    ctx.beginPath();ctx.ellipse(6.2*S,6*T,0.8*T,0.4*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.mouth;
    ctx.beginPath();ctx.ellipse(7.8*S,6.8*T,0.6*T,0.25*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=OL;
    ctx.beginPath();ctx.moveTo(4.5*S,7.8*T);ctx.lineTo(11.5*S,7.8*T);ctx.lineTo(12.2*S,16.2*T);ctx.lineTo(3.8*S,16.2*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1;
    ctx.beginPath();ctx.moveTo(4.5*S,8*T);ctx.lineTo(11.5*S,8*T);ctx.lineTo(12*S,16*T);ctx.lineTo(4*S,16*T);ctx.closePath();ctx.fill();
    ctx.fillStyle=pal.o1Hi||pal.o1;
    ctx.fillRect(6.5*S,8*T,2*S,8*T);
    ctx.fillStyle=pal.o2;ctx.fillRect(4*S,8*T,2.5*S,8*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(4*S,14*T,2.5*S,2*T);
    if(opts.belt){ctx.fillStyle=pal.boot;ctx.fillRect(4*S,14*T,8*S,1.5*T);}
    const lo=wf===1?1.2:wf===2?-1.2:0;
    const ao=wf===1?-1.2:wf===2?1.2:0;
    ctx.fillStyle=pal.o2;
    ctx.fillRect(4.5*S,8*T+ao*T*0.5,2.5*S,7*T);
    ctx.fillStyle=pal.skin;ctx.beginPath();ctx.ellipse(5.75*S,15.5*T+ao*T*0.8,1.1*S,1.1*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.o2;ctx.fillRect(5*S+lo*S,16*T,3*S,4.5*T);ctx.fillRect(9*S,16*T,3*S,4.5*T);
    ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
    ctx.fillRect(5*S+lo*S,19*T,3*S,1.5*T);
    ctx.fillStyle=pal.bootSh||pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S,20.7*T,2.3*S,2*T,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.boot;
    ctx.beginPath();ctx.ellipse(6*S+lo*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(10*S,20.3*T,2.1*S,1.6*T,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  if(opts.cloak&&dir!==2){ctx.fillStyle=pal.o2Sh||pal.o2;ctx.globalAlpha=0.85;ctx.beginPath();ctx.moveTo(3*S,8*T);ctx.lineTo(13*S,8*T);ctx.lineTo(14*S,18*T);ctx.lineTo(2*S,18*T);ctx.closePath();ctx.fill();ctx.globalAlpha=0.12;ctx.fillRect(5*S,8*T,6*S,10*T);ctx.globalAlpha=1;}
  if(opts.staff){ctx.fillStyle='#7a5a3a';ctx.fillRect(14*S,1*T,1.2*S,22*T);ctx.fillStyle=pal.acc;ctx.beginPath();ctx.ellipse(14.6*S,0.5*T,2*T,2*T,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.3)';ctx.beginPath();ctx.arc(14*S,0,0.8*T,0,Math.PI*2);ctx.fill();}
  if(opts.glow){const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.5);g.addColorStop(0,'rgba(100,180,255,0.12)');g.addColorStop(1,'rgba(100,180,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
}

function drawPortrait(ctx,w,h,pal,opts={}){
  ctx.clearRect(0,0,w,h);
  const bg=ctx.createRadialGradient(w/2,h*0.45,w*0.05,w/2,h*0.45,w*0.55);
  bg.addColorStop(0,'#1a1040');bg.addColorStop(1,'#06041a');
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();
  ctx.beginPath();ctx.arc(w/2,h/2+2,w*0.42,0,Math.PI*2);ctx.clip();
  ctx.fillStyle=pal.skin;
  ctx.beginPath();ctx.ellipse(w/2,h*0.48,w*0.33,h*0.31,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=pal.skinHi||pal.skin;
  ctx.beginPath();ctx.ellipse(w*0.48,h*0.38,w*0.22,h*0.16,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=pal.skinSh||pal.skin;
  ctx.beginPath();ctx.ellipse(w*0.5,h*0.6,w*0.28,h*0.12,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=pal.outline||'rgba(20,10,15,0.4)';
  ctx.beginPath();ctx.ellipse(w/2,h*0.25,w*0.4,h*0.29,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=pal.hair;
  ctx.beginPath();ctx.ellipse(w/2,h*0.25,w*0.38,h*0.28,0,0,Math.PI*2);ctx.fill();
  ctx.fillRect(w*0.18,0,w*0.64,h*0.3);
  ctx.fillRect(w*0.12,h*0.1,w*0.76,h*0.2);
  ctx.fillStyle=pal.hairHi||pal.hair;
  ctx.fillRect(w*0.22,0,w*0.18,h*0.14);
  ctx.fillRect(w*0.58,0,w*0.18,h*0.14);
  ctx.fillStyle=pal.hairSh||'rgba(0,0,0,0.08)';
  ctx.fillRect(w*0.2,h*0.22,w*0.6,h*0.08);
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.fillRect(w*0.25,0,w*0.1,h*0.1);
  ctx.fillRect(w*0.62,0,w*0.1,h*0.1);
  if(opts.hat){ctx.fillStyle=pal.bootSh||pal.boot;ctx.fillRect(w*0.1,h*0.02,w*0.8,h*0.16);ctx.fillStyle=pal.boot;ctx.fillRect(w*0.12,h*0.03,w*0.76,h*0.13);ctx.fillRect(w*0.28,h*0.0,w*0.44,h*0.1);if(opts.crown){ctx.fillStyle=pal.acc;ctx.fillRect(w*0.18,h*0,w*0.64,h*0.08);ctx.fillStyle=pal.accHi;ctx.fillRect(w*0.3,h*0.01,w*0.4,h*0.03);}}
  if(opts.hood){ctx.fillStyle=pal.o2;ctx.beginPath();ctx.ellipse(w/2,h*0.18,w*0.4,h*0.22,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=pal.o2Sh;ctx.fillRect(w*0.2,h*0.18,w*0.6,h*0.1);}
  ctx.strokeStyle=pal.outline||'rgba(20,10,15,0.5)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(w*0.36,h*0.42,w*0.13,h*0.12,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(w*0.64,h*0.42,w*0.13,h*0.12,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.93)';
  ctx.beginPath();ctx.ellipse(w*0.36,h*0.42,w*0.12,h*0.11,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(w*0.64,h*0.42,w*0.12,h*0.11,0,0,Math.PI*2);ctx.fill();
  const eg=ctx.createRadialGradient(w*0.36,h*0.44,w*0.01,w*0.36,h*0.44,w*0.09);
  eg.addColorStop(0,pal.eyeHi||pal.eye);eg.addColorStop(0.5,pal.eye);eg.addColorStop(1,pal.outline||'#222');
  ctx.fillStyle=eg;ctx.beginPath();ctx.ellipse(w*0.36,h*0.44,w*0.09,h*0.1,0,0,Math.PI*2);ctx.fill();
  const eg2=ctx.createRadialGradient(w*0.64,h*0.44,w*0.01,w*0.64,h*0.44,w*0.09);
  eg2.addColorStop(0,pal.eyeHi||pal.eye);eg2.addColorStop(0.5,pal.eye);eg2.addColorStop(1,pal.outline||'#222');
  ctx.fillStyle=eg2;ctx.beginPath();ctx.ellipse(w*0.64,h*0.44,w*0.09,h*0.1,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(w*0.37,h*0.45,w*0.055,h*0.075,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(w*0.65,h*0.45,w*0.055,h*0.075,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.93)';
  ctx.beginPath();ctx.arc(w*0.33,h*0.4,w*0.035,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(w*0.61,h*0.4,w*0.035,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(w*0.39,h*0.47,w*0.015,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(w*0.67,h*0.47,w*0.015,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=pal.outline||'rgba(20,10,15,0.5)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(w*0.27,h*0.35);ctx.quadraticCurveTo(w*0.34,h*0.32,w*0.42,h*0.35);ctx.stroke();
  ctx.beginPath();ctx.moveTo(w*0.58,h*0.35);ctx.quadraticCurveTo(w*0.66,h*0.32,w*0.73,h*0.35);ctx.stroke();
  ctx.fillStyle=pal.blush;
  ctx.beginPath();ctx.ellipse(w*0.24,h*0.52,w*0.07,h*0.025,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(w*0.76,h*0.52,w*0.07,h*0.025,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=pal.mouth;
  ctx.beginPath();ctx.ellipse(w*0.5,h*0.58,w*0.055,h*0.018,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.arc(w*0.5,h*0.575,w*0.04,0.15,Math.PI-0.15);ctx.stroke();
  ctx.fillStyle=pal.o1;
  ctx.beginPath();ctx.moveTo(w*0.18,h*0.72);ctx.quadraticCurveTo(w*0.5,h*0.7,w*0.82,h*0.72);ctx.lineTo(w*0.88,h);ctx.lineTo(w*0.12,h);ctx.closePath();ctx.fill();
  ctx.fillStyle=pal.o1Hi||pal.o1;
  ctx.fillRect(w*0.35,h*0.72,w*0.15,h*0.28);
  ctx.fillStyle=pal.o2;
  ctx.fillRect(w*0.12,h*0.72,w*0.16,h*0.28);ctx.fillRect(w*0.72,h*0.72,w*0.16,h*0.28);
  ctx.fillStyle=pal.o2Sh||'rgba(0,0,0,0.08)';
  ctx.fillRect(w*0.12,h*0.9,w*0.16,h*0.1);ctx.fillRect(w*0.72,h*0.9,w*0.16,h*0.1);
  ctx.restore();
  ctx.strokeStyle=pal.acc||pal.outline||'#6a3fff';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(w/2,h/2+2,w*0.42,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(106,63,255,0.2)';ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(w/2,h/2+2,w*0.45,0,Math.PI*2);ctx.stroke();
  if(opts.glow){const g=ctx.createRadialGradient(w/2,h*0.4,0,w/2,h*0.4,w*0.5);g.addColorStop(0,'rgba(100,180,255,0.1)');g.addColorStop(0.6,'rgba(100,180,255,0.03)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
  if(opts.crown){ctx.fillStyle=pal.acc;ctx.fillRect(w*0.2,h*0.02,w*0.6,h*0.08);ctx.fillRect(w*0.28,h*0.0,w*0.12,h*0.08);ctx.fillRect(w*0.44,h*-0.02,w*0.12,h*0.1);ctx.fillRect(w*0.6,h*0.0,w*0.12,h*0.08);ctx.fillStyle=pal.accHi;ctx.fillRect(w*0.3,h*0.03,w*0.4,h*0.03);}
}

function drawEnemyArt(ctx,type,w,h){
  ctx.clearRect(0,0,w,h);
  const S=w/16;
  switch(type){
    case'wolf':case'wolf2':
      ctx.fillStyle='#5a5a6a';
      ctx.beginPath();ctx.ellipse(7*S,9*S,7*S,4*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4a4a5a';
      ctx.beginPath();ctx.ellipse(13*S,7*S,3*S,4*S,-0.3,0,Math.PI*2);ctx.fill();
      ctx.fillRect(13*S,3*S,3*S,4*S);
      ctx.fillStyle='#3a3a4a';ctx.fillRect(14*S,1*S,2*S,3*S);
      ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(14*S,4*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ddd';ctx.beginPath();ctx.arc(15*S,3.5*S,0.5*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff3333';ctx.beginPath();ctx.arc(14*S,4.8*S,0.6*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#3a3a4a';
      ctx.fillRect(2*S,12*S,2*S,3.5*S);ctx.fillRect(6*S,12*S,2*S,3.5*S);ctx.fillRect(10*S,12*S,2*S,3.5*S);
      ctx.fillStyle='#6a6a7a';
      ctx.beginPath();ctx.moveTo(14*S,3*S);ctx.lineTo(16*S,1*S);ctx.lineTo(15.5*S,3*S);ctx.fill();
      ctx.beginPath();ctx.moveTo(13*S,3*S);ctx.lineTo(12*S,0.5*S);ctx.lineTo(14*S,2.5*S);ctx.fill();
      break;
    case'boar':case'boar2':
      ctx.fillStyle='#7a5a3a';
      ctx.beginPath();ctx.ellipse(7*S,8*S,6*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#6a4a2a';
      ctx.beginPath();ctx.ellipse(0,7*S,4*S,3.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#5a3a1a';
      ctx.beginPath();ctx.ellipse(14*S,7*S,3*S,4*S,0.2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#eee';
      ctx.beginPath();ctx.ellipse(0,6.5*S,1.5*S,1*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(0,8.5*S,1.5*S,1*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff8888';ctx.beginPath();ctx.arc(1.5*S,7*S,0.8*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4a3a1a';
      ctx.fillRect(2*S,12*S,2.5*S,3*S);ctx.fillRect(7*S,12*S,2.5*S,3*S);ctx.fillRect(11*S,12*S,2.5*S,3*S);
      ctx.fillStyle='#3a2a10';ctx.beginPath();ctx.ellipse(1*S,3*S,0.8*S,2*S,-0.4,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(3*S,3.5*S,0.8*S,1.8*S,-0.2,0,Math.PI*2);ctx.fill();
      break;
    case'ghost':case'ghost2':
      ctx.fillStyle='rgba(180,180,255,0.15)';
      ctx.beginPath();ctx.ellipse(8*S,10*S,7*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,180,255,0.4)';
      ctx.beginPath();ctx.ellipse(8*S,6*S,5*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillRect(3*S,6*S,10*S,6*S);
      for(let i=0;i<5;i++){
        ctx.fillStyle='rgba(180,180,255,0.25)';
        ctx.beginPath();ctx.ellipse((3+i*2.5)*S,12*S,1.5*S,(2.5+Math.sin(i)*1.5)*S,0,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(100,100,255,0.7)';
      ctx.beginPath();ctx.ellipse(6*S,5.5*S,1.8*S,2.2*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(10*S,5.5*S,1.8*S,2.2*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(40,40,180,0.8)';
      ctx.beginPath();ctx.ellipse(6*S,6*S,1*S,1.3*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(10*S,6*S,1*S,1.3*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.beginPath();ctx.arc(5.5*S,5.2*S,0.5*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(9.5*S,5.2*S,0.5*S,0,Math.PI*2);ctx.fill();
      break;
    case'spider':case'spider2':
      ctx.fillStyle='#3a2a2a';
      ctx.beginPath();ctx.ellipse(8*S,8*S,4*S,3.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff3333';
      ctx.beginPath();ctx.arc(6.5*S,7*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(9.5*S,7*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff6666';
      ctx.beginPath();ctx.arc(6.5*S,6.8*S,0.4*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(9.5*S,6.8*S,0.4*S,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#2a1a1a';ctx.lineWidth=1.5*S;
      for(let i=0;i<4;i++){const a=(i/4)*Math.PI-0.3;
        ctx.beginPath();ctx.moveTo(5*S,(6+i*1.5)*S);ctx.lineTo(Math.cos(a)*6*S+3*S,(2+i*2)*S);ctx.stroke();
        ctx.beginPath();ctx.moveTo(11*S,(6+i*1.5)*S);ctx.lineTo(w-Math.cos(a)*6*S-3*S,(2+i*2)*S);ctx.stroke();}
      break;
    case'serpent':case'dragon':
      ctx.fillStyle='#2a7a5a';
      ctx.beginPath();ctx.ellipse(7*S,8*S,7*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1a6a4a';
      ctx.beginPath();ctx.ellipse(1*S,7*S,3.5*S,3.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(13*S,4*S,3*S,4*S,0.3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff4444';
      ctx.beginPath();ctx.arc(1.5*S,6*S,1.5*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#eee';
      ctx.beginPath();ctx.arc(14*S,3.5*S,1*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1a5a3a';
      for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo((2+i*3)*S,12*S);ctx.lineTo((3+i*3)*S,8*S);ctx.lineTo((4+i*3)*S,12*S);ctx.fill();}
      break;
    case'scorpion':
      ctx.fillStyle='#9a6a3a';
      ctx.beginPath();ctx.ellipse(8*S,8*S,5*S,4*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#7a4a2a';
      ctx.beginPath();ctx.ellipse(3*S,6*S,2.5*S,2.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(13*S,6*S,2.5*S,2.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#6a3a1a';ctx.lineWidth=1.5*S;
      ctx.beginPath();ctx.moveTo(8*S,4*S);ctx.quadraticCurveTo(10*S,-1*S,14*S,1*S);ctx.stroke();
      ctx.fillStyle='#cc3333';
      ctx.beginPath();ctx.arc(14*S,1.5*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#7a4a2a';
      ctx.fillRect(2*S,11*S,1.5*S,3*S);ctx.fillRect(5*S,11.5*S,1.5*S,2.5*S);ctx.fillRect(9*S,11.5*S,1.5*S,2.5*S);ctx.fillRect(12*S,11*S,1.5*S,3*S);
      break;
    case'bandit':
      drawHumanoid(ctx,w,h,PAL.inform,{belt:true,dir:0,wf:0});break;
    case'stager':case'phantom':
      drawHumanoid(ctx,w,h,PAL.ghost,{glow:true,dir:0,wf:0});break;
    case'golem':case'guardian':
      ctx.fillStyle='#6a6a7a';
      ctx.beginPath();ctx.ellipse(8*S,7*S,6*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#8a8a9a';
      ctx.beginPath();ctx.ellipse(8*S,6*S,5*S,4*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#aaddff';
      ctx.beginPath();ctx.ellipse(6*S,5*S,1.5*S,1.8*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(10*S,5*S,1.5*S,1.8*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#5a5a6a';
      ctx.fillRect(3*S,12*S,4*S,5*S);ctx.fillRect(9*S,12*S,4*S,5*S);
      ctx.fillStyle='#4a4a5a';
      ctx.beginPath();ctx.ellipse(2*S,11*S,2*S,2.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(14*S,11*S,2*S,2.5*S,0,0,Math.PI*2);ctx.fill();
      break;
    case'beast':case'root':
      ctx.fillStyle='#4a6a3a';
      ctx.beginPath();ctx.ellipse(8*S,8*S,6*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#3a5a2a';
      ctx.beginPath();ctx.ellipse(1*S,8*S,3*S,3.5*S,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(15*S,7*S,3*S,4*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ff4444';
      ctx.beginPath();ctx.arc(5*S,6*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(11*S,6*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4a3a1a';
      for(let i=0;i<6;i++){const rw=1.5*S+Math.abs(Math.sin(i))*S;ctx.beginPath();ctx.ellipse((1.5+i*2.5)*S,14*S,rw*0.5,3*S+Math.sin(i)*S,0,0,Math.PI*2);ctx.fill();}
      break;
    case'hollow':case'stag':
      ctx.fillStyle='#5a4a3a';
      ctx.beginPath();ctx.ellipse(8*S,8*S,5*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4a3a2a';
      ctx.beginPath();ctx.ellipse(3*S,5*S,2*S,2.5*S,-0.3,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(13*S,5*S,2*S,2.5*S,0.3,0,Math.PI*2);ctx.fill();
      ctx.fillRect(4*S,1*S,2.5*S,3.5*S);ctx.fillRect(10*S,0,2.5*S,4.5*S);
      ctx.fillStyle='#ff3333';
      ctx.beginPath();ctx.arc(6.5*S,7*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(10*S,7*S,1.2*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#2a1a0a';
      ctx.fillRect(3*S,12*S,3*S,5*S);ctx.fillRect(7*S,12*S,3*S,5*S);ctx.fillRect(11*S,12*S,2.5*S,4*S);
      break;
    default:
      ctx.fillStyle='#aa3333';
      ctx.beginPath();ctx.ellipse(8*S,8*S,6*S,6*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#cc5555';
      ctx.beginPath();ctx.ellipse(8*S,7*S,5*S,5*S,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.arc(6*S,6*S,1.5*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(10*S,6*S,1.5*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#222';
      ctx.beginPath();ctx.arc(6.2*S,6.2*S,0.8*S,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(10.2*S,6.2*S,0.8*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#aa3333';
      ctx.beginPath();ctx.ellipse(8*S,10*S,1.5*S,0.8*S,0,0,Math.PI*2);ctx.fill();
  }
}

function initSprites(){
  const charTypes=['player','elder','merchant','child','drunk','mira','smith','guard',
    'ghost','hermit','farmer','hunter','priest','knight','maid','chef',
    'inform','vizier','captain','cook','navigator','scientist','builder','origin','spirit'];
  const opts={
    player:{belt:true},elder:{beard:true,mustache:true},merchant:{vest:true,belt:true},
    child:{},drunk:{mustache:true},mira:{},smith:{belt:true},guard:{armor:true,shield:true},
    ghost:{glow:true},hermit:{staff:true},farmer:{belt:true},hunter:{bow:true,cloak:true},
    priest:{},knight:{armor:true,shield:true},maid:{},chef:{hat:true},
    inform:{belt:true},vizier:{hat:true,crown:true},captain:{armor:true},cook:{hat:true},
    navigator:{},scientist:{},builder:{belt:true},origin:{glow:true,crown:true},spirit:{glow:true}
  };
  const SP_W=48,SP_H=64;
  charTypes.forEach(t=>{
    for(let d=0;d<4;d++){
      for(let f=0;f<3;f++){
        const c=document.createElement('canvas');c.width=SP_W;c.height=SP_H;
        drawHumanoid(c.getContext('2d'),SP_W,SP_H,PAL[t]||PAL.player,{...(opts[t]||{}),dir:d,wf:f});
        SP[t+'_'+d+'_'+f]=c;
      }
    }
    SP[t]=SP[t+'_0_0'];
    const p=document.createElement('canvas');p.width=64;p.height=64;
    drawPortrait(p.getContext('2d'),64,64,PAL[t]||PAL.player,opts[t]||{});
    SP['p_'+t]=p;
  });
  const enemyTypes=['wolf','wolf2','boar','boar2','ghost','ghost2','spider','spider2',
    'serpent','dragon','scorpion','bandit','stager','phantom','golem','guardian',
    'beast','root','hollow','stag'];
  enemyTypes.forEach(t=>{
    const c=document.createElement('canvas');c.width=48;c.height=48;
    drawEnemyArt(c.getContext('2d'),t,48,48);
    SP['e_'+t]=c;
  });
  drawTileTextures();
}

const NPC_SPRITE={
  elder:'elder',merchant:'merchant',child:'child',drunk:'drunk',mira:'mira',smith:'smith',guard:'guard',
  ghost:'ghost',hermit:'hermit',gfarmer:'farmer',ghunter:'hunter',gchild:'child',gpriest:'priest',gmerch:'merchant',
  herb:'hermit',bchild:'child',bhunt:'hunter',bspirit:'spirit',bsurv:'inform',
  fkhnight:'knight',fchef:'chef',fmaid:'maid',fguard:'guard',fscholar:'scientist',
  smerch:'merchant',sinform:'inform',sguard:'guard',swit1:'farmer',svizier:'vizier',
  ccapt:'captain',cfirst:'guard',ccook:'cook',cnav:'navigator',
  xsci:'scientist',xchild:'child',xelder:'elder',xbuilder:'builder',
  zorigin:'origin',zguard:'spirit',zecho:'ghost',
  ghostprior:'ghost',snova:'child',miner:'farmer',sign:'player'
};
const ENEMY_SPRITE_MAP={
  'Wounded Wolf':'wolf','Wild Boar':'boar','Shadow Wolf':'wolf','Forest Spider':'spider',
  'Shadow Stalker':'phantom','Mist Phantom':'ghost','Twisted Deer':'stag',
  'Root Crawler':'root','Hollow Treant':'root','Root Worm':'root','Root Beast':'beast',
  'Crystal Golem':'golem','Dungeon Root Beast':'beast',
  'Frost Specter':'ghost','Glacial Golem':'golem',
  'Sand Scorpion':'scorpion','Desert Bandit':'bandit',
  'Sea Serpent':'serpent','Pirate Ghost':'ghost',
  'Sky Guardian':'golem','Wind Phantom':'phantom',
  'The First Liar':'dragon'
};