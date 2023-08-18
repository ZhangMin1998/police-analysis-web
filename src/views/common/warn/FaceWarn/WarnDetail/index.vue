<template>
  <div class="AreaWarn_rules">
    <header>
      <PageHeader>
        <template v-slot:headerTop>
          <list-title class="headerTop" title="预警历史"></list-title>
      <!--          <div @click="$router.push({ name: 'FaceWarn' })">-->
<!--            <nav-title title="人脸防控"></nav-title>-->
<!--          </div>-->
        </template>

        <!-- 查询条件 -->
<!--        <template>-->
<!--          <div class="searchCondition">-->
<!--            &lt;!&ndash; 时间搜索控件 &ndash;&gt;-->
<!--            <DatePick ref="DatePick" :isShowTimeType="false" :type="'warningHistory'"></DatePick>-->
<!--            <div class="searchCondition_searchKeys">-->
<!--              <el-input-->
<!--                v-model.trim="params.personNameOrCertificateNumber"-->
<!--                placeholder="请输入人员姓名/身份证"-->
<!--                clearable-->
<!--              >-->
<!--              </el-input>-->
<!--            </div>-->

<!--            &lt;!&ndash; <div class="CusFilter">-->
<!--              <CusFilter :categoryList="categoryList" ref="CusFilter"></CusFilter>-->
<!--            </div> &ndash;&gt;-->
<!--          </div>-->
<!--          &lt;!&ndash; 搜索按钮 &ndash;&gt;-->
<!--          <div>-->
<!--            <div class="btn el-button btn btn-search el-button&#45;&#45;primary" @click="resetEvent">-->
<!--              重置-->
<!--            </div>-->

<!--            <el-button type="primary" class="btn" @click="searchEvent">搜索</el-button>-->
<!--          </div>-->
<!--        </template>-->
      </PageHeader>
    </header>
    <main class="table-main">
      <div class='search_wrap'>
        <div class='search_condition'>
          <el-input
            v-model.trim="params.personNameOrCertificateNumber"
            placeholder="请输入人员姓名/身份证"
            clearable
            @keyup.enter.native="searchEvent"
          >
            <template slot='suffix'>
              <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
            </template>
          </el-input>
          <DatePick ref="DatePick" :type="'warningHistory'" :isShowTimeType='false'></DatePick>
        </div>
        <div class='search_btn'>
          <el-button type="primary" @click="resetEvent">重置</el-button>
          <el-button type="primary" class="btn" @click="searchEvent">搜索</el-button>
          <div class='division'></div>
          <div class='blank_button' @click="exportTable">{{ '导出' }}</div>
        </div>
      </div>
      <div class='table_list'>
        <CollapseTable
          ref="tableRef"
          v-if="!searchLoading"
          :pageData.sync="collapse.pageData"
          :collapse.sync="collapse"
          :tableData.sync="collapse.tableData"
          :isLoading="searchLoading"
          expandName="showList"
          :fromWarn='true'
          @expand="expand"
          :expandKeyIds="expandKeyIds"
        />
      </div>
<!--      <TableGrid-->
<!--        :inputPlaceholder='"请输入预警名称/预警场所/场所地址"'-->
<!--        :tableColumns='tableColumns'-->
<!--        :exportFileName='"人脸防控"'-->
<!--        :exportColumns='allCols'-->
<!--        :url='"/message/face/getMessageList"'-->
<!--        :exportUrl='"/police/warning/message/face/export"'-->
<!--        :haveIndex='true'-->
<!--        :myPageSize='11'-->
<!--        @getSpecialParams='handleBeforeLoad'-->
<!--      ></TableGrid>-->
<!--      <div class="write_btn export_btn" v-permission="'face_warn:export'">-->
<!--        <el-button type="primary" class="btn" @click="exportTable"> 导出 </el-button>-->
<!--      </div>-->

      <!-- ------------  表格嵌套表格 展开  ------------- -->

      <CusExport
        method="post"
        fileName="人脸防控"
        url="/police/warning/message/face/export"
        :exportShow.sync="exportShow"
        :allCols="allCols"
        :totalData="collapse.pageData.total"
        :params="{ ...oldParams }"
      ></CusExport>
    </main>

    <!-- 点击预警历史-预警条件查看图片 -->
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
  </div>
