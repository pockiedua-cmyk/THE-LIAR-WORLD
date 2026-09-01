const RUMORS={
  smith_thief:{nm:'The blacksmith burnt the village.',desc:'You told people Gron started the fire.',seal:24,onSeal:function(){
    setF('rum_smith_cold');
    if(typeof startQ==='function')startQ('s_atone','Cold Forge','Gron refuses to serve you after the rumour you spread. He only sells what was already forged. Clear his name to earn back his trust.',{tgt:{reg:'pro',map:'vil',x:14,y:9,t:'Gron\'s forge'}});
  }},
  merchant_fire:{nm:'The merchant looted the shop before the fire.',desc:'You told people Rill emptied the shop himself.',seal:24,onSeal:function(){
    setF('rum_price_up');
    if(typeof startQ==='function')startQ('s_shun','Grudging Merchant','Rill knows what you said. His prices have risen. Restore his reputation to lower them again.',{tgt:{reg:'pro',map:'vil',x:14,y:7,t:'Rill\'s stall'}});
  }},
  well_wish:{nm:'The village well grants wishes.',desc:'You told everyone the well answers with fortune.',seal:20,onSeal:function(){
    setF('rum_well');
    if(typeof startQ==='function')startQ('s_wish','A Wishing Well','People throw coins into the well now. The rumour you spread... may just be true. Test it.',{tgt:{reg:'pro',map:'vil',x:12,y:14,t:'The Wishing Well'}});
  }}
};

function addRumour(id){
  const R=RUMORS[id];if(!R)return;
  const p=ST.p;if(!p)return;
  if(typeof initFeats==='function')initFeats();
  if(p.rum[id])return;
  p.rum[id]={st:'active',ts:Date.now()};
  p.stat.lies=(p.stat.lies||0)+1;
  setF('rum_start_'+id);
  Snd.rum();
  notify('Rumour spread: '+R.nm);
  if(typeof _CF!=='undefined')_CF.journalAdd('story','Spread a rumour: '+R.nm);
  uHUD();
}

function splitRum(id){
  addRumour(id);
  if(typeof closeDlg==='function')closeDlg();
}

function rumourTick(n){
  if(!ST.p||!ST.p.rum)return;
  Object.keys(ST.p.rum).forEach(function(id){
    const r=RUMORS[id],s=ST.p.rum[id];
    if(!r||!s||s.st!=='active')return;
    s.pv=(s.pv||0)+(n||1);
    const half=Math.max(1,Math.floor(r.seal/2));
    if(s.pv>=half&&!(s.half)){s.half=true;Snd.rum();notify('The rumour is spreading... "'+r.nm+'"');}
    if(s.pv>=r.seal)sealRumour(id);
  });
}

function sealRumour(id){
  const r=RUMORS[id],p=ST.p;
  if(!r||!p||!p.rum[id])return;
  p.rum[id].st='sealed';
  setF('rum_sealed_'+id);
  if(r.onSeal){try{r.onSeal();}catch(e){}}
  notify('The rumour has become real: '+r.nm);
  Snd.seal();
  if(typeof _CF!=='undefined')_CF.journalAdd('story','A rumour became reality: '+R.nm);
  if(typeof checkAch==='function')checkAch();
  uHUD();
}

function rumourActive(){
  const p=ST.p;if(!p||!p.rum)return false;
  return Object.values(p.rum).some(function(s){return s&&s.st==='active';});
}

function wishAtWell(){
  const p=ST.p;
  if(p.gold<15){notify('The well demands 15 gold.');Snd.deny();return;}
  p.gold-=15;
  const r=Math.random();
  if(r<0.28){p.hp=p.mhp;p.mp=p.mmp;uHUD();notify('The well gurgles happily. You feel fully restored!');Snd.heal();}
  else if(r<0.5){p.gold+=Math.floor(15+Math.random()*20);uHUD();notify('The well burps out gold! The wish... worked?');Snd.pickup();}
  else if(r<0.66){p.xp+=15;uHUD();notify('+15 XP, blessed by the well.');Snd.lv();}
  else if(r<0.82){p.ins+=1;uHUD();notify('A whisper from the depths. +1 Insight.');Snd.theo();}
  else {notify('Nothing happens. The well burbles mockingly.');Snd.deny();}
  if(typeof checkAch==='function')checkAch();
}