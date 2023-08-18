<template>
  <div class="table-wrapper">
    <!-- 展示头部选项栏 -->
    <!-- 展示表格数据 -->
    <!--    :height="tableHeight == 54 ? pxToRem(94) : pxToRem(tableHeight)"-->
    <el-table
      ref="table"
      v-loading="isLoading"
      v-if="loadingdom"
      :element-loading-background="loadingColor"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :height="tableHeight === 54 ? 94 : tableHeight"
      :header-cell-style="$attrs['header-cell-style'] || tableHeaderStyle"
      :row-style="tableRowStyle"
      :cell-style="$attrs['row-style'] || iCellStyle"
      :header-row-style="$attrs['header-row-style'] || iHeaderRowStyle"
      :row-class-name="tableRowStyle"
      @selection-change="handleSelectionChange"
      border
    >
      <div v-for="(colItem, colIndex) in columns" :key="colIndex">
        <!-- 多选 -->
        <el-table-column
          v-if="colItem.type === 'selection'"
          type="selection"
          :width="colItem.width"
          :resizable="true"
        >
        </el-table-column>

        <!-- 图片 -->
        <el-table-column
          v-if="colItem.type === 'img'"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <ElImage
              :imgSet="{
                src: scope.row[colItem.prop],
                width: 65,
                height: 75,
                fit: 'cover',
                errorSrc: headerImage
              }"
            ></ElImage>
          </template>
        </el-table-column>

        <!-- 序号 -->
        <el-table-column
          v-if="colItem.type === 'index'"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :index="indexMethod"
          type="index"
          :resizable="true"
        >
        </el-table-column>

        <!-- 正常 -->
        <el-table-column
          v-if="colItem.type === 'nor' || !colItem.type"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :formatter="colItem.renderFun"
          :resizable="true"
        >
          <template slot-scope="scope">
            <!-- {{colItem.renderFun ? colItem.renderFun(scope.row) ? colItem.renderFun(scope.row) :'--' : scope.row[colItem.prop] || '--'}} -->
            <EllipsisPop
              :content="
                colItem.renderFun
                  ? colItem.renderFun(scope.row)
                    ? colItem.renderFun(scope.row)
                    : '--'
                  : scope.row[colItem.prop] || '--'
              "
            ></EllipsisPop>
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
          :resizable="true"
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
          :formatter="colItem.renderFun"
          :resizable="true"
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

        <!-- 开关，文字在同一边 -->
        <el-table-column
          v-if="colItem.type === 'aside-switch'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :formatter="colItem.renderFun"
        >
          <template slot-scope="scope">
            <span class='switch_tip' style="margin-right: 8px" v-if="scope.row[colItem.prop] === colItem.onValue">{{
              colItem.activeText || '启用'
            }}</span>
            <span class='switch_tip' style="margin-right: 8px" v-else>{{ colItem.inactiveText || '禁用' }}</span>
            <el-switch
              class="aside-switch"
              v-model="scope.row[colItem.prop]"
              :active-value="colItem.onValue"
              :inactive-value="colItem.offValue"
              @change="colItem.event(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <!-- 单选 -->
        <el-table-column
          v-if="colItem.type === 'radio'"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
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

        <!-- 编辑 -->
        <el-table-column
          v-if="colItem.type === 'editeFlag'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :formatter="colItem.renderFun"
          :resizable="true"
        >
          <template slot-scope="scope">
            <span
              :style="{ 'padding-right': $pxToRem(30), 'box-sizing': 'border-box' }"
              v-if="!scope.row.editeFlag"
            >
              {{ scope.row[colItem.prop] }}</span
            >
            <div v-if="scope.row.editeFlag" class="cell-edit-input">
              <el-input v-model="scope.row[colItem.prop]" placeholder="请输入内容">
                <template slot="suffix">
                  <div class="input-top">
                    <span
                      @click="colItem.handleSave(scope.$index, scope.row, 'cancel')"
                      :style="{ 'margin-right': $pxToRem(5) }"
                      class="normal_text"
                      >取消</span
                    >
                    <span @click="colItem.handleSave(scope.$index, scope.row)" class="normal_text"
                      >确定</span
                    >
                  </div>
                </template>
              </el-input>
            </div>
            <div
              v-if="!scope.row.editeFlag"
              class="cell-icon normal_text edit"
              @click="colItem.handleEdit(scope.$index, scope.row)"
            >
              <i class="el-icon-edit"></i>
            </div>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          v-if="colItem.type === 'state'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <font
              v-if="
                scope.row.warnLevel === 'THIRD_LEVEL' ||
                scope.row.type === 'THIRD_LEVEL' ||
                scope.row.warnLevel == '3' ||
                scope.row.level == '3'
              "
              color="#bd525c"
              >严重预警</font
            >
            <font
              v-else-if="
                scope.row.warnLevel === 'SECOND_LEVEL' ||
                scope.row.type === 'SECOND_LEVEL' ||
                scope.row.warnLevel == '2' ||
                scope.row.level == '2'
              "
              color="#D4B021"
              >一般预警</font
            >
            <font v-else color="#2190c1">轻微预警</font>
          </template>
        </el-table-column>

        <el-table-column
          v-if="colItem.type === 'isOpen'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <font v-if="scope.row.status == '1'" color="#3BC022">启用</font>
            <font v-else color="#bd525c">禁用</font>
          </template>
        </el-table-column>

        <!-- 密码重置申请的状态 -->
        <!-- <el-table-column
          v-if="colItem.type === 'approveReset'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <font v-if="scope.row.status === '已重置'" color="#3AB293">{{
              scope.row[colItem.prop]
            }}</font>
            <font v-else>{{ scope.row[colItem.prop] }}</font>
          </template>
        </el-table-column> -->

        <el-table-column
          v-if="colItem.type === 'status'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <div v-for="item in colItem.statuList" :key="item.status">
              <font v-if="scope.row[colItem.prop] == item.status" :color="`#${item.color}`">{{
                item.text
              }}</font>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="colItem.type === 'danger'"
          :show-overflow-tooltip="true"
          :prop="colItem.prop"
          :label="colItem.label"
          :width="colItem.width"
          :min-width="colItem.minWidth"
          :resizable="true"
        >
          <template slot-scope="scope">
            <div v-for="item in colItem.statuList" :key="item.status">
              <font v-if="scope.row[colItem.prop] == item.status" :color="`#${item.color}`">{{
                item.text
              }}</font>

              <div
                class="danger_item"
                v-else-if="scope.row[colItem.prop] && scope.row[colItem.prop] != true"
              >
                {{ scope.row[colItem.prop] }}
              </div>

              <font
                v-else-if="!colItem.statuList.find(_c => _c.status == scope.row[colItem.prop])"
                :color="`#${item.color}`"
              >
                {{ item.text }}
              </font>
            </div>
          </template>
        </el-table-column>
      </div>

      <!-- 展示操作按钮 -->
      <el-table-column
        v-if="btnRender && btnRender.length"
        label="操作"
        :min-width="pageData.btnRenderWidth || '6.81%'"
        :resizable="true"
        class-name="operate"
      >
        <template slot-scope="scope">
          <div class="opera_btn">
            <i
              v-for="(btnItem, btnIndex) in btnRender"
              :key="btnIndex"
              class="iconfont"
              :class="[btnItem.icon]"
              :title="btnItem.alt"
              @click.prevent="btnItem.btnEvent(scope.row)"
            ></i>
          </div>
          <!--          <el-button-->
          <!--            v-for="(btnItem, btnIndex) in btnRender"-->
          <!--            :key="btnIndex"-->
          <!--            @click.prevent="btnItem.btnEvent(scope.row)"-->
          <!--            type="text"-->
          <!--            size="small"-->
          <!--          >-->
          <!--            <img-->
          <!--              :src="-->
          <!--                require('@/assets/img/' +-->
          <!--                  (btnItem.type == 'use'-->
          <!--                    ? scope.row.status-->
          <!--                      ? btnItem.iconA-->
          <!--                      : btnItem.iconB-->
          <!--                    : btnItem.icon) +-->
          <!--                  '.png')-->
          <!--              "-->
          <!--              :alt="btnItem.alt"-->
          <!--              :title="btnItem.alt"-->
          <!--            />-->
          <!--          </el-button>-->
        </template>
      </el-table-column>

      <!-- 操作列只显示一个操作按钮 密码重置申请场景 -->
      <!-- <el-table-column
        v-if="isShowBtn"
        align="center"
        label="操作"
        :min-width="pageData.btnRenderWidth || '6.81%'"
        :resizable="true"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === '已重置'"
            @click.prevent="btnList[1].btnEvent(scope.row)"
            type="text"
            size="small"
          >
            <img src="@/assets/img/icon-detail-1.png" alt="详情" title="详情" />
          </el-button>
          <el-button
            v-else
            @click.prevent="btnList[0].btnEvent(scope.row)"
            type="text"
            size="small"
          >
            <img src="@/assets/img/icon-reset-1.png" alt="重置密码" title="重置密码" />
          </el-button>
        </template>
      </el-table-column> -->

      <!-- 自定义暂无数据 -->
      <div slot="empty">
        <div>{{ emptyObj.text }}</div>
      </div>
    </el-table>

    <!-- 展示分页 -->
    <div class="pagination" v-if="pageData && isShowPagination">
      <div :class="{ controlOriginHeight: pageData.total <= pageData.pageSize }" class="totals">
        总数：{{ pageData.total || 0 }}
      </div>
      <el-pagination
        background
        :layout="jumper ? 'prev, pager, next, jumper' : 'prev, pager, next'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
