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
    <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
    </div>
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
    }
  },
}
</script>

<style scoped>

</style>