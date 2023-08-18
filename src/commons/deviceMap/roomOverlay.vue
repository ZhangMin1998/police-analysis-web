<template>
  <div class="room-overlay"></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import infoWindowMixin from '@/mixins/infoWindow'
// import Popover from '../popover'
export default {
  // components: {
  //   Popover
  // },
  props: {
    position: {
      type: Array,
      validator: value => value.length === 2,
      required: true
    },
    roomData: {
      type: Object,
      default: () => {}
    },
    content: String
  },
  mixins: [infoWindowMixin],
  inject: ['clearOverGroup'],

  data () {
    return {
      overlay: null,
      data: {}
    }
  },
  computed: {
    ...mapState('Common', {
      cMap: 'cMap'
    }),
    ...mapState('Map', {
      roomOverlayActiveIndex: 'roomOverlayActiveIndex',
      showRoomOverlay: 'showRoomOverlay'
    })
  },

  watch: {
    position: function (position) {
      this.overlay.setPosition(position)
    }
  },

  mounted: function () {
    if (this.position[0] && this.position[1]) {
      let numLongitude = parseFloat(this.position[0])
      let numLatitude = parseFloat(this.position[1])
      if (isNaN(numLongitude) && isNaN(numLatitude)) return
      // eslint-disable-next-line
      this.overlay = new AMap.Marker({
        position: this.position,
        title: this.content,
        content: `<div class="icon-small-9"></div>`,
        extData: {
          ...this.roomData,
          site: true // 标记是场所
        }
      })

      this.overlay.on('click', () => {
        this.bus.$emit('showInfo')
        this.$store.state.Map.isCloseLable = false
        this.generateInfo()
        this.cMap.setCenter(this.position) // 将视角移到中心
        const obj = {
          roomData: this.roomData,
          index: this.inject
        }
        this.clearOverGroup() // 清除其他覆盖物
        this.showRoomPop(obj)
      })
      this.addRoomMarkers(this.overlay)
      // 设备地图 设备搜索 选择后打开指定lable
      this.bus.$on('device_lable', item => {
        this.generateInfo(item)
      })
    }
  },
  beforeDestroy () {
    if (this.showRoomOverlay) {
      this.$store.state.Map.showRoomOverlay = false
    }
  },

  methods: {
    ...mapMutations('Map', {
      addRoomMarkers: 'addRoomMarkers',
      setPlaceDataClicked: 'setPlaceDataClicked'
    }),

    // 点击场所图标保存场所信息
    showRoomPop (data) {
      this.setPlaceDataClicked(data.roomData)
    }
  }
}
</script>

<style scoped>
.room-overlay {
  position: relative;
  cursor: pointer;
}
img {
  width: 24px;
  height: 24px;
}
</style>
