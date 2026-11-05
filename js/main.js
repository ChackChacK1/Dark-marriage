(function () {
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');

    if (!header || !toggle || !nav) {
      return;
    }

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    }

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 880) {
        setOpen(false);
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');

    if (!items.length) {
      return;
    }

    document.documentElement.classList.add('reveal-ready');

    function showAll() {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
    }

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) {
          continue;
        }

        entries[i].target.classList.add('is-visible');
        observer.unobserve(entries[i].target);
      }
    }, {
      rootMargin: '0px 0px 10% 0px',
      threshold: 0.01
    });

    for (var i = 0; i < items.length; i++) {
      observer.observe(items[i]);
    }
  }

  initReveal();
  initNav();
})();
