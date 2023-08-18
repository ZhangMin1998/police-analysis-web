<template>
  <div class="CusInput">
    <div class="CusInput_label">{{ label }}：</div>
    <div class="CusInput_main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CusInput',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.CusInput {
  font-size: 16px;
  // border: 1px solid rgba(255, 255, 255, 0.2);
  // border: 1px solid var(--datapicker-input-border-color);
  border: 1px solid var(--border-color-input);
  border-radius: 2px;
  padding: 12px;
  padding-bottom: 0;
  padding-right: 0;
  color: var(--base-text-color-to-999999);
  margin-bottom: 12px;
}

.el-select {
  width: 100% !important;
}

/deep/.el-input__inner {
  border: none !important;
  width: 100% !important;
  padding: 0px;
}

/deep/.el-input--small .el-input__inner {
  background-color: transparent !important;
}
</style>
