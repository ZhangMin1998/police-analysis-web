<template>
  <div class="reback" @click="clickEvent">
    <i class='iconfont icon-fanhui'></i>
<!--    <img width="16" height="16" :src="require('@/assets/img/' + 'icon-reback' + '.png')" />-->
    <span>返回</span>
  </div>
</template>

<script>
export default {
  methods:{
    clickEvent (){
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.reback {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 16px;
    color: var(--base-text-color-to-666666);
  }
  span {
    margin-left: 8px;
    color: var(--base-text-color-1);
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
