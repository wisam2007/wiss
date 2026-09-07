// leaflet + leaflet.markercluster are loaded as classic UMD <script> tags
// in students-map.html (before this module), so both attach themselves to
// window.L. We read from there instead of `import L from 'leaflet'` because
// esm.sh does not reliably give leaflet.markercluster the same `L` instance
// this module would import, which silently breaks `L.markerClusterGroup`.
const L = window.L;


import { createClient } from '@supabase/supabase-js';


// ---- Supabase Setup ----
const SUPABASE_URL = 'https://scomyankrwvlquopqrxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb215YW5rcnd2bHF1b3BxcnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODc1MjgsImV4cCI6MjEwMTg2MzUyOH0.2S9WhHS_bMkk1N6m5CopmtfpYNOXSONkmAj_3wKRpTA';


// Name of the Supabase Storage bucket that holds profile pictures.
// Change this if your bucket is named differently.
const AVATAR_BUCKET = 'avatars';


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=1e293b&color=fff&name=';


const statusEl = document.getElementById('status');
function setStatus(message) {
    if (statusEl) statusEl.textContent = message || '';
}


// ------------------------------------------------------------
// THEME (day / night)
// The header's theme toggle (main_control.js) sets
// data-theme="dark" on <html>, or removes it for light mode. We
// don't touch that logic — we just read it, so the map tiles
// follow whatever the header is showing. We also mirror the same
// "auto" (time of day) fallback main_control.js uses, so the very
// first paint of the map matches the very first paint of the page.
// ------------------------------------------------------------
// CARTO Basemaps API key (from your CARTO account — cb1_... key emailed to
// you). Using the authenticated /rastertiles/ endpoint with this key is
// what actually removes the "API key required" watermark CARTO shows on
// the free unauthenticated endpoint — this is the legitimate way to do
// it (vs. hiding it with CSS, which doesn't apply to the CARTO watermark
// baked into the tile images themselves anyway). Free tier: 5M tile
// requests/month across both light + dark.
const CARTO_API_KEY = 'cb1_2urb_1_0861fffafd5b57a52633096f';


const TILE_URLS = {
    light: `https://basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
    dark: `https://basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`
};


// Attribution to OpenStreetMap/CARTO is still required even with an API
// key (the key removes the watermark, not the attribution requirement),
// so we keep it — just shrunk visually via CSS
// (.leaflet-control-attribution in global_map_style.css).
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';


function safeGetItem(key, fallback) {
    try {
        return localStorage.getItem(key) || fallback;
    } catch (e) {
        return fallback;
    }
}


function getEffectiveTheme() {
    // If main_control.js already ran and stamped the <html> element,
    // trust that directly — it's the single source of truth.
    if (document.documentElement.hasAttribute('data-theme')) {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }
    // Otherwise (this script can execute before that runs) fall back
    // to the same stored preference + "auto" time-of-day rule.
    const stored = safeGetItem('preferred_theme', 'auto');
    if (stored === 'dark') return 'dark';
    if (stored === 'light') return 'light';
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}


// ---- حدود مطابقة للمستطيل الأحمر في التصميم الأصلي ----
const southWest = L.latLng(-55, -135);
const northEast = L.latLng(75, 160);
const worldBounds = L.latLngBounds(southWest, northEast);


// ---- Map Setup مع التكبير المحدود والحدود المحكمة ----
const map = L.map('globe-container', {
    center: [20, 10],
    zoom: 2.3,
    minZoom: 2.2,
    maxZoom: 6,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,
    worldCopyJump: false
});


let tileLayer = L.tileLayer(TILE_URLS[getEffectiveTheme()], {
    maxZoom: 19,
    attribution: TILE_ATTRIBUTION
}).addTo(map);


// React live to the header's sun/moon toggle: swap tiles the moment
// main_control.js flips the data-theme attribute on <html>.
const themeObserver = new MutationObserver(() => {
    const url = TILE_URLS[getEffectiveTheme()];
    if (tileLayer._url !== url) {
        map.removeLayer(tileLayer);
        tileLayer = L.tileLayer(url, {
            maxZoom: 19,
            attribution: TILE_ATTRIBUTION
        }).addTo(map);
    }
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });


