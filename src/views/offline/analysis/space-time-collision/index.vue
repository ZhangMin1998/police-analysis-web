<template>
  <div class="map_con" v-loading="loadingKey" element-loading-background="rgba(36, 47, 70, .7)">
    <ol-map id="map" class="map" :style="curStyle">
      <panel
        ref="panel"
        @submit="collisionEvent"
        @deleteMarker="panelDelete"
        @editCase="panelEditCase"
        @clickCrime="clickCrime"
      />
      <case-panel
        ref="casePanelRef"
        :list="markerList"
        v-if="isShow"
        @beforeCloseCase="beforeCloseCase"
        :editId="editId"
        @handleChecked="handleChecked"
        @selectModeChange="selectModeChange"
      />
      <!-- </div> -->
      <pinMarker @pinMap="pinMap" :isClick="!isShow" />
      <!-- 地址信息 -->
      <opera />
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
      <!-- 切换数据种类  下中部分 -->
      <device-list-nav :showroom="false"></device-list-nav>
      <!-- 聚合 -->
      <!-- 设备 -->
      <!-- <MapCluster
        :isMarker="true"
        layerName="device"
        v-if="isShowDevice"
        :key="comKey"
        :list="renderDeviceList"
        :imgMap="imgMap"

        @chooseDevice="chooseDevice"
      /> -->
      <!-- 场所 -->
      <MapCluster
        layerName="site"
        key="site"
        :list="siteList"
        :imgMap="imgMap"
        :imgUrl="siteUrl"
      />

      <!-- 地上标注点 -->
      <CountMarker
        v-if="markerList.length > 0"
        :list="markerList"
        @clickMarker="clickMCountMarker"
      />
      <!-- 框选功能 -->
      <SelectPolygon :open="isShow && isSelect" @selectEnd="selectEnd" />
      <!-- 弹窗 -->
      <!-- hover弹窗 -->
      <!-- <hover-popup key="hover" /> -->
      <popover v-if="isResult" @beforeClose="closeResult">
        <template v-slot:title>
          <list-title :title="'碰撞结果'"></list-title>
        </template>
        <CollisionPop :caselist="caseIdList" :resultData="resultData" :typeList="typeList" />
      </popover>
      <ProgressBox
        title="数据分析中..."
        :sonHasCancel="false"
        :addJob="true"
        :show.sync="isSubmiting"
        @handleAddJob="handleAddJob"
      />
    </ol-map>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import OlMap from '@/commons/map/Map'
// import HoverPopup from '_com/map/popup/hover'
import MapControl from '_com/map/map-control'
import DeviceListNav from '_com/deviceMap/tabNav'
import MapCluster from '_com/map/cluster'
import Panel from '@/views/offline/analysis/space-time-collision/components/panel'
import CasePanel from '@/views/offline/analysis/space-time-collision/components/casePanel'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import Popover from '@/components/Map/CommonMap/Analysis/popover'
import CollisionPop from '@/views/offline/analysis/space-time-collision/components/collisionPop'
import pinMarker from '@/components/Map/CommonMap/MarkerLocation'
import CountMarker from '@/components/Map/OfflineMap/marker'
import { delCase, querySpaceCrash, spaceCrashAddTask, getCollisionAttrTypes } from '@/api/analysis'
import SelectPolygon from '@/components/Map/OfflineMap/polygon/select'
import ProgressBox from '@/components/VisualComponents/Form/progressBox'
import { gps } from '@/utils/resetPosition'
const { _pos } = require('@/config/user.js')

