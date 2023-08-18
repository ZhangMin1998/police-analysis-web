
import { getPersonTrack,getTrackSource } from '@/api/allArchives'
import DatePick from '@/views/common/data-center/components/DatePick'
import EmptyData from '@/components/BasicComponents/EmptyData'
import TimeSelect from '@/components/BasicComponents/TimeSelect'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import RoundTimeline from '@/views/offline/analysis/components/RoundTimeline'
import Loading from '@/components/VisualComponents/Loading'
import fakeData from './data.json'
import dayjs from '@/utils/filters'
import { gps } from '@/utils/resetPosition'
import { mapState } from 'vuex'
// const { _pos } = require('@/config/user.js')
// import dayjs from '@/utils/filters'

const personInfoList = [
  {
    prop: 'sex',
    label: '性别'
  },
  // {
  //   prop: 'cerTypeName',
  //   label: '证件类型'
  // },
  {
    prop: 'cerNumber',
    label: '证件号码',
    type: 'cerTypeName' // 需要判断证件类型
  }
]

const iconMiniData = [
  // { type: 'wifi', text: '轨迹点', url: 'icon-route-by.png' },
  // { type: 'wifi', text: '最早出现时间', url: 'icon-route-start.png' },
  // { type: 'wifi', text: '最后出现时间', url: 'icon-route-end.png' }
]

