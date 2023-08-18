<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'ol-layer-tile',
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
    // eslint-disable-next-line
    this.layer = new ol.layer.Tile({
      visible: true,
      preload: Infinity,
      zindex: 1,
      // eslint-disable-next-line
      source: new ol.source.OSM()
    })
  },
  mounted: function () {
    this.addLayer(this.layer)
    this.$el.remove()
  },
  methods: {
    setSource: function (source) {
      this.layer.setSource(source)
    }
  }
}
</script>

<style scoped></style>
