import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { UserScript, UserScriptManagerSettings } from './types';
import { ScriptSettingTab } from './settings';
import { patchWebView } from './webview-patcher';

const DEFAULT_SETTINGS: UserScriptManagerSettings = {
  scripts: []
};

export default class UserScriptManager extends Plugin {
  settings: UserScriptManagerSettings;
  
  async onload() {
    console.log('加载 UserScript Manager 插件');
    
    await this.loadSettings();
    
    // 添加设置选项卡
    this.addSettingTab(new ScriptSettingTab(this.app, this));
    
    // 监听Web Viewer创建事件
    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        this.patchWebViews();
      })
    );
    
    // 修补已经存在的webviews
    this.patchWebViews();
  }
  
  patchWebViews() {
    // 尝试获取所有webview元素
    setTimeout(() => {
      patchWebView(this.settings.scripts);
    }, 1000);
  }

  onunload() {
    console.log('卸载 UserScript Manager 插件');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
} 