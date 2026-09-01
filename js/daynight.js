(function(){
  function initTime(p){
    if(p._time==null)p._time=8*60;
    if(p._day==null)p._day=1;
  }
  function getHour(){initTime(ST.p);return Math.floor((ST.p._time%1440)/60);}
  function isNight(){var h=getHour();return h<6||h>=18;}
  function fmt(){initTime(ST.p);var m=Math.floor(ST.p._time%1440);var h=Math.floor(m/60),mn=m%60;return (h<10?'0':'')+h+':'+(mn<10?'0':'')+mn;}
  function advance(mins){
    if(!ST||!ST.p)return;
    initTime(ST.p);
    ST.p._time+=mins;
    if(ST.p._time>=1440){ST.p._time-=1440;ST.p._day=(ST.p._day||1)+1;notify('Day '+ST.p._day+' dawns.');}
    updateClock();
    updateTint();
    if(typeof uHUD==='function')uHUD();
  }
  function rest(){
    if(!ST||!ST.p)return;
    initTime(ST.p);
    if(ST.p.gold<10){Snd.deny();notify('Rest costs 10 gold at the inn.');return;}
    ST.p.gold-=10;
    ST.p.hp=ST.p.mhp;ST.p.mp=ST.p.mmp;
    var h=getHour();
    var add=h<8?(8*60-ST.p._time):(32*60-ST.p._time);
    if(add<=0)add+=1440;
    ST.p._time+=add;
    if(ST.p._time>=1440){ST.p._time-=1440;ST.p._day++;}
    Snd.heal();
    notify('Rested till morning. Day '+ST.p._day+'.');
    updateClock();updateTint();if(typeof uHUD==='function')uHUD();
  }
  function updateClock(){
    var el=document.getElementById('clock');if(!el)return;
    initTime(ST.p);
    var h=getHour();
    var ic=isNight()?'🌙':'☀️';
    el.textContent=ic+' Day '+ST.p._day+' '+fmt();
    el.title=isNight()?'Night: enemies are stronger (+15% ATK)':'Day';
  }
  function updateTint(){
    var el=document.getElementById('dayTint');if(!el)return;
    var h=getHour();
    var op=0, col='rgba(10,10,40,0)';
    if(h>=19||h<5){op=0.22;col='rgba(10,10,50,0.22)';}
    else if(h>=18){op=0.12;col='rgba(30,10,40,0.12)';}
    else if(h>=6&&h<7){op=0.10;col='rgba(255,180,80,0.10)';}
    else op=0;
    el.style.background=col;
    el.style.opacity=op>0?1:0;
  }
  function tick(dt){
    if(!ST||!ST.p||ST.phase!=='explore')return;
    initTime(ST.p);
    advance(dt*0.015);
  }
  window._DN={initTime:initTime,getHour:getHour,isNight:isNight,fmt:fmt,advance:advance,rest:rest,updateClock:updateClock,updateTint:updateTint,tick:tick};
})();