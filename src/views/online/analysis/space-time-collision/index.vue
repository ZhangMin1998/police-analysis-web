<template>
  <div class="map_con">
    <amap :center="center" :isRoom="false" ref="amap">
      <panel
        ref='panel'
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
        @handleSingleChecked="handleSingleChecked"
      />

      <!-- 面板 -->
      <popover v-if="isResult" @beforeClose="closeResult">
        <template v-slot:title>
          <list-title :title="'碰撞结果'"></list-title>
        </template>
        <CollisionPop :caselist="caseIdList" :resultData='resultData' />
      </popover>

      <!-- 地图相关 -->
      <pinMarker @pinMap="pinMap" />
      <opera />

      <!-- 地上标注点 -->
      <CountMarker :list="markerList" @clickMarker="clickMCountMarker" />
      <!-- 控件 -->
      <map-control :list="iconMiniData" />
      <CateNav @shiftSelect="shiftSelect" />
      <!-- 覆盖物 -->
      <template v-if="roomDeviceList.length > 0">
        <device-overlay-choose
          ref="deviceRef"
          :markerList="roomDeviceList"
          @clickCluster="clickCluster"
          @clickMarker="clickMarker"
        ></device-overlay-choose>
      </template>
      <ProgressBox
        title="数据分析中..."
        :sonHasCancel="false"
        :addJob="true"
        :show.sync="isSubmiting"
        @handleAddJob="handleAddJob"
      />
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'

import { mapState, mapActions, mapMutations } from 'vuex'
import Panel from '@/views/offline/analysis/space-time-collision/components/panel'
import CasePanel from '@/views/offline/analysis/space-time-collision/components/casePanel'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import Popover from '@/components/Map/CommonMap/Analysis/popover'
import CollisionPop from '@/views/offline/analysis/space-time-collision/components/collisionPop'
import pinMarker from '@/components/Map/CommonMap/MarkerLocation'
import CountMarker from '@/components/Map/OnlineMap/count-marker'
import { delCase, querySpaceCrash, spaceCrashAddTask } from '@/api/analysis'
import CateNav from './components/CateNav'
import DeviceOverlayChoose from '_com/deviceMap/deviceOverlayChoose'
import ProgressBox from '@/components/VisualComponents/Form/progressBox'

const MODE_ENUMS = [0, 1, 2] // 0 正常模式 1 点击模式 2 框选模式

