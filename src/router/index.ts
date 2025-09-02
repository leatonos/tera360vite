import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import TourCreator from "../pages/Tour-Creator.vue"
import Tour from "../pages/Tour.vue"
import type { RouteLocationNormalized } from "vue-router"


const routes = [
  { path: "/", component: Home },
  { path: "/tour-creator/:tourId?", component: TourCreator },
 {
  path: "/tour/:tourId?",
  component: Tour,
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

export default router
