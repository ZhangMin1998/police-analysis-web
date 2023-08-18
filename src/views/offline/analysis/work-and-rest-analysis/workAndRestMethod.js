import { gps } from '@/utils/resetPosition'
import dayjs from '@/utils/filters'
import WorkAndRestDetail from '@/views/offline/analysis/work-and-rest-analysis/detail'
import Pop from '@/components/BasicComponents/Dialog'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import Steps from '@/views/common/warn/components/Steps'
import AnalysisForm from '@/views/offline/analysis/components/AnalysisForm'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import ListPages from './components/ListPages'
// import {callMethodLimitPage} from './getAllData.js'
import {
  frSearchAll,
  queryWorkAndRest,
  queryWorkAndRestStartAndEnd,
  queryWorkAndRestDetail
} from '@/api/analysis'

const redioList = [
  {
    name: '1次/小时',
    value: 'hour'
  },
  {
    name: '1次/每天',
    value: 'day'
  }
]

export default {
  components: {
    Pop,
    AnalysisForm,
    Steps,
    Drawer,
    WorkAndRestDetail,
    TabsMapWithList,
    ListPages
  },

  data () {
    return {
      isSubmiting: false, // 分析按钮状态
      drawer: {
        isShow: true
      },
      stepList: [
        {
          title: '分析条件',
          isChecked: true,
          isCanExpend: true
        },
        {
          title: '作息分析规律并查看结果',
          isChecked: false,
          isCanExpend: false
        }
      ],
      pop: {
        show: false,
        title: '作息分析表',
        width: '80%',
        top: '120px',
        class: 'echart'
      },

      display: 'hour',
      RadioList: Object.freeze(redioList),

      iconMiniData: Object.freeze([
        {
          type: 'wifi',
          text: '逗留频次',
          url: 'icon-addresArea.png'
        }
      ]),
      imgsMap: Object.freeze({
        0: 'icon-point-start.png', // 开始
        1: 'icon-point-end.png' // 结束
      }),

      placeData: {},
      markersList: [],
      markersListMap: [],
      startAndEndList: [],

      fd: null,
      scatterData: [],
      startTime: '',
      endTime: '',
      activeName: 'map',
      imgWidth: ''
    }
  },
  mounted (){
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },

  methods: {
    // 切换地图页或者列表页
    clickTab (val) {
      this.activeName = val
    },
    // 展开消息面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },

    // 单选切换
    async changeRadio () {
      if (!this.fd) {
        this.$messageTip.error('请先输入搜索条件！')
        return false
      }
      await this.handleReq()
    },

    // 展开步骤
    handleExpend (index) {
      this.stepList.forEach((element) => {
        element.isChecked = false
      })
      this.stepList[index].isChecked = true
    },

    showPop () {
      this.pop.show = true
    },
    hidePop () {
      this.pop.show = false
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
    unique (arr, isFace) {
      let tempArr = JSON.parse(JSON.stringify(arr))
      let result = []

      tempArr.forEach(item => {
        if (!result.length) {
          result.push(item)
        } else {
          let isDiff = true // 是否不同
          for (let i = 0; i < result.length; i++) {
            let resultItem = result[i]
            if (resultItem.pLatitude === item.pLatitude && resultItem.pLongitude === item.pLongitude) {
              if (!isFace && resultItem.traces[resultItem.traces.length - 1].collectTime < item.traces[item.traces.length - 1].collectTime) {
                // result.slice(i,1)
                result.splice(i, 1, item)
              }
              isDiff = false
              break;
            }
          }
          if (isDiff) {
            result.push(item)
          }
        }
      })
      // console.log(result)
      return result
    },
    // 人脸图片 分析
    async clickAnalysis (params, fd) {
      this.isSubmiting = false
      this.startAndEndList = []
      this.markersList = []
      this.markersListMap = []
      if (this.map) {
        const mapLayer = this.map.getLayers().array_
        const mapOverlayer = this.map.getOverlays().array_
        if (mapLayer.length > 1) {
          const last = mapLayer.slice(-1)
          this.map.removeLayer(last[0])
        }
        if (mapOverlayer.length > 0) {
          mapOverlayer.forEach(overlay => {
            this.map.removeOverlay(overlay)
          })
        }
      } else {
        this.$store.state.Common.cMap && this.$store.state.Common.cMap.clearMap()
      }

      // 表单参数
      this.fd = fd
      this.startTime = this.fd.get('startTime')
      this.endTime = this.fd.get('endTime')

      if (this.fd?.has('display')) {
        this.fd.delete('display')
      }

      this.fd.append('display', this.display)

      // 获取所有点
      // const res = await queryWorkAndRest(fd)
      // const res = await callMethodLimitPage(frSearchAll, params, 1, [])
      // console.log(res)
      let formData = new FormData()
      formData.append('startTime', params.startTime)
      formData.append('endTime', params.endTime)
      formData.append('faceImageUrl', params.faceImageUrl)
      // formData.append('pageSize', 100)
      // formData.append('pageNum', 1)
      // frSearchAll(formData).then(res => {
      //   console.log(res)
      // })
      const res = await frSearchAll(formData)

      if (!res) {
        this.$messageTip.error('未查询到相关结果！')
        this.startAndEndList = []
        this.markersList = []
        this.markersListMap = []
        return false
      }

      this.markersList =
        res?.map((_c) => {
          let positionObj = {}
          if (this.map) {
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

          _c.position = [positionObj.longitude, positionObj.latitude]
          return _c
        }) ?? []

      this.markersList.forEach(item => {
        item.pLatitude = item.latitude
        item.pLongitude = item.longitude
      })
      let temp = []
      temp = this.markersList.filter((item) => {
        return item.position[0] && item.position[1]
      })
      this.markersListMap = this.unique(temp, true)
      // this.markersListMap = this.markersList.filter((item) => {
      //   return item.position[0] && item.position[1]
      // })

      if (this.markersListMap.length) {
        // 离线更改zoom
        if (this.map) {
          // 根据经纬度点 定位中心点
          this.bus.$emit('setViewCenter', {
            position: this.markersListMap[0].position,
            zoom: 11,
            isMark: false
          })
        } else {
          this.bus.$emit('handleCenter', this.markersListMap[0].position, 11)
        }
      } else {
        this.bus.$emit('setViewCenter', {
          position: this.$store.state.User.centrePos,
          zoom: 11,
          isMark: false
        })
      }

      // 获取起点终点
      const startAndEndRes = await queryWorkAndRestStartAndEnd(fd)
      // console.log(startAndEndRes)
      if (startAndEndRes) {
        const { startTimeData, endTime, startLocation, endLocation } = startAndEndRes
        // 判断是否相同的点
        const isSameNode = this.compareTwoPoints(
          [startLocation.longitude, startLocation.latitude],
          [endLocation.longitude, endLocation.latitude]
        )
        if (!this.markersListMap.length) {
          this.startAndEndList = []
          this.$message.info('起点与终点无经纬度，无法在地图显示')
          return
        }
        if (isSameNode) {
          const tempTime = `出现时间：${dayjs.filterSS(
            startTimeData
          )} ~ 终止时间：${dayjs.filterSS(endTime)}`

          this.startAndEndList = [
            {
              ...this.markersListMap[0],
              time: tempTime
            }
          ]
        } else {
          this.startAndEndList = [
            {
              ...this.markersListMap[0],
              time: '出现时间：' + dayjs.filterSS(startTimeData)
            },
            {
              ...this.markersListMap[this.markersListMap.length - 1],
              time: '终止时间：' + dayjs.filterSS(endTime)
            }
          ]
        }
        let positionList = this.startAndEndList.filter((item) => {
          return item.position[0] && item.position[1]
        })
        if (!positionList.length) {
          this.startAndEndList[0].position = this.$store.state.User.centrePos
        }
      }
    },
    // 发送请求 分析
    async handleReq (fd = this.fd) {
      this.isSubmiting = false
      this.startAndEndList = []
      this.markersList = []
      this.markersListMap = []
      if (this.map) {
        const mapLayer = this.map.getLayers().array_
        const mapOverlayer = this.map.getOverlays().array_
        if (mapLayer.length > 1) {
          const last = mapLayer.slice(-1)
          this.map.removeLayer(last[0])
        }
        if (mapOverlayer.length > 0) {
          mapOverlayer.forEach(overlay => {
            this.map.removeOverlay(overlay)
          })
        }
      } else {
        this.$store.state.Common.cMap && this.$store.state.Common.cMap.clearMap()
      }

      // 表单参数
      this.fd = fd
      this.startTime = this.fd.get('startTime')
      this.endTime = this.fd.get('endTime')


      if (this.fd?.has('display')) {
        this.fd.delete('display')
      }

      this.fd.append('display', this.display)

      // 获取所有点
      const res = await queryWorkAndRest(fd)

      if (!res) {
        this.$messageTip.error('未查询到相关结果！')
        this.startAndEndList = []
        this.markersList = []
        this.markersListMap = []
        return false
      }
      let id = 0
      this.markersList =
        res?.map((_c) => {
          let positionObj = {}
          if (this.map) {
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
          // 给结构增加唯一id
          _c.id = id++
          _c.LongitudeAndLatitude = _c.pLongitude && _c.pLatitude ? _c.pLongitude + '°E,' + _c.pLatitude + '°N' : '--'
          _c.isOpen = false
          _c.showList = _c.traces
          _c.traces.map((item) => {
            item.id = id++
            item.LongitudeAndLatitude = item.longitude && item.latitude ? item.longitude + '°E,' + item.latitude + '°N' : '--'
            item.time = dayjs.filterSS(item.collectTime)
          })
          // _c.children = _c.traces
          // _c.pageData = {
          //   total: 0,
          //   pageSize: 5,
          //   curPage: 1,
          //   event: this.innerCurrentChange
          // }
          _c.position = [positionObj.longitude, positionObj.latitude]
          return _c
        }) ?? []

      let temp = []
      temp = this.markersList.filter((item) => {
        return item.position[0] && item.position[1]
      })
      this.markersListMap = this.unique(temp, false)

      if (this.markersListMap.length) {
        // 离线更改zoom
        if (this.map) {
          // 根据经纬度点 定位中心点
          this.bus.$emit('setViewCenter', {
            position: this.markersListMap[0].position,
            zoom: 11,
            isMark: false
          })
        } else {
          this.bus.$emit('handleCenter', this.markersListMap[0].position, 11)
        }
      } else {
        this.bus.$emit('setViewCenter', {
          position: this.$store.state.User.centrePos,
          zoom: 11,
          isMark: false
        })
      }


      // 获取起点终点
      const startAndEndRes = await queryWorkAndRestStartAndEnd(fd)
      if (startAndEndRes) {
        const { startTimeData, endTime, startLocation, endLocation } = startAndEndRes
        // 判断是否相同的点
        const isSameNode = this.compareTwoPoints(
          [startLocation.longitude, startLocation.latitude],
          [endLocation.longitude, endLocation.latitude]
        )
        if (!this.markersListMap.length) {
          this.startAndEndList = []
          this.$message.info('起点与终点无经纬度，无法在地图显示')
          return
        }
        if (isSameNode) {
          const tempTime = `出现时间：${dayjs.filterSS(
            startTimeData
          )} ~ 终止时间：${dayjs.filterSS(endTime)}`
          this.startAndEndList = [
            {
              ...this.markersListMap[0],
              time: tempTime
            }
          ]
        } else {
          this.startAndEndList = [
            {
              ...this.markersListMap[0],
              time: '出现时间：' + dayjs.filterSS(startTimeData)
            },
            {
              ...this.markersListMap[this.markersListMap.length - 1],
              time: '终止时间：' + dayjs.filterSS(endTime)
            }
          ]
        }
        let positionList = this.startAndEndList.filter((item) => {
          return item.position[0] && item.position[1]
        })
        if (!positionList.length) {
          this.startAndEndList[0].position = this.$store.state.User.centrePos
        }
      }
    },
    /** 子 分页 事件 */
    // innerCurrentChange (pageIndex, index) {
    //   console.log(pageIndex, index);
    //   // this.$set(this.collapse.tableData[index].params, 'pageNum', pageIndex)
    //   // this.queryChildDevice(index)
    // },

    // 点击 marker 事件
    jumpAnaly (itemObj) {
      // console.log(itemObj);
      // console.log(this.fd,this.fd.get('startTime'))
      // this.startTime = this.fd.get('startTime')
      // this.endTime = this.fd.get('endTime')
      // 获取数据
      const { placeAddress, placeName } = itemObj

      this.placeData = {
        name: placeName,
        address: placeAddress
      }

      if (this.fd?.has('placeAddress')) {
        this.fd.delete('placeAddress')
      }

      let newFd = this.fd
      if (!newFd) return

      newFd.append('placeAddress', placeAddress)

      queryWorkAndRestDetail(newFd).then(res => {
        this.scatterData = this.createScatterData(res)
        // console.log(this.scatterData);
      })

      this.showPop()
    },
    /*
   * 比较开始和结束是否在同一位置
   * startP Array
   * endP Array
   */
    compareTwoPoints (startP, endP) {
      const INTERVAL = 0.0014 //  魔数 间隔
      const s = Math.abs(startP[0] - endP[0])
      const e = Math.abs(startP[1] - endP[1])
      return s <= INTERVAL && e <= INTERVAL
    },

    // 根据后台接口生成echarts图结果
    createScatterData (resObj) {
      // 下标0 表示大于等于30分钟    下标1小于30分钟
      let list = [[], []]
      if (!resObj) return list
      let obj = {}
      Object.keys(resObj).forEach(key => {
        const time = key.split('/').join('-')
        obj[time] = {}
        console.log(obj)
        resObj[key].forEach(ele => {
          console.log(ele);
          const hour =
            dayjs.filterSS(ele.collectTime).split(' ')[1].split(':')[0] +
            ':00'
          const collectDate = dayjs.formatDate(ele.collectTime,'YYYY-MM-DD')
          if (obj[collectDate][hour]) {
            obj[collectDate][hour] += 1
          } else {
            obj[collectDate][hour] = 1
          }
        })
      })
      for (let pKey in obj) {
        for (let cKey in obj[pKey]) {
          if (obj[pKey][cKey] >= 30) {
            list[0].push([pKey, cKey, obj[pKey][cKey]])
          } else {
            list[1].push([pKey, cKey, obj[pKey][cKey]])
          }
        }
      }
      return list
    }
  }
}
