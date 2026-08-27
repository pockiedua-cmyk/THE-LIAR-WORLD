let mm,mmx;
function initMinimap(){
  mm=document.getElementById('mm');
  if(mm){mm.width=140;mm.height=140;mmx=mm.getContext('2d');}
}

const ST={phase:'title',p:null,cam:{x:0,y:0},keys:{},mt:0,md:140,gt:0,dt:0,eyeOn:false,cs:null,npc:null,dlgNode:null,dlgNPC:null,lastT:0,particles:[],walkFrame:0,transitioning:false,fadePhase:'none',fadeTimer:0,fadeCallback:null,shakeX:0,shakeY:0,shakeTimer:0,shakeIntensity:0,combatFx:[],attackFlash:0,isMoving:false,camAngle:0,camAngleTarget:0,camLerp:0,_camFrom:0,_camUnwrap:0,renderPX:12,renderPY:18,renderNX:12,renderNY:18,moveT:0,moveDur:140,nearestNPC:null,nearestObj:null};
const GD={};const DLG={};

function gridToScreen(gx,gy){
  const a=(ST.camAngle%4+4)%4;const c=Math.cos(a*Math.PI/2),s=Math.sin(a*Math.PI/2);
  const rx=gx*c+gy*s;const ry=-gx*s+gy*c;
  return{x:(rx-ry)*IW/2,y:(rx+ry)*IH/2};
}
const ISO_MOVE=[
  {w:[0,-1],a:[-1,0],s:[0,1],d:[1,0]},
  {w:[1,0],a:[0,-1],s:[-1,0],d:[0,1]},
  {w:[0,1],a:[1,0],s:[0,-1],d:[-1,0]},
  {w:[-1,0],a:[0,1],s:[1,0],d:[0,-1]}
];

function initPlayer(){
  return{name:'Wanderer',x:12,y:18,dir:0,hp:100,mhp:100,mp:50,mmp:50,xp:0,mxp:100,lv:1,atk:10,def:8,spd:5,mag:6,lck:3,ins:5,gold:0,reg:'pro',map:'vil',inv:[],sk:['Attack','Defend','Heal','Magic Blast'],ev:[],sc:0,se:0,ss:0,bd:[],fq:{},flags:{},dlgS:{},npcM:{},unlocked:['pro'],endings:new Set()};
}

function mp(x,y){const m=getMap();if(!m||y<0||y>=m.map.length||x<0||x>=m.map[0].length)return 3;return parseInt(m.map[y][x])||0;}
function solid(x,y){const t=mp(x,y);if(SOL.has(t))return true;const m=getMap();if(m)for(const n of m.npcs||[])if(n.x===x&&n.y===y)return true;return false;}
function getMap(){return GD[ST.p.reg+'_'+ST.p.map];}
function getNPC(x,y){const m=getMap();if(!m)return null;return(m.npcs||[]).find(n=>n.x===x&&n.y===y);}
function getObj(x,y){const m=getMap();if(!m)return null;return(m.objs||[]).find(o=>o.x===x&&o.y===y);}
function hasF(f){return !!ST.p.flags[f];}
function setF(f,v){ST.p.flags[f]=v===undefined?true:v;}
function hasEv(id){return ST.p.ev.some(e=>e.id===id);}

function addEv(id,title,desc,src,type){
  if(hasEv(id))return;
  ST.p.ev.push({id,title,desc,src,type:type||'physical',ts:Date.now()});
  notify('Evidence: '+title);
  ST.p.sc+=5;
}

function addItem(it){
  const ex=ST.p.inv.find(i=>i.id===it.id);
  if(ex){ex.qty=(ex.qty||1)+1;}else{ST.p.inv.push({...it,qty:1});}
  notify('Obtained: '+it.name);
}

function gxp(amt){
  ST.p.xp+=amt;
  while(ST.p.xp>=ST.p.mxp){
    ST.p.xp-=ST.p.mxp;
    ST.p.lv++;
    ST.p.mxp=Math.floor(ST.p.mxp*1.5);
    ST.p.mhp+=15;ST.p.mmp+=8;
    ST.p.atk+=2;ST.p.def+=1;ST.p.spd+=1;ST.p.mag+=2;ST.p.ins+=1;
    ST.p.hp=ST.p.mhp;ST.p.mp=ST.p.mmp;
    notify('Level Up! Now Lv.'+ST.p.lv);
  }
  uHUD();
}

function uHUD(){
  const p=ST.p;
  document.getElementById('pi').textContent=p.name+' | Lv.'+p.lv;
  document.getElementById('hpB').style.width=(p.hp/p.mhp*100)+'%';
  document.getElementById('mpB').style.width=(p.mp/p.mmp*100)+'%';
  document.getElementById('xpB').style.width=(p.xp/p.mxp*100)+'%';
  document.getElementById('hpT').textContent=p.hp+'/'+p.mhp;
  document.getElementById('mpT').textContent=p.mp+'/'+p.mmp;
  document.getElementById('xpT').textContent=p.xp+'/'+p.mxp;
  document.getElementById('sA').textContent=p.atk;
  document.getElementById('sD').textContent=p.def;
  document.getElementById('sS').textContent=p.spd;
  document.getElementById('sM').textContent=p.mag;
  document.getElementById('sL').textContent=p.lck;
  document.getElementById('sI').textContent=p.ins;
  document.getElementById('sG').textContent=p.gold;
  const m=getMap();
  document.getElementById('ln').textContent=m?m.name:'Unknown';
}

function notify(t){
  const n=document.getElementById('nfy');
  n.textContent=t;n.style.display='block';
  n.style.animation='none';n.offsetHeight;
  n.style.animation='fadeN 3s forwards';
  clearTimeout(n._to);
  n._to=setTimeout(()=>{n.style.display='none';},3000);
}

function showBanner(t,s){
  const b=document.getElementById('ch');
  document.getElementById('cHT').textContent=t;
  document.getElementById('cHS').textContent=s;
  b.style.display='block';b.style.opacity='1';
  b.style.transition='';
  setTimeout(()=>{b.style.transition='opacity 1.5s';b.style.opacity='0';},3000);
  setTimeout(()=>{b.style.display='none';},4500);
}

