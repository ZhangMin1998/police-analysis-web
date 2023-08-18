<template>
  <div class="map_con">
    <amap :center="center">
      <div class="AddressSearch" v-permission="'border_warn:search'">
        <CusMapSearch
          :cusInput="cusInput"
          @handleSearch="handleSearch"
          @handleClear="cusInput.searchKey = ''"
        ></CusMapSearch>
      </div>

      <!-- 切换 历史/规则 -->
      <Tab :tabNav.sync="tabNav" @handleClick="TabHandleClick" />

      <!-- 图标控件 -->
      <map-control :list="iconMiniData" />

      <!-- 弹出窗体 -->
      <MapPopup
        :position="mapPopupData.position"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <PersonPop :curPersonInfo="curPersonInfo" :personInfos="personInfos">
          <li class="info_item">
            <div>免打扰状态：</div>
            <div class="info_item_value">
              <el-radio-group v-model="radioWarn" @change="radioChange">
                <el-radio label="1">1小时</el-radio>
                <el-radio label="6">6小时</el-radio>
                <el-radio label="12">12小时</el-radio>
                <el-radio label="24">24小时</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </div>
          </li>
        </PersonPop>
      </MapPopup>

      <!-- 区域 弹出窗体 -->
      <MapPopup
        :position="areaMapPopupData.position"
        :mapShow="areaMapPopupData.show"
        @close="areaMapPopupClose"
      >
        <BorderPop
          :curAreaInfo="curAreaInfo"
          :areaInfos="areaInfos"
          @handleDelArea="handleDelArea"
          @handleEdit="areaHandleEdit"
        ></BorderPop>
      </MapPopup>

      <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom">
        <template-table
          :tableData="personTable.tableData"
          :columns="personTable.columns"
          :tableHeight="height"
          :rowHeight="40"
          :pageData="{
            pageSize: personTable.params.pageSize,
            curPage: personTable.curPage,
            total: personTable.total
          }"
          @handleCurrentChange="handleCurrentChange"
        ></template-table
      ></CusDrawerBottom>

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
        @handleClickPolygon="handleClickPolygon"
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
        @handleClickPolygon="handleClickPolygon"
      ></MapPolygon>

      <!-- 多边形区域 -->
      <MapPolygon
        v-for="(item, index) in oldAreaList"
        :key="index + '_' + item.id"
        :pointList="item.pointlist"
        :fillColor="mapPolygonData.fillColor"
        :lineColor="mapPolygonData.lineColor"
        :lineWidth="mapPolygonData.lineWidth"
        :lineDash="mapPolygonData.lineDash"
        :customAttribute="{ id: item.id, areaId: item.areaId }"
        @handleClickPolygon="handleClickPolygon"
      ></MapPolygon>

      <!-- 循环使用的方法 标记点-->
      <MapIconMark
        v-for="(item, index) in pointlist"
        :position="[item.longitude, item.latitude]"
        :icon="iconImg"
        :key="index"
        :customAttribute="{ ...item }"
        @handleClickIcon="handleClickIcon"
      ></MapIconMark>

      <!-- 覆盖物 -->
      <!-- <DeviceMarker
        v-if="roomDeviceList.length"
        ref="deviceMarker"
        :list="roomDeviceList"
        :mode="0"
        :show="1"
      /> -->

      <pop :pop.sync="imgPop" @beforeClose="hideImgPop" @beforeOpen="showImgPop">
        <div class="flex_center">
          <ElImage
            :imgSet="{
              src: imgPop.imgUrl,
              width: 350,
              height: 400,
              errorSrc: 'icon-morenHeader',
              list: []
            }"
          ></ElImage>
        </div>
      </pop>
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import CusMapSearch from '@/components/BasicComponents/CusMapSearch'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import Tab from '@/components/BasicComponents/Tab'

import MapPolygon from '@/components/Map/OnlineMap/MapPolygon'
import MapIconMark from '@/components/Map/OnlineMap/MapIconMark'
import MapPopup from '@/components/Map/OnlineMap/MapPopup'
import TemplateTable from '@/components/VisualComponents/Table'
import PersonPop from '@/views/common/warn/BorderWarn/PersonPop'
import BorderPop from '@/views/common/warn/BorderWarn/BorderPop'
// import DeviceMarker from '@/components/Map/OnlineMap/device-marker'

import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'
import { gps } from '@/utils/resetPosition'
import { mapActions } from 'vuex'

