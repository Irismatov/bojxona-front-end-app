import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from "vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/index.vue"),
      meta: {
        layout: "main",
        roles: ["ADMIN", "DECLARANT", "MANAGER"]
      }
    },
    {
      path: "/auth",
      component: () => import("@/views/auth.vue"),
      meta: {
        layout: "auth"
      }
    },
    {
      path: "/applications",
      component: () => import("@/views/applications.vue"),
      meta: {
        layout: "main",
        roles: ["ADMIN", "DECLARANT"]
      },
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
          component: () => import("@/views/applications/[id].vue"),
        }
      ]
    },
    {
      path: "/employees",
      component: () => import("@/views/employees.vue"),
      meta: {
        layout: "main",
        roles: ["ADMIN", "MANAGER"]
      }
    },
    {
      path: "/reports",
      component: () => import("@/views/reports.vue"),
      meta: {
        layout: "main",
        roles: ["ADMIN", "MANAGER"]
      }
    },
    {
      path: "/error",
      component: () => import("@/views/error.vue")
    },
    {
      path: "/chat-demo",
      component: () => import("@/views/DeclChatDemo.vue")
    }
  ],
})

export default router

router.beforeEach(setLayout);

async function setLayout(route) {
  let layout = route.meta?.layout ?? 'default';
  let layoutComponent = await import(`@/components/local/layouts/${layout}.vue`);
  route.meta.layoutComponent = layoutComponent.default;
}