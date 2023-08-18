<script>
/* eslint-disable */
import { mapState } from 'vuex'
// 点标注组件
export default {
  name: 'MapIcon',
  inject: ['addLayer'],
  render () {
    return this.$parent.preventChildrenRender
  },
  props: {
    position: { type: Array },
    elementName: { type: String },
    className: { type: String },
    label: { type: String },
    icon: { type: String },
    zIndex: { type: Number },
    customAttribute: { type: Object },
    zindexList: { type: Object },
    iconScale: { type: Number },
    textOffsetY: { type: Number },
    textBackground: { type: String },
    labelColor: { type: String },
    iconWidth: { type: Number },
    iconHeight: { type: Number },
    bgStroke: { type: String },
  },
  data () {
    return {
      iconLayer: null,
      time: null
    }
  },
  computed: {
    ...mapState('Ol', {
      oMap: 'oMap'
    })
  },
  mounted () {
    if (this.oMap) {
      this.MapIconMark()
    } else {
      setTimeout(() => {
        this.MapIconMark()
      }, 800)
    }
  },
  methods: {
    // 单个标注
    MapIconMark () {
      const _that = this
      if (_that.iconLayer) {
        _that.iconLayer.getSource().clear()
      }
      // 创建矢量容器
      const vectorSource = new ol.source.Vector({})
      //创建图标特性
      const iconFeature = new ol.Feature({
        type: 'icon',
        name: _that.elementName || 'el-mapIconMark',
        customAttribute: _that.customAttribute || {},
        geometry: new ol.geom.Point(this.position)
      })
      iconFeature.setId('point' + _that.customAttribute.id)
      // 图标特性添加到矢量容器
      vectorSource.addFeature(iconFeature)

      let iconStyle
      let addLayerFun = () => {
        //创建矢量层
        _that.iconLayer = new ol.layer.Vector({
          className: _that.className || 'map-icon-mark',
          warningLevel: _that.zindexList ? _that.customAttribute[_that.zindexList['prop']] : 'warningLevel',
          source: vectorSource,
          zIndex: _that.zindexList
            ? _that.zindexList[_that.customAttribute[_that.zindexList['prop']]]
            : _that.zIndex || 800,
          //创建图标样式
          style: new ol.style.Style({
            image: iconStyle,
            // 文本样式
            text: new ol.style.Text({
              text: _that.label || null,
              fill: new ol.style.Fill({
                color: _that.labelColor || '#fff'
              }),
              font: '14px Microsoft YaHei',
              offsetX: 0,
              offsetY: _that.textOffsetY || 30,
              padding: [2, 10, 0, 10],
              // 文本边框
              /*
              backgroundStroke: new Stroke({
                color: '#f00',
                width: 1,
              }),
              */
              // 文本填充
              backgroundFill: new ol.style.Fill({
                color: _that.textBackground || 'rgba(0,0,0,0.5)',
              }),
              backgroundStroke: new ol.style.Stroke({
                color: _that.bgStroke || _that.textBackground || 'rgba(0,0,0,0.5)',
                width: 2
              })
            })
          })
        })
        _that.iconLayer.set('id', _that.customAttribute.id)
        this.time && clearTimeout(this.time)
        this.time = setTimeout(() => {
          _that.addLayer(_that.iconLayer)
        }, 500)
      }

      if (_that.iconWidth && _that.iconHeight) {
        let img = new Image()
        img.src = _that.icon
        img.onload = () => {
          let canvas = document.createElement('canvas')
          let context = canvas.getContext('2d')
          canvas.width = _that.iconWidth
          canvas.height = _that.iconHeight
          context.drawImage(img, 0, 0, _that.iconWidth, _that.iconHeight)
          let imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] === 0) {
              imageData.data[i] = 255
              imageData.data[i + 1] = 255
              imageData.data[i + 2] = 255
              imageData.data[i + 3] = 1
            }
          }
          context.putImageData(imageData, 0, 0)
          iconStyle = new ol.style.Icon({
            img: canvas,
            imgSize: [_that.iconWidth, _that.iconHeight]
          })
          addLayerFun()
        }
      } else {
        iconStyle = new ol.style.Icon({
          src: _that.icon || null,
          scale: _that.iconScale ? _that.iconScale : 1
        })
        addLayerFun()
      }
    }
  },
  beforeDestroy () {
    this.time && clearTimeout(this.time)
  }
}
</script>
