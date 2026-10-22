/* ==========================================================================
   随机视频播放 · 公共逻辑（mv / sg 共用）
   页面通过 window.VIDEO_CONFIG = { apis: [...] } 提供接口列表
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.VIDEO_CONFIG || { apis: [] };
  var MAX_RETRIES = 5;      // 单个视频最大重试次数
  var CACHE_SIZE = 15;      // 预加载缓存上限
  var CACHE_THRESHOLD = 3;  // 缓存低于该数量时补充预加载
  var HIDE_DELAY = 3000;    // 播放中多久后隐藏原生控件

  function $(id) { return document.getElementById(id); }

  var video = $('videoPlayer');
  if (!video) return;
  var wrap = $('videoWrapper');
  var loading = $('loading');
  var nextBtn = $('nextBtn');
  var muteBtn = $('muteBtn');
  var autoBtn = $('autoBtn');

  var state = {
    auto: false,        // 自动连播
    apiIndex: -1,       // 上一次使用的接口下标
    retries: 0,
    retryTimer: null,
    cache: [],          // 预加载缓存 { url, el }
    caching: false,
    hideTimer: null
  };

  /* ---------- 随机接口（避免连续相同），并追加时间戳防缓存 ---------- */
  function randomApi() {
    var i;
    do { i = Math.floor(Math.random() * cfg.apis.length); }
    while (i === state.apiIndex && cfg.apis.length > 1);
    state.apiIndex = i;
    var url = cfg.apis[i];
    return url + (url.indexOf('?') > -1 ? '&' : '?') + '_t=' + Date.now();
  }

  /* ---------- 预加载缓存 ---------- */
  function shouldCache() { return state.cache.length <= CACHE_THRESHOLD; }

  function preload() {
    if (state.cache.length >= CACHE_SIZE || state.caching || !shouldCache()) return;
    state.caching = true;
    var url = randomApi();
    var v = document.createElement('video');
    v.style.display = 'none';
    v.preload = 'auto';
    v.muted = true;
    v.src = url;

    v.addEventListener('loadeddata', function onLoad() {
      v.removeEventListener('loadeddata', onLoad);
      state.cache.push({ url: url, el: v });
      state.caching = false;
      if (shouldCache()) setTimeout(preload, 500);
    });
    v.addEventListener('error', function onErr() {
      v.removeEventListener('error', onErr);
      state.caching = false;
      setTimeout(preload, 1000);
    });
    document.body.appendChild(v);
  }

  /* ---------- 播放控制 ---------- */
  function showLoading(on) { loading.classList.toggle('show', on); }

  function play(url) {
    clearTimeout(state.retryTimer);
    video.src = url;
    video.loop = !state.auto;
    showLoading(true);
  }

  function loadNext() {
    var item = state.cache.shift();
    if (shouldCache()) setTimeout(preload, 100);
    if (item) {
      if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el);
      play(item.url);
    } else {
      play(randomApi());
    }
  }

  function retry() {
    state.retries++;
    if (state.retries > MAX_RETRIES * 3) {
      loading.querySelector('span').textContent = '接口繁忙，正在重试…';
    }
    state.retryTimer = setTimeout(loadNext, 1000);
  }

  /* ---------- 原生控件显隐 ---------- */
  function hideControls() { video.classList.add('hide-controls'); }
  function showControls() {
    clearTimeout(state.hideTimer);
    video.classList.remove('hide-controls');
    state.hideTimer = setTimeout(hideControls, HIDE_DELAY);
  }

  /* ---------- 按钮状态同步 ---------- */
  function syncMute() {
    var muted = video.muted;
    muteBtn.classList.toggle('on', muted);
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.querySelector('span').textContent = muted ? '取消静音' : '静音';
  }
  function syncAuto() {
    autoBtn.classList.toggle('on', state.auto);
    autoBtn.setAttribute('aria-pressed', state.auto ? 'true' : 'false');
    autoBtn.querySelector('span').textContent = state.auto ? '关闭连播' : '自动连播';
  }

  /* ---------- 事件绑定 ---------- */
  function bind() {
    video.addEventListener('loadedmetadata', function () {
      showLoading(false);
      loading.querySelector('span').textContent = '加载中...';
      state.retries = 0;
      video.play().catch(function () {});
    });
    video.addEventListener('error', retry);
    video.addEventListener('play', hideControls);
    video.addEventListener('pause', showControls);
    video.addEventListener('ended', function () {
      if (state.auto) loadNext(); else showControls();
    });

    // 点击画面 播放 / 暂停
    wrap.addEventListener('click', function () {
      if (video.paused) video.play().catch(function () {}); else video.pause();
      showControls();
    });
    document.addEventListener('mousemove', function () {
      if (!video.paused) showControls();
    });

    nextBtn.addEventListener('click', loadNext);
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      syncMute();
    });
    autoBtn.addEventListener('click', function () {
      state.auto = !state.auto;
      video.loop = !state.auto;
      syncAuto();
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    video.controls = true;
    video.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
    syncMute();
    syncAuto();
    bind();
    loadNext();
    for (var i = 0; i < CACHE_SIZE; i++) setTimeout(preload, i * 300);
    setTimeout(hideControls, 100);
  }

  init();
})();
