<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: 'ol-source-vector',
  data () {
    return {
      vector: ''
    }
  },
  provide: function () {
    return {
      addFeatures: this.addFeatures,
      addFeature: this.addFeature
    }
  },
  inject: ['setSource'],
  created: function () {
    // eslint-disable-next-line
    this.vector = new ol.source.Vector()
  },
  mounted: function () {
    this.setSource(this.vector)
    this.$el.remove()
  },
  methods: {
    addFeatures: function (features) {
      this.vector.addFeatures(features)
    },
    addFeature: function (feature) {
      this.vector.addFeature(feature)
    }
  }
}
</script>

<style scoped>
</style>
