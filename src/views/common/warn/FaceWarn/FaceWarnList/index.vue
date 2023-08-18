<template>
  <div class="warnList">
    <header>
      <PageHeader>
        <template v-slot:headerTop>
          <list-title class="headerTop" title="防控列表"></list-title>

          <div @click="$router.push({ name: 'FaceWarn' })">
            <!-- <nav-title title="防控地图"></nav-title> -->
            <BackPrevious></BackPrevious>
            </div
        ></template>

        <!-- 查询条件 -->
        <!-- <template>
          <div class="searchCondition">
            <div class="searchCondition_searchKeys">
              <el-input
                v-model.trim="searchParams.personNameOrCertificateNumber"
                placeholder="请输入人员姓名/身份证号"
                clearable
              >
              </el-input>
            </div>

            <div class="CusFilter">
              <CusFilter :type="type" :categoryList="categoryList" ref="CusFilter"></CusFilter>
            </div>
          </div>
          <div>
            <el-button type="primary" class="btn" @click="searchEvent" :loading="searchLoading">{{
              searchLoading ? '搜索中' : '搜索'
            }}</el-button>
          </div>
        </template> -->
      </PageHeader>
    </header>

    <main class="table-main">
      <CusImagesPager
        :list="table.tableData"
        :columns="table.columns"
        :btnRender="btnRender"
        :pageData="{ curPage, pageSize: params.pageSize, total }"
        :isLoading="table.isLoading"
        :addIsShow="true"
        :itemSize="itemSize"
        :isFaceWarnList="true"
        :padding="'8px'"
        :emptyIsShow="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <template v-slot:beforeLi>
          <div class="addRulesBtn" @click="toNewFace" v-permission="'face_warn:add_edit_del'">
            <i class="el-icon-plus addBtn"></i>
          </div>
        </template>
        <template v-slot:CusImagesPager_title="slotProps">
          <CusTitle
            :title="slotProps.item.person ? slotProps.item.person.name : ''"
            :curStyle="{ 'margin-bottom': '0px' }"
          ></CusTitle>
        </template>
      </CusImagesPager>
    </main>
    <!--    <CusSuggest :cusSuggest="cusSuggest" @beforeClose="handleHideCusSuggest">-->
    <!--      <template>-->
    <!--        <div>确定要删除该条规则信息吗？</div>-->
    <!--      </template>-->
    <!--    </CusSuggest>-->
  </div>
</template>

<script>
import PageHeader from '@/components/BasicComponents/PageHeader'
// import DatePick from '@/views/common/data-center/components/DatePick'
// import CusFilter from '@/components/BasicComponents/CusFilter'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
// import CusSuggest from '@/components/BasicComponents/CusSuggest'

import { queryWarnRulePager, delWarnRuleById, radioDisturbing } from '@/api/warn'
import { mapState } from 'vuex'

const categoryList = [
  {
    label: '失联时间',
    prop: 'disconnection',
    list: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '24小时',
        value: '24'
      },
      {
        label: '48小时',
        value: '48'
      },
      {
        label: '72小时',
        value: '72'
      }
    ]
  },
  // {
  //   label: '失联状态',
  //   prop: 'disconnectionStatus',
  //   list: [
  //     {
  //       label: '全部 ',
  //       value: ''
  //     },
  //     {
  //       label: '在线',
  //       value: 'online'
  //     },
  //     {
  //       label: '失联',
  //       value: 'lose'
  //     }
  //   ]
  // },
  {
    label: '免打扰状态',
    prop: 'noDisturbingStatus',
    list: [
      {
        label: '默认',
        value: '0'
      },
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
        label: '24小时 ',
        value: '24'
      }
    ]
  }
]

const columns = [
  { prop: 'photo', type: 'img' },
  // { label: '人员姓名', prop: 'personName' },
  // { label: '身份证号', prop: 'certificateNumber' },
  // { label: '人员类型', prop: 'personTypeName' },
  { label: '追踪方式', prop: 'monitorMode' },
  { label: '失联时间', prop: 'disconnection' },
  { label: '发送人员', prop: 'receiverNameList' },
  { label: '数据类型', prop: 'dataTypeString' }
]


