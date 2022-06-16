<template>
  <el-main style="width: 100%; height: 100%; margin-left: 50px">
    <el-button type="success" @click="load()">刷新</el-button>
    <el-table
        :data="classList"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#5D87EB', color: '#fff' }"
    >
      <el-table-column
          prop="Course"
          label="课时/节次"
          width="200"
      ></el-table-column>
      <el-table-column prop="one" label="周一" width="200"></el-table-column>
      <el-table-column prop="two" label="周二" width="200"></el-table-column>
      <el-table-column prop="three" label="周三" width="200"></el-table-column>
      <el-table-column prop="four" label="周四" width="200"></el-table-column>
      <el-table-column prop="five" label="周五" width="200"></el-table-column>
    </el-table>
  </el-main>
</template>

<script>

export default {
  name: "CourseTable",
  data() {
    return {
      classList: [
        {
          Course: "8:00~8:45",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "8:50~9:35",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "9:50~10:35",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "10:40~11:25",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "11:30~12:15",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "13:00~13:45",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "13:50~14:35",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "14:45~15:50",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "15:40~16:25",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "16:35~17:20",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
        {
          Course: "17:25~18:10",
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
        },
      ],
      sourceData:[],
    }
  },
  methods:{
    fill(weekday, times, name){
      const _this = this
      const st = times.startTime
      const ed = times.endTime
      let flag = 0
      for (const item in _this.classList) {
        if (flag == 2)
          break;
        const cTime = item.Course.split("~")
        if (flag == 0)
          if (cTime[0] == st) {
            flag = 1;
            Object.defineProperty(item, weekday, name)
            continue
          } else if (flag == 1) {
            Object.defineProperty(item, weekday, name)
            if (cTime[1] == ed) {
              flag = 2
              continue
            }
          }
      }
    },
    load(){
      const _this = this
      console.log(this)
      axios.get('http://localhost:9090/CourseManagement/findAll/').then(function (resp) {
        _this.sourceData = resp.data;
        for (const course in resp.data) {
          for (const times in course.time) {
            console.log(times)
            switch (times.weekday) {
              case "Mon":_this.flash("one", times, course.name)
                break;
              case "Tue":_this.flash("two", times, course.name)
                break;
              case "Wed":_this.flash("three", times, course.name)
                break;
              case "Thu":_this.flash("four", times, course.name)
                break;
              case "Fri":_this.flash("five", times, course.name)
                break;
            }
          }
        }
      })
    },
  },
}
</script>

<style>
</style>