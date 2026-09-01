(function(){
  var STEPS=[
    {t:'Selamat Datang, Pengembara',d:'Gunakan <b>WASD</b> untuk bergerak & <b>E</b> untuk bercakap/siasat. Bar kuning <b>▸ Misi</b> di atas HUD tunjuk misi aktif — klik untuk buka Quest [Q].'},
    {t:'Kumpul Bukti',d:'Dekati objek bercahaya (🏚️ 📌 🐾) & tekan <b>E</b>. Bukti masuk <b>Evidence Board [V]</b>. Bukti yang betul membuka pilihan dialog baru — bandingkan cerita mereka!'},
    {t:'Cari Jalan di Peta',d:'Buka minimap kanan bawah: <b>◆ kuning berkelip</b> = objektif misi, <b>bulatan biru</b> = pintu keluar ke peta lain. Jika misi di peta lain, penanda tulis “→ NAMA PETA”. Berjalan ke situ.'},
    {t:'Bertarung & Eye of Truth',d:'Sentuh musuh untuk lawan (giliran). Tekan <b>Space</b> = Eye of Truth untuk bongkar topeng bos. Bila misi siap, <b>kembali ke pemberi misi</b> & cakap semula (E) untuk selesai.'}
  ];
  var idx=0, active=false;
  function render(){
    var c=document.getElementById('tut');if(!c)return;
    c.style.display='flex';
    document.getElementById('tutT').textContent=STEPS[idx].t;
    document.getElementById('tutD').innerHTML=STEPS[idx].d;
    document.getElementById('tutP').textContent=(idx+1)+' / '+STEPS.length;
    document.getElementById('tutNext').textContent=idx===STEPS.length-1?'Mula Bermain ✓':'Seterusnya →';
  }
  function start(){
    if(localStorage.getItem('tlw_tutDone')==='1')return;
    idx=0;active=true;render();
  }
  function next(){
    if(!active)return;
    idx++;
    if(idx>=STEPS.length){closeTut();return;}
    render();
    if(typeof Snd!=='undefined'&&Snd.ui)Snd.ui();
  }
  function skip(){closeTut();}
  function closeTut(){
    var c=document.getElementById('tut');if(c)c.style.display='none';
    active=false;
    localStorage.setItem('tlw_tutDone','1');
  }
  function reset(){localStorage.removeItem('tlw_tutDone');idx=0;}
  window.Tut={start:start,next:next,skip:skip,close:closeTut,reset:reset};
})();