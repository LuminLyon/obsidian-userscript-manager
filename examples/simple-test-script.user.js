// ==UserScript==
// @name         简单测试脚本
// @version      1.0.0
// @description  测试Obsidian用户脚本运行环境
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建一个简单的红色方块，无论如何都应该显示
    function createTestElement() {
        // 记录一些信息到控制台
        console.log("测试脚本执行了！");
        
        // 创建一个红色方块
        const testElement = document.createElement('div');
        testElement.id = 'obsidian-test-element';
        testElement.style.position = 'fixed';
        testElement.style.top = '50px';
        testElement.style.right = '50px';
        testElement.style.width = '100px';
        testElement.style.height = '100px';
        testElement.style.backgroundColor = 'red';
        testElement.style.zIndex = '10000';
        testElement.style.borderRadius = '10px';
        testElement.style.display = 'flex';
        testElement.style.justifyContent = 'center';
        testElement.style.alignItems = 'center';
        testElement.style.color = 'white';
        testElement.style.fontWeight = 'bold';
        testElement.textContent = '测试元素';
        
        // 添加点击事件
        testElement.addEventListener('click', function() {
            alert('测试脚本工作正常！');
        });
        
        // 添加到页面
        document.body.appendChild(testElement);
    }
    
    // 不同的执行时机尝试
    
    // 方法1: 直接执行
    if (document.body) {
        createTestElement();
    }
    
    // 方法2: DOMContentLoaded事件
    document.addEventListener('DOMContentLoaded', createTestElement);
    
    // 方法3: load事件
    window.addEventListener('load', createTestElement);
    
    // 方法4: 使用setTimeout
    setTimeout(createTestElement, 1000);
    setTimeout(createTestElement, 3000);
})(); 