<template>
  <div
    id="wrap"
    class="wrap"
    v-p-loading="loading"
    :element-loading-background="'--bg-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      class="data"
      v-show="!loading"
      :showType="'text'"
      :dataType="'epidemic_resumework'"
      :tipImgContent='"复工复产"'
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show="!loading"
      :dataType="'epidemic_resumework'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <div id="list" class="wrap-list" v-show="!loading">
      <div class="title">
        <span>数据列表 -</span>
        <span>复工复产</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 查询条件 -->
            <template>
              <div class="searchCondition">
                <div class="searchCondition_searchKeys">
                  <el-input
                    v-model.trim="table.params.key"
                    placeholder="请输入姓名/证件号码/手机"
                    @keyup.enter.native="searchEvent"
                    clearable
                  >
                    <template slot='suffix'>
                      <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 时间搜索控件 -->
                <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              </div>
              <!-- 搜索按钮 -->
              <div class="opt_btn">
                <el-button type="primary" class="btn" v-debounce="searchEvent">{{
                  '搜索'
                }}</el-button>
                <div class="division"></div>
                <div class="blank_button" :loading="exportShow" @click="exportTable">
                  {{ '导出' }}
                </div>
              </div>
            </template>
          </PageHeader>
        </header>

        <main class="table-main">
          <template-table
            :tableData="table.tableData"
            :columns="table.columns"
            :tableHeight='$pxToRem(784)'
            :rowHeight="48"
            :btnRender="table.btnRender"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :header-row-style="{ height: $pxToRem(48) }"
            :header-cell-style="{
              'color': '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
            :newRowColor="true"
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </main>
      </div>
    </div>
    <pop
      :pop.sync="pop"
      @beforeClose="hideDetail"
      @beforeOpen="showDetail"
      :dataCenterDetail="true"
    >
      <!-- 碰撞详情 -->
      <ResumeWorkDetail :row="row"></ResumeWorkDetail>
    </pop>
    <CusExport
      method="post"
      fileName="复工复产"
      url="/police/warning/epidemicResumeWork/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData="table.pageData.total"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import TemplateTable from '@/components/VisualComponents/Table'
import PageHeader from '@/components/BasicComponents/PageHeader'
import DatePick from '@/views/common/data-center/components/DatePick'
import Pop from '@/components/VisualComponents/PopDialog'
import ResumeWorkDetail from './components/ResumeWorkDetail'
import { getResumeWorkData } from '@/api/dataCenter'
import CusExport from '@/components/VisualComponents/CusExport'
import dayjs from '@/utils/filters'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '姓名', prop: 'name' },
      { label: '性别', prop: 'gender' },
      { label: '民族', prop: 'nation' },
      { label: '出生日期', prop: 'birthday' },
      { label: '证件类型', prop: 'cerType' },
      { label: '证件号码', prop: 'cerNumber' },
      { label: '手机', prop: 'phone' },
      { label: '居住地址', prop: 'liveAddress' },
      { label: '户籍地址', prop: 'address' },
      { label: '出行方式', prop: 'tripMode' },
      { label: '前往地点', prop: 'resumeworkAddress' },
      { label: '登记时间', prop: 'collectTime' },
      { label: '备注', prop: 'remark' }
    ]
  }
]

const columns = [
  {
    label: '登记时间', prop: 'collectTime', minWidth: '13.57%',
    renderFun: function (row) {
      if (!row.collectTime) return '--'
      row.collectTime = parseInt(row.collectTime)
      return dayjs.filterSS(row.collectTime)
    }
  },
  { label: '姓名', prop: 'name', minWidth: '7.73%' },
  {
    label: '性别', prop: 'gender', minWidth: '6.02%',
    renderFun: function (row) {
      if (!row.gender) return '--'
      return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
    }
  },
  { label: '证件号码', prop: 'cerNumber', minWidth: '13.81%' },
  { label: '手机', prop: 'phone', minWidth: '9.6%' },
  { label: '居住地址', prop: 'liveAddress', minWidth: '15.5%' },
  { label: '出行方式', prop: 'tripMode', minWidth: '8.29%' },
  { label: '前往地点', prop: 'resumeworkAddress', minWidth: '18.75%' },
  // {
  //   label: '籍贯',
  //   prop: 'houseAddr',
  //   width: '120',
  //   renderFun: function (row) {
  //     return row.houseAddr || '--'
  //   }
  // },
]

