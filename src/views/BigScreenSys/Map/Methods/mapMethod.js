import { iconMiniData } from '@/utils/common.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import MapSwitchType from '_com/map/MapSwitchType'
import CusDrawerBottom from '@/components/BasicComponents/CusDrawerBottom'
import DeviceOverlayPop from '@/views/common/devicemap/deviceOverlayPop'
import RoomPop from '@/views/common/devicemap/roomPop'
import deviceOnlineRate from '@/views/common/devicemap/deviceOnlineRate'
import CusSelect from '@/views/BigScreenSys/Components/CusSelect'
import EchartsPage from '@/views/BigScreenSys/EchartsPage'
const { _pos } = require('@/config/user.js')
const { _isOl } = require('@/config/user.js')
const labelList = [
  {
    list: [
      {
        label: '设备展示',
        value: 'device'
      },
      {
        label: '场所展示',
        value: 'place'
      }
    ]
  }]
export default {
  components: {
    MapSwitchType,
    CusDrawerBottom,
    DeviceOverlayPop,
    RoomPop,
    deviceOnlineRate,
    CusSelect,
    EchartsPage
  },

  data () {
    return {
      labelList: Object.freeze(labelList),
      iconMiniData: Object.freeze(iconMiniData),
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
      deviceRate: { online: true, offline: true },
      siteUrl: 'icon-tab-small-11.png', // 场所图片路径
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
      EchatsState: 'EchatsState'
    }),
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
  },

  created () {
    // 加载场所
    this.initPlaceList()

  },

  methods: {
    ...mapMutations('Map', {
      changeDeviceMarkers: 'changeDeviceMarkers'
    }),
    ...mapActions('Map', {
      getRoomList: 'getRoomList',
    }),
    ...mapMutations('Common', {
      setEchatsState: 'setEchatsState'
    }),

    handleHidden () {
      this.setEchatsState(false)
    },
    // 点击设备类型
    clickDeviceCate ({ ids }) {
      this.$store.commit('Map/setDeviceIdsClicked', ids)
    },

    // 地图监控类型
    handleChecked (list) {
      const typeList = list.map(_c => _c.value)

      if (typeList.includes('place')) {
        this.renderType = 'place'
        this.$store.state.Map.isShowDevice = false
      } else if (typeList.includes('device')) {
        this.renderType = 'device'
        this.$store.state.Map.isShowDevice = true
      }
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
      if (val.offline && val.online) {
        // 全部在线
        this.renderDeviceList = [...this.offlineDeviceList, ...this.onlineDeviceList]
      } else if (val.offline) {
        // 离线 设备
        this.renderDeviceList = this.offlineDeviceList
      } else if (val.online) {
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
          this.siteList = res.map(item => {
            let position = [item.longitude, item.latitude]
            position = _pos(position[0], position[1])
            return {
              ...item,
              position
            }
          })
        } else {
          this.siteList = this.roomListData
        }
      })
    },
    // 过滤设备类型
    handleClickType (checked) {
      this.$store.state.Map.isShowDevice = true
      this.$nextTick(() => {
        if (this.clusterObj) {
          this.clusterObj.show = false
        }
        if (this.labelPopup) {
          this.labelPopup.show = false
        }

        this.renderDeviceList = this.deviceList.filter(_c => checked.includes(parseInt(_c.deviceType)))
      })
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
  }
}
