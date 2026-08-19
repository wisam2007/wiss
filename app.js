var CONFIG_APP = window.CONFIG_APP;
var supabaseClient = window.supabaseClient;


var wizard = {
    role: null,
    lat: null,
    lng: null,
    banner: { type: 'auto', value: null },
    song: null,
    videoType: 'youtube',
    turnstileToken: null,
    authMode: 'signup'
};


let leafletMap = null;
let leafletMarker = null;


function initMapIfNeeded() {
    if (!leafletMap) {
        leafletMap = L.map('map').setView([24.7136, 46.6753], 13); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);
    } else {
        leafletMap.invalidateSize();
    }
}


const previewAudio = (() => {
    let el = null;
    let onStateChange = () => {};
    function getEl() {
        if (!el) {
            el = document.getElementById('previewAudioEl');
            if (el) {
                el.addEventListener('play', () => onStateChange(true));
                el.addEventListener('pause', () => onStateChange(false));
                el.addEventListener('ended', () => onStateChange(false));
            }
        }
        return el;
    }
    return {
        toggle(url) {
            const audio = getEl();
            if (!audio || !url) return;
            if (audio.src !== url) audio.src = url;
            if (audio.paused) audio.play().catch(() => {}); else audio.pause();
        },
        stop() {
            const audio = getEl();
            if (!audio) return;
            audio.pause();
            audio.removeAttribute('src');
        },
        isPlaying(url) {
            const audio = getEl();
            return audio ? (!audio.paused && audio.src === url) : false;
        },
        onChange(fn) { onStateChange = fn; }
    };
})();


previewAudio.onChange((isPlaying) => {
    const disc = document.getElementById('previewDisc');
    const discBtn = document.getElementById('discPlayBtn');
    if (discBtn) discBtn.textContent = isPlaying ? '⏸' : '▶';
    if (disc) disc.classList.toggle('audio-on', isPlaying);


    const songPlayBtn = document.getElementById('songPlayBtn');
    if (songPlayBtn) songPlayBtn.textContent = isPlaying ? '⏸' : '▶';
});


function onTurnstileSuccess(token) {
    wizard.turnstileToken = token;
    const submitBtn = document.getElementById('authSubmitBtn');
    if (submitBtn) submitBtn.disabled = false;
}
window.onTurnstileSuccess = onTurnstileSuccess;


function validateImageFile(file) {
    if (!file) return { valid: false, message: 'الملف غير موجود.' };
    if (!CONFIG_APP.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, message: `نوع الملف (${file.name}) غير مدعوم. يرجى اختيار صورة (JPG, PNG, WEBP).` };
    }
    const maxBytes = CONFIG_APP.MAX_IMAGE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
        return { valid: false, message: `حجم الصورة (${file.name}) يتجاوز الحد المسموح (${CONFIG_APP.MAX_IMAGE_MB} ميجابايت).` };
    }
    return { valid: true };
}


function isValidYouTubeUrl(url) {
    if (!url) return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}


function isValidDriveUrl(url) {
    if (!url) return true;
    return /^(https?:\/\/)?(drive\.google\.com)\/.+$/.test(url);
}


function updateProgress(stepNumber) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    const percentage = stepNumber <= 0 ? 0 : Math.min((stepNumber / CONFIG_APP.TOTAL_STEPS) * 100, 100);
    progressBar.style.width = `${percentage}%`;
}


function showStep(stepId) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active-step'));
    const el = document.getElementById(stepId);
    if (el) {
        el.classList.add('active-step');
        if (stepId === 'step-2' && leafletMap) {
            setTimeout(() => { leafletMap.invalidateSize(); }, 100);
        }
    }
}


function validateStepOne() {
    const nameInput = document.getElementById('fullName');
    if (!wizard.role) {
        alert('يرجى اختيار الدور (طالب أو معلم) أولاً.');
        return false;
    }
    if (!nameInput || !nameInput.value.trim()) {
        alert('يرجى كتابة الاسم الكامل أولاً.');
        nameInput?.focus();
        return false;
    }
    return true;
}


