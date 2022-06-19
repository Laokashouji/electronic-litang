<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="课程名称" prop="name" required>
      <el-input class="input-button" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="授课教师" prop="teacher">
      <el-input class="input-button" v-model="ruleForm.teacher"></el-input>
    </el-form-item>
    <el-form-item
        v-for="(time, index) in ruleForm.time"
        :label="'上课时间' + index"
        :key="index + '-only'"
        :prop="'time.' + index + '.rowTime'"
        :rules="{required: true, message: '上课时间不能为空', trigger: 'blur'}">
      <el-select v-model="time.weekday" placeholder="请选择星期">
        <el-option label="周一" value="Mon"></el-option>
        <el-option label="周二" value="Tue"></el-option>
        <el-option label="周三" value="Wed"></el-option>
        <el-option label="周四" value="Thu"></el-option>
        <el-option label="周五" value="Fri"></el-option>
      </el-select>
      <el-time-picker
          is-range
          v-model=time.rowTime
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
    <el-form-item label="课程群" prop="group">
      <el-input class="input-button" v-model="ruleForm.group"></el-input>
    </el-form-item>
    <el-form-item label="当前进度" prop="progress">
      <el-input class="input-button" v-model="ruleForm.progress"></el-input>
    </el-form-item>

    <el-form-item
        v-for="(homework, index) in ruleForm.homeWorksToDo.all"
        :label="'作业' + index"
        :key="index"
        :prop="'homeWorksToDo' + index">
      <el-input class="input-button" v-model="ruleForm.homeWorksToDo.all[index]"></el-input>
      <el-button @click.prevent="removeHomework(homework)">删除</el-button>
    </el-form-item>

    <el-form-item label="考试时间" prop="examTime">
        <el-date-picker
            v-model="ruleForm.examTime.formatTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
        </el-date-picker>
      <el-time-picker
          is-range
          v-model= ruleForm.examTime.rowTime
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
      </el-time-picker>
    </el-form-item>
    <el-form-item label="考试地点" prop="examPlace">
      <el-select v-model="ruleForm.examPlace" placeholder="请选择上课地点">
        <el-option label="S105" value="S105"></el-option>
        <el-option label="S205" value="S205"></el-option>
        <el-option label="S305" value="S305"></el-option>
        <el-option label="N105" value="N105"></el-option>
        <el-option label="N205" value="N205"></el-option>
        <el-option label="N305" value="N305"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
      <el-button @click="addTime">新增上课时间</el-button>
      <el-button @click="addHomework">新增作业</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CourseEdit",
  data() {
    return {
      ruleForm: {
      },
      rules: {
        name: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
        ],
        teacher: [
          {required: true, message: '请输入教师名称', trigger: 'blur'},
        ],
        place: [
          {required: true, message: '请选择上课地点', trigger: 'change'}
        ],
        groupNum: [
          {required: false, message: '请输入群号', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/CourseManagement/searchById/' + _this.$route.query.id).then(function (resp) {
      console.log("@@@" + resp.data)
      _this.ruleForm = resp.data
    })
  },
  methods: {
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("@@@")
          axios.post('http://localhost:9090/CourseManagement/editCourse', _this.ruleForm)
              .then(function (resp) {
                if (resp.data == "success") {
                  alert("修改成功")
                }
              })
          this.$router.push({
            path: "/CourseManagement",
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
      const index = this.ruleForm.time.indexOf(item)
      if (index !== -1) {
        this.ruleForm.time.splice(index, 1)
      }
    },
    addTime() {
      this.ruleForm.time.push({
        value: '',
        key: 'Mon'
      });
    },
    removeHomework(item){
      const index = this.ruleForm.homeWorksToDo.all.indexOf(item)
      if (index !== -1) {
        this.ruleForm.homeWorksToDo.all.splice(index, 1)
      }
    },
    addHomework() {
      this.ruleForm.homeWorksToDo.all.push("");
    },
    loadTime() {
      for (let i = 0; i < this.tableData.length; i++) {
        let l = this.tableData[i].time.length
        for (let j = 0; j < l; j++) {
          let t = this.tableData[i].time[j];
          this.tableData[i].time[j] = t.weekday + '. ' + t.startTime + ' ~ ' + t.endTime + '\n';
        }
      }
    },
  }
}
</script>

<style scoped>
  .input-button{
    width: 200px;
  }
</style>