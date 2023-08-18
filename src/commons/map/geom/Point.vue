<template>
<div></div>
</template>

<script>
export default {
  name: "ol-geom-point",
  props: ['coordinates'],
  data () {
    return {
      point:''
    }
  },
  inject: ['setGeometry'],
  created: function () {
    // eslint-disable-next-line
    this.point = new ol.geom.Point(this.coordinates);
  },
  mounted: function () {
    this.setGeometry(this.point);
  },
  watch: {
    coordinates: function (coordinates) {
      this.point.setCoordinates(coordinates);
    }
  }
}
</script>

<style scoped>

</style>
