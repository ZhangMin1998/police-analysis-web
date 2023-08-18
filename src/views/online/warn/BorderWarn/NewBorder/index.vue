<template>
  <div class="map_con">
    <amap :center="center" ref="amap">
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
                  @selectPersonnel="selectPersonnel"
                  @handleDelete="handleDelete"
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
        oldLeft="390px"
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

      <DrawPolygon :open="isSelect" shape="polygon" @selectEnd="selectEnd"></DrawPolygon>

      <!-- 绘画区域 -->
      <MapPolygon
        :pointList="mapPolygonData.pointlist"
        :fillColor="mapPolygonData.fillColor"
        :lineColor="mapPolygonData.lineColor"
        :lineWidth="mapPolygonData.lineWidth"
        :lineDash="mapPolygonData.lineDash"
        :elementName="mapPolygonData.elementName"
        :className="mapPolygonData.className"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in outerArea"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor="mapPolygonDataOuter.fillColor"
        :lineColor="mapPolygonDataOuter.lineColor"
        :lineWidth="mapPolygonDataOuter.lineWidth"
        :lineDash="mapPolygonDataOuter.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in innerArea"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor="mapPolygonDataInner.fillColor"
        :lineColor="mapPolygonDataInner.lineColor"
        :lineWidth="mapPolygonDataInner.lineWidth"
        :lineDash="mapPolygonDataInner.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in oldAreaList"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor="mapPolygonDatadraw.fillColor"
        :lineColor="mapPolygonDatadraw.lineColor"
        :lineWidth="mapPolygonDatadraw.lineWidth"
        :lineDash="mapPolygonDatadraw.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
      ></MapPolygon>

      <Opera :curStyle="{ top: '70px' }"></Opera>

      <!-- 设备 - 覆盖物 -->
      <DeviceMarker
        v-if="roomDeviceList.length"
        ref="deviceMarker"
        :list="roomDeviceList"
        :mode="0"
        :show="1"
      />
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'

import BasicInformation from '@/views/common/warn/BorderWarn/NewBorder/BasicInformation'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
import PickArea from '@/views/common/warn/BorderWarn/NewBorder/PickArea'
import Steps from '@/views/common/warn/components/Steps'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'

import DrawPolygon from '@/components/Map/OnlineMap/MapPolygon/DrawPolygon'
import MapPolygon from '@/components/Map/OnlineMap/MapPolygon'

import DeviceMarker from '@/components/Map/OnlineMap/device-marker'
import {
  queryAllBorderArea,
  queryBoundaryPlaceAndDevice,
  insertWarnArea,
  updateWarnArea,
  queryImportantRuleById as queryInfoByid
} from '@/api/warn'

import { mapState, mapActions } from 'vuex'

export default {
  mixins: [AmapMixins],
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
    DeviceMarker
  },
  data () {
    return {
      deviceList: [],
      devicePageParams: {
        pageNum: 1,
        pageSize: 10,
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
      // 多边形图层数据
      mapPolygonData: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        elementName: '地图多边形', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
        lineColor: 'rgba(24, 140, 247,1)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 3, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null, // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: 'map-polygon' // 图层的class String, 非必须，默认为 'map-polygon'
      },
      // 多边形图层数据
      mapPolygonDatadraw: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(170, 204, 231,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 1 // 多边形线条宽度 Number，非必须，默认为 2
      },
      // 多边形图层数据
      mapPolygonDataInner: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(32, 183, 254,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 15 // 多边形线条宽度 Number，非必须，默认为 2
      },
      // 多边形图层数据
      mapPolygonDataOuter: {
        pointlist: [],
        fillColor: 'rgba(255, 255, 255,0)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(32, 183, 254,0.5)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 15 // 多边形线条宽度 Number，非必须，默认为 2
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
      params: {
        warningName: '',
        personList: [],
        receiverIds: [],
        point2DList: [],
        warningType: 'warningBoundary'
      },
      checkedList: [],
      outerArea: [],
      innerArea: []
    }
  },

  computed: {
    ...mapState('Map', {
      roomDeviceList: 'roomDeviceList'
    }),
    ID () {
      return this.$route.query?.id
    }
  },

  created () {
    if (this.roomDeviceList?.length === 0) {
      this.getDeviceList()
    }

    if (this.ID) {
      this.loadInfo()
    }
    this.loadArea()
  },

  methods: {
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList'
    }),
    // 分页查询设备列表
    handleCurrentChange (pageNum) {
      this.devicePageParams.pageNum = pageNum
      this.getPlaceAndDevice(this.devicePageParams)
    },
    // 加载区域
    loadArea () {
      queryAllBorderArea().then(res => {
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
        return [ele.x, ele.y]
      })
    },

    // 删除指定人员
    handleDelete (personId) {
      const index = this.checkedList.findIndex(_c => _c.personId === personId)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }
    },

    // 编辑加载详情
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

          // 同步指定人员范围
          this.idsStr = this.curInfo.personList.map(_c => _c.personId).join(',')
          this.params.personList = this.curInfo.personList
          this.checkedList = this.curInfo.personList

          // 同步区域经纬度显示
          this.params.point2DList = this.curInfo.fences?.[0].fenceRangeList[1]
          this.mapPolygonData.pointlist = this.params.fenceRangeList?.map(_c => {
            return [_c.x, _c.y]
          })

          this.getPlaceAndDevice(this.params.point2DList)
        })
      })
    },

    // 提交区域
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
      this.idsStr = selectionList.map(i => i.personId).join(',')
      this.params.personVoList = [...selectionList]
      this.personnelDrawer.isShow = false
    },
    /**
     * 框选完毕后事件
     */
    selectEnd (list) {
      this.mapPolygonData.pointlist = [...list]

      // 1. 离线地图需要转为高德地图经纬度去存储
      this.params.point2DList = this.mapPolygonData.pointlist.map(_c => {
        return {
          x: parseFloat(_c[0]).toFixed(6),
          y: parseFloat(_c[1]).toFixed(6)
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
          this.$nextTick(() => {
            if (!res) return
            //  清空旧聚合图
            // this.$refs?.amap?.curCluster?.clearMarkers()

            this.deviceList =
              res.content?.map(_c => {
                _c.deviceTypeStr = deviceTypeListMap[_c.deviceType] || '其他'
                return _c
              }) ?? []
            this.devicePageParams.total = res.totalSize
          })
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
  height: 60px;
  background: var(--fangkongyujing-xinjian-bianji-header-bg);
  border: 2px solid rgba(255, 255, 255, 0.06);
  opacity: 0.9;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 99;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 16px;
}
.mode {
  background: #202b3f;
  opacity: 0.2;
}
</style>
