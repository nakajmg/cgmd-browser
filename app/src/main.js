import Vue from 'vue'
import Electron from 'vue-electron'
import '../src/css/photon.min.css'

Vue.use(Electron)
Vue.config.debug = true

import App from './App'

/* eslint-disable no-new */
new Vue({
  ...App
}).$mount('#app')