import {
  queryAllBorderArea,
  queryWarnRuleById,
  delWarnRuleById,
  queryImportantTrack,
  queryWarnPersonByPosition,
  radioDisturbing
} from '@/api/warn'

const areaInfos = [
  {
    label: '发送人员',
    prop: 'sendPeopleName'
  },
  {
    label: '防控人群',
    prop: 'warnPerson'
  },
  // {
  //   label: '场所',
  //   prop: 'placeNames'
  // },
  {
    label: '设备类型',
    prop: 'deviceTypeNames'
  }
]

const personInfos = [
  {
    label: '预警时间',
    prop: 'triggerTime'
  },
  {
    label: '预警条件',
    prop: 'trigger'
  },
  {
    label: '身份证号',
    prop: 'certificateNumber'
  },
  {
    label: '人员类型',
    prop: 'personTypeName'
  },
  {
    label: '边界名称',
    prop: 'warningName'
  },
  {
    label: '所在场所',
    prop: 'placeName'
  }
]

const iconMiniData = [
  { type: 'wifi', text: '公共场所上网审计', url: 'icon-tab-small-1.png' },
  { type: 'wifi', text: '室外WIFI探针', url: 'icon-tab-small-3.png' },
  { type: 'wifi', text: '室外侦码采集', url: 'icon-tab-small-4.png' },
  { type: 'wifi', text: '人脸识别摄像头', url: 'icon-tab-small-5.png' },
  { type: 'wifi', text: '人脸门禁', url: 'icon-tab-small-6.png' },
  { type: 'wifi', text: '车牌识别摄像头', url: 'icon-tab-small-7.png' },
  { type: 'wifi', text: '身份证阅读器', url: 'icon-tab-small-8.png' },
  { type: 'wifi', text: '其他', url: 'icon-tab-small-9.png' },
  { type: 'wifi', text: '防控人员', url: 'map_marker_0.png' }
]
const tabNav = {
  list: [
    {
      name: '预警历史',
      icon: 'txt-clcok',
      isActived: false,
      key:'border_warn:warning_history'
    },
    {
      name: '新建边界',
      icon: 'txt-clcok',
      isActived: false,
      key:'border_warn:build_new_border'
    }
  ]
}
export default {
  components: {
    CusMapSearch,
    Tab,
    MapPolygon,
    MapPopup,
    CusDrawerBottom,
    TemplateTable,
    MapIconMark,
    PersonPop,
    BorderPop,
    // DeviceMarker,
    Pop,
    ElImage
  },
  mixins: [AmapMixins],
  data () {
    return {
      imgPop: {
        show: false,
        imgUrl: '',
        title: '图片',
        width: '600px',
        top: '180px'
      },
      iconImg: require('@/assets/img/map_marker_0.png'), // 文件地址 String[url]
      pointlist: [],
      oldAreaList: [],
      params: {
        searchKey: ''
      },
      personTable: {
        tableData: [],
        columns: Object.freeze([
          {
            label: '姓名',
            prop: 'personName',
            width: '170'
          },
          {
            label: '性别',
            prop: 'sex',
            width: '120'
          },
          {
            label: '证件号',
            prop: 'certificateNumber',
            width: '200'
          },
          {
            label: '预警条件',
            prop: 'trigger',
            minWidth: '100',
            isClickProp: 'imgUrl',
            type: 'click',
            click: this.handleLookImg
          },
          {
            label: '预警时间',
            prop: 'triggerTime',
            width: '200'
          },
          {
            label: '所在场所',
            prop: 'placeName',
            minWidth: '170'
          }
        ]),
        curPage: 1,
        total: 0,
        params: {
          pageNum: 1,
          pageSize: 5,
          longitude: '',
          latitude: ''
        }
      },
      CusDrawerBottom: {
        show: false,
        title: '人员列表',
        handleClose: this.handleClosePerson
      },
      radioWarn: '',
      // 弹出窗体图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false // 弹窗显隐 Boolean，必须，默认为 true
      },
      // 弹出窗体图层数据
      areaMapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false // 弹窗显隐 Boolean，必须，默认为 true
      },
      // 多边形图层数据
      mapPolygonData: {
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
      cusInput: { placeholder: '请输入人员姓名/身份证/属性', searchKey: '' },
      value: '',
      // tabNav: {
      //   list: [
      //     {
      //       name: '预警历史',
      //       icon: 'txt-clcok',
      //       isActived: false
      //     },
      //     {
      //       name: '新建边界',
      //       icon: 'txt-clcok',
      //       isActived: false
      //     }
      //   ]
      // },
      iconMiniData: Object.freeze(iconMiniData),
      personInfos: Object.freeze(personInfos),
      areaInfos: Object.freeze(areaInfos),
      curAreaInfo: {},
      curPersonInfo: {},
      rowData: {},
      outerArea: [],
      innerArea: []
    }
  },

  computed: {
    // ...mapState('Map', {
    //   roomDeviceList: 'roomDeviceList'
    // }),
    areaLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('polygon') ?? []
    },
    personLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('marker') ?? []
    },
    height () {
      return (this.personTable.tableData.length + 1.5) * 40
    },
    tabNav () {
      return {
        list: this.$backPermissionsArray(tabNav.list)
      }
    },
  },

  created () {
    this.getDeviceList()
    this.loadArea(true)
    this.loadPerson(true)

    this.personTable.columns = [
      {
        label: '免打扰状态',
        prop: 'noDisturbingStatus',
        width: '340',
        type: 'radio',
        list: [
          {
            label: '1小时',
            value: '1'
          },
          {
            label: '6小时',
            value: '6'
          },
          {
            label: '12小时',
            value: '12'
          },
          {
            label: '24小时',
            value: '24'
          },
          {
            label: '关闭',
            value: '0'
          }
        ],
        event: this.tableRadioChange
      },
      ...this.personTable.columns
    ]
  },

  mounted () {
    this.bus.$on('WSMessage', this.dealMessage)
  },

  beforeDestroy () {
    this.bus.$off('WSMessage')
  },

  methods: {
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList'
    }),
    hideImgPop () {
      this.imgPop.show = false
    },
    showImgPop () {
      this.imgPop.show = true
    },
    handleLookImg (row) {
      this.imgPop.imgUrl = window.location.origin + '/' + row.imgUrl
      this.showImgPop()
      console.log(
        '🚀 ~ file: index.vue ~ line 350 ~ handleLookImg ~ this.imgPop.imgUrl',
        this.imgPop.imgUrl
      )
    },
    // 跳转 - 编辑区域
    areaHandleEdit (item) {
      this.$router.push({
        name: 'BorderWarnForm',
        query: { id: item.id }
      })
    },

    // 人员列表分页
    handleCurrentChange (pageNum) {
      this.personTable.params.pageNum = pageNum
      this.getPersonInfoByPosition()
    },

    // 关闭人员列表
    handleClosePerson () {
      this.CusDrawerBottom.show = false
    },

    // 地图icon点击
    handleClickIcon (event, data) {
      this.areaMapPopupData.show = false
      this.mapPopupData.position = [event.lnglat.lng, event.lnglat.lat]

      this.personTable.curPage = 1
      this.personTable.params.pageNum = 1
      this.personTable.params.longitude = data.deviceLongitude
      this.personTable.params.latitude = data.deviceLatitude

      this.getPersonInfoByPosition()
    },

    // 地图多边形点击
    handleClickPolygon (event, data) {
      this.mapPopupData.show = false
      this.CusDrawerBottom.show = false
      // 当前点击经纬度
      this.areaMapPopupData.position = [event.lnglat.lng, event.lnglat.lat]
      this.areaMapPopupData.show = true
      this.getAreaInfoById(data.areaId)
    },

    // 查询人员详情by经纬度
    getPersonInfoByPosition () {
      queryWarnPersonByPosition({
        ...this.personTable.params,
        warningType: 'warningBoundary'
      }).then(res => {
        if (!res) {
          this.$messageTip.error('未找到相关人物信息！')
          return false
        }

        const list = res.content

        if (res.totalSize === 1) {
          this.mapPopupData.show = true
          this.curPersonInfo = { ...list[0] }
          this.radioWarn = this.curPersonInfo.noDisturbingStatus || '0'
        } else {
          this.CusDrawerBottom.show = true
          this.personTable.tableData = [...list]
          this.personTable.total = res.totalSize
        }
      })
    },

    // 查询区域详情byId
    getAreaInfoById (id) {
      // 查询 区域详情
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']

      queryWarnRuleById(id).then(res => {
        if (!res) return
        this.curAreaInfo = { ...res }
        this.curAreaInfo.sendPeopleName =
          this.curAreaInfo.receivers && this.curAreaInfo.receivers.length
            ? this.curAreaInfo.receivers
              .map(_c => {
                if (_c.receiverId === 0) {
                  return '全部'
                } else {
                  return _c.receiverName || '--'
                }
              })
              .join('；')
            : ''

        this.curAreaInfo.deviceTypeNames = this.curAreaInfo.deviceTypes?.map(_c => {
          return deviceTypeListMap[_c] || '其他'
        })
        this.curAreaInfo.deviceTypeNames = this.curAreaInfo.deviceTypeNames
          .filter(_c => Boolean(_c))
          .join('；')

        this.curAreaInfo.warnPerson =
          this.curAreaInfo.personList?.map(_c => _c.personName).join('；') ?? '--'
      })
    },

    // 删除区域
    handleDelArea (item) {
      delWarnRuleById(item.id).then(() => {
        this.$messageTip.success('删除成功！')
        this.areaMapPopupData.show = false
        const layerList = this.areaLayers.filter(element => {
          return element.getExtData().areaId === item.id
        })
        if (layerList.length > 0) {
          layerList.forEach(_c => {
            this.$store.state.Common.cMap?.remove(_c)
          })
        }
      })
    },

    // 搜索框查询
    handleSearch () {
      this.params.searchKey = this.cusInput.searchKey
      this.loadArea()
      this.loadPerson()
    },

    // 加载所有人员经纬度
    loadPerson (isFirst) {
      queryImportantTrack({ ...this.params, warningType: 'warningBoundary' }).then(res => {
        if (!res) return
        this.mapPopupData.show = false
        const newPointlist = res?.map((_c) => {
          return {
            longitude: _c.longitude,
            latitude: _c.latitude,
            id: _c.longitude + '_' + _c.latitude,
            deviceLongitude: _c.longitude,
            deviceLatitude: _c.latitude
          }
        })

        if (isFirst) {
          if (this.personLayers.length) {
            this.personLayers.forEach(ele => {
              this.$store.state.Common.cMap?.remove(ele)
            })
          }
          this.pointlist = [...newPointlist]
          return
        }

        this.setState(this.personLayers, newPointlist)
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
    // 加载区域
    loadArea (isfirst) {
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

        if (isfirst) {
          this.oldAreaList = drawList
          this.outerArea = outList
          this.innerArea = inList
          return
        }

        const list = [...drawList, ...outList, ...inList]
        this.setState(this.areaLayers, list)
      })
    },

    // 显示 or 隐藏
    setState (mapList, list = []) {
      if (!Array.isArray(list)) return
      mapList.forEach(element => {
        const { id } = element.getExtData()
        const index = list.findIndex(_c => _c.id === id)
        if (index === -1) {
          element.hide()
        } else {
          element.show()
        }
      })
    },

    // 预警 开关
    tableRadioChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.certificateNumber,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningBoundary'
      }).then(() => {
        this.getPersonInfoByPosition()
      })
    },

    // 预警 开关
    radioChange (e) {
      radioDisturbing({
        personId: this.curPersonInfo.certificateNumber,
        noDisturbingStatus: e,
        warningType: 'warningBoundary'
      })
    },

    // 关闭人员弹出窗体事件
    mapPopupClose () {
      this.mapPopupData.show = false
    },

    // 关闭区域弹出窗体事件
    areaMapPopupClose () {
      this.areaMapPopupData.show = false
    },

    /** tab 切换点击 */
    TabHandleClick (index) {
      this.tabNav.list = this.tabNav.list.map((i, idx) => {
        i.isActived = false
        if (idx == index) {
          i.isActived = true
        }
        return i
      })
      if (index == 0) {
        this.$router.push({ name: 'BorderWarnHistory' })
      } else if (index == 1) {
        this.$router.push({ name: 'BorderWarnForm' })
      }
    },

    dealMessage (newMessagrObj) {
      const _that = this
      try {
        if (newMessagrObj.warnTypeEnum === 'WARNING_BOUNDARY') {
          _that.loadPerson(true)
        }
      } catch (err) {
        console.log('err', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 地图搜索
.AddressSearch {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 99;
  display: flex;
}

/deep/.el-input__inner {
  border-radius: 0 !important;
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647) !important;
  &:hover {
    border-color: rgba(34, 143, 254, 0.6) !important;
  }
  &:focus {
    border-color: #228ffe !important;
  }
}

.info_item {
  display: flex;
  align-items: center;
  line-height: 30px;
  color: var(--base-text-color-to-999999);
  .info_item_value {
    flex: 1;
  }
}

/deep/.table-wrapper .el-table thead tr {
  height: 45px !important;
}

/deep/.pagination {
  margin-top: 0 !important;
}
</style>
