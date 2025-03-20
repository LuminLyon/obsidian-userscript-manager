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

GNU通用公共许可证v3.0 (GPLv3)

版权所有 (c) 2024 LuminLyon

本程序是自由软件：您可以根据自由软件基金会发布的GNU通用公共许可证的条款（许可证的第3版，或（您可以选择）任何更新的版本）重新发布和/或修改它。

发布本程序的目的是希望它能发挥作用，但没有任何保证；甚至没有对适销性或特定用途适用性的暗示保证。有关更多详细信息，请参阅GNU通用公共许可证。

您应该已经收到了一份GNU通用公共许可证的副本。如果没有，请参阅 <https://www.gnu.org/licenses/>。

### 附加条款

1. 您必须在所有副本或重要部分的显著位置上注明适当的版权声明和许可声明。

2. 如果您修改了代码，您必须在文件中说明您修改了文件，并注明修改的日期。

3. 如果您的版本提供了任何形式的用户界面，它必须以适当的方式显示以下内容：
   - 适当的法律声明
   - 对原始作者的署名
   - 说明没有任何保证（或者您提供保证）
   - 告知用户可以在这些条款下重新分发程序
   - 告知用户如何查看本许可证的副本

### 贡献

欢迎提交问题和拉取请求。在提交拉取请求之前，请确保您的代码符合以下要求：

1. 遵循现有的代码风格
2. 添加适当的测试
3. 更新文档以反映更改
4. 在提交消息中清楚地说明更改内容

### 免责声明

本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于对适销性和特定用途适用性的保证。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任负责，无论是在合同诉讼、侵权行为还是其他方面，由软件或软件的使用或其他交易引起、由软件引起或与之相关。 