<template>
  <div
    class="wrap"
    v-p-loading="loading"
    :element-loading-background="'--bg-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <!--    数据总量-->
    <TotalData
      class="data"
      v-show="!loading"
      :showType="'chart'"
      :dataType="'all'"
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show="!loading"
      :dataType="'all'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <!--    数据细分-->
    <DataStackedLineChart
      v-if='haveResult'
      v-show='!loading'
      @changeStackLineLoad="changeStackLineLoad"
    ></DataStackedLineChart>

    <!--    数据列表-->
    <DataBoard v-if="!loading && haveResult"></DataBoard>
  </div>
</template>

<script>
import BaseLoadMixins from '../baseLoadMixins'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import DataStackedLineChart from '@/views/common/data-center/components/data-stacked-line-chart'
import DataBoard from '@/views/common/data-center/components/data-board'
export default {
  name: 'DataCenterAll',
  components: {
    TotalData,
    TotalDataChartLine,
    DataStackedLineChart,
    DataBoard
  },
  props: {
    haveResult: {
      type: Boolean,
      default: false
    }
  },
  mixins: [BaseLoadMixins],
  mounted () {
    this.changeStackLineLoad(true)
  }
}
</script>

<style lang='less' scoped>
</style>