function validateStepTwo() {
    const linkedin = document.getElementById('linkedinUrl')?.value.trim();
    const instagram = document.getElementById('instagramUrl')?.value.trim();
    for (const [val, name] of [[linkedin, 'LinkedIn'], [instagram, 'Instagram']]) {
        if (val) {
            try { new URL(val); } catch { alert(`رابط ${name} غير صحيح.`); return false; }
        }
    }
    return true;
}


function validateStepThree() {
    const avatarInput = document.getElementById('avatarFile');
    const avatarFile = avatarInput?.files[0];
    if (!avatarFile) {
        alert('يرجى اختيار صورة للبروفايل.');
        return false;
    }
    const check = validateImageFile(avatarFile);
    if (!check.valid) { alert(check.message); return false; }
    return true;
}


function nextStep(currentStep) {
    if (currentStep === 1 && !validateStepOne()) return;
    if (currentStep === 2 && !validateStepTwo()) return;
    if (currentStep === 3 && !validateStepThree()) return;


    showStep(`step-${currentStep + 1}`);
    updateProgress(currentStep + 1);
    saveDraft();
}
window.nextStep = nextStep;


function prevStep(currentStep) {
    showStep(`step-${currentStep - 1}`);
    updateProgress(currentStep - 1);
}
window.prevStep = prevStep;


function setAuthMessage(msg, type) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.textContent = msg;
    el.className = 'auth-msg' + (type ? ' ' + type : '');
}


function initAuthStep() {
    const googleBtn = document.getElementById('googleBtn');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const tabs = document.querySelectorAll('.auth-tab');


    googleBtn?.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.href }
        });
        if (error) setAuthMessage('تعذّر بدء تسجيل الدخول عبر Google: ' + error.message, 'error');
    });


    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            wizard.authMode = tab.dataset.tab;
            if (authSubmitBtn) {
                authSubmitBtn.textContent = wizard.authMode === 'signup'
                    ? (window.CURRENT_LANG === 'en' ? 'Create account' : 'إنشاء الحساب')
                    : (window.CURRENT_LANG === 'en' ? 'Sign in' : 'تسجيل الدخول');
            }
        });
    });


    authSubmitBtn?.addEventListener('click', async () => {
        const email = document.getElementById('authEmail')?.value.trim();
        const password = document.getElementById('authPassword')?.value;


        if (!email || !password) {
            setAuthMessage('يرجى تعبئة البريد الإلكتروني وكلمة المرور.', 'error');
            return;
        }
        if (!wizard.turnstileToken) {
            setAuthMessage('يرجى إكمال التحقق الأمني قبل المتابعة.', 'error');
            return;
        }


        authSubmitBtn.disabled = true;
        setAuthMessage('جاري المعالجة...', '');


        try {
            if (wizard.authMode === 'signup') {
                const { data, error } = await supabaseClient.auth.signUp({
                    email, password,
                    options: { emailRedirectTo: window.location.href }
                });
                if (error) throw error;
                if (data.session) {
                    await afterAuthSuccess();
                } else {
                    setAuthMessage('تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.', 'success');
                }
            } else {
                const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;
                await afterAuthSuccess();
            }
        } catch (err) {
            setAuthMessage('خطأ: ' + (err.message || 'حدث خطأ غير متوقع'), 'error');
        } finally {
            authSubmitBtn.disabled = false;
        }
    });
}


async function afterAuthSuccess() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;


    const { data: existing } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();


    if (existing) {
        window.location.href = 'main.html';
        return;
    }


    showStep('step-1');
    updateProgress(1);
    restoreDraft();
}


function initStepOne() {
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            wizard.role = card.dataset.role;
            updatePreview();
        });
    });


    document.getElementById('fullName')?.addEventListener('input', updatePreview);
    document.getElementById('userBio')?.addEventListener('input', updatePreview);
}


