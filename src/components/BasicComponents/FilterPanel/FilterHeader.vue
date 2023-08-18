<template>
  <div class="filter-header-wrapper" :style="{ backgroundColor: $attrs['backgroundColor'] }">
    <div class="filter-a">
      <slot></slot>
    </div>
    <!-- :style="{ width: checkedWidth }" -->
    <div class="filter-l">
      <div
        v-if="isShowType"
        class="header"
        @click.stop.prevent="open"
        :style="{ color: isOpenState ? '#409eff' : '' }"
      >
        <img src="@/assets/img/icon-filter.png" />
        <span>过滤器</span>
      </div>

      <div class="content" v-if="isShowType">
        <div class="content-item" v-for="(item, idx) in value" :key="idx">
          <div class="label">{{ item.label }}</div>
          <div class="icon">
            <i class="content-close el-icon-close" @click="closeItem(idx, item)"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-r">
      <slot name="filterBtn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    deWidth: {
      type: [Number, String],
      default: 690
    },
    isShowType: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    isOpenState () {
      return this.$parent.isOpen
    },

    checkedWidth () {
      return `calc(100vw - ${this.deWidth}px)`
    }
  },

  methods: {
    open () {
      this.$emit('open')
    },
    closeItem (idx, item) {
      this.$emit('input', item)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-header-wrapper {
  display: flex;
  height: 60px;
  margin: 5px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-a {
    margin-right: 16px;
  }
  .filter-l {
    display: flex;
    flex: 1 1 auto;
    .header {
      cursor: pointer;
      color: var(--base-text-color-to-999999);
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        color: #409eff;
      }
      img {
        margin-right: 10px;
      }
    }
    .content {
      // flex: 1 1 auto;
      color: var(--device-map-devicelist-choosed-text-color);
      display: flex;
      margin: 0 24px;
      box-sizing: border-box;
      width: calc(100vw - 900px);
      overflow: auto;
      & > .content-item {
        white-space: nowrap;
        font-size: 14px;
        padding: 6px 14px;
        box-sizing: border-box;
        margin-right: 24px;
        display: flex;
        justify-content: space-between;
        // background: rgba(255, 255, 255, 0.1);
        background: var(--device-map-devicelist-choosed-bg-color);
        cursor: default;
        &:hover div.label {
          // color: #409eff;
          color: var(--active-color);
        }
        div.icon {
          display: flex;
          align-items: center;
          margin-left: 8px;
          &:hover .content-close {
            color: var(--active-color);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
