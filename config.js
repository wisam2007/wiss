

// 1. إعدادات Supabase (قاعدة البيانات والتحقق)
const SUPABASE_URL = "https://scomyankrwvlquopqrxk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nS3vXoEQABjfyRNSfHYpKQ_RLQPYdIX";

// تهيئة عميل Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. إعدادات Cloudinary (لتخزين الصور والفيديوهات)
const CLOUDINARY_CLOUD_NAME = "hbrfdlin";
const CLOUDINARY_UPLOAD_PRESET = "PIP_upload";