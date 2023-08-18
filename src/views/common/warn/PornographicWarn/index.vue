<template tag="not_change_rem">
  <div class="PornographicWarn">
    <header>
      <PageHeader>
        <!-- 查询条件 -->
        <template>
          <div class="searchCondition">
            <!-- 时间搜索控件 -->
            <div class="timeInput">
              <el-date-picker
                v-model="timestampList"
                type="monthrange"
                range-separator="~"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :editable='false'
                @change="handleChangeTime"
              >
              </el-date-picker>
            </div>
            <div class="searchCondition_searchKeys">
              <el-input
                v-model.trim="params.searchKey"
                placeholder="请输入人员姓名/证件号码"
                clearable
              >
              </el-input>
            </div>

            <div class="number-input">
              频次阈值：
              <div>
                <el-input placeholder="大于10属于高频" v-model.number="params.frequency">
                </el-input>
              </div>
            </div>
          </div>
          <!-- 搜索按钮 -->
          <div>
            <div class="btn el-button btn btn-search el-button--primary" @click="resetEvent">
              重置
            </div>

            <el-button type="primary" class="btn" @click="searchEvent">搜索</el-button>
          </div>
        </template>
      </PageHeader>
    </header>
    <main class="table-main">
      <div class="write_btn export_btn" v-permission="'pornographic_warn:export'">
        <el-button type="primary" class="btn" @click="exportTable"> 导出 </el-button>
      </div>

      <!-- ------------  表格嵌套表格 展开  ------------- -->
      <CollapseTable
        ref="tableRef"
        v-if="!searchLoading"
        :pageData.sync="collapse.pageData"
        :collapse.sync="collapse"
        :tableData.sync="collapse.tableData"
        :isLoading="searchLoading"
        @expand="expand"
      />

      <CusExport
        method="post"
        fileName="涉黄预警"
        url="/police/warning/pornographic/export"
        :exportShow.sync="exportShow"
        :allCols="allCols"
        :totalData="collapse.pageData.total"
        :params="{ ...oldParams }"
      ></CusExport>
    </main>

    <pop :pop.sync="detailPop" @beforeClose="hideDetailPop" @beforeOpen="showDetailPop">
      <Detail :dataObj="rowData" :labelList="labelList">
        <template v-slot:detailAside>
          <el-aside class="asideWidth not_change_rem">
            <ElImage
              :imgSet="{
                src: detailPop.imgUrl,
                width: 185,
                height: 246,
                errorSrc: errImg(),
                list: []
              }"
            ></ElImage>
          </el-aside>
        </template>
        <template slot="detailHeader" slot-scope="scope">
          <div class="detail-title">
            {{ scope.row.realName }}（{{ scope.row.age }}/{{ scope.row.sex }}/{{
              scope.row.nationRecon
            }}）
          </div>
        </template>
      </Detail>
    </pop>
  </div>
</template>

<script>
import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
import CusExport from '@/components/VisualComponents/CusExport'
import CollapseTable from '@/components/BasicComponents/CollapseTable'
import Detail from './Detail'
import dayjs from '@/utils/filters'
import { queryWarnPornographicPager, queryPornographicListByPersonId } from '@/api/warn'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
const labelList = [
  {
    icon: 'icon-card-0',
    label: '基本信息',
    children: [
      {
        prop: 'birthday',
        label: '出生日期'
      },
      {
        prop: 'idCardType',
        label: '证件类型'
      },
      {
        prop: 'cerNumber',
        label: '证件号码'
      },
      {
        prop: 'nation',
        label: '民族'
      },
      {
        prop: 'address',
        label: '户籍地址'
      }
    ]
  },
  {
    icon: 'icon-card-1',
    label: '入住信息',
    children: [
      {
        prop: 'hotelName',
        label: '旅店名称'
      },
      {
        prop: 'hotelSn',
        label: '旅店编号'
      },
      {
        prop: 'resiAddr',
        label: '旅店地址'
      },
      {
        prop: 'longitude',
        label: '旅店经度'
      },
      {
        prop: 'latitude',
        label: '旅店纬度'
      },
      {
        prop: 'travellerRegion',
        label: '旅店所属区域'
      },
      {
        prop: 'inRoomNumber',
        label: '入住房号'
      },
      {
        prop: 'inTime',
        label: '入住时间'
      },
      {
        prop: 'outTime',
        label: '退房时间'
      },
      {
        prop: 'livingDays',
        label: '居住天数'
      },
      {
        prop: 'carSn',
        label: '入住人车辆'
      }
    ]
  },
  {
    icon: 'icon-card-2',
    label: '消费信息',
    children: [
      {
        prop: 'creditCardType',
        label: '银行卡类型'
      },
      {
        prop: 'creditCardNumber',
        label: '银行卡号'
      }
    ]
  }
]
const allCols = [
  {
    label: '人员项',
    list: [
      { label: '姓名', prop: 'personName' },
      { label: '证件类型', prop: 'certificateType' },
      { label: '证件号码', prop: 'certificateNumber' },
      { label: '是否高频人员', prop: 'isHighFrequency' },
      { label: '入住频次', prop: 'checkInFrequency' },
      { label: '入住总数', prop: 'checkInTimes' },
      { label: '单日最高频次', prop: 'maxDailyFrequency' }
    ]
  },
  {
    label: '事件项',
    list: [
      { label: '酒店名称', prop: 'hotelName' },
      { label: ' 详细地址', prop: 'address' },
      { label: ' 房间号', prop: 'inRoomNumber' },
      { label: ' 居住天数', prop: 'livingDays' },
      { label: '入住时间', prop: 'inTime' },
      { label: '退房时间', prop: 'outTime' }
    ]
  }
]

