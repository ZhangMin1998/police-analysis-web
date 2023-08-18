<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ol-layer-heatmap',
  data () {
    return {
      heatmap: '',
    }
  },
  inject: ['addLayer'],
  provide: function () {
    return {
      setSource: this.setSource,
    }
  },
  created: function () {
    // eslint-disable-next-line
    this.heatmap = new ol.layer.Heatmap({
      opacity: 0.5,
      blur: 50,
      radius: 100,
    })
  },
  mounted: function () {
    this.addLayer(this.heatmap)
  },
  destroyed: function () {
    this.heatmap.setSource(undefined)
  },
  methods: {
    setSource: function (source) {
      this.heatmap.setSource(source)
    },
  },
}
</script>

<style scoped></style>
