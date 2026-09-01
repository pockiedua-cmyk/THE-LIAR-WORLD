(function(){
  const SCENES={
    root_beast:{title:'HEART SEED RECLAIMED',body:'The Root Beast collapses. Its roots wither. Beneath the altar, the Heart Seed pulses with living light. Greenfall will live — but the darkness below stirs.'},
    first_liar:{title:'THE FIRST LIE SHATTERS',body:'The gardener falls. The throne is empty. A lie believed by millions cracks — and reality shudders. You feel the world holding its breath.'},
    ending_self:{title:'WHO AM I?',type:'Ending — The Wanderer',body:'You are no one. And everyone. The First Lie made you a blank slate — a vessel for truth. You choose to remain nameless, so no one can lie about you again.'},
    ending_lie:{title:'WHAT WAS THE FIRST LIE?',type:'Ending — The Lie',body:'“All humans come from one family.” A simple sentence to stop a war. It worked. But the price was reality itself. You understand now — and carry that weight.'},
    ending_undo:{title:'CAN LIES BE UNDONE?',type:'Ending — Undo',body:'No. A believed lie becomes stone. You cannot unmake it — only plant a new truth beside it, and hope it grows.'},
    ending_nolies:{title:'A WORLD WITHOUT LIES',type:'Ending — Silence',body:'You imagine a world with no lies. It is quiet. It is empty. Without stories, no one moves. Perhaps lies are the engine.'},
    ending_truth:{title:'WHAT IS TRUTH?',type:'Ending — Truth',body:'Truth is what remains when you stop believing. It is smaller than you thought. And heavier. You carry it out of the throne room.'}
  };
  let cb=null;
  function open(title,type,body, onClose){
    const el=document.getElementById('cut');if(!el)return;
    document.getElementById('cutT').textContent=title;
    document.getElementById('cutTy').textContent=type||'';
    document.getElementById('cutX').textContent=body;
    el.style.display='flex';
    cb=onClose||null;
    if(typeof Snd!=='undefined'&&Snd.hud)Snd.hud();
  }
  function close(){
    const el=document.getElementById('cut');if(el)el.style.display='none';
    if(cb){const f=cb;cb=null;try{f();}catch(e){}}
  }
  function play(id, onClose){
    const sc=SCENES[id];
    if(!sc){
      if(onClose)onClose();
      return;
    }
    open(sc.title, sc.type||'', sc.body, onClose);
  }
  function playEnding(opt){
    const id=opt.replace('ending_','ending_');
    const sc=SCENES[id];
    if(!sc){
      if(typeof G!=='undefined'&&G.triggerEnding)G.triggerEnding(opt, opt, '', 'The world holds its breath.');
      return;
    }
    open(sc.title, sc.type, sc.body, function(){
      if(typeof G!=='undefined'&&G.triggerEnding)G.triggerEnding(opt, sc.title, sc.type, sc.body);
    });
  }
  window._CS={open:open,close:close,play:play,playEnding:playEnding,SCENES:SCENES};
  window.Cut={close:close};
})();