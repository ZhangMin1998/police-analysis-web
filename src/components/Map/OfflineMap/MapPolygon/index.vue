<script>
/* eslint-disable */

import { mapState } from 'vuex'
// 多边形组件
export default {
  name: 'MapPolygon',
  render () {
    return this.$parent.preventChildrenRender
  },
  inject: ['addLayer'],
  props: {
    pointList: { type: Array },
    elementName: { type: [String, Number] },
    className: { type: String },
    lineColor: { type: String },
    lineWidth: { type: Number },
    lineDash: { type: Array },
    fillColor: { type: String },
    zIndex: { type: Number },
    customAttribute: { type: Object },
    needSetId: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      polygonLayer: null
    }
  },
  computed: {
    ...mapState('Ol', {
      oMap: 'oMap'
    }),
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_ === (this.className || 'map-polygon')) : []
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
    },
    lineDash: {
      handler () {
        this.changeColorLayer()
      },
      deep: true
    },
    lineWidth: {
      handler () {
        this.changeColorLayer()
      },
      deep: true
    }
  },
  mounted () {
    if (!this.customAttribute) return
    if (this.oMap) {
      this.MapPolygon()
    } else {
      setTimeout(() => {
        this.MapPolygon()
      }, 800)
    }
  },
  methods: {
    changeColorLayer () {
      const _that = this
      // 创建图标样式
      // eslint-disable-next-line
      const style = new ol.style.Style({
        // eslint-disable-next-line
        stroke: new ol.style.Stroke({
          color: _that.lineColor || '#409eff',
          width: _that.lineWidth || 2,
          lineDash: _that.lineDash || null,
          lineDashOffset: 0
        }),
        //填充样式
        // eslint-disable-next-line
        fill: new ol.style.Fill({
          color: _that.fillColor || '#409eff' //颜色、渐变或图案
        })
      })

      console.log("🚀 ~ file: index.vue ~ line 84 ~ changeColorLayer ~ this.customAttribute", this.customAttribute)
      const { id } = this.customAttribute
      if (!id) return
      this.areaLayers.forEach(element => {
        if (element.get('id') === id) {
          element.setStyle(style)
        }
      })
    },
    clearLayer () {
      if (!this.customAttribute) return
      const { id } = this.customAttribute
      if (!id) return

      this.areaLayers.forEach(element => {
        if (element.get('id') === id) {
          this.$store.state.Ol.oMap.removeLayer(element)
        }
      })
    },
    MapPolygon () {
      const _that = this
      // 创建一个 source图层
      // eslint-disable-next-line
      const source = new ol.source.Vector()
      // 所有点共同构成一个 feature
      // eslint-disable-next-line
      const feature = new ol.Feature({
        name: _that.elementName || 'el-mapPolygon',
        // eslint-disable-next-line
        geometry: new ol.geom.Polygon([_that.pointList]),
        customAttribute: _that.customAttribute || {}
      })
      if (this.needSetId) {
        feature.setId('mapPolygon' + _that.customAttribute.id)
      }
      // 然后把feature添加到source里
      source.addFeature(feature)
      // eslint-disable-next-line
      this.polygonLayer = new ol.layer.Vector({
        className: _that.className || 'map-polygon',
        source: source,
        zIndex: _that.zIndex || 200,
        style: function () {
          const style = [
            // eslint-disable-next-line
            new ol.style.Style({
              // eslint-disable-next-line
              stroke: new ol.style.Stroke({
                color: _that.lineColor || '#409eff',
                width: _that.lineWidth || 2,
                lineDash: _that.lineDash || null,
                lineDashOffset: 0
              }),
              //填充样式
              // eslint-disable-next-line
              fill: new ol.style.Fill({
                color: _that.fillColor || 'rgba(0,0,0,0.8)' //颜色、渐变或图案
              })
            }),
          ]
          return style
        }
      })

      this.polygonLayer.set('id', _that.customAttribute.id)

      this.addLayer(this.polygonLayer)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
