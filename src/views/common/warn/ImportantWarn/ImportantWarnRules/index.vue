<template>
  <div class="AreaWarn_rules">
    <header>
      <PageHeader
        ><template v-slot:headerTop>
          <list-title class="headerTop" title="预警规则"></list-title>

          <div @click="$router.push({ name: 'ImportantWarn' })">
            <!-- <nav-title title="重点防控"></nav-title> -->
            <BackPrevious></BackPrevious>
            </div
        ></template>

        <!-- 查询条件 -->
        <template>
          <div class="searchCondition">
            <div class="searchCondition_searchKeys">
              <el-input v-model.trim="params.ruleName" placeholder="请输入规则名称" clearable>
              </el-input>
            </div>

            <div class="CusFilter">
              <CusFilter :type="type" :categoryList="categoryList" ref="CusFilter"></CusFilter>
            </div>
          </div>
          <!-- 搜索按钮 -->
          <div>
            <el-button type="primary" class="btn" @click="searchEvent" :loading="searchLoading">{{
              searchLoading ? '搜索中' : '搜索'
            }}</el-button>
          </div>
        </template>
      </PageHeader>
    </header>
    <main class="table-main">
      <div class="export_btn" v-permission="'important_warn:add_edit_del'">
        <el-button type="primary" class="btn" @click="$router.push({ name: 'ImportantRuleForm' })"
          >新建</el-button
        >
      </div>
      <TemplateTable
        :tableData="tableData"
        :columns="columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :pageData="{ pageSize: params.pageSize, total, curPage }"
        :isLoading="searchLoading"
        :btnRender="btnRender"
        @handleCurrentChange="handleCurrentChange"
      ></TemplateTable>
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
import CusFilter from '@/components/BasicComponents/CusFilter'
// import CusSuggest from '@/components/BasicComponents/CusSuggest'
import TemplateTable from '@/components/VisualComponents/Table'
import { queryWarnRulePager, delWarnRuleById } from '@/api/warn'

import autoTableHeight from '@/mixins/autoTableHeight'
import { mapState } from 'vuex'

const monitorModeObj = {
  realTime: '实时追踪',
  lastTrack: '最后位置'
}

const columns = [
  // {
  //   label: '发送人员',
  //   prop: 'receivers',
  //   minWidth: '20%',
  //   renderFun: function (row) {
  //     return (
  //       row.receivers
  //         ?.map(_c => {
  //           _c.receiverName = _c.receiverName || '--'
  //           return _c.receiverId === 0 ? '全部' : _c.receiverName
  //         })
  //         ?.join('；') ?? '--'
  //     )
  //   }
  // },
  {
    label: '失联时间',
    prop: 'disconnection',
    minWidth: '10%',
    renderFun: function (row) {
      return row.disconnection ? row.disconnection + '小时' : '--'
    }
  },
  { label: '序号', width: '90', type: 'index' },
  { label: '规则名称', prop: 'warningName', minWidth: '10%' },
  {
    label: '追踪方式',
    prop: 'monitorMode',
    minWidth: '10%',
    renderFun: function (row) {
      if (!row || !row.monitorMode) return '--'
      return monitorModeObj[row.monitorMode]
    }
  },
  { label: '数据类型', prop: 'dataTypeString', minWidth: '20%' },
  // {
  //   label: '预警间隔',
  //   prop: 'messageFrequency',
  //   minWidth: '80',
  //   renderFun: function (row) {
  //     if (!row || !row.messageFrequency) return '--'
  //     if (row.messageFrequency >= 59) {
  //       row.messageFrequencyStr = row.messageFrequency / 60
  //     }
  //     return row.messageFrequencyStr ? row.messageFrequencyStr + '小时' : row.messageFrequency + '分钟'
  //   }
  // },
]

const categoryList = [
  // {
  //   label: '人员类型',
  //   prop: 'personType',
  //   list: []
  // },
  // {
  //   label: '预警间隔',
  //   prop: 'messageFrequency',
  //   list: [
  //     {
  //       label: '全部',
  //       value: ''
  //     },
  //     {
  //       label: '5分钟',
  //       value: '5'
  //     },
  //     {
  //       label: '15分钟',
  //       value: '15'
  //     },
  //     {
  //       label: '30分钟',
  //       value: '30'
  //     },
  //     {
  //       label: '1小时',
  //       value: '60'
  //     },
  //     {
  //       label: '12小时',
  //       value: '720'
  //     },
  //     {
  //       label: '24小时',
  //       value: '1440'
  //     }
  //   ]
  // },
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
  }
]


