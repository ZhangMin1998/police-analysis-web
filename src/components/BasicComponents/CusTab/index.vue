<template>
  <div class="CusTab">
    <ul class="CusTab-ul" :style="$attrs.CusTabUlCss">
      <li
        v-for="(item, index) in tabList"
        :key="index + '_' + item.label"
        :class="[
          tabType,
          'CusTab-li',
          {
            isActive: item.value === checkedValue
          }
        ]"
        @click="handleChange(item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CusTab',
  props: {
    tabList: { type: Array },
    tabType: { type: String, default: 'yellowLine' }
  },
  data () {
    return {
      checkedValue: ''
    }
  },
  methods: {
    // 切换选中
    handleChange (value) {
      this.checkedValue = value
      this.$emit('handleChangeTab', this.checkedValue)
    }
  }
}
</script>

<style lang="less" scoped>
.CusTab {
  .CusTab-ul {
    display: flex;
    .CusTab-li {
      color: @font-color-3;
      cursor: pointer;
      &.yellowLine {
        padding: 0 56 18 64;
        min-height: 35px;
        font-size: 18px;
        font-weight: bold;
        background: url('~@/assets/img/Layout-title-0.png') no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        &.isActive {
          background-image: url('~@/assets/img/Layout-title-1.png');
          color: #dabb92ff;
        }
      }
    }
  }
}
</style>
