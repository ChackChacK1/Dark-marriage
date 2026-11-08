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

  function initGallery() {
    var root = document.querySelector('[data-gallery]');

    if (!root) {
      return;
    }

    var viewport = root.querySelector('.gallery__viewport');
    var slides = root.querySelectorAll('.gallery__slide');
    var prev = root.querySelector('[data-gallery-prev]');
    var next = root.querySelector('[data-gallery-next]');
    var status = root.querySelector('.gallery__status');

    if (!viewport || !slides.length || !prev || !next) {
      return;
    }

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var ticking = false;

    function step() {
      if (slides.length > 1) {
        return slides[1].offsetLeft - slides[0].offsetLeft;
      }

      return slides[0].offsetWidth;
    }

    function perView() {
      var size = step();

      return size ? Math.max(1, Math.round(viewport.clientWidth / size)) : 1;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function currentIndex() {
      var size = step();

      return size ? Math.min(maxIndex(), Math.round(viewport.scrollLeft / size)) : 0;
    }

    function update() {
      var index = currentIndex();

      prev.disabled = index <= 0;
      next.disabled = index >= maxIndex();

      if (status) {
        status.textContent = (index + 1) + ' / ' + slides.length;
      }
    }

    function goTo(index) {
      viewport.scrollTo({
        left: Math.max(0, Math.min(maxIndex(), index)) * step(),
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    }

    prev.addEventListener('click', function () {
      goTo(currentIndex() - 1);
    });

    next.addEventListener('click', function () {
      goTo(currentIndex() + 1);
    });

    viewport.addEventListener('scroll', function () {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    });

    window.addEventListener('resize', update);

    update();
  }

  initReveal();
  initNav();
  initGallery();
})();
