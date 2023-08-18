<template>
<div class='edit_detail_wrap'>
  <el-row
    v-for='(row, rowInd) in colFieldList'
    :key='rowInd'
  >
    <el-col
      v-for='(col, colInd) in row'
      :key='col.id'
      :span='8'
    >
      <div class='item_info'>
        <div class='label' :style='{ "width": labelWidth(colInd) }'>{{ col.fieldNameCn + '：' }}</div>
        <div class='value' :class='{ "is_link": linkInfo.includes(col.fieldNameEn) }'>
          {{
            listData.length && listData[0][col.fieldNameEn] ? listData[0][col.fieldNameEn] : '--'
          }}
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'EditDetail',
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
    // 链接信息
    linkInfo: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
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
.edit_detail_wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /deep/.el-row {
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
    }
  }
}
</style>
