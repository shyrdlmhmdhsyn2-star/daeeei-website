(function () {
  'use strict';
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    gavel: '<path d="M14 4l6 6"/><path d="M11 7l6 6"/><path d="M8.5 9.5l6 6"/><path d="M3 21l7-7"/><path d="M12 20h9"/>',
    family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M15 20c0-2.4 1.5-4.2 3.6-4.6"/>',
    doc: '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/><path d="M9 13h7M9 17h7"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3"/><path d="M3 13h18"/>',
    scale: '<path d="M12 3v18"/><path d="M7 21h10"/><path d="M4 7h16"/><path d="M4 7l-3 7h6zM20 7l-3 7h6z"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.scale) + '</svg>';
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* تاریخ شمسی */
  function fa(dateStr) {
    try {
      var d = new Date(dateStr + 'T12:00:00');
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    } catch (e) { return dateStr; }
  }
  function toLatinDigits(s) {
    return String(s).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; })
                    .replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; });
  }

  /* منو و هدر */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  }

  /* نام و متن‌های عمومی */
  $$('[data-site="name"]').forEach(function (n) { n.textContent = S.name; });
  $$('[data-site="tagline"]').forEach(function (n) { n.textContent = S.tagline; });
  $$('[data-site="intro"]').forEach(function (n) { n.textContent = S.intro; });
  $$('[data-year]').forEach(function (n) { n.textContent = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date()); });

  /* خدمات */
  var sl = $('#services-list');
  if (sl && S.services) {
    var lim = parseInt(sl.getAttribute('data-limit'), 10) || S.services.length;
    S.services.slice(0, lim).forEach(function (s) {
      var c = el('article', 'card reveal');
      var i = el('div', 'ico'); i.innerHTML = icon(s.icon);
      c.appendChild(i); c.appendChild(el('h3', null, s.title)); c.appendChild(el('p', null, s.text));
      sl.appendChild(c);
    });
  }

  /* مدارک */
  var cl = $('#cred-list');
  if (cl) {
    if (S.credentials && S.credentials.length) {
      S.credentials.forEach(function (c) { cl.appendChild(el('li', null, c.title + (c.text ? ' — ' + c.text : ''))); });
    } else {
      cl.appendChild(el('li', 'pending', 'مدارک و مجوزها پس از تأیید وکیل در اینجا درج می‌شود.'));
    }
  }

  /* سوالات متداول */
  var fl = $('#faq-list');
  if (fl && S.faq) {
    S.faq.forEach(function (f) {
      var d = el('details', 'reveal');
      d.appendChild(el('summary', null, f.q)); d.appendChild(el('p', null, f.a));
      fl.appendChild(d);
    });
  }

  /* مقالات */
  var al = $('#articles-list');
  var av = $('#article-view');
  function showArticle(id) {
    var a = (S.articles || []).filter(function (x) { return x.id === id; })[0];
    if (!a || !av) return false;
    if (al) al.style.display = 'none';
    var t = $('#articles-title'); if (t) t.style.display = 'none';
    av.innerHTML = '';
    av.style.display = 'block';
    av.appendChild(el('span', 'note', a.category + ' · ' + fa(a.date)));
    av.appendChild(el('h2', null, a.title));
    a.body.forEach(function (p) { av.appendChild(el('p', null, p)); });
    av.appendChild(el('div', 'disclaimer', 'این مطلب صرفاً جنبهٔ آموزشی دارد و جایگزین مشاورهٔ حقوقی تخصصی نیست.'));
    var back = el('a', 'btn btn-navy', 'بازگشت به مقالات'); back.href = 'articles.html'; back.style.marginTop = '22px';
    av.appendChild(back);
    document.title = a.title + ' | ' + S.name;
    window.scrollTo(0, 0);
    return true;
  }
  if (al && S.articles) {
    var lim2 = parseInt(al.getAttribute('data-limit'), 10) || S.articles.length;
    var sorted = S.articles.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    sorted.slice(0, lim2).forEach(function (a) {
      var c = el('article', 'card art-card reveal');
      var m = el('div', 'art-meta'); m.appendChild(el('span', null, a.category)); m.appendChild(el('span', null, fa(a.date)));
      c.appendChild(m); c.appendChild(el('h3', null, a.title)); c.appendChild(el('p', null, a.excerpt));
      var l = el('a', 'link-more', 'ادامه مطلب ←'); l.href = 'articles.html#a=' + encodeURIComponent(a.id);
      c.appendChild(l); al.appendChild(c);
    });
    if (av) {
      var route = function () {
        var m = location.hash.match(/^#a=(.+)$/);
        if (m) showArticle(decodeURIComponent(m[1]));
        else if (m === null) { av.style.display = 'none'; al.style.display = ''; var t = $('#articles-title'); if (t) t.style.display = ''; }
      };
      window.addEventListener('hashchange', route); route();
    }
  }

  /* اطلاعات تماس */
  var C = S.contact || {};
  function fill(key, value, makeHref) {
    $$('[data-contact="' + key + '"]').forEach(function (n) {
      n.innerHTML = '';
      if (value) {
        if (makeHref) { var a = el('a', null, value); a.href = makeHref; if (key === 'email' || key === 'phone') a.dir = 'ltr'; n.appendChild(a); }
        else n.textContent = value;
        n.classList.remove('pending');
      } else {
        n.textContent = 'در انتظار تکمیل توسط دفتر وکالت';
        n.classList.add('pending');
      }
    });
  }
  fill('phone', C.phoneDisplay || C.phone, C.phone ? 'tel:+98' + C.phone.replace(/^0/, '') : '');
  fill('email', C.email, C.email ? 'mailto:' + C.email : '');
  fill('address', C.address);
  fill('hours', C.hours);

  $$('[data-action="call"]').forEach(function (b) {
    if (C.phone) b.href = 'tel:+98' + C.phone.replace(/^0/, '');
    else { b.classList.add('disabled'); b.setAttribute('aria-disabled', 'true'); b.title = 'شمارهٔ تماس هنوز ثبت نشده است'; b.removeAttribute('href'); }
  });
  $$('[data-action="whatsapp"]').forEach(function (b) {
    if (C.whatsapp) { b.href = 'https://wa.me/' + C.whatsapp; b.target = '_blank'; b.rel = 'noopener noreferrer'; }
    else b.style.display = 'none';
  });
  var mb = $('#map-box');
  if (mb) {
    if (C.mapEmbedUrl) {
      var f = document.createElement('iframe'); f.src = C.mapEmbedUrl; f.loading = 'lazy'; f.title = 'نقشه محل دفتر';
      f.referrerPolicy = 'no-referrer-when-downgrade'; mb.innerHTML = ''; mb.style.padding = '0'; mb.appendChild(f);
    } else mb.textContent = 'نقشه پس از ثبت نشانی دقیق دفتر نمایش داده می‌شود.';
  }

  /* فرم مشاوره */
  var form = $('#consult-form');
  if (form) {
    var alertBox = $('#form-alert');
    var showAlert = function (type, msg) { alertBox.className = 'alert show ' + type; alertBox.textContent = msg; alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    if (!S.formEndpoint) {
      var notice = $('#form-notice');
      if (notice) notice.classList.add('show');
    }
    var rules = {
      name: function (v) { return v.trim().length >= 3 ? '' : 'نام و نام خانوادگی را کامل وارد کنید.'; },
      phone: function (v) { v = toLatinDigits(v).replace(/[\s\-]/g, ''); return /^0\d{10}$/.test(v) ? '' : 'شماره تماس معتبر وارد کنید (مثال: 09121234567).'; },
      subject: function (v) { return v ? '' : 'موضوع درخواست را انتخاب کنید.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'توضیحات اولیه را حداقل در ۱۰ نویسه بنویسید.'; },
      agree: function (v, f) { return f.agree.checked ? '' : 'برای ارسال، پذیرش حریم خصوصی لازم است.'; }
    };
    function check(name) {
      var inp = form.elements[name]; if (!inp) return true;
      var msg = rules[name](inp.value || '', form);
      var wrap = inp.closest('.field'); wrap.classList.toggle('invalid', !!msg);
      var e = $('.err', wrap); if (e) e.textContent = msg;
      inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    Object.keys(rules).forEach(function (n) {
      var inp = form.elements[n]; if (!inp) return;
      inp.addEventListener('blur', function () { check(n); });
      inp.addEventListener('input', function () { if (inp.closest('.field').classList.contains('invalid')) check(n); });
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.elements.website && form.elements.website.value) return; // honeypot
      var ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) { showAlert('bad', 'لطفاً خطاهای فرم را اصلاح کنید.'); var first = $('.invalid input,.invalid select,.invalid textarea', form); if (first) first.focus(); return; }
      if (!S.formEndpoint) {
        showAlert('warn', 'اعتبارسنجی فرم موفق بود، اما این فرم هنوز به هیچ سرویس یا بک‌اندی متصل نیست و درخواست شما ارسال نشد. لطفاً از راه‌های ارتباطی صفحهٔ «تماس با ما» استفاده کنید.');
        return;
      }
      var btn = $('button[type=submit]', form); btn.disabled = true;
      var data = {
        name: form.elements.name.value.trim(),
        phone: toLatinDigits(form.elements.phone.value).replace(/[\s\-]/g, ''),
        subject: form.elements.subject.value,
        message: form.elements.message.value.trim()
      };
      fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showAlert('ok', 'درخواست شما با موفقیت ثبت شد. دفتر وکالت در اسرع وقت با شما تماس می‌گیرد.'); form.reset(); })
        .catch(function () { showAlert('bad', 'ارسال درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید یا تماس بگیرید.'); })
        .then(function () { btn.disabled = false; });
    });
  }

  /* انیمیشن ظهور */
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    items.forEach(function (i) { io.observe(i); });
  } else items.forEach(function (i) { i.classList.add('in'); });
})();
