<template>
  <div class='tab_wrap'>
    <ul class="Tabs">
      <li
        class="Tabs_item"
        :class="{ active: item.isActived }"
        v-for="(item, index) in tabNav.list"
        :key="index"
        @click="handleClick(index, item)"
        @mouseout="mouseoutEvent"
        @mouseover="mouseoverEvent(index)"
      >
        <div class="left_border"></div>
        <div class="right_route">
          {{ item.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tabNav: {
      type: Object
    }
  },
  components: {},
  data () {
    return {
      hoverIndex: -1
    }
  },
  methods: {
    // 移入/移出效果
    mouseoutEvent () {
      this.hoverIndex = -1
    },
    mouseoverEvent (hoverIndex) {
      this.hoverIndex = hoverIndex
    },
    // 点击 tab
    handleClick (idx, item) {
      this.$emit('handleClick', idx, item)
    }
  }
}
</script>

<style lang="less" scoped>
.Tabs {
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;

  .Tabs_item {
    display: flex;
    margin-bottom: 17px;
    cursor: pointer;
    .left_border {
      width: 3px;
      height: 32px;
      background: var(--devicemap-active-color);
      margin-right: 3px;
    }
    .right_route {
      height: 30px;
      line-height: 32px;
      width: 119px;
      font-size: 14px;
      font-weight: bold;
      // background: linear-gradient(to right, #232c59, transparent);
      background: var(--tab-bg-color);
      text-align: center;
      color: var(--base-text-color-8);
      // border: 1px solid transparent;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-left: 1px solid;
      border-image: var(--border-image);
      // border-right: 1px solid transparent;
    }
  }
}
</style>
