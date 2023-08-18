<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: 'ol-layer-locus',
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
    // eslint-disable-next-line
    this.layer = new ol.layer.Vector({
      style: function () {
        // eslint-disable-next-line
        return new ol.style.Style({
          // eslint-disable-next-line
          stroke: new ol.style.Stroke({
            color: '#5a71e2',
            width: 3,
            lineJoin:'bevel',
            lineDash:[5],
          })
        })
      },
      zindex: 1000,
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
