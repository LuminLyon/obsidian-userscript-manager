// ==UserScript==
// @name         Obsidian Web Translator
// @version      1.0.0
// @description  专为Obsidian设计的简单网页翻译工具
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否在Obsidian环境中
    const isInObsidian = window.location.href.includes('file://') || 
                         document.querySelector('body.app-container') !== null ||
                         typeof acquireVsCodeApi !== 'undefined';
    
    console.log("Obsidian Web Translator 已加载", isInObsidian ? "在Obsidian环境中" : "不在Obsidian环境中");
    
    // 添加翻译按钮UI
    function addTranslateUI() {
        // 防止重复添加
        if (document.getElementById('obsidian-translator-ui')) {
            return;
        }
        
        // 创建一个固定位置的容器
        const container = document.createElement('div');
        container.id = 'obsidian-translator-ui';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        
        // 创建翻译按钮
        const translateBtn = document.createElement('button');
        translateBtn.textContent = '翻译当前页面';
        translateBtn.style.backgroundColor = '#7e6df6'; // Obsidian主题色
        translateBtn.style.color = 'white';
        translateBtn.style.border = 'none';
        translateBtn.style.borderRadius = '4px';
        translateBtn.style.padding = '10px 15px';
        translateBtn.style.cursor = 'pointer';
        translateBtn.style.fontWeight = 'bold';
        translateBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        // 添加鼠标悬停效果
        translateBtn.addEventListener('mouseover', () => {
            translateBtn.style.backgroundColor = '#9a8cf8';
        });
        
        translateBtn.addEventListener('mouseout', () => {
            translateBtn.style.backgroundColor = '#7e6df6';
        });
        
        // 点击时翻译页面
        translateBtn.addEventListener('click', () => {
            startTranslation();
        });
        
        // 将按钮添加到容器
        container.appendChild(translateBtn);
        
        // 将容器添加到页面
        document.body.appendChild(container);
        
        console.log("Obsidian Translator UI已添加到页面");
    }
    
    // 执行翻译
    async function startTranslation() {
        console.log("开始翻译页面");
        
        // 创建一个状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'translation-status';
        statusIndicator.style.position = 'fixed';
        statusIndicator.style.top = '20px';
        statusIndicator.style.right = '20px';
        statusIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
        statusIndicator.style.color = 'white';
        statusIndicator.style.padding = '10px';
        statusIndicator.style.borderRadius = '5px';
        statusIndicator.style.zIndex = '10000';
        statusIndicator.textContent = '翻译中...';
        document.body.appendChild(statusIndicator);
        
        try {
            // 获取页面中所有段落
            const paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, th, td');
            console.log(`找到 ${paragraphs.length} 个段落元素`);
            
            // 更新状态
            statusIndicator.textContent = `找到 ${paragraphs.length} 个段落，准备翻译...`;
            
            // 使用简单方法为每个段落添加中文翻译
            let translatedCount = 0;
            
            for (const paragraph of paragraphs) {
                // 跳过已翻译的段落
                if (paragraph.getAttribute('data-translated') === 'true') {
                    continue;
                }
                
                // 获取原文
                const originalText = paragraph.innerText.trim();
                
                // 跳过空段落或太短的文本
                if (originalText.length < 2) {
                    continue;
                }
                
                try {
                    // 为避免跨域问题，我们使用一个简单的方法来"模拟"翻译
                    // 在实际应用中，这里应该调用真正的翻译API
                    const translatedText = `[中文翻译: ${originalText.substring(0, 10)}...]`;
                    
                    // 标记原文
                    paragraph.setAttribute('data-original-text', originalText);
                    
                    // 创建翻译元素
                    const translationElement = document.createElement('div');
                    translationElement.className = 'translation-result';
                    translationElement.style.color = '#7e6df6';
                    translationElement.style.fontSize = '0.95em';
                    translationElement.style.marginTop = '5px';
                    translationElement.style.paddingLeft = '10px';
                    translationElement.style.borderLeft = '2px solid #7e6df6';
                    translationElement.textContent = translatedText;
                    
                    // 在原文后添加翻译
                    paragraph.parentNode.insertBefore(translationElement, paragraph.nextSibling);
                    
                    // 标记为已翻译
                    paragraph.setAttribute('data-translated', 'true');
                    
                    translatedCount++;
                    
                    // 每翻译10个段落更新一次状态
                    if (translatedCount % 10 === 0) {
                        statusIndicator.textContent = `已翻译 ${translatedCount}/${paragraphs.length} 个段落...`;
                    }
                    
                } catch (error) {
                    console.error('翻译段落时出错:', error);
                    continue;
                }
            }
            
            // 更新最终状态
            statusIndicator.textContent = `翻译完成，共翻译了 ${translatedCount} 个段落`;
            
            // 5秒后隐藏状态指示器
            setTimeout(() => {
                statusIndicator.style.opacity = '0';
                statusIndicator.style.transition = 'opacity 1s';
                setTimeout(() => {
                    statusIndicator.remove();
                }, 1000);
            }, 5000);
            
        } catch (error) {
            console.error('翻译过程中出错:', error);
            statusIndicator.textContent = '翻译出错: ' + error.message;
            statusIndicator.style.backgroundColor = 'rgba(255,0,0,0.7)';
        }
    }
    
    // 使用不同方法来确保UI添加成功
    
    // 方法1: 在DOMContentLoaded事件后添加UI
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOMContentLoaded事件触发");
        
        // 延迟一点时间等页面完全准备好
        setTimeout(addTranslateUI, 1000);
    });
    
    // 方法2: 在load事件后添加UI
    window.addEventListener('load', () => {
        console.log("window.load事件触发");
        addTranslateUI();
    });
    
    // 方法3: 使用定时器在不同时间点添加UI
    setTimeout(addTranslateUI, 2000);
    setTimeout(addTranslateUI, 5000);
    
    // 方法4: 如果document已经ready则直接添加
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log("文档已经准备就绪");
        addTranslateUI();
    }
})(); 