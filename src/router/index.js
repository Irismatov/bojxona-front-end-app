import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from "vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/index.vue")
    },
    {
      path: "/applications",
      component: () => import("@/views/applications.vue"),
      children: [
        {
          path: "",
          component: () => import("@/views/applications/index.vue")
        },
        {
          path: "progress",
          component: () => import("@/views/applications/progress.vue")
        },
        {
          path: "pending",
          component: () => import("@/views/applications/pending.vue")
        },
        {
          path: "finished",
          component: () => import("@/views/applications/finished.vue")
        },
        {
          path: "detail/:id",
          component: () => import("@/views/applications/[id].vue")
        }
      ]
    },
    {
      path: "/employees",
      component: () => import("@/views/employees.vue")
    },
    {
      path: "/reports",
      component: () => import("@/views/reports.vue")
    }
  ],
})

export default router
