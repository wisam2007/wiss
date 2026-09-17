/* enhancements.js — shared UI layer for all pages */
(function () {
    'use strict';

    /* ============================================================
       1) SCROLL REVEAL
       ============================================================ */
    function initReveal() {
        var targets = document.querySelectorAll('.reveal');
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
        var dot = document.querySelector('.dot-field');
        if (!dot || !window.matchMedia('(hover: hover)').matches) return;
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
        document.querySelectorAll('.reveal-stagger').forEach(function (g) {
            Array.prototype.forEach.call(g.children, function (c, i) {
                c.style.setProperty('--i', i);
            });
        });
    }

    /* ============================================================
       4) MOBILE BURGER MENU  (simple dropdown panel)
       ============================================================ */
    function initBurger() {
        var nav = document.querySelector('header nav');
        if (!nav || document.getElementById('burgerBtn')) return;

        var btn = document.createElement('button');
        btn.id = 'burgerBtn';
        btn.className = 'burger-btn';
        btn.setAttribute('aria-label', 'Menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';

        // Insert right after the logo
        var logo = document.querySelector('header .logo');
        if (logo && logo.parentNode) logo.parentNode.insertBefore(btn, logo.nextSibling);

        function toggle(open) {
            var isOpen = (open === undefined) ? !nav.classList.contains('open') : open;
            nav.classList.toggle('open', isOpen);
            btn.classList.toggle('open', isOpen);
            btn.setAttribute('aria-expanded', String(isOpen));
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggle();
        });

        // Close when clicking a link
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { toggle(false); });
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('open')) return;
            if (nav.contains(e.target) || btn.contains(e.target)) return;
            toggle(false);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') toggle(false);
        });
    }

    /* ============================================================
       5) GLOBAL TOAST
       ============================================================ */
    function ensureToastContainer() {
        var c = document.getElementById('toastContainer');
        if (c) return c;
        c = document.createElement('div');
        c.id = 'toastContainer';
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
    }
    function toast(message, type, duration) {
        var c = ensureToastContainer();
        var el = document.createElement('div');
        el.className = 'toast toast-' + (type || 'info');
        el.textContent = message;
        c.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('show'); });
        setTimeout(function () {
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        }, duration || 3200);
    }
    window.showToast = toast;

    // Override alert() with toast
    window.alert = function (msg) {
        var kind = /خطأ|error|failed|تعذّر/i.test(msg) ? 'error' : 'info';
        toast(msg, kind, 4000);
    };

    /* ============================================================
       BOOT
       ============================================================ */
    function boot() {
        initReveal();
        initParallax();
        initStagger();
        initBurger();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();