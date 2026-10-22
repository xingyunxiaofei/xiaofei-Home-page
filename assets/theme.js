/* ==========================================================================
   幸运小飞 · MD3 动态主题（Material Design 3 风格随机配色）
   --------------------------------------------------------------------------
   · 每次访问都会随机生成一整套 MD3 配色：主色 / 辅助色 / 第三色 / 中性色
   · 基于 OKLCH 感知均匀色彩空间近似 MD3 的 tonal palette，旧浏览器自动降级 HSL
   · 深色 / 浅色可切换并记忆偏好；无偏好时跟随系统，再退化为本地时间（7:00–19:00 浅色）
   · 视频页可用 window.MD3_HUE=[min,max] 限定色相区间（支持跨 0°），
     或用 window.MD3_FORCE='dark' 强制深色且不自动切换
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var OKLCH = !!(window.CSS && window.CSS.supports &&
                 window.CSS.supports('color', 'oklch(60% 0.1 240)'));

  /* ---------- MD3 色调板（tonal palette） ---------- */
  // MD3 的彩度曲线：两端趋近中性，中段（40~60 色调）彩度最高
  var CURVE = [[0, 0], [10, .34], [20, .56], [30, .76], [40, .92], [50, .96],
               [60, .88], [70, .72], [80, .50], [90, .30], [95, .17], [99, .07], [100, 0]];

  function curveAt(t) {
    for (var i = 1; i < CURVE.length; i++) {
      if (t <= CURVE[i][0]) {
        var a = CURVE[i - 1], b = CURVE[i];
        return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
      }
    }
    return 0;
  }

  function tone(hue, chroma, t) {
    var c = +(chroma * curveAt(t)).toFixed(4);
    if (OKLCH) return 'oklch(' + t + '% ' + c + ' ' + hue.toFixed(1) + ')';
    // 旧浏览器降级：HSL 近似（黄色系适当降饱和，避免发灰）
    var h = ((hue % 360) + 360) % 360;
    var s = Math.round(Math.min(92, chroma * 430 + 20) * (h > 45 && h < 75 ? .8 : 1));
    return 'hsl(' + Math.round(h) + ' ' + s + '% ' + t + '%)';
  }

  // 随机色相（可限定区间；区间支持跨 0°，如 [318,28] = 粉→红→橙）
  var range = window.MD3_HUE;
  var hue = Math.random() * 360;
  if (range) {
    var span = (((range[1] - range[0]) % 360) + 360) % 360;
    hue = (range[0] + Math.random() * span) % 360;
  }

  var C_P = .135, C_S = .05, C_T = .095, C_N = .007, C_V = .017;
  var hP = hue, hS = hue + 16, hT = hue + 62;

  /* ---------- MD3 颜色角色 ---------- */
  var SCHEME = {
    light: {
      '--primary': tone(hP, C_P, 40),
      '--on-primary': tone(hP, C_P, 100),
      '--primary-container': tone(hP, C_P, 90),
      '--on-primary-container': tone(hP, C_P, 10),
      '--secondary': tone(hS, C_S, 40),
      '--secondary-container': tone(hS, C_S, 90),
      '--on-secondary-container': tone(hS, C_S, 10),
      '--tertiary': tone(hT, C_T, 40),
      '--tertiary-container': tone(hT, C_T, 90),
      '--on-tertiary-container': tone(hT, C_T, 10),
      '--surface': tone(hue, C_N, 98),
      '--surface-low': tone(hue, C_N, 96),
      '--surface-c': tone(hue, C_N, 94),
      '--surface-high': tone(hue, C_N, 92),
      '--surface-highest': tone(hue, C_N, 90),
      '--on-surface': tone(hue, C_N, 10),
      '--on-surface-var': tone(hue, C_V, 30),
      '--outline': tone(hue, C_V, 50),
      '--outline-var': tone(hue, C_V, 80),
      '--inverse-surface': tone(hue, C_N, 20),
      '--inverse-on-surface': tone(hue, C_N, 95),
      '--error': '#b3261e'
    },
    dark: {
      '--primary': tone(hP, C_P, 80),
      '--on-primary': tone(hP, C_P, 20),
      '--primary-container': tone(hP, C_P, 30),
      '--on-primary-container': tone(hP, C_P, 90),
      '--secondary': tone(hS, C_S, 80),
      '--secondary-container': tone(hS, C_S, 30),
      '--on-secondary-container': tone(hS, C_S, 90),
      '--tertiary': tone(hT, C_T, 80),
      '--tertiary-container': tone(hT, C_T, 30),
      '--on-tertiary-container': tone(hT, C_T, 90),
      '--surface': tone(hue, C_N, 6),
      '--surface-low': tone(hue, C_N, 10),
      '--surface-c': tone(hue, C_N, 12),
      '--surface-high': tone(hue, C_N, 17),
      '--surface-highest': tone(hue, C_N, 22),
      '--on-surface': tone(hue, C_N, 90),
      '--on-surface-var': tone(hue, C_V, 80),
      '--outline': tone(hue, C_V, 60),
      '--outline-var': tone(hue, C_V, 30),
      '--inverse-surface': tone(hue, C_N, 90),
      '--inverse-on-surface': tone(hue, C_N, 20),
      '--error': '#f2b8b5'
    }
  };

  var ICON_SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  var mode = 'dark';
  var toggleBtn = null;

  function apply(m) {
    mode = m;
    root.classList.remove('dark', 'light');
    root.classList.add(m);
    var s = SCHEME[m];
    for (var k in s) root.style.setProperty(k, s[k]);
    if (toggleBtn) toggleBtn.innerHTML = m === 'dark' ? ICON_SUN : ICON_MOON;
    window.dispatchEvent(new CustomEvent('md3:theme', { detail: { mode: m } }));
  }

  function setMode(m, save) {
    apply(m);
    try { if (save) localStorage.setItem('theme', m); } catch (e) {}
  }

  function bindToggle() {
    toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    toggleBtn.innerHTML = mode === 'dark' ? ICON_SUN : ICON_MOON;
    toggleBtn.setAttribute('aria-label', '切换深色 / 浅色主题');
    toggleBtn.addEventListener('click', function () {
      setMode(mode === 'dark' ? 'light' : 'dark', true);
    });
  }

  // 初始主题：记忆偏好 > 系统偏好 > 深色
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var preferLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(saved === 'light' || saved === 'dark' ? saved : (preferLight ? 'light' : 'dark'));

  // 强制模式（视频页）：只负责上色，不绑定切换、不自动判断
  if (window.MD3_FORCE) {
    apply(window.MD3_FORCE);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindToggle);
    } else {
      bindToggle();
    }

    // 既没记忆偏好、系统也没明确偏好时，按本地时间粗判（7:00–19:00 用浅色）
    // 原来的 ipapi.co 定位 + SunCalc 方案已移除：省掉一次跨境请求和外部依赖
    var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!saved && !preferLight && !sysDark) {
      var hour = new Date().getHours();
      if (hour >= 7 && hour < 19) apply('light');
    }
  }

  // 暴露给页面脚本（粒子取色、扩展用）
  window.MD3 = {
    hue: hue,
    mode: function () { return mode; },
    color: function (chroma, t, offset) { return tone(hue + (offset || 0), chroma, t); },
    setMode: setMode
  };
})();
