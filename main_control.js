(function () {
    const translations = {
        en: {
            nav_main: "Main",
            nav_sitemap: "Site Map",
            nav_gallery: "Gallery",
            nav_about: "About Us",
            hero_title: "Cohort 8 — Grade 2: The Learning Journey",
            hero_desc: "A documentation platform dedicated to showcasing the experiences of Cohort 8, Grade 2 students in the Amala educational program. Here we gather the leading hands-on initiatives, field photos, and inspiring moments that shaped our learning path and strengthened our community impact.",
            hero_cta: "Browse the gallery and write your message",
            detail_1: "Cohort &amp; Grade: Cohort 8 | Grade 2",
            detail_2: "Platform: An interactive digital documentation gallery",
            detail_3: "Program: Amala Educational Program (Amala GSD)",
            detail_4: "Highlights: Graduation projects, cohort photos &amp; memories",
            location_title: "Where do we learn?",
            location_desc: "A map showing the center and the rooms where we held cohort sessions and hands-on workshops.",
            location_label_1: "Location",
            location_value_1: "Amala Center / Jabal Al-Weibdeh",
            location_label_2: "Learning environment",
            location_value_2: "Group and individual field activities",
            memories_title: "Our memories",
            memory_1_title: "Cohort opening session",
            memory_1_desc: "The launch of the field work program and building a shared vision among the students.",
            memory_2_title: "A variety of projects",
            memory_2_desc: "Showcasing innovative ideas and solutions aimed at developing the local community.",
            memory_3_title: "Group photo",
            memory_3_desc: "The cohort's very first group photo.",
            teachers_title: "Our teachers",
            quote_waqar: "\"Persisting in learning and leadership is the first step toward real change.\"",
            quote_abdelhamid: "\"Thank you all — we're proud of what you achieved on this learning journey.\"",
            quote_common: '"Thank you all"',
            footer_link_1: "Amala's Official Page",
            footer_link_2: "Portfolio Gallery",
            footer_link_3: "Terms &amp; Privacy",
            footer_link_4: "Social Media",
            footer_text: "© 2026 All rights reserved for Amala Educational Program - this page was coded by <b>Wisam Appsas</b>",
            gallery_title: "Our Memory Gallery",
            gallery_desc: "Explore all the beautiful moments shared by our cohort.",
            search_placeholder: "Search memories by name or title...",
            add_memory_title: "Add New Memory",
            input_your_name: "Your Name",
            lbl_profile_pic: "Profile Picture:",
            lbl_card_theme: "Profile Card Theme Color:",
            input_memory_title: "Memory Title",
            input_memory_bio: "Short Bio / Description about you...",
            lbl_upload_media: "Upload Images/Videos (Max 3):",
            btn_publish: "Publish Memory",
            badge_author: "Author",
            beta_badge: "Beta",
            scroll_cue: "Keep scrolling",
            about_eyebrow: "Cohort 8th",
            about_headline: "Our Story, Our Journey",
            about_quote: "Every batch leaves a mark. Here's a look at where we came from, what we believe in, and the people who made this journey possible.",
            vision_intro_highlight: "Amala GSD",
            vision_intro: "Amala GSD was built on a simple idea: give young people the tools and the community to grow, together.",
            vision_1_title: "Our Mission",
            vision_1_desc: "To equip the eighth cohort with practical skills, mentorship, and a genuine sense of belonging.",
            vision_2_title: "Our Vision",
            vision_2_desc: "A generation of learners who lift each other up and carry what they've learned into their communities.",
            vision_3_title: "Our Values",
            vision_3_desc: "Collaboration, curiosity, and gratitude — the same values that shaped every session of this program.",
            journey_title: "The Journey So Far",
            journey_text: "From our first day together to the memories captured on this wall, cohort eight has grown closer with every challenge, every project, and every late-night conversation. This page is a small piece of that story — the rest lives in what we carry forward.",
            thanks_title: "A Word of Thanks to Our Teachers",
            thanks_desc: "None of this would have been possible without the people who guided us, challenged us, and believed in us from day one.",
            thanks_msg_1: "Thank you for your patience and for pushing us to be better every single session.",
            thanks_msg_2: "Thank you for the guidance and support that made this journey feel possible."
        },
        ar: {
            nav_main: "الرئيسية",
            nav_sitemap: "خريطة الموقع",
            nav_gallery: "معرض الذكريات",
            nav_about: "عن امالا",
            hero_title: "كوهورت 8 — الصف الثاني: رحلة التعلم",
            hero_desc: "منصة توثيقية ورقمية مخصصة لاستعراض تجارب طلاب الفوج الثامن الصف الثاني في برنامج أمالا التعليمي. نجمع هنا أبرز المبادرات التطبيقية، الصور الميدانية، واللحظات الملهمة التي شكلت مسيرتنا التعليمية ووطدت أثرنا المجتمعي.",
            hero_cta: "تصفح المعرض واكتب رسالتك",
            detail_1: "الدفعة والصف: كوهورت 8 | الصف 2",
            detail_2: "طبيعة المنصة: معرض رقمي تفاعلي وتوثيقي",
            detail_3: "البرنامج التابع: برنامج امالا التعليمي (Amala GSD)",
            detail_4: "أبرز المحتويات: مشاريع تخرج، صور وذكريات الكوهورت",
            location_title: "أين نتعلم؟",
            location_desc: "خريطة توضح المركز والقاعات التي اخذنا فيها جلسات الكوهورت والورش العمليّة.",
            location_label_1: "الموقع",
            location_value_1: "مركز امالا / اللويبدة",
            location_label_2: "بيئة التعلم",
            location_value_2: "الأنشطة الميدانية جماعية أو فردية",
            memories_title: "ذكرياتنا",
            memory_1_title: "الجلسة الافتتاحية للكوهورت",
            memory_1_desc: "انطلاقة برنامج العمل الميداني وبناء الرؤية المشتركة بين الطلاب.",
            memory_2_title: "مشاريع متنوعة",
            memory_2_desc: "عرض الأفكار والحلول المبتكرة الموجهة لتطوير المجتمع المحلي.",
            memory_3_title: "صورة جماعية",
            memory_3_desc: "أول صورة جماعية للكوهورت.",
            teachers_title: "معلمونا",
            quote_waqar: '"الإصرار على التعلم والقيادة هو أول خطوات صنع التغيير الحقيقي."',
            quote_abdelhamid: '"شكراً لكم جميعاً — نفخر بما حققتموه خلال هذه الرحلة التعليمية."',
            quote_common: '"شكراً لكم جميعاً"',
            footer_link_1: "الصفحة الرسمية لأمالا",
            footer_link_2: "معرض الأعمال",
            footer_link_3: "الشروط والخصوصية",
            footer_link_4: "وسائل التواصل الاجتماعي",
            footer_text: "© 2026 جميع الحقوق محفوظة لبرنامج أمل التعليمي - تم برمجة هذه الصفحة بواسطة <b>وسام عباصا</b>",
            gallery_title: "معرض ذكرياتنا",
            gallery_desc: "استكشف أروع اللحظات التي شاركها أعضاء دفعتنا.",
            search_placeholder: "ابحث عن الذكريات بالاسم أو العنوان...",
            add_memory_title: "إضافة ذاكرة جديدة",
            input_your_name: "اسمك",
            lbl_profile_pic: "الصورة الشخصية:",
            lbl_card_theme: "لون ثيم بطاقة التعريف:",
            input_memory_title: "عنوان الذاكرة",
            input_memory_bio: "نبذة قصيرة / وصف عنك...",
            lbl_upload_media: "رفع الصور/الفيديوهات (الحد الأقصى 3):",
            btn_publish: "نشر الذاكرة",
            badge_author: "الناشر",
            beta_badge: "نسخة تجريبية",
            scroll_cue: "استمر بالتمرير",
            about_eyebrow: "الدفعة الثامنة",
            about_headline: "قصتنا، رحلتنا",
            about_quote: "كل دفعة تترك بصمتها. هذه لمحة عن بدايتنا، وما نؤمن به، والأشخاص الذين جعلوا هذه الرحلة ممكنة.",
            vision_intro_highlight: "أمل",
            vision_intro: "انطلق برنامج أمل من فكرة بسيطة: منح الشباب الأدوات والمجتمع اللازمين للنمو معاً.",
            vision_1_title: "رسالتنا",
            vision_1_desc: "تزويد الدفعة الثامنة بمهارات عملية، وإرشاد، وإحساس حقيقي بالانتماء.",
            vision_2_title: "رؤيتنا",
            vision_2_desc: "جيل من المتعلمين يدعم بعضه بعضاً، وينقل ما تعلمه إلى مجتمعاته.",
            vision_3_title: "قيمنا",
            vision_3_desc: "التعاون، والفضول، والامتنان — نفس القيم التي شكّلت كل جلسة في هذا البرنامج.",
            journey_title: "رحلتنا حتى الآن",
            journey_text: "من يومنا الأول معاً إلى الذكريات الموثقة على هذا الجدار، اقتربت الدفعة الثامنة من بعضها مع كل تحدٍ ومشروع وسهرة نقاش. هذه الصفحة جزء صغير من تلك القصة — والباقي نحمله معنا.",
            thanks_title: "كلمة شكر لمعلمينا",
            thanks_desc: "ما كان لأي من هذا أن يتحقق لولا من أرشدونا وتحدونا وآمنوا بنا منذ اليوم الأول.",
            thanks_msg_1: "شكراً على صبركم ودفعكم لنا لنكون أفضل في كل جلسة.",
            thanks_msg_2: "شكراً على الإرشاد والدعم الذي جعل هذه الرحلة ممكنة."
        }
    };


    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }


    function safeGetItem(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (e) {
            return fallback;
        }
    }


    const themeDropdownBtn = document.getElementById('themeDropdownBtn');
    // Animated sun/moon toggle wrapper (replaces the old single <img id="currentThemeIcon">).
    // We never touch the inner SVGs directly — we just flip these two classes and
    // main_style.css (.celestial-toggle) does the sliding/fading/rotating.
    const celestialToggle = document.getElementById('celestialToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownContent = themeDropdown ? themeDropdown.querySelector('.dropdown-content') : null;


    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const langDropdown = document.getElementById('langDropdown');
    const langDropdownContent = langDropdown ? langDropdown.querySelector('.dropdown-content') : null;


    function applyTheme(themeChoice) {
        let effectiveTheme = themeChoice;


        if (themeChoice === 'auto') {
            const hour = new Date().getHours();
            effectiveTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        }


        if (effectiveTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }


        if (celestialToggle) {
            celestialToggle.classList.toggle('is-dark', effectiveTheme === 'dark');
            celestialToggle.classList.toggle('is-auto', themeChoice === 'auto');
        }


        if (themeDropdown) {
            themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-theme-val') === themeChoice);
            });
        }


        safeSetItem('preferred_theme', themeChoice);
    }


    function applyLanguage(lang) {
        if (!translations[lang]) lang = 'ar';


        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');


        if (currentLangLabel) {
            currentLangLabel.textContent = lang.toUpperCase();
        }


        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = translations[lang][key];
            if (!value) return;


            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', value);
            } else {
                element.innerHTML = value;
            }
        });


        if (langDropdown) {
            langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-lang-val') === lang);
            });
        }


        safeSetItem('preferred_lang', lang);
    }


    function setupDropdowns() {
        if (themeDropdownBtn && themeDropdownContent) {
            themeDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (langDropdownContent) langDropdownContent.classList.remove('show');
                themeDropdownContent.classList.toggle('show');
            });


            themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    applyTheme(item.getAttribute('data-theme-val'));
                    themeDropdownContent.classList.remove('show');
                });
            });
        }


        if (langDropdownBtn && langDropdownContent) {
            langDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (themeDropdownContent) themeDropdownContent.classList.remove('show');
                langDropdownContent.classList.toggle('show');
            });


            langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    applyLanguage(item.getAttribute('data-lang-val'));
                    langDropdownContent.classList.remove('show');
                });
            });
        }


        document.addEventListener('click', () => {
            if (themeDropdownContent) themeDropdownContent.classList.remove('show');
            if (langDropdownContent) langDropdownContent.classList.remove('show');
        });
    }


    document.addEventListener('DOMContentLoaded', () => {
        setupDropdowns();
        applyTheme(safeGetItem('preferred_theme', 'auto'));
        applyLanguage(safeGetItem('preferred_lang', 'ar'));
    });
})();
/* ==========================================
   enhancements.js
   يُضاف بعد main_control.js / app.js / gallery_control.js
   لا يُعدّل أي دالة موجودة، فقط يضيف سلوك جديد
   ========================================== */
