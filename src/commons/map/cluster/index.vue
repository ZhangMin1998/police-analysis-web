<template>
  <div v-if="clusterObj.list.length > 0">
    <MarkerPop v-clickout="handleClickOut" ref="MarkerPopRef" :position="clusterObj.position">
      <div class="marker-pop-content-list">
        <div v-for="(column, idx) in clusterObj.list" :key="idx" class="column-wrapper">
          <div
            v-for="(item, index) in column"
            :key="`${idx}_${index}`"
            class="column-item"
            @click="clickDeviceCate(item)"
            :title="deviceTypeObj[item.otype]"
          >
            <img :src="generateImg(item)" alt="" />
            <span class="column-text">{{ item.onlineCount }} / {{ item.allCount }}</span>
          </div>
        </div>
      </div>
    </MarkerPop>
  </div>
</template>

<script>
import clusterMixin from '@/mixins/olCluster'

import { formatUniqueList } from '@/views/offline/devicemap/devicemap.js'
// import { UtilHandleBigData } from '@/utils/index'
import { generateCanvasCustom } from './cluster.js'
import { mapState } from 'vuex'
// eslint-disable-next-line
const TEXT_FILL = new ol.style.Fill({ color: '#fff' })
// eslint-disable-next-line
const BOX_FILL = new ol.style.Fill({ color: 'rgba(69, 150, 230, 0.4)' })

const MAX_GRID = 200
const MIN_GRID = 40
const GRID_INTERVAL = 17

