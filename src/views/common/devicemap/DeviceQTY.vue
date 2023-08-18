<template>
  <div>
    <div class="onlineNum">
      <span :class="[{ active: value == 0 }, 'item']" @click.stop.prevent="showDevice(0)">
        <span class="key">全部</span
        ><span>（{{ devRate.online || '0' }}/{{ devRate.all || '0' }}）</span></span
      >
      <el-divider direction="vertical"></el-divider>
      <span :class="[{ active: value == 1 }, 'item']" @click.stop.prevent="showDevice(1)">
        <span class="key">在线</span><span>（{{ onlineRate }}%）</span></span
      >
      <el-divider direction="vertical"></el-divider>
      <span :class="[{ active: value == 2 }, 'item']" @click.stop.prevent="showDevice(2)">
        <span class="key">离线</span><span>（{{ offlineRate }}%）</span></span
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    devRate: { //  [] 在线个数 和 所有设备数
      type: Object,
      // require: true
    }
  },
  computed: {
    onlineRate () {
      if (this.devRate.all === 0) return 0
      return (parseFloat(this.devRate.online / this.devRate.all).toFixed(4) * 100 ).toFixed(2)
    },
    offlineRate () {
      if (this.devRate.all === 0) return 0
      return (100 - this.onlineRate).toFixed(2)
    }
  },
  methods: {
    showDevice (state) {
      /** state 0=>全部 1=>在线 2=>离线 */
      this.$emit('deviceState', state)
      this.$emit('input', state)
    },
  },
}
</script>

<style lang="less" scoped>
.onlineNum {
  cursor: default;
  height: 32px;
  padding: 0 10px;
  line-height: 32px;
  border-radius: 5%;
  background-color: rgba(32, 43, 63, 1);
  letter-spacing: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 18px;
  z-index: 999;
  color: var(--base-text-color-1);
  font-size: 14px;
  .item {
    cursor: pointer;
    &.active {
      color: #1890ff;
    }
    &.active .key {
      color: #1890ff;
    }
    .key {
      color: var(--base-text-color-to-999999);
    }
    &:hover {
      color: #1890ff;
    }
    &:hover .key {
      color: #1890ff;
    }
  }
}
</style>
