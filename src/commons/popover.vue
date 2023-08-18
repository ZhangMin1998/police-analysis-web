<template>
  <div class="popover-wrapper">
    <div class="popover">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
  },
}
</script>

<style scoped>
.popover-wrapper {
  position: absolute;
  left: 50%;
  top: -58px;
  transform: translateX(-50%);
}
.popover {
  background: #fff;
  text-align: center;
  font-size: 20px;
  padding: 0 19px;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  color: var(--input-placehold-color);
  position: relative;
  white-space: nowrap;
}
.popover::after {
  content: '';
  width: 0;
  height: 0;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-top: 5px solid #fff;
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
}
</style>
