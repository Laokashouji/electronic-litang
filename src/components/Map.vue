<template>
  <el-main>
    <div style="margin: 10px 0">
      <el-radio-group v-model="schoolSource" style="margin-right: 20px">
        <el-radio-button label="1">海淀</el-radio-button>
        <el-radio-button label="2">沙河</el-radio-button>
      </el-radio-group>
      <!--      <el-input style="width: 200px" placeholder="请输入起始地点" v-model="source" suffix-icon="el-icon-search"></el-input>-->
      <el-select v-model="source" placeholder="请选择起始地点" v-if="typeSource == 1">
        <el-option
            v-for="(item,index) in options"
            v-if="/^[A-Za-z]+$/.test(item.name) == false && item.school == schoolSource"
            :key="index"
            :label="item.name"
            :value="item.name">
        </el-option>
      </el-select>
    </div>

    <div style="margin: 10px 0">
      <el-radio-group v-model="schoolTarget" style="margin-right: 20px" v-if="typeTarget == 1">
        <el-radio-button label="1">海淀</el-radio-button>
        <el-radio-button label="2">沙河</el-radio-button>
      </el-radio-group>
      <!--      <el-input style="width: 200px" placeholder="请输入目的地点" v-model="target" suffix-icon="el-icon-message"></el-input>-->
      <el-select v-model="target" placeholder="请选择目的地点" v-if="typeTarget == 1">
        <el-option
            v-for="(item,index) in options"
            v-if="/^[A-Za-z]+$/.test(item.name) == false && item.school == schoolTarget"
            :key="index + '-2'"
            :label="item.name"
            :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="target" placeholder="请选择课程" v-if="typeTarget == 2">
        <el-option
            v-for="(item,index) in sourceData"
            :key="index + '-ts'"
            :label="item.name"
            :value="item.name">
        </el-option>
      </el-select>
      <el-radio-group v-model="typeTarget" style="margin-right: 20px;margin-left: 20px">
        <el-radio-button label="1">地名</el-radio-button>
        <el-radio-button label="2">课程名</el-radio-button>
      </el-radio-group>
    </div>
    <el-button class="ml-5" type="primary" @click="search1">导航方式1</el-button>
    <el-button class="ml-5" type="primary" @click="search2">导航方式2</el-button>
    <el-button class="ml-5" type="primary" @click="search3">导航方式3</el-button>

    <div>
      <el-image v-for="url in urls" :key="url" :src="url" lazy style="height: 500px"></el-image>
    </div>

    <h1 class="text-wrapper">最短路长度/时间(单位m / s):{{ length1 + length2 }}</h1>
    <h1 class="text-wrapper">最短路径:{{ path1 }}{{ path2 }}</h1>
  </el-main>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      source: '',
      target: '',
      schoolSource: '1',
      schoolTarget: '1',
      typeSource: '1',
      typeTarget: '1',
      path1: "",
      length1: '',
      path2: "",
      length2: '',
      urls: [
        require('@/assets/1.jpg'),
        require('@/assets/2.jpg')
      ],
      sourceData: [],
      options: [],
    }
  },
  mounted() {
    const _this = this
    axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp) {
      _this.sourceData = resp.data;
    })
    axios.get('http://localhost:9090/Map/getPlace/').then(function (resp) {
      _this.options = resp.data;
    })
  },
  methods: {
    search1() {
      const _this = this
      if (_this.typeTarget == 2) {
        this.getTarget()
      }
      if (_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByLength/' + _this.source + '/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
      } else {
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
    search2() {
      const _this = this
      if (_this.typeTarget == 2) {
        this.getTarget()
      }
      if (_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByTime/' + _this.source + '/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
      } else {
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
    search3() {
      const _this = this
      if (_this.typeTarget == 2) {
        this.getTarget()
      }
      if (_this.schoolSource == _this.schoolTarget) {
        axios.get('http://localhost:9090/Map/findByVehicle/' + _this.source + '/' + _this.target + "/" + _this.schoolTarget).then(function (resp) {
          console.log(resp.data)
          _this.length1 = resp.data[0]
          _this.path1 = resp.data[1]
        })
      } else {
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
    getTarget() {
      for (let i = 0; i < this.sourceData.length; i++) {
        if (this.target == this.sourceData[i].name) {
          this.target = this.sourceData[i].place
          break
        }
      }
      for (let i = 0; i < this.options.length; i++) {
        if(this.target == this.options[i].name)
          this.typeTarget = this.options[i].school
        break
      }
    }
  }
}
</script>

<style scoped>
.text-wrapper {
  white-space: pre-wrap;
}
</style>