import App from './App.vue'
// import bar from '../lib/progress_bar'
// import VueAjax from '../lib/ajax'
import HcVue from '../lib'

// bar.setOptions({
//   duration: 2000
// })
// Vue.prototype.$bar = bar
// Vue.use(VueAjax)

Vue.use(HcVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
