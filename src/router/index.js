import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Order from '../views/Order.vue'
import Login from '../views/Login.vue'
import Locator from '../views/Locator.vue'
import { _isAuth } from '../services/auth'

const isAuth = _isAuth()

const routes = [
  {
    path: '/',
    name: 'Deliveries',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/order/:orderid',
    name: 'Delivery',
    component: Order,
    props: true
  },
  {
    path: '/locator/:query',
    name: 'Locator',
    component: Locator,
    props: true
  },
  {
    path: '/locator',
    name: 'Location',
    component: Locator,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuth) next({ name: 'Login' })
  else next()
})

export default router
