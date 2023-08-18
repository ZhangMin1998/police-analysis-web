import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import Steps from '@/views/common/warn/components/Steps'
import AnalysisForm from '@/views/offline/analysis/components/AnalysisForm'
import dayjs from '@/utils/filters'
import RoundTimeline from '@/views/offline/analysis/components/RoundTimeline'
import { gps } from '@/utils/resetPosition'
import { queryWorkAndRest, frSearchAll } from '@/api/analysis'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import ListPages from './components/ListPages'
/*const iconMiniData = [
  { type: 'wifi', text: '轨迹点', url: 'icon-route-by.png' },
  { type: 'wifi', text: '最早出现时间', url: 'icon-route-start.png' },
  { type: 'wifi', text: '最后出现时间', url: 'icon-route-end.png' }
]*/
export default {
  name: 'SpaceRoundMixins',
  components: {
    Steps,
    Drawer,
    AnalysisForm,
    RoundTimeline,
    TabsMapWithList,
    ListPages
  },
  data () {
    return {
      activities: [],
      tracksList: [],
      tracksListMap: [],
      trackPointList: [],
      // iconMiniData: Object.freeze(iconMiniData),
      drawer: {
        isShow: true
      },
      isSubmiting: false, // 分析按钮状态
      stepList: [
        {
          title: '分析条件',
          isChecked: true,
          isCanExpend: true
        },
        {
          title: '分析结果',
          isChecked: false,
          isCanExpend: false
        }
      ],
      fd: null,
      tracksobj: {},
      activeName: 'map',
      imgWidth: '',
      activeIndex: null
    }
  },
  mounted () {
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  methods: {
    itemClick (index) {
      /*let list = JSON.pares(JSON.stringify(this.tracksListMap))
      list.forEach((track, ind) => {
        ind === index ? track.status = 'active' : track.status = ''
      })
      this.tracksListMap = list*/
      this.activeIndex = index
    },
    // 展开消息面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
    // 切换地图页或者列表页
    clickTab (val) {
      this.activeName = val
    },
    // 展开步骤
    handleExpend (index) {
      this.stepList.forEach((element) => {
        element.isChecked = false
      })
      this.stepList[index].isChecked = true
      this.stepList[index].isCanExpend = true
    },

    // 获取data
    submitForm () {
      this.isSubmiting = true
      this.$nextTick(() => {
        // 校验成功调用handleReq方法 发送请求
        this.$refs.AnalysisForm.formatParams()
      })
    },

    updateLoading (bool) {
      this.isSubmiting = bool
    },
    // 人脸图片 分析
    async clickAnalysis (params, fd) {
      this.isSubmiting = false
      this.tracksList = []
      this.tracksListMap = []
      this.stepList[1].isChecked = false
      this.stepList[1].isCanExpend = false
      this.activities = []
      this.tracksobj = {}
      // 表单参数
      this.fd = fd

      // 获取所有点
      let formData = new FormData()
      formData.append('startTime', params.startTime)
      formData.append('endTime', params.endTime)
      formData.append('faceImageUrl', params.faceImageUrl)

      const res = await frSearchAll(formData)
      // console.log(res)

      if (!res) {
        this.$messageTip.error('未查询到相关结果！')
        return false
      }
      this.tracksList = res?.map(_c => {
        let positionObj = {}
        if (!this.$store.state.User.online) {
          // 高德地图 =》 离线地图经纬度
          positionObj = gps.GcjWGSConversion({
            Lon: _c.longitude,
            Lat: _c.latitude,
            type: 1
          })
        } else {
          positionObj = {
            longitude: _c.longitude,
            latitude: _c.latitude
          }
        }
        return {
          // 给地图上点的弹框用
          title: _c.placeName,
          location: [positionObj.longitude, positionObj.latitude],
          timeList: [_c.probeTimeCode]
          // timeList: _c.traces.map(ele => dayjs.filterSS(
          //   ele.collectTime
          // ))
        }
      }) ?? []

      this.tracksListMap = this.tracksList.filter((item) => {
        return item.location[0] && item.location[1]
      })
      // console.log(this.tracksListMap);
      this.activities = res?.map((_c) => {
        // if (index === 0) {
        //   this.tracksobj.startTime = dayjs.filterSS(_c.traces[0].collectTime)
        //   this.tracksobj.startAdd = _c.placeName
        // }
        // if (index === res.length - 1) {
        //   this.tracksobj.endTime = dayjs.filterSS(_c.traces[_c.traces.length - 1].collectTime)
        //   this.tracksobj.endAdd = _c.placeName
        // }
        return {
          placeAddress: _c.placeAddress,
          placeName: _c.placeName,
          timestamp: [_c.probeTimeCode]
        }
      }) ?? []

      // console.log(this.activities)

      // 离线更改zoom
      if (this.tracksListMap.length) {
        if (this.map) {
          // 根据经纬度点 定位中心点
          this.bus.$emit('setViewCenter', {
            position: this.tracksListMap[0].location,
            zoom: 14,
            isMark: false
          })
        } else {
          this.bus.$emit('handleCenter', this.tracksListMap[0].location, 14)
        }
      }


      this.handleExpend(1)
    },
    // 字符串转数字
    toNumber (location) {
      return location.map(item => parseFloat(item))
    },
    // 发送请求 分析
    handleReq (fd = this.fd) {
      this.isSubmiting = false
      this.tracksList = []
      this.tracksListMap = []
      this.stepList[1].isChecked = false
      this.stepList[1].isCanExpend = false
      this.activities = []
      this.tracksobj = {}
      // 表单参数
      this.fd = fd

      // 获取所有点
      queryWorkAndRest(fd).then(res => {
        if (!res) {
          this.$messageTip.error('未查询到相关结果！')
          return false
        }
        let id = 0
        this.tracksList = res?.map(_c => {
          _c.id = id++
          let positionObj = {}
          if (!this.$store.state.User.online) {
            // 高德地图 =》 离线地图经纬度
            positionObj = gps.GcjWGSConversion({
              Lon: _c.pLongitude,
              Lat: _c.pLatitude,
              type: 1
            })
          } else {
            positionObj = {
              longitude: _c.pLongitude,
              latitude: _c.pLatitude
            }
          }
          _c.LongitudeAndLatitude = _c.pLongitude && _c.pLatitude ? _c.pLongitude + '°E,' + _c.pLatitude + '°N' : '--'
          _c.isOpen = false
          _c.showList = _c.traces
          _c.traces.map((item) => {
            item.LongitudeAndLatitude = item.longitude && item.latitude ? item.longitude + '°E,' + item.latitude + '°N' : '--'
            item.time = dayjs.filterSS(item.collectTime)
            item.id = id++
          })
          return {
            ..._c,
            title: _c.placeName,
            location: [positionObj.longitude, positionObj.latitude],
            timeList: _c.traces.map(ele => dayjs.filterSS(
              ele.collectTime
            ))
          }
        }) ?? []
        this.activities = res?.map((_c, index) => {
          if (index === 0) {
            this.tracksobj.startTime = dayjs.filterSS(_c.traces[0].collectTime)
            this.tracksobj.startAdd = _c.placeName
          }
          if (index === res.length - 1) {
            this.tracksobj.endTime = dayjs.filterSS(_c.traces[_c.traces.length - 1].collectTime)
            this.tracksobj.endAdd = _c.placeName
          }
          return {
            placeAddress: _c.placeAddress,
            placeName: _c.placeName,
            timestamp: _c.traces.map(ele => dayjs.filterSS(ele.collectTime)),
            pLatitude: _c.pLatitude,
            pLongitude: _c.pLongitude
          }
        }) ?? []

        this.tracksListMap = this.tracksList.filter((item) => {
          return item.location[0] && item.location[1]
        })

        this.trackPointList = this.tracksListMap.map(_c => this.toNumber(_c.location))

        if (this.tracksListMap.length) {
          // 离线更改zoom
          if (this.map) {
            // 根据经纬度点 定位中心点
            this.bus.$emit('setViewCenter', {
              position: this.tracksListMap[0].location,
              zoom: 14,
              isMark: false
            })
          } else {
            this.bus.$emit('handleCenter', this.tracksListMap[0].location, 14)
          }
        }


        this.handleExpend(1)
      })
    },
  }
}
