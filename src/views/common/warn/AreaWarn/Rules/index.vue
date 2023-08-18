<template>
  <div class="AreaWarn_rules">
    <header>
      <PageHeader
        ><template v-slot:headerTop>
          <list-title class="headerTop" title="预警历史"></list-title>

          <div @click="$router.push({ name: 'AreaWarn' })">
            <!-- <nav-title title="区域防控"></nav-title> -->
            <BackPrevious></BackPrevious>
            </div
        ></template>

        <!-- 查询条件 -->
        <template>
          <div class="searchCondition">
            <!-- 时间搜索控件 -->
            <DatePick ref="DatePick" class="DatePickComponent" :type="'warningHistory'"></DatePick>
            <div class="searchCondition_searchKeys">
              <el-input
                v-model.trim="params.personNameOrCertificateNumber"
                placeholder="请输入人员姓名/身份证"
                clearable
              >
              </el-input>
            </div>

            <div class="CusFilter">
              <CusFilter :type="type" :categoryList="categoryList" ref="CusFilter"></CusFilter>
            </div>
          </div>
          <!-- 搜索按钮 -->
          <div class="btn-box">
            <div class="btn el-button btn btn-search el-button--primary" @click="resetEvent">
              重置
            </div>

            <el-button type="primary" class="btn" @click="searchEvent" :loading="searchLoading">{{
              searchLoading ? '搜索中' : '搜索'
            }}</el-button>
          </div>
        </template>
      </PageHeader>
    </header>
    <main class="table-main">
      <div class="write_btn export_btn" v-permission="'area_warn:export'">
        <el-button type="primary" class="btn" @click="exportTable"> 导出 </el-button>
      </div>

      <!-- ------------  表格嵌套表格 展开  ------------- -->
      <CollapseTable
        ref="tableRef"
        v-if="!searchLoading"
        :pageData.sync="collapse.pageData"
        :collapse.sync="collapse"
        expandName="showList"
        :tableData.sync="collapse.tableData"
        :isLoading="searchLoading"
        @expand="expand"
        :expandKeyIds="expandKeyIds"
      />

      <CusExport
        method="post"
        fileName="区域防控"
        url="/police/warning/message/export"
        :exportShow.sync="exportShow"
        :allCols="allCols"
        :totalData='collapse.pageData.total'
        :params="{ ...oldParams, warningType: 'warningFence' }"
      ></CusExport>

      <pop :pop.sync="imgPop" @beforeClose="hideImgPop" @beforeOpen="showImgPop">
        <div class="flex_center">
          <ElImage
            :imgSet="{
              src: imgPop.imgUrl,
              width: 350,
              height: 400,
              errorSrc: 'icon-morenHeader',
              list: []
            }"
          ></ElImage>
        </div>
      </pop>
    </main>
  </div>
</template>

<script>
import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
import CusFilter from '@/components/BasicComponents/CusFilter'
import CusExport from '@/components/VisualComponents/CusExport'
import CollapseTable from '@/components/BasicComponents/CollapseTable'

import DatePick from '@/views/common/data-center/components/DatePick'

import {
  queryWarnHistoryPager,
  queryMessageListByPersonId,
  radioDisturbing
} from '@/api/warn'

const allCols = [
  {
    label: '人员项',
    list: [
      { label: '人员姓名', prop: 'personName' },
      { label: '人员类型', prop: 'personTypeName' },
      { label: '证件号', prop: 'certificateNumber' },
      { label: '最后出现场所', prop: 'lastAppearPlace' },
      { label: '最后出现时间', prop: 'lastAppearTime' }
    ]
  },
  {
    label: '事件项',
    list: [
      { label: '发现时间', prop: 'triggerTime' },
      { label: '捕抓设备', prop: 'deviceName' },
      { label: '预警条件', prop: 'trigger' },
      { label: '防控级别', prop: 'fenceLevelName' },
      { label: '区域类型', prop: 'fenceTypeName' },
      { label: '设备经度', prop: 'deviceLongitude' },
      { label: '设备纬度', prop: 'deviceLatitude' },
      { label: '出现场所', prop: 'placeName' },
      { label: '场所详址', prop: 'placeAddress' }
    ]
  }
]
Object.freeze(allCols)

const columns = [
  { width: '100', type: 'expand' },
  { label: '序号', width: '70', prop: 'indexNo' },
  { label: '人员姓名', prop: 'personName', minWidth: '10%' },
  { label: '人员类型', prop: 'personTypeName', minWidth: '10%' },
  { label: '证件号', prop: 'certificateNumber', minWidth: '15%' },
  { label: '最后出现场所', prop: 'lastAppearPlace', minWidth: '20%' },
  { label: '最后出现时间', prop: 'lastAppearTime', minWidth: '20%' }
]

