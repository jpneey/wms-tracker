import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { inBG } from './services/worker'

inBG()

createApp(App).use(router).mount('#app')
