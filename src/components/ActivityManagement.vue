<template>
  <el-main>
    <div style="margin-bottom: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/ActivityManagement' }">活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="findAll" style="margin-right: 20px">显示全部</el-button>
      <el-input style="width: 200px" placeholder="请输入活动名称" v-model="ActivityName"
                suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByActivityName">搜索</el-button>
      <el-input style="width: 200px" placeholder="请输入活动标签" v-model="ActivityTag"
                suffix-icon="el-icon-message"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByActivityTag">搜索</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="dialogFormVisible = true">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
        <el-button type="primary" @click="judge">判断冲突 <i class="el-icon-circle-plus-outline"></i></el-button>
    </div>

    <el-dialog title="新增活动" :visible.sync="dialogFormVisible">

      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item label="活动名称" prop="name" required>
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="活动地点" prop="place">
          <el-select v-model="ruleForm.place" placeholder="请选择活动地点">
            <el-option label="教学楼" value="教学楼"></el-option>
            <el-option label="宿舍" value="宿舍"></el-option>
            <el-option label="二维码广场" value="二维码广场"></el-option>
            <el-option label="图书馆" value="图书馆"></el-option>
            <el-option label="操场" value="操场"></el-option>
            <el-option label="食堂" value="食堂"></el-option>
            <el-option label="校外" value="校外"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动类型">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="个人活动"></el-radio>
            <el-radio label="集体活动"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活动标签" prop="tag">
          <el-select v-model="ruleForm.tag" placeholder="请选择活动标签">
            <el-option v-if="ruleForm.type == '个人活动'" label="自习" value="自习"></el-option>
            <el-option v-if="ruleForm.type == '个人活动'" label="锻炼" value="锻炼"></el-option>
            <el-option v-if="ruleForm.type == '个人活动'" label="外出" value="外出"></el-option>
            <el-option v-if="ruleForm.type == '个人活动'" label="其他" value="其他"></el-option>
            <el-option v-if="ruleForm.type == '集体活动'" label="班会" value="班会"></el-option>
            <el-option v-if="ruleForm.type == '集体活动'" label="小组作业" value="小组作业"></el-option>
            <el-option v-if="ruleForm.type == '集体活动'" label="创新创业" value="创新创业"></el-option>
            <el-option v-if="ruleForm.type == '集体活动'" label="聚餐" value="聚餐"></el-option>
            <el-option v-if="ruleForm.type == '集体活动'" label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动时间" prop="time">
          <el-date-picker
              v-model="ruleForm.time.formatTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-time-picker
              is-range
              v-model=ruleForm.time.rowTime
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="tableData" border stripe>

      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column prop="place" label="活动地点"></el-table-column>
      <el-table-column prop="time.dTime" label="活动时间"  sortable></el-table-column>
      <el-table-column prop="type" label="活动类型" :filters="[{ text: '个人活动', value: '个人活动' }, { text: '集体活动', value: '集体活动' }]"
                       :filter-method="filterType" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.type === '个人活动' ? 'primary' : 'success'"
              disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="活动标签"></el-table-column>

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
  name: "ActivityManagement",
  data() {
    return {
      tableData: [],
      sourceData: [],
      pageSize: 5,
      currentPage: 1,
      totalNum: 100,
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        place: '',
        time: {},
        tag: '',
        type: '',
      },
      ActivityName: "",
      ActivityTag: "",
    }
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/ActivityManagement/findAll/').then(function (resp) {
      _this.totalNum = resp.data.length;
      _this.sourceData = resp.data;
      _this.handleCurrentChange(1);
    })
  },
  methods: {
    findAll() {
      const _this = this
      axios.get('http://localhost:9090/ActivityManagement/findAll/').then(function (resp) {
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
    judge(){
      const s = this.sourceData[this.sourceData.length - 1]
      const t1 = s.time.dTime.split(",")
      const t2 = t1[1].split("~")
      // console.log(s)
      for (let i = 0; i < this.sourceData.length - 1; i++) {

        const t = this.sourceData[i].time.dTime.split(",")
        const tt = t[1].split("~")
        // console.log(t2[0] < tt[0])
        if(t[0] != t1[0] || t2[1] < tt[0] || t2[0] > tt[1])
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