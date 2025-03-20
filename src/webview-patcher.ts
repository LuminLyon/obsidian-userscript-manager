import { UserScript } from './types';

/**
 * 修补webview以注入用户脚本
 */
export function patchWebView(scripts: UserScript[]): void {
  // 获取文档中的所有webview元素
  const webviews = document.querySelectorAll('webview');
  
  if (webviews.length === 0) {
    console.log('未找到webview元素');
    return;
  }
  
  console.log(`找到 ${webviews.length} 个webview元素`);
  
  webviews.forEach((webview) => {
    // 检查是否已经应用过补丁
    if (webview.hasAttribute('data-userscript-patched')) {
      return;
    }
    
    // 标记为已补丁
    webview.setAttribute('data-userscript-patched', 'true');
    
    // 监听did-navigate, did-navigate-in-page和dom-ready事件
    webview.addEventListener('did-navigate', (e) => {
      injectScripts(webview as any, scripts);
    });
    
    webview.addEventListener('did-navigate-in-page', (e) => {
      injectScripts(webview as any, scripts);
    });
    
    webview.addEventListener('dom-ready', (e) => {
      injectScripts(webview as any, scripts);
    });
    
    // 如果webview已经加载完成，立即注入脚本
    if ((webview as any).getURL && (webview as any).getURL()) {
      injectScripts(webview as any, scripts);
    }
  });
}

/**
 * 注入用户脚本到webview
 */
function injectScripts(webview: any, scripts: UserScript[]): void {
  // 获取当前URL
  const url = webview.getURL();
  if (!url) return;
  
  console.log(`准备向 ${url} 注入用户脚本`);
  
  // 过滤出匹配当前URL的启用脚本
  const matchedScripts = scripts.filter(script => {
    if (!script.enabled) return false;
    
    // 检查URL是否匹配脚本的匹配规则
    return script.matches.some(pattern => {
      return urlMatchesPattern(url, pattern);
    });
  });
  
  if (matchedScripts.length === 0) {
    console.log(`没有匹配 ${url} 的脚本`);
    return;
  }
  
  console.log(`找到 ${matchedScripts.length} 个匹配 ${url} 的脚本`);
  
  // 注入每个匹配的脚本
  matchedScripts.forEach(script => {
    const code = `
      try {
        console.log("[UserScript] 正在运行脚本: ${script.name}");
        ${script.code}
        console.log("[UserScript] 脚本运行完成: ${script.name}");
      } catch (error) {
        console.error("[UserScript] 脚本运行错误:", error);
      }
    `;
    
    webview.executeJavaScript(code).catch((err: any) => {
      console.error(`注入脚本 ${script.name} 失败:`, err);
    });
  });
}

/**
 * 检查URL是否匹配油猴样式的匹配模式
 */
function urlMatchesPattern(url: string, pattern: string): boolean {
  // 简单实现，未来可以完全实现油猴的匹配规则
  try {
    // 将油猴格式的匹配模式转换为正则表达式
    let regex: RegExp;
    
    if (pattern === '*' || pattern === '*://*/*') {
      return true; // 匹配所有URL
    }
    
    if (pattern.includes('://') && pattern.includes('*')) {
      // 处理类似 *://*.example.com/* 的模式
      const escaped = pattern
        .replace(/([.?+^$[\]\\(){}|-])/g, "\\$1")
        .replace(/\*/g, '.*');
      regex = new RegExp(`^${escaped}$`);
    } else {
      // 简单的包含匹配
      regex = new RegExp(pattern);
    }
    
    return regex.test(url);
  } catch (e) {
    console.error('URL匹配模式解析错误:', e);
    return false;
  }
} 