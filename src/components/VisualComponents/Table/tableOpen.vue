<template>
  <div class="tem_tableOpen">
    <el-table
      v-loading="isLoading"
      element-loading-background="rgba(25, 32, 53, 1)"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :cell-style="iCellStyle"
      :header-row-style="$attrs['header-row-style'] || iHeaderRowStyle"
      :row-class-name="tableRowStyle"
      :header-cell-style="$attrs['header-cell-style']"
      border
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(colItem, colIndex) in columns"
              :key="colIndex"
              :label="colItem.label"
              :show-overflow-tooltip="true"
            >
              <div v-if="colItem.type == 'cusMain'" >
                <slot name="cusMain" :item="props.row[colItem.prop]"></slot>
              </div>

              <span v-else>{{ props.row[colItem.prop] || '--' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <template v-for="showColItem in showColumns">
        <el-table-column
          v-if="showColItem.prop == 'index'"
          type="index"
          :index="count"
          :key="showColItem.prop"
          :width="showColItem.width"
        >
        </el-table-column>
        <el-table-column
          v-else-if="showColItem.type === 'status'"
          :show-overflow-tooltip="true"
          :key="showColItem.prop"
          :label="showColItem.label"
          :prop="showColItem.prop"
          :width="showColItem.width"
          :min-width="showColItem.minWidth"
          :formatter="showColItem.renderFun"
        >
          <template slot-scope="scope">
            <div v-for="item in showColItem.statuList" :key="item.status">
              <font v-if="scope.row[showColItem.prop] == item.status" :color="`#${item.color}`">{{
                item.text
              }}</font>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="showColItem.type === 'danger'"
          :show-overflow-tooltip="true"
          :key="showColItem.prop"
          :label="showColItem.label"
          :prop="showColItem.prop"
          :width="showColItem.width"
          :min-width="showColItem.minWidth"
          :formatter="showColItem.renderFun"
        >
          <template slot-scope="scope">
            <div v-for="item in showColItem.statuList" :key="item.status">
              <font v-if="scope.row[showColItem.prop] == item.status" :color="`#${item.color}`">{{
                item.text
              }}</font>

              <div v-else-if="scope.row[showColItem.prop] && scope.row[showColItem.prop] != true">
                {{ scope.row[showColItem.prop] }}
              </div>

              <font
                v-else-if="
                  !showColItem.statuList.find(_c => _c.status == scope.row[showColItem.prop])
                "
                :color="`#${item.color}`"
              >
                {{ scope.row[showColItem.prop] || item.text }}
              </font>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :show-overflow-tooltip="true"
          :key="showColItem.prop"
          :label="showColItem.label"
          :prop="showColItem.prop"
          :width="showColItem.width"
          :min-width="showColItem.minWidth"
          :formatter="showColItem.renderFun"
        >
        </el-table-column>
      </template>
      <!-- 展示操作按钮 -->
      <el-table-column
        v-if="btnRender && btnRender.length > 0"
        align="center"
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(btnItem, btnIndex) in btnRender"
            :key="btnIndex"
            @click.native.prevent="btnItem.btnEvent(scope.row)"
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
      <!-- 自定义暂无数据 -->
      <template slot="empty">
        <div>暂无数据</div>
      </template>
    </el-table>
    <!-- 展示分页 -->
    <div class="pagination" v-if="pagination">
      <div :class="{'controlOriginHeight':pageData.total <= pageData.pageSize}" class="totals">总数：{{ pageData.total || 0 }}</div>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        :current-page.sync="pageData.curPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    showColumns: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    btnRender: {
      type: Array,
      default: () => []
    },
    tableHeight: {
      type: [Number, String],
      default: 594
    },
    rowHeight: {
      type: [Number, String],
      default: 54
    },
    // 分页的数据
    pageData: {
      type: Object,
      default: function () {
        return null
      }
    },
    // 是否有分页
    pagination: {
      type: Boolean,
      default: true
    },
    // 加载条
    isLoading: {
      type: Boolean,
      default: false
    },
    newRowColor: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sonRowHeight: 54
    }
  },
  mounted () {
    this.sonRowHeight = this.rowHeight
  },

  watch: {
    rowHeight: {
      handler: function (val, oldval) {
        if (val != oldval) {
          this.$nextTick(() => {
            this.sonRowHeight = val
          })
        }
      },
      immediate: true, //关键
      deep: true
    }
    // isLoading:{
    //   handler: function (val, oldval) {
    //     if (val != oldval && (this.pageData.total > this.pageData.pageSize)) {
    //       this.$nextTick(() => {
    //         document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳转"
    //       })
    //     }
    //   },
    //   immediate: true, //关键
    //   deep: true
    // }
  },
  methods: {
    count (index) {
      return (this.pageData.curPage - 1) * this.pageData.pageSize + index + 1
    },
    // 每页多少条
    handleSizeChange (pageSize) {
      this.$emit('handleSizeChange', pageSize)
    },
    // 当前页码
    handleCurrentChange (pageIndex) {
      this.$emit('handleCurrentChange', pageIndex)
    },
    // 多选
    handleSelectionChange (selected) {
      this.$emit('handleSelectionChange', selected)
    },
    // 点击表格某行
    rowClick (row) {
      this.$emit('rowClick', row)
    },
    iHeaderRowStyle: function () {
      return `height: ${this.$pxToRem(54)}`
    },
    iCellStyle: function () {
      // let returnStyle = 'color:#8799BF;font-size:16px;height:' + this.sonRowHeight + 'px;'
      let returnStyle = {
        "color": "#8799BF",
        "font-size": this.$pxToRem(16),
        "padding": 0,
        "height": this.$pxToRem(this.sonRowHeight)
      }
      return returnStyle
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    },
  }
}
</script>
<style lang="less" scoped>
.controlOriginHeight{
  height: 32px;
  line-height: 32px;
}
.tem_tableOpen {
  display: flex;
  flex-direction: column;
  flex: 1;
  // 重古老全局样式复制过来
  /deep/.el-form--inline .el-form-item {
    min-width: 24%;
  }
}
.el-table {
  width: 100%;
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53,62,91,0.64) !important;
}
</style>
