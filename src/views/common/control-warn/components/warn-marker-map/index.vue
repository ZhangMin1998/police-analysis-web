<template>
<div class='warn_marker_wrap'>
  <template v-if='showPoint'>
    <MapIconMark
      v-for='(item, index) in coordinateList'
      :key='index'
      :position="[item[0].longitude, item[0].latitude]"
      :icon='item[0].icon ? origin + item[0].icon : require(`@/assets/img/${$themeColor("--atlis-default-img")}.png`)'
      :label='item[0].controlInfo.name'
      :elementName='"warn_marker"'
      :customAttribute='{ unitType: "point", id: index, mapId: item[0].mapId }'
      :iconWidth='40'
      :iconHeight='40'
      :textOffsetY='-30'
      :textBackground='textBackground'
      :labelColor='labelColor'
      :className='"warn_point" + index'
      :bgStroke='bgStroke'
    ></MapIconMark>
  </template>
</div>
</template>

<script>
/* eslint-disable */
import MapIconMark from '@/components/Map/OfflineMap/MapIconMark'
import { mapState } from 'vuex'

export default {
  name: 'WarnMarker',
  components: {
    MapIconMark
  },
  props: {
    coordinateList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showPoint: false
    }
  },
  computed: {
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers || []
    },
    origin () {
      return window.location.origin + '/'
    },
    ...mapState('User', {
      theme: 'theme'
    }),
    textBackground () {
      return this.theme === 'light' ? '#FFFFFF' : '#394261'
    },
    labelColor () {
      return this.theme === 'light' ? '#333333' : '#FFFFFF'
    },
    bgStroke () {
      return this.theme === 'light' ? '#D6DDED' : '#545F81'
    }
  },
  mounted () {
    this.areaLayers.forEach(item => {
      if (item.className_.includes('warn_point')) {
        this.$store.state.Ol.oMap.removeLayer(item)
      }
    })
    this.showPoint = true
  },
  methods: {
    /*getIcon (level, type, isActive = false) {
      let warnType = isActive ? 'active_' + type : type
      return this.levelIcon[level][warnType]
    },
    changeMarkerStyle (id, level, type, label, isActive = false) {
      const _that = this
      const style = new ol.style.Style({
        image: new ol.style.Icon({
          src: require(`@/assets/img/${_that.getIcon(level, type, isActive)}.png`) || null,
          scale: 0.8
        }),
        // 文本样式
        text: new ol.style.Text({
          text: label,
          fill: new ol.style.Fill({
            color: '#fff'
          }),
          font: '14px Microsoft YaHei',
          offsetX: 0,
          offsetY: -30,
          padding: [2, 10, 0, 10],
          // 文本填充
          backgroundFill: new ol.style.Fill({
            color: _that.levelColor['active_' + level]
          })
        })
      })
      this.markerLayer.forEach(element => {
        if (element.get('id') === id) {
          element.setStyle(style)
        }
      })
    }*/
  }
}
</script>

<style lang='less' scoped>

</style>
