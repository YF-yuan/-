import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VueLazyload from 'vue-lazyload'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
import VueWechatTitle from 'vue-wechat-title';

require('./assets/js/filter')

Vue.use(VueWechatTitle)

Vue.use(ElementUI);
Vue.config.productionTip = false

Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999,
        url: "data-source",
        title: true
    }
})

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/img/404.jpg'),
    loading: require('./assets/img/loading.svg'),
    attempt: 1,
    listenEvents: ['scroll']
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
