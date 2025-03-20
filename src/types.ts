export interface UserScript {
  id: string;        // 脚本唯一ID
  name: string;      // 脚本名称
  enabled: boolean;  // 是否启用
  matches: string[]; // URL匹配模式（类似油猴的@match）
  code: string;      // 脚本代码
  description?: string; // 脚本描述
  version?: string;     // 脚本版本
  author?: string;      // 脚本作者
}

export interface UserScriptManagerSettings {
  scripts: UserScript[];
} 