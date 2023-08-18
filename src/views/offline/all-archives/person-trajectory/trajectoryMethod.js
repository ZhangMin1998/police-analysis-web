
import { getPersonFileDetail, getPersonTrack } from '@/api/allArchives'
import DatePick from '@/views/common/data-center/components/DatePick'
import EmptyData from '@/components/BasicComponents/EmptyData'
import TimeSelect from '@/components/BasicComponents/TimeSelect'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import RoundTimeline from '@/views/offline/analysis/components/RoundTimeline'
import Loading from '@/components/VisualComponents/Loading'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import fakeData from './data.json'
// import dayjs from '@/utils/filters'

const personInfoList = [
  {
    prop: 'sex',
    label: '性别'
  },
  {
    prop: 'cerTypeName',
    label: '证件类型'
  },
  {
    prop: 'cerNumber',
    label: '证件号码'
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
        basePersonId: ''
      },
      curFeature: {},
      tracksobj: {}
    }
  },

  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
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
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    }
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
          if (this.map) {
            // 根据经纬度点 定位中心点
            this.bus.$emit('setViewCenter', {
              position: this.tracksList[0].location,
              zoom: 12,
              isMark: false
            })
          } else {
            this.bus.$emit('handleCenter', this.tracksList[0].location, 11)
          }
        }
      },
      // immediate: true, //关键
      deep: true
    }
  },

  created () {
    // 获取个人信息
    this.obtainInfo()
  },
  mounted () {
    this.setDefaultTime()

    // 获取轨迹信息
    this.queryTracksByPerson()

    // this.bus.$on('olMapClick', this.MapClick)
  },
  methods: {
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
      const res = await getPersonFileDetail(this.CerNunber,this.CerType,this.PersonVid)
      // 基础信息 - 显示
      this.personData = { ...res}
      // this.personData.sex = this.personData.sex || '--'
      // this.personData.birthday = this.personData.birthday
      //   ? this.personData.birthday.split(' ')[0]
      //   : '--'
    },
    // clear () {
    //   this.tracksList = []
    // },
    // 轨迹查询
    queryTracksByPerson () {
      this.searchLoading = true
      this.params.cerNumber = this.CerNunber
      this.params.startTime = this.$refs.DatePick.pick.startTime
      this.params.endTime = this.$refs.DatePick.pick.endTime

      getPersonTrack(this.params).then(res => {
        // console.log(res.data)
        this.mapPopupData.show = false
        if (JSON.stringify(res.data) === "{}" || res.data === null) {
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
          tempObject.list = res.data.list
          // tempObject.list = this.fakeData.list

          tempObject.list.forEach((item) => {
            item.location = []
            item.location[0] = item.longitude
            item.location[1] = item.latitude
          })

          // 赋值给地图上显示点
          this.tracksList = this.unique(tempObject.list)
          // console.log(this.tracksList)
          // this.tracksList = tempObject.list
          this.subTracksList = JSON.parse(JSON.stringify(this.tracksList))

          let tempArr = []
          tempObject.list.forEach((item) => {
            let tempObj = { timestamp: [] }
            tempObj.placeName = item.placeName || '--'
            tempObj.timestamp[0] = item.collectTimeStr || '--'
            tempObj.dataTypeStr = item.dataTypeStr || '--'
            tempObj.coordinate = item.location || []
            tempObj.placeCode = item.placeCode
            tempObj.longitude = item.longitude
            tempObj.latitude = item.latitude
            tempArr.push(tempObj)
          })

          // 赋值给左侧展示列表
          this.activities = tempArr

          // 离线更改zoom
          if (this.map) {
            // 根据经纬度点 定位中心点
            this.bus.$emit('setViewCenter', {
              position: this.tracksList.length ? this.tracksList[this.tracksList.length-1].location : [],
              zoom: 12,
              isMark: false
            })
          } else {
            this.bus.$emit('handleCenter', this.tracksList[this.tracksList.length-1].location, 11)
          }
        }
      }).finally(() => {
        this.searchLoading = false
      })
    },
    unique (arr) {
      let tempArr = JSON.parse(JSON.stringify(arr))
      let newArr = tempArr.reverse()
      // console.log(tempArr)
      // const res = new Map();
      // return newArr.filter((arr) => !res.has(arr.placeCode) && res.set(arr.placeCode, 1))
      return newArr.filter((item, index) => {
        if (item.latitude && item.longitude) {
          return newArr.findIndex(item1 => item1.latitude === item.latitude && item1.longitude === item.longitude) == index
        }
      })
    },
    // 点击左侧列表
    itemClick (item) {
      // console.log(item)
      if (!item.latitude || !item.longitude) return
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
      let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      let tempIndex = this.getIndex(this.tracksList, item)
      // console.log(item,tempIndex,temptracksListArr)
      temptracksListArr[tempIndex].status = 'active'
      this.tracksList = temptracksListArr
      this.openPopInfo(item)
    },
    // 展开气泡信息
    openPopInfo (item) {
      // console.log(item)
      let fontSize, temp, top
      if(window.screen.width > 1919) {
        fontSize = 14
        temp = 35
        top = -50
      } else if (window.screen.width > 1365 && window.screen.width < 1920) {
        fontSize = 14
        temp = 22
        top = -45
      } else {
        fontSize = 12
        temp = 20
        top = -40
      }
      let fontLength = item.placeName.length * fontSize
      this.mapPopupData.offset = [-fontLength/2-temp, top]
      this.mapPopupData.show = true
      this.mapPopupData.position = item.coordinate
      this.curFeature = { ...item }
    },
    getIndex (Arr, obj) {
      return Arr.findIndex((item) => {
        return item.latitude === obj.latitude && item.longitude === obj.longitude
      })
    },
    // 点击地图上的点
    elementClick (info) {
      // console.log(点击地图上的点)
      info.coordinate = [info.placeLongitude,info.placeLatitude]
      info.latitude = info.placeLatitude
      info.longitude = info.placeLongitude
      if(!info.placeName){return}
      let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      let tempIndex = this.getIndex(this.tracksList, info)
      temptracksListArr[tempIndex].status = this.activeColor(temptracksListArr[tempIndex])
      this.tracksList = temptracksListArr

      let tempIndex2 = this.getIndex(this.activities, info)
      this.$refs.RoundTimeline.currentIndex = tempIndex2
      info.placeName = this.activities[tempIndex2].placeName
      this.openPopInfo(info) // 展开气泡信息

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
  }
}
