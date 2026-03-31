import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratorView from '../views/GeneratorView.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/writing-paper',
      name: 'writing-paper',
      component: GeneratorView
    },
    {
      path: '/lunar-calendar',
      name: 'lunar-calendar',
      component: CalendarView
    },
    // We can add more routes here for planner etc later
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

