import { createI18n } from "vue-i18n";
import zh_cn from "../language/zh_cn.json";
import en_us from "../language/en_us.json";

const i18n = createI18n({
  locale: "en_us",
  fallbackLocale: "en_us",
  messages: {
    zh_cn,
    en_us
  }
});

window.$t = i18n.global.t;
window.i18n = i18n;
export default i18n;
