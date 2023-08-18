<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import infoWindowMixin from '@/mixins/infoWindow'
// import Popover from '_com/popover'

export default {
  // components: {
  //   Popover
  // },

  mixins: [infoWindowMixin],
  inject: ['clearOverGroup'],
  props: {
    pointData: {
      type: Object,
      default: () => {}
    },
    content: String
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
      showDeviceOverlay: 'showDeviceOverlay'
    }),
    ...mapState('Common', {
      cMap: 'cMap'
    }),
    clsName () {
      return `icon-small-${this.pointData?.deviceType ?? '1'}` + this.isGrayCls
    },
    isGrayCls () {
      return this.pointData.online ? '' : '-g'
    }
  },

  mounted: function () {
    const { position, deviceType, online, id } = this.pointData
    if (!position) return
    if (position[0] && position[1]) {
      let numLongitude = parseFloat(position[0])
      let numLatitude = parseFloat(position[1])
      if (isNaN(numLongitude) || isNaN(numLatitude)) return
      // eslint-disable-next-line
      this.overlay = new AMap.Marker({
        position: position,
        content: `<div class="${this.clsName} icon-img-box"></div>`,
        title: this.content,
        extData: {
          type: deviceType || '1',
          online: online,
          id: id || ''
        }
      })

      this.overlay.on('click', () => {
        this.bus.$emit('showInfo')
        this.$store.state.Map.isCloseLable = false
        this.generateInfo()
        this.cMap.setCenter(this.pointData.position) // 将视角移到中心
        if (this.pointData.id) {
          this.setDeviceIdsClicked([this.pointData.id])
        }
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
