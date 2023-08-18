<template>
<div class='atlas_detail_wrap'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='cancelOpera'></OperaHeader>
  <div
    class='wrap_content'
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$themeColor('--bg-color-3')"
  >
    <div v-if='dataEntity.length' id='atlasChart' class='atlas_chart'></div>
    <div v-else class='empty'>暂无数据</div>
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import { getAtlasDataApi, getAtlasIconApi } from '@/api/sysSetting'
import * as echarts from 'echarts'
import { chartOption } from './chartConfig'

export default {
  name: 'AtlasDetail',
  components: {
    OperaHeader
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      breadcrumbList: [
        { tabName: '数据图谱', canOpera: true }
      ],
      iconOptions:[],
      iconObj: {},
      successIcon: false,
      chartsCategories: [],
      chartsData: [],
      entityToIcon: {},
      chartsLinks: [],
      myChart: null,
      loading: true,
      stopLoad: false,
      dataEntity: []
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
      // return 'http://192.168.1.182:21256'
    },
  },
  created () {
    this.breadcrumbList = [
      ...this.breadcrumbList,
      ...[
        { tabName: this.row.srcNameCn || '' },
        { tabName: '详情' }
      ]
    ]
  },
  mounted () {
    this.getAtlasIcon()
    if (this.row.id) {
      const unWatch = this.$watch('successIcon', () => {
        this.getAtlasData(this.row.id)
        unWatch()
      })
      const unWatchLoad = this.$watch('stopLoad', () => {
        this.loading = false
        unWatchLoad()
      })
    }
    this.bus.$on('theme', this.changeTheme)
  },
  methods: {
    changeTheme () {
      if (this.myChart) {
        let {
          tooltip,
          legend,
          series
        } = this.myChart.getOption()
        legend[0].textStyle.color = this.$themeColor('--base-text-color-to-666666')
        tooltip[0].backgroundColor = this.$themeColor('--tooltip-bg-262D44-to-f6f8fd')
        tooltip[0].textStyle.color = this.$themeColor('--base-text-color-to-666666')
        series[0].lineStyle.color = this.$themeColor('--base-text-color-to-999999')
        series[0].label.color = this.$themeColor('--base-text-color-1')
        series[0].edgeLabel.color = this.$themeColor('--base-text-color-to-666666')
        const option = { ...this.myChart.getOption(), tooltip, legend, series }
        this.myChart.setOption(option)
      }
    },
    cancelOpera () {
      this.$emit("toList", "list", {})
    },
    // 获取已有实体的数据
    getAtlasData (id) {
      this.chartsData = []
      this.chartsCategories = []
      this.chartsLinks = []
      getAtlasDataApi({
        srcId: id
      }).then(res => {
        this.dataEntity = res || []
        this.dataEntity.forEach(item => {
          let categoryInd = this.chartsCategories.findIndex(category => category.id === item.entityId)
          if (categoryInd === -1) {
            this.chartsCategories.push({
              name: item.entityName,
              id: item.entityId
            })
          }
        })
        this.dataEntity.forEach(item => {
          if (!this.entityToIcon[item.entityId]) {
            this.entityToIcon[item.entityId] = item.iconId
          }
          let symbol = this.iconObj[this.entityToIcon[item.entityId + '']] ? this.origin + this.iconObj[this.entityToIcon[item.entityId + '']] : require(`@/assets/img/atlis-default.png`)
          this.chartsData.push({
            id: item.id + '',
            name: item.id,
            category: this.chartsCategories.findIndex(category => category.name === item.entityName),
            symbolSize: 38,
            symbol: 'image://' + symbol,
            entityId: item.entityId,
            entityName: item.entityName,
            labelList: item.graphEntityLabelMappings || [],
            relationList: item.graphRelationshipMappings || []
          })
          if (item.graphRelationshipMappings) {
            item.graphRelationshipMappings.forEach(relation => {
              this.chartsLinks.push({
                source: relation.startEntityMappingId + '',
                target: relation.endEntityMappingId + '',
                ...relation
              })
            })
          }
        })
        this.$nextTick(() => {
          if (this.dataEntity.length) {
            this.initCharts()
          }
        })
      }).finally(() => {
        this.stopLoad = true
      })
    },
    initCharts () {
      // const _this = this
      this.myChart = echarts.init(document.getElementById('atlasChart'))
      let option = chartOption
      option.series[0].categories = this.chartsCategories
      option.series[0].links = this.chartsLinks
      option.series[0].data = this.chartsData
      option.legend[0].data = this.chartsCategories.map(item => {
        let icon = this.iconObj[this.entityToIcon[item.id]] ? this.origin + this.iconObj[this.entityToIcon[item.id]] : require(`@/assets/img/atlis-default.png`)
        return {
          name: item.name,
          icon: 'image://' + icon
        }
      })
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    // 获取图标
    getAtlasIcon () {
      getAtlasIconApi().then(res => {
        this.iconOptions = res || []
        this.iconOptions.forEach(item => {
          // item['iconPath'] = item['iconPath'].replace('/var/filecenter', '')
          this.iconObj[item.id + ''] = item.iconPath
        })
      }).finally(() => {
        this.successIcon = true
      })
    },
  },
  beforeDestroy () {
    this.bus.$off('theme', this.changeTheme)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.atlas_detail_wrap {
  height: 100%;
  .wrap_content {
    height: calc(100% - 52px);
    padding: 20px 24px 32px;
    background: var(--bg-color-3);
    margin-top: 1px;
    .atlas_chart {
      width: 100%;
      height: 100%;
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
