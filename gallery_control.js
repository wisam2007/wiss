// gallery_control.js


// 1. تهيئة عميل Supabase وآلية الحصول عليه
let supabaseClient = null;


function getSupabase() {
    if (supabaseClient) return supabaseClient;
    if (window.supabaseClient) {
        supabaseClient = window.supabaseClient;
        return supabaseClient;
    }
    if (window.supabase && window.CONFIG_APP) {
        supabaseClient = window.supabase.createClient(
            window.CONFIG_APP.SUPABASE_URL,
            window.CONFIG_APP.SUPABASE_ANON_KEY
        );
        window.supabaseClient = supabaseClient;
        return supabaseClient;
    }
    return null;
}


// 2. المتغيرات العامة
let allProfiles = [];
let activeProfileId = null;
let currentUser = null;
let currentProfileData = null;


const FALLBACK_IMAGE = 'https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image';


// عناصر التحكم بالصوت
let audioEl, playBtn, playIcon, pauseIcon, songLabel, previewDisc;


// عناصر التفاعلات
const REACTION_COLUMN_MAP = { like: 'likes', laugh: 'laughs', sad: 'sads', smile: 'smiles' };
let currentReactionCounts = { likes: 0, laughs: 0, sads: 0, smiles: 0 };


// عناصر معرض الصور المكبر (Lightbox)
let lightboxImages = [];
let lightboxIndex = 0;


// 3. الدوال المساعدة
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}


// دالة تحويل مسارات الحاوية (Storage Paths) إلى رابط كامل يمنع خطأ 404
function getPublicStorageUrl(path, bucketName = 'avatars') {
    if (!path || path.trim() === '' || path === 'null') return FALLBACK_IMAGE;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;


    const client = getSupabase();
    if (!client) return FALLBACK_IMAGE;


    // تنظيف المسار من أي سلاش في البداية لتفادي أخطاء الربط
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const { data } = client.storage.from(bucketName).getPublicUrl(cleanPath);
    return data?.publicUrl || FALLBACK_IMAGE;
}


function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
}


function extractDriveFileId(url) {
    if (!url) return null;
    const dMatch = url.match(/\/d\/([^/?]+)/);
    if (dMatch) return dMatch[1];
    const idMatch = url.match(/[?&]id=([^&]+)/);
    return idMatch ? idMatch[1] : null;
}


function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}


function setPreviewAudio(audioUrl, songTitle) {
    if (!audioEl || !playBtn || !songLabel) return;
    stopAudio();
    audioEl.src = audioUrl || '';
    songLabel.textContent = songTitle || 'أغنية غير محددة';
    playBtn.hidden = !audioUrl;
}


function stopAudio() {
    if (!audioEl) return;
    audioEl.pause();
    audioEl.currentTime = 0;
    setPlayButtonState(false);
}


function setPlayButtonState(isPlaying) {
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : '';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? '' : 'none';
    if (previewDisc) previewDisc.classList.toggle('playing', isPlaying);
}


function safeLocalGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
}


function safeLocalSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}


function safeLocalRemove(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
}


// 4. التحقق من حالة تسجيل الدخول
async function checkAuthStatus() {
    const client = getSupabase();
    if (!client) return;


    try {
        const { data: { session } } = await client.auth.getSession();


        const userProfileNav = document.getElementById('userProfileNav');
        const loginLink = document.getElementById('loginLink');
        const navUserName = document.getElementById('navUserName');


        if (!session) {
            if (loginLink) loginLink.style.display = 'inline-block';
            if (userProfileNav) userProfileNav.style.display = 'none';
            return;
        }


        currentUser = session.user;


        const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();


        currentProfileData = profile;


        if (userProfileNav && navUserName) {
            navUserName.textContent = profile?.full_name || currentUser.email;
            userProfileNav.style.display = 'flex';
        }
        if (loginLink) loginLink.style.display = 'none';
    } catch (err) {
        console.error('خطأ في التحقق من تسجيل الدخول:', err);
    }
}


