<template>
  <div
    id='wrap'
    class='wrap'
    v-p-loading="loading"
    :element-loading-background="'--bg-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      class="data"
      v-show='!loading'
      :showType="'text'"
      :dataType='"probe_phone"'
      :tipImgContent='"电围数据"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"probe_phone"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id='list' class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>电围数据</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs" v-if="!curResId">
              <!-- 搜索表单 -->
              <div>
                <el-input v-model.trim="params.phone" @keyup.enter.native="searchEvent" placeholder="请输入手机号" clearable> </el-input>
              </div>
              <div>
                <el-input v-model.trim="params.mac" @keyup.enter.native="searchEvent" placeholder="请输入MAC" clearable> </el-input>
              </div>
              <div>
                <el-input v-model.trim="params.imsi" @keyup.enter.native="searchEvent" placeholder="请输入IMSI" clearable> </el-input>
              </div>
              <div>
                <el-input v-model.trim="params.imei" @keyup.enter.native="searchEvent" placeholder="请输入IMEI" clearable> </el-input>
              </div>
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              <!-- 提示语 -->
              <i class='iconfont icon-zhushi'></i>
              <span class="my_danger">仅展示1000条实时数据</span>
            </div>

            <div class="table-searchs" v-else>
              <list-title title="查询条件" />

              <template>
                <div v-for="item in searchParamsList" :key="item.label">
                  {{ item.label }}：{{ item.value }}
                </div>
              </template>
            </div>

            <!-- 搜索按钮 -->
            <div class='opt_btn'>
              <el-button
                v-if="!curResId"
                type="primary"
                class="btn"
                v-debounce="searchEvent"
              >{{ '搜索' }}</el-button>
              <div class='division'></div>
              <div class='blank_button' :loading="exportShow" @click="exportTable">
                {{ '导出' }}
              </div>
            </div>
          </PageHeader>
        </header>

        <main class="table-main">
          <template-table
            :tableData="tableData"
            :columns="columns"
            :tableHeight='$pxToRem(784)'
            :rowHeight="48"
            :pageData="pageData"
            :isLoading="isLoading"
            :header-row-style='{ height: $pxToRem(48) }'
            :header-cell-style="{
              'color': '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
            :newRowColor='true'
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </main>
      </div>
    </div>


    <CusExport
      method="post"
      fileName="电围数据"
      url="/police/warning/phone/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData='pageData.total'
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { elePager } from '@/api/dataCenter'
import TemplateTable from '@/components/VisualComponents/Table'
import DatePick from '@/views/common/data-center/components/DatePick'
import PageHeader from '@/components/BasicComponents/PageHeader'
import dayjs from '@/utils/filters'
import CusExport from '@/components/VisualComponents/CusExport'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '采集时间', prop: 'collectTimeFormat' },
      { label: '场所', prop: 'placeName' },
      { label: '手机', prop: 'phone' },
      { label: 'IMSI', prop: 'imsi' },
      { label: 'IMEI', prop: 'imei' },
      { label: 'MAC', prop: 'mac' },
      { label: '运营商', prop: 'station' },
      { label: '设备', prop: 'deviceName' },
      // { label: '信号强度', prop: 'signal' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '设备厂商', prop: 'factoryName' }
    ]
  }
]

