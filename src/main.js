import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vue3GoogleLogin, {
    clientId: '96794615283-rtfjd2aak1henr0mok7pvchphf2b8dnu.apps.googleusercontent.com'
})

app.mount('#app')
