<template>
  <div class="filter-item-wrapper">
    <div class="header">
      {{ label }}
    </div>
    <ul class="content">
      <li
        v-for="(item, idx) in list"
        :key="idx"
        :class="{ active: isRadio ? value == item.value : value.includes(item.value) }"
        @click="changeIdx(idx, item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [Array, String],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    isRadio: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    changeIdx (idx, value) {
      if (!this.isRadio) {
        const index = this.value.indexOf(value) // 要么高亮，要么取消高亮
        index !== -1 ? this.value.splice(index, 1) : this.value.push(value)
        this.$emit('input', this.value)
      } else {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-item-wrapper {
  display: flex;
  flex-direction: row;
  padding: 15px 0;

  .header {
    color: var(--base-text-color-to-999999);
    display: flex;
    justify-content: center;
    padding: 6px 15px;
    min-width: 100px;
  }
  .content {
    list-style: none;
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
    & > li {
      user-select: none;
      cursor: pointer;
      padding: 6px 20px;
      // color: var(--base-text-color-1);
      color: var(--base-text-color-to-666666);
      margin-right: 14px;
      margin-bottom: 14px;
      &.active {
        // background: rgba(255, 255, 255, 0.2);
        background: var(--device-map-devicelist-choosed-bg-color);
        // color: #fff;
        color: var(--device-map-devicelist-choosed-text-color);
      }
    }
  }
}
</style>
