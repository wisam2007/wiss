// 1. إعدادات Supabase (قاعدة البيانات والتحقق)
const CONFIG = {
    SUPABASE_URL: "https://scomyankrwvlquopqrxk.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb215YW5rcnd2bHF1b3BxcnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODc1MjgsImV4cCI6MjEwMTg2MzUyOH0.2S9WhHS_bMkk1N6m5CopmtfpYNOXSONkmAj_3wKRpTA"
};

// 2. إعدادات Cloudinary (اختياري)
const CLOUDINARY_CLOUD_NAME = "hbrfdlin";
const CLOUDINARY_UPLOAD_PRESET = "PIP_upload";