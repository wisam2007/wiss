/* enhancements.js — shared UI layer for all pages */
(function () {
    'use strict';


    /* ============================================================
       0) HELPERS
       ============================================================ */
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }


    /* ============================================================
       1) SCROLL REVEAL
       ============================================================ */
    function initReveal() {
        var targets = $$('.reveal');
        if (!targets.length) return;
        if (!('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        targets.forEach(function (el) { obs.observe(el); });
    }


    /* ============================================================
       2) PARALLAX (dot-field follows mouse)
       ============================================================ */
    function initParallax() {
        var dot = $('.dot-field');
        if (!dot || !window.matchMedia('(hover: hover)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var raf = null;
        document.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                var x = (e.clientX / window.innerWidth - 0.5) * 14;
                var y = (e.clientY / window.innerHeight - 0.5) * 14;
                dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                raf = null;
            });
        }, { passive: true });
    }


    /* ============================================================
       3) STAGGER DELAYS
       ============================================================ */
    function initStagger() {
        $$('.reveal-stagger').forEach(function (g) {
            Array.prototype.forEach.call(g.children, function (c, i) {
                c.style.setProperty('--i', i);
            });
        });
    }


    /* ============================================================
       4) MUTUAL EXCLUSION — close open panels
       ============================================================ */
    function closeAllPanels(except) {
        // Burger nav panel
        if (except !== 'burger') {
            var nav = $('header nav');
            var burgerBtn = document.getElementById('burgerBtn');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                if (burgerBtn) {
                    burgerBtn.classList.remove('open');
                    burgerBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }
        // Mobile settings dropdown
        if (except !== 'settings') {
            var settingsContent = document.getElementById('mobileSettingsContent');
            var settingsBtn = document.getElementById('mobileSettingsBtn');
            if (settingsContent && settingsContent.classList.contains('show')) {
                settingsContent.classList.remove('show');
                if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }


    /* ============================================================
       5) MOBILE BURGER MENU
       ============================================================ */
    function initBurger() {
        var nav = $('header nav');
        if (!nav || document.getElementById('burgerBtn')) return;


        var btn = document.createElement('button');
        btn.id = 'burgerBtn';
        btn.className = 'burger-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'mainNav');
        btn.innerHTML = '<span></span><span></span><span></span>';


        nav.id = nav.id || 'mainNav';


        var logo = $('header .logo');
        if (logo && logo.parentNode) logo.parentNode.insertBefore(btn, logo.nextSibling);


        function toggle(open) {
            var isOpen = (open === undefined) ? !nav.classList.contains('open') : open;
            if (isOpen) closeAllPanels('burger');
            nav.classList.toggle('open', isOpen);
            btn.classList.toggle('open', isOpen);
            btn.setAttribute('aria-expanded', String(isOpen));
        }


        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggle();
        });


        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { toggle(false); });
        });


        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('open')) return;
            if (nav.contains(e.target) || btn.contains(e.target)) return;
            toggle(false);
        });


        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') toggle(false);
        });
    }


    /* ============================================================
       6) MOBILE SETTINGS DROPDOWN (theme + language combined)
       ============================================================ */
    function initMobileSettings() {
        var btn = document.getElementById('mobileSettingsBtn');
        var content = document.getElementById('mobileSettingsContent');
        if (!btn || !content) return;


        function close() {
            content.classList.remove('show');
            btn.setAttribute('aria-expanded', 'false');
        }
        function toggle() {
            var willOpen = !content.classList.contains('show');
            if (willOpen) closeAllPanels('settings');
            content.classList.toggle('show', willOpen);
            btn.setAttribute('aria-expanded', String(willOpen));
        }


        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggle();
        });


        function markActive(selector, value) {
            content.querySelectorAll(selector).forEach(function (item) {
                item.classList.toggle('active',
                    item.getAttribute('data-mobile-theme-val') === value ||
                    item.getAttribute('data-mobile-lang-val') === value
                );
            });
        }


        content.querySelectorAll('[data-mobile-theme-val]').forEach(function (item) {
            item.addEventListener('click', function () {
                var val = item.getAttribute('data-mobile-theme-val');
                if (window.applyTheme) window.applyTheme(val);
                markActive('[data-mobile-theme-val]', val);
                close();
            });
        });


        content.querySelectorAll('[data-mobile-lang-val]').forEach(function (item) {
            item.addEventListener('click', function () {
                var val = item.getAttribute('data-mobile-lang-val');
                if (window.applyLanguage) window.applyLanguage(val);
                markActive('[data-mobile-lang-val]', val);
                close();
            });
        });


        var storedTheme = (function () { try { return localStorage.getItem('preferred_theme') || 'auto'; } catch (e) { return 'auto'; } })();
        var storedLang  = (function () { try { return localStorage.getItem('preferred_lang') || 'ar'; } catch (e) { return 'ar'; } })();
        markActive('[data-mobile-theme-val]', storedTheme);
        markActive('[data-mobile-lang-val]', storedLang);


        document.addEventListener('click', function (e) {
            if (!content.classList.contains('show')) return;
            if (content.contains(e.target) || btn.contains(e.target)) return;
            close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
    }


    /* ============================================================
       7) GLOBAL TOAST
       ============================================================ */
    function ensureToastContainer() {
        var c = document.getElementById('toastContainer');
        if (c) return c;
        c = document.createElement('div');
        c.id = 'toastContainer';
        c.className = 'toast-container';
        c.setAttribute('role', 'status');
        c.setAttribute('aria-live', 'polite');
        document.body.appendChild(c);
        return c;
    }


    function toast(message, type, duration) {
        var c = ensureToastContainer();
        var el = document.createElement('div');
        el.className = 'toast toast-' + (type || 'info');
        el.textContent = message;
        el.addEventListener('click', function () {
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        });
        c.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('show'); });
        setTimeout(function () {
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        }, duration || 3200);
    }


    window.showToast = toast;


    /* ── alert() override for backward compatibility ──────────────
       Existing code calls alert() in several places; we redirect to
       toast UI with a smarter type detector. For explicit control,
       call window.showToast(msg, 'error') / 'success' / 'info'. */
    var _originalAlert = window.alert.bind(window);
    window.alert = function (msg) {
        if (msg === undefined || msg === null) return;
        msg = String(msg);
        var kind = 'info';
        if (/خطأ|فشل|تعذّر|error|failed|fail|invalid|cannot|unauthorized|forbidden/i.test(msg)) {
            kind = 'error';
        } else if (/✓|✔|success|تم بنجاح|تم الحفظ|تم إنشاء|تم تحديث|تم إضافة/i.test(msg)) {
            kind = 'success';
        }
        toast(msg, kind, 4000);
    };
    window.__originalAlert = _originalAlert;  // escape hatch


    /* ============================================================
       BOOT
       ============================================================ */
    function boot() {
        initReveal();
        initParallax();
        initStagger();
        initBurger();
        initMobileSettings();
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();