<template>
  <div class="map_con">
    <ol-map id="map" class="map" style="height: 100%">
      <div class="AddressSearch" v-permission="'area_warn:search'">
        <CusMapSearch
          :cusInput="cusInput"
          @handleSearch="handleSearch"
          @handleClear="cusInput.searchKey = ''"
        ></CusMapSearch>

        <!-- 下拉 -->
        <!-- <div class="AddressSearch_select">
          <el-select
            @change="handleSearch"
            v-model="params.personType"
            placeholder="请选择人员类型"
          >
            <el-option label="全部" value=""> </el-option>
            <el-option
              v-for="item in personTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div> -->
      </div>

      <!-- 类型列表 -->
      <ul class="Categorys">
        <li v-for="item in checks" :key="item.label" @click="handleClick(item)">
          <Cuscategory :curItem="item"></Cuscategory>
        </li>
      </ul>

      <!--  -->
      <!-- 切换 历史/规则 -->
      <Tab :tabNav.sync="tabNav" @handleClick="TabHandleClick" />

      <!-- 图标控件 -->
      <map-control :list="iconMiniData" />

      <!-- 弹出窗体 -->
      <MapPopup
        :position="mapPopupData.position"
        :offset="mapPopupData.offset"
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
        :offset="areaMapPopupData.offset"
        :mapShow="areaMapPopupData.show"
        @close="areaMapPopupClose"
      >
        <AreaPop
          :curAreaInfo="curAreaInfo"
          :areaInfos="areaInfos"
          @handleDelArea="handleDelArea"
        ></AreaPop>
      </MapPopup>

      <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom"  :curStyle="{ width: 'calc(100vw - 155px)' }">
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

      <div v-if="mapRendercomplete">
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
      </div>

      <!-- 循环使用的方法 标记点-->
      <div v-if="mapRendercomplete">
        <MapIconMark
          v-for="(item, index) in pointlist"
          :position="[item.longitude, item.latitude]"
          :icon="iconImg"
          :key="index"
          :customAttribute="{ ...item }"
        ></MapIconMark>
      </div>

      <Pop :pop.sync="imgPop" @beforeClose="hideImgPop" @beforeOpen="showImgPop">
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
      </Pop>
    </ol-map>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import CusMapSearch from '@/components/BasicComponents/CusMapSearch'
import Cuscategory from '@/components/BasicComponents/Cuscategory'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import Tab from '@/components/BasicComponents/Tab'

import MapPolygon from '@/components/Map/OfflineMap/MapPolygon'
import MapIconMark from '@/components/Map/OfflineMap/MapIconMark'
import MapPopup from '@/components/Map/OfflineMap/MapPopup'
import TemplateTable from '@/components/VisualComponents/Table'

import PersonPop from '@/views/common/warn/components/PersonPop'
import AreaPop from '@/views/common/warn/AreaWarn/AreaPop'
import { gps } from '@/utils/resetPosition'

import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'

import { mapState } from 'vuex'

import {
  queryAllArea,
  queryWarnRuleById,
  delWarnRuleById,
  queryWarnPersons,
  queryWarnPersonByPosition,
  radioDisturbing,
  getWarnLevelNumber
} from '@/api/warn'

const checks = [
  {
    num: 0,
    color: '#F03F58',
    label: '重点防控',
    isActive: true,
    value: 'EMPHASIS_LEVEL'
  },
  {
    num: 0,
    color: '#D8B733',
    label: '中等防控',
    isActive: true,
    value: 'MEDIUM_LEVEL'
  },
  {
    num: 0,
    color: '#4596E6',
    label: '一般防控',
    isActive: true,
    value: 'GENERAL_LEVEL'
  }
]

const levelColor = {
  GENERAL_LEVEL: 'rgba(69, 150, 230,0.3)',
  MEDIUM_LEVEL: 'rgba(216, 183, 51,0.3)',
  EMPHASIS_LEVEL: 'rgba(240, 63, 88,0.3)'
}

