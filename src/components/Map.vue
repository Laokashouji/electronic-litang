<template>
  <el-main>
    <div style="margin: 10px 0">
      <el-radio-group v-model="schoolSource" style="margin-right: 20px">
        <el-radio-button label="1">海淀</el-radio-button>
        <el-radio-button label="2">沙河</el-radio-button>
      </el-radio-group>
      <el-input style="width: 200px" placeholder="请输入起始地点" v-model="source" suffix-icon="el-icon-search"></el-input>
    </div>
    <div style="margin: 10px 0">
    <el-radio-group v-model="schoolTarget" style="margin-right: 20px">
      <el-radio-button label="1">海淀</el-radio-button>
      <el-radio-button label="2">沙河</el-radio-button>
    </el-radio-group>
    <el-input style="width: 200px" placeholder="请输入目的地点" v-model="target"
              suffix-icon="el-icon-message"></el-input>
    </div>
    <el-button class="ml-5" type="primary" @click="search1">导航方式1</el-button>
    <el-button class="ml-5" type="primary" @click="search2">导航方式2</el-button>
    <el-button class="ml-5" type="primary" @click="search3">导航方式3</el-button>


    <h1 class="text-wrapper">最短路长度/时间:{{length1 + length2}}</h1>
    <h1 class="text-wrapper">最短路径:{{path1}}{{path2}}</h1>
  </el-main>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      source:'',
      target:'',
      schoolSource:'',
      schoolTarget:'',
      path1:"",
      length1:'',
      path2:"",
      length2:'',
    }
  },
  methods:{
    search1(){
      const _this = this
      if(_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByLength/'+_this.source+'/'+_this.target+"/"+_this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
      }
      else {
        axios.get('http://localhost:9090/Map/findByLength/' + _this.source + '/东门/' + _this.schoolSource).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
        axios.get('http://localhost:9090/Map/findByLength/东门/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length2 = " + 校区通行时间/路程 + " + resp.data[0]
          _this.path2 = " \n--> 校区路径 -->  " + resp.data[1]
        })
      }
    },
    search2(){
      const _this = this
      if(_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByTime/'+_this.source+'/'+_this.target+"/"+_this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length = resp.data[0]
          _this.path = resp.data[1]
        })
      }
      else {
          axios.get('http://localhost:9090/Map/findByTime/' + _this.source + '/东门/' + _this.schoolSource).then(function (resp) {
            console.log(resp.data)
            _this.length1 = resp.data[0]
            _this.path1 = resp.data[1]
          })
          axios.get('http://localhost:9090/Map/findByTime/东门/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
            console.log(resp.data)
            _this.length2 = " + 校区通行时间/路程 + " + resp.data[0]
            _this.path2 = " \n--> 校区路径 -->  " + resp.data[1]
          })
        }
      },
    search3(){
      const _this = this
      if(_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByVehicle/'+_this.source+'/'+_this.target+"/"+_this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length = resp.data[0]
          _this.path = resp.data[1]
        })
      }
      else {
        axios.get('http://localhost:9090/Map/findByVehicle/' + _this.source + '/东门/' + _this.schoolSource).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
        axios.get('http://localhost:9090/Map/findByVehicle/东门/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length2 = " + 校区通行时间/路程 + " + resp.data[0]
          _this.path2 = " \n--> 校区路径 -->  " + resp.data[1]
        })
      }
    },
  }
}
</script>

<style scoped>
.text-wrapper {
  white-space: pre-wrap;
}
</style>