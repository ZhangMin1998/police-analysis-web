<template>
  <ul class="online-rate-wrapper">
    <li :class="[value.online ? 'rate-bg-active' : 'rate-bg']" @click="handleClick('online')">
      在线（<span class="count">{{ devRate.online }}</span> <span> {{ onlineRate }}% </span>）
    </li>
    <li :class="[value.offline ? 'rate-bg-active' : 'rate-bg']" @click="handleClick('offline')">
      离线（<span class="count">{{ devRate.offline }}</span> <span>{{ offlineRate }}%</span>）
    </li>
  </ul>
</template>

<script>
export default {
  name: 'deviceOnlineRate',
  props: {
    value: {
      type: Object,
      require: true
    },
    devRate: {
      type: Object
    }
  },
  computed: {
    onlineRate () {
      const re = ((this.devRate.online / (this.devRate.online + this.devRate.offline))* 100).toFixed(2)
      return isNaN(re) ? 0 : re
    },
    offlineRate () {
      const re = ((this.devRate.offline / (this.devRate.online + this.devRate.offline)) * 100).toFixed(2)
      return isNaN(re) ? 0 : re
    }
  },
  methods: {
    handleClick (key) {
      const curRate = key === 'online' ? this.onlineRate : this.offlineRate
      const isCancel = curRate === '0.00'
      this.$set(this.value, key, !this.value[key])
      if (isCancel) {
        return
      }
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="less" scoped>
.online-rate-wrapper {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 18px;
  user-select: none;
  z-index: 50;
  & > li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 306px;
    height: 33px;
    cursor: pointer;
  }
  & > li:first-child {
    margin-right: 16px;
  }
  .count {
    margin-right: 16px;
  }
  .rate-bg {
    background: url('~@/assets/img/dev-rate.png') no-repeat;
    background-size: 100% 100%;
    color: var(--base-text-color-1);
  }
  .rate-bg-active {
    background: url('~@/assets/img/dev-cate-active.png') no-repeat;
    background-size: 100% 100%;
    color: #D4B021;
  }
}
</style>
