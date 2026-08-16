const CONFIG_APP = Object.freeze({
    MAX_FILE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    TOTAL_STEPS: 3
});

const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;

function validateImageFile(file) {
    if (!file) return { valid: false, message: 'الملف غير موجود.' };

    if (!CONFIG_APP.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, message: `نوع الملف (${file.name}) غير مدعوم. يرجى اختيار صورة (JPG, PNG, WEBP).` };
    }

    const maxBytes = CONFIG_APP.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
        return { valid: false, message: `حجم الصورة (${file.name}) يتجاوز الحد المسموح (${CONFIG_APP.MAX_FILE_SIZE_MB} ميجابايت).` };
    }

    return { valid: true };
}

function isValidYouTubeUrl(url) {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
}

function updateProgress(stepNumber) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const percentage = Math.min((stepNumber / CONFIG_APP.TOTAL_STEPS) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', String(Math.round(percentage)));
    }
}

function validateStepOne() {
    const nameInput = document.getElementById('fullName');
    if (!nameInput || !nameInput.value.trim()) {
        alert('يرجى كتابة الاسم الكامل أولاً.');
        nameInput?.focus();
        return false;
    }
    return true;
}

function validateStepTwo() {
    const avatarInput = document.getElementById('avatarFile');
    const galleryInput = document.getElementById('galleryImages');

    const avatarFile = avatarInput?.files[0];
    if (!avatarFile) {
        alert('يرجى اختيار صورة للبروفايل (الأيقونة).');
        return false;
    }

    const avatarCheck = validateImageFile(avatarFile);
    if (!avatarCheck.valid) {
        alert(avatarCheck.message);
        return false;
    }

    const galleryFiles = galleryInput?.files ? Array.from(galleryInput.files) : [];
    if (galleryFiles.length < 1 || galleryFiles.length > 5) {
        alert(`يرجى اختيار من 1 إلى 5 صور للمعرض. (العدد الحالي: ${galleryFiles.length})`);
        return false;
    }

    for (const file of galleryFiles) {
        const check = validateImageFile(file);
        if (!check.valid) {
            alert(check.message);
            return false;
        }
    }

    return true;
}

function nextStep(currentStep) {
    if (currentStep === 1 && !validateStepOne()) return;
    if (currentStep === 2 && !validateStepTwo()) return;

    const currentStepEl = document.getElementById(`step-${currentStep}`);
    const nextStepEl = document.getElementById(`step-${currentStep + 1}`);

    if (currentStepEl && nextStepEl) {
        currentStepEl.classList.remove('active-step');
        nextStepEl.classList.add('active-step');
        updateProgress(currentStep + 1);
    }
}

function prevStep(currentStep) {
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    const prevStepEl = document.getElementById(`step-${currentStep - 1}`);

    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active-step');
        prevStepEl.classList.add('active-step');
        updateProgress(currentStep - 1);
    }
}

async function uploadFileToStorage(bucket, file) {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `profiles/${cleanFileName}`;

    const { error: uploadError } = await supabaseClient
        .storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
        throw new Error(`فشل رفع الملف (${file.name}): ${uploadError.message}`);
    }

    const { data: urlData } = supabaseClient
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

    return { url: urlData.publicUrl, path: filePath };
}

async function cleanupUploadedFiles(bucket, filePaths) {
    if (!filePaths || filePaths.length === 0) return;
    try {
        await supabaseClient.storage.from(bucket).remove(filePaths);
    } catch (e) {
        console.warn('تعذر حذف الملفات المؤقتة بعد فشل العملية:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => nextStep(Number(btn.dataset.step)));
    });
    document.querySelectorAll('[data-action="prev"]').forEach(btn => {
        btn.addEventListener('click', () => prevStep(Number(btn.dataset.step)));
    });

    signupForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const youtubeUrl = document.getElementById('youtubeUrl')?.value.trim() || '';

        if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
            alert('يرجى إدخال رابط يوتيوب صحيح.');
            document.getElementById('youtubeUrl')?.focus();
            return;
        }

        const fullName = document.getElementById('fullName')?.value.trim() || '';
        const bio = document.getElementById('userBio')?.value.trim() || '';

        const avatarFile = document.getElementById('avatarFile')?.files[0];
        const galleryFiles = document.getElementById('galleryImages')?.files
            ? Array.from(document.getElementById('galleryImages').files)
            : [];

        const uploadedPaths = [];

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري رفع الصور...';

            const avatarRes = await uploadFileToStorage('avatars', avatarFile);
            uploadedPaths.push(avatarRes.path);

            const galleryResponses = await Promise.all(
                galleryFiles.map(file => uploadFileToStorage('avatars', file))
            );

            galleryResponses.forEach(res => uploadedPaths.push(res.path));

            const photoDataPayload = {
                avatar: avatarRes.url,
                gallery: galleryResponses.map(res => res.url)
            };

            submitBtn.textContent = 'جاري حفظ البيانات...';

            const { error: dbError } = await supabaseClient
                .from('profiles')
                .insert([
                    {
                        full_name: fullName,
                        bio: bio,
                        photo_url: photoDataPayload,
                        video_url: youtubeUrl
                    }
                ]);

            if (dbError) throw dbError;

            alert('تم إنشاء البروفايل بنجاح! جاري التحويل...');
            window.location.href = 'main.html';

        } catch (err) {
            console.error('حدث خطأ أثناء الإنشاء:', err);

            if (uploadedPaths.length > 0) {
                submitBtn.textContent = 'جاري إلغاء الملفات المرفوعة...';
                await cleanupUploadedFiles('avatars', uploadedPaths);
            }

            alert('حدث خطأ أثناء الحفظ: ' + (err.message || 'خطأ غير معروف'));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'حفظ وإنشاء البروفايل';
        }
    });
});