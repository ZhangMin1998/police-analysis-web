<template>
  <div></div>
</template>

<script>
export default {
  inject: ['addLayer'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: 'polygon'
    }
  },
  data () {
    return {
      mouseTool: null,
      draw: null
    }
  },
  computed: {
    map () {
      return this.$store.state.Common.cMap
    }
  },
  watch: {
    open: function (val) {
      if (val) {
        this.initSelect()
      } else {
        this.closeDraw()
      }
    }
  },
  created () {
    this.bus.$on('mapComplete', this.initSelect) // 监听地图初始化;
  },
  beforeDestroy () {
    this.bus.$off('mapComplete')
    this.mouseTool?.off('draw')
    this.mouseTool?.close(true) //关闭，并清除覆盖物
  },

  methods: {
    initSelect () {
      if (this.mouseTool) {
        this.mouseTool[this.shape]()
      } else if (this.open) {
        // eslint-disable-next-line
        AMap.plugin(['AMap.MouseTool'], () => {
          // eslint-disable-next-line
          this.mouseTool = new AMap.MouseTool(this.map)
          this.mouseTool[this.shape]()
          this.mouseTool.on('draw', e => {
            const positionList = e.obj.getPath().map(_c => {
              return [_c.lng, _c.lat]
            })
            this.$emit('selectEnd', positionList)
            const res = this.map.getAllOverlays().slice(-1)
            this.map.remove(res)
          })
        })
      }
    },
    closeDraw () {
      this.mouseTool?.close(true) //关闭，并清除覆盖物
    }
  }
}
</script>

<style></style>
