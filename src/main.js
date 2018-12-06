import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import appEchart from './components/chart'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

Vue.use(appEchart);
//import Axios from "./components/util/diyaxios"
Vue.config.productionTip = false;
//Vue.prototype.$http = Axios;
//console.log(Vue.version);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
})