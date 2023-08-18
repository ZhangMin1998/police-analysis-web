<template>
  <div></div>
</template>

<script>


import { mapState } from 'vuex'

export default {
  name: 'ol-view',
  inject: ['setView'],
  props: {
    center: {
      type: Array,
      default: () => [0, 0],
      validator: value => value.length === 2
    },
    zoom: {
      type: Number,
      default: 15
    },
    zooms: {
      type: Array,
      default: () => [12, 20]
    },
    enableRotation: {
      type: Boolean,
      default: true
    },
    projection: {
      type: String,
      default: 'EPSG:4326' // 墨卡托3857
    }
  },
  data () {
    return {
      view: ''
    }
  },
  computed: {
    ...mapState('User', {
      loginMap:'loginMap',
      tianMapInfo: 'tianMapInfo'
    })
  },
  watch: {
    center: function (newCenter) {
      this.view.setCenter(newCenter)
    },
    zoom: function (newZoom) {
      this.view.setZoom(newZoom)
    }
  },

  created () {
    // let viewExtent = undefined
    // if (this.loginMap === 'tiandimap') {
    //   if (this.searchCity === '肇庆') {
    //     viewExtent = [111.357, 22.772, 112.878, 24.392]
    //   } else if (this.searchCity === '威海' || this.searchCity === '荣成') {
    //     viewExtent = [120.807037, 36.639774, 123.075714, 37.610968]
    //   }
    // }
    var self = this
    // eslint-disable-next-line
    self.view = new ol.View({
      projection: self.projection,
      zoom: self.zoom,
      maxZoom: self.zooms[1],
      minZoom: self.zooms[0],
      extent: this.tianMapInfo.extent
    })
    self.view.on('click:center', function () {
      self.$emit('update:center', self.view.getCenter())
    })
    self.view.on('change:zoom', function () {
      self.$emit('update:zoom', self.view.getZoom())
    })
    //用BUS总线监听view的事件
    this.bus.$on('changeViewZoom', zoom => {
      this.zoom = zoom
    })
  },

  mounted () {
    this.setView(this.view)
    this.view.setCenter(this.center)
    this.$el.remove()
  }
}
</script>

<style scoped></style>