export default {
  components: {
    TemplateTable,
    // Detail,
    // Pop,
    PageHeader,
    DatePick,
    Pop,
    ResumeWorkDetail,
    CusExport,
    TotalData,
    TotalDataChartLine
  },
  mixins: [autoTableHeight, BaseLoadMixins, fSupSearchMixins],
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal) {
          if (this.$route.query.pathName) {
            setTimeout(()=>{
              document.getElementById('list').scrollIntoView(true)
            },0)
          }
        }
      }
    }
  },
  data () {
    return {
      type: 'allSingle',
      // subHeight: 290,
      allCols: Object.freeze(allCols),
      searchLoading: false,
      exportShow: false, //导出状态
      pop: { show: false, title: '详情', width: '1024px' },
      table: {
        columns: Object.freeze(columns),
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 15,
          total: 0
        },
        btnRender: [
          {
            label: '详情',
            icon: 'icon-xiangqing',
            btnEvent: this.getDetailsRow,
            alt: '查看详情'
          }
        ],
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 15,
          startTime: '',
          endTime: '',
          key: ''
        }
      },
      detailData: null, //弹窗内容
      fieldList: null,
      oldParams: {
        pageNum: 1,
        pageSize: 15,
        key: '',
        startTime: '',
        endTime: ''
      },
      row: {}
    }
  },

  created () {
    if (this.$route.query.pathName) {
      this.table.params.key = this.$route.query.name || this.$route.query.identity || this.$route.query.key
      this.table.params.startTime = this.$route.query.startTime || ''
      this.table.params.endTime = this.$route.query.endTime || ''
    }
    this.oldParams = { ...this.table.params }
    this.getTable()
    // this.getTable()
  },

  methods: {
    showDetail () {
      this.pop.show = true
    },
    hideDetail () {
      this.pop.show = false
    },
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.exportShow = true
      })
    },
    //  校验查询参数
    searchRules () {
      if (this.$refs.DatePick) {
        this.table.params.startTime = this.$refs.DatePick.pick.startTime || ''
        this.table.params.endTime = this.$refs.DatePick.pick.endTime || ''
      }

      if (!this.table.params.startTime && this.table.params.endTime) {
        this.$messageTip.error('请输入开始时间！')
        return false
      }
      if (this.table.params.startTime && !this.table.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return false
      }
      return true
    },
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.table.params.pageNum = 1
        this.table.pageData.curPage = 1
        this.searchLoading = true

        this.oldParams = JSON.parse(JSON.stringify(this.table.params))
        this.getTable()
      })
    },

    resetEvent () {
      this.$nextTick(() => {
        this.$refs.CusFilter.isShowPanel = false
        this.$refs.DatePick.clearTime()
        this.$refs.CusFilter.checkedList = []
        this.curPage = 1
        this.table.params = {
          pageNum: 1,
          pageSize: 15,
          startTime: '',
          endTime: '',
          key: ''
        }
        this.oldParams = { ...this.table.params }
        this.getTable()
      })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.getTable()
    },

    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      if (!this.oldParams.key) {
        delete this.oldParams.key
      }
      getResumeWorkData(this.oldParams)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
          if (this.$route.query.pathName) {
            sessionStorage.setItem('dataCenterSearchKey', this.oldParams.key || '')
            sessionStorage.setItem('dataCenterSearchStart', this.oldParams.startTime || '')
            sessionStorage.setItem('dataCenterSearchEnd', this.oldParams.endTime || '')
          }
        })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    },

    //时间选择
    checkTime () {
      if (this.$refs.DatePick && this.$refs.DatePick.startTime) {
        this.table.params.startTime = this.$refs.DatePick.pick.startTime
      }
      if (this.$refs.DatePick && this.$refs.DatePick.endTime) {
        this.table.params.endTime = this.$refs.DatePick.pick.endTime
      }

      if (!this.table.params.startTime && this.table.params.endTime) {
        this.$messageTip.error('请输入开始时间！')
        return
      }

      if (this.table.params.startTime && !this.table.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return
      }

      return true
    },
    // 查看详情
    getDetailsRow (row) {
      this.showDetail()

      Object.keys(row).forEach(key => {
        if (key.includes('Time')) {
          row[key + 'Str'] = row[key] ? dayjs.filterString(parseInt(row[key])) : ''
        }
      })

      let str = row.birthday.slice(0, 4) + '-'
      str += row.birthday.slice(4, 6) + '-'
      str += row.birthday.slice(6, 8)

      row.birthdayStr = str

      this.row = JSON.parse(JSON.stringify(row))
    }
  }
}
</script>

<style lang="less" scoped>
@import '../common-style';
</style>
<style lang="less" scoped>
.searchCondition {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  // padding-top: 12px;
  > div {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }
}
::v-deep .el-input {
  width: 416px;
}
</style>
