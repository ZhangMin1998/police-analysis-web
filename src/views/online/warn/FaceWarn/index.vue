<template>
  <div class="map_con">
    <amap :center="center">
      <div class="AddressSearch" v-permission="'face_warn:search'">
        <CusMapSearch
          :cusInput="cusInput"
          @handleSearch="handleSearch"
          @handleClear="cusInput.searchKey = ''"
        ></CusMapSearch>
      </div>

      <!-- 跳转人脸防控列表 -->
      <Tab :tabNav.sync="tabNav" @handleClick="TabHandleClick" />

      <!-- 图标控件 -->
      <!-- <map-control :list="iconMiniData" /> -->

      <!-- 弹出窗体 -->
      <MapPopup
        :position="mapPopupData.position"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
      >
        <PersonPop :curPersonInfo="curPersonInfo" :personInfos="personInfos">
          <li class="info_item">
            <div>最后抓捕照片:</div>
            <div class="info_item_value">
              <ElImage
                :imgSet="{
                  src: curPersonInfo.photoUrl,
                  errorSrc: 'icon-morenHeader',
                  list: []
                }"
              ></ElImage>
            </div>
          </li>
        </PersonPop>
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
        v-for="(item, index) in pointlist"
        :position="[item.longitude, item.latitude]"
        :icon="item.faceImageUrl"
        :key="index"
        :iconSize="[70, 90]"
        :customAttribute="{ ...item }"
        @handleClickIcon="handleClickIcon"
      ></MapIconMark>

      <RouterPath
        v-for="(item, index) in tracksList"
        :key="index + 'b'"
        :list="item"
        lineType="solid"
      />
      <RouterMarker v-for="(item, index) in tracksList" :key="index + 'c'" :list="item" />

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

import MapIconMark from '@/components/Map/OnlineMap/MapIconMark'
import MapPopup from '@/components/Map/OnlineMap/MapPopup'
import RouterPath from '@/components/Map/OnlineMap/router-path'
import RouterMarker from '@/components/Map/OnlineMap/router-marker'

import TemplateTable from '@/components/VisualComponents/Table'
import PersonPop from '@/views/common/warn/components/PersonPop'

import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'

import { queryImportantTrack, queryWarnPersonByPosition, radioDisturbing } from '@/api/warn'

const personInfos = [
  {
    label: '出现时间',
    prop: 'triggerTime'
  },
  {
    label: '最后出现时间',
    prop: 'triggerTime'
  },
  {
    label: '最后出现场所',
    prop: 'placeName'
  }
]

// const iconMiniData = [
//   { type: 'wifi', text: '轨迹点', url: 'icon-route-by.png' },
//   { type: 'wifi', text: '最早出现时间', url: 'icon-route-start.png' },
//   { type: 'wifi', text: '最后出现时间', url: 'icon-route-end.png' },
//   { type: 'wifi', text: '在线防控人员', url: 'map_marker_0.png' },
//   { type: 'wifi', text: '失联防控人员', url: 'map_marker_1.png' }
// ]
const tabNav = {
  list: [
    {
      name: '预警历史',
      icon: 'txt-clcok',
      isActived: false,
      key:'face_warn:warning_history'
    },
    {
      name: '防控列表',
      icon: 'txt-clcok',
      isActived: false,
      key:'face_warn:rule_list'
    }
  ]
}

