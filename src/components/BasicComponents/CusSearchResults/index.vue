<template>
  <div>
    <slot name="searchInput"></slot>
    <div v-show="words && words.length && showResult">
      <div class="result" v-if="list && list.length">
        <div
          class="result_item_box"
          v-for="(poiItem, poiIndex) in list"
          :key="poiIndex"
          @click="confimAddress(poiItem)"
        >
          <div class="result_item">
            <div class="result_item_title">{{ poiItem.name }}</div>
            <div>
              {{ poiItem.address.length ? poiItem.address : poiItem.district }}
            </div>
          </div>
        </div>
      </div>
      <div class="result empty" v-else>抱歉，未查找到相关地址！</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    words: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      showResult: false
    }
  },
  methods: {
    hide () {
      this.showResult = false
    },
    show () {
      this.showResult = true
    },
    confimAddress (poiItem) {
      this.$emit('confimAddress', poiItem)
    }
  }
}
</script>

<style lang="less" scoped>
.result {
  position: absolute;
  top: 105%;
  right: 0;
  width: 100%;
  // background-color: rgba(37, 50, 75, 0.88);
  background-color: var(--bg-color-8);
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  line-height: 24px;
  .result_item_box {
    cursor: pointer;
  }
  .result_item {
    padding: 4px 16px 8px 16px;
    box-sizing: border-box;
    // border-bottom: 1px solid #354158;
    border-bottom: 1px solid var(--border-color-1);
    .result_item_title {
      color: #177ddc;
      line-height: 36px;
      font-size: 20px;
    }
  }
}
.result_item_box:hover {
  // background-color: rgba(48, 60, 84, 0.88);
  background-color: var(--search-input-hover-bg);
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}
</style>
