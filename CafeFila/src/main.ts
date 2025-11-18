

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { components, directives } from 'vuetify/dist/vuetify.js'
import { aliases } from 'vuetify/iconsets/fa-svg'
import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi-svg'


const app = createApp(App)
const vuetify = createVuetify({
    icons:{
        defaultSet: 'mdi',
        aliases,
        sets:{
            mdi,
        }
    },
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})
app.use(router)
app.use(vuetify)
app.mount('#app')
