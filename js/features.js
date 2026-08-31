const ITEM_DEFS={
  hpotion:{id:'hpotion',nm:'Health Potion',icon:'\u25A6',desc:'Restores 30 HP.',use:'heal',amt:30,price:25},
  mpotion:{id:'mpotion',nm:'Mana Potion',icon:'\u25C7',desc:'Restores 25 MP.',use:'mana',amt:25,price:50},
  rusty_sword:{id:'rusty_sword',nm:'Rusty Sword',icon:'\u2614',desc:'A battered blade. +3 ATK.',eq:'wp',wp:3,price:30},
  iron_sword:{id:'iron_sword',nm:'Iron Sword',icon:'\u2694',desc:'A soldier\'s reliable blade. +6 ATK.',eq:'wp',wp:6,price:120},
  root_blade:{id:'root_blade',nm:'Root Blade',icon:'\u263D',desc:'Weapon of living wood. +9 ATK.',eq:'wp',wp:9,price:220},
  frost_blade:{id:'frost_blade',nm:'Frost Blade',icon:'\u2744',desc:'Cold steel that bites. +12 ATK.',eq:'wp',wp:12,price:380},
  cloth_armor:{id:'cloth_armor',nm:'Cloth Armor',icon:'\u2593',desc:'Light padding. +3 DEF.',eq:'ar',df:3,price:40},
  leather_armor:{id:'leather_armor',nm:'Leather Armor',icon:'\u2592',desc:'Treated hide armor. +5 DEF.',eq:'ar',df:5,price:70},
  rarmor:{id:'rarmor',nm:'Root Armor',icon:'\u2623',desc:'Armor woven from living roots. +8 DEF.',eq:'ar',df:8,price:150},
  frost_plate:{id:'frost_plate',nm:'Frost Plate',icon:'\u25C8',desc:'Plate rimed with protective ice. +12 DEF.',eq:'ar',df:12,price:260}
};

const SHOPS={
  merchant:{nm:'Merchant Rill',items:['hpotion','rusty_sword','cloth_armor']},
  smith:{nm:'Blacksmith Gron',items:['leather_armor','iron_sword','mpotion']},
  gmerch:{nm:'Merchant Vel',items:['hpotion','mpotion','rarmor','root_blade']},
  smerch:{nm:'Merchant Zara',items:['hpotion','mpotion','frost_plate','frost_blade']}
};

const ACHDEFS=[
  {id:'first_blood',ic:'\u2694',n:'First Blood',d:'Win your first battle.'},
  {id:'determined',ic:'\u2620',n:'Determined',d:'Fall in battle and survive.'},
  {id:'curiosity',ic:'\u263C',n:'Curiosity',d:'Gather 5 pieces of evidence.'},
  {id:'archivist',ic:'\u2630',n:'Archivist',d:'Gather 12 pieces of evidence.'},
  {id:'lv3',ic:'\u2605',n:'Growing',d:'Reach Level 3.'},
  {id:'lv6',ic:'\u2605',n:'Seasoned',d:'Reach Level 6.'},
  {id:'lv10',ic:'\u2728',n:'Ascendant',d:'Reach Level 10.'},
  {id:'boss',ic:'\u265F',n:'Region Warden',d:'Defeat a region boss.'},
  {id:'rich',ic:'\u2632',n:'Gold Hoard',d:'Hold 300 gold at once.'},
  {id:'theorist',ic:'\u2AF3',n:'Theorist',d:'Form 3 theories on the evidence board.'},
  {id:'shopper',ic:'\u2699',n:'Economist',d:'Buy and sell at the merchant.'},
  {id:'carto',ic:'\u25C8',n:'Cartographer',d:'Unlock all 7 regions.'},
  {id:'rumormonger',ic:'\u2622',n:'Whisperer',d:'Spread your first rumour. A lie, set loose on the world.'},
  {id:'world_shaper',ic:'\u29C9',n:'World-Shaper',d:'Let a rumour you spread transform the world around you.'},
  {id:'maskbreaker',ic:'\u29BF',n:'Mask Breaker',d:'Shatter a boss mask and face its true form.'},
  {id:'ending',ic:'\u2600',n:'Truth Seeker',d:'Reach any ending.'}
];

