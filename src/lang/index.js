import Vue from 'vue'

import en from './en.js'
import zh from './zh.js'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 国际化  准备语言翻译环境
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
Vue.use(VueI18n)
// 准备翻译的语言环境信息
const messages = {
  en: {
    message: {
      hello: 'hello world',
      calendar: 'calendar'

    },
    ...en,
    ...enLocale
  },
  zh: {
    message: {
      hello: '你好世界',
      calendar: '工作日历'

    },
    ...zh,
    ...zhLocale
  }
}
// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: Cookies.get('locale') || 'zh', // 设置地区
  messages // 设置地区信息
})

export default i18n
