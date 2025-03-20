// ==UserScript==
// @name         Simple Ad Blocker for Obsidian
// @version      1.0.0
// @description  简单的广告屏蔽脚本，类似uBlock
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // 调试模式
    const DEBUG = true;
    
    // 记录日志
    function log(message) {
        if (DEBUG) {
            console.log('[Ad Blocker]', message);
        }
    }
    
    // 常见广告选择器
    const AD_SELECTORS = [
        // 通用广告类名
        '.ad', '.ads', '.advert', '.advertisement', '.advertising',
        '[class*="ad-"]', '[class*="ads-"]', '[class*="adv-"]',
        '[id*="ad-"]', '[id*="ads-"]',
        
        // 常见广告容器
        '.banner', '.banner-ad', '.ad-banner',
        '.sidebar-ad', '.ad-container', '.ad-wrapper',
        '.sponsored', '.sponsored-content',
        '.recommended', '.recommendation',
        
        // 弹窗广告
        '.popup', '.popover', '.modal-ad',
        '[class*="popup"]', '[class*="modal"]',
        
        // 常见广告提供商
        '[class*="adsense"]',
        '[id*="adsense"]',
        '[data-ad]',
        
        // 社交分享按钮（可选）
        '.social-share', '.share-buttons',
        
        // 常见广告位置
        '.top-ad', '.bottom-ad', '.side-ad',
        '.header-ad', '.footer-ad',
        
        // 视频广告
        '.video-ad', '.pre-roll', '.post-roll',
        
        // 原生广告
        '.native-ad', '.sponsored-post',
        '[class*="promoted"]', '[class*="sponsored"]',
        
        // 特定网站广告
        'iframe[src*="ads"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="ad."]',
        'img[src*="ads"]',
        'img[src*="ad."]'
    ];
    
    // 需要移除的广告脚本URL关键词
    const AD_SCRIPT_KEYWORDS = [
        'ads', 'analytics', 'tracking',
        'adsense', 'doubleclick', 'adserver',
        'advertising', 'banner', 'sponsor'
    ];
    
    // CSS样式注入
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${AD_SELECTORS.join(',')} {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
                visibility: hidden !important;
            }
            
            /* 防止空白占位 */
            [style*="width: 100%"][style*="height: 100%"],
            [style*="position: fixed"],
            [style*="position: absolute"] {
                max-width: 100% !important;
                max-height: 100vh !important;
            }
        `;
        
        // 添加到文档头部
        (document.head || document.documentElement).appendChild(style);
        log('注入广告屏蔽CSS');
    }
    
    // 移除广告元素
    function removeAds() {
        let removedCount = 0;
        
        // 使用选择器查找并移除广告元素
        AD_SELECTORS.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element && !element.hasAttribute('data-adblock-checked')) {
                        // 标记元素已检查
                        element.setAttribute('data-adblock-checked', 'true');
                        
                        // 检查元素是否可能是误判
                        const isLikelyAd = checkIfLikelyAd(element);
                        
                        if (isLikelyAd) {
                            element.style.display = 'none';
                            element.style.visibility = 'hidden';
                            element.style.opacity = '0';
                            element.style.pointerEvents = 'none';
                            element.style.height = '0';
                            element.style.minHeight = '0';
                            element.style.maxHeight = '0';
                            element.style.overflow = 'hidden';
                            removedCount++;
                        }
                    }
                });
            } catch (error) {
                log(`选择器 ${selector} 处理出错: ${error.message}`);
            }
        });
        
        if (removedCount > 0) {
            log(`移除了 ${removedCount} 个广告元素`);
        }
    }
    
    // 检查元素是否可能是广告
    function checkIfLikelyAd(element) {
        // 检查元素及其父元素的类名、ID和属性
        const elementString = (element.className + ' ' + element.id + ' ' + Array.from(element.attributes).map(attr => attr.name + '=' + attr.value).join(' ')).toLowerCase();
        
        // 广告关键词
        const adKeywords = [
            'ad', 'ads', 'adv', 'banner', 'sponsor',
            'advertising', 'advertisement', 'commercial',
            'promoted', 'recommendation', 'adsense'
        ];
        
        // 检查是否包含广告关键词
        return adKeywords.some(keyword => elementString.includes(keyword));
    }
    
    // 阻止广告脚本加载
    function blockAdScripts() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'SCRIPT') {
                        const src = node.src.toLowerCase();
                        if (AD_SCRIPT_KEYWORDS.some(keyword => src.includes(keyword))) {
                            node.remove();
                            log(`阻止广告脚本加载: ${src}`);
                        }
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // 创建状态指示器
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'ad-blocker-status';
        indicator.style.position = 'fixed';
        indicator.style.bottom = '10px';
        indicator.style.left = '10px';
        indicator.style.backgroundColor = '#4CAF50';
        indicator.style.color = 'white';
        indicator.style.padding = '5px 10px';
        indicator.style.borderRadius = '4px';
        indicator.style.fontSize = '12px';
        indicator.style.zIndex = '999999';
        indicator.style.opacity = '0.8';
        indicator.style.cursor = 'pointer';
        indicator.textContent = '广告拦截已启用';
        
        // 悬停效果
        indicator.addEventListener('mouseover', () => {
            indicator.style.opacity = '1';
        });
        
        indicator.addEventListener('mouseout', () => {
            indicator.style.opacity = '0.8';
        });
        
        // 点击显示统计信息
        indicator.addEventListener('click', () => {
            alert('广告拦截统计:\n' +
                  '- 已拦截元素: ' + document.querySelectorAll('[data-adblock-checked]').length + '\n' +
                  '- 当前活动规则: ' + AD_SELECTORS.length);
        });
        
        document.body.appendChild(indicator);
    }
    
    // 初始化
    function init() {
        log('广告拦截器初始化');
        
        // 注入CSS
        injectStyles();
        
        // 阻止广告脚本
        blockAdScripts();
        
        // 定期检查和移除广告
        const checkInterval = setInterval(removeAds, 1000);
        
        // 5秒后降低检查频率
        setTimeout(() => {
            clearInterval(checkInterval);
            setInterval(removeAds, 5000);
        }, 5000);
        
        // 创建状态指示器
        if (document.body) {
            createStatusIndicator();
        } else {
            document.addEventListener('DOMContentLoaded', createStatusIndicator);
        }
    }
    
    // 在不同时机尝试初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 页面加载完成后再次检查
    window.addEventListener('load', removeAds);
})(); 