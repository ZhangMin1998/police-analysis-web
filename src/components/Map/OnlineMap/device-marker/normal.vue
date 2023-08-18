<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import infoWindowMixin from '@/mixins/infoWindow'
// import Popover from '_com/popover'
import dayjs from '@/utils/filters'

export default {
  // components: {
  //   Popover
  // },

  mixins: [infoWindowMixin],
  inject: ['clearOverGroup'],
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      default: 'device'
    }
  },
  data () {
    return {
      overlay: null,
      deviceTypeImg: [1, 7, 8, 6, 5, 6, 6]
    }
  },
  computed: {
    ...mapState('Map', {
      deviceMarkers: 'deviceMarkers',
      showDeviceOverlay: 'showDeviceOverlay',
    }),
    ...mapState('Common', {
      cMap: 'cMap'
    }),
    clsName () {
      return `icon-small-${this.deviceType}` + this.isGrayCls
    },
    isGrayCls () {
      // return this.deviceStatus == 1 ? "-g" : "";
      // 更新时间在24小时内 显示 在线状态   否则是离线状态
      return dayjs.getOnlineState(this.deviceUpdateTime) ? '' : '-g'
    }
  },

  mounted: function () {
    if (this.position[0] && this.position[1]) {
      let numLongitude = parseFloat(this.position[0])
      let numLatitude = parseFloat(this.position[1])
      if (isNaN(numLongitude) || isNaN(numLatitude)) return
      // eslint-disable-next-line
      this.overlay = new AMap.Marker({
        position: this.position,
        content: `<div class="${this.clsName} icon-img-box"></div>`,
        title: this.content,
        extData: {
          type: this.deviceType,
          online: dayjs.getOnlineState(this.deviceUpdateTime),
          id: this.deviceId
        }
      })

      this.overlay.on('click', () => {
        this.bus.$emit('showInfo')
        this.$store.state.Map.isCloseLable = false
        this.generateInfo()
        this.cMap.setCenter(this.position) // 将视角移到中心
        this.setDeviceIdsClicked([this.deviceId])
        this.clearOverGroup() // 清除其他覆盖物
      })

      this.addDeviceMarkers(this.overlay)
      this.addDeviceMarkersOrigin(this.overlay)
    }
  },
  beforeDestroy () {
    if (this.showDeviceOverlay) {
      this.$store.state.Map.showDeviceOverlay = false
    }
  },
  methods: {
    ...mapMutations('Map', {
      addDeviceMarkers: 'addDeviceMarkers',
      addDeviceMarkersOrigin: 'addDeviceMarkersOrigin',
      setDeviceIdsClicked: 'setDeviceIdsClicked'
    })
  }
}
</script>

<style scoped>
.device-overlay {
  z-index: 10;
  position: relative;
}
.device-overlay img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
</style>
