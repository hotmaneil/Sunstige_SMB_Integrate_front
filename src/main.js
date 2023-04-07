import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import Vue from 'vue'
import jQuery from 'jquery'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import 'default-passive-events'

import App from './App'
import store from './store'
import router from './router'
import VueParticles from 'vue-particles'

import '@/icons' // icon
import '@/permission' // permission control

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import Gantt from 'highcharts/modules/gantt'

import VueResource from 'vue-resource'

import 'signalr'

import 'devextreme/dist/css/dx.material.blue.light.compact.css'

// import movable from 'v-movable'
// Vue.use(movable)

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

Vue.use(VueParticles)

// Vue.use(ElementUI)

Vue.use(require('vue-moment'))

Gantt(Highcharts)
Vue.use(HighchartsVue)

Vue.config.productionTip = false

Vue.use(VueResource)

new Vue({
  el: '#app',
  router,
  store,
  jQuery,
  render: h => h(App)
})

console.log('jQuery$', jQuery)
