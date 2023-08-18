<template>
<div
  class='control_warn_wrap'
  :class='{ "is_full": isFullScreen }'
  v-p-loading="loading"
  element-loading-text="触警处理中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--loading-color-1'"
  id='pParent'
>
  <ol-map
    v-if='isShowMap'
    :key='refreshWarn'
    id="map"
    class="map"
  >
    <Tab :tabNav.sync="tabNav" @handleClick="toControlSet" />
    <div v-show='noCoorIsPack' class='no_coordinate_pack' @click='handleNoCoor(false)'>
      <i class='iconfont icon-shouqi hide_icon' title='展开'></i>
      <div class='tip'>无坐标触警</div>
    </div>
<!--    统计图-->
    <OverviewBar></OverviewBar>
<!--    预警区域-->
    <WarnRegion></WarnRegion>
<!--    溯源-->
<!--    <WarnSource v-if='rightDialogInfo.show' @handleWarnSource='handleWarnSource'></WarnSource>-->
<!--    预警点-->
    <WarnMarker :coordinateList='coordinateList'></WarnMarker>
<!--    预警区域或预警事件弹窗-->
    <MapPop
      :key='refreshMapPop'
      v-if='dialogProps.show'
      :position="dialogProps.position"
      :offset="dialogProps.offset"
      :mapShow="dialogProps.show"
      :needTail='false'
      @close="closeDialog"
    >
      <MapContent
        :currentUnitInfo='currenUnitInfo'
        :pointEventList='pointEventList'
        @dialogClick='dialogClick'
        @closeDialog='closeDialog'
        @handleWarnSource='handleWarnSource'
        @updateCoordinateList='updateCoordinateList'
        @changeLoad='changeLoad'
      ></MapContent>
    </MapPop>
    <div class='full_screen' :class='{ "is_full": isFullScreen }'>
      <i v-show='!isFullScreen' class='iconfont icon-shouqi1' @click='fullScreen(true, 24)' title='全屏'></i>
      <i v-show='isFullScreen' class='iconfont icon-zhankai' @click='fullScreen(false, 56, true)' title='退出全屏'></i>
    </div>
  </ol-map>
<!--  布控设置-->
  <ControlList
    v-else-if='showControlList && !showTriggerList'
    @toControlMap='toControlMap'
  ></ControlList>
<!--  无坐标触警-->
  <VueDraggableResizable
    v-if='isShowMap && !noCoorIsPack'
    ref='dragTable'
    :resizable="false"
    :parent="true"
    :z='100'
    :w='draggableWidth'
    :h='draggableHeight'
    class-name='my_drag_table'
  >
    <NoCoordinateList
      ref='noCoordinate'
      :noCoordinateList='noCoordinateList'
      @handleWarnSource='handleWarnSource'
      @handleCDetail='handleCDetail'
      @handleNoCoor='handleNoCoor'
    ></NoCoordinateList>
  </VueDraggableResizable>

  <div v-if='!showControlList && showNoCDetail && !showTriggerList' class='no_coordinate_detail'>
    <MapContent
      :currentUnitInfo='currenUnitInfo'
      :pointEventList='[currenUnitInfo]'
      :key='refreshMapPop'
      @closeDialog='closeCDetail'
      @handleWarnSource='handleWarnSource'
      @updateNoCoordinateList='updateNoCoordinateList'
      @changeLoad='changeLoad'
    ></MapContent>
  </div>
  <TriggerList
    v-if='showTriggerList'
    :canFastEnToCn='canFastEnToCn'
    :dataEnToCn='dataEnToCn'
    @handleTriggerList='handleTriggerList'
    @handleWarnSource='handleWarnSource'
  ></TriggerList>

  <RightDialog :class='{ "is_full_screen": isFullScreen }' :rightDialog="rightDialogInfo"></RightDialog>

</div>
</template>

