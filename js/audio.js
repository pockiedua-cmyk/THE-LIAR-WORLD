const Snd=(function(){
  let ac=null,muted=localStorage.getItem('tlw_snd')==='0',region=null;
  let timer=null,step=0,lastNote=0;

  const SCALES={
    pro:{root:45,scale:[0,3,5,7,10],t:int=>440*Math.pow(2,(int+3)/12),sp:520,octave:false},
    r1:{root:53,scale:[0,4,7,9,11],t:int=>440*Math.pow(2,(int-9)/12),sp:560},
    r2:{root:50,scale:[0,2,7,9],t:int=>440*Math.pow(2,(int-9)/12),sp:600},
    r3:{root:48,scale:[0,3,7,10],t:int=>440*Math.pow(2,(int-5)/12),sp:640},
    r4:{root:52,scale:[0,1,3,5,8],t:int=>440*Math.pow(2,(int-7)/12),sp:680},
    r5:{root:55,scale:[0,2,3,5,7,10],t:int=>440*Math.pow(2,(int-3)/12),sp:720},
    r6:{root:56,scale:[0,2,4,7,9],t:int=>440*Math.pow(2,(int-4)/12),sp:500},
    r7:{root:45,scale:[0,3,6,9],t:int=>440*Math.pow(2,(int-3)/12),sp:760}
  };
  const TITLE=SCALES.pro;

  function ensure(){
    if(!ac){
      try{
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return null;
        ac=new AC();
      }catch(e){return null;}
    }
    if(ac.state==='suspended'){try{ac.resume();}catch(e){}}
    return ac;
  }

  function unlock(){
    const c=ensure();
    if(c){startBGM();}
    window.removeEventListener('keydown',unlock);
    window.removeEventListener('pointerdown',unlock);
  }

  function midiToFreq(s,r){return 440*Math.pow(2,(s-69)/12)*(r||1);}

  function tone(f,dur,type,vol,when,slideTo){
    const c=ac;if(!c)return;if(muted)return;
    const t=c.currentTime+(when||0);
    const o=c.createOscillator(),g=c.createGain();
    o.type=type||'triangle';o.frequency.setValueAtTime(f,t);
    if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol||0.08,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(c.destination);
    o.start(t);o.stop(t+dur+0.05);
  }

  function noise(dur,vol,freq){
    const c=ac;if(!c)return;if(muted)return;
    const t=c.currentTime;
    const n=c.createBufferSource();
    const buf=c.createBuffer(1,ac.sampleRate*dur,ac.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
    n.buffer=buf;
    const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=freq||800;
    const g=c.createGain();g.gain.setValueAtTime(vol||0.06,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    n.connect(f);f.connect(g);g.connect(c.destination);
    n.start(t);
  }

  function stepTick(){
    if(!ac)return;
    const cfg=SCALES[region]||TITLE;
    if(muted||ac.state!=='running')return;
    const now=ac.currentTime;
    if(now-lastNote< (cfg.sp/1000)*0.25)return;
    lastNote=now;
    const s=cfg.scale;
    const n=cfg.scale[step%s.length];
    const freq=cfg.t ? cfg.t(cfg.root+n) : midiToFreq(cfg.root+n,2);
    const oct=Math.random()<0.15?0.5:1;
    tone(freq*oct,1.6,Math.random()<0.3?'sine':'triangle',0.035);
    if(step%4===0){
      tone(cfg.t?cfg.t(cfg.root):midiToFreq(cfg.root-12,1),3.2,'sine',0.045);
    }
    step++;
  }

  function startBGM(){
    if(!ac)return;
    if(timer&&ac.state==='running')return;
    clearInterval(timer);
    timer=setInterval(stepTick,240);
  }

  function setRegion(r){
    region=r;
    step=0;
    startBGM();
  }

  return{
    unlock:unlock,
    ensure:ensure,
    setRegion:setRegion,
    isMuted:function(){return muted;},
    toggle:function(){
      muted=!muted;
      localStorage.setItem('tlw_snd',muted?'0':'1');
      if(!muted&&!ac)unlock();
      return muted;
    },
    ui:function(){tone(700,0.06,'square',0.02);},
    hud:function(){tone(440,0.1,'triangle',0.05);},
    talk:function(){tone(392,0.12,'sine',0.05);setTimeout(function(){tone(494,0.15,'sine',0.05);},110);},
    hit:function(){tone(180,0.12,'square',0.07,0,120);noise(0.08,0.05,1400);},
    crit:function(){tone(120,0.2,'sawtooth',0.09,0,60);noise(0.12,0.07,900);},
    cast:function(){tone(660,0.18,'sine',0.06,0,990);tone(990,0.12,'sine',0.04,0.1,1320);},
    hurt:function(){tone(220,0.14,'sawtooth',0.08,0,110);tone(110,0.2,'square',0.05,0.02,55);},
    heal:function(){tone(523,0.14,'sine',0.06);tone(784,0.16,'sine',0.06,0.12);tone(1046,0.22,'sine',0.05,0.26);},
    pickup:function(){tone(880,0.07,'square',0.04);tone(1174,0.1,'square',0.04,0.06);},
    evi:function(){tone(523,0.1,'triangle',0.06);tone(659,0.12,'triangle',0.06,0.1);tone(880,0.16,'triangle',0.05,0.2);},
    lv:function(){[523,659,784,1046].forEach(function(f,i){tone(f,0.16,'triangle',0.06,i*0.09);});},
    ach:function(){[659,880,1174,1568].forEach(function(f,i){tone(f,0.18,'sine',0.06,i*0.07);});},
    battle:function(){tone(146,0.25,'sawtooth',0.08,0,98);tone(98,0.3,'square',0.06,0.03,73);noise(0.2,0.06,600);},
    eye:function(){tone(1200,0.3,'sine',0.05,0,600);tone(1500,0.4,'sine',0.04,0.2,750);},
    win:function(){[392,523,659,784].forEach(function(f,i){tone(f,0.2,'triangle',0.07,i*0.12);});tone(1046,0.5,'sine',0.06,0.5);},
    lose:function(){[293,233,174].forEach(function(f,i){tone(f,0.4,'sawtooth',0.07,i*0.2);});},
    flee:function(){tone(300,0.2,'square',0.06,0,900);},
    buy:function(){tone(587,0.1,'square',0.05);tone(880,0.12,'square',0.05,0.08);},
    sell:function(){tone(880,0.1,'square',0.05);tone(587,0.12,'square',0.05,0.08);},
    theo:function(){tone(494,0.12,'sine',0.05);tone(622,0.12,'sine',0.05,0.1);tone(740,0.2,'sine',0.05,0.2);},
    deny:function(){tone(200,0.12,'square',0.05,0,160);},
    step:function(){tone(150,0.05,'triangle',0.015);}
  };
})();

window.addEventListener('keydown',Snd.unlock);
window.addEventListener('pointerdown',Snd.unlock);