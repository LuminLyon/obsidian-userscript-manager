import { App, PluginSettingTab, Setting, TextAreaComponent, TextComponent, Modal, ButtonComponent } from 'obsidian';
import UserScriptManager from './main';
import { UserScript } from './types';

export class ScriptSettingTab extends PluginSettingTab {
  plugin: UserScriptManager;

  constructor(app: App, plugin: UserScriptManager) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: '用户脚本管理器设置' });
    containerEl.createEl('p', { text: '管理要在Web Viewer中运行的用户脚本' });

    // 添加新脚本按钮
    new Setting(containerEl)
      .setName('添加新脚本')
      .setDesc('创建一个新的用户脚本')
      .addButton(button => button
        .setButtonText('添加脚本')
        .onClick(() => {
          new ScriptModal(this.app, this.plugin, null).open();
        }));

    // 脚本列表
    containerEl.createEl('h3', { text: '已安装的脚本' });
    
    if (this.plugin.settings.scripts.length === 0) {
      containerEl.createEl('p', { text: '暂无安装的脚本' });
    } else {
      const scriptListEl = containerEl.createEl('div', { cls: 'script-list' });
      
      this.plugin.settings.scripts.forEach(script => {
        const scriptEl = scriptListEl.createEl('div', { cls: 'script-item' });
        
        const headerEl = scriptEl.createEl('div', { cls: 'script-header' });
        headerEl.createEl('span', { text: script.name, cls: 'script-name' });
        
        if (script.version) {
          headerEl.createEl('span', { text: `v${script.version}`, cls: 'script-version' });
        }
        
        const controlsEl = scriptEl.createEl('div', { cls: 'script-controls' });
        
        // 启用/禁用切换
        new Setting(controlsEl)
          .setName('启用')
          .addToggle(toggle => toggle
            .setValue(script.enabled)
            .onChange(async value => {
              script.enabled = value;
              await this.plugin.saveSettings();
            }));
        
        // 编辑按钮
        new Setting(controlsEl)
          .addButton(button => button
            .setButtonText('编辑')
            .onClick(() => {
              new ScriptModal(this.app, this.plugin, script).open();
            }))
          .addButton(button => button
            .setButtonText('删除')
            .setWarning()
            .onClick(async () => {
              this.plugin.settings.scripts = this.plugin.settings.scripts.filter(s => s.id !== script.id);
              await this.plugin.saveSettings();
              this.display();
            }));
        
        // 脚本匹配规则
        const matchesEl = scriptEl.createEl('div', { cls: 'script-matches' });
        matchesEl.createEl('span', { text: '匹配规则: ', cls: 'script-matches-label' });
        script.matches.forEach(match => {
          matchesEl.createEl('span', { text: match, cls: 'script-match-item' });
        });
      });
    }
  }
}

export class ScriptModal extends Modal {
  plugin: UserScriptManager;
  script: UserScript | null;
  nameInput: TextComponent;
  versionInput: TextComponent;
  authorInput: TextComponent;
  descriptionInput: TextComponent;
  matchesInput: TextComponent;
  codeInput: TextAreaComponent;

  constructor(app: App, plugin: UserScriptManager, script: UserScript | null) {
    super(app);
    this.plugin = plugin;
    this.script = script;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: this.script ? '编辑脚本' : '添加新脚本' });

    // 基本信息表单
    new Setting(contentEl)
      .setName('脚本名称')
      .addText(text => {
        this.nameInput = text;
        text.setValue(this.script?.name || '');
      });

    new Setting(contentEl)
      .setName('版本')
      .addText(text => {
        this.versionInput = text;
        text.setValue(this.script?.version || '1.0');
      });

    new Setting(contentEl)
      .setName('作者')
      .addText(text => {
        this.authorInput = text;
        text.setValue(this.script?.author || '');
      });

    new Setting(contentEl)
      .setName('描述')
      .addText(text => {
        this.descriptionInput = text;
        text.setValue(this.script?.description || '');
      });

    new Setting(contentEl)
      .setName('匹配规则')
      .setDesc('多个规则使用逗号分隔，例如: *://*.example.com/*')
      .addText(text => {
        this.matchesInput = text;
        text.setValue(this.script?.matches.join(', ') || '*://*/*');
      });

    // 脚本代码编辑器
    contentEl.createEl('h3', { text: '脚本代码' });
    
    const codeContainer = contentEl.createEl('div');
    this.codeInput = new TextAreaComponent(codeContainer);
    this.codeInput.inputEl.style.width = '100%';
    this.codeInput.inputEl.style.height = '200px';
    this.codeInput.inputEl.style.fontFamily = 'monospace';
    this.codeInput.setValue(this.script?.code || '// ==UserScript==\n// @name     我的脚本\n// @version  1.0\n// @description 这是一个用户脚本\n// ==/UserScript==\n\n(function() {\n    console.log("Hello World!");\n})();');

    // 保存和取消按钮
    const buttonContainer = contentEl.createEl('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '1rem';

    new ButtonComponent(buttonContainer)
      .setButtonText('取消')
      .onClick(() => this.close());

    new ButtonComponent(buttonContainer)
      .setButtonText('保存')
      .setCta()
      .onClick(() => this.saveScript());
  }

  saveScript() {
    // 获取表单数据
    const name = this.nameInput.getValue();
    const version = this.versionInput.getValue();
    const author = this.authorInput.getValue();
    const description = this.descriptionInput.getValue();
    const matches = this.matchesInput.getValue().split(',').map(m => m.trim()).filter(m => m);
    const code = this.codeInput.getValue();

    if (!name) {
      // 显示错误
      return;
    }

    if (matches.length === 0) {
      // 显示错误
      return;
    }

    // 创建或更新脚本
    if (this.script) {
      // 更新现有脚本
      this.script.name = name;
      this.script.version = version;
      this.script.author = author;
      this.script.description = description;
      this.script.matches = matches;
      this.script.code = code;
    } else {
      // 创建新脚本
      const newScript: UserScript = {
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

    // 保存设置
    this.plugin.saveSettings().then(() => {
      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
} 