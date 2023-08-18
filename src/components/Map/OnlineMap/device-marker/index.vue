<template>
  <div></div>
</template>

<script>
const DEFALT_TYPE = 1

export default {
  inject: [
    'addOverlay',
    'clearOverGroup',
    'initClusterLoad',
    'clusterDelMarkers',
    'clusterAddMarkers',
    'clearOverlay'
  ],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    mode: {
      type: Number,
      validator: t => [0, 1, 2].includes(t)
    },
    markerType: {
      type: String,
      default: 'deviceType'
    },
    show: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      initMarkersList: [], // 实例化的 Marker 对象
      markerMap: {}
    }
  },
  mounted () {
    if (this.show === 0) {
      this.bus.$on('drawRectangle', this.drawComplete)
      this.$once('hook:beforeDestroy', () => {
        this.bus.$off('drawRectangle')
        this.clearOverlay()
      })
    }

    this.renderMarkers()
  },
  methods: {
    // 初始化 标注点
    initMarker (marker) {
      const { position, deviceName, deviceType = DEFALT_TYPE, isActive } = marker
      const cls = this.mapClass(deviceType, isActive)
      // eslint-disable-next-line
      const overLayer = new AMap.Marker({
        position,
        content: `<div class="${cls} icon-img-box"></div>`,
        title: deviceName,
        extData: {
          ...marker
        }
      })

      overLayer.on('click', e => {
        if ([0, 2].includes(this.mode)) return
        const curMarker = e.target
        const clickObj = curMarker.getExtData()
        clickObj.isActive = !clickObj.isActive
        this.reRenderMarker(curMarker, clickObj)
        this.$emit('clickMarker', clickObj)
      })
      return overLayer
    },

    // 遍历 渲染 list
    renderMarkers () {
      this.initMarkersList = this.list.map(item => {
        return this.initMarker(item)
      })
      this.markerListToObj()
      this.initClusterLoad(this.initMarkersList, 'device')
      Object.freeze(this.initMarkersList)
    },

    // 重新渲染单个 标注
    reRenderMarker (marker, markerExtData) {
      const { deviceType = DEFALT_TYPE, isActive } = markerExtData
      const newCls = this.mapClass(deviceType, isActive)
      marker.setContent(`<div class="${newCls} icon-img-box"></div>`)
    },
    /**
     * 根据 type 和 isActive 返回对应样式（样式定义在 _element2.less 中）
     *  */
    mapClass (type = 1, isActive) {
      const pre = 'icon-small'
      if (type < 1 || type > 8) type = 1
      return isActive ? `${pre}-${type}` : `${pre}-${type}-g`
    },
    // 取消高亮的覆盖物
    closeHighlightMarker () {
      this.initMarkersList.forEach(marker => {
        const exData = marker.getExtData()
        exData.isActive = false
        this.reRenderMarker(marker, exData)
      })
    },
    // 判断点是否在矩形内
    judgeIsInner (point, path) {
      // eslint-disable-next-line
      return AMap.GeometryUtil.isPointInRing(point, path)
    },
    // 绘图
    drawComplete ({ data }) {
      const choosedMarkers = this.initMarkersList.filter(marker => {
        return this.judgeIsInner(marker.getPosition(), data)
      })
      choosedMarkers.forEach(marker => {
        const exData = marker.getExtData()
        exData.isActive = !exData.isActive
        this.reRenderMarker(marker, exData)
      })
      choosedMarkers.forEach(marker => this.$emit('clickMarker', marker.getExtData()))
    },

    // 映射 marker 列表
    markerListToObj () {
      this.markerMap = this.initMarkersList.reduce((acc, cur) => {
        const curType = cur.getExtData()[this.markerType]
        if (curType in acc) {
          acc[curType].push(cur)
        } else {
          acc[curType] = [cur]
        }
        return acc
      }, {})
    },
    /**
     * 根据类型重新聚合
     * @param <string> marker类型
     * @param <boolean> 操作类型 true 是添加 false 是删除
     */
    accordTypeGe (markerType, flag = true) {
      const operaMarkers = this.markerMap[markerType]
      operaMarkers &&
        (flag ? this.clusterAddMarkers(operaMarkers) : this.clusterDelMarkers(operaMarkers))
    }
  }
}
</script>

<style></style>
