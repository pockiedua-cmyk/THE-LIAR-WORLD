(function(){
  var BUNTS=[
    {id:'b_wolf',reg:'pro',tgt:'Wounded Wolf',cnt:2,g:35,xp:20},
    {id:'b_boar',reg:'pro',tgt:'Wild Boar',cnt:2,g:40,xp:20},
    {id:'b_shadow',reg:'pro_for',tgt:'Shadow Wolf',cnt:3,g:70,xp:40},
    {id:'b_spider',reg:'pro_for',tgt:'Forest Spider',cnt:3,g:55,xp:35},
    {id:'b_worm',reg:'r1_gfd',tgt:'Root Worm',cnt:3,g:90,xp:50},
    {id:'b_stalker',reg:'r2_bw',tgt:'Shadow Stalker',cnt:3,g:110,xp:60},
    {id:'b_mist',reg:'r2_bw',tgt:'Mist Phantom',cnt:3,g:90,xp:50}
  ];

  function regionOpen(reg){
    var un=ST.p&&ST.p.unlocked||[];
    return un.some(function(u){return reg===u||reg.indexOf(u+'_')===0;});
  }

  function bountyKills(b){
    var st=ST.p&&ST.p.stat;
    return (st&&st.kills&&st.kills[b.tgt])||0;
  }

  function acceptedList(){
    var p=ST.p;if(!p||!p.bount||!p.bount.active)return {};
    return p.bount.active;
  }

  function doneList(){
    var p=ST.p;if(!p||!p.bount)return [];
    return p.bount.done||[];
  }

  function openBounty(){
    var el=document.getElementById('bt');if(!el)return;
    el.style.display='block';
    renderBounty();
  }

  function closeBounty(){
    var el=document.getElementById('bt');if(el)el.style.display='none';
  }

  function renderBounty(){
    var b=document.getElementById('btL');if(!b)return;
    if(!ST||!ST.p){b.innerHTML='';return;}
    var p=ST.p;if(typeof initFeats==='function')initFeats();
    b.innerHTML='';
    var list=BUNTS.filter(function(x){return regionOpen(x.reg);});
    if(!list.length){var n=document.createElement('div');n.style.cssText='padding:16px;color:#6a6a8a';n.textContent='The board is empty. Travel to new regions to unlock contracts.';b.appendChild(n);return;}
    list.forEach(function(x){
      var ac=p.bount.active[x.id];
      var done=doneList().indexOf(x.id)>-1;
      var cur=bountyKills(x);
      var prog=ac?Math.max(0,cur-(ac.base||0)):cur;
      var claimable=!!ac&&prog>=x.cnt;
      var row=document.createElement('div');row.className='bt-r';
      var info=document.createElement('div');
      info.innerHTML='<b>'+x.tgt+' x'+x.cnt+'</b><span class="sk-c">'+x.g+' gold \u00B7 '+x.xp+' XP</span>';
      row.appendChild(info);
      var btn=document.createElement('button');btn.className='btn btn-sm';
      if(done){btn.textContent='DONE';btn.disabled=true;}
      else if(ac){
        btn.textContent=prog+'/'+x.cnt+(claimable?' \u2014 CLAIM':'');
        btn.disabled=!claimable;
        btn.onclick=function(){claimBounty(x.id);};
      }else{
        btn.textContent='ACCEPT';
        btn.onclick=function(){acceptBounty(x.id);};
      }
      row.appendChild(btn);
      b.appendChild(row);
    });
  }

  function acceptBounty(id){
    if(!ST||!ST.p)return;
    var p=ST.p;if(typeof initFeats==='function')initFeats();
    var x=BUNTS.find(function(z){return z.id===id;});if(!x)return;
    if(p.bount.active[id]){Snd.deny();notify('Bounty already active.');return;}
    p.bount.active[id]={base:bountyKills(x)};
    if(typeof Snd!=='undefined'&&Snd.hud)Snd.hud();
    notify('Bounty accepted: '+x.tgt+' x'+x.cnt);
    renderBounty();
  }

  function claimBounty(id){
    if(!ST||!ST.p)return;
    var p=ST.p;if(typeof initFeats==='function')initFeats();
    var x=BUNTS.find(function(z){return z.id===id;});if(!x)return;
    var ac=p.bount.active[id];
    var cur=bountyKills(x);
    var prog=ac?Math.max(0,cur-(ac.base||0)):cur;
    if(!ac||prog<x.cnt){Snd.deny();notify('Bounty not completed yet.');return;}
    p.gold=(p.gold||0)+x.g;
    if(typeof _CF!=='undefined'&&_CF.journalAdd)_CF.journalAdd('combat','Completed bounty: '+x.tgt+' x'+x.cnt+' (+'+x.g+' gold, +'+x.xp+' XP).');
    delete p.bount.active[id];
    doneList().push(id);
    if(typeof Snd!=='undefined'&&Snd.buy)Snd.buy();
    notify('Bounty complete! +'+x.g+' gold');
    if(typeof gxp==='function')gxp(x.xp);
    if(typeof uHUD==='function')uHUD();
    renderBounty();
    if(typeof checkAch==='function')checkAch();
  }

  function checkBounty(){
    var el=document.getElementById('bt');
    if(el&&el.style.display==='block')renderBounty();
  }

  if(typeof UI!=='undefined'){UI.openBounty=openBounty;UI.closeBounty=closeBounty;}
  window.checkBounty=checkBounty;
  window._BT={openBounty:openBounty,closeBounty:closeBounty,renderBounty:renderBounty,acceptBounty:acceptBounty,claimBounty:claimBounty,checkBounty:checkBounty,BUNTS:BUNTS};
})();