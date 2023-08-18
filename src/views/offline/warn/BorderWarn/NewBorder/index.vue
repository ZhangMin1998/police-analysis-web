<template>
  <div class="map_con">
    <ol-map id="map" class="map" style="height: 100%">
      <header>
        <list-title :title="ID ? '编辑边界' : '新建边界'"></list-title>

        <div @click="$router.push({ name: 'BorderWarn' })">
          <!-- <nav-title title="边界防控"></nav-title> -->
          <BackPrevious></BackPrevious>
        </div>
      </header>
      <!-- 图标控件 -->
      <map-control :list="iconMiniData" />

      <!-- 消息面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '64px', height: '90%' }"
        width="424px"
        oldLeft="10px"
        moveLeft="-424px"
        @handleClick="DrawerHandleClick"
      >
        <template v:slot>
          <div :class="{ mode: personnelDrawer.isShow }">
            <Steps :list="stepList" @expend="handleExpend">
              <!-- 基本信息 -->
              <template v-slot:step_content0>
                <BasicInformation ref="BasicInformation"></BasicInformation>
              </template>

              <!-- 防控人群 -->
              <template v-slot:step_content1>
                <WarnCrowd
                  ref="WarnCrowd"
                  :idsStr="idsStr"
                  :warnPersonList="personList"
                  @selectPersonnel="selectPersonnel"
                  @handleDelete="handleDelete"
                  @selectPerson="selectPerson"
                ></WarnCrowd>
              </template>

              <!-- 区域范围 -->
              <template v-slot:step_content2>
                <PickArea
                  :isActive.sync="isSelect"
                  :btnList="btnList"
                  :deviceList="deviceList"
                  :pagerParams="devicePageParams"
                  @changeDrawer="changeDrawer"
                  @handleCurrentChange="handleCurrentChange"
                ></PickArea>
              </template>
            </Steps>
          </div>
        </template>
      </drawer>

      <drawer
        :drawer.sync="personnelDrawer"
        :cusStyle="{ top: '64px', height: '90%' }"
        :canTraction="false"
        oldLeft="440px"
        moveLeft="-485px"
        width="485px"
      >
        <CusTitle title="防控人群-指定人员选择"></CusTitle>

        <PersonnelTable
          v-if="personnelDrawer.isShow"
          :checkedList="checkedList"
          @handleSubmit="handleSubmitPersonnel"
          @handleClose="personnelDrawer.isShow = false"
        ></PersonnelTable>
      </drawer>

      <DrawPolygon :open="isSelect" shape="Polygon" @selectEnd="selectEnd"></DrawPolygon>

      <MapPolygon
        :pointList="mapPolygonData.pointlist"
        :fillColor="mapPolygonData.fillColor"
        :lineColor="mapPolygonData.lineColor"
        :lineWidth="mapPolygonData.lineWidth"
        :lineDash="mapPolygonData.lineDash"
        :elementName="mapPolygonData.elementName"
        :className="mapPolygonData.className"
        :customAttribute="{ id: 'mapPolygonMine' }"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in outerArea"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor.sync="mapPolygonDataOuter.fillColor"
        :lineColor.sync="mapPolygonDataOuter.lineColor"
        :lineWidth="mapPolygonDataOuter.lineWidth"
        :lineDash="mapPolygonDataOuter.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
        :zIndex="50"
      ></MapPolygon>

      <MapPolygon
        v-for="(item, index) in innerArea"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor.sync="mapPolygonDataInner.fillColor"
        :lineColor.sync="mapPolygonDataInner.lineColor"
        :lineWidth="mapPolygonDataInner.lineWidth"
        :lineDash="mapPolygonDataInner.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in oldAreaList"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor.sync="drawMapPolygonData.fillColor"
        :lineColor.sync="drawMapPolygonData.lineColor"
        :lineWidth="drawMapPolygonData.lineWidth"
        :lineDash="drawMapPolygonData.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
      ></MapPolygon>

      <!-- 设备 -->
      <MapCluster
        v-if="isLoadingDev"
        layerName="device"
        :list="renderDeviceList"
        :imgMap="imgMap"
      />

      <!-- 弹窗 -->
      <Popup
        key="overlay"
        @showCallback="clickMarker"
        @cancelCallback="clickMarkerOutside"
        @handleClickAggregate="handleClickAggregate"
      />

      <!-- hover弹窗 -->
      <hover-popup key="hover" />

      <Opera :curStyle="{ top: '70px' }"></Opera>
    </ol-map>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import { gps } from '@/utils/resetPosition'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'

