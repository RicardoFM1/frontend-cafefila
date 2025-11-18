

import Dashboard from '@/components/dashboard/dashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  
  {path: "/dashboard", name: 'dashboard', component: Dashboard}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router