/* ==========================================================================
   幸运小飞 · 主站脚本
   --------------------------------------------------------------------------
   维护友站 / 推荐链接只需要改下面的 SITES 和 CATEGORIES 两个数组。
   ========================================================================== */
(function () {
  'use strict';

  /* =====================================================================
     一、链接数据（维护入口）
     ===================================================================== */
  var SITES = [
    { f: '导航', t: '小飞导航', d: '我自己收藏的那些好用的网址', u: 'http://dh.xiaofei.men/' },
    { f: '博客', t: '小飞博客', d: '我自己随便写的一些文章', u: 'http://bk.xiaofei.men/' },
    { f: '影视', t: '小飞影视', d: '有账号的可继续使用', u: 'http://tv.xiaofei.men/' },
    { f: '帅哥', t: '随机帅哥', d: '随机刷新帅哥视频', u: 'me/sg.html' },
    { f: '相关', t: '小飞相关', d: '影视仓 / newbox 配置源与常见问题', u: '#tvbox' },
    { f: '美女', t: '随机美女', d: '随机刷新美女视频', u: 'me/mv.html' }
  ];

  var CATEGORIES = [
    {
      id: 'muve', name: '在线影视', links: [
        { f: '好好', t: '好好看', d: '在线观影,无广告,有全平台软件支持', u: 'https://hhkan.tv/' },
        { f: '555', t: '555影视', d: '一个多年免费的影视网站,有安卓app', u: 'https://dh.xiaofei.men/?c=click&id=4' },
        { f: '搜片', t: '搜片', d: '在线观看多年老网站,支持安卓和tv客户端', u: 'https://搜片.com' },
        { f: '可可', t: '可可影视', d: '在线观看多年老网站,有全客户端app', u: 'https://kekys.com' },
        { f: '厂长', t: '厂长资源', d: '在线观看多年老网站,最近好像被打进不去', u: 'https://cz01.vip' },
        { f: '饭团', t: '饭团影院', d: '不怎么出名但是好几年了还是能用', u: 'https://www.fantuan.my/' },
        { f: '网飞', t: '网飞猫', d: '别人推荐的测试下来还行就加进来了', u: 'https://WWW.NCAT.APP' }
      ]
    },
    {
      id: 'music', name: '在线音乐', links: [
        { f: 'Al', t: 'AlgerMusicPlayer', d: '新的黑马,在线播放,有除ios外的所有客户端', u: 'http://music.alger.fun/#/' },
        { f: 'GB', t: 'GD音乐台', d: '网页打开有点慢但能正常播放不卡顿', u: 'https://music.gdstudio.org/' },
        { f: '布谷', t: '布谷音乐', d: '主要用来下载的但能在线播放', u: 'https://www.buguyy.top/' },
        { f: '枫音', t: '枫音音乐', d: '在线播放但是不能调声音需要调设备声音', u: 'https://mu-jie.cc/musicBox/#/' },
        { f: '种子', t: '种子音乐', d: '在线播放音乐平台挺久了', u: 'https://zz123.com/' }
      ]
    },
    {
      id: 'tools', name: '在线工具', links: [
        { f: '工具', t: '在线工具网', d: '提供各种在线工具，包括文本处理、图片处理等', u: 'https://tool.lu/' },
        { f: '草料', t: 'Best Video', d: '免费的短视频解析网站', u: 'https://www.bestvideow.com/' },
        { f: '解析', t: 'GreenVideo视频下载', d: '在线短视频解析下载网站', u: 'https://greenvideo.cc/' },
        { f: '解析', t: '短视频下载', d: '在线短视频解析下载网站', u: 'https://api.spapi.cn/' },
        { f: '格式', t: 'Convertio', d: '在线文件格式转换工具，支持多种格式', u: 'https://convertio.co/zh/' },
        { f: '草料', t: '草料二维码', d: '二维码生成与解析工具', u: 'https://cli.im/' },
        { f: '工具', t: '工具哇', d: '各种奇奇怪怪的工具', u: 'https://toolwa.com/' }
      ]
    },
    {
      id: 'life', name: '其他类型', links: [
        { f: 'BT', t: 'BT之家', d: '一个聚合了各种网盘资源的网站', u: 'https://www.1lou.cc/' },
        { f: '邮件', t: '临时邮箱', d: '用于临时注册账号或匿名邮箱使用', u: 'https://lsyx.me/' },
        { f: '诊断', t: '百度诊断', d: '用于检测网站的安全性', u: 'https://zhenzhan.baidu.com/' },
        { f: '简历', t: '免费简历模版', d: '一个AI简历生成网址,无需注册登录', u: 'https://www.jianli.com/' },
        { f: '文件', t: '在线文件传送', d: '网页传文件无需登录,可跨设备传输', u: 'https://upfile.live/zh-cn/' },
        { f: '热榜', t: '聚合热榜', d: '随时查看微博,百度,腾讯头条,新闻,影视等的热榜', u: 'https://tophub.today/' }
      ]
    },
    {
      id: 'friendurl', name: '友情链接', links: [
        { f: '江江', t: '江江主页', d: '一个很厉害的家伙', u: 'http://江江.com/' },
        { f: '小妹', t: '软件小妹', d: '软件小妹,专注于收集app的妹纸', u: 'http://add.qianqian.club/' },
        { f: '蚊子', t: '蚊子主页', d: '蚊子的主页', u: 'https://dash.140537.xyz/' }
      ]
    }
  ];

  var ENGINES = {
    bing: 'https://www.bing.com/search?q=',
    shenma: 'https://m.sm.cn/s?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    quark: 'https://quark.sm.cn/s?q=',
    sogou: 'https://www.sogou.com/web?query=',
    '360': 'https://www.so.com/s?q=',
    brave: 'https://search.brave.com/search?q=',
    google: 'https://www.google.com/search?q=',
    yahoo: 'https://search.yahoo.com/search?p=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    yandex: 'https://yandex.com/search/?text='
  };

  /* =====================================================================
     二、小工具
     ===================================================================== */
  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // 同步复制：兼容 http 站点、旧浏览器与 iOS Safari
  function legacyCopy(text) {
    var ta = el('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;width:1px;height:1px;opacity:0';
    document.body.appendChild(ta);
    var ok = false;
    try {
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        ta.contentEditable = 'true';
        ta.readOnly = false;
        var range = document.createRange();
        range.selectNodeContents(ta);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        ta.setSelectionRange(0, 999999);
      } else {
        ta.select();
        ta.setSelectionRange(0, text.length);
      }
      ok = document.execCommand('copy');
    } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  // 先同步尝试（点击手势内最可靠），失败再用剪贴板 API
  function copyText(text) {
    if (legacyCopy(text)) return Promise.resolve(true);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  // 资源根路径：以 script.js 自身位置推算，保证 me/ 子页面也能正确加载
  var ASSET_BASE = (function () {
    var s = document.querySelector('script[src*="script.js"]');
    return s && s.src ? s.src.replace(/[^/]*$/, '') : 'assets/';
  })();
  var SITE_ROOT = ASSET_BASE.replace(/assets\/$/, '');

  // 按需加载脚本（带缓存，只下一次）
  var scriptCache = {};
  function loadScript(url) {
    if (!scriptCache[url]) {
      scriptCache[url] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('加载失败：' + url)); };
        document.head.appendChild(s);
      });
    }
    return scriptCache[url];
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  var toastTimer;
  function showToast(msg) {
    var toast = $('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  }

  /* =====================================================================
     三、链接卡片渲染 + 点击（事件委托，含涟漪）
     ===================================================================== */
  function renderCard(item) {
    var card = el('div', 'card');
    card.setAttribute('data-link', item.u);
    card.setAttribute('role', 'link');
    card.tabIndex = 0;
    card.title = item.t;
    card.appendChild(el('div', 'favicon', item.f));
    var body = el('div', 'card-body');
    body.appendChild(el('span', 'card-title', item.t));
    body.appendChild(el('p', 'card-desc', item.d));
    card.appendChild(body);
    return card;
  }

  function openCard(card) {
    var url = card.getAttribute('data-link');
    if (!url) return;
    // 站内页面（#tvbox 之类）直接切页，不新开窗口
    if (url.charAt(0) === '#') {
      if (location.hash === url) {
        activatePage(url.slice(1));
      } else {
        location.hash = url;   // 交给 hashchange 处理，浏览器后退也能回来
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.open(url, '_blank', 'noopener');
  }

  function ripple(card, e) {
    var r = card.getBoundingClientRect();
    var d = Math.max(r.width, r.height) * 2;
    var cx = e.clientX || (r.left + r.width / 2);
    var cy = e.clientY || (r.top + r.height / 2);
    var s = el('span', 'ripple');
    s.style.width = s.style.height = d + 'px';
    s.style.left = (cx - r.left - d / 2) + 'px';
    s.style.top = (cy - r.top - d / 2) + 'px';
    card.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.card') : null;
    if (!card) return;
    ripple(card, e);
    openCard(card);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var card = e.target.closest ? e.target.closest('.card') : null;
    if (card) { e.preventDefault(); openCard(card); }
  });

  /* =====================================================================
     四、首页 / 站长推荐渲染
     ===================================================================== */
  function renderHome() {
    var grid = $('home-grid');
    SITES.forEach(function (s) { grid.appendChild(renderCard(s)); });
  }

  function renderCategories() {
    var tabs = $('category-tabs');
    var box = $('category-contents');
    CATEGORIES.forEach(function (cat, i) {
      var tab = el('button', 'tab' + (i === 0 ? ' active' : ''), cat.name);
      tab.setAttribute('data-category', cat.id);
      tabs.appendChild(tab);

      var wrap = el('div', 'cats' + (i === 0 ? ' active' : ''));
      wrap.id = cat.id + '-content';
      var grid = el('div', 'grid');
      cat.links.forEach(function (l) { grid.appendChild(renderCard(l)); });
      wrap.appendChild(grid);
      box.appendChild(wrap);
    });

    tabs.addEventListener('click', function (e) {
      var tab = e.target.closest ? e.target.closest('.tab') : null;
      if (!tab) return;
      tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      box.querySelectorAll('.cats').forEach(function (c) { c.classList.remove('active'); });
      $(tab.getAttribute('data-category') + '-content').classList.add('active');
    });
  }

  /* =====================================================================
     五、页面导航
     ===================================================================== */
  var mdLoaded = false;   // friends.md 只加载一次
  var tvLoaded = false;   // tvbox.md 只加载一次

  // 切到某个页面（导航按钮、卡片、地址栏 hash 都走这里）
  function activatePage(name) {
    var target = $(name + '-page');
    if (!target) return false;
    document.querySelectorAll('.nav-item').forEach(function (i) {
      var on = i.getAttribute('data-page') === name;
      i.classList.toggle('active', on);
      i.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.toggle('active', p.id === name + '-page');
    });
    if (name === 'friends' && !mdLoaded) { mdLoaded = true; loadMarkdown(); }
    if (name === 'tvbox' && !tvLoaded) { tvLoaded = true; loadTvbox(); }
    return true;
  }

  function setupNav() {
    document.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var name = item.getAttribute('data-page');
        activatePage(name);
        // 地址栏保持同步（用 replaceState 避免堆一堆历史记录）
        if (history.replaceState) {
          history.replaceState(null, '', name === 'home' ? location.pathname : '#' + name);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // 支持 https://xiaofei.men/#tvbox 这样的直达链接
    window.addEventListener('hashchange', function () {
      var name = location.hash.replace('#', '');
      activatePage(name || 'home');
    });
    if (location.hash) activatePage(location.hash.replace('#', ''));
  }

  /* =====================================================================
     六、Markdown 内容页
     ---------------------------------------------------------------------
     内容 md 固定放在 me/ 文件夹：me/friends.md（关于页）、me/tvbox.md（小飞相关）
     以后新增的内容页 md 也一律放 me/ 下，改这里的文件名即可。
     ===================================================================== */
  function loadMarkdown() {
    var box = $('md-content');
    loadScript(ASSET_BASE + 'marked.js')
      .then(function () { return fetch(SITE_ROOT + 'me/friends.md', { cache: 'no-cache' }); })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (md) {
        box.innerHTML = marked.parse(md);
      })
      .catch(function (err) {
        box.innerHTML = '<p style="color:var(--error)">文章加载失败：' + err.message + '，请稍后重试。</p>';
      });
  }

  /* =====================================================================
     六之二、小飞相关：加载 me/tvbox.md 并渲染
     md 里支持 4 个指令（单独一行）：
       @copy 地址   → 点击复制    @open 地址 → 点击打开
       @pwd  文字   → 密码胶囊    @q    问题 → 自动编号小标题
     ===================================================================== */
  var ICON_COPY = '<svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  var ICON_OPEN = '<svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  // 长地址优先在 / ? & = 后面断行
  function setUrlText(node, url) {
    node.textContent = '';
    url.split(/([\/?&=])/).forEach(function (part) {
      if (!part) return;
      node.appendChild(document.createTextNode(part));
      if (part.length === 1 && '/?&='.indexOf(part) > -1) {
        node.appendChild(document.createElement('wbr'));
      }
    });
  }

  function buildCopy(url) {
    var b = el('button', 'src');
    b.type = 'button';
    b.setAttribute('data-copy', url);
    b.setAttribute('aria-label', '复制地址 ' + url);
    b.innerHTML = ICON_COPY + '<span class="txt"></span><span class="tag">复制</span>';
    setUrlText(b.querySelector('.txt'), url);
    return b;
  }

  function buildOpen(url) {
    var a = el('a', 'src');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = ICON_OPEN + '<span class="txt"></span>';
    setUrlText(a.querySelector('.txt'), url);
    return a;
  }

  function buildPwd(text) { return el('span', 'pwd', text); }

  function buildQuestion(text, n) {
    var p = el('p', 'q');
    p.appendChild(el('span', 'faq-num', String(n)));
    p.appendChild(el('span', null, text));
    return p;
  }

  // 段落里除了空白以外只有一个子节点时返回它
  function onlyChild(p) {
    var kids = Array.prototype.slice.call(p.childNodes).filter(function (n) {
      return !(n.nodeType === 3 && !n.textContent.trim());
    });
    return kids.length === 1 ? kids[0] : null;
  }

  function renderTvboxDirectives(root) {
    var qIndex = 0;
    root.querySelectorAll('p').forEach(function (p) {
      var node = null;

      // ① 指令写法：@copy / @open / @pwd / @q
      var m = p.textContent.trim().match(/^@(copy|open|pwd|q)\s+([\s\S]*)$/);
      if (m) {
        var kind = m[1], val = m[2].trim();
        if (kind === 'copy') node = buildCopy(val);
        else if (kind === 'open') node = buildOpen(val);
        else if (kind === 'pwd') node = buildPwd(val);
        else { qIndex++; node = buildQuestion(val, qIndex); }
      } else {
        // ② 纯 markdown 写法（更省事）：
        //    单独一行的地址（含 `反引号` 包裹）→ 复制按钮
        //    [文字](链接) 且文字不是地址本身 → 打开按钮
        var lone = onlyChild(p);
        if (lone && lone.nodeType === 3) {
          var t = lone.textContent.trim();
          if (/^https?:\/\/\S+$/.test(t)) node = buildCopy(t);
        } else if (lone && lone.tagName === 'CODE') {
          var c = lone.textContent.trim();
          if (/^https?:\/\/\S+$/.test(c)) node = buildCopy(c);
        } else if (lone && lone.tagName === 'A') {
          var href = lone.getAttribute('href') || '';
          var txt = lone.textContent.trim();
          if (/^https?:\/\//.test(href)) {
            node = (txt === href || txt === href.replace(/\/$/, '')) ? buildCopy(href) : buildOpen(href);
          }
        }
      }

      if (node) p.parentNode.replaceChild(node, p);
    });

    // ③ ### 1. 问题标题 → 带编号的问题小标题
    root.querySelectorAll('h3').forEach(function (h) {
      var hm = h.textContent.trim().match(/^(\d+)\s*[.、．)]\s*(.+)$/);
      if (hm) h.parentNode.replaceChild(buildQuestion(hm[2].trim(), hm[1]), h);
    });

    // ④ 段落里短的反引号文本 → 密码胶囊
    root.querySelectorAll('p code').forEach(function (c) {
      var t = c.textContent.trim();
      if (t && t.length <= 24 && !/\s/.test(t) && !/^https?:\/\//.test(t)) {
        c.parentNode.replaceChild(buildPwd(t), c);
      }
    });
  }

  // 按 ## 分段，每个小节包成一个卡片
  function groupTvboxBlocks(root) {
    var holder = el('div');
    var intro = el('div', 'intro');
    var current = null;

    Array.prototype.slice.call(root.childNodes).forEach(function (node) {
      if (node.nodeType === 8) return;                            // 注释
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      if (node.tagName === 'H1') {
        node.className = 'doc-title';
        holder.appendChild(node);
        return;
      }
      if (node.tagName === 'H2') {
        if (current) holder.appendChild(current);
        current = el('div', 'block');
        current.appendChild(node);
        return;
      }
      if (current) current.appendChild(node);
      else intro.appendChild(node);
    });

    if (current) holder.appendChild(current);
    if (intro.childNodes.length) {
      var anchor = holder.firstChild;
      if (anchor && anchor.tagName === 'H1') anchor = anchor.nextSibling;
      holder.insertBefore(intro, anchor);
    }
    return holder;
  }

  function loadTvbox() {
    var box = $('tvbox-content');
    loadScript(ASSET_BASE + 'marked.js')
      .then(function () { return fetch(SITE_ROOT + 'me/tvbox.md', { cache: 'no-cache' }); })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (md) {
        var tmp = el('div');
        tmp.innerHTML = marked.parse(md);
        renderTvboxDirectives(tmp);
        box.innerHTML = '';
        box.appendChild(groupTvboxBlocks(tmp));
      })
      .catch(function (err) {
        box.innerHTML = '<p class="md-loading" style="color:var(--error)">文章加载失败：' +
          err.message + '，请稍后重试（直接双击打开本地文件会被浏览器拦截，需通过 http(s) 访问）。</p>';
      });
  }

  // 地址条点击复制（事件委托，md 渲染出来的按钮自动生效）
  function setupCopyButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.src[data-copy]') : null;
      if (!btn) return;
      var tag = btn.querySelector('.tag');
      copyText(btn.getAttribute('data-copy')).then(function (ok) {
        if (!ok) {
          var txt = btn.querySelector('.txt');
          if (txt) {
            try {
              var range = document.createRange();
              range.selectNodeContents(txt);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            } catch (err) {}
          }
          showToast('复制失败，已选中地址，请按 Ctrl/⌘ + C');
          return;
        }
        btn.classList.add('copied');
        if (tag) tag.textContent = '已复制';
        showToast('已复制到剪贴板');
        clearTimeout(btn._t);
        btn._t = setTimeout(function () {
          btn.classList.remove('copied');
          if (tag) tag.textContent = '复制';
        }, 1600);
      });
    });
  }

  /* =====================================================================
     七、搜索
     ===================================================================== */
  function setupSearch() {
    var input = $('search-input');
    var eng = $('search-engine');
    function go() {
      var q = input.value.trim();
      if (!q) { input.focus(); return; }
      var base = ENGINES[eng.value] || ENGINES.bing;
      window.open(base + encodeURIComponent(q), '_blank', 'noopener');
    }
    $('search-btn').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }

  /* =====================================================================
     八、粒子背景（颜色跟随当前主题色）
     ===================================================================== */
  function cssColorToHex(color) {
    try {
      var c = document.createElement('canvas');
      c.width = c.height = 1;
      var ctx = c.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      var d = ctx.getImageData(0, 0, 1, 1).data;
      return '#' + ('000000' + ((d[0] << 16) | (d[1] << 8) | d[2]).toString(16)).slice(-6);
    } catch (e) {
      return '#00ff9d';
    }
  }

  function initParticles() {
    if (!window.particlesJS) return;
    var color = cssColorToHex(
      getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#00ff9d'
    );
    var count = window.innerWidth < 640 ? 40 : 70;
    particlesJS('particles-js', {
      particles: {
        number: { value: count, density: { enable: true, value_area: 800 } },
        color: { value: color },
        shape: { type: 'circle' },
        opacity: {
          value: .55, random: true,
          anim: { enable: true, speed: 1.5, opacity_min: .15, sync: false }
        },
        size: {
          value: 3.5, random: true,
          anim: { enable: true, speed: 2.5, size_min: .4, sync: false }
        },
        line_linked: { enable: true, distance: 130, color: color, opacity: .28, width: 1 },
        move: {
          enable: true, speed: 1.4, direction: 'none',
          random: true, straight: false, out_mode: 'out', bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: .7 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }

  function reloadParticles() {
    if (window.pJSDom && window.pJSDom.length) {
      try { window.pJSDom[0].pJS.fn.vendors.destroypJS(); } catch (e) {}
    }
    window.pJSDom = [];
    initParticles();
  }

  var themeTimer;
  window.addEventListener('md3:theme', function () {
    clearTimeout(themeTimer);
    themeTimer = setTimeout(reloadParticles, 150);
  });

  /* =====================================================================
     九、杂项：建站时间 / 邮箱复制 / 二维码 / 浏览器引导
     ===================================================================== */
  function setupMisc() {
    // 建站时间
    var days = Math.ceil((Date.now() - new Date('2023-01-01').getTime()) / 86400000);
    $('survival-time').textContent = days + ' 天';

    // 邮箱点击复制
    var email = $('email');
    email.addEventListener('click', function () {
      copyText('888@xiaofei.men').then(function (ok) {
        if (!ok) { showToast('复制失败，请手动选中邮箱地址'); return; }
        var old = email.textContent;
        email.textContent = '已复制!';
        setTimeout(function () { email.textContent = old; }, 1500);
      });
    });

    // 二维码：首次交互时才真正下载图片（省掉首屏 ~270KB）
    document.querySelectorAll('.social[data-qr]').forEach(function (s) {
      var img = s.querySelector('.qr img[data-src]');
      function reveal() {
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      }
      s.addEventListener('mouseenter', reveal, { once: true });
      s.addEventListener('touchstart', reveal, { once: true, passive: true });
      s.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        reveal();
        document.querySelectorAll('.social.show-qr').forEach(function (o) {
          if (o !== s) o.classList.remove('show-qr');
        });
        s.classList.toggle('show-qr');
      });
    });

    // 手机浏览器地址栏颜色跟随主题
    var metaColor = document.querySelector('meta[name="theme-color"]');
    function syncThemeColor() {
      if (!metaColor) return;
      metaColor.setAttribute('content', cssColorToHex(
        getComputedStyle(document.documentElement).getPropertyValue('--primary')
      ));
    }
    syncThemeColor();
    window.addEventListener('md3:theme', syncThemeColor);

    // 微信 / QQ 内置浏览器引导层
    var guide = $('browserGuide');
    $('currentUrl').textContent = location.href;
    var copyBtn = $('copyUrl');
    copyBtn.addEventListener('click', function () {
      copyText(location.href).then(function (ok) {
        if (!ok) { showToast('复制失败，请手动选中网址'); return; }
        copyBtn.textContent = '已复制!';
        setTimeout(function () { copyBtn.textContent = '复制链接'; }, 1500);
      });
    });
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') > -1 ||
        (ua.indexOf('qq') > -1 && ua.indexOf('qqbrowser') < 0)) {
      guide.classList.add('show');
    }
  }

  /* =====================================================================
     初始化
     ===================================================================== */
  function init() {
    // 粒子：系统开了「减少动态效果」就直接跳过，否则按需加载 particles.js
    if ($('particles-js')) {
      if (reducedMotion()) {
        $('particles-js').remove();
      } else {
        // 等页面空闲再加载粒子，避免和首屏内容抢带宽
        var startParticles = function () {
          loadScript(ASSET_BASE + 'particles.js').then(initParticles).catch(function () {});
        };
        if (window.requestIdleCallback) {
          window.requestIdleCallback(startParticles, { timeout: 2000 });
        } else {
          setTimeout(startParticles, 400);
        }
      }
    }
    if (!$('home-grid')) return; // 404 等页面只做粒子背景
    renderHome();
    renderCategories();
    setupNav();
    setupSearch();
    setupMisc();
    setupCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
