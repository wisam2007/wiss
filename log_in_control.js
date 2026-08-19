(function () {
    const translations = {
        ar: {
            preview_label: "معاينة حية",
            preview_name_placeholder: "اسمك هنا",
            preview_role_placeholder: "الدور",
            form_title: "إنشاء البروفايل الشخصي",
            form_subtitle: "أكمل الخطوات التالية للانضمام إلى معرض الطلاب",
            draft_restored: "تم استرجاع مسودة محفوظة من زيارة سابقة ✓",
            step0_title: "الدخول أو إنشاء حساب",
            google_btn: "المتابعة عبر Google",
            or_divider: "أو",
            tab_signup: "حساب جديد",
            tab_login: "لدي حساب",
            lbl_email: "البريد الإلكتروني",
            lbl_password: "كلمة المرور",
            btn_create_account: "إنشاء الحساب",
            step1_title: "الخطوة 1 من 4: الهوية والدور",
            role_student: "طالب في الكوهورت",
            role_teacher: "معلم / ميسّر",
            lbl_fullname: "الاسم الكامل",
            lbl_bio: "نبذة عنك (Bio)",
            btn_next: "التالي ←",
            step2_title: "الخطوة 2 من 4: الربط الجغرافي والاجتماعي",
            lbl_city: "المدينة والدولة",
            btn_locate: "تحديد الدبوس على الخريطة",
            lbl_instagram: "انستقرام",
            btn_prev: "→ السابق",
            step3_title: "الخطوة 3 من 4: التخصيص البصري والسمعي",
            lbl_avatar: "صورة البروفايل الشخصية",
            lbl_banner: "تصميم البنر",
            banner_auto: "لون تلقائي من الصورة",
            banner_gradient: "تدرج متحرك",
            banner_image: "رفع صورة",
            banner_emoji: "إيموجي",
            lbl_song: "أغنية البروفايل",
            step4_title: "الخطوة 4 من 4: معرض الصور والفيديو",
            lbl_gallery: "صور الذكريات (من 1 إلى 5 صور)",
            lbl_video_type: "نوع الفيديو",
            video_hint: "الصق رابط يوتيوب أو Google Drive (الرفع المباشر غير متاح حالياً)",
            btn_save: "حفظ وإنشاء البروفايل"
        },
        en: {
            preview_label: "Live preview",
            preview_name_placeholder: "Your name here",
            preview_role_placeholder: "Role",
            form_title: "Create your profile",
            form_subtitle: "Complete the steps below to join the students' gallery",
            draft_restored: "A saved draft from a previous visit was restored ✓",
            step0_title: "Sign in or create an account",
            google_btn: "Continue with Google",
            or_divider: "or",
            tab_signup: "New account",
            tab_login: "I have an account",
            lbl_email: "Email",
            lbl_password: "Password",
            btn_create_account: "Create account",
            step1_title: "Step 1 of 4: Identity & role",
            role_student: "Cohort student",
            role_teacher: "Teacher / facilitator",
            lbl_fullname: "Full name",
            lbl_bio: "Short bio",
            btn_next: "Next →",
            step2_title: "Step 2 of 4: Location & social links",
            lbl_city: "City & country",
            btn_locate: "Place the pin on the map",
            lbl_instagram: "Instagram",
            btn_prev: "← Back",
            step3_title: "Step 3 of 4: Visual & audio customization",
            lbl_avatar: "Profile picture",
            lbl_banner: "Banner design",
            banner_auto: "Auto color from photo",
            banner_gradient: "Animated gradient",
            banner_image: "Upload image",
            banner_emoji: "Emoji",
            lbl_song: "Profile song",
            step4_title: "Step 4 of 4: Gallery & video",
            lbl_gallery: "Memory photos (1 to 5)",
            lbl_video_type: "Video type",
            video_hint: "Paste a YouTube or Google Drive link (direct upload isn't available yet)",
            btn_save: "Save and create profile"
        }
    };


    window.SIGNUP_TRANSLATIONS = translations;


    function safeSetItem(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
    function safeGetItem(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }


    const themeDropdownBtn = document.getElementById('themeDropdownBtn');
    const currentThemeIcon = document.getElementById('currentThemeIcon');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownContent = themeDropdown ? themeDropdown.querySelector('.dropdown-content') : null;


    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const langDropdown = document.getElementById('langDropdown');
    const langDropdownContent = langDropdown ? langDropdown.querySelector('.dropdown-content') : null;


    const ICONS = { light: "☀️", dark: "🌙", auto: "🌓" };


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
        if (currentThemeIcon) currentThemeIcon.textContent = ICONS[themeChoice] || ICONS.light;
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
        if (currentLangLabel) currentLangLabel.textContent = lang.toUpperCase();


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
        window.CURRENT_LANG = lang;
    }
    window.applyLanguage = applyLanguage;


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




