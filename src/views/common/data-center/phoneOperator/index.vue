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
      v-if='haveHeader'
      class="data"
      v-show='!loading'
      :showType="'text'"
      :dataType='"phone_operator"'
      :tipImgContent='"运营商业务"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-if='haveHeader'
      v-show='!loading'
      :dataType='"phone_operator"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id="list" class='wrap-list' v-show='!loading'>
      <div class='title' v-if='haveHeader'>
        <span>数据列表 -</span>
        <span>运营商业务</span>
      </div>
      <div>
        <header v-if='haveHeader'>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs">
              <!-- 搜索表单 -->
              <div class='search_input'>
                <el-input
                  v-model.trim="params.key"
                  placeholder="请输入姓名/证件号码/手机"
                  @keyup.enter.native="searchEvent"
                  clearable
                >
                  <template slot='suffix'>
                    <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                  </template>
                </el-input>
              </div>
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
           <!-- 提示语 -->
              <i class='iconfont icon-zhushi'></i>
              <div class="my_danger">仅展示1000条实时数据</div>
            </div>

            <!-- 搜索按钮 -->
            <div class='opt_btn'>
              <el-button type="primary" class="btn" v-debounce="searchEvent">{{'搜索'}}</el-button>

              <div class='division'></div>
              <div class='blank_button' :loading="exportLoading" @click="exportTable">
                {{ '导出' }}
              </div>
            </div>
          </PageHeader>
        </header>

        <main class="table-main">
          <CusImagesPager
            :list="table.tableData"
            :columns="table.columns"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :padding="'16px'"
            :haveTitle='false'
            @handleCurrentChange="handleCurrentChange"
          >
            <div class='card_btn' slot='cardBtn' slot-scope='{ item }'>
              <i class='iconfont icon-xiangqing' :title='"查看详情"' @click='showDetailDialog(item)'></i>
            </div>
          </CusImagesPager>
        </main>
      </div>
    </div>
    <pop :pop.sync="pop" @beforeClose="hideDetail" @beforeOpen="showDetail" :dataCenterDetail='true'>
      <PhoneOperatorDetail :row='row'></PhoneOperatorDetail>
    </pop>
<!--    导出-->
    <CusExport
      method="post"
      fileName="运营商业务"
      url="/police/warning/phoneOperator/export"
      :exportShow.sync="exportLoading"
      :allCols="allCols"
      :totalData='table.pageData.total'
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import BaseLoadMixins from '../baseLoadMixins'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import PageHeader from '@/components/BasicComponents/PageHeader'
import DatePick from '@/views/common/data-center/components/DatePick'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import dayjs from '@/utils/filters'
import { getPhoneOperatorData } from '@/api/dataCenter'
import PhoneOperatorDetail from './components/phoneOperatorDetail'
import Pop from '@/components/VisualComponents/PopDialog'
import fSupSearchMixins from '../fSupSearchMixins'
import CusExport from '@/components/VisualComponents/CusExport'

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '头像', prop: 'photoFile' },
      { label: '姓名', prop: 'name' },
      { label: '性别', prop: 'gender' },
      { label: '民族', prop: 'nation' },
      { label: '出生日期', prop: 'birthday' },
      { label: '证件类型', prop: 'cerType' },
      { label: '证件号码', prop: 'cerNumber' },
      { label: '手机', prop: 'phone' },
      { label: '户籍地址', prop: 'address' },
      { label: '运营商', prop: 'operator' },
      { label: '营业厅类型', prop: 'placeType' },
      { label: '营业厅名称', prop: 'placeName' },
      { label: '营业厅地址', prop: 'placeAddress' },
      { label: '签名', prop: 'signConfirmFile' },
      { label: '签署日期', prop: 'signDate' },
      { label: '办理时间', prop: 'collectTime' },
      { label: '备注', prop: 'remark' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' }
    ]
  }
]
export default {
  name: 'PhoneOperator',
  components: {
    TotalData,
    TotalDataChartLine,
    PageHeader,
    DatePick,
    CusImagesPager,
    PhoneOperatorDetail,
    Pop,
    CusExport
  },
  mixins: [BaseLoadMixins, fSupSearchMixins],
  props: {
    haveHeader: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      allCols: Object.freeze(allCols),
      params: {
        pageNum: 1,
        pageSize: 12,
        startTime: '',
        endTime: '',
        key: ''
      },
      oldParams: {},
      exportLoading: false,
      pop: { show: false, title: '详情', width: '1024px'},
      row: {},
      table: {
        columns: [
          { label: '照片', prop: 'photo', type: 'img' },
          { label: '姓名', prop: 'name' },
          { label: '手机', prop: 'phone' },
          { label: '证件号码', prop: 'cerNumber' },
          { label: '运营商', prop: 'operator'},
          { label: '营业厅名称', prop: 'placeName' },
          { label: '办理时间', prop: 'collectTimeStr' }
        ],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        // 加载条
        // isLoading: true
        isLoading: false
      },
      searchLoading: false
    }
  },
  created () {
    if (this.$route.query.pathName) {
      this.params.key = this.$route.query.name || this.$route.query.identity || this.$route.query.key
      this.params.startTime = this.$route.query.startTime || ''
      this.params.endTime = this.$route.query.endTime || ''
    }
    this.oldParams = { ...this.params }
    this.getTable()
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
    },
    haveHeader: {
      handler (newVal) {
        if (!newVal) {
          this.changeTotalDataLoad(false)
          this.changeChartLineLoad(false)
        }
      },
      immediate: true
    }
  },
  methods: {
    hideDetail () {
      this.pop.show = false
    },
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        this.exportLoading = true
      })
    },
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.params.pageNum = 1
        this.table.pageData.curPage = 1
        this.searchLoading = true

        this.oldParams = { ...this.params }
        this.getTable()
      })
    },
    getTable () {
      this.table.isLoading = true
      getPhoneOperatorData(this.oldParams)
        .then(res => {
          this.table.tableData = res.content
          this.table.tableData.forEach(row => {
            Object.keys(row).forEach(key => {
              if (key.includes('Time') || key.includes('Date')) {
                row[key + 'Str'] = row[key] ? dayjs.filterString(parseInt(row[key])) : ''
              }
            })
            // row.operator = row.operator === 'CMCC' ? '移动' : row.operator === 'CUCC' ? '联通' : row.operator === 'CTCC' ? '电信' : '--'
          })
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
      this.params.pageNum = val
      this.oldParams.pageNum = val
      this.getTable()
    },
    showDetail () {
      this.pop.show = true
    },
    showDetailDialog (row) {
      row.birthdayStr = row.birthday.replace(/-/g, '/')
      this.row = JSON.parse(JSON.stringify(row))
      this.showDetail()
    }
  }
}
</script>

