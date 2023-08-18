<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: 'ol-layer-vector',
  data () {
    return {
      layer: ''
    }
  },
  provide: function () {
    return {
      setSource: this.setSource
    }
  },
  inject: ['addLayer'],
  created: function () {
    // let self = this
    var center = [104.06, 30.67]
    var extent = [center[0] - 550 * 1000 / 2, center[1] - 344 * 1000 / 2, center[0] + 550 * 1000 / 2, center[1] + 344 * 1000 / 2];
    // eslint-disable-next-line
    this.layer = new ol.layer.Image({
      // eslint-disable-next-line
      source: new ol.source.ImageStatic({
        url: 'assets/icon_map/map_mask.svg',
        imageExtent: extent
      }),
      zindex: 500,
    })
  },
  mounted: function () {
    this.addLayer(this.layer)
    this.$el.remove()
  },
  destroyed: function () {
    this.layer.setSource(undefined)
  },
  methods: {
    setSource: function (source) {
      this.layer.setSource(source)
    }
  }
}
</script>

<style scoped></style>
