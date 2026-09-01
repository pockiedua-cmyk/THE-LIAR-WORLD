(function(){
  var SKILLS=[
    {id:'vit',nm:'Vitality',ic:'\u2764',d:'+8 max HP per rank.',mx:5,cost:1,req:null},
    {id:'str',nm:'Strength',ic:'\u2694',d:'+2 ATK per rank.',mx:5,cost:1,req:null},
    {id:'grd',nm:'Guard',ic:'\u2592',d:'+1 DEF per rank.',mx:5,cost:1,req:null},
    {id:'arc',nm:'Arcana',ic:'\u2726',d:'+2 MAG per rank.',mx:5,cost:1,req:null},
    {id:'swf',nm:'Swiftness',ic:'\u26A1',d:'+1 SPD per rank.',mx:5,cost:1,req:null},
    {id:'prc',nm:'Precision',ic:'\u25CE',d:'+3% CRIT chance per rank.',mx:5,cost:1,req:null},
    {id:'luc',nm:'Fortune',ic:'\u2632',d:'+4% gold from combat per rank.',mx:5,cost:1,req:null},
    {id:'wis',nm:'Wisdom',ic:'\u2605',d:'+5% XP gained per rank.',mx:5,cost:1,req:null},
    {id:'bst',nm:'Bastion',ic:'\u2620',d:'-8% damage taken per rank. Needs Vitality 3 + Guard 3.',mx:3,cost:2,req:function(ks){return (ks.vit||0)>=3&&(ks.grd||0)>=3;}},
    {id:'fry',nm:'Fury',ic:'\u2AF3',d:'+15% CRIT damage per rank. Needs Strength 3 + Precision 3.',mx:3,cost:2,req:function(ks){return (ks.str||0)>=3&&(ks.prc||0)>=3;}}
  ];

  function ranks(ks,id){return (ks&&ks[id])||0;}

  function bonusOf(ks){
    var b={hp:0,atk:0,def:0,mag:0,spd:0,cri:0,criDmg:0,gold:0,xp:0,dmgRed:0};
    if(!ks)return b;
    b.hp=ranks(ks,'vit')*8;
    b.atk=ranks(ks,'str')*2;
    b.def=ranks(ks,'grd');
    b.mag=ranks(ks,'arc')*2;
    b.spd=ranks(ks,'swf');
    b.cri=ranks(ks,'prc')*3;
    b.gold=ranks(ks,'luc')*4;
    b.xp=ranks(ks,'wis')*5;
    b.dmgRed=ranks(ks,'bst')*8;
    b.criDmg=ranks(ks,'fry')*15;
    return b;
  }

  function sync(p){
    if(!p)return bonusOf({});
    if(!p.ks)p.ks={};
    var cur=bonusOf(p.ks);
    var prev=p._skb||{hp:0,atk:0,def:0,mag:0,spd:0};
    p.mhp=(p.mhp||100)+cur.hp-prev.hp;
    p.atk=(p.atk||0)+cur.atk-prev.atk;
    p.def=(p.def||0)+cur.def-prev.def;
    p.mag=(p.mag||0)+cur.mag-prev.mag;
    p.spd=(p.spd||0)+cur.spd-prev.spd;
    p._skb={hp:cur.hp,atk:cur.atk,def:cur.def,mag:cur.mag,spd:cur.spd};
    return cur;
  }

  function earnedAll(ks){
    var s=0;for(var k in ks)s+=ks[k];return s;
  }

  function buy(id){
    if(!ST||!ST.p)return;
    var p=ST.p;
    if(typeof initFeats==='function')initFeats();
    var s=SKILLS.find(function(x){return x.id===id;});if(!s)return;
    var ks=p.ks||{};
    if(typeof s.req==='function'&&!s.req(ks)){Snd.deny();notify('Requirements not met.');return;}
    var cur=ks[id]||0;
    if(cur>=s.mx){Snd.deny();notify(s.nm+' is maxed.');return;}
    if((p.sp||0)<s.cost){Snd.deny();notify('Not enough Skill Points.');return;}
    p.sp-=s.cost;ks[id]=cur+1;p.ks=ks;
    sync(p);
    if(typeof uHUD==='function')uHUD();
    Snd.buy();
    notify(s.nm+' \u2192 '+(cur+1)+'/'+s.mx);
    if(typeof checkAch==='function')checkAch();
    if(typeof renderSkills==='function')renderSkills();else {var el=document.getElementById('skSp');if(el)el.textContent='SKILL POINTS: '+p.sp;}
  }

  function earn(n){
    if(!ST||!ST.p)return;
    ST.p.sp=(ST.p.sp||0)+n;
    if(typeof Snd!=='undefined'&&Snd.lv)Snd.lv();
    notify('+'+n+' Skill Point (FEATS > SKILLS)');
    if(typeof uHUD==='function')uHUD();
  }

  function reset(){
    if(!ST||!ST.p)return;
    var p=ST.p;if(!p.ks)return;
    var refund=0;
    SKILLS.forEach(function(s){var r=p.ks[s.id]||0;refund+=r*s.cost;});
    refund=Math.floor(refund*0.5);
    p.sp=(p.sp||0)+refund;p.ks={};
    sync(p);
    if(typeof uHUD==='function')uHUD();
    if(typeof checkAch==='function')checkAch();
    if(refund>0)notify('Skills reset. Refunded '+refund+' SP.');
    renderSkills();
  }

  function locked(s,ks){
    return typeof s.req==='function'&&!s.req(ks||{});
  }

  function renderSkills(){
    var b=document.getElementById('ftBody');if(!b)return;
    if(!ST||!ST.p){b.innerHTML='';return;}
    var p=ST.p;if(typeof initFeats==='function')initFeats();
    var ks=p.ks||{};
    b.innerHTML='';
    var h=document.createElement('div');
    h.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 2px;flex-wrap:wrap;';
    var spTxt=document.createElement('span');
    spTxt.id='skSp';
    spTxt.style.cssText='color:#ffaa00;font-weight:700;';
    spTxt.textContent='SKILL POINTS: '+(p.sp||0);
    h.appendChild(spTxt);
    var rr=document.createElement('button');rr.className='btn btn-sm';rr.textContent='RESET (50% refund)';
    rr.onclick=reset;h.appendChild(rr);
    b.appendChild(h);
    var g=document.createElement('div');
    g.style.cssText='display:flex;flex-direction:column;gap:6px;';
    SKILLS.forEach(function(s){
      var r=ks[s.id]||0;
      var lk=locked(s,ks);
      var maxed=r>=s.mx;
      var row=document.createElement('div');
      row.className='sk-r'+(lk?' sk-lock':'');
      var info=document.createElement('div');info.className='sk-t';
      info.innerHTML='<span class="sk-ic">'+s.ic+'</span><div><b>'+s.nm+'</b><span class="sk-c">'+s.d+(lk?' <span style="color:#ff6a6a">(locked)</span>':'')+'</span></div>';
      var pips=document.createElement('div');pips.className='sk-pips';
      for(var i=0;i<s.mx;i++){
        var pp=document.createElement('span');pp.className='pip'+(i<r?' on':'');
        pips.appendChild(pp);
      }
      var btn=document.createElement('button');btn.className='btn btn-sm';
      btn.disabled=lk||maxed||(p.sp||0)<s.cost;
      btn.textContent=maxed?'MAX':s.cost+' SP';
      btn.onclick=function(){buy(s.id);};
      row.appendChild(info);row.appendChild(pips);row.appendChild(btn);
      g.appendChild(row);
    });
    b.appendChild(g);
  }

  window._SK={SKILLS:SKILLS,bonusOf:bonusOf,sync:sync,earn:earn,buy:buy,reset:reset,renderSkills:renderSkills};
})();