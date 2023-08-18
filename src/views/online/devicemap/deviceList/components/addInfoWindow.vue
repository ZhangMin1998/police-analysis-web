<template>
  <div class="infoWindow-c">
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import infoWindowMixin from '@/mixins/customInfoWindow'
export default {
  mixins: [infoWindowMixin],
  props: {
    position: {
      type: Array,
      default: () => [0, 0],
    },

    anchor: {
      type: String,
      default: 'top-left',
    },

    showSiteFrom: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState('Common', {
      cMap: 'cMap',
    }),
  },

  watch: {
    position (newValue) {
      if (!newValue) return
      if (newValue && !newValue[0]) return
      if (newValue && newValue.length > 0) {
        this.closeInfoWindow()
        this.generateInfo()
      }
    },

    showSiteFrom () {
      this.closeInfoWindow()
      this.generateInfo()
    },
  },

  mounted () {
    if (!this.position) return
    if (this.position && !this.position[0]) return
    this.$nextTick(() => this.generateInfo())
  },

  beforeDestroy () {
    this.closeInfoWindow()
  },
}
</script>

<style lang="less" scoped></style>
