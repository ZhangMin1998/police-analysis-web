<template>
  <div class="CusLitterBox">
    <div class="CusLitterBox-icon">
      <img class="img" :src="imgUrl" />
    </div>

    <div class="CusLitterBox-right">
      <slot>
        <div class="CusLitterBox-topText">{{ topText }}</div>
        <div class="CusLitterBox-bottomText">{{ bottomText }}</div></slot
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'CusLitterBox',
  props: {
    topText: String,
    bottomText: [String, Number],
    icon: String
  },
  computed: {
    imgUrl () {
      return require(`@/assets/img/${this.icon}.png`)
    }
  }
}
</script>

<style lang="less" scoped>
.CusLitterBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--base-text-color-to-999999);
  letter-spacing: 1px;
  background: linear-gradient(
    90deg,
    rgba(150, 167, 211, 0.06) 0%,
    rgba(150, 167, 211, 0.22) 52%,
    rgba(150, 167, 211, 0.06) 100%
  );
  .CusLitterBox-icon {
    margin-right: 8px;
    .img {
      width: 24px;
      height: 24px;
    }
  }
  .CusLitterBox-bottomText {
    font-size: 16px;
    color: var(--base-text-color-1);
  }
  .CusLitterBox-topText {
    font-size: 14px;
    color: var(--base-text-color-to-999999);
  }
}
</style>