function achOk(a){
  const p=ST.p;
  if(a.id==='first_blood')return (p.stat&&p.stat.battles||0)>0&&(Object.values(p.stat.kills||{}).reduce((s,v)=>s+v,0)||0)>=1;
  if(a.id==='determined')return (p.stat&&p.stat.deaths||0)>=1;
  if(a.id==='curiosity')return (p.ev||[]).length>=5;
  if(a.id==='archivist')return (p.ev||[]).length>=12;
  if(a.id==='lv3')return p.lv>=3;
  if(a.id==='lv6')return p.lv>=6;
  if(a.id==='lv10')return p.lv>=10;
  if(a.id==='boss')return (p.bd||[]).length>=1;
  if(a.id==='rich')return (p.gold||0)>=300;
  if(a.id==='theorist')return (p.th&&p.th.length||0)>=3;
  if(a.id==='shopper')return (p.stat&&(p.stat.buys||0)+(p.stat.sells||0)||0)>=1;
  if(a.id==='carto')return (p.unlocked||[]).length>=7;
  if(a.id==='rumormonger')return (p.stat&&p.stat.lies||0)>=1;
  if(a.id==='world_shaper')return (p.rum?Object.values(p.rum).filter(r=>r&&r.st==='sealed').length:0)>=1;
  if(a.id==='maskbreaker')return (p.stat&&p.stat.masks||0)>=1;
  if(a.id==='ending')return (p.endings&&p.endings.size||0)>=1;
  return false;
}

function initFeats(){
  const p=ST.p;
  p.ach=p.ach||[];p.th=p.th||[];
  p.stat=p.stat||{kills:{},battles:0,deaths:0,evPick:0,buys:0,sells:0,pots:0,theories:0,steps:0,playMs:0,lies:0,masks:0};
  p.rum=p.rum||{};
  p.gear=p.gear||{wp:null,ar:null};
  p.poison=p.poison||0;
}

function checkAch(){
  const p=ST.p;if(!p)return;
  initFeats();
  let any=false;
  ACHDEFS.forEach(a=>{
    if(p.ach.indexOf(a.id)===-1&&achOk(a)){
      p.ach.push(a.id);
      setF('ach_'+a.id);
      popAch(a);
      any=true;
    }
  });
  return any;
}

function popAch(a){
  const el=document.getElementById('achToast');
  if(!el)return;
  const wrap=document.createElement('div');wrap.className='at';
  wrap.innerHTML='ACHIEVEMENT UNLOCKED<br><b>'+a.ic+' '+a.n+'</b><br><span>'+a.d+'</span>';
  el.appendChild(wrap);
  Snd.ach();
  setTimeout(()=>{wrap.classList.add('at-out');setTimeout(()=>wrap.remove(),600);},3600);
}

function fmtTime(ms){
  const s=Math.floor(ms/1000);
  const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;
  return (h?h+'h ':'')+(m?m+'m ':'')+ss+'s';
}

function renderAch(){
  const b=document.getElementById('ftBody');if(!b)return;
  const p=ST.p;b.innerHTML='';
  const g=document.createElement('div');g.className='acg';
  ACHDEFS.forEach(a=>{
    const got=p.ach.indexOf(a.id)>-1;
    const d=document.createElement('div');d.className='aci'+(got?' ac-on':' ac-off');
    d.innerHTML='<div class="aci-ic">'+(got?a.ic:'\u2022')+'</div><div><div class="aci-n">'+a.n+'</div><div class="aci-d">'+a.d+'</div></div>';
    g.appendChild(d);
  });
  b.appendChild(g);
}

function renderStats(){
  const b=document.getElementById('ftBody');if(!b)return;
  const p=ST.p;initFeats();
  const st=p.stat,rows=[
    ['Play Time',fmtTime(st.playMs)],
    ['Steps Taken',st.steps],
    ['Battles Fought',st.battles],
    ['Enemies Defeated',Object.values(st.kills||{}).reduce((s,v)=>s+v,0)],
    ['Deaths',st.deaths],
    ['Evidence Collected',(p.ev||[]).length],
    ['Theories Formed',(p.th||[]).length],
    ['Items Bought',st.buys],
    ['Items Sold',st.sells],
    ['Potions Used',st.pots],
    ['Lies Spread',st.lies||0],
    ['Masks Broken',st.masks||0],
    ['Bosses Defeated',(p.bd||[]).length],
    ['Endings Reached',(p.endings?p.endings.size:0)]
  ];
  const t=document.createElement('table');t.className='stt';
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML='<td>'+r[0]+'</td><td>'+r[1]+'</td>';
    t.appendChild(tr);
  });
  b.appendChild(t);
}

