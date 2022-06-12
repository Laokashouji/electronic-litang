<template>
  <el-main>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/CourseManagement' }">课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入课程名称" v-model="CourseName" suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByCourseName">搜索</el-button>
      <el-input style="width: 200px" placeholder="请输入教师姓名" v-model="TeacherName" suffix-icon="el-icon-message"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByTeacherName">搜索</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      <el-button type="primary">导入 <i class="el-icon-bottom"></i></el-button>
      <el-button type="primary">导出 <i class="el-icon-top"></i></el-button>
    </div>

    <el-table :data="tableData" border stripe >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="课程资料">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="当前进度">
              <span>{{ props.row.progress }}</span>
            </el-form-item>
            <el-form-item label="已交作业">
              <span>{{ props.row.homeWorksFinished }}</span>
            </el-form-item>
            <el-form-item label="待交作业">
              <span>{{ props.row.homeWorksToDo }}</span>
            </el-form-item>
            <el-form-item label="课程群">
              <span>{{ props.row.group }}</span>
            </el-form-item>
            <el-form-item label="考试时间">
              <span>{{ props.row.examTime }}</span>
            </el-form-item>
            <el-form-item label="考试地点">
              <span>{{ props.row.examPlace }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="teacher" label="授课教师"></el-table-column>
      <el-table-column prop="time" label="上课时间" ></el-table-column>
      <el-table-column prop="place" label="上课地点"></el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template >
          <el-button type="success">编辑 <i class="el-icon-edit"></i></el-button>
          <el-button type="danger">删除 <i class="el-icon-remove-outline"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @current-change="handleCurrentChange"
          :page-size=pageSize
          layout="total, pager"
          :total=totalNum>
      </el-pagination>
    </div>
  </el-main>
</template>

<script>
export default {
  name: "CourseManagement",
  data() {
    return {
      tableData: [],
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      pageSize: 5,
      totalNum: 100,
      CourseName:"高等数学",
      TeacherName:"丁真珍珠",
    }
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp){
      _this.totalNum = resp.data.length;
      _this.tableData = resp.data.slice(0, _this.pageSize)
    })
  },
  methods: {
    handleCurrentChange(pageNum) {
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/findAll/'+pageNum+'/'+_this.pageSize)
          .then(function (resp){
        _this.tableData = resp.data
      })
    },
    searchByCourseName(){
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/searchByCourseName/'+ _this.CourseName)
          .then(function (resp){
            _this.tableData = resp.data
          })
    },
    searchByTeacherName(){
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/searchByTeacherName/'+ _this.TeacherName)
          .then(function (resp){
            _this.tableData = resp.data
          })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>