export default {
  name: 'MapCluster',
  mixins: [clusterMixin],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    imgUrl: {
      // 默认空字符串，如果不为空，则会覆盖 imgMap 属性
      type: String,
      default: ''
    },
    imgParentMap: {
      // 类型对应图片
      type: Object,
      default: () => ({})
    },
    markerType: {
      type: String,
      default: 'device'
    },
    layerName: {
      // 图层名字
      type: String,
      default: 'device'
    },
    isChoose: {
      // 选择模式
      type: Boolean,
      default: false
    },
    scale: {
      // 矢量图缩放比例
      type: Number,
      default: 1
    },
    isMarker: {
      // hack 做法，应付单选功能没做完
      type: Boolean,
      default: false
    },
    // 是否为设备地图页面，用于优化
    isDevicemap: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      clusters: null, // 聚合Layer
      cluNum: 2, // 聚合最小数
      clusterSource: null, // 聚合 Source
      source: null
    }
  },
  inject: ['addLayer'],
  computed: {
    ...mapState('Ol', {
      imgMap: 'imgMap',
      // map: 'oMap1'
    }),
    ...mapState('Map', {
      deviceTypeObj: 'deviceTypeObj'
    }),
    ...mapState('User', {
      zoom: 'zoom'
    }),
    map () {
      if (this.isDevicemap) {
        return this.$store.state.Ol.oMap1
      } else {
        return this.$store.state.Ol.oMap
      }
    }
  },
  watch: {
    zoom (val) {
      if (!this.clusterSource) return
      const newGrid = val > GRID_INTERVAL ? MIN_GRID : MAX_GRID
      const curGrid = this.clusterSource.getDistance()
      if (curGrid === newGrid) return
      this.clusterSource.setDistance(newGrid)
    },
    list: {
      handler (val) {
        if (val.length === 0) {
          this.clusters && this.map && this.map.removeLayer(this.clusters)
          return
        }
        setTimeout(() => {
          // console.log('重新生成最大级别的');
          // console.log(this.map);
          // UtilHandleBigData(val, (item) => {
          //    this.map && this.initCluster(item)
          // })
          this.map && this.initCluster()
          this.bus.$emit('curlayer', this.clusters)
        }, 100)
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.bus.$off('olMapClick')
    this.bus.$on('olMapClick', this.zoomOutCluster)
    this.bus.$on('setMapCenter', this.zoomOut)
  },
  // beforeDestroy() {
  //   // console.log('消失了');
  //   this.bus.$off('olMapClick')
  // },
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    this.bus.$off('setMapCenter')
    next()
  },
  beforeDestroy () {
    this.clusters && this.map?.removeLayer(this.clusters)
  },
  activated () {
    this.bus.$off('olMapClick')
    this.bus.$on('olMapClick', this.zoomOutCluster)
    // this.bus.$on('setMapCenter', this.zoomOut)
  },
  methods: {
    /**
     * 放大地图
     * clusterCenter 坐标点
     * zoom 如果有就是指定层级，否则是放大一级
     */
    zoomOut (pos, zoom = null) {
      const view = this.map.getView()
      const currZoom = zoom || view.getZoom() + 1
      view.animate({
        zoom: currZoom,
        center: pos,
        duration: 300
      })
    },
    // 根据数量计算聚合点大小
    calcClusterStyle (num) {
      let r = 0
      if (num < 9) {
        r = 24
      } else if (num < 100) {
        r = 30
      } else {
        r = 40
      }
      return r
    },
    // 聚合初始化及加载
    initCluster () {
      // 有就清空
      this.clusters && this.map.removeLayer(this.clusters)
      const cluseters = (this.$store.state.Ol.deviceFeatures = this.list.map((item, index) => {
        const pos = item.position.map(_c => parseFloat(_c)) // 字符串转数字类型
        // eslint-disable-next-line
        const temFeature = new ol.Feature(new ol.geom.Point(pos)) // 生成Feature
        temFeature.setProperties({
          // 自定义属性
          ...item,
          index: index,
          olabel: item.deviceName,
          otype: item.deviceType,
          omarkerType: this.markerType // 这里定义属性是为了区分标注的类型
        })
        // 如果进入选择模式
        if (this.isChoose) {
          temFeature.setProperties({
            isActive: item.isActive
          })
        }
        return temFeature
      }))
      // eslint-disable-next-line
      this.source = new ol.source.Vector({
        features: cluseters
      })

      // 不同的缩放等级来显示不同的聚合间隔
      const curGrid = this.zoom > GRID_INTERVAL ? MIN_GRID : MAX_GRID
      // eslint-disable-next-line
      this.clusterSource = new ol.source.Cluster({
        distance: curGrid,
        geometryFunction: feature => {
          return feature.getGeometry()
        },
        source: this.source // 就是前面用到的矢量数据源
      })

      const styleCache = new Map() // 缓存
      // eslint-disable-next-line
      this.clusters = new ol.layer.Vector({
        source: this.clusterSource, // 源，指向上面的聚合数据源
        style: feature => {
          const uid = feature.ol_uid
          // feature 是聚合后的数据，每一个 feature 代表距离小于上面设置的点状要素
          const featuresList = feature.get('features')
          const normalList = featuresList.map(item => item.values_)
          let size = normalList.length // features 是点状要素
          let style = styleCache.get(uid + size + '')
          // hack 做法，在线框选没有做完，
          // if (this.isMarker && this.zoom >= 17 && this.layerName === 'device' ) {
          //   console.log('enter hack');
          //   style = this.generateMarkerStyle(feature)
          // } else
          // console.log(this.map);
          const view = this.map.getView()
          const currZoom = view.getZoom() + 1 || this.zoom
          if (size > 1 && this.layerName !== 'site' && currZoom <= GRID_INTERVAL) {
            /* eslint-disable */
            style = new ol.style.Style({
              image: new ol.style.Circle({
                radius: this.calcClusterStyle(size),
                fill: BOX_FILL
              }),
              text: new ol.style.Text({
                text: size.toString(),
                fill: TEXT_FILL,
                scale: 1.5
              })
            })
            /* eslint-enable */
          }
          // size 大于 1 显示聚合，否则是图标
          else if (size > 0 && this.layerName !== 'site') {
            // 统计在线个数 这里区分设备和场所，设备才需要显示在线和总数的关系, 通过 layerName
            const onlineCount = this.layerName === 'device' ? normalList.filter(_c => _c.online).length : 0
            feature.setProperties({
              layerType: 'cluster'
            })
            if (!style) {
              const curText = onlineCount + ' / ' + size
              const canvas = generateCanvasCustom(curText, normalList)
              /* eslint-disable */
              style = new ol.style.Style({
                image: new ol.style.Icon({
                  img: canvas,
                  imgSize: [canvas.width, canvas.height]
                }),
                text: new ol.style.Text({
                  text: curText, // 以聚合点的数量作为显示的内容
                  fill: TEXT_FILL,
                  offsetX: 20,
                  offsetY: 2,
                  scale: 2
                })
              })
              /* eslint-enable */
              // styleCache[size] = style
              styleCache.set(uid + size + '', style)
            }
          } else if (size > 1 && this.layerName == 'site') {
            if (!style) {
              /* eslint-disable */
              style = new ol.style.Style({
                image: new ol.style.Circle({
                  radius: this.calcClusterStyle(size),
                  fill: BOX_FILL
                }),
                text: new ol.style.Text({
                  text: size.toString(),
                  fill: TEXT_FILL,
                  scale: 1.5
                })
              })
              /* eslint-enable */
              styleCache.set(uid + size + '', style)
            }
          } else {
            style = this.generateMarkerStyle(feature)
          }
          return style
        }
      })
      // 添加图层
      this.map.addLayer(this.clusters)
    },
    // 生成 marker 样式
    generateMarkerStyle (feature) {
      let style
      feature.setProperties({
        layerType: 'marker'
      })
      // 如果是选择模式
      let curImg
      let curFeature = feature.get('features')[0]
      if (!curFeature) return
      let imgType = curFeature.get('otype') || 11
      if (this.isChoose) {
        let imgIsActive = curFeature.get('isActive') ? '' : imgType + ''
        let imgIndex = imgType + imgIsActive
        curImg =
          Object.keys(this.imgParentMap).length > 0
            ? this.imgParentMap[imgIndex]
            : this.imgMap[imgIndex]
      } else {
        // imgType = curFeature.get('otype')
        imgType = imgType === '0' ? '1' : imgType + ''
        let imgStatus = !curFeature.get('online') ? imgType : ''
        imgType += imgStatus
        curImg = this.imgUrl || this.imgMap[imgType]
      }
      /* eslint-disable */
      style = new ol.style.Style({
        image: new ol.style.Icon({
          /* eslint-enable */
          // 定义图标锚点
          anchor: [0.5, 46], // 根据图标的大小，对应上面 [0, 0] 的坐标
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: require(`@/assets/img/${curImg}`),
          scale: this.scale
        })
      })
      return style
    },
    // 点击聚合放大地图
    zoomOutCluster (e) {
      // console.log('点击聚合放大地图');
      // console.log(111);
      // 把下面这句代码注释了，因为this.zoom < GRID_INTERVAL一直为true，而isMarker在时空碰撞中为true,导致时空碰撞点击不了
      // if (this.isMarker && this.zoom < GRID_INTERVAL) return
      // 获取鼠标点击对象
      let feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
      // console.log(feature);
      // 如果点击到物体
      if (!feature || feature.id_) return
      const curFeature = feature.values_['features']
      if (!curFeature) return
      // 分析研判触发
      if (this.isMarker && feature.values_.layerType && feature.values_.layerType === 'cluster') {
        this.$emit('chooseDevice', curFeature)
        return
      }

      // 如果大于 某个数值，则是聚合 , 最大级别
      if (curFeature.length !== 1) {
        // console.log(1111);
        const featurObj = { list: [], position: [] }
        if (feature.get('layerType') !== 'cluster') return
        featurObj.list = curFeature.map((item, i) => ({ ...item.values_, index: i }))
        featurObj.position = feature.getGeometry().getCoordinates()
        featurObj.ids = curFeature.map(item => item.values_.id)

        // 如果单一聚合类型，直接触发 表格，如果是复合聚合类型，则先打开弹窗
        const firstFeature = featurObj.list[0].otype
        // 判断是否单一聚合
        const isSingleCluster = featurObj.list?.every(item => item.otype === firstFeature)
        if (isSingleCluster) {
          this.clickDeviceCate(featurObj)
        } else {
          this.bus.$emit('clickClusterMaker', featurObj)
          this.clickClusterMaker(featurObj)
        }
      } else {
        // console.log(2222);
        this.bus.$emit('clickMarker', feature)
      }
    },
    clickClusterMaker (featurObj) {
      this.clusterObj.list = formatUniqueList(featurObj.list, 'otype')
      this.clusterObj.position = featurObj.position
      this.clusterObj.curIds = featurObj.ids
      this.MarkerPopRef = this.$refs['MarkerPopRef']
      if (this.MarkerPopRef) {
        this.MarkerPopTimer = setTimeout(() => {
          this.MarkerPopRef.refresh(featurObj.position)
          this.MarkerPopTimer = null
        }, 100)
      }
    },
  }
}
</script>

<style></style>
