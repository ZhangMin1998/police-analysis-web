<template>
<div class='warn_source_wrap'>
  <div class='header'>
    <div class='header_title'>
      <img :src='require("@/assets/img/set-bg.png")' alt=''>
      <div class='title'>溯源</div>
    </div>
    <i class='iconfont icon-xiangqingguanbi' @click='$emit("handleWarnSource", false)'></i>
  </div>
  <div class='source_content'>
    <div class='source_name'>银行业务</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'WarnSource'
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.warn_source_wrap {
  position: absolute;
  top: 76px;
  right: 64px;
  width: 424px;
  height: calc(100vh - 228px);
  background: var(--bg-color-9);
  padding-bottom: 16px;
  z-index: 20;
  .header {
    width: calc(100% - 32px);
    display: flex;
    justify-content: space-between;
    padding: 16px 0 12px;
    margin: 0 16px 16px;
    line-height: 24px;
    border-bottom: 1px solid var(--active-color);
    .header_title {
      position: relative;
      img {
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 65px;
        height: 8px;
      }
      .title {
        font-size: 16px;
        margin-left: 10px;
        color: var(--base-text-color-1);
      }
    }
    i {
      font-size: 24px;
      color: var(--button-plain-border-color);
      cursor: pointer;
      &:hover {
        color: var(--active-color);
      }
    }
  }
  .source_content {
    width: 100%;
    height: calc(100% - 85px);
    overflow-y: auto;
    padding: 0 16px;
    .source_name {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-1);
      margin-bottom: 12px;
      &::before {
        display: block;
        width: 4px;
        height: 16px;
        content: '';
        background: var(--base-text-color-1);
        margin-right: 8px;
      }
    }
  }
}
</style>