export default {
  mixins: [AmapMixins],
  components: {
    Panel,
    Opera,
    CateNav,
    CasePanel,
    pinMarker,
    CountMarker,
    Popover,
    CollisionPop,
    DeviceOverlayChoose,
    ProgressBox
  },
  provide: function () {
    return {
      HighlightDevice: this.HighlightDevice
    }
  },

  data () {
    return {
      resultData: {},
      editId: '',
      caseIdList: [], //碰撞列表id
      isSubmiting: false,
      isShow: false, //新建 案件
      iconMiniData: [
        { type: 'wifi', text: '公共场所上网审计', url: 'icon-tab-small-1.png' },
        { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-small-3.png' },
        { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-small-4.png' },
        { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-small-5.png' },
        { type: 'wifi', text: '人脸门禁', url: 'icon-tab-small-6.png' },
        { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-small-7.png' },
        { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-small-8.png' },
        { type: 'wifi', text: '其他', url: 'icon-tab-small-9.png' },
        { type: 'wifi', text: '复合图标', url: 'icon-tab-small-10.png' },
        { type: 'wifi', text: '场所', url: 'icon-tab-small-11.png' }
      ],
      markerList: [], // 标注集合
      markerMode: MODE_ENUMS[0], // 0 正常模式 1 点击模式 2 框选模式
      time: null
    }
  },

  computed: {
    ...mapState('Map', {
      roomDeviceList: 'roomDeviceList'
    }),
    ...mapState('analysisJudgement', {
      isResult: 'isResult',
      caseList: 'caseList',
      isNotice: 'isNotice'
    })
  },

  watch: {
    markerMode: function (val) {
      // 监听 地图单选还是框选]
      val === MODE_ENUMS[2] ? this.$refs['amap'].drawPolyLine() : this.$refs['amap'].closePolyLine()
    },
    caseList: function () {
      this.formatCaseList(this.caseList)
    },
    isNotice: function (val) {
      if (val) {
        this.isShow = false
      }
    }
  },

  methods: {
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList'
    }),
    ...mapMutations('DataCenter', {
      setJobPanelShow: 'setJobPanelShow'
    }),
    // 多选框 change
    handleChecked () {
      // this.HighlightDevice(deviceIdList)
    },
    /**
     * 点击选择模式事件
     * val 1 单选 2 框选
     */
    selectModeChange (val) {
      if (val == 2) {
        this.markerMode = MODE_ENUMS[2]
      } else {
        this.markerMode = MODE_ENUMS[1]
      }
    },
    // 重新渲染高亮得设备
    HighlightDevice () {
      // const params = {
      //   status: true,
      //   id: deviceIdList
      // }
      // this.handleSingleChecked(params)
    },
    // 新建 案件 新建 取消按钮
    beforeCloseCase (editId) {
      //编辑取消
      if (!editId) {
        this.markerList.pop()
      }
      this.hideCasePanel()
      this.markerMode = MODE_ENUMS[0] // 恢复正常模式
    },
    // 点击消息列表案发item
    clickCrime (e) {
      this.bus.$emit('device_setCenter', [e.longitude, e.latitude])
    },
    // 案发点列表 -> 删除
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
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 案发点列表 -> 编辑
    panelEditCase (e) {
      if (this.isShow) {
        this.$messageTip.error('请先关闭新建案发点弹窗再进行编辑操作！')
        return false
      }
      this.editId = e
      this.showCasePanel()
    },
    /**
     * 碰撞结果弹窗 -> 关闭
     */
    closeResult () {
      // 隐藏 碰撞结果
      this.$store.state.analysisJudgement.isResult = false
      // 显示 消息面板
      this.$store.state.analysisJudgement.isNotice = 'trans'

      this.isShow = false
    },
    // 碰撞成功后
    collisionEvent (caseIdList) {
      // 碰撞 案发点列表 id 数组
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
      // 隐藏 新建案件面板
      // this.isShow = false
      // 显示结果面板
      // this.$store.state.analysisJudgement.isResult = true
      // 关闭 消息面板
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
    /**
     * 新建案件弹窗 -> 显示
     */
    showCasePanel () {
      this.isShow = true
      this.$store.state.analysisJudgement.isResult = false
      this.$store.state.analysisJudgement.isNotice = ''
    },
    /**
     * 新建案件弹窗 -> 隐藏
     */
    hideCasePanel () {
      this.editId = 0
      this.isShow = false
      this.$store.state.analysisJudgement.isNotice = 'trans'
    },
    obtainOriginDevList () {
      if (this.noClickNav) {
        this.$store.state.Map.noClickNav = false
      }
    },
    /**
     * 标记案发地点
     */
    pinMap (e) {
      this.markerList.push([e.lng, e.lat])
      this.markerMode = MODE_ENUMS[1]
      this.$store.state.analysisJudgement.isNotice = ''
      this.showCasePanel()
    },
    clickMCountMarker () {},
    /**
     * 点击标注
     */
    clickMarker (item) {
      if (this.markerMode !== MODE_ENUMS[1]) return
      const curMarker = item.target
      const extData = curMarker.getExtData()
      curMarker.setExtData({
        ...extData,
        isActive: !extData.isActive
      })
      this.reRenderMarker(curMarker)
      this.syncCheckBox(curMarker.getExtData())
    },
    /**
     * 更新当前标注
     */
    reRenderMarker (marker) {
      const markerExtData = marker.getExtData()
      const newCls = this.calcClass(markerExtData.deviceType, markerExtData.isActive)
      marker.setContent(`<div class="${newCls} icon-img-box"></div>`)
    },
    /**
     * 根据 type 和 isActive 计算对应标注样式
     */
    calcClass (type, isActive) {
      const pre = 'icon-small'
      if (type < 1 || type > 8) type = 1
      return isActive ? `${pre}-${type}` : `${pre}-${type}-g`
    },
    /**
     * 点击聚合 - 选择当前聚合下的设备
     * 仅在 单选模式下生效
     */
    clickCluster (cluster) {
      if (this.markerMode !== MODE_ENUMS[1]) return // 获取列表
      const curMarkerList = cluster.markers
      const curMarkerListData = curMarkerList.map(marker => marker.getExtData())
      const isAllHighlisth = curMarkerListData.every(marker => marker.isActive)
      curMarkerList.forEach(marker => {
        marker.setExtData({
          ...marker.getExtData(),
          isActive: !isAllHighlisth
        })
        this.reRenderMarker(marker)
        this.syncCheckBox(marker.getExtData())
      })
    },
    /**
     * 根据 marker 状态 同步多选框数据
     */
    syncCheckBox ({ id, isActive, deviceName }) {
      if (isActive)
        this.$refs.casePanelRef.addCheckBox({
          name: deviceName,
          id
        })
      else this.$refs.casePanelRef.delCheckBox({ id })
    },
    /**
     * 单个点击 checkbox 找到对应的marker,设置样式并退出
     */
    handleSingleChecked ({ status, id }) {
      const list = this.$refs['deviceRef'].markerDomList
      let ids = [...id]
      let len = list.length
      for (let i = 0; i < len; i++) {
        const curData = list[i].getExtData()
        if (ids.includes(curData.id)) {
          list[i].setExtData({
            ...curData,
            isActive: status
          })
          this.reRenderMarker(list[i], list[i].getExtData())
          return
        }
      }
    },
    /**
     * 点击分类
     * @param {ojbect} { index, status }  index 和 设备类型一致，status 代表是否高亮
     */
    shiftSelect ({ index, status }) {
      const deviceRef = this.$refs['deviceRef'] // 组件实例
      if (!deviceRef) return
      const handleData = deviceRef.markerMap[index]
      if (!handleData) return
      const handleCluster = deviceRef.cluster
      status ? handleCluster.addMarkers(handleData) : handleCluster.removeMarkers(handleData)
    },
    // 格式化 caseList
    formatCaseList (list) {
      this.markerList = list.map(item => [item.longitude, item.latitude])
    },
    // 判断点是否在矩形内
    judgeIsInner (point, path) {
      /* eslint-disable */
      return AMap.GeometryUtil.isPointInRing(point, path)
      /* eslint-enable */
    },
    drawComplete ({ obj, data }) {
      console.log(obj)
      this.$refs['deviceRef'].markerDomList.forEach(device => {
        const re = this.judgeIsInner(device.getPosition(), data)
        if (re) {
          const curData = device.getExtData()
          device.setExtData({
            ...curData,
            isActive: !curData.isActive
          })
          this.reRenderMarker(device)
          this.syncCheckBox(device.getExtData())
        }
      })
    }
  },
  created () {
    this.$store.dispatch('analysisJudgement/queryCase')
    this.bus.$on('drawRectangle', this.drawComplete)
    this.getDeviceList()
    this.$once('hook:beforeDestroy', () => {
      this.$store.state.analysisJudgement.isResult = false
      this.bus.$off('drawRectangle')
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
            this.isShow = false
            // 显示结果面板
            this.$store.state.analysisJudgement.isResult = true
            // 关闭 消息面板
            this.$store.state.analysisJudgement.isNotice = ''
          })
        }
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.caseList.length > 0 && this.formatCaseList(this.caseList)
    }, 500)
  },
  beforeDestroy () {
    this.time && clearTimeout(this.time)
  }
}
</script>

<style lang="less" scoped>
.po {
  position: relative;
  height: 98%;
}
</style>
