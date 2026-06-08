import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'
import AppIcon from './components/AppIcon.vue'
import './css/template.css'

const app = createApp(App)

app.component('AppIcon', AppIcon)
app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: { Notify, Dialog, Loading },
  config: {
    brand: { primary: '#0052ff' },
    notify: { position: 'top-right', timeout: 3000 },
  },
})

app.mount('#app')
