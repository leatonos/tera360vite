import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import TourCreator from "../pages/Tour-Creator.vue"
import Tour from "../pages/Tour.vue"
import Admin from "../pages/Admin.vue"
import AdminDashboard from "../pages/Admin-Dashboard.vue"
import type { RouteLocationNormalized } from "vue-router"
const apiUrl = import.meta.env.VITE_API

const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin, beforeEnter: async () => { if(await isAuthenticated()) { return "/admin-dashboard" } return true }},
  { path: "/admin-dashboard", component: AdminDashboard, meta: { requiresAuth: true } },
  { path: "/tour-creator/:tourId?", component: TourCreator, meta: { requiresAuth: true } },
  { path: "/tour/:tourId?",component: Tour,
  beforeEnter: (to: RouteLocationNormalized) => {
    if (!to.params.tourId) {
      return "/" // redirect to home
    }
    return true // allow navigation
  }
  },
  // catch-all for 404s
  { path: "/:pathMatch(.*)*", redirect: "/" }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


 router.beforeEach(async (to, _from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const authTest = await isAuthenticated()
  
  if (authTest) {
    return next()
  }else{
    return next("/")
  }

})


async function isAuthenticated(): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/check-auth`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    })

    if (!res.ok) return false

    const data = await res.json()
    return data.authenticated === true
  } catch {
    return false
  }
}



export default router