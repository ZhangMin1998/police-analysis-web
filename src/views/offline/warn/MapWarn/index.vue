<template>
  <div class="map_con">
    <TabsMapWithList
      :activeName="active"
      @clickTab='clickTab'
    ></TabsMapWithList>
    <MapWarnHistory v-show='active === "list"'></MapWarnHistory>
    <ol-map id="map" class="map" style="height: 100%" v-show='active === "map"'>
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '64px', height: '90%' }"
        :drawerTop="{width:imgWidth,height:'5px'}"
        :canTraction="true"
        :moveLeft="moveLeft"
        :width="handleWidth()"
        @handleClick="DrawerHandleClick"
      >
        <CusTitle title="预警消息"></CusTitle>

        <Messages
          :list="messageList"
          :attrList="attrList"
          :attrTrackList="attrTrackList"
          :messageState="messageState"
          @discuzScroll="loadMore"
          @handleClick="handleClickMessage"
        ></Messages>
      </drawer>

      <div class="AddressSearch" v-permission="'map_warn:search'">
        <CusMapSearch
          :cusInput="cusInput"
          @handleSearch="handleSearch"
          @handleClear="cusInput.searchKey = ''"
        ></CusMapSearch>
      </div>

      <!-- 类型列表 -->
      <ul class="Categorys">
        <li v-for="item in checks" :key="item.label" @click="handleClick(item)">
          <Cuscategory :curItem="item"></Cuscategory>
        </li>
      </ul>

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
        <PersonPop :curPersonInfo="curPersonInfo" :personInfos="attrList"> </PersonPop>
      </MapPopup>

      <CusDrawerBottom :CusDrawerBottom.sync="CusDrawerBottom" :curStyle="{ width: 'calc(100vw - 160px)' }">
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

      <!-- 循环使用的方法 标记点-->
      <MapIconMark
        v-for="(item, index) in messageList"
        :position="item.location"
        :icon="item.iconImg"
        :key="index + '_' + JSON.stringify(item.location)"
        :customAttribute="{ ...item }"
        :zindexList="{
          EMPHASIS_LEVEL: 1000,
          MEDIUM_LEVEL: 900,
          GENERAL_LEVEL: 800,
          prop: 'warningLevel'
        }"
      ></MapIconMark>
    </ol-map>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import CusMapSearch from '@/components/BasicComponents/CusMapSearch'
import Cuscategory from '@/components/BasicComponents/Cuscategory'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import Tab from '@/components/BasicComponents/Tab'

import MapIconMark from '@/components/Map/OfflineMap/MapIconMark'
import MapPopup from '@/components/Map/OfflineMap/MapPopup'
import TemplateTable from '@/components/VisualComponents/Table'

import PersonPop from '@/views/common/warn/components/PersonPop'
import Messages from '@/views/common/warn/MapWarn/Index/Messages'
import { gps } from '@/utils/resetPosition'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import MapWarnHistory from '../../../common/warn/MapWarn/History/index.vue'

import { mapState } from 'vuex'

