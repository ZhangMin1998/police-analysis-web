<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  inject: ['addOverlay', 'removeOlver'],

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    layerClass: {
      type: String,
      default: 'count-marker',
    },

    content: {
      type: String,
    },
  },

  data () {
    return {
      markerList: [],
      curLayer: null,
    }
  },

  computed: {
    ...mapState('Common', {
      cMap: 'cMap',
    }),
  },

  watch: {
    list: function () {
      this.removeOlver(this.markerList)
      this.renderMarker()
    },
  },

  methods: {
    renderMarker () {
      this.markerList = []
      this.$nextTick(() => {
        this.list.forEach((item, idx) => this.generateMarker(item, idx + 1))

        this.markerList.forEach(marker => this.addOverlay(marker))
      })
    },

    generateMarker (item, idx) {
      // eslint-disable-next-line
      const overlay = new AMap.Marker({
        // eslint-disable-next-line
        offset: new AMap.Pixel(-16, -34),
        position: item,
        content: `<div class="count-marker icon-router-marker">${
          this.content == 'hide' ? '' : idx
        }</div>`,
        extData: {
          index: idx,
          pos: item,
        },
      })

      overlay.on('click', e => {
        this.$emit('clickMarker', e.target.getExtData())
      })

      this.markerList.push(overlay)
    },
  },
}
</script>

<style lang="less">
.count-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e64545;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: @font-color-3;
  font-size: 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
