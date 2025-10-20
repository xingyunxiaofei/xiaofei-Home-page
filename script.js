// 主题切换功能
function setupThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('svg');
    
    // 检查本地存储的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.classList.remove('dark', 'light');
        html.classList.add(savedTheme);
    }
    
    // 更新图标
    function updateThemeIcon() {
        if (html.classList.contains('light')) {
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        } else {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }
    
    // 初始化图标
    updateThemeIcon();
    
    // 切换主题
    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            html.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    });
}

// 主题判定逻辑部分
function setupAutoThemeSwitch() {
// 如果用户之前手动设置过主题，则不再自动判断(如果不使用可以把IF函数注释掉)
//     if (localStorage.getItem('theme')) {
//         return;
//     }

    // 获取用户位置（通过IP定位）
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const { latitude, longitude } = data;

            if (latitude && longitude) {
                // 获取用户当前本地时间（而不是UTC时间）
                const now = new Date();

                // 使用 SunCalc 获取今天的日出和日落时间
                const times = SunCalc.getTimes(now, latitude, longitude);
                const sunrise = times.sunrise;
                const sunset = times.sunset;

                // 判断当前时间是否为白天
                const isDayTime = now >= sunrise && now <= sunset;
                const html = document.documentElement;

                // 设置主题
                if (isDayTime) {
                    html.classList.remove('dark');
                    html.classList.add('light');
                    localStorage.setItem('theme', 'light');
                } else {
                    html.classList.remove('light');
                    html.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                }

                console.log(`自动主题判断完成：${isDayTime ? '白天' : '夜晚'}`);
            } else {
                console.log('无法获取有效的地理位置信息');
            }
        })
        .catch(error => {
            console.log('IP定位失败，使用默认主题');
        });
}

// 页面导航功能
function setupPageNavigation() {
    const navItems = document.querySelectorAll('.page-nav-item');
    const pageContainers = document.querySelectorAll('.page-container');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有活跃状态
            navItems.forEach(nav => nav.classList.remove('active'));
            pageContainers.forEach(page => page.classList.remove('active'));
            
            // 添加当前活跃状态
            item.classList.add('active');
            const pageId = item.getAttribute('data-page') + '-page';
            document.getElementById(pageId).classList.add('active');
            
            // 如果切换到友人页面，加载Markdown
            if (pageId === 'friends-page') {
                loadMarkdown();
            }
        });
    });
}

// 分类标签切换功能
function setupCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活跃状态
            categoryTabs.forEach(t => t.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前活跃状态
            tab.classList.add('active');
            const categoryId = tab.getAttribute('data-category') + '-content';
            document.getElementById(categoryId).classList.add('active');
        });
    });
}

// 链接卡片点击功能
function setupLinkCards() {
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        card.addEventListener('click', () => {
            const link = card.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
        
        // 添加波纹效果
        card.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 计算建站时间
function calculateSurvivalTime() {
    const startDate = new Date('2023-01-01');
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('survival-time').textContent = `${diffDays} 天`;
}

// 邮箱点击复制功能
function setupEmailCopy() {
    const emailElement = document.getElementById('email');
    const email = '888@xiaofei.men';
    
    emailElement.addEventListener('click', () => {
        navigator.clipboard.writeText(email).then(() => {
            const originalText = emailElement.textContent;
            emailElement.textContent = '已复制!';
            
            setTimeout(() => {
                emailElement.textContent = originalText;
            }, 2000);
        });
    });
}

// 浏览器引导层功能
function setupBrowserGuide() {
    const browserGuide = document.getElementById('browserGuide');
    const copyUrlBtn = document.getElementById('copyUrl');
    const currentUrlElement = document.getElementById('currentUrl');
    
    // 显示当前URL
    currentUrlElement.textContent = window.location.href;
    
    // 复制URL功能
    copyUrlBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            copyUrlBtn.textContent = '已复制!';
            
            setTimeout(() => {
                copyUrlBtn.textContent = '复制链接';
            }, 2000);
        });
    });
    
    // 检测逻辑修改：仅拦截微信和QQ内置浏览器，放行QQ浏览器
    const userAgent = navigator.userAgent.toLowerCase();
    const isWechat = userAgent.includes('micromessenger');
    // 检测QQ内置浏览器（不是QQ浏览器）
    const isQQInternal = userAgent.includes('qq') && !userAgent.includes('qqbrowser');
    
    // 只在微信或QQ内置浏览器中显示引导层
    if (isWechat || isQQInternal) {
        browserGuide.style.display = 'flex';
    }
}

