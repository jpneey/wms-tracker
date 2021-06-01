import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { inBG } from './services/worker'

// mount app on deviceready event
document.addEventListener('deviceready', () => {
  inBG()
  createApp(App).use(router).mount('#app')
}, false)
