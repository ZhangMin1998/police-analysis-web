<template>
  <div></div>
</template>

<script>
export default {
  inject: ['initClusterLoad', 'clearOverlay', 'drawPolyLine', 'closePolyLine'],
  props: {
    list: {
      type: Array,
      required: true,
    },
    mode: {
      type: Number,
      validator: t => [0, 1, 2].includes(t),
    },
    markerCls: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      markerList: [], // 实例化 marker 列表
    }
  },
  watch: {
    // 通过监听 来开启 框选模式
    mode: function (val) {
      val === 2 ? this.drawPolyLine() : this.closePolyLine()
    },
  },
  methods: {
    initMarker (data) {
      const { position, placeName } = data

      const cls = this.markerCls(data)
      // eslint-disable-next-line
      const overLayer = new AMap.Marker({
        position,
        content: `<div class="${cls}"></div>`,
        title: placeName,
        extData: {
          ...data,
        },
      })

      overLayer.on('click', e => {
        console.log('click', e.target.getExtData())
        if ([0, 2].includes(this.mode)) return
        // const
        const curMarker = e.target
        const markerData = curMarker.getExtData()
        markerData.isActive = !markerData.isActive
        this.reRenderMarker(curMarker)
        this.$emit('trigger', markerData)
      })

      return overLayer
    },
    renderMarkers () {
      const offsetList = this.list.filter(i => {
        if (i.position[0] && i.position[1]) {
          let numLongitude = parseFloat(i.position[0])
          let numLatitude = parseFloat(i.position[1])
          return !isNaN(numLongitude) || !isNaN(numLatitude)
        }
      })

      this.markerList = offsetList.map(item => {
        return this.initMarker(item)
      })

      this.initClusterLoad(this.markerList, 'site')
      Object.freeze(this.initMarkersList)
    },
    // 重新渲染单个标注
    reRenderMarker (marker) {
      const extData = marker.getExtData()
      const newCls = this.markerCls(extData)
      marker.setContent(`<div class="${newCls}"></div>`)
    },
    // 取消高亮的覆盖物
    closeHighlightMarker () {
      this.markerList.forEach(marker => {
        const exData = marker.getExtData()
        exData.isActive = false
        this.reRenderMarker(marker)
      })
    },
    // 判断点是否在矩形内
    judgeIsInner (point, path) {
      // eslint-disable-next-line
      return AMap.GeometryUtil.isPointInRing(point, path)
    },
    // 绘图
    drawComplete ({ data }) {
      const choosedMarkers = this.markerList.filter(marker => {
        return this.judgeIsInner(marker.getPosition(), data)
      })
      choosedMarkers.forEach(marker => {
        const exData = marker.getExtData()
        exData.isActive = !exData.isActive
        this.reRenderMarker(marker, exData)
      })
      choosedMarkers.forEach(marker => {
        this.$emit('trigger', marker.getExtData())
      })
    },
    // 根据 ID 来判断高亮
    accordIDRender (ids) {
      this.markerList.forEach(marker => {
        const { placeCode } = marker.getExtData()
        const exData = marker.getExtData()
        exData.isActive = ids.includes(placeCode) ? true : false
        this.reRenderMarker(marker)
      })
    },
  },
  created () {
    this.bus.$on('drawRectangle', this.drawComplete)
    this.$once('hook:beforeDestroy', () => {
      this.bus.$off('drawRectangle', this.drawComplete)
    })
    this.renderMarkers()
  },
}
</script>

<style>
.marker-img {
  z-index: 50;
  width: 24px;
}
</style>
