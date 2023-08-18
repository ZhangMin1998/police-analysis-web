<template>
  <div class="location-wrapper" @click="location">
    <span class="box"></span>
  </div>
</template>

<script>
export default {
  methods: {
    location () {
      const curView = this.$store.state.Ol.oMap.getView()
      curView.animate({
        zoom: this.$store.state.User.zoom,
        center: this.$store.state.User.centrePos,
        duration: 300,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.location-wrapper {
  width: 20px;
  height: 20px;
  // border-radius: 4px;
  background: @cur-bg;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  .box {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #798aad;
  }
}
</style>
