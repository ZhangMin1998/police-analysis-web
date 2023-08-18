import Amap from '_com/amap/Map'
import MapControl from '_com/map/map-control'

export default {
  components: {
    Amap,
    MapControl,
  },
  computed: {
    center () {
      return this.$store.state.User.centrePos
    },
  },
}
