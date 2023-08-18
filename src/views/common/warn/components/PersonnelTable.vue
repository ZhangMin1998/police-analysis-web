<template>
  <div class="PersonnelTable">
    <!-- 类型列表 -->
    <!-- <ul class="PersonnelTable_checks">
      <li v-for="item in checkList" :key="item.label" @click="handleClick(item)">
        <CusCheck :curItem="item"></CusCheck>
      </li>
    </ul> -->

    <!-- 搜索框 -->
    <div class="PersonnelTable_search">
      <el-input
        v-model="params.searchKey"
        placeholder="请输入姓名/证件号码"
        @keyup.enter.native="handleSearch"
      >
        <i slot="suffix" class="iconfont icon-sousuo" @click="handleSearch"></i>
      </el-input>
    </div>

    <div class="table-content-wrap anaTableN">
      <template-table
        ref="multipleTable"
        class="person_table"
        :tableData="tableData"
        :columns="columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :pageData="{ total, curPage, pageSize: params.pageSize, pagerCount: 5 }"
        :isLoading="tableLoading"
        @handleCurrentChange="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      ></template-table>
    </div>

    <div class="btns">
      <CusButton
        :btnList="[
          {
            text: '取消',
            event: this.handleClose
          },
          {
            text: '确定',
            type: 'button',
            loading: false,
            event: handleSubmit
          }
        ]"
      ></CusButton>
    </div>
  </div>
</template>

<script>
// import CusCheck from '@/components/BasicComponents/CusCheck'
import CusButton from '@/components/BasicComponents/CusButton'
import TemplateTable from '@/components/VisualComponents/Table'

import autoTableHeight from '@/mixins/autoTableHeight'

// import { queryAllPersonList } from '@/api/warn'
import { searchPersonFileByPage } from '@/api/allArchives'

