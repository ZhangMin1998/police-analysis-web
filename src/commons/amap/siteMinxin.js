export default {
  data () {
    return {}
  },
  methods: {
    intiSite (list) {
      setTimeout(() => {
        this.initClusterRender(list)
        this.setCluster(this.map, list)
      }, 1500)
    }
  },
  mounted () {
    if (this.isRoom) {
      this.isSiteCluster && this.intiSite(this.roomMarkers)
    } else {
      this.isSiteCluster && this.intiSite(this.deviceMarkers)
    }
  },
}
