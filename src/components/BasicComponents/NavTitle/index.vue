<template>
  <div class="nav-mode" @click="handleClick">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'NavTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup (prop, context) {
    const handleClick = () => {
      context.emit('handleTo')
    }

    return {
      handleClick
    }
  }
}
</script>

<style lang="less" scoped>
.nav-mode {
  background: #202b3f;
  width: 133px;
  height: 32px;
  line-height: 32px;
  color: #d8b733;
  font-weight: bold;
  font-size: 14px;
  padding-left: 17px;
  box-sizing: border-box;
  background: url('~@/assets/img/list-mode-bg.png') no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
</style>