export default {
  name: 'SpaceTimeCollision',
  data () {
    return {
      isSubmiting: false,
      resultData: {},
      comKey: 0,
      renderDeviceList: [], // 真正渲染设备列表
      isShow: false, //新建 案件
      curStyle: 'height:100%',
      iconMiniData: [],
      markerList: [], // 标注集合
      caseIdList: [], //碰撞列表id
      editId: '',
      loadingKey: false,
      isSelect: false, // 是否框选
      time: null,
      siteList: [], // 场所列表
      siteUrl: '', // 场所图片路径
      typeList: [], // 碰撞后的选择框的下拉列表
    }
  },
  components: {
    // HoverPopup,
    Popover,
    CollisionPop,
    OlMap,
    Panel,
    Opera,
    MapControl,
    MapCluster,
    DeviceListNav,
    CasePanel,
    pinMarker,
    CountMarker,
    SelectPolygon,
    ProgressBox
  },
  computed: {
    ...mapState('Ol', {
      imgMap: 'imgMap',
      deviceFeatures: 'deviceFeatures'
    }),
    ...mapState('Map', {
      roomListData: 'roomListData',//场所数据
      roomDeviceList: 'roomDeviceList',
      deviceIconShow: 'deviceIconShow',
      isShowDevice: 'isShowDevice',
      isNotice: 'isNotice'
    }),
    ...mapState('analysisJudgement', {
      isResult: 'isResult',
      caseList: 'caseList'
    }),
    ...mapState('User', {
      theme: 'theme'
    })
  },
  watch: {
    // 点击 不同的 设备icon 显示不同的 设备标注
    deviceIconShow: {
      handler: function () {
        // const activeList = this.deviceIconShow.map((_c, i) => _c && i + 1).filter(_c => _c)
        const activeList = this.deviceIconShow.map((_c, i) => {
          if (i <= 0) {
            return _c && i + 1
          } else {
            return _c && i + 2
          }
        }).filter(_c => _c)
        // console.log(activeList);
        // console.log(this.deviceList);
        this.renderDeviceList = this.deviceList.filter(item => {
          const type = item.deviceType ? Number(item.deviceType) : 1
          const flag = activeList.includes(type)
          return flag
        })
      }
    },
    caseList: {
      handler: function (val) {
        if (!val) return
        this.markerList = [...val]
      }
    },
    isNotice: function (val) {
      if (val) {
        this.isShow = false
      }
    },
    theme: {
      handler (val) {
        if (val === 'light') {
          this.iconMiniData =  [
            {
              type: 'wifi',
              text: '公共场所上网审计',
              url: 'icon-tab-small-light-1.png'
            },
            { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-small-light-3.png' },
            { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-small-light-4.png' },
            { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-small-light-5.png' },
            { type: 'wifi', text: '人脸门禁', url: 'icon-tab-small-light-6.png' },
            { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-small-light-7.png' },
            { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-small-light-8.png' },
            { type: 'wifi', text: '其他', url: 'icon-tab-small-light-9.png' },
            { type: 'wifi', text: '场所', url: 'icon-tab-small-light-11.png' }
          ]
          this.siteUrl = 'icon-tab-small-light-11.png'
        } else {
          this.iconMiniData =  [
            {
              type: 'wifi',
              text: '公共场所上网审计',
              url: 'icon-tab-small-1.png'
            },
            { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-small-3.png' },
            { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-small-4.png' },
            { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-small-5.png' },
            { type: 'wifi', text: '人脸门禁', url: 'icon-tab-small-6.png' },
            { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-small-7.png' },
            { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-small-8.png' },
            { type: 'wifi', text: '其他', url: 'icon-tab-small-9.png' },
            { type: 'wifi', text: '场所', url: 'icon-tab-small-11.png' }
          ]
          this.siteUrl = 'icon-tab-small-11.png'
        }
      },
      immediate: true
    }
  },
  created () {
    this.$store.dispatch('analysisJudgement/queryCase')
    this.initData()
    this.bus.$on('clickMarker', this.clickMarker)

    this.$once('hook:beforeDestroy', () => {
      // this.bus.$off('clickMarker')
      this.$store.state.analysisJudgement.isResult = false
    })
    if (this.$route.query && this.$route.query.keyList) {
      let result = JSON.parse(this.$route.query.keyList)
      if (result.length) {
        let index = result.findIndex(item => item.ename + '' === 'case_id_list')
        if (index > -1) {
          let caseId = result[index].value
          querySpaceCrash({
            page_num: 1,
            page_size: 5,
            attr_type: '',
            case_id_bunch: caseId
          }).then(res => {
            this.caseIdList = []
            result[index].value.split(',').forEach(item => {
              let index = this.caseList.findIndex(opt => +opt.id === +item)
              if (index !== -1) {
                this.caseIdList.push({
                  id: item,
                  caseName: this.caseList[index].caseName
                })
              }
            })
            this.resultData = res
            // 显示结果面板 关闭新建案件面板
            this.hideCasePanel()
            this.$store.state.analysisJudgement.isResult = true
            // 关闭 消息面板
            this.$store.state.analysisJudgement.isNotice = ''
          })
        }
      }
    }
  },
  provide: function () {
    return {
      HighlightDevice: this.HighlightDevice
    }
  },
  methods: {
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList',
      getRoomList: 'getRoomList'
    }),
    ...mapMutations('DataCenter', {
      setJobPanelShow: 'setJobPanelShow'
    }),
    // 多选框 change
    handleChecked (deviceIdList) {
      console.log(deviceIdList);
      // this.HighlightDevice(deviceIdList)
    },
    // 重新渲染高亮得设备
    HighlightDevice () {
      this.renderDeviceList.forEach(() => {
        // let index = deviceIdList.indexOf(element.id)
        // if (index != -1) {
        //   this.$set(this.renderDeviceList[idx], 'isActive', true)
        // } else {
        //   this.$set(this.renderDeviceList[idx], 'isActive', false)
        // }
      })
      this.comKey += 1
    },
    // closeHighlightDevice () {
    //   this.renderDeviceList.forEach((element, idx) => {
    //     // this.$set(this.renderDeviceList[idx], 'isActive', false)
    //   })
    //   this.comKey += 1
    // },
    // 新建 案件 新建 取消按钮
    beforeCloseCase (editId) {
      // this.closeHighlightDevice()
      //编辑取消
      if (editId) {
        this.hideCasePanel()
      } else {
        //新建的取消
        this.hideCasePanel()
        this.markerList.pop()
      }
      this.isSelect = false
    },
    // 点击消息列表案发item
    clickCrime (e) {
      let position = gps.GcjWGSConversion({
        Lon: e.longitude,
        Lat: e.latitude,
        type: 2
      })
      this.bus.$emit('setViewCenter', {
        position: [position.longitude, position.latitude],
        zoom: 17,
        isMark: false
      })
    },
    // 删除单个案件 相对应删除地图marker
    panelDelete (e) {
      if (this.isShow) {
        this.$messageTip.error('请先关闭案发点弹窗再进行删除操作！')
        return false
      }
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          delCase(e)
            .then(() => {
              this.$messageTip.success('删除成功！')
              this.$store.dispatch('analysisJudgement/queryCase')
            })
            .catch(() => { })
        })
        .catch(() => { })
    },
    panelEditCase (e) {
      if (this.isShow) {
        this.$messageTip.error('请先关闭新建案发点弹窗再进行编辑操作！')
        return false
      }
      this.editId = e
      this.showCasePanel()
    },
    // 关闭碰撞结果
    closeResult () {
      this.$store.state.analysisJudgement.isResult = false
      // 显示 消息面板
      this.$store.state.analysisJudgement.isNotice = 'trans'
    },
    // 碰撞成功后
    collisionEvent (caseIdList) {
      this.caseIdList = caseIdList
      let params = {
        page_num: 1,
        page_size: 5,
        attr_type: ''
      }
      params.case_id_bunch = caseIdList.map(item => {
        return item.id
      }).join(',')
      this.isSubmiting = true
      this.getResultData(params)
      // 显示结果面板 关闭新建案件面板
      // this.hideCasePanel()
      // this.$store.state.analysisJudgement.isResult = true
      // // 关闭 消息面板
      // this.$store.state.analysisJudgement.isNotice = ''
    },
    getResultData (params) {
      querySpaceCrash(params).then(res => {
        let result = res
        if (result.code && +result.code === 2) {
          if (!result.data.intask) {
            this.time && clearTimeout(this.time)
            this.time = setTimeout(() => {
              this.getResultData(params)
            }, 5000)
          } else {
            this.$refs.panel.cancelSbmit()
            this.isSubmiting = false
            this.$message(result.msg)
          }
        } else {
          this.resultData = res
          this.$refs.panel.cancelSbmit()
          this.isSubmiting = false
          this.isShow = false
          // 显示结果面板
          this.$store.state.analysisJudgement.isResult = true
          // 关闭 消息面板
          this.$store.state.analysisJudgement.isNotice = ''
        }
      }).catch(() => {
        this.$refs.panel.cancelSbmit()
        this.isSubmiting = false
      })
    },
    handleAddJob () {
      if (this.time) {
        clearTimeout(this.time)
      }
      let params = {
        page_num: 1,
        page_size: 5,
        user_id: localStorage.getItem('personId')
      }
      params.case_id_bunch = this.caseIdList.map(item => {
        return item.id
      }).join(',')
      spaceCrashAddTask(params).then(() => {
        this.$refs.panel.cancelSbmit()
        this.setJobPanelShow(true)
      }).finally(() => {
        this.$refs.panel.cancelSbmit()
        this.isSubmiting = false
      })
    },
    // 加载设备和场所数据
    initData () {
      this.getDeviceList().then(res => {
        if (res) {
          const list = res.map(item => {
            // item.position = [(lon += 0.005), lat]
            item.position = _pos(item.longitude, item.latitude)
            item.deviceType = item.deviceType || 1
            return item
          })
          // console.log(list);
          this.deviceList = list // 源数据
          this.renderDeviceList = list // 渲染数据
        } else {
          this.deviceList = JSON.parse(JSON.stringify(this.roomDeviceList))
          this.renderDeviceList = JSON.parse(JSON.stringify(this.roomDeviceList))
        }
        this.isLoadingDev = true
      })
      this.getRoomList().then(res => {
        if (res) {
          this.siteList = this.roomListData
        } else {
          this.siteList = this.roomListData
        }
      })
      this.siteList = this.roomListData
      // console.log(this.siteList)
      this.markerList = [...this.caseList]

      // 查询碰撞后的选择框的下拉列表
      getCollisionAttrTypes().then(res => {
        // console.log(res)
        this.typeList = res
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    showCasePanel () {
      this.isShow = true
      this.$store.state.analysisJudgement.isResult = false
      this.$store.state.analysisJudgement.isNotice = ''
    },
    hideCasePanel () {
      this.editId = 0
      this.isShow = false
      this.$store.state.analysisJudgement.isNotice = 'trans'
      this.$store.state.analysisJudgement.isResult = false
    },
    // 标注地图
    pinMap (e) {
      this.markerList.push(e)
      this.$store.state.analysisJudgement.isNotice = ''
      this.showCasePanel()
    },
    // 点击 案发 标注
    clickMCountMarker (feature) {
      this.bus.$emit('scoll', feature.index)
    },
    // 点击 设备 标注
    clickMarker (feature) {
      let curFe = feature.get('features')[0]
      // console.log(this.isShow);
      if (!this.isShow) return false
      // curFe.set('isActive', !curFe.get('isActive'))
      // const isSelected = !curFe.get('isActive') ? '-grey' : ''
      this.syncCheckBox(curFe)
    },
    /**
     * 框选完毕后事件
     * feature.intersectsCoordinate 判断坐标是否在矩形内
     */
    selectEnd (Allfeature) {
      // console.log(feature);
      this.loadingKey = true
      setTimeout(() => {
        // console.log(this.renderDeviceList);
        //  console.log(this.deviceFeatures);
        // this.renderDeviceList.forEach((item, idx) => {
        //   if (feature.intersectsCoordinate(item.position)) {
        //     const curFeature = this.deviceFeatures[idx]
        //     curFeature.set('isActive', !curFeature.get('isActive'))
        //     console.log(curFeature);
        //     this.syncCheckBox(curFeature)
        //   }
        // })
        // console.log(Allfeature);
        Allfeature.forEach((curFeature)=>{
          // curFeature.set('isActive', !curFeature.get('isActive'))
          this.syncCheckBox(curFeature)
        })
        this.loadingKey = false
      }, 200)
    },
    /**
     * 根据 feature状态 同步多选框数据
     */
    syncCheckBox (feature) {
      const id = feature.get('id')
      // if (feature.get('isActive')) {
      this.$refs.casePanelRef.addCheckBox({
        // name: feature.get('deviceName'), // 设备名称
        name: feature.get('siteAddress'),
        id
      })
      // console.log(id);
      // } else {
      // this.$refs.casePanelRef.delCheckBox({ id })
      // }
    },
    /**
     * 点击选择模式事件
     * val 1 单选 2 框选
     */
    selectModeChange (val) {
      if (val == 2) {
        this.isSelect = true
      } else {
        this.isSelect = false
      }
    },
    chooseDevice (features) {
      this.loadingKey = true
      // if (this.isSelect)
      if (!this.isShow || this.isSelect) {
        this.loadingKey = false
        return
      }
      setTimeout(() => {
        features.forEach((feature) => {
          // feature.set('isActive', !feature.get('isActive'))
          this.syncCheckBox(feature)
          this.loadingKey = false
        })
      }, 200)
    }
  },
  beforeDestroy () {
    this.time && clearTimeout(this.time)
  }
}
</script>

<style scoped>
.map >>> .ol-overlaycontainer,
.map >>> .ol-overlaycontainer-stopevent {
  width: auto !important;
  height: auto !important;
}
</style>