function startQ(id,name,desc){
  if(!ST.p.fq[id]){ST.p.fq[id]={name,desc,st:'active'};notify('Quest: '+name);}
}
function completeQ(id){if(ST.p.fq[id]){ST.p.fq[id].st='done';notify('Complete: '+ST.p.fq[id].name);}}
function failQ(id){if(ST.p.fq[id])ST.p.fq[id].st='failed';}

function teleport(reg,map,x,y){
  ST.p.reg=reg;ST.p.map=map;ST.p.x=x;ST.p.y=y;
  ST.renderPX=x;ST.renderPY=y;
  R3D.setRegion(reg);
  R3D.buildMap(null,reg+'_'+map);
  R3D.resetCamSnap();
  uHUD();
}

function transitionMap(callback){
  ST.transitioning=true;ST.fadePhase='fadeOut';ST.fadeTimer=0;ST.fadeCallback=callback;
  document.getElementById('fadeOverlay').style.opacity='1';
}

function triggerShake(intensity){
  ST.shakeIntensity=intensity;ST.shakeTimer=200;
}

function addCombatFx(text,color,x,y){
  ST.combatFx.push({text:text,color:color,x:x||window.innerWidth/2,y:y||window.innerHeight*0.35,life:1.5,vy:-1.5});
}

function updateCombatFx(dt){
  for(let i=ST.combatFx.length-1;i>=0;i--){
    const f=ST.combatFx[i];
    f.life-=dt/1000;f.y+=f.vy;
    if(f.life<=0)ST.combatFx.splice(i,1);
  }
}

const REGION_PARTICLES={
  pro:{type:'fireflies',color:'rgba(180,220,100,',count:12,sizeMin:1,sizeMax:3,speed:0.3},
  r1:{type:'leaves',color:'rgba(60,180,80,',count:15,sizeMin:2,sizeMax:4,speed:0.8},
  r2:{type:'mist',color:'rgba(120,140,160,',count:20,sizeMin:8,sizeMax:18,speed:0.2},
  r3:{type:'snow',color:'rgba(200,210,240,',count:25,sizeMin:1,sizeMax:3,speed:0.6},
  r4:{type:'sand',color:'rgba(210,180,120,',count:18,sizeMin:1,sizeMax:3,speed:1.2},
  r5:{type:'embers',color:'rgba(220,80,40,',count:14,sizeMin:1,sizeMax:3,speed:0.5},
  r6:{type:'crystals',color:'rgba(100,180,255,',count:10,sizeMin:2,sizeMax:5,speed:0.15},
  r7:{type:'dark',color:'rgba(140,60,180,',count:16,sizeMin:1,sizeMax:4,speed:0.35}
};

function spawnParticle(reg){return null;}

const LoginUI = {
  mode: 'login',
  currentUser: null,

  switchTab(mode) {
    this.mode = mode;
    document.getElementById('tabLogin').className = mode === 'login' ? 'active' : '';
    document.getElementById('tabRegister').className = mode === 'register' ? 'active' : '';
    document.getElementById('loginTitle').textContent = mode === 'login' ? 'LOGIN' : 'REGISTER';
    document.getElementById('loginSubmit').textContent = mode === 'login' ? 'LOGIN' : 'REGISTER';
    document.getElementById('loginPass2').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('loginErr').textContent = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass2').value = '';
  },

  getUsers() {
    try { return JSON.parse(localStorage.getItem('tlw_users') || '{}'); }
    catch (e) { return {}; }
  },

  saveUsers(users) {
    localStorage.setItem('tlw_users', JSON.stringify(users));
  },

  submit() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const errEl = document.getElementById('loginErr');

    if (!user || user.length < 2) {
      errEl.textContent = 'Username must be at least 2 characters.';
      return;
    }
    if (!pass || pass.length < 3) {
      errEl.textContent = 'Password must be at least 3 characters.';
      return;
    }
    if (user.toLowerCase() === 'guest') {
      errEl.textContent = 'Username "guest" is reserved.';
      return;
    }

    const users = this.getUsers();

    if (this.mode === 'register') {
      const pass2 = document.getElementById('loginPass2').value;
      if (pass !== pass2) {
        errEl.textContent = 'Passwords do not match.';
        return;
      }
      if (users[user]) {
        errEl.textContent = 'Username already taken.';
        return;
      }
      users[user] = { pass: pass, created: Date.now() };
      this.saveUsers(users);
      errEl.style.color = '#6aff6a';
      errEl.textContent = 'Account created! Logging in...';
      setTimeout(() => this.loginAs(user), 800);
    } else {
      if (!users[user]) {
        errEl.textContent = 'Account not found.';
        return;
      }
      if (users[user].pass !== pass) {
        errEl.textContent = 'Wrong password.';
        return;
      }
      this.loginAs(user);
    }
  },

  loginAs(user) {
    this.currentUser = user;
    localStorage.setItem('tlw_current_user', user);
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
    document.getElementById('uiName').textContent = user;
    document.getElementById('userInfo').style.display = 'block';

    // Check if user has a save
    const saveKey = 'tlw_save_' + user;
    if (localStorage.getItem(saveKey)) {
      document.getElementById('loadBtn').style.display = 'inline-block';
    } else {
      document.getElementById('loadBtn').style.display = 'none';
    }
  },

  guestMode() {
    this.currentUser = null;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
    document.getElementById('uiName').textContent = 'Guest';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('loadBtn').style.display = 'none';
  },

  logout() {
    this.currentUser = null;
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginErr').textContent = '';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass2').value = '';
    G.returnToTitle();
    document.getElementById('titleScreen').style.display = 'none';
  },

  getSaveKey() {
    if (this.currentUser) return 'tlw_save_' + this.currentUser;
    return 'tlw_save_guest';
  },

  getRankKey() {
    if (this.currentUser) return 'tlw_rank_' + this.currentUser;
    return 'tlw_rank_guest';
  }
};

// Auto-login if session exists
(function() {
  const lastUser = localStorage.getItem('tlw_current_user');
  if (lastUser) {
    const users = LoginUI.getUsers();
    if (users[lastUser]) {
      setTimeout(() => LoginUI.loginAs(lastUser), 100);
    }
  }
})();

