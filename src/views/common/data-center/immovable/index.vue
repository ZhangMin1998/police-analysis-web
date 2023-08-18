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
      :dataType='"assets_house"'
      :tipImgContent='"不动产"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"assets_house"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id="list" class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>不动产</span>
      </div>
      <div class='wrap_table'>
        <TableGrid
          ref='myTable'
          :tableColumns="columns"
          :btnRender='btnRender'
          :defaultQuery="defaultQueryObj"
          :inputPlaceholder='"请输入权利人/证件号码/不动产证号"'
          :exportFileName='"不动产"'
          :exportColumns='exportColumns'
          :url='"/assetsHouse/list"'
          :exportUrl='"/police/warning/assetsHouse/export"'
          @getSpecialParams='handleBeforeLoad'
          @getDataSuccess='getDataSuccess'
        >
         <template slot='headerLeft'>
           <!-- 提示语 -->
           <i class='iconfont icon-zhushi'></i>
           <div class="my_danger">仅展示1000条实时数据</div>
         </template>
          <template slot='state' slot-scope='{ row }'>
            <div
              class='state'
              :class='{
                "yellow": row.state === "2",
                "red": row.state === "3"
              }'
            >
              {{ row.state === '1' ? '存续' : row.state === '2' ? '抵押' : row.state === '3' ? '查封' : '--'}}
            </div>
          </template>
        </TableGrid>
      </div>
    </div>

    <pop :pop.sync="pop" @beforeClose="hideDetail" @beforeOpen="showDetail" :dataCenterDetail='true'>
      <ImmovableDetail :row='row'></ImmovableDetail>
    </pop>
  </div>
</template>

<script>
import Pop from '@/components/VisualComponents/PopDialog'
import ImmovableDetail from './components/immovableDetail'
import TableGrid from '@/components/VisualComponents/TableGrid'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'
import dayjs from '@/utils/filters'
import fSupSearchMixins from '../fSupSearchMixins'

export default {
  name: 'Immovable',
  components: {
    TotalData,
    TotalDataChartLine,
    TableGrid,
    Pop,
    ImmovableDetail
  },
  mixins: [BaseLoadMixins, fSupSearchMixins],
  data () {
    const COLUMNS = [
      { label: '权利人', prop: 'obligee', minWidth: '7.8%' },
      { label: '证件号码', prop: 'cerNumber', minWidth: '15.45%' },
      { label: '不动产证号', prop: 'assetsCode', minWidth: '15%' },
      { label: '坐落', prop: 'houseAddress', minWidth: '16.3%' },
      { label: '用途', prop: 'houseUsage', minWidth: '7%' },
      { label: '面积', prop: 'houseArea', minWidth: '9.71%',
        renderFun: function (row) {
          if (!row.houseArea) return '--'
          return row.houseArea
        }
      },
      { label: '登记时间', prop: 'collectTime', minWidth: '13.69%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      }
    ]

    const EXPORT_COLUMNS = [
      {
        label: '事件项',
        list: [
          { label: '权利人头像', prop: 'obligeePhotoFile' },
          { label: '权利人', prop: 'obligee' },
          { label: '不动产证号', prop: 'assetsCode' },
          { label: '证件号码', prop: 'cerNumber' },
          { label: '坐落', prop: 'houseAddress' },
          { label: '用途', prop: 'houseUsage' },
          { label: '面积', prop: 'houseArea' },
          { label: '受理编号', prop: 'acceptCode' },
          { label: '登记时间', prop: 'collectTime' },
          { label: '债权人头像', prop: 'mortgagePhotoFile' },
          { label: '债权人', prop: 'mortgage' },
          { label: '抵押起始日期', prop: 'mortgageStartTime' },
          { label: '抵押终止日期', prop: 'mortgageEndTime' },
          { label: '查封单位', prop: 'seizureUnit' },
          { label: '查封起始日期', prop: 'seizureStartTime' },
          { label: '查封终止日期', prop: 'seizureEndTime' }
        ]
      }
    ]
    return {
      columns: COLUMNS, // 表格的列数据
      exportColumns: Object.freeze(EXPORT_COLUMNS), // 导出项数据
      btnRender: [
        {
          label: '详情',
          icon: 'icon-xiangqing',
          btnEvent: this.getDetailData,
          alt: '查看详情'
        }
      ],
      pop: { show: false, title: '详情', width: '1214px'},
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
.state {
  color: #3AB293;
  &.yellow {
    color: #D4B021;
  }
  &.red {
    color: #D5565E;
  }
}
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-left: 24px;
}
.my_danger{
  display: flex;
  margin-left: 8px;
  align-items: center;
}
/deep/.data_center_detail {
  .el-dialog__body {
    padding: 12px 40px 40px;
  }
}
.wrap_table {
  height: 924px;
  padding: 0 8px;
}
</style>
