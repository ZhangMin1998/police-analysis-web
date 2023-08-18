<template>
  <!-- 超出弹窗显示文字 -->
  <div>
    <div class="rowFlex">
      <div class="key" :style="{ minWidth: labelWidth + 'px' }">{{ colKey }}</div>
      <el-popover
        placement="top-start"
        v-if="val && val.length > words"
        width="200"
        trigger="hover"
        :content="val.toString() || '--'"
      >
        <div slot="reference">
          {{ val || '--' | ellipsis(words) }}
        </div>
      </el-popover>
      <div class="val" v-else>
        {{ val || '--' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: [String, Number],
      default: '100',
    },
    colKey: {
      type: String,
      default: '',
    },

    val: {
      type: [String, Number],
      default: '',
    },
    words: {
      type: Number,
      default: 15,
    },
  },
}
</script>

<style lang="less" scoped>
.rowFlex {
  display: flex;
  font-size: 16px;
  .key {
    color: var(--base-text-color-to-999999);
  }
  .val {
    color: var(--base-text-color-1);
  }
}
</style>
