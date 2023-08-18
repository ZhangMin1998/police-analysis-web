import OlMap from '@/commons/map/Map'
import MapControl from '_com/map/map-control'

export default {
  components: {
    OlMap,
    MapControl
  },
  computed: {
    center () {
      return this.$store.state.User.centrePos
    },
    oMap () {
      return this.$store.state.Ol.oMap
    }
  },
}
