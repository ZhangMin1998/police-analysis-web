<template>
  <div class="popup" ref="clickpop"></div>
</template>

<script>
export default {
  inject: ['addOverlay', 'removeOlver'],
  props: {
    list: {
      type: Array,
      required: true
      // default: []
    },
    lineType: {
      type: String,
      default: 'solid'
    }
  },
  data () {
    return {
      pathOverlay: null,
      // list: DEFAULT_DATA,
      pathList: []
    }
  },
  watch: {
    list: function () {
      this.pathOverlay && this.removeOlver(this.pathOverlay)
      this.formatData()
      this.initPoly()
    }
  },
  mounted () {
    this.pathOverlay && this.removeOlver(this.pathOverlay)
    this.formatData()
    this.initPoly()
  },
  methods: {
    initPoly () {
      // eslint-disable-next-line
      this.pathOverlay = new AMap.Polyline({
        isOutline: false,
        path: this.pathList,
        strokeColor: '#89782d',
        // outlineColor: '#fff',
        // 折线样式还支持 'dashed'
        strokeStyle: this.lineType,
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        zIndex: 50
      })

      this.addOverlay(this.pathOverlay)
    },
    formatData () {
      this.pathList = this.list.reduce((acc, v) => {
        acc.push(v.location)
        return acc
      }, [])
    }
  }
}
</script>

<style>
</style>