import ElImage from '@/components/BasicComponents/ElImage'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex';
export default {
  components: {
    ElImage,
    EllipsisPop
  },
  props: {
    tableData: {
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
      type: Number,
      default: 48
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
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: true
    },
    jumper: {
      type: Boolean,
      default: true
    },
    // 加载条
    isLoading: {
      type: Boolean,
      default: false
    },
    isShowBtn: {
      type: Boolean,
      default: false
    },
    btnList: {
      type: Array,
      default: () => []
    },
    emptyObj: {
      type: Object,
      default: function () {
        return {
          text: '暂无数据'
        }
      }
    },
    highLightRowIndex:{
      type: [Number,String]
    },
    loadingBg: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 主题颜色
    ...mapState('User', {
      theme: 'theme'
    }),
    loadingColor () {
      if (this.loadingBg) {
        return this.$themeColor(this.loadingBg) || this.loadingBg
      }
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      /* eslint-disable */
        this.loadingdom = false
        this.$nextTick(() => {
          this.loadingdom = true
        })
        /* eslint-enable */
      return colorObj['--loading-color']
    },
    headerImage () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    }
  },
  data () {
    return {
      sonRowHeight: 48,
      pageIndex: 1,
      loadingdom: true
    }
  },
  watch: {
    // isLoading:{
    //   handler: function (val, oldval) {
    //     if (!val && this.pageData && (this.pageData.total > this.pageData.pageSize)) {
    //       this.$nextTick(() => {
    //         if(!this.jumper){ return}
    //         document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳转"
    //       })
    //     }
    //   },
    //   immediate: true, //关键
    //   deep: true
    // },
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
    },
    'pageData.curPage': {
      handler: function (val) {
        this.pageIndex = val
      },
      immediate: true, //关键
      deep: true
    }
  },
  mounted () {
    this.sonRowHeight = this.rowHeight
  },
  methods: {
    // 回显多选框
    defaltSelection (row, selectState) {
      this.$nextTick(() => {
        this.$refs.table.toggleRowSelection(row, selectState)
      })
    },
    indexMethod (index) {
      let curpage = this.pageIndex //单前页码，具体看组件取值
      let limitpage = this.pageData.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage
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
    tableHeaderStyle () {
      let themeObj = this.theme === 'light' ? lightTheme : darkTheme
      return { "background-color": themeObj["--table-head-bg-color"], "color": themeObj["--base-text-color-to-999999"], "font-size": this.$pxToRem(16), "padding": 0 }
    },
    tableRowStyle ({ rowIndex }) {
      if(rowIndex === this.highLightRowIndex){
        return 'highlignt-row'
      }
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    },
    iHeaderRowStyle: function () {
      return `height: ${this.$pxToRem(54)}`
    },
    iCellStyle: function () {
      // let returnStyle =
      //   'color:#8799BF;font-size:16px;padding:0px;height:' + this.sonRowHeight + 'px;'
      let themeObj = this.theme === 'light' ? lightTheme : darkTheme
      let returnStyle = {
        "color": themeObj["--base-text-color-1"],
        "font-size": this.$pxToRem(16),
        "padding": 0,
        "height": this.$pxToRem(this.sonRowHeight)
      }
      return returnStyle
    }
  }
}
</script>