import {
  queryWarnFeatureHistoryPager,
  queryWarnPersonByPosition,
  getMapWarnLevelNumber
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

const iconMiniData = [
  { type: 'wifi', text: '重点防控', url: 'warning-icon-9.png' },
  { type: 'wifi', text: '中等防控', url: 'warning-icon-8.png' },
  { type: 'wifi', text: '一般防控', url: 'warning-icon-7.png' }
]

// 属性显示
const attrList = [
  {
    prop: 'warningTypeName',
    label: '预警类型'
  },
  {
    prop: 'triggerStr',
    label: '类型/数值'
  },
  {
    prop: 'triggerTime',
    label: '发现时间'
  },
  {
    prop: 'placeName',
    label: '场所名称'
  },
  {
    prop: 'placeAddress',
    label: '场所详址'
  }
]

// 属性显示
const attrTrackList = [
  {
    prop: 'warningTypeName',
    label: '预警类型'
  },
  {
    prop: 'personName',
    label: '预警人员'
  },
  {
    prop: 'triggerTime',
    label: '发现时间'
  },
  {
    prop: 'placeName',
    label: '场所名称'
  },
  {
    prop: 'placeAddress',
    label: '场所详址'
  }
]

const iconImg = {
  EMPHASIS_LEVEL: require('@/assets/img/warning-icon-9.png'),
  MEDIUM_LEVEL: require('@/assets/img/warning-icon-8.png'),
  GENERAL_LEVEL: require('@/assets/img/warning-icon-7.png')
}

const tableCols = [
  {
    prop: 'placeAddress',
    label: '场所详址',
    minWidth: '100'
  },
  {
    prop: 'warningTypeName',
    label: '预警类型',
    minWidth: '80'
  },
  {
    prop: 'warningName',
    label: '预警名称',
    minWidth: '100'
  },
  {
    prop: 'triggerStr',
    label: '类型/数值',
    minWidth: '100'
  },
  {
    prop: 'triggerTime',
    label: '发现时间',
    minWidth: '100'
  },
  {
    label: '警报级别',
    prop: 'warningLevel',
    minWidth: '80',
    type: 'status',
    statuList: [
      { status: 'EMPHASIS_LEVEL', color: 'F03F58', text: '重点防控' },
      { status: 'MEDIUM_LEVEL', color: 'D8B733', text: '中等防控' },
      { status: 'GENERAL_LEVEL', color: '4596E6', text: '一般防控' }
    ]
  },
  {
    prop: 'placeName',
    label: '场所名称',
    minWidth: '100'
  }
]

const tabNav = {
  list: [
    // {
    //   name: '预警历史',
    //   icon: 'txt-clcok',
    //   isActived: false,
    //   path: 'History',
    //   key: 'map_warn:warning_history'
    // },
    {
      // name: '规则列表',
      name: '新增预警',
      icon: 'txt-clcok',
      isActived: false,
      path: 'Rules',
      key: 'map_warn:rule_list'
    }
  ]
}

export default {
  components: {
    Drawer,
    CusMapSearch,
    Cuscategory,
    Tab,
    MapPopup,
    CusDrawerBottom,
    TemplateTable,
    MapIconMark,
    PersonPop,
    Messages,
    TabsMapWithList,
    MapWarnHistory
  },
  mixins: [mapMixin],
  data () {
    return {
      moveLeft: '-374px',
      messageState: '',
      attrList: Object.freeze(attrList),
      attrTrackList: Object.freeze(attrTrackList),
      drawer: {
        isShow: true
      },
      messageList: [],
      params: {
        pageNum: 1,
        pageSize: 20,
        warningLevel: 'GENERAL_LEVEL,MEDIUM_LEVEL,EMPHASIS_LEVEL',
        searchKey: '',
        totolPages: '',
        startTime: '',
        endTime: ''
      },
      personTable: {
        tableData: [],
        columns: tableCols,
        curPage: 1,
        total: 0,
        params: {
          pageNum: 1,
          pageSize: 5,
          longitude: '',
          latitude: '',
          startTime: '',
          endTime: ''
        }
      },
      CusDrawerBottom: {
        show: false,
        title: '人员列表',
        handleClose: this.handleClosePerson
      },
      // 弹出窗体图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
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
      //       name: '规则列表',
      //       icon: 'txt-clcok',
      //       isActived: false
      //     }
      //   ]
      // },
      iconMiniData: Object.freeze(iconMiniData),
      curPersonInfo: {},
      rowData: {},
      active: 'map',
      imgWidth: ''
    }
  },

  computed: {
    ...mapState('trackWarning', {
      levelObj: 'levelObj'
    }),
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
    // 删除规则子tab的选中状态
    window.localStorage.removeItem('curMapWarnCurTab')
    this.params.endTime = new Date().getTime()
    this.params.startTime = parseInt(this.params.endTime + 24 * 3600 * 1000 * -2)
    this.checks = checks.map(_c => {
      _c.isActive = true
      return _c
    })

    this.bus.$on('olMapClick', this.MapClick)
    this.loadPerson()
    this.loadNumber()

    // 初始赋值多选框
    this.params.warningLevel = this.checks
      .filter(_c => _c.isActive)
      .map(_c => _c.value)
      .join(',')
  },

  mounted () {
    this.bus.$on('WSMessage', this.dealMessage)
    this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    next()
  },
  beforeDestroy () {
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
    clickTab (value) {
      this.active = value
    },
    handleWidth (){
      console.log(window.screen.width);
      if(window.screen.width > 1300){
        return this.$pxToRem(380)
      }else{
        return this.$pxToRem(420)
      }
    },
    // 点击跳转中心经纬度
    handleClickMessage (row) {
      if (!row.location[0] || !row.location[1] || row.location[0] == 0 || row.location[1] == 0) {
        this.$messageTip.error('抱歉，该预警未上传经纬度无法定位到地图位置！')
        return false
      }

      this.bus.$emit('setViewCenter', {
        position: row.location,
        zoom: 16,
        isMark: false,
        isPos: false
      })
    },

    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },

    // 加载防控级别数量
    loadNumber () {
      getMapWarnLevelNumber({
        startTime: this.params.startTime,
        endTime: this.params.endTime
      }).then(res => {
        this.checks[0].num = res?.find(_c => _c.warninglevel === 'EMPHASIS_LEVEL')?.count ?? 0
        this.checks[1].num = res?.find(_c => _c.warninglevel === 'MEDIUM_LEVEL')?.count ?? 0
        this.checks[2].num = res?.find(_c => _c.warninglevel === 'GENERAL_LEVEL')?.count ?? 0
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
      // 获取地图上的feature
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_

      if (curFeature.name === 'el-mapIconMark') {
        this.mapPopupData.position = evt.coordinate
        this.curFeature = { ...feature.values_ }
        this.personTable.curPage = 1
        this.personTable.params.pageNum = 1
        this.personTable.params.longitude = curFeature.customAttribute.deviceLongitude
        this.personTable.params.latitude = curFeature.customAttribute.deviceLatitude
        this.personTable.params.endTime = this.params.endTime
        this.personTable.params.startTime = this.params.startTime

        this.getPersonInfoByPosition()
      }
    },

    // 查询人员详情by经纬度
    getPersonInfoByPosition () {
      queryWarnPersonByPosition({ ...this.personTable.params, warningType: 'warningMap' }).then(
        res => {
          if (!res) {
            this.$messageTip.error('未找到相关人物信息！')
            return false
          }

          const list = res.content.map((element, idx) => {
            const attrTypeName =
              this.$store.state.Dict.extrTypeList?.find(_c => _c.typeCode === element.attrType)
                ?.typeName ?? '其他'
            element.triggerStr = attrTypeName + '/' + element.trigger

            element.levelObj = this.checks.find(_c => _c.value === this.curPersonInfo.warningLevel)
            element.fenceLevelStr = this.levelObj[element.warningLevel]
            if (idx === 0) {
              const index = this.personTable.columns.findIndex(_c => _c.prop === 'triggerStr')
              if (element.warningTypeName === '聚集预警') {
                this.personTable.columns[index] = {
                  prop: 'personName',
                  label: '预警人员',
                  minWidth: '100'
                }
              } else {
                this.personTable.columns[index] = {
                  prop: 'triggerStr',
                  label: '类型/数值',
                  minWidth: '100'
                }
              }
            }
            return element
          })

          if (res.totalSize === 1) {
            this.mapPopupData.show = true
            this.curPersonInfo = { ...list[0] }
          } else {
            this.CusDrawerBottom.show = true
            this.personTable.tableData = [...list]
            this.personTable.total = res.totalSize
          }
        }
      )
    },

    // 搜索框查询
    handleSearch () {
      this.params.searchKey = this.cusInput.searchKey
      this.loadPerson()
    },

    // 加载所有人员经纬度
    loadPerson () {
      queryWarnFeatureHistoryPager({ ...this.params, warningType: 'warningMap' })
        .then(res => {
          if (!res || res?.content?.length === 0) {
            this.clearMark()
            this.messageList = []
            return
          }
          const list =
            res.content?.map(_c => {
              const positionObj = gps.GcjWGSConversion({
                Lon: _c.deviceLongitude,
                Lat: _c.deviceLatitude,
                type: 1
              })
              _c.location = [positionObj.longitude, positionObj.latitude]
              _c.id = JSON.stringify(_c.location)
              const attrTypeName =
                this.$store.state.Dict.extrTypeList?.find(ele => ele.typeCode === _c.attrType)
                  ?.typeName ?? '其他'
              _c.triggerStr = attrTypeName + '/' + _c.attrValue
              _c.iconImg = iconImg[_c.warningLevel]
              return _c
            }) ?? []
          if (this.params.pageNum === 1) {
            this.clearMark(this.params.warningLevel)
            this.messageList = list
          } else {
            this.clearMark(this.params.warningLevel)
            this.messageList = this.messageList.concat(list)
          }

          this.params.totolPages = res.totalPages
        })
        .finally(() => {
          this.messageState = ''
        })
    },

    clearMark (warningLevel) {
      if (this.personLayers.length) {
        this.personLayers.forEach(ele => {
          if (warningLevel) {
            if (!warningLevel.includes(ele.values_.warningLevel)) {
              this.$store.state.Ol.oMap?.removeLayer(ele)
            }
          } else {
            this.$store.state.Ol.oMap?.removeLayer(ele)
          }

        })
      }
    },

    /** 滚动到底部方法 */
    loadMore () {
      if (this.params.totolPages <= this.params.pageNum) {
        this.messageState = 'finished'
        return
      }

      this.messageState = 'isLoad'
      ++this.params.pageNum

      this.loadPerson()
    },

    // 关闭人员弹出窗体事件
    mapPopupClose () {
      this.mapPopupData.show = false
    },

    // 复选框 分类切换
    handleClick (item) {
      const index = this.checks.findIndex(_c => _c.label === item.label)
      this.checks[index].isActive = !this.checks[index].isActive

      this.params.warningLevel = this.checks
        .filter(_c => _c.isActive)
        .map(_c => _c.value)
        .join(',')
      const closePerson = this.personTable.tableData.every((item2) => {
        return item2.warningLevel === item.value
      })
      // 显示为预警列表时，点击切换去隐藏预警列表
      if (this.CusDrawerBottom.show && !item.isActive && closePerson) {
        this.handleClosePerson()
      }
      // 当是单个时，点击切换去隐藏预警弹框
      if (this.mapPopupData.show && !item.isActive && this.curPersonInfo.warningLevel === item.value) {
        this.mapPopupClose()
      }
      this.loadPerson()
    },

    /** tab 切换点击 */
    TabHandleClick (index, item) {
      // this.tabNav.list = this.tabNav.list.map((i, idx) => {
      //   console.log(i, idx);
      //   i.isActived = false
      //   if (idx == index) {
      //     i.isActived = true
      //   }
      //   return i
      // })
      this.$router.push({ name: item.path })
      // if (index == 0) {
      //   this.$router.push({ name: 'History' })
      // } else if (index == 1) {
      //   this.$router.push({ name: 'Rules' })
      // }
    },

    dealMessage (newMessagrObj) {
      const _that = this
      try {
        if (newMessagrObj.warnTypeEnum === 'CLUE') {
          this.params.pageNum = 1
          _that.loadPerson()
        }
      } catch (err) {
        console.log('err', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 968px) and (max-width: 1200px) {
  /deep/.DrawerWrapper{
    width: 450px !important;
  }
}
.map_con{
  height: calc(100vh - 120px);
  // 地图搜索
  .AddressSearch {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 99;
    display: flex;
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

/deep/.table-wrapper .el-table thead tr {
  height: 45px !important;
}

/deep/.pagination {
  margin-top: 0 !important;
}
/deep/.tabs-map-list {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 10;
}
/deep/.Tabs {
  top: 56px;
}
</style>
