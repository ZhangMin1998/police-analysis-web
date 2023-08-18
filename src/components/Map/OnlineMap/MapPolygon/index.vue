<script>
import { mapState } from 'vuex'
export default {
  name: 'olMapPolygon',
  render () {
    return this.$parent.preventChildrenRender
  },
  props: {
    pointList: { type: Array },
    lineColor: { type: String },
    lineWidth: { type: Number },
    lineDash: { tyep: String }, // 多边形String 实线:solid，虚线:dashed
    fillColor: { type: String },
    zIndex: { type: Number },
    customAttribute: { type: Object }
  },
  data () {
    return {
      polygonLayer: null
    }
  },
  computed: {
    ...mapState('Common', {
      cMap: 'cMap'
    }),
    areaLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('polygon') ?? []
    }
  },
  watch: {
    pointList: {
      handler () {
        this.clearLayer()
        this.MapPolygon()
      },
      deep: true
    },
    fillColor: {
      handler () {
        this.changeColorLayer()
      },
      deep: true
    },
    lineColor: {
      handler () {
        this.changeColorLayer()
      },
      deep: true
    }
  },
  mounted () {
    if (this.cMap) {
      this.MapPolygon()
    } else {
      setTimeout(() => {
        this.MapPolygon()
      }, 500)
    }
  },
  beforeDestroy () {
    this.polygonLayer?.off('click')
  },
  methods: {
    changeColorLayer () {
      const _that = this
      // 创建图标样式
      const { id } = this.customAttribute
      if (!id) return

      this.areaLayers.forEach(element => {
        if (element.getExtData().id === id) {
          element.setOptions({
            strokeColor: _that.lineColor || '#409eff',
            fillColor: _that.fillColor || '#409eff'
          })
        }
      })
    },
    clearLayer () {
      if (!this.customAttribute) return
      const { id } = this.customAttribute
      if (!id) return

      this.areaLayers.forEach(element => {
        if (element.getExtData().id === id) {
          // layer没有定义，为在线地图，后面修改在线地图时，再考虑此问题
          // this.$store.state.Common.cMap?.remove(layer)
        }
      })
    },
    MapPolygon () {
      // 清除原来的
      this.clearLayer()
      // eslint-disable-next-line
      this.polygonLayer = new AMap.Polygon({
        path: this.pointList,
        strokeColor: this.lineColor,
        strokeWeight: this.lineWidth,
        fillColor: this.fillColor,
        zIndex: this.zIndex,
        strokeStyle: this.lineDash,
        extData: { ...this.customAttribute }
      })

      this.polygonLayer.on('click', e => {
        this.$emit('handleClickPolygon', e, this.customAttribute)
      })

      this.$nextTick(() => {
        this.$store.state.Common.cMap?.add(this.polygonLayer)
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
