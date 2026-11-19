/* member_notice.js — shows "you are not a member" on the main page when redirected with ?notmember=1 */
(function () {
    var params = new URLSearchParams(location.search);
    if (!params.has('notmember')) return;

    var lang = 'ar';
    try { lang = localStorage.getItem('preferred_lang') || 'ar'; } catch (e) {}
    var text = lang === 'en'
        ? 'Sorry, you are not a member of the platform.'
        : 'للأسف، أنت لست عضوًا في المنصة.';

    function show() {
        var bar = document.createElement('div');
        bar.setAttribute('role', 'alert');
        bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;padding:14px 48px 14px 16px;' +
            'background:#b91c1c;color:#fff;font:700 15px Tajawal,sans-serif;text-align:center;' +
            'box-shadow:0 4px 16px rgba(0,0,0,.25);';
        bar.textContent = text;
        var close = document.createElement('button');
        close.type = 'button';
        close.textContent = '✕';
        close.style.cssText = 'position:absolute;top:50%;right:14px;transform:translateY(-50%);' +
            'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;';
        close.onclick = function () { bar.remove(); };
        bar.appendChild(close);
        document.body.appendChild(bar);
        setTimeout(function () { bar.remove(); }, 8000);
    }

    // remove the flag from the URL so a refresh doesn't show it again
    history.replaceState(null, '', location.pathname + location.hash);

    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
