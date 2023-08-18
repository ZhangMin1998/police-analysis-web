// 车辆识别
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
      :dataType='"community_car"'
      :tipImgContent='"停车记录"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"community_car"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id='list' class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>停车记录</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs">
              <!-- 搜索表单 -->
              <div>
                <el-input
                  v-model.trim="table.params.carNumber"
                  @keyup.enter.native="searchEvent"
                  placeholder="请输入车牌号"
                  clearable
                >
                  <template slot='suffix'>
                    <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                  </template>
                </el-input>
              </div>
              <!-- <div>
                <el-input v-model.trim="table.params.deviceName" placeholder="请输入设备名称" clearable>
                </el-input>
              </div> -->
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              <!-- 提示语 -->
              <!-- <img class='header_img' src='@/assets/img/icon-tip-blue.png' alt=''>
              <span class="my_danger">仅展示2000条实时数据</span> -->
            </div>

            <!-- 搜索按钮 -->
            <div class='opt_btn'>
              <el-button type="primary" class="btn" v-debounce="searchEvent">{{'搜索'}}</el-button>
              <div class='division'></div>
              <div class='blank_button' :loading="exportShow" @click="exportTable">
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


    <pop :pop.sync="pop" @beforeClose="hideDetail" @beforeOpen="showDetail" :dataCenterDetail='true'>
      <!-- 碰撞详情 -->
      <detail :row="row"></detail>
    </pop>
    <CusExport
      method="post"
      fileName="停车记录"
      url="/police/dc_car/pager/export"
      :exportShow.sync="exportShow"
      :allCols="allCols"
      :totalData='table.pageData.total'
      :params="{ ...table.params }"
    ></CusExport>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { queryTable_car } from '@/api/dataCenter'