function initStepTwo() {
    leafletMap = L.map('map', { zoomControl: false }).setView([31.95, 35.93], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);


    leafletMap.on('click', (e) => placeMarker(e.latlng.lat, e.latlng.lng));


    document.getElementById('locateBtn')?.addEventListener('click', async () => {
        const query = document.getElementById('cityInput')?.value.trim();
        if (!query) { alert('اكتب اسم المدينة أولاً.'); return; }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
            const results = await res.json();
            if (!results.length) { alert('لم يتم العثور على هذا الموقع.'); return; }
            const { lat, lon } = results[0];
            leafletMap.setView([lat, lon], 11);
            placeMarker(parseFloat(lat), parseFloat(lon));
        } catch (err) {
            alert('تعذّر البحث عن الموقع حالياً، حاول لاحقاً.');
        }
    });
}


function placeMarker(lat, lng) {
    wizard.lat = lat;
    wizard.lng = lng;
    if (leafletMarker) {
        leafletMarker.setLatLng([lat, lng]);
    } else {
        leafletMarker = L.marker([lat, lng]).addTo(leafletMap);
    }
}


function initStepThree() {
    const avatarFile = document.getElementById('avatarFile');
    avatarFile?.addEventListener('change', () => {
        const file = avatarFile.files[0];
        if (!file) return;
        
        // تصحيح: إظهار معاينة الصورة الحقيقية التي اخترها المستخدم
        const url = URL.createObjectURL(file);
        const previewImg = document.getElementById('previewAvatar');
        if (previewImg) previewImg.src = url;
        
        if (wizard.banner.type === 'auto') extractDominantColor(url);
    });


    document.querySelectorAll('.banner-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.banner-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.dataset.banner;
            wizard.banner.type = type;


            document.getElementById('bannerImageFile').hidden = type !== 'image';
            document.getElementById('bannerEmojiInput').hidden = type !== 'emoji';


            if (type === 'gradient') {
                wizard.banner.value = 'animated';
                setPreviewBanner('linear-gradient(135deg, var(--primary-color), #a855f7)', true);
            } else if (type === 'auto') {
                const avatarSrc = document.getElementById('previewAvatar')?.src;
                if (avatarSrc) extractDominantColor(avatarSrc);
            } else if (type === 'emoji' || type === 'image') {
                setPreviewBanner('var(--border-color)', false);
            }
        });
    });


    document.getElementById('bannerImageFile')?.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        wizard.banner.value = url;
        setPreviewBanner(`url(${url}) center/cover`, false);
    });


    document.getElementById('bannerEmojiInput')?.addEventListener('input', function () {
        wizard.banner.value = this.value;
        const previewBanner = document.getElementById('previewBanner');
        if (!previewBanner) return;
        previewBanner.style.background = 'var(--border-color)';
        previewBanner.textContent = this.value;
        previewBanner.style.fontSize = '2rem';
        previewBanner.style.display = 'flex';
        previewBanner.style.alignItems = 'center';
        previewBanner.style.justifyContent = 'center';
    });


    document.getElementById('discPlayBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wizard.song) previewAudio.toggle(wizard.song.previewUrl);
    });
    document.getElementById('previewDisc')?.addEventListener('click', () => {
        if (wizard.song) previewAudio.toggle(wizard.song.previewUrl);
    });


    let songDebounce = null;
    document.getElementById('songSearch')?.addEventListener('input', function () {
        clearTimeout(songDebounce);
        const term = this.value.trim();
        const resultsBox = document.getElementById('songResults');
        if (!term) { if (resultsBox) resultsBox.innerHTML = ''; return; }
        songDebounce = setTimeout(() => searchITunes(term), 400);
    });
}


function setPreviewBanner(cssBackground, animated) {
    const el = document.getElementById('previewBanner');
    if (!el) return;
    el.textContent = '';
    el.style.background = cssBackground;
    el.style.backgroundSize = animated ? '200% 200%' : 'cover';
    el.style.animation = animated ? 'gradientShift 6s ease infinite' : 'none';
}


function extractDominantColor(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 20; canvas.height = 20;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 20, 20);
            const data = ctx.getImageData(0, 0, 20, 20).data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
            }
            r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
            const hex = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
            wizard.banner.value = hex;
            setPreviewBanner(`linear-gradient(135deg, ${hex}, #a855f7)`, false);
        } catch (e) {}
    };
    img.src = imageUrl;
}


