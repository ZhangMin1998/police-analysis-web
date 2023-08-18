<template>
  <div
    id='wrap'
    class='wrap'
    v-loading="loading"
    element-loading-background="#21283E"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      class="data"
      v-show='!loading'
      :showType="'text'"
      :dataType='"police_antiepidemic_type"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-show='!loading'
      :dataType='"police_antiepidemic_type"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div class='wrap-list' v-show='!loading'>
      <div class='title'>
        <span>数据列表 -</span>
        <span>防疫数据</span>
      </div>
      <div>
        <header>
          <PageHeader>
            <!-- 查询条件 -->
            <template>
              <div class="searchCondition">
                <div class="searchCondition_searchKeys">
                  <el-input
                    v-model.trim="table.params.searchKey"
                    @keyup.enter.native="searchEvent"
                    placeholder="请选择姓名"
                    clearable
                    suffix-icon="el-icon-search"
                  ></el-input>
                </div>
                <!-- 时间搜索控件 -->
                <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
<!--                <div class="CusFilter">-->
<!--                  <CusFilter-->
<!--                    ref="CusFilter"-->
<!--                    :type="type"-->
<!--                    :categoryList="categoryList"-->
<!--                    :cusStyle="{ top: '65px' }"-->
<!--                  ></CusFilter>-->
<!--                </div>-->
              </div>
              <!-- 搜索按钮 -->
              <div>
<!--                <div class="btn el-button btn btn-search el-button&#45;&#45;primary" v-debounce="resetEvent">-->
<!--                  重置-->
<!--                </div>-->

                <el-button type="primary" class="btn" v-debounce="searchEvent">{{'搜索'}}</el-button>
              </div>
            </template>
          </PageHeader>
        </header>

        <main class="table-main">
          <template-table
            :tableData="table.tableData"
            :columns="table.columns"
            :tableHeight="((table.pageData.pageSize + 1) * 48) + 1"
            :rowHeight="48"
            :btnRender="table.btnRender"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :header-row-style="{ height: $pxToRem(48) }"
            :header-cell-style="{
              'background-color': 'rgba(255, 255, 255, .04) !important',
              color: '#8799BF',
              'font-size': $pxToRem(16),
              'font-weight': '400'
            }"
            :newRowColor='true'
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </main>
      </div>
    </div>

  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import TemplateTable from '@/components/VisualComponents/Table'
import PageHeader from '@/components/BasicComponents/PageHeader'
import DatePick from '@/views/common/data-center/components/DatePick'
// import CusFilter from '@/components/BasicComponents/CusFilter'
import { sexOption } from '@/views/common/all-archives/components/dynamic-form/form-data'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '../baseLoadMixins'

import { antiepidemicData } from '@/api/dataCenter'

const columns = [
  { label: '创建时间', prop: 'captureTime', minWidth: '13.06%' },
  { label: '姓名', prop: 'name', minWidth: '9.1%' },
  { label: '性别', prop: 'sex', minWidth: '8.07%',
    renderFun: function (row) {
      return row.sex || '--'
    }
  },
  // { label: '场所', prop: 'sex', width: '120' },
  // { label: '设备', prop: 'sex', width: '120' },
  { label: '证件类型', prop: 'certificationType', minWidth: '11.02%' },
  { label: '证件号码', prop: 'certificationCode', minWidth: '16.76%' },
  {
    label: '籍贯',
    prop: 'houseAddr',
    minWidth: '8.3%',
    renderFun: function (row) {
      return row.houseAddr || '--'
    }
  },
  { label: '手机', prop: 'phone', minWidth: '11.36%' }
]

const categoryList = [
  {
    label: '性别',
    prop: 'sex',
    list: [
      {
        label: '全部',
        value: '',
      },
      ...sexOption
    ]
  },
  {
    label: '证件类型',
    prop: 'certificateType',
    list: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '身份证',
        value: 'attr_identity_card_type'
      },
      {
        label: '护照',
        value: 'attr_passport_type'
      },
      {
        label: '港澳通行证',
        value: 'attr_hk_permit_type'
      },
      {
        label: '其他',
        value: 'other'
      }
    ]
  }
]
export default {
  components: {
    TemplateTable,
    // Detail,
    // Pop,
    PageHeader,
    DatePick,
    // CusFilter,
    TotalData,
    TotalDataChartLine
  },
  mixins: [autoTableHeight, BaseLoadMixins],
  data () {
    return {
      type: 'allSingle',
      // subHeight: 290,
      searchLoading: false,
      table: {
        columns: Object.freeze(columns),
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 15,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 15,
          idNum: '',
          searchKey: '',
          certificateType: '',
          startTime: '',
          endTime: '',
          sex: ''
        }
      },
      detailData: null, //弹窗内容
      fieldList: null,
      oldParams: {
        pageNum: 1,
        pageSize: 15,
        idNum: '',
        searchKey: '',
        certificateType: '',
        startTime: '',
        endTime: '',
        sex: ''
      },
      categoryList: Object.freeze(categoryList)
    }
  },
  created () {
    this.getTable()
  },

  methods: {
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.checkTime()) return
        // this.$refs.CusFilter.isShowPanel = false
        this.table.params.pageNum = 1
        this.table.pageData.curPage = 1
        this.searchLoading = true
        // 先清空
        categoryList.forEach(element => {
          this.table.params[element.prop] = ''
        })
        // 赋值
        // this.$refs.CusFilter.checkedList.forEach(element => {
        //   this.table.params[element.prop] = element.value
        // })
        this.oldParams = JSON.parse(JSON.stringify(this.table.params))
        this.getTable()
      })
    },

    resetEvent () {
      this.$nextTick(() => {
        // this.$refs.CusFilter.isShowPanel = false
        this.$refs.DatePick.clearTime()
        // this.$refs.CusFilter.checkedList = []
        this.curPage = 1
        this.table.params = {
          pageNum: 1,
          pageSize: 15,
          idNum: '',
          searchKey: '',
          certificateType: '',
          startTime: '',
          endTime: '',
          sex: ''
        }
        this.oldParams = { ...this.table.params }
        this.getTable()
      })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.oldParams.pageNum = val
      this.getTable()
    },

    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      antiepidemicData(this.oldParams)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    },

    //时间选择
    checkTime () {
      if (this.$refs.DatePick && this.$refs.DatePick.startTime) {
        this.table.params.startTime = this.$refs.DatePick.pick.startTime
      }
      if (this.$refs.DatePick && this.$refs.DatePick.endTime) {
        this.table.params.endTime = this.$refs.DatePick.pick.endTime
      }

      if (!this.table.params.startTime && this.table.params.endTime) {
        this.$messageTip.error('请输入开始时间！')
        return
      }

      if (this.table.params.startTime && !this.table.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return
      }

      return true
    }
  }
}
</script>

<style scoped lang="less">
@import '../common-style';
</style>
<style lang="less" scoped>
.searchCondition {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  // padding-top: 12px;
  > div {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }

  .CusFilter {
    width: calc(100vw - 1235px);
  }
}
::v-deep .el-input {
  width: 416px;
}
</style>
