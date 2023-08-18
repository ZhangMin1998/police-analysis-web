<template>
  <ul class="online-rate-wrapper">
    <!-- <li :class="[value.online ? 'rate-bg-active' : 'rate-bg']" @click="handleClick('online')">
      全部（<span>{{ devRate.online + devRate.offline }}</span>）
    </li>
    <li :class="[value.online ? 'rate-bg-active' : 'rate-bg']" @click="handleClick('online')">
      在线（<span class="count">{{ devRate.online }}</span> <span> {{ onlineRate }}% </span>）
    </li>
    <li :class="[value.offline ? 'rate-bg-active' : 'rate-bg']" @click="handleClick('offline')">
      离线（<span class="count">{{ devRate.offline }}</span> <span>{{ offlineRate }}%</span>）
    </li> -->
    <li :class="{ active: activeIndex === 0 }" @click="handleClick('all', 0)">
      <div class="border_right">全部（{{ devRate.online + devRate.offline }}）</div>
    </li>
    <li :class="{ active: activeIndex === 1 }" @click="handleClick('online', 1)">
      <div class="border_right">
        在线（<span class="count">{{ devRate.online }}</span
        >{{ onlineRate }}% ）
      </div>
    </li>
    <li :class="{ active: activeIndex === 2 }" @click="handleClick('offline', 2)">
      <div>
        离线（<span class="count">{{ devRate.offline }}</span
        >{{ offlineRate }}%）
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'deviceOnlineRate',
  props: {
    value: {
      type: String,
      require: true
    },
    devRate: {
      type: Object
    }
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  computed: {
    onlineRate () {
      const re = ((this.devRate.online / (this.devRate.online + this.devRate.offline)) * 100).toFixed(2)
      return isNaN(re) ? 0 : re
    },
    offlineRate () {
      const re = ((this.devRate.offline / (this.devRate.online + this.devRate.offline)) * 100).toFixed(2)
      return isNaN(re) ? 0 : re
    }
  },
  methods: {
    handleClick (key, index) {
      this.activeIndex = index
      // const curRate = key === 'online' ? this.onlineRate : this.offlineRate
      // const isCancel = curRate === '0.00'
      // console.log(this.value);
      // this.$set(this.value, key, !this.value[key])
      // this.$set(this.value, key, true)
      // if (isCancel) {
      //   return
      // }
      this.$emit('input', key)
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
  // background: rgba(22, 28, 46, 0.5);
  background: var(--device-map-toal-number-bg);
  user-select: none;
  // color: #6b7588;
  color: var(--device-map-toal-text-color);
  padding: 4px 14px 4px 2px;
  z-index: 50;
  border-radius: 2px;
  & > li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33px;
    cursor: pointer;
    margin-left: 12px;
    .border_right {
      height: 21px;
      border-right: 1px solid #CCE1FF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .count {
      margin-right: 16px;
    }
    &.active {
      color: var(--device-map-toal-text-active-color);
    }
  }
}
</style>
