import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name:'main',
      path:"/",
      component:()=>import('../component/layout.vue')
    }
  ]
})

export default router
