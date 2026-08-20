// config.js
window.CONFIG_APP = {
    SUPABASE_URL: "https://scomyankrwvlquopqrxk.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb215YW5rcnd2bHF1b3BxcnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI4NzUyOCwiZXhwIjoyMTAxODYzNTI4fQ.Iv1Nu_i7SvPhtx5iG4a3g9jzcMeDw3q16PgP2fZrAB0",
    measurementId: "G-M3TLYE6HSQ",
    MAX_IMAGE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    TOTAL_STEPS: 4,
    DRAFT_KEY: 'amala_profile_draft'
};


// دالة تضمن إنشاء الاتصال فور جاهزية المكتبة
window.getSupabaseClient = function() {
    if (window.supabaseClient) {
        return window.supabaseClient;
    }
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        window.supabaseClient = window.supabase.createClient(
            window.CONFIG_APP.SUPABASE_URL,
            window.CONFIG_APP.SUPABASE_ANON_KEY
        );
        return window.supabaseClient;
    }
    return null;
};