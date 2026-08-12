// ==========================================
// 1. الإعدادات والتهيئَة (Configuration)
// ==========================================
const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

let allProfiles = [];
let activeProfileId = null;

// ==========================================
// 0. دوال مساعدة (Helpers)
// ==========================================

// تنقية أي نص مدخل من المستخدم قبل حقنه بالـ innerHTML (حماية من XSS)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

// استخراج معرّف فيديو يوتيوب من أي صيغة رابط شائعة
function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
}

// ==========================================
// 2. جلب البروفايلات وعرضها في المعرض
// ==========================================
async function fetchProfiles() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    try {
        const { data: profiles, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allProfiles = profiles || [];
        renderGalleryCards(allProfiles);
    } catch (err) {
        console.error('خطأ في جلب بيانات المعرض:', err);
        galleryGrid.innerHTML = '<p class="loading-status" style="color: #ef4444;">حدث خطأ أثناء تحميل المعرض.</p>';
    }
}

function renderGalleryCards(profilesList) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    if (profilesList.length === 0) {
        galleryGrid.innerHTML = '<p class="no-results">لم يتم العثور على أي بروفايلات مطابقة.</p>';
        return;
    }

    galleryGrid.innerHTML = '';

    profilesList.forEach(profile => {
        let avatarUrl = 'https://via.placeholder.com/150';
        let galleryImages = [];

        // photo_url هو عمود JSONB — يصل جاهزاً كـ object من supabase-js
        // لا حاجة لـ JSON.parse أبداً (كان يكسر الصور سابقاً)
        if (profile.photo_url && typeof profile.photo_url === 'object') {
            avatarUrl = profile.photo_url.avatar || avatarUrl;
            galleryImages = profile.photo_url.gallery || [];
        } else if (typeof profile.photo_url === 'string' && profile.photo_url.trim() !== '') {
            // احتياط فقط لو وصلت البيانات كنص لأي سبب (توافقية قديمة)
            try {
                const parsed = JSON.parse(profile.photo_url);
                avatarUrl = parsed.avatar || avatarUrl;
                galleryImages = parsed.gallery || [];
            } catch (e) {
                avatarUrl = profile.photo_url;
            }
        }

        const coverImage = galleryImages.length > 0 ? galleryImages[0] : avatarUrl;
        const hasVideo = Boolean(profile.video_url && profile.video_url.trim() !== '');
        const safeName = escapeHTML(profile.full_name || 'بدون اسم');
        const safeBio = escapeHTML(profile.bio || 'لا توجد نبذة تعريفية.');

        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => openProfileModal(profile, avatarUrl, galleryImages);

        card.innerHTML = `
            <div class="card-media">
                <img src="${coverImage}" alt="${safeName}" loading="lazy">
                <div class="media-badges">
                    <span class="card-badge">📸 ${galleryImages.length}</span>
                    ${hasVideo ? '<span class="card-badge video-badge">▶ فيديو</span>' : ''}
                </div>
            </div>
            <div class="card-content">
                <div class="card-user-header">
                    <img src="${avatarUrl}" class="user-avatar-mini" alt="${safeName}">
                    <h3 class="user-name">${safeName}</h3>
                </div>
                <p class="user-bio">${safeBio}</p>
            </div>
        `;

        galleryGrid.appendChild(card);
    });
}

// ==========================================
// 3. النافذة العائمة للبروفايل (Profile Modal)
// ==========================================
async function openProfileModal(profile, avatarUrl, galleryImages) {
    activeProfileId = profile.id;

    // تعبئة البيانات الأساسية بأمان دون إحداث أخطاء
    const modalAvatar = document.getElementById('modalAvatar');
    const modalName = document.getElementById('modalName');
    const modalBio = document.getElementById('modalBio');

    // استخدام textContent هنا آمن أصلاً (مو innerHTML) فلا حاجة لـ escape يدوي
    if (modalAvatar) modalAvatar.src = avatarUrl;
    if (modalName) modalName.textContent = profile.full_name || 'بدون اسم';
    if (modalBio) modalBio.textContent = profile.bio || 'لا توجد نبذة تعريفية.';

    // تعبئة معرض الصور المصغر داخل النافذة
    const galleryGrid = document.getElementById('modalGalleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        if (galleryImages.length > 0) {
            galleryImages.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = profile.full_name || 'صورة المعرض';
                img.onclick = () => window.open(imgUrl, '_blank');
                galleryGrid.appendChild(img);
            });
        }
    }

    // تعبئة فيديو اليوتيوب
    const videoSection = document.getElementById('modalVideoSection');
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoSection && videoContainer) {
        if (profile.video_url && profile.video_url.trim() !== '') {
            const videoId = extractYouTubeId(profile.video_url);
            if (videoId) {
                videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
                videoSection.style.display = 'block';
            } else {
                videoSection.style.display = 'none';
            }
        } else {
            videoSection.style.display = 'none';
        }
    }

    // إظهار النافذة العائمة
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('active');
    }

    // جلب التفاعلات والتعليقات من Supabase
    loadReactions(profile.id);
    loadComments(profile.id);
}

function closeModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('active');

    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoContainer) videoContainer.innerHTML = '';

    activeProfileId = null;
}

// ==========================================
// 4. نظام التفاعلات (Reactions System)
// نظام "تفاعل واحد فقط لكل زائر" لكل بروفايل: يُحفظ اختيار الزائر
// بالمتصفح (localStorage) عشان يقدر يبدّل رأيه أو يلغي تفاعله، لكن
// ما يقدر يضيف أكثر من تفاعل واحد بنفس الوقت لنفس البروفايل.
// ملاحظة: هذا قيد على مستوى الواجهة فقط (لا يوجد نظام تسجيل دخول)،
// فهو يمنع الاستخدام العرضي المتكرر لكن لا يمنع شخصاً متعمداً يمسح
// الـ localStorage أو يفتح متصفح ثاني.
// ==========================================

const REACTION_COLUMN_MAP = {
    like: 'likes',
    laugh: 'laughs',
    sad: 'sads',
    smile: 'smiles'
};

function getMyReactionKey(profileId) {
    return `my_reaction_profile_${profileId}`;
}

function getMyReaction(profileId) {
    return localStorage.getItem(getMyReactionKey(profileId));
}

function setMyReaction(profileId, type) {
    if (type) {
        localStorage.setItem(getMyReactionKey(profileId), type);
    } else {
        localStorage.removeItem(getMyReactionKey(profileId));
    }
}

// يبرز بصرياً الزر اللي سبق الزائر يختاره لهذا البروفايل
function highlightActiveReaction(profileId) {
    const myType = getMyReaction(profileId);
    document.querySelectorAll('.reactions-bar .reaction-btn').forEach(btn => {
        const btnType = btn.getAttribute('data-reaction-type');
        btn.classList.toggle('active', Boolean(myType) && btnType === myType);
    });
}

async function loadReactions(profileId) {
    document.getElementById('count-like').textContent = '0';
    document.getElementById('count-laugh').textContent = '0';
    document.getElementById('count-sad').textContent = '0';
    document.getElementById('count-smile').textContent = '0';

    const { data } = await supabaseClient
        .from('profile_reactions')
        .select('*')
        .eq('profile_id', profileId)
        .maybeSingle();

    if (data) {
        document.getElementById('count-like').textContent = data.likes || 0;
        document.getElementById('count-laugh').textContent = data.laughs || 0;
        document.getElementById('count-sad').textContent = data.sads || 0;
        document.getElementById('count-smile').textContent = data.smiles || 0;
    }

    highlightActiveReaction(profileId);
}

async function callReactionRPC(fnName, profileId, dbColumn) {
    const { data, error } = await supabaseClient.rpc(fnName, {
        p_profile_id: profileId,
        p_column: dbColumn
    });
    if (error) throw error;
    return data;
}

async function addReaction(type) {
    if (!activeProfileId) return;

    const dbColumn = REACTION_COLUMN_MAP[type];
    if (!dbColumn) return;

    const allButtons = document.querySelectorAll('.reactions-bar .reaction-btn');
    allButtons.forEach(b => (b.disabled = true)); // يمنع أي ضغط أثناء تنفيذ الطلب

    const previousType = getMyReaction(activeProfileId);

    try {
        if (previousType === type) {
            // نفس الزر مضغوط مرة ثانية = إلغاء التفاعل
            const newValue = await callReactionRPC('decrement_reaction', activeProfileId, dbColumn);
            document.getElementById(`count-${type}`).textContent = newValue;
            setMyReaction(activeProfileId, null);
        } else if (previousType) {
            // تبديل من تفاعل سابق إلى تفاعل جديد: إنقاص القديم وزيادة الجديد
            const oldColumn = REACTION_COLUMN_MAP[previousType];
            const [oldValue, newValue] = await Promise.all([
                callReactionRPC('decrement_reaction', activeProfileId, oldColumn),
                callReactionRPC('increment_reaction', activeProfileId, dbColumn)
            ]);
            document.getElementById(`count-${previousType}`).textContent = oldValue;
            document.getElementById(`count-${type}`).textContent = newValue;
            setMyReaction(activeProfileId, type);
        } else {
            // أول تفاعل لهذا الزائر على هذا البروفايل
            const newValue = await callReactionRPC('increment_reaction', activeProfileId, dbColumn);
            document.getElementById(`count-${type}`).textContent = newValue;
            setMyReaction(activeProfileId, type);
        }

        highlightActiveReaction(activeProfileId);
    } catch (err) {
        console.error('خطأ في تسجيل التفاعل:', err);
        // عند الفشل نعيد جلب الأعداد الحقيقية من القاعدة لتفادي عرض بيانات غير متزامنة
        loadReactions(activeProfileId);
    } finally {
        allButtons.forEach(b => (b.disabled = false));
    }
}

// ==========================================
// 5. نظام التعليقات (Comments System)
// ==========================================
async function loadComments(profileId) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '<p style="text-align:center; font-size: 0.9rem; color: var(--text-muted);">جاري تحميل التعليقات...</p>';

    const { data, error } = await supabaseClient
        .from('comments')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });

    commentsList.innerHTML = '';

    if (error || !data || data.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد، كن أول من يعلق!</p>';
        return;
    }

    data.forEach(comment => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        // استخدام escapeHTML إلزامي هنا لأن المحتوى يدخله المستخدم مباشرة (حماية XSS)
        item.innerHTML = `<strong>${escapeHTML(comment.author_name)}</strong> <p>${escapeHTML(comment.comment_text)}</p>`;
        commentsList.appendChild(item);
    });

    commentsList.scrollTop = commentsList.scrollHeight;
}

document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!activeProfileId) return;

    const authorInput = document.getElementById('commentAuthor');
    const textInput = document.getElementById('commentText');
    const submitBtn = document.querySelector('.btn-send-comment');

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (author && text) {
        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        try {
            const { error } = await supabaseClient
                .from('comments')
                .insert([{ profile_id: activeProfileId, author_name: author, comment_text: text }]);

            if (error) throw error;

            const commentsList = document.getElementById('commentsList');
            if (commentsList.querySelector('.no-comments')) {
                commentsList.innerHTML = '';
            }

            const item = document.createElement('div');
            item.className = 'comment-item';
            // نفس المعالجة هنا لتفادي XSS من نفس الجلسة
            item.innerHTML = `<strong>${escapeHTML(author)}</strong> <p>${escapeHTML(text)}</p>`;
            commentsList.appendChild(item);
            commentsList.scrollTop = commentsList.scrollHeight;

            textInput.value = '';
        } catch (err) {
            console.error('خطأ في إرسال التعليق:', err);
            alert('حدث خطأ أثناء إرسال التعليق.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال';
        }
    }
});

// ==========================================
// 6. الاستماع للأحداث والتهيئة عند التحميل
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    fetchProfiles();

    // فلترة البحث المباشر
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allProfiles.filter(p =>
            (p.full_name && p.full_name.toLowerCase().includes(query)) ||
            (p.bio && p.bio.toLowerCase().includes(query))
        );
        renderGalleryCards(filtered);
    });

    // زر الإغلاق X الخارجي
    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);

    // إغلاق النافذة عند الضغط على الخلفية الداكنة
    document.getElementById('profileModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') {
            closeModal();
        }
    });
});