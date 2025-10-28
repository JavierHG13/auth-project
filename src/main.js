import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vue3GoogleLogin, {
    clientId: '274188687279-tndhi3kfbplab1tc9h9fnkvtj7jao73f.apps.googleusercontent.com'
})

app.mount('#app')
