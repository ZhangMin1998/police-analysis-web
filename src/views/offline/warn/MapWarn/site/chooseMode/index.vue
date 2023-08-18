<template>
  <div class="choose-mode">
    <ul class="choose-mode-wrapper">
      <li
        class="choose-mode-item"
        :class="{ active: item.value == curIdx }"
        v-for="(item, idx) in list"
        :key="idx"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  inject: ['drawPolyLine', 'closePolyLine'],
  data () {
    return {
      curIdx: 1, // 1 点选 2 框选
      list: [
        { label: '单选场所', value: 1 },
        { label: '框选场所', value: 2 }
      ]
    }
  },
  watch: {
    curIdx: function (val) {
      val === 1 ? this.closePolyLine() : this.drawPolyLine()
    }
  },
  methods: {
    handleClick ({ value }) {
      this.curIdx = value
    }
  }
}
</script>

<style lang="less" scoped>
.choose-mode {
  position: absolute;
  z-index: 100;
  top: 16px;
  left: 576px;
  box-sizing: content-box;
  width: 240px;
  height: 68px;
  background: @cur-bg;
  opacity: @cur-opacity;
  color: var(--base-text-color-1);
  &-wrapper {
    height: 68px;
    display: flex;
    justify-content: space-around;
  }
  &-item {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
