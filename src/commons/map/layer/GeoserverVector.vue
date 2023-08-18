<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import GeoserverStyle from '../style/geoserver.wfs.style';

export default {
  name: "ol-layer-vector",
  data () {
    return {
      layer: '',
    }
  },
  provide: function () {
    return {
      setSource: this.setSource
    }
  },
  inject: ['addLayer'],
  created: function () {
    // let self = this;
    // eslint-disable-next-line
    this.layer = new ol.layer.VectorLayer({
      style: GeoserverStyle.setFeatureStyle
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
