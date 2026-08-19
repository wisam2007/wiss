(function () {
    if (!window.supabase) return;
    const supabaseClient = window.supabaseClient || window.supabase.createClient(window.CONFIG_APP.SUPABASE_URL, window.CONFIG_APP.SUPABASE_ANON_KEY);
    window.supabaseClient = supabaseClient;


    const LANG = (document.documentElement.getAttribute('lang') || 'ar');
    const T = LANG === 'en'
        ? { signIn: 'Sign in', edit: 'Edit my profile', signOut: 'Sign out' }
        : { signIn: 'تسجيل الدخول', edit: 'تعديل بياناتي', signOut: 'تسجيل خروج' };


    async function render() {
        const slot = document.getElementById('authHeaderSlot');
        if (!slot) return;


        const { data: { session }, error } = await supabaseClient.auth.getSession();


        if (error || !session) {
            slot.innerHTML = `<a href="log_in.html" class="auth-header-signin">${T.signIn}</a>`;
            return;
        }


        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();


        const avatarUrl = profile?.avatar_url || 'Photo/placeholder_avatar.png';
        const name = profile?.full_name || session.user.email;


        slot.innerHTML = `
            <div class="auth-header-dropdown" id="authHeaderDropdown">
                <button class="auth-header-btn" id="authHeaderBtn" title="${name}">
                    <img src="${avatarUrl}" alt="${name}" width="32" height="32" style="border-radius: 50%; object-fit: cover;">
                </button>
                <div class="auth-header-menu">
                    <a href="edit_profile.html">${T.edit}</a>
                    <button type="button" id="authHeaderSignOut">${T.signOut}</button>
                </div>
            </div>`;


        const btn = document.getElementById('authHeaderBtn');
        const menu = document.querySelector('.auth-header-menu');


        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });
       
        document.addEventListener('click', () => {
            if (menu) menu.classList.remove('show');
        });
       
        document.getElementById('authHeaderSignOut').addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.reload();
        });
    }


    document.addEventListener('DOMContentLoaded', render);
    if (window.supabaseClient) {
        window.supabaseClient.auth.onAuthStateChange(() => render());
    }
})();