<style lang='less' scoped>
.my_danger{
  display: flex;
  align-items: center;
}
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color);
  margin-left: 12px;
  margin-right: 8px;
}
.table-searchs {
  display: flex;
  align-items: center;
  > div {
    margin-right: 12px;
  }
  // .search_input {
  //   width: 416px;
  // }
   @media (min-width: 967px) and (max-width: 1210px) {
    .search_input {
      width: 246px;
    }
  }
  @media (min-width: 1210px) and (max-width: 1467px) {
    .search_input {
      width: 316px;
    }
  }
  @media (min-width: 1467px) {
    .search_input {
      width: 416px;
    }
  }
}
.table-main {
  //padding: 0px 16px 0 16px;
  padding: 0 8px;
  box-sizing: border-box;
}
/deep/.CusImagesPager_item_main {
  .el-image {
    width: 133px !important;
    height: 167px !important;
    img {
      width: 133px !important;
      height: 167px !important;
    }
  }
}
/deep/.CusImagesPager_item_main_info_item {
  .label {
    width: 84px !important;
  }
  .item-value {
    width: calc(100% - 84px) !important;
  }
}
/deep/.CusImagesPager_item {
  position: relative;
}
.card_btn {
  position: absolute;
  top: 24px;
  right: 16px;
  i {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    cursor: pointer;
  }
}
.wrap-list {
  margin-top: 24px;
  position: relative;
  padding: 16px 16px 24px;
  background: var(--bg-color-2);
  min-height: 60px;
  .title {
    margin-bottom: 24px;
    font-size: 16px;
    font-weight: bold;
    color: var(--base-text-color-to-999999);
    span:nth-child(2) {
      margin-left: 8px;
      font-weight: 400;
    }
  }
}
/deep/.PageHeader {
  margin: 0 8px;
}
.division {
  width: 1px;
  height: 24px;
  background: var(--division);
  margin: 0 16px;
}
.opt_btn {
  display: flex;
  align-items: center;
}
/deep/.CusImagesPager {
  min-height: 694px;
  .CusImagesPager-ul {
    margin: 0;
    .CusImagesPager_item {
      background: var(--bg-color-3) !important;
    }
  }
  .CusImagesPager_item_main_info_item {
    line-height: 21px;
  }
}
@media only screen and (max-width: 1646px) {
  /deep/.CusImagesPager_item_main_info_item {
    .item_label {
      width: 72px !important;
    }
    .item_label_value {
      width: calc(100% - 72px) !important;
    }
  }
}
/deep/.el-input--suffix {
  .el-input__inner {
    padding-left: 12px;
    padding-right: 32px;
    border-radius: 2px;
    border-color: var(--border-color-input) !important;
    &::placeholder {
      color: var(--input-placehold-color);
      font-size: 16px;
    }
    &:hover {
      border-color: #3D4C75 !important;
    }
  }
  .el-input__suffix {
    right: 12px;
    .icon-sousuo {
      font-size: 16px;
      color: var(--input-placehold-color);
      line-height: 40px;
      cursor: pointer;
    }
  }
}
/deep/.PageHeader .el-input .el-icon-circle-close {
  width: 16px;
  position: absolute;
  right: 18px;
  top: 1px;
  color: var(--input-placehold-color) !important;
}
/deep/.PageHeader .el-icon-circle-close:hover {
  color: var(--active-color) !important;
}
</style>