<style scoped lang="less">
// .table-wrapper {
//   display: flex;
//   flex-direction: column;
//   flex: 1;
// }
.totals {
  color: var(--base-text-color-to-999999);
  font-size: 16px;
}
.normal_btn {
  margin-right: 8px;
  color: var(--base-text-color-to-999999);
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #5288d8;
  }
}
.normal_text {
  color: var(--base-text-color-to-999999);
  line-height: 38px;
  cursor: pointer !important;
  &:hover {
    color: #5288d8;
  }
}
.edit {
  position: absolute;
  right: 10px;
  top: 11px;
}
.el-table {
  width: 100%;
}
.el-table .cell.el-tooltip {
  position: relative;
}
/deep/ .el-image-viewer__close {
  top: 230px;
  right: 20vw;
}
/deep/ .el-image .el-icon-circle-close {
  font-size: 50px !important;
  color: var(--base-text-color-1) !important;
  &:hover {
    color: #5288d8 !important;
  }
}

::v-deep .el-input--suffix .el-input__inner {
  padding-right: 74px;
}

.input-top {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999;
}

/deep/.el-radio {
  margin-right: 12px;
}
/deep/.el-radio__label {
  font-size: 12px;
  padding-left: 2px;
}
//.el-pagination {
//  padding: 0;
//}
.controlOriginHeight {
  height: 32px;
  line-height: 32px;
}

// 修改switch的宽高
///deep/.el-table {
//  .aside-switch {
//    .el-switch__core {
//      width: 32px !important;
//      height: 16px !important;
//      line-height: 16px !important;
//      &:after {
//        left: 18px;
//        height: 12px;
//        width: 12px;
//        // top: 2px;
//      }
//    }
//  }
//}
.operate {
  img {
    width: 16px;
    height: 16px;
  }
}
.danger_item {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53, 62, 91, 0.64) !important;
}
.opera_btn {
  i {
    font-size: 16px;
    color: var(--base-text-color-to-666666);
    margin-right: 8px;
    cursor: pointer;
  }
}
.switch_tip {
  color: var(--base-text-color-1);
}
</style>
