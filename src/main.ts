import 'core-js'
import Vue from 'vue'
import App from './App.vue'
import store from './plugins/store'
import * as utils from '@/utils'
import MsgInput from '@/components/MsgInput.vue'
import Login from '@/pages/user/Login.vue'
// main.js
import uView from 'uview-ui'
import UniUtils from '@/utils/UniUtils'

Vue.use(uView)

Vue.component('MsgInput', MsgInput)
Vue.component('Login', Login)

Vue.config.productionTip = false

// register global utility filters.
Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})

Vue.prototype.$store = store
Vue.prototype.$utils = UniUtils

new App({
  store
}).$mount()
