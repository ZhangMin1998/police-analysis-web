<template>
  <div class="w_table" :style="{ height: wrapHeight, maxHeight: wrapMaxHeight, width: wrapWidth }">
    <div class="w_table_grid_header" v-if="haveHeader">
      <div class="header_left">
        <el-input
          v-if="haveSearchInput"
          v-model.trim="key"
          @keyup.enter.native="searchClick"
          :placeholder="inputPlaceholder"
          @clear="clearInput"
          clearable
        >
          <template slot="suffix">
            <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
          </template>
        </el-input>
        <slot name="dateLeft"></slot>
        <DatePick
          v-if="isSearchTime"
          :isShowTimeType="false"
          ref="DatePick"
          @getTimeSelect="getTimeSelect"
          @clearTime="clearTime"
        ></DatePick>
        <slot name="headerLeft"></slot>
      </div>
      <div class="header_right">
        <slot name="rightBtn"></slot>
        <el-button type="primary" v-if="rightBtnList.includes('search')" v-debounce="searchClick"
          >搜索</el-button
        >
        <!--      <div class="btn primary" v-if='rightBtnList.includes("search")' @click='searchClick'>搜索</div>-->
        <div
          class="division"
          v-if="rightBtnList.includes('search') && rightBtnList.includes('export')"
        ></div>
        <div class="blank_button" v-if="rightBtnList.includes('export')" @click="exportData">
          导出
        </div>
      </div>
    </div>
    <slot name="startTable"></slot>
    <div
      v-p-loading="loading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="loadingColor"
      class="table_loading"
    >
      <div class="w_table_wrap">
        <el-table
          ref="table"
          v-bind="$attrs"
          size="medium"
          header-row-class-name="w_table_header"
          :data="tableData"
          :fit="true"
          :border="border"
          :stripe="stripe"
          :row-key="rowKey"
          :span-method="spanMethod"
          :highlight-current-row="singleSelect"
          :empty-text="realEmptyText"
          :style="{ width: '100%' }"
          :row-class-name="stripe ? tableRowStyle : ''"
          :height="tableHeight"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="handleCellMouseEnter"
          @cell-mouse-leave="handleCellMouseLeave"
          @cell-click="handleCellClick"
          @cell-dblclick="handleCellDbclick"
          @row-click="handleRowClick"
          @row-contextmenu="handleRowContextmenu"
          @row-dblclick="handleRowDbclick"
          @header-click="handleHeaderClick"
          @header-contextmenu="handleHeaderContextmenu"
          @sort-change="handleSortChange"
          @current-change="handleCurrentRowChange"
        >
          <div v-if="!loading" slot="empty" class="none_data">
            <!--        后面需要设计一个暂无数据的公共组件放这里-->
            暂无数据
          </div>
          <el-table-column
            v-if="multiple"
            type="selection"
            :width="66"
            :selectable="selectable"
            :reserve-selection="reserveSelection"
            :resizable="true"
          ></el-table-column>
          <el-table-column
            v-if="haveIndex"
            type="index"
            width="120"
            :label="'序号'"
            :index="indexFun"
            :resizable="true"
          ></el-table-column>
          <template v-if="tableColumns">
            <el-table-column
              v-for="(item, index) in tableColumns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :min-width="item.minWidth"
              :show-overflow-tooltip="true"
              :resizable="true"
            >
              <template slot-scope="{ row }">
                <div class="item" v-if="!item.haveSlot">
                  {{ item.renderFun ? item.renderFun(row) : row[item.prop] || '--' }}
                </div>
                <slot :name="item.prop" :row="row"></slot>
              </template>
            </el-table-column>
          </template>
          <slot></slot>
          <!-- 展示操作按钮 -->
          <el-table-column
            v-if="(btnRender && btnRender.length) || slotOpera"
            label="操作"
            :min-width="btnRenderWidth"
            :resizable="false"
            class-name="opt"
          >
            <template slot-scope="scope">
              <slot name='opera_btn' :row='scope.row' :index='scope.$index'>
                <div class='opera_btn'>
                  <i
                    v-for="(btnItem, btnIndex) in btnRender"
                    :key="btnIndex"
                    class="iconfont"
                    :class="[btnItem.icon]"
                    :title="btnItem.alt"
                    @click.prevent="btnItem.btnEvent(scope.row)"
                  ></i>
                </div>
              </slot>
              <!--              <el-button-->
              <!--                v-for="(btnItem, btnIndex) in btnRender"-->
              <!--                :key="btnIndex"-->
              <!--                @click.prevent="btnItem.btnEvent(scope.row)"-->
              <!--                type="text"-->
              <!--                size="small"-->
              <!--              >-->
              <!--                <img-->
              <!--                  :src="-->
              <!--                    require('@/assets/img/' +-->
              <!--                      (btnItem.type == 'use'-->
              <!--                        ? scope.row.status-->
              <!--                          ? btnItem.iconA-->
              <!--                          : btnItem.iconB-->
              <!--                        : btnItem.icon) +-->
              <!--                      '.png')-->
              <!--                  "-->
              <!--                  :alt="btnItem.alt"-->
              <!--                  :title="btnItem.alt"-->
              <!--                />-->
              <!--              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w_table_floor" v-if="haveFloor">
        <div class="w_table_page_info">
          <span>总数： {{ total }}</span>

          <div v-if="pagination" class="w_table_page_size">
            <span>每页</span>
            <el-select
              v-model="pageSize"
              size="mini"
              :style="{ width: $pxToRem(62), display: 'inline-block' }"
              :clearable="false"
            >
              <el-option
                v-for="item in pageSizes"
                :key="item"
                :lable="item"
                :value="item"
              ></el-option>
            </el-select>
            <span>条</span>
          </div>
        </div>

        <div class="w_table_select_num" v-if="reserveSelection && (singleSelect || multiple)">
          <span> 已选数 </span>
          <span>{{ selectNum }}</span>
        </div>

        <el-pagination
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          background
          layout="prev, pager, next, jumper"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
    <CusExport
      :method="exportMethod"
      :fileName="exportFileName"
      :url="exportUrl"
      :exportShow.sync="exportShow"
      :allCols="exportColumns"
      :totalData="total"
      :params="{ ...exportParams }"
    ></CusExport>
  </div>