export default {
  components: {
    PageHeader,
    CusFilter,
    TemplateTable,
    // CusSuggest
  },
  mixins: [autoTableHeight],
  data () {
    return {
      type: 'allSingle',
      categoryList: [],
      subHeight: 350,
      columns: [],
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
      //       event: this.handleSubmit
      //     }
      //   ]
      // },
      tableData: [],
      curPage: 1,
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        ruleName: '',
        personType: ''
      },
      searchLoading: false,
      oldParams: {},
      rowData: {},
      // btnRender: [
      //   {
      //     label: '编辑',
      //     type: 'success',
      //     icon: 'icon-doc-pen',
      //     btnEvent: this.handleEdit,
      //     alt: '编辑'
      //   },
      //   {
      //     label: '删除',
      //     type: 'rodeLine',
      //     icon: 'icon-drop',
      //     btnEvent: this.handleDelete,
      //     alt: '删除'
      //   }
      // ]
    }
  },
  computed: {
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    'btnRender' () {
      const btnRender = [
        {
          label: '编辑',
          type: 'success',
          icon: 'icon-bianji',
          btnEvent: this.handleEdit,
          alt: '编辑',
          key: 'important_warn:add_edit_del'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-delete',
          btnEvent: this.handleDelete,
          alt: '删除',
          key: 'important_warn:add_edit_del'
        }
      ]
      return this.$backPermissionsArray(btnRender)
    },
  },
  created () {
    this.categoryList = [...categoryList]

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

    this.columns = columns
  },
  mounted () {
    this.oldParams = { ...this.params }
    this.loadTable(this.oldParams)
  },

  methods: {
    handleEdit (row) {
      if (!row.id) {
        this.$messageTip.error('此规则未存在！')
        return false
      }
      this.$router.push({ name: 'ImportantRuleForm', query: { id: row.id } })
    },

    handleDelete (row) {
      this.rowData = { ...row }
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delWarnRuleById(this.rowData.id).then(() => {
          this.$messageTip.success('删除成功！')
          // this.cusSuggest.show = false
          this.loadTable(this.oldParams)
        })
      })
      // this.$confirm('确定要删除该条规则信息吗?', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   delWarnRuleById(this.rowData.id).then(() => {
      //     this.$messageTip.success('删除成功！')
      //     // this.cusSuggest.show = false
      //     this.loadTable(this.oldParams)
      //   })
      // })
      // this.cusSuggest.show = true
    },
    // 删除确定
    // handleSubmit() {
    //   delWarnRuleById(this.rowData.id).then(res => {
    //     this.$messageTip.success('删除成功！')
    //     this.cusSuggest.show = false
    //     this.loadTable(this.oldParams)
    //   })
    // },

    // 关闭提示
    // handleHideCusSuggest() {
    //   this.cusSuggest.show = false
    // },

    // 分页表格
    handleCurrentChange (pageNum) {
      this.oldParams.pageNum = pageNum
      this.loadTable(this.oldParams)
    },

    // 加载表格
    loadTable (params) {
      this.searchLoading = true
      queryWarnRulePager({ ...params, warningType: 'warningPerson' })
        .then(res => {
          res.content.forEach(item => {
            let tempArr = []
            if (item.dataTypeList) {
              item.dataTypeList.forEach(i => {
                this.dataTypeList.forEach(e => {
                  if (e.srcNameEn === i) {
                    tempArr.push(e.srcNameCn)
                  }
                })
              })
            }
            item.dataTypeString = tempArr.join(';')
          })
          this.tableData = [...res.content]
          this.total = res.totalSize
        })
        .finally(() => {
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

        this.oldParams = { ...this.params }
        this.loadTable(this.oldParams)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.AreaWarn_rules {
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
    .searchCondition_searchKeys {
      width: 240px;
    }

    .CusFilter {
      width: calc(100vw - 1150px);
    }
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
</style>
