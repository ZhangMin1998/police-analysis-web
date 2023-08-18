<template>
<div
  class='wrap'
  v-p-loading="loading"
  :element-loading-background="'--bg-color-3'"
  element-loading-text="数据正在加载中"
  element-loading-spinner="el-icon-loading"
>
  <TotalComponent
    v-show='!loading'
    @changeTotalDataLoad='changeTotalDataLoad'
  ></TotalComponent>

    <TotalDataChartLine
      v-show="!loading"
      :dataType="'epidemic_nucleate'"
      :haveOpt="false"
      :wrapTitle="'新增趋势'"
      :isShowToday="true"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <AddInfo v-show="!loading"></AddInfo>

    <div id="list" class="wrap-list" v-show="!loading">
      <div class="title">
        <span>数据列表 -</span>
        <span>核酸记录</span>
      </div>

      <div class='wrap_table'>
        <TableGrid
          ref="myTable"
          :tableColumns="columns"
          :btnRender="btnRender"
          :inputPlaceholder="'请输入姓名/证件号码/手机'"
          :exportFileName="'核酸记录'"
          :exportColumns="exportColumns"
          :defaultQuery="defaultQueryObj"
          :url="'/epidemicNucleate/list'"
          :exportUrl="'/police/warning/epidemicNucleate/export'"
          @getSpecialParams="handleBeforeLoad"
          @getDataSuccess="getDataSuccess"
        >
          <template slot="headerLeft">
            <!-- 提示语 -->
            <el-popover placement="top-start" width="200" trigger="hover" :content="'仅展示1000条实时数据'" :disabled="showTipInfo">
              <i slot="reference" class='iconfont icon-zhushi'></i>
            </el-popover>
            <div class="my_danger" v-if='showTipInfo'>仅展示1000条实时数据</div>
            <!--        过滤项-->
            <div class="filter">
              <newFilter
                class="newFilter"
                ref="newFilter"
                v-if="showFilter"
                :radio="false"
                categoryName="过滤项"
                @startFilter="startFilter"
                :categoryList="categoryList"
                key="1"
              >
              </newFilter>
            </div>
          </template>

          <!--      来自风险区-->
          <template slot="isFromEpidemic" slot-scope="{ row }">
            <div
              :class="[
                'risk',
                row.isFromEpidemic === 'true' || row.isFromEpidemic === true ? 'risk_red' : ''
              ]"
            >
              {{
                row.isFromEpidemic === 'true' || row.isFromEpidemic === true
                  ? '是'
                  : row.isFromEpidemic === 'false' || row.isFromEpidemic === false
                  ? '否'
                  : '--'
              }}
            </div>
          </template>

          <!--      本地管控区-->
          <template slot="isControl" slot-scope="{ row }">
            <div
              :class="[
                'risk',
                row.isControl === 'true' || row.isControl === true ? 'risk_red' : ''
              ]"
            >
              {{
                row.isControl === 'true' || row.isControl === true
                  ? '是'
                  : row.isControl === 'false' || row.isControl === false
                  ? '否'
                  : '--'
              }}
            </div>
          </template>

          <!--      检测结果-->
          <template slot="result" slot-scope="{ row }">
            <div
              :class="[
                'result',
                row.result === 'positive'
                  ? 'result_red'
                  : row.result === 'negative'
                  ? 'result_green'
                  : row.result === 'testing'
                  ? 'result_blue'
                  : ''
              ]"
            >
              {{
                row.result === 'positive'
                  ? '阳性'
                  : row.result === 'negative'
                  ? '阴性'
                  : row.result === 'testing'
                  ? '检测中'
                  : '--'
              }}
            </div>
          </template>
        </TableGrid>
      </div>
    </div>

    <pop
      :pop.sync="pop"
      @beforeClose="hideDetail"
      @beforeOpen="showDetail"
      :dataCenterDetail="true"
    >
      <!-- 碰撞详情 -->
      <NucleicAcidDetail :row="row"></NucleicAcidDetail>
    </pop>
  </div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
import newFilter from '@/components/BasicComponents/FilterItem'
import NucleicAcidDetail from './components/detail/index'
import Pop from '@/components/VisualComponents/PopDialog'
import TotalComponent from './components/totalComponent'
import AddInfo from './components/addInfo'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import dayjs from '@/utils/filters'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'