async function searchITunes(term) {
    const resultsBox = document.getElementById('songResults');
    if (!resultsBox) return;
    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=6`);
        const data = await res.json();
        resultsBox.innerHTML = '';
        (data.results || []).forEach(track => {
            const item = document.createElement('div');
            item.className = 'song-result-item';
            item.innerHTML = `
                <img src="${track.artworkUrl100}" alt="">
                <div class="song-meta">
                    <div class="song-title">${track.trackName}</div>
                    <div class="song-artist">${track.artistName}</div>
                </div>`;
            item.addEventListener('click', () => selectSong(track));
            resultsBox.appendChild(item);
        });
    } catch (e) {
        resultsBox.innerHTML = '<p class="field-hint">تعذّر البحث حالياً.</p>';
    }
}


function selectSong(track) {
    previewAudio.stop();
    wizard.song = {
        title: track.trackName,
        artist: track.artistName,
        artwork: track.artworkUrl100,
        previewUrl: track.previewUrl
    };
    document.getElementById('songResults').innerHTML = '';
    document.getElementById('songSearch').value = '';


    const box = document.getElementById('songSelected');
    if (!box) return;
    box.hidden = false;
    box.innerHTML = `
        <img src="${track.artworkUrl100}" alt="">
        <div class="song-meta">
            <div class="song-title">${track.trackName}</div>
            <div class="song-artist">${track.artistName}</div>
        </div>
        <button type="button" class="song-play-btn" id="songPlayBtn" aria-label="play preview">▶</button>
        <button type="button" class="song-remove-btn" id="removeSongBtn">إزالة</button>`;
    document.getElementById('songPlayBtn')?.addEventListener('click', () => {
        if (track.previewUrl) previewAudio.toggle(track.previewUrl);
    });
    document.getElementById('removeSongBtn')?.addEventListener('click', () => {
        previewAudio.stop();
        wizard.song = null;
        box.hidden = true;
        updatePreview();
    });
    updatePreview();
}


function initStepFour() {
    document.querySelectorAll('.video-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            wizard.videoType = tab.dataset.vtype;


            document.getElementById('youtubeUrl').hidden = wizard.videoType !== 'youtube';
            document.getElementById('driveUrl').hidden = wizard.videoType !== 'drive';
        });
    });
}


function updatePreview() {
    document.getElementById('previewName').textContent = document.getElementById('fullName')?.value || (window.CURRENT_LANG === 'en' ? 'Your name here' : 'اسمك هنا');
    document.getElementById('previewBio').textContent = document.getElementById('userBio')?.value || '';


    const roleLabel = wizard.role === 'student' ? '🎓' : wizard.role === 'teacher' ? '👩‍🏫' : '';
    const roleText = wizard.role === 'student'
        ? (window.CURRENT_LANG === 'en' ? 'Cohort student' : 'طالب في الكوهورت')
        : wizard.role === 'teacher'
            ? (window.CURRENT_LANG === 'en' ? 'Teacher / facilitator' : 'معلم / ميسّر')
            : (window.CURRENT_LANG === 'en' ? 'Role' : 'الدور');
    document.getElementById('previewRole').textContent = `${roleLabel} ${roleText}`.trim();


    const songEl = document.getElementById('previewSong');
    const disc = document.getElementById('previewDisc');
    const discBtn = document.getElementById('discPlayBtn');
    if (wizard.song) {
        if (songEl) songEl.textContent = `🎵 ${wizard.song.title} — ${wizard.song.artist}`;
        if (disc) {
            disc.style.backgroundImage = `url(${wizard.song.artwork})`;
            disc.classList.add('spinning');
        }
        if (discBtn) discBtn.hidden = false;
    } else {
        if (songEl) songEl.textContent = '';
        if (disc) disc.classList.remove('spinning');
        if (discBtn) discBtn.hidden = true;
        previewAudio.stop();
    }
}


function saveDraft() {
    const draft = {
        role: wizard.role,
        fullName: document.getElementById('fullName')?.value || '',
        bio: document.getElementById('userBio')?.value || '',
        city: document.getElementById('cityInput')?.value || '',
        lat: wizard.lat,
        lng: wizard.lng,
        linkedin: document.getElementById('linkedinUrl')?.value || '',
        instagram: document.getElementById('instagramUrl')?.value || '',
        banner: wizard.banner,
        song: wizard.song,
        videoType: wizard.videoType,
        youtubeUrl: document.getElementById('youtubeUrl')?.value || '',
        driveUrl: document.getElementById('driveUrl')?.value || ''
    };
    try { localStorage.setItem(CONFIG_APP.DRAFT_KEY, JSON.stringify(draft)); } catch (e) {}
}


function restoreDraft() {
    let raw;
    try { raw = localStorage.getItem(CONFIG_APP.DRAFT_KEY); } catch (e) { return; }
    if (!raw) return;
    let draft;
    try { draft = JSON.parse(raw); } catch (e) { return; }


    if (draft.role) {
        wizard.role = draft.role;
        document.querySelector(`.role-card[data-role="${draft.role}"]`)?.classList.add('selected');
    }
    if (draft.fullName && document.getElementById('fullName')) document.getElementById('fullName').value = draft.fullName;
    if (draft.bio && document.getElementById('userBio')) document.getElementById('userBio').value = draft.bio;
    if (draft.city && document.getElementById('cityInput')) document.getElementById('cityInput').value = draft.city;
    if (draft.lat && draft.lng) { wizard.lat = draft.lat; wizard.lng = draft.lng; }
    if (draft.linkedin && document.getElementById('linkedinUrl')) document.getElementById('linkedinUrl').value = draft.linkedin;
    if (draft.instagram && document.getElementById('instagramUrl')) document.getElementById('instagramUrl').value = draft.instagram;
    if (draft.banner) wizard.banner = draft.banner;
    if (draft.song) {
        wizard.song = draft.song;
        const box = document.getElementById('songSelected');
        if (box) {
            box.hidden = false;
            box.innerHTML = `
                <img src="${draft.song.artwork}" alt="">
                <div class="song-meta">
                    <div class="song-title">${draft.song.title}</div>
                    <div class="song-artist">${draft.song.artist}</div>
                </div>
                <button type="button" class="song-play-btn" id="songPlayBtn" aria-label="play preview">▶</button>
                <button type="button" class="song-remove-btn" id="removeSongBtn">إزالة</button>`;
            document.getElementById('songPlayBtn')?.addEventListener('click', () => {
                if (draft.song.previewUrl) previewAudio.toggle(draft.song.previewUrl);
            });
            document.getElementById('removeSongBtn')?.addEventListener('click', () => {
                previewAudio.stop();
                wizard.song = null;
                box.hidden = true;
                updatePreview();
            });
        }
    }
    if (draft.videoType) wizard.videoType = draft.videoType;
    if (draft.youtubeUrl && document.getElementById('youtubeUrl')) document.getElementById('youtubeUrl').value = draft.youtubeUrl;
    if (draft.driveUrl && document.getElementById('driveUrl')) document.getElementById('driveUrl').value = draft.driveUrl;


    const draftNote = document.getElementById('draftNote');
    if (draftNote) draftNote.hidden = false;
    updatePreview();
}


document.addEventListener('input', (e) => {
    if (e.target.closest('#signupForm')) saveDraft();
});


async function uploadFileToStorage(folder, file) {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${cleanFileName}`;


    const { error: uploadError } = await supabaseClient.storage.from('media').upload(filePath, file, {
        cacheControl: '3600', upsert: false
    });
    if (uploadError) throw new Error(`فشل رفع الملف (${file.name}): ${uploadError.message}`);


    const { data: urlData } = supabaseClient.storage.from('media').getPublicUrl(filePath);
    return { url: urlData.publicUrl, path: filePath };
}