const G = {
startNewGame(){
  ST.p = initPlayer();
  const nm = document.getElementById('nameInput').value.trim();
  if(nm) ST.p.name = nm;
  document.getElementById('titleScreen').style.display='none';
  showUI(true);
  ST.phase='explore';
  ST.p.x=12;ST.p.y=18;
  teleport('pro','vil',12,18);
  showBanner('PROLOGUE','THE BOY WITHOUT HISTORY');
  setTimeout(()=>notify('A stranger wakes up with no memory...'),3500);
},
loadGame(){
  const s=localStorage.getItem(LoginUI.getSaveKey());
  if(!s)return;
  try{
    const d=JSON.parse(s);
    ST.p=Object.assign(initPlayer(),d.p);
    ST.p.endings=new Set(d.endings||[]);
    document.getElementById('titleScreen').style.display='none';
    showUI(true);
    ST.phase='explore';
    teleport(ST.p.reg,ST.p.map,ST.p.x,ST.p.y);
  }catch(e){notify('Load failed.');}
},
saveGame(){
  if(!ST.p)return;
  const d={p:{...ST.p,endings:[...ST.p.endings]}};
  localStorage.setItem(LoginUI.getSaveKey(),JSON.stringify(d));
  notify('Game Saved');
},
showRanking(){
  document.getElementById('rk').style.display='block';
  renderRanking('truth');
},
returnToTitle(){
  ST.phase='title';
  document.getElementById('titleScreen').style.display='none';
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('userInfo').style.display='none';
  showUI(false);
  ['mn','cm','dlg','ev','inv','ql','rk','es'].forEach(id=>{document.getElementById(id).style.display='none';});
  if(LoginUI.currentUser){
    document.getElementById('titleScreen').style.display='flex';
    document.getElementById('userInfo').style.display='block';
  } else {
    document.getElementById('loginScreen').style.display='flex';
  }
},
newGamePlus(){
  const name=ST.p.name;
  const ends=[...ST.p.endings];
  const cnt=(ST.p._ngc||0)+1;
  ST.p=initPlayer();
  ST.p.name=name;ST.p._ngc=cnt;
  ST.p.endings=new Set(ends);
  ST.p.lv+=cnt*5;ST.p.atk+=cnt*5;ST.p.def+=cnt*3;
  ST.p.mag+=cnt*3;ST.p.mhp+=cnt*50;ST.p.mmp+=cnt*25;
  ST.p.hp=ST.p.mhp;ST.p.mp=ST.p.mmp;ST.p.ins+=cnt*2;
  document.getElementById('es').style.display='none';
  ST.phase='explore';
  teleport('pro','vil',12,18);
  showBanner('NEW GAME+','Cycle '+(cnt+1)+' begins...');
  showUI(true);
},
triggerEnding(id,title,type,txt){
  ST.p.endings.add(id);
  ST.phase='ending';
  document.getElementById('es').style.display='flex';
  document.getElementById('eT').textContent=title;
  document.getElementById('eTy').textContent=type;
  document.getElementById('eTx').innerHTML=txt;
  document.getElementById('ngBtn').style.display='block';
}
};

function showUI(show){
  ['hud','sp','ctl','mm','cmp'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display=show?'block':'none';});
}

function renderRanking(cat){
  const tabs=document.getElementById('rTb');
  const tbl=document.getElementById('rT');
  tabs.innerHTML='';
  [{id:'truth',l:'Truth Score'},{id:'cases',l:'Cases Solved'},{id:'level',l:'World Level'},
   {id:'insight',l:'Insight'},{id:'bosses',l:'Secret Boss'},{id:'artifacts',l:'Artifacts'}].forEach(c=>{
    const b=document.createElement('button');
    b.className='btn btn-sm';if(c.id===cat)b.style.borderColor='#ffaa00';
    b.textContent=c.l;b.onclick=()=>renderRanking(c.id);tabs.appendChild(b);
  });
  tbl.innerHTML='';
  const names=['ShadowSeeker','TruthWalker','LieHunter','FactBreaker','RealityMage','VoidGazer',
    'ProofMaster','DarkScholar','LightBringer','SilentJudge','DeepThinker','FateReader',
    'DoubtKing','ClueMaster','WisdomHunter','MysticEye','GhostTalker','SecretKeeper','MindReader','WarTeller'];
  let entries=names.map(nm=>({nm,s:Math.floor(Math.random()*500)+50,p:false}));
  const ps={truth:ST.p?ST.p.sc:0,cases:ST.p?ST.p.ss:0,level:ST.p?ST.p.lv:1,
    insight:ST.p?ST.p.ins:5,bosses:ST.p?(ST.p.bd||[]).length:0,
    artifacts:ST.p?ST.p.ev.length:0};
  entries.push({nm:ST.p?ST.p.name:'Wanderer',s:ps[cat]||0,p:true});
  entries.sort((a,b)=>b.s-a.s);
  const medals=['🥇','🥈','🥉'];
  entries.forEach((e,i)=>{
    const r=document.createElement('div');
    r.className='rr'+(e.p?' pr':'');
    r.innerHTML=`<span class="rp">${i<3?medals[i]:'#'+(i+1)}</span><span class="rna">${e.nm}</span><span class="rs">${e.s}</span>`;
    tbl.appendChild(r);
  });
}

const UI = {
openEv(){document.getElementById('ev').style.display='block';renderEvBoard();},
closeEv(){document.getElementById('ev').style.display='none';},
openInv(){document.getElementById('inv').style.display='block';renderInv();},
closeInv(){document.getElementById('inv').style.display='none';},
openQl(){document.getElementById('ql').style.display='block';renderQL();},
closeQl(){document.getElementById('ql').style.display='none';},
openMn(){document.getElementById('mn').style.display='flex';},
closeMn(){document.getElementById('mn').style.display='none';},
closeRk(){document.getElementById('rk').style.display='none';}
};
G.ui=UI;

