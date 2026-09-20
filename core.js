/* ============================================================
   core.js — Unified application script
   ============================================================ */
(function () {
    'use strict';

    /* ============================================================
       1) CONFIG
       ============================================================ */
    window.CONFIG_APP = {
        SUPABASE_URL: 'https://scomyankrwvlquopqrxk.supabase.co',
        SUPABASE_ANON_KEY: 'sb_publishable_nS3vXoEQABjfyRNSfHYpKQ_RLQPYdIX',
        MAX_IMAGE_MB: 5,
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        TOTAL_STEPS: 4,
        DRAFT_KEY: 'amala_profile_draft'
    };


    /* ============================================================
       2) SUPABASE CLIENT
       ============================================================ */
    window.getSupabaseClient = function () {
        if (window.supabaseClient) return window.supabaseClient;
        if (!window.supabase || !window.supabase.createClient) {
            console.error('[getSupabaseClient] Supabase library not loaded. Check the <script> tag in HTML.');
            return null;
        }


        const url = window.CONFIG_APP.SUPABASE_URL;
        const key = window.CONFIG_APP.SUPABASE_ANON_KEY;


        if (!url || !key || key.includes('ضع هنا')) {
            console.error('[getSupabaseClient] Missing Supabase URL or publishable key.');
            return null;
        }


        const keyLooksValid = key.startsWith('sb_publishable_') || key.startsWith('eyJ');
        if (!keyLooksValid) {
            console.error('[getSupabaseClient] Invalid key format. Expected sb_publishable_... or eyJ...');
            return null;
        }


        window.supabaseClient = window.supabase.createClient(url, key);
        return window.supabaseClient;
    };


    /* ============================================================
       3) HELPERS
       ============================================================ */
    function safeGetItem(key, fallback) {
        try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
    }
    function safeSetItem(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }
    function safeRemoveItem(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }


    function buildSocialUrl(value, platform) {
        if (!value) return null;
        const v = String(value).trim();
        if (!v || v === 'null') return null;
        if (/^https?:\/\//i.test(v)) return v;
        const username = v.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
        if (!username) return null;
        if (platform === 'instagram') return `https://instagram.com/${username}`;
        if (platform === 'linkedin')  return `https://linkedin.com/in/${username}`;
        return null;
    }
    window.buildSocialUrl = buildSocialUrl;


    /* ---------- Storage URL resolver (global) ---------- */
    const FALLBACK_IMAGE = 'https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image';


    function getPublicStorageUrl(path, bucketName = 'avatars') {
        if (!path || String(path).trim() === '' || path === 'null') return FALLBACK_IMAGE;
        if (/^https?:\/\//i.test(path) || String(path).startsWith('data:')) return path;


        const client = window.getSupabaseClient();
        if (!client) return FALLBACK_IMAGE;


        const cleanPath = String(path).startsWith('/') ? String(path).substring(1) : String(path);


        // Always use plain public URL — image transformations are a paid feature
        const { data } = client.storage.from(bucketName).getPublicUrl(cleanPath);
        const publicUrl = data?.publicUrl || '';


        if (publicUrl && /^https?:\/\//i.test(publicUrl)) return publicUrl;


        // Fallback: build URL manually
        const base = window.CONFIG_APP.SUPABASE_URL;
        return `${base}/storage/v1/object/public/${bucketName}/${cleanPath}`;
    }
    window.getPublicStorageUrl = getPublicStorageUrl;


    /* ============================================================
       4) TRANSLATIONS
       ============================================================ */
    const translations = {
        en: {
            nav_main: 'Main', nav_global_map: 'Global Map', nav_sitemap: 'Site Map',
            nav_gallery: 'Gallery', nav_about: 'About Us',
            beta_badge: 'Beta',
            auth_signin: 'Sign in',
            auth_edit: 'Edit my profile',
            auth_signout: 'Sign out',


            gallery_title: 'Our Memory Gallery',
            gallery_desc: 'Explore all the beautiful moments shared by our cohort.',
            search_placeholder: 'Search by name or bio...',
            modal_song_title: 'Favorite song',
            modal_gallery_title: 'Photo gallery',
            modal_video_title: 'Videos',
            modal_reactions_title: 'Reactions',
            modal_reactions_hint: 'One reaction per visitor — tap another to switch, or tap your current one to remove it.',
            modal_comments_title: 'Comments',
            comments_empty: 'No comments yet. Be the first to comment!',
            comments_loading: 'Loading comments...',
            comment_author_placeholder: 'Your name (optional)',
            comment_text_placeholder: 'Write your comment here...',
            comment_send: 'Send',
            logout: 'Sign out',
            edit_profile: '✎ Edit profile',
            delete_profile: '🗑 Delete profile',
            login_link: 'Sign in',
            loading_gallery: 'Loading profiles...',
            no_results: 'No matching profiles found.',


            hero_title: 'Cohort 8 — Grade 2: The Learning Journey',
            hero_desc: 'A documentation platform dedicated to showcasing the experiences of Cohort 8, Grade 2 students in the Amala educational program. Here we gather the leading hands-on initiatives, field photos, and inspiring moments that shaped our learning path and strengthened our community impact.',
            hero_cta: 'Browse the gallery and write your message',
            detail_1: 'Cohort &amp; Grade: Cohort 8 | Grade 2',
            detail_2: 'Platform: An interactive digital documentation gallery',
            detail_3: 'Program: Amala Educational Program (Amala GSD)',
            detail_4: 'Highlights: Graduation projects, cohort photos &amp; memories',
            location_title: 'Where do we learn?',
            location_desc: 'A map showing the center and the rooms where we held cohort sessions and hands-on workshops.',
            location_label_1: 'Location',
            location_value_1: 'Amala Center / Jabal Al-Weibdeh',
            location_label_2: 'Learning environment',
            location_value_2: 'Group and individual field activities',
           memories_title: 'Our memories',
            memory_1_title: 'Cohort 8 opening — Class 2',
            memory_1_desc: 'Our first group photo, marking the opening of Cohort 8, Class 2.',
            memory_2_title: 'Farewell to our facilitators',
            memory_2_desc: 'A farewell party honoring our facilitators Abdel-Hamid and Waqar.',
            memory_3_title: 'Last session together',
            memory_3_desc: 'A group photo to remember our last class together - coming soon!',
            memory_4_title: 'Graduation',
            memory_4_desc: 'Our graduation photo — coming soon, once we cross the finish line.',
            teachers_title: 'Our teachers',
            quote_waqar: '"Persisting in learning and leadership is the first step toward real change."',
            quote_abdelhamid: '"Thank you all — we\'re proud of what you achieved on this learning journey."',
            quote_common: '"Thank you all"',
            scroll_cue: 'Keep scrolling',
            footer_link_1: "Amala's Official Page",
            footer_link_2: 'Portfolio Gallery',
            footer_link_3: 'Terms &amp; Privacy',
            footer_link_4: 'Social Media',
            footer_text: '© 2026 All rights reserved for Amala Educational Program - this page was coded by <b>Wisam Appsas</b>',


            about_eyebrow: 'Cohort 8th',
            about_headline: 'Our Story, Our Journey',
            about_quote: "Every batch leaves a mark. Here's a look at where we came from, what we believe in, and the people who made this journey possible.",
            who_title: 'Who We Are',
            who_desc: 'Amala GSD is a community education program launched in 2024 to support young people in Jordan through an intensive 8-month learning track focused on practical skills, leadership, and design thinking, connecting learners to a vibrant professional community.',
            stat_students_t: '120+ students',
            stat_students_d: 'Graduated from previous cohorts across multiple tracks.',
            stat_cohorts_t: '8 cohorts',
            stat_cohorts_d: 'A new cohort every 6 months, with a curriculum that evolves each generation.',
            stat_mentors_t: '30+ mentors',
            stat_mentors_d: 'From professionals and academics in the Jordanian and Arab market.',
            vision_intro_highlight: 'Amala GSD',
            vision_intro: 'Amala GSD was built on a simple idea: give young people the tools and the community to grow, together.',
            vision_1_title: 'Our Mission',
            vision_1_desc: 'To equip the eighth cohort with practical skills, mentorship, and a genuine sense of belonging.',
            vision_2_title: 'Our Vision',
            vision_2_desc: "A generation of learners who lift each other up and carry what they've learned into their communities.",
            vision_3_title: 'Our Values',
            vision_3_desc: 'Collaboration, curiosity, and gratitude — the same values that shaped every session of this program.',
            journey_title: 'The Journey So Far',
            journey_text: "From our first day together to the memories captured on this wall, cohort eight has grown closer with every challenge, every project, and every late-night conversation. This page is a small piece of that story — the rest lives in what we carry forward.",
            thanks_title: 'A Word of Thanks to Our Teachers',
            thanks_desc: 'None of this would have been possible without the people who guided us, challenged us, and believed in us from day one.',
            thanks_msg_1: 'Thank you for your patience and for pushing us to be better every single session.',
            thanks_msg_2: 'Thank you for the guidance and support that made this journey feel possible.',


            edit_page_title: 'Edit Profile',
            edit_page_desc: 'Choose a section to open and edit. Each section saves independently.',
            section_identity: 'Identity',
            section_location: 'Location',
            section_social: 'Social Links',
            section_avatar: 'Profile Picture',
            section_banner: 'Banner',
            section_song: 'Song',
            section_gallery: 'Photo Gallery',
            section_video: 'Videos',
            lbl_full_name: 'Full Name *',
            lbl_role: 'Role *',
            role_student: 'Cohort student',
            role_teacher: 'Teacher / facilitator',
            lbl_bio: 'Bio',
            lbl_city: 'City & Country',
            ph_full_name: 'Your full name',
            ph_bio: 'Write a short bio about yourself...',
            ph_city: 'e.g. Amman, Jordan',
            ph_song: 'Song or artist name...',
            title_locate: 'Search on the map',
            hint_map: '📍 Click on the map to set your exact location, or drag the pin.',
            hint_social: 'Enter the username only — the full link is built automatically.',
            change_photo: 'Change photo',
            hint_avatar: 'JPG / PNG / WebP — max 5MB',
            banner_default: 'Default blue',
            banner_custom: 'Two-color gradient',
            banner_image: 'Image',
            banner_color1: 'First color',
            banner_color2: 'Second color',
            banner_direction: 'Gradient direction',
            lbl_song_search: 'Search for a song',
            hint_song: 'Leave empty to keep current song, or click "Remove" to delete it.',
            remove_song: 'Remove song',
            save_changes: 'Save Changes',
            current_images: 'Current photos',
            add_new_images: 'Add new photos',
            hint_gallery: 'You can select multiple photos at once. Max 15 photos total.',
            add_video: '+ Add video',
            hint_no_videos: 'No videos yet. Click "Add video" to add one.',
            remove_video: 'Remove video',
            video_n: 'Video',
            live_preview: 'Live preview',
            no_links: 'No links yet',
            no_photos_yet: 'No photos yet',
            saving: 'Saving...',
            saved: '✓ Saved',
            saved_identity: 'Identity saved ✓',
            saved_location: 'Location saved ✓',
            saved_social: 'Links saved ✓',
            saved_avatar: 'Profile picture updated ✓',
            saved_banner: 'Banner saved ✓',
            saved_song: 'Song saved ✓',
            removed_song: 'Song removed ✓',
            saved_gallery: 'Gallery saved ✓',
            saved_video: 'Videos saved ✓',
            err_name_required: 'Full name is required',
            err_role_required: 'Please select a role',
            err_save_failed: 'An error occurred while saving',
            uploading_image: 'Uploading image...',
            uploading_banner: 'Uploading banner...',
            uploading_images: 'Uploading photos...',
            err_max_images: 'Max 15 photos. Only {n} added.',
            err_max_videos: 'Maximum 3 videos',
            err_city_required: 'Enter city name first',
            err_city_not_found: 'City not found',
            err_search_failed: 'Search failed',
            avatar_added: '✓ Added',
            avatar_not_added: 'Not set',
            banner_default_hint: 'Default',
            banner_custom_hint: 'Two-color gradient',
            banner_image_hint: 'Image uploaded',
            song_added_hint: 'Song added',
            song_none_hint: 'No song',
            video_count_hint: '{n} videos',
            video_none_hint: 'No video',
            gallery_count_hint: '{n} / 15',


            confirm_logout: 'Sign out? Your profile will remain saved and visible in the gallery.',
            confirm_delete_1: 'Are you sure you want to permanently delete your profile? This cannot be undone.',
            confirm_delete_2: 'Final confirmation: all your data (photos, song, links) will be deleted forever. Continue?'
        },
        ar: {
            nav_main: 'الرئيسية', nav_global_map: 'الخريطة العالمية', nav_sitemap: 'خريطة الموقع',
            nav_gallery: 'معرض الذكريات', nav_about: 'عن امالا',
            beta_badge: 'نسخة تجريبية',
            auth_signin: 'تسجيل الدخول',
            auth_edit: 'تعديل بياناتي',
            auth_signout: 'تسجيل خروج',


            gallery_title: 'معرض الطلاب والذكريات',
            gallery_desc: 'استكشف البروفايلات والصور واللحظات الجميلة التي شاركها طلاب الدفعة.',
            search_placeholder: 'ابحث بالاسم أو النبذة...',
            modal_song_title: 'الأغنية المفضلة',
            modal_gallery_title: 'معرض الصور',
            modal_video_title: 'الفيديوهات',
            modal_reactions_title: 'التفاعلات',
            modal_reactions_hint: 'تفاعل واحد لكل زائر — اضغط على تفاعل آخر للتبديل، أو اضغط على تفاعلك الحالي لإزالته.',
            modal_comments_title: 'التعليقات',
            comments_empty: 'لا توجد تعليقات بعد، كن أول من يعلق!',
            comments_loading: 'جاري تحميل التعليقات...',
            comment_author_placeholder: 'اسمك (اختياري)',
            comment_text_placeholder: 'اكتب تعليقك هنا...',
            comment_send: 'إرسال',
            logout: 'تسجيل الخروج',
            edit_profile: '✎ تعديل البروفايل',
            delete_profile: '🗑 حذف البروفايل',
            login_link: 'تسجيل الدخول',
            loading_gallery: 'جاري تحميل بروفايلات المعرض...',
            no_results: 'لم يتم العثور على أي بروفايلات مطابقة.',


            hero_title: 'كوهورت 8 — الصف الثاني: رحلة التعلم',
            hero_desc: 'منصة توثيقية ورقمية مخصصة لاستعراض تجارب طلاب الفوج الثامن الصف الثاني في برنامج أمالا التعليمي. نجمع هنا أبرز المبادرات التطبيقية، الصور الميدانية، واللحظات الملهمة التي شكلت مسيرتنا التعليمية ووطدت أثرنا المجتمعي.',
            hero_cta: 'تصفح المعرض واكتب رسالتك',
            detail_1: 'الدفعة والصف: كوهورت 8 | الصف 2',
            detail_2: 'طبيعة المنصة: معرض رقمي تفاعلي وتوثيقي',
            detail_3: 'البرنامج التابع: برنامج امالا التعليمي (Amala GSD)',
            detail_4: 'أبرز المحتويات: مشاريع تخرج، صور وذكريات الكوهورت',
            location_title: 'أين نتعلم؟',
            location_desc: 'خريطة توضح المركز والقاعات التي اخذنا فيها جلسات الكوهورت والورش العمليّة.',
            location_label_1: 'الموقع',
            location_value_1: 'مركز امالا / اللويبدة',
            location_label_2: 'بيئة التعلم',
            location_value_2: 'الأنشطة الميدانية جماعية أو فردية',
          memories_title: 'ذكرياتنا',
            memory_1_title: 'افتتاح كوهورت 8 — كلاس 2',
            memory_1_desc: 'أول صورة جماعية لنا، وثّقت افتتاح كوهورت 8، كلاس 2.',
            memory_2_title: 'حفلة توديع ميسرينا',
            memory_2_desc: 'صورة من حفلة توديع الميسّرَين عبد الحميد ووقار.',
            memory_3_title: 'آخر حصة معاً',
            memory_3_desc: 'صورة جماعية لذكرى آخر حصة مع ميسرينا.',
            memory_4_title: 'التخرج',
            memory_4_desc: 'صورة تخرجنا — قريباً، حين نعبر خط النهاية.',
            teachers_title: 'معلمونا',
            quote_waqar: '"الإصرار على التعلم والقيادة هو أول خطوات صنع التغيير الحقيقي."',
            quote_abdelhamid: '"شكراً لكم جميعاً — نفخر بما حققتموه خلال هذه الرحلة التعليمية."',
            quote_common: '"شكراً لكم جميعاً"',
            scroll_cue: 'استمر بالتمرير',
            footer_link_1: 'الصفحة الرسمية لأمالا',
            footer_link_2: 'معرض الأعمال',
            footer_link_3: 'الشروط والخصوصية',
            footer_link_4: 'وسائل التواصل الاجتماعي',
            footer_text: '© 2026 جميع الحقوق محفوظة لبرنامج أمل التعليمي - تم برمجة هذه الصفحة بواسطة <b>وسام عباصا</b>',


            about_eyebrow: 'الدفعة الثامنة',
            about_headline: 'قصتنا، رحلتنا',
            about_quote: 'كل دفعة تترك بصمتها. هذه لمحة عن بدايتنا، وما نؤمن به، والأشخاص الذين جعلوا هذه الرحلة ممكنة.',
            who_title: 'من نحن؟',
            who_desc: 'Amala GSD برنامج تعليمي مجتمعي أُطلق عام 2024 لدعم الشباب في الأردن عبر مسار تعليمي مكثّف يمتد 8 أشهر، يركّز على المهارات العملية، القيادة، والتفكير التصميمي، ويربط المتعلمين بمجتمع مهني فعّال.',
            stat_students_t: '+120 طالب وطالبة',
            stat_students_d: 'تخرّجوا من الدفعات السابقة ضمن مسارات متعددة.',
            stat_cohorts_t: '8 دفعات',
            stat_cohorts_d: 'دفعة كل 6 أشهر، بمنهجية تتطور مع كل جيل.',
            stat_mentors_t: '+30 مرشد',
            stat_mentors_d: 'من مهنيين وأكاديميين في السوق الأردني والعربي.',
            vision_intro_highlight: 'أمل',
            vision_intro: 'انطلق برنامج أمل من فكرة بسيطة: منح الشباب الأدوات والمجتمع اللازمين للنمو معاً.',
            vision_1_title: 'رسالتنا',
            vision_1_desc: 'تزويد الدفعة الثامنة بمهارات عملية، وإرشاد، وإحساس حقيقي بالانتماء.',
            vision_2_title: 'رؤيتنا',
            vision_2_desc: 'جيل من المتعلمين يدعم بعضه بعضاً، وينقل ما تعلمه إلى مجتمعاته.',
            vision_3_title: 'قيمنا',
            vision_3_desc: 'التعاون، والفضول، والامتنان — نفس القيم التي شكّلت كل جلسة في هذا البرنامج.',
            journey_title: 'رحلتنا حتى الآن',
            journey_text: 'من يومنا الأول معاً إلى الذكريات الموثقة على هذا الجدار، اقتربت الدفعة الثامنة من بعضها مع كل تحدٍ ومشروع وسهرة نقاش. هذه الصفحة جزء صغير من تلك القصة — والباقي نحمله معنا.',
            thanks_title: 'كلمة شكر لمعلمينا',
            thanks_desc: 'ما كان لأي من هذا أن يتحقق لولا من أرشدونا وتحدونا وآمنوا بنا منذ اليوم الأول.',
            thanks_msg_1: 'شكراً على صبركم ودفعكم لنا لنكون أفضل في كل جلسة.',
            thanks_msg_2: 'شكراً على الإرشاد والدعم الذي جعل هذه الرحلة ممكنة.',


            edit_page_title: 'تعديل البروفايل',
            edit_page_desc: 'اختر أي قسم لفتحه وتعديله. كل قسم يُحفظ بشكل مستقل.',
            section_identity: 'الهوية',
            section_location: 'الموقع الجغرافي',
            section_social: 'روابط التواصل',
            section_avatar: 'الصورة الشخصية',
            section_banner: 'البنر',
            section_song: 'الأغنية',
            section_gallery: 'معرض الصور',
            section_video: 'الفيديوهات',
            lbl_full_name: 'الاسم الكامل *',
            lbl_role: 'الدور *',
            role_student: 'طالب في الكوهورت',
            role_teacher: 'معلم / ميسّر',
            lbl_bio: 'النبذة التعريفية',
            lbl_city: 'المدينة والدولة',
            ph_full_name: 'اسمك الكامل',
            ph_bio: 'اكتب نبذة قصيرة عنك...',
            ph_city: 'مثال: عمّان، الأردن',
            ph_song: 'اسم الأغنية أو الفنان...',
            title_locate: 'ابحث على الخريطة',
            hint_map: '📍 اضغط على الخريطة لتحديد موقعك بدقة، أو اسحب الدبوس.',
            hint_social: 'اكتب اسم المستخدم فقط — سيتم بناء الرابط الكامل تلقائياً.',
            change_photo: 'تغيير الصورة',
            hint_avatar: 'JPG / PNG / WebP — حد أقصى 5MB',
            banner_default: 'أزرق افتراضي',
            banner_custom: 'تدرج بلونين',
            banner_image: 'صورة',
            banner_color1: 'اللون الأول',
            banner_color2: 'اللون الثاني',
            banner_direction: 'اتجاه التدرج',
            lbl_song_search: 'ابحث عن أغنية',
            hint_song: 'اترك الحقل فارغاً للحفاظ على الأغنية الحالية، أو اضغط "إزالة" لحذفها.',
            remove_song: 'إزالة الأغنية',
            save_changes: 'حفظ التعديلات',
            current_images: 'الصور الحالية',
            add_new_images: 'إضافة صور جديدة',
            hint_gallery: 'يمكنك اختيار عدة صور دفعة واحدة. الحد الأقصى 15 صورة إجمالاً.',
            add_video: '+ إضافة فيديو',
            hint_no_videos: 'لا فيديوهات بعد. اضغط "إضافة فيديو" لإضافة واحد.',
            remove_video: 'حذف الفيديو',
            video_n: 'الفيديو',
            live_preview: 'معاينة حية',
            no_links: 'لا روابط بعد',
            no_photos_yet: 'لا صور بعد',
            saving: 'جاري الحفظ...',
            saved: '✓ تم الحفظ',
            saved_identity: 'تم حفظ الهوية ✓',
            saved_location: 'تم حفظ الموقع ✓',
            saved_social: 'تم حفظ الروابط ✓',
            saved_avatar: 'تم تحديث الصورة الشخصية ✓',
            saved_banner: 'تم حفظ البنر ✓',
            saved_song: 'تم حفظ الأغنية ✓',
            removed_song: 'تم إزالة الأغنية ✓',
            saved_gallery: 'تم حفظ المعرض ✓',
            saved_video: 'تم حفظ الفيديوهات ✓',
            err_name_required: 'الاسم الكامل مطلوب',
            err_role_required: 'اختر الدور',
            err_save_failed: 'حدث خطأ أثناء الحفظ',
            uploading_image: 'جاري رفع الصورة...',
            uploading_banner: 'جاري رفع صورة البنر...',
            uploading_images: 'جاري رفع الصور...',
            err_max_images: 'الحد الأقصى 15 صورة. تم إضافة {n} فقط.',
            err_max_videos: 'الحد الأقصى 3 فيديوهات',
            err_city_required: 'اكتب اسم المدينة أولاً',
            err_city_not_found: 'لم يتم العثور على المدينة',
            err_search_failed: 'تعذّر البحث',
            avatar_added: '✓ مُضافة',
            avatar_not_added: 'لم تُضف',
            banner_default_hint: 'افتراضي',
            banner_custom_hint: 'تدرج بلونين',
            banner_image_hint: 'صورة مرفوعة',
            song_added_hint: 'أغنية مُضافة',
            song_none_hint: 'لا أغنية',
            video_count_hint: '{n} فيديو',
            video_none_hint: 'لا فيديو',
            gallery_count_hint: '{n} / 15',


            confirm_logout: 'هل تريد تسجيل الخروج؟ بروفايلك سيبقى محفوظاً ومرئياً في المعرض.',
            confirm_delete_1: 'هل أنت متأكد من حذف بروفايلك نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
            confirm_delete_2: 'تأكيد أخير: سيتم حذف جميع بياناتك (الصور، الأغنية، الروابط) نهائياً. هل تريد المتابعة؟'
        }
    };


    /* ============================================================
       5) THEME + LANGUAGE
       ============================================================ */
    const themeDropdownBtn = document.getElementById('themeDropdownBtn');
    const celestialToggle = document.getElementById('celestialToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownContent = themeDropdown ? themeDropdown.querySelector('.dropdown-content') : null;


    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const langDropdown = document.getElementById('langDropdown');
    const langDropdownContent = langDropdown ? langDropdown.querySelector('.dropdown-content') : null;


    function applyTheme(themeChoice) {
        let effectiveTheme = themeChoice;
        if (themeChoice === 'auto') {
            const hour = new Date().getHours();
            effectiveTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        }
        if (effectiveTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        if (celestialToggle) {
            celestialToggle.classList.toggle('is-dark', effectiveTheme === 'dark');
            celestialToggle.classList.toggle('is-auto', themeChoice === 'auto');
        }
        if (themeDropdown) {
            themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-theme-val') === themeChoice);
            });
        }
        safeSetItem('preferred_theme', themeChoice);
    }
    window.applyTheme = applyTheme;


    function applyLanguage(lang) {
        if (!translations[lang]) lang = 'ar';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        if (currentLangLabel) currentLangLabel.textContent = lang.toUpperCase();


        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = translations[lang][key];
            if (!value) return;
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', value);
            } else {
                element.innerHTML = value;
            }
        });


        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = translations[lang][key];
            if (value) el.setAttribute('placeholder', value);
        });


        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const value = translations[lang][key];
            if (value) el.setAttribute('title', value);
        });


        if (langDropdown) {
            langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-lang-val') === lang);
            });
        }
        safeSetItem('preferred_lang', lang);
        window.CURRENT_LANG = lang;


        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
    window.applyLanguage = applyLanguage;


    window.t = function (key, params) {
        const lang = window.CURRENT_LANG || 'ar';
        let str = (translations[lang] && translations[lang][key]) || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
            });
        }
        return str;
    };


    function setupDropdowns() {
        if (themeDropdownBtn && themeDropdownContent) {
            themeDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (langDropdownContent) langDropdownContent.classList.remove('show');
                themeDropdownContent.classList.toggle('show');
            });
            if (themeDropdown) {
                themeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', () => {
                        applyTheme(item.getAttribute('data-theme-val'));
                        themeDropdownContent.classList.remove('show');
                    });
                });
            }
        }
        if (langDropdownBtn && langDropdownContent) {
            langDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (themeDropdownContent) themeDropdownContent.classList.remove('show');
                langDropdownContent.classList.toggle('show');
            });
            if (langDropdown) {
                langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', () => {
                        applyLanguage(item.getAttribute('data-lang-val'));
                        langDropdownContent.classList.remove('show');
                    });
                });
            }
        }
        document.addEventListener('click', () => {
            if (themeDropdownContent) themeDropdownContent.classList.remove('show');
            if (langDropdownContent) langDropdownContent.classList.remove('show');
        });
    }


    /* ============================================================
       6) AUTH HEADER WIDGET
       ============================================================ */
   async function renderAuthHeader() {
        const slot = document.getElementById('authHeaderSlot');
        if (!slot) return;
        const client = window.getSupabaseClient();
        if (!client) return;


        const { data: { session }, error } = await client.auth.getSession();
        if (error || !session) {
            // 🔒 No sign-in button in the header — login link is shared privately
            slot.innerHTML = '';
            slot.style.display = 'none';
            return;
        }
        slot.style.display = '';


        const { data: profile } = await client
            .from('profiles').select('full_name, avatar_url').eq('id', session.user.id).maybeSingle();


        const rawAvatar = profile?.avatar_url;
        const avatarUrl = rawAvatar
            ? getPublicStorageUrl(rawAvatar, 'avatars')
            : 'Photo/placeholder_avatar.png';
        const name = profile?.full_name || session.user.email;


        slot.innerHTML = `
            <div class="auth-header-dropdown" id="authHeaderDropdown">
                <button class="auth-header-btn" id="authHeaderBtn" title="${name}">
                    <img src="${avatarUrl}" alt="${name}" width="32" height="32" style="border-radius:50%;object-fit:cover;">
                </button>
                <div class="auth-header-menu">
                    <a href="edit_profile.html">${window.t('auth_edit')}</a>
                    <button type="button" id="authHeaderSignOut">${window.t('auth_signout')}</button>
                </div>
            </div>`;


        const btn = document.getElementById('authHeaderBtn');
        const menu = slot.querySelector('.auth-header-menu');
        btn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('show'); });
        document.addEventListener('click', () => { if (menu) menu.classList.remove('show'); });
        document.getElementById('authHeaderSignOut').addEventListener('click', async () => {
            if (!confirm(window.t('confirm_logout'))) return;
            await client.auth.signOut();
            window.location.reload();
        });
    }


    window.addEventListener('languageChanged', () => renderAuthHeader());


    /* ============================================================
       7) GALLERY MODULE
       ============================================================ */
    function initGallery() {
        let allProfiles = [];
        let activeProfileId = null;
        let currentUser = null;


        let audioEl, playBtn, playIcon, pauseIcon, songLabel, previewDisc;


        const REACTION_COLUMN_MAP = { like: 'likes', laugh: 'laughs', sad: 'sads', smile: 'smiles' };
        let currentReactionCounts = { likes: 0, laughs: 0, sads: 0, smiles: 0 };
        let lightboxImages = [];
        let lightboxIndex = 0;
        const REACTION_KEY = id => `amala_reaction_${id}`;


        function escapeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str ?? '';
            return div.innerHTML;
        }


        function extractYouTubeId(url) {
            if (!url) return null;
            const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
            return m ? m[1] : null;
        }
        function extractDriveFileId(url) {
            if (!url) return null;
            const d = url.match(/\/d\/([^/?]+)/); if (d) return d[1];
            const q = url.match(/[?&]id=([^&]+)/); return q ? q[1] : null;
        }
        function debounce(fn, delay) {
            let timer;
            return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
        }
        function setPreviewAudio(audioUrl, songTitle) {
            if (!audioEl || !playBtn || !songLabel) return;
            stopAudio();
            audioEl.src = audioUrl || '';
            songLabel.textContent = songTitle || '—';
            playBtn.hidden = !audioUrl;
        }
        function stopAudio() {
            if (!audioEl) return;
            audioEl.pause(); audioEl.currentTime = 0;
            setPlayButtonState(false);
        }
        function setPlayButtonState(isPlaying) {
            if (playIcon) playIcon.style.display = isPlaying ? 'none' : '';
            if (pauseIcon) pauseIcon.style.display = isPlaying ? '' : 'none';
            if (previewDisc) previewDisc.classList.toggle('playing', isPlaying);
        }


        async function autoSyncLocation() {
            const client = window.getSupabaseClient(); if (!client) return;
            const { data: { session } } = await client.auth.getSession();
            if (!session) return;
            const last = parseInt(safeGetItem('last_geo_check', '0'), 10);
            if (Date.now() - last < 24 * 60 * 60 * 1000) return;
            try {
                const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
                if (!res.ok) return;
                const geo = await res.json();
                if (!geo.latitude || !geo.longitude) return;
                const { data: profile } = await client.from('profiles')
                    .select('lat, lng, city').eq('id', session.user.id).maybeSingle();
                if (!profile || !profile.lat) { safeSetItem('last_geo_check', String(Date.now())); return; }
                const R = 6371, toRad = (d) => d * Math.PI / 180;
                const dLat = toRad(geo.latitude - profile.lat);
                const dLng = toRad(geo.longitude - profile.lng);
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(profile.lat)) * Math.cos(toRad(geo.latitude)) * Math.sin(dLng / 2) ** 2;
                const dist = 2 * R * Math.asin(Math.sqrt(a));
                if (dist > 100) {
                    const msg = (window.CURRENT_LANG === 'en')
                        ? `Looks like you're in ${geo.city || geo.country_name}. Update your profile location?`
                        : `يبدو أنك في ${geo.city || geo.country_name} الآن. تحديث موقعك في البروفايل؟`;
                    if (confirm(msg)) {
                        const newCity = [geo.city, geo.country_name].filter(Boolean).join(', ');
                        await client.from('profiles').update({
                            lat: geo.latitude, lng: geo.longitude, city: newCity
                        }).eq('id', session.user.id);
                        window.showToast?.('✓', 'success');
                    }
                }
                safeSetItem('last_geo_check', String(Date.now()));
            } catch (e) {}
        }


        async function checkAuthStatus() {
            const client = window.getSupabaseClient(); if (!client) return;
            try {
                const { data: { session } } = await client.auth.getSession();
                const footerActions = document.getElementById('footerUserActions');
                const navUserName = document.getElementById('navUserName');


                if (!session) {
                    if (footerActions) footerActions.style.display = 'none';
                    return;
                }
                currentUser = session.user;
                const { data: profile } = await client.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
                if (footerActions) footerActions.style.display = 'flex';
                if (navUserName) navUserName.textContent = profile?.full_name || currentUser.email;
            } catch (err) { console.error(err); }
        }


        const PAGE_SIZE = 12;
        let _page = 0, _loading = false, _hasMore = true;


        async function fetchProfiles(reset) {
            const grid = document.getElementById('galleryGrid');
            if (!grid || _loading) return;
            const client = window.getSupabaseClient();
            if (!client) { grid.innerHTML = `<div class="error-status"><p>${window.t('err_save_failed')}</p></div>`; return; }


            if (reset) { _page = 0; _hasMore = true; allProfiles = []; grid.innerHTML = ''; }


            _loading = true;


            const oldBtn = document.getElementById('loadMoreBtn');
            if (oldBtn) { oldBtn.disabled = true; oldBtn.textContent = '...'; }


            const from = _page * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;


            try {
                const { data, error } = await client.from('profiles').select('*')
                    .order('created_at', { ascending: false }).range(from, to);
                if (error) throw error;


                if (reset) grid.innerHTML = '';
                allProfiles = allProfiles.concat(data || []);
                const fragment = document.createDocumentFragment();
                (data || []).forEach(p => fragment.appendChild(buildGalleryCard(p)));
                grid.appendChild(fragment);


                _page++;
                _hasMore = (data || []).length === PAGE_SIZE;


                oldBtn?.remove();


                if (_hasMore) {
                    const btn = document.createElement('button');
                    btn.id = 'loadMoreBtn';
                    btn.className = 'load-more-btn';
                    btn.textContent = window.CURRENT_LANG === 'en' ? 'Load more' : 'تحميل المزيد';
                    btn.addEventListener('click', () => fetchProfiles(false));
                    grid.parentNode.appendChild(btn);
                }
            } catch (err) {
                console.error(err);
                if (reset) grid.innerHTML = `<p class="loading-status" style="color:#ef4444;">${window.t('err_save_failed')}</p>`;
            } finally {
                _loading = false;
            }
        }


        function resolveProfileMedia(profile) {
            const avatarUrl = getPublicStorageUrl(profile.avatar_url, 'avatars');
            const rawGallery = Array.isArray(profile.gallery) ? profile.gallery : [];
            const galleryImages = rawGallery.map(img => getPublicStorageUrl(img, 'media'));


            let bannerStyle = profile.banner_style || '#1d4ed8';
            if (profile.banner) {
                if (typeof profile.banner === 'string') bannerStyle = profile.banner;
                else if (typeof profile.banner === 'object' && profile.banner.value) bannerStyle = profile.banner.value;
            }
            if (/\.(jpe?g|png|webp)$/i.test(bannerStyle)) {
                const fullBannerUrl = getPublicStorageUrl(bannerStyle, 'media');
                bannerStyle = `url('${fullBannerUrl}') center/cover no-repeat`;
            }


            let songObj = profile.song_url;
            if (typeof songObj === 'string') { try { songObj = JSON.parse(songObj); } catch (e) {} }
            const rawSongUrl = (songObj && typeof songObj === 'object') ? (songObj.previewUrl || songObj.url) : songObj;
            const hasAudio = Boolean(rawSongUrl && String(rawSongUrl).trim() !== '' && rawSongUrl !== 'null');


            const cleanSocial = (v) => (v && String(v).trim() !== '' && v !== 'null') ? String(v).trim() : null;
            const social = profile.social_links || {};
            const linkedinRaw  = cleanSocial(social.linkedin)  || cleanSocial(profile.linkedin);
            const instagramRaw = cleanSocial(social.instagram) || cleanSocial(profile.instagram);
            const linkedinUrl  = buildSocialUrl(linkedinRaw,  'linkedin');
            const instagramUrl = buildSocialUrl(instagramRaw, 'instagram');


            const videoLinks = Array.isArray(profile.video_links)
                ? profile.video_links.filter(v => v && v.url)
                : [];
            const hasVideo = videoLinks.length > 0;


            return { avatarUrl, galleryImages, bannerStyle, hasAudio, linkedinUrl, instagramUrl, videoLinks, hasVideo };
        }


        function buildGalleryCard(profile) {
            const { avatarUrl, galleryImages, bannerStyle, hasAudio, videoLinks, hasVideo } = resolveProfileMedia(profile);


            const coverImage = galleryImages.length > 0
                ? getPublicStorageUrl(profile.gallery[0], 'media')
                : avatarUrl;


            const safeName = profile.full_name || '—';
            const safeBio = profile.bio || '—';


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
                        ${hasAudio ? `<span class="card-badge audio-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> ${window.t('section_song') || 'Song'}</span>` : ''}
                        ${hasVideo ? `<span class="card-badge video-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14l11-7z"></path></svg> ${window.t('section_video') || 'Videos'}</span>` : ''}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-user-header">
                        <h3 class="user-name">${escapeHTML(safeName)}</h3>
                    </div>
                    <p class="user-bio">${escapeHTML(safeBio)}</p>
                </div>`;


            const coverImg = document.createElement('img');
            coverImg.src = coverImage;
            coverImg.alt = safeName;
            coverImg.loading = 'lazy';
            coverImg.onerror = function () { this.src = FALLBACK_IMAGE; };
            card.querySelector('.card-media').prepend(coverImg);


            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl;
            avatarImg.className = 'user-avatar-mini';
            avatarImg.alt = safeName;
            avatarImg.onerror = function () { this.src = FALLBACK_IMAGE; };
            card.querySelector('.card-user-header').prepend(avatarImg);


            return card;
        }


        function renderSocialLinks(linkedinUrl, instagramUrl) {
            const container = document.getElementById('modalSocials'); if (!container) return;
            const links = [];
            if (linkedinUrl) links.push(`<a class="social-link" href="${escapeHTML(linkedinUrl)}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z"></path></svg></a>`);
            if (instagramUrl) links.push(`<a class="social-link" href="${escapeHTML(instagramUrl)}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"></circle></svg></a>`);
            container.innerHTML = links.join('');
        }


        function getStoredReaction(id) { return safeGetItem(REACTION_KEY(id), null); }
        function setStoredReaction(id, type) {
            if (type) safeSetItem(REACTION_KEY(id), type);
            else safeRemoveItem(REACTION_KEY(id));
        }
        function renderReactionCounts(counts) {
            const map = { 'count-like': counts.likes, 'count-laugh': counts.laughs, 'count-sad': counts.sads, 'count-smile': counts.smiles };
            Object.entries(map).forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.textContent = v ?? 0; });
        }
        function highlightActiveReaction(activeType) {
            document.querySelectorAll('#reactionsBar .reaction-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-reaction-type') === activeType);
            });
        }
        async function fetchReactionRow(profileId) {
            const client = window.getSupabaseClient(); if (!client) return null;
            const { data, error } = await client.from('profile_reactions')
                .select('likes, laughs, sads, smiles').eq('profile_id', profileId).limit(1);
            if (error) { console.error(error); return null; }
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
            const client = window.getSupabaseClient(); if (!client) return;
            const column = REACTION_COLUMN_MAP[type]; if (!column) return;
            const previousType = getStoredReaction(activeProfileId);
            const reactionButtons = document.querySelectorAll('#reactionsBar .reaction-btn');
            reactionButtons.forEach(btn => btn.disabled = true);
            try {
                const existingRow = await fetchReactionRow(activeProfileId);
                const counts = existingRow ? { ...existingRow } : { likes: 0, laughs: 0, sads: 0, smiles: 0 };
                if (previousType === type) {
                    counts[column] = Math.max(0, (counts[column] || 0) - 1);
                    setStoredReaction(activeProfileId, null);
                } else {
                    if (previousType && REACTION_COLUMN_MAP[previousType]) {
                        const prevColumn = REACTION_COLUMN_MAP[previousType];
                        counts[prevColumn] = Math.max(0, (counts[prevColumn] || 0) - 1);
                    }
                    counts[column] = (counts[column] || 0) + 1;
                    setStoredReaction(activeProfileId, type);
                }
                if (existingRow) {
                    const { error } = await client.from('profile_reactions').update(counts).eq('profile_id', activeProfileId);
                    if (error) throw error;
                } else {
                    const { error } = await client.from('profile_reactions').insert([{ profile_id: activeProfileId, ...counts }]);
                    if (error) throw error;
                }
                currentReactionCounts = counts;
                renderReactionCounts(counts);
                highlightActiveReaction(getStoredReaction(activeProfileId));
            } catch (err) { console.error(err); }
            finally { reactionButtons.forEach(btn => btn.disabled = false); }
        }


        function renderComments(comments) {
            const list = document.getElementById('commentsList');
            if (!list) return;
            if (!comments || comments.length === 0) {
                list.innerHTML = `<p class="no-comments">${window.t('comments_empty')}</p>`;
                return;
            }
            list.innerHTML = comments.map(c => `
                <div class="comment-item">
                    <strong>${escapeHTML(c.author_name && c.author_name.trim() !== '' ? c.author_name : '—')}</strong>
                    <p>${escapeHTML(c.comment_text || '')}</p>
                </div>`).join('');
        }
        async function fetchComments(profileId) {
            const client = window.getSupabaseClient(); if (!client) return [];
            const { data, error } = await client.from('comments').select('*')
                .eq('profile_id', profileId).order('created_at', { ascending: false });
            if (error) { console.error(error); return []; }
            return data || [];
        }
        async function loadCommentsForProfile(profileId) {
            const list = document.getElementById('commentsList');
            if (list) list.innerHTML = `<p class="no-comments">${window.t('comments_loading')}</p>`;
            renderComments(await fetchComments(profileId));
        }
        async function submitComment(profileId, authorName, commentText) {
            const client = window.getSupabaseClient(); if (!client) return false;
            const last = parseInt(safeGetItem('last_comment_at', '0'), 10);
            const now = Date.now();
            if (now - last < 30000) {
                const wait = Math.ceil((30000 - (now - last)) / 1000);
                window.alert(window.CURRENT_LANG === 'en'
                    ? `Please wait ${wait}s before posting again.`
                    : `الرجاء الانتظار ${wait} ثانية قبل إرسال تعليق آخر.`);
                return false;
            }
            const { error } = await client.from('comments').insert([{
                profile_id: profileId,
                author_name: authorName?.trim() || null,
                comment_text: commentText.trim()
            }]);
            if (error) { console.error(error); return false; }
            safeSetItem('last_comment_at', String(now));
            return true;
        }


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
        function closeLightbox() { document.getElementById('lightboxOverlay')?.classList.remove('active'); }
        function lightboxStep(direction) {
            if (lightboxImages.length === 0) return;
            lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
            updateLightboxImage();
        }


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
                } else modalBanner.style.background = '#1d4ed8';
            }
            if (modalAvatar) {
                modalAvatar.src = avatarUrl;
                modalAvatar.onerror = function () { this.src = FALLBACK_IMAGE; };
            }
            if (modalName) modalName.textContent = profile.full_name || '—';
            if (modalBio) modalBio.textContent = profile.bio || '—';
            const { linkedinUrl, instagramUrl } = resolveProfileMedia(profile);
            renderSocialLinks(linkedinUrl, instagramUrl);


            /* ---------- Audio ---------- */
            const audioSection = document.getElementById('modalAudioSection');
            if (audioSection) {
                let songObj = profile.song_url;
                if (typeof songObj === 'string') { try { songObj = JSON.parse(songObj); } catch (e) {} }
                let rawSongUrl = (songObj && typeof songObj === 'object') ? (songObj.previewUrl || songObj.url) : songObj;
                let finalSongUrl = '';
                if (rawSongUrl) finalSongUrl = getPublicStorageUrl(rawSongUrl, 'media');
                if (finalSongUrl && finalSongUrl !== FALLBACK_IMAGE) {
                    const label = songObj?.title
                        ? (songObj.artist ? `${songObj.title} — ${songObj.artist}` : songObj.title)
                        : '—';
                    setPreviewAudio(finalSongUrl, label);
                    audioSection.style.display = 'block';
                } else {
                    setPreviewAudio('', '');
                    audioSection.style.display = 'none';
                }
            }


            /* ---------- Gallery ---------- */
            const modalGalleryGrid = document.getElementById('modalGalleryGrid');
            if (modalGalleryGrid) {
                modalGalleryGrid.innerHTML = '';
                galleryImages.forEach((imgUrl, index) => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = profile.full_name || '';
                    img.onerror = function () { this.src = FALLBACK_IMAGE; };
                    img.addEventListener('click', () => openLightbox(galleryImages, index));
                    modalGalleryGrid.appendChild(img);
                });
            }


            /* ---------- Videos (all of them) ---------- */
            const videoSection = document.getElementById('modalVideoSection');
            const videoContainer = document.getElementById('modalVideoContainer');
            if (videoSection && videoContainer) {
                videoContainer.innerHTML = '';


                const videoLinks = Array.isArray(profile.video_links)
                    ? profile.video_links.filter(v => v && v.url)
                    : [];


                let renderedCount = 0;


                videoLinks.forEach((v) => {
                    const vType = (v.type === 'drive' || v.type === 'gdrive') ? 'drive' : 'youtube';
                    let embedHtml = '';


                    if (vType === 'drive') {
                        const driveId = extractDriveFileId(v.url);
                        if (driveId) {
                            embedHtml = `<iframe src="https://drive.google.com/file/d/${driveId}/preview" allow="autoplay" allowfullscreen loading="lazy"></iframe>`;
                        }
                    } else {
                        const videoId = extractYouTubeId(v.url);
                        if (videoId) {
                            embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen loading="lazy"></iframe>`;
                        }
                    }


                    if (embedHtml) {
                        const wrap = document.createElement('div');
                        wrap.className = 'video-container';
                        wrap.innerHTML = embedHtml;
                        videoContainer.appendChild(wrap);
                        renderedCount++;
                    }
                });


                videoSection.style.display = renderedCount > 0 ? 'block' : 'none';
            }


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
                    audioEl.play().then(() => setPlayButtonState(true))
                        .catch(err => console.error(err));
                } else {
                    audioEl.pause(); setPlayButtonState(false);
                }
            });
        }
        if (audioEl) audioEl.addEventListener('ended', () => setPlayButtonState(false));


        checkAuthStatus();
        autoSyncLocation();
        fetchProfiles(true);


        const handleSearch = debounce((query) => {
            const filtered = allProfiles.filter(p =>
                (p.full_name || '').toLowerCase().includes(query) ||
                (p.bio || '').toLowerCase().includes(query)
            );
            const grid = document.getElementById('galleryGrid');
            if (!grid) return;
            grid.innerHTML = '';
            const frag = document.createDocumentFragment();
            filtered.forEach(p => frag.appendChild(buildGalleryCard(p)));
            grid.appendChild(frag);
            document.getElementById('loadMoreBtn')?.remove();
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
            if (!btn) return;
            handleReactionClick(btn.getAttribute('data-reaction-type'));
        });


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


        document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
        document.getElementById('lightboxPrev')?.addEventListener('click', () => lightboxStep(-1));
        document.getElementById('lightboxNext')?.addEventListener('click', () => lightboxStep(1));
        document.getElementById('lightboxOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'lightboxOverlay') closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            const lightboxOpen = document.getElementById('lightboxOverlay')?.classList.contains('active');
            if (e.key === 'Escape') {
                if (lightboxOpen) closeLightbox(); else closeModal();
            } else if (lightboxOpen && e.key === 'ArrowLeft') {
                lightboxStep(document.documentElement.dir === 'rtl' ? 1 : -1);
            } else if (lightboxOpen && e.key === 'ArrowRight') {
                lightboxStep(document.documentElement.dir === 'rtl' ? -1 : 1);
            }
        });


        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            if (!confirm(window.t('confirm_logout'))) return;
            const client = window.getSupabaseClient();
            if (client) await client.auth.signOut();
            window.location.href = 'log_in.html';
        });


        document.getElementById('deleteProfileBtn')?.addEventListener('click', async () => {
            if (!confirm(window.t('confirm_delete_1'))) return;
            if (!confirm(window.t('confirm_delete_2'))) return;


            const client = window.getSupabaseClient();
            if (!client || !currentUser) return;


            try {
                await client.from('profile_reactions').delete().eq('profile_id', currentUser.id);
                const { error } = await client.from('profiles').delete().eq('id', currentUser.id);
                if (error) throw error;
                await client.auth.signOut();
                window.location.href = 'log_in.html';
            } catch (err) {
                console.error(err);
                alert(err.message || 'حدث خطأ أثناء الحذف');
            }
        });


        window.addEventListener('languageChanged', () => {
            const grid = document.getElementById('galleryGrid');
            if (grid && allProfiles.length) {
                grid.innerHTML = '';
                const frag = document.createDocumentFragment();
                allProfiles.forEach(p => frag.appendChild(buildGalleryCard(p)));
                grid.appendChild(frag);
            }
        });
    }


    /* ============================================================
       8) GLOBAL MAP MODULE
       ============================================================ */
    function initGlobalMap() {
        const L = window.L;
        if (!L) { console.error('Leaflet is not loaded'); return; }
        const AVATAR_BUCKET = 'avatars';
        const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=1e293b&color=fff&name=';
        const CARTO_API_KEY = 'cb1_2urb_1_0861fffafd5b57a52633096f';
        const TILE_URLS = {
            light: `https://basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
            dark:  `https://basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`
        };
        const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';
        const statusEl = document.getElementById('status');
        function setStatus(message) { if (statusEl) statusEl.textContent = message || ''; }
        function getEffectiveTheme() {
            if (document.documentElement.hasAttribute('data-theme')) {
                return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            }
            const stored = safeGetItem('preferred_theme', 'auto');
            if (stored === 'dark') return 'dark';
            if (stored === 'light') return 'light';
            const hour = new Date().getHours();
            return (hour >= 6 && hour < 18) ? 'light' : 'dark';
        }
        const southWest = L.latLng(-55, -135);
        const northEast = L.latLng(75, 160);
        const worldBounds = L.latLngBounds(southWest, northEast);
        const map = L.map('globe-container', {
            center: [20, 10], zoom: 2.3, minZoom: 2.2, maxZoom: 6,
            maxBounds: worldBounds, maxBoundsViscosity: 1.0, worldCopyJump: false
        });
        let tileLayer = L.tileLayer(TILE_URLS[getEffectiveTheme()], {
            maxZoom: 19, attribution: TILE_ATTRIBUTION
        }).addTo(map);
        const themeObserver = new MutationObserver(() => {
            const url = TILE_URLS[getEffectiveTheme()];
            if (tileLayer._url !== url) {
                map.removeLayer(tileLayer);
                tileLayer = L.tileLayer(url, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(map);
            }
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        const studentClusters = L.markerClusterGroup({
            spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true,
            maxClusterRadius: 35, removeOutsideVisibleBounds: false, disableClusteringAtZoom: 6,
            iconCreateFunction: function (cluster) {
                return L.divIcon({
                    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
                    className: 'custom-cluster', iconSize: L.point(40, 40)
                });
            }
        });
        map.addLayer(studentClusters);
        function resolveAvatarUrl(avatarUrl) {
            if (!avatarUrl) return null;
            if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
            return getPublicStorageUrl(avatarUrl, AVATAR_BUCKET);
        }
        async function loadStudents() {
            setStatus('...');
            const client = window.getSupabaseClient();
            if (!client) { setStatus('—'); return; }
            const { data, error } = await client.from('profiles')
                .select('id, full_name, avatar_url, city, lat, lng')
                .not('lat', 'is', null).not('lng', 'is', null);
            if (error) { console.error(error); setStatus(error.message); return; }
            if (!data || data.length === 0) { setStatus('—'); return; }
            setStatus('');
            data.forEach((student) => {
                const titleName = student.full_name || '—';
                const fallbackAvatar = DEFAULT_AVATAR + encodeURIComponent(titleName);
                const resolvedAvatar = resolveAvatarUrl(student.avatar_url);
                const avatar = resolvedAvatar || fallbackAvatar;
                const customIcon = L.divIcon({
                    className: 'student-pin-container',
                    html: `<div class="student-pin-avatar"><img src="${avatar}" onerror="this.onerror=null;this.src='${fallbackAvatar}';" alt="${titleName}" /></div>`,
                    iconSize: [42, 42], iconAnchor: [21, 21], popupAnchor: [0, -24]
                });
                const cityRow = student.city ? `<div class="student-popup-city"><span aria-hidden="true">📍</span><span>${student.city}</span></div>` : '';
                const popupHtml = `
                    <div class="student-popup">
                        <div class="student-popup-banner"></div>
                        <img class="student-popup-avatar" src="${avatar}" onerror="this.onerror=null;this.src='${fallbackAvatar}';" alt="${titleName}" />
                        <div class="student-popup-body">
                            <div class="student-popup-name">${titleName}</div>
                            ${cityRow}
                        </div>
                    </div>`;
                const marker = L.marker([student.lat, student.lng], { icon: customIcon })
                    .bindPopup(popupHtml, { closeButton: true, className: 'student-popup-wrapper' });
                marker.on('click', () => {
                    const el = marker.getElement();
                    if (!el) return;
                    const avatarEl = el.querySelector('.student-pin-avatar');
                    if (!avatarEl) return;
                    avatarEl.classList.remove('pin-bounce');
                    void avatarEl.offsetWidth;
                    avatarEl.classList.add('pin-bounce');
                });
                studentClusters.addLayer(marker);
            });
        }
        loadStudents();
    }


    /* ============================================================
       9) BOOTSTRAP
       ============================================================ */
    document.addEventListener('DOMContentLoaded', function () {
        window.getSupabaseClient();


        const isLoginPage = !!document.getElementById('profileWizardForm');
        if (!isLoginPage) {
            setupDropdowns();
            applyTheme(safeGetItem('preferred_theme', 'auto'));
            applyLanguage(safeGetItem('preferred_lang', 'ar'));
        }


        if (document.getElementById('authHeaderSlot')) {
            const client = window.getSupabaseClient();
            if (client) client.auth.onAuthStateChange(() => renderAuthHeader());
        }


        if (document.getElementById('galleryGrid'))      initGallery();
        if (document.getElementById('globe-container'))  initGlobalMap();
    });
})();
