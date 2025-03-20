var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => UserScriptManager
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var ScriptSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u7528\u6237\u811A\u672C\u7BA1\u7406\u5668\u8BBE\u7F6E" });
    containerEl.createEl("p", { text: "\u7BA1\u7406\u8981\u5728Web Viewer\u4E2D\u8FD0\u884C\u7684\u7528\u6237\u811A\u672C" });
    new import_obsidian.Setting(containerEl).setName("\u6DFB\u52A0\u65B0\u811A\u672C").setDesc("\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u7528\u6237\u811A\u672C").addButton((button) => button.setButtonText("\u6DFB\u52A0\u811A\u672C").onClick(() => {
      new ScriptModal(this.app, this.plugin, null).open();
    }));
    containerEl.createEl("h3", { text: "\u5DF2\u5B89\u88C5\u7684\u811A\u672C" });
    if (this.plugin.settings.scripts.length === 0) {
      containerEl.createEl("p", { text: "\u6682\u65E0\u5B89\u88C5\u7684\u811A\u672C" });
    } else {
      const scriptListEl = containerEl.createEl("div", { cls: "script-list" });
      this.plugin.settings.scripts.forEach((script) => {
        const scriptEl = scriptListEl.createEl("div", { cls: "script-item" });
        const headerEl = scriptEl.createEl("div", { cls: "script-header" });
        headerEl.createEl("span", { text: script.name, cls: "script-name" });
        if (script.version) {
          headerEl.createEl("span", { text: `v${script.version}`, cls: "script-version" });
        }
        const controlsEl = scriptEl.createEl("div", { cls: "script-controls" });
        new import_obsidian.Setting(controlsEl).setName("\u542F\u7528").addToggle((toggle) => toggle.setValue(script.enabled).onChange(async (value) => {
          script.enabled = value;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(controlsEl).addButton((button) => button.setButtonText("\u7F16\u8F91").onClick(() => {
          new ScriptModal(this.app, this.plugin, script).open();
        })).addButton((button) => button.setButtonText("\u5220\u9664").setWarning().onClick(async () => {
          this.plugin.settings.scripts = this.plugin.settings.scripts.filter((s) => s.id !== script.id);
          await this.plugin.saveSettings();
          this.display();
        }));
        const matchesEl = scriptEl.createEl("div", { cls: "script-matches" });
        matchesEl.createEl("span", { text: "\u5339\u914D\u89C4\u5219: ", cls: "script-matches-label" });
        script.matches.forEach((match) => {
          matchesEl.createEl("span", { text: match, cls: "script-match-item" });
        });
      });
    }
  }
};
var ScriptModal = class extends import_obsidian.Modal {
  constructor(app, plugin, script) {
    super(app);
    this.plugin = plugin;
    this.script = script;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.script ? "\u7F16\u8F91\u811A\u672C" : "\u6DFB\u52A0\u65B0\u811A\u672C" });
    new import_obsidian.Setting(contentEl).setName("\u811A\u672C\u540D\u79F0").addText((text) => {
      this.nameInput = text;
      text.setValue(this.script?.name || "");
    });
    new import_obsidian.Setting(contentEl).setName("\u7248\u672C").addText((text) => {
      this.versionInput = text;
      text.setValue(this.script?.version || "1.0");
    });
    new import_obsidian.Setting(contentEl).setName("\u4F5C\u8005").addText((text) => {
      this.authorInput = text;
      text.setValue(this.script?.author || "");
    });
    new import_obsidian.Setting(contentEl).setName("\u63CF\u8FF0").addText((text) => {
      this.descriptionInput = text;
      text.setValue(this.script?.description || "");
    });
    new import_obsidian.Setting(contentEl).setName("\u5339\u914D\u89C4\u5219").setDesc("\u591A\u4E2A\u89C4\u5219\u4F7F\u7528\u9017\u53F7\u5206\u9694\uFF0C\u4F8B\u5982: *://*.example.com/*").addText((text) => {
      this.matchesInput = text;
      text.setValue(this.script?.matches.join(", ") || "*://*/*");
    });
    contentEl.createEl("h3", { text: "\u811A\u672C\u4EE3\u7801" });
    const codeContainer = contentEl.createEl("div");
    this.codeInput = new import_obsidian.TextAreaComponent(codeContainer);
    this.codeInput.inputEl.style.width = "100%";
    this.codeInput.inputEl.style.height = "200px";
    this.codeInput.inputEl.style.fontFamily = "monospace";
    this.codeInput.setValue(this.script?.code || '// ==UserScript==\n// @name     \u6211\u7684\u811A\u672C\n// @version  1.0\n// @description \u8FD9\u662F\u4E00\u4E2A\u7528\u6237\u811A\u672C\n// ==/UserScript==\n\n(function() {\n    console.log("Hello World!");\n})();');
    const buttonContainer = contentEl.createEl("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.marginTop = "1rem";
    new import_obsidian.ButtonComponent(buttonContainer).setButtonText("\u53D6\u6D88").onClick(() => this.close());
    new import_obsidian.ButtonComponent(buttonContainer).setButtonText("\u4FDD\u5B58").setCta().onClick(() => this.saveScript());
  }
  saveScript() {
    const name = this.nameInput.getValue();
    const version = this.versionInput.getValue();
    const author = this.authorInput.getValue();
    const description = this.descriptionInput.getValue();
    const matches = this.matchesInput.getValue().split(",").map((m) => m.trim()).filter((m) => m);
    const code = this.codeInput.getValue();
    if (!name) {
      return;
    }
    if (matches.length === 0) {
      return;
    }
    if (this.script) {
      this.script.name = name;
      this.script.version = version;
      this.script.author = author;
      this.script.description = description;
      this.script.matches = matches;
      this.script.code = code;
    } else {
      const newScript = {
        id: Date.now().toString(),
        name,
        version,
        author,
        description,
        matches,
        code,
        enabled: true
      };
      this.plugin.settings.scripts.push(newScript);
    }
    this.plugin.saveSettings().then(() => {
      this.close();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/webview-patcher.ts
function patchWebView(scripts) {
  const webviews = document.querySelectorAll("webview");
  if (webviews.length === 0) {
    console.log("\u672A\u627E\u5230webview\u5143\u7D20");
    return;
  }
  console.log(`\u627E\u5230 ${webviews.length} \u4E2Awebview\u5143\u7D20`);
  webviews.forEach((webview) => {
    if (webview.hasAttribute("data-userscript-patched")) {
      return;
    }
    webview.setAttribute("data-userscript-patched", "true");
    webview.addEventListener("did-navigate", (e) => {
      injectScripts(webview, scripts);
    });
    webview.addEventListener("did-navigate-in-page", (e) => {
      injectScripts(webview, scripts);
    });
    webview.addEventListener("dom-ready", (e) => {
      injectScripts(webview, scripts);
    });
    if (webview.getURL && webview.getURL()) {
      injectScripts(webview, scripts);
    }
  });
}
function injectScripts(webview, scripts) {
  const url = webview.getURL();
  if (!url) return;
  console.log(`\u51C6\u5907\u5411 ${url} \u6CE8\u5165\u7528\u6237\u811A\u672C`);
  const matchedScripts = scripts.filter((script) => {
    if (!script.enabled) return false;
    return script.matches.some((pattern) => {
      return urlMatchesPattern(url, pattern);
    });
  });
  if (matchedScripts.length === 0) {
    console.log(`\u6CA1\u6709\u5339\u914D ${url} \u7684\u811A\u672C`);
    return;
  }
  console.log(`\u627E\u5230 ${matchedScripts.length} \u4E2A\u5339\u914D ${url} \u7684\u811A\u672C`);
  matchedScripts.forEach((script) => {
    const code = `
      try {
        console.log("[UserScript] \u6B63\u5728\u8FD0\u884C\u811A\u672C: ${script.name}");
        ${script.code}
        console.log("[UserScript] \u811A\u672C\u8FD0\u884C\u5B8C\u6210: ${script.name}");
      } catch (error) {
        console.error("[UserScript] \u811A\u672C\u8FD0\u884C\u9519\u8BEF:", error);
      }
    `;
    webview.executeJavaScript(code).catch((err) => {
      console.error(`\u6CE8\u5165\u811A\u672C ${script.name} \u5931\u8D25:`, err);
    });
  });
}
function urlMatchesPattern(url, pattern) {
  try {
    let regex;
    if (pattern === "*" || pattern === "*://*/*") {
      return true;
    }
    if (pattern.includes("://") && pattern.includes("*")) {
      const escaped = pattern.replace(/([.?+^$[\]\\(){}|-])/g, "\\$1").replace(/\*/g, ".*");
      regex = new RegExp(`^${escaped}$`);
    } else {
      regex = new RegExp(pattern);
    }
    return regex.test(url);
  } catch (e) {
    console.error("URL\u5339\u914D\u6A21\u5F0F\u89E3\u6790\u9519\u8BEF:", e);
    return false;
  }
}

// src/main.ts
var DEFAULT_SETTINGS = {
  scripts: []
};
var UserScriptManager = class extends import_obsidian2.Plugin {
  async onload() {
    console.log("\u52A0\u8F7D UserScript Manager \u63D2\u4EF6");
    await this.loadSettings();
    this.addSettingTab(new ScriptSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.patchWebViews();
      })
    );
    this.patchWebViews();
  }
  patchWebViews() {
    setTimeout(() => {
      patchWebView(this.settings.scripts);
    }, 1e3);
  }
  onunload() {
    console.log("\u5378\u8F7D UserScript Manager \u63D2\u4EF6");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
