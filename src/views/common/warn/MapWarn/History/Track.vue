<template>
  <div class="table-content-wrap my">
<!--    <div class='search_wrap'>
      <el-input
        v-model.trim="searchKey"
        @keyup.enter.native="searchClick"
        placeholder="请输入预警场所/场所地址"
        @clear="clearInput"
        clearable
      >
        <template slot='suffix'>
          <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchClick"></i>
        </template>
      </el-input>
      <DatePick
        :isShowTimeType="false"
        ref="DatePick"
        @getTimeSelect="getTimeSelect"
        @clearTime="clearTime"
      ></DatePick>
    </div>-->
    <template-table
      :tableData="table.tableData"
      v-if="isCreated"
      :columns="table.columns"
      :tableHeight="'calc(100% - 32px)'"

      :btnRender="table.btnRender"
      :pageData="table.pageData"
      :isLoading="table.isLoading"
      @handleCurrentChange="handleCurrentChange"
      :highLightRowIndex="activeRowIndex"
    ></template-table>
  </div>
</template>

<script>
import { queryWarnFeatureHistoryPager } from '@/api/warn'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
// import DatePick from '@/views/common/data-center/components/DatePick'
const columns = [
  {
    label: '数据来源',
    prop: 'dataSourceStr',
    minWidth: '15%'
  },
  { label: '序号', width: '100', type: 'index' },
  { label: '预警名称', prop: 'warningName', minWidth: '13%' },
  {
    label: '警报级别',
    prop: 'warningLevel',
    minWidth: '8%',
    type: 'status',
    statuList: [
      { status: 'EMPHASIS_LEVEL', color: 'F03F58', text: '重点防控' },
      { status: 'MEDIUM_LEVEL', color: 'D8B733', text: '中等防控' },
      { status: 'GENERAL_LEVEL', color: '4596E6', text: '一般防控' }
    ]
  },
  // { label: '人员姓名', prop: 'personName', minWidth: '10%' },
  { label: '姓名', prop: 'personName', minWidth: '10%' },
  { label: '预警时间', prop: 'triggerTime', minWidth: '15%' },
  // { label: '身份证号', prop: 'attrValue', minWidth: '210' },
  { label: '预警场所', prop: 'placeName', minWidth: '15%' },
  { label: '场所地址', prop: 'placeAddress', minWidth: '17%' },
  {
    label: '经纬度',
    prop: 'deviceLongitude',
    minWidth: '17%',
    renderFun (row) {
      if (!row.deviceLongitude && !row.deviceLatitude) return '--'
      return `${row.deviceLongitude}°E,${row.deviceLatitude}°N`
    }
  },
]

export default {
  components: {
    TemplateTable
    // DatePick
  },
  mixins: [autoTableHeight],
  data () {
    return {
      searchKey: '',
      startTime: '',
      endTime: '',
      subHeight: 280,
      isCreated: false,
      table: {
        tableData: [],
        columns: Object.freeze(columns),
        pageData: {
          pageSize: 10,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 10
        }
      },
      activeRowIndex:''
    }
  },
  created () {
    this.getList()
  },
  watch:{
    '$route.query.msgId' (){
      this.getList()
    }
  },
  methods: {
    getList () {
      this.table.isLoading = true
      queryWarnFeatureHistoryPager({
        ...this.table.params,
        warningType: 'warningGather',
        warningLevel:' GENERAL_LEVEL,MEDIUM_LEVEL,EMPHASIS_LEVEL'
      })
        .then(res => {
          if(this.$route.query.msgId){
            this.activeRowIndex = res.content.findIndex((item)=>{
              return item.messageId == this.$route.query.msgId
            })
            console.log(this.activeRowIndex);
          }
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
          this.isCreated = true
        })
    },
    searchClick () {},
    clearInput () {},
    // 为startTime和endTime赋值
    getTimeSelect (time) {
      this.startTime = time.startTime
      this.endTime = time.endTime
    },
    // 清空startTime和endTime
    clearTime () {
      this.startTime = ''
      this.endTime = ''
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getList()
    }
  }
}
</script>

<style lang='less' scoped>
.my /deep/.pagination {
  margin-top: 0 !important;
}
.search_wrap {
  display: flex;
  margin-top: 27px;
  margin-bottom: 16px;
  /deep/.el-input {
    width: 416px;
    margin-right: 12px;
    .el-input__inner {
      border: 1px solid #515C7C !important;
    }
    .icon-sousuo {
      font-size: 16px;
      color: #657494;
      line-height: 40px;
      cursor: pointer;
    }
  }
}
.table-content-wrap {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 16px;
  margin-top: 27px;
  /deep/.table-wrapper {
    //height: calc(100% - 56px);
    height: 100%;
  }
}
</style>
