/* Level Bonus — 5 cărți (2 recompense, 3 penalizări) care se întorc,
   se amestecă în fața copilului, iar copilul alege una.
   Folosire: RebeBonus.show(function(delta){ ...aplică delta la stele... }); */
(function(){
  'use strict';

  var VALUES = [3, 7, -1, -3, -7];
  var SLOT_COUNT = VALUES.length;
  var CARD_W = 18; // % din lățimea mesei
  var STEP = (100 - CARD_W) / (SLOT_COUNT - 1);

  var CSS = [
    '.lb-overlay{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;',
    '  background:radial-gradient(circle at 50% 35%,rgba(109,40,217,.93),rgba(30,10,60,.97));opacity:0;transition:opacity .4s;',
    '  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);',
    '  font-family:inherit;-webkit-user-select:none;user-select:none;}',
    '.lb-overlay.on{opacity:1;}',
    '.lb-box{width:min(640px,96vw);text-align:center;color:#fff;}',
    '.lb-title{margin:0 0 4px;font-size:clamp(30px,7vw,48px);font-weight:900;letter-spacing:1px;color:#ffe066;',
    '  text-shadow:0 3px 0 #b45309,0 6px 18px rgba(0,0,0,.35);animation:lb-pop .6s cubic-bezier(.34,1.56,.64,1);}',
    '.lb-msg{min-height:1.5em;margin:0 0 14px;font-size:clamp(17px,4vw,22px);font-weight:700;}',
    '.lb-table{position:relative;width:100%;aspect-ratio:100/42;}',
    '.lb-card{position:absolute;top:8%;width:' + CARD_W + '%;aspect-ratio:2/3;perspective:700px;cursor:default;',
    '  border:0;padding:0;background:none;font:inherit;-webkit-tap-highlight-color:transparent;}',
    '.lb-card:focus{outline:none;}',
    '.lb-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,.2,.2,1);}',
    '.lb-card.down .lb-inner{transform:rotateY(180deg);}',
    '.lb-face{position:absolute;inset:0;border-radius:14px;backface-visibility:hidden;-webkit-backface-visibility:hidden;',
    '  display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 0 rgba(0,0,0,.25),0 10px 22px rgba(0,0,0,.3);}',
    '.lb-front{border:4px solid #fff;}',
    '.lb-front.good{background:linear-gradient(160deg,#fef08a,#facc15 55%,#f59e0b);color:#7c2d12;}',
    '.lb-front.bad{background:linear-gradient(160deg,#fecdd3,#fb7185 55%,#e11d48);color:#fff;}',
    '.lb-num{font-size:clamp(26px,7.5vw,48px);font-weight:900;line-height:1;}',
    '.lb-star{font-size:clamp(16px,4.5vw,28px);margin-top:4px;}',
    '.lb-back{transform:rotateY(180deg);border:4px solid #fff;overflow:hidden;',
    '  background:repeating-linear-gradient(45deg,#ec4899 0 10px,#db2777 10px 20px);}',
    '.lb-back::before{content:"";position:absolute;inset:8%;border-radius:10px;border:3px dashed rgba(255,255,255,.7);}',
    '.lb-back img{width:62%;height:auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3));}',
    '.lb-back span{font-size:clamp(18px,5vw,30px);font-weight:900;color:#fff;text-shadow:0 2px 0 #9d174d;}',
    '.lb-table.pick .lb-card{cursor:pointer;}',
    '.lb-table.pick .lb-card .lb-inner{animation:lb-wiggle 1.4s ease-in-out infinite;}',
    '.lb-table.pick .lb-card:nth-child(2) .lb-inner{animation-delay:-.3s;}',
    '.lb-table.pick .lb-card:nth-child(3) .lb-inner{animation-delay:-.6s;}',
    '.lb-table.pick .lb-card:nth-child(4) .lb-inner{animation-delay:-.9s;}',
    '.lb-table.pick .lb-card:nth-child(5) .lb-inner{animation-delay:-1.2s;}',
    '.lb-table.pick .lb-card:hover .lb-inner,.lb-table.pick .lb-card:focus-visible .lb-inner{animation:none;transform:rotateY(180deg) translateY(-10%) scale(1.06);}',
    '.lb-card.chosen{z-index:3;}',
    '.lb-card.chosen .lb-inner{transform:translateY(-8%) scale(1.15);}',
    '.lb-card.chosen .lb-face{box-shadow:0 0 0 5px #fff,0 0 30px 8px #ffe066;}',
    '.lb-card.dim .lb-face{filter:grayscale(.6) brightness(.6);}',
    '.lb-result{min-height:1.4em;margin:10px 0 0;font-size:clamp(28px,7vw,44px);font-weight:900;}',
    '.lb-result.good{color:#fde047;animation:lb-pop .6s cubic-bezier(.34,1.56,.64,1);}',
    '.lb-result.bad{color:#fda4af;animation:lb-shake .5s ease;}',
    '.lb-total{margin-top:4px;font-size:clamp(17px,4vw,22px);font-weight:800;color:#fff;}',
    '.lb-btn{margin-top:12px;border:0;border-radius:999px;padding:12px 28px;font:inherit;font-size:20px;font-weight:800;',
    '  color:#fff;background:#22c55e;box-shadow:0 5px 0 #15803d;cursor:pointer;}',
    '.lb-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #15803d;}',
    '@keyframes lb-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}',
    '@keyframes lb-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}',
    '@keyframes lb-wiggle{0%,100%{transform:rotateY(180deg) rotate(-2deg)}50%{transform:rotateY(180deg) rotate(2deg) translateY(-3%)}}'
  ].join('\n');

  var queue = [];
  var busy = false;
  var audio = null;

  function injectCss(){
    if(document.getElementById('lb-style')) return;
    var st = document.createElement('style');
    st.id = 'lb-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  function el(tag, cls, text){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(text != null) n.textContent = text;
    return n;
  }
  function wait(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function shuffle(a){
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }
  function fmt(v){ return (v > 0 ? '+' : '−') + Math.abs(v); }
  function slotLeft(i){ return (i * STEP) + '%'; }

  function tone(freq, dur, type, delay){
    if(localStorage.getItem('rebe_muted') === '1') return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    try{
      if(!audio) audio = new AC();
      if(audio.state === 'suspended') audio.resume();
      var t0 = audio.currentTime + (delay || 0);
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      o.connect(g); g.connect(audio.destination);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.start(t0); o.stop(t0 + dur + 0.02);
    }catch(e){}
  }
  function flipSound(){ tone(520, 0.08, 'triangle'); }
  function swooshSound(){ tone(300 + Math.random()*200, 0.12, 'triangle'); }
  function winSound(){ [523, 659, 784, 1047].forEach(function(f, i){ tone(f, 0.22, 'sine', i*0.11); }); }
  function loseSound(){ [392, 330, 262].forEach(function(f, i){ tone(f, 0.25, 'sawtooth', i*0.14); }); }

  function moveCard(card, from, to, lift, ms){
    var a = parseFloat(from), b = parseFloat(to);
    var anim = card.animate([
      { left: a + '%', transform: 'translateY(0) rotate(0deg)' },
      { left: ((a + b) / 2) + '%', transform: 'translateY(' + lift + '%) rotate(' + (lift > 0 ? 6 : -6) + 'deg)', offset: .5 },
      { left: b + '%', transform: 'translateY(0) rotate(0deg)' }
    ], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
    return anim.finished.then(function(){
      card.style.left = b + '%';
      anim.cancel();
    });
  }

  function run(apply){
    busy = true;
    injectCss();

    var overlay = el('div', 'lb-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Level Bonus');
    var box = el('div', 'lb-box');
    var title = el('h2', 'lb-title', '🎁 Level Bonus! 🎁');
    var msg = el('p', 'lb-msg', 'Uită-te bine la cărți!');
    msg.setAttribute('aria-live', 'polite');
    var table = el('div', 'lb-table');
    var result = el('div', 'lb-result');
    box.appendChild(title); box.appendChild(msg); box.appendChild(table); box.appendChild(result);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // slot[i] = cartea aflată pe poziția i
    var slots = [];
    VALUES.forEach(function(v, i){
      var card = el('button', 'lb-card');
      card.type = 'button';
      card.tabIndex = -1;
      card.setAttribute('aria-label', 'Carte ' + fmt(v));
      card.style.left = slotLeft(i);
      card._value = v;
      var inner = el('div', 'lb-inner');
      var front = el('div', 'lb-face lb-front ' + (v > 0 ? 'good' : 'bad'));
      front.appendChild(el('div', 'lb-num', fmt(v)));
      front.appendChild(el('div', 'lb-star', v > 0 ? '⭐' : '💔'));
      var back = el('div', 'lb-face lb-back');
      var img = el('img');
      img.src = 'rebe-head.png'; img.alt = '';
      img.onerror = function(){ back.replaceChild(el('span', null, '?'), img); };
      back.appendChild(img);
      inner.appendChild(front); inner.appendChild(back);
      card.appendChild(inner);
      table.appendChild(card);
      slots.push(card);
    });

    requestAnimationFrame(function(){ overlay.classList.add('on'); });

    function swapSlots(i, j, ms){
      var ci = slots[i], cj = slots[j];
      slots[i] = cj; slots[j] = ci;
      return Promise.all([
        moveCard(ci, slotLeft(i), slotLeft(j), -55, ms),
        moveCard(cj, slotLeft(j), slotLeft(i), 35, ms)
      ]);
    }

    function randomPair(){
      var i = Math.floor(Math.random() * SLOT_COUNT), j;
      do { j = Math.floor(Math.random() * SLOT_COUNT); } while(j === i);
      return [i, j];
    }

    function shuffleCards(){
      var p = Promise.resolve();
      var rounds = 7;
      for(var k = 0; k < rounds; k++){
        p = p.then(function(){
          swooshSound();
          var ms = 520;
          var a = randomPair();
          // uneori două schimbări simultane
          if(Math.random() < 0.4){
            var rest = [];
            for(var s = 0; s < SLOT_COUNT; s++) if(s !== a[0] && s !== a[1]) rest.push(s);
            shuffle(rest);
            return Promise.all([swapSlots(a[0], a[1], ms), swapSlots(rest[0], rest[1], ms)]);
          }
          return swapSlots(a[0], a[1], ms);
        }).then(function(){ return wait(80); });
      }
      return p;
    }

    function letPick(){
      return new Promise(function(resolve){
        table.classList.add('pick');
        msg.textContent = 'Alege o carte! 👆';
        slots.forEach(function(c){
          c.tabIndex = 0;
          c.setAttribute('aria-label', 'Carte cu fața în jos');
          c.addEventListener('click', function onPick(){
            if(!table.classList.contains('pick')) return;
            table.classList.remove('pick');
            slots.forEach(function(x){ x.tabIndex = -1; });
            resolve(c);
          });
        });
      });
    }

    wait(2200)
      .then(function(){
        msg.textContent = 'Cărțile se întorc…';
        return slots.reduce(function(p, c, i){
          return p.then(function(){ c.classList.add('down'); flipSound(); return wait(160); });
        }, Promise.resolve());
      })
      .then(function(){ return wait(650); })
      .then(function(){ msg.textContent = 'Le amestec! Urmărește-le! 👀'; return shuffleCards(); })
      .then(function(){ return wait(250); })
      .then(letPick)
      .then(function(card){
        var v = card._value;
        card.classList.add('chosen');
        card.classList.remove('down');
        flipSound();
        return wait(650).then(function(){
          if(v > 0){
            winSound();
            msg.textContent = 'Super! Ai câștigat stele! 🎉';
            result.className = 'lb-result good';
          } else {
            loseSound();
            msg.textContent = 'Oops! Data viitoare ai mai mult noroc! 🍀';
            result.className = 'lb-result bad';
          }
          result.textContent = fmt(v) + ' ⭐';
          var total;
          try{ total = apply(v); }catch(e){}
          if(typeof total === 'number'){
            result.appendChild(el('div', 'lb-total', 'Acum ai ' + total + ' ⭐'));
          }
          return wait(900);
        }).then(function(){
          slots.forEach(function(c){
            if(c !== card){ c.classList.add('dim'); c.classList.remove('down'); }
          });
          return wait(500);
        });
      })
      .then(function(){
        var btn = el('button', 'lb-btn', 'Continuăm ▶');
        btn.type = 'button';
        box.appendChild(btn);
        btn.focus({ preventScroll: true });
        return new Promise(function(resolve){ btn.addEventListener('click', resolve); });
      })
      .then(function(){
        overlay.classList.remove('on');
        return wait(400);
      })
      .then(function(){
        overlay.remove();
        busy = false;
        if(queue.length) run(queue.shift());
      });
  }

  window.RebeBonus = {
    show: function(apply){
      if(typeof apply !== 'function') apply = function(){};
      if(busy) queue.push(apply);
      else run(apply);
    }
  };
})();
