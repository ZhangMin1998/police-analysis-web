<template>
  <div class="CusLineTitle">
    <div class="CusLineTitle-icon">
      <ElImage
        :imgSet="{
          src: require('@/assets/img/' + (icon || 'icon-morenHeader') + '.png'),
          width: 16,
          height: 16,
          errorSrc: 'icon-morenHeader',
          list: []
        }"
      ></ElImage>
    </div>
    <div class="CusLineTitle-label">
      {{ title }}
    </div>
  </div>
</template>

<script>
import ElImage from '@/components/BasicComponents/ElImage'

export default {
  name: 'CusLineTitle',
  components: {
    ElImage
  },
  props: {
    icon: { type: String },
    title: { type: String }
  }
}
</script>

<style lang="less" scoped>
.CusLineTitle {
  display: flex;
  padding: 11px 16px;
  box-sizing: border-box;
  font-size: 14px;
  background: linear-gradient(to right, rgba(255, 255, 255, .07) 0%, rgba(255, 255, 255, 0) 100%);
  background-size: 3px 100%;
  border-radius: 2px;
  .CusLineTitle-icon {
    margin-right: 8px;
  }
  .CusLineTitle-label {
    color: var(--base-text-color-1);
  }
}
</style>
