document.addEventListener('DOMContentLoaded', () => {
    // User Session Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const fabBtn = document.getElementById('openModalBtn');

    if (currentUser && fabBtn) {
        fabBtn.style.display = 'block';
    }

    // Character Counters
    const userNameInput = document.getElementById('userName');
    const nameCounter = document.getElementById('nameCounter');
    userNameInput?.addEventListener('input', () => {
        nameCounter.textContent = `${userNameInput.value.length}/12`;
    });

    const memoryBioInput = document.getElementById('memoryBio');
    const bioCounter = document.getElementById('bioCounter');
    memoryBioInput?.addEventListener('input', () => {
        bioCounter.textContent = `${memoryBioInput.value.length}/100`;
    });

    // Modal Controls
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    if (fabBtn) fabBtn.onclick = () => modal.style.display = 'flex';
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.addEventListener('click', (e) => { 
        if (e.target === modal) modal.style.display = 'none'; 
    });

    // Gallery Render Logic
    const galleryGrid = document.getElementById('galleryGrid');
    const initialMemories = [
        { name: 'Alex Johnson', title: 'First Day at Cohort', bio: 'An unforgettable moment from our very first orientation day.', avatarUrl: 'https://via.placeholder.com/100', mediaUrl: 'https://via.placeholder.com/400x300', isVideo: false, bgColor: '#ffffff' },
        { name: 'Sarah Miller', title: 'Group Project Milestone', bio: 'Celebrating the completion of our second major group deliverable.', avatarUrl: 'https://via.placeholder.com/100', mediaUrl: 'https://via.placeholder.com/400x300', isVideo: false, bgColor: '#ffffff' }
    ];

    function getStoredMemories() {
        return JSON.parse(localStorage.getItem('savedMemories')) || initialMemories;
    }

    function renderCards(memoriesToRender) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        memoriesToRender.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            if (cardData.bgColor) card.style.backgroundColor = cardData.bgColor;

            card.innerHTML = `
                <div class="card-image">
                    ${cardData.isVideo 
                        ? `<video src="${cardData.mediaUrl}" controls></video>` 
                        : `<img src="${cardData.mediaUrl}" alt="Memory Image">`}
                </div>
                <div class="card-content">
                    <div class="card-user-info" style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <img src="${cardData.avatarUrl}" alt="${cardData.name}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
                        <div>
                            <h4 style="margin:0; font-size:0.9rem;">${cardData.name}</h4>
                            <span class="card-badge" data-i18n="badge_author">Author</span>
                        </div>
                    </div>
                    <h3>${cardData.title}</h3>
                    <p class="description" style="font-size: 0.85rem; margin-top: 5px; opacity: 0.8;">${cardData.bio}</p>
                </div>
            `;
            galleryGrid.appendChild(card);
        });

        // إعادة تطبيق الترجمات بعد رندر البطاقات الديناميكية
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
        }
    }

    renderCards(getStoredMemories());

    // Search Logic
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const allMemories = getStoredMemories();
        const filtered = allMemories.filter(m => 
            m.name.toLowerCase().includes(query) || 
            m.title.toLowerCase().includes(query) ||
            m.bio.toLowerCase().includes(query)
        );
        renderCards(filtered);
    });

    // Memory Publish Form
    const memoryForm = document.getElementById('memoryForm');
    const fileToBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    memoryForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = userNameInput.value;
        const title = document.getElementById('memoryTitle').value;
        const bio = memoryBioInput.value;
        const bgColor = document.getElementById('cardBgColor').value;
        const avatarFile = document.getElementById('userAvatar').files[0];
        const mediaFiles = document.getElementById('mediaFiles').files;

        if (mediaFiles.length > 3) {
            alert("You can only upload a maximum of 3 media files.");
            return;
        }

        try {
            const avatarUrl = await fileToBase64(avatarFile);
            const mediaUrl = await fileToBase64(mediaFiles[0]);
            const isVideo = mediaFiles[0].type.startsWith('video');

            const newMemory = { name, title, bio, avatarUrl, mediaUrl, isVideo, bgColor };

            const currentMemories = getStoredMemories();
            currentMemories.unshift(newMemory);
            localStorage.setItem('savedMemories', JSON.stringify(currentMemories));

            renderCards(currentMemories);

            memoryForm.reset();
            if (nameCounter) nameCounter.textContent = '0/12';
            if (bioCounter) bioCounter.textContent = '0/100';
            modal.style.display = 'none';
        } catch (err) {
            alert("Failed to process images. Please try smaller files.");
        }
    });
    // دالة جلب البروفايلات من Supabase
async function fetchProfilesFromSupabase() {
    try {
        // supabaseClient هو العميل المعرّف لديك في config.js / main_control.js
        const { data: profiles, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false }); // ترتيب الحسابات من الأحدث للأقدم

        if (error) throw error;

        // تحويل بيانات Supabase إلى الهيكل المستخدم في بطاقات المعرض
        const formattedMemories = profiles.map(profile => ({
            id: profile.id,
            name: profile.full_name || profile.username || 'Anonymous',
            title: profile.title || 'Cohort Student',
            bio: profile.bio || 'No bio provided.',
            avatarUrl: profile.avatar_url || 'https://via.placeholder.com/100',
            mediaUrl: profile.media_url || profile.avatar_url || 'https://via.placeholder.com/400x300',
            isVideo: profile.is_video || false,
            bgColor: profile.bg_color || '#ffffff'
        }));

        renderCards(formattedMemories);
    } catch (err) {
        console.error('Error fetching profiles:', err.message);
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchProfilesFromSupabase();
});
});