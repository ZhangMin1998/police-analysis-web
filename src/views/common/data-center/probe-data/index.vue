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
      :dataType='"probe_mac"'
      :tipImgContent='"探针数据"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"probe_mac"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id='list' class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>探针数据</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs" v-if="!curResId">
              <div class="table-searchs" v-if="deviceMac">
                <list-title :title="`设备MAC：${deviceMac}`" />
              </div>              <!-- 搜索表单 -->
              <!-- <div v-if="deviceMac === ''">
                <el-input v-model.trim="params.placeName" placeholder="请输入场所名称" clearable>
                </el-input>
              </div> -->
              <div>
                <el-input
                  v-model.trim="params.mac"
                  @keyup.enter.native="searchEvent"
                  placeholder="请输入终端MAC"
                  clearable
                >
                  <template slot='suffix'>
                    <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                  </template>
                </el-input>
              </div>
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" v-if="deviceMac === ''" ref="DatePick"></DatePick>
              <!-- 刷新按钮 -->
              <span class="p-button refresh" @click.prevent.stop="searchEvent" v-if="deviceMac != ''">
            <i class="el-icon-refresh-right" style="font-size: 20px"></i>
          </span>
              <i class='iconfont icon-zhushi'></i>
              <!-- 提示语 -->
              <span class="my_danger"
              >仅展示1000条实时数据
            <span v-if="deviceMac !== ''">，且仅展示今日 00:00 – 23:59 的数据</span></span
              >
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
            :rowHeight="48"
            :pageData="pageData"
            :isLoading="isLoading"
            :newRowColor="true"
            :tableHeight='$pxToRem(784)'
            :emptyObj="deviceMac == '' ? { text: '暂无数据' } : { text: '目前没有收到今日数据' }"
            :header-row-style='{ height: $pxToRem(48) }'
            :header-cell-style="{
              'color': '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </main>
      </div>
    </div>

    <CusExport
      method="post"
      fileName="探针数据"
      url="/police/warning/mac/export"
      :exportShow.sync="exportShow"
      :totalData='pageData.total'
      :allCols="allCols"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import CusExport from '@/components/VisualComponents/CusExport'
import { queryTableProbe } from '@/api/dataCenter'
import TemplateTable from '@/components/VisualComponents/Table'
import DatePick from '@/views/common/data-center/components/DatePick'
import PageHeader from '@/components/BasicComponents/PageHeader'
import dayjs from '@/utils/filters'
import autoTableHeight from '@/mixins/autoTableHeight'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '采集时间', prop: 'collectTimeFormat' },
      { label: '场所', prop: 'placeName' },
      { label: 'MAC', prop: 'mac' },
      { label: '设备', prop: 'deviceName' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '设备厂商', prop: 'factoryName' }
    ]
  }
]

const columns = [
  { label: '设备厂商', prop: 'factoryName', minWidth: '12.73%',
    renderFun: function (row) {
      if (!row.factoryName) return '--'
      return row.factoryName
    }
  },
  {
    label: '采集时间',
    prop: 'collectTime',
    minWidth: '16.875%',
    renderFun: function (row) {
      if (!row.collectTime) return '--'
      row.collectTime = parseInt(row.collectTime)
      return dayjs.filterExactS(row.collectTime)
    }
  },
  {
    label: '场所',
    prop: 'placeName',
    minWidth: '13.75%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知场所' }]
  },
  { label: 'MAC', prop: 'mac', minWidth: '17.73%' },
  {
    label: '设备',
    prop: 'deviceName',
    minWidth: '11.87%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知设备' }]
  },
  { label: '经度', prop: 'longitude', minWidth: '13.75%' },
  { label: '纬度', prop: 'latitude', minWidth: '13.295%' }
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

  mixins: [autoTableHeight, BaseLoadMixins, fSupSearchMixins],
  data () {
    return {
      allCols: Object.freeze(allCols),
      exportShow: false, //导出状态
      searchParamsList: [],
      tableData: [],
      columns: Object.freeze(columns),
      pageData: {
        curPage: 1,
        pageSize: 15,
        total: 0
      },
      isLoading: false, // 加载条
      params: {
        mac: '',
        startTime: '',
        endTime: '',
        placeName: '',
        deviceMac: '',
        pageNum: 1,
        pageSize: 15
      },
      oldParams: {}
    }
  },

  computed: {
    curResId () {
      return this.$route.query.id || ''
    },
    deviceMac () {
      // 设备地图跳转  增加设备id检索
      // this.params.deviceMac = this.$route.query.deviceMac || ''
      return this.$route.query.deviceMac || ''
    }
  },
  watch: {
    deviceMac: {
      handler () {
        this.params.deviceMac = this.deviceMac || ''
      },
      immediate: true
    },
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
  mounted () {
    if (this.$route.query.pathName) {
      this.params.mac = this.$route.query.mac || this.$route.query.key
      this.params.startTime = this.$route.query.startTime || ''
      this.params.endTime = this.$route.query.endTime || ''
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

    /** 表格 - 接口 */
    loadTable () {
      this.$nextTick(() => {
        this.isLoading = true
        this.tableData = []
        this.pageData.total = 0

        queryTableProbe({ ...this.oldParams })
          .then(res => {
            this.tableData = [...res.content]
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
    },

    /** 表格 - 搜索 */
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

    /** 表格 - 分页 */
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.loadTable()
    }
  }
}
</script>

<style scoped lang="less">
@import "../common-style";
</style>
<style scoped lang="less">
.p-button.refresh {
  margin-left: 16px;
  padding: 6px 12px;
  font-size: 20px;
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
::v-deep .el-input {
  width: 416px;
}
</style>