const columns = [
  { label: '证件号码', prop: 'cerNumber', minWidth: '30%' },
  { width: '60', type: 'selection' },
  { label: '姓名', prop: 'name', minWidth: '20%' },
  { label: '证件类型', prop: 'cerTypeName', minWidth: '20%' },
]
Object.freeze(columns)
export default {
  name: 'PersonnelTable',
  components: {
    // CusCheck,
    TemplateTable,
    CusButton
  },
  mixins: [autoTableHeight],
  props: {
    checkedList: {
      type: Array
    },
    cusCheckList: {
      type: Array
    },
    tableAtrrs: {
      type: Object,
      default: () => {
        return {
          subHeight: 460,
          pageSize: 16
        }
      }
    }
  },
  data () {
    return {
      checkList: [
        // { color: '#D8B733', label: '拘留人员', isActive: true },
        // { color: '#F03F58', label: '吸毒人员', isActive: false },
        // { color: '#4596E6', label: '重点人员', isActive: false },
        { color: '#24e2bc', label: '人物档案', isActive: true }
      ],
      params: {
        searchKey: '',
        pageNum: 1,
        pageSize: 16,
      },
      curPage: 1,
      total: 0,
      columns: columns,
      tableLoading: false,
      tableData: [],
      rowNum: 18,
      subHeight: 460,
      oldParams: {},
      selectionList: [],
      selectRows: [],
      allData:[]
    }
  },
  computed: {
    tableHeight () {
      return this.$pxToRem(document.documentElement.clientHeight - 431)
    }
  },
  watch: {
    checkedList: {
      handler (newValue) {
        // console.log(newValue)
        if (newValue && newValue.length > 0) {
          this.selectionList = newValue
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // console.log(this.tableAtrrs)
    this.params.pageSize = this.tableAtrrs.pageSize
    this.subHeight = this.tableAtrrs.subHeight

    // this.params.personType = this.$store.state.Dict.personTypeList.find(
    //   _c => _c.label === '社会人员'
    // ).value
    this.oldParams = { ...this.params }
    this.loadTable(this.oldParams)
  },
  mounted () {
    if (this.cusCheckList) {
      this.checkList = [...this.cusCheckList]
    }
  },
  methods: {
    // 加载表格
    loadTable (params) {
      this.tableLoading = true
      // queryAllPersonList(params)
      searchPersonFileByPage(params)
        .then(res => {
          // console.log(res)
          if(res.content.length){
            res.content.forEach((item)=>{
              item.cerType = 'cer_number'
            })
          }
          this.allData = res.content
          this.total = res.totalSize
          // 前端分页
          this.tableData = this.allData.slice(
            (this.curPage - 1) * this.params.pageSize,
            this.curPage * this.params.pageSize
          )
          // 回显多选框
          if (this.selectionList.length) {
            const list = this.tableData.filter(item =>
              this.selectionList.some(ele => ele.cerNumber === item.cerNumber)
            )
            this.tableData.forEach((element, index) => {
              list.forEach(item => {
                if (element.cerNumber === item.cerNumber) {
                  this.$refs.multipleTable.defaltSelection(this.tableData[index], true)
                }
              })
            })
          }
          this.tableLoading = false
        })
        .finally(() => {
          // this.tableLoading = false
        })
    },

    // 提交
    handleSubmit () {
      // this.selectionList = this.delSelected()
      // console.log(this.selectionList)
      // console.log(this.selectRows)
      this.selectionList = [...this.selectRows]
      // this.selectionList = this.removeDuplication(this.selectionList)

      if (!this.selectionList.length) {
        this.$messageTip.error('至少选择一个人')
        return false
      }
      this.$emit('handleSubmit', this.selectionList)
    },

    removeDuplication (list) {
      let hash = {}
      return list.reduce((item, next) => {
        hash[next.personVid] ? '' : (hash[next.personVid] = true && item.push(next))
        return item
      }, []) //设置cur默认类型为数组，并且初始值为空的数组
    },

    handleClose () {
      this.$emit('handleClose')
    },

    // 搜索
    handleSearch () {
      this.curPage = 1
      this.params.pageNum = 1

      this.oldParams = { ...this.params }
      this.loadTable(this.oldParams)
    },

    // 单选框 点击
    // handleClick (item) {
    //   this.params.personType = this.$store.state.Dict.personTypeList.find(
    //     _c => _c.label === item.label
    //   ).value

    //   this.checkList.forEach(element => {
    //     element.isActive = false
    //     if (element.label === item.label) {
    //       element.isActive = true
    //     }
    //   })

    //   this.curPage = 1
    //   this.oldParams.pageNum = 1
    //   this.oldParams.personType = this.params.personType

    //   this.selectionList = [...this.selectionList, ...this.selectRows]
    //   this.selectionList = this.removeDuplication(this.selectionList)

    //   this.loadTable(this.oldParams)
    // },

    delSelected () {
      const idList = this.tableData
        .filter(_c => this.selectionList.map(v => v.personVid).includes(_c.personVid))
        ?.map(_c => _c.personVid)
      const delList = idList.filter(_c => !this.selectRows.map(v => v.personVid).includes(_c))
      return this.selectionList.filter(_c => !delList.includes(_c.personVid))
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.oldParams.pageNum = val

      // this.loadTable(this.oldParams)
      this.tableData = this.allData.slice(
        (val - 1) * this.params.pageSize,
        val * this.params.pageSize)
    },

    /** 表格多选 */
    handleSelectionChange (selected) {
      this.selectRows = [...selected]
      // this.selectRows = this.removeDuplication(this.selectRows)
      // console.log(this.selectRows)
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1920px) {
  .PersonnelTable_checks {
    > li {
      white-space: nowrap;
    }
  }
}
.PersonnelTable {
  // min-width: 460px;
  .PersonnelTable_checks {
    display: flex;
    > li {
      margin-right: 14px;
      // white-space: nowrap;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .PersonnelTable_search {
    padding-top: 20px;
    padding-bottom: 16px;
    width: 100%;
    .icon-sousuo {
      position: relative;
      top: 7px;
      font-size: 24px;
      color: var(--base-text-color-to-999999);
    }
    //img {
    //  width: 24px;
    //  height: 24px;
    //}
  }
}
/deep/.table-wrapper .el-table thead tr {
  height: 32px !important;
}
/deep/.person_table {
  .el-table {
    .el-table__header-wrapper .el-table__header .has-gutter tr .el-table__cell:first-child .cell {
      padding-left: 18px;
    }
    .el-table__body-wrapper .el-table__body tbody tr .el-table__cell:first-child .cell {
      padding-left: 18px;
    }
  }
}

.btns {
  padding-top: 10px;
}
/deep/.pagination {
  overflow-x: scroll !important;
}
/deep/.el-table {
  height: 450px !important;
}
/deep/.el-table__body-wrapper {
  height: 400px !important;
}
</style>
