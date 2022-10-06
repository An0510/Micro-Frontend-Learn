import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'

Vue.config.productionTip = false

const appOptions = {
    el: '#microApp',
    router,
    render: h => h(App)
}
// 可以不依赖基座独立运行
if (!window.singleSpaNavigate) {
    delete appOptions.el
    new Vue(appOptions).$mount('#app')
}
// 基于基座应用导出生命周期函数
const vueLifecycles = singleSpaVue({
  Vue, appOptions
})

export function boostrap(props) {
  console.log('app2 bootstrap')
  return vueLifecycles.bootstrap(() => {})
}

export function mount(props) {
  console.log('app2 mount')
  return vueLifecycles.mount(() => {})
}

export function unmount(props) {
  console.log('app2 unmount')
  return vueLifecycles.unmount(() => {})
}





// new Vue({
//   el: '#microApp',
//   router,
//   render: h => h(App),
// }).$mount('#app')
