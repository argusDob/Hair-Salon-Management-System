import Vue from "vue";
import VueRouter from "vue-router";
// import Home from '../views/Home.vue'
// import Login from '@/components/Login'
import Login from "@/components/Authorisation/Login";
import Forgot from "@/components/Authorisation/Forgot";
import Reset from "@/components/Authorisation/Reset";
import UserBoard from "@/components/User/UserBoard";
import Employee from "@/components/Employees/Employees";


Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      disableIfLoggedIn: true
    }
  },
  {
    path: "/forgot",
    name: "forgot",
    component: Forgot,
  },
  {
    path: "/reset/:token",
    name: "reset",
    component: Reset
  },
  {
    path: "/dashboard",
    name: "userboard",
    component: UserBoard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/employee",
    name: "employee",
    component: Employee,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({ path: '/login' })
    } else { next() }
  } else if (to.matched.some(record => record.meta.disableIfLoggedIn)) {
    if (localStorage.getItem("jwt")) {
      next({ path: '/userboard' })
    } else {
      next()
    }
  }
});

export default router;
