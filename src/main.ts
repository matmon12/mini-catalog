import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from '@/App.vue'
import router from '@/router/index'
import '@/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).use(autoAnimatePlugin).mount('#app')