function renderEvBoard(){
  ['evN','evP','evD','evT'].forEach(id=>{
    const c=document.getElementById(id);
    while(c.children.length>1)c.removeChild(c.lastChild);
  });
  (ST.p.ev||[]).forEach(e=>{
    const el=document.createElement('div');el.className='ei';
    el.innerHTML=`<div class="et">${e.t||e.title}</div><div class="ed">${e.d||e.desc}</div><div class="es">Source: ${e.s||e.src}</div>`;
    el.onclick=()=>el.classList.toggle('sel');
    const cols={npc:'evN',physical:'evP',document:'evD',combat:'evP',boss:'evP'};
    document.getElementById(cols[e.type]||'evP').appendChild(el);
  });
  const tc=document.getElementById('evT');
  Object.entries(ST.p.flags||{}).filter(([k])=>k.startsWith('theory_')).forEach(([k,v])=>{
    const el=document.createElement('div');el.className='ei';
    el.innerHTML=`<div class="et">${k.replace('theory_','').replace(/_/g,' ')}</div><div class="ed">${v}</div>`;
    tc.appendChild(el);
  });
  if((ST.p.ev||[]).length===0){
    const el=document.createElement('div');el.className='ei';
    el.innerHTML='<div class="et" style="color:#6a6a8a">No evidence collected yet. Explore the world and investigate objects.</div>';
    document.getElementById('evP').appendChild(el);
  }
}

function renderInv(){
  const g=document.getElementById('iG');g.innerHTML='';
  for(let i=0;i<24;i++){
    const s=document.createElement('div');s.className='is';
    if(ST.p.inv[i]){
      const it=ST.p.inv[i];
      s.innerHTML=`<span>${it.icon}</span><span class="in">${it.nm||it.name}</span>${(it.qty||1)>1?'<span class="iq">x'+it.qty+'</span>':''}`;
      s.title=it.desc||'';
    }
    g.appendChild(s);
  }
}

function renderQL(){
  const l=document.getElementById('qL');l.innerHTML='';
  const qs=Object.entries(ST.p.fq||{});
  if(!qs.length){l.innerHTML='<div style="padding:20px;color:#6a6a8a;text-align:center;">No active quests.</div>';return;}
  qs.forEach(([id,q])=>{
    const el=document.createElement('div');el.className='qi';
    const sc=q.st==='done'?'qc':q.st==='failed'?'qf':'qa';
    el.innerHTML=`<div class="qn">${q.name}</div><div class="qd">${q.desc}</div><div class="qs ${sc}">${q.st.toUpperCase()}</div>`;
    l.appendChild(el);
  });
}

function openDlg(npcId,text,choices){
  ST.phase='dialogue';
  ST.dlgNPC=npcId;
  document.getElementById('dlg').style.display='flex';
  document.getElementById('dS').textContent=getNPCName(npcId);
  document.getElementById('dT').textContent=text;
  const pc=document.getElementById('dP');const pctx=pc.getContext('2d');
  pctx.clearRect(0,0,64,64);
  const sType=NPC_SPRITE[npcId]||NPC_SPRITE[Object.keys(NPC_SPRITE).find(k=>npcId.startsWith(k))]||'player';
  const portrait=SP['p_'+sType];
  if(portrait)pctx.drawImage(portrait,0,0,64,64);
  const cc=document.getElementById('dC');cc.innerHTML='';
  if(choices&&choices.length){
    choices.forEach(ch=>{
      const b=document.createElement('button');b.className='ch';
      let label=ch.text;
      if(ch.ev&&!hasEv(ch.ev))label+=' <span class="ev-tag">[Evidence Required]</span>';
      if(ch.req&&!ST.p.flags[ch.req])label+=' <span class="ev-tag" style="color:#ff6a6a">[Locked]</span>';
      b.innerHTML=label;
      if((ch.ev&&!hasEv(ch.ev))||(ch.req&&!ST.p.flags[ch.req]))b.classList.add('lk');
      else b.onclick=()=>{
        if(ch.ev)addEv(ch.ev,ch.ev.replace(/_/g,' '),ch.desc||'Evidence collected.',getNPCName(npcId),'npc');
        if(ch.start)startQ(ch.start,ch.start.replace(/_/g,' '),'Investigate further.');
        if(ch.end){closeDlg();return;}
        if(ch.next!==undefined&&DLG[npcId]&&DLG[npcId][ch.next]){
          const nd=DLG[npcId][ch.next];
          openDlg(npcId,nd.txt,nd.ch);
        } else closeDlg();
      };
      cc.appendChild(b);
    });
    if(!cc.querySelector('.ch:not(.lk)')){
      const lv=document.createElement('button');lv.className='ch';lv.textContent='[Leave]';
      lv.onclick=closeDlg;cc.appendChild(lv);
    }
  } else {
    const b=document.createElement('button');b.className='ch';b.textContent='[Continue]';
    b.onclick=closeDlg;cc.appendChild(b);
  }
}

function closeDlg(){
  ST.phase='explore';
  document.getElementById('dlg').style.display='none';
  ST.dlgNPC=null;
  const pc=document.getElementById('dP');if(pc)pc.getContext('2d').clearRect(0,0,64,64);
}

function getNPCName(id){
  const m=getMap();if(!m)return id;
  const n=(m.npcs||[]).find(n=>n.id===id);
  return n?n.nm:id;
}

