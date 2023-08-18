<template>
  <div class="list">
    <!-- stripe	是否为斑马纹 table -->
    <el-table
      v-loading="isLoading"
      element-loading-background="rgba(36, 47, 70, 1)"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :row-style="{ height: '40px !important' }"
      height="75vh"
      border
      style="width: 100%"
      @selection-change="selectionChange($event, id)"
      row-key="id"
      :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
      ref="tables"
    >
      <el-table-column prop="itemName" label="菜单名称" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.itemName }}</span>
          <!-- <Ellipsis :wordsLength="30" :value="scope.row.itemName" /> -->
        </template>
      </el-table-column>
      <el-table-column prop="urlPath" label="菜单路径" width="180"> </el-table-column>
      <el-table-column prop="hidden" label="菜单显示状态">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden ? '隐藏' : '显示' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="sortNum" label="sortNum"> </el-table-column>
      <el-table-column prop="meta" label="附加属性" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="perms" label="授权标识" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i
            class='iconfont icon-bianji'
            title="编辑"
            @click="btnEvent('edit', scope.$index, scope.row)"
          ></i>
          <i
            v-if="scope.row.parentId !== 0 || (scope.row.parentId === 0 && !scope.row.list.length)"
            class='iconfont icon-delete'
            title="删除"
            @click="btnEvent('del', scope.$index, scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-if="pageData">
      <div class="totals">总数：{{ pageData.total || 0 }}</div>
      <el-pagination
        v-show="pageData.total > pageData.pageSize"
        background
        layout="prev, pager, next"
        @current-change="pageData.event($event, outIndex)"
        :page-size="pageData.pageSize"
        :pager-count="pageData.pagerCount ? pageData.pagerCount : 7"
        :total="pageData.total"
        :current-page.sync="pageData.curPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CollapseTable',
  props: {
    id: {
      type: [Number, String]
    },
    collapse: {
      type: Object
    },
    outIndex: {
      type: Number,
      default: -1
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    pageData: {
      type: Object
    }
  },
  data () {
    return {
      rowHeight: 45,
      expands: [],
      pageIndex: 1
    }
  },

  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),

    // offsetHeight () {
    //   if (this.tableData.length === 0) {
    //     return 160
    //   }
    //   // if (!this.collapse.deHeight) {
    //   //   // 展开表格
    //   //   return this.tableData.length * 54 + 35
    //   // } else if (this.collapse.child) {
    //   //   // 外层表格
    //   //   return this.screenHeight - this.collapse.deHeight
    //   // }
    // }
  },

  watch: {
    'pageData.curPage': {
      handler: function (val) {
        this.pageIndex = val
      },
      immediate: true, //关键
      deep: true
    }
  },

  methods: {
    btnEvent (type, index, row) {
      if (type === 'edit') {
        this.$emit('edit', index, row)
      } else {
        this.$emit('deleteEvent', index, row)
      }

    },
    indexMethod (index) {
      let curpage = this.pageIndex //单前页码，具体看组件取值
      let limitpage = this.pageData.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage
    },
    toggleRowExpend (id, boolean) {
      this.$nextTick(() => {
        if (this.$refs.tables && this.$refs.tables.toggleRowExpansion) {
          this.$refs.tables.toggleRowExpansion({ id: id }, boolean)
        }
      })
    },

    /**  多选  */
    selectionChange (row, id) {
      this.$emit('selectionChange', row, id)
    },

    /**  展开分组  */
    expand (row) {
      this.$emit('expand', row)
    },

    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },
    /** 表格样式 */
    bigcellStyle () {
      let str = 'height:' + this.rowHeight + 'px;'
      return str
    },

    /** 表格样式 */
    cellStyle (row) {
      let str = ''
      if (row.columnIndex == 3) {
        // 在线/离线
        if (row.row.deviceStatus == 1) {
          str = 'color:#3BC022;'
        } else {
          str = 'color:#F63F70;'
        }
      }
      return str
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--quyufangkong-table-bg);
}
.el-table__expanded-cell .list {
  padding-left: 48px;
  box-sizing: border-box;
}

.list/deep/ .el-table,
.list /deep/ .el-table th,
.list /deep/ .el-table__expanded-cell {
  background: transparent;
  font-size: 16px;
  color: var(--base-text-color-1);
}
.list /deep/ .el-table__expanded-cell {
  background: #1f2b3f !important;
}
.list /deep/ .el-table th {
  color: var(--base-text-color-to-999999);
}
.list /deep/ .el-table tr {
  background: var(--table-head-bg-color) !important;
}
.list /deep/ .el-table tr td,
.list /deep/ .el-table tr th {
  border-bottom: none;
  text-align: left;
  height: 41px;
  padding: 0;
  box-sizing: border-box;
}

.list /deep/ .el-table__row--striped,
.list /deep/ .el-table__row--striped td {
  background: var(--table-head-bg-color) !important;
}
.list /deep/ .el-table::before {
  height: 0;
}
// .list /deep/ .el-table__expanded-cell {
//   padding: 0 48px !important;
//   box-sizing: border-box;
// }
.list /deep/ .el-table__expanded-cell .el-table__row,
.list /deep/ .el-table__expanded-cell tr,
.list /deep/ .el-table__expanded-cell tr td,
.list /deep/ .el-table__expanded-cell tr th {
  height: 40px;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}

/deep/.el-table--enable-row-hover .el-table__body tr:hover > td,
/deep/.el-table__body tr:hover > td {
  background-color: var(--table-head-bg-color) !important;
}

/deep/.el-tooltip .el-table__expand-icon {
  display: none !important;
}
// /deep/.el-table__expand-icon {
//   width: 100% !important;
// }

/deep/.el-radio {
  margin-right: 12px;
}
/deep/.el-radio__label {
  font-size: 12px;
  padding-left: 2px;
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53,62,91,0.64) !important;
}
.icon-bianji, .icon-delete {
  font-size: 20px;
  color: var(--base-text-color-to-999999);
  cursor: pointer;
}
.icon-delete {
  margin-left: 10px;
}
</style>
