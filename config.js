// this is config.js
window.CONFIG_APP = {
    SUPABASE_URL: "https://scomyankrwvlquopqrxk.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb215YW5rcnd2bHF1b3BxcnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODc1MjgsImV4cCI6MjEwMTg2MzUyOH0.2S9WhHS_bMkk1N6m5CopmtfpYNOXSONkmAj_3wKRpTA",
    appId: "1:956199773279:web:b68ab859d539ce5418a7ea",
    measurementId: "G-M3TLYE6HSQ",
    MAX_IMAGE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    TOTAL_STEPS: 4,
    DRAFT_KEY: 'amala_profile_draft'
};


if (typeof window.supabase !== 'undefined') {
    window.supabaseClient = window.supabase.createClient(window.CONFIG_APP.SUPABASE_URL, window.CONFIG_APP.SUPABASE_ANON_KEY);
}