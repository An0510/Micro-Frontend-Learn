import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {registerApplication, start} from 'single-spa'

Vue.config.productionTip = false

// 通过url加载子应用
function createScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = resolve
        script.onerror = reject
        const firstScript = document.getElementsByTagName('script')[0]
        firstScript.parentNode.insertBefore(script, firstScript)
    })
}

// 加载函数 返回一个Promise
function loadApp(url, globalVar) {
    // 可以远程加载子应用
    return async () => {
        await createScript(url + '/js/chunk-vendors.js')
        await createScript(url + '/js/app.js')
        // 这里的return很重要，要从这个全局对象中拿到子应用暴露出来的生命周期函数
        return window[globalVar]
    }
}

// 子应用列表
const apps = [
    {
        // 子应用名称
        name: 'app1',
        // 子应用加载函数，是一个Promise
        app: loadApp('http://localhost:8081', 'app1'),
        // 当路由满足条件时返回true 并且激活挂载子应用
        activeWhen: location => location.pathname.startsWith('/app1'),
        // 传递给子应用的对象
        customProps: {}
    },
    {
        name: 'app2',
        app: loadApp('http://localhost:8082', 'app2'),
        activeWhen: location => location.pathname.startsWith('/app2'),
        customProps: {}
    }
]

// 注册子应用
for (let i = apps.length - 1; i >= 0; i--) {
    registerApplication(apps[i])
}
// // 注册子应用
// apps.forEach(app => {
//     registerApplication(app)
// })

new Vue({
    router,
    mounted() {
        // 启动微前端
        start()
    },
    render: h => h(App)
}).$mount('#app')
