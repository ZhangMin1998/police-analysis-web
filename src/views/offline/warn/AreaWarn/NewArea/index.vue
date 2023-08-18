<template>
  <div class="map_con">
    <ol-map id="map" class="map" style="height: 100%">
      <header>
        <list-title :title="ID ? '编辑区域' : '新建区域'"></list-title>

        <div @click="$router.push({ name: 'AreaWarn' })">
          <!-- <nav-title title="区域防控"></nav-title> -->
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
                <BasicInformation
                  ref="BasicInformation"
                  @changeLevel="changeColor"
                ></BasicInformation>
              </template>

              <!-- 防控人群 -->
              <template v-slot:step_content1>
                <WarnCrowd
                  ref="WarnCrowd"
                  :warnPersonList="personList"
                  :idsStr="idsStr"
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
                  :placeList.sync="placeList"
                  :deviceTypeList.sync="deviceTypeList"
                  @changeDrawer="changeDrawer"
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
        :customAttribute="{ id: 'drawerMapPolygon' }"
      ></MapPolygon>

      <template v-if="oldAreaList.length > 0">
        <!-- 多边形区域 -->
        <MapPolygon
          v-for="(item, index) in oldAreaList"
          :key="index + '_' + item.id"
          :pointList="item.pointlist"
          :fillColor.sync="item.color"
          :lineColor.sync="item.color"
          :lineWidth="mapPolygonData.lineWidth"
          :lineDash="mapPolygonData.lineDash"
          :customAttribute="{ id: item.id }"
        ></MapPolygon>
      </template>

      <Opera :curStyle="{ top: '70px' }"></Opera>
    </ol-map>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import { gps } from '@/utils/resetPosition'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'

import BasicInformation from '@/views/common/warn/AreaWarn/NewArea/BasicInformation'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
import PickArea from '@/views/common/warn/AreaWarn/NewArea/PickArea'
import Steps from '@/views/common/warn/components/Steps'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'

import DrawPolygon from '@/components/Map/OfflineMap/MapPolygon/DrawPolygon'
import MapPolygon from '@/components/Map/OfflineMap/MapPolygon'

import {
  queryAreaDeviceAndPlace,
  insertWarnArea,
  updateWarnArea,
  queryWarnRuleById,
  queryAllArea
} from '@/api/warn'

const levelColor = {
  GENERAL_LEVEL: 'rgba(69, 150, 230,0.3)',
  MEDIUM_LEVEL: 'rgba(216, 183, 51,0.3)',
  EMPHASIS_LEVEL: 'rgba(240, 63, 88,0.3)'
}
Object.freeze(levelColor)

