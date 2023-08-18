<template>
<div class='control_region_wrap'>
  <ol-map  id="map" class="map">
    <OperaHeader :breadcrumbData='breadcrumbList' @callBack='callBack'></OperaHeader>
    <div class='draw_bar warn_draw_bar'>
      <div class='draw_header'>
        <div class='tool' @click='drawRegion'>
          <i class='iconfont icon-a-7'></i>
          <div>绘制工具</div>
        </div>
        <i class='iconfont icon-zhushi'></i>
        <div class='tip'>点击工具在地图上绘出范围</div>
      </div>
      <div class='draw_radio'>
        <div class='my_radio'>
          <div class='radio_label' :class='{ "active": isNoIn }' @click='noIn'>禁止进入</div>
          <div class='radio_tip'>
            <i class='iconfont icon-zhushi'></i>
            <div>监控对象进入划定区域时触发预警</div>
          </div>
        </div>
        <div class='my_radio'>
          <div class='radio_label' :class='{ "active": !isNoIn }' @click='noOut'>禁止离开</div>
          <div class='radio_tip'>
            <i class='iconfont icon-zhushi'></i>
            <div>监控对象离开划定区域时触发预警</div>
          </div>
        </div>
      </div>
      <div class='draw_floor'>
        <div class='blank_button' @click='callBack'>取消</div>
        <el-button type="primary" @click='submit'>确定</el-button>
      </div>
    </div>
    <DrawPolygon :open="isDraw" shape="Polygon" @selectEnd="selectEnd"></DrawPolygon>
    <div>
      <MapPolygon
        v-for='item in regionLists'
        :key='item.id'
        :pointList="item.pointlist"
        :fillColor="item.fillColor"
        :lineColor="item.lineColor"
        :lineWidth="item.lineWidth"
        :lineDash="isNoIn ? null : [5]"
        :elementName="item.elementName"
        :className="item.className"
        :customAttribute="{ id: item.id + '' }"
        :needSetId='true'
      ></MapPolygon>
    </div>
  </ol-map>
</div>
</template>

<script>
import OlMap from '@/commons/map/Map'
import OperaHeader from '@/views/common/system-setting/records-manage/opera-header/index.vue'
import DrawPolygon from '@/components/Map/OfflineMap/MapPolygon/DrawPolygon'
import MapPolygon from '@/components/Map/OfflineMap/MapPolygon'

