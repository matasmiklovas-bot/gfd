// Static preview (GitHub Pages): the small bits of behaviour the exported HTML needs without React.
(function () {
  function toast(text) {
    var t = document.createElement('div');
    t.className = 'preview-toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  var LT = document.documentElement.lang === 'lt';
  var LIVE = LT ? 'Demonstracinėje versijoje tai neveikia.' : 'Not available in this preview.';

  // Mobile menu
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('invisible', !open);
    menu.classList.toggle('opacity-0', !open);
    menu.classList.toggle('visible', open);
    menu.classList.toggle('opacity-100', open);
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    menu.querySelectorAll('li.translate-y-3, li.translate-y-0').forEach(function (li) {
      li.classList.toggle('translate-y-3', !open); li.classList.toggle('opacity-0', !open);
      li.classList.toggle('translate-y-0', open); li.classList.toggle('opacity-100', open);
    });
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('[aria-controls="mobile-menu"]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(true); });
  });
  if (menu) {
    var close = menu.querySelector('button');
    if (close) close.addEventListener('click', function () { setMenu(false); });
  }

  // Home header: transparent over the hero, white once scrolled
  var header = document.querySelector('header');
  if (header && header.classList.contains('bg-transparent')) {
    var onScroll = function () {
      var s = window.scrollY > 24;
      header.classList.toggle('bg-transparent', !s); header.classList.toggle('border-transparent', !s);
      header.classList.toggle('bg-white', s); header.classList.toggle('border-line', s);
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Product slider arrows
  var NEXT = ['Next products', 'Kitos prekės'];
  document.querySelectorAll('[aria-label="Previous products"], [aria-label="Next products"], [aria-label="Ankstesnės prekės"], [aria-label="Kitos prekės"]').forEach(function (b) {
    b.addEventListener('click', function () {
      var track = b.closest('section').querySelector('ul');
      var dir = NEXT.indexOf(b.getAttribute('aria-label')) >= 0 ? 1 : -1;
      track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  // Size buttons: show the choice
  document.querySelectorAll('fieldset button, [role="radiogroup"] button').forEach(function (b) {
    if (!/^(XXS|XS|S|M|L|XL|XXL|ONE SIZE)$/.test(b.textContent.trim())) return;
    b.addEventListener('click', function () {
      b.parentElement.querySelectorAll('button').forEach(function (o) { o.classList.remove('bg-ink', 'text-white', 'border-ink'); });
      b.classList.add('bg-ink', 'text-white', 'border-ink');
    });
  });

  // Everything that needs the real store
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[data-unavailable], button');
    if (!el) return;
    if (el.matches('a[data-unavailable]')) { e.preventDefault(); toast(LIVE); return; }
    if (el.closest('#mobile-menu') && el === menu.querySelector('button')) return;
    if (el.matches('[aria-controls="mobile-menu"], [aria-label$="products"], [aria-label$="prekės"]')) return;
    if (/^(XXS|XS|S|M|L|XL|XXL|ONE SIZE)$/.test(el.textContent.trim())) return;
    if (el.closest('details') || el.closest('summary')) return;
    if (el.type === 'submit' || /bag|search|filter|wishlist|sort|cookie|accept|reject|settings|add/i.test((el.getAttribute('aria-label') || '') + ' ' + el.textContent)) {
      e.preventDefault(); toast(LIVE);
    }
  });
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); toast(LIVE); });
  });
})();

// Header dropdowns (Women / Men)
(function () {
  document.querySelectorAll('header nav li').forEach(function (li) {
    var panel = li.querySelector(':scope > div.absolute');
    if (!panel) return;
    function set(open) {
      panel.classList.toggle('invisible', !open); panel.classList.toggle('opacity-0', !open);
      panel.classList.toggle('visible', open); panel.classList.toggle('opacity-100', open);
      var header = li.closest('header');
      if (header && open) { header.classList.remove('bg-transparent', 'border-transparent'); header.classList.add('bg-white', 'border-line'); }
    }
    li.addEventListener('mouseenter', function () { set(true); });
    li.addEventListener('mouseleave', function () { set(false); });
    li.addEventListener('focusin', function () { set(true); });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) set(false); });
  });
})();
