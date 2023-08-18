<template>
<div class='opera_header_wrap'>
  <div class='breadcrumb'>
    <div
      v-for='(item, index) in breadcrumbData'
      :key='index'
      class='breadcrumb_item'
      :class='{ "can_edit": item.canOpera }'
    >
      <span v-if='index !== 0' class='division'>/</span>
      <span :class='{ "can_opera" : item.canOpera}' @click='tabClick(item)'>{{ item.tabName }}</span>
    </div>
  </div>
  <div class='call_back' @click='$emit("callBack")'>
    <i class='iconfont icon-fanhui'></i>
    <span>返回</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'OperaHeader',
  props: {
    breadcrumbData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    tabClick (item) {
      if (!item.canOpera) return
      this.$emit('callBack')
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.opera_header_wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-color-3);
  padding: 16px 24px 16px 16px;
  color: var(--base-text-color-to-666666);
  font-size: 14px;
  line-height: 19px;
  .breadcrumb {
    display: flex;
    .breadcrumb_item {
      display: flex;
      &.can_edit {
        color: var(--base-text-color-1);
      }
      .can_opera {
        cursor: pointer;
        &:hover {
          color: var(--active-color);
        }
      }
      .division {
        margin: 0 4px;
      }
    }
  }
  .call_back {
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 16px;
      color: var(--return-back-i-color);
      margin-right: 8px;
    }
    span {
      font-size: 14px;
      font-weight: bold;
      color: var(--base-text-color-1);
    }
  }
}
</style>
