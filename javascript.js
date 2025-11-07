(function(){
  // Duration should match CSS transition (320ms)
  var TRANSITION_MS = 320;

  function initMobileNav(){
    var toggle = document.getElementById('mobile-toggle');
    var nav = document.getElementById('site-nav');
    if(toggle && nav){
      toggle.addEventListener('click', function(){
        if(nav.style.display === 'flex') nav.style.display = '';
        else nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.gap = '10px';
      });
    }
  }

  // Smooth scroll for same-page hash links
  function initHashScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
      anchor.addEventListener('click', function(e){
        var href = anchor.getAttribute('href');
        if(href.length > 1 && href.startsWith('#')){
          e.preventDefault();
          var target = document.querySelector(href);
          if(target){
            target.scrollIntoView({behavior:'smooth', block:'start'});
            history.pushState(null, '', href);
          }
        }
      });
    });
  }

  // Lightweight click tracking for buttons (could break if used in iframes so b careful)
  function initButtonTracking(){
    document.querySelectorAll('.btn, .btn-primary, .btn-ghost').forEach(function(b){
      b.addEventListener('click', function(){
        console.log('UI button clicked:', (b.textContent || b.innerText).trim());
      });
    });
  }

  // Page transitions: fade-in on load, fade-out on navigation
  function initPageTransitions(){
    var body = document.body;

    // when the script runs, the body may have *page-loading* class set in HTML this could mess up my css idk
    // remove it on next animation frame so the CSS transition animates the fade-in.
    requestAnimationFrame(function(){
      // slight timeout ensures the browser registers the initial state before transition.
      setTimeout(function(){
        body.classList.remove('page-loading');
      }, 8);
    });

    // iintercept clicks on local links to play fade-out then navigate
    document.addEventListener('click', function(e){
      var anchor = e.target.closest('a');
      if(!anchor) return;

      var href = anchor.getAttribute('href');
      // no href or hash-only handled elsewhere
      if(!href) return;
      if(href.startsWith('#')) return; // allow hash scrolling handler
      if(anchor.target && anchor.target !== '' && anchor.target !== '_self') return; // allow new tabs
      if(anchor.hasAttribute('download')) return; // allow downloads

      // Only handle same-origin / relative links
      try{
        var url = new URL(href, location.href);
        if(url.origin !== location.origin) return; // external
      }catch(err){
        return; // invalid URL
      }

      // Prevent default and animate
      e.preventDefault();
      // If already transitioning, ignore
      if(body.classList.contains('page-loading')) return;
      body.classList.add('page-loading');

      // Give the CSS transition time to play, then navigate
      setTimeout(function(){
        window.location.href = href;
      }, TRANSITION_MS);
    }, {capture:false});
  }

  // Initialize on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      initMobileNav();
      initHashScroll();
      initButtonTracking();
      initPageTransitions();
      // set year elements if present
      var yearEl = document.getElementById('year');
      if(yearEl) yearEl.textContent = new Date().getFullYear();
    });
  } else {
    initMobileNav();
    initHashScroll();
    initButtonTracking();
    initPageTransitions();
    var yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  }
})();
