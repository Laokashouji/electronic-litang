<template>
  <el-main>
    <el-upload
        action="http://localhost:9090/file/upload"
        :show-file-list="false"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        :before-upload="check">
      <el-button slot="trigger" size="small" type="primary" style="margin-right: 20px">点击上传</el-button>
      <el-radio v-model="type" label="1">资料</el-radio>
      <el-radio v-model="type" label="2">作业</el-radio>
    </el-upload>


    <div style="margin: 10px 0">
      <el-button type="primary" @click="findAll" style="margin-right: 20px">显示全部</el-button>
      <el-input style="width: 200px" placeholder="请输入资料名称" v-model="FileName" suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" type="primary" @click="searchByName">搜索</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="name" label="资料名称"></el-table-column>
      <el-table-column prop="size" label="资料大小"></el-table-column>
      <el-table-column prop="type" label="资料类型"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="download(scope.row)">下载 <i class="el-icon-download"></i></el-button>
          <!--          <el-button type="danger">删除 <i class="el-icon-rem ove-outline"></i></el-button>-->
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
  name: "FileManagement",
  data() {
    return {
      tableData: [],
      sourceData: [],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      FileName: "",
      type: 0,
    };
  },
  created() {
    const _this = this
    axios.get('http://localhost:9090/file/findAll').then(function (resp) {
      _this.totalNum = resp.data.length;
      _this.sourceData = resp.data;
      _this.handleCurrentChange(1);
    })
    axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp) {
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
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(file, fileList) {
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
      axios.get('http://localhost:9090/file/searchByName/' + _this.FileName)
          .then(function (resp) {
            _this.totalNum = resp.data.length;
            _this.sourceData = resp.data;
            _this.handleCurrentChange(1);
          })
    },
    download(row) {
      const uName = row.url.substring(row.url.lastIndexOf("/") + 1)
      axios({
        url: 'http://localhost:9090/file/download/' + uName,
        method: 'get',
        responseType: 'arraybuffer',
      }).then(
          (res) => {
            console.log(res)
            var b = new Blob([res.data], {type: 'application/vnd.ms-excel'});
            var url = URL.createObjectURL(b);
            var link = document.createElement('a');
            link.download = row.name + "." + row.type;
            link.href = url;
            link.click();
          },
          (err) => {
            console.log(err);
          }
      )
    },
    check(file) {
      if (this.$route.query.id) {
        const name = file.name.slice(0, file.name.lastIndexOf("."))
        console.log(name)
          axios.get('http://localhost:9090/CourseManagement/editFile/'
              + name + '/' + this.$route.query.id +'/' + this.type)
              .then(function (resp) {
                if(resp.data == "error") {
                  alert("上传失败")
                  return false
                }
              })
      }
    },

  }
}
</script>

<style scoped>

</style>