export default {
  components: {
    PageHeader,
    // CusFilter,
    CusImagesPager,
    // CusSuggest,
  },
  created () {
    this.getTable()
    this.table.columns = [...columns]
    // this.table.columns = [...columns, {
    //   label: '免打扰状态',
    //   prop: 'noDisturbingStatus',
    //   type: 'radio',
    //   handleChange: this.handleChange,
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
    //   ]
    // }]
  },
  data () {
    return {
      type: 'allSingle',
      searchParams: {
        pageNum: 1,
        pageSize: 7,
        // warningType: 'warningFace'
        // startTime: '',
        // endTime: '',
        personNameOrCertificateNumber: '',
        // noDisturbingStatus: '',
        // personType: '',
      },
      categoryList: Object.freeze(categoryList),
      searchLoading: false,
      table: {
        columns: [],
        tableData: [],
        // btnRender: [
        //   {
        //     label: '编辑规则',
        //     type: 'success',
        //     icon: 'icon-doc-pen',
        //     btnEvent: this.handleEditRule,
        //     alt: '编辑规则'
        //   },
        //   {
        //     label: '删除',
        //     type: 'rodeLine',
        //     icon: 'icon-drop',
        //     btnEvent: this.callEditPop,
        //     alt: '删除'
        //   }
        // ],
        // 加载条
        isLoading: false
      },
      params: {
        // deviceName: '',
        // placeName: '',
        placeOrDeviceName: '',
        pageNum: 1,
        pageSize: 7,
        startTime: '',
        endTime: ''
      },
      total: 0,
      curPage: 1,
      // cusSuggest: {
      //   show: false,
      //   width: '400px',
      //   top: '35vh',
      //   btn: [
      //     {
      //       text: '否',
      //       event: this.handleHideCusSuggest
      //     },
      //     {
      //       text: '是',
      //       type: 'button',
      //       loading: false,
      //       event: this.handleDelete
      //     }
      //   ]
      // },
      pageData: {},
      oldParams: {
        pageNum: 1,
        pageSize: 7,
        warningType: 'warningFace'
      },
      itemSize: '17.9em'
    }
  },
  computed: {
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    'btnRender' () {
      const btnRender = [
        {
          label: '编辑规则',
          type: 'success',
          icon: 'icon-doc-pen',
          btnEvent: this.handleEditRule,
          alt: '编辑规则',
          key: 'face_warn:add_edit_del'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-drop',
          btnEvent: this.callEditPop,
          alt: '删除',
          key: 'face_warn:add_edit_del'
        }
      ]
      return this.$backPermissionsArray(btnRender)
    }
  },
  methods: {
    handleChange (val, row) {
      const param = { personId: row.personList[0].personId, noDisturbingStatus: val, warningType: "warningFace" }
      radioDisturbing(param)
    },
    // 获取 表格数据
    getTable () {
      this.table.isLoading = true

      queryWarnRulePager(this.oldParams)
        .then(res => {
          // console.log(res);
          // console.log(window.location.origin);
          this.table.tableData = res.content.map(_c => {
            let tempArr = []
            if (_c.dataTypeList) {
              _c.dataTypeList.forEach(item => {
                this.dataTypeList.forEach(e => {
                  if (e.srcNameEn === item) {
                    tempArr.push(e.srcNameCn)
                  }
                })
              })
            }
            _c.dataTypeString = tempArr.join(';')
            // let nameList = []
            _c.monitorMode = _c.monitorMode === "realTime" ? '实时监控' : '最后位置'
            _c.status = _c.status === 'enable' ? '在线' : '失联'
            _c.receiverNameList = _c.receivers.map(ele => ele.receiverName).join('；')
            // _c.personName = _c.personList?.[0]?.personName || ''
            // _c.certificateNumber = _c.personList?.[0]?.certificateNumber || ''
            if (_c.receiverNameList == '') {
              _c.receiverNameList = '全部人员'
            }
            _c.photo = _c.attrList?.[0]?.attrValue || ''
            // _c.photo = _c.personList?.[0]?.imageUrl || ''
            // _c.personTypeName = _c.personList?.[0]?.personTypeName || ''

            // let sym = ','.indexOf(_c.personTypeName)
            // if (sym != -1) {
            //   _c.personTypeName.split(',').forEach(item => {
            //     if (item != '临时人员') {
            //       nameList.push(item)
            //     }
            //   })
            // }

            // _c.personTypeName = nameList.join(',')
            _c.personId = _c.personList?.[0]?.personId || ''
            _c.disconnection = _c.disconnection + '小时'
            if (_c.personList.length !== 0) {
              _c.noDisturbingStatus = _c.personList?.[0]?.noDisturbingStatus || ''
            }
            return _c
          })
          // console.log(this.table.tableData)
          // this.table.tableData = [...res.content]
          // this.table.pageData.total = res.totalSize
          this.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    },

    // 搜索 事件
    searchEvent () {
      this.$nextTick(() => {
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
        this.params.pageSize = 7

        this.oldParams = { ...this.params }
        this.oldParams.warningType = 'warningFace'
        if (this.searchParams.personNameOrCertificateNumber.length !== 0) {
          this.oldParams.searchKey = this.searchParams.personNameOrCertificateNumber
        }

        this.getTable(this.oldParams)
      })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.params.pageNum = val
      this.oldParams.pageNum = val

      this.getTable()
    },

    // 关闭提示
    // handleHideCusSuggest () {
    //   this.cusSuggest.show = false
    // },

    //跳转编辑页面
    handleEditRule (v) {
      this.$router.push({ name: 'newFaceWarn', query: v })
    },

    //删除规则
    // handleDelete () {
    //   delWarnRuleById(this.delRuleId).then(res => {
    //     this.cusSuggest.show = false
    //     this.$messageTip.success('删除成功！')
    //     this.getTable()
    //   })
    // },



    //唤起确认删除窗口xyhr
    callEditPop (v) {
      this.delRuleId = v.id
      // this.cusSuggest.show = true
      this.$policeComfirm('确定要删除该条规则信息吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delWarnRuleById(this.delRuleId).then(() => {
          this.$messageTip.success('删除成功！')
          this.getTable()
        })
      })
      // this.$confirm('确定要删除该条规则信息吗?', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   delWarnRuleById(this.delRuleId).then(() => {
      //     this.$messageTip.success('删除成功！')
      //     this.getTable()
      //   })
      // })
    },

    //跳转新增规则页面
    toNewFace () {
      this.$router.push({ name: 'newFaceWarn' })
    },
    // 开关事件
    tableRadioChange (rowData) {
      this.rowData = { ...rowData }
      radioDisturbing({
        personId: this.rowData.personId,
        noDisturbingStatus: this.rowData.noDisturbingStatus,
        warningType: 'warningFace'
      }).then(() => {
        this.loadTable(this.oldParams)
      })
    },


    /** 表格 - 搜索 - 校验开始结束时间 */
    // checkTime () {
    //   if (this.$refs.DatePick && this.$refs.DatePick.startTime) {
    //     this.params.startTime = this.$refs.DatePick.startTime
    //   }

    //   if (this.$refs.DatePick && this.$refs.DatePick.endTime) {
    //     this.params.endTime = this.$refs.DatePick.endTime
    //   }

    //   if (!this.params.startTime && this.params.end_time) {
    //     this.$messageTip.error('请输入开始时间！')
    //     return
    //   }

    //   if (this.params.startTime && !this.params.endTime) {
    //     this.$messageTip.error('请输入结束时间！')
    //     return
    //   }
    //   return true
    // }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  /deep/.CusImagesPager .CusImagesPager_item_main_info_item .label {
    width: 140px !important;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  /deep/.CusImagesPager .CusImagesPager_item_main_info_item .label {
    width: 100px !important;
  }
  /deep/.radioGroup{
    .radio{
      margin-top: 2px;
    }
  }
}
@media screen and (min-width: 1920px) {
  /deep/.CusImagesPager .CusImagesPager_item_main_info_item .label {
    width: 82px !important;
  }
  /deep/.radioGroup{
    width: 150px;
  }
  /deep/ .el-radio {
    margin-right: 0 !important;
  }
}

.warnList {
  background-color: var(--bg-color-3);
  padding-bottom:20px;
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

// .headerTop {
//   margin-bottom: 12px;
// }

.table-main {
  position: relative;
  // padding: 0px 16px 0 16px;
  box-sizing: border-box;
}
.addRulesBtn {
  position: relative;
  height: 100%;
  cursor: pointer;
}
.addBtn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  font-size: 40px;
}
/deep/.CusImagesPager {
  min-height: calc(100vh - 290px);
  li {
    min-height: 354px;
  }
  // .CusImagesPager_item_main_info_item {
  //   .label {
  //     width: 84px !important;
  //   }
  // }
}
</style>
