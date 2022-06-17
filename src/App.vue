<template>
  <div id="app">
    <el-container style="min-height: 100vh">

      <el-aside :width="sideWidth + 'px'" style="box-shadow: 2px 0 6px rgb(0 21 41);">
        <el-menu :default-openeds="['1', '2']" style="min-height: 100%; overflow-x: hidden"
                 background-color="rgb(20 73 130)"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :collapse-transition="false"
                 :collapse="isCollapse"
        >
          <div style="height: 120px; line-height: 60px; text-align: center">
            <img src="https://www.bupt.edu.cn/images/logo.png" alt="" v-show="logoTextShow"
                 style="position: relative; top: 15px; right: 5px" width="170"/>
            <img src="~@/assets/bupt-removebg-preview.png" alt="" v-show="!logoTextShow"
                 style="position: relative; top: 15px;" width="55"/>
            <br/>
            <b style="color: white" v-show="logoTextShow"><router-link to="/">电子理塘后台管理系统</router-link></b>
          </div>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-management"></i>
              <span slot="title">课程信息管理</span>
            </template>
            <router-link to="/CourseTable"><el-menu-item index="1-1" ><i class="el-icon-date"></i>
              课程表</el-menu-item></router-link>
            <router-link to="/CourseManagement"><el-menu-item index="1-2"><i class="el-icon-files"></i>
              课程管理</el-menu-item></router-link>
            <router-link to="/FileManagement"><el-menu-item index="1-3"><i class="el-icon-edit-outline"></i>
              文件管理</el-menu-item></router-link>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">课外信息管理</span>
            </template>
            <el-menu-item index="2-1"><i class="el-icon-date"></i>活动表</el-menu-item>
            <router-link to="/ActivityManagement"><el-menu-item index="2-2"><i class="el-icon-files"></i>
              活动管理</el-menu-item></router-link>
            <el-menu-item index="2-3"><i class="el-icon-search"></i>活动查询</el-menu-item>
            <el-menu-item index="2-4"><i class="el-icon-alarm-clock"></i>活动提醒</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-map-location"></i>
            <span slot="title">课程导航</span>
          </el-menu-item>
          <el-submenu index="4" disabled>
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">管理员设置</span>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height: 60px; display: flex">
          <div style="flex: 1; font-size: 20px">
            <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>
          </div>
          <div style="flex: 1">
            2022-{{m}}-{{d}}-{{h}}:00:00
<!--            <el-button @click="speedUp"></el-button>-->
          </div>
          <el-dropdown style="width: 70px; cursor: pointer">
            <span>何同学</span>
            <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="font-size: 14px; padding: 5px 5px">个人信息</el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 5px">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <router-view/>

      </el-container>

    </el-container>

  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      m: 6,
      d: 1,
      h: 14,
      times:0
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.times = this.countTime(this.times);
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    collapse() {  // 点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {  // 收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {   // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    countTime (times) {
      if (times != 10) {
        times++
        return times
      }
      if(this.h < 23)
        this.h++
      else {
        this.h = 0
        if(this.d < 30)
          this.d++
        else{
          this.d = 1
          this.m++
        }
      }
      times = 0
      return times
    },

  }
}
</script>

<style scoped>
  a{
    text-decoration: none; /* 去除默认的下划线 */
    color: white;    /* 去除默认的颜色和点击后变化的颜色 */
  }
</style>
