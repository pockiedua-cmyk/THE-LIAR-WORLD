(function(){
  function hitStop(ms){
    if(!ST.hitStop||ST.hitStop<ms)ST.hitStop=ms;
  }

  function updateStatusIcons(){
    const el=document.getElementById('stIc');if(!el)return;
    const p=ST.p;if(!p){el.innerHTML='';return;}
    let h='';
    if(p.poison>0)h+='<span class="stic st-px" title="Poisoned">'+p.poison+' ☠</span>';
    if(ST.cs&&ST.cs.defending)h+='<span class="stic st-df" title="Defending">⛨</span>';
    if(ST.cs&&ST.cs.falseShow)h+='<span class="stic st-tf" title="Truth Seals the False Form">✦×2</span>';
    if(ST.cs&&ST.cs.masked)h+='<span class="stic st-mk" title="Boss Masked — use Eye of Truth">⛨?</span>';
    el.innerHTML=h;
  }

  function eTell(){
    const cs=ST.cs;if(!cs)return;
    const e=cs.e,atks=e.atk||[{nm:'Attack',pw:e.at}];
    const at=atks[Math.floor(Math.random()*Math.max(1,atks.length))];
    cs._pending=at;
    let tp=at.mg?'MAGIC':'PHYS';
    if(at.nm!=='Attack')tp=at.nm+' ('+tp+')';
    let extra='';
    if(e.pz&&at.mg)extra=' ⚠POISON';
    const el=document.getElementById('cmTl');
    if(el){el.textContent='\u26A0 NEXT: '+tp+extra;el.style.display='block';}
    ST.hitStop=Math.max(ST.hitStop||0,500);
    setTimeout(function(){
      if(!ST.cs||!cs._pending)return;
      const el2=document.getElementById('cmTl');
      if(el2)el2.style.display='none';
      resolveEnemyStrike(cs._pending);
      cs._pending=null;
    },900);
  }

  function resolveEnemyStrike(at){
    const cs=ST.cs;if(!cs)return;
    const e=cs.e,p=ST.p;
    const setDef=(typeof _CF!=='undefined'?_CF.getSetBonus(p).def:0);
    const skb=(typeof _SK!=='undefined'&&_SK.bonusOf)?_SK.bonusOf(p.ks||{}):{dmgRed:0};
    let dmg=Math.max(1,(at.pw||e.at)+Math.floor(Math.random()*4)-(cs.defending?p.def*2:p.def)/2|0)-setDef;
    if(at.mg)dmg=Math.max(1,(at.pw||e.at)+Math.floor(Math.random()*4)-p.def/3|0)-setDef;
    if(skb.dmgRed)dmg=Math.max(1,Math.round(dmg*(1-skb.dmgRed/100)));
    if(e.stun)dmg*=e.stun;
    if(cs.falseShow)hitStop(60);
    if(dmg>=30)hitStop(40);
    p.hp-=dmg;
    if(p.gear&&p.gear.ar){p.gearDur.ar=Math.max(0,(p.gearDur.ar||100)-1);if(p.gearDur.ar>0&&p.gearDur.ar<=30)notify('Armor worn: '+p.gearDur.ar+'%');if(p.gearDur.ar===0)notify('Armor broke! Repair at Forge.');}
    cs.log.push({t:e.nm+' uses '+at.nm+' for '+dmg+'!',c:'dm'});
    if(cs.falseShow){
      cs.falseShow=false;
      cs.log.push({t:'The false form rages \u2014 the truth window slams shut!',c:'dm'});
    }
    addCombatFx('-'+dmg,'#ff4444',window.innerWidth/2-30,window.innerHeight*0.6);triggerShake(3);
    Snd.hurt();playerHurtFx();
    if(e.pz&&Math.random()*100<e.pz){
      p.poison=Math.min(5,(p.poison||0)+2);
      cs.log.push({t:'You have been poisoned!',c:'dm'});
    }
    cs.defending=false;
    if(p.hp<=0){handleCombatFall();return;}
    cs.pTurn=true;cs.turns++;
    uHUD();updateCombat();
  }

  var JOURNAL=[],JMAX=200;

  function journalAdd(cat,txt){
    var p=ST.p;if(!p)return;
    if(!p.jnl)p.jnl=[];
    p.jnl.push({cat:cat,txt:txt,ts:Date.now()});
    if(p.jnl.length>JMAX)p.jnl=p.jnl.slice(-JMAX);
  }

  function renderJournal(tab){
    var b=document.getElementById('jnlB');if(!b)return;
    var p=ST.p;if(!p||!p.jnl)return;
    b.innerHTML='';
    var tabs=document.getElementById('jnlT');
    if(tabs){
      tabs.innerHTML='';
      var cats=[{id:'all',l:'ALL'},{id:'combat',l:'COMBAT'},{id:'story',l:'STORY'},{id:'world',l:'WORLD'}];
      cats.forEach(function(c){
        var btn=document.createElement('button');btn.className='btn btn-sm';
        if(c.id===tab)btn.style.borderColor='#ffaa00';
        btn.textContent=c.l;btn.onclick=function(){renderJournal(c.id);};
        tabs.appendChild(btn);
      });
    }
    var list=p.jnl.slice().reverse();
    if(tab&&tab!=='all')list=list.filter(function(e){return e.cat===tab;});
    if(!list.length){b.innerHTML='<div style="padding:16px;color:#6a6a8a">No entries yet.</div>';return;}
    list.forEach(function(e){
      var d=document.createElement('div');d.className='bgr-i';
      var t=new Date(e.ts);
      var ts=(t.getHours()<10?'0':'')+t.getHours()+':'+(t.getMinutes()<10?'0':'')+t.getMinutes();
      var catCol={combat:'#ff6644',story:'#ffd966',world:'#66ccff',death:'#ff4444'};
      d.innerHTML='<span style="color:'+(catCol[e.cat]||'#b0a8c0')+';min-width:38px">'+ts+'</span><span style="flex:1">'+e.txt+'</span>';
      b.appendChild(d);
    });
  }

  function getSetBonus(p){
    var bonus={hp:0,mp:0,atk:0,def:0,mag:0,spd:0,lck:0,durPen:0};
    if(!p||!p.gear)return bonus;
    var SETS={root_blade:'root',rarmor:'root',frost_blade:'frost',frost_plate:'frost'};
    var counts={};var slots={};
    ['wp','ar'].forEach(function(sl){
      var g=p.gear[sl];if(!g||!g.id)return;
      var s=SETS[g.id];if(!s)return;
      counts[s]=(counts[s]||0)+1;
      if(!slots[s])slots[s]=[];
      slots[s].push(sl);
    });
    Object.keys(counts).forEach(function(s){
      var n=counts[s];
      if(s==='root'&&n>=2){bonus.hp+=20;bonus.def+=2;if(n>=3)bonus.atk+=3;}
      if(s==='frost'&&n>=2){bonus.def+=3;bonus.mag+=2;if(n>=3){bonus.spd+=2;bonus.durPen+=0.2;}}
    });
    return bonus;
  }

  window._CF={hitStop:hitStop,eTell:eTell,journalAdd:journalAdd,renderJournal:renderJournal,getSetBonus:getSetBonus,updateStatusIcons:updateStatusIcons};
})();
