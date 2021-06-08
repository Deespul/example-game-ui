import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

const _apiUrl = (window as any)._env_.API_URL;
const _matchBoxApi = (window as any)._env_.MATCHBOX_API;

export const API_URL = _apiUrl;
export const MATCHBOX_API = _matchBoxApi;

new Vue({
  store: store.original,
  vuetify,
  render: h => h(App)
}).$mount('#app')
