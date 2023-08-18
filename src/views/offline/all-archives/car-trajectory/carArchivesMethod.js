import RoundTimeline from '@/views/offline/analysis/components/RoundTimeline'
import EmptyData from '@/components/BasicComponents/EmptyData'
import DatePick from '@/views/common/data-center/components/DatePick'
import Loading from '@/components/VisualComponents/Loading'
import CusDrawerRight from '@/components/BasicComponents/CusDrawerRight'
import { getPersonTrack, getInfoByPlace } from '@/api/allArchives'
import dayjs from '@/utils/filters'
// import { getCarTrackInfo, getPlaceCount, getInfoByPlace } from '@/api/allArchives'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import { gps } from '@/utils/resetPosition'
// const iconMiniData = [
//   { type: 'wifi', text: '起点', url: 'car-start.png' },
//   { type: 'wifi', text: '过程点', url: 'car-by.png' },
//   { type: 'wifi', text: '终点', url: 'car-end.png' },
//   { type: 'wifi', text: '起终点', url: 'car-start-with-end.png' }
// ]
export default {
  data () {
    return {
      activeIndex: null,
      isShowDataTypeStr: true, // 判断是否显示数据来源
      drawer: {
        isShow: true
      },
      params: {
        startTime: '',
        endTime: '',
        entityLabelName: 'car_license',
        placeAddress: '',
        attr: ''
      },
      tempInfo: {},
      // iconMiniData: Object.freeze(iconMiniData),
      tracksList: [],
      subTracksList: [],// tracksList的副本
      activities: [], // 左边轨迹展示的十足
      lineList: [], // 线的数组
      placeInfoArr: [],
      searchLoading: false,
      rightPlaceLoading: false,
      CusDrawerRightInfo: {
        title: '标题',
        show: false,
        handleClose: this.handleClose
      },
      // 弹出气泡图层数据
      mapPopupData: {
        position: [], // 弹窗中心点 Array[array]， 必须
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [-75, -5] // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
      },
      mapPopData: {},
      trackPlayList: [],
      // mapObject: {}
    }
  },
  components: {
    RoundTimeline,
    EmptyData,
    DatePick,
    Loading,
    CusDrawerRight
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    carNumber () {
      return this.$route.query.carNumber
    },
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--icon-nocar-pic']
    }
  },
  mounted () {
    // 设置默认时间
    this.setDefaultTime()
    // 获取车辆轨迹信息（左侧）
    this.getCarInfoByCarNumber()

    // 获取轨迹信息(中间)
    // this.queryTracksByCarNumber()

    this.bus.$on('olMapClick', this.MapClick)
  },
  methods: {
    handleClose () {
      this.$refs.RoundTimeline.currentIndex = -1
      this.tracksList = this.subTracksList
      this.CusDrawerRightInfo.show = false
    },
    itemClick (item, index) {
      // console.log(temptracksListArr);
      // let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      // let tempIndex = this.getIndex(this.tracksList, item)
      // console.log(tempIndex);
      // console.log(temptracksListArr[tempIndex].status);
      // temptracksListArr[index].status = 'active'
      // this.tracksList = temptracksListArr
      this.elementClick(item, true, index)
    },
    unique (arr) {
      let tempArr = JSON.parse(JSON.stringify(arr))
      let newArr = tempArr.reverse()
      // const res = new Map();
      // return newArr.filter((arr) => !res.has(arr.placeCode) && res.set(arr.placeCode, 1))
      return newArr.filter((item, index) => {
        if (item.latitude && item.longitude) {
          return newArr.findIndex(item1 => item1.latitude === item.latitude && item1.longitude === item.longitude) == index
        }
      })
    },
    toNumber (location) {
      return location.map(item => parseFloat(item))
    },
    getCarInfoByCarNumber () {
      this.searchLoading = true
      this.collectParams()
      getPersonTrack(this.params).then((res) => {
        // console.log(res)
        if (!res.data.length) {
          this.activities = []
          this.tracksList = []
          this.lineList = []
          this.trackPlayList = []
        }
        // this.mapObject = JSON.parse(JSON.stringify(res.map))
        // console.log(res.data)
        res.data.forEach((item) => {
          item.position = gps.GcjWGSConversion({
            Lon: item.longitude,
            Lat: item.latitude,
            type: 1
          })
          item.location = []
          item.status = ''
          item.location[0] = item.position.longitude
          item.location[1] = item.position.latitude
          item.placeLongitude = item.position.longitude
          item.placeLatitude = item.position.latitude
        })
        this.lineList = res.data
        this.trackPlayList = this.lineList.map(_c => this.toNumber(_c.location))
        // this.tracksList = this.unique(res.list)
        this.tracksList = res.data
        this.subTracksList = JSON.parse(JSON.stringify(this.tracksList))
        // console.log(this.tracksList)

        let tempArr = []
        res.data.forEach((item) => {
          let tempObj = { timestamp: [] }
          tempObj.placeName = item.placeName || '--'
          tempObj.placeAddress = item.placeAddress || '--'
          tempObj.timestamp[0] = item.time || '--'
          tempObj.placeId = item.placeId || '--'
          tempObj.placeLongitude = item.placeLongitude
          tempObj.placeLatitude = item.placeLatitude
          tempObj.coordinate = item.location || []
          tempObj.timestamp[0] = dayjs.filterString(item.collectTime)
          // tempObj.dataTypeStr = item.srcName
          // tempObj.dataType = item.dataType
          tempObj.latitude = item.latitude
          tempObj.longitude = item.longitude
          tempObj.srcName = item.srcName
          tempObj.srcFieldName = item.srcFieldName
          tempArr.push(tempObj)
        })
        this.activities = tempArr
        let track = this.tracksList.find(lng => lng.longitude && lng.latitude)

        if (this.map) {
          // 根据经纬度点 定位中心点
          this.bus.$emit('setViewCenter', {
            position: this.tracksList.length && track ? track.location : [],
            zoom: 12,
            isMark: false
          })
        } else {
          this.bus.$emit('handleCenter', track.location, 14)
        }
      }).finally(() => {
        this.searchLoading = false
      })
    },
    elementClick (info, bol, ind) {
      // console.log(info, bol, ind)
      this.activeIndex = ind
      if (!info.placeAddress) { return }
      // 这里差一个优化
      // if(!this.tempInfo.placeId){
      //   this.tempInfo =  JSON.parse(JSON.stringify(info))
      // }else{
      //   if(this.tempInfo.placeId === info.placeId){
      //     return
      //   }
      // }
      this.CusDrawerRightInfo.title = info.placeAddress
      this.collectParams()
      this.openPopInfo(info) // 展开气泡
      // this.getPlaceTimeInfo(info)
      // 查找关于该停车点的该车辆的进出信息
      // 点击时处理右边的显示和隐藏
     /* let temptracksListArr = JSON.parse(JSON.stringify(this.subTracksList))
      let tempIndex = this.getIndex(this.tracksList, info)
      temptracksListArr[tempIndex].status = this.activeColor(temptracksListArr[tempIndex])
      // console.log(temptracksListArr)
      this.tracksList = temptracksListArr*/
      let params = {
        startTime: this.params.startTime,
        endTime: this.params.endTime,
        carNumber: this.carNumber,
        placeAddress: info.placeAddress
      }
      this.getPlaceInfo(params)
      // 找到左边的index ，控制左边的背景色，下面的代码，如果是代码控制的点击就不执行，如果是用户点击的则执行
      // if (!bol) {
        // let tempIndex2 = this.getIndex(this.activities, info)
        this.$refs.RoundTimeline.currentIndex = ind
        // 找到右边的东西，然后
        this.$nextTick(() => {
          let targetDom = document.querySelector('.car-trajectory .bgc')
          let scrollDom = document.querySelector('.car-trajectory')
          scrollDom.scrollTop = targetDom.offsetTop
        })
      // }

    },
    getPlaceTimeInfo (item) {
      console.log(item)
      // this.placeInfoArr = this.mapObject[item.placeAddress]
      this.CusDrawerRightInfo.show = true
    },
    activeColor (item) {
      if (this.lineList.length > 1 && this.lineList[0].placeCode === item.placeCode && item.placeCode === this.lineList[this.lineList.length - 1].placeCode) {
        return 'activeStartAndEnd'
      }
      if (this.tracksList.length && this.tracksList[0].placeCode === item.placeCode) {
        return 'activeStart'
      }
      if (item.placeCode === this.lineList[0].placeCode) {
        return 'activeEnd'
      }
      return 'activeBy'
    },
    getIndex (Arr, obj) {
      return Arr.findIndex((item) => {
        return item.latitude === obj.latitude && item.longitude === obj.longitude
      })
    },
    getPlaceInfo (params) {
      this.rightPlaceLoading = true
      getInfoByPlace(params).then((res) => {
        this.rightPlaceLoading = false
        this.CusDrawerRightInfo.show = true
        this.placeInfoArr = res
      })
    },
    setDefaultTime () {
      const start = new Date();
      let startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      let endTime = Date.now()
      this.$refs.DatePick.pick.startTime = startTime
      this.$refs.DatePick.pick.endTime = endTime
    },
    collectParams () {
      this.params.attr = this.carNumber
      this.params.startTime = this.$refs.DatePick.pick.startTime
      this.params.endTime = this.$refs.DatePick.pick.endTime
    },
    // 展开消息面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
    getTimeSelect () {
      // 获取车辆轨迹信息（左侧）
      this.getCarInfoByCarNumber()
      // 获取车辆轨迹信息（中间）
      // this.queryTracksByCarNumber()
      this.CusDrawerRightInfo.show = false
      this.placeInfoArr = []
      // 获取轨迹信息(中间)
      // this.queryTracksByCarNumber()
    },
    // 展开气泡信息
    openPopInfo (item) {
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
      this.mapPopupData.show = true
      this.mapPopupData.position = item.coordinate
      this.mapPopData = { ...item }
    },
  }
}
