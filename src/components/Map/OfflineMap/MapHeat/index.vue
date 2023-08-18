<script>
/* eslint-disable */
import { mapState } from 'vuex'
import { gps } from '@/utils/resetPosition'

export default {
  name: 'MapHeat',
  render () {
    return this.$parent.preventChildrenRender
  },
  inject: ['addLayer', 'removeLayer'],
  props: {
    needToWgs: { // 是否需要将heatSource经纬度转换成WGS-84
      type: Boolean,
      default: true
    },
    sourceLngLatType: { // 传递过来的heatSource经纬度地址类型
      type: String,
      default: 'GCJ-02'
    },
    heatZIndex: {
      type: Number,
      default: 200
    },
    heatOpacity: { // 透明度
      type: Number,
      default: 1
    },
    heatBlur: { // 热力点模糊大小
      type: Number,
      default: 15
    },
    heatRadius: { // 热力点的半径大小
      type: Number,
      default: 8
    },
    heatGradient: { // 热力图的梯度颜色
      type: Array,
      default: () => ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
    },
    heatSource: { // 热力图的数据，二维数组，例：[[经度, 纬度], [经度, 纬度]].
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      heatLayer: null,
      source: [] // 热力图的数据，二维数组，例：[[经度, 纬度], [经度, 纬度]].
    }
  },
  computed: {
    ...mapState('Ol', {
      oMap: 'oMap'
    })
  },
  mounted () {
    if (this.needToWgs) {
      if (this.sourceLngLatType === 'GCJ-02') { // GCJ-02转WGS-84
        this.heatSource.forEach(item => {
          let changLnglat = gps.gcj_decrypt(item[0], item[1])
          this.source.push(changLnglat)
        })
      }
    }
    if (this.oMap) {
      this.createHeat()
    } else {
      setTimeout(() => {
        this.createHeat()
      }, 800)
    }
  },
  methods: {
    createHeat () {
      const _that = this
      const source = new ol.source.Vector()
      this.source.forEach(item => {
        let feature = new ol.Feature({
          geometry: new ol.geom.Point(item)
        })
        source.addFeature(feature)
      })
      this.heatLayer = new ol.layer.Heatmap({
        source: source,
        opacity: _that.heatOpacity,
        blur: _that.heatBlur,
        radius: _that.heatRadius,
        gradient: _that.heatGradient,
        zIndex: _that.heatZIndex
      })
      this.addLayer(this.heatLayer)
    }
  },
  destroyed () {
    this.removeLayer(this.heatLayer)
  }
}
</script>

<style lang='less' scoped>

</style>
