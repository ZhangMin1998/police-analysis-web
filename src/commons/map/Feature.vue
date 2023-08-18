<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'ol-feature',
  props: {
    properties: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      feature: '',
    }
  },
  inject: ['addFeature'],
  provide: function () {
    return {
      setGeometry: this.setGeometry,
      setStyle: this.setStyle,
    }
  },
  created: function () {
    // eslint-disable-next-line
    this.feature = new ol.Feature()
  },
  mounted: function () {
    this.feature.setProperties(this.properties)
    this.addFeature(this.feature)
    this.$el.remove()
  },
  watch: {
    properties: function (properties) {
      this.feature.setProperties(properties)
    },
  },
  methods: {
    setGeometry: function (geometry) {
      this.feature.setGeometry(geometry)
    },
    setStyle: function (style) {
      this.feature.setStyle(style)
    },
  },
}
</script>

<style scoped></style>
