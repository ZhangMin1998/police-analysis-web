<template>
<div class='table_content_wrap'>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowStyle"
    :border='true'
  >
    <el-table-column
      v-for='(item, index) in fieldList'
      :key='`col_${index}`'
      :prop="item.fieldNameEn"
      :label="item.fieldNameCn"
      :min-width='item.fieldWidth + 54'
      :show-overflow-tooltip="true"
      :resizable="true"
    >
      <template slot-scope="{ row }">
        <div
          class='value'
          :class='{ "is_link": textLink.includes(item.fieldNameEn) }'
          @click='$emit("textLinkClick", item.fieldNameEn, row)'
        >
          {{
            item.fieldType === 'BIGINT' && typeof row[item.fieldNameEn] === 'number' ?
              row[item.fieldNameEn] :
              row[item.fieldNameEn] || '--'
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="iconLink.length && tableData.length"
      label="操作"
      :width="operaWidth"
      :resizable="false"
    >
      <template slot-scope="scope">
        <div class='opera_btn'>
          <i
            v-for="(btnItem, btnIndex) in iconLink"
            :key="btnIndex"
            class="iconfont"
            :class="[btnItem.icon]"
            :title="btnItem.label"
            @click.prevent="$emit('iconLinkClick', btnItem.linkId, scope.row)"
          ></i>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div v-if='tableData.length' class="table_pagination">
    <div class="total">总数： {{ total }}</div>
    <el-pagination
      :total="listData.length"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      background
      layout="prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</div>
</template>

<script>
export default {
  name: 'TableContent',
  props: {
    // 字段列表
    fieldList: {
      type: Array,
      default: () => []
    },
    // 列表数据
    listData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    // 图标链接
    iconLink: {
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
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示的条数
      tableData: [],
      operaWidth: 72
    }
  },
  watch: {
    currentPage: {
      handler () {
        this.setTableData()
      }
    },
    listData: {
      handler () {
        this.currentPage = 1
        this.setTableData()
      }
    },
    'iconLink.length': {
      handler (newVal) {
        if (newVal <= 2) this.operaWidth = this.formatPx(72)
        else this.operaWidth = this.formatPx(36 + newVal * 24)
      },
      immediate: true
    }
  },
  mounted () {
    this.setTableData()
  },
  methods: {
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    setTableData () {
      this.tableData = []
      let tableData = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.listData.forEach((item, index) => {
        if (index >= start && index < end) {
          tableData.push(item)
        }
      })
      this.tableData = tableData
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
/*::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 5px !important; !* 横向滚动条 *!
  &:hover {
    height: 16px !important; !* 横向滚动条 *!
  }
}*/
.table_content_wrap {
  width: 100%;
  height: 100%;
  /deep/.el-table {
    height: calc(100% - 40px);
  }
  /deep/.el-table__cell {
    font-weight: 400;
  }
  /deep/.el-table__body-wrapper {
    height: calc(100% - 48px);
    overflow-y: auto;
  }
  .edit_header {
    height: 21px;
    line-height: 21px;
    /deep/.el-input {
      .el-input__inner {
        height: 21px;
        line-height: 21px;
        border: 0;
        padding: 0;
        color: var(--base-text-color-to-666666);
      }
    }
  }
  .opera_btn {
    i {
      font-size: 16px;
      color: var(--base-text-color-to-999999);
      margin-right: 8px;
      cursor: pointer;
    }
  }
  .value {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  .is_link {
    color: var(--active-color);
    cursor: pointer;
  }
  .table_pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    .total {
      font-size: 16px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
    }
  }
}
</style>
