<template>
  <div class="map_con">
    <TabsMapWithList
      :activeName="active"
      @clickTab='clickTab'
    ></TabsMapWithList>
    <FaceHistory v-show='active === "list"'></FaceHistory>
    <ol-map id="map" class="map" style="height: 100%" v-show='active === "map"'>
      <div class="AddressSearch" v-permission="'face_warn:search'">
        <CusMapSearch
          :cusInput="cusInput"
          @handleSearch="handleSearch"
          @handleClear="cusInput.searchKey = ''"
        ></CusMapSearch>
      </div>
      <!--  -->
      <!-- 切换 历史/规则 -->
      <Tab :tabNav.sync="tabNav" @handleClick="TabHandleClick" />

      <!-- 点击图片弹出窗体 -->
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

      <!-- 循环使用的方法 标记点-->
      <!-- 地图上的照片 -->
      <MapIconMark
        v-for="(item, index) in pointlist"
        :position="[item.longitude, item.latitude]"
        :icon="item.faceImageUrl"
        :iconScale="0.1"
        :key="index"
        :customAttribute="{ ...item }"
        @handleClickIcon="handleClickIcon"
      ></MapIconMark>

      <!-- 这个是终点的标识 -->
      <RouteMarker
        ref="routeMarkerRef"
        v-for="(item, index) in tracksList"
        :key="index + 'b'"
        :list="item"
        :layerClass="'path-marker' + index + 'b'"
      ></RouteMarker>

      <!-- <pop :pop.sync="imgPop" @beforeClose="hideImgPop" @beforeOpen="showImgPop">
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
        <amap-mixins></amap-mixins>
      </pop> -->
    </ol-map>
  </div>
</template>

<script>
import mapMixin from '@/mixins/omap'
import CusMapSearch from '@/components/BasicComponents/CusMapSearch'
import Tab from '@/components/BasicComponents/Tab'

import MapIconMark from '@/components/Map/OfflineMap/MapIconMark'
import MapPopup from '@/components/Map/OfflineMap/MapPopup'
import PersonPop from '@/views/common/warn/components/PersonPop'
import RouteMarker from '@/components/Map/OfflineMap/route-path'
import { gps } from '@/utils/resetPosition'
import ElImage from '@/components/BasicComponents/ElImage'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import FaceHistory from '../../../common/warn/FaceWarn/WarnDetail/index.vue'
// import Pop from '@/components/BasicComponents/Dialog'

import { queryFaceTrack, queryFaceInfoByPosition, radioDisturbing } from '@/api/warn'

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
const tabNav = {
  list: [
    // {
    //   name: '预警历史',
    //   icon: 'txt-clcok',
    //   isActived: false,
    //   path: 'WarnDetail',
    //   key: 'face_warn:warning_history'
    // },
    {
      name: '新增预警',
      icon: 'txt-clcok',
      isActived: false,
      path: 'FaceWarnList',
      key: 'face_warn:rule_list'
    }
  ]
}

