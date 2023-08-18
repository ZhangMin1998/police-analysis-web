<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import uuid from 'uuid/v4'

export default {
  name: 'ol-overlay',
  inject: ['addOverlay'],
  props: {
    id: {
      type: [String, Number],
      default: () => uuid(),
    },
    position: {
      type: Array,
      validator: value => value.length === 2,
      required: true,
    },
  },
  data () {
    return {
      overlay: '',
    }
  },
  created: function () {
    // eslint-disable-next-line
    this.overlay = new ol.Overlay({
      id: this.id,
      position: this.position,
    })
  },
  mounted: function () {
    this.overlay.setElement(this.$el)
    this.addOverlay(this.overlay)
  },
  destroyed: function () {
    //            this.overlay.setElement(undefined);
  },
  watch: {
    position: function (position) {
      this.overlay.setPosition(position)
    },
  },
}
</script>

<style scoped></style>
