import Vue from 'vue'
import Router from 'vue-router'
import Source from 'vue-resource'
import film from '@/views/film'
import find from '@/views/find'
import mall from '@/views/mall'
import menu from '@/views/menu'
import echart from '@/views/echart'
import detail from '@/views/filmDetail'

if (process.env.NODE_ENV === 'development') {
    Vue.use(Router)
    Vue.use(Source)
}

const routes = [
    { path: '/film', component: film, name: '电影' },
    { path: '/find', component: find, name: '发现' },
    { path: '/mall', component: mall, name: '商城' },
    { path: '/menu', component: menu, name: '我的' },
    { path: '/film/detail', component: detail, name: '详情'}
]

export default new Router({
    routes
})