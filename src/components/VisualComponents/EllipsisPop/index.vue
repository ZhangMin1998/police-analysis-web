<template>
  <div class="value_box" :style="{ width: width }">
    <el-popover
      :placement="placement"
      :trigger="trigger"
      :content="content + ''"
      :disabled="showColumnTip"
      :popper-class='popperClass'
    >
      <div
        class="value"
        :class="{ line_clamp: rowNum > 1 }"
        :style="lineNumStyle"
        slot="reference"
        @mouseover="mouseOn($event)"
      >
        {{ content || '--' }}
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'EllipsisPop',
  props: {
    content: {
      type: [String, Number],
      default: ''
    },
    rowNum: {
      type: Number,
      default: 1
    },
    placement: {
      type: String,
      default: 'top-start'
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    width: {
      type: String,
      default: '100%'
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showColumnTip: true
    }
  },
  computed: {
    lineNumStyle () {
      if (this.rowNum === 1) {
        return ''
      }
      if (this.rowNum > 1) {
        return {
          '-webkit-line-clamp': this.rowNum,
          'line-clamp': this.rowNum
        }
      }
      return ''
    }
  },
  methods: {
    mouseOn (e) {
      if (this.rowNum === 1) {
        if (e.target.scrollWidth > e.target.clientWidth) {
          this.showColumnTip = false
        } else {
          this.showColumnTip = true
        }
      }
      if (this.rowNum > 1) {
        if (e.target.scrollHeight > e.target.clientHeight) {
          this.showColumnTip = false
        } else {
          this.showColumnTip = true
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: var(--base-text-color-1);
}
.line_clamp {
  white-space: normal;
  display: -webkit-box; //特别显示模式
  -webkit-box-orient: vertical; //盒子中内容竖直排列
}
</style>
