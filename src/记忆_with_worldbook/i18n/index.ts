import { createI18n } from 'vue-i18n';
import zh from './zh-CN';
import en from './en-US';

// 从 localStorage 读取用户上次选择的语言，默认中文
const savedLocale = localStorage.getItem('maomao_tool_locale') || 'zh-CN';

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
  },
});

export default i18n;
