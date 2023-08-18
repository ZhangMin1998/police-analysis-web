<template>
  <div></div>
</template>

<script>
export default {
  inject: ['addLayer'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    shape: {
      type: String,
      default: 'Box' //Point点 LineString线 Box矩形
    }
  },
  data () {
    return {
      drawSource: null,
      drawvector: null,
      draw: null
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  watch: {
    open: function (val) {
      this.draw.setActive(val)
    }
  },
  mounted () {
    this.initSelect()
    setTimeout(() => this.drawRetange(), 1000)
  },
  methods: {
    initSelect () {
      // eslint-disable-next-line
      this.drawSource = new ol.source.Vector({
        wrapX: false // 禁止横向无限重复（底图渲染的时候会横向无限重复），设置了这个属性，可以让绘制的图形不跟随底图横向无限重复
      })
      // eslint-disable-next-line
      this.drawvector = new ol.layer.Vector({
        source: this.drawSource
      })
    },
    // 绘制矩形
    drawRetange () {
      this.map.removeInteraction(this.draw) //每次执行先取消上一次的绘制动作
      if (this.shape === 'Box') {
        // eslint-disable-next-line
        this.draw = new ol.interaction.Draw({
          source: this.drawSource,
          type: 'Circle',
          // wrapX: false,
          // eslint-disable-next-line
          geometryFunction: ol.interaction.Draw.createBox()
        })
      } else {
        // eslint-disable-next-line
        this.draw = new ol.interaction.Draw({
          source: this.drawSource,
          type: this.shape
        })
      }
      this.draw.setActive(this.open)

      this.draw.on('drawend', e => {
        // console.log('drawend', e)
        const { feature } = e
        this.$emit('selectEnd', feature.get('geometry'))
      })

      this.map.addInteraction(this.draw)
    },
    // 判断点是否在矩形内
    checkPointInPolygon (polygonFeature) {
      return this.list.filter(item => polygonFeature.intersectsCoordinate(item.position))
    }
  }
}
</script>

<style></style>
