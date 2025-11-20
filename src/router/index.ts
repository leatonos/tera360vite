import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import TourCreator from "../pages/Tour-Creator.vue"
import Tour from "../pages/Tour.vue"
import Admin from "../pages/Admin.vue"
import type { RouteLocationNormalized } from "vue-router"


const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin, meta: { requiresAuth: true } },
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

/**
 router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  try {
    const res = await fetch("https://YOUR_API_DOMAIN/check-auth", {
      method: "POST",
      credentials: "include", // IMPORTANT → sends cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username") // or however you're storing it
      })
    })

    if (res.ok) {
      const data = await res.json()
      if (data.authenticated) return next()
    }

    // Not authenticated?
    next("/") // redirect to home or login page
  } catch (err) {
    next("/") // fallback
  }
})

 */


export default router