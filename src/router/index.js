import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import CourseManagement from "@/components/CourseManagement";
import CourseEdit from "@/components/CourseEdit";
import CourseTable from "@/components/CourseTable";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/CourseManagement',
    name: 'CourseManagement',
    component: CourseManagement
  },
  {
    path: '/CourseEdit',
    name: 'CourseEdit',
    component: CourseEdit
  },
  {
    path: '/CourseTable',
    name: 'CourseTable',
    component: CourseTable
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