export default {
  components: {
    CusMapSearch,
    Tab,
    MapPopup,
    CusDrawerBottom,
    TemplateTable,
    MapIconMark,
    PersonPop,
    RouterPath,
    RouterMarker,
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
      tracksList: [],
      pointlist: [],
      params: {
        searchKey: ''
      },
      personTable: {
        tableData: [],
        columns: Object.freeze([
          {
            label: '姓名',
            prop: 'personName',
            width: '100'
          },
          {
            label: '性别',
            prop: 'sex',
            width: '80'
          },
          {
            label: '证件号',
            prop: 'certificateNumber',
            width: '200'
          },
          {
            label: '人员类型',
            prop: 'personTypeName',
            width: '140'
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
            prop: 'createTime',
            width: '200'
          },
          {
            label: '探测设备',
            prop: 'deviceName',
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
      //       name: '防控列表',
      //       icon: 'txt-clcok',
      //       isActived: false
      //     }
      //   ]
      // },
      // iconMiniData: Object.freeze(iconMiniData),
      personInfos: Object.freeze(personInfos),
      curPersonInfo: {},
      rowData: {},
      catchPic: '',
      cleanId: ''
    }
  },

  computed: {
    polylines () {
      return this.$store.state.Common.cMap?.getAllOverlays('polyline') ?? []
    },
    personLayers () {
      return this.$store.state.Common.cMap?.getAllOverlays('marker') ?? []
    },
    height () {
      return (this.personTable.tableData?.length + 1.5) * 40
    },
    tabNav () {
      return {
        list: this.$backPermissionsArray(tabNav.list)
      }
    },
  },

  created () {
    this.bus.$on('olMapClick', this.MapClick)
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
  beforeRouteLeave (to, form, next) {
    this.bus.$off('olMapClick')
    next()
  },
  beforeDestroy () {
    // this.bus.$off('olMapClick')
    this.bus.$off('WSMessage')
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
      // this.imgPop.imgUrl = 'http://192.168.1.182:9142' + '/' + row.faceImageUrl
      this.showImgPop()
      console.log(
        '🚀 ~ file: index.vue ~ line 350 ~ handleLookImg ~ this.imgPop.imgUrl',
        this.imgPop.imgUrl
      )
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
      this.cleanId = data.personId
      this.mapPopupData.position = [event.lnglat.lng, event.lnglat.lat]

      this.personTable.curPage = 1
      this.personTable.params.pageNum = 1
      this.personTable.params.longitude = data.deviceLongitude
      this.personTable.params.latitude = data.deviceLatitude

      this.getPersonInfoByPosition()
    },

    // 查询人员详情by经纬度
    getPersonInfoByPosition () {
      queryWarnPersonByPosition({ ...this.personTable.params, warningType: 'warningFace' }).then(
        res => {
          if (!res) {
            this.$messageTip.error('未找到相关人物信息！')
            return false
          }

          const list = res.content

          if (res.totalSize === 1) {
            this.mapPopupData.show = true
            this.curPersonInfo = { ...list[list.length - 1] }
            this.curPersonInfo.photoUrl = window.location.origin + '/' + this.curPersonInfo.imgUrl
            this.radioWarn = this.curPersonInfo.noDisturbingStatus || '0'
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
    loadPerson (isFirst) {
      queryImportantTrack({ ...this.params, warningType: 'warningFace' }).then(res => {
        let newPointlist = []
        this.tracksList = []

        // 清除所有折线
        this.$store.state.Common.cMap?.remove(this.polylines)

        if (!res) {
          if (!isFirst) {
            this.$messageTip.error('未找到相关人员信息！')
          }
          return false
        }

        Object.keys(res).forEach(key => {
          const list = res[key].map(_c => {
            _c.longitude = _c.deviceLongitude?.trim()
            _c.latitude = _c.deviceLatitude?.trim()
            _c.faceImageUrl = window.location.origin + '/' + _c.faceImageUrl
            this.catchPic = _c.faceImageUrl
            return _c
          })
          this.tracksList.push(this.formatTrackData(list))

          res[key]?.forEach((_c) => {
            const obj = {
              ..._c,
              longitude: _c.deviceLongitude?.trim(),
              latitude: _c.deviceLatitude?.trim(),
              iconImg: res[key][0]?.disconnectionStatus === 'online' ? '0' : '1'
            }

            newPointlist.push(obj)
          })
        })
        if (isFirst) {
          this.pointlist = [...newPointlist]
          console.log('在线图片的经纬度', this.pointlist);
          console.log('在线终点的经纬度', this.tracksList);
          return
        }

        this.setState(this.personLayers, newPointlist)
      })
    },

    /**
     * 格式化轨迹数据
     * @param Array<Object> list
     * @return Array<Object>
     */
    formatTrackData (list) {
      const findWhich = (item, elist) => {
        for (let index = 0; index < elist?.length; index++) {
          const element = elist[index]
          if (item.placeId === element.placeId) {
            element.timeList.push(item.triggerTime)
          }
        }
      }

      const results = []
      const existCodes = [] // 已经 push 的 code
      list.forEach(item => {
        item.latitude = item.latitude || item.deviceLatitude
        item.longitude = item.longitude || item.deviceLongitude
        if (!item.latitude || !item.longitude) return

        const { placeId } = item

        if (!existCodes.includes(placeId)) {
          results.push({
            placeId,
            title: item.placeName,
            location: [item.longitude, item.latitude],
            timeList: [item.triggerTime]
          })
          existCodes.push(placeId)
        } else {
          findWhich(item, results)
        }
      })
      if (list[0].placeId == list[list?.length - 1].placeId) {
        results.push(results[0])
      }

      results.sort((a, b) => {
        return b.timeList[results?.length - 1] < a.timeList[results?.length - 1] ? 1 : -1
      })

      return results
    },

    // 显示 or 隐藏
    setState (mapList, list) {
      if (mapList?.length >= 0) {
        mapList.forEach(element => {
          const { id } = element.getExtData()
          const index = list.findIndex(_c => _c.id === id)
          if (index === -1) {
            element.hide()
          } else {
            element.show()
          }
        })
      }
    },

    // 预警 开关
    tableSwitchChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.certificateNumber,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningFace'
      }).then(() => {
        this.getPersonInfoByPosition()
      })
    },

    // 预警 免打扰模式
    radioChange (e) {
      radioDisturbing({
        personId: this.curPersonInfo.certificateNumber,
        noDisturbingStatus: e,
        warningType: 'warningFace'
      })
    },

    // 关闭人员弹出窗体事件
    mapPopupClose () {
      this.mapPopupData.show = false
    },

    // /** 跳转防控列表页 */
    // TabHandleClick() {
    //   this.$router.push({ name: 'FaceWarnList' })
    // },
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
        this.$router.push({ name: 'WarnDetail' })
      } else if (index == 1) {
        this.$router.push({ name: 'FaceWarnList' })
      }
    },

    dealMessage (newMessagrObj) {
      console.log('🚀 ~ file: index.vue ~ line 490 ~ dealMessage ~ newMessagrObj', newMessagrObj)
      const _that = this
      try {
        if (newMessagrObj.warnTypeEnum === 'WARNING_SUSPECT') {
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

/deep/.el-radio {
  margin-right: 12px;
}
/deep/.el-radio__label {
  font-size: 12px;
  padding-left: 2px;
}
</style>