function renderBest(){
  const b=document.getElementById('ftBody');if(!b)return;
  const p=ST.p;initFeats();
  const k=Object.entries(p.stat.kills||{}).sort((a,b)=>b[1]-a[1]);
  b.innerHTML='';
  if(!k.length){b.innerHTML='<div class="ei" style="padding:16px;color:#6a6a8a">No enemies documented yet. Defeat foes to fill your bestiary.</div>';return;}
  const g=document.createElement('div');g.className='bgr';
  k.forEach(([nm,cnt])=>{
    const d=document.createElement('div');d.className='bgr-i';
    d.innerHTML='<span>'+nm+'</span><span class="bgr-c">'+cnt+'</span>';
    g.appendChild(d);
  });
  b.appendChild(g);
}

function renderRums(){
  const b=document.getElementById('ftBody');if(!b)return;
  const p=ST.p;initFeats();
  b.innerHTML='';
  const rs=Object.entries(RUMORS);
  const got=rs.filter(([id])=>p.rum&&p.rum[id]);
  if(!got.length){b.innerHTML='<div class="ei" style="padding:16px;color:#6a6a8a">No rumours recorded. Speak of things you have not seen, and the world will change.</div>';return;}
  const g=document.createElement('div');g.className='bgr';
  got.forEach(([id,r])=>{
    const s=p.rum[id];const st=s?s.st:'none';
    const d=document.createElement('div');d.className='bgr-i';
    const ic=st==='sealed'?'\u2714':st==='active'?'\u25CB':'\u2022';
    const lab=st==='active'?'Spreading...':st==='sealed'?'Sealed - it became real':'Never spread';
    const col=st==='sealed'?'#ffaa00':st==='active'?'#8a6aff':'#6a6a8a';
    d.innerHTML='<span>'+ic+' '+r.nm+'</span><span class="bgr-c" style="color:'+col+'">'+lab+'</span>';
    g.appendChild(d);
  });
  b.appendChild(g);
}

function openFeats(tab){
  document.getElementById('ft').style.display='block';
  renderFeatTabs(tab||'ach');
}

function closeFeats(){
  document.getElementById('ft').style.display='none';
}

function renderFeatTabs(cat){
  const pb=document.getElementById('ftTabs');pb.innerHTML='';
  [{id:'ach',l:'ACHIEVEMENTS'},{id:'stats',l:'STATISTICS'},{id:'best',l:'BESTIARY'},{id:'rums',l:'RUMOURS'},{id:'jnl',l:'JOURNAL'}].forEach(t=>{
    const b=document.createElement('button');
    b.className='btn btn-sm';if(t.id===cat)b.style.borderColor='#ffaa00';
    b.textContent=t.l;b.onclick=()=>renderFeatTabs(t.id);pb.appendChild(b);
  });
  if(cat==='ach')renderAch();
  else if(cat==='stats')renderStats();
  else if(cat==='rums')renderRums();
  else if(cat==='jnl')renderFeatJournal();
  else renderBest();
}

function renderFeatJournal(){
  const b=document.getElementById('ftBody');if(!b)return;
  const p=ST.p;if(!p){b.innerHTML='';return;}
  b.innerHTML='';
  const tabs=document.createElement('div');tabs.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin:8px 0;';
  const cats=[{id:null,l:'ALL'},{id:'combat',l:'COMBAT'},{id:'story',l:'STORY'},{id:'world',l:'WORLD'}];
  const cur=p._jnlTab||null;
  cats.forEach(c=>{
    const btn=document.createElement('button');btn.className='btn btn-sm';
    if(c.id===cur)btn.style.borderColor='#ffaa00';
    btn.textContent=c.l;
    btn.onclick=()=>{p._jnlTab=c.id;renderFeatJournal();};
    tabs.appendChild(btn);
  });
  b.appendChild(tabs);
  let list=(p.jnl||[]).slice().reverse();
  if(cur)list=list.filter(e=>e.cat===cur);
  if(!list.length){const d=document.createElement('div');d.style.cssText='padding:16px;color:#6a6a8a';d.textContent='No journal entries yet.';b.appendChild(d);return;}
  const g=document.createElement('div');g.className='bgr';
  const catCol={combat:'#ff6644',story:'#ffd966',world:'#66ccff'};
  list.forEach(e=>{
    const d=document.createElement('div');d.className='bgr-i';
    const t=new Date(e.ts);
    const ts=t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    d.innerHTML='<span style="color:'+(catCol[e.cat]||'#b0a8c0')+';min-width:44px;flex:0 0 auto">'+ts+'</span><span style="flex:1">'+e.txt+'</span>';
    g.appendChild(d);
  });
  b.appendChild(g);
}

function shopItemsFor(npcId){
  const sc=SHOPS[npcId];if(!sc)return[];
  let list=sc.items.slice();
  if(npcId==='smith'&&hasF('rum_sealed_smith_thief'))list=['hpotion'];
  list=list.slice(0,4);
  return list;
}

