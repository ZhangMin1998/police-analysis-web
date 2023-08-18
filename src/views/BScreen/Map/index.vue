<template>
  <div class="content">
    <div id="china-map" style="width: 100%; height: 72vh" />
  </div>
</template>


<script>
import { Xcharts } from '@/utils/xcharts'
import _ from 'lodash'
import { MAP_CITY } from '@/utils/xcharts/data/map/provinceMapData'
import { queryEquipment } from '@/api/bScreen'

const mapList = {
  ZhaoQing: {
    list: ['德庆县', '鼎湖区', '端州区', '封开县', '高要区', '广宁县', '怀集县', '四会市']
  },
  AnXiang: { list: ['安乡县'] },
  WeiHai: { list: ['环翠区', '荣成市', '乳山市', '文登区'] }
}

export default {
  data () {
    return {
      // xcharts instance
      chinaMap: null,
      // xcharts register map name
      mapName: '肇庆市',
      // 地图资源 json
      sourceJson: null,
      mapNamePY: 'ZhaoQing'
    }
  },
  created () {
    // TODO: 强制为肇庆记得删除
    // if (this.$store.state.User.searchCity === '肇庆') {
    this.mapNamePY = 'ZhaoQing'
    this.mapName = '肇庆市'
    // } else if (this.$store.state.User.searchCity === '威海') {
    //   this.mapNamePY = 'WeiHai'
    //   this.mapName = '威海市'
    // } else {
    //   this.mapNamePY = 'AnXiang'
    //   this.mapName = '安乡县'
    // }
  },
  mounted () {
    this.initChart()
    queryEquipment().then(res => {
      const rows = mapList['ZhaoQing'].list.map(element => {
        const item = res.find(ele => ele.district === element)
        return {
          name: element,
          value: item?.count || 0
        }
      })

      this.renderChart({
        zoom: 1,
        visualMap: [0, 3000],
        map: this.mapName,
        rows: rows
      })
    })
  },
  methods: {
    // 初始化地图实例
    initChart () {
      // 地图实例化
      this.chinaMap = new Xcharts('china-map', 'map', {})
      // 注入地图 json
      this.loadMapJson()
    },
    // 渲染地图
    renderChart (data) {
      // 传入数据渲染
      this.chinaMap.setData(data)
      this.handlerResize = _.debounce(() => {
        this.chinaMap.chart && this.chinaMap.chart.resize()
      })
      // 添加 resize 事件
      window.addEventListener('resize', this.handlerResize)
      // 移除事件
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.handlerResize)
        this.chinaMap.chart && this.chinaMap.chart.dispose()
      })
    },
    // 动态加载地图 json 资源
    loadMapJson () {
      // 通过 data传入的name 匹配获得 require 的文件 name
      const temp = MAP_CITY[this.mapName]
      this.sourceJson = require(`@/utils/xcharts/data/map/city/${temp}.json`)

      this.chinaMap.echarts.registerMap(this.mapName, this.sourceJson)
    }
  }
}
</script>

<style scoped>
</style>
