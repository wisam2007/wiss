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
let audioEl, playBtn, songLabel, previewDisc;


// 3. الدوال المساعدة
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}


function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
}


function extractDriveFileId(url) {
    if (!url) return null;
    // يدعم صيغتي الرابط الشائعتين لملفات Google Drive:
    // .../file/d/FILE_ID/view  و  ...?id=FILE_ID
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
    if (playBtn) playBtn.innerText = '▶';
    if (previewDisc) previewDisc.classList.remove('playing');
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
            <div style="text-align: center; color: #ef4444; padding: 20px;">
                <p>⚠️ لم يتم الاتصال بقاعدة البيانات.</p>
                <small>تأكد من تحميل مكتبة Supabase JS (script src) قبل config.js في &lt;head&gt;، ومن صحة القيم داخل ملف <b>config.js</b></small>
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


// 6. معالجة الصور وبناء بطاقات العرض
// ملاحظة: تم تعديل هذه الدالة لتقرأ الأعمدة كما يكتبها فعلياً نموذج التسجيل
// (avatar_url كنص مباشر، gallery كمصفوفة روابط) بدل عمود photo_url الذي لا وجود له
// في الـ payload المُرسَل من صفحة إنشاء البروفايل.
function resolveProfileMedia(profile) {
    const avatarUrl = profile.avatar_url || FALLBACK_IMAGE;
    const galleryImages = Array.isArray(profile.gallery) ? profile.gallery : [];
    return { avatarUrl, galleryImages };
}


function buildGalleryCard(profile) {
    const { avatarUrl, galleryImages } = resolveProfileMedia(profile);
    const coverImage = galleryImages.length > 0 ? galleryImages[0] : avatarUrl;
    const hasVideo = Boolean(profile.video_url && profile.video_url.trim() !== '');
    // song يُخزَّن ككائن JSON من نموذج التسجيل: { title, artist, artwork, previewUrl }
    const hasAudio = Boolean(profile.song && profile.song.previewUrl);
    const safeName = profile.full_name || 'بدون اسم';
    const safeBio = profile.bio || 'لا توجد نبذة تعريفية.';


    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.addEventListener('click', () => openProfileModal(profile, avatarUrl, galleryImages));


    card.innerHTML = `
        <div class="card-media">
            <div class="media-badges">
                <span class="card-badge">📸 ${galleryImages.length}</span>
                ${hasAudio ? '<span class="card-badge audio-badge">🎵 أغنية</span>' : ''}
                ${hasVideo ? '<span class="card-badge video-badge">▶ فيديو</span>' : ''}
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


// 7. النافذة المنبثقة (Modal)
async function openProfileModal(profile, avatarUrl, galleryImages) {
    if (!profile || !profile.id) return;
    activeProfileId = profile.id;


    const modalAvatar = document.getElementById('modalAvatar');
    const modalName = document.getElementById('modalName');
    const modalBio = document.getElementById('modalBio');


    if (modalAvatar) {
        modalAvatar.src = avatarUrl;
        modalAvatar.onerror = function() { this.src = FALLBACK_IMAGE; };
    }
    if (modalName) modalName.textContent = profile.full_name || 'بدون اسم';
    if (modalBio) modalBio.textContent = profile.bio || 'لا توجد نبذة تعريفية.';


    // الأغنية مخزّنة ككائن JSON (title, artist, artwork, previewUrl) وليس كعمودين منفصلين
    const audioSection = document.getElementById('modalAudioSection');
    if (audioSection) {
        if (profile.song && profile.song.previewUrl) {
            const label = profile.song.artist
                ? `${profile.song.title} — ${profile.song.artist}`
                : (profile.song.title || 'أغنية مختارة');
            setPreviewAudio(profile.song.previewUrl, label);
            audioSection.style.display = 'block';
        } else {
            setPreviewAudio('', '');
            audioSection.style.display = 'none';
        }
    }


    const galleryGrid = document.getElementById('modalGalleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        galleryImages.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = profile.full_name || 'صورة المعرض';
            img.onerror = function() { this.src = FALLBACK_IMAGE; };
            img.addEventListener('click', () => window.open(imgUrl, '_blank'));
            galleryGrid.appendChild(img);
        });
    }


    // الفيديو: يدعم الآن يوتيوب وGoogle Drive حسب video_type المخزّن مع البروفايل
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


    document.getElementById('profileModal')?.classList.add('active');
}


function closeModal() {
    document.getElementById('profileModal')?.classList.remove('active');
    stopAudio();
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoContainer) videoContainer.innerHTML = '';
    activeProfileId = null;
}


// 8. تشغيل السكربت بعد اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    // تهيئة الصوت
    audioEl = document.getElementById('previewAudioEl');
    playBtn = document.getElementById('discPlayBtn');
    songLabel = document.getElementById('previewSong');
    previewDisc = document.getElementById('previewDisc');


    if (playBtn && audioEl) {
        playBtn.addEventListener('click', () => {
            if (!audioEl.src) return;
            if (audioEl.paused) {
                audioEl.play().then(() => {
                    playBtn.innerText = '⏸';
                    if (previewDisc) previewDisc.classList.add('playing');
                });
            } else {
                audioEl.pause();
                playBtn.innerText = '▶';
                if (previewDisc) previewDisc.classList.remove('playing');
            }
        });
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


    // أحداث الإغلاق والخروج
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    document.getElementById('profileModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        const client = getSupabase();
        if (client) await client.auth.signOut();
        window.location.href = 'log_in.html';
    });
});