// Markdown转换逻辑
function loadMarkdown() {
    // 1. 你的Markdown文件路径
    const mdFilePath = 'friends.md';
    
    // 2. 显示加载状态
    const loadingEl = document.getElementById('md-loading');
    const contentEl = document.getElementById('md-content');
    
    // 3. 请求Markdown文件
    fetch(mdFilePath)
        .then(response => {
            if (!response.ok) throw new Error('无法加载文章');
            return response.text(); // 获取Markdown文本
        })
        .then(markdownText => {
            // 4. 隐藏加载状态，转换Markdown为HTML并插入页面
            loadingEl.style.display = 'none';
            contentEl.innerHTML = marked.parse(markdownText); // 使用marked.js转换
        })
        .catch(error => {
            // 5. 加载失败提示
            loadingEl.textContent = `加载失败：${error.message}`;
            loadingEl.style.color = '#ff4d4d'; // 错误提示用红色
        });
}

// 搜索功能
function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', performSearch);
    
    // 回车键触发搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const engine = document.getElementById('search-engine').value;
    
    if (!query) return;
    
    let url = '';
    switch(engine) {
        case 'baidu':
            url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
            break;
        case 'google':
            url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            break;
        case '360':
            url = `https://www.so.com/s?q=${encodeURIComponent(query)}`;
            break;
        case 'brave':
            url = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'yahoo':
            url = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
            break;
        case 'duckduckgo':
            url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            break;
        case 'youtube':
            url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            break;
        case 'yandex':
            url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
            break;
        case 'shenma':
            url = `https://m.sm.cn/s?q=${encodeURIComponent(query)}`;
            break;
        case 'quark':
            url = `https://quark.sm.cn/s?q=${encodeURIComponent(query)}`;
            break;
        case 'sogou':
            url = `https://www.sogou.com/web?query=${encodeURIComponent(query)}`;
            break;
        case 'bing':
        default:
            url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    }
    
    window.open(url, '_blank');
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子效果
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 60,  // 粒子数量（略少于之前，更简洁）
            "density": {
                "enable": true,
                "value_area": 700  // 粒子密度区域（稍大，分布更均匀）
            }
        },
        "color": {
            "value": "#00ff9d"  // 保持主题色
        },
        "shape": {
            "type": "circle"  // 圆形粒子
        },
        "opacity": {
            "value": 0.6,  // 稍高不透明度，更明显
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,  // 透明度变化速度
                "opacity_min": 0.2,
                "sync": false
            }
        },
        "size": {
            "value": 4,  // 粒子稍大
            "random": true,
            "anim": {
                "enable": true,
                "speed": 3,  // 大小变化速度
                "size_min": 0.5,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 120,  // 连线距离稍近
            "color": "#00ff9d",
            "opacity": 0.3,  // 连线更明显
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1.5,  // 运动稍快
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"  // hover时粒子聚集
            },
            "onclick": {
                "enable": true,
                "mode": "push"  // 点击时新增粒子
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 150,  // 聚集范围
                "line_linked": {
                    "opacity": 0.8  // 聚集时连线更清晰
                }
            },
            "push": {
                "particles_nb": 4  // 点击新增4个粒子
            }
        }
    },
    "retina_detect": true
});

    setupThemeToggle();
    setupAutoThemeSwitch();
    setupPageNavigation();
    setupCategoryTabs();
    setupLinkCards();
    calculateSurvivalTime();
    setupEmailCopy();
    setupBrowserGuide();
    setupSearch();
    
    // 初始化时如果默认显示友人页面，加载Markdown
    if (document.getElementById('friends-page').classList.contains('active')) {
        loadMarkdown();
    }
});
