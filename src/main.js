import Vue from 'vue'
import App from './App.vue'
import AgoraRTC from 'agora-rtc-sdk'

Vue.config.productionTip = false
Vue.use(AgoraRTC);


new Vue({
    render: h => h(App),
}).$mount('#app')
