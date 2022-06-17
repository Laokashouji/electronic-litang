<template>
  <el-main>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/CourseManagement' }">课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="findAll" style="margin-right: 20px">显示全部</el-button>
      <el-input style="width: 200px" placeholder="请输入课程名称" v-model="CourseName" suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByCourseName">搜索</el-button>
      <el-input style="width: 200px" placeholder="请输入教师姓名" v-model="TeacherName"
                suffix-icon="el-icon-message"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByTeacherName">搜索</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="dialogFormVisible = true">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </div>

    <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="课程名称" prop="name" required>
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacherName">
          <el-input v-model="ruleForm.teacherName"></el-input>
        </el-form-item>
        <el-form-item
            v-for="(time, index) in ruleForm.times"
            :label="'上课时间' + index"
            :key="index"
            :prop="'times.' + index + '.value'"
            :rules="{required: true, message: '上课时间不能为空', trigger: 'blur'}">
          <el-select v-model="time.key" placeholder="请选择星期">
            <el-option label="周一" value="Mon"></el-option>
            <el-option label="周二" value="Tue"></el-option>
            <el-option label="周三" value="Wed"></el-option>
            <el-option label="周四" value="Thu"></el-option>
            <el-option label="周五" value="Fri"></el-option>
          </el-select>
          <el-time-picker
              is-range
              v-model=time.value
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
          </el-time-picker>
          <el-button @click.prevent="removeTime(time)">删除</el-button>
        </el-form-item>
        <el-form-item label="上课地点" prop="place">
          <el-select v-model="ruleForm.place" placeholder="请选择上课地点">
            <el-option label="S105" value="S105"></el-option>
            <el-option label="S205" value="S205"></el-option>
            <el-option label="S305" value="S305"></el-option>
            <el-option label="N105" value="N105"></el-option>
            <el-option label="N205" value="N205"></el-option>
            <el-option label="N305" value="N305"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程群" prop="groupNum">
          <el-input v-model="ruleForm.groupNum"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="addTime">新增上课时间</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="tableData" border stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="课程资料">
              <span>{{ props.row.meterials}}</span>
            </el-form-item>
            <el-form-item label="当前进度">
              <span>{{ props.row.progress }}</span>
            </el-form-item>
            <el-form-item label="已交作业">
              <span>{{ props.row.homeWorksFinished}}</span>
            </el-form-item>
            <el-form-item label="待交作业">
              <span>{{ props.row.homeWorksToDo}}</span>
            </el-form-item>
            <el-form-item label="课程群">
              <span>{{ props.row.group }}</span>
            </el-form-item>
            <el-form-item label="考试时间">
              <span>{{ props.row.examTime.formatTime+" "+props.row.examTime.startTime+"~"+props.row.examTime.endTime}}</span>
            </el-form-item>
            <el-form-item label="考试地点">
              <span>{{ props.row.examPlace == "" ? "无" : props.row.examPlace}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="teacher" label="授课教师"></el-table-column>
      <el-table-column prop="time" label="上课时间"></el-table-column>
      <el-table-column prop="place" label="上课地点"></el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="edit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
<!--          <el-button type="danger">删除 <i class="el-icon-remove-outline"></i></el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @current-change="handleCurrentChange"
          :page-size=pageSize
          :current-page=currentPage
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
      sourceData: [],
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      pageSize: 5,
      currentPage: 1,
      totalNum: 100,
      dialogFormVisible: false,
      ruleForm: {
        name: '数据结构',
        teacherName: '丁真珍珠',
        times: [{}],
        place: '',
        groupNum: '114514789',
      },
      rules: {
        name: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
        ],
        teacherName: [
          {required: true, message: '请输入教师名称', trigger: 'blur'},
        ],
        place: [
          {required: true, message: '请选择上课地点', trigger: 'change'}
        ],
        groupNum: [
          {required: false, message: '请输入群号', trigger: 'blur'}
        ],
      },
      CourseName: "",
      TeacherName: "",
    }
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp) {
      _this.totalNum = resp.data.length;
      _this.sourceData = resp.data;
      _this.handleCurrentChange(1);
    })
  },
  methods: {
    findAll() {
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp) {
        _this.totalNum = resp.data.length;
        _this.sourceData = resp.data;
        _this.handleCurrentChange(1);
      })
    },
    handleCurrentChange(pageNum) {
      this.tableData = this.sourceData.slice((pageNum - 1) * this.pageSize, pageNum * this.pageSize)
      this.loadTime()
    },
    searchByCourseName() {
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/searchByCourseName/' + _this.CourseName)
          .then(function (resp) {
            _this.totalNum = resp.data.length;
            _this.sourceData = resp.data;
            _this.handleCurrentChange(1);
          })
    },
    searchByTeacherName() {
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/searchByTeacherName/' + _this.TeacherName)
          .then(function (resp) {
            _this.totalNum = resp.data.length;
            _this.sourceData = resp.data;
            _this.handleCurrentChange(1);
          })
    },
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://localhost:9090/CourseManagement/addCourse', _this.ruleForm)
              .then(function (resp) {
                if(resp.data == "success") {
                  _this.dialogFormVisible = false
                  _this.findAll()
                  alert("添加成功")
                }
              })
        } else {
          alert('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeTime(item) {
      const index = this.ruleForm.times.indexOf(item)
      if (index !== -1) {
        this.ruleForm.times.splice(index, 1)
      }
    },
    addTime() {
      this.ruleForm.times.push({
        value: '',
        key: 'Mon'
      });
    },
    loadTime(){
      for(let i = 0; i < this.tableData.length; i++){
        let l = this.tableData[i].time.length
        for (let j = 0; j < l; j++) {
          let t = this.tableData[i].time[j];
          this.tableData[i].time[j] = t.weekday + '. ' + t.startTime + ' ~ ' + t.endTime + '\n';
        }
      }
    },
    edit(row){
      this.$router.push({
        path: "/CourseEdit",
        query:{
          id: row.id,
        }
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

.demo-table-expand{
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>