export default {
  components: {
    CusMapSearch,
    Tab,
    MapPopup,
    MapIconMark,
    PersonPop,
    RouteMarker,
    // Pop,
    ElImage,
    TabsMapWithList,
    FaceHistory
  },
  mixins: [mapMixin],
  data () {
    return {
      catchPic: '',
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
      radioWarn: '',
      // 弹出窗体图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      cusInput: { placeholder: '请输入人员姓名/身份证', searchKey: '' },
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
      curPersonInfo: {},
      rowData: {},
      personInfos: Object.freeze(personInfos),
      active: 'map'
    }
  },

  computed: {
    polylines () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_ === 'path-marker') : []
    },
    personLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers?.length > 0 ? layers.filter(_c => _c.className_ === 'map-icon-mark') : []
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
      // console.log(this.imgPop.imgUrl)
    },

    // 人员列表分页
    // handleCurrentChange (pageNum) {
    //   this.personTable.params.pageNum = pageNum
    //   this.getPersonInfoByPosition()
    // },

    // 地图点击
    MapClick (evt) {
      // 获取地图上的feature
      const feature = this.$store.state.Ol.oMap.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (!feature) return
      const curFeature = feature.values_

      if (curFeature.name === 'el-mapIconMark') { // 如果点击的是图片
        this.mapPopupData.position = evt.coordinate
        this.curFeature = { ...feature.values_ }

        this.personTable.curPage = 1
        this.personTable.params.pageNum = 1
        this.personTable.params.longitude = curFeature.customAttribute.deviceLongitude
        this.personTable.params.latitude = curFeature.customAttribute.deviceLatitude

        this.getPersonInfoByPosition()
      }
    },
    // 地图icon点击 此方法不会执行
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
      queryFaceInfoByPosition({ ...this.personTable.params}).then(
        res => {
          if (!res) {
            this.$messageTip.error('未找到相关人物信息！')
            return false
          }

          const list = res.content

          // if (res.totalSize === 1) {
          this.mapPopupData.show = true
          // this.curPersonInfo = { ...list[list.length - 1] }
          this.curPersonInfo = list[0]
          this.curPersonInfo.photoUrl = window.location.origin + '/' + this.curPersonInfo.trigger
          // this.curPersonInfo.photoUrl = 'http://192.168.1.182:9142' + '/' + this.curPersonInfo.imgUrl
          this.radioWarn = this.curPersonInfo.noDisturbingStatus || '0'
          // }
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
      queryFaceTrack({ ...this.params}).then(res => {
        this.mapPopupData.show = false
        // 清除所有折线
        this.polylines.forEach(ele => {
          this.$store.state.Ol.oMap.removeLayer(ele)
        })

        if (!res) {
          if (!isFirst) {
            this.$messageTip.error('未找到相关人员信息！')
            this.setState(this.personLayers, [])
          }
          return false
        }

        let newPointlist = []
        this.tracksList = []

        // 清除所有折线
        this.polylines.forEach(ele => {
          this.$store.state.Ol.oMap.removeLayer(ele)
        })

        Object.keys(res).forEach(key => {
          // console.log(key);
          // console.log(res[key]);
          // 对res中的第二层数组进行遍历
          const list = res[key].map(_c => {
            // console.log(_c);
            // _c代表了数组中的每一个对象
            _c.longitude = _c.deviceLongitude?.trim()
            _c.latitude = _c.deviceLatitude?.trim()
            // _c.faceImageUrl = 'http://192.168.1.182:9142' + '/' + _c.faceImageUrl
            _c.faceImageUrl = window.location.origin + '/' + _c.faceImageUrl
            this.catchPic = _c.faceImageUrl
            return _c
          })
          // console.log(list)
          this.tracksList.push(this.formatTrackData(list))

          res[key]?.forEach((_c) => {
            const positionObj = gps.GcjWGSConversion({
              Lon: _c.deviceLongitude?.trim(),
              Lat: _c.deviceLatitude?.trim(),
              type: 1
            })
            // console.log(positionObj);
            const obj = {
              ..._c,
              longitude: positionObj.longitude,
              latitude: positionObj.latitude,
              iconImg: res[key][0]?.disconnectionStatus === 'online' ? '0' : '1'
            }

            newPointlist.push(obj)
            // console.log(newPointlist);
          })
        })

        if (isFirst) {
          this.pointlist = [...newPointlist]
          // console.log('离线图片的经纬度',this.pointlist);
          // console.log('离线终点的经纬度',this.tracksList);
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
    // formatTrackData (list) {
    //   const findWhich = (item, elist) => {
    //     for (let index = 0; index < elist?.length; index++) {
    //       const element = elist[index]
    //       if (item.placeId === element.placeId) {
    //         element.timeList.push(item.triggerTime)
    //       }
    //     }
    //   }

    //   const results = []
    //   const existCodes = [] // 已经 push 的 code
    //   list.forEach(item => {
    //     item.latitude = item.latitude || item.deviceLatitude
    //     item.longitude = item.longitude || item.deviceLongitude
    //     if (!item.latitude || !item.longitude) return

    //     const { placeId } = item

    //     if (!existCodes.includes(placeId)) {
    //       results.push({
    //         placeId,
    //         title: item.placeName,
    //         location: [item.longitude, item.latitude],
    //         timeList: [item.triggerTime]
    //       })
    //       existCodes.push(placeId)
    //     } else {
    //       findWhich(item, results)
    //     }
    //   })
    //   if (list[0].placeId == list[list?.length - 1].placeId) {
    //     results.push(results[0])
    //   }
    //   results.sort((a, b) => {
    //     return b.timeList[results?.length - 1] < a.timeList[results?.length - 1] ? 1 : -1
    //   })

    //   return results
    // },
    formatTrackData (list) {
      const results = []
      list.forEach(item => {
        item.latitude = item.latitude || item.deviceLatitude
        item.longitude = item.longitude || item.deviceLongitude
        if (!item.latitude || !item.longitude) {
          return
        }
        else {
          results.push({
            title: item.placeName,
            location: [item.longitude, item.latitude],
            timeList: [item.triggerTime]
          })
        }
      })
      return results
    },

    // 显示 or 隐藏
    setState (mapList, list) {
      if (mapList?.length >= 0) {
        mapList.forEach(element => {
          const { id } = element.getExtData ? element?.getExtData() : element.values_
          const index = list.findIndex(_c => _c.id === id)
          if (index === -1) {
            element.setVisible(false)
          } else {
            element.setVisible(true)
          }
        })
      }
    },

    // 预警 开关
    tableRadioChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.certificateNumber,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningPerson'
      }).then(() => {
        this.getPersonInfoByPosition()
      })
    },

    // 预警 免打扰模式
    radioChange (e) {
      radioDisturbing({
        personId: this.curPersonInfo.certificateNumber,
        noDisturbingStatus: e,
        warningType: 'warningPerson'
      })
    },

    // 关闭人员弹出窗体事件
    mapPopupClose () {
      this.mapPopupData.show = false
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
      //   this.$router.push({ name: 'WarnDetail' })
      // } else if (index == 1) {
      //   this.$router.push({ name: 'FaceWarnList' })
      // }
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
