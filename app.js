// app.js - إدارة المنطق البرمجي للموقع

// 1. دالة رفع وسائط الميديا إلى Cloudinary
async function uploadMediaToCloudinary(file) {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const resourceType = file.type.startsWith('video') ? 'video' : 'image';

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
            { method: 'POST', body: formData }
        );
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("خطأ في رفع الملف لـ Cloudinary:", error);
        alert("حدث خطأ أثناء رفع الملف، حاول مرة أخرى.");
        return null;
    }
}

// 2. تحميل وعرض البروفايلات في الصفحة الرئيسية
async function loadProfiles() {
    const grid = document.getElementById('profiles-grid');
    if (!grid) return;

    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        grid.innerHTML = '';

        if (!profiles || profiles.length === 0) {
            grid.innerHTML = '<p class="no-data">لا توجد بروفايلات متاحة حالياً.</p>';
            return;
        }

        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `
                ${profile.photo_url ? `<img src="${profile.photo_url}" alt="${profile.full_name}" class="profile-img">` : ''}
                <h3>${profile.full_name || 'طالب'}</h3>
                <p>${profile.bio || ''}</p>
                ${profile.video_url ? `<video src="${profile.video_url}" controls class="profile-video"></video>` : ''}
                <div class="comments-section" id="comments-${profile.id}">
                    <h4>التعليقات:</h4>
                    <div class="comments-list" id="list-${profile.id}">جاري تحميل التعليقات...</div>
                    <form onsubmit="addComment(event, '${profile.id}')" class="comment-form">
                        <input type="text" placeholder="اسمك" required class="input-name">
                        <input type="text" placeholder="اكتب تعليقك..." required class="input-text">
                        <button type="submit">إرسال</button>
                    </form>
                </div>
            `;
            grid.appendChild(card);
            loadComments(profile.id);
        });
    } catch (err) {
        console.error("خطأ في جلب البروفايلات:", err.message);
    }
}

// 3. جلب التعليقات الخاصة بروفايل معين
async function loadComments(profileId) {
    const container = document.getElementById(`list-${profileId}`);
    if (!container) return;

    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });

    if (error) {
        container.innerHTML = '<p class="error">تعذر تحميل التعليقات.</p>';
        return;
    }

    if (!comments || comments.length === 0) {
        container.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد.</p>';
        return;
    }

    container.innerHTML = comments.map(c => `
        <div class="comment-item">
            <strong>${c.visitor_name}:</strong> <span>${c.comment_text}</span>
        </div>
    `).join('');
}

// 4. إضافة تعليق جديد لزائر
async function addComment(event, profileId) {
    event.preventDefault();
    const form = event.target;
    const visitorName = form.querySelector('.input-name').value;
    const commentText = form.querySelector('.input-text').value;

    const { error } = await supabase
        .from('comments')
        .insert([
            { profile_id: profileId, visitor_name: visitorName, comment_text: commentText }
        ]);

    if (error) {
        alert("فشل إضافة التعليق: " + error.message);
    } else {
        form.reset();
        loadComments(profileId);
    }
}

// تشغيل جلب البيانات فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadProfiles();
});