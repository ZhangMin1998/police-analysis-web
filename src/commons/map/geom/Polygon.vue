<template>
<div></div>
</template>

<script>

export default {
  name: "ol-geom-polygon",
  props: ['coordinates'],
  data () {
    return {
      polygon: ''
    }
  },
  inject: ['setGeometry'],
  created: function () {
    // eslint-disable-next-line
    this.polygon = new ol.geom.Polygon(this.coordinates);
  },
  mounted: function () {
    this.setGeometry(this.polygon);
  },
  watch: {
    coordinates:function (coordinates) {
      this.polygon.setCoordinates(coordinates);
    }
  }
}
</script>

<style scoped>

</style>
