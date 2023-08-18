import { iconMiniData, iconMiniLightData } from '@/utils/common.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import MapSwitchType from '_com/map/MapSwitchType'
import Tab from '@/components/BasicComponents/Tab'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import DeviceOverlayPop from '@/views/common/devicemap/deviceOverlayPop'
import RoomPop from '@/views/common/devicemap/roomPop'
import deviceOnlineRate from '@/views/common/devicemap/deviceOnlineRate'
const { _isOl } = require('@/config/user.js')

const RightTopNav = {
  list: [{ name: '统计模式', icon: 'txt-clcok', key: 'device:stat' }, { name: '列表模式', icon: 'txt-clcok', key: 'device:list' }]
}
// const { _pos } = require('@/config/user.js')
export default {
  components: {
    MapSwitchType,
    Tab,
    CusDrawerBottom,
    DeviceOverlayPop,
    RoomPop,
    deviceOnlineRate
  },

  data () {
    return {
      imgMap: {},
      imgDarkMap: {
        // 设备图标
        '1': 'icon-tab-small-1.png',
        '11': 'icon-tab-small-1-g.png',
        '2': 'icon-tab-small-2.png',
        '22': 'icon-tab-small-2-g.png',
        '3': 'icon-tab-small-3.png',
        '33': 'icon-tab-small-3-g.png',
        '4': 'icon-tab-small-4.png',
        '44': 'icon-tab-small-4-g.png',
        '5': 'icon-tab-small-5.png',
        '55': 'icon-tab-small-5-g.png',
        '6': 'icon-tab-small-6.png',
        '66': 'icon-tab-small-6-g.png',
        '7': 'icon-tab-small-7.png',
        '77': 'icon-tab-small-7-g.png',
        '8': 'icon-tab-small-8.png',
        '88': 'icon-tab-small-8-g.png',
        '9': 'icon-tab-small-9.png',
        '99': 'icon-tab-small-9-g.png',
      },
      imgLightMap: {
        // 设备图标
        '1': 'icon-tab-small-light-1.png',
        '11': 'icon-tab-small-light-1-g.png',
        '2': 'icon-tab-small-light-2.png',
        '22': 'icon-tab-small-light-2-g.png',
        '3': 'icon-tab-small-light-3.png',
        '33': 'icon-tab-small-light-3-g.png',
        '4': 'icon-tab-small-light-4.png',
        '44': 'icon-tab-small-light-4-g.png',
        '5': 'icon-tab-small-light-5.png',
        '55': 'icon-tab-small-light-5-g.png',
        '6': 'icon-tab-small-light-6.png',
        '66': 'icon-tab-small-light-6-g.png',
        '7': 'icon-tab-small-light-7.png',
        '77': 'icon-tab-small-light-7-g.png',
        '8': 'icon-tab-small-light-8.png',
        '88': 'icon-tab-small-light-8-g.png',
        '9': 'icon-tab-small-light-9.png',
        '99': 'icon-tab-small-light-9-g.png',
      },
      iconMiniData: Object.freeze(iconMiniData),
      // tabNav: Object.freeze(RightTopNav),
      renderType: 'device',
      MapDeviceList: [],
      renderDeviceList: [], // 真正渲染设备列表
      siteList: [], // 场所列表
      CusDrawerBottom: {
        show: false,
        title: '设备详情',
        handleClose: this.handleCloseDevice
      },
      PlaceCusDrawerBottom: {
        show: false,
        title: '场所详情',
        handleClose: this.handleClosePlace
      },
      devRate: {
        online: 0,
        offline: 0
      },
      onlineDeviceList: [],
      offlineDeviceList: [],
      deviceRate: 'all',
      siteUrl: '', // 场所图片路径
      deviceList: [], // 初始设备列表
      isWatchDevice: true
    }
  },

  computed: {
    ...mapState('Map', {
      roomListData: 'roomListData',//场所数据
      roomDeviceList: 'roomDeviceList',//设备数据
      devicePopShow: 'devicePopShow',
      roomPopShow: 'roomPopShow',
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray',//场所数据
    }),
    tabNav () {
      return {
        list: this.$backPermissionsArray(RightTopNav.list)
      }
    },
    ...mapState('User', {
      theme: 'theme'
    })
  },

  watch: {
    devicePopShow: function (val) {
      this.CusDrawerBottom.show = val
    },
    roomPopShow: function (val) {
      this.PlaceCusDrawerBottom.show = val
    },
    roomDeviceList: {
      handler (val) {
        this.renderDeviceList = [...val]
        this.deviceList = [...val]
      },
      deep: true,
      immediate: true
    },
    renderDeviceList: {
      handler (val) {
        if (!this.isWatchDevice) {
          this.isWatchDevice = true
          return
        }

        this.offlineDeviceList = []
        this.onlineDeviceList = []
        if (val.length === 0) {
          this.devRate.online = 0
          this.devRate.offline = 0
        }

        val.forEach(element => {
          if (element.online) {
            this.onlineDeviceList.push(element)
          } else {
            this.offlineDeviceList.push(element)
          }
        })
        this.devRate.online = this.onlineDeviceList.length
        this.devRate.offline = this.offlineDeviceList.length
      },
      deep: true,
      immediate: true
    },
    theme: {
      handler (val) {
        if (val === 'light') {
          this.iconMiniData = Object.freeze(iconMiniLightData)
          this.siteUrl = 'icon-tab-small-light-11.png'
          this.imgMap = JSON.parse(JSON.stringify(this.imgLightMap))
        } else {
          this.iconMiniData = Object.freeze(iconMiniData)
          this.siteUrl = 'icon-tab-small-11.png'
          this.imgMap = JSON.parse(JSON.stringify(this.imgDarkMap))
        }
      },
      immediate: true
    }
  },

  created () {
    // 加载场所
    this.initPlaceList()
    // if (this.theme === 'light') {
    //   this.iconMiniData = Object.freeze(iconMiniLightData)
    //   this.siteUrl = 'icon-tab-small-light-11.png'
    //   this.imgMap = JSON.parse(JSON.stringify(this.imgLightMap))
    // } else {
    //   this.iconMiniData = Object.freeze(iconMiniData)
    //   this.siteUrl = 'icon-tab-small-11.png'
    //   this.imgMap = JSON.parse(JSON.stringify(this.imgDarkMap))
    // }
  },

  methods: {
    ...mapMutations('Map', {
      changeDeviceMarkers: 'changeDeviceMarkers'
    }),
    ...mapActions('Map', {
      getRoomList: 'getRoomList',
    }),
    // 点击设备类型
    clickDeviceCate ({ ids }) {
      this.$store.commit('Map/setDeviceIdsClicked', ids)
    },

    // 关闭设备详情POP
    handleCloseDevice () {
      this.$store.commit('Map/closeDevicePop')
      _isOl() && this.closeInfo()

    },

    // 关闭标注弹窗
    closeInfo () {
      this.$aMap.getAllOverlays('InfoWindow').map(info => info.close())
    },

    // 关闭场所详情POP
    handleClosePlace () {
      this.$store.commit('Map/closeRoomPop')

      _isOl() && this.closeInfo()
    },

    // 设备 在线 + 离线 点击事件
    deviceRateChange (val) {
      this.isWatchDevice = false
      // 在线 + 离线 设备
      if (val === 'all') {
        // 全部在线
        this.renderDeviceList = [...this.offlineDeviceList, ...this.onlineDeviceList]
      } else if (val === 'offline') {
        // 离线 设备
        this.renderDeviceList = this.offlineDeviceList
      } else if (val === 'online') {
        // 在线 设备
        this.renderDeviceList = this.onlineDeviceList
      } else {
        // 所有取消
        this.renderDeviceList = []
      }
    },
    initPlaceList () {
      this.getRoomList().then(res => {
        if (res) {
          // res.map(item => {
          //   let position = [item.longitude, item.latitude]
          //   position = _pos(position[0], position[1])
          //   return {
          //     ...item,
          //     position
          //   }
          // })
          // res.forEach((item)=>{
          //   console.log(item);
          // })
          // console.log(this.siteList);
          // console.log(this.roomListData);
          this.siteList = this.roomListData
        } else {
          this.siteList = this.roomListData
        }
      })
    },
    // 过滤设备类型 / 场所类型切换
    handleClickType (checked) {
      this.$store.state.Map.isShowDevice = true
      this.$nextTick(() => {
        if (this.clusterObj) {
          this.clusterObj.show = false
        }
        if (this.labelPopup) {
          this.labelPopup.show = false
        }
        if (this.renderType === 'place') {
          //场所切换为设备
          this.$refs.MapSwitchType.checked = this.$refs.MapSwitchType.typeList.map(_c => _c.value)
          this.renderType = 'device'
          this.renderDeviceList = [...this.deviceList]
        } else {
          this.renderDeviceList = this.deviceList.filter(_c => {
            // 解决切换问题，后端突然返回字符串！
            return checked.includes(_c.deviceType) || checked.includes(Number(_c.deviceType))
          })
        }
      })
    },
    // 搜索框的显示与隐藏
    getPermission () {
      return this.$store.state.Common.permissionsArray.includes('device:search')
    },

    // 点击场所按钮
    handleClickPlace () {
      this.$nextTick(() => {
        if (this.clusterObj) {
          this.clusterObj.show = false
        }

        if (this.labelPopup) {
          this.labelPopup.show = false
        }
        this.renderType = 'place'
        this.$store.state.Map.isShowDevice = false
        this.$refs.MapSwitchType.checked = []
      })
    },
    /** 右上角 统计模式 、列表模式 Tab */
    TabHandleClick (index, item) {
      if (item.name === '统计模式') {
        this.$router.push({ name: 'StatisticalGraph' })
      } else if (item.name === '列表模式') {
        this.$router.push({ name: 'devicelist' })
      }
    },
  }
}