const iconMiniData = [
  { type: 'wifi', text: '重点防控', url: 'warning-icon-4.png' },
  { type: 'wifi', text: '中等防控', url: 'warning-icon-5.png' },
  { type: 'wifi', text: '一般防控', url: 'warning-icon-6.png' }
]
Object.freeze(iconMiniData)

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
    Opera
  },
  data () {
    return {
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
        fillColor: 'rgba(69, 150, 230,0.3)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        elementName: '地图多边形', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
        lineColor: 'rgba(69, 150, 230,0.3)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null, // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: 'map-polygon' // 图层的class String, 非必须，默认为 'map-polygon'
      },
      isSelect: false,
      iconMiniData: iconMiniData,
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
      placeList: [],
      deviceTypeList: [],
      params: {
        warningName: '',
        fenceLevel: '',
        fenceType: '',
        receiverIds: [],
        personList: [],
        point2DList: []
      },
      checkedList: []
    }
  },

  computed: {
    ID () {
      return this.$route.query?.id
    }
  },

  async created () {
    if (this.ID) {
      await this.loadInfo()
    }
    await this.loadArea()
  },

  methods: {
    // 删除指定人员
    handleDelete (certificateNumber) {
      const index = this.checkedList.findIndex(_c => _c.certificateNumber === certificateNumber)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }
    },

    // 加载区域
    async loadArea () {
      await queryAllArea({
        fenceLevel: 'GENERAL_LEVEL,MEDIUM_LEVEL,EMPHASIS_LEVEL'
      }).then(res => {
        if (!res) return
        const list = res.filter(_c => _c.id !== this.curInfo.fenceId)

        const areaList =
          list?.map(_c => {
            const pointlist = _c.fencePoints?.map(ele => {
              const positionObj = gps.GcjWGSConversion({
                Lon: ele.x,
                Lat: ele.y,
                type: 1
              })
              return [positionObj?.longitude, positionObj?.latitude]
            })
            return {
              pointlist,
              id: _c.id,
              color: levelColor[_c.fenceLevel || 'GENERAL_LEVEL']
            }
          }) ?? []
        this.oldAreaList = JSON.parse(JSON.stringify(areaList))
      })
    },

    // 编辑加载详情
    async loadInfo () {
      await queryWarnRuleById(this.ID).then(res => {
        if (!res) return
        this.curInfo = { ...(res.fences?.[0] ?? {}), ...res }
        this.$nextTick(() => {
          this.$refs.BasicInformation.params.warningName = this.curInfo.warningName
          this.$refs.BasicInformation.params.fenceLevel = this.curInfo.fenceLevel
          this.$refs.BasicInformation.params.fenceType = this.curInfo.fenceType

          this.$refs.BasicInformation.changeLevel(this.curInfo.fenceLevel)

          if (this.curInfo?.length) {
            this.$refs.BasicInformation.params.receiverIds = this.curInfo.receiverIds.map(
              _c => _c.receiverId
            )
          }
          this.$refs.BasicInformation.params.dataTypeList = this.curInfo.dataTypeList

          // this.idsStr = this.curInfo.personList.map(_c => _c.personId).join(',')
          this.personList = this.curInfo.personList

          this.params.personList = this.curInfo.personList
          this.checkedList = this.curInfo.personList

          this.params.point2DList = this.curInfo.fences?.[0].fencePoints
          this.mapPolygonData.pointlist = this.params.point2DList?.map(_c => {
            const positionObj = gps.GcjWGSConversion({
              Lon: _c.x,
              Lat: _c.y,
              type: 1
            })
            return [positionObj?.longitude, positionObj?.latitude]
            // return [_c.x, _c.y]
          })

          this.getPlaceAndDevice(this.params.point2DList)
        })
      })
    },
    // 已选择的指定人员
    selectPerson (item) {
      this.params.personList = [...item]
    },

    // 提交区域
    handleSubmit () {
      this.$nextTick(() => {
        this.params = { ...this.params, ...this.$refs.BasicInformation.params }
        // console.log(this.params,this.$refs.BasicInformation.params)
        let url = insertWarnArea
        if (this.ID) {
          this.params.id = this.ID
          url = updateWarnArea
        }

        this.checkRules(this.params.warningName, () => {
          this.$messageTip.error('请输入区域名称！')
          return false
        })

        this.checkRules(this.params.fenceType, () => {
          this.$messageTip.error('请选择区域类型！')
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
          warningType: 'warningFence'
        }
        url(params).then(() => {
          this.$router.push({ name: 'AreaWarn' })
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

    // 改变区域颜色
    changeColor (color) {
      this.mapPolygonData.fillColor = color
      this.mapPolygonData.lineColor = color
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
      // console.log(this.personList)
      // this.idsStr = selectionList.map(i => i.personId).join(',')
      // this.params.personList = [...selectionList]
      this.personnelDrawer.isShow = false
    },
    /**
     * 框选完毕后事件
     */
    selectEnd (feature) {
      this.mapPolygonData.pointlist = feature.getCoordinates()?.[0]
      this.params.point2DList = this.mapPolygonData.pointlist.map(_c => {
        const positionObj = gps.GcjWGSConversion({ Lon: _c[0], Lat: _c[1], type: 2 })
        return {
          x: positionObj?.longitude,
          y: positionObj?.latitude
        }
      })
      this.getPlaceAndDevice(this.params.point2DList)
      this.isSelect = false
    },

    // 获取 区域场所地址
    getPlaceAndDevice (params) {
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']

      queryAreaDeviceAndPlace(params).then(res => {
        if (!res) return
        this.deviceTypeList = res.deviceTypeList?.map(_c => {
          return deviceTypeListMap[_c] || '其他'
        })
        this.deviceTypeList = this.deviceTypeList.filter(_c => Boolean(_c))
        this.placeList = [...res.placeNameList]
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
  // background: #202b3f;
  opacity: 0.2;
}
</style>
