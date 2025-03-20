// ==UserScript==
// @name         Immersive Translate for Obsidian
// @version      1.0.0
// @description  沉浸式翻译 - 为Obsidian定制的网页翻译脚本
// @namespace    https://immersive-translate.owenyoung.com/
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    "use strict";
    
    // 添加调试信息到页面上
    function addDebugInfo(message) {
        console.log("沉浸式翻译调试:", message);
        
        // 也在页面上显示调试信息
        const debugContainer = document.getElementById("translate-debug-info") || document.createElement("div");
        if (!document.getElementById("translate-debug-info")) {
            debugContainer.id = "translate-debug-info";
            debugContainer.style.position = "fixed";
            debugContainer.style.top = "10px";
            debugContainer.style.left = "10px";
            debugContainer.style.backgroundColor = "rgba(0,0,0,0.7)";
            debugContainer.style.color = "white";
            debugContainer.style.padding = "10px";
            debugContainer.style.borderRadius = "5px";
            debugContainer.style.fontSize = "12px";
            debugContainer.style.zIndex = "10000";
            document.body.appendChild(debugContainer);
        }
        
        const timeStamp = new Date().toLocaleTimeString();
        const msgElement = document.createElement("div");
        msgElement.textContent = `[${timeStamp}] ${message}`;
        debugContainer.appendChild(msgElement);
    }
    
    // 添加翻译按钮到页面上
    function addTranslateButton() {
        addDebugInfo("尝试添加翻译按钮...");
        
        // 如果按钮已存在，不重复添加
        if (document.getElementById("immersive-translate-button")) {
            addDebugInfo("按钮已存在，不重复添加");
            return;
        }
        
        try {
            const buttonContainer = document.createElement("div");
            buttonContainer.id = "immersive-translate-button-container";
            buttonContainer.style.position = "fixed";
            buttonContainer.style.bottom = "20px";
            buttonContainer.style.right = "20px";
            buttonContainer.style.zIndex = "9999";
            
            const translateButton = document.createElement("button");
            translateButton.id = "immersive-translate-button";
            translateButton.textContent = "翻译页面";
            translateButton.style.padding = "8px 16px";
            translateButton.style.backgroundColor = "#0d6efd";
            translateButton.style.color = "white";
            translateButton.style.border = "none";
            translateButton.style.borderRadius = "4px";
            translateButton.style.cursor = "pointer";
            
            translateButton.addEventListener("click", function() {
                addDebugInfo("翻译按钮被点击");
                translatePage();
            });
            
            buttonContainer.appendChild(translateButton);
            document.body.appendChild(buttonContainer);
            addDebugInfo("翻译按钮已添加");
        } catch (error) {
            addDebugInfo("添加按钮出错: " + error.message);
        }
    }
    
    // 简化版翻译功能 - 使用免费API
    async function translatePage() {
        addDebugInfo("开始翻译页面...");
        
        // 获取页面中的所有文本节点
        const textNodes = getTextNodes(document.body);
        addDebugInfo(`找到 ${textNodes.length} 个文本节点`);
        
        let translatedCount = 0;
        for (const node of textNodes) {
            if (node.nodeValue && node.nodeValue.trim().length > 1) {
                try {
                    // 使用fetch API代替GM_xmlhttpRequest
                    const translated = await translateText(node.nodeValue);
                    translatedCount++;
                    
                    // 在原文后显示翻译
                    const originalText = node.nodeValue;
                    const parentNode = node.parentNode;
                    
                    // 创建翻译后的元素
                    const translatedSpan = document.createElement("span");
                    translatedSpan.style.color = "#0d6efd";
                    translatedSpan.textContent = ` (${translated})`;
                    
                    // 替换原始节点
                    const originalSpan = document.createElement("span");
                    originalSpan.textContent = originalText;
                    
                    parentNode.replaceChild(document.createTextNode(""), node);
                    parentNode.insertBefore(translatedSpan, node);
                    parentNode.insertBefore(originalSpan, translatedSpan);
                    
                } catch (error) {
                    addDebugInfo("翻译失败: " + error.message);
                }
            }
        }
        
        addDebugInfo(`翻译完成，共翻译了 ${translatedCount} 个文本节点`);
    }
    
    // 获取所有文本节点
    function getTextNodes(node) {
        const textNodes = [];
        
        function getNodes(node) {
            if (node.nodeType === 3) {
                textNodes.push(node);
            } else if (node.nodeType === 1) {
                const children = node.childNodes;
                for (let i = 0; i < children.length; i++) {
                    getNodes(children[i]);
                }
            }
        }
        
        getNodes(node);
        return textNodes;
    }
    
    // 简单翻译API - 使用免费的翻译服务
    async function translateText(text) {
        try {
            addDebugInfo(`翻译文本: "${text.substring(0, 20)}..."`);
            
            // 这里使用浏览器内置fetch API
            // 使用多个备选API，以防某个API不可用
            try {
                // 谷歌翻译API
                const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
                const data = await response.json();
                return data[0][0][0];
            } catch (error) {
                addDebugInfo("谷歌翻译API失败，尝试备用方案...");
                
                // 备用方案：直接在文本前添加标记
                return "[翻译API无法访问]";
            }
        } catch (error) {
            addDebugInfo("翻译过程出错: " + error.message);
            return text;
        }
    }
    
    // 初始化
    function init() {
        addDebugInfo("沉浸式翻译初始化 (Obsidian版本)");
        
        // 立即尝试添加按钮
        if (document.body) {
            addTranslateButton();
        }
        
        // 也在DOM加载完成后尝试
        document.addEventListener("DOMContentLoaded", function() {
            addDebugInfo("DOMContentLoaded事件触发");
            addTranslateButton();
        });
    }
    
    // 使用多种方法确保脚本执行
    
    // 方法1: 立即执行
    addDebugInfo("脚本开始执行");
    init();
    
    // 方法2: 在DOM加载完成后执行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    }
    
    // 方法3: 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        if (document.body && !document.getElementById("immersive-translate-button")) {
            addDebugInfo("通过MutationObserver检测到DOM变化");
            addTranslateButton();
        }
    });
    
    // 开始观察document变化
    observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true
    });
    
    // 方法4: 使用定时器定期检查
    const checkInterval = setInterval(function() {
        if (document.body && !document.getElementById("immersive-translate-button")) {
            addDebugInfo("通过定时器添加按钮");
            addTranslateButton();
        } else if (document.getElementById("immersive-translate-button")) {
            clearInterval(checkInterval);
        }
    }, 1000);
    
    // 5秒后停止定时器检查
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 5000);
})(); 