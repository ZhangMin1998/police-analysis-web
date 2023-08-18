<template>
  <div class="choose-mode">
    <div
      class="choose-mode-item"
      :class="{ active: item.value == selected }"
      v-for="(item, idx) in list"
      :key="idx"
      @click="handleClick(item)"
    >
      <div class="icon">
        <i class='iconfont' :class='item.src'></i>
      </div>
      <div>{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selected: {
      type: [String, Number],
      required: true
    }
  },
  // inject: ['drawPolyLine', 'closePolyLine'],
  data () {
    return {
      list: [
        { label: '单选场所', value: 1, src: 'icon-a-7' },
        { label: '框选场所', value: 2, src: 'icon-a-zu997' },
      ],
    }
  },
  methods: {
    handleClick ({ value }) {
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="less" scoped>
.choose-mode {
  display: flex;
  align-items: center;

  .choose-mode-item {
    display: flex;
    align-items: center;
    color: var(--base-text-color-1-to-666666);
    border: 1px solid var(--button-plain-border-color);
    margin-right: 30px;
    padding: 8px;
    cursor: pointer;

    &.active {
      // background-color: red;
      border: 1px solid var(--active-color);
      color: var(--active-color);
    }

    .icon {
      display: flex;
      align-items: center;
      margin-right: 8px;
      font-size: 20px;
    }
  }
}
</style>
