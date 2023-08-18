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
      :dataType='"epidemic_register"'
      :tipImgContent='"防疫登记"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"epidemic_register"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id="list" class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>防疫登记</span>
      </div>
      <div class='wrap_table'>
        <TableGrid
          ref='myTable'
          :tableColumns="columns"
          :btnRender='btnRender'
          :inputPlaceholder='"请输入姓名/证件号码/手机/车牌"'
          :exportFileName='"防疫登记"'
          :defaultQuery="defaultQueryObj"
          :url='"/epidemicRegister/list"'
          :exportUrl='"/police/warning/epidemicRegister/export"'
          :exportColumns='exportColumns'
          @getSpecialParams='handleBeforeLoad'
          @getDataSuccess='getDataSuccess'
        >
         <template slot='headerLeft'>
           <!-- 提示语 -->
           <i class='iconfont icon-zhushi'></i>
           <div class="my_danger">仅展示1000条实时数据</div>
         </template>

        </TableGrid>
      </div>
    </div>

    <pop :pop.sync="pop" @beforeClose="hideDetail" @beforeOpen="showDetail" :dataCenterDetail='true'>
      <EpidemicRegisDetail :row='row'></EpidemicRegisDetail>
    </pop>
  </div>
</template>

<script>
import Pop from '@/components/VisualComponents/PopDialog'
import EpidemicRegisDetail from './components/epidemicRegisDetail'
import TableGrid from '@/components/VisualComponents/TableGrid'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import dayjs from '@/utils/filters'
import fSupSearchMixins from '../fSupSearchMixins'

export default {
  name: 'EpidemicRegister',
  components: {
    TotalData,
    TotalDataChartLine,
    TableGrid,
    Pop,
    EpidemicRegisDetail
  },
  mixins: [BaseLoadMixins, fSupSearchMixins],
  data () {
    const COLUMNS = [
      { label: '姓名', prop: 'name', minWidth: '7.27%' },
      { label: '性别', prop: 'gender', minWidth: '6.48%',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '证件号码', prop: 'cerNumber', minWidth: '12.9%' },
      { label: '手机', prop: 'phone', minWidth: '9.15%' },
      { label: '车牌', prop: 'carLicense', minWidth: '8.07%' },
      { label: '登记场所', prop: 'placeName', minWidth: '9.16%' },
      { label: '场所地址', prop: 'placeAddress', minWidth: '15.63%' },
      { label: '体温', prop: 'temperature', minWidth: '6.23%',
        renderFun: function (row) {
          if (!row.temperature) return '--'
          return row.temperature + '℃'
        }
      },
      { label: '登记时间', prop: 'collectTime', minWidth: '12.95%',
        renderFun: function (row) {
          if (!row.collectTime) {
            return '--'
          }
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      },
      { label: '状态', prop: 'passStatus', minWidth: '5.45%',
        renderFun: (row) => {
          if (!row.passStatus) return '--'
          return row.passStatus === 'in' ? '进入' : row.passStatus === 'out' ? '离开' : '--'
        }
      }
    ]

    const EXPORT_COLUMNS = [
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
          { label: '居住地址', prop: 'liveCommunity' },
          { label: '户籍地址', prop: 'address' },
          { label: '状态', prop: 'passStatus' },
          { label: '体温', prop: 'temperature' },
          { label: '车牌', prop: 'carLicense' },
          { label: '登记场所', prop: 'placeName' },
          { label: '场所类型', prop: 'placeType' },
          { label: '场所地址', prop: 'placeAddress' },
          { label: '登记时间', prop: 'collectTime' },
          { label: '邮编', prop: 'districtCode' },
          { label: '备注', prop: 'remark' },
          { label: '经度', prop: 'longitude' },
          { label: '纬度', prop: 'latitude' },
        ]
      }
    ]
    return {
      columns: COLUMNS, // 列表列数据
      exportColumns: Object.freeze(EXPORT_COLUMNS), // 导出列数据
      btnRender: [
        {
          label: '详情',
          icon: 'icon-xiangqing',
          btnEvent: this.getDetailData,
          alt: '查看详情'
        }
      ], // 操作按钮
      pop: { show: false, title: '详情', width: '1024px'},
      row: {} ,// 查看详情存放行的数据
      defaultQueryObj:{
        key:''
      }
    }
  },
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
  created () {
    if (this.$route.query.pathName) {
      this.defaultQueryObj.key =  this.$route.query.identity || this.$route.query.name || this.$route.query.key
    }
  },
  methods: {
    getDataSuccess (data, params) {
      if (this.$route.query.pathName && params) {
        sessionStorage.setItem('dataCenterSearchKey', params.key || '')
        sessionStorage.setItem('dataCenterSearchStart', params.startTime || '')
        sessionStorage.setItem('dataCenterSearchEnd', params.endTime || '')
      }
    },
    // 查询接口前对查询条件的一个添加
    handleBeforeLoad (req, callback) {
      req.warning = true
      callback(req)
    },
    showDetail () {
      this.pop.show = true
    },
    hideDetail () {
      this.pop.show = false
    },
    // 点击操作中详情图标
    getDetailData (row) {
      this.row = {}
      Object.keys(row).forEach(key => {
        if (key.includes('Time')) {
          row[key + 'Str'] = row[key] ? dayjs.filterString(parseInt(row[key])) : ''
        }
      })

      row.birthdayStr = row.birthday.replace(/-/g, '/')

      this.row = JSON.parse(JSON.stringify(row))
      this.showDetail()
    }
  }
}
</script>

<style lang='less' scoped>
@import "../common-style";
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-left: 24px;
}
.my_danger{
  display: flex;
  align-items: center;
  margin-left: 8px;
}
.wrap_table {
  height: 924px;
  padding: 0 8px;
}
</style>
