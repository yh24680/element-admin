import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/dirctives' // 自定义指令导入
// 批量导入自定义指令  作用可以简化指令的写法
// 可以把所有的按需导入的全部导入到一个对象中，对象名字directive
import * as obj from '@/dirctives'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

import component from '@/components'
Vue.use(component)

// 时间处理
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 打印插件
import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print)
// 全局混入
import mixins from '@/mixins'
Vue.mixin(mixins)

// 国际化  准备语言翻译环境
import i18n from './lang'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
