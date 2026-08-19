const supabaseClient = window.supabaseClient || window.supabase.createClient(window.CONFIG_APP.SUPABASE_URL, window.CONFIG_APP.SUPABASE_ANON_KEY);


const state = { role: null, lat: null, lng: null, banner: { type: 'auto', value: null }, song: null, videoType: 'youtube', existingGallery: [] };
let leafletMap = null, leafletMarker = null, session = null, existingAvatarUrl = null;


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
        stop() { const audio = getEl(); if (audio) { audio.pause(); audio.removeAttribute('src'); } },
        onChange(fn) { onStateChange = fn; }
    };
})();


previewAudio.onChange((isPlaying) => {
    const songPlayBtn = document.getElementById('songPlayBtn');
    if (songPlayBtn) songPlayBtn.textContent = isPlaying ? '⏸' : '▶';
});


function validateImageFile(file) {
    const allowed = window.CONFIG_APP.ALLOWED_IMAGE_TYPES;
    if (!allowed.includes(file.type)) return { valid: false, message: `نوع الملف (${file.name}) غير مدعوم.` };
    if (file.size > window.CONFIG_APP.MAX_IMAGE_MB * 1024 * 1024) return { valid: false, message: `حجم الصورة (${file.name}) يتجاوز المسموح.` };
    return { valid: true };
}


async function uploadFileToStorage(folder, file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `${folder}/${cleanName}`;
    const { error } = await supabaseClient.storage.from('media').upload(filePath, file, { cacheControl: '3600', upsert: false });
    if (error) throw new Error(`فشل رفع الملف (${file.name}): ${error.message}`);
    const { data } = supabaseClient.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
}


function selectSong(track) {
    previewAudio.stop();
    state.song = { title: track.trackName, artist: track.artistName, artwork: track.artworkUrl100, previewUrl: track.previewUrl };
    document.getElementById('songResults').innerHTML = '';
    document.getElementById('songSearch').value = '';
    const box = document.getElementById('songSelected');
    if (!box) return;
    box.hidden = false;
    box.innerHTML = `<img src="${track.artworkUrl100}" alt=""><div class="song-meta"><div class="song-title">${track.trackName}</div><div class="song-artist">${track.artistName}</div></div><button type="button" class="song-play-btn" id="songPlayBtn" aria-label="play preview">▶</button><button type="button" class="song-remove-btn" id="removeSongBtn">إزالة</button>`;
    document.getElementById('songPlayBtn')?.addEventListener('click', () => { if (track.previewUrl) previewAudio.toggle(track.previewUrl); });
    document.getElementById('removeSongBtn')?.addEventListener('click', () => { previewAudio.stop(); state.song = null; box.hidden = true; });
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
            item.innerHTML = `<img src="${track.artworkUrl100}" alt=""><div class="song-meta"><div class="song-title">${track.trackName}</div><div class="song-artist">${track.artistName}</div></div>`;
            item.addEventListener('click', () => selectSong(track));
            resultsBox.appendChild(item);
        });
    } catch (e) { resultsBox.innerHTML = '<p class="field-hint">تعذّر البحث حالياً.</p>'; }
}


function placeMarker(lat, lng) {
    state.lat = lat; state.lng = lng;
    if (leafletMarker) leafletMarker.setLatLng([lat, lng]);
    else leafletMarker = L.marker([lat, lng]).addTo(leafletMap);
}


