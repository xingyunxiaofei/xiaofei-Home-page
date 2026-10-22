/* =========================================================
   幸运小飞 · 交互脚本
   主题风格 / 明暗切换 / 粒子特效 / Markdown 渲染 / 搜索 / 复制
   ========================================================= */
(function () {
  'use strict';

  /* ============ 可配置项 ============ */
  var CONFIG = {
    // 头像图片：可以填相对路径，也可以直接填图片链接（http(s)://...）
    logo: 'assets/avatar.jpg',
    // Markdown 文章（关于页）
    mdFile: 'friends.md',
    // 粒子特效
    particles: { enabled: true, density: 14000, min: 18, max: 70, linkDist: 120, speed: 0.35 }
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ Snackbar ============ */
  var snackbar = $('#snackbar');
  var snackTimer = null;
  function toast(message) {
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.classList.add('is-visible');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(function () {
      snackbar.classList.remove('is-visible');
    }, 2200);
  }

  /* ============ 头像 ============ */
  var FALLBACK_LOGO = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="18" fill="#386a20"/>' +
    '<path d="M47.6 17.2 18.9 29.4c-1.5.6-1.5 2.7.1 3.2l8.9 2.9 2.9 9.1c.5 1.6 2.6 1.7 3.2.1l3.4-8 8.9 5.2c1.4.8 3.1-.3 3-1.9l-1-20.7c-.1-1.6-1.6-2.6-3.1-2.1Z" fill="#d7f7bd"/></svg>'
  );
  function setupLogo() {
    $$('img[data-logo]').forEach(function (img) {
      if (CONFIG.logo && img.getAttribute('src') !== CONFIG.logo) img.src = CONFIG.logo;
      img.addEventListener('error', function () {
        if (img.src !== FALLBACK_LOGO) img.src = FALLBACK_LOGO;
      });
    });
  }
  setupLogo();

  /* ============ 主题 + 配色 ============ */
  var PALETTES = {
    green: '翠绿', teal: '青碧', blue: '黛蓝', indigo: '靛青',
    violet: '紫罗兰', amber: '赭金', rose: '玫红'
  };
  var themeToggle = $('#themeToggle');
  var paletteBtn = $('#paletteBtn');
  var paletteMenu = $('#paletteMenu');
  var menuDark = $('#menuDark');

  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }
  function currentPalette() {
    var p = document.documentElement.dataset.palette;
    return PALETTES[p] ? p : 'green';
  }
  function syncChrome() {
    if (themeToggle) {
      var isDark = currentTheme() === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      themeToggle.setAttribute('title', isDark ? '切换到浅色模式' : '切换到深色模式');
    }
    if (menuDark) menuDark.setAttribute('aria-checked', currentTheme() === 'dark' ? 'true' : 'false');
    $$('#paletteMenu [data-palette]').forEach(function (item) {
      item.setAttribute('aria-checked', item.dataset.palette === currentPalette() ? 'true' : 'false');
    });
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    syncChrome();
    particles.readThemeColor();
  }
  function applyPalette(palette) {
    document.documentElement.dataset.palette = palette;
    syncChrome();
    particles.readThemeColor();
  }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      save('xf-theme', next);
      toast(next === 'dark' ? '已切换到深色模式' : '已切换到浅色模式');
    });
  }

  // 配色菜单
  function openMenu(open) {
    if (!paletteMenu || !paletteBtn) return;
    paletteMenu.hidden = !open;
    paletteBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var active = $('#paletteMenu [aria-checked="true"]');
      if (active) active.classList.add('is-active');
    }
  }
  if (paletteBtn) {
    paletteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openMenu(paletteMenu.hidden);
    });
  }
  if (paletteMenu) {
    paletteMenu.addEventListener('click', function (e) {
      var item = e.target.closest('[data-palette]');
      if (item) {
        applyPalette(item.dataset.palette);
        save('xf-palette', item.dataset.palette);
        toast('主题风格：' + PALETTES[item.dataset.palette]);
        openMenu(false);
        return;
      }
      if (e.target.closest('#menuDark')) {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        save('xf-theme', next);
        openMenu(false);
      }
    });
    paletteMenu.addEventListener('mouseover', function (e) {
      $$('#paletteMenu .menu__item').forEach(function (i) { i.classList.remove('is-active'); });
      var item = e.target.closest('.menu__item');
      if (item) item.classList.add('is-active');
    });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-wrap')) openMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') openMenu(false);
  });
  syncChrome();

  /* ============ 分页路由 ============ */
  var PAGES = ['home', 'links', 'about'];
  var tabs = $$('.tab');
  var pages = $$('.page');

  function pageFromHash() {
    var key = (location.hash || '').replace('#', '');
    return PAGES.indexOf(key) > -1 ? key : null;
  }

  function setPage(name, opts) {
    opts = opts || {};
    pages.forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'page-' + name);
    });
    tabs.forEach(function (t) {
      var on = t.dataset.page === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    document.title = name === 'links'
      ? '站长推荐 · 幸运小飞'
      : name === 'about'
        ? '关于小飞 · 幸运小飞'
        : '幸运小飞 · 恭喜你发现了宝藏';
    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    requestAnimationFrame(function () {
      revealIn($('#page-' + name));
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.dataset.page;
      if (pageFromHash() === name) setPage(name);
      else location.hash = name;
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var i = tabs.indexOf(tab);
      var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      location.hash = tabs[next].dataset.page;
    });
  });

  window.addEventListener('hashchange', function () {
    var name = pageFromHash();
    if (name) setPage(name);
  });
  setPage(pageFromHash() || 'home', { scroll: false });

  var brand = $('.brand');
  if (brand) {
    brand.addEventListener('click', function (e) {
      e.preventDefault();
      if (location.hash === '#home' || !location.hash) setPage('home');
      else location.hash = 'home';
    });
  }

  /* ============ 搜索引擎 ============ */
  var ENGINES = {
    bing:       { name: '必应',       url: function (q) { return 'https://www.bing.com/search?q=' + q; } },
    baidu:      { name: '百度',       url: function (q) { return 'https://www.baidu.com/s?wd=' + q; } },
    shenma:     { name: '神马',       url: function (q) { return 'https://m.sm.cn/s?q=' + q; } },
    quark:      { name: '夸克',       url: function (q) { return 'https://quark.sm.cn/s?q=' + q; } },
    sogou:      { name: '搜狗',       url: function (q) { return 'https://www.sogou.com/web?query=' + q; } },
    '360':      { name: '360',        url: function (q) { return 'https://www.so.com/s?q=' + q; } },
    brave:      { name: 'Brave',      url: function (q) { return 'https://search.brave.com/search?q=' + q; } },
    google:     { name: '谷歌',       url: function (q) { return 'https://www.google.com/search?q=' + q; } },
    yahoo:      { name: '雅虎',       url: function (q) { return 'https://search.yahoo.com/search?p=' + q; } },
    duckduckgo: { name: 'DuckDuckGo', url: function (q) { return 'https://duckduckgo.com/?q=' + q; } },
    youtube:    { name: 'YouTube',    url: function (q) { return 'https://www.youtube.com/results?search_query=' + q; } },
    yandex:     { name: 'Yandex',     url: function (q) { return 'https://yandex.com/search/?text=' + q; } }
  };

  var form = $('#searchForm');
  var input = $('#searchInput');
  var engineBtn = $('#engineBtn');
  var engineMenu = $('#engineMenu');
  var engineLabel = $('#engineLabel');
  var engine = 'bing';

  try {
    var savedEngine = localStorage.getItem('xf-engine');
    if (savedEngine && ENGINES[savedEngine]) engine = savedEngine;
  } catch (e) {}

  function syncEngine() {
    if (engineLabel) engineLabel.textContent = ENGINES[engine].name;
    $$('#engineMenu li').forEach(function (li) {
      li.setAttribute('aria-selected', li.dataset.engine === engine ? 'true' : 'false');
    });
  }
  syncEngine();

  function openEngineMenu(open) {
    if (!engineMenu || !engineBtn) return;
    engineMenu.hidden = !open;
    engineBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var selected = $('#engineMenu li[aria-selected="true"]');
      if (selected) selected.scrollIntoView({ block: 'nearest' });
    }
  }

  if (engineBtn) {
    engineBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openEngineMenu(engineMenu.hidden);
    });
    engineBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (engineMenu.hidden) {
          e.preventDefault();
          openEngineMenu(true);
          var first = $('#engineMenu li');
          if (first) first.focus();
        }
      }
    });
  }

  if (engineMenu) {
    engineMenu.addEventListener('click', function (e) {
      var li = e.target.closest('li[data-engine]');
      if (!li) return;
      engine = li.dataset.engine;
      save('xf-engine', engine);
      syncEngine();
      openEngineMenu(false);
      if (input) input.focus();
    });
    engineMenu.addEventListener('keydown', function (e) {
      var items = $$('#engineMenu li');
      var index = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(index + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Escape') {
        openEngineMenu(false);
        if (engineBtn) engineBtn.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (document.activeElement) document.activeElement.click();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.engine')) openEngineMenu(false);
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = (input.value || '').trim();
      if (!q) {
        input.focus();
        input.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
           { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 260, easing: 'ease-in-out' }
        );
        toast('先输入要搜索的内容');
        return;
      }
      window.open(ENGINES[engine].url(encodeURIComponent(q)), '_blank', 'noopener');
    });
  }

  // “/” 快速聚焦搜索
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      if (location.hash !== '#home' && location.hash !== '') location.hash = 'home';
      setTimeout(function () { if (input) input.focus(); }, 60);
    }
    if (e.key === 'Escape') {
      openEngineMenu(false);
      if (document.activeElement === input) input.blur();
    }
  });

  /* ============ 分类切换 ============ */
  var segments = $$('.segment');
  var panels = $$('.cat-panel');

  function showCategory(cat) {
    segments.forEach(function (s) {
      var on = s.dataset.cat === cat;
      s.classList.toggle('is-selected', on);
      s.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.catPanel === cat);
    });
    requestAnimationFrame(function () {
      revealIn($('.cat-panel.is-active'));
    });
  }

  segments.forEach(function (seg) {
    seg.addEventListener('click', function () { showCategory(seg.dataset.cat); });
    seg.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var i = segments.indexOf(seg);
      var next = e.key === 'ArrowRight' ? (i + 1) % segments.length : (i - 1 + segments.length) % segments.length;
      segments[next].focus();
      showCategory(segments[next].dataset.cat);
    });
  });

  /* ============ 二维码 ============ */
  var qrItems = $$('.has-qr');
  function closeQr(except) {
    qrItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var btn = $('.icon-btn', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  qrItems.forEach(function (item) {
    var btn = $('.icon-btn', item);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !item.classList.contains('is-open');
      closeQr(item);
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () { closeQr(null); });

  /* ============ 复制 ============ */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }
  function bindCopy(scope) {
    $$('[data-copy]', scope || document).forEach(function (el) {
      if (el.dataset.copyBound) return;
      el.dataset.copyBound = '1';
      el.addEventListener('click', function () {
        var value = el.dataset.copy;
        copyText(value).then(function () {
          toast('已复制：' + value);
        }).catch(function () {
          toast('复制失败，请手动选择');
        });
      });
    });
  }
  bindCopy(document);

  /* ============ 建站天数 / 年份 ============ */
  var START = new Date(2023, 0, 1);
  var days = Math.max(1, Math.floor((Date.now() - START.getTime()) / 86400000) + 1);
  var daysHero = $('#daysHero');
  var daysFooter = $('#daysFooter');
  if (daysHero) daysHero.textContent = days.toLocaleString('zh-CN');
  if (daysFooter) daysFooter.textContent = days.toLocaleString('zh-CN');
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ 入场动效 ============ */
  var observer = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  }

  function revealIn(scope) {
    if (!scope) return;
    var items = $$('.site-card, .friend-card, .pay-card', scope);
    items.forEach(function (el, i) {
      if (el.classList.contains('is-in')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 28, 240) + 'ms';
      if (observer) observer.observe(el);
      else el.classList.add('is-in');
      setTimeout(function () {
        if (!el.classList.contains('is-in')) el.classList.add('is-in');
      }, 900 + Math.min(i * 28, 240));
    });
  }
  revealIn(document.querySelector('.page.is-active'));

  /* ============ 滚动阴影 ============ */
  var appBar = $('.app-bar');
  function onScroll() {
    if (!appBar) return;
    appBar.classList.toggle('is-scrolled', window.scrollY > 4);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ 水波纹 ============ */
  function attachRipple(el) {
    el.style.position = el.style.position || 'relative';
    el.addEventListener('pointerdown', function (e) {
      if (reduceMotion) return;
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    });
  }
  $$('.md-ripple, .site-card, .friend-card, .copy-row, .search-bar__go, .icon-btn').forEach(attachRipple);

  /* =========================================================
     Markdown 渲染（关于页）
     ========================================================= */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function inlineMd(text) {
    var s = escapeHtml(text);
    s = s.replace(/`([^`]+)`/g, function (m, c) { return '<code>' + c + '</code>'; });
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g, function (m, alt, url) {
      return '<img src="' + url + '" alt="' + alt.replace(/"/g, '') + '" loading="lazy">';
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return s;
  }

  function renderMarkdown(src) {
    var lines = src.replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var listType = null;
    var para = [];
    var codeLang = null, codeBuf = null;
    var htmlBuf = null;
    var firstH1Skipped = false;

    function flushPara() {
      if (!para.length) return;
      out.push('<p>' + inlineMd(para.join('\n')).replace(/\n/g, '<br>') + '</p>');
      para = [];
    }
    function closeList() {
      if (listType) out.push('</' + listType + '>');
      listType = null;
    }
    function openList(type) {
      if (listType !== type) { closeList(); out.push('<' + type + '>'); listType = type; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // 代码块
      if (codeBuf !== null) {
        if (/^\s*```/.test(line)) {
          out.push('<pre><code' + (codeLang ? ' class="language-' + codeLang + '"' : '') + '>' +
            escapeHtml(codeBuf.join('\n')) + '</code></pre>');
          codeBuf = null;
        } else {
          codeBuf.push(line);
        }
        continue;
      }
      // 原始 HTML 块
      if (htmlBuf !== null) {
        if (/^\s*$/.test(line)) {
          out.push(htmlBuf.join('\n'));
          htmlBuf = null;
        } else {
          htmlBuf.push(line);
        }
        continue;
      }
      if (/^\s*```(\w*)\s*$/.test(line)) {
        flushPara(); closeList();
        codeLang = (line.match(/^\s*```(\w*)/) || [])[1] || null;
        codeBuf = [];
        continue;
      }

      var trimmed = line.trim();

      if (/^\s*$/.test(line)) { flushPara(); closeList(); continue; }

      if (/^(---|\*\*\*|___)\s*$/.test(trimmed)) { flushPara(); closeList(); out.push('<hr>'); continue; }

      // 原始 HTML 起始行
      if (/^<(div|figure|img|p|span|table|blockquote|hr|br|iframe|button|ul|ol|section|h\d)\b/i.test(trimmed)) {
        flushPara(); closeList();
        htmlBuf = [line];
        continue;
      }

      var h = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flushPara(); closeList();
        var level = h[1].length;
        var raw = h[2].trim();
        var idMatch = raw.match(/id="([^"]+)"/);
        var id = idMatch ? idMatch[1] : null;
        var text = raw.replace(/<a\s+id="[^"]*"\s*><\/a>/g, '').trim();
        if (level === 1 && !firstH1Skipped) { firstH1Skipped = true; continue; }
        if (!id) id = 'sec-' + (out.length);
        out.push('<h' + level + ' id="' + id + '">' + inlineMd(text) + '</h' + level + '>');
        continue;
      }

      if (/^\s{0,3}>\s?/.test(line)) {
        flushPara(); closeList();
        var quote = [];
        while (i < lines.length && /^\s{0,3}>/.test(lines[i])) {
          quote.push(lines[i].replace(/^\s{0,3}>\s?/, ''));
          i++;
        }
        i--;
        out.push('<blockquote>' + inlineMd(quote.join(' ').trim()) + '</blockquote>');
        continue;
      }

      var ul = line.match(/^\s*[-*+]\s+(.*)$/);
      var ol = line.match(/^\s*\d+\.\s+(.*)$/);
      if (ul) { flushPara(); openList('ul'); out.push('<li>' + inlineMd(ul[1]) + '</li>'); continue; }
      if (ol) { flushPara(); openList('ol'); out.push('<li>' + inlineMd(ol[1]) + '</li>'); continue; }

      para.push(trimmed);
    }
    flushPara(); closeList();
    if (codeBuf !== null) {
      out.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
    }
    if (htmlBuf !== null) out.push(htmlBuf.join('\n'));
    return out.join('\n');
  }

  function loadAbout() {
    var loading = $('#mdLoading');
    var content = $('#mdContent');
    var error = $('#mdError');
    var nav = $('.chip-nav');
    if (!content) return;

    fetch(CONFIG.mdFile + '?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (md) {
        var html = renderMarkdown(md);
        content.innerHTML = html;
        content.hidden = false;
        if (loading) loading.hidden = true;
        if (error) error.hidden = true;

        // 用 md 里的标题重建目录
        if (nav) {
          var heads = $$('h2[id], h3[id]', content);
          if (heads.length) {
            nav.innerHTML = heads.map(function (h) {
              return '<a class="chip chip--link" href="#' + h.id + '">' + h.textContent.trim() + '</a>';
            }).join('');
            $$('.chip-nav a').forEach(function (link) {
              link.addEventListener('click', function (e) {
                var target = document.getElementById(link.getAttribute('href').slice(1));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
              });
            });
          }
        }

        bindCopy(content);
        $$('.pay-card img', content).forEach(function (img) {
          img.addEventListener('error', function () {
            var card = img.closest('.pay-card');
            if (card) card.classList.add('is-error');
          });
        });
        revealIn(content);
      })
      .catch(function () {
        if (loading) loading.hidden = true;
        if (error) error.hidden = false;
        if (nav) nav.hidden = true;
      });
  }
  loadAbout();

  /* =========================================================
     粒子特效（轻量 Canvas 实现，颜色跟随主题）
     ========================================================= */
  var particles = (function () {
    var canvas = $('#particles');
    if (!canvas || !CONFIG.particles.enabled) {
      return { readThemeColor: function () {} };
    }
    var ctx = canvas.getContext('2d');
    var dots = [];
    var w = 0, h = 0, dpr = 1;
    var color = '#386a20';
    var raf = null;
    var mouse = { x: -9999, y: -9999 };
    var opts = CONFIG.particles;

    function readThemeColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--md-primary');
      color = (v || '').trim() || '#386a20';
    }
    readThemeColor();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var count = Math.round((w * h) / opts.density);
      count = Math.max(opts.min, Math.min(opts.max, count));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * opts.speed,
          vy: (Math.random() - 0.5) * opts.speed,
          r: 1 + Math.random() * 1.6
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx;
        d.y += d.vy;

        // 鼠标轻微吸引
        var dx = mouse.x - d.x, dy = mouse.y - d.y;
        var md = Math.sqrt(dx * dx + dy * dy);
        if (md < 110 && md > 0.1) {
          d.x += (dx / md) * 0.35;
          d.y += (dy / md) * 0.35;
        }

        if (d.x < -20) d.x = w + 20; else if (d.x > w + 20) d.x = -20;
        if (d.y < -20) d.y = h + 20; else if (d.y > h + 20) d.y = -20;

        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < dots.length; j++) {
          var o = dots[j];
          var ox = d.x - o.x, oy = d.y - o.y;
          var dist = Math.sqrt(ox * ox + oy * oy);
          if (dist < opts.linkDist) {
            ctx.globalAlpha = 0.12 * (1 - dist / opts.linkDist);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (raf || reduceMotion) { drawStatic(); return; }
      raf = requestAnimationFrame(step);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }
    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      for (var i = 0; i < dots.length; i++) {
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    window.addEventListener('resize', function () {
      resize();
      if (reduceMotion) drawStatic();
    });
    window.addEventListener('pointermove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    resize();
    start();
    return { readThemeColor: function () { readThemeColor(); if (reduceMotion) drawStatic(); } };
  })();

})();
