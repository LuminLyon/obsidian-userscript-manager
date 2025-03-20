# Obsidian UserScript Manager

一个类似Tampermonkey的Obsidian插件，允许在Obsidian的Web Viewer中运行自定义JavaScript脚本。

## 特性

- 管理用户脚本（添加、编辑、启用/禁用、删除）
- 支持油猴风格的URL匹配模式
- 基于URL自动注入脚本
- 友好的用户界面

## 局限性

这个插件有一些内在的限制：

- 不支持跨域请求（由于Web Viewer的安全限制）
- 不支持GM_*系列API（如GM_setValue、GM_xmlhttpRequest等）
- 不支持跨域存储访问

## 安装

1. 将`main.js`、`manifest.json`和`styles.css`文件复制到你的Obsidian插件目录：
   - Windows: `%APPDATA%\Obsidian\plugins\obsidian-userscript-manager\`
   - macOS: `~/Library/Application Support/obsidian/plugins/obsidian-userscript-manager/`
   - Linux: `~/.config/obsidian/plugins/obsidian-userscript-manager/`

2. 重启Obsidian并在设置中启用插件。

## 使用方法

1. 在Obsidian设置中找到"UserScript Manager"
2. 点击"添加脚本"按钮
3. 填写脚本详细信息：
   - 名称
   - 匹配模式（例如 `*://*.example.com/*`）
   - 脚本代码
4. 保存脚本
5. 使用Obsidian的Web Viewer访问匹配的URL，脚本将自动运行

## 示例脚本

在`examples`目录中提供了一些示例脚本：

### 暗黑模式 (dark-mode-search-engines.js)

一个为搜索引擎（如Bing、Google）添加暗黑模式的脚本，包含一个优雅的切换按钮。

```javascript
// @name     增强暗黑模式 - 搜索引擎专用
// @match    *://*.bing.com/*
// @match    *://*.google.com/*
// @match    *://*.baidu.com/*
// @version  1.1
// @description 提供更强大的暗黑模式覆盖，专为搜索引擎优化
```

## 开发

要构建此插件：

```bash
# 安装依赖
npm install

# 构建
npx esbuild src/main.ts --bundle --external:obsidian --outfile=main.js --format=cjs
```

## 许可证

MIT 