// 审计数据
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
      :dataType="'net_web'"
      :tipImgContent='"审计数据"'
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show="!loading"
      :dataType="'net_web'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <div id="list" class="wrap-list" v-show="!loading">
      <div class="title">
        <span>数据列表 -</span>
        <span>审计数据</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs" v-if="!curResId">
              <!-- 搜索表单 -->
              <div>
                <el-input
                  v-model.trim="params.placeName"
                  @keyup.enter.native="searchEvent"
                  placeholder="请输入场所"
                  clearable
                >
                </el-input>
              </div>
              <div>
                <el-input
                  v-model.trim="params.mac"
                  @keyup.enter.native="searchEvent"
                  placeholder="请输入终端MAC"
                  clearable
                >
                </el-input>
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
            <div class="opt_btn">
              <el-button v-if="!curResId" type="primary" class="btn" v-debounce="searchEvent">
                {{ '搜索' }}
              </el-button>
              <div class="division"></div>
              <div class="blank_button" :loading="exportShow" @click="exportTable">
                {{ '导出' }}
              </div>
            </div>
          </PageHeader>
        </header>

        <main class="table-main">
          <template-table
            :tableData="tableData"
            :columns="showColumns"
            :rowHeight="48"
            :btnRender="btnRender"
            :pageData="pageData"
            :isLoading="isLoading"
            :tableHeight='$pxToRem(784)'
            :header-row-style="{ height: $pxToRem(48) }"
            :header-cell-style="{
              color: '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
            @handleCurrentChange="handleCurrentChange"
          ></template-table>

<!--          <template-table-->
<!--            :tableData="tableData"-->
<!--            :columns="columns"-->
<!--            :rowHeight="48"-->
<!--            :pageData="pageData"-->
<!--            :isLoading="isLoading"-->
<!--            :showColumns="showColumns"-->
<!--            :header-row-style="{ height: $pxToRem(48) }"-->
<!--            :header-cell-style="{-->
<!--              'background-color': 'rgba(255, 255, 255, .04) !important',-->
<!--              color: '#8799BF',-->
<!--              'font-size': $pxToRem(16),-->
<!--              'font-weight': '400'-->
<!--            }"-->
<!--            :newRowColor="true"-->
<!--            @handleCurrentChange="handleCurrentChange"-->
<!--          >-->
<!--          </template-table>-->
        </main>
      </div>
    </div>
    <pop
      :pop.sync="pop"
      @beforeClose="hideDetail"
      @beforeOpen="showDetail"
      :dataCenterDetail="true"
    >
      <AuditDetail :row="row"></AuditDetail>
    </pop>

    <CusExport
      method="post"
      fileName="审计数据"
      url="/police/warning/netWeb/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData="pageData.total"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { queryTable_audi } from '@/api/dataCenter'
