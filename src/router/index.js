import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Order from '../views/Order.vue'

const routes = [
  {
    path: '/',
    name: 'Deliveries',
    component: Home
  },
  {
    path: '/order/:orderid',
    name: 'Delivery',
    component: Order,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