async function cleanupUploadedFiles(filePaths) {
    if (!filePaths || filePaths.length === 0) return;
    try { await supabaseClient.storage.from('media').remove(filePaths); } catch (e) {}
}


function initFinalSubmit() {
    document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();


        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) { alert('انتهت جلسة الدخول، يرجى تسجيل الدخول من جديد.'); window.location.reload(); return; }


        const youtubeUrl = document.getElementById('youtubeUrl')?.value.trim();
        const driveUrl = document.getElementById('driveUrl')?.value.trim();


        if (wizard.videoType === 'youtube' && youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
            alert('يرجى إدخال رابط يوتيوب صحيح.'); return;
        }
        if (wizard.videoType === 'drive' && driveUrl && !isValidDriveUrl(driveUrl)) {
            alert('يرجى إدخال رابط Google Drive صحيح.'); return;
        }


        const galleryInput = document.getElementById('galleryImages');
        const galleryFiles = galleryInput?.files ? Array.from(galleryInput.files) : [];
        if (galleryFiles.length < 1 || galleryFiles.length > 5) {
            alert(`يرجى اختيار من 1 إلى 5 صور للمعرض. (العدد الحالي: ${galleryFiles.length})`);
            return;
        }
        for (const file of galleryFiles) {
            const check = validateImageFile(file);
            if (!check.valid) { alert(check.message); return; }
        }


        const avatarFile = document.getElementById('avatarFile')?.files[0];
        const submitBtn = document.getElementById('submitBtn');
        const uploadedPaths = [];


        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري رفع الصور...';


            const avatarRes = await uploadFileToStorage('avatars', avatarFile);
            uploadedPaths.push(avatarRes.path);


            const galleryResponses = await Promise.all(galleryFiles.map(f => uploadFileToStorage('gallery', f)));
            galleryResponses.forEach(r => uploadedPaths.push(r.path));


            let bannerUrl = null;
            const bannerFile = document.getElementById('bannerImageFile')?.files[0];
            if (wizard.banner.type === 'image' && bannerFile) {
                const bannerRes = await uploadFileToStorage('banners', bannerFile);
                uploadedPaths.push(bannerRes.path);
                bannerUrl = bannerRes.url;
            }


            const videoUrl = wizard.videoType === 'youtube' ? (youtubeUrl || null) : (driveUrl || null);


            submitBtn.textContent = 'جاري حفظ البيانات...';


            const payload = {
                id: session.user.id,
                full_name: document.getElementById('fullName').value.trim(),
                role: wizard.role,
                bio: document.getElementById('userBio').value.trim(),
                city: document.getElementById('cityInput').value.trim(),
                lat: wizard.lat,
                lng: wizard.lng,
                social_links: {
                    linkedin: document.getElementById('linkedinUrl').value.trim(),
                    instagram: document.getElementById('instagramUrl').value.trim()
                },
                avatar_url: avatarRes.url,
                banner: { type: wizard.banner.type, value: wizard.banner.type === 'image' ? bannerUrl : wizard.banner.value },
                song: wizard.song,
                gallery: galleryResponses.map(r => r.url),
                video_url: videoUrl,
                video_type: wizard.videoType
            };


            const { error: dbError } = await supabaseClient.from('profiles').upsert([payload]);
            if (dbError) throw dbError;


            try { localStorage.removeItem(CONFIG_APP.DRAFT_KEY); } catch (e) {}


            alert('تم إنشاء البروفايل بنجاح! جاري التحويل...');
            window.location.href = 'main.html';


        } catch (err) {
            console.error('حدث خطأ أثناء الإنشاء:', err);
            if (uploadedPaths.length > 0) {
                submitBtn.textContent = 'جاري إلغاء الملفات المرفوعة...';
                await cleanupUploadedFiles(uploadedPaths);
            }
            alert('حدث خطأ أثناء الحفظ: ' + (err.message || 'خطأ غير معروف'));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'حفظ وإنشاء البروفايل';
        }
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    initAuthStep();
    initStepOne();
    initStepTwo();
    initStepThree();
    initStepFour();
    initFinalSubmit();
    updatePreview();


    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        await afterAuthSuccess();
        return;
    }


    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
            await afterAuthSuccess();
        }
    });
});