</template>

<script>
import ElImage from '@/components/BasicComponents/ElImage'
import Pop from '@/components/BasicComponents/Dialog'
import PageHeader from '@/components/BasicComponents/PageHeader'
// import CusFilter from '@/components/BasicComponents/CusFilter'
import CusExport from '@/components/VisualComponents/CusExport'
import CollapseTable from '@/components/BasicComponents/CollapseTable'

import DatePick from '@/views/common/data-center/components/DatePick'
// import TableGrid from '@/components/VisualComponents/TableGrid'

import { queryFaceWarnHistory } from '@/api/warn'

const allCols = [
  {
    label: '人员项',
    list: [
      // { label: '人员姓名', prop: 'personName' },
      // { label: '人员类型', prop: 'personType' },
      // { label: '证件号', prop: 'certificateNumber' },
      // { label: '失联状态', prop: 'disconnectionStatus' },
      { label: '人脸图片', prop: 'attrValueFile' },
      { label: '最后出现场所', prop: 'lastAppearPlace' },
      { label: '最后出现时间', prop: 'lastAppearTime' }
    ]
  },
  {
    label: '事件项',
    list: [
      { label: '人员姓名', prop: 'personName' },
      { label: '人员类型', prop: 'personTypeName' },
      { label: '证件号', prop: 'certificateNumber' },
      { label: '发现时间', prop: 'triggerTime' },
      { label: '捕抓设备', prop: 'deviceName' },
      { label: '预警条件', prop: 'triggerFile' },
      { label: '设备经度', prop: 'deviceLongitude' },
      { label: '设备纬度', prop: 'deviceLatitude' },
      { label: '出现场所', prop: 'placeName' },
      { label: '场所地址', prop: 'placeAddress' },
      { label: '数据来源', prop: 'dataSourceStr' }
    ]
  }
]

const columns = [
  { width: '100', type: 'expand' },
  { label: '序号', width: '100', prop: 'indexNo' },
  { label: '人脸图片', prop: 'photo', type: 'img', minWidth: '20%' },
  // { label: '人员姓名', prop: 'personName', minWidth: '12%' },
  // { label: '人员类型', prop: 'personTypeName', minWidth: '15%' },
  // { label: '证件号', prop: 'certificateNumber', minWidth: '20%' },
  // {
  //   label: '失联状态',
  //   prop: 'disconnectionStatus',
  //   minWidth: '8%',
  //   type: 'status',
  //   statuList: [
  //     { status: 'online', color: '3BC022', text: '在线' },
  //     { status: 'lose', color: 'F63F70', text: '离线' }
  //   ]
  // },
  { label: '最后出现场所', prop: 'lastAppearPlace', minWidth: '20%' },
  { label: '最后出现时间', prop: 'lastAppearTime', minWidth: '20%' }
]

const categoryList = [
  // {
  //   label: '人员类型',
  //   prop: 'personType',
  //   list: []
  // },
  {
    label: '失联状态',
    prop: 'disconnectionStatus',
    list: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '在线',
        value: 'true'
      },
      {
        label: '离线',
        value: 'false'
      }
    ]
  }
]

// const TABLE_COLUMNS = [
//   { label: '防控名称', prop: 'photo', minWidth: '10%' },
//   { label: '上传图片', prop: 'photo', minWidth: '10%' },
//   { label: '预警图片', prop: 'photo', minWidth: '10%' },
//   { label: '预警时间', prop: 'photo', minWidth: '10%' },
//   { label: '预警场所', prop: 'photo', minWidth: '10%' },
//   { label: '场所地址', prop: 'photo', minWidth: '10%' },
//   { label: '经纬度', prop: 'photo', minWidth: '10%' },
//   { label: '数据来源', prop: 'photo', minWidth: '10%' }
// ]

