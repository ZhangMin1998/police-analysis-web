<template>
  <div class="resultSummary">
    <div class="topChart">
      <div class="title_box">
        <el-divider direction="vertical"></el-divider>
        <span>数据分布TOP7</span>
      </div>
      <BarChart :chartData="chartData1"></BarChart>
    </div>
    <div class="topChart">
      <div class="title_box">
        <el-divider direction="vertical"></el-divider>
        <span>活动地点TOP7</span>
      </div>
      <BarChart :chartData="chartData2"></BarChart>
    </div>
    <div class="topChart">
      <div class="title_box">
        <el-divider direction="vertical"></el-divider>
        <span>近7日活跃趋势</span>
      </div>
      <LineChart :chartData="chartData3"></LineChart>
    </div>
  </div>
</template>

<script>
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
export default {
  components: {
    BarChart,
    LineChart
  },
  props:{
    // rightDialog: {
    //   type: Object,
    //   default: () => {}
    // },
    // aaa: {
    //   type: Number
    // },
  },
  data () {
    return {
      chartData1: {
        color: '#0075FF',
        data: [2, 6, 18, 35, 42, 50, 59],
        yData: [
          '不动产',
          '防疫登记',
          '复工复产',
          '运营商业务',
          '手机卡业务',
          '银行业务',
          '核酸记录'
        ]
      },
      chartData2: {
        color: '#35A7E8',
        data: [5, 8, 22, 39, 44, 63, 88],
        yData: [
          '夏庄镇',
          '大瞳镇',
          '高村镇',
          '桥头镇',
          '草庙子镇',
          '泊于镇',
          '松坪村'
        ]
      },
      chartData3: {
        xData: ['03/01', '03/02', '03/03', '03/04', '03/05', '03/06', '03/07'],
        yData: [6, 8, 6, 7, 2, 6, 10]
      }
    }
  },
  created () {

  },
  methods: {
    getChartData () {
      // getBrokenDataApi({
      //   dataType: item ? item : defaultDataType,
      //   unit: this.activeSort,
      //   startTime: startTime,
      //   endTime: endTime,
      //   userName: this.userName
      // }).then(res => {
    }
  }
}
</script>

<style lang="less" scoped>
.resultSummary{
  // overflow-y: scroll;
  // height: calc(100vh - 200px);
  .topChart{
    .title_box{
      padding: 12px 10px 12px 0;
      /deep/.el-divider--vertical {
        display: inline-block;
        width: 4px;
        height: 1em;
        margin: 0 0.04167rem 0 0;
        vertical-align: text-bottom;
        position: relative;
      }
      span {
        font-weight: 400;
        color: var(--base-text-color-1);
        font-size: 16px;
      }
    }
  }
}
</style>
