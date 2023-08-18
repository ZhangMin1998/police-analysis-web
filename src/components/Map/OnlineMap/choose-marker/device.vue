<template>
  <div class="device-overlay" v-if="false">
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: [String, Number],
    },
    position: {
      type: Array,
      validator: value => value.length === 2,
    },
    roomData: {
      type: Object,
      default: () => {},
    },
    index: {
      type: [String, Number],
    },
    content: String,
    hightIds: {
      // 高亮的id
      type: Array,
      default: () => [],
    },
    images: {
      type: Object,
      default: () => ({
        'active': 'icon-tab-room-active',
        'normal': 'icon-tab-room-normal'
      })
    }
  },
  inject: ['addOverlay'],
  data () {
    return {
      overlay: {},
      curHover: -1, // 当前 hover 的
    }
  },
  computed: {
    ...mapState('trackWarning', {
      selectedSiteList: 'selectedSiteList',
      selectedSiteInfo: 'selectedSiteInfo',
    }),
    clsName () {
      return this.roomData.isActive ? this.images['active'] : this.images['normal']
    },
  },
  watch: {
    'roomData.isActive': function () {
      this.overlay.setContent(`<div class="${this.clsName}"></div>`)
    },
  },
  methods: {
    ...mapMutations('trackWarning', {
      addSelectedSite: 'addSelectedSite',
      delSelectedSite: 'delSelectedSite',
      clearSelectedSite: 'clearSelectedSite',
    }),
    ...mapMutations('Map', {
      updateRoomList: 'updateRoomList',
      addRoomMarkers: 'addRoomMarkers',
    }),
    createMaker () {
      // eslint-disable-next-line
      this.overlay = new AMap.Marker({
        position: this.position,
        content: `<div class="${this.clsName}"></div>`,
        title: this.content,
        // offset: new AMap.Pixel(-13, -30),
      })
      console.log('over', this.overlay);
      this.overlay.on('click', () => {
        this.roomData.isActive = !this.roomData.isActive
        this.overlay.setContent(`<div class="${this.clsName}"></div>`)
        console.log('click', this.overlay);
      })
      // this.addOverlay(this.overlay)
      this.addRoomMarkers(this.overlay)
    },
    clickMarker () {
      this.$emit('updateMarker')
    },
    mouseenter (idx) {
      this.curHover = idx
    },
    mouseLeave () {
      this.curHover = -1
    },
    // 判断点是否在矩形内
    judgeIsInner (point, path) {
      // eslint-disable-next-line
      return AMap.GeometryUtil.isPointInRing(point, path)
    },
    // 监听矩形画完事件
    drawComplete ({ obj, data }) {
      console.log(obj)
      const re = this.judgeIsInner(this.overlay.getPosition(), data)
      if (re) {
        this.roomData.isActive = !this.roomData.isActive
      }
    },
  },
  created () {
    this.bus.$on('drawRectangle', this.drawComplete)
  },
  mounted () {
    // 初始化状态
    this.createMaker()
  },
  beforeDestroy () {
    this.bus.$off('drawRectangle')
  },
}
</script>

<style scoped>
.marker-img {
  z-index: 50;
  width: 24px;
}
</style>