const areaInfos = [
  {
    label: '区域类型',
    prop: 'fenceTypeName'
  },
  {
    label: '发送人员',
    prop: 'sendPeopleName'
  },
  {
    label: '防控人群',
    prop: 'warnPerson'
  },
  {
    label: '场所',
    prop: 'placeNames'
  },
  {
    label: '设备类型',
    prop: 'deviceTypeNames'
  },
  {
    label: '数据类型',
    prop: 'dataTypeString'
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
    label: '所在场所',
    prop: 'placeName'
  }
]

const iconMiniData = [
  { type: 'wifi', text: '重点防控', url: 'warning-icon-4.png' },
  { type: 'wifi', text: '中等防控', url: 'warning-icon-5.png' },
  { type: 'wifi', text: '一般防控', url: 'warning-icon-6.png' },
  { type: 'wifi', text: '防控人员', url: 'map_marker_0.png' }
]
const tabNav = {
  list: [
    {
      name: '预警历史',
      icon: 'txt-clcok',
      isActived: false,
      path: 'AreaWarnRules',
      key: 'area_warn:warning_history'
    },
    {
      name: '新建区域',
      icon: 'txt-clcok',
      isActived: false,
      path: 'AreaWarnForm',
      key: 'area_warn:build_new_area'
    }
  ]
}

