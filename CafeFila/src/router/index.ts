


import Cadastro from '@/cadastro/cadastro.vue'
import Dashboard from '@/components/dashboard/dashboard.vue'
import Login from '@/login/login.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  
  {path: "/", name: 'dashboard', component: Dashboard},
  {path: "/login", name: 'Login', component: Login},
  {path: "/cadastro", name: 'Cadastro', component: Cadastro}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router