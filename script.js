(function(){
  var track = document.getElementById('rollTrack');
  if(!track) return;
  var originals = Array.prototype.slice.call(track.children);
  var n = originals.length;
  if(!n) return;

  // Copies before and after the real photos so the roll never runs out
  function cloneSet(){
    return originals.map(function(li){
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('img').forEach(function(im){ im.alt = ''; im.loading = 'eager'; });
      return c;
    });
  }
  var before = cloneSet(), after = cloneSet();
  before.forEach(function(c){ track.insertBefore(c, originals[0]); });
  after.forEach(function(c){ track.appendChild(c); });

  var items = track.children;
  function setWidth(){ return items[n].offsetLeft - items[0].offsetLeft; }
  function step(){ return items[1].offsetLeft - items[0].offsetLeft; }

  function jump(to){
    track.style.scrollSnapType = 'none';
    track.scrollLeft = to;
    track.offsetWidth; // apply before snapping back on
    track.style.scrollSnapType = '';
  }
  function recentre(){
    var w = setWidth(), x = track.scrollLeft;
    if(x < w * 0.5) jump(x + w);
    else if(x >= w * 1.5) jump(x - w);
  }
  function start(){ jump(items[n].offsetLeft - items[0].offsetLeft); }

  var t;
  track.addEventListener('scroll', function(){
    clearTimeout(t);
    t = setTimeout(recentre, 120);
  }, { passive: true });
  if('onscrollend' in window) track.addEventListener('scrollend', recentre);

  document.querySelectorAll('.roll-btn').forEach(function(b){
    b.addEventListener('click', function(){
      recentre();
      track.scrollBy({ left: step() * +b.dataset.dir, behavior: 'smooth' });
    });
  });

  window.addEventListener('resize', function(){
    var w = setWidth(), x = track.scrollLeft;
    var idx = Math.round(x / step()) % n;
    jump(w + idx * step());
  });
  if(document.readyState === 'complete') start();
  else window.addEventListener('load', start);
  start();
})();

(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(!toggle || !links) return;
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Remember the language the visitor picked
(function(){
  document.querySelectorAll('.lang-switch a').forEach(function(a){
    a.addEventListener('click', function(){
      try{ localStorage.setItem('lum-lang', a.getAttribute('hreflang').slice(0, 2)); }catch(e){}
    });
  });
})();
