<template>
  <el-main>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Clock' }">活动提醒</el-breadcrumb-item>
      </el-breadcrumb>
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
            <el-radio label="2">每周一次</el-radio>
            <el-radio label="3">每天一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="提醒时间" prop="time">
          <el-date-picker
              v-if="ruleForm.type == 1"
              v-model="ruleForm.time.formatTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss">
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
              v-if="ruleForm.type != 1"
              v-model="ruleForm.time.rowTime"
              value-format="HH:mm:ss"
              placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div style="flex: 1">
      {{ time.getFullYear() }}-{{ time.getMonth() + 1}}-{{ time.getDate() }}
      {{ time.getHours() }}:{{ time.getMinutes() }}:{{ time.getSeconds() }}
      <el-button @click="speedUp">快进</el-button>
    </div>

    <el-table :data="tableData" border stripe>

      <el-table-column prop="name" label="闹钟名称"></el-table-column>
      <el-table-column prop="time.formatTime" label="闹钟时间"></el-table-column>
      <el-table-column prop="type" label="闹钟类型(1,2,3分别表示单次、每周、每天）"></el-table-column>

    </el-table>

  </el-main>
</template>

<script>

import bus from "@/utils/bus";

export default {
  name: "Clock",
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        time: {},
        type: '',
      },
      time: new Date(2022, 6, 1, 0),
    }
  },
  created() {
    bus.$on('send', (data) => {
      this.react(data)
    })
  },
  mounted() {
    this.timer = setInterval(() => {
      this.times = this.countTime(this.times);
    }, 1000)
  },
  beforeDestroy() {
    bus.$off('send');
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    react(data) {
      for (let i = 0; i < this.tableData.length; i++) {

        if (this.tableData[i].type == 1) {
          let str1 = this.tableData[i].time.formatTime
          str1 = str1.replace(/-/g, "/");
          var d = new Date(str1);
          console.log(Math.abs(d.getTime() - data.getTime()))
          if (Math.abs(d.getTime() - data.getTime()) < 3600 * 1000) {
            alert("闹钟" + this.tableData[i].name + "响了")
            this.tableData[i].type = 0
          }
        } else if (this.tableData[i].type == 2) {
          if (data.getDay() == this.tableData[i].time.weekday % 8 && data.getHours() == this.tableData[i].time.rowTime.slice(0, 2)) {
            alert("闹钟" + this.tableData[i].name + "响了")
          }
        } else if (this.tableData[i].type == 3) {
          if (data.getHours() - 1== this.tableData[i].time.rowTime.slice(0, 2)) {
            alert("闹钟" + this.tableData[i].name + "响了")
          }
        }
      }
    },
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.ruleForm.type == 2) {
            _this.ruleForm.time.formatTime = _this.ruleForm.time.weekday + " " + _this.ruleForm.time.rowTime
          } else if (_this.ruleForm.type == 3) _this.ruleForm.time.formatTime = _this.ruleForm.time.rowTime
          _this.tableData.push({
            name: _this.ruleForm.name,
            time: {
              formatTime: _this.ruleForm.time.formatTime,
              weekday: _this.ruleForm.time.weekday,
              rowTime: _this.ruleForm.time.rowTime
            },
            type: _this.ruleForm.type
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    countTime(times) {
      if (times != 10) {
        times++
        return times
      }
      times = 0
      this.speedUp()
      return times
    },
    speedUp() {
      let t = this.time.getTime()
      t += 1000 * 3600
      this.time = new Date(t)
      this.react(this.time)
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