const categoryList = [
  {
    label: '人员类型',
    prop: 'personType',
    list: [
      {
        label: '全部',
        value: ''
      }
    ]
  },
  {
    label: '防区级别',
    prop: 'fenceLevel',
    list: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '重点防控',
        value: 'EMPHASIS_LEVEL'
      },
      {
        label: '中等防控',
        value: 'MEDIUM_LEVEL'
      },
      {
        label: '一般防控',
        value: 'GENERAL_LEVEL'
      }
    ]
  },

  {
    label: '区域类型',
    prop: 'fenceType',
    list: [
      {
        label: '全部',
        value: ''
      }
    ]
  }

  // {
  //   label: '失联状态',
  //   prop: 'disconnectionStatus',
  //   list: [
  //     {
  //       label: '全部',
  //       value: ''
  //     },
  //     {
  //       label: '在线',
  //       value: true
  //     },
  //     {
  //       label: '离线',
  //       value: false
  //     }
  //   ]
  // }
]

export default {
  components: {
    PageHeader,
    CusFilter,
    DatePick,
    CollapseTable,
    CusExport,
    Pop,
    ElImage
  },
  data () {
    return {
      type:"allSingle",
      imgPop: {
        show: false,
        imgUrl: '',
        title: '图片',
        width: '600px',
        top: '180px'
      },
      allCols: allCols,
      exportShow: false,
      collapse: {
        deHeight: 340,
        tableData: [],
        columns: [],
        pageData: {
          total: 0,
          pageSize: 10,
          curPage: 1,
          event: this.handleCurrentChange
        },
        isLoading: true,
        child: {
          columns: Object.freeze([
            { label: '发现时间', prop: 'triggerTime', minWidth: '100' },
            { label: '捕抓设备', prop: 'deviceName', minWidth: '60' },
            {
              label: '预警条件',
              prop: 'trigger',
              minWidth: '100',
              isClickProp: 'imgUrl',
              type: 'click',
              click: this.handleLookImg
            },
            {
              label: '防控级别',
              prop: 'fenceLevel',
              width: '150',
              type: 'status',
              statuList: [
                { status: 'EMPHASIS_LEVEL', color: 'F03F58', text: '重点防控' },
                { status: 'MEDIUM_LEVEL', color: 'D8B733', text: '中等防控' },
                { status: 'GENERAL_LEVEL', color: '4596E6', text: '一般防控' }
              ]
            },
            { label: '区域类型', prop: 'fenceTypeName', width: '150' },
            { label: '设备经度', prop: 'deviceLongitude', minWidth: '60' },
            { label: '设备纬度', prop: 'deviceLatitude', minWidth: '60' },
            { label: '出现场所', prop: 'placeName', minWidth: '100' },
            { label: '场所详址', prop: 'placeAddress', minWidth: '100' }
          ])
        }
      },
      categoryList: [],
      tableData: [],
      curPage: 1,
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        personNameOrCertificateNumber: '',
        noDisturbingStatus: '',
        personType: ''
      },
      searchLoading: false,
      oldParams: {},
      rowData: {},
      expandKeyIds: []
    }
  },
  created () {
    this.categoryList = categoryList

    const fenceTypeIndex = this.categoryList.findIndex(_c => _c.prop === 'fenceType')

    if (fenceTypeIndex !== -1) {
      this.categoryList[fenceTypeIndex].list = [
        {
          label: '全部',
          value: ''
        },
        ...this.$store.state.Dict.extrAreaTypeList
      ]
    }

    // 动态添加类型
    const index = this.categoryList.findIndex(_c => _c.prop === 'personType')
    if (index !== -1) {
      this.categoryList[index].list = [
        {
          label: '全部',
          value: ''
        },
        ...this.$store.state.Dict.personTypeList
      ]
    }

    this.collapse.columns = [
      {
        label: '免打扰状态',
        prop: 'noDisturbingStatus',
        width: '330',
        type: 'radio',
        list: [
          {
            label: '1小时',
            value: '1'
          },
          {
            label: '6小时',
            value: '6'
          },
          {
            label: '12小时',
            value: '12'
          },
          {
            label: '24小时',
            value: '24'
          },
          {
            label: '关闭',
            value: '0'
          }
        ],
        event: this.tableRadioChange
      },
      ...columns
    ]
  },
  mounted () {
    this.oldParams = { ...this.params }
    this.loadTable(this.oldParams)
  },
  watch: {
    '$route.query.msgId' () {
      this.expandKeyIds = []
      this.loadTable(this.oldParams)
    }
  },
  methods: {
    hideImgPop () {
      this.imgPop.show = false
    },
    showImgPop () {
      this.imgPop.show = true
    },
    handleLookImg (row) {
      this.imgPop.imgUrl = window.location.origin + '/' + row.imgUrl
      this.showImgPop()
      console.log(
        '🚀 ~ file: index.vue ~ line 350 ~ handleLookImg ~ this.imgPop.imgUrl',
        this.imgPop.imgUrl
      )
    },
    /** 外层 展示 事件 */
    expand (row) {
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
      this.$set(this.collapse.tableData[index].params, 'pageNum', 1)
      this.$set(this.collapse.tableData[index].pageData, 'curPage', 1)

      if (this.collapse.tableData[index].isOpen) {
        this.queryChildDevice(index)
      }
    },

    /** 通过 组id 获取 规则 */
    queryChildDevice (index) {
      this.$set(this.collapse.tableData[index], 'isLoading', true)
      queryMessageListByPersonId({
        ...this.collapse.tableData[index].params,
        warningType: 'warningFence'
      })
        .then(res => {
          const list = res.content.map(_c => {
            // _c.deviceTypeStr = this.deviceTypeObj[_c.deviceType]
            // _c.updateTimeStr = dayjs.filterSS(_c.updateTime)
            // _c.createTimeStr = dayjs.filterSS(_c.createTime)
            if (this.$route.query.msgId == _c.id) {
              _c.highlight = true
            }
            return _c
          })
          // this.$set(this.collapse.tableData[index], 'children', list)
          this.collapse.tableData[index].showList = list
          this.$set(this.collapse.tableData[index].pageData, 'total', res.totalSize)
        })
        .finally(() => {
          this.$set(this.collapse.tableData[index], 'isLoading', false)
        })
    },

    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },

    // 开关事件
    tableRadioChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.certificateNumber,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningFence'
      }).then(() => {
        this.loadTable(this.oldParams)
      })
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
        if (!this.checkTime()) return
        this.exportShow = true
      })
    },

    // 加载表格
    loadTable (params) {
      this.searchLoading = true
      queryWarnHistoryPager({ ...params, warningType: 'warningFence' })
        .then(res => {
          console.log(res.content);
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
          // console.log( this.collapse.tableData );
          this.collapse.pageData.total = res.totalSize
        })
        .finally(() => {
          this.searchLoading = false
          this.collapse.tableData.forEach((element, index) => {
            if (element.messageId == this.$route.query.msgId) {
              this.$nextTick(() => {
                let dom = document.querySelectorAll('.el-table__body tbody tr')[index]
                let clickdom = dom.querySelector('.el-table__cell .el-icon')
                console.log(clickdom);
                clickdom.click()
              })
              // this.expand(element)
              // this.expandKeyIds.push(element.id)
            }
          })
        })
    },

    // 搜索 事件
    searchEvent () {
      this.$nextTick(() => {
        if (!this.checkTime()) return
        this.$refs.CusFilter.isShowPanel = false

        // 先清空
        this.categoryList.forEach(element => {
          this.params[element.prop] = ''
        })
        // 赋值
        this.$refs.CusFilter.checkedList.forEach(element => {
          this.params[element.prop] = element.value
        })

        this.curPage = 1
        this.params.pageNum = 1

        this.oldParams = { ...this.params }
        this.loadTable(this.oldParams)
      })
    },
    resetEvent () {
      this.$nextTick(() => {
        this.$refs.DatePick.clearTime()
        this.$refs.CusFilter.checkedList = []
        this.curPage = 1
        this.params = {
          pageNum: 1,
          pageSize: 10,
          startTime: '',
          endTime: '',
          nameOrNumberMark: '',
          recordWarn: '',
          personnelType: '',
        }
        this.oldParams = { ...this.params }
        this.loadTable(this.oldParams)
      })
    },

    /** 表格 - 搜索 - 校验开始结束时间 */
    checkTime () {
      if (this.$refs.DatePick && this.$refs.DatePick.startTime) {
        this.params.startTime = this.$refs.DatePick.startTime
      }
      if (this.$refs.DatePick && this.$refs.DatePick.endTime) {
        this.params.endTime = this.$refs.DatePick.endTime
      }

      if (!this.params.startTime && this.params.end_time) {
        this.$messageTip.error('请输入开始时间！')
        return
      }

      if (this.params.startTime && !this.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return
      }

      return true
    }
  }
}
</script>

<style lang="less" scoped>
.AreaWarn_rules {
  background-color: var(--bg-color-3);
  .headerTop {
    margin-bottom: 12px;
  }
  .searchCondition {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    // padding-top: 12px;
    ::v-deep .DatePickComponent{
       .el-input__inner{
        height: 40px;
        // line-height: 1.2;
      }
    }
    > div {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
    // .searchCondition_searchKeys {
    //   width: 250px;
    // }
    // .CusFilter {
    //   width: calc(100vw - 1200px);
    // }
  }
  .table-main {
    padding: 12px 16px 0 16px;
    box-sizing: border-box;
    // height: calc(100vh - 340px);
    .export_btn {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 12px;
    }
  }
}
</style>