import BasicInformation from '@/views/common/warn/BorderWarn/NewBorder/BasicInformation'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
import PickArea from '@/views/common/warn/BorderWarn/NewBorder/PickArea'
import Steps from '@/views/common/warn/components/Steps'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import Popup from '_com/map/popup'
import HoverPopup from '_com/map/popup/hover'
import DrawPolygon from '@/components/Map/OfflineMap/MapPolygon/DrawPolygon'
import MapPolygon from '@/components/Map/OfflineMap/MapPolygon'
import MapCluster from '_com/map/cluster'
const { _pos } = require('@/config/user.js')

import {
  insertWarnArea,
  updateWarnArea,
  queryImportantRuleById as queryInfoByid,
  queryBoundaryPlaceAndDevice,
  queryAllBorderArea
} from '@/api/warn'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [mapMixin],
  components: {
    Drawer,
    Steps,
    BasicInformation,
    WarnCrowd,
    PickArea,
    PersonnelTable,
    DrawPolygon,
    MapPolygon,
    Opera,
    MapCluster,
    Popup,
    HoverPopup
  },
  data () {
    return {
      isLoadingDev: false,
      renderDeviceList: [],
      deviceList: [],
      devicePageParams: {
        pageNum: 1,
        pageSize: 8,
        points: [],
        curPage: 1,
        total: 0,
        isLoading: false
      },
      oldAreaList: [],
      curInfo: {},
      btnList: [
        {
          text: '确定',
          type: 'button',
          loading: false,
          event: this.handleSubmit
        }
      ],

      // 用户绘画 - 多边形图层数据
      drawMapPolygonData: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(170, 204, 231,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 1, // 多边形线s条宽度 Number，非必须，默认为 2
        lineDash: [15] // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
      },
      // 用户绘画 - 多边形图层数据
      mapPolygonData: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(24, 140, 247,1)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 2, // 多边形线s条宽度 Number，非必须，默认为 2
        lineDash: null // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
      },
      // 里层 - 多边形图层数据
      mapPolygonDataInner: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(32, 183, 254,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 15, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
      },
      // 外层 - 多边形图层数据
      mapPolygonDataOuter: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(32, 183, 254,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 15, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
      },
      isSelect: false,
      iconMiniData: [
        { type: 'wifi', text: '公共场所上网审计', url: 'icon-tab-small-1.png' },
        { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-small-3.png' },
        { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-small-4.png' },
        { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-small-5.png' },
        { type: 'wifi', text: '人脸门禁', url: 'icon-tab-small-6.png' },
        { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-small-7.png' },
        { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-small-8.png' }
      ],
      drawer: {
        isShow: true
      },
      personnelDrawer: {
        isShow: false
      },
      stepList: [
        {
          title: '基本信息',
          isChecked: true,
          isCanExpend: true
        },
        {
          title: '防控人群',
          isChecked: false,
          isCanExpend: true
        },
        {
          title: '区域范围',
          isChecked: false,
          isCanExpend: true
        }
      ],
      idsStr: '',
      personList: [],
      params: {
        warningName: '',
        personList: [],
        receiverIds: [],
        point2DList: [],
        warningType: 'warningBoundary'
      },
      checkedList: [],
      isMapRender: false,
      outerArea: [],
      innerArea: []
    }
  },

  computed: {
    ...mapState('Ol', {
      imgMap: 'imgMap',
      oMap: 'oMap'
    }),
    ...mapState('Map', {
      roomDeviceList: 'roomDeviceList'
    }),
    ID () {
      return this.$route.query?.id
    }
  },

  created () {
    if (this.roomDeviceList?.length) {
      this.isLoadingDev = true
      this.renderDeviceList = this.roomDeviceList
    } else {
      this.initData()
    }

    this.bus.$once('rendercomplete', () => {
      this.isMapRender = true
    })

    if (this.ID) {
      this.loadInfo()
    }
    this.loadArea()
  },

  methods: {
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList'
    }),
    initData () {
      this.getDeviceList().then(res => {
        if (res) {
          const list = res.map(item => {
            item.position = _pos(item.longitude, item.latitude)
            item.deviceType = item.deviceType || 1
            return item
          })
          this.renderDeviceList = list // 渲染数据
        }
        this.isLoadingDev = true
      })
    },
    // 点击最大级别单个 feature 事件
    clickMarker (feature) {
      this.location(feature.position, this.$store.state.User.zoom)
    },

    clickMarkerOutside (flag = false) {
      if (flag) {
        this.$store.commit('Ol/setSearchObj', { flag: false, content: '', pos: ['', ''] })
      }
    },
    // 点击聚合
    handleClickAggregate (feature) {
      // 场所定位放大
      this.location(feature.position, this.$store.state.User.zoom + 1)
    },

    // 定位放大
    location (position, zoom) {
      const curView = this.oMap.getView()
      curView.animate({
        zoom: zoom,
        center: position,
        duration: 300
      })
    },

    // 删除指定人员
    handleDelete (certificateNumber) {
      const index = this.checkedList.findIndex(_c => _c.certificateNumber === certificateNumber)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }
    },

    // 分页查询设备列表
    handleCurrentChange (pageNum) {
      this.devicePageParams.pageNum = pageNum
      this.getPlaceAndDevice(this.devicePageParams)
    },

    // 加载所有边界区域
    loadArea () {
      queryAllBorderArea(this.params).then(res => {
        if (!res) return
        let outList = [],
            inList = [],
            drawList = []

        res.forEach(element => {
          element.fenceRangeList.forEach((_c, index) => {
            if (index === 0) {
              outList.push({
                id: 'outList' + element.id,
                areaId: element.id,
                pointlist: this.formatLocation(_c)
              })
            } else if (index === 1) {
              drawList.push({
                id: 'inList' + element.id,
                areaId: element.id,
                pointlist: this.formatLocation(_c)
              })
            } else if (index === 2) {
              inList.push({
                id: 'drawList' + element.id,
                areaId: element.id,
                pointlist: this.formatLocation(_c)
              })
            }
          })
        })

        this.oldAreaList = drawList
        this.outerArea = outList
        this.innerArea = inList
      })
    },

    formatLocation (list) {
      return list?.map(ele => {
        const positionObj = gps.GcjWGSConversion({
          Lon: ele.x,
          Lat: ele.y,
          type: 1
        })
        return [positionObj.longitude, positionObj.latitude]
      })
    },

    // 根据id获取初始数据
    loadInfo () {
      // 根据id获取当前边界信息 进行赋值编辑
      queryInfoByid(this.ID).then(res => {
        if (!res) return
        this.curInfo = { ...res }
        this.$nextTick(() => {
          // 边界名称
          this.$refs.BasicInformation.params.warningName = this.curInfo.warningName

          // 发送人员
          if (this.curInfo.receivers?.length) {
            this.$refs.BasicInformation.params.receiverIds = this.curInfo.receivers.map(
              _c => _c.receiverId
            )
          }
          this.$refs.BasicInformation.params.dataTypeList = this.curInfo.dataTypeList

          // 同步指定人员范围
          // this.idsStr = this.curInfo.personList.map(_c => _c.personId).join(',')
          this.personList = this.curInfo.personList

          this.params.personList = this.curInfo.personList
          this.checkedList = this.curInfo.personList

          // 同步区域经纬度显示
          this.params.point2DList = this.curInfo.fences?.[0].fenceRangeList[1]
          this.mapPolygonData.pointlist = this.params.fenceRangeList?.map(_c => {
            return [_c.x, _c.y]
          })

          // this.getPlaceAndDevice(this.params.point2DList)
          this.devicePageParams.points = [...this.params.point2DList]
          this.devicePageParams.pageNum = 1
          this.devicePageParams.curPage = 1
          this.getPlaceAndDevice(this.devicePageParams)
        })
      })
    },
    // 已选择的指定人员
    selectPerson (item) {
      this.params.personList = [...item]
    },
    // 提交 新建/编辑 请求
    handleSubmit () {
      this.$nextTick(() => {
        // 获取子组件参数
        this.params = { ...this.params, ...this.$refs.BasicInformation.params }
        let url = insertWarnArea
        if (this.ID) {
          this.params.id = this.ID
          url = updateWarnArea
        }

        // 校验
        this.checkRules(this.params.warningName, () => {
          this.$messageTip.error('名称输入错误！')
          return false
        })

        if (!this.params.point2DList.length) {
          this.$messageTip.error('请绘制区域范围！')
          return false
        }

        if (this.params.personList.length === 0) {
          this.$messageTip.error('至少选择一位指定人员！')
          return false
        }

        // 参数
        const params = {
          ...this.params,
          warningType: 'warningBoundary'
        }
        url(params).then(() => {
          this.$router.push({ name: 'BorderWarn' })
        })
      })
    },

    // 校验
    checkRules (value, callback) {
      if (!value) {
        callback()
      }
    },

    // 绘画区域模式 开启/关闭
    changeDrawer () {
      this.isSelect = !this.isSelect
    },

    /** -------------- drawer 组件 -------------------------- */
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },

    handleExpend (index) {
      this.stepList.forEach((element) => {
        element.isChecked = false
      })
      this.stepList[index].isChecked = true
    },

    // 单选框 选择
    selectPersonnel (e) {
      if (e === 2) {
        this.personnelDrawer.isShow = true
      } else {
        this.idsStr = ''
      }
    },

    // 隐藏 人员表格  获取ids 生成分页表
    handleSubmitPersonnel (selectionList) {
      this.checkedList = [...selectionList]
      this.personList = [...selectionList]
      // this.idsStr = selectionList?.map(i => i.personId).join(',')
      // this.params.personList = [...selectionList]
      this.personnelDrawer.isShow = false
    },
    /**
     * 框选完毕后事件
     */
    selectEnd (feature) {
      this.mapPolygonData.pointlist = feature.getCoordinates()?.[0]

      // 1. 离线地图需要转为高德地图经纬度去存储
      this.params.point2DList = this.mapPolygonData.pointlist.map(_c => {
        const positionObj = gps.GcjWGSConversion({ Lon: _c[0], Lat: _c[1], type: 2 })
        return {
          x: positionObj?.longitude,
          y: positionObj?.latitude
        }
      })

      // 2. 通过经纬度查询相关设备进行显示
      this.devicePageParams.points = [...this.params.point2DList]
      this.devicePageParams.pageNum = 1
      this.devicePageParams.curPage = 1
      this.getPlaceAndDevice(this.devicePageParams)

      // 3. 关闭框选状态
      this.isSelect = false
    },

    // 获取 区域场所地址
    getPlaceAndDevice (params) {
      this.devicePageParams.isLoading = true
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']

      queryBoundaryPlaceAndDevice({ ...params, warningType: 'warningBoundary' })
        .then(res => {
          if (!res) return
          this.deviceList =
            res.content?.map(_c => {
              _c.deviceTypeStr = deviceTypeListMap[_c.deviceType] || '其他'
              return _c
            }) ?? []
          this.devicePageParams.total = res.totalSize
        })
        .finally(() => {
          this.devicePageParams.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.map_con {
  position: relative;
}
header {
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: var(--fangkongyujing-xinjian-bianji-header-bg);
  border: 2px solid rgba(255, 255, 255, 0.06);
  opacity: 0.9;
  box-sizing: border-box;
}
.mode {
  // background: #202b3f;
  opacity: 0.2;
}
</style>
