<template>
  <div class="map_con">
    <amap :center="center">
      <!-- 消息面板 -->
      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '64px', height: '90%' }"
        :canTraction="true"
        moveLeft="-374px"
        width="374px"
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

      <!-- 查询 -->
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
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <PersonPop :curPersonInfo="curPersonInfo" :personInfos="attrList"> </PersonPop>
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

      <!-- 循环使用的方法 标记点-->
      <MapIconMark
        v-for="(item, index) in messageList"
        :key="index + '_' + JSON.stringify(item.location)"
        :position="item.location"
        :icon="item.iconImg"
        :customAttribute="{ ...item }"
        :zindexList="{
          EMPHASIS_LEVEL: 1000,
          MEDIUM_LEVEL: 900,
          GENERAL_LEVEL: 800,
          prop: 'warningLevel'
        }"
        @handleClickIcon="handleClickIcon"
      ></MapIconMark>
    </amap>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import CusMapSearch from '@/components/BasicComponents/CusMapSearch'
import Cuscategory from '@/components/BasicComponents/Cuscategory'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import Tab from '@/components/BasicComponents/Tab'
import MapIconMark from '@/components/Map/OnlineMap/MapIconMark'
import MapPopup from '@/components/Map/OnlineMap/MapPopup'
import TemplateTable from '@/components/VisualComponents/Table'
import PersonPop from '@/views/common/warn/components/PersonPop'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import Messages from '@/views/common/warn/MapWarn/Index/Messages'
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
    {
      name: '预警历史',
      icon: 'txt-clcok',
      isActived: false,
      key:'map_warn:warning_history'
    },
    {
      name: '规则列表',
      icon: 'txt-clcok',
      isActived: false,
      key:'map_warn:rule_list'
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
    Messages
  },
  mixins: [AmapMixins],
  data () {
    return {
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
        show: false // 弹窗显隐 Boolean，必须，默认为 true
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
      rowData: {}
    }
  },

  computed: {
    ...mapState('trackWarning', {
      levelObj: 'levelObj'
    }),
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
  },
  beforeRouteLeave (to,form,next){
    this.bus.$off('olMapClick')
    next()
  },
  beforeDestroy () {
    // this.bus.$off('olMapClick')
    this.bus.$off('WSMessage')
  },

  methods: {
    // 点击跳转中心经纬度
    handleClickMessage (row) {
      if (!row.location[0] || !row.location[1] || row.location[0] == 0 || row.location[1] == 0) {
        this.$messageTip.error('抱歉，该预警未上传经纬度无法定位到地图位置！')
        return false
      }

      this.bus.$emit('handleCenter', row.location)
    },
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },

    // 数量
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

    // 地图icon点击
    handleClickIcon (event, data) {
      this.mapPopupData.position = [event.lnglat.lng, event.lnglat.lat]

      this.personTable.curPage = 1
      this.personTable.params.pageNum = 1
      this.personTable.params.longitude = data.deviceLongitude
      this.personTable.params.latitude = data.deviceLatitude
      this.personTable.params.endTime = this.params.endTime
      this.personTable.params.startTime = this.params.startTime

      this.getPersonInfoByPosition()
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
              _c.location = [_c.deviceLongitude, _c.deviceLatitude]
              _c.id = JSON.stringify(_c.location)
              const attrTypeName =
                this.$store.state.Dict.extrTypeList?.find(ele => ele.typeCode === _c.attrType)
                  ?.typeName ?? '其他'
              _c.triggerStr = attrTypeName + '/' + _c.attrValue
              _c.iconImg = iconImg[_c.warningLevel]
              return _c
            }) ?? []

          if (this.params.pageNum === 1) {
            this.messageList = list
          } else {
            this.messageList = this.messageList.concat(list)
          }

          this.params.totolPages = res.totalPages
        })
        .finally(() => {
          this.messageState = ''
        })
    },

    clearMark () {
      if (this.personLayers.length) {
        this.personLayers.forEach(ele => {
          this.$store.state.Common.cMap?.remove(ele)
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
      const closePerson = this.personTable.tableData.every((item2)=>{
        return item2.warningLevel === item.value
      })
      // 显示为预警列表时，点击切换去隐藏预警列表
      if(this.CusDrawerBottom.show && !item.isActive && closePerson){
        this.handleClosePerson()
      }
      // 当是单个时，点击切换去隐藏预警弹框
      if(this.mapPopupData.show && !item.isActive && this.curPersonInfo.warningLevel === item.value){
        this.mapPopupClose()
      }
      this.loadPerson()
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
        this.$router.push({ name: 'History' })
      } else if (index == 1) {
        this.$router.push({ name: 'Rules' })
      }
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

/deep/.table-wrapper .el-table thead tr {
  height: 45px !important;
}

/deep/.pagination {
  margin-top: 0 !important;
}
</style>