(function () {
    'use strict';


    /* ---------- 1. Parallax خفيف للخلفية عبر الماوس ---------- */
    function initParallax() {
        var dotField = document.querySelector('.dot-field');
        var skyLayer = document.querySelector('.sky-layer');
        if (!dotField && !skyLayer) return;


        // على الموبايل نتجاهل تأثير الماوس (لا يوجد hover دقيق)
        if (window.matchMedia('(hover: none)').matches) return;


        window.addEventListener('mousemove', function (e) {
            var x = (e.clientX / window.innerWidth - 0.5);
            var y = (e.clientY / window.innerHeight - 0.5);


            if (dotField) {
                dotField.style.transform =
                    'translate(' + (x * 14) + 'px, ' + (y * 14) + 'px)';
            }
            if (skyLayer) {
                skyLayer.style.transform =
                    'translate(' + (x * -8) + 'px, ' + (y * -8) + 'px)';
            }
        }, { passive: true });
    }


    /* ---------- 2. تأخير متسلسل تلقائي لعناصر reveal-stagger ---------- */
    function initStaggerDelays() {
        document.querySelectorAll('.reveal-stagger').forEach(function (group) {
            Array.from(group.children).forEach(function (child, i) {
                child.style.setProperty('--reveal-delay', String(i * 90));
            });
        });
    }


    /* ---------- 3. Skeleton loading أثناء جلب البروفايلات ---------- */
    // يبني بطاقات هيكلية مؤقتة داخل #galleryGrid إن وُجد، إلى أن يستبدلها
    // gallery_control.js عند renderGalleryCards الفعلي.
    function showGallerySkeletons(count) {
        var grid = document.getElementById('galleryGrid');
        if (!grid) return;
        var html = '';
        for (var i = 0; i < (count || 6); i++) {
            html += '' +
                '<div class="skeleton-card" aria-hidden="true">' +
                '  <div class="skeleton-media"></div>' +
                '  <div class="skeleton-lines">' +
                '    <div class="skeleton-line w-60"></div>' +
                '    <div class="skeleton-line w-90"></div>' +
                '    <div class="skeleton-line w-40"></div>' +
                '  </div>' +
                '</div>';
        }
        grid.innerHTML = html;
    }


    // نلاحظ أول تغيير حقيقي في galleryGrid (عندما تُستبدل الهياكل بالبطاقات
    // الفعلية) لنطبّق reveal-stagger على النتيجة تلقائيًا.
    function watchGalleryGridReplacement() {
        var grid = document.getElementById('galleryGrid');
        if (!grid || !('MutationObserver' in window)) return;


        var observer = new MutationObserver(function () {
            var isSkeleton = grid.querySelector('.skeleton-card');
            if (isSkeleton) return; // ما زالت الهياكل المؤقتة


            grid.classList.add('reveal-stagger');
            initStaggerDelays();
            requestAnimationFrame(function () {
                grid.classList.add('is-visible');
            });
        });


        observer.observe(grid, { childList: true });
    }


    /* ---------- 4. Ripple effect على الأزرار ---------- */
    function attachRipple(selector) {
        document.querySelectorAll(selector).forEach(function (btn) {
            if (btn.dataset.rippleBound) return;
            btn.dataset.rippleBound = '1';


            btn.addEventListener('click', function (e) {
                var rect = btn.getBoundingClientRect();
                var span = document.createElement('span');
                var size = Math.max(rect.width, rect.height);
                var x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
                var y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;


                span.className = 'ripple';
                span.style.width = span.style.height = size + 'px';
                span.style.left = x + 'px';
                span.style.top = y + 'px';


                btn.appendChild(span);
                span.addEventListener('animationend', function () {
                    span.remove();
                });
            });
        });
    }


    function initRipples() {
        attachRipple('.cta-btn, .btn-send-comment, .disc-play-btn, .reaction-btn, .social-link');
        // لبعض الأزرار المولّدة ديناميكيًا لاحقًا (بطاقات المعرض تُبنى عبر JS)
        var grid = document.getElementById('galleryGrid');
        if (grid && 'MutationObserver' in window) {
            new MutationObserver(function () {
                attachRipple('.reaction-btn, .social-link');
            }).observe(grid, { childList: true, subtree: true });
        }
    }


    /* ---------- 5. Fade سلس عند تبديل صور الـ Lightbox ---------- */
    function initLightboxFade() {
        var img = document.getElementById('lightboxImage');
        var prevBtn = document.getElementById('lightboxPrev');
        var nextBtn = document.getElementById('lightboxNext');
        if (!img) return;


        function fadeSwitch(triggerFn) {
            img.classList.add('is-switching');
            setTimeout(function () {
                triggerFn();
                img.classList.remove('is-switching');
            }, 120);
        }


        // نعترض النقر قبل أن يصل لمستمع gallery_control.js الأصلي
        // بإضافة مستمع تمويه بسيط لا يمنع السلوك الأصلي، فقط يضيف الفويد.
        [prevBtn, nextBtn].forEach(function (btn) {
            if (!btn) return;
            btn.addEventListener('click', function () {
                img.classList.add('is-switching');
                setTimeout(function () {
                    img.classList.remove('is-switching');
                }, 200);
            });
        });
    }


    /* ---------- تشغيل كل التحسينات بعد تحميل DOM ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initParallax();
        initStaggerDelays();
        initRipples();
        initLightboxFade();
        watchGalleryGridReplacement();


        // إن وُجدت شبكة معرض فارغة عند التحميل، أظهر الهياكل المؤقتة فورًا
        var grid = document.getElementById('galleryGrid');
        if (grid && grid.children.length === 0) {
            showGallerySkeletons(6);
        }
    });


    // إتاحة الدالة عالميًا لو أراد أحد استدعاءها يدويًا قبل fetchProfiles
    window.showGallerySkeletons = showGallerySkeletons;
})();

// enhancements.js
// تحسينات بصرية إضافية — لا يعدّل main_control.js / app.js / gallery_control.js
// يعمل بشكل مستقل ويكتفي بإضافة سلوك تدريجي فوق ما هو موجود.


(function () {
    'use strict';


    /* ------------------------------------------------
       1. خلفية تفاعلية (Parallax عند تحريك الماوس)
       ------------------------------------------------ */
    var dotField = document.querySelector('.dot-field');
    if (dotField && window.matchMedia('(hover: hover)').matches) {
        var rafId = null;
        document.addEventListener('mousemove', function (e) {
            if (rafId) return;
            rafId = requestAnimationFrame(function () {
                var x = (e.clientX / window.innerWidth - 0.5) * 15;
                var y = (e.clientY / window.innerHeight - 0.5) * 15;
                dotField.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                rafId = null;
            });
        });
    }


    /* ------------------------------------------------
       2. ضبط تأخير الظهور المتسلسل لعناصر .reveal-stagger
       ------------------------------------------------ */
    document.querySelectorAll('.reveal-stagger').forEach(function (container) {
        Array.prototype.forEach.call(container.children, function (child, i) {
            child.style.setProperty('--i', i);
        });
    });


    /* ------------------------------------------------
       3. Skeleton loading لبطاقات المعرض (gallery.html)
       يعمل فقط إن وُجد #galleryGrid في الصفحة، ويُزال تلقائيًا
       بمجرد أن يملأ gallery_control.js الشبكة ببطاقات حقيقية.
       ------------------------------------------------ */
    var galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        function buildSkeletonCard() {
            var card = document.createElement('div');
            card.className = 'skeleton-card';
            card.innerHTML =
                '<div class="skeleton-media"></div>' +
                '<div class="skeleton-content">' +
                '  <div class="skeleton-line short"></div>' +
                '  <div class="skeleton-line long"></div>' +
                '  <div class="skeleton-line long"></div>' +
                '</div>';
            return card;
        }


        function showSkeletons(count) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < count; i++) fragment.appendChild(buildSkeletonCard());
            galleryGrid.innerHTML = '';
            galleryGrid.appendChild(fragment);
        }


        // اعرض الهياكل العظمية فورًا، ثم راقب الشبكة: أول تحديث حقيقي لمحتواها
        // (بطاقات .gallery-card أو رسالة خطأ/عدم نتائج) يوقف المراقبة تلقائيًا.
        showSkeletons(6);


        var stopWatching = new MutationObserver(function () {
            var hasRealContent = galleryGrid.querySelector('.gallery-card, .no-results, .error-status');
            if (hasRealContent) {
                stopWatching.disconnect();
            }
        });
        stopWatching.observe(galleryGrid, { childList: true });
    }


    /* ------------------------------------------------
       4. Ripple عند الضغط على أزرار محددة
       ------------------------------------------------ */
    var RIPPLE_SELECTOR = '.disc-play-btn, .reaction-btn, .cta-btn, .btn-send-comment';
    document.addEventListener('click', function (e) {
        var btn = e.target.closest(RIPPLE_SELECTOR);
        if (!btn) return;


        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';


        btn.appendChild(ripple);
        ripple.addEventListener('animationend', function () {
            ripple.remove();
        });
    });


    /* ------------------------------------------------
       5. Lightbox: fade بين الصور + سحب (swipe) على الموبايل
       يعتمد فقط على عناصر DOM الموجودة في gallery_control.js
       ولا يستبدل منطقه، فقط يضيف حركة fade وسحب باللمس.
       ------------------------------------------------ */
    var lightboxImg = document.getElementById('lightboxImage');
    var lightboxOverlay = document.getElementById('lightboxOverlay');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');


    if (lightboxImg) {
        // fade خفيف عند تغيّر مصدر الصورة (سواء عبر الأسهم أو لوحة المفاتيح)
        var imgObserver = new MutationObserver(function () {
            lightboxImg.classList.add('is-swapping');
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    lightboxImg.classList.remove('is-swapping');
                });
            });
        });
        imgObserver.observe(lightboxImg, { attributes: true, attributeFilter: ['src'] });
    }


    if (lightboxOverlay && lightboxPrev && lightboxNext) {
        var touchStartX = 0;
        var touchEndX = 0;
        var SWIPE_THRESHOLD = 40;


        lightboxOverlay.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });


        lightboxOverlay.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var delta = touchEndX - touchStartX;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;


            var isRtl = document.documentElement.dir === 'rtl';
            if (delta < 0) {
                (isRtl ? lightboxPrev : lightboxNext).click();
            } else {
                (isRtl ? lightboxNext : lightboxPrev).click();
            }
        }, { passive: true });
    }
})();