export default {
  components: {
    TimeSelect,
    Ellipsis,
    Drawer,
    RoundTimeline,
    DatePick,
    EmptyData,
    Loading
  },

  data () {
    return {
      fakeData: fakeData,
      isShowDataTypeStr: true, // 是否显示数据来源
      personInfoList: Object.freeze(personInfoList),
      iconMiniData: Object.freeze(iconMiniData),
      activities: [],
      tracksList: [],
      subTracksList: [],
      drawer: {
        isShow: true
      },
      searchLoading: false,
      // 弹出窗体图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [-75, -5] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      markersList: [],
      startAndEndList: [],
      personData: {},//人物信息
      params: {
        startTime: '',
        endTime: '',
        // basePersonId: ''
        attr: '',
        entityLabelName: '',
        placeAddress: ''
      },
      curFeature: {},
      tracksobj: {},
      rightDialogInfo: {
        title: '溯源',
        show: false,
        handleClose: this.handleClose,
        loading: false,
        dataSource: '',
        listData: [],
        labelList: [],
      },
      activeIndex: null,
      trackPointList: []
    }
  },

  computed: {
    ID () {
      return this.$route.query.id
    },
    CerNunber () {
      return this.$route.query.cerNumber
    },
    CerType () {
      return this.$route.query.cerType
    },
    PersonVid () {
      return this.$route.query.personVid || ''
    },
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    })
  },
  watch: {
    // activities: {
    //   handler: function (newValue, oldValue) {
    //     // console.log(newValue)
    //   },
    //   immediate: true, //关键
    //   deep: true
    // },
    tracksList: {
      handler: function (newValue) {
        if (newValue.length === 1) { // 只在有第一个点的时候确定中心点
          let track = this.tracksList.find(item => item.longitude && item.latitude)
          if (this.map) {
            // 根据经纬度点 定位中心点
            this.bus.$emit('setViewCenter', {
              position: track.location,
              zoom: 12,
              isMark: false
            })
          } else {
            this.bus.$emit('handleCenter', track.location, 11)
          }
        }
      },
      // immediate: true, //关键
      deep: true
    }
  },

  created () {
    // 获取个人信息
    // this.personData = this.personInfo
    this.obtainInfo()
  },
  async mounted () {
    await this.setDefaultTime()
    await this.obtainInfo()
    // 获取轨迹信息
    await this.queryTracksByPerson()

    // this.bus.$on('olMapClick', this.MapClick)
  },
  methods: {
    handleClose () {
      // console.log(item)
      // this.rightDialogInfo.dataSource = item.dataTypeStr
      this.rightDialogInfo.show = !this.rightDialogInfo.show
    },
    // 设置默认时间
    setDefaultTime () {
      const start = new Date();
      let startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      let endTime = Date.now()
      this.$refs.DatePick.pick.startTime = startTime
      this.$refs.DatePick.pick.endTime = endTime
    },
    // 基础信息查询
    async obtainInfo () {
      // const res = await getPersonFileDetail(this.CerNunber,this.CerType,this.PersonVid)
      // 基础信息 - 显示
      // console.log(this.personInfo)
      this.personData = this.personInfo
      if (!this.personData.sex && this.personData.cerType === 'attr_identity_card_type') {
        this.personData.sex = this.getSex(this.personData.cerNumber)
      }
      // this.personData.sex = this.personData.sex || '--'
      // this.personData.birthday = this.personData.birthday
      //   ? this.personData.birthday.split(' ')[0]
      //   : '--'
    },
    // 通过身份证获取性别
    getSex (data) {
      if (parseInt(data.substr(16, 1)) % 2 === 1) {
        return "男"
      } else {
        return "女"
      }
    },
    // 轨迹查询
    queryTracksByPerson () {
      this.searchLoading = true

      // this.params.attr = this.personData.cerNumber
      this.params.attr = this.CerNunber
      this.params.entityLabelName = 'cer_number'
      this.params.startTime = this.$refs.DatePick.pick.startTime
      this.params.endTime = this.$refs.DatePick.pick.endTime

      // console.log(this.params)
      getPersonTrack(this.params).then(res => {
        // console.log(res)
        this.mapPopupData.show = false
        if (!res.data.length|| res.code !== 1) {
          this.activities = []
          this.tracksList = []
          this.$refs.personTrack.removeMarker()
          return
        } else {
          this.activities = []
          this.tracksList = []
          this.$refs.personTrack.removeMarker()
          let tempObject = {
            list: []
          }
          tempObject.list = res.data

          tempObject.list.forEach((item) => {
            item.position = gps.GcjWGSConversion({
              Lon: item.longitude,
              Lat: item.latitude,
              type: 1
            })
            item.location = []
            item.location[0] = item.position.longitude
            item.location[1] = item.position.latitude
            item.longitudeNew = item.position.longitude
            item.latitudeNew = item.position.latitude
            if (item.srcName) {
              let type = ''
              this.dataTypeList.forEach(e => {
                if (e.srcNameEn === item.srcName) {
                  type = e.srcNameCn
                }
              })
              item.dataSource = type
            } else {
              item.dataSource = ''
            }
          })


          let tempArr = []
          tempObject.list.forEach((item) => {
            let tempObj = { timestamp: [] }
            tempObj.placeName = item.placeName
            tempObj.timestamp[0] = dayjs.filterString(item.collectTime)
            tempObj.srcName = item.srcName
            tempObj.srcFieldName = item.srcFieldName
            // tempObj.dataType = item.dataType
            tempObj.coordinate = item.location || []
            tempObj.placeCode = item.placeCode
            tempObj.longitude = item.longitudeNew
            tempObj.latitude = item.latitudeNew
            tempObj.placeAddress = item.placeAddress
            tempObj.collectTime = item.collectTime
            tempObj.dataSource = item.dataSource
            tempObj.latitudeOld = item.latitude // 原始经纬度，给溯源用
            tempObj.longitudeOld = item.longitude // 原始经纬度，给溯源用
            tempObj.odsHash = item.odsHash // 溯源用
            tempArr.push(tempObj)
          })

          // 赋值给地图上显示点
          // this.tracksList = this.unique(tempObject.list)
          this.tracksList = tempObject.list
          this.tracksListMap = this.tracksList.filter((item) => {
            return item.location[0] && item.location[1]
          })
          this.trackPointList = this.tracksListMap.map(_c => this.toNumber(_c.location))
          this.subTracksList = JSON.parse(JSON.stringify(this.tracksList))

          // 赋值给左侧展示列表
          this.activities = tempArr
          // let track = JSON.parse(JSON.stringify(this.tracksList)).reverse().find(lng => lng.longitude && lng.latitude)
          let track = this.tracksList.find(lng => lng.longitude && lng.latitude)

          if (this.map) {
            // 根据经纬度点 定位中心点
            this.bus.$emit('setViewCenter', {
              position: this.tracksList.length ? track.location : [],
              zoom: 12,
              isMark: false
            })
          } else {
            this.bus.$emit('handleCenter', track.location, 11)
          }
        }
      }).finally(() => {
        this.searchLoading = false
      })
    },
    // 字符串转数字
    toNumber (location) {
      return location.map(item => parseFloat(item))
    },
    unique (arr) {
      let tempArr = JSON.parse(JSON.stringify(arr))
      let newArr = tempArr.reverse()
      // const res = new Map();
      // return newArr.filter((arr) => !res.has(arr.placeCode) && res.set(arr.placeCode, 1))
      /*return newArr.filter((item, index) => {
        if (item.latitude && item.longitude) {
          return newArr.findIndex(item1 => item1.latitude === item.latitude && item1.longitude === item.longitude) == index
        }
      })*/
      // return newArr.filter((item) => item.latitude && item.longitude)
      return newArr
    },
    // 点击左侧列表
    itemClick (item, index) {
      // console.log(item)
      this.activeIndex = index // 激活坐标
      this.openDetail(item) // 溯源
      if (!item.latitude || !item.longitude) {
        this.openPopInfo(item, false) // 无坐标关闭上一个有坐标的气泡内容
        this.$message.warning('暂无经纬度，地图坐标暂不可显示！')
        return
      }
      // 根据点击的内容确定中心点
      if (this.map) {
        // 根据经纬度点 定位中心点
        this.bus.$emit('setViewCenter', {
          position: item.coordinate,
          zoom: 12,
          isMark: false
        })
      } else {
        this.bus.$emit('handleCenter', item.coordinate, 11)
      }
      /*let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      // let tempIndex = this.getIndex(this.tracksList, item)
      temptracksListArr[index].status = 'active'
      this.tracksList = temptracksListArr*/
      this.openPopInfo(item, true) // 气泡内容
    },
    // 展开气泡信息
    openPopInfo (item, isShow) {
      // console.log(item)
      let fontSize, temp, top
      if(window.screen.width > 1919) {
        fontSize = 14
        temp = 35
        top = -55
      } else if (window.screen.width > 1365 && window.screen.width < 1920) {
        fontSize = 14
        temp = 22
        top = -50
      } else {
        fontSize = 12
        temp = 20
        top = -40
      }
      let fontLength = item.placeAddress.length * fontSize
      this.mapPopupData.offset = [-fontLength/2-temp, top]
      this.mapPopupData.show = isShow
      this.mapPopupData.position = item.coordinate
      this.curFeature = { ...item }
    },
    getIndex (Arr, obj) {
      return Arr.findIndex((item) => {
        return item.latitude === obj.latitude && item.longitude === obj.longitude
      })
    },
    // 点击地图上的点
    elementClick (info, index) {
      // console.log(info)
      this.activeIndex = index
      info.coordinate = [info.longitudeNew,info.latitudeNew]
      info.latitude = info.placeLatitude
      info.longitude = info.placeLongitude
      if(!info.placeAddress){return}
      /*let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      // let tempIndex = this.getIndex(this.tracksList, info)
      // temptracksListArr[tempIndex].status = this.activeColor(temptracksListArr[tempIndex])
      temptracksListArr[index].status = 'active'
      this.tracksList = temptracksListArr*/

      // let tempIndex2 = this.getIndex(this.activities, info)
      this.$refs.RoundTimeline.currentIndex = index
      // info.placeName = this.activities[index].placeName
      this.openPopInfo(info, true) // 展开气泡信息
      this.openDetail(info) // 溯源
      // 找到右边的东西，然后
      // this.$nextTick(() => {
      //   let targetDom = document.querySelector('.trajectory-box .bgc')
      //   let scrollDom = document.querySelector('.trajectory-box')
      //   scrollDom.scrollTop = targetDom.offsetTop
      // })
    },
    activeColor () {
      return 'active'
    },
    // 返回
    back () {
      history.go(-1)
    },

    // 时间改变
    getTimeSelect () {
      // 获取重点人轨迹信息（左侧）
      this.queryTracksByPerson()
    },

    // 关闭人员弹出窗体事件
    mapPopupClose () {
      this.mapPopupData.show = false
    },

    // 展开消息面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
    // 溯源查询
    openDetail (row) {
      // console.log(row)
      this.rightDialogInfo.loading = true
      this.rightDialogInfo.listData = []
      this.rightDialogInfo.labelList = []
      this.rightDialogInfo.dataSource = row.dataSource
      this.rightDialogInfo.show = true
      let params = {
        attr: this.CerNunber,
        collectTime: row.collectTime,
        placeAddress: row.placeAddress,
        srcFieldName: row.srcFieldName,
        longitude: row.longitudeOld || row.longitude,
        latitude: row.latitudeOld || row.latitude,
        srcName: row.srcName,
        odsHash: row.odsHash
      }
      getTrackSource(params).then(res => { // 溯源接口
        // console.log(params)
        if (res) {
          this.rightDialogInfo.listData = res.data
          res.fieldList.forEach(item => {
            if (item.archivesStatus === 'display') {
              this.rightDialogInfo.labelList.push(item)
            }
          })
        }
      }).finally(() => {
        this.rightDialogInfo.loading = false
      })
    },
  }
}