// ------------------------------------------------------------
// MARKER CLUSTERING
// Fixes the "two or more profiles at the exact same location"
// problem: instead of drawing overlapping pins where only the
// last one drawn is clickable, nearby/identical coordinates are
// grouped into a single numbered cluster bubble. Clicking a
// cluster zooms in; at max zoom, spiderfyOnMaxZoom fans identical
// points out into a small circle so every profile stays reachable.
// ------------------------------------------------------------
const studentClusters = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 35,
    // Leaflet.markercluster removes markers/clusters outside the current
    // viewport from the DOM by default (a performance optimization for
    // large datasets). Combined with the strict maxBounds + zoom
    // animation on this map, that's what was causing pins to randomly
    // vanish while zooming in/out — the dataset here (a student list) is
    // small enough that this optimization isn't needed.
    removeOutsideVisibleBounds: false,
    // At max zoom, stop clustering altogether so every profile is always
    // shown as its own pin instead of possibly staying grouped.
    disableClusteringAtZoom: 6,
    iconCreateFunction: function (cluster) {
        return L.divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40)
        });
    }
});
map.addLayer(studentClusters);


// ------------------------------------------------------------
// AVATARS
// avatar_url in the `profiles` table can be either a full URL
// (already public) or a path inside the Storage bucket (e.g.
// "user123/photo.png"). Previously only full URLs worked, so any
// stored path silently failed to load and every pin fell back to
// the initials avatar. This resolves both cases.
// ------------------------------------------------------------
function resolveAvatarUrl(avatarUrl) {
    if (!avatarUrl) return null;
    if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(avatarUrl);
    return data ? data.publicUrl : null;
}


function cityLabel() {
    const lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
    return lang === 'en' ? 'City' : 'المدينة';
}


// ---- Fetch & Render Student Pins ----
async function loadStudents() {
    setStatus('...جارِ تحميل مواقع الطلاب');


    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, lat, lng')
        .not('lat', 'is', null)
        .not('lng', 'is', null);


    if (error) {
        console.error('Error fetching students:', error);
        setStatus(`تعذّر تحميل المواقع: ${error.message}`);
        return;
    }


    if (!data || data.length === 0) {
        setStatus('لا يوجد طلاب لديهم موقع محفوظ بعد');
        return;
    }


    setStatus('');


    data.forEach((student) => {
        const titleName = student.full_name || 'طالب';
        const fallbackAvatar = DEFAULT_AVATAR + encodeURIComponent(titleName);
        const resolvedAvatar = resolveAvatarUrl(student.avatar_url);
        const avatar = resolvedAvatar || fallbackAvatar;


        const customIcon = L.divIcon({
            className: 'student-pin-container',
            html: `
        <div class="student-pin-avatar">
          <img src="${avatar}"
               onerror="this.onerror=null; this.src='${fallbackAvatar}';"
               alt="${titleName}" />
        </div>
      `,
            iconSize: [42, 42],
            iconAnchor: [21, 21],
            popupAnchor: [0, -24]
        });


        const cityRow = student.city
            ? `<div class="student-popup-city"><span aria-hidden="true">📍</span><span>${student.city}</span></div>`
            : '';


        const popupHtml = `
      <div class="student-popup">
        <div class="student-popup-banner"></div>
        <img class="student-popup-avatar" src="${avatar}"
             onerror="this.onerror=null; this.src='${fallbackAvatar}';" alt="${titleName}" />
        <div class="student-popup-body">
          <div class="student-popup-name">${titleName}</div>
          ${cityRow}
        </div>
      </div>
    `;


        // Note: not .addTo(map) here — markers are added to the cluster
        // group below, which is itself the layer added to the map.
        const marker = L.marker([student.lat, student.lng], { icon: customIcon })
            .bindPopup(popupHtml, { closeButton: true, className: 'student-popup-wrapper' });


        // Little bounce on the pin itself the moment it's tapped/clicked,
        // on top of the popup opening.
        marker.on('click', () => {
            const el = marker.getElement();
            if (!el) return;
            const avatarEl = el.querySelector('.student-pin-avatar');
            if (!avatarEl) return;
            avatarEl.classList.remove('pin-bounce');
            // force reflow so the animation can restart on repeated clicks
            void avatarEl.offsetWidth;
            avatarEl.classList.add('pin-bounce');
        });


        studentClusters.addLayer(marker);
    });
}


loadStudents();




