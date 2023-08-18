export default {
  data () {
    return {
      infoWindow: null,
    }
  },
  computed: {
    curZoom () {
      return this.$store.state.Map.zoom
    },
    isClose () {
      return this.$store.state.Map.isCloseLable
    },
  },
  watch: {
    curZoom: function (val, old) {
      // 缩小则取消，放大则不变
      val < old && this.infoWindow && this.infoWindow.close()
    },
    isClose: function (val) {
      val && this.infoWindow && this.infoWindow.close()
    },
  },
  methods: {
    // 生成信息窗口
    generateInfo (item) {
      if (item) {
        let htmlTemplate = ''
        if (item.hasOwnProperty.call('timeList')) {
          item.timeList.forEach(_c => (htmlTemplate += `<div>${_c}</div>`))
        } else {
          htmlTemplate = item.name
        }
        // eslint-disable-next-line
        this.infoWindow = new AMap.InfoWindow({
          content: `<div class="">${htmlTemplate}</div>`, //使用默认信息窗体框样式，显示信息内容
          position: item.location,
          retainWhenClose: true,
          // eslint-disable-next-line
          offset: new AMap.Pixel(2, -32),
        })
        this.infoWindow.open(this.cMap, item.location)
      } else {
        // eslint-disable-next-line
        this.infoWindow = new AMap.InfoWindow({
          content: `<div class="">${this.content}</div>`, //使用默认信息窗体框样式，显示信息内容
          position: this.position,
          retainWhenClose: true,
          // eslint-disable-next-line
          offset: new AMap.Pixel(2, -32),
        })
        this.infoWindow.open(this.cMap, this.position)
      }
    },
  },
  beforeDestroy () {
    // this.infoWindow && this.infoWindow.close()
  },
}