function renderShop(npcId){
  const sc=SHOPS[npcId];if(!sc)return;
  const p=ST.p;
  document.getElementById('shT').textContent=sc.nm+' \u2014 SHOP';
  document.getElementById('shG').textContent='Gold: '+p.gold;
  const b=document.getElementById('shB');b.innerHTML='';
  const col=document.createElement('div');col.className='sh-col';
  const hh=document.createElement('h3');hh.textContent='BUY';col.appendChild(hh);
  const list=shopItemsFor(npcId);
  if(!list.length){const n=document.createElement('div');n.className='sh-empty';n.innerHTML='<span style="color:#ff6a6a">You are no longer welcome here.</span>';col.appendChild(n);}
  list.forEach(id=>{
    const it=ITEM_DEFS[id];if(!it)return;
    let pr=it.price;
    if(hasF('rum_sealed_merchant_fire'))pr=Math.ceil(pr*1.4);
    const row=document.createElement('div');row.className='sh-r';
    const info=document.createElement('div');info.className='sh-i';
    info.innerHTML='<span class="sh-ic">'+it.icon+'</span><div class="sh-t"><b>'+it.nm+'</b><span class="sh-c">'+it.desc+'</span></div>';
    const buy=document.createElement('button');buy.className='btn btn-sm';
    buy.textContent=pr+'g';
    if(p.gold<pr){buy.disabled=true;}
    buy.onclick=()=>buyItem(npcId,id,pr);
    row.appendChild(info);row.appendChild(buy);col.appendChild(row);
  });
  b.appendChild(col);

  const col2=document.createElement('div');col2.className='sh-col';
  const h2=document.createElement('h3');h2.textContent='SELL \u2014 '+p.inv.length+' items';col2.appendChild(h2);
  if(!p.inv.length){
    const n=document.createElement('div');n.className='sh-empty';n.textContent='Nothing to sell.';
    col2.appendChild(n);
  }else{
    p.inv.forEach((it,i)=>{
      const def=ITEM_DEFS[it.id];
      const pr=def?Math.floor(def.price/2):it.id==='hpotion'?12:6;
      const row=document.createElement('div');row.className='sh-r';
      const info=document.createElement('div');info.className='sh-i';
      info.innerHTML='<span class="sh-ic">'+(it.icon||'\u2022')+'</span><div class="sh-t"><b>'+(it.nm||it.name)+'</b>'+(it.qty>1?'<span class="sh-c">x'+it.qty+'</span>':'')+'</div>';
      const sell=document.createElement('button');sell.className='btn btn-sm';
      sell.textContent=pr+'g';
      sell.onclick=()=>sellItem(i,pr);
      row.appendChild(info);row.appendChild(sell);col2.appendChild(row);
    });
  }
  b.appendChild(col2);
}

function buyItem(npcId,id,pr){
  const p=ST.p,it=ITEM_DEFS[id];
  if(!it)return;
  const price=pr===undefined?it.price:pr;
  if(p.gold<price){Snd.deny();notify('Not enough gold.');return;}
  p.gold-=price;
  addItem({...it});
  p.stat.buys=(p.stat.buys||0)+1;
  Snd.buy();
  initFeats();
  uHUD();renderShop(npcId);checkAch();
}

function sellItem(idx,pr){
  const p=ST.p;if(!p.inv[idx])return;
  const it=p.inv[idx];
  p.gold+=pr;
  p.inv.splice(idx,1);
  p.stat.sells=(p.stat.sells||0)+1;
  Snd.sell();
  initFeats();
  uHUD();renderShop(ST.shopNpc);checkAch();
}

function useConsumable(it){
  if(it.id==='hpotion'){
    if(ST.p.hp>=ST.p.mhp){Snd.deny();notify('HP is already full.');return false;}
    const amt=30;ST.p.hp=Math.min(ST.p.mhp,ST.p.hp+amt);
    ST.p.stat.pots=(ST.p.stat.pots||0)+1;
    notify('Used '+it.nm+'. +'+amt+' HP');Snd.heal();return true;
  }
  if(it.id==='mpotion'){
    if(ST.p.mp>=ST.p.mmp){Snd.deny();notify('MP is already full.');return false;}
    const amt=25;ST.p.mp=Math.min(ST.p.mmp,ST.p.mp+amt);
    ST.p.stat.pots=(ST.p.stat.pots||0)+1;
    notify('Used '+it.nm+'. +'+amt+' MP');Snd.heal();return true;
  }
  return false;
}

