(function () {
    // 1. نظام الترجمة (Translations)
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
            lbl_linkedin: "لينكد إن",
            btn_prev: "→ السابق",
            step3_title: "الخطوة 3 من 4: التخصيص البصري والسمعي",
            lbl_avatar: "صورة البروفايل الشخصية",
            lbl_banner: "تصميم البنر",
            banner_default: "أزرق افتراضي",
            banner_custom: "لون مخصص",
            banner_image: "رفع صورة",
            lbl_song: "أغنية البروفايل",
            step4_title: "الخطوة 4 من 4: معرض الصور والفيديو",
            lbl_gallery: "صور الذكريات (من 1 إلى 15 صورة)",
            lbl_video_type: "نوع الفيديو",
            lbl_video_links: "روابط الفيديو (حتى 3 روابط)",
            video_first: "الفيديو الأول",
            video_second: "الفيديو الثاني",
            video_third: "الفيديو الثالث",
            video_hint: "الصق روابط يوتيوب أو Google Drive (الرفع المباشر غير متاح حالياً) — جميعها اختيارية",
            btn_save: "حفظ وإنشاء البروفايل",
            required_field_msg: "هذا الحقل إلزامي",
            gallery_min_msg: "الرجاء إضافة صورة واحدة على الأقل (بحد أقصى 15)",
            gallery_max_msg: "الحد الأقصى 15 صورة، تم الاحتفاظ بأول 15 صورة فقط",
            checking_link_msg: "جارٍ التحقق من الرابط...",
            link_valid_msg: "الرابط يبدو صحيحًا",
            link_invalid_msg: "الرابط غير صحيح أو الصيغة غير مدعومة",
            link_unverified_msg: "الصيغة صحيحة، لكن لا يمكن التأكد من وجود الحساب فعليًا من المتصفح",
            video_valid_msg: "تم التحقق: الفيديو موجود فعليًا",
            video_invalid_msg: "لم يتم العثور على فيديو بهذا الرابط"
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
            lbl_linkedin: "LinkedIn",
            btn_prev: "← Back",
            step3_title: "Step 3 of 4: Visual & audio customization",
            lbl_avatar: "Profile picture",
            lbl_banner: "Banner design",
            banner_default: "Default blue",
            banner_custom: "Custom color",
            banner_image: "Upload image",
            lbl_song: "Profile song",
            step4_title: "Step 4 of 4: Gallery & video",
            lbl_gallery: "Memory photos (1 to 15)",
            lbl_video_type: "Video type",
            lbl_video_links: "Video links (up to 3)",
            video_first: "Video 1",
            video_second: "Video 2",
            video_third: "Video 3",
            video_hint: "Paste YouTube or Google Drive links (direct upload isn't available yet) — all optional",
            btn_save: "Save and create profile",
            required_field_msg: "This field is required",
            gallery_min_msg: "Please add at least one photo (max 15)",
            gallery_max_msg: "Max 15 photos — only the first 15 were kept",
            checking_link_msg: "Checking link...",
            link_valid_msg: "Link looks valid",
            link_invalid_msg: "Invalid link or unsupported format",
            link_unverified_msg: "Format looks valid, but the account's existence can't be confirmed from the browser",
            video_valid_msg: "Verified: the video exists",
            video_invalid_msg: "No video found at this link"
        }
    };


    window.SIGNUP_TRANSLATIONS = translations;


    function safeSetItem(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
    function safeGetItem(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }


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


        // Sun/moon toggle (same animated SVG as main.html): we only flip
        // these two classes, main_style.css handles the actual animation.
        const celestialToggle = document.getElementById('celestialToggle');
        if (celestialToggle) {
            celestialToggle.classList.toggle('is-dark', effectiveTheme === 'dark');
            celestialToggle.classList.toggle('is-auto', themeChoice === 'auto');
        }


        const themeDropdown = document.getElementById('themeDropdown');
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


        const currentLangLabel = document.getElementById('currentLangLabel');
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


        const langDropdown = document.getElementById('langDropdown');
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
        const themeDropdownBtn = document.getElementById('themeDropdownBtn');
        const themeDropdownContent = document.querySelector('#themeDropdown .dropdown-content');
        const langDropdownBtn = document.getElementById('langDropdownBtn');
        const langDropdownContent = document.querySelector('#langDropdown .dropdown-content');


        if (themeDropdownBtn && themeDropdownContent) {
            themeDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (langDropdownContent) langDropdownContent.classList.remove('show');
                themeDropdownContent.classList.toggle('show');
            });
            document.querySelectorAll('#themeDropdown .dropdown-item').forEach(item => {
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
            document.querySelectorAll('#langDropdown .dropdown-item').forEach(item => {
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


// --- دالة مساعدة عامة لجلب روابط الصور من Supabase Storage ---
function resolveStorageUrl(path, bucketName = 'avatars') {
    if (!path || path.trim() === '' || path === 'null') return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;


    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : window.supabase;
    if (!supabase) return null;
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data?.publicUrl || null;
}


// --- 2. إدارة التفاعل والربط مع Supabase والموسيقى (نسخة موحّدة - بدون تكرار) ---
document.addEventListener('DOMContentLoaded', async () => {
    const getSupabase = () => window.getSupabaseClient ? window.getSupabaseClient() : window.supabase;


    let map, marker;
    let currentAudio = null;
    let selectedSong = null; // { previewUrl, title, artist } بدل نص فقط
    let searchDebounceTimer = null;
    window.USER_LOCATION = { lat: 31.9539, lng: 35.9106 };


    // --- أ. التنقل بين الخطوات ---
    window.goToStep = function(stepIndex) {
        const steps = document.querySelectorAll('.form-step');
        const progressBar = document.getElementById('progressBar');


        steps.forEach((step) => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active-step', stepNum === stepIndex);
        });


        if (progressBar) {
            const totalSteps = steps.length - 1;
            const progressPercent = (stepIndex / totalSteps) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }


        if (stepIndex === 2) {
            setTimeout(initMap, 200);
        }
    };


    // --- ب. تشغيل الخريطة ---
    function initMap() {
        const mapElement = document.getElementById('mapPicker');
        if (!mapElement || typeof L === 'undefined') return;


        if (!map) {
            map = L.map('mapPicker').setView([window.USER_LOCATION.lat, window.USER_LOCATION.lng], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);


            marker = L.marker([window.USER_LOCATION.lat, window.USER_LOCATION.lng], { draggable: true }).addTo(map);


            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                window.USER_LOCATION = { lat: pos.lat, lng: pos.lng };
            });


            map.on('click', (e) => {
                marker.setLatLng(e.latlng);
                window.USER_LOCATION = { lat: e.latlng.lat, lng: e.latlng.lng };
            });
        } else {
            map.invalidateSize();
        }
    }


    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    window.USER_LOCATION = { lat, lng };
                    if (map && marker) {
                        map.setView([lat, lng], 14);
                        marker.setLatLng([lat, lng]);
                    }
                });
            }
        });
    }


    // --- ج. المعاينة الحية (الاسم / النبذة / الدور / الصورة الشخصية / الديسك الدوّار) ---
    const fullNameInput = document.getElementById('fullName');
    const bioInput = document.getElementById('bio');
    const previewName = document.getElementById('previewName');
    const previewBio = document.getElementById('previewBio');
    const previewRole = document.getElementById('previewRole');
    const avatarInput = document.getElementById('avatarInput');
    const previewAvatarImg = document.getElementById('previewAvatarImg');
    // عنصر الديسك الدوّار حول الأفاتار - كان معرّفاً في HTML/CSS لكن بلا أي منطق JS يفعّله
    const previewDisc = document.getElementById('previewDisc');
    const discPlayBtn = document.getElementById('discPlayBtn');


    if (fullNameInput && previewName) {
        fullNameInput.addEventListener('input', (e) => {
            previewName.textContent = e.target.value.trim() || 'اسمك هنا';
        });
    }


    if (bioInput && previewBio) {
        bioInput.addEventListener('input', (e) => {
            previewBio.textContent = e.target.value.trim();
        });
    }


    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (previewRole) {
                const text = card.querySelector('span')?.textContent;
                previewRole.textContent = text || 'الدور';
            }
        });
    });


    if (avatarInput && previewAvatarImg) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewAvatarImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }


    // زر تشغيل الديسك نفسه: يعيد استخدام نفس منطق زر تشغيل الأغنية المختارة
    if (discPlayBtn) {
        discPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (previewPlayBtn) previewPlayBtn.click();
        });
    }


    // --- د. البنر: خيارات (افتراضي / تدرج بلونين مع اتجاه قابل للتحكم / صورة) + معاينة حية ---
    const bannerOpts = document.querySelectorAll('.banner-opt');
    const customColorControls = document.getElementById('customColorControls');
    const bannerImageControls = document.getElementById('bannerImageControls');
    const bannerColor1 = document.getElementById('bannerColor1');
    const bannerColor2 = document.getElementById('bannerColor2');
    const bannerDirection = document.getElementById('bannerDirection');
    const bannerDirectionLabel = document.getElementById('bannerDirectionLabel');
    const bannerImgInput = document.getElementById('bannerImgInput');
    const previewBanner = document.getElementById('previewBanner');


    let currentBannerType = 'default';
    let bannerUploadedFile = null;


    function buildGradientCss() {
        const c1 = bannerColor1 ? bannerColor1.value : '#1d4ed8';
        const c2 = bannerColor2 ? bannerColor2.value : '#a855f7';
        const deg = bannerDirection ? bannerDirection.value : 135;
        return `linear-gradient(${deg}deg, ${c1} 0%, ${c2} 100%)`;
    }


    function updateBannerPreview() {
        if (!previewBanner) return;


        if (currentBannerType === 'default') {
            previewBanner.style.background = '#1d4ed8';
            previewBanner.style.backgroundImage = 'none';
        } else if (currentBannerType === 'custom') {
            previewBanner.style.background = buildGradientCss();
        } else if (currentBannerType === 'image') {
            if (bannerUploadedFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewBanner.style.background = `url('${e.target.result}') center/cover no-repeat`;
                };
                reader.readAsDataURL(bannerUploadedFile);
            }
        }
    }


    bannerOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            bannerOpts.forEach(b => b.classList.remove('active'));
            opt.classList.add('active');


            currentBannerType = opt.getAttribute('data-banner-type');


            if (customColorControls) customColorControls.style.display = (currentBannerType === 'custom') ? 'block' : 'none';
            if (bannerImageControls) bannerImageControls.style.display = (currentBannerType === 'image') ? 'block' : 'none';


            updateBannerPreview();
        });
    });


    if (bannerColor1) bannerColor1.addEventListener('input', updateBannerPreview);
    if (bannerColor2) bannerColor2.addEventListener('input', updateBannerPreview);
    if (bannerDirection) {
        bannerDirection.addEventListener('input', () => {
            if (bannerDirectionLabel) bannerDirectionLabel.textContent = `${bannerDirection.value}°`;
            updateBannerPreview();
        });
    }


    if (bannerImgInput) {
        bannerImgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                bannerUploadedFile = file;
                updateBannerPreview();
            }
        });
    }


    // --- مزامنة المعاينة الحية مع القيم الافتراضية عند التحميل ---
    // قبل هذا الإصلاح: بطاقة "طالب" كانت محددة افتراضياً لكن previewRole
    // يبقى على النص الوهمي "الدور"، وpreviewBanner كان يعرض تدرج CSS
    // ثابت بينما منطق الحفظ الفعلي لخيار "افتراضي" هو لون واحد فقط
    updateBannerPreview();
    const selectedRoleSpanInit = document.querySelector('.role-card.selected span');
    if (previewRole && selectedRoleSpanInit) previewRole.textContent = selectedRoleSpanInit.textContent;


    // --- هـ. التسجيل والدخول ---
    try {
        const supabase = getSupabase();
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) goToStep(1);
        }
    } catch (err) {
        console.warn("الجلسة غير نشطة:", err.message);
    }


    // --- تسجيل الدخول عبر Google (كان الزر بلا أي معالج حدث إطلاقاً) ---
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            googleLoginBtn.disabled = true;
            try {
                const supabase = getSupabase();
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        // بعد نجاح تسجيل الدخول عبر Google يعيد Supabase التوجيه إلى نفس صفحة اللوغ إن
                        redirectTo: window.location.origin + window.location.pathname
                    }
                });
                if (error) throw error;
                // لا حاجة لأي كود إضافي هنا: المتصفح سينتقل إلى صفحة Google ثم يعود تلقائياً
            } catch (err) {
                const authMsg = document.getElementById('authMsg');
                if (authMsg) {
                    authMsg.textContent = "تعذّر تسجيل الدخول عبر Google: " + err.message;
                    authMsg.className = "auth-msg error";
                }
                googleLoginBtn.disabled = false;
            }
        });
    }


    const authSubmitBtn = document.getElementById('authSubmitBtn');
    let isSignupMode = true;


    const tabSignupBtn = document.getElementById('tabSignupBtn');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    if (tabSignupBtn && tabLoginBtn) {
        tabSignupBtn.addEventListener('click', () => {
            isSignupMode = true;
            tabSignupBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
        });
        tabLoginBtn.addEventListener('click', () => {
            isSignupMode = false;
            tabLoginBtn.classList.add('active');
            tabSignupBtn.classList.remove('active');
        });
    }


    if (authSubmitBtn) {
        authSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value.trim();
            const authMsg = document.getElementById('authMsg');


            if (!email || !password) {
                if (authMsg) {
                    authMsg.textContent = "يرجى إدخال البريد الإلكتروني وكلمة المرور";
                    authMsg.className = "auth-msg error";
                }
                return;
            }


            authSubmitBtn.disabled = true;
            try {
                const supabase = getSupabase();
                let response = isSignupMode
                    ? await supabase.auth.signUp({ email, password })
                    : await supabase.auth.signInWithPassword({ email, password });


                if (response.error) throw response.error;


                if (isSignupMode && !response.data.session) {
                    if (authMsg) {
                        authMsg.textContent = "تم إرسال رابط التأكيد إلى بريدك الإلكتروني.";
                        authMsg.className = "auth-msg success";
                    }
                } else {
                    goToStep(1);
                }
            } catch (err) {
                if (authMsg) {
                    authMsg.textContent = err.message;
                    authMsg.className = "auth-msg error";
                }
            } finally {
                authSubmitBtn.disabled = false;
            }
        });
    }


    // =========================================================
    // نظام التحقق: الحقول الإلزامية + التحقق من صحة/واقعية الروابط
    // =========================================================
    const T = () => (window.SIGNUP_TRANSLATIONS[window.CURRENT_LANG || 'ar'] || window.SIGNUP_TRANSLATIONS.ar);


    function setFieldStatus(statusEl, inputEl, state, message) {
        if (statusEl) {
            statusEl.textContent = message || '';
            statusEl.className = 'field-status' + (state ? ' ' + state : '');
        }
        if (inputEl) {
            inputEl.classList.remove('field-valid', 'field-invalid');
            if (state === 'valid') inputEl.classList.add('field-valid');
            if (state === 'invalid') inputEl.classList.add('field-invalid');
        }
    }


    // --- استخراج معرّف/اسم مستخدم من روابط انستقرام ولينكد إن (تحقق صيغة فقط) ---
    // ملاحظة مهمة: منصتا انستقرام ولينكد إن لا تتيحان أي واجهة عامة يمكن
    // استدعاؤها من المتصفح مباشرة (CORS) للتأكد من وجود الحساب فعلياً دون
    // مصادقة/توكن خاص بالتطبيق. لذلك نتحقق هنا من صحة الصيغة (اسم مستخدم
    // أو رابط صحيح الشكل)، وننبّه المستخدم أن وجود الحساب الفعلي غير مؤكَّد
    // 100% من طرف المتصفح وحده.
    function parseInstagramInput(value) {
        if (!value) return null;
        let v = value.trim();
        v = v.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').split('?')[0].replace(/\/+$/, '');
        return v;
    }
    function validateInstagramFormat(value) {
        const username = parseInstagramInput(value);
        if (!username) return { ok: false, username: '' };
        const ok = /^[a-zA-Z0-9._]{1,30}$/.test(username) && !username.startsWith('.') && !username.endsWith('.');
        return { ok, username };
    }


    function parseLinkedInInput(value) {
        if (!value) return null;
        let v = value.trim();
        v = v.replace(/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\//i, '').split('?')[0].replace(/\/+$/, '');
        return v;
    }
    function validateLinkedInFormat(value) {
        const username = parseLinkedInInput(value);
        if (!username) return { ok: false, username: '' };
        const ok = /^[a-zA-Z0-9\-]{3,100}$/.test(username);
        return { ok, username };
    }


    function extractYouTubeId(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        ];
        for (const p of patterns) {
            const m = url.match(p);
            if (m) return m[1];
        }
        return null;
    }


    function extractDriveId(url) {
        if (!url) return null;
        const patterns = [
            /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
            /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
            /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
            /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/
        ];
        for (const p of patterns) {
            const m = url.match(p);
            if (m) return m[1];
        }
        return null;
    }


    // تحقق حقيقي من وجود فيديو يوتيوب عبر واجهة oEmbed الرسمية (تدعم CORS
    // وترجع خطأ 404 فعلياً إن كان الفيديو غير موجود أو خاص أو محذوف)
    async function checkYouTubeReal(url) {
        const id = extractYouTubeId(url);
        if (!id) return { ok: false, reason: 'format' };
        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`);
            return { ok: res.ok, reason: res.ok ? 'verified' : 'not_found' };
        } catch (err) {
            return { ok: null, reason: 'network' }; // تعذّر التحقق (لا يعني بالضرورة أنه خاطئ)
        }
    }


    // تحقق أفضل-جهد من رابط Google Drive: لا توجد واجهة CORS عامة للتأكد من
    // مشاركة الملف فعلياً، لذا نتحقق من صحة الصيغة أولاً، ثم نحاول تحميل
    // صورة مصغّرة عامة كمؤشر إضافي (لا يعمل دائماً مع كل أنواع الملفات).
    function checkDriveReal(url) {
        const id = extractDriveId(url);
        if (!id) return Promise.resolve({ ok: false, reason: 'format' });
        return new Promise((resolve) => {
            const img = new Image();
            let settled = false;
            const timer = setTimeout(() => {
                if (!settled) { settled = true; resolve({ ok: null, reason: 'timeout' }); }
            }, 4000);
            img.onload = () => {
                if (!settled) { settled = true; clearTimeout(timer); resolve({ ok: true, reason: 'verified' }); }
            };
            img.onerror = () => {
                if (!settled) { settled = true; clearTimeout(timer); resolve({ ok: null, reason: 'unverifiable' }); }
            };
            img.src = `https://drive.google.com/thumbnail?id=${id}`;
        });
    }


    // --- ربط التحقق بحقل انستقرام (إلزامي) ---
    const instagramInput = document.getElementById('instagram');
    const instagramStatus = document.getElementById('instagramStatus');
    if (instagramInput) {
        instagramInput.addEventListener('blur', () => {
            const val = instagramInput.value.trim();
            if (!val) {
                setFieldStatus(instagramStatus, instagramInput, 'invalid', T().required_field_msg);
                return;
            }
            const { ok } = validateInstagramFormat(val);
            if (!ok) {
                setFieldStatus(instagramStatus, instagramInput, 'invalid', T().link_invalid_msg);
            } else {
                setFieldStatus(instagramStatus, instagramInput, 'unverified', T().link_unverified_msg);
            }
        });
    }


    // --- ربط التحقق بحقل لينكد إن (اختياري لكن يُتحقق من صيغته إن وُجد) ---
    const linkedinInput = document.getElementById('linkedin');
    const linkedinStatus = document.getElementById('linkedinStatus');
    if (linkedinInput) {
        linkedinInput.addEventListener('blur', () => {
            const val = linkedinInput.value.trim();
            if (!val) { setFieldStatus(linkedinStatus, linkedinInput, '', ''); return; }
            const { ok } = validateLinkedInFormat(val);
            if (!ok) {
                setFieldStatus(linkedinStatus, linkedinInput, 'invalid', T().link_invalid_msg);
            } else {
                setFieldStatus(linkedinStatus, linkedinInput, 'unverified', T().link_unverified_msg);
            }
        });
    }


    // --- ربط التحقق الحقيقي (يوتيوب) / أفضل-جهد (درايف) بثلاث كتل الفيديو ---
    document.querySelectorAll('.video-link-block').forEach(block => {
        const urlInput = block.querySelector('.video-url-input');
        const statusEl = block.querySelector('[data-video-status]');
        let debounceTimer = null;


        function getActiveType() {
            const activeTab = block.querySelector('.video-tab.active');
            return activeTab ? activeTab.getAttribute('data-vtype') : 'youtube';
        }


        block.querySelectorAll('.video-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                block.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (urlInput && urlInput.value.trim()) runVideoCheck();
            });
        });


        async function runVideoCheck() {
            const val = urlInput.value.trim();
            if (!val) { setFieldStatus(statusEl, urlInput, '', ''); return; }
            setFieldStatus(statusEl, urlInput, 'checking', T().checking_link_msg);
            const type = getActiveType();
            if (type === 'youtube') {
                const result = await checkYouTubeReal(val);
                if (result.ok === true) setFieldStatus(statusEl, urlInput, 'valid', T().video_valid_msg);
                else if (result.ok === false) setFieldStatus(statusEl, urlInput, 'invalid', T().video_invalid_msg);
                else setFieldStatus(statusEl, urlInput, 'unverified', T().link_unverified_msg);
            } else {
                const id = extractDriveId(val);
                if (!id) { setFieldStatus(statusEl, urlInput, 'invalid', T().link_invalid_msg); return; }
                const result = await checkDriveReal(val);
                if (result.ok === true) setFieldStatus(statusEl, urlInput, 'valid', T().video_valid_msg);
                else setFieldStatus(statusEl, urlInput, 'unverified', T().link_unverified_msg);
            }
        }


        if (urlInput) {
            urlInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(runVideoCheck, 600);
            });
        }
    });


    // --- تحقق من حقل البايو (إلزامي) ---
    if (bioInput) {
        const bioStatus = document.getElementById('bioStatus');
        bioInput.addEventListener('blur', () => {
            if (!bioInput.value.trim()) {
                setFieldStatus(bioStatus, bioInput, 'invalid', T().required_field_msg);
            } else {
                setFieldStatus(bioStatus, bioInput, 'valid', '');
            }
        });
    }


    // --- تحقق من الصورة الشخصية (إلزامية) ---
    if (avatarInput) {
        const avatarStatus = document.getElementById('avatarStatus');
        avatarInput.addEventListener('change', () => {
            if (avatarInput.files && avatarInput.files[0]) {
                setFieldStatus(avatarStatus, avatarInput, 'valid', '');
            } else {
                setFieldStatus(avatarStatus, avatarInput, 'invalid', T().required_field_msg);
            }
        });
    }


    // --- معرض الصور: حد أقصى 15 صورة وحد أدنى صورة واحدة ---
    const galleryInputEl = document.getElementById('galleryInput');
    const galleryCountHint = document.getElementById('galleryCountHint');
    const galleryStatus = document.getElementById('galleryStatus');
    const MAX_GALLERY_PHOTOS = 15;


    function updateGalleryHint() {
        if (!galleryInputEl || !galleryCountHint) return;
        const count = galleryInputEl.files ? galleryInputEl.files.length : 0;
        galleryCountHint.textContent = `${count} / ${MAX_GALLERY_PHOTOS}`;
        galleryCountHint.classList.toggle('limit-reached', count >= MAX_GALLERY_PHOTOS);
    }


    if (galleryInputEl) {
        galleryInputEl.addEventListener('change', () => {
            if (galleryInputEl.files && galleryInputEl.files.length > MAX_GALLERY_PHOTOS) {
                try {
                    const dt = new DataTransfer();
                    Array.from(galleryInputEl.files).slice(0, MAX_GALLERY_PHOTOS).forEach(f => dt.items.add(f));
                    galleryInputEl.files = dt.files;
                } catch (err) {
                    // بعض المتصفحات القديمة لا تدعم DataTransfer لهذا الغرض
                }
                alert(T().gallery_max_msg);
            }
            updateGalleryHint();
            if (galleryInputEl.files && galleryInputEl.files.length > 0) {
                setFieldStatus(galleryStatus, galleryInputEl, 'valid', '');
            } else {
                setFieldStatus(galleryStatus, galleryInputEl, 'invalid', T().gallery_min_msg);
            }
        });
    }


    // --- التحقق من صلاحية خطوة كاملة قبل الانتقال للتالي ---
    function validateStep(stepNum) {
        let valid = true;


        if (stepNum === 1) {
            if (!bioInput || !bioInput.value.trim()) {
                setFieldStatus(document.getElementById('bioStatus'), bioInput, 'invalid', T().required_field_msg);
                valid = false;
            }
            if (fullNameInput && !fullNameInput.value.trim()) {
                fullNameInput.classList.add('field-invalid');
                valid = false;
            } else if (fullNameInput) {
                fullNameInput.classList.remove('field-invalid');
            }
        }


        if (stepNum === 2) {
            const val = instagramInput ? instagramInput.value.trim() : '';
            if (!val || !validateInstagramFormat(val).ok) {
                setFieldStatus(instagramStatus, instagramInput, 'invalid', !val ? T().required_field_msg : T().link_invalid_msg);
                valid = false;
            }
            const linkedinVal = linkedinInput ? linkedinInput.value.trim() : '';
            if (linkedinVal && !validateLinkedInFormat(linkedinVal).ok) {
                setFieldStatus(linkedinStatus, linkedinInput, 'invalid', T().link_invalid_msg);
                valid = false;
            }
        }


        if (stepNum === 3) {
            if (!avatarInput || !avatarInput.files || !avatarInput.files[0]) {
                setFieldStatus(document.getElementById('avatarStatus'), avatarInput, 'invalid', T().required_field_msg);
                valid = false;
            }
        }


        if (!valid) {
            alert(T().required_field_msg);
        }
        return valid;
    }


    // --- و. أزرار التنقل ---
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.form-step');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            if (!validateStep(currentStepNum)) return;
            goToStep(currentStepNum + 1);
        });
    });


    document.querySelectorAll('[data-action="prev"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.form-step');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            goToStep(currentStepNum - 1);
        });
    });


    // --- ز. البحث عن الأغاني عبر iTunes API ---
    const songSearchInput = document.getElementById('songSearchInput');
    const songResults = document.getElementById('songResults');
    const songSelected = document.getElementById('songSelected');
    const selectedSongImg = document.getElementById('selectedSongImg');
    const selectedSongTitle = document.getElementById('selectedSongTitle');
    const selectedSongArtist = document.getElementById('selectedSongArtist');
    const removeSongBtn = document.getElementById('removeSongBtn');
    const previewPlayBtn = document.getElementById('previewPlayBtn');


    if (songSearchInput) {
        songSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(searchDebounceTimer);


            if (query.length < 2) {
                if (songResults) {
                    songResults.innerHTML = '';
                    songResults.style.display = 'none';
                }
                return;
            }


            searchDebounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`);
                    const data = await res.json();


                    if (!songResults) return;
                    songResults.innerHTML = '';
                    if (!data.results || data.results.length === 0) {
                        songResults.innerHTML = '<div class="song-item-empty">لم يتم العثور على نتائج</div>';
                        songResults.style.display = 'block';
                        return;
                    }


                    data.results.forEach(track => {
                        const item = document.createElement('div');
                        item.className = 'song-item';
                        item.innerHTML = `
                            <img src="${track.artworkUrl60}" alt="${track.trackName}">
                            <div class="song-info">
                                <div class="title">${track.trackName}</div>
                                <div class="artist">${track.artistName}</div>
                            </div>
                        `;


                        item.addEventListener('click', () => {
                            selectedSong = {
                                previewUrl: track.previewUrl,
                                title: track.trackName,
                                artist: track.artistName
                            };
                            if (selectedSongImg) selectedSongImg.src = track.artworkUrl100;
                            if (selectedSongTitle) selectedSongTitle.textContent = track.trackName;
                            if (selectedSongArtist) selectedSongArtist.textContent = track.artistName;


                            songResults.style.display = 'none';
                            if (songSelected) songSelected.style.display = 'flex';
                            songSearchInput.value = '';


                            const previewSong = document.getElementById('previewSong');
                            if (previewSong) previewSong.textContent = `🎵 ${track.trackName} - ${track.artistName}`;


                            // تفعيل الديسك الدوّار حول الأفاتار عند اختيار أغنية
                            if (previewDisc) {
                                previewDisc.style.backgroundImage = `url('${track.artworkUrl60}')`;
                                previewDisc.classList.add('spinning');
                            }
                        });


                        songResults.appendChild(item);
                    });
                    songResults.style.display = 'block';
                } catch (err) {
                    console.error("خطأ أثناء جلب الأغاني:", err);
                }
            }, 400);
        });
    }


    if (previewPlayBtn) {
        previewPlayBtn.addEventListener('click', () => {
            if (!selectedSong) return;
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                previewPlayBtn.textContent = '▶';
                if (previewDisc) previewDisc.classList.remove('audio-on');
            } else {
                if (currentAudio) currentAudio.pause();
                currentAudio = new Audio(selectedSong.previewUrl);
                currentAudio.play();
                previewPlayBtn.textContent = '⏸';
                if (previewDisc) previewDisc.classList.add('audio-on');
                currentAudio.onended = () => {
                    previewPlayBtn.textContent = '▶';
                    if (previewDisc) previewDisc.classList.remove('audio-on');
                };
            }
        });
    }


    if (removeSongBtn) {
        removeSongBtn.addEventListener('click', () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            selectedSong = null;
            if (songSelected) songSelected.style.display = 'none';
            if (previewPlayBtn) previewPlayBtn.textContent = '▶';
            const previewSong = document.getElementById('previewSong');
            if (previewSong) previewSong.textContent = '';


            // إيقاف الديسك الدوّار وإزالة صورة الغلاف عند حذف الأغنية
            if (previewDisc) {
                previewDisc.style.backgroundImage = '';
                previewDisc.classList.remove('spinning', 'audio-on');
            }
        });
    }


    // --- ح. رفع الملفات إلى Supabase Storage ---
    async function uploadFileToStorage(file, bucket) {
        if (!file) return null;
        const supabase = getSupabase();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;


        const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (error) {
            console.error(`خطأ أثناء رفع الملف إلى ${bucket}:`, error.message);
            return null;
        }
        return data.path;
    }


    // رفع عدة صور معرض دفعة واحدة (يرجع مصفوفة بالمسارات المرفوعة بنجاح فقط)
    async function uploadGalleryFiles(fileList, bucket) {
        if (!fileList || fileList.length === 0) return [];
        const uploads = Array.from(fileList).map(file => uploadFileToStorage(file, bucket));
        const results = await Promise.all(uploads);
        return results.filter(path => path !== null);
    }


    // --- ط. حفظ البيانات النهائية (معالج واحد فقط، بلا تكرار) ---
    const handleProfileSave = async (e) => {
        if (e) e.preventDefault();
        if (currentAudio) currentAudio.pause();


        // تحقق نهائي شامل من كل الحقول الإلزامية عبر جميع الخطوات قبل الحفظ
        // (يحمي من تخطي التحقق في حال وصل المستخدم للخطوة الأخيرة بأي طريقة)
        const galleryInputCheck = document.getElementById('galleryInput');
        const galleryOk = galleryInputCheck && galleryInputCheck.files && galleryInputCheck.files.length > 0;
        const step1Ok = validateStep(1);
        const step2Ok = validateStep(2);
        const step3Ok = validateStep(3);


        if (!galleryOk) {
            setFieldStatus(document.getElementById('galleryStatus'), galleryInputCheck, 'invalid', T().gallery_min_msg);
        }


        if (!step1Ok || !step2Ok || !step3Ok || !galleryOk) {
            alert(T().required_field_msg);
            if (!step1Ok) goToStep(1);
            else if (!step2Ok) goToStep(2);
            else if (!step3Ok || !galleryOk) goToStep(3);
            return;
        }


        const saveBtns = document.querySelectorAll('#saveProfileBtn, #submitBtn, [data-action="save"]');
        saveBtns.forEach(b => b.disabled = true);


        try {
            const supabase = getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("المستخدم غير مسجل الدخول.");


            // 1. رفع الصورة الشخصية
            let avatarPath = null;
            if (avatarInput && avatarInput.files[0]) {
                avatarPath = await uploadFileToStorage(avatarInput.files[0], 'avatars');
            }


            // 2. تجهيز البنر (لون افتراضي / تدرج بلونين قابل للتحكم باتجاهه / رفع صورة)
            let bannerValue = '#1d4ed8';
            if (currentBannerType === 'custom') {
                bannerValue = buildGradientCss();
            } else if (currentBannerType === 'image' && bannerUploadedFile) {
                const uploadedBannerPath = await uploadFileToStorage(bannerUploadedFile, 'media');
                if (uploadedBannerPath) bannerValue = uploadedBannerPath;
            }


            // 3. رفع صور معرض الذكريات (حتى 15 صورة)
            const galleryInput = document.getElementById('galleryInput');
            const galleryPaths = await uploadGalleryFiles(galleryInput?.files, 'media');


            // 4. تجهيز بيانات الأغنية (jsonb)
            const songPayload = selectedSong
                ? { url: selectedSong.previewUrl, title: selectedSong.title, artist: selectedSong.artist }
                : null;


            // 5. تجهيز روابط الفيديو الثلاثة (jsonb array) - يتم استبعاد الروابط الفارغة فقط
            const videoLinks = Array.from(document.querySelectorAll('.video-link-block')).map(block => {
                const url = block.querySelector('.video-url-input')?.value.trim() || '';
                const type = block.querySelector('.video-tab.active')?.getAttribute('data-vtype') || 'youtube';
                return url ? { url, type } : null;
            }).filter(Boolean);


            const instagramParsed = validateInstagramFormat(document.getElementById('instagram')?.value.trim() || '');
            const linkedinRaw = document.getElementById('linkedin')?.value.trim() || '';
            const linkedinParsed = linkedinRaw ? validateLinkedInFormat(linkedinRaw) : null;


            const profilePayload = {
                id: user.id,
                full_name: document.getElementById('fullName')?.value.trim() || '',
                role: document.querySelector('.role-card.selected')?.getAttribute('data-role-val') || 'student',
                bio: document.getElementById('bio')?.value.trim() || '',
                city: document.getElementById('city')?.value.trim() || null,
                lat: window.USER_LOCATION.lat,
                lng: window.USER_LOCATION.lng,
                instagram: instagramParsed.username || null,
                linkedin: linkedinParsed ? linkedinParsed.username : null,
                avatar_url: avatarPath,
                banner_style: bannerValue,
                song_url: songPayload,
                gallery: galleryPaths,
                video_links: videoLinks,
                updated_at: new Date().toISOString()
            };


            const { error } = await supabase.from('profiles').upsert(profilePayload);
            if (error) throw error;


            alert("تم إنشاء البروفايل بنجاح! 🎉");
            window.location.href = "gallery.html";


        } catch (err) {
            alert("حدث خطأ أثناء حفظ البروفايل: " + err.message);
        } finally {
            saveBtns.forEach(b => b.disabled = false);
        }
    };


    const wizardForm = document.getElementById('profileWizardForm');
    if (wizardForm) wizardForm.addEventListener('submit', handleProfileSave);


    // ربط مباشر إضافي بالزر نفسه، احتياطاً إن مُنع حدث submit من قِبل المتصفح
    // (كان يحدث سابقاً بصمت بسبب تحقق HTML5 التلقائي على حقل الفيديو)
    const saveProfileBtnDirect = document.getElementById('saveProfileBtn');
    if (saveProfileBtnDirect) {
        saveProfileBtnDirect.addEventListener('click', (e) => {
            handleProfileSave(e);
        });
    }


});