function interact(){
  const nx=ST.p.x+[[0,-1],[1,0],[0,1],[-1,0]][ST.p.dir][0];
  const ny=ST.p.y+[[0,-1],[1,0],[0,1],[-1,0]][ST.p.dir][1];
  const npc=getNPC(nx,ny);
  if(npc){
    const dlg=DLG[npc.id];
    if(dlg&&dlg[0]){
      if(npc.id==='ghost'&&ST.p.ins<8){
        openDlg(npc.id,'... You lack the insight to perceive me fully. Come back when you are wiser.',[]);
        return;
      }
      if(npc.id==='bspirit'&&ST.p.ins<10){
        openDlg(npc.id,'The spirit cannot communicate with your current understanding.',[]);
        return;
      }
      openDlg(npc.id,dlg[0].txt,dlg[0].ch);
    } else {
      openDlg(npc.id,'...',[]);
    }
    return;
  }
  const obj=getObj(nx,ny);
  if(obj){
    if(obj.tp==='invest'&&obj.evid){
      const evData={
        burned_house:{t:'Burned House',d:'Fire started here. Scorch marks suggest accelerant used.',s:'Village'},
        destroyed_shop:{t:'Destroyed Shop',d:'Shop was emptied BEFORE the fire. Goods removed systematically.',s:'Village'},
        human_arrows:{t:'Human-Made Arrows',d:'Arrows with Royal Crest. Not bandit weapons.',s:'Village'},
        wolf_tracks:{t:'Wolf Tracks',d:'Large canine prints near the village edge.',s:'Village'},
        oil_barrel:{t:'Oil Barrel',d:'Oil used as accelerant. Deliberately placed.',s:'Village'},
        royal_crest:{t:'Royal Crest',d:'The symbol of the royal family on arrows found at the scene.',s:'Village'},
        torn_banner:{t:'Torn Banner',d:'A banner from the old kingdom. Recently torn.',s:'Forest'},
        old_campfire:{t:'Cold Campfire',d:'Someone camped here recently. Multiple boot prints.',s:'Forest'},
        carved_stone:{t:'Carved Stone',d:'Ancient symbols. They match the Witch Queen legends.',s:'Forest'},
        empty_pedestal:{t:'Empty Pedestal',d:'The Heart Seed was here. Roots show it was recently removed.',s:'Greenfall'},
        torn_roots:{t:'Torn Roots',d:'The tree was pulled, not uprooted. Deliberate removal.',s:'Greenfall'},
        founders_diary:{t:"Founder's Diary",d:'Describes the Heart Seed as sentient. It can move on its own.',s:'Church'},
        ancient_altar:{t:'Ancient Altar',d:'Cracks forming. Something stirs below.',s:'Church'},
        church_blood:{t:'Old Blood Stain',d:'Blood from decades ago. Someone was hurt here.',s:'Church'},
        life_crystal:{t:'Life Crystal',d:'Contains concentrated life energy. Connected to the Heart Seed.',s:'Cavern'},
        massive_root:{t:'Massive Root',d:'The root system extends far below the surface.',s:'Cavern'},
        empty_cabin:{t:'Empty Cabin',d:'The Witch Queen may have lived here. Herbs and remedies found.',s:'Blackwood'},
        animal_bones:{t:'Animal Bones',d:'Cleaned and prepared. Someone lived here and ate well.',s:'Blackwood'},
        healing_herbs:{t:'Healing Herbs',d:'Rare healing herbs. Expert knowledge required to find them.',s:'Blackwood'},
        child_drawing:{t:'Child Drawing',d:'Shows a woman with antlers. The Witch Queen.',s:'Blackwood'},
        unmarked_grave:{t:'Unmarked Grave',d:'Fresh flowers suggest someone still visits.',s:'Blackwood'},
        empty_throne:{t:'Empty Throne',d:'The throne has not been sat upon in years. Dust covers the seat.',s:'Frostholm'},
        throne_letter:{t:'Letter on Throne',d:'A letter from the Queen. Dated 200 years ago. The handwriting matches current "royal" letters.',s:'Frostholm'},
        frozen_flowers:{t:'Frozen Flowers',d:'Flowers frozen mid-bloom. Magical preservation.',s:'Frostholm'},
        sultan_crime:{t:'Crime Scene',d:'The Sultan died here. No visible cause of death.',s:'Sol Desert'},
        sunset_shadow:{t:'Shadow Analysis',d:'Based on shadow positions, the time of death was 3 hours before discovery.',s:'Sol Desert'},
        bloody_dagger:{t:'Bloody Dagger',d:'Blood type doesn\'t match the Sultan. Someone else was wounded.',s:'Sol Desert'},
        torn_letter:{t:'Torn Letter',d:'Fragment mentions "the plan must succeed tonight."',s:'Sol Desert'},
        ship_log:{t:'Ship Log',d:'The Captain has altered the course multiple times. True destination unknown.',s:'Crimson Sea'},
        leviathan_mark:{t:'Leviathan Mark',d:'Ancient carving showing a ship-like creature.',s:'Crimson Sea'},
        star_chart:{t:'Star Chart',d:'Stars don\'t match any known constellation. Points to unknown location.',s:'Crimson Sea'},
        ancient_engine:{t:'Ancient Engine',d:'Technology far beyond current civilization. Still partially functional.',s:'Sky Ruins'},
        gravity_stone:{t:'Gravity Stone',d:'Defies natural law. Connected to the engine below.',s:'Sky Ruins'},
        child_blueprint:{t:'Child Blueprint',d:'A child accurately drew the engine. Either genius or remembers.',s:'Sky Ruins'},
        throne_of_origin:{t:'Throne of Origin',d:'The seat where reality was first rewritten.',s:'Kingdom Zero'},
        first_lie_altar:{t:'First Lie Altar',d:'Where the First Lie was spoken into existence.',s:'Kingdom Zero'},
        truth_shard:{t:'Truth Shard',d:'A fragment of pure truth. The only thing lies cannot corrupt.',s:'Kingdom Zero'}
      };
      const ev=evData[obj.evid];
      if(ev)addEv(obj.evid,ev.t,ev.d,ev.s,'physical');
      else addEv(obj.evid,obj.nm,'Evidence found.',obj.nm,'physical');
    }
    if(obj.tp==='sign'){
      openDlg('sign',obj.text||'An old sign.',[]);
    }
    if(obj.tp==='chest'&&!ST.p.flags['chest_'+obj.id]){
      setF('chest_'+obj.id);
      if(obj.item){
        addItem(obj.item);
        obj.em='📦';
      }
    }
    if(obj.tp==='stairs'&&obj.tr){
      teleport(obj.r||ST.p.reg,obj.tr,obj.tx||5,obj.ty||5);
      notify('Entering '+(getMap()||{}).name+'...');
    }
    if(obj.tp==='well'&&!ST.p.flags['well_'+obj.id]){
      setF('well_'+obj.id);
      if(ST.p.ins>=6){
        addEv('well_secret','Well Secret','Something mechanical at the bottom of the well.','Well Investigation','physical');
      } else {
        notify('You see something glinting but can\'t make it out. (Need Insight 6)');
      }
    }
  }
}

function startCombat(enemy){
  ST.phase='combat';
  const e={...enemy,curHp:enemy.hp};
  ST.cs={e,log:[],pTurn:ST.p.spd>=e.sp2,defending:false,turns:0};
  document.getElementById('cm').style.display='block';
  const spEl=document.getElementById('cmS');
  const eSprKey=ENEMY_SPRITE_MAP[e.nm]||e.nm.toLowerCase().replace(/\s+/g,'');
  const eSpr=SP['e_'+eSprKey];
  if(eSpr){spEl.innerHTML='';const cv=document.createElement('canvas');cv.width=160;cv.height=160;cv.style.imageRendering='pixelated';cv.getContext('2d').drawImage(eSpr,0,0,160,160);spEl.appendChild(cv);}
  else{spEl.textContent=e.sp;}
  document.getElementById('cmN').textContent=e.nm;
  updateCombat();
}

