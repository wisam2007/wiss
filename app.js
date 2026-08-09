// 1. تهيئة عميل Supabase وتوحيد المسمى
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.CONFIG_ANON_KEY || CONFIG.SUPABASE_ANON_KEY);

const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري إنشاء الحساب...';

    // قراءة البيانات بأمان
    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const username = document.getElementById('username')?.value.trim() || '';
    const title = document.getElementById('userTitle')?.value.trim() || 'Cohort Student';
    const bio = document.getElementById('userBio')?.value.trim() || '';
    const bgColor = document.getElementById('cardBgColor')?.value || '#ffffff';
    
    const avatarInput = document.getElementById('avatarFile');
    const avatarFile = (avatarInput && avatarInput.files) ? avatarInput.files[0] : null;

    try {
        let avatarUrl = 'https://via.placeholder.com/100'; 

        // 2. رفع الصورة فقط في حال تحديد ملف
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabaseClient
                .storage
                .from('avatars')
                .upload(filePath, avatarFile);

            if (uploadError) {
                console.warn('تنبيه أثناء رفع الصورة:', uploadError.message);
            } else {
                const { data: urlData } = supabaseClient
                    .storage
                    .from('avatars')
                    .getPublicUrl(filePath);
                
                avatarUrl = urlData.publicUrl;
            }
        }

        // 3. إدراج البيانات مع توحيد الأسماء مع العرض
        const { data, error } = await supabaseClient
            .from('profiles')
            .insert([
                {
                    full_name: fullName,
                    username: username,
                    title: title,
                    bio: bio,
                    avatar_url: avatarUrl,
                    photo_url: avatarUrl, // توحيد مسمى الصورة مع العرض
                    bg_color: bgColor,
                    is_video: false
                }
            ])
            .select();

        if (error) throw error;

        localStorage.setItem('currentUser', JSON.stringify(data[0]));
        alert('تم إنشاء البروفايل بنجاح!');
        
        // إعادة تحميل القائمة بدلاً من الانتقال الفوري للتأكد من عمله
        signupForm.reset();
        loadProfiles();

    } catch (err) {
        console.error('Error creating profile:', err);
        alert('حدث خطأ أثناء حفظ البيانات: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'إنشاء حساب';
    }
});

// 4. جلب وعرض البروفايلات
async function loadProfiles() {
    const grid = document.getElementById('profiles-grid');
    if (!grid) return;

    try {
        const { data: profiles, error } = await supabaseClient
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
            if (profile.bg_color) card.style.backgroundColor = profile.bg_color;

            const displayImg = profile.avatar_url || profile.photo_url || 'https://via.placeholder.com/100';

            card.innerHTML = `
                <img src="${displayImg}" alt="${profile.full_name}" class="profile-img" style="width:80px; height:80px; border-radius:50%; object-fit:cover;">
                <h3>${profile.full_name || profile.username || 'طالب'}</h3>
                <small>${profile.title || ''}</small>
                <p>${profile.bio || ''}</p>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("خطأ في جلب البروفايلات:", err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfiles();
});