import './assets/main.css'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'

const app = createApp(App)

const pinia = createPinia()
app.use(router)
app.use(vuetify)
app.use(pinia)

app.mount('#app')
