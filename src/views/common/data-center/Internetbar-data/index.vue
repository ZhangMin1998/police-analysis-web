// 网吧数据
<template>
  <div
    id="wrap"
    class="wrap"
    v-loading="loading"
    element-loading-background="#21283E"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      class="data"
      v-show="!loading"
      :showType="'text'"
      :dataType="'police_netbar_type'"
      :tipImgContent='"网吧数据"'
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show="!loading"
      :dataType="'police_netbar_type'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <div id="list" class="wrap-list" v-show="!loading">
      <div class="title">
        <span>数据列表 -</span>
        <span>网吧数据</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs">
              <el-input
                v-model.trim="table.params.key"
                @keyup.enter.native="searchEvent"
                placeholder="请输入姓名/证件号码"
                clearable
              >
                <template slot='suffix'>
                  <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                </template>
              </el-input>
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              <!-- 搜索表单 -->
              <!-- <div>
                <el-input v-model.trim="table.params.netBarName" placeholder="请输入网吧名称" clearable>
                </el-input>
              </div> -->
              <!--              <div>-->
              <!--                <el-input v-model.trim="table.params.name" @keyup.enter.native="searchEvent" placeholder="请输入姓名"> </el-input>-->
              <!--              </div>-->
              <!--              <div>-->
              <!--                <el-input v-model.trim="table.params.idNum" @keyup.enter.native="searchEvent" placeholder="请输入证件号码" clearable>-->
              <!--                </el-input>-->
              <!--              </div>-->
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
          </PageHeader>
        </header>

        <main class="table-main">
          <template-table
            :tableData="table.tableData"
            :columns="table.columns"
            :rowHeight="48"
            :btnRender="table.btnRender"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :tableHeight='$pxToRem(784)'
            :header-row-style="{ height: $pxToRem(48) }"
            :header-cell-style="{
              color: '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
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
      <detail :row="row"></detail>
    </pop>
    <CusExport
      method="post"
      fileName="网吧数据"
      url="/police/dc_netBar/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData="table.pageData.total"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { netBarPager } from '@/api/dataCenter'
