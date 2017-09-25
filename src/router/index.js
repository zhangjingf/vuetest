import Vue from 'vue'
import Router from 'vue-router'
import Source from 'vue-resource'
import film from '@/views/film'
import find from '@/views/find'
import mall from '@/views/mall'
import menu from '@/views/menu'

Vue.use(Router)
Vue.use(Source)

const routes = [
    { path: '/film', component: film, name: '电影' },
    { path: '/find', component: find, name: '发现' },
    { path: '/mall', component: mall, name: '商城' },
    { path: '/menu', component: menu, name: '我的' }
]

export default new Router({
    routes
})