import TemplateTable from '@/components/VisualComponents/Table'
import DatePick from '@/views/common/data-center/components/DatePick'
import PageHeader from '@/components/BasicComponents/PageHeader'
import dayjs from '@/utils/filters'
import CusExport from '@/components/VisualComponents/CusExport'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'
import AuditDetail from './components/auditDetail'
import Pop from '@/components/VisualComponents/PopDialog'
const allCols = [
  {
    label: '事件项',
    list: [
      { label: '场所', prop: 'placeName' },
      { label: '设备', prop: 'deviceName' },
      { label: '设备MAC', prop: 'collectMac' },
      { label: '终端IP', prop: 'dstVA4ip' },
      { label: '网络行为', prop: 'webType' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '采集时间', prop: 'collectTimeFormat' },
      { label: '场所编码', prop: 'placeCode' },
      { label: '场所类型', prop: 'placeTypeName' },
      { label: '设备厂商', prop: 'factoryCode' },
      { label: '终端MAC', prop: 'mac' },
      { label: '内网IP', prop: 'srcLocalIp' },
      { label: '认证账号', prop: 'authCode' },
      { label: '网址主体', prop: 'host' },
      { label: '网站主题', prop: 'title' },
      { label: '浏览链接', prop: 'url' },
    ]
  }
  // {
  //   label: '详情项',
  //   list: [
  //     { label: '场所类型', prop: 'placeTypeName' },
  //     { label: '场所编码', prop: 'placeCode' },
  //     { label: '采集设备MAC', prop: 'collectMac' },
  //     { label: '终端IP', prop: 'srcLocalIp' },
  //     { label: '认证类型', prop: 'authType' },
  //     { label: '认证账号', prop: 'authCode' },
  //     { label: '网站host名称', prop: 'host' },
  //     { label: 'url地址', prop: 'url' }
  //   ]
  // }
]
const showColumns = [
  {
    label: '采集时间',
    prop: 'collectTime',
    minWidth: '13.58%',
    renderFun: function (row) {
      if (!row.collectTime) return '--'
      return dayjs.filterExactS(row.collectTime)
    }
  },
  {
    label: '场所',
    prop: 'placeName',
    minWidth: '7.78%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知场所' }]
  },
  {
    label: '设备',
    prop: 'deviceName',
    minWidth: '7.84%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知设备' }]
  },
  { label: '设备MAC', prop: 'collectMac', minWidth: '11.93%' },
  { label: '终端IP', prop: 'dstVA4ip', minWidth: '8.24%' },
  {
    label: '网络行为',
    prop: 'webType',
    minWidth: '8.29%',
    renderFun: function () {
      return '网页类型'
    }
  },
  { label: '重点摘要', prop: 'cookie', minWidth: '14.43%' },
  { label: '经度', prop: 'longitude', minWidth: '7.84%' },
  { label: '纬度', prop: 'latitude', minWidth: '7.5%' },
  // { label: '摘要', prop: 'keyword1', width: '250' },
]

export default {
  components: {
    TemplateTable,
    CusExport,
    DatePick,
    PageHeader,
    TotalData,
    TotalDataChartLine,
    AuditDetail,
    Pop
  },
  mixins: [autoTableHeight, BaseLoadMixins, fSupSearchMixins],

  data () {
    return {
      pop: { show: false, title: '详情', width: '1024px' },
      row: {},
      allCols: Object.freeze(allCols),

      exportShow: false,
      searchParamsList: [],
      showColumns: Object.freeze(showColumns),
      tableData: [],
      pageData: {
        curPage: 1,
        pageSize: 15,
        total: 0
      },
      isLoading: false,
      params: {
        placeName: '',
        mac: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 15
      },
      oldParams: {},
      btnRender: [
        {
          label: '详情',
          icon: 'icon-xiangqing',
          btnEvent: this.getDetailsRow,
          alt: '查看详情'
        }
      ]
    }
  },

  computed: {
    placeType () {
      return this.$store.getters['Dict/siteTypeListMap']
    },
    curResId () {
      return this.$route.query.id || ''
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
      this.params.mac = this.$route.query.mac || this.$route.query.key
      this.params.startTime = this.$route.query.startTime || ''
      this.params.endTime = this.$route.query.endTime || ''
    }
    this.oldParams = { ...this.params }
    this.loadTable()
  },

  methods: {
    // 操作 查看档案操作
    getDetailsRow (row) {
      this.showDetail()

      this.row = JSON.parse(JSON.stringify(row))
    },

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

    /** 表格 -》 筛选条件搜索  */
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

    /**  表格 -》 分页切换操作 */
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.loadTable()
    },

    /**  表格 -》 获取 */
    loadTable () {
      this.$nextTick(() => {
        this.isLoading = true
        this.tableData = []
        this.pageData.total = 0

        queryTable_audi({ ...this.oldParams })
          .then(res => {
            this.tableData = res.content.map(item => {
              item.placeTypeName = this.placeType[item.place_type]
              return item
            })
            this.pageData.total = res.totalSize
            if (this.$route.query.pathName) {
              sessionStorage.setItem('dataCenterSearchKey', this.oldParams.mac || '')
              sessionStorage.setItem('dataCenterSearchStart', this.oldParams.startTime || '')
              sessionStorage.setItem('dataCenterSearchEnd', this.oldParams.endTime || '')
            }
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
/deep/.el-table__body-wrapper {
    height: 750px;
    overflow-y: auto;
    position: relative;
}
.my_danger {
  color: var(--input-placehold-color);
}
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-right: 8px;
  margin-left: 12px;
}
/deep/.PageHeader .el-input .el-icon-circle-close {
  right: 0;
}
</style>
