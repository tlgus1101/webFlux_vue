import Vue from 'vue'
import Router from 'vue-router'
import TodoList from '@/components/TodoList'
import OmOdList from '@/components/OmOdList'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OmOdList',
      component: OmOdList
    },
    {
      path: '/todo',
      name: 'TodoList',
      component: TodoList
    },
  ]
})
