<template>
  <div class="map_con">
    <amap :center="center">
      <header>
        <list-title :title="ID ? '编辑规则' : '新建规则'"></list-title>

        <div @click="$router.push({ name: 'Rules' })">
          <!-- <nav-title title="规则列表"></nav-title> -->
          <BackPrevious></BackPrevious>
        </div>
      </header>
      <!-- 图标控件 -->
      <map-control :list="iconMiniData" />

      <!-- 消息面板 -->
      <drawer
        :drawer.sync="drawer"
        moveLeft="-410px"
        width="410px"
        :cusStyle="{ top: '64px', height: '90%' }"
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

              <!-- 防控属性 -->
              <template v-slot:step_content1>
                <div class="Attrs_box">
                  <Attrs ref="Attrs"></Attrs>
                </div>
              </template>

              <!-- 防控人群 -->
              <template v-slot:step_content2>
                <WarnCrowd
                  :cusStyle="{ height: 'calc(100vh - 540px)' }"
                  ref="WarnCrowd"
                  :idsStr="idsStr"
                  :subHeight="665"
                  @selectPersonnel="selectPersonnel"
                  @handleDelete="handleDelete"
                ></WarnCrowd>
              </template>

              <!-- 区域范围 -->
              <template v-slot:step_content3>
                <PickArea
                  :isActive.sync="isSelect"
                  :btnList="btnList"
                  :placeList.sync="placeList"
                  :deviceTypeList.sync="deviceTypeList"
                  @changeDrawer="changeDrawer"
                  @handleClear="handleClear"
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
        oldLeft="424px"
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

      <template v-for="(item, index) in mapPolygonData.pointlist">
        <MapPolygon
          :key="index + '_area' + item.id"
          :pointList="item.list"
          :fillColor="mapPolygonData.fillColor"
          :lineColor="mapPolygonData.lineColor"
          :lineWidth="mapPolygonData.lineWidth"
          :lineDash="mapPolygonData.lineDash"
          :elementName="mapPolygonData.elementName"
          :className="mapPolygonData.className"
          :customAttribute="{ id: item.id }"
        ></MapPolygon>
      </template>
      <!-- 循环使用的方法 标记点-->
      <template v-for="(item, index) in delPointlist">
        <MapIconMark
          :key="index + '_delBtn' + JSON.stringify(item)"
          :position="[item.x, item.y]"
          :icon="iconImg"
          :customAttribute="{ ...item }"
          @handleClickIcon="MapClick"
        ></MapIconMark>
      </template>

      <Opera :curStyle="{ top: '70px' }"></Opera>
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'

import BasicInformation from '@/views/common/warn/MapWarn/Rules/Feature/BasicInformation'
import Attrs from '@/views/common/warn/MapWarn/Rules/Feature/Attrs'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
import PickArea from '@/views/offline/warn/MapWarn/components/PickArea'
import Steps from '@/views/common/warn/components/Steps'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import MapIconMark from '@/components/Map/OnlineMap/MapIconMark'

import DrawPolygon from '@/components/Map/OnlineMap/MapPolygon/DrawPolygon'
import MapPolygon from '@/components/Map/OnlineMap/MapPolygon'
import validateType from '@/mixins/validateType'

