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
      :dataType='"phone_sim"'
      :tipImgContent='"手机卡信息"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"phone_sim"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id="list" class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>手机卡信息</span>
      </div>
      <div class='wrap_table'>
        <TableGrid
          ref='myTable'
          :tableColumns="columns"
          :btnRender='btnRender'
          :inputPlaceholder='"请输入办理人姓名/证件号码/手机"'
          :exportFileName='"手机卡信息"'
          :defaultQuery="defaultQueryObj"
          :exportColumns='exportColumns'
          :url='"/phoneSim/list"'
          :exportUrl='"/police/warning/phoneSim/export"'
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
      <PhoneCardDetail :row='row'></PhoneCardDetail>
    </pop>
  </div>
</template>

<script>
import Pop from '@/components/VisualComponents/PopDialog'
import PhoneCardDetail from './components/phoneCardDetail'
import TableGrid from '@/components/VisualComponents/TableGrid'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import dayjs from '@/utils/filters'
import fSupSearchMixins from '../fSupSearchMixins'

export default {
  name: 'PhoneCard',
  components: {
    TotalData,
    TotalDataChartLine,
    TableGrid,
    Pop,
    PhoneCardDetail
  },
  mixins: [BaseLoadMixins, fSupSearchMixins],
  data () {
    const COLUMNS = [
      { label: '办理人姓名', prop: 'name', minWidth: '9.56%' },
      // { label: '办理人证件号码', prop: 'cerNumber', width: '240' },
      { label: '办理人手机', prop: 'phone', minWidth: '11.07%' },
      { label: '运营商', prop: 'operator', minWidth: '10.11%' },
      { label: 'IMSI', prop: 'imsi', minWidth: '14.2%' },
      { label: 'SIM', prop: 'sim', minWidth: '13.86%' },
      { label: '办理时间', prop: 'collectTime', minWidth: '16.6%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      },
      { label: '状态', prop: 'status', minWidth: '6.81%' }
    ]

    const EXPORT_COLUMNS = [
      {
        label: '事件项',
        list: [
          { label: '办理人姓名', prop: 'name' },
          { label: '状态', prop: 'status' },
          { label: '运营商', prop: 'operator' },
          { label: '办理人手机', prop: 'phone' },
          { label: 'SIM', prop: 'sim' },
          { label: 'IMSI', prop: 'imsi' },
          { label: '用户类型', prop: 'clientType' },
          { label: '办理业务', prop: 'businessType' },
          { label: '办理时间', prop: 'collectTime' },
          { label: '办理地点', prop: 'businessPlace' },
          { label: '漫游类型', prop: 'roamingType' },
          { label: '持有人姓名', prop: 'holderName' },
          { label: '持有人证件类型', prop: 'cerType' },
          { label: '持有人证件号码', prop: 'cerNumber' },
          { label: '居住地址', prop: 'liveAddress' },
          { label: '代理人姓名', prop: 'agentName' },
          { label: '代理人证件类型', prop: 'agentCerType' },
          { label: '代理人证件号码', prop: 'agentCerNumber' },
        ]
      }
    ]
    return {
      columns: COLUMNS, // 列表的列数据
      exportColumns: Object.freeze(EXPORT_COLUMNS), // 导出表格项的数据
      btnRender: [
        {
          label: '详情',
          icon: 'icon-xiangqing',
          btnEvent: this.getDetailData,
          alt: '查看详情'
        }
      ],
      pop: { show: false, title: '详情', width: '1024px'},
      row: {},
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
    if(this.$route.query.pathName){
      this.defaultQueryObj.key =  this.$route.query.phone || this.$route.query.name || this.$route.query.key
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

      this.row = JSON.parse(JSON.stringify(row))
      this.showDetail()
    }
  }
}
</script>

<style lang='less' scoped>
@import "../common-style";
</style>
<style lang='less' scoped>
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-left: 24px;
}
.state {
  color: #3AB293;
  &.yellow {
    color: #D4B021;
  }
  &.red {
    color: #D5565E;
  }
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