import dayjs from '@/utils/filters'
import TemplateTable from '@/components/VisualComponents/Table'
import Detail from './components/NetBarDetail'
import DatePick from '@/views/common/data-center/components/DatePick'
import Pop from '@/components/VisualComponents/PopDialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import CusExport from '@/components/VisualComponents/CusExport'
import fSupSearchMixins from '../fSupSearchMixins'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '网吧名称', prop: 'netBarName' },
      { label: '内网终端IP', prop: 'insideIp' },
      { label: '公网IP', prop: 'outsideIp' },
      // { label: '网吧编号', prop: 'birthday' },
      { label: '姓名', prop: 'realName' },
      { label: '证件类型', prop: 'idCardType' },
      { label: '证件号码', prop: 'idCardNumber' },
      { label: '上机时间', prop: 'onTime' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '网吧地址', prop: 'address' },
      { label: '软件名称及账号', prop: 'appInfoAndAccount' }
    ]
  }
]
const columns = [
  // {
  //   label: '网吧详址',
  //   prop: 'netBarAddr',
  //   minWidth: '180',
  //   renderFun: function (row) {
  //     return row.netBarAddr || '--'
  //   }
  // },
  {
    label: '网吧地址',
    prop: 'address',
    minWidth: '14.43%',
    renderFun: function (row) {
      return row.address || '--'
    }
  },
  {
    label: '上机时间',
    prop: 'onTimestamp',
    minWidth: '12.56%',
    renderFun: function (row) {
      if (!row.onTimestamp) return '--'
      row.onTimestamp = parseInt(row.onTimestamp)
      return dayjs.filterString(row.onTimestamp)
    }
  },
  { label: '网吧名称', prop: 'netBarName', minWidth: '11.48%' },
  { label: '姓名', prop: 'realName', minWidth: '10.22%' },
  { label: '证件类型', prop: 'idCardType', minWidth: '10%' },
  {
    label: '证件号码',
    prop: 'idCardNumber',
    minWidth: '16.3%'
  },
  // { label: '内网终端IP', prop: 'insideIp', width: '150' },
  // { label: '公网IP', prop: 'outsideIp', width: '150' },
  // {
  //   label: '下机时间',
  //   prop: 'offTimestamp',
  //   width: '210',
  //   renderFun: function (row) {
  //     if (!row.offTimestamp) return '--'
  //     row.offTimestamp = parseInt(row.offTimestamp)
  //     return dayjs.filterString(row.offTimestamp)
  //   }
  // },
  {
    label: '经度',
    prop: 'longitude',
    minWidth: '9.43%',
    renderFun: function (row) {
      return row.longitude || '--'
    }
  },
  {
    label: '纬度',
    prop: 'latitude',
    minWidth: '8.75%',
    renderFun: function (row) {
      return row.latitude || '--'
    }
  }
]
export default {
  components: {
    TemplateTable,
    Detail,
    Pop,
    PageHeader,
    TotalData,
    TotalDataChartLine,
    CusExport,
    DatePick
  },
  mixins: [autoTableHeight, BaseLoadMixins, fSupSearchMixins],
  data () {
    return {
      allCols: Object.freeze(allCols),
      exportShow: false, //导出状态
      searchLoading: false,
      pop: { show: false, title: '详情', width: '1024px' },
      row: {},
      table: {
        columns: [...columns],
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
          key: '',
          // name: '',
          netBarName: '',
          startTime: '',
          endTime: ''
          // idNum: ''
        }
      },
      detailData: null, //弹窗内容
      fieldList: null,
      oldParams: {
        pageNum: 1,
        pageSize: 15,
        key: '',
        // name: '',
        netBarName: '',
        startTime: '',
        endTime: ''
        // idNum: ''
      }
    }
  },
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal) {
          if (this.$route.query.pathName) {
            this.$nextTick(() => {
              document.getElementById('list').scrollIntoView()
            })
          }
        }
      }
    }
  },
  created () {
    if (this.$route.query.pathName) {
      this.table.params.key = this.$route.query.identity || this.$route.query.name || this.$route.query.key
      this.table.params.startTime = this.$route.query.startTime || ''
      this.table.params.endTime = this.$route.query.endTime || ''
    }
    this.oldParams = { ...this.table.params }
    // if (this.$route.query.identity) {
    //   this.table.params.idNum = this.$route.query.identity
    //   this.oldParams.idNum = this.$route.query.identity
    // } else if (this.$route.query.name) {
    //   this.table.params.name = this.$route.query.name
    //   this.oldParams.name = this.$route.query.name
    // }
    this.getTable()
  },
  methods: {
    // 导出表格
    exportTable () {
      this.exportShow = true
    },
    // 筛选条件搜索
    searchEvent () {
      if (this.$refs.DatePick) {
        this.table.params.startTime = this.$refs.DatePick.pick.startTime || ''
        this.table.params.endTime = this.$refs.DatePick.pick.endTime || ''
      }
      this.table.params.pageNum = 1
      this.table.pageData.curPage = 1
      this.searchLoading = true
      this.oldParams = JSON.parse(JSON.stringify(this.table.params))
      this.getTable()
    },

    hideDetail () {
      this.pop.show = false
    },

    showDetail () {
      this.pop.show = true
    },

    // 操作 查看档案操作
    getDetailsRow (row) {
      this.showDetail()

      Object.keys(row).forEach(key => {
        if (key.includes('Time')) {
          row[key + 'Str'] = row[key] ? dayjs.filterString(parseInt(row[key])) : ''
        }
      })

      this.row = JSON.parse(JSON.stringify(row))
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.getTable()
    },

    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      netBarPager(this.oldParams)
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
    }
  }
}
</script>
<style lang='less' scoped>
@import '../common-style';
::v-deep .el-input {
  width: 416px;
}
</style>
