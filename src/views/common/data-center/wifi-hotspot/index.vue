// WIFI 热点
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
      :dataType='"probe_wifi"'
      :tipImgContent='"WIFI热点"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"probe_wifi"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id='list' class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>WIFI热点</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs" v-if="!curResId">
              <!-- 搜索表单 -->
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
              <span class="p-button refresh" @click.prevent.stop="searchEvent" v-if="deviceMac !== ''">
                <i class="el-icon-refresh-right"></i>
              </span>
              <i class='iconfont icon-zhushi'></i>
              <!-- 提示语 -->
              <span class="my_danger">仅展示1000条实时数据
                <span v-if="deviceMac !== ''">，且仅展示今日 00:00 – 23:59 的数据</span>
              </span>
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
              >{{ '搜索' }}</el-button
              >
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
        :header-row-style='{ height: $pxToRem(48) }'
        :header-cell-style="{
          'color': '#8799BF',
          'font-size': $pxToRem(16),
          'font-weight': '400'
        }"
        @handleCurrentChange="handleCurrentChange"
        :emptyObj="deviceMac == '' ? { text: '暂无数据' } : { text: '目前没有收到今日数据' }"
      ></template-table>
    </main>
      </div>
    </div>


    <CusExport
      method="post"
      fileName="WIFI热点"
      url="/police/warning/wifi/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData='pageData.total'
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import CusExport from '@/components/VisualComponents/CusExport'
import autoTableHeight from '@/mixins/autoTableHeight'
import { queryTableWifi, remarkUpdate } from '@/api/dataCenter'
import TemplateTable from '@/components/VisualComponents/Table'
import DatePick from '@/views/common/data-center/components/DatePick'
import PageHeader from '@/components/BasicComponents/PageHeader'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import dayjs from '@/utils/filters'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '采集时间', prop: 'collectTimeFormat' },
      { label: '场所', prop: 'placeName' },
      { label: '热点名称', prop: 'ssid' },
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
    minWidth: '15.17%',
    renderFun: function (row) {
      if (!row.collectTime) return '--'
      row.collectTime = parseInt(row.collectTime)
      return dayjs.filterExactS(row.collectTime)
    }
  },
  {
    label: '场所',
    prop: 'placeName',
    minWidth: '10.93%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知场所' }]
  },
  { label: '热点名称', prop: 'ssid', minWidth: '9.94%' },
  { label: 'MAC', prop: 'mac', minWidth: '15.77%' },
  {
    label: '设备',
    prop: 'deviceName',
    minWidth: '10.68%',
    type: 'danger',
    statuList: [{ status: '', color: 'F63F70', text: '未知设备' }]
  },
  { label: '经度', prop: 'longitude', minWidth: '12.04%' },
  { label: '纬度', prop: 'latitude', minWidth: '12.4%' }
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
      oldParams: {}, // 辅助 分页不搜索最新绑定值
      oldTableData: [], // 辅助 热点备注
      columns: Object.freeze([
        ...columns,
        // {
        //   label: '热点备注',
        //   prop: 'wifi_remark_name',
        //   width: '230',
        //   type: 'editeFlag',
        //   handleEdit: this.handleEdit,
        //   handleSave: this.handleSave
        // }
      ]),
      tableData: [],
      pageData: {
        curPage: 1,
        pageSize: 15,
        total: 0
      },
      isLoading: false, // 表格加载条
      params: {
        pageNum: 1,
        pageSize: 15,
        mac: '',
        startTime: '',
        endTime: '',
        placeName: '',
        deviceMac: ''
      }
    }
  },

  computed: {
    curResId () {
      return this.$route.query.id || ''
    },
    deviceMac () {
      // 设备地图跳转  增加设备id检索
      // this.params.deviceMac = this.$route.query.deviceMac || ''
      // this.oldParams.deviceMac = this.$route.query.deviceMac || ''
      return this.$route.query.deviceMac || ''
    }
  },
  watch: {
    deviceMac: {
      handler () {
        this.params.deviceMac = this.deviceMac || ''
        this.oldParams.deviceMac = this.deviceMac || ''
      },
      immediate: true
    },
    loading: {
      handler (newVal) {
        if (!newVal) {
          if (this.$route.query.pathName) { // 从设备地图-设备详情进入WIFI热点也要定位到表格
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
    // 赋值最新参数
    this.oldParams = { ...this.params }
    // console.log(this.deviceMac);
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

    // 备注编辑状态 false=》不可编辑状态  true=》编辑装填
    addRule (params) {
      let flag = true
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          flag = false
        }
      })
      return flag
    },

    // 备注编辑
    handleEdit (index) {
      //遍历数组改变editeFlag
      this.tableData[index].editeFlag = true
    },

    //  确认编辑热点备注 提交接口
    handleSave (index, row, type) {
      this.tableData[index].editeFlag = false
      if (type == 'cancel') {
        this.tableData[index].wifi_remark_name = this.oldTableData[index].wifi_remark_name
        return false
      }

      let obj = {
        remark: row.wifi_remark_name,
        attrValue: row.mac
      }
      // 修改热点备注
      remarkUpdate(obj).then(() => {
        this.oldTableData[index].wifi_remark_name = row.wifi_remark_name
        this.tableData[index].wifi_remark_name = row.wifi_remark_name
      })
    },

    // 加载表格数据
    loadTable () {
      this.$nextTick(() => {
        this.isLoading = true
        this.tableData = []
        this.pageData.total = 0

        queryTableWifi({ ...this.oldParams }).then(res => {
          this.tableData = [...res.content]
          this.pageData.total = res.totalSize
          if (this.$route.query.pathName) {
            sessionStorage.setItem('dataCenterSearchKey', this.oldParams.mac || '')
            sessionStorage.setItem('dataCenterSearchStart', this.oldParams.startTime || '')
            sessionStorage.setItem('dataCenterSearchEnd', this.oldParams.endTime || '')
          }
          // const resList = res.content
          // let attrs = resList.map(_c => _c.mac)
          // attrs = Array.from(new Set(attrs))

          // queryRemark({ attrs: attrs.join(',') }).then(remarkres => {
          //   this.tableData = resList.map(element => {
          //     element.editeFlag = false
          //     element.wifi_remark_name =
          //       remarkres.find(_c => _c.wifiMac === element.mac)?.wifiRemarkName.toString() ?? ''
          //     return element
          //   })

          //   this.pageData.total = res.totalSize
          //   // 利用 上一个表格数据 来修改 编辑输入框得flag 进行编辑操作
          //   this.oldTableData = JSON.parse(JSON.stringify(this.tableData))
          // })
        })
          .finally(() => {
            this.isLoading = false
          })
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

    //  校验查询参数
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
    }
  }
}
</script>

<style scoped lang="less">
  @import "../common-style";
</style>
<style lang="less" scoped>
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
