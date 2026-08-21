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
            lbl_linkedin: "LinkedIn",
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
        const currentThemeIcon = document.getElementById('currentThemeIcon');
        if (currentThemeIcon) currentThemeIcon.textContent = ICONS[themeChoice] || ICONS.light;
       
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


    // --- ج. المعاينة الحية (الاسم / النبذة / الدور / الصورة الشخصية) ---
    const fullNameInput = document.getElementById('fullName');
    const bioInput = document.getElementById('bio');
    const previewName = document.getElementById('previewName');
    const previewBio = document.getElementById('previewBio');
    const previewRole = document.getElementById('previewRole');
    const avatarInput = document.getElementById('avatarInput');
    const previewAvatarImg = document.getElementById('previewAvatarImg');


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


    // --- د. البنر: خيارات (افتراضي / لون مخصص / صورة) + معاينة حية ---
    const bannerOpts = document.querySelectorAll('.banner-opt');
    const customColorControls = document.getElementById('customColorControls');
    const bannerImageControls = document.getElementById('bannerImageControls');
    const bannerColorPicker = document.getElementById('bannerColorPicker');
    const bannerGradientCheck = document.getElementById('bannerGradientCheck');
    const bannerImgInput = document.getElementById('bannerImgInput');
    const previewBanner = document.getElementById('previewBanner');


    let currentBannerType = 'default';
    let bannerUploadedFile = null;


    function updateBannerPreview() {
        if (!previewBanner) return;


        if (currentBannerType === 'default') {
            previewBanner.style.background = '#1d4ed8';
            previewBanner.style.backgroundImage = 'none';
        } else if (currentBannerType === 'custom') {
            const baseColor = bannerColorPicker ? bannerColorPicker.value : '#1d4ed8';
            const isGradient = bannerGradientCheck ? bannerGradientCheck.checked : false;


            if (isGradient) {
                previewBanner.style.background = `linear-gradient(135deg, ${baseColor} 0%, #000000 100%)`;
            } else {
                previewBanner.style.background = baseColor;
                previewBanner.style.backgroundImage = 'none';
            }
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


    if (bannerColorPicker) bannerColorPicker.addEventListener('input', updateBannerPreview);
    if (bannerGradientCheck) bannerGradientCheck.addEventListener('change', updateBannerPreview);


    if (bannerImgInput) {
        bannerImgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                bannerUploadedFile = file;
                updateBannerPreview();
            }
        });
    }


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


    // --- و. أزرار التنقل ---
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.form-step');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
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
            } else {
                if (currentAudio) currentAudio.pause();
                currentAudio = new Audio(selectedSong.previewUrl);
                currentAudio.play();
                previewPlayBtn.textContent = '⏸';
                currentAudio.onended = () => { previewPlayBtn.textContent = '▶'; };
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


            // 2. تجهيز البنر (لون / تدرج / رفع صورة)
            let bannerValue = '#1d4ed8';
            if (currentBannerType === 'custom') {
                const color = bannerColorPicker ? bannerColorPicker.value : '#1d4ed8';
                const isGrad = bannerGradientCheck ? bannerGradientCheck.checked : false;
                bannerValue = isGrad ? `linear-gradient(135deg, ${color} 0%, #000000 100%)` : color;
            } else if (currentBannerType === 'image' && bannerUploadedFile) {
                const uploadedBannerPath = await uploadFileToStorage(bannerUploadedFile, 'media');
                if (uploadedBannerPath) bannerValue = uploadedBannerPath;
            }


            // 3. رفع صور معرض الذكريات (حتى 5 صور)
            const galleryInput = document.getElementById('galleryInput');
            const galleryPaths = await uploadGalleryFiles(galleryInput?.files, 'media');


            // 4. تجهيز بيانات الأغنية (jsonb)
            const songPayload = selectedSong
                ? { url: selectedSong.previewUrl, title: selectedSong.title, artist: selectedSong.artist }
                : null;


            const profilePayload = {
                id: user.id,
                full_name: document.getElementById('fullName')?.value.trim() || '',
                role: document.querySelector('.role-card.selected')?.getAttribute('data-role-val') || 'student',
                bio: document.getElementById('bio')?.value.trim() || null,
                city: document.getElementById('city')?.value.trim() || null,
                lat: window.USER_LOCATION.lat,
                lng: window.USER_LOCATION.lng,
                instagram: document.getElementById('instagram')?.value.trim() || null,
                linkedin: document.getElementById('linkedin')?.value.trim() || null,
                avatar_url: avatarPath,
                banner_style: bannerValue,
                song_url: songPayload,
                gallery: galleryPaths,
                video_url: document.getElementById('videoUrlInput')?.value.trim() || null,
                video_type: document.querySelector('.video-tab.active')?.getAttribute('data-vtype') || 'youtube',
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


    // فيديو: التبديل بين YouTube و Google Drive
    document.querySelectorAll('.video-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});