<template>
  <div class="map_con">
    <amap :center="center">
      <header>
        <list-title :title="ID ? '编辑重点' : '新建重点'"></list-title>

        <div @click="$router.push({ name: 'ImportantWarnRules' })">
          <!-- <nav-title title="预警规则"></nav-title> -->
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
                  :cusStyle="{ height: 'calc(100vh - 380px)' }"
                  :idsStr="idsStr"
                  :btnList="btnList"
                  @selectPersonnel="selectPersonnel"
                  @handleDelete="handleDelete"
                >
                  <CusButton :btnList="btnList"></CusButton
                ></WarnCrowd>
              </template>

              <!-- 区域范围 -->
              <!-- <template v-slot:step_content2>
                <PickArea
                  ref="PickArea"
                  :innerOrOuter.sync="params.innerOrOuter"
                  :isActive.sync="isSelect"
                  :btnList="btnList"
                  :list="placeAndDeviceList"
                  @changeDrawer="changeDrawer"
                  @handleDel="handleDelArea"
                  @handleClick="handleClickArea"
                ></PickArea>
              </template> -->
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

      <!-- <DrawPolygon :open="isSelect" shape="polygon" @selectEnd="selectEnd"></DrawPolygon> -->

      <!-- <template v-for="(item, index) in params.rangeParams">
        <MapPolygon
          :key="index"
          :pointList="item.pointList"
          fillColor="rgba(69, 150, 230,0.5)"
          lineColor="rgba(69, 150, 230,0.5)"
          :lineWidth="mapPolygonData.lineWidth"
          :lineDash="mapPolygonData.lineDash"
          :elementName="mapPolygonData.elementName"
          :className="mapPolygonData.className"
          :customAttribute="{ id: item.id }"
          @handleClickPolygon="handleClickPolygon"
        ></MapPolygon>
      </template> -->
      <!-- <Opera :curStyle="{ top: '70px' }"></Opera> -->
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'

import BasicInformation from '@/views/common/warn/ImportantWarn/NewImportant/BasicInformation'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
// import PickArea from '@/views/common/warn/ImportantWarn/NewImportant/PickArea'
import Steps from '@/views/common/warn/components/Steps'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
// import Opera from '@/views/offline/analysis/space-time-collision/components/opera'
import CusButton from '@/components/BasicComponents/CusButton'

// import DrawPolygon from '@/components/Map/OnlineMap/MapPolygon/DrawPolygon'
// import MapPolygon from '@/components/Map/OnlineMap/MapPolygon'

import {
  queryFencePlaceAndDevice,
  insertWarnArea,
  queryImportantRuleById,
  updateWarnArea
} from '@/api/warn'