export default {
  components: {
    PageHeader,
    // CusFilter,
    DatePick,
    CollapseTable,
    CusExport,
    Pop,
    ElImage,
    // TableGrid
  },
  data () {
    return {
      imgPop: {
        show: false,
        imgUrl: '',
        title: '图片',
        width: '600px',
        top: '180px'
      },
      exportShow: false,
      collapse: {
        deHeight: 'calc(100% - 32px)',
        tableData: [],
        columns: [],
        pageData: {
          total: 0,
          pageSize: 5,
          curPage: 1,
          event: this.handleCurrentChange
        },
        isLoading: true,
        child: {
          columns: Object.freeze([
            { label: '数据来源', prop: 'dataSourceStr', minWidth: '60' },
            { label: '人员姓名', prop: 'personName', minWidth: '60' },
            { label: '人员类型', prop: 'personTypeName', minWidth: '60' },
            { label: '证件号', prop: 'certificateNumber', minWidth: '60' },
            { label: '捕抓设备', prop: 'deviceName', minWidth: '60' },
            {
              label: '预警条件',
              prop: 'clickName',
              minWidth: '80',
              isClickProp: 'clickName',
              type: 'click',
              click: this.handleLookImg
            },
            // { label: '设备经度', prop: 'deviceLongitude', minWidth: '60' },
            // { label: '设备纬度', prop: 'deviceLatitude', minWidth: '60' },
            { label: '出现场所', prop: 'placeName', minWidth: '100' },
            { label: '场所地址', prop: 'placeAddress', minWidth: '100' },
            { label: '发现时间', prop: 'triggerTime', minWidth: '80' },
            {
              label: '经纬度',
              prop: 'deviceLongitude',
              minWidth: '120',
              renderFun (row) {
                if (!row.deviceLongitude && !row.deviceLatitude) return '--'
                return `${row.deviceLongitude}°E,${row.deviceLatitude}°N`
              }
            },
          ])
        }
      },
      categoryList: [],
      tableData: [],
      curPage: 1,
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 5,
        startTime: '',
        endTime: '',
        personNameOrCertificateNumber: '',
        // noDisturbingStatus: '',
        // personType: ''
      },
      searchLoading: false,
      oldParams: {},
      rowData: {},
      // tableColumns: Object.freeze(TABLE_COLUMNS)
      expandAllList: [],
      expandKeyIds: []
    }
  },
  created () {
    this.allCols = allCols
    this.categoryList = categoryList

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
      // {
      //   label: '免打扰状态',
      //   prop: 'noDisturbingStatus',
      //   width: '330',
      //   type: 'radio',
      //   list: [
      //     {
      //       label: '1小时',
      //       value: '1'
      //     },
      //     {
      //       label: '6小时',
      //       value: '6'
      //     },
      //     {
      //       label: '12小时',
      //       value: '12'
      //     },
      //     {
      //       label: '24小时',
      //       value: '24'
      //     },
      //     {
      //       label: '关闭',
      //       value: '0'
      //     }
      //   ],
      //   event: this.tableRadioChange
      // },
      ...columns
    ]
  },
  mounted () {
    this.oldParams = { ...this.params }
    // this.oldParams.personId = this.$route.query.personId
    this.loadTable(this.oldParams)
  },
  // watch: {
  //   '$route.query.msgId' () {
  //     this.expandKeyIds = []
  //     this.loadTable(this.oldParams)
  //   }
  // },
  methods: {
    handleBeforeLoad (req, callback) {
      req.warning = true
      callback(req)
    },
    hideImgPop () {
      this.imgPop.show = false
    },
    showImgPop () {
      this.imgPop.show = true
    },
    handleLookImg (row) {
      this.imgPop.imgUrl = window.location.origin + '/' + row.trigger
      // this.imgPop.imgUrl = 'http://192.168.1.182:9519' + '/' + row.imgUrl
      this.showImgPop()
    },
    resetEvent () {
      this.$nextTick(() => {
        this.$refs.DatePick.clearTime()
        this.curPage = 1
        this.params = {
          pageNum: 1,
          pageSize: 5,
          startTime: '',
          endTime: '',
          personNameOrCertificateNumber: '',
          // noDisturbingStatus: '',
          // personType: ''
        }
        this.oldParams = { ...this.params }
        this.loadTable(this.oldParams)
      })
    },
    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },
    /** 外层 展示 事件 */
    expand (row) {
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
      this.collapse.tableData[index].pageData = {
        total: this.collapse.tableData[index].list.length,
        pageSize: 5,
        curPage: 1,
        event: this.innerCurrentChange
      }
      let { pageSize, curPage } = this.collapse.tableData[index].pageData

      this.collapse.tableData[index].showList = this.collapse.tableData[index].list.slice((curPage - 1) * pageSize, curPage * pageSize)

    },

    // 开关事件
    // tableRadioChange (rowData) {
    //   this.rowData = { ...rowData }
    //   radioDisturbing({
    //     personId: this.rowData.personId,
    //     noDisturbingStatus: this.rowData.noDisturbingStatus,
    //     warningType: 'warningFace'
    //   }).then(() => {
    //     this.loadTable(this.oldParams)
    //   })
    // },

    // 关闭提示
    // handleHideCusSuggest () {
    //   this.cusSuggest.show = false
    //   this.loadTable(this.oldParams)
    // },

    // 分页表格
    handleCurrentChange (pageNum) {
      this.oldParams.pageNum = pageNum
      this.loadTable(this.oldParams)
    },

    /** 子 分页 事件 */
    innerCurrentChange (pageIndex, index) {
      let { pageSize } = this.collapse.tableData[index].pageData
      this.collapse.tableData[index].showList = this.collapse.tableData[index].list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
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
      queryFaceWarnHistory({ ...params }).then(res => {

        this.collapse.tableData = res.content.map((element, index) => {
          element.photo = window.location.origin + '/' + element.attrValue
          element.lastAppearPlace = element.list[0]?.placeName
          element.lastAppearTime = element.list[0]?.triggerTime
          element.list.forEach(item => {
            // if (this.$route.query.msgId == item.id) {
            //   item.highlight = true
            // }
            item.clickName = '图片'
          })
          element.showList = element.list
          element.indexNo = index + 1 + (params.pageNum - 1) * params.pageSize
          element.index = index

          element.pageData = {
            total: 0,
            pageSize: 5,
            curPage: 1,
            event: this.innerCurrentChange
          }
          // element.params = {
          //   pageNum: 1,
          //   pageSize: 5,
          //   mainId: element.mainId
          // }

          element.id = index + '_' + element.mainId
          element.isOpen = false

          return element
        })
        this.collapse.pageData.total = res.totalSize
      }).finally(() => {
        this.searchLoading = false
        // this.collapse.tableData.forEach((element, index) => {
        //   if (element.messageId == this.$route.query.msgId) {
        //     this.$nextTick(() => {
        //       let dom = document.querySelectorAll('.el-table__body tbody tr')[index]
        //       let clickdom = dom.querySelector('.el-table__cell .el-icon')
        //       clickdom.click()
        //     })
        //   }
        // })
      })
    },

    // 搜索 事件
    searchEvent () {
      this.$nextTick(() => {
        if (!this.checkTime()) return
        // this.$refs.CusFilter.isShowPanel = false

        // // 先清空
        // this.categoryList.forEach(element => {
        //   this.params[element.prop] = ''
        // })
        // // 赋值
        // this.$refs.CusFilter.checkedList.forEach(element => {
        //   this.params[element.prop] = element.value
        // })

        this.curPage = 1
        this.params.pageNum = 1

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
  height: 100%;
  background-color: var(--bg-color-3);
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
    // .searchCondition_searchKeys {
    //   width: 240px;
    // }

    // .CusFilter {
    //   width: calc(100vw - 1200px);
    // }
  }
}

.table-main {
  //padding: 12px 16px 0 16px;
  box-sizing: border-box;
  // height: calc(100vh - 260px);
  height: calc(100% - 60px);
  padding: 16px;
  margin-top: 1px;
  background: var(--bg-color-3);
  .search_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .search_condition {
      display: flex;
      align-items: center;
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
    .search_btn {
      display: flex;
      align-items: center;
      .division {
        width: 1px;
        height: 24px;
        background: var(--division);
        margin: 0 16px;
      }
    }
  }
}

.export_btn {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 12px;
}

//.headerTop {
//  margin-bottom: 12px;
//}
/deep/.PageHeader {
  margin: 0;
  .PageHeader_title {
    height: 56px;
  }
}
/deep/.list {
  background: transparent;
  height: 100%;
  .el-table__expanded-cell {
    background: transparent !important;
  }
}
.table_list {
  height: calc(100% - 56px);
}
/deep/.el-icon-circle-close {
  margin-top: 0 !important;
}
</style>
