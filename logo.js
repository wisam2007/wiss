/* logo.js — شاشة افتتاحية للوجو (تُحمَّل في main.html فقط)
   - اللوجو يظهر من أول لحظة حتى الانفجار
   - الموقع يبدأ بالظهور تدريجياً مع لحظة الانفجار (آخر ~2 ثانية)
   - يعمل حتى لو فُتح الموقع من file:// (بدون خادم) */
(function () {
  // ---------- الإعدادات ----------
  var LOGO_URLS = ["Photo/light_mood_ICON.png", "Photo/night_mode_ICON.png"]; // الثاني احتياطي فقط
  var CIRCLE_MASK = true;       // اللوجو دائري بخلفية بيضاء
  var TITLE = "Amala GSD";
  var FALLBACK_TEXT = "AMALA";
  var BG = "#ffffff";
  var TEXT_COLOR = "#0b4f7e";
  var GLOW = "100,180,255";
  var STORAGE_KEY = "splashSeen3"; // غيّر القيمة لإظهارها من جديد لكل المستخدمين
  var REMEMBER = "session";     // "session" = مرة لكل زيارة | "forever" = مرة واحدة فقط
  var FADE_MS = 1800;           // مدة ظهور الموقع (تتزامن مع الانفجار)
  var IMG_WAIT = 2500;          // أقصى انتظار لتحميل الصورة
  // التوقيت (مللي ثانية): تجمّع، اكتمال اللوجو، ظهور الصورة الأصلية، الكتابة، الانفجار، النهاية
  var T = { gather: 600, formed: 4000, reveal: 5300, text: 5900, explode: 7700, end: 9500 };

  // ---------- مرة واحدة لكل جلسة ----------
  var root = document.documentElement;
  var store = null;
  try { store = (REMEMBER === "forever") ? localStorage : sessionStorage; } catch (e) {}
  function unhide() { root.classList.remove("splash-pending"); }
  var FORCE = /[?&]splash=1/.test(location.search); // main.html?splash=1 تُظهر الشاشة دائماً
  try { if (!FORCE && store && store.getItem(STORAGE_KEY)) { unhide(); return; } } catch (e) {}
  try { if (store) store.setItem(STORAGE_KEY, "1"); } catch (e) {}
  window.__splashOn = true;

  // ---------- إخفاء الموقع فوراً وإظهار الشاشة ----------
  var closed = false;
  var EASE = "cubic-bezier(.4,0,.2,1)";
  var styleEl = document.createElement("style");
  styleEl.textContent =
    "html.splash-pending{background:" + BG + "}" +
    "html.splash-pending body{visibility:hidden;opacity:0}" +
    "@keyframes splashIn{from{opacity:0}to{opacity:1}}" +
    "@keyframes splashUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}" +
    "html.splash-reveal body{animation:splashIn " + FADE_MS + "ms " + EASE + " backwards}" +
    "html.splash-reveal .hero{animation:splashUp " + (FADE_MS + 300) + "ms " + EASE + " backwards}";
  (document.head || root).appendChild(styleEl);
  root.classList.add("splash-pending");

  var box = document.createElement("div");
  box.className = "splash-overlay";
  box.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:" + BG +
    ";touch-action:none;overscroll-behavior:none;user-select:none;-webkit-user-select:none;transition:opacity " + FADE_MS + "ms " + EASE;
  var cv = document.createElement("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block";
  box.appendChild(cv);
  root.appendChild(box);

  // ---------- قفل الموقع أثناء العرض ----------
  var prevHtml = root.style.overflow, prevBody = "", locked = false;
  root.style.overflow = "hidden";
  function lockBody() {
    var b = document.body;
    if (!b || locked || closed) return;
    locked = true; b.inert = true; prevBody = b.style.overflow; b.style.overflow = "hidden";
  }
  lockBody();
  if (!document.body) document.addEventListener("DOMContentLoaded", lockBody);
  var KEYS = { 9: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };
  function stop(e) { e.preventDefault(); }
  function stopKey(e) { if (KEYS[e.keyCode]) e.preventDefault(); }
  var opt = { passive: false, capture: true };
  window.addEventListener("wheel", stop, opt);
  window.addEventListener("touchmove", stop, opt);
  window.addEventListener("keydown", stopKey, true);
  function unlock() {
    window.removeEventListener("wheel", stop, opt);
    window.removeEventListener("touchmove", stop, opt);
    window.removeEventListener("keydown", stopKey, true);
    root.style.overflow = prevHtml;
    if (document.body && locked) { document.body.inert = false; document.body.style.overflow = prevBody; }
  }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  var ctx = cv.getContext("2d");
  ctx.direction = "ltr";

  function finish() {
    if (closed) return; closed = true;
    unlock();
    root.classList.add("splash-reveal");   // الموقع يظهر تدريجياً مع الانفجار
    unhide();
    window.__splashOn = false;
    try { window.dispatchEvent(new Event("splash:done")); } catch (e) {}
    box.style.pointerEvents = "none";
    box.style.opacity = 0;
    setTimeout(function () { box.remove(); }, FADE_MS + 80);
    setTimeout(function () { root.classList.remove("splash-reveal"); styleEl.remove(); }, FADE_MS + 600);
  }
  setTimeout(finish, IMG_WAIT + T.end + 2500); // شبكة أمان مطلقة: الموقع لن يبقى مقفلاً

  // ---------- تحويل اللوجو إلى نقاط ----------
  function sample(img) {
    var size = Math.min(W, H) * 0.6;
    var off = document.createElement("canvas"), oc = off.getContext("2d");
    var w, h;
    if (img) { var r = img.width / img.height; w = r >= 1 ? size : size * r; h = r >= 1 ? size / r : size; }
    else { w = size; h = size * 0.4; }
    off.width = Math.round(w); off.height = Math.round(h);
    if (img) {
      oc.drawImage(img, 0, 0, off.width, off.height);
      if (CIRCLE_MASK) {
        oc.globalCompositeOperation = "destination-in";
        oc.beginPath(); oc.arc(off.width / 2, off.height / 2, Math.min(off.width, off.height) / 2 - 1, 0, Math.PI * 2);
        oc.fill(); oc.globalCompositeOperation = "source-over";
      }
    } else {
      oc.fillStyle = "#fff"; oc.font = "bold " + off.height * 0.9 + "px system-ui,sans-serif";
      oc.textAlign = "center"; oc.textBaseline = "middle";
      oc.fillText(FALLBACK_TEXT, off.width / 2, off.height / 2);
    }
    // عند فتح الموقع من file:// يمنع المتصفح قراءة البيكسلات → نستخدم شكلاً دائرياً بدلاً من ذلك
    var d = null;
    try { d = oc.getImageData(0, 0, off.width, off.height).data; } catch (e) { d = null; }
    var TARGET = W > 1400 ? 20000 : 13000;
    var step = Math.max(2, Math.round(size * Math.sqrt(0.8 / TARGET)));
    var ox = (W - off.width) / 2, oy = (H - off.height) / 2 - H * 0.07, pts = [];
    var rad = Math.min(off.width, off.height) / 2;
    for (var y = 0; y < off.height; y += step)
      for (var x = 0; x < off.width; x += step) {
        var t = y / off.height;
        if (d) {
          var i = (y * off.width + x) * 4;
          if (d[i + 3] > 128) pts.push({ tx: ox + x, ty: oy + y, c: img ? [d[i], d[i + 1], d[i + 2]] : [255 - 110 * t, 150 + 60 * t, 255] });
        } else {
          var dx = x - off.width / 2, dy = y - off.height / 2;
          if (dx * dx + dy * dy <= rad * rad) pts.push({ tx: ox + x, ty: oy + y, c: [Math.round(11 + 89 * t), Math.round(79 + 101 * t), Math.round(126 + 129 * t)] });
        }
      }
    pts.ox = ox; pts.oy = oy; pts.w = off.width; pts.h = off.height; pts.img = img;
    pts.cx = ox + off.width / 2; pts.cy = oy + off.height / 2;
    pts.bottom = oy + off.height; pts.R = Math.max(off.width, off.height) / 2; pts.step = step;
    return pts;
  }

  // ---------- الحركة ----------
  function run(pts) {
    setTimeout(finish, T.end + 1500); // أمان بعد بدء الحركة الفعلي
    var HOT = [[236, 72, 153], [14, 165, 233]], ramps = {}, DUST = "rgb(110,130,185)";
    function ramp(own, hi) {
      var key = (own[0] >> 4) + "," + (own[1] >> 4) + "," + (own[2] >> 4) + "," + hi;
      if (ramps[key]) return ramps[key];
      var h = HOT[hi], arr = [];
      for (var l = 0; l <= 8; l++) {
        var m = l / 8;
        arr.push("rgb(" + Math.round(h[0] * (1 - m) + own[0] * m) + "," + Math.round(h[1] * (1 - m) + own[1] * m) + "," + Math.round(h[2] * (1 - m) + own[2] * m) + ")");
      }
      return (ramps[key] = arr);
    }
    var cx = pts.cx, cy = pts.cy, R = pts.R, step = pts.step, bottom = pts.bottom, minY = cy - R;
    var ps = pts.map(function (p) {
      var a = Math.random() * Math.PI * 2, sp = (0.1 + Math.random() * 0.45) * dpr;
      return {
        x: Math.random() * W, y: Math.random() * H, tx: p.tx, ty: p.ty,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        delay: T.gather + ((p.ty - minY) / (2 * R)) * 1100 + Math.random() * 900,
        ramp: ramp(p.c, Math.random() < 0.5 ? 0 : 1),
        tw: Math.random() * 6.28, ds: (0.7 + Math.random() * 1.1) * dpr, burst: false
      };
    });

    var fontPx = Math.round(Math.min(W, H) * 0.065);
    var start = performance.now(), last = start;

    function frame(now) {
      var t = now - start, f = Math.max(0, Math.min((now - last) / 16.667, 2)); last = now;
      var formedF = Math.min(1, Math.max(0, (t - T.gather) / (T.formed - T.gather)));
      var exploding = t >= T.explode, settled = t > T.formed + 500 && !exploding;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = settled ? 1 : (exploding ? 0.28 : 0.3);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;

      var z = 1 + 0.07 * Math.min(1, t / T.formed);
      ctx.setTransform(z, 0, 0, z, W / 2 * (1 - z), H / 2 * (1 - z));

      var ga = 0.2 * formedF * (exploding ? Math.max(0, 1 - (t - T.explode) / 700) : 1);
      var fl = t - T.formed; if (fl > 0 && fl < 600) ga += 0.45 * (1 - fl / 600);
      if (ga > 0.005) {
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2);
        g.addColorStop(0, "rgba(" + GLOW + "," + ga + ")"); g.addColorStop(1, "rgba(" + GLOW + ",0)");
        ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
      }

      ctx.globalCompositeOperation = "source-over";

      var sp0 = (t - T.formed - 300) / 1100, sweepOn = sp0 > 0 && sp0 < 1;
      var qs = (cx - 1.6 * R) + sp0 * 3.4 * R;

      var ra = Math.min(1, Math.max(0, (t - T.reveal) / 500));
      if (exploding) ra = Math.max(0, 1 - (t - T.explode) / 250);
      var revealed = !exploding && ra >= 1 && !!pts.img;

      var lastStyle = "";
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i], a, s, lvl, bright = false;
        if (exploding) {
          if (!p.burst) {
            p.burst = true;
            var bx = p.x - cx, by = p.y - cy, bd = Math.hypot(bx, by) || 1, bs = (3 + Math.random() * 12) * dpr;
            p.vx = bx / bd * bs + (Math.random() - .5) * 2 * dpr; p.vy = by / bd * bs + (Math.random() - .5) * 2 * dpr;
          }
          var dr = Math.pow(0.97, f); p.vx *= dr; p.vy *= dr; p.x += p.vx * f; p.y += p.vy * f;
          var e = (t - T.explode) / (T.end - T.explode - 200);
          a = Math.max(0, 1 - e); s = step * (1 - 0.4 * Math.min(1, e)); lvl = 8;
        } else if (t < p.delay) {
          p.x += p.vx * f; p.y += p.vy * f;
          if (p.x < 0) p.x += W; else if (p.x > W) p.x -= W;
          if (p.y < 0) p.y += H; else if (p.y > H) p.y -= H;
          a = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.003 + p.tw)); s = p.ds; lvl = -1;
        } else {
          var u = t - p.delay;
          var k = 0.013 * Math.min(1, u / 700);
          var dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy) || 1;
          var rx = p.x - cx, ry = p.y - cy, rl = Math.hypot(rx, ry) || 1;
          var sw = 0.5 * dpr * Math.min(1, d / (R * 0.9)) * Math.min(1, u / 500);
          var dm = Math.pow(0.9, f);
          p.vx = p.vx * dm + (dx * k - ry / rl * sw) * f;
          p.vy = p.vy * dm + (dy * k + rx / rl * sw) * f;
          p.x += p.vx * f; p.y += p.vy * f;
          var m = Math.min(1, u / 2200); lvl = Math.round(m * m * 8);
          a = 0.45 + 0.55 * Math.min(1, u / 900);
          s = p.ds + (step * 0.95 - p.ds) * Math.min(1, u / 1500);
          if (settled) a *= 0.88 + 0.12 * Math.sin(t * 0.004 + p.tw);
        }
        if (sweepOn && !exploding && Math.abs(p.x + (p.y - cy) * 0.35 - qs) < R * 0.18) { bright = true; a = 1; s *= 1.25; }
        if (a <= 0 || revealed) continue;
        var st = bright ? "#38bdf8" : (lvl < 0 ? DUST : p.ramp[lvl]);
        if (st !== lastStyle) { ctx.fillStyle = st; lastStyle = st; }
        ctx.globalAlpha = a;
        ctx.fillRect(p.x, p.y, s, s);
      }

      if (pts.img && ra > 0) {
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = ra;
        ctx.save();
        if (CIRCLE_MASK) { ctx.beginPath(); ctx.arc(cx, cy, Math.min(pts.w, pts.h) / 2 - 1, 0, 6.283); ctx.clip(); }
        ctx.drawImage(pts.img, pts.ox, pts.oy, pts.w, pts.h);
        ctx.restore();
      }

      var rt = t - T.formed;
      if (rt > 0 && rt < 1100) {
        var re = rt / 1100;
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = (1 - re) * 0.8;
        ctx.strokeStyle = "rgba(" + GLOW + ",1)"; ctx.lineWidth = (6 * (1 - re) + 1) * dpr;
        ctx.beginPath(); ctx.arc(cx, cy, R * (0.4 + re * 2.2), 0, 6.283); ctx.stroke();
      }

      var n = Math.floor((t - T.text) / 95);
      if (n > 0) {
        var txt = TITLE.slice(0, Math.min(n, TITLE.length));
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = exploding ? Math.max(0, 1 - (t - T.explode) / 500) : 1;
        ctx.font = "600 " + fontPx + "px system-ui,-apple-system,sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "top";
        try { ctx.letterSpacing = Math.round(dpr * 3) + "px"; } catch (e) {}
        var x0 = W / 2 - ctx.measureText(TITLE).width / 2, y0 = bottom + H * 0.045;
        ctx.shadowColor = "rgba(" + GLOW + ",0.45)"; ctx.shadowBlur = 10 * dpr;
        ctx.fillStyle = TEXT_COLOR; ctx.fillText(txt, x0, y0);
        if (n <= TITLE.length) ctx.fillRect(x0 + ctx.measureText(txt).width + 3 * dpr, y0, 2 * dpr, fontPx);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      if (t >= T.explode) finish(); // الموقع يبدأ بالظهور مع لحظة الانفجار تماماً
      if (box.isConnected && t < T.end) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- تحميل الشعار (بدون انتظار طويل) ----------
  var started = false;
  function go(img) {
    if (started) return; started = true;
    try { run(sample(img)); }
    catch (e) { try { run(sample(null)); } catch (e2) { finish(); } }
  }
  function load(i) {
    if (i >= LOGO_URLS.length) { go(null); return; }
    var im = new Image();
    im.onload = function () { go(im); };
    im.onerror = function () { load(i + 1); };
    im.src = LOGO_URLS[i];
  }
  setTimeout(function () { go(null); }, IMG_WAIT);
  load(0);
})();
