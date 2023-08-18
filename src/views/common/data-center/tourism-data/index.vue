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
      :dataType="'police_hotel'"
      :tipImgContent='"旅业数据"'
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show="!loading"
      :dataType="'police_hotel'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <div id="list" class="wrap-list" v-show="!loading">
      <div class="title">
        <span>数据列表 -</span>
        <span>旅业数据</span>
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
            </div>

            <!-- 搜索按钮 -->
            <div class="opt_btn">
              <!-- <el-button type="primary" class="btn" @click="searchEvent" :loading="searchLoading">{{
                searchLoading ? '搜索中' : '搜索'}}</el-button> -->
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
            :newRowColor="true"
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
      v-show="show"
    >
      <!-- 碰撞详情 -->
      <detail :row="row"></detail>
    </pop>
    <CusExport
      method="post"
      fileName="旅业数据"
      url="/police/dc_travel/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData="table.pageData.total"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { travelPager } from '@/api/dataCenter'
import dayjs from '@/utils/filters'
import TemplateTable from '@/components/VisualComponents/Table'
import Detail from './components/HotelDetail'
import Pop from '@/components/VisualComponents/PopDialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import CusExport from '@/components/VisualComponents/CusExport'
import fSupSearchMixins from '../fSupSearchMixins'
import DatePick from'@/views/common/data-center/components/DatePick'
const allCols = [
  {
    label: '事件项',
    list: [
      // { label: '头像', prop: 'headPicFile' },
      { label: '姓名', prop: 'realName' },
      { label: '出生日期', prop: 'birthday' },
      { label: '证件类型', prop: 'idCardType' },
      { label: '证件号码', prop: 'cerNumber' },
      { label: '民族', prop: 'nation' },
      { label: '户籍地址', prop: 'houseAddr' },
      { label: '旅店名称', prop: 'hotelName' },
      { label: '旅店编号', prop: 'hotelSN' },
      { label: '旅店地址', prop: 'resiAddr' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '旅客所属区域', prop: 'travellerRegion' },
      { label: '入住房号', prop: 'inRoomNumber' },
      { label: '入住时间', prop: 'inTimestamp' },
      { label: '退房时间', prop: 'outTimestamp' },
      { label: '居住天数', prop: 'live' }
    ]
  }
]
const TABLE_COLUMNS = [
  { label: '旅店地址', prop: 'resiAddr', minWidth: '14.43%' },
  {
    label: '入住时间',
    prop: 'inTimestamp',
    minWidth: '12.56%',
    renderFun: function (row) {
      if (!row.inTimestamp) return '--'
      row.inTimestamp = parseInt(row.inTimestamp)
      return dayjs.filterString(row.inTimestamp)
    }
  },
  { label: '酒店名称', prop: 'hotelName', minWidth: '9.2%' },
  { label: '入住房号', prop: 'inRoomNumber', minWidth: '9.1%' },
  { label: '姓名', prop: 'realName', minWidth: '8.3%' },
  { label: '证件类型', prop: 'idCardType', minWidth: '7.39%' },
  { label: '证件号码', prop: 'cerNumber', minWidth: '14.03%' },
  { label: '经度', prop: 'longitude', minWidth: '9.43%' },
  { label: '纬度', prop: 'latitude', minWidth: '8.75%' }
  // {
  //   label: '退房时间',
  //   prop: 'outTimestamp',
  //   width: '220',
  //   renderFun: function (row) {
  //     if (!row.outTimestamp) return '--'
  //     row.outTimestamp = parseInt(row.outTimestamp)
  //     return dayjs.filterString(row.outTimestamp)
  //   }
  // }
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
  data () {
    return {
      show: false,
      allCols: Object.freeze(allCols),
      searchLoading: false,
      exportShow: false, //导出状态
      pop: { show: false, title: '详情', width: '1320px' },
      row: {},
      table: {
        columns: Object.freeze(TABLE_COLUMNS),
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
          },
          {
            label: '查看档案',
            icon: 'icon-dangan',
            btnEvent: this.handleGo,
            alt: '查看档案'
          },
        ],
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 15,
          key: '',
          startTime: '',
          endTime: ''
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
    this.getTable()
  },

  methods: {
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.exportShow = true
      })
    },
    handleGo (row) {
      if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
        this.$messageTip.error('暂无权限！')
        return false
      } else if (!row.personVid) {
        this.$messageTip.error('未找到该档案！')
        return false
      }
      window.open(window.location.origin + '/ol/PersonFileDetail?cerNumber=' + row.cerNumber + '&personVid=' + row.personVid + '&cerType=' + '&label=人物档案', "_blank")
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

    hideDetail () {
      this.pop.show = false
      this.show = false
    },
    showDetail () {
      this.pop.show = true
      setTimeout(() => {
        this.show = true
      }, 200)
    },

    // 操作 查看档案操作
    getDetailsRow (row) {
      this.showDetail()

      Object.keys(row).forEach(key => {
        if (key.includes('Time')) {
          row[key + 'Str'] = row[key] ? dayjs.filterString(parseInt(row[key])) : ''
        }
      })

      row.birthdayStr = row.birthday.replace(/-/g, '/')

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
      travelPager(this.oldParams)
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
    /** 表格 - 搜索 - 校验 */
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
  }
}
</script>

<style lang="less" scoped>
@import "../common-style";
</style>
<style lang='less' scoped>
::v-deep .el-input {
  width: 416px;
}
</style>