export default {
  mixins: [AmapMixins],
  components: {
    Drawer,
    Steps,
    BasicInformation,
    WarnCrowd,
    // PickArea,
    PersonnelTable,
    // DrawPolygon,
    // MapPolygon,
    CusButton
    // Opera
  },
  data () {
    return {
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
        elementName: '地图多边形', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
        lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null, // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: 'map-polygon' // 图层的class String, 非必须，默认为 'map-polygon'
      },
      isSelect: false,
      iconMiniData: [
        // { type: 'wifi', text: '重点防控', url: 'warning-icon-4.png' },
        // { type: 'wifi', text: '中等防控', url: 'warning-icon-5.png' },
        // { type: 'wifi', text: '一般防控', url: 'warning-icon-6.png' }
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
        }
      ],
      idsStr: '',
      params: {
        personRange: 'part',
        warningName: '',
        personList: [],
        // rangeParams: [],
        // innerOrOuter: 'inner',
        warningType: 'warningPerson'
      },
      checkedList: [],
      placeAndDeviceList: []
    }
  },

  computed: {
    ID () {
      return this.$route.query?.id
    },
    allOverlays () {
      return this.$store.state.Common.cMap?.getAllOverlays('polygon')
    }
  },

  created () {
    if (this.ID) {
      this.loadInfo()
    }
  },

  methods: {
    // 删除指定人员
    handleDelete (personId) {
      const index = this.checkedList.findIndex(_c => _c.basePersonId === personId)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }
    },

    // 编辑加载详情
    loadInfo () {
      queryImportantRuleById(this.ID).then(res => {
        this.curInfo = { ...res }
        this.$nextTick(() => {
          this.$refs.BasicInformation.params.warningName = this.curInfo.warningName
          // this.$refs.BasicInformation.params.messageFrequency = this.curInfo.messageFrequency
          this.$refs.BasicInformation.params.disconnection = this.curInfo.disconnection
          this.$refs.BasicInformation.params.warningType = this.curInfo.warningType

          if (this.curInfo.receivers?.length) {
            this.$refs.BasicInformation.params.receiverIds = this.curInfo.receivers.map(
              _c => _c.receiverId
            )
          }

          this.idsStr = this.curInfo.personList.map(_c => _c.personId).join(',')

          this.params.personList = this.curInfo.personList

          this.checkedList = this.curInfo.personList
        })
      })
    },

    // 提交区域
    handleSubmit () {
      this.$nextTick(() => {
        this.params = { ...this.params, ...this.$refs.BasicInformation.params }

        let url = insertWarnArea
        if (this.ID) {
          this.params.id = this.ID
          url = updateWarnArea
        }

        this.checkRules(this.params.warningName, () => {
          this.$messageTip.error('名称输入错误！')
          return false
        })

        // this.checkRules(this.params.messageFrequency, () => {
        //   this.$messageTip.error('请选择预警间隔！')
        //   return false
        // })

        this.checkRules(this.params.disconnection, () => {
          this.$messageTip.error('请选择失联时间！')
          return false
        })

        this.checkRules(this.params.monitorMode, () => {
          this.$messageTip.error('请选择追踪方式！')
          return false
        })

        if (this.params.personList.length === 0) {
          this.$messageTip.error('至少选择一位指定人员！')
          return false
        }

        const params = {
          ...this.params
          // rangeParams: this.params.rangeParams.map(_c => {
          //   return _c.fenceRange
          // })
        }
        url(params).then(() => {
          this.$router.push({ name: 'ImportantWarnRules' })
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
        this.params.personRange = 'part'
      } else {
        this.idsStr = ''
        this.params.personRange = 'all'
      }
    },

    // 隐藏 人员表格  获取ids 生成分页表
    handleSubmitPersonnel (selectionList) {
      this.checkedList = [...selectionList]
      this.idsStr = selectionList?.map(i => i.personId)?.join(',') ?? '--'
      this.params.personList = [...selectionList]
      this.personnelDrawer.isShow = false
    },
    /**
     * 框选完毕后事件
     */
    selectEnd (list) {
      const rangeParams = list.map(_c => {
        return {
          longitude: parseFloat(_c[0]),
          latitude: parseFloat(_c[1])
        }
      })

      this.getPlaceAndDevice(rangeParams)
    },

    // 获取 区域场所地址
    getPlaceAndDevice (params) {
      const alist = [
        {
          rangeParams: [
            {
              longitude: 121,
              latitude: 27
            },
            {
              longitude: 121,
              latitude: 50
            },
            {
              longitude: 123,
              latitude: 50
            },
            {
              longitude: 123,
              latitude: 27
            }
          ]
        }
      ]
      queryFencePlaceAndDevice(alist).then(() => {
        // if (!res || JSON.stringify(res) === '{}' || res?.length === 0) {
        //   this.$messageTip.error('该区域未查询到相关场所/设备，请重新选择区域！')
        //   return false
        // }

        // this.placeAndDeviceList =
        //   res?.map(ele => {
        //     ele.deviceTypeList =
        //       ele.deviceTypeList?.map(_c => {
        //       }) ?? []
        //     ele.deviceTypeList = ele.deviceTypeList.filter(_c => Boolean(_c))
        // ele.id=JSON.stringify(ele.key)
        //     return ele
        //   }) ?? []

        this.placeAndDeviceList = [
          {
            placeNameList: [
              '威海市经济技术开发区祥和居旅馆',
              '威海市经济技术开发区温馨园旅馆',
              '威海市经济技术开发区福海旅馆',
              '威海市经济技术开发区丽华旅馆',
              '威海市经济技术开发区和美社区党群服务中心'
            ],
            key: params,
            id: JSON.stringify(params),
            deviceTypeList: ['3', '6', '8']
          },
          {
            placeNameList: [
              '威海市经济技术开发区祥和居旅馆',
              '威海市经济技术开发区温馨园旅馆',
              '威海市经济技术开发区福海旅馆',
              '威海市经济技术开发区丽华旅馆',
              '威海市经济技术开发区和美社区党群服务中心'
            ],
            key: params,
            id: JSON.stringify(params),
            deviceTypeList: ['3', '6', '8']
          }
        ]

        this.params.rangeParams.push({
          fenceRange: params,
          id: JSON.stringify(params),
          pointList: params.map(_c => [_c.longitude, _c.latitude])
        })

        this.isSelect = false
      })
    },

    // 点击设备块 删除某个多边形
    handleDelArea (idStr) {
      const area = this.allOverlays.find(_c => _c.getExtData().id === idStr)
      area && this.$store.state.Common.cMap.remove(area)
      this.params.rangeParams = this.params.rangeParams.filter(_c => _c.id !== idStr)
      this.placeAndDeviceList = this.placeAndDeviceList.filter(
        _c => JSON.stringify(_c.key) !== idStr
      )
    },

    // 点击设备块
    handleClickArea (idStr) {
      const area = this.allOverlays.find(_c => _c.getExtData().id === idStr)
      area &&
        area.setOptions({
          fillColor: 'rgba(69, 150, 230,0.8)',
          strokeColor: 'rgba(69, 150, 230,0.8)'
        })
    },

    // 点击多边形
    handleClickPolygon (e, customAttribute) {
      this.$nextTick(() => {
        this.$refs.PickArea?.scrollIntoView(customAttribute.id)
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
