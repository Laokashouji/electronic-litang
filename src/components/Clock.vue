<template>
  <el-main>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Clock' }">活动提醒</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="findAll" style="margin-right: 20px">显示全部</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="dialogFormVisible = true">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </div>

    <el-dialog title="新增闹钟" :visible.sync="dialogFormVisible">

      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item label="闹钟名称" prop="name" required>
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="闹钟类型">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="1">单次</el-radio>
            <el-radio label="2">每天一次</el-radio>
            <el-radio label="3">每周一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="提醒时间" prop="time">
          <el-date-picker
              v-if="ruleForm.type == 1"
              v-model="ruleForm.time.formatTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-select v-if="ruleForm.type == 2" v-model="ruleForm.time.weekday" placeholder="请选择星期">
            <el-option label="周一" value="1"></el-option>
            <el-option label="周二" value="2"></el-option>
            <el-option label="周三" value="3"></el-option>
            <el-option label="周四" value="4"></el-option>
            <el-option label="周五" value="5"></el-option>
            <el-option label="周六" value="6"></el-option>
            <el-option label="周日" value="7"></el-option>
          </el-select>
          <el-time-picker
              v-model="ruleForm.time.rowTime"
              :picker-options="{selectableRange: '18:30:00 - 20:30:00'}"
              placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="tableData" border stripe>

      <el-table-column prop="name" label="闹钟名称"></el-table-column>
      <el-table-column prop="time.dTime" label="闹钟时间"></el-table-column>
      <el-table-column prop="type" label="闹钟类型"></el-table-column>

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
  name: "Clock",
  data() {
    return {
      tableData: [],
      sourceData: [],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        time: {},
        type: '',
      },
    }
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/Clock/findAll/').then(function (resp) {
      _this.totalNum = resp.data.length;
      _this.sourceData = resp.data;
      _this.handleCurrentChange(1);
    })
  },
  methods: {
    findAll() {
      const _this = this
      axios.get('http://localhost:9090/ActivityManagement/findAll/').then(function (resp) {
        console.log(resp.data)
        _this.totalNum = resp.data.length;
        _this.sourceData = resp.data;
        _this.handleCurrentChange(1);
      })
    },
    handleCurrentChange(pageNum) {
      this.tableData = this.sourceData.slice((pageNum - 1) * this.pageSize, pageNum * this.pageSize)
      this.loadTime()
    },
    searchByActivityName() {
      const _this = this
      axios.get('http://localhost:9090/ActivityManagement/searchByName/' + _this.ActivityName)
          .then(function (resp) {
            _this.totalNum = resp.data.length;
            _this.sourceData = resp.data;
            _this.handleCurrentChange(1);
          })
    },
    searchByActivityTag() {
      const _this = this
      axios.get('http://localhost:9090/ActivityManagement/searchByTag/' + _this.ActivityTag)
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
          axios.post('http://localhost:9090/ActivityManagement/addActivity', _this.ruleForm)
              .then(function (resp) {
                if (resp.data == "success") {
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
    judge() {
      const s = this.sourceData[this.sourceData.length - 1]
      const t1 = s.time.dTime.split(",")
      const t2 = t1[1].split("~")
      // console.log(s)
      for (let i = 0; i < this.sourceData.length - 1; i++) {

        const t = this.sourceData[i].time.dTime.split(",")
        const tt = t[1].split("~")
        // console.log(t2[0] < tt[0])
        if (t[0] != t1[0] || t2[1] < tt[0] || t2[0] > tt[1])
          continue
        else {
          // console.log("t2[0] = " + t2[0])
          // console.log("tt[0] = " + tt[0])
          // console.log("t2[1] = " + t2[1])
          // console.log("tt[1] = " + tt[1])
          alert("存在冲突")
          return false
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    loadTime() {

      for (let i = 0; i < this.tableData.length; i++) {
        let t = this.tableData[i].time;
        this.tableData[i].time.dTime = t.formatTime + ',' + t.startTime + '~' + t.endTime;
      }
    },
    filterType(value, row) {
      return row.type === value;
    },
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

.demo-table-expand {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>