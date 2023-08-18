<template>
  <div>
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
        <div>
          <img
            class="Tabs_item_img"
            :src="
              require('@/assets/img/icon-doc-' +
                index +
                (item.isActived || hoverIndex == index ? '-a' : '') +
                '.png')
            "
          />
        </div>
        <div>
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
  background-color: #202b3f;
  height: 40px;

  .Tabs_item {
    display: flex;
    align-items: center;
    color: var(--base-text-color-to-999999);
    cursor: pointer;
    padding: 0 16px;
    &:hover {
      color: var(--active-color);
    }
    .Tabs_item_img {
      vertical-align: middle;
      margin-right: 3px;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
