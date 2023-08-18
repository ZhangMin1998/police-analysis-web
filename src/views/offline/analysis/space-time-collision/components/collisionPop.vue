<template>
  <div class="t-table">
    <div class="content-main">
      <div class="searchForm" style="padding: 0 0 16px 0">
        <div class="formItem">
          <el-select
            v-model="table.params.attr_type"
            placeholder="请选择"
            style="width: 100%"
            @change="search"
          >
            <el-option
              v-for="(item, idx) in [
                { code: '', CName: '全部' },
                ...typeList
              ]"
              :key="idx"
              :value="item.code"
              :label="item.CName"
            ></el-option>
          </el-select>
        </div>

        <div class="page">
          <div v-show="isShowPage">
            <button
              type="button"
              class="pageBtn prev"
              @click.prevent.stop="moveLeft"
              :disabled="prevDis"
            >
              <i class="el-icon el-icon-arrow-left"></i>
            </button>
          </div>
          <div class="content" id="content">
            <!-- disabled="disabled" -->

            <el-checkbox-group
              id="checkBox"
              :style="`transform: translateX(${moveX}px);`"
              class="checkList"
              v-model="table.params.case_id_bunch"
              @change="handleCheckedPersonChange"
              :min="2"
            >
              <el-checkbox
                v-for="(item, index) in caselist"
                :key="index"
                :label="item.id"
                name="type"
                >【{{ index + 1 }}】{{ item.caseName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>

          <div v-show="isShowPage">
            <button
              type="button"
              :disabled="nextDis"
              class="pageBtn next"
              @click.prevent.stop="moveRight"
            >
              <i class="el-icon el-icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="table-content-wrap">
        <template-table
          :tableData="table.tableData"
          :columns="table.columns"
          :tableHeight="
            table.tableData && table.tableData.length ? 50 * table.tableData.length + 45 : 100
          "
          :rowHeight="48"
          :btnRender="table.btnRender"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </div>
      <pop :pop.sync="pop" @beforeClose="hideCheckDetail" @beforeOpen="showCheckDetail">
        <!-- 碰撞详情 -->
        <result-detail :datas.sync="detailData"></result-detail>
      </pop>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TemplateTable from '@/components/VisualComponents/Table'
import { querySpaceCrash, attrDetail } from '@/api/analysis'
import ResultDetail from './components/ResultDetail'
import Pop from '@/components/VisualComponents/PopDialog'
import dayjs from '@/utils/filters'
export default {
  components: {
    TemplateTable,
    ResultDetail,
    Pop
  },
  computed: {
    ...mapState('analysisJudgement', {
      screenWidth: 'screenWidth'
    })
  },
  props: {
    caselist: {
      type: Array,
      default: () => []
    },
    resultData: {
      type: Object,
      default: () => {}
    },
    typeList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      table: {
        tableData: [],
        columns: [
          // {
          //   label: '满足案发点',
          //   prop: 'caseNumList',
          //   width: 'auto',
          //   type: 'nor',
          //   renderFun: function(row) {
          //     if (!row.caseNumList) return '--'
          //     return row.caseNumList.join(' ')
          //   },
          // },
          {
            label: '数据属性',
            prop: 'attr_typeStr',
            minWidth: '40%',
            type: 'nor'
          },
          { label: '类型', prop: 'attr_value', minWidth: '40%', type: 'nor' }
          // {
          //   label: '初次出现时间',
          //   prop: 'createTime',
          //   width: 'auto',
          //   type: 'nor',
          //   renderFun: function(row) {
          //     if (!row.createTime) return '--'
          //     row.createTime = parseInt(row.createTime)
          //     return dayjs.filterString(row.createTime)
          //   },
          // },
          // {
          //   label: '离开时间',
          //   prop: 'updateTime',
          //   width: 'auto',
          //   type: 'nor',
          //   renderFun: function(row) {
          //     if (!row.updateTime) return '--'
          //     row.updateTime = parseInt(row.updateTime)
          //     return dayjs.filterString(row.updateTime)
          //   },
          // },
        ],
        btnRender: [
          {
            label: '详情',
            icon: 'icon-xiangqing',
            btnEvent: this.checkDetail,
            alt: '查看详情'
          }
        ],
        pageData: {
          curPage: 1,
          pageSize: 5,
          total: 0
        },
        // 加载条
        isLoading: false,
        params: {
          page_num: 1,
          page_size: 5,
          case_id_bunch: [],
          attr_type: ''
        }
      },
      isShowPage: false,
      moveX: 0,
      nextDis: false,
      prevDis: true,
      defaultCaseIdList: [],

      pop: { show: false, title: '分析详情', width: '700px', top: '180px' },

      detailData: {}
    }
  },
  created () {
    this.defaultCaseIdList = this.caselist.map(item => {
      return item.id
    })
    this.table.params.case_id_bunch = [...this.defaultCaseIdList]

    if (this.resultData && this.resultData.data_page) {
      this.table.isLoading = true
      this.table.tableData = this.resultData.data_page.map(_c => {
        const item = this.typeList.find(
          ele => ele.EName === _c.attr_type
        )
        _c.attr_typeStr = item?.CName
        return _c
      })
      this.table.pageData.total = this.resultData.total_size
      this.table.isLoading = false
    }
    // this.loadTable()
    this.showPage(this.screenWidth)
  },
  watch: {
    screenWidth (newValue) {
      if (!newValue) return false

      this.showPage(newValue)
      this.isPrevDis()
      this.isNextDis()
    }
  },

  methods: {
    /** 查看详情 */
    checkDetail (e) {
      attrDetail({
        attr_value: e.attr_value,
        case_id_bunch: this.table.params.case_id_bunch.join(','),
        attr_type: e.attr_type
      })
        .then(res => {
          res.tracks = res.map(i => {
            // 这里的时间戳是以秒计时的
            i.startTime = dayjs.filterSS(i.start_time)
            i.endTime = dayjs.filterSS(i.end_time)
            return i
          })

          this.detailData = {
            ...res,
            attr: e.attr_typeStr + '：' + e.attr_value
          }
          this.showCheckDetail()
        })
        .catch(err => {
          this.$messageTip.error(err)
        })
    },

    showCheckDetail () {
      this.pop.show = true
    },

    hideCheckDetail () {
      this.pop.show = false
    },

    showPage (screenWidth) {
      this.$nextTick(() => {
        if (document.getElementById('checkBox').offsetWidth < screenWidth * 0.7) {
          this.isShowPage = false
        } else {
          this.isShowPage = true
        }
      })
    },
    moveLeft () {
      this.$nextTick(() => {
        this.moveX += 100
        this.isPrevDis()
      })
    },
    moveRight () {
      this.moveX -= 100
      this.prevDis = false
      this.isNextDis()
    },
    isPrevDis () {
      this.$nextTick(() => {
        this.nextDis = false
        if (this.moveX >= 0) {
          this.prevDis = true
        } else {
          this.prevDis = false
        }
      })
    },
    isNextDis () {
      this.$nextTick(() => {
        let showBoxWidth = document.getElementById('checkBox').offsetWidth
        let contentWidth = document.getElementById('content').offsetWidth
        let right = contentWidth - showBoxWidth
        if (this.moveX <= right) {
          this.nextDis = true
        } else {
          this.nextDis = false
        }
      })
    },
    // 加载表格数据
    async loadTable () {
      this.table.isLoading = true
      await querySpaceCrash({
        ...this.table.params,
        case_id_bunch: this.table.params.case_id_bunch.join(',')
      })
        .then(res => {
          // res 不为对象 && 正在等待状态
          if (typeof res != 'object') {
            window.setTimeout(() => {
              this.loadTable()
            }, 10000)
            return
          }

          this.table.isLoading = false
          this.table.tableData = res.data_page.map(_c => {
            const item = this.typeList.find(
              ele => ele.EName === _c.attr_type
            )

            _c.attr_typeStr = item?.CName
            return _c
          })

          this.table.pageData.total = res.total_size
          // res.content.forEach(element => {
          //   element.caseNumList = []
          //   element.caseId.forEach(i => {
          //     let idx = this.defaultCaseIdList.findIndex(item => item == i)
          //     if (idx != -1) {
          //       element.caseNumList.push('【' + parseInt(idx + 1) + '】')
          //     }
          //   })
          //   element.caseNumList = element.caseNumList.sort()
          // })
        })
        .catch(() => {
          this.table.isLoading = false
        })
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.page_num = val
      this.loadTable()
    },
    // 筛选条件查询
    search () {
      this.table.params.page_num = 1
      this.table.pageData.curPage = 1
      this.loadTable()
    },
    // 多选框
    handleCheckedPersonChange () {
      this.table.params.page_num = 1
      this.table.pageData.curPage = 1
      this.loadTable()
    }
  }
}
</script>

<style lang="less" scoped>
.formItem {
  width: 200px;
}
.page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
  .content {
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    width: 96%;
    height: 32px;
    white-space: nowrap;
    .checkList {
      position: absolute;
      left: 0px;
      top: 5px;
      transition: all 0.6s ease 0s;
    }
  }
  .pageBtn {
    background: var(--table-head-bg-color) !important;
    border: 1px solid rgba(255, 255, 255, 0.14901961) !important;
    border-radius: 2px !important;
    color: var(--base-text-color-to-999999) !important;
    height: 30px !important;
    width: 30px !important;
    line-height: 26px !important;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed !important;
    }
    &:focus {
      border: 1px solid rgba(255, 255, 255, 0.14901961) !important;
    }
    &:hover {
      color: #5288d8 !important;
      border: 1px solid rgba(255, 255, 255, 0.14901961) !important;
    }
    &.prev {
      margin-right: 8px;
    }
    &.next {
      margin-left: 8px;
    }
  }
}
.content /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #409eff;
}

.content /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  border-color: #409eff;
}
// 以下全局样式_element1搬过来的
.searchForm {
  padding: 15px;
  display: flex;
  align-items: center;
}
.searchForm .formItem {
  //  border: 1px solid rgba(255, 255, 255, 0.2);
  //  border-radius: 2px;
  margin-right: 40px;
  color: var(--base-text-color-1);
  width: 380px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 16px;
  position: relative;
}
</style>
