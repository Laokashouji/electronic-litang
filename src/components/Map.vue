<template>
  <el-main>
    <div style="margin: 10px 0">
      <el-radio-group v-model="schoolSource" style="margin-right: 20px">
        <el-radio-button label="1">沙河</el-radio-button>
        <el-radio-button label="2">海淀</el-radio-button>
      </el-radio-group>
      <el-input style="width: 200px" placeholder="请输入起始地点" v-model="source" suffix-icon="el-icon-search"></el-input>
    </div>
    <div style="margin: 10px 0">
    <el-radio-group v-model="schoolTarget" style="margin-right: 20px">
      <el-radio-button label="1">沙河</el-radio-button>
      <el-radio-button label="2">海淀</el-radio-button>
    </el-radio-group>
    <el-input style="width: 200px" placeholder="请输入目的地点" v-model="target"
              suffix-icon="el-icon-message"></el-input>
    </div>
    <el-button class="ml-5" type="primary" @click="search1">导航方式1</el-button>
    <el-button class="ml-5" type="primary" @click="search2">导航方式2</el-button>
    <el-button class="ml-5" type="primary" @click="search3">导航方式3</el-button>


    <h1>最短路长度:{{length}}</h1>
    <h1>最短路径:{{path}}</h1>
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
      path:"",
      length:'',
    }
  },
  methods:{
    search1(){
      const _this = this
      if(_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByLength/'+_this.source+'/'+_this.target+"/"+_this.schoolTarget).then(function (resp) {
          console.log(resp.data)

        })
      }
    },
  }
}
</script>

<style scoped>

</style>