function updateCombat(){
  const cs=ST.cs;if(!cs)return;
  const e=cs.e;
  document.getElementById('cmH').style.width=(e.curHp/e.hp*100)+'%';
  document.getElementById('cmHT').textContent='HP: '+e.curHp+'/'+e.hp;
  document.getElementById('cmL').innerHTML=cs.log.map(l=>`<p class="${l.c}">${l.t}</p>`).join('');
  document.getElementById('cmL').scrollTop=99999;
  const a=document.getElementById('cmA');a.innerHTML='';
  if(cs.pTurn){
    ST.p.sk.forEach(s=>{
      const b=document.createElement('button');b.className='btn btn-sm';b.textContent=s;
      b.onclick=()=>pAction(s);a.appendChild(b);
    });
    if(ST.p.mp>=15){
      const b=document.createElement('button');b.className='btn btn-sm';
      b.textContent='Eye of Truth (15MP)';b.style.borderColor='#aa6aff';
      b.onclick=()=>pAction('Eye of Truth');a.appendChild(b);
    }
  } else {
    const b=document.createElement('button');b.className='btn btn-sm';b.textContent='Enemy turn...';b.disabled=true;
    a.appendChild(b);
  }
}

function pAction(sk){
  const cs=ST.cs;if(!cs||!cs.pTurn)return;
  const p=ST.p,e=cs.e;
  let dmg=0;
  if(sk==='Attack'){
    dmg=Math.max(1,p.atk+Math.floor(Math.random()*5)-e.df/2|0);
    e.curHp-=dmg;
    cs.log.push({t:`You attack for ${dmg} damage!`,c:'dm'});
    addCombatFx('-'+dmg,'#ff6644',window.innerWidth/2+30,window.innerHeight*0.28);ST.attackFlash=200;triggerShake(4);
  } else if(sk==='Magic Blast'){
    if(p.mp<10){cs.log.push({t:'Not enough MP!',c:'nf'});updateCombat();return;}
    p.mp-=10;
    dmg=Math.max(1,p.mag*2+Math.floor(Math.random()*8));
    e.curHp-=dmg;
    cs.log.push({t:`Magic Blast hits for ${dmg}!`,c:'dm'});
    addCombatFx('-'+dmg,'#66aaff',window.innerWidth/2+30,window.innerHeight*0.28);ST.attackFlash=300;triggerShake(6);
  } else if(sk==='Defend'){
    cs.defending=true;
    cs.log.push({t:'You brace yourself.',c:'nf'});
  } else if(sk==='Heal'){
    if(p.mp<12){cs.log.push({t:'Not enough MP!',c:'nf'});updateCombat();return;}
    p.mp-=12;
    const h=20+p.mag*2;
    p.hp=Math.min(p.mhp,p.hp+h);
    cs.log.push({t:`Healed ${h} HP.`,c:'hl'});
    addCombatFx('+'+h,'#44ff66',window.innerWidth/2-30,window.innerHeight*0.6);
  } else if(sk==='Eye of Truth'){
    if(p.mp<15){cs.log.push({t:'Not enough MP!',c:'nf'});updateCombat();return;}
    p.mp-=15;
    if(e.tw){
      e.curHp=0;
      cs.log.push({t:'Eye of Truth reveals the weakness! '+e.nm+' is devastated!',c:'nf'});
      document.getElementById('eo').style.display='block';
      setTimeout(()=>{document.getElementById('eo').style.display='none';},1000);
    } else {
      dmg=5;e.curHp-=dmg;
      cs.log.push({t:'Eye of Truth reveals minor detail. '+dmg+' damage.',c:'nf'});
      addCombatFx('-'+dmg,'#cc66ff',window.innerWidth/2+30,window.innerHeight*0.28);triggerShake(3);
    }
  }
  uHUD();
  if(e.curHp<=0){
    cs.log.push({t:e.nm+' defeated!',c:'nf'});
    updateCombat();
    setTimeout(()=>{
      document.getElementById('cm').style.display='none';
      ST.phase='explore';ST.cs=null;
      gxp(e.xp||20);
      if(e.gld){ST.p.gold+=e.gld;notify('+'+e.gld+' gold');}
      if(e.ev&&e.ev.id){addEv(e.ev.id,e.ev.t,e.ev.d,e.ev.s,e.ev.type||'physical');}
      if(e.boss){ST.p.bd.push(e.nm);notify('Boss Defeated: '+e.nm);}
      ST.p.bd=[...new Set(ST.p.bd||[])];
    },1000);
    return;
  }
  cs.pTurn=false;
  updateCombat();
  setTimeout(eTurn,800);
}

function eTurn(){
  const cs=ST.cs;if(!cs)return;
  const e=cs.e,p=ST.p;
  const atks=e.atk||[{nm:'Attack',pw:e.at}];
  const at=atks[Math.floor(Math.random()*atks.length)];
  let dmg=Math.max(1,(at.pw||e.at)+Math.floor(Math.random()*4)-(cs.defending?p.def*2:p.def)/2|0);
  if(at.mg)dmg=Math.max(1,(at.pw||e.at)+Math.floor(Math.random()*4)-p.def/3|0);
  p.hp-=dmg;
  cs.log.push({t:e.nm+' uses '+at.nm+' for '+dmg+'!',c:'dm'});
  addCombatFx('-'+dmg,'#ff4444',window.innerWidth/2-30,window.innerHeight*0.6);triggerShake(3);
  cs.defending=false;
  if(p.hp<=0){
    p.hp=0;cs.log.push({t:'You have fallen...',c:'dm'});
    updateCombat();
    setTimeout(()=>{
      document.getElementById('cm').style.display='none';
      p.hp=Math.floor(p.mhp*0.3);p.mp=Math.floor(p.mmp*0.5);
      ST.phase='explore';ST.cs=null;
      notify('You barely survived.');
      uHUD();
    },1200);
    return;
  }
  cs.pTurn=true;cs.turns++;
  uHUD();updateCombat();
}

