(function () {
    const translations = {
        en: {
            nav_main: "Main",
            nav_gallery: "Gallery",
            nav_about: "About Us",
            hero_title: "Wall of Memories",
            hero_desc: "This page documents the memories of the eighth batch of the Amala educational program, where you can take a look at the students' ambitions and write motivational messages to inspire them in their upcoming journey.",
            hero_cta: "Browse the gallery and write your message",
            memories_title: "Our memories",
            memory_1: '"Our journey together in Amala"',
            memory_2: '"Group photo"',
            teachers_title: "Our teachers",
            quote_common: '"Thank you all"',
            footer_text: "© 2026 All rights reserved for Amala Educational Program - this page was coded by <b>Wisam Appsas</b>",
            gallery_title: "Our Memory Gallery",
            gallery_desc: "Explore all the beautiful moments shared by our cohort.",
            search_placeholder: "🔍 Search memories by name or title...",
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
            nav_gallery: "المعرض",
            nav_about: "من نحن",
            hero_title: "جدار الذكريات",
            hero_desc: "توثق هذه الصفحة ذكريات الدفعة الثامنة من برنامج أمل التعليمي، حيث يمكنك إلقاء نظرة على طموحات الطلاب وكتابة رسائل تحفيزية لإلهامهم في رحلتهم القادمة.",
            hero_cta: "تصفح المعرض واكتب رسالتك",
            memories_title: "ذكرياتنا",
            memory_1: '"رحلتنا معاً في برنامج أمل"',
            memory_2: '"صورة جماعية"',
            teachers_title: "معلمونا",
            quote_common: '"شكراً لكم جميعاً"',
            footer_text: "© 2026 جميع الحقوق محفوظة لبرنامج أمل التعليمي - تم برمجة هذه الصفحة بواسطة <b>وسام عباصا</b>",
            gallery_title: "معرض ذكرياتنا",
            gallery_desc: "استكشف أروع اللحظات التي شاركها أعضاء دفعتنا.",
            search_placeholder: "🔍 ابحث عن الذكريات بالاسم أو العنوان...",
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
    const currentThemeIcon = document.getElementById('currentThemeIcon');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownContent = themeDropdown ? themeDropdown.querySelector('.dropdown-content') : null;

    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const langDropdown = document.getElementById('langDropdown');
    const langDropdownContent = langDropdown ? langDropdown.querySelector('.dropdown-content') : null;

    const ICONS = {
        light: "Photo/sun_ICON.png",
        dark: "Photo/moon_ICON.png",
        auto: "Photo/auto_ICON.png"
    };

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

        if (currentThemeIcon) {
            currentThemeIcon.src = ICONS[themeChoice] || ICONS.light;
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