export default {
  name: 'ControlRegion',
  props: {
    isNoIn: {
      type: Boolean,
      default: true
    },
    regionLists: {
      type: Array,
      default: () => []
    },
    tabTip: {
      type: String,
      default: '新建'
    }
  },
  components: {
    OlMap,
    OperaHeader,
    DrawPolygon,
    MapPolygon
  },
  data () {
    return {
      breadcrumbList: [
        { tabName: '布控设置', canOpera: true },
        { tabName: '新建' },
        { tabName: '布控区域选择' }
      ],
      isDraw: false
    }
  },
  created () {
    this.breadcrumbList[1].tabName = this.tabTip
  },
  computed: {
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers || []
    }
  },
  watch: {
    isDraw: {
      handler () {
        if (this.isDraw) {
          this.bus.$off('olMapClick', this.MapClick)
        } else {
          setTimeout(() => {
            this.bus.$on('olMapClick', this.MapClick)
          }, 300)
        }
      }
    }
  },
  mounted () {
    if (this.regionLists.length) {
      this.bus.$on('olMapClick', this.MapClick)
    }
  },
  methods: {
    callBack () {
      this.$emit('changeStatus', false, true)
    },
    noIn () {
      this.$emit('noIn')
    },
    noOut () {
      this.$emit('noOut')
    },
    submit () {
      this.$emit('changeStatus', false)
    },
    drawRegion () {
      this.isDraw = true
      this.$emit('setActRegion', '')
    },
    selectEnd (feature) {
      this.$emit('selectEnd', feature.getCoordinates()?.[0])
      this.isDraw = false
    },
    MapClick (evt) {
      if (this.isDraw) {
        return
      }
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_
      if (curFeature.name === 'control-region') {
        this.regionLists.forEach(item => {
          let layer = this.areaLayers.filter(_c => _c.className_ === 'map-polygon' + item.id)
          if (layer.length) {
            let source = layer[0].getSource()
            let delFeature = source.getFeatureById('regionDel' + item.id)
            delFeature && source.removeFeature(delFeature)
            if (item.id === curFeature.customAttribute.id) {
              // eslint-disable-next-line
              const pointFeature = new ol.Feature({
                name: 'region-del',
                // eslint-disable-next-line
                geometry: new ol.geom.Point(item.pointlist[0])
              })
              pointFeature.setId('regionDel' + curFeature.customAttribute.id)
              pointFeature.setStyle(
                // eslint-disable-next-line
                new ol.style.Style({
                  // eslint-disable-next-line
                  text: new ol.style.Text({
                    text: '删除',
                    // eslint-disable-next-line
                    fill: new ol.style.Fill({
                      color: '#C0D0E7'
                    }),
                    font: '14px Microsoft YaHei',
                    offsetX: 0,
                    offsetY: -20,
                    padding: [6, 16, 6, 16],
                    // 文本填充
                    // eslint-disable-next-line
                    backgroundFill: new ol.style.Fill({
                      color: '#394261'
                    })
                  })
                })
              )
              pointFeature.setProperties({
                index : curFeature.customAttribute.id
              })
              source.addFeature(pointFeature)
            }
          }
        })
        // this.$emit('setActRegion', curFeature.customAttribute.id)
      }
      if (curFeature.name === 'region-del') {
        if (curFeature.index) {
          let layer = this.areaLayers.filter(_c => _c.className_ === 'map-polygon' + curFeature.index)
          if (layer.length) {
            let source = layer[0].getSource()
            let polygonFeature = source.getFeatureById('mapPolygon' + curFeature.index)
            source.removeFeature(feature)
            source.removeFeature(polygonFeature)
            this.$emit('delRegion', curFeature.index)
          }
        }
      }
    }
  },
  beforeDestroy () {
    this.bus.$off('olMapClick', this.MapClick)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.control_region_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
  }
  /deep/.opera_header_wrap {
    position: absolute;
    background: transparent;
    width: 100%;
    z-index: 20;
    padding-left: 24px;
    padding-right: 24px;
  }
  .draw_bar {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 24px;
    top: 51px;
    background: var(--bg-color-9);
    z-index: 20;
    width: 380px;
    height: calc(100% - 106px);
    padding: 16px;
    .draw_header {
      flex: none;
      display: flex;
      line-height: 24px;
      margin-bottom: 24px;
      .tool {
        display: flex;
        font-size: 16px;
        line-height: 24px;
        color: var(--active-color);
        margin-right: 24px;
        cursor: pointer;
        white-space: nowrap;
        i {
          font-size: 24px;
          margin-right: 8px;
        }
      }
      .icon-zhushi {
        font-size: 14px;
        color: var(--active-color);
        margin-right: 4px;
      }
      .tip {
        font-size: 12px;
        color: var(--base-text-color-2);
      }
    }
    .draw_radio {
      flex: 1;
      padding-left: 6px;
      .my_radio {
        display: flex;
        margin-bottom: 12px;
        line-height: 21px;
        .radio_label {
          display: flex;
          font-size: 16px;
          color: var(--base-text-color-1);
          margin-right: 24px;
          cursor: pointer;
          white-space: nowrap;
          &::before {
            display: block;
            width: 16px;
            height: 16px;
            content: '';
            border: 1px solid var(--base-text-color-6);
            border-radius: 50%;
            margin-right: 8px;
            margin-top: 1px;
          }
          &.active {
            position: relative;
            &::before {
              border-color: var(--active-color);
            }
            &::after {
              position: absolute;
              top: 5px;
              left: 4px;
              display: block;
              width: 10px;
              height: 10px;
              content: '';
              background: var(--active-color);
              border-radius: 50%;
            }
          }
        }
        .radio_tip {
          display: flex;
          i {
            font-size: 14px;
            color: var(--active-color);
            margin-right: 4px;
          }
          div {
            font-size: 12px;
            color: var(--base-text-color-2);
          }
        }
      }
    }
    .draw_floor {
      flex: none;
      display: flex;
      justify-content: flex-end;
      .blank_button {
        margin-right: 16px;
      }
    }
  }
}
@media screen and (max-width: 1680px) {
  .control_region_wrap .warn_draw_bar {
    width: 334px;
  }
}
</style>
