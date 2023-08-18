<template>
  <div class="list">
    <!-- stripe	是否为斑马纹 table -->
    <el-table
      v-loading="isLoading"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :height="collapse.deHeight === undefined ? null : offsetHeight"
      stripe
      border
      style="width: 100%"
      :row-class-name="tableRowStyle"
      :cell-style="bigcellStyle"
      @selection-change="selectionChange($event, id)"
      row-key="id"
      @expand-change="expand"
      :expand-row-keys="expandKeyIds"
      ref="tables"
    >
      <!--  -->
      <div>
        <!-- 循环  外层 列数据 -->
        <div v-for="(colItem, colIndex) in collapse.columns" :key="colIndex">
          <!-- 展开-->
          <el-table-column v-if="colItem.type === 'expand'" type="expand">
            <template slot-scope="scope">
              <CollapseTable
                v-on="$listeners"
                v-if="scope.row.isOpen"
                :tableData="expandName ? scope.row[expandName] : scope.row.children"
                :collapse="collapse.child"
                :pageData="scope.row.pageData"
                :id="scope.row.id"
                :key="scope.row.id"
                :outIndex="scope.$index"
                :isLoading="scope.row.isLoading"
              />
            </template>
          </el-table-column>

          <!-- 多选 -->
          <el-table-column
            v-if="colItem.type === 'selection'"
            type="selection"
            :width="colItem.width"
          >
          </el-table-column>

          <!-- 下标 -->
          <el-table-column
            v-if="colItem.type === 'index'"
            :label="colItem.label"
            :width="colItem.width"
            type="index"
            :index="indexMethod"
          >
          </el-table-column>

          <!-- 单选 -->
          <el-table-column
            v-if="colItem.type === 'radio'"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
          >
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row[colItem.prop]" @change="colItem.event(scope.row)">
                <el-radio
                  v-for="(radioItem, radioIndex) in colItem.list"
                  :key="radioIndex"
                  :label="radioItem.value"
                  >{{ radioItem.label }}</el-radio
                >
              </el-radio-group>
            </template>
          </el-table-column>

          <!-- 图片 -->
          <el-table-column
            v-if="colItem.type === 'img'"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
          >
            <template slot-scope="scope">
              <ElImage
                :imgSet="{
                  src: scope.row[colItem.prop || 'headPic'],
                  width: 47,
                  height: 64,
                  errorSrc: 'icon-morenHeader',
                  list: [scope.row[colItem.prop || 'headPic']]
                }"
              ></ElImage>
            </template>
          </el-table-column>

          <!-- 正常 -->
          <el-table-column
            v-if="colItem.type === 'nor' || !colItem.type"
            :show-overflow-tooltip="true"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
            :formatter="colItem.renderFun"
            resizable
          >
            <template slot-scope="scope">
              {{
                colItem.renderFun
                  ? colItem.renderFun(scope.row)
                    ? colItem.renderFun(scope.row)
                    : '--'
                  : scope.row[colItem.prop] || '--'
              }}
            </template>
          </el-table-column>

          <!-- 正常 -->
          <el-table-column
            v-if="colItem.type === 'click'"
            :show-overflow-tooltip="true"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
            :formatter="colItem.renderFun"
          >
            <template slot-scope="scope">
              <a
                v-if="scope.row[colItem.isClickProp]"
                @click="colItem.click(scope.row)"
                style="color: #d4b022; cursor: pointer"
                >{{ scope.row[colItem.prop] }}</a
              >
              <span v-else>{{ scope.row[colItem.prop] }}</span>
            </template>
          </el-table-column>

          <!-- 开关 -->
          <el-table-column
            v-if="colItem.type === 'switch'"
            :show-overflow-tooltip="true"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[colItem.prop]"
                :active-text="colItem.activeText || '打开'"
                :inactive-text="colItem.inactiveText || '取消'"
                :active-value="colItem.onValue"
                :inactive-value="colItem.offValue"
                active-color="#4596E6"
                inactive-color="#8799BF"
                @change="colItem.event(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column
            v-if="colItem.type === 'status'"
            :prop="colItem.prop"
            :label="colItem.label"
            :width="colItem.width"
            :min-width="colItem.minWidth"
          >
            <template slot-scope="scope">
              <div v-for="item in colItem.statuList" :key="item.status">
                <font v-if="scope.row[colItem.prop] == item.status" :color="`#${item.color}`">{{
                  item.text
                }}</font>
              </div>
            </template>
          </el-table-column>

          <!-- 外层 操作 -->
          <el-table-column
            label="操作"
            align="right"
            :width="colItem.width || 150"
            v-if="colItem.type === 'btn'"
            :min-width="colItem.minWidth"
          >
            <template slot-scope="scope">
              <el-button
                v-for="(btnItem, btnIndex) in collapse.btnRender"
                :key="btnIndex"
                @click.native.prevent="btnItem.btnEvent(scope.$index, scope.row)"
                type="text"
                size="small"
              >
                <img
                  width="20"
                  height="20"
                  :src="require('@/assets/img/' + btnItem.icon + '.png')"
                  :alt="btnItem.alt"
                  :title="btnItem.alt"
                />
              </el-button>
            </template>
          </el-table-column>
        </div>
      </div>

      <!-- 外层 自定义暂无数据 -->
      <template slot="empty">
        <div>暂无数据</div>
      </template>
    </el-table>
    <!-- 外层 展示分页 -->
    <div class="pagination" v-if="pageData">
      <div class="totals">总数：{{ pageData.total || 0 }}</div>
      <el-pagination
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
import ElImage from '@/components/BasicComponents/ElImage'
export default {
  name: 'CollapseTable',
  components: {
    ElImage
  },
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
    },
    expandName: {
      type: String
    },
    fromWarn: {
      type: Boolean,
      default: false
    },
    highLightRowIndex: {
      type: [Number, String]
    },
    expandKeyIds: {
      type: Array
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
    offsetHeight () {
      if (this.tableData.length === 0 && !this.fromWarn) {
        return 160
      }
      if (!this.collapse.deHeight) {
        // 展开表格
        return this.tableData.length * 54 + 35
      } else if (typeof this.collapse.deHeight === 'string') {
        return this.collapse.deHeight
      } else if (this.collapse.child) {
        // 外层表格
        return this.screenHeight - this.collapse.deHeight
      }
      return 160
    }
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
  created () {
    // console.log(this.rowKey);
    // console.log(this.expandKeyId);
  },

  methods: {
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
    tableRowStyle ({ row, rowIndex }) {
      if (row.highlight) {
        return 'highlignt-row'
      }
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
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
  // background: rgba(32, 43, 63, 0.6);
  background: var(--quyufangkong-table-bg);
}
@-moz-document url-prefix(){
  .list {
    height: auto !important;
  }
}
.el-table__expanded-cell .list {
  padding-left: 48px;
  box-sizing: border-box;
}

.list/deep/ .el-table,
.list /deep/ .el-table th,
.list /deep/ .el-table__expanded-cell {
  // background: transparent;
  font-size: 16px;
  color: var(--base-text-color-1);
}
.list /deep/ .el-table__expanded-cell {
  // background: #1f2b3f !important;
  // background: #1f2b3f !important;
  background: var(--expand-table-bg-color) !important;
}
.list /deep/ .el-table th {
  color: var(--base-text-color-to-999999);
}
//.list /deep/ .el-table tr {
//  background: var(--table-head-bg-color) !important;
//}
.list /deep/ .el-table tr td,
.list /deep/ .el-table tr th {
  border-bottom: none;
  text-align: left;
  height: 54px;
  padding: 0;
  box-sizing: border-box;
}

//.list /deep/ .el-table__row--striped,
//.list /deep/ .el-table__row--striped td {
//  background: var(--table-head-bg-color) !important;
//}
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
  background-color: var(--table-head-bg-color);
  // background-color: rgba(255, 255, 255, 0.04);
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
  border: 1px solid rgba(53, 62, 91, 0.64) !important;
}
</style>