function render(){
  if(ST.phase==='title'||ST.phase==='ending'){
    R3D.render();
    return;
  }
  const m=getMap();if(!m)return;
  const p=ST.p;
  if(ST.camLerp<1){
    ST.camLerp=Math.min(1,ST.camLerp+0.06);
    const ease=ST.camLerp<0.5?2*ST.camLerp*ST.camLerp:1-Math.pow(-2*ST.camLerp+2,2)/2;
    ST.camAngle=ST._camFrom+(ST.camAngleTarget-ST._camFrom)*ease;
  }else{
    ST.camAngle=ST.camAngleTarget;
  }
  R3D.setCamera(ST.renderPX,ST.renderPY,ST.camAngle*Math.PI/2);
  R3D.updateNPCs(m.npcs,ST.renderPX,ST.renderPY,ST.nearestNPC);
  R3D.updateObjs(m.objs,ST.nearestObj,ST.eyeOn);
  R3D.updatePlayer(ST.renderPX,ST.renderPY,p.dir,ST.isMoving,ST.walkFrame,p.name);
  R3D.updateParticles(ST.p.reg);
  R3D.eyeOfTruth(ST.eyeOn);
  if(ST.shakeTimer>0){
    R3D.shake(ST.shakeIntensity);
  }
  R3D.render();
  renderMinimap(m);
  renderCompass();
}

function renderCompass(){
  const cc=document.getElementById('cmp');
  if(!cc)return;
  const x=cc.getContext('2d');
  const w=52,h=52,cx2=26,cy2=26;
  x.clearRect(0,0,w,h);
  x.fillStyle='rgba(10,5,20,0.8)';x.beginPath();x.arc(cx2,cy2,25,0,Math.PI*2);x.fill();
  x.strokeStyle='#3a2a5a';x.lineWidth=1;x.beginPath();x.arc(cx2,cy2,24,0,Math.PI*2);x.stroke();
  const dirs=['N','E','S','W'];
  const arrow=((ST._camUnwrap||0)%4+4)%4;
  for(let i=0;i<4;i++){
    const a=(i-arrow)*Math.PI/2-Math.PI/2;
    const isN=i===0;
    x.fillStyle=isN?'#ff6666':'#5a5a7a';
    x.font=isN?'bold 9px monospace':'7px monospace';
    x.textAlign='center';x.textBaseline='middle';
    const tx=cx2+Math.cos(a)*16;const ty=cy2+Math.sin(a)*16;
    x.fillText(dirs[i],tx,ty);
  }
  x.fillStyle='#88ccff';x.beginPath();x.moveTo(cx2,cy2-8);x.lineTo(cx2+3,cy2+4);x.lineTo(cx2-3,cy2+4);x.closePath();x.fill();
}

function renderMinimap(m){
  if(!mmx)return;
  mmx.fillStyle='rgba(0,0,0,0.8)';mmx.fillRect(0,0,140,140);
  const rows=m.map.length;const cols=m.map[0].length;
  let minSX=Infinity,maxSX=-Infinity,minSY=Infinity,maxSY=-Infinity;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const s=gridToScreen(c,r);
    if(s.x<minSX)minSX=s.x;if(s.x>maxSX)maxSX=s.x;
    if(s.y<minSY)minSY=s.y;if(s.y>maxSY)maxSY=s.y;
  }
  const rw=maxSX-minSX+IW;const rh=maxSY-minSY+IH+MAX_TH;
  const sc=Math.min(136/rw,136/rh);
  const ox=(140-rw*sc)/2-minSX*sc;const oy=(140-rh*sc)/2-minSY*sc;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const t=parseInt(m.map[r][c])||0;
      if(t===3||t===4||t===6||t===31||t===32||t===35)mmx.fillStyle='#333';
      else if(t===2)mmx.fillStyle='#1a3a5a';
      else if(t===0||t===13||t===16)mmx.fillStyle='#1a3a1a';
      else if(t===19||t===20)mmx.fillStyle='#8a7a5a';
      else mmx.fillStyle='#2a4a2a';
      const s=gridToScreen(c,r);
      mmx.fillRect(ox+s.x*sc-1,oy+s.y*sc,2,2);
    }
  }
  (m.npcs||[]).forEach(n=>{
    mmx.fillStyle='#ffaa00';const s=gridToScreen(n.x,n.y);
    mmx.fillRect(ox+s.x*sc-1,oy+s.y*sc-1,3,3);
  });
  mmx.fillStyle='#4488ff';const ps=gridToScreen(ST.p.x,ST.p.y);
  mmx.fillRect(ox+ps.x*sc-1,oy+ps.y*sc-1,4,4);
}

function update(){
  if(ST.shakeTimer>0){ST.shakeTimer-=16;if(ST.shakeTimer<=0)R3D.clearShake();}
  if(ST.transitioning){
    ST.fadeTimer+=16;
    if(ST.fadePhase==='fadeOut'&&ST.fadeTimer>=300){
      ST.fadePhase='fadeIn';ST.fadeTimer=0;
      if(ST.fadeCallback)ST.fadeCallback();ST.fadeCallback=null;
    }
    if(ST.fadePhase==='fadeIn'&&ST.fadeTimer>=300){
      ST.transitioning=false;ST.fadePhase='none';
      document.getElementById('fadeOverlay').style.opacity='0';
    }
    return;
  }
  if(ST.phase!=='explore')return;
  if(!ST._camUnwrap)ST._camUnwrap=0;
  if(ST.keys['z']&&!ST._zdown){ST._camFrom=ST.camAngle;ST._camUnwrap--;ST.camAngleTarget=ST._camUnwrap;ST.camLerp=0;ST._zdown=true;}
  if(ST.keys['c']&&!ST._cdown){ST._camFrom=ST.camAngle;ST._camUnwrap++;ST.camAngleTarget=ST._camUnwrap;ST.camLerp=0;ST._cdown=true;}
  if(!ST.keys['z'])ST._zdown=false;
  if(!ST.keys['c'])ST._cdown=false;
  const now=Date.now();
  if(now-ST.mt<ST.md)return;
  const p=ST.p;
  let dx=0,dy=0,moved=false;
  const ai=((Math.round(ST.camAngle)%4)+4)%4;
  const mv=ISO_MOVE[ai];
  if(ST.keys['w']||ST.keys['arrowup']){dx=mv.w[0];dy=mv.w[1];p.dir=(0+ai)%4;moved=true;}
  else if(ST.keys['s']||ST.keys['arrowdown']){dx=mv.s[0];dy=mv.s[1];p.dir=(2+ai)%4;moved=true;}
  else if(ST.keys['a']||ST.keys['arrowleft']){dx=mv.a[0];dy=mv.a[1];p.dir=(3+ai)%4;moved=true;}
  else if(ST.keys['d']||ST.keys['arrowright']){dx=mv.d[0];dy=mv.d[1];p.dir=(1+ai)%4;moved=true;}
  ST.isMoving=moved;
  if(moved){
    ST.renderNX=p.x+dx;ST.renderNY=p.y+dy;
    const nx=p.x+dx;const ny=p.y+dy;
    if(!solid(nx,ny)){
      ST.renderPX=p.x;ST.renderPY=p.y;ST.moveT=0;
      p.x=nx;p.y=ny;
      ST.mt=now;ST.walkFrame=(ST.walkFrame+1)%3;
      const conn=getMap()?(getMap().conn||[]).find(c=>c.x===p.x&&c.y===p.y):null;
      if(conn){
        if(conn.r==='r1'&&conn.m==='gf'&&!ST.p.unlocked.includes('r1')){
          ST.p.unlocked.push('r1');showBanner('BAB 1','GREENFALL');
        }
        if(conn.r==='r2'&&conn.m==='bw'&&!ST.p.unlocked.includes('r2')){
          ST.p.unlocked.push('r2');showBanner('BAB 2','BLACKWOOD FOREST');
        }
        if(conn.r==='r3'&&!ST.p.unlocked.includes('r3')){
          ST.p.unlocked.push('r3');showBanner('BAB 3','FROSTHOLM');
        }
        if(conn.r==='r4'&&!ST.p.unlocked.includes('r4')){
          ST.p.unlocked.push('r4');showBanner('BAB 4','SOL DESERT');
        }
        if(conn.r==='r5'&&!ST.p.unlocked.includes('r5')){
          ST.p.unlocked.push('r5');showBanner('BAB 5','CRIMSON SEA');
        }
        if(conn.r==='r6'&&!ST.p.unlocked.includes('r6')){
          ST.p.unlocked.push('r6');showBanner('BAB 6','SKY RUINS');
        }
        if(conn.r==='r7'&&!ST.p.unlocked.includes('r7')){
          ST.p.unlocked.push('r7');showBanner('BAB 7','KINGDOM ZERO');
        }
        transitionMap(()=>{
          teleport(conn.r,conn.m,conn.tx,conn.ty);
          notify((getMap()||{}).name||'New Area');
        });
      }
      if(Math.random()<0.08&&p.lv>1){
        const m=getMap();
        if(m&&m.re&&m.re.length){
          const en=m.re[Math.floor(Math.random()*m.re.length)];
          const scaled={...en};scaled.hp+=p.lv*3;scaled.at+=p.lv;
          startCombat(scaled);
        }
      }
    }
    uHUD();
  }
  ST.nearestNPC=null;ST.nearestObj=null;
  if(ST.phase==='explore'){
    const mm=getMap();
    if(mm){
      let bestD=Infinity;
      (mm.npcs||[]).forEach(n=>{
        const d=Math.abs(n.x-p.x)+Math.abs(n.y-p.y);
        if(d<=2&&d<bestD){bestD=d;ST.nearestNPC=n;}
      });
      bestD=Infinity;
      (mm.objs||[]).forEach(o=>{
        const d=Math.abs(o.x-p.x)+Math.abs(o.y-p.y);
        if(d<=2&&d<bestD){bestD=d;ST.nearestObj=o;}
      });
    }
  }
  const lerpSpeed=Math.min(1,ST.dt/60);
  ST.renderPX+=(p.x-ST.renderPX)*Math.min(1,lerpSpeed*14);
  ST.renderPY+=(p.y-ST.renderPY)*Math.min(1,lerpSpeed*14);
}

document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  ST.keys[k]=true;
  if(k==='e'){
    if(ST.phase==='explore')interact();
    else if(ST.phase==='dialogue')return;
  }
  if(k==='escape'){
    e.preventDefault();
    if(ST.phase==='dialogue')closeDlg();
    else if(ST.phase==='explore')UI.openMn();
    else if(document.getElementById('mn').style.display==='flex')UI.closeMn();
    else if(document.getElementById('ev').style.display==='block')UI.closeEv();
    else if(document.getElementById('inv').style.display==='block')UI.closeInv();
    else if(document.getElementById('ql').style.display==='block')UI.closeQl();
    else if(document.getElementById('rk').style.display==='block')UI.closeRk();
  }
  if(k==='i'&&ST.phase==='explore')UI.openInv();
  if(k==='q'&&ST.phase==='explore')UI.openQl();
  if(k==='v'&&ST.phase==='explore')UI.openEv();
  if(k===' '&&ST.phase==='explore'){
    e.preventDefault();
    ST.eyeOn=!ST.eyeOn;
    document.getElementById('eo').style.display=ST.eyeOn?'block':'none';
    if(ST.eyeOn){
      notify('Eye of Truth activated');
      const m=getMap();
      if(m){
        (m.objs||[]).forEach(o=>{
          const d=Math.abs(o.x-ST.p.x)+Math.abs(o.y-ST.p.y);
          if(d<=5&&o.evid&&!hasEv(o.evid)){
            addEv(o.evid,o.nm,o.evid.replace(/_/g,' '),'Eye of Truth','physical');
          }
        });
      }
    } else notify('Eye of Truth deactivated');
  }
  if(k==='enter'&&ST.phase==='dialogue'){
    const dc=document.getElementById('dC').querySelector('.ch:not(.lk)');
    if(dc)dc.click();
  }
});

document.addEventListener('keyup',e=>{
  ST.keys[e.key.toLowerCase()]=false;
});

let lastFrame=0;
function gameLoop(ts){
  ST.dt=ts-lastFrame;lastFrame=ts;
  if(ST.attackFlash>0)ST.attackFlash-=ST.dt;
  updateCombatFx(ST.dt);
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function init(){
  defMaps();defDlg();initSprites();
  initMinimap();
  try{R3D.init();}catch(e){console.error('R3D init failed:',e);}
  const lastUser=localStorage.getItem('tlw_current_user');
  if(!lastUser){
    document.getElementById('titleScreen').style.display='none';
    document.getElementById('loginScreen').style.display='flex';
  }
  requestAnimationFrame(gameLoop);
}

init();