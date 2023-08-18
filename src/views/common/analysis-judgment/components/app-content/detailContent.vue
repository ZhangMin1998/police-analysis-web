<template>
<div class='detail_content_wrap'>
  <div
    v-for='(row, rowInd) in colFieldList'
    :key='rowInd'
    :style='{ "width": rowWidth + "px" }'
    class='row'
  >
    <div
      v-for='(col, colInd) in row'
      :key='col.id'
      :style='{ "width": rowWidth / 3 + "px" }'
      class='item_info'
    >
      <div class='label' :style='{ "width": labelWidth(colInd) }'>{{ col.fieldNameCn + '：' }}</div>
      <div
        class='value'
        :class='{ "is_link": textLink.includes(col.fieldNameEn) }'
        @click='$emit("textLinkClick", col.fieldNameEn, listData[0])'
      >
        {{
          listData.length && listData[0][col.fieldNameEn] ? listData[0][col.fieldNameEn] : '--'
        }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DetailContent',
  props: {
    // 当前展示的字段
    colFieldInfo: {
      type: Array,
      default: () => []
    },
    // 列表数据
    listData: {
      type: Array,
      default: () => []
    },
    // 文字链接
    textLink: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rowWidth: 0,
      colFieldList: [],
      firstColWidth: 0,
      secondColWidth: 0,
      thirdColWidth: 0,
    }
  },
  watch: {
    colFieldInfo: {
      handler (newVal) {
        this.formatCol(newVal)
      },
      immediate: true
    }
  },
  mounted () {
    this.rowWidth = this.formatPx(1810)
  },
  methods: {
    // 字段发生改变时，格式化字段
    formatCol (list) {
      this.colFieldList = []
      this.firstColWidth = 0
      this.secondColWidth = 0
      this.thirdColWidth = 0
      const size = this.formatPx(16)
      const fontSize = size < 12 ? 12 : size
      list.forEach((item, index) => {
        const remainder = index % 3
        const ind = Math.floor(index / 3)
        if (remainder === 0) {
          this.colFieldList[ind] = [item]
        } else {
          this.colFieldList[ind].push(item)
        }
        const width = item.fieldWidth + fontSize
        if (remainder === 0) {
          if (width > this.firstColWidth) this.firstColWidth = width
        } else if (remainder === 1) {
          if (width > this.secondColWidth) this.secondColWidth = width
        } else {
          if (width > this.thirdColWidth) this.thirdColWidth = width
        }
      })
    },
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    labelWidth (ind) {
      if (ind === 0) {
        return this.firstColWidth + 'px'
      } else if (ind === 1) {
        return this.secondColWidth + 'px'
      } else {
        return this.thirdColWidth + 'px'
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.detail_content_wrap {
  height: 100%;
  overflow: auto;
  //&::-webkit-scrollbar {
  //  height: 5px !important; /* 横向滚动条 */
  //}
  .row {
    display: flex;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .item_info {
    display: flex;
    font-size: 16px;
    line-height: 21px;
    color: var(--base-text-color-1);
    .label {
      flex: none;
      white-space: nowrap;
      color: var(--base-text-color-to-666666);
    }
    .value {
      flex: 1;
    }
    .is_link {
      color: var(--active-color);
      cursor: pointer;
    }
  }
}
</style>
