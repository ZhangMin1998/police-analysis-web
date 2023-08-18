<template>
  <div class="card">
    <div class="card_name">{{ item.phone || '--' }}</div>
    <div class="card_label">
      手机号：<span>{{ item.phone || '--' }}</span>
    </div>
    <div class="card_label">
      imei：<span>{{ item.imei || '--' }}</span>
    </div>
    <div class="card_label">
      imsi：<span>{{ item.imsi || '--' }}</span>
    </div>

    <div class="card_optImg" @click="handleCheck(item)">
      <i class='iconfont icon-xiangqing' title="详情"></i>
<!--      <img-->
<!--        :src="require('@/assets/img/icon-check.png')"-->
<!--        alt="详情"-->
<!--        title="详情"-->
<!--        width="24"-->
<!--        height="24"-->
<!--      />-->
    </div>
  </div>
</template>

<script>
// import { reactive, toRefs } from '@vue/composition-api'

export default {
  name: 'Card',
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  setup (prop, context) {
    const handleCheck = item => {
      context.emit('handleCheck', item)
    }
    return {
      handleCheck
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  background-color: var(--table-head-bg-color);
  width: 260px;
  height: 135px;
  box-sizing: border-box;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .card_name {
    font-size: 18px;
    font-weight: 600;
    color: var(--base-text-color-1);
    margin-bottom: 10px;
  }
  .card_label {
    display: flex;
    color: var(--base-text-color-to-999999);
    line-height: 28px;
    > span {
      color: var(--base-text-color-1);
    }
    .value {
      color: var(--base-text-color-1);
    }
  }
  .card_optImg {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
    i {
      font-size: 24px;
      color: var(--base-text-color-to-999999);
    }
  }
}
</style>
