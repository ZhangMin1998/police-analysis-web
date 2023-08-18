<template>
<div class='warn_region_wrap'>
  <MapPolygon
    v-for='item in regionLists'
    :key='item.id'
    :pointList="item.pointlist"
    :fillColor="item.fillColor"
    :lineColor="item.lineColor"
    :lineWidth="item.lineWidth"
    :lineDash="item.lineDash"
    :elementName="item.elementName"
    :className="item.className"
    :customAttribute="{ id: item.id + '', controlInfo: item.regionInfo, unitType: 'region' }"
  ></MapPolygon>
</div>
</template>

<script>
import MapPolygon from '@/components/Map/OfflineMap/MapPolygon'
import { getAllControlRegion } from '@/api/warnControl.js'
import Mixins from '../../mixins.js'

export default {
  name: 'WarnRegion',
  mixins: [Mixins],
  components: {
    MapPolygon
  },
  data () {
    return {
      regionId: 1,
      regionLists: []
    }
  },
  computed: {
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_.includes('map-polygon')) : []
    }
  },
  mounted () {
    this.areaLayers.forEach(element => {
      this.$store.state.Ol.oMap.removeLayer(element)
    })
    this.getRegions()
  },
  methods: {
    getRegions () {
      getAllControlRegion().then(res => {
        let result = res || []
        result.forEach(control => {
          if (control.regionSelectFlag === 'specific' && control.regionRange) {
            control.controlTime = this.formatControlTime(control)
            control.controlRegion = this.formatControlRegion(control)
            control.controlRecord = this.formatControlData(control)
            let regionList = JSON.parse(control.regionRange)
            regionList.forEach(item => {
              let region = item.replace(/[(]|[)]/g, '').split(',')
              let pointList = []
              region.forEach((point, index) => {
                if (index % 2 === 0) {
                  pointList.push([point, region[index + 1]])
                }
              })
              this.regionLists.push({
                pointlist: pointList || [],
                fillColor: 'rgba(240, 63, 88, 0.16)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
                elementName: 'region-warn', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
                lineColor: 'rgba(240, 63, 88, 1)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
                lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
                lineDash: control.regionAccessType === 'inner' ? null : [5], // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
                className: 'map-polygon' + this.regionId, // 图层的class String, 非必须，默认为 'map-polygon'
                id: this.regionId + '',
                regionInfo: control
              })
              this.regionId++
            })
          }
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
</style>