export default {
  name: 'NucleicAcidRecord',
  mixins: [BaseLoadMixins, fSupSearchMixins],
  components: {
    TableGrid,
    newFilter,
    Pop,
    NucleicAcidDetail,
    TotalComponent,
    TotalDataChartLine,
    AddInfo
  },
  data () {
    const COLUMNS = [
      { label: '姓名', prop: 'name', minWidth: '7.73%' },
      { label: '性别', prop: 'gender', minWidth: '6.02%',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '证件号码', prop: 'cerNumber', minWidth: '13.81%' },
      { label: '手机', prop: 'phone', minWidth: '9.6%' },
      { label: '来自风险区', prop: 'isFromEpidemic', minWidth: '10.57%', haveSlot: true },
      { label: '本地管控区', prop: 'isControl', minWidth: '8.79%', haveSlot: true },
      { label: '采样场所', prop: 'placeName', minWidth: '14.8%' },
      { label: '检测时间', prop: 'testTime', minWidth: '14.03%',
        renderFun (row) {
          if (!row.testTime) return '--'
          row.testTime = parseInt(row.testTime)
          return dayjs.filterString(row.testTime)
        }
      },
      { label: '检测结果', prop: 'result', minWidth: '7.84%', haveSlot: true }
    ]
    const EXPORT_COLUMNS = [
      {
        label: '事件项',
        list: [
          { label: '姓名', prop: 'name' },
          { label: '性别', prop: 'gender' },
          { label: '出生日期', prop: 'birthday' },
          { label: '证件类型', prop: 'cerType' },
          { label: '证件号码', prop: 'cerNumber' },
          { label: '手机', prop: 'phone' },
          { label: '居住地址', prop: 'liveAddress' },
          { label: '户籍地址', prop: 'address' },
          { label: '来自风险区', prop: 'isFromEpidemic' },
          { label: '始发地', prop: 'srcAddress' },
          { label: '目的地', prop: 'dstAddress' },
          { label: '抵达时间', prop: 'arrivalTime' },
          { label: '人员分类', prop: 'personType' },
          { label: '工作城市', prop: 'unitAreaName' },
          { label: '工作单位', prop: 'unitName' },
          { label: '本地管控区', prop: 'isControl' },
          { label: '检测结果', prop: 'result' },
          { label: '采样时间', prop: 'collectTime' },
          { label: '采样场所', prop: 'placeName' },
          { label: '采样窗口', prop: 'sampleWindow' },
          { label: '检测时间', prop: 'testTime' },
          { label: '检测场所', prop: 'testPlaceName' },
          { label: '首次登记时间', prop: 'registerTime' },
          { label: '数据来源', prop: 'dataSource' },
          { label: '标本类型', prop: 'sampleType' },
          { label: '试剂编码', prop: 'reagentCode' },
          { label: '状态', prop: 'status' },
          { label: '备注', prop: 'remark' }
        ]
      }
    ]
    const FILTER_COLUMNS = [
      {
        label: '来自风险区',
        list: [
          { isActive: false, label: '是', value: true },
          { isActive: false, label: '否', value: false }
        ],
        isRadio: true,
        prop: 'isFromEpidemic'
      },
      {
        label: '本地管控区',
        list: [
          { isActive: false, label: '是', value: true },
          { isActive: false, label: '否', value: false }
        ],
        isRadio: true,
        prop: 'isControl'
      },
      {
        label: '检测结果',
        list: [
          { isActive: false, label: '阳性', value: 'positive' },
          { isActive: false, label: '阴性', value: 'negative' },
          { isActive: false, label: '检测中', value: 'testing' }
        ],
        isRadio: true,
        prop: 'result'
      }
    ]
    return {
      columns: COLUMNS, // 表格的列数据
      exportColumns: Object.freeze(EXPORT_COLUMNS), // 导出的项的数据
      showFilter: true, // 过滤项下拉框是否展示
      categoryList: FILTER_COLUMNS, // 过滤项的数据
      btnRender: [
        {
          label: '详情',
          icon: 'icon-xiangqing',
          btnEvent: this.getDetailData,
          alt: '查看详情'
        }
      ],
      isFromEpidemic: '', // 请求接口参数来自风险区
      isControl: '', // 请求接口参数本地管控区
      result: '', // 请求接口参数检测结果
      pop: { show: false, title: '详情', width: '1024px' },
      row: {},
      defaultQueryObj: {
        key: ''
      },
      showTipInfo: true
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
      this.defaultQueryObj.key = this.$route.query.identity || this.$route.query.name || this.$route.query.key
    }
  },
  mounted () {
    const EL_WIDTH = document.documentElement.clientWidth
    if (EL_WIDTH && EL_WIDTH <= 1460) {
      this.showTipInfo = false
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
      req.params.isFromEpidemic = this.isFromEpidemic
      req.params.isControl = this.isControl
      req.params.testResult = this.result
      callback(req)
    },
    // 点击过滤按钮
    startFilter (item) {
      this.isFromEpidemic = ''
      this.isControl = ''
      this.result = ''
      let arr = ['isFromEpidemic', 'isControl', 'result']
      arr.forEach(option => {
        let index = item.findIndex(opt => opt.prop + '' === option)
        if (index !== -1) {
          this[option] = item[index].value
        }
      })
    },
    showDetail () {
      this.pop.show = true
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
    },
    hideDetail () {
      this.pop.show = false
    },
  }
}
</script>

<style scoped lang="less">
@import '../common-style';
</style>
<style lang='less' scoped>
.risk {
  &.risk_red {
    color: @font-color-4;
  }
}
.result {
  color: var(--base-text-color-1);
  &.result_red {
    color: @font-color-4;
  }
  &.result_green {
    color: #0CBF7E;
  }
  &.result_blue {
    color: #27a0fc;
  }
}
.newFilter {
  margin-left: 24px;
}
/deep/.w_table {
  position: relative;
  .w_table_grid_header .header_left .el-input {
    width: 325px;
  }
  .newFilter_main {
    margin-left: 24px;
  }
  .newFilter_mode {
    top: 64px !important;
    padding: 32px 36px;
    .label_list_item {
      font-size: 16px;
      margin-bottom: 24px;
      &.label_list_item:last-child {
        margin-bottom: 0;
      }
      .label {
        width: 96px;
        margin-right: 40px;
      }
      .value {
        color: var(--base-text-color-1);
        .value_item {
          min-width: 70px;
          margin-right: 8px;
          &.isActive {
            color: var(--active-color);
          }
        }
      }
    }
  }
}
.icon-zhushi {
  font-size: 16px;
  color: var(--active-color) !important;
  margin-left: 24px;
}
/deep/.total-chart-wrap {
  padding: 0;
  .title {
    color: var(--base-text-color-to-999999);
  }
}
/deep/.header_left {
  align-items: center;
}
.my_danger {
  display: flex;
  margin-left: 8px;
  align-items: center;
}
.wrap_table {
  height: 924px;
  padding: 0 8px;
}
.filter {
  display: flex;
  align-items: center;
}
</style>
