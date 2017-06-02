import Vue from 'vue'
import Router from 'vue-router'
import Source from 'vue-resource'
import film from '@/components/film/film'
import find from '@/components/find/find'
import mall from '@/components/mall/mall'
import menu from '@/components/menu/menu'

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
