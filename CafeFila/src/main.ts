import { createApp } from 'vue'
import App from "./App.vue"
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'



import "vue3-toastify/dist/index.css"
import Vue3Toastify from "vue3-toastify";

const app = createApp(App)

app.use(router)


app.use(Vue3Toastify, {     
  autoClose: 2000,
  position: "top-right"
})

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

app.use(vuetify)

app.mount('#app')
