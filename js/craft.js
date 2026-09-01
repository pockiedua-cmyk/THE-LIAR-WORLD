(function(){
  var RECIPES=[
    {id:'r_hpotion',nm:'Brew Health Potion',out:'hpotion',qty:1,mats:{herb_bundle:2,wolf_fang:1},desc:'Heals 30 HP.'},
    {id:'r_mpotion',nm:'Brew Mana Potion',out:'mpotion',qty:1,mats:{crystal_shard:2,shadow_ess:1},desc:'Restores 25 MP.'},
    {id:'r_iron_sword',nm:'Forge Iron Sword',out:'iron_sword',qty:1,mats:{iron_scrap:3,wolf_fang:2},desc:'+6 ATK reliable blade.'},
    {id:'r_root_blade',nm:'Forge Root Blade',out:'root_blade',qty:1,mats:{root_shard:3,iron_scrap:2,wolf_fang:1},desc:'+9 ATK living wood.'},
    {id:'r_frost_blade',nm:'Forge Frost Blade',out:'frost_blade',qty:1,mats:{frost_shard:3,crystal_shard:2,shadow_ess:1},desc:'+12 ATK cold steel.'},
    {id:'r_leather',nm:'Stitch Leather Armor',out:'leather_armor',qty:1,mats:{wolf_fang:2,spider_silk:2},desc:'+5 DEF treated hide.'},
    {id:'r_rarmor',nm:'Weave Root Armor',out:'rarmor',qty:1,mats:{root_shard:2,spider_silk:2,iron_scrap:1},desc:'+8 DEF living roots.'},
    {id:'r_frost_plate',nm:'Plate Frost Armor',out:'frost_plate',qty:1,mats:{frost_shard:2,crystal_shard:2,root_shard:1},desc:'+12 DEF rimed plate.'}
  ];

  function countMat(id){
    var inv=ST.p&&ST.p.inv||[];
    var e=inv.find(function(x){return x.id===id;});
    return e?(e.qty||1):0;
  }

  function canCraft(r){
    for(var k in r.mats){if(countMat(k)<r.mats[k])return false;}
    return true;
  }

  function doCraft(rid){
    if(!ST||!ST.p)return;
    var r=RECIPES.find(function(x){return x.id===rid;});if(!r)return;
    if(!canCraft(r)){Snd.deny();notify('Missing materials.');return;}
    for(var k in r.mats){
      var need=r.mats[k];
      var idx=ST.p.inv.findIndex(function(x){return x.id===k;});
      if(idx<0)continue;
      var it=ST.p.inv[idx];
      it.qty=(it.qty||1)-need;
      if(it.qty<=0)ST.p.inv.splice(idx,1);
    }
    var out=ITEM_DEFS[r.out];
    if(out)addItem({...out});
    else addItem({id:r.out,nm:r.nm,icon:'\u25A6',desc:r.desc,qty:r.qty});
    if(typeof Snd!=='undefined'&&Snd.buy)Snd.buy();
    ST.p.stat.crafts=(ST.p.stat.crafts||0)+1;
    notify('Crafted '+r.nm+'!');
    if(typeof _CF!=='undefined'&&_CF.journalAdd)_CF.journalAdd('world','Crafted '+r.nm+'.');
    if(typeof uHUD==='function')uHUD();
    renderCraft();
    if(typeof checkAch==='function')checkAch();
  }

  function openCraft(){
    var el=document.getElementById('cr');if(!el)return;
    el.style.display='block';
    renderCraft();
  }
  function closeCraft(){var el=document.getElementById('cr');if(el)el.style.display='none';}

  function renderCraft(){
    var b=document.getElementById('crL');if(!b)return;
    if(!ST||!ST.p){b.innerHTML='';return;}
    if(typeof initFeats==='function')initFeats();
    b.innerHTML='';
    RECIPES.forEach(function(r){
      var ok=canCraft(r);
      var row=document.createElement('div');row.className='bt-r';
      var info=document.createElement('div');
      var out=ITEM_DEFS[r.out];
      var mats=Object.entries(r.mats).map(function(m){var have=countMat(m[0]);var need=m[1];var nm=(ITEM_DEFS[m[0]]&&ITEM_DEFS[m[0]].nm)||m[0];return '<span style="color:'+(have>=need?'#6aff8a':'#ff6a6a')+'">'+nm+' '+have+'/'+need+'</span>';}).join(' \u00B7 ');
      info.innerHTML='<b>'+r.nm+'</b><span class="sk-c">'+r.desc+'</span><span class="sk-c">'+mats+' \u2192 '+(out?out.nm:r.out)+'</span>';
      row.appendChild(info);
      var btn=document.createElement('button');btn.className='btn btn-sm';
      btn.textContent=ok?'CRAFT':'NEED MATS';
      btn.disabled=!ok;
      btn.onclick=function(){doCraft(r.id);};
      row.appendChild(btn);
      b.appendChild(row);
    });
  }

  if(typeof UI!=='undefined'){UI.openCraft=openCraft;UI.closeCraft=closeCraft;}
  window._CR={RECIPES:RECIPES,canCraft:canCraft,doCraft:doCraft,openCraft:openCraft,closeCraft:closeCraft,renderCraft:renderCraft};
})();