// 5. جلب البروفايلات من Supabase
async function fetchProfiles() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;


    const client = getSupabase();


    if (!client) {
        galleryGrid.innerHTML = `
            <div class="error-status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><path d="M12 9v4M12 17h.01"></path></svg>
                <p>لم يتم الاتصال بقاعدة البيانات.</p>
                <small>تأكد من تحميل مكتبة Supabase JS قبل config.js</small>
            </div>
        `;
        return;
    }


    try {
        const { data: profiles, error } = await client
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });


        if (error) throw error;


        allProfiles = profiles || [];
        renderGalleryCards(allProfiles);
    } catch (err) {
        console.error('خطأ في جلب بيانات المعرض:', err);
        galleryGrid.innerHTML = '<p class="loading-status" style="color: #ef4444;">حدث خطأ أثناء تحميل المعرض من القاعدة.</p>';
    }
}


// 6. معالجة الوسائط وتحويل المسارات إلى روابط شغالّة
function resolveProfileMedia(profile) {
    // جلب رابط صورة الشخصية الكامل
    const avatarUrl = getPublicStorageUrl(profile.avatar_url, 'avatars');


    // معالجة صور ألبوم المعرض وتطبيق getPublicStorageUrl على كل صورة
    const rawGallery = Array.isArray(profile.gallery) ? profile.gallery : [];
    const galleryImages = rawGallery.map(img => getPublicStorageUrl(img, 'media'));


    // معالجة خلفية البنر (لون أو تدرج أو صورة من Storage)
    let bannerStyle = profile.banner_style || '#1d4ed8';
    if (bannerStyle.endsWith('.jpg') || bannerStyle.endsWith('.jpeg') || bannerStyle.endsWith('.png') || bannerStyle.endsWith('.webp')) {
        const fullBannerUrl = getPublicStorageUrl(bannerStyle, 'media');
        bannerStyle = `url('${fullBannerUrl}') center/cover no-repeat`;
    }


    // استخراج معلومات الأغنية والتأكد من وجود رابط فعال لها
    // ملاحظة: عمود الأغنية في قاعدة البيانات هو song_url (jsonb) وليس song
    let songObj = profile.song_url;
    if (typeof songObj === 'string') {
        try { songObj = JSON.parse(songObj); } catch(e) { /* نص عادي (رابط مباشر) */ }
    }
    const rawSongUrl = (songObj && typeof songObj === 'object')
        ? (songObj.previewUrl || songObj.url)
        : songObj;
    const hasAudio = Boolean(rawSongUrl && rawSongUrl.trim() !== '' && rawSongUrl !== 'null');


    // روابط التواصل الاجتماعي — بافتراض وجود الأعمدة linkedin_url و instagram_url في جدول profiles.
    // إن كانت أسماء الأعمدة عندك مختلفة، غيّرها هنا فقط.
    const linkedinUrl = (profile.linkedin_url && profile.linkedin_url.trim() !== '') ? profile.linkedin_url.trim() : null;
    const instagramUrl = (profile.instagram_url && profile.instagram_url.trim() !== '') ? profile.instagram_url.trim() : null;


    return { avatarUrl, galleryImages, bannerStyle, hasAudio, linkedinUrl, instagramUrl };
}