const columns = [
  { type: 'btn' },
  { width: '100', type: 'expand' },
  { label: '序号', width: '70', prop: 'indexNo' },
  { label: '姓名', prop: 'personName', minWidth: '10%' },
  { label: '证件类型', prop: 'certificateType', minWidth: '10%' },
  { label: '证件号码', prop: 'certificateNumber', minWidth: '20%' },
  {
    label: '是否高频人员',
    prop: 'isHighFrequency',
    minWidth: '15%',
    type: 'status',
    statuList: [
      { status: false, color: '3BC022', text: '否' },
      { status: true, color: 'F63F70', text: '是' }
    ]
  },
  { label: '入住频次', prop: 'checkInFrequency', minWidth: '10%' },
  { label: '入住总数', prop: 'checkInTimes', minWidth: '10%' },
  { label: '单日最高频次', prop: 'maxDailyFrequency', minWidth: '15%' }
]

export default {
  components: {
    PageHeader,
    CollapseTable,
    CusExport,
    Pop,
    ElImage,
    Detail
  },
  data () {
    return {
      labelList: Object.freeze(labelList),
      pickerOptions: {
        shortcuts: [
          {
            text: '本月',
            onClick (picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '最近六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今年至今',
            onClick (picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      timestampList: [],
      detailPop: {
        show: false,
        imgUrl: '',
        title: '详情',
        width: '1190px',
        top: '180px'
      },
      exportShow: false,
      collapse: {
        deHeight: 340,
        tableData: [],
        columns: Object.freeze(columns),
        btnRender: [
          // {
          //   label: '同行关系',
          //   type: 'success',
          //   icon: 'icon-peer',
          //   btnEvent: this.navToPeerRelation,
          //   alt: '同行关系'
          // },
          {
            label: '轨迹',
            type: 'rodeLine',
            icon: 'icon-location',
            btnEvent: this.trackDetails,
            alt: '查看轨迹'
          }
        ],
        pageData: {
          total: 0,
          pageSize: 10,
          curPage: 1,
          event: this.handleCurrentChange
        },
        isLoading: true,
        child: {
          columns: Object.freeze([
            { type: 'btn' },
            { label: '酒店名称', prop: 'hotelName', minWidth: '60' },
            { label: '详细地址', prop: 'address', minWidth: '100' },
            { label: '房间号', prop: 'inRoomNumber', minWidth: '60' },
            { label: '居住天数', prop: 'livingDays', minWidth: '100' },
            { label: '入住时间', prop: 'inTime', minWidth: '100' },
            {
              label: '退房时间',
              prop: 'outTime',
              minWidth: '100',
              renderFun: function (row) {
                if (!row.outTime) return '--'
                return row.outTime
              }
            }
          ]),
          btnRender: [
            {
              label: '详情',
              type: 'success',
              icon: 'icon-check',
              btnEvent: this.getDetailsRow,
              alt: '查看档案'
            }
          ]
        }
      },
      tableData: [],
      curPage: 1,
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        searchKey: '',
        frequency: ''
      },
      searchLoading: false,
      oldParams: {},
      rowData: {}
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    })
  },
  created () {
    this.allCols = allCols
    if (document.body.clientWidth >= 1100 && document.body.clientWidth < 1500) {
      this.detailPop = {
        show: false,
        imgUrl: '',
        title: '详情',
        width: '990px',
        top: '180px'
      }
    }

  },
  mounted () {
    this.resetEvent()
  },

  methods: {
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    },
    // 查看详情
    getDetailsRow (index, row) {
      this.rowData = { ...row }
      this.detailPop.imgUrl = window.location.origin + '/' + this.rowData.headPic
      this.showDetailPop()
    },

    // navToPeerRelation(index, row) {
    //   console.log("🚀 ~ file: index.vue ~ line 380 ~ navToPeerRelation ~ row", row)
    //   this.$router.push({ name: 'PeerRelation', query: { id: row.id } })
    // },

    // 轨迹详情
    trackDetails (index, row) {
      console.log('🚀 ~ file: index.vue ~ line 386 ~ trackDetails ~ row', row)
      const { checkInFrequency, isHighFrequency, maxDailyFrequency } = row
      const person = JSON.stringify({ checkInFrequency, isHighFrequency, maxDailyFrequency })
      this.$router.push({
        name: 'HFTrack',
        query: {
          certificateNumber: row.certificateNumber,
          person
        }
      })
    },

    // 监听时间选择器
    handleChangeTime (val) {
      this.params.startTime = val[0]
      this.params.endTime = val[1]
    },

    // 隐藏详情弹窗
    hideDetailPop () {
      this.detailPop.show = false
    },

    // 显示详情弹窗
    showDetailPop () {
      this.detailPop.show = true
    },

    // 重置
    resetEvent () {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        searchKey: '',
        frequency: ''
      }
      this.params.endTime = dayjs.filterTimeToTimestampHS(new Date())
      this.params.startTime = dayjs.getSubtractTime({
        Format: 'Unix',
        unit: 'month',
        date: this.params.endTime,
        num: 1
      })
      this.timestampList = [this.params.startTime, this.params.endTime]

      this.curPage = 1

      this.oldParams = { ...this.params }
      this.loadTable(this.oldParams)
    },

    /** 外层 展示 事件 */
    expand (row) {
      // console.log(row)
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
      this.$set(this.collapse.tableData[index].params, 'pageNum', 1)
      this.$set(this.collapse.tableData[index].pageData, 'curPage', 1)
      this.$set(this.collapse.tableData[index].params, 'certificateNumber', row.certificateNumber)

      if (this.collapse.tableData[index].isOpen) {
        this.queryChildDevice(index)
      }
    },

    /** 通过 组id 获取 规则 */
    queryChildDevice (index) {
      this.$set(this.collapse.tableData[index], 'isLoading', true)
      queryPornographicListByPersonId({
        ...this.collapse.tableData[index].params
      })
        .then(res => {
          const list = res.content.map((_c, index) => {
            _c.id = index + '_' + _c.hotelName
            return _c
          })
          this.$set(this.collapse.tableData[index], 'children', list)
          this.$set(this.collapse.tableData[index].pageData, 'total', res.totalSize)
        })
        .finally(() => {
          this.$set(this.collapse.tableData[index], 'isLoading', false)
        })
    },

    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },

    // 关闭提示
    handleHideCusSuggest () {
      this.cusSuggest.show = false
      this.loadTable(this.oldParams)
    },

    // 分页表格
    handleCurrentChange (pageNum) {
      this.oldParams.pageNum = pageNum
      this.loadTable(this.oldParams)
    },

    /** 子 分页 事件 */
    innerCurrentChange (pageIndex, index) {
      this.$set(this.collapse.tableData[index].params, 'pageNum', pageIndex)
      this.queryChildDevice(index)
    },

    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        this.exportShow = true
      })
    },

    // 加载表格
    loadTable (params) {
      this.searchLoading = true
      queryWarnPornographicPager({ ...params })
        .then(res => {
          this.collapse.tableData = res.content.map((element, index) => {
            element.indexNo = index + 1 + (params.pageNum - 1) * params.pageSize

            element.pageData = {
              total: 0,
              pageSize: 5,
              curPage: 1,
              event: this.innerCurrentChange
            }
            element.params = {
              pageNum: 1,
              pageSize: 5,
              personId: element.personId
            }

            element.id = index + '_' + element.personId
            element.isOpen = false

            return element
          })
          this.collapse.pageData.total = res.totalSize
        })
        .finally(() => {
          this.searchLoading = false
        })
    },

    // 搜索 事件
    searchEvent () {
      this.curPage = 1
      this.params.pageNum = 1

      this.oldParams = { ...this.params }
      this.loadTable(this.oldParams)
    }
  }
}
</script>

<style lang="less" scoped>
.PornographicWarn {
  background-color: var(--bg-color-3);
  padding-bottom: 20px;
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
    .timeInput {
      width: 250px;
    }
    // .searchCondition_searchKeys {
    //   width: 240px;
    // }
  }
}

.table-main {
  padding: 12px 16px 0 16px;
  box-sizing: border-box;
}

.export_btn {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 12px;
}

.headerTop {
  margin-bottom: 12px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
.number-input {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.detail-title {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: bold;
  line-height: 21px;
  color: var(--base-text-color-1);
  letter-spacing: 2px;
}

.asideWidth.not_change_rem{
  width: 190px !important;
}
</style>