</template>

<script>
import request from '@/config/request'
import DatePick from '@/views/common/data-center/components/DatePick'
import CusExport from '@/components/VisualComponents/CusExport'
const HTML_FONT_SIZE = document.documentElement.style.fontSize
export default {
  name: 'WTableGrid',
  components: {
    DatePick,
    CusExport
  },
  props: {
    loadingColor: {
      type: String,
    },
    btnRenderWidth: {
      type: String,
      default: '6.81%'
    },
    // 是否有头部
    haveHeader: {
      type: Boolean,
      default: true
    },
    // 导出接口请求方式
    exportMethod: {
      type: String,
      default: 'post'
    },
    // 导出文件名
    exportFileName: {
      type: String,
      default: '导出文件'
    },
    // 导出接口
    exportUrl: {
      type: String,
      default: ''
    },
    // 导出列选项
    exportColumns: Array,
    url: {
      type: String,
      default: ''
    },
    // 搜索输入框提示文字
    inputPlaceholder: {
      type: String,
      default: '请输入'
    },
    // 循环展示列
    tableColumns: Array,
    // 列表展示数据
    data: Array,
    // 加载的时候显示的提示文字
    loadingText: {
      type: String,
      default: '数据正在加载中'
    },
    // 操作按钮
    btnRender: {
      type: Array,
      default: () => []
    },
    // 组件的高度
    height: {
      type: [Number, String],
      default: '100%'
    },
    // 组件的最大高度
    maxHeight: [Number, String],
    // 组件的宽度
    width: [Number, String],
    // 是否带有纵向边框
    border: {
      type: Boolean,
      default: true
    },
    // 合并行或列的计算方法
    spanMethod: Function,
    // 是否为斑马纹 table
    stripe: {
      type: Boolean,
      default: true
    },
    // 行数据的Key
    rowKey: [Function, String],
    // 是否支持单选
    singleSelect: {
      type: Boolean,
      default: false
    },
    // 没有数据时显示提示内容，也可以通过 slot="empty" 进行设置
    emptyText: String,
    // 为true则会在数据更新之后保留之前选中的数据（需指定row-key）
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    selectable: Function,
    // 是否有序列
    haveIndex: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    pagination: {
      type: Boolean,
      default: false
    },
    // 选择每页展示数据量的选项集合,仅当pagination为true有效。
    pageSizes: {
      type: Array,
      default () {
        return [10, 12, 15]
      }
    },
    // 查询条件默认值
    defaultQuery: {
      type: Object,
      default () {
        return {}
      }
    },
    // 接口请求方式
    reqMethod: {
      type: String,
      default: 'get'
    },
    // 每一页显示的条数
    myPageSize: {
      type: Number,
      default: 15
    },
    // 头部右侧按钮
    rightBtnList: {
      type: Array,
      default: () => ['search', 'export']
    },
    // 是否有时间筛选
    isSearchTime: {
      type: Boolean,
      default: true
    },
    // 是否有搜索输入框
    haveSearchInput: {
      type: Boolean,
      default: true
    },
    // 搜索输入框绑定的值
    searchModelKey: {
      type: String,
      default: 'key'
    },
    // 传入data时，需要传入总数值
    dataTotal: {
      type: Number,
      default: 0
    },
    searchQuery: {
      type: Object,
      default: () => { }
    },
    haveFloor: {
      type: Boolean,
      default: true
    },
    pageMyself: {
      type: Boolean,
      default: false
    },
    startPage: {
      type: Number,
      default: 0
    },
    tableHeight: {
      type: [String, Number],
      default: '100%'
    },
    slotOpera: {
      type: Boolean,
      default: false
    },
    noData: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 计算组件高度
    wrapHeight () {
      if (this.height && this.height.includes('%')) {
        return this.height
      }
      return this.$pxToRem(this.height)
    },
    // 计算组件最大高度
    wrapMaxHeight () {
      if (this.maxHeight && this.maxHeight.includes('%')) {
        return this.maxHeight
      }
      return this.$pxToRem(this.maxHeight)
    },
    // 计算组件宽度
    wrapWidth () {
      if (this.width && this.width.includes('%')) {
        return this.width
      }
      return this.$pxToRem(this.width)
    },
    // 计算多选列的宽度
    selectionWrapWidth () {
      return this.$pxToRem(48) * parseInt(HTML_FONT_SIZE) + 'px'
    },
    // 选择时已选数
    selectNum () {
      if (this.reserveSelection) {
        if (this.multiple) {
          return this.selection.length
        } else if (this.singleSelect) {
          return this.currentRow ? 1 : 0
        } else {
          return 0
        }
      } else {
        return 0
      }
    }
  },
  data () {
    return {
      loading: false, // 正在加载
      tableData: [], // 表格数据
      realEmptyText: this.emptyText, // 没有数据时显示提示文字
      selection: [], // 多选时的选中项
      currentRow: null, // 单选时的当前项目
      oldCurrentRow: null, // 单选时老的当前项目
      currentPage: 1, // 当前页数
      pageSize: this.pagination ? this.pageSizes[0] : this.myPageSize, // 每页展示数量
      total: 0, // 总数据量
      columns: [], // 表格的列集合
      formData: {
        ...this.defaultQuery
      }, // 查询条件绑定的数据
      key: '',
      endTime: '',
      startTime: '',
      exportShow: false, //导出状态
      exportParams: {},
      pageMyselfData: []
    }
  },
  created () {
    if (this.startPage) {
      this.currentPage = this.startPage
    }
    if (this.data) {
      this.total = this.dataTotal
      if (this.pageMyself) {
        this.pageMyselfData = this.data
        this.tableData = this.pageMyselfData.slice(0, this.pageSize)
      } else {
        this.tableData = this.data
      }
    }
    // 初始值回显到组件上（这里仅做了回显input的搜索值）
    if (this.defaultQuery[this.searchModelKey]) {
      this.key = this.defaultQuery[this.searchModelKey]
    }
  },
  mounted () {
    // 初始化创建表格的列集合和表格显示的列集合
    this.$refs.table.$children.forEach(item => {
      if (item.prop) {
        this.columns.push(item)
      }
    })
    if (this.url) {
      if (this.$route.query.pathName) {
        this.startTime = this.$route.query.startTime || ''
        this.endTime = this.$route.query.endTime || ''
        this.refresh(null, true)
      } else {
        this.refresh()
      }
    }

  },
  methods: {
    clearInput () {
      if (this.defaultQuery) {
        this.defaultQuery[this.searchModelKey] = ''
      }
    },
    exportData () {
      this.exportShow = true
    },
    // 为startTime和endTime赋值
    getTimeSelect (time) {
      this.startTime = time.startTime
      this.endTime = time.endTime
    },
    // 清空startTime和endTime
    clearTime () {
      this.startTime = ''
      this.endTime = ''
    },
    // 页码发生变化时
    currentChange (pageSize, isSearch = false) {
      if (this.data) {
        this.dataParams(isSearch)
      } else {
        this.$nextTick(() => {
          if (this.pageMyself) {
            this.refresh(null, isSearch, false)
          } else {
            this.refresh(null, isSearch)
          }
        })
      }
      this.$emit('current-page-change', pageSize)
    },
    // 去除搜索条件为空的字段
    deleteNoValue (obj) {
      for (let key in obj) {
        if (!obj[key]) {
          delete obj[key]
        }
      }
      return obj
    },
    // 点击搜索
    searchClick () {
      if (+this.currentPage === 1) {
        if (this.data) {
          this.dataParams(true)
        } else {
          this.refresh(null, true)
        }
      } else {
        this.currentPage = 1
        this.currentChange(this.currentPage, true)
      }
    },
    // 传入data时，更新数据的方法
    dataParams (isSearch = false) {
      if (isSearch || !this.pageMyself) {
        for (let prop in this.defaultQuery) {
          // 此处以formData中的参数优先
          if (!this.formData[prop]) {
            this.formData[prop] = this.defaultQuery[prop]
          }
        }
        this.loading = true
        if (this.haveHeader && this.haveSearchInput && isSearch) {
          this.formData[this.searchModelKey] = this.key
        }
        if (this.haveHeader && this.isSearchTime && isSearch) {
          this.formData.startTime = this.startTime
          this.formData.endTime = this.endTime
        }
        let req = this.deleteNoValue({
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          ...this.formData
        })
        this.$nextTick(() => {
          this.realEmptyText = ' '
          this.tableData = []
          let submitBeforeCallback
          this.$emit(
            'getSpecialParams',
            JSON.parse(JSON.stringify(req)),
            val => {
              submitBeforeCallback = val
            }
          )
          if (submitBeforeCallback === undefined) {
            this.exportParams = req
            this.$emit('getNewData', req)
          } else {
            if (submitBeforeCallback !== false) {
              submitBeforeCallback = this.deleteNoValue(submitBeforeCallback)
              this.exportParams = submitBeforeCallback
              this.$emit('getNewData', submitBeforeCallback)
            }
          }
        })
      } else {
        this.loading = true
        this.realEmptyText = ' '
        this.tableData = []
        let tableData = []
        let start = (this.currentPage - 1) * this.pageSize
        let end = this.currentPage * this.pageSize
        this.pageMyselfData.forEach((item, index) => {
          if (index >= start && index < end) {
            tableData.push(item)
          }
        })
        this.tableData = tableData
        this.loading = false
      }
    },
    updateLoading (bool) {
      this.loading = bool
    },
    // 刷新
    refresh (refreshSuccess, isSearch = false, callUrl = true) {
      if (this.noData) {
        this.tableData = []
        this.total = 0
        return
      }
      if (callUrl || isSearch) {
        for (let prop in this.defaultQuery) {
          // 此处以formData中的参数优先
          if (!this.formData[prop]) {
            this.formData[prop] = this.defaultQuery[prop]
          }
        }
        this.loading = true
        if (this.haveHeader && this.haveSearchInput && isSearch) {
          this.formData[this.searchModelKey] = this.key
        }
        if (this.haveHeader && this.isSearchTime && isSearch) {
          this.formData.startTime = this.startTime
          this.formData.endTime = this.endTime
        }
        let req = {
          url: this.url,
          method: this.reqMethod,
        }
        if (this.reqMethod === 'get') {
          if (this.haveFloor && !this.pageMyself) {
            req.params = {
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              ...this.formData
            }
          } else {
            req.params = {
              ...this.formData
            }
          }
          req.params = this.deleteNoValue(req.params)
          this.exportParams = req.params
        } else if (this.reqMethod === 'post') {
          if (this.haveFloor && !this.pageMyself) {
            req.data = {
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              ...this.formData
            }
          } else {
            req.data = {
              ...this.formData
            }
          }
          req.data = this.deleteNoValue(req.data)
          this.exportParams = req.data
        }
        this.$nextTick(() => {
          this.realEmptyText = ' '
          this.tableData = []
          if (this.pageMyself) {
            this.pageMyselfData = []
          }
          let submitBeforeCallback
          this.$emit(
            'getSpecialParams',
            JSON.parse(JSON.stringify(req)),
            val => {
              submitBeforeCallback = val
            }
          )
          if (submitBeforeCallback === undefined) {
            request(req).then(result => {
              this.refreshSuccess(result)
              refreshSuccess && refreshSuccess(result)
            }).catch(() => {
              this.loading = false
            })
          } else {
            if (submitBeforeCallback !== false) {
              if (this.reqMethod === 'get') {
                submitBeforeCallback.params = this.deleteNoValue(submitBeforeCallback.params)
                this.exportParams = submitBeforeCallback.params
              } else if (this.reqMethod === 'post') {
                submitBeforeCallback.data = this.deleteNoValue(submitBeforeCallback.data)
                this.exportParams = submitBeforeCallback.data
              }
              request(submitBeforeCallback).then(result => {
                this.refreshSuccess(result)
                refreshSuccess && refreshSuccess(result)
              }).catch(() => {
                this.loading = false
              })
            }
          }
        })
      } else {
        this.loading = true
        this.realEmptyText = ' '
        this.tableData = []
        let tableData = []
        let start = (this.currentPage - 1) * this.pageSize
        let end = this.currentPage * this.pageSize
        this.pageMyselfData.forEach((item, index) => {
          if (index >= start && index < end) {
            tableData.push(item)
          }
        })
        this.tableData = tableData
        this.loading = false
      }

    },
    // 请求刷新接口成功
    refreshSuccess (result) {
      if (!result.code) {
        let callback
        let searchParams = {
          key: this.key,
          startTime: this.startTime,
          endTime: this.endTime,
          currentPage: this.currentPage
        }
        this.$emit(
          'getDataSuccess',
          JSON.parse(JSON.stringify(result.content || result)),
          searchParams,
          val => {
            callback = val
          }
        )
        if (callback === undefined) {
          if (this.pageMyself) {
            this.pageMyselfData = result.content || result
            this.tableData = this.pageMyselfData.slice(0, this.pageSize)
          } else {
            this.tableData = result.content || result
          }
        } else {
          if (callback === false) {
            this.total = 0
            this.tableData = []
            this.loading = false
            this.realEmptyText = this.emptyText
            return
          } else {
            if (this.pageMyself) {
              this.pageMyselfData = callback
              this.tableData = this.pageMyselfData.slice(0, this.pageSize)
            } else {
              this.tableData = callback
            }
          }
        }
        if (this.pageMyself) {
          this.total = this.pageMyselfData.length
        } else {
          this.total = result.totalSize || 0
        }
      } else {
        this.$emit('load-error', result)
      }
      this.loading = false
      this.realEmptyText = this.emptyText
      this.$nextTick(() => {
        this.doLayout()
      })
    },
    // 对 table 进行重新布局
    doLayout () {
      this.$refs.table && this.$refs.table.doLayout()
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handleSelect (selection, row) {
      this.$emit('select', selection, row)
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectAll (selection) {
      this.$emit('select-all', selection)
    },
    // 当单元格 hover 进入时会触发该事件
    handleCellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当单元格 hover 退出时会触发该事件
    handleCellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    // 当某个单元格被点击时会触发该事件
    handleCellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    // 当某个单元格被双击击时会触发该事件
    handleCellDbclick (row, column, cell, event) {
      this.$emit('cell-dbclick', row, column, cell, event)
    },
    // 当某一行被点击时会触发该事件
    handleRowClick (row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    // 当某一行被鼠标右键点击时会触发该事件
    handleRowContextmenu (row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    // 当某一行被双击时会触发该事件
    handleRowDbclick (row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    // 当某一列的表头被点击时会触发该事件
    handleHeaderClick (column, event) {
      this.$emit('header-click', column, event)
    },
    // 当某一列的表头被鼠标右键点击时触发该事件
    handleHeaderContextmenu (column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    // 当表格的排序条件发生变化的时候会触发该事件
    handleSortChange (sort) {
      this.$emit('sort-change', sort)
    },
    // 用户点击上一页按钮改变当前页后触发
    handlePrevClick (val) {
      this.$emit('prev-click', val)
    },
    // 用户点击下一页按钮改变当前页后触发
    handleNextClick (val) {
      this.$emit('next-click', val)
    },
    // 多选选择项发生变化时
    handleSelectionChange (selection) {
      this.selection = selection
      this.$emit('selection-change', selection)
    },
    // 单选项发生变化时
    handleCurrentRowChange (currentRow, oldCurrentRow) {
      if (this.reserveSelection) {
        // 需要保存刷新前选中的数据
        if (this.rowKey) {
          if (this.currentRow) {
            if (
              currentRow &&
              !(this.currentRow[this.rowKey] === currentRow[this.rowKey])
            ) {
              this.currentRow = currentRow
              this.oldCurrentRow = oldCurrentRow
              this.$emit('current-change', currentRow, oldCurrentRow)
            }
          } else {
            if (currentRow) {
              this.currentRow = currentRow
              this.oldCurrentRow = oldCurrentRow
              this.$emit('current-change', currentRow, oldCurrentRow)
            }
          }
        } else {
          console.error('reserveSelection为true,必须指定rowKey.')
        }
      } else {
        // 不需要保存刷新前选中的数据
        this.currentRow = currentRow
        this.oldCurrentRow = oldCurrentRow
        this.$emit('current-change', currentRow, oldCurrentRow)
      }
    },
    // 行号计算
    indexFun (index) {
      ++index
      if (typeof this.currentPage === 'number' && typeof this.pageSize === 'number') {
        return index + (this.currentPage - 1) * this.pageSize
      }
      return index
    },
    // 单选时用来回写选中状态
    singleSelectRewrite () {
      this.setCurrentRow()
      let row
      if (this.currentRow) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i][this.rowKey] === this.currentRow[this.rowKey]) {
            row = this.tableData[i]
            break
          }
        }
      }
      if (row) {
        this.setCurrentRow(row)
      }
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow (row) {
      this.$refs.table.setCurrentRow(row)
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    },
  },
  watch: {
    data: {
      // 传入的静态数据发生变化时
      deep: true,
      handler (data) {
        this.total = this.dataTotal
        if (this.pageMyself) {
          this.pageMyselfData = data
          this.tableData = this.pageMyselfData.slice(0, this.pageSize)
        } else {
          this.tableData = data
        }
      }
    },
    // 分页条每页页数变化
    pageSize () {
      if (this.data) {
        this.dataParams()
      } else {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    },
    // 表格数据发生变化时
    tableData () {
      if (this.reserveSelection) {
        if (this.rowKey) {
          this.$nextTick(() => {
            if (this.singleSelect) {
              this.singleSelectRewrite()
            }
          })
        } else {
          console.error('reserveSelection为true时，必须指定rowKey')
        }
      }
    },
    // currentPage: {
    //   handler (newVal) {
    //     if (this.data) {
    //       this.dataParams()
    //     } else {
    //       this.$nextTick(() => {
    //         this.refresh()
    //       })
    //     }
    //     this.$emit('current-page-change', newVal)
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.table_loading {
  height: calc(100% - 80px);
}
.w_table_wrap {
  height: calc(100% - 64px);
  /deep/.el-table {
    height: 100%;
    .el-button {
      padding: 0;
    }
    th {
      background: var(--table-head-bg-color) !important;
      font-weight: 400;
    }
    td {
      border-bottom: 1px solid var(--table-row-border-bottom-color) !important;
    }
    thead {
      color: var(--base-text-color-to-999999);
    }
    .el-table__body-wrapper {
      height: calc(100% - 48px);
      overflow-y: auto;
      .el-table__row {
        .el-table__cell:first-child {
          .cell {
            padding-left: 24px;
          }
        }
      }
    }
  }
}
.w_table_floor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  .w_table_page_info {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    display: flex;
    align-items: center;
    .w_table_page_size {
      margin-left: 8px;
    }
  }
}
.w_table_grid_header {
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--table-pageHeader-bg-color);
  margin-bottom: 16px;
  .header_left {
    display: flex;
    align-items: center;
    flex: 1;
    /deep/.el-input--suffix {
      .el-input__inner {
        padding-left: 12px;
        padding-right: 32px;
        border-radius: 2px;
        border-color: var(--border-color-input);
        border-width: 1px !important;
        &::placeholder {
          color: var(--input-placehold-color);
          font-size: 16px;
        }
        &:hover {
          border-color: var(--border-color-input-hover);
        }
        &:focus {
          border-color: var(--active-color);
        }
      }
      .el-input__suffix {
        right: 12px;
        .icon-sousuo {
          font-size: 16px;
          color: var(--input-placehold-color);
          line-height: 40px;
          cursor: pointer;
        }
        .el-icon-circle-close {
          width: 16px;
          font-size: 16px !important;
          position: absolute;
          right: 18px;
          top: 1px;
          color: var(--input-placehold-color) !important;
        }
        .el-icon-circle-close:hover {
          color: var(--active-color) !important;
        }
      }
    }
    /deep/.el-input {
      width: 416px;
      margin-right: 16px;
    }
  }
  .header_right {
    display: flex;
    align-items: center;
    flex: none;
    .division {
      width: 1px;
      height: 24px;
      background: var(--division);
      margin: 0 16px;
    }
    .btn {
      padding: 5px 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      line-height: 20px;
      font-size: 14px;
      color: var(--base-text-color-1);
      cursor: pointer;
    }
    .primary {
      background: #177ddc;
      color: @font-color-3;
      border-color: transparent;
    }
  }
}
/deep/.el-icon-circle-close {
  margin-top: 0 !important;
}
/deep/.el-range__icon {
  width: 0;
}
/deep/.formItem .el-date-editor--datetimerange.el-input__inner {
  padding-left: 12px !important;
}
/deep/.el-range-input {
  text-align: left;
}
.item {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.opt {
  img {
    width: 16px;
    height: 16px;
  }
}
.blank_button {
  white-space: nowrap;
}
.opera_btn {
  i {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    margin-right: 8px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