export default {
  components: {
    CusMapSearch,
    Cuscategory,
    Tab,
    MapPolygon,
    MapPopup,
    CusDrawerBottom,
    TemplateTable,
    MapIconMark,
    PersonPop,
    AreaPop,
    Pop,
    ElImage
  },
  mixins: [mapMixin],
  data () {
    return {
      imgPop: {
        show: false,
        imgUrl: '',
        title: '图片',
        width: '600px',
        top: '180px'
      },
      mapRendercomplete: false,
      iconImg: require('@/assets/img/map_marker_0.png'), // 文件地址 String[url]
      pointlist: [],
      oldAreaList: [],
      params: {
        personType: '',
        fenceLevel: 'GENERAL_LEVEL,MEDIUM_LEVEL,EMPHASIS_LEVEL',
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
            label: '人员类型',
            prop: 'personTypeName',
            width: '170'
          },
          {
            label: '防控级别',
            prop: 'fenceLevelStr',
            width: '150'
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
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      // 弹出窗体图层数据
      areaMapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      // 多边形图层数据
      mapPolygonData: {
        pointlist: [],
        fillColor: 'rgba(69, 150, 230,0.3)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        lineColor: 'rgba(69, 150, 230,0.3)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
      },
      checks: [],
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
      //       name: '新建区域',
      //       icon: 'txt-clcok',
      //       isActived: false
      //     }
      //   ]
      // },
      iconMiniData: Object.freeze(iconMiniData),
      areaInfos: Object.freeze(areaInfos),
      personInfos: Object.freeze(personInfos),
      curAreaInfo: {},
      curPersonInfo: {},
      rowData: {}
    }
  },

  computed: {
    ...mapState('trackWarning', {
      levelObj: 'levelObj'
    }),
    ...mapState('Dict', {
      personTypeList: 'personTypeList'
    }),
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_ === 'map-polygon') : []
    },
    personLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_ === 'map-icon-mark') : []
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
    this.bus.$on('rendercomplete', () => {
      this.mapRendercomplete = true
    }) // 监听地图初始化;

    this.checks = checks.map(_c => {
      _c.isActive = true
      return _c
    })

    this.bus.$on('olMapClick', this.MapClick)
    this.loadArea(true)
    this.loadPerson(true)
    this.loadNumber()

    // 初始赋值多选框
    this.params.fenceLevel = this.checks
      .filter(_c => _c.isActive)
      .map(_c => _c.value)
      .join(',')

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
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    next()
  },
  beforeDestroy () {
    this.bus.$off('rendercomplete')
    // this.bus.$off('olMapClick')
    this.bus.$off('WSMessage')
    if (this.$store.state.Ol.oMap) {
      const layers = this.$store.state.Ol.oMap.getLayers().getArray()
      layers.forEach(element => {
        this.$store.state.Ol.oMap.removeLayer(element)
      })
    }
  },

  methods: {
    hideImgPop () {
      this.imgPop.show = false
    },
    showImgPop () {
      this.imgPop.show = true
    },
    handleLookImg (row) {
      this.imgPop.imgUrl = window.location.origin + '/' + row.imgUrl
      this.showImgPop()
    },

    loadNumber () {
      getWarnLevelNumber().then(res => {
        this.checks[0].num = res?.find(_c => _c.fencelevel === 'EMPHASIS_LEVEL')?.count ?? 0
        this.checks[1].num = res?.find(_c => _c.fencelevel === 'MEDIUM_LEVEL')?.count ?? 0
        this.checks[2].num = res?.find(_c => _c.fencelevel === 'GENERAL_LEVEL')?.count ?? 0
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

    // 地图点击
    MapClick (evt) {
      // console.log('组件接收到了地图bus传过来的点击事件',evt);
      // 获取地图上的feature
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_

      if (curFeature.name === 'el-mapIconMark') {
        this.areaMapPopupData.show = false
        this.mapPopupData.position = evt.coordinate
        this.curFeature = { ...feature.values_ }
        this.personTable.curPage = 1
        this.personTable.params.pageNum = 1
        this.personTable.params.longitude = curFeature.customAttribute.deviceLongitude
        this.personTable.params.latitude = curFeature.customAttribute.deviceLatitude

        this.getPersonInfoByPosition()
      } else if (curFeature.name === 'el-mapPolygon') {
        this.mapPopupData.show = false
        this.CusDrawerBottom.show = false
        // 当前点击经纬度
        this.areaMapPopupData.position = evt.coordinate
        this.areaMapPopupData.show = true
        this.getAreaInfoById(curFeature.customAttribute.id)
      }
    },

    // 查询人员详情by经纬度
    getPersonInfoByPosition () {
      queryWarnPersonByPosition({ ...this.personTable.params, warningType: 'warningFence' }).then(
        res => {
          if (!res) {
            this.$messageTip.error('未找到相关人物信息！')
            return false
          }

          const list = res.content.map(element => {
            element.levelObj = this.checks.find(_c => _c.value === this.curPersonInfo.fenceLevel)
            element.fenceLevelStr = this.levelObj[element.fenceLevel]
            return element
          })

          if (res.totalSize === 1) {
            this.mapPopupData.show = true
            this.curPersonInfo = { ...list[0] }
            this.radioWarn = this.curPersonInfo.noDisturbingStatus || '0'
          } else {
            this.CusDrawerBottom.show = true
            this.personTable.tableData = [...list]
            this.personTable.total = res.totalSize
          }
        }
      )
    },

    // 查询区域详情byId
    getAreaInfoById (id) {
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']
      // 查询 区域详情
      queryWarnRuleById(id).then(res => {
        // console.log(res)
        if (!res) return
        this.curAreaInfo = { ...(res.fences?.[0] ?? {}), ...res }
        // console.log(this.curAreaInfo)
        let tempArr = []
        if (this.curAreaInfo.dataTypeList) {
          this.curAreaInfo.dataTypeList.forEach(item => {
            this.dataTypeList.forEach(e => {
              if (e.srcNameEn === item) {
                tempArr.push(e.srcNameCn)
              }
            })
          })
        }
        // console.log(tempArr.join(';'))
        this.curAreaInfo.dataTypeString = tempArr.join(';')
        this.curAreaInfo.levelObj = this.checks.find(_c => _c.value === this.curAreaInfo.fenceLevel)
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
        this.curAreaInfo.placeNames = this.curAreaInfo.placeName?.join('；') ?? ''
        this.curAreaInfo.deviceTypeNames =
          this.curAreaInfo.deviceTypes?.map(_c => {
            return deviceTypeListMap[_c] || '其他'
          }) ?? []
        this.curAreaInfo.deviceTypeNames = this.curAreaInfo.deviceTypeNames
          .filter(_c => Boolean(_c))
          ?.join('；')
        this.curAreaInfo.warnPerson = this.curAreaInfo.personList
          ?.map(_c => _c.personName)
          ?.join('；')
      })
    },

    // 删除区域
    handleDelArea (id) {
      delWarnRuleById(id).then(() => {
        this.$messageTip.success('删除成功！')
        this.areaMapPopupData.show = false

        setTimeout(() => {
          const area = this.areaLayers.find(_c => _c.get('id') === id)
          this.$store.state.Ol.oMap?.removeLayer(area)
        }, 0)
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
      queryWarnPersons({ ...this.params, warningType: 'warningFence' }).then(res => {
        const newPointlist =
          res?.map((_c) => {
            _c.deviceLongitude = _c.longitude
            _c.deviceLatitude = _c.latitude
            _c.id = _c.longitude + '_' + _c.latitude
            const positionObj = gps.GcjWGSConversion({
              Lon: _c.longitude,
              Lat: _c.latitude,
              type: 1
            })
            _c.longitude = positionObj.longitude
            _c.latitude = positionObj.latitude

            return _c
          }) ?? []

        if (isFirst) {
          this.pointlist = JSON.parse(JSON.stringify(newPointlist))
          return
        }

        this.setState(this.personLayers, newPointlist)
      })
    },

    // 加载区域
    loadArea (isfirst) {
      queryAllArea(this.params).then(res => {
        const areaList = res?.map(_c => {
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
        })

        if (isfirst) {
          this.oldAreaList = JSON.parse(JSON.stringify(areaList))
          return
        }
        this.setState(this.areaLayers, areaList)
      })
    },

    // 显示 or 隐藏
    setState (mapList, list) {
      mapList.forEach(element => {
        const id = element.get('id')
        const index = list.findIndex(_c => _c.id === id)
        if (index === -1) {
          element.setVisible(false)
        } else {
          element.setVisible(true)
        }
      })
    },

    // 预警 开关
    tableRadioChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.certificateNumber,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningFence'
      }).then(() => {
        this.getPersonInfoByPosition()
      })
    },

    // 预警 免打扰模式
    radioChange (e) {
      radioDisturbing({
        personId: this.curPersonInfo.certificateNumber,
        noDisturbingStatus: e,
        warningType: 'warningFence'
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

    // 复选框 分类切换
    handleClick (item) {
      const index = this.checks.findIndex(_c => _c.label === item.label)
      this.checks[index].isActive = !this.checks[index].isActive

      this.params.fenceLevel = this.checks
        .filter(_c => _c.isActive)
        .map(_c => _c.value)
        .join(',')
      if (!item.isActive && item.value === this.curAreaInfo.warningLevel) {
        // 关闭区域时，同时关闭区域详情。不然会出现关闭了区域没关闭区域详情的情况
        this.areaMapPopupClose()
      }
      this.loadArea()
      this.loadPerson()
    },

    /** tab 切换点击 */
    TabHandleClick (index, item) {
      // this.tabNav.list = this.tabNav.list.map((i, idx) => {
      //   i.isActived = false
      //   if (idx == index) {
      //     i.isActived = true
      //   }
      //   return i
      // })
      this.$router.push({ name: item.path })
      // if (index == 0) {
      //   this.$router.push({ name: 'AreaWarnRules' })
      // } else if (index == 1) {
      //   this.$router.push({ name: 'AreaWarnForm' })
      // }
    },

    dealMessage (newMessagrObj) {
      const _that = this
      try {
        if (newMessagrObj.warnTypeEnum === 'WARN_FENCE') {
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
  .AddressSearch_select {
    background-color: rgba(39, 52, 77, 0.87);
    margin-left: 16px;
    width: 160px;
    // .el-select{

    // }
  }
}

/deep/.el-input__inner {
  background: var(--el-select-input-bg);
  border-radius: 0 !important;
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647) !important;
  &:hover {
    border-color: rgba(34, 143, 254, 0.6) !important;
  }
  &:focus {
    border-color: #228ffe !important;
  }
}

.Categorys {
  position: absolute;
  top: 22px;
  left: 37%;
  z-index: 99;
  display: flex;
  > li {
    margin-right: 16px;
  }
}

.info_item {
  display: flex;
  align-items: center;
  line-height: 30px;
  color: var(--base-text-color-to-999999);
  .info_item_value {
    flex: 1 1 auto;
  }
}

/deep/.table-wrapper .el-table thead tr {
  height: 45px !important;
}

/deep/.pagination {
  margin-top: 0 !important;
}
</style>
