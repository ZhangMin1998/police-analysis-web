export default {
  data () {
    return {
      infoWindow: null,
    }
  },
  methods: {
    // 生成信息窗口
    generateInfo () {
      // eslint-disable-next-line
      this.infoWindow = new AMap.InfoWindow({
        anchor: this.anchor,
        content: this.$el, //使用默认信息窗体框样式，显示信息内容
        position: this.position,
        retainWhenClose: true,
        // eslint-disable-next-line
        offset: new AMap.Pixel(10, -24),
      })
      this.infoWindow.open(this.cMap, this.position)
    },
    closeInfoWindow () {
      this.infoWindow && this.infoWindow.close()
    },
  },
}
