import Vue from 'vue'
import ECharts from 'vue-echarts'

// 注册组件后即可使用
const appEchart = {
    install(Vue) {
        return Vue.component("app-echart", ECharts);
    }
}
export default appEchart;