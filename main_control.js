// --- القاموس الخاص بالترجمة المحلية ---
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
        badge_author: "Author"
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
        footer_text: "© 2026 جميع الحقوق محفوظة لبرنامج أمل التعليمي - تم برمجة هذه الصفحة بواسطة <b>وسام العبساس</b>",
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
        badge_author: "الناشر"
    }
};
    


// --- إدارة الوضع الداكن / الفاتح / التلقائي ---
const themeDropdownBtn = document.getElementById('themeDropdownBtn');
const currentThemeIcon = document.getElementById('currentThemeIcon');
const themeDropdown = document.getElementById('themeDropdown');

const lightIconSrc = "Photo/auto_ICON.png";
const darkIconSrc = "Photo/auto_ICON.png";

function applyTheme(themeChoice) {
    let effectiveTheme = themeChoice;

    if (themeChoice === 'auto') {
        const currentHour = new Date().getHours();
        // الوضع الفاتح من 6 صباحاً حتى 6 مساءً، والداكن في باقي الأوقات
        effectiveTheme = (currentHour >= 6 && currentHour < 18) ? 'light' : 'dark';
    }

    if (effectiveTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentThemeIcon.src = darkIconSrc;
    } else {
        document.documentElement.removeAttribute('data-theme');
        currentThemeIcon.src = lightIconSrc;
    }

    // تمييز الخيار النشط داخل القائمة
    themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        if (item.getAttribute('data-theme-val') === themeChoice) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    localStorage.setItem('preferred_theme', themeChoice);
}

// --- إدارة الترجمة ---
const langDropdownBtn = document.getElementById('langDropdownBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langDropdown = document.getElementById('langDropdown');

function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    currentLangLabel.textContent = lang.toUpperCase();

    // تحديث كل النصوص التي تحتوي على خاصية data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // تمييز الخيار النشط داخل القائمة
    langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        if (item.getAttribute('data-lang-val') === lang) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    localStorage.setItem('preferred_lang', lang);
}

// --- إدارة القوائم المنسدلة التفاعلية ---
function setupDropdowns() {
    // فتح وإغلاق القوائم عند النقر
    themeDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.querySelector('.dropdown-content').classList.remove('show');
        themeDropdown.querySelector('.dropdown-content').classList.toggle('show');
    });

    langDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.querySelector('.dropdown-content').classList.remove('show');
        langDropdown.querySelector('.dropdown-content').classList.toggle('show');
    });

    // أحداث الضغط على خيارات الثيم
    themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-theme-val');
            applyTheme(val);
            themeDropdown.querySelector('.dropdown-content').classList.remove('show');
        });
    });

    // أحداث الضغط على خيارات اللغة
    langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-lang-val');
            applyLanguage(val);
            langDropdown.querySelector('.dropdown-content').classList.remove('show');
        });
    });

    // إغلاق القوائم المفتوحة عند النقر خارجها
    document.addEventListener('click', () => {
        themeDropdown.querySelector('.dropdown-content').classList.remove('show');
        langDropdown.querySelector('.dropdown-content').classList.remove('show');
    });
}

// --- التهيأة عند تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    setupDropdowns();

    const savedTheme = localStorage.getItem('preferred_theme') || 'auto';
    const savedLang = localStorage.getItem('preferred_lang') || 'en';

    applyTheme(savedTheme);
    applyLanguage(savedLang);
});