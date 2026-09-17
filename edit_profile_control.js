/* ============================================================
   edit_profile_control.js — per-section profile editor
   ============================================================ */
(function () {
    'use strict';


    const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!client) { console.error('[edit_profile] Supabase not ready'); return; }


    const FALLBACK_AVATAR = 'https://placehold.co/200x200/e2e8f0/1e293b?text=?';


    function t(key, params) {
        let str = window.t ? window.t(key) : key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
            });
        }
        return str;
    }


    /* Safe setter for input/textarea elements */
    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value ?? '';
    }


    /* Safe setter for element text */
    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? '';
    }


    /* Safe setter for element HTML */
    function setHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html ?? '';
    }


    const state = {
        profile: null,
        session: null,
        identity: { full_name: '', role: 'student', bio: '' },
        location: { lat: null, lng: null, city: '' },
        social: { linkedin: '', instagram: '' },
        avatar: { file: null, previewUrl: null },
        banner: { type: 'auto', value: null, file: null },
        song: null,
        gallery: [],
        newGalleryFiles: [],
        galleryRemoved: [],
        videoLinks: []
    };


    let leafletMap = null;
    let leafletMarker = null;


    /* ---------- helpers ---------- */
    function resolveStorageUrl(path, bucket = 'avatars') {
        if (!path || String(path).trim() === '' || path === 'null') return null;
        if (/^https?:\/\//i.test(path)) return path;
        const clean = String(path).replace(/^\/+/, '');
        const { data } = client.storage.from(bucket).getPublicUrl(clean);
        return data?.publicUrl || null;
    }


    function cleanSocial(v) {
        if (!v) return '';
        let s = String(v).trim();
        s = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
        s = s.replace(/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(in\/)?/i, '');
        s = s.replace(/^@+/, '');
        s = s.split('?')[0].replace(/^\/+|\/+$/g, '');
        if (!/^[a-zA-Z0-9._-]{1,60}$/.test(s)) return '';
        return s;
    }


    function avatarToUrl(v) {
        if (!v) return FALLBACK_AVATAR;
        const url = resolveStorageUrl(v, 'avatars');
        return url || v || FALLBACK_AVATAR;
    }


    function bannerToCss(banner, bannerStyle) {
        let src = bannerStyle;
        if (!src && banner) {
            if (typeof banner === 'string') src = banner;
            else if (banner.value) src = banner.value;
        }
        if (!src) return '#1d4ed8';
        if (src.startsWith('#') || src.startsWith('linear-gradient')) return src;
        if (src.startsWith('url(')) return src;
        const url = resolveStorageUrl(src, 'media');
        return url ? `url('${url}') center/cover no-repeat` : '#1d4ed8';
    }


    function parseGradient(str) {
        if (!str || typeof str !== 'string') return null;
        const m = str.match(/linear-gradient\(\s*(\d+)deg\s*,\s*(#[0-9a-fA-F]{3,8})\s*0%\s*,\s*(#[0-9a-fA-F]{3,8})\s*100%\s*\)/i);
        if (!m) return null;
        return { deg: parseInt(m[1], 10), c1: m[2], c2: m[3] };
    }


    function validateImageFile(file) {
        const allowed = (window.CONFIG_APP?.ALLOWED_IMAGE_TYPES) || ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) return { valid: false, message: `${file.name} — ${file.type}` };
FIG_APP?.MAX_IMAGE_MB || 5;
        if (file.size > maxMb * 1024 * 1024) return { valid: false, message: `${file.name} > ${maxMb}MB` };
        return { valid: true };
    }


    async function uploadFile(file, bucket) {
        const ext = file.name.split('.').pop().toLowerCase();
        const path = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { data, error } = await client.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) throw new Error(error.message);
        return data.path;
    }


    function toast(msg, type) {
        if (window.showToast) window.showToast(msg, type);
        else console.log(`[${type || 'info'}] ${msg}`);
    }


    function updateHint(section, text) {
        const el = document.getElementById(`hint-${section}`);
        if (el) el.textContent = text || '—';
    }


    function closeSection(name) {
        const el = document.querySelector(`.edit-section[data-section="${name}"]`);
        if (el) el.open = false;
    }


    /* ---------- load ---------- */
    async function load() {
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = 'log_in.html'; return; }
        state.session = session;


        const { data, error } = await client.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (error || !data) { window.location.href = 'log_in.html'; return; }
        state.profile = data;


        hydrateFromProfile(data);
        renderPreview();
        renderAllSections();
        bindEvents();
    }


    function hydrateFromProfile(p) {
        state.identity = {
            full_name: p.full_name || '',
            role: p.role || 'student',
            bio: p.bio || ''
        };
        state.location = { lat: p.lat, lng: p.lng, city: p.city || '' };


        const social = p.social_links || {};
        state.social = {
            linkedin: cleanSocial(social.linkedin || p.linkedin || ''),
            instagram: cleanSocial(social.instagram || p.instagram || '')
        };


        state.banner = { type: 'auto', value: null, file: null };
        if (p.banner && typeof p.banner === 'object') {
            state.banner.type = p.banner.type || 'auto';
            state.banner.value = p.banner.value || null;
        } else if (p.banner_style) {
            if (p.banner_style.startsWith('linear-gradient')) {
                state.banner = { type: 'custom', value: p.banner_style, file: null };
            } else if (/\.(jpe?g|png|webp)$/i.test(p.banner_style)) {
                state.banner = { type: 'image', value: p.banner_style, file: null };
            } else {
                state.banner = { type: 'auto', value: p.banner_style, file: null };
            }
        }


        let song = p.song_url;
        if (typeof song === 'string') { try { song = JSON.parse(song); } catch (e) { song = null; } }
        if (song && typeof song === 'object') {
            state.song = {
                title: song.title || '',
                artist: song.artist || '',
                artwork: song.artwork || null,
                previewUrl: song.previewUrl || song.url || null
            };
        } else {
            state.song = null;
        }


        state.gallery = Array.isArray(p.gallery) ? p.gallery.slice() : [];
        state.videoLinks = Array.isArray(p.video_links) ? p.video_links.map(v => ({
            url: v.url || '',
            type: (v.type === 'drive' || v.type === 'gdrive') ? 'gdrive' : 'youtube'
        })) : [];
    }


    /* ---------- preview ---------- */
    function renderPreview() {
        const bannerEl = document.getElementById('previewBanner');
        if (bannerEl) bannerEl.style.background = bannerToCss(state.banner, state.banner.value);
        if (state.banner.type === 'image' && state.banner.file && bannerEl) {
            const reader = new FileReader();
            reader.onload = (e) => { bannerEl.style.background = `url('${e.target.result}') center/cover no-repeat`; };
            reader.readAsDataURL(state.banner.file);
        }


        const avatarEl = document.getElementById('previewAvatar');
        if (avatarEl) avatarEl.src = state.avatar.previewUrl || avatarToUrl(state.profile.avatar_url);


        setText('previewName', state.identity.full_name || '—');
        const roleText = state.identity.role === 'teacher' ? t('role_teacher') : t('role_student');
        setText('previewRole', state.identity.role === 'teacher' ? `👩‍🏫 ${roleText}` : `🎓 ${roleText}`);
        setText('previewBio', state.identity.bio || '—');


        const socialsEl = document.getElementById('previewSocials');
        if (socialsEl) {
            const links = [];
            if (state.social.instagram) {
                const url = window.buildSocialUrl ? window.buildSocialUrl(state.social.instagram, 'instagram') : `https://instagram.com/${state.social.instagram}`;
                links.push(`<a class="social-link" target="_blank" rel="noopener" aria-label="Instagram" href="${url}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"></circle></svg></a>`);
            }
            if (state.social.linkedin) {
                const url = window.buildSocialUrl ? window.buildSocialUrl(state.social.linkedin, 'linkedin') : `https://linkedin.com/in/${state.social.linkedin}`;
                links.push(`<a class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn" href="${url}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z"></path></svg></a>`);
            }
            socialsEl.innerHTML = links.join('');
        }


        const totalImages = state.gallery.length + state.newGalleryFiles.length;
        setHTML('previewGalleryCount', `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>${totalImages}`);
        setHTML('previewSongStatus', state.song
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>${t('song_added_hint')}`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>${t('song_none_hint')}`);
        const videoCount = state.videoLinks.filter(v => v.url).length;
        setHTML('previewVideoStatus',
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="2"/><path d="m17 10 5-3v10l-5-3"/></svg>${videoCount ? t('video_count_hint', { n: videoCount }) : t('video_none_hint')}`);


        updateHint('identity', state.identity.full_name || '—');
        updateHint('location', state.location.city || '—');
        updateHint('social', state.social.instagram || state.social.linkedin || '—');
        updateHint('avatar', state.profile.avatar_url ? t('avatar_added') : t('avatar_not_added'));
        const bannerHintKey = state.banner.type === 'image' ? 'banner_image_hint'
            : state.banner.type === 'custom' ? 'banner_custom_hint' : 'banner_default_hint';
        updateHint('banner', t(bannerHintKey));
        updateHint('song', state.song ? state.song.title : t('song_none_hint'));
        updateHint('gallery', t('gallery_count_hint', { n: totalImages }));
        updateHint('video', `${videoCount} / 3`);
    }


    /* ---------- render sections ---------- */
    function renderAllSections() {
        setValue('editFullName', state.identity.full_name);
        setValue('editBio', state.identity.bio);


        document.querySelectorAll('.edit-section[data-section="identity"] .role-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.role === state.identity.role);
        });


        setValue('editCity', state.location.city);
        setValue('editInstagram', state.social.instagram);
        setValue('editLinkedin', state.social.linkedin);


        const avatarEl = document.getElementById('editAvatarCurrent');
        if (avatarEl) avatarEl.src = avatarToUrl(state.profile.avatar_url);


        const bannerPrev = document.getElementById('editBannerPreview');
        if (bannerPrev) bannerPrev.style.background = bannerToCss(state.banner, state.banner.value);


        document.querySelectorAll('.edit-section[data-section="banner"] .banner-opt').forEach(b => {
            b.classList.toggle('active', b.dataset.bannerType === state.banner.type);
        });


        const customCtrl = document.getElementById('customColorControls');
        const imageCtrl  = document.getElementById('bannerImageControls');
        if (customCtrl) customCtrl.style.display = state.banner.type === 'custom' ? 'block' : 'none';
        if (imageCtrl)  imageCtrl.style.display  = state.banner.type === 'image'  ? 'block' : 'none';


        if (state.banner.type === 'custom' && state.banner.value) {
            const parsed = parseGradient(state.banner.value);
            if (parsed) {
                setValue('bannerColor1', parsed.c1);
                setValue('bannerColor2', parsed.c2);
                const degEl = document.getElementById('bannerDirection');
                if (degEl) degEl.value = String(parsed.deg);
                setText('bannerDirectionLabel', parsed.deg + '°');
            }
        }


        renderSongCurrent();
        renderGalleryGrid();
        renderVideoBlocks();
    }


    function renderSongCurrent() {
        const box = document.getElementById('songCurrentBox');
        const removeBtn = document.getElementById('removeSongBtn');
        if (!box || !removeBtn) return;


        if (!state.song) {
            box.style.display = 'none';
            removeBtn.style.display = 'none';
            return;
        }
        box.style.display = 'flex';
        removeBtn.style.display = 'inline-block';
        box.innerHTML = `
            ${state.song.artwork ? `<img src="${state.song.artwork}" alt="">` : '<div style="width:44px;height:44px;background:var(--border-color);border-radius:6px;"></div>'}
            <div class="song-meta">
                <div class="song-title">${state.song.title}</div>
                <div class="song-artist">${state.song.artist}</div>
            </div>
            ${state.song.previewUrl ? `<button type="button" class="song-play-btn" id="playCurrentSong">▶</button>` : ''}
        `;
        if (state.song.previewUrl) {
            const playBtn = document.getElementById('playCurrentSong');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const audio = document.getElementById('previewAudioEl');
                    if (!audio) return;
                    if (audio.src !== state.song.previewUrl) audio.src = state.song.previewUrl;
                    if (audio.paused) { audio.play().catch(() => {}); e.target.textContent = '⏸'; }
                    else { audio.pause(); e.target.textContent = '▶'; }
                });
            }
        }
    }


    function renderGalleryGrid() {
        const grid = document.getElementById('editGalleryGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const total = state.gallery.length + state.newGalleryFiles.length;
        const countEl = document.getElementById('editGalleryCount');
        if (countEl) {
            countEl.textContent = `${total} / 15`;
            countEl.classList.toggle('limit-reached', total >= 15);
        }


        state.gallery.forEach((path) => {
            const url = resolveStorageUrl(path, 'media');
            const wrap = document.createElement('div');
            wrap.className = 'edit-gallery-thumb';
            wrap.innerHTML = `<img src="${url || FALLBACK_AVATAR}" alt=""><button type="button" class="thumb-remove" title="✕">✕</button>`;
            wrap.querySelector('.thumb-remove').addEventListener('click', () => {
                state.gallery = state.gallery.filter(x => x !== path);
                state.galleryRemoved.push(path);
                renderGalleryGrid();
                renderPreview();
            });
            grid.appendChild(wrap);
        });


        state.newGalleryFiles.forEach((file, i) => {
            const url = URL.createObjectURL(file);
            const wrap = document.createElement('div');
            wrap.className = 'edit-gallery-thumb';
            wrap.innerHTML = `<img src="${url}" alt=""><button type="button" class="thumb-remove" title="✕">✕</button>`;
            wrap.querySelector('.thumb-remove').addEventListener('click', () => {
                state.newGalleryFiles.splice(i, 1);
                renderGalleryGrid();
                renderPreview();
            });
            grid.appendChild(wrap);
        });


        if (total === 0) {
            grid.innerHTML = `<p class="no-comments" style="grid-column:1/-1;">${t('no_photos_yet')}</p>`;
        }
    }


    function renderVideoBlocks() {
        const container = document.getElementById('editVideoBlocks');
        if (!container) return;
        container.innerHTML = '';
        if (state.videoLinks.length === 0) {
            container.innerHTML = `<p class="field-hint">${t('hint_no_videos')}</p>`;
        }
        state.videoLinks.forEach((v, i) => {
            const block = document.createElement('div');
            block.className = 'video-link-block';
            block.innerHTML = `
                <div class="video-link-title">${t('video_n')} ${i + 1}</div>
                <div class="video-type-tabs">
                    <button type="button" class="video-tab ${v.type === 'youtube' ? 'active' : ''}" data-vtype="youtube">YouTube</button>
                    <button type="button" class="video-tab ${v.type === 'gdrive' ? 'active' : ''}" data-vtype="gdrive">Google Drive</button>
                </div>
                <input type="text" class="video-url-input" value="${v.url || ''}" placeholder="https://..." autocomplete="off" spellcheck="false">
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button type="button" class="btn-remove-video">${t('remove_video')}</button>
                </div>
            `;
            block.querySelectorAll('.video-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    block.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    state.videoLinks[i].type = tab.dataset.vtype;
                });
            });
            block.querySelector('.video-url-input').addEventListener('input', (e) => {
                state.videoLinks[i].url = e.target.value.trim();
            });
            block.querySelector('.btn-remove-video').addEventListener('click', () => {
                state.videoLinks.splice(i, 1);
                renderVideoBlocks();
                renderPreview();
            });
            container.appendChild(block);
        });
    }


    /* ---------- save handlers ---------- */
    async function saveSection(name) {
        const btn = document.querySelector(`[data-save="${name}"]`);
        const originalText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = t('saving'); }
        try {
            switch (name) {
                case 'identity': await saveIdentity(); break;
                case 'location': await saveLocation(); break;
                case 'social':   await saveSocial();   break;
                case 'avatar':   await saveAvatar();   break;
                case 'banner':   await saveBanner();   break;
                case 'song':     await saveSong();     break;
                case 'gallery':  await saveGallery();  break;
                case 'video':    await saveVideo();    break;
            }
            const section = document.querySelector(`.edit-section[data-section="${name}"]`);
            if (section) {
                section.classList.add('is-saved');
                setTimeout(() => section.classList.remove('is-saved'), 1000);
            }
            if (btn) btn.textContent = t('saved');
            setTimeout(() => { if (btn) btn.textContent = t('save_changes'); }, 1500);
        } catch (err) {
            console.error(err);
            toast(err.message || t('err_save_failed'), 'error');
            if (btn) btn.textContent = originalText;
        } finally {
            if (btn) btn.disabled = false;
        }
    }


    async function patch(payload) {
        payload.updated_at = new Date().toISOString();
        const { error } = await client.from('profiles').update(payload).eq('id', state.session.user.id);
        if (error) throw new Error(error.message);
        state.profile = { ...state.profile, ...payload };
    }


    async function saveIdentity() {
        const full_name = (document.getElementById('editFullName')?.value || '').trim();
        const role = document.querySelector('.edit-section[data-section="identity"] .role-card.selected')?.dataset.role;
        const bio = (document.getElementById('editBio')?.value || '').trim();
        if (!full_name) throw new Error(t('err_name_required'));
        if (!role) throw new Error(t('err_role_required'));
        await patch({ full_name, role, bio });
        state.identity = { full_name, role, bio };
        renderPreview();
        toast(t('saved_identity'), 'success');
        closeSection('identity');
    }


    async function saveLocation() {
        const city = (document.getElementById('editCity')?.value || '').trim();
        await patch({ city: city || null, lat: state.location.lat, lng: state.location.lng });
        state.location.city = city;
        renderPreview();
        toast(t('saved_location'), 'success');
        closeSection('location');
    }


    async function saveSocial() {
        const instagram = cleanSocial(document.getElementById('editInstagram')?.value || '');
        const linkedin = cleanSocial(document.getElementById('editLinkedin')?.value || '');
        await patch({
            social_links: { linkedin: linkedin || null, instagram: instagram || null },
            linkedin: linkedin || null,
            instagram: instagram || null
        });
        state.social = { instagram, linkedin };
        renderPreview();
        toast(t('saved_social'), 'success');
        closeSection('social');
    }


    async function saveAvatar() {
        const fileInput = document.getElementById('editAvatarFile');
        if (!fileInput) return;
        const file = fileInput.files[0];
        if (!file) { closeSection('avatar'); return; }
        const check = validateImageFile(file);
        if (!check.valid) throw new Error(check.message);
        toast(t('uploading_image'), 'info');
        const path = await uploadFile(file, 'avatars');
        await patch({ avatar_url: path });
        fileInput.value = '';
        state.avatar = { file: null, previewUrl: null };
        const avatarEl = document.getElementById('editAvatarCurrent');
        if (avatarEl) avatarEl.src = avatarToUrl(path);
        renderPreview();
        toast(t('saved_avatar'), 'success');
        closeSection('avatar');
    }


    async function saveBanner() {
        let bannerValue = null;
        let bannerType = state.banner.type;


        if (bannerType === 'custom') {
            const c1 = document.getElementById('bannerColor1')?.value || '#1d4ed8';
            const c2 = document.getElementById('bannerColor2')?.value || '#a855f7';
            const deg = document.getElementById('bannerDirection')?.value || 135;
            bannerValue = `linear-gradient(${deg}deg, ${c1} 0%, ${c2} 100%)`;
        } else if (bannerType === 'image') {
            const fileInput = document.getElementById('bannerImgInput');
            const file = fileInput?.files[0];
            if (file) {
                const check = validateImageFile(file);
                if (!check.valid) throw new Error(check.message);
                toast(t('uploading_banner'), 'info');
                bannerValue = await uploadFile(file, 'media');
                fileInput.value = '';
            } else {
                bannerValue = state.banner.value;
            }
        } else {
            bannerValue = '#1d4ed8';
        }


        await patch({
            banner: { type: bannerType, value: bannerValue },
            banner_style: bannerValue
        });
        state.banner = { type: bannerType, value: bannerValue, file: null };
        renderPreview();
        renderAllSections();
        toast(t('saved_banner'), 'success');
        closeSection('banner');
    }


    async function saveSong() {
        const payload = state.song
            ? { url: state.song.previewUrl, previewUrl: state.song.previewUrl, title: state.song.title, artist: state.song.artist, artwork: state.song.artwork }
            : null;
        await patch({ song_url: payload });
        renderPreview();
        toast(state.song ? t('saved_song') : t('removed_song'), 'success');
        closeSection('song');
    }


    async function saveGallery() {
        let newPaths = [];
        if (state.newGalleryFiles.length > 0) {
            toast(t('uploading_images'), 'info');
            newPaths = await Promise.all(state.newGalleryFiles.map(f => uploadFile(f, 'media')));
        }
        const finalGallery = state.gallery.concat(newPaths);
        await patch({ gallery: finalGallery });
        state.gallery = finalGallery;
        state.newGalleryFiles = [];
        state.galleryRemoved = [];
        const fileInput = document.getElementById('editGalleryFiles');
        if (fileInput) fileInput.value = '';
        renderAllSections();
        renderPreview();
        toast(t('saved_gallery'), 'success');
        closeSection('gallery');
    }


    async function saveVideo() {
        const cleaned = state.videoLinks
            .map(v => ({ url: (v.url || '').trim(), type: v.type === 'gdrive' ? 'gdrive' : 'youtube' }))
            .filter(v => v.url);
        await patch({ video_links: cleaned });
        state.videoLinks = cleaned;
        renderPreview();
        toast(t('saved_video'), 'success');
        closeSection('video');
    }


    /* ---------- event bindings ---------- */
    function bindEvents() {
        document.querySelectorAll('.edit-section[data-section="identity"] .role-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.edit-section[data-section="identity"] .role-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.identity.role = card.dataset.role;
                renderPreview();
            });
        });


        const addListener = (id, event, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, fn);
        };


        addListener('editFullName', 'input', (e) => { state.identity.full_name = e.target.value; renderPreview(); });
        addListener('editBio', 'input', (e) => { state.identity.bio = e.target.value; renderPreview(); });
        addListener('editCity', 'input', (e) => { state.location.city = e.target.value; renderPreview(); });
        addListener('editInstagram', 'input', (e) => { state.social.instagram = cleanSocial(e.target.value); renderPreview(); });
        addListener('editLinkedin', 'input', (e) => { state.social.linkedin = cleanSocial(e.target.value); renderPreview(); });


        addListener('editAvatarFile', 'change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const check = validateImageFile(file);
            if (!check.valid) { toast(check.message, 'error'); e.target.value = ''; return; }
            state.avatar.file = file;
            state.avatar.previewUrl = URL.createObjectURL(file);
            const avatarEl = document.getElementById('editAvatarCurrent');
            if (avatarEl) avatarEl.src = state.avatar.previewUrl;
            renderPreview();
        });


        document.querySelectorAll('.edit-section[data-section="banner"] .banner-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.edit-section[data-section="banner"] .banner-opt').forEach(b => b.classList.remove('active'));
                opt.classList.add('active');
                state.banner.type = opt.dataset.bannerType;
                const customCtrl = document.getElementById('customColorControls');
                const imageCtrl = document.getElementById('bannerImageControls');
                if (customCtrl) customCtrl.style.display = state.banner.type === 'custom' ? 'block' : 'none';
                if (imageCtrl) imageCtrl.style.display = state.banner.type === 'image' ? 'block' : 'none';
                renderPreview();
            });
        });


        ['bannerColor1', 'bannerColor2', 'bannerDirection'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                if (id === 'bannerDirection') {
                    setText('bannerDirectionLabel', `${el.value}°`);
                }
                const c1 = document.getElementById('bannerColor1')?.value || '#1d4ed8';
                const c2 = document.getElementById('bannerColor2')?.value || '#a855f7';
                const deg = document.getElementById('bannerDirection')?.value || 135;
                state.banner.value = `linear-gradient(${deg}deg, ${c1} 0%, ${c2} 100%)`;
                const bannerPrev = document.getElementById('editBannerPreview');
                if (bannerPrev) bannerPrev.style.background = state.banner.value;
                renderPreview();
            });
        });


        addListener('bannerImgInput', 'change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const check = validateImageFile(file);
            if (!check.valid) { toast(check.message, 'error'); e.target.value = ''; return; }
            state.banner.file = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const bannerPrev = document.getElementById('editBannerPreview');
                if (bannerPrev) bannerPrev.style.background = `url('${ev.target.result}') center/cover no-repeat`;
            };
            reader.readAsDataURL(file);
            renderPreview();
        });


        let songTimer = null;
        addListener('editSongSearch', 'input', (e) => {
            clearTimeout(songTimer);
            const q = e.target.value.trim();
            const box = document.getElementById('editSongResults');
            if (!box) return;
            if (q.length < 2) { box.innerHTML = ''; return; }
            songTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=6`);
                    const data = await res.json();
                    box.innerHTML = '';
                    (data.results || []).forEach(track => {
                        const item = document.createElement('div');
                        item.className = 'song-result-item';
                        item.innerHTML = `<img src="${track.artworkUrl100}" alt=""><div class="song-meta"><div class="song-title">${track.trackName}</div><div class="song-artist">${track.artistName}</div></div>`;
                        item.addEventListener('click', () => {
                            state.song = {
                                title: track.trackName,
                                artist: track.artistName,
                                artwork: track.artworkUrl100,
                                previewUrl: track.previewUrl
                            };
                            box.innerHTML = '';
                            const searchInput = document.getElementById('editSongSearch');
                            if (searchInput) searchInput.value = '';
                            renderSongCurrent();
                            renderPreview();
                        });
                        box.appendChild(item);
                    });
                } catch (err) { box.innerHTML = `<p class="field-hint">${t('err_search_failed')}</p>`; }
            }, 400);
        });


        addListener('removeSongBtn', 'click', () => {
            state.song = null;
            renderSongCurrent();
            renderPreview();
        });


        addListener('editGalleryFiles', 'change', (e) => {
            const files = Array.from(e.target.files);
            const total = state.gallery.length + state.newGalleryFiles.length;
            const room = Math.max(0, 15 - total);
            const toAdd = files.slice(0, room);
            for (const f of toAdd) {
                const check = validateImageFile(f);
                if (!check.valid) { toast(check.message, 'error'); continue; }
                state.newGalleryFiles.push(f);
            }
            if (files.length > room) toast(t('err_max_images', { n: room }), 'info');
            e.target.value = '';
            renderGalleryGrid();
            renderPreview();
        });


        addListener('addVideoBlockBtn', 'click', () => {
            if (state.videoLinks.length >= 3) { toast(t('err_max_videos'), 'error'); return; }
            state.videoLinks.push({ url: '', type: 'youtube' });
            renderVideoBlocks();
        });


        document.querySelectorAll('[data-save]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                saveSection(btn.dataset.save);
            });
        });


        const locSection = document.querySelector('.edit-section[data-section="location"]');
        if (locSection) {
            locSection.addEventListener('toggle', () => {
                if (locSection.open && !leafletMap) {
                    setTimeout(initMap, 150);
                } else if (locSection.open && leafletMap) {
                    setTimeout(() => leafletMap.invalidateSize(), 100);
                }
            });
        }


        addListener('locateBtn', 'click', async () => {
            const q = (document.getElementById('editCity')?.value || '').trim();
            if (!q) { toast(t('err_city_required'), 'error'); return; }
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`);
                const results = await res.json();
                if (!results.length) { toast(t('err_city_not_found'), 'error'); return; }
                const { lat, lon } = results[0];
                state.location = { lat: parseFloat(lat), lng: parseFloat(lon), city: q };
                if (leafletMap && leafletMarker) {
                    leafletMap.setView([state.location.lat, state.location.lng], 12);
                    leafletMarker.setLatLng([state.location.lat, state.location.lng]);
                }
            } catch (err) { toast(t('err_search_failed'), 'error'); }
        });


        window.addEventListener('languageChanged', () => {
            renderPreview();
            renderVideoBlocks();
            renderGalleryGrid();
            renderSongCurrent();
        });
    }


    function initMap() {
        const el = document.getElementById('mapPicker');
        if (!el || typeof L === 'undefined') return;
        const lat = state.location.lat || 31.9539;
        const lng = state.location.lng || 35.9106;


        leafletMap = L.map('mapPicker', { zoomControl: true }).setView([lat, lng], state.location.lat ? 12 : 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(leafletMap);


        leafletMarker = L.marker([lat, lng], { draggable: true }).addTo(leafletMap);


        leafletMap.on('click', (e) => {
            const { lat, lng } = e.latlng;
            state.location.lat = lat;
            state.location.lng = lng;
            leafletMarker.setLatLng([lat, lng]);
        });
        leafletMarker.on('dragend', () => {
            const pos = leafletMarker.getLatLng();
            state.location.lat = pos.lat;
            state.location.lng = pos.lng;
        });


        setTimeout(() => leafletMap.invalidateSize(), 200);
    }


    function boot() {
        setTimeout(load, 0);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
