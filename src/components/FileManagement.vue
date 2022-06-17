<template>
<el-main>
  <el-upload
      action="http://localhost:9090/file/upload"
      :show-file-list="false"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>

  <div style="margin: 10px 0">
    <el-button type="primary" @click="findAll" style="margin-right: 20px">显示全部</el-button>
    <el-input style="width: 200px" placeholder="请输入资料名称" v-model="CourseName" suffix-icon="el-icon-search"></el-input>
    <el-button class="ml-5" type="primary" @click="searchByName">搜索</el-button>
  </div>

  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="资料名称"></el-table-column>
    <el-table-column prop="size" label="资料大小"></el-table-column>
    <el-table-column prop="type" label="资料类型"></el-table-column>
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
  name: "FileManagement",
  data() {
    return {
      tableData: [],
      sourceData: [],
      pageSize: 5,
      currentPage: 1,
      totalNum: 100,
      CourseName: "",
      TeacherName: "",
    };
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/file/findAll').then(function (resp) {
      _this.totalNum = resp.data.length;
      _this.sourceData = resp.data;
      _this.handleCurrentChange(1);
    })
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(file, fileList){
      this.findAll()
    },
    findAll() {
      const _this = this
      axios.get('http://localhost:9090/file/findAll/').then(function (resp) {
        _this.totalNum = resp.data.length;
        _this.sourceData = resp.data;
        _this.handleCurrentChange(1);
      })
    },
    handleCurrentChange(pageNum) {
      this.tableData = this.sourceData.slice((pageNum - 1) * this.pageSize, pageNum * this.pageSize)
    },
    searchByName() {
      const _this = this
      axios.get('http://localhost:9090/CourseManagement/searchByCourseName/' + _this.CourseName)
          .then(function (resp) {
            _this.totalNum = resp.data.length;
            _this.sourceData = resp.data;
            _this.handleCurrentChange(1);
          })
    },

  }
}
</script>

<style scoped>

</style>