function buildGalleryCard(profile) {
    const { avatarUrl, galleryImages, bannerStyle, hasAudio } = resolveProfileMedia(profile);
    const coverImage = galleryImages.length > 0 ? galleryImages[0] : avatarUrl;
    const hasVideo = Boolean(profile.video_url && profile.video_url.trim() !== '');
    const safeName = profile.full_name || 'بدون اسم';
    const safeBio = profile.bio || 'لا توجد نبذة تعريفية.';


    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.addEventListener('click', () => openProfileModal(profile, avatarUrl, galleryImages, bannerStyle));


    card.innerHTML = `
        <div class="card-media">
            <div class="media-badges">
                <span class="card-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    ${galleryImages.length}
                </span>
                ${hasAudio ? `<span class="card-badge audio-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> أغنية</span>` : ''}
                ${hasVideo ? `<span class="card-badge video-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14l11-7z"></path></svg> فيديو</span>` : ''}
            </div>
        </div>
        <div class="card-content">
            <div class="card-user-header">
                <h3 class="user-name">${escapeHTML(safeName)}</h3>
            </div>
            <p class="user-bio">${escapeHTML(safeBio)}</p>
        </div>
    `;


    const coverImg = document.createElement('img');
    coverImg.src = coverImage;
    coverImg.alt = safeName;
    coverImg.loading = 'lazy';
    coverImg.onerror = function() { this.src = FALLBACK_IMAGE; };
    card.querySelector('.card-media').prepend(coverImg);


    const avatarImg = document.createElement('img');
    avatarImg.src = avatarUrl;
    avatarImg.className = 'user-avatar-mini';
    avatarImg.alt = safeName;
    avatarImg.onerror = function() { this.src = FALLBACK_IMAGE; };
    card.querySelector('.card-user-header').prepend(avatarImg);


    return card;
}


function renderGalleryCards(profilesList) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;


    if (profilesList.length === 0) {
        galleryGrid.innerHTML = '<p class="no-results">لم يتم العثور على أي بروفايلات مطابقة.</p>';
        return;
    }


    galleryGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    profilesList.forEach(profile => fragment.appendChild(buildGalleryCard(profile)));
    galleryGrid.appendChild(fragment);
}


// ==========================================
// 7. روابط التواصل الاجتماعي داخل البروفايل
// ==========================================
function renderSocialLinks(linkedinUrl, instagramUrl) {
    const container = document.getElementById('modalSocials');
    if (!container) return;


    const links = [];


    if (linkedinUrl) {
        links.push(`
            <a class="social-link" href="${escapeHTML(linkedinUrl)}" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z"></path></svg>
            </a>
        `);
    }


    if (instagramUrl) {
        links.push(`
            <a class="social-link" href="${escapeHTML(instagramUrl)}" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"></circle></svg>
            </a>
        `);
    }


    container.innerHTML = links.join('');
}


// ==========================================
// 8. التفاعلات (Reactions) — تفاعل واحد قابل للتبديل لكل زائر
// ==========================================
function reactionStorageKey(profileId) {
    return `amala_reaction_${profileId}`;
}


function getStoredReaction(profileId) {
    return safeLocalGet(reactionStorageKey(profileId));
}


function setStoredReaction(profileId, type) {
    if (type) {
        safeLocalSet(reactionStorageKey(profileId), type);
    } else {
        safeLocalRemove(reactionStorageKey(profileId));
    }
}


function renderReactionCounts(counts) {
    const likeEl = document.getElementById('count-like');
    const laughEl = document.getElementById('count-laugh');
    const sadEl = document.getElementById('count-sad');
    const smileEl = document.getElementById('count-smile');
    if (likeEl) likeEl.textContent = counts.likes ?? 0;
    if (laughEl) laughEl.textContent = counts.laughs ?? 0;
    if (sadEl) sadEl.textContent = counts.sads ?? 0;
    if (smileEl) smileEl.textContent = counts.smiles ?? 0;
}


function highlightActiveReaction(activeType) {
    document.querySelectorAll('#reactionsBar .reaction-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-reaction-type') === activeType);
    });
}


async function fetchReactionRow(profileId) {
    const client = getSupabase();
    if (!client) return null;


    const { data, error } = await client
        .from('profile_reactions')
        .select('likes, laughs, sads, smiles')
        .eq('profile_id', profileId)
        .limit(1);


    if (error) {
        console.error('خطأ في جلب التفاعلات:', error);
        return null;
    }


    return (data && data.length > 0) ? data[0] : null;
}


async function loadReactionsForProfile(profileId) {
    const row = await fetchReactionRow(profileId);
    currentReactionCounts = row || { likes: 0, laughs: 0, sads: 0, smiles: 0 };
    renderReactionCounts(currentReactionCounts);
    highlightActiveReaction(getStoredReaction(profileId));
}


async function handleReactionClick(type) {
    if (!activeProfileId) return;
    const client = getSupabase();
    if (!client) return;


    const column = REACTION_COLUMN_MAP[type];
    if (!column) return;


    const previousType = getStoredReaction(activeProfileId);
    const reactionButtons = document.querySelectorAll('#reactionsBar .reaction-btn');
    reactionButtons.forEach(btn => btn.disabled = true);


    try {
        const existingRow = await fetchReactionRow(activeProfileId);
        const counts = existingRow
            ? { ...existingRow }
            : { likes: 0, laughs: 0, sads: 0, smiles: 0 };


        if (previousType === type) {
            // نفس التفاعل الحالي: إزالته
            counts[column] = Math.max(0, (counts[column] || 0) - 1);
            setStoredReaction(activeProfileId, null);
        } else {
            // تفاعل جديد أو تبديل من تفاعل آخر
            if (previousType && REACTION_COLUMN_MAP[previousType]) {
                const prevColumn = REACTION_COLUMN_MAP[previousType];
                counts[prevColumn] = Math.max(0, (counts[prevColumn] || 0) - 1);
            }
            counts[column] = (counts[column] || 0) + 1;
            setStoredReaction(activeProfileId, type);
        }


        if (existingRow) {
            const { error } = await client
                .from('profile_reactions')
                .update(counts)
                .eq('profile_id', activeProfileId);
            if (error) throw error;
        } else {
            const { error } = await client
                .from('profile_reactions')
                .insert([{ profile_id: activeProfileId, ...counts }]);
            if (error) throw error;
        }


        currentReactionCounts = counts;
        renderReactionCounts(counts);
        highlightActiveReaction(getStoredReaction(activeProfileId));
    } catch (err) {
        console.error('خطأ في تحديث التفاعل:', err);
    } finally {
        reactionButtons.forEach(btn => btn.disabled = false);
    }
}


// ==========================================
// 9. التعليقات — مجهولة، الاسم اختياري
// ==========================================
function renderComments(comments) {
    const list = document.getElementById('commentsList');
    if (!list) return;


    if (!comments || comments.length === 0) {
        list.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد، كن أول من يعلق!</p>';
        return;
    }


    list.innerHTML = comments.map(c => `
        <div class="comment-item">
            <strong>${escapeHTML(c.author_name && c.author_name.trim() !== '' ? c.author_name : 'زائر مجهول')}</strong>
            <p>${escapeHTML(c.comment_text || '')}</p>
        </div>
    `).join('');
}


async function fetchComments(profileId) {
    const client = getSupabase();
    if (!client) return [];


    const { data, error } = await client
        .from('comments')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });


    if (error) {
        console.error('خطأ في جلب التعليقات:', error);
        return [];
    }


    return data || [];
}


async function loadCommentsForProfile(profileId) {
    const list = document.getElementById('commentsList');
    if (list) list.innerHTML = '<p class="no-comments">جاري تحميل التعليقات...</p>';
    const comments = await fetchComments(profileId);
    renderComments(comments);
}


async function submitComment(profileId, authorName, commentText) {
    const client = getSupabase();
    if (!client) return false;


    const { error } = await client
        .from('comments')
        .insert([{
            profile_id: profileId,
            author_name: authorName && authorName.trim() !== '' ? authorName.trim() : null,
            comment_text: commentText.trim()
        }]);


    if (error) {
        console.error('خطأ في إرسال التعليق:', error);
        return false;
    }
    return true;
}


// ==========================================
// 10. نافذة تكبير الصور (Lightbox)
// ==========================================
function updateLightboxImage() {
    const img = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');
    if (!img || lightboxImages.length === 0) return;


    img.src = lightboxImages[lightboxIndex];
    if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;


    const multiple = lightboxImages.length > 1;
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.style.display = multiple ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = multiple ? 'flex' : 'none';
}


function openLightbox(images, startIndex) {
    if (!images || images.length === 0) return;
    lightboxImages = images;
    lightboxIndex = startIndex || 0;
    updateLightboxImage();
    document.getElementById('lightboxOverlay')?.classList.add('active');
}


function closeLightbox() {
    document.getElementById('lightboxOverlay')?.classList.remove('active');
}


function lightboxStep(direction) {
    if (lightboxImages.length === 0) return;
    lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}


// 11. النافذة المنبثقة (Modal)
async function openProfileModal(profile, avatarUrl, galleryImages, bannerStyle) {
    if (!profile || !profile.id) return;
    activeProfileId = profile.id;


    const modalAvatar = document.getElementById('modalAvatar');
    const modalName = document.getElementById('modalName');
    const modalBio = document.getElementById('modalBio');
    const modalBanner = document.getElementById('modalBanner');


    if (modalBanner) {
        if (bannerStyle.startsWith('url') || bannerStyle.startsWith('linear-gradient') || bannerStyle.startsWith('#')) {
            modalBanner.style.background = bannerStyle;
        } else {
            modalBanner.style.background = '#1d4ed8';
        }
    }


    if (modalAvatar) {
        modalAvatar.src = avatarUrl;
        modalAvatar.onerror = function() { this.src = FALLBACK_IMAGE; };
    }
    if (modalName) modalName.textContent = profile.full_name || 'بدون اسم';
    if (modalBio) modalBio.textContent = profile.bio || 'لا توجد نبذة تعريفية.';


    // روابط التواصل
    const { linkedinUrl, instagramUrl } = resolveProfileMedia(profile);
    renderSocialLinks(linkedinUrl, instagramUrl);


    // معالجة وحل مشكلة عدم ظهور الأغنية
    const audioSection = document.getElementById('modalAudioSection');
    if (audioSection) {
        let songObj = profile.song_url;


        if (typeof songObj === 'string') {
            try { songObj = JSON.parse(songObj); } catch(e) { /* نص عادي (رابط مباشر) */ }
        }


        let rawSongUrl = (songObj && typeof songObj === 'object')
            ? (songObj.previewUrl || songObj.url)
            : songObj;
        let finalSongUrl = '';


        if (rawSongUrl) {
            finalSongUrl = getPublicStorageUrl(rawSongUrl, 'media');
        }


        if (finalSongUrl && finalSongUrl !== FALLBACK_IMAGE) {
            const label = songObj?.title
                ? (songObj.artist ? `${songObj.title} — ${songObj.artist}` : songObj.title)
                : 'أغنية مختارة';
            setPreviewAudio(finalSongUrl, label);
            audioSection.style.display = 'block';
        } else {
            setPreviewAudio('', '');
            audioSection.style.display = 'none';
        }
    }


    // عرض ألبوم الصور + ربطها بنافذة التكبير
    const modalGalleryGrid = document.getElementById('modalGalleryGrid');
    if (modalGalleryGrid) {
        modalGalleryGrid.innerHTML = '';
        galleryImages.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = profile.full_name || 'صورة المعرض';
            img.onerror = function() { this.src = FALLBACK_IMAGE; };
            img.addEventListener('click', () => openLightbox(galleryImages, index));
            modalGalleryGrid.appendChild(img);
        });
    }


    // الفيديو
    const videoSection = document.getElementById('modalVideoSection');
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoSection && videoContainer) {
        videoContainer.innerHTML = '';


        if (profile.video_type === 'drive' && profile.video_url) {
            const driveId = extractDriveFileId(profile.video_url);
            if (driveId) {
                videoContainer.innerHTML = `<iframe src="https://drive.google.com/file/d/${driveId}/preview" allow="autoplay" allowfullscreen></iframe>`;
                videoSection.style.display = 'block';
            } else {
                videoSection.style.display = 'none';
            }
        } else {
            const videoId = extractYouTubeId(profile.video_url);
            if (videoId) {
                videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
                videoSection.style.display = 'block';
            } else {
                videoSection.style.display = 'none';
            }
        }
    }


    // التفاعلات والتعليقات الخاصة بهذا البروفايل
    await loadReactionsForProfile(profile.id);
    await loadCommentsForProfile(profile.id);


    document.getElementById('profileModal')?.classList.add('active');
}


function closeModal() {
    document.getElementById('profileModal')?.classList.remove('active');
    stopAudio();
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoContainer) videoContainer.innerHTML = '';
    activeProfileId = null;
}


// 12. تشغيل السكربت بعد اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    // تهيئة الصوت
    audioEl = document.getElementById('previewAudioEl');
    playBtn = document.getElementById('discPlayBtn');
    playIcon = playBtn ? playBtn.querySelector('.play-icon') : null;
    pauseIcon = playBtn ? playBtn.querySelector('.pause-icon') : null;
    songLabel = document.getElementById('previewSong');
    previewDisc = document.getElementById('previewDisc');


    if (playBtn && audioEl) {
        playBtn.addEventListener('click', () => {
            if (!audioEl.src) return;
            if (audioEl.paused) {
                audioEl.play().then(() => {
                    setPlayButtonState(true);
                }).catch(err => console.error('خطأ تشغيل الصوت:', err));
            } else {
                audioEl.pause();
                setPlayButtonState(false);
            }
        });
    }


    if (audioEl) {
        audioEl.addEventListener('ended', () => setPlayButtonState(false));
    }


    // جلب البيانات والتحقق
    await checkAuthStatus();
    await fetchProfiles();


    // إعداد البحث
    const handleSearch = debounce((query) => {
        const filtered = allProfiles.filter(p =>
            (p.full_name && p.full_name.toLowerCase().includes(query)) ||
            (p.bio && p.bio.toLowerCase().includes(query))
        );
        renderGalleryCards(filtered);
    }, 250);


    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        handleSearch(e.target.value.toLowerCase().trim());
    });


    // أحداث الإغلاق والخروج من البروفايل
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    document.getElementById('profileModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') closeModal();
    });


    // أزرار التفاعلات
    document.getElementById('reactionsBar')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.reaction-btn');
        if (!btn) return;
        handleReactionClick(btn.getAttribute('data-reaction-type'));
    });


    // نموذج التعليقات (مجهول، الاسم اختياري)
    const commentForm = document.getElementById('commentForm');
    commentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!activeProfileId) return;


        const authorInput = document.getElementById('commentAuthor');
        const textInput = document.getElementById('commentText');
        const submitBtn = commentForm.querySelector('.btn-send-comment');
        const text = textInput ? textInput.value.trim() : '';
        if (!text) return;


        if (submitBtn) submitBtn.disabled = true;


        const ok = await submitComment(activeProfileId, authorInput ? authorInput.value : '', text);


        if (ok) {
            if (textInput) textInput.value = '';
            if (authorInput) authorInput.value = '';
            await loadCommentsForProfile(activeProfileId);
        }


        if (submitBtn) submitBtn.disabled = false;
    });


    // نافذة تكبير الصور (Lightbox)
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev')?.addEventListener('click', () => lightboxStep(-1));
    document.getElementById('lightboxNext')?.addEventListener('click', () => lightboxStep(1));
    document.getElementById('lightboxOverlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'lightboxOverlay') closeLightbox();
    });


    // اختصارات لوحة المفاتيح: Escape يغلق أعلى نافذة مفتوحة، الأسهم تتنقل بين الصور
    document.addEventListener('keydown', (e) => {
        const lightboxOpen = document.getElementById('lightboxOverlay')?.classList.contains('active');
        if (e.key === 'Escape') {
            if (lightboxOpen) {
                closeLightbox();
            } else {
                closeModal();
            }
        } else if (lightboxOpen && e.key === 'ArrowLeft') {
            lightboxStep(document.documentElement.dir === 'rtl' ? 1 : -1);
        } else if (lightboxOpen && e.key === 'ArrowRight') {
            lightboxStep(document.documentElement.dir === 'rtl' ? -1 : 1);
        }
    });


    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        const client = getSupabase();
        if (client) await client.auth.signOut();
        window.location.href = 'log_in.html';
    });
});