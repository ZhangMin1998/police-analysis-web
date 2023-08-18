<template>
  <div v-if="isShow && content" class="popup" ref="clickpop">
    <div class="content">{{ content }}</div>
  </div>
</template>

<script>
export default {
  props: {
    labelName: {
      type: String,
      default: 'olabel'
    },
    isCluster: {
      // 是否聚合
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      popup: null,
      isShow: false,
      content: '',
      hoverPopUp: null, // hover 标志
      isHoverShow: false,
      hoverContent: ''
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap1
    }
  },
  mounted () {
    if (this.map) {
      this.clickEvent()
      this.pointermoveEvent()
    } else {
      setTimeout(() => {
        this.clickEvent()
        this.pointermoveEvent()
      }, 300)
    }
  },
  // activated(){
  //   console.log('执行了');
  //   if (this.map) {
  //     this.clickEvent()
  //     this.pointermoveEvent()
  //   } else {
  //     setTimeout(() => {
  //       this.clickEvent()
  //       this.pointermoveEvent()
  //     }, 300)
  //   }
  // },
  methods: {
    initPop () {},
    zoomOut (clusterCenter) {
      const view = this.map.getView()
      const curZoom = view < 17 ? 17 : curZoom

      view.animate({
        zoom: view.getZoom() + 1,
        center: clusterCenter,
        duration: 300
      })
    },
    zoomIn () {
      const view = this.map.getView()
      let zoom = view.getZoom()
      view.setZoom(zoom - 1)
    },
    resetPlace (isSet = false) {
      const view = this.map.getView()
      view.setCenter([112.461577, 23.0727397])
      isSet && view.setZoom()
    },
    // 没有聚合
    noCluster (feature) {
      this.content = feature.get(this.labelName)
      const coordinates = feature.getGeometry().getCoordinates() // 获取坐标
      this.isShow = true
      const curFeature = feature.values_.features
      this.$emit('showCallback', curFeature[0].values_)
      setTimeout(() => {
        this.popup.setPosition(coordinates)
      }, 200)
    },
    // 聚合点
    hasCluster (feature) {
      // 这里分聚合和不聚合
      const curFeature = feature.values_.features
      if (feature.get('layerType') !== 'cluster') {
        this.$emit('handleClickAggregate', curFeature[0].values_)
      }
    },
    // 生成 overlay
    generateOverLay (feature) {
      if (this.hoverPopUp) return
      this.hoverContent = feature.get(this.labelName)
      const coordinates = feature.getGeometry().getCoordinates()
      // eslint-disable-next-line
      this.hoverPopUp = new ol.Overlay({
        element: this.$refs['hoverpop'],
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50],
        population: 4000,
        rainfall: 500
      })
      this.isHoverShow = true
      this.map.addOverlay(this.hoverPopUp)
      this.$nextTick(() => {
        this.hoverPopUp.setPosition(coordinates)
      })
    },
    // 监听点击
    clickEvent () {
      this.map.on('singleclick', e => {
        const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
        if (!feature && !this.isShow) {
          return
        }

        if (!feature && this.isShow) {
          this.$emit('cancelCallback')
          this.isShow = false
          return
        }

        // 点击地图，如果有矢量物体，则 feature 不为空
        if (feature) {
          let overFeature = feature.getProperties().features
          if (!overFeature || overFeature.length == 0) return false
          // eslint-disable-next-line
          this.popup = new ol.Overlay({
            element: this.$el,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50],
            population: 4000,
            rainfall: 500
          })
          this.map.addOverlay(this.popup)
          // 这里的聚合影响判断
          // overFeature === 1 =》 最大级别是一个小图标    >1 =》聚合图的状态
          overFeature.length > 1 ? this.hasCluster(feature, e.coordinate) : this.noCluster(feature)
        } else {
          this.$emit('cancelCallback')
          this.isShow = false
        }
      })
    },
    pointermoveEvent () {
      const All_FEATURES = 'features'

      this.map.on('pointermove', e => {
        let pixel = this.map?.getEventPixel(e.originalEvent)
        let feature = this.map?.forEachFeatureAtPixel(pixel, f => f)
        // console.log(feature);
        // 如果有覆盖物
        if (feature) {
          const allKeys = feature.getKeys()
          // 如果是聚合点下的单个标注
          if (allKeys.includes(All_FEATURES)) {
            const curFeatures = feature.get('features')
            if (curFeatures.length === 1) {
              const curFeature = curFeatures[0]
              this.generateOverLay(curFeature)
            }
          }

          //  仅仅是单个标注
          if (allKeys.includes(this.labelName)) {
            this.generateOverLay(feature)
          }
        } else {
          // 取消弹窗
          // console.log(this.hoverPopUp);
          if (this.hoverPopUp) {
            this.map.removeOverlay(this.hoverPopUp)
            this.isHoverShow = false
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.popup {
  white-space: nowrap;
  background: var(--tooltip-bg-262D44-to-f6f8fd);
  box-sizing: border-box;
  width: max-content;
  border-radius: 4px;
  display: inline-block;
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--tooltip-bg-262D44-to-f6f8fd);
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  .icon-close {
    position: absolute;
    top: 0px;
    right: 8px;
  }

  .content {
    display: inline-block;
  }
}
</style>