<script>
/* eslint-disable */
import OlMap from '@/commons/map/Map'
import Tab from '@/components/BasicComponents/Tab'
import ControlList from './components/control-list'
import OverviewBar from './components/overview-bar'
import WarnRegion from './components/warn-region-map'
import MapPop from '@/components/Map/OfflineMap/MapPop'
import MapContent from './components/map-dialog-content'
// import WarnSource from './components/warn-source'
import NoCoordinateList from './components/no-coordinate-list'
import VueDraggableResizable from 'vue-draggable-resizable'
import WarnMarker from './components/warn-marker-map'
import TriggerList from './components/trigger-list'
import RightDialog from '@/views/common/all-archives/personFileDetail/components/Chart/rightDialog'
import {
  getTriggerMapListApi,
  getFeatureOptionsApi,
  handleTriggerRead
} from '@/api/warnControl.js'
import { getTrackSource } from '@/api/allArchives'
import Mixins from './mixins.js'
import { gps } from '@/utils/resetPosition'
import { mapMutations, mapState } from 'vuex'

const TAB_NAV = {
  list: [
    {
      name: '布控设置'
    }
  ]
}

export default {
  name: 'ControlWarn',
  mixins: [Mixins],
  components: {
    OlMap,
    Tab,
    ControlList,
    OverviewBar,
    WarnRegion,
    MapPop,
    MapContent,
    // WarnSource,
    NoCoordinateList,
    VueDraggableResizable,
    WarnMarker,
    TriggerList,
    RightDialog
  },
  data () {
    return {
      tabNav: Object.freeze(TAB_NAV),
      showControlList: false,
      dialogProps: {
        position: [],
        offset: [0, 0],
        show: false
      },
      isDialogClick: false,
      currenUnitInfo: {},
      currentMapPopType: '',
      pointEventList: [],
      currentPointInd: null,
      // showSource: false,
      showNoCDetail: false,
      draggableWidth: null,
      draggableHeight: null,
      dataEnToCn: {},
      noCoordinateList: [],
      coordinateList: [],
      canFastEnToCn: {},
      refreshMapPop: new Date().getTime(),
      showTriggerList: false,
      loading: false,
      rightDialogInfo: {
        title: '溯源',
        show: false,
        handleClose: this.handleWarnSource,
        loading: false,
        dataSource: '',
        listData: [],
        labelList: [],
      },
      currentSourceId: null,
      refreshWarn: new Date().getTime(),
      noCoorIsPack: false
    }
  },
  computed: {
    ...mapState('Common', {
      iconObj: 'iconObj',
      dataTypeList: 'dataTypeList',
      isFullScreen: 'isFullScreen'
    }),
    ...mapState('User', {
      loginMap:'loginMap',
      tianMapInfo: 'tianMapInfo',
      theme: 'theme'
    }),
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers || []
    },
    isShowMap () {
      return !this.showControlList && !this.showTriggerList
    },
  },
  watch: {
    showControlList: {
      handler (newVal) {
        if (newVal) {
          this.bus.$off('olMapClick', this.MapClick)
        } else {
          this.bus.$on('olMapClick', this.MapClick)
        }
      },
      immediate: true
    },
    dataTypeList: {
      handler (newVal) {
        let result = newVal || []
        result.forEach(item => {
          this.dataEnToCn[item.srcNameEn] = item.srcNameCn
        })
        this.getDataToEn(this.dataEnToCn)
      },
      immediate: true
    },
    isShowMap: {
      handler (newVal) {
        newVal && this.updateNoCoPosition(this.isFullScreen ? 24 : 56)
      }
    }
  },
  mounted () {
    this.bus.$on('showAllTrigger', this.handleTriggerList)
    this.bus.$on('showTriggerInfo', this.showTriggerInfo)
    this.bus.$on('showWarn', this.handleWarnSource)
    if (this.$route.query.showAllTrigger) {
      this.showTriggerList = true
    }
    if (this.$route.query.viewSourceInfo) {
      this.handleWarnSource(true, this.$route.query.viewSourceInfo)
    }
    this.draggableWidth = this.formatPx(692)
    this.draggableHeight = this.formatPx(264)
    this.getFeatureOptions(this.$route.query.goalInfo)
    this.updateNoCoPosition(56)
  },
  methods: {
    ...mapMutations('Common', {
      setIsFullScreen: 'setIsFullScreen'
    }),
    handleNoCoor (bool) {
      this.noCoorIsPack = bool
      if (!bool) this.updateNoCoPosition(56)
    },
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    fullScreen (isFull, noCoRight, isClick) {
      if (isClick) {
        document.exitFullscreen()
      }
      this.setIsFullScreen(isFull)
      this.refreshWarn = new Date().getTime()
      if (isFull) {
        const docElm = document.documentElement
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
          document.addEventListener('fullscreenchange', this.escFullScreen)
        }
      } else {
        document.removeEventListener('fullscreenchange', this.escFullScreen)
      }
      this.updateNoCoPosition(noCoRight)
    },
    escFullScreen () {
      if (!document.fullscreen) {
        this.fullScreen(false, 56)
      }
    },
    updateNoCoPosition (rightPx) {
      this.$nextTick(() => {
        let top = 72 * document.documentElement.style.fontSize.split('px')[0] / 192
        let right = rightPx * document.documentElement.style.fontSize.split('px')[0] / 192
        this.$refs.dragTable.top = top
        this.$refs.dragTable.left = document.getElementById('pParent').clientWidth - this.draggableWidth - right
      })
    },
    handleTriggerList (bool) {
      this.clearWarnInfo()
      this.showTriggerList = bool
    },
    showTriggerInfo (item, needChange) {
      this.showControlList = false
      this.showTriggerList = false
      item.unitType = 'point'
      item.triggerPoliceInfo = (item.contactPolice ? item.contactPolice + '/' : '') + (item.contactPolicePhone || '')
      item.controlInfo = {
        name: item.configVO.name,
        level: item.configVO.level,
        controlTime: this.formatControlTime(item.configVO),
        controlRegion: this.formatControlRegion(item.configVO),
        controlRecord: this.formatControlData(item.configVO)
      }
      item.icon = this.iconObj[item.triggerEntityName]?.icon_path || ''
      item.handleStatus === 'untreated' ? item.flag = true : item.flag = false
      this.closeDialog()
      if (item.latitude && item.longitude) {
        this.closeCDetail()
        let changeLngLat = needChange ? gps.gcj_decrypt(item.longitude, item.latitude) : [item.longitude, item.latitude]
        if (this.loginMap === 'tiandimap' && this.tianMapInfo.extent.length) {
          const extent = this.tianMapInfo.extent
          if (changeLngLat[0] < extent[0] ||
            changeLngLat[0] > extent[2] ||
            changeLngLat[1] < extent[1] ||
            changeLngLat[1] > extent[3]
          ) {
            this.$message.warning('定位地点图层未下载，请下载后重试！')
            return
          }
        }
        setTimeout(() => {
          this.bus.$emit('setViewCenter', {
            position: [changeLngLat[0], changeLngLat[1]],
            zoom: 18,
            isMark: false,
            isPos: false
          })
        }, 300)
      } else {
        this.handleCDetail(item)
      }
    },
    getFeatureOptions (fromListId) {
      getFeatureOptionsApi().then(res => {
        let result = res || []
        result.forEach(item => {
          if (item.labelNameEn) this.canFastEnToCn[item.labelNameEn] = item.labelName || ''
        })
      }).finally(() => {
        this.getTriggerMapList(fromListId)
      })
    },
    getTriggerMapList (fromListId) {
      getTriggerMapListApi().then(res => {
        let result = res || []
        let lngLat = []
        let unReadList = result.filter(item => item.readStatus === 'unread').map(item => item.id)
        if (unReadList.length) {
          let params = new FormData()
          params.append('messageIdList', unReadList)
          handleTriggerRead(params)
        }

        result.forEach(item => {
          item.unitType = 'point'
          item.triggerTrait = item.triggerLabelNameEn === 'avatar_url' && this.canFastEnToCn[item.triggerLabelNameEn] ?
            this.canFastEnToCn[item.triggerLabelNameEn] :
            item.triggerLabelNameEn && this.canFastEnToCn[item.triggerLabelNameEn] ?
              `${this.canFastEnToCn[item.triggerLabelNameEn]}/${item.triggerAttr || ""}` :
              `${item.triggerAttr || ""}`
          item.triggerRecord = this.dataEnToCn[item.triggerDataSource] || ''
          item.triggerPoliceInfo = (item.contactPolice ? item.contactPolice + '/' : '') + (item.contactPolicePhone || '')
          item.controlInfo = {
            name: item.configVO.name,
            level: item.configVO.level,
            controlTime: this.formatControlTime(item.configVO),
            controlRegion: this.formatControlRegion(item.configVO),
            controlRecord: this.formatControlData(item.configVO)
          }
          item.icon = this.iconObj[item.triggerEntityName]?.icon_path || ''
          item.handleStatus === 'untreated' ? item.flag = true : item.flag = false
          if (item.latitude && item.longitude) {
            let changeLngLat = gps.gcj_decrypt(item.longitude, item.latitude)
            item.oldLongitude = item.longitude
            item.oldLatitude = item.latitude
            item.longitude = changeLngLat[0]
            item.latitude = changeLngLat[1]
            let ind = lngLat.findIndex(info => info.latitude === item.latitude && info.longitude === item.longitude)
            if (ind > -1) {
              this.coordinateList[ind].push(item)
            } else {
              this.coordinateList.push([item])
              lngLat.push({
                latitude: item.latitude,
                longitude: item.longitude
              })
            }
          } else {
            this.noCoordinateList.push(item)
          }
        })
        this.coordinateList.forEach(item => {
          let mapId = item.map(point => +point.id)
          item.forEach(point => {
            point['mapId'] = mapId
          })
        })
        if (fromListId) {
          let fromListItem = result.find(item => item.id === +fromListId)
          fromListItem && this.showTriggerInfo(fromListItem)
        }
      })
    },
    toControlSet () {
      this.showControlList = true
      this.clearWarnInfo()
    },
    toControlMap () {
      this.showControlList = false
    },
    MapClick (evt) {
      if (this.isDialogClick) {
        this.isDialogClick = false
        return
      }
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_
      const fun = (dialogH, dialogW) => {
        let popHeight = dialogH
        let popWidth = dialogW
        let touchPointBottom = this.formatPx(this.$store.state.Ol.oMap.getPixelFromCoordinate(this.tianMapInfo.extent.slice(0, 2))[1] - evt.pixel[1])
        let touchPointRight = this.formatPx(this.$store.state.Ol.oMap.getPixelFromCoordinate(this.tianMapInfo.extent.slice(2))[0] - evt.pixel[0])
        if (touchPointBottom > popHeight && touchPointRight > popWidth) {
          this.dialogProps.offset = [0, 0]
        } else if (touchPointBottom > popHeight) {
          this.dialogProps.offset = [-popWidth, 0]
        } else if (touchPointRight > popWidth) {
          this.dialogProps.offset = [0, -popHeight]
        } else {
          this.dialogProps.offset = [-popWidth, -popHeight]
        }
      }
      if (curFeature.name === 'region-warn') {
        if (curFeature.customAttribute.id === this.currenUnitInfo.id && this.currentMapPopType === 'region-warn') return
        // this.currentMarkerInfo = {}
        this.currentMapPopType = 'region-warn'
        this.refreshMapPop = new Date().getTime()
        this.pointEventList = []
        this.currentPointInd = null
        this.currenUnitInfo = curFeature.customAttribute
        this.dialogProps.position = evt.coordinate
        // this.showSource = false
        this.clearWarnInfo()
        if (this.loginMap === 'tiandimap' && this.tianMapInfo.extent.length) {
          let popHeight = this.formatPx(166)
          let popWidth = this.formatPx(450)
          fun(popHeight, popWidth)
        } else {
          this.dialogProps.offset = [0, 0]
        }
        this.dialogProps.show = true
        this.showNoCDetail = false
      } else if (curFeature.name === 'warn_marker') {
        if (curFeature.customAttribute.id === this.currenUnitInfo.id && this.currentMapPopType === 'warn_marker') return
        this.currentMapPopType = 'warn_marker'
        this.refreshMapPop = new Date().getTime()
        this.coordinateList.forEach((item, ind) => {
          let index = item.findIndex(info => curFeature.customAttribute.mapId.includes(+info.id))
          if (index > -1) {
            this.currentPointInd = ind
            this.pointEventList = item
          }
        })
        this.currenUnitInfo = curFeature.customAttribute
        this.dialogProps.position = evt.coordinate
        // this.showSource = false
        this.clearWarnInfo()
        if (this.loginMap === 'tiandimap' && this.tianMapInfo.extent.length) {
          let popHeight = this.pointEventList.length > 1 ? this.formatPx(392) : this.formatPx(340)
          let popWidth = this.formatPx(450)
          fun(popHeight, popWidth)
        } else {
          this.dialogProps.offset = [0, 0]
        }
        this.dialogProps.show = true
        this.showNoCDetail = false
      }
    },
    // 有坐标触警弹窗点击时不触发地图点击
    dialogClick () {
      this.isDialogClick = true
    },
    // 有坐标触警弹窗关闭时
    closeDialog () {
      this.currenUnitInfo = {}
      this.currentMapPopType = ''
      this.isDialogClick = false
      this.pointEventList = []
      this.currentPointInd = null
      this.dialogProps.position = []
      this.dialogProps.show = false
      // this.showSource = false
      this.clearWarnInfo()
    },
    //
    handleWarnSource (bool, info, isNoLngLat) {
      if (bool) {
        if (info.id !== this.currentSourceId) {
          if (isNoLngLat) {
            this.closeDialog()
            this.closeCDetail()
          }
          this.currentSourceId = info.id
          this.rightDialogInfo.loading = true
          this.rightDialogInfo.listData = []
          this.rightDialogInfo.labelList = []
          this.rightDialogInfo.dataSource = info.triggerRecord || '--'
          this.rightDialogInfo.show = true
          let params = {
            attr: info.triggerAttr,
            collectTime: new Date(info.triggerTime).getTime(),
            srcName: info.triggerDataSource,
            srcFieldName: info.triggerSrcFieldName,
            placeAddress: info.triggerAddress,
            latitude: info.oldLatitude || info.latitude,
            longitude: info.oldLongitude || info.longitude,
            odsHash: info.triggerOdsHash
          }
          getTrackSource(params).then(res => { // 溯源接口
            let result = res || {}
            this.rightDialogInfo.listData = result.data || []
            result.fieldList && result.fieldList.forEach(item => {
              if (item.archivesStatus === 'display') {
                this.rightDialogInfo.labelList.push(item)
              }
            })
          }).finally(() => {
            this.rightDialogInfo.loading = false
          })
        }
      } else {
        this.clearWarnInfo()
      }
      // this.showSource = bool
    },

    clearWarnInfo () {
      this.rightDialogInfo = {
        title: '溯源',
        show: false,
        handleClose: this.handleWarnSource,
        loading: false,
        dataSource: '',
        listData: [],
        labelList: []
      }
      this.currentSourceId = null
    },
    // 无坐标触警点击操作按钮
    handleCDetail (info) {
      this.closeDialog()
      this.currenUnitInfo = info
      this.refreshMapPop = new Date().getTime()
      this.showNoCDetail = true
    },
    // 无坐标触警详情弹窗关闭时
    closeCDetail () {
      this.showNoCDetail = false
      this.currenUnitInfo = {}
      // this.showSource = false
      this.clearWarnInfo()
      this.$nextTick(() => {
        this.$refs.noCoordinate.currentDataId = null
      })
    },
    updateCoordinateList (id, handlePoint) {
      if (this.pointEventList.length === 1) {
        let delInd = this.currentPointInd
        this.closeDialog()
        this.coordinateList.splice(delInd, 1)
        this.areaLayers.forEach(item => {
          if (item.get('id') === delInd) {
            this.$store.state.Ol.oMap.removeLayer(item)
          }
        })
      } else {
        this.coordinateList[this.currentPointInd] = this.coordinateList[this.currentPointInd].filter(item => item.id !== id)
        this.pointEventList = this.coordinateList[this.currentPointInd]
        let currentFeature = null
        !handlePoint && (currentFeature = this.areaLayers.find(item => item.get('id') === this.currentPointInd))
        if (!currentFeature) return
        let img = new Image()
        img.src = this.pointEventList[0].icon ?
          `${window.location.origin}/${this.pointEventList[0].icon}` :
          require(`@/assets/img/${this.$themeColor("--atlis-default-img")}.png`)
        img.onload = () => {
          let canvas = document.createElement('canvas')
          let context = canvas.getContext('2d')
          canvas.width = 40
          canvas.height = 40
          context.drawImage(img, 0, 0, 40, 40)
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
          currentFeature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
              img: canvas,
              imgSize: [40, 40]
            }),
            // 文本样式
            text: new ol.style.Text({
              text: this.pointEventList[0].controlInfo.name || null,
              fill: new ol.style.Fill({
                color: this.theme === 'light' ? '#333333' : '#FFFFFF'
              }),
              font: '14px Microsoft YaHei',
              offsetX: 0,
              offsetY: -30,
              padding: [2, 10, 0, 10],
              // 文本填充
              backgroundFill: new ol.style.Fill({
                color: this.theme === 'light' ? '#FFFFFF' : '#394261'
              }),
              backgroundStroke: new ol.style.Stroke({
                color: this.theme === 'light' ? '#D6DDED' : '#545F81',
                width: 2
              })
            })
          }))
        }
      }
    },
    updateNoCoordinateList (id) {
      this.noCoordinateList = this.noCoordinateList.filter(item => item.id !== id)
      this.closeCDetail()
    },
    changeLoad (bool) {
      this.loading = bool
    }
  },
  beforeDestroy () {
    this.bus.$off('olMapClick', this.MapClick)
    this.bus.$off('showAllTrigger', this.handleTriggerList)
    this.bus.$off('showTriggerInfo', this.showTriggerInfo)
    this.bus.$off('showWarn', this.handleWarnSource)
    document.removeEventListener('fullscreenchange', this.escFullScreen)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.control_warn_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 32px 32px;
  &.is_full {
    padding: 0;
  }
  .no_coordinate_detail {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-color-9);
    z-index: 10000;
  }
  //.no_coordinate_detail {
  //  position: absolute;
  //  top: 0;
  //  left: 32px;
  //  width: calc(100% - 32px);
  //  height: calc(100% - 32px);
  //  background: rgba(0, 0, 0, 0.7);
  //  z-index: 1000;
  //}
  .map {
    width: 100%;
    height: 100%;
    position: relative;
  }
  /deep/.Tabs {
    right: 24px;
    .right_route {
      text-align: left;
      padding-left: 20px;
      line-height: 30px;
      box-sizing: border-box;
    }
  }
  /deep/.map-popup-all {
    background: var(--control-map-dialog-bg);
    padding: 0;
  }
}
.my_drag_table {
  position: absolute;
  top: 0;
  left: 0;
}
.full_screen {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 20;
  &.is_full {
    top: 0;
  }
  i {
    font-size: 24px;
    line-height: 24px;
    color: var(--base-text-color-to-666666);
    cursor: pointer;
  }
}
/deep/.rightDialog {
  top: 76px;
  right: 56px;
  background: var(--bg-color-2);
  box-shadow: var(--warn-trace-source-box-shadow);
  // z-index: 10000;
}
/deep/.rightDialog .main .main-content .el-descriptions__body {
  background: var(--bg-color-9);
}
.is_full_screen {
  right: 24px;
}
.no_coordinate_pack {
  position: absolute;
  top: 62px;
  right: 24px;
  display: flex;
  flex-wrap: nowrap;
  padding: 16px;
  background: var(--bg-color-9);
  z-index: 10;
  cursor: pointer;
  .tip {
    font-size: 18px;
    line-height: 24px;
    margin-left: 16px;
    white-space: nowrap;
    color: var(--base-text-color-1);
  }
  i {
    font-size: 24px;
    line-height: 24px;
    color: var(--base-text-color-to-666666);
  }
}
</style>
