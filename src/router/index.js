import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import CourseManagement from "@/components/CourseManagement";
import CourseEdit from "@/components/CourseEdit";
import CourseTable from "@/components/CourseTable";
import ActivityManagement from "@/components/ActivityManagement";
import FileManagement from "@/components/FileManagement";
import Clock from "@/components/Clock";
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
  {
    path: '/ActivityManagement',
    name: 'ActivityManagement',
    component: ActivityManagement
  },
  {
    path: '/FileManagement',
    name: 'FileManagement',
    component: FileManagement
  },
  {
    path: '/Clock',
    name: 'Clock',
    component: Clock
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
