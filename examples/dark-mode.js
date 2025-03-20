// ==UserScript==
// @name     增强暗黑模式
// @match    *://*.bing.com/*
// @match    *://*.google.com/*
// @match    *://*.baidu.com/*
// @version  1.1
// @description 提供更强大的暗黑模式覆盖，专为搜索引擎优化
// ==/UserScript==

(function() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 全局暗黑模式 - 更强力覆盖 */
        body.dark-mode,
        body.dark-mode > *,
        body.dark-mode div, 
        body.dark-mode p, 
        body.dark-mode span,
        body.dark-mode li,
        body.dark-mode input, 
        body.dark-mode button,
        body.dark-mode header,
        body.dark-mode nav,
        body.dark-mode footer,
        body.dark-mode section,
        body.dark-mode article,
        body.dark-mode aside,
        body.dark-mode form,
        body.dark-mode iframe,
        body.dark-mode canvas {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
            box-shadow: none !important;
        }
        
        /* 搜索结果和列表项 */
        body.dark-mode .b_algo, 
        body.dark-mode .b_ans,
        body.dark-mode #b_results > li,
        body.dark-mode .b_searchbox {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }
        
        /* 链接和标题 */
        body.dark-mode a,
        body.dark-mode h1, 
        body.dark-mode h2, 
        body.dark-mode h3 {
            color: #5c9ae4 !important;
        }
        
        body.dark-mode a:visited {
            color: #bb86fc !important;
        }
        
        /* 特殊区域 */
        body.dark-mode .b_searchboxForm,
        body.dark-mode #b_header {
            background-color: #1a1a1a !important;
        }
        
        /* 搜索框 */
        body.dark-mode input[type="search"],
        body.dark-mode input[type="text"] {
            background-color: #333 !important;
            color: #fff !important;
        }
        
        /* 按钮 */
        body.dark-mode button,
        body.dark-mode input[type="submit"] {
            background-color: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
        }
        
        /* 图片稍微调暗 */
        body.dark-mode img {
            filter: brightness(0.85) !important;
        }
        
        /* 切换按钮样式 */
        #dark-mode-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        #dark-mode-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
        }
        
        #dark-mode-toggle svg {
            width: 26px;
            height: 26px;
        }
        
        /* 暗黑模式按钮样式 */
        body.dark-mode #dark-mode-toggle {
            background-color: #333333;
        }
        
        .moon-icon {
            display: block;
        }
        
        .sun-icon {
            display: none;
        }
        
        body.dark-mode .moon-icon {
            display: none;
        }
        
        body.dark-mode .sun-icon {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 创建切换按钮
    const button = document.createElement('button');
    button.id = 'dark-mode-toggle';
    button.title = '切换暗黑/明亮模式';
    button.innerHTML = `
        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    // 添加切换逻辑
    button.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // 保存用户偏好到会话存储
        try {
            const isDarkMode = document.body.classList.contains('dark-mode');
            sessionStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
        } catch (e) {
            console.error('无法保存暗黑模式偏好:', e);
        }
    });
    
    // 添加按钮到页面
    document.body.appendChild(button);
    
    // 检查之前的偏好设置
    try {
        const savedDarkMode = sessionStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    } catch (e) {
        console.error('无法读取暗黑模式偏好:', e);
    }
    
    // 强制检查和应用 - 解决动态加载内容问题
    const forceCheck = () => {
        if (document.body.classList.contains('dark-mode')) {
            // 查找所有iframe并尝试处理
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc.body) {
                        iframeDoc.body.classList.add('dark-mode');
                    }
                } catch(e) {
                    // 跨域iframe无法访问
                }
            });
        }
    };
    
    // 页面加载后和内容变化时检查
    window.addEventListener('load', forceCheck);
    window.addEventListener('DOMContentLoaded', forceCheck);
    
    // 创建观察器监听DOM变化
    const observer = new MutationObserver(forceCheck);
    observer.observe(document.body, { childList: true, subtree: true });
})(); 