import {
  queryManyAreaDeviceAndPlace,
  insertWarnArea,
  updateWarnArea,
  queryWarnRuleById
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

const iconImg = require('@/assets/img/map_marker_2.png') // 文件地址 String[url]

export default {
  mixins: [AmapMixins, validateType],
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
    Attrs,
    MapIconMark
  },
  data () {
    return {
      iconImg: Object.freeze(iconImg),
      delPointlist: [],
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
      iconMiniData: Object.freeze(iconMiniData),
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
          title: '防控属性',
          isChecked: false,
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
      placeList: [],
      deviceTypeList: [],
      params: {
        warningName: '',
        warningLevel: '',
        receiverIds: [],
        personList: [],
        fenceRangeList: [],
        startTimeStamp: '',
        endTimeStamp: ''
      },
      checkedList: []
    }
  },

  computed: {
    ID () {
      return this.$route.query?.id
    },
    areaLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('polygon') ?? []
    },
    delLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('marker') ?? []
    }
  },

  created () {
    if (this.ID) {
      this.loadInfo()
    }
  },

  methods: {
    // 地图icon点击
    MapClick (event, data) {
      const { id, y, x } = data
      // 删除提交
      const index = this.params.fenceRangeList.findIndex(_c => _c[0].lon === x && _c[0].lat === y)
      index !== -1 && this.params.fenceRangeList.splice(index, 1)

      setTimeout(() => {
        const layer = this.areaLayers.find(_c => _c.getExtData().id === id)
        layer && this.$store.state.Common.cMap?.remove(layer)

        const delLayer = this.delLayers.find(_c => _c.getExtData().id === id)
        delLayer && this.$store.state.Common.cMap?.remove(delLayer)
      }, 0)

      this.getPlaceAndDevice(this.params.fenceRangeList)
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
      queryWarnRuleById(this.ID).then(res => {
        if (!res) return
        this.curInfo = { ...res }
        this.$nextTick(() => {
          // 赋值 防控属性
          this.$refs.Attrs.form.attrs = this.curInfo.attrList?.map(_c => {
            return {
              data: _c.attrValue,
              type: _c.attrType
            }
          }) ?? [{ data: '', type: '' }]

          // 赋值 基础信息
          this.$refs.BasicInformation.params.warningName = this.curInfo.warningName
          this.$refs.BasicInformation.params.warningLevel = this.curInfo.warningLevel
          if (this.curInfo.startTimeStamp !== this.curInfo.endTimeStamp) {
            this.$refs.BasicInformation.params.startTime = this.curInfo.startTimeStamp
            this.$refs.BasicInformation.params.endTime = this.curInfo.endTimeStamp
          }

          this.$refs.BasicInformation.changeLevel(this.curInfo.warningLevel)
          this.$refs.BasicInformation.params.receiverIds = this.curInfo.receivers?.map(
            _c => _c.receiverId
          ) ?? [0]

          // 赋值 防控人群
          this.idsStr = this.curInfo.personList.map(_c => _c.personId).join(',')
          this.params.personList = this.curInfo.personList
          this.checkedList = this.curInfo.personList

          // 赋值 区域范围
          this.params.fenceRangeList = this.curInfo.fences?.map(_c => {
            return _c.fencePoints.map(ele => {
              ele.lon = ele.x
              ele.lat = ele.y
              return ele
            })
          })

          this.mapPolygonData.pointlist = this.params.fenceRangeList?.map(_c => {
            const list = _c.map(ele => {
              return [ele.lon, ele.lat]
            })
            return {
              id: JSON.stringify(list),
              list: list
            }
          })

          // 删除按钮
          this.delPointlist = this.mapPolygonData.pointlist.map(_c => {
            return {
              id: JSON.stringify(_c.list),
              x: _c.list[0][0],
              y: _c.list[0][1]
            }
          })

          this.getPlaceAndDevice(this.params.fenceRangeList)
        })
      })
    },

    // 提交区域
    handleSubmit () {
      this.$nextTick(() => {
        const attrParams = this.$refs.Attrs.form.attrs.map(_c => {
          return { attrType: _c.type, attrValue: _c.data }
        })

        const fenceList = this.params.fenceRangeList.map(_c => {
          return _c.map(ele => {
            return {
              x: ele.x,
              y: ele.y
            }
          })
        })

        this.params = {
          ...this.params,
          ...this.$refs.BasicInformation.params,
          attrParams,
          fenceRangeList: fenceList
        }

        // url
        let url = insertWarnArea
        if (this.ID) {
          this.params.id = this.ID
          url = updateWarnArea
        }

        const error = this.params.attrParams.find(
          _c => !this.validateValue(_c.attrType, _c.attrValue, true)
        )
        if (error) {
          return false
        }

        this.checkRules(this.params.warningName, () => {
          this.$messageTip.error('预警名称输入错误！')
          return false
        })

        // 参数
        const params = {
          ...this.params,
          startTimeStamp: this.params.startTime,
          endTimeStamp: this.params.endTime,
          warningType: 'warningClue'
        }
        url(params).then(() => {
          this.$router.push({ name: 'Rules' })
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
      this.idsStr = selectionList.map(i => i.personId).join(',')
      this.params.personList = [...selectionList]
      this.personnelDrawer.isShow = false
    },
    /**
     * 框选完毕后事件
     */
    selectEnd (list) {
      // 数组
      const location = [...list]
      // 离线地图 经纬度显示
      this.mapPolygonData.pointlist.push({ id: JSON.stringify(location), list: location })

      // 删除按钮
      const delObj = {
        id: JSON.stringify(location),
        x: location[0][0],
        y: location[0][1]
      }
      this.delPointlist.push(delObj)

      // 转换为高德地图经纬度 实际提交经纬度
      const fence = location.map(_c => {
        return { x: _c[0], y: _c[1], lon: _c[0], lat: _c[1] }
      })

      this.params.fenceRangeList.push(fence)

      // 查询区域下的设备场所
      this.getPlaceAndDevice(this.params.fenceRangeList)
      this.isSelect = false
    },

    handleClear () {
      this.params.fenceRangeList = []
      setTimeout(() => {
        this.areaLayers.forEach(_c => {
          this.$store.state.Common.cMap?.remove(_c)
        })

        this.delLayers.forEach(_c => {
          this.$store.state.Common.cMap?.remove(_c)
        })
      }, 0)

      this.deviceTypeList = []
      this.placeList = []
    },

    // 获取 区域场所地址
    getPlaceAndDevice (params) {
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']

      queryManyAreaDeviceAndPlace(params).then(res => {
        if (!res || JSON.stringify(res) === '{}') {
          this.deviceTypeList = []
          this.placeList = []
          return
        }
        this.deviceTypeList = res.deviceTypeList.map(_c => {
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
  background: #202b3f;
  opacity: 0.2;
}

.Attrs_box {
  box-sizing: border-box;
  width: 320px;
}

/deep/.el-table__fixed-body-wrapper {
  top: 32px !important;
}
</style>
