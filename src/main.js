import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

/**
 * 判断操作按钮是否显示
 * @param {*} action action
 * @param {*} actions action集合
 */
Vue.prototype.showButton = function(action, actions) {
  if (!actions || actions.length === 0) {
    return false
  }
  // console.log(action, actions.indexOf(action))
  return actions.indexOf(action) >= 0
}

/**
 * 判断操作按钮是否显示
 * @param {*} value value
 * @param {*} clazz 类型
 */
Vue.prototype.format = function(value, clazz) {
  switch (clazz) {
    case String:
      value = value + ''
      break
    default:
  }
  console.log('val', value)
  return value
}

/**
 * 把值写入sessionStorage
 * @param {*} key 缓存key
 * @param {*} value 缓存值
 */
Vue.prototype.storage = function(key, value) {
  if (value) {
    sessionStorage.setItem(key, JSON.stringify(value))
    return
  }
  return JSON.parse(sessionStorage.getItem(key))
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
