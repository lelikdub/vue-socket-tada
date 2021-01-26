import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false

Vue.use(VueNativeSock, 'ws://localhost:9090', {
  connectManually: true,
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
