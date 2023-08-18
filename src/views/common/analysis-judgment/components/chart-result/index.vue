<template>
<div class='chart_result_wrap'>
<!--  折线图-->
  <LineChart
    v-if='chartInfo.chartType === "LineConfigChart"'
    :chartStyle='chartConfig'
    :chartId='`LineChart${moduleId}`'
  ></LineChart>
<!--  柱状图-->
  <BarChart
    v-else-if='chartInfo.chartType === "BarConfigChart"'
    :chartStyle='chartConfig'
    :chartId='`BarChart${moduleId}`'
  ></BarChart>
<!--  饼图-->
  <PieChart
    v-else-if='chartInfo.chartType === "PieConfigChart"'
    :chartStyle='chartConfig'
    :chartId='`PieChart${moduleId}`'
  ></PieChart>
<!--  分布图-->
  <MapChart
    v-else-if='chartInfo.chartType === "MapConfigChart"'
    :chartStyle='chartConfig'
    :chartId='`MapChart${moduleId}`'
    @mapClick='mapClick'
  ></MapChart>
<!--  轨迹图-->
  <TrackChart
    v-else-if='chartInfo.chartType === "TrackConfigChart"'
    :optionForm="chartConfig.form"
    :tracksList="chartConfig.tracksList"
  ></TrackChart>
<!--  漏斗图-->
  <FunnelChart
    v-else-if='chartInfo.chartType === "FunnelConfigChart"'
    :chartStyle="chartConfig"
    :chartId='`FunnelChart${moduleId}`'
  ></FunnelChart>
<!--  仪表盘-->
  <GuageChart
    v-else-if='chartInfo.chartType === "GaugeConfigChart"'
    :chartStyle="chartConfig"
    :chartId='`GuageChart${moduleId}`'
  ></GuageChart>
  <WordcloudChart
    v-else-if='chartInfo.chartType === "WordcloudConfigChart"'
    :chartStyle="chartConfig"
    :chartId='`WordcloudChart${moduleId}`'
  ></WordcloudChart>
  <!-- :moduleId="`TrackChart${moduleId}`" -->
</div>
</template>

<script>
import LineChart from '@/components/BasicComponents/Echarts/lineChart.vue'
import BarChart from '@/components/BasicComponents/Echarts/barChart.vue'
import PieChart from '@/components/BasicComponents/Echarts/pieChart.vue'
import MapChart from '@/components/BasicComponents/Echarts/mapChart.vue'
import TrackChart from '@/components/BasicComponents/Echarts/trackChart.vue'
import FunnelChart from '@/components/BasicComponents/Echarts/funnelChart.vue'
import GuageChart from '@/components/BasicComponents/Echarts/guageChart.vue'
import WordcloudChart from '@/components/BasicComponents/Echarts/wordcloudChart.vue'
import { getChartConfig } from '../../config/config.js'

export default {
  name: 'ChartResult',
  components: {
    LineChart,
    BarChart,
    PieChart,
    MapChart,
    TrackChart,
    FunnelChart,
    GuageChart,
    WordcloudChart
  },
  props: {
    // 图表的配置信息
    chartInfo: {
      type: Object,
      default: () => {
        return {
          chartType: '',
          chartConfig: {}
        }
      }
    },
    // 数据
    listData: {
      type: Array,
      default: () => []
    },
    fieldList: {
      type: Array,
      default: () => []
    },
    // 模块Id
    moduleId: {
      type: Number
    }
  },
  data () {
    return {
      chartConfig: null
    }
  },
  watch: {
    chartInfo: {
      handler (newVal) {
        this.chartConfig = getChartConfig(
          newVal.chartType,
          true,
          '--bg-color-3',
          newVal.chartConfig,
          this.listData,
          this.fieldList
        )
      },
      immediate: true
    }
  },
  methods: {
    mapClick (info) {
      this.$emit('mapClick', info)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.chart_result_wrap {
  width: 100%;
  height: 100%;
}
</style>