const columns = [
  { label: '设备厂商', prop: 'factoryName', minWidth: '8.52%', type: 'nor',
    renderFun: function (row) {
      if (!row.factoryName) return '--'
      return row.factoryName
    }
  },
  {
    label: '采集时间',
    prop: 'collectTime',
    minWidth: '12.56%',
    renderFun: function (row) {
      if (!row.collectTime) return '--'
      row.collect_time = parseInt(row.collectTime)
      return dayjs.filterExactS(row.collectTime)
    }
  },
  {
    label: '场所',
    prop: 'placeName',
    minWidth: '11.93%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知场所' }]
  },
  { label: '手机', prop: 'phone', minWidth: '8.69%', type: 'nor' },
  { label: 'IMSI', prop: 'imsi', minWidth: '10.85%', type: 'nor' },
  { label: 'IMEI', prop: 'imei', minWidth: '10.85%', type: 'nor' },
  { label: 'MAC', prop: 'mac', minWidth: '10.85%', type: 'nor' },
  {
    label: '运营商',
    prop: 'station',
    minWidth: '8%',
    type: 'nor',
    renderFun: function (row) {
      if (row.station) {
        return row.station
      } else {
        if (!row.imsi) return '--'
        //00 02 07是中国移动，01是中国联通，03是中国电信。
        const ChinaMobile = ['46000', '46002', '46007']
        const ChinaUnicom = '46001'
        const ChinaTelecom = '46003'
        if (row.imsi === ChinaUnicom) {
          return '中国联通'
        } else if (row.imsi === ChinaTelecom) {
          return '中国电信'
        } else if (ChinaMobile.includes(row.imsi)) {
          return '中国移动'
        } else {
          return '--'
        }
      }
    }
  },
  {
    label: '设备',
    prop: 'deviceName',
    minWidth: '5.8%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知设备' }]
  },
  // { label: '信号强度', prop: 'signal', minWidth: '90', type: 'nor' },
  {
    label: '经度',
    prop: 'longitude',
    minWidth: '7.39%',
    type: 'nor'
  },
  { label: '纬度', prop: 'latitude', minWidth: '7.39%', type: 'nor' }
]
export default {
  components: {
    TemplateTable,
    DatePick,
    PageHeader,
    CusExport,
    TotalData,
    TotalDataChartLine
  },
  mixins: [autoTableHeight, BaseLoadMixins],
  data () {
    return {
      allCols: Object.freeze(allCols),
      exportShow: false,
      searchParamsList: [],
      columns: Object.freeze(columns),
      tableData: [],
      pageData: {
        curPage: 1,
        pageSize: 15,
        total: 0
      },
      isLoading: false,
      params: {
        startTime: '',
        endTime: '',
        imeiorimsi: '',
        mac: '',
        phone: '',
        pageNum: 1,
        pageSize: 15
      },
      oldParams: {}
    }
  },

  computed: {
    curResId () {
      return this.$route.query.id || ''
    }
  },
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal) {
          if (this.$route.query.mac || this.$route.query.imsi || this.$route.query.imei || this.$route.query.phone) {
            this.$nextTick(() => {
              document.getElementById('list').scrollIntoView()
            })
          }
        }
      }
    }
  },
  created () {
    if (this.$route.query.mac) {
      this.params.mac = this.$route.query.mac
    }else if(this.$route.query.imsi) {
      this.params.imsi = this.$route.query.imsi
    }else if(this.$route.query.imei){
      this.params.imei = this.$route.query.imei
    }else if(this.$route.query.phone){
      this.params.phone = this.$route.query.phone
    }
    this.oldParams = { ...this.params }
    this.loadTable()
  },

  methods: {
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.exportShow = true
      })
    },

    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.params.pageNum = 1
        this.pageData.curPage = 1
        this.oldParams = { ...this.params }
        this.loadTable()
      })
    },

    /** 表格 - 搜索 - 校验 */
    searchRules () {
      if (this.$refs.DatePick) {
        this.params.startTime = this.$refs.DatePick.pick.startTime || ''
        this.params.endTime = this.$refs.DatePick.pick.endTime || ''
      }
      if (!this.params.startTime && this.params.endTime) {
        this.$messageTip.error('请输入开始时间！')
        return false
      }
      if (this.params.startTime && !this.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return false
      }
      return true
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.loadTable()
    },

    // 获取 表格数据
    loadTable () {
      this.$nextTick(() => {
        this.isLoading = true
        this.tableData = []
        this.pageData.total = 0

        elePager({ ...this.oldParams })
          .then(res => {
            this.tableData = [...res.content]
            this.pageData.total = res.totalSize
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../common-style";
.my_danger {
  color: var(--input-placehold-color);
}
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-right: 8px;
  margin-left: 12px;
}
::v-deep .el-input {
  width: 200px;
}
/deep/.PageHeader .el-input .el-icon-circle-close {
  right: 0;
}
</style>
