<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

import GeojsonStyle from '../style/geojson.style';

export default {
  name: "ol-layer-vector",
  data () {
    return {
      layer: '',
      styles: new GeojsonStyle()
    }
  },
  provide: function () {
    return {
      setSource: this.setSource
    }
  },
  inject: ['addLayer'],
  created: function () {
    let self = this;
    // eslint-disable-next-line
    this.layer = new ol.layer.VectorLayer({
      style: self.styles.setFeatureStyle
    })
  },
  mounted: function () {
    this.addLayer(this.layer);
    this.$el.remove();
  },
  destroyed: function () {
    this.layer.setSource(undefined);
  },
  methods: {
    setSource: function (source) {
      this.layer.setSource(source);
    }
  }
}
</script>

<style scoped>

</style>