import dayjs from '@/utils/filters'
import TemplateTable from '@/components/VisualComponents/Table'
import Detail from './components/CarDetail'
import DatePick from '@/views/common/data-center/components/DatePick'
import Pop from '@/components/VisualComponents/PopDialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'
import CusExport from '@/components/VisualComponents/CusExport'
const allCols = [
  {
    label: '事件项',
    list: [
      { label: '车牌', prop: 'carNumber' },
      { label: '停车场', prop: 'parkPlaceName' },
      { label: '入场照片', prop: 'inPicUrlFile' },
      { label: '入口名称', prop: 'inGateName' },
      { label: '入场时间', prop: 'inTimestamp' },
      { label: '入口经度', prop: 'inLongitude' },
      { label: '入口纬度', prop: 'inLatitude' },
      { label: '出场照片', prop: 'outPicUrlFile' },
      { label: '出口名称', prop: 'outGateName' },
      { label: '出场时间', prop: 'outTimestamp' },
      { label: '出口经度', prop: 'outLongitude' },
      { label: '出口纬度', prop: 'outLatitude' }
    ]
  }
]
const ColorStr = {
  '0': '白色',
  '1': '黄色',
  '2': '蓝色',
  '3': '黑色',
  '4': '绿色',
  '99': '未知'
}
export default {
  components: {
    TemplateTable,
    Detail,
    DatePick,
    Pop,
    PageHeader,
    TotalData,
    TotalDataChartLine,
    CusExport
  },
  mixins: [autoTableHeight, BaseLoadMixins, fSupSearchMixins],
  data () {
    return {
      allCols: Object.freeze(allCols),
      searchLoading: false,
      exportShow: false, //导出状态
      pop: { show: false, title: '详情', width: '1224px' },
      row: {},
      table: {
        columns: [
          // {
          //   label: '停车场详址',
          //   prop: 'parkPlaceAddr',
          //   minWidth: '160',
          //   renderFun: function (row) {
          //     return row.parkPlaceAddr || row.parkPlaceAddr || '--'
          //   }
          // },
          {
            label: '纬度', prop: 'latitude', minWidth: '10.57%',
            renderFun: function (row) {
              if (row.inTimestamp) {
                return row.inLatitude || '--'
              } else if (row.outTimestamp) {
                return row.outLatitude || '--'
              } else {
                return '--'
              }
            }
          },
          {
            label: '入场时间',
            prop: 'inTimestamp',
            minWidth: '14.375%',
            renderFun: function (row) {
              const time = row.inTimestamp
              if (!time) return '--'
              return dayjs.filterString(time)
            }
          },
          {
            label: '出场时间',
            prop: 'outTimestamp',
            minWidth: '13.125%',
            renderFun: function (row) {
              const time = row.outTimestamp
              if (!time) return '--'
              return dayjs.filterString(time)
            }
          },
          {
            label: '停车场', prop: 'parkPlaceName', minWidth: '15.34%',
            renderFun: function (row) {
              return row.parkPlaceName || '--'
            }
          },
          {
            label: '车牌', prop: 'carNumber', minWidth: '10.57%',
            renderFun: function (row) {
              return row.carNumber || '--'
            }
          },
          {
            label: '经度', prop: 'longitude', minWidth: '10.57%',
            renderFun: function (row) {
              if (row.inTimestamp) {
                return row.inLongitude || '--'
              } else if (row.outTimestamp) {
                return row.outLongitude || '--'
              } else {
                return '--'
              }
            }
          },
          // { label: '纬度', prop: 'latitude', width: '120' }
          // {
          //   label: '时间',
          //   prop: 'time',
          //   minWidth: '210',
          //   renderFun: function (row) {
          //     const time = row.inTimestamp || row.outTimestamp
          //     if (!time) return '--'
          //     return dayjs.filterString(time)
          //   }
          // },
          // { label: '车牌号码', prop: 'carNumber', minWidth: '160' },
          // { label: '车辆类型', prop: 'carType', minWidth: '120' },
          // {
          //   label: '进出场',
          //   prop: 'type',
          //   minWidth: '120',
          //   renderFun: function (row) {
          //     return row.inTimestamp ? '进场' : row.outTimestamp ? '离场' : '--'
          //   }
          // },
          // {
          //   label: '设备名称',
          //   prop: 'inGateName',
          //   minWidth: '160',
          //   renderFun: function (row) {
          //     return row.inGateName || row.outGateName || '--'
          //   }
          // },
          // { label: '停车场名称', prop: 'parkPlaceName', minWidth: '160' }
        ],
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
          deviceName: '',
          startTime: '',
          endTime: '',
          carNumber: ''
        }
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
      this.table.params.carNumber = this.$route.query.car || this.$route.query.key
      this.table.params.startTime = this.$route.query.startTime || ''
      this.table.params.endTime = this.$route.query.endTime || ''
    }
    // else if(this.$route.query.device){
    //   this.table.params.deviceName = this.$route.query.device
    // }
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
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.table.params.pageNum = 1
        this.table.pageData.curPage = 1
        this.searchLoading = true
        this.getTable()
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

    hideDetail () {
      this.pop.show = false
    },
    showDetail () {
      this.pop.show = true
    },
    // 操作 查看档案操作
    getDetailsRow (row) {
      this.showDetail()

      row.indeviceMac = row.outTimestamp ? '' : row.deviceMac
      row.inTimestampstr = row.inTimestamp ? dayjs.filterString(parseInt(row.inTimestamp)) : ''
      row.outTimestampstr = this.row.outTimestamp
        ? dayjs.filterString(parseInt(row.outTimestamp))
        : ''
      this.row = row
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getTable()
    },
    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      queryTable_car(this.table.params)
        .then(res => {
          if (!res || !res.content) return
          this.table.tableData = res.content.map(_c => {
            _c.carColorStr = ColorStr[_c.carColor]
            return _c
          })
          this.table.pageData.total = res.totalSize
          if (this.$route.query.pathName) {
            sessionStorage.setItem('dataCenterSearchKey', this.table.params.carNumber || '')
            sessionStorage.setItem('dataCenterSearchStart', this.table.params.startTime || '')
            sessionStorage.setItem('dataCenterSearchEnd', this.table.params.endTime || '')
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
<style lang="less" scoped>
@import '../common-style';
::v-deep .el-input {
  width: 416px;
}
.header_img {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  margin-left: 12px;
}
</style>