function initMap() {
    leafletMap = L.map('mapPicker', { zoomControl: false }).setView([31.95, 35.93], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(leafletMap);
    leafletMap.on('click', (e) => placeMarker(e.latlng.lat, e.latlng.lng));
    document.getElementById('locateBtn')?.addEventListener('click', async () => {
        const q = document.getElementById('cityInput')?.value.trim();
        if (!q) return;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`);
        const results = await res.json();
        if (!results.length) { alert('لم يتم العثور على هذا الموقع.'); return; }
        leafletMap.setView([results[0].lat, results[0].lon], 11);
        placeMarker(parseFloat(results[0].lat), parseFloat(results[0].lon));
    });
}


function initBannerAndTabs() {
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.role = card.dataset.role;
        });
    });


    document.querySelectorAll('.banner-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.banner-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.banner.type = btn.dataset.banner;
            document.getElementById('bannerImageFile').hidden = state.banner.type !== 'image';
            document.getElementById('bannerEmojiInput').hidden = state.banner.type !== 'emoji';
        });
    });
    document.getElementById('bannerEmojiInput')?.addEventListener('input', (e) => { state.banner.value = e.target.value; });


    let debounce = null;
    document.getElementById('songSearch')?.addEventListener('input', function () {
        clearTimeout(debounce);
        const term = this.value.trim();
        if (!term) { document.getElementById('songResults').innerHTML = ''; return; }
        debounce = setTimeout(() => searchITunes(term), 400);
    });


    document.querySelectorAll('.video-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.videoType = tab.dataset.vtype;
            document.getElementById('youtubeUrl').hidden = state.videoType !== 'youtube';
            document.getElementById('driveUrl').hidden = state.videoType !== 'drive';
        });
    });
}


async function loadProfile() {
    const { data: { session: s } } = await supabaseClient.auth.getSession();
    session = s;
    if (!session) { window.location.href = 'log_in.html'; return; }


    const { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    if (error || !profile) { window.location.href = 'log_in.html'; return; }


    state.role = profile.role;
    state.lat = profile.lat; state.lng = profile.lng;
    state.banner = profile.banner || { type: 'auto', value: null };
    state.song = profile.song || null;
    state.videoType = profile.video_type || 'youtube';
    state.existingGallery = profile.gallery || [];
    existingAvatarUrl = profile.avatar_url;


    document.querySelector(`.role-card[data-role="${profile.role}"]`)?.classList.add('selected');
    document.getElementById('fullName').value = profile.full_name || '';
    document.getElementById('userBio').value = profile.bio || '';
    document.getElementById('cityInput').value = profile.city || '';
    document.getElementById('linkedinUrl').value = profile.social_links?.linkedin || '';
    document.getElementById('instagramUrl').value = profile.social_links?.instagram || '';
    document.getElementById('currentAvatar').src = profile.avatar_url || '';
    document.getElementById('youtubeUrl').value = profile.video_type === 'youtube' ? (profile.video_url || '') : '';
    document.getElementById('driveUrl').value = profile.video_type === 'drive' ? (profile.video_url || '') : '';


    document.querySelector(`.banner-opt[data-banner="${state.banner.type}"]`)?.classList.add('active');
    if (state.banner.type === 'emoji') { document.getElementById('bannerEmojiInput').hidden = false; document.getElementById('bannerEmojiInput').value = state.banner.value || ''; }
    if (state.banner.type === 'image') document.getElementById('bannerImageFile').hidden = false;


    if (state.song) {
        const box = document.getElementById('songSelected');
        if (box) {
            box.hidden = false;
            box.innerHTML = `<img src="${state.song.artwork}" alt=""><div class="song-meta"><div class="song-title">${state.song.title}</div><div class="song-artist">${state.song.artist}</div></div><button type="button" class="song-play-btn" id="songPlayBtn" aria-label="play preview">▶</button><button type="button" class="song-remove-btn" id="removeSongBtn">إزالة</button>`;
            document.getElementById('songPlayBtn')?.addEventListener('click', () => { if (state.song.previewUrl) previewAudio.toggle(state.song.previewUrl); });
            document.getElementById('removeSongBtn')?.addEventListener('click', () => { previewAudio.stop(); state.song = null; box.hidden = true; });
        }
    }


    document.querySelector(`.video-tab[data-vtype="${state.videoType}"]`)?.classList.add('active');
    document.getElementById('youtubeUrl').hidden = state.videoType !== 'youtube';
    document.getElementById('driveUrl').hidden = state.videoType !== 'drive';


    if (state.lat && state.lng) placeMarker(state.lat, state.lng);


    document.getElementById('loadingMsg').hidden = true;
    document.getElementById('editForm').hidden = false;
}


async function handleSubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ...';


    try {
        let avatarUrl = existingAvatarUrl;
        const avatarFile = document.getElementById('avatarFile')?.files[0];
        if (avatarFile) {
            const check = validateImageFile(avatarFile);
            if (!check.valid) throw new Error(check.message);
            avatarUrl = await uploadFileToStorage('avatars', avatarFile);
        }


        let bannerValue = state.banner.value;
        const bannerFile = document.getElementById('bannerImageFile')?.files[0];
        if (state.banner.type === 'image' && bannerFile) {
            bannerValue = await uploadFileToStorage('banners', bannerFile);
        }


        let gallery = state.existingGallery;
        const galleryFiles = Array.from(document.getElementById('galleryImages')?.files || []);
        if (galleryFiles.length > 0) {
            if (galleryFiles.length > 5) throw new Error('الحد الأقصى 5 صور جديدة في كل مرة.');
            for (const f of galleryFiles) {
                const check = validateImageFile(f);
                if (!check.valid) throw new Error(check.message);
            }
            gallery = await Promise.all(galleryFiles.map(f => uploadFileToStorage('gallery', f)));
        }


        const videoUrl = state.videoType === 'youtube'
            ? (document.getElementById('youtubeUrl')?.value.trim() || null)
            : (document.getElementById('driveUrl')?.value.trim() || null);


        const payload = {
            full_name: document.getElementById('fullName').value.trim(),
            role: state.role,
            bio: document.getElementById('userBio').value.trim(),
            city: document.getElementById('cityInput').value.trim(),
            lat: state.lat,
            lng: state.lng,
            social_links: {
                linkedin: document.getElementById('linkedinUrl').value.trim(),
                instagram: document.getElementById('instagramUrl').value.trim()
            },
            avatar_url: avatarUrl,
            banner: { type: state.banner.type, value: bannerValue },
            song: state.song,
            gallery,
            video_url: videoUrl,
            video_type: state.videoType,
            updated_at: new Date().toISOString()
        };


        const { error } = await supabaseClient.from('profiles').update(payload).eq('id', session.user.id);
        if (error) throw error;


        alert('تم حفظ التعديلات بنجاح!');
        window.location.href = 'main.html';
    } catch (err) {
        alert('خطأ: ' + (err.message || 'حدث خطأ غير متوقع'));
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'حفظ التعديلات';
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    initMap();
    initBannerAndTabs();
    document.getElementById('editForm')?.addEventListener('submit', handleSubmit);
    await loadProfile();
});