function equipItem(idx){
  const p=ST.p,it=p.inv[idx];if(!it||!it.eq)return;
  const slot=it.eq;
  const old=p.gear[slot];
  initFeats();
  p.atk+=it.wp||0;p.def+=it.df||0;p.mag+=it.mg||0;
  if(it.qty&&it.qty>1){it.qty--;}else{p.inv.splice(idx,1);}
  p.gear[slot]={id:it.id,nm:it.nm,icon:it.icon};
  if(old){
    const od=ITEM_DEFS[old.id];
    if(od){p.atk-=od.wp||0;p.def-=od.df||0;p.mag-=od.mg||0;}
    addItem({...od});
    notify('Unequipped '+old.nm+'. Equipped '+it.nm+'.');
  }else{
    notify('Equipped '+it.nm+'.');
  }
  Snd.hud();
  uHUD();renderInv();
  return true;
}

function formTheory(){
  const sel=document.querySelectorAll('#ev .ei.sel');
  if(sel.length<2){Snd.deny();notify('Select at least 2 evidence cards to form a theory.');return;}
  const ids=[];
  sel.forEach(e=>{const id=e.dataset.id;if(id)ids.push(id);});
  if(ids.length<2){Snd.deny();notify('Select 2 different evidence cards.');return;}
  const pair=[...ids].sort().join('&');
  if((ST.p.th||[]).some(t=>t.id===pair)){Snd.deny();notify('You already formed that theory.');return;}
  const p=ST.p;initFeats();
  const names=[];ids.forEach(id=>{const e=p.ev.find(x=>x.id===id);if(e)names.push(e.t||e.title);});
  p.th.push({id:pair,t:names.join(' + '),d:'You connected '+names.join(' with ')+'. A new understanding emerges.',ts:Date.now()});
  p.sc+=3;p.ins+=1;
  p.stat.theories=(p.stat.theories||0)+1;
  setF('theory_'+ids.join('_'),names.join(' + '));
  Snd.theo();
  notify('Theory formed! Insight increased.');
  uHUD();renderEvBoard();checkAch();
}

function waypointTarget(m){
  const p=ST.p;if(!p||!p.fq||!m)return null;
  const active=Object.entries(p.fq).find(([,q])=>q.st==='active'&&(q.giver||q.tgt));
  if(!active)return null;
  const q=active[1];
  if(q.giver){
    const g=(m.npcs||[]).find(n=>n.id===q.giver);
    if(g)return{x:g.x,y:g.y,txt:q.name};
  }
  if(q.tgt&&q.tgt.reg===p.reg&&q.tgt.map===p.map){
    return{x:q.tgt.x,y:q.tgt.y,txt:q.tgt.t||q.name};
  }
  return null;
}

function drawMinimapObjective(sc,ox,oy){
  const m=getMap();
  const t=waypointTarget(m);
  if(!t)return;
  const blink=Math.floor(Date.now()/450)%2===0;
  mmx.fillStyle=blink?'#ffe066':'#ffaa00';
  const s=gridToScreen(t.x,t.y);
  mmx.beginPath();mmx.arc(ox+s.x*sc,oy+s.y*sc,4,0,Math.PI*2);mmx.fill();
  mmx.font='bold 9px monospace';mmx.textAlign='center';
  mmx.fillStyle='#ffe066';
  mmx.fillText('\u25C6',ox+s.x*sc,oy+s.y*sc+4);
  if(t.txt){mmx.fillStyle='#fff';mmx.font='bold 8px monospace';mmx.fillText(t.txt.slice(0,26),ox+s.x*sc,oy+s.y*sc+16);}
}

UI.openShop=function(npcId){ST.shopNpc=npcId;document.getElementById('sh').style.display='block';renderShop(npcId);};
UI.closeShop=function(){document.getElementById('sh').style.display='none';ST.shopNpc=null;};
UI.openFeats=openFeats;
UI.closeFeats=closeFeats;
UI.toggleSnd=function(){Snd.toggle();const b=document.getElementById('sndBtn');if(b)b.textContent='SOUND: '+(Snd.isMuted()?'OFF':'ON');return Snd.isMuted();};

document.addEventListener('click',e=>{
  const t=e.target;
  if(t&&t.closest&&t.closest('.btn')){
    if(t.closest('#thBtn')===null&&t.closest('#sh .btn')===null&&t.closest('#ft .btn')===null){Snd.ui();}
  }
});

(function(){
  const thBtn=document.getElementById('thBtn');
  if(thBtn)thBtn.addEventListener('click',formTheory);
})();