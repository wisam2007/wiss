const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

let allProfiles = [];
let activeProfileId = null;

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

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

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

function resolveProfileMedia(profile) {
    let avatarUrl = 'https://via.placeholder.com/150';
    let galleryImages = [];

    if (profile.photo_url && typeof profile.photo_url === 'object') {
        avatarUrl = profile.photo_url.avatar || avatarUrl;
        galleryImages = profile.photo_url.gallery || [];
    } else if (typeof profile.photo_url === 'string' && profile.photo_url.trim() !== '') {
        try {
            const parsed = JSON.parse(profile.photo_url);
            avatarUrl = parsed.avatar || avatarUrl;
            galleryImages = parsed.gallery || [];
        } catch (e) {
            avatarUrl = profile.photo_url;
        }
    }

    return { avatarUrl, galleryImages };
}

function buildGalleryCard(profile) {
    const { avatarUrl, galleryImages } = resolveProfileMedia(profile);
    const coverImage = galleryImages.length > 0 ? galleryImages[0] : avatarUrl;
    const hasVideo = Boolean(profile.video_url && profile.video_url.trim() !== '');
    const safeName = profile.full_name || 'بدون اسم';
    const safeBio = profile.bio || 'لا توجد نبذة تعريفية.';

    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.addEventListener('click', () => openProfileModal(profile, avatarUrl, galleryImages));

    card.innerHTML = `
        <div class="card-media">
            <div class="media-badges">
                <span class="card-badge">📸 ${galleryImages.length}</span>
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
    card.querySelector('.card-media').prepend(coverImg);

    const avatarImg = document.createElement('img');
    avatarImg.src = avatarUrl;
    avatarImg.className = 'user-avatar-mini';
    avatarImg.alt = safeName;
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

async function openProfileModal(profile, avatarUrl, galleryImages) {
    activeProfileId = profile.id;

    const modalAvatar = document.getElementById('modalAvatar');
    const modalName = document.getElementById('modalName');
    const modalBio = document.getElementById('modalBio');

    if (modalAvatar) modalAvatar.src = avatarUrl;
    if (modalName) modalName.textContent = profile.full_name || 'بدون اسم';
    if (modalBio) modalBio.textContent = profile.bio || 'لا توجد نبذة تعريفية.';

    const galleryGrid = document.getElementById('modalGalleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        galleryImages.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = profile.full_name || 'صورة المعرض';
            img.addEventListener('click', () => window.open(imgUrl, '_blank'));
            galleryGrid.appendChild(img);
        });
    }

    const videoSection = document.getElementById('modalVideoSection');
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoSection && videoContainer) {
        const videoId = extractYouTubeId(profile.video_url);
        if (videoId) {
            videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
            videoSection.style.display = 'block';
        } else {
            videoSection.style.display = 'none';
        }
    }

    document.getElementById('profileModal')?.classList.add('active');

    loadReactions(profile.id);
    loadComments(profile.id);
}

function closeModal() {
    document.getElementById('profileModal')?.classList.remove('active');
    const videoContainer = document.getElementById('modalVideoContainer');
    if (videoContainer) videoContainer.innerHTML = '';
    activeProfileId = null;
}

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

function highlightActiveReaction(profileId) {
    const myType = getMyReaction(profileId);
    document.querySelectorAll('.reactions-bar .reaction-btn').forEach(btn => {
        const btnType = btn.getAttribute('data-reaction-type');
        btn.classList.toggle('active', Boolean(myType) && btnType === myType);
    });
}

function setReactionCount(type, value) {
    const el = document.getElementById(`count-${type}`);
    if (el) el.textContent = value;
}

async function loadReactions(profileId) {
    Object.keys(REACTION_COLUMN_MAP).forEach(type => setReactionCount(type, 0));

    const { data } = await supabaseClient
        .from('profile_reactions')
        .select('*')
        .eq('profile_id', profileId)
        .maybeSingle();

    if (profileId !== activeProfileId) return;

    if (data) {
        setReactionCount('like', data.likes || 0);
        setReactionCount('laugh', data.laughs || 0);
        setReactionCount('sad', data.sads || 0);
        setReactionCount('smile', data.smiles || 0);
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

    const profileId = activeProfileId;
    const allButtons = document.querySelectorAll('.reactions-bar .reaction-btn');
    allButtons.forEach(b => (b.disabled = true));

    const previousType = getMyReaction(profileId);

    try {
        if (previousType === type) {
            const newValue = await callReactionRPC('decrement_reaction', profileId, dbColumn);
            setReactionCount(type, newValue);
            setMyReaction(profileId, null);
        } else if (previousType) {
            const oldColumn = REACTION_COLUMN_MAP[previousType];
            const [oldValue, newValue] = await Promise.all([
                callReactionRPC('decrement_reaction', profileId, oldColumn),
                callReactionRPC('increment_reaction', profileId, dbColumn)
            ]);
            setReactionCount(previousType, oldValue);
            setReactionCount(type, newValue);
            setMyReaction(profileId, type);
        } else {
            const newValue = await callReactionRPC('increment_reaction', profileId, dbColumn);
            setReactionCount(type, newValue);
            setMyReaction(profileId, type);
        }

        if (profileId === activeProfileId) highlightActiveReaction(profileId);
    } catch (err) {
        console.error('خطأ في تسجيل التفاعل:', err);
        if (profileId === activeProfileId) loadReactions(profileId);
    } finally {
        allButtons.forEach(b => (b.disabled = false));
    }
}

function renderCommentItem(container, author, text) {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<strong>${escapeHTML(author)}</strong> <p>${escapeHTML(text)}</p>`;
    container.appendChild(item);
    return item;
}

async function loadComments(profileId) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    commentsList.innerHTML = '<p style="text-align:center; font-size: 0.9rem; color: var(--text-muted);">جاري تحميل التعليقات...</p>';

    const { data, error } = await supabaseClient
        .from('comments')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });

    if (profileId !== activeProfileId) return;

    commentsList.innerHTML = '';

    if (error || !data || data.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد، كن أول من يعلق!</p>';
        return;
    }

    data.forEach(comment => renderCommentItem(commentsList, comment.author_name, comment.comment_text));
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
    if (!author || !text) return;

    const profileId = activeProfileId;
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
        const { error } = await supabaseClient
            .from('comments')
            .insert([{ profile_id: profileId, author_name: author, comment_text: text }]);

        if (error) throw error;

        if (profileId === activeProfileId) {
            const commentsList = document.getElementById('commentsList');
            if (commentsList.querySelector('.no-comments')) {
                commentsList.innerHTML = '';
            }
            renderCommentItem(commentsList, author, text);
            commentsList.scrollTop = commentsList.scrollHeight;
        }

        textInput.value = '';
    } catch (err) {
        console.error('خطأ في إرسال التعليق:', err);
        alert('حدث خطأ أثناء إرسال التعليق.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProfiles();

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

    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);

    document.getElementById('profileModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') closeModal();
    });

    document.getElementById('reactionsBar')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.reaction-btn');
        if (btn) addReaction(btn.dataset.reactionType);
    });
});