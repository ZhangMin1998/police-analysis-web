<template>
  <div class="list_pages">
    <CollapseTable
      ref="tableRef"
      :pageData.sync="collapse.pageData"
      :collapse.sync="collapse"
      expandName="showList"
      :tableData.sync="collapse.tableData"
      :isLoading="collapse.isLoading"
      :fromWarn="true"
      @expand="expand"
    />
  </div>
</template>

<script>
import CollapseTable from '@/components/BasicComponents/CollapseTable'
const cls = [
  {
    label: '关联度（权重）', minWidth: '10.64%', prop: 'percent',
    renderFun: function (row) {
      return row.percent ? row.percent + '%' : '--'
    }
  },
  { width: '100', type: 'expand' },
  { label: '序号', width: '90px', type: 'index' },
  { label: '数值', minWidth: '13.3%', prop: 'attr' },
]
const childcls = [
  { label: '经纬度', minWidth: '9.57%', prop: 'LongitudeAndLatitude' },
  { label: '序号', width: '90px', type: 'index' },
  { label: '时间', minWidth: '10.11%', prop: 'time' },
  { label: '地址', minWidth: '13.3%', prop: 'title' },
]
export default {
  props: {
    tableList: {
      type: Array
    }
  },
  components: {
    CollapseTable
  },
  watch: {
    tableList: {
      handler (val) {
        console.log(val)
        let { curPage, pageSize } = this.collapse.pageData
        this.collapse.tableData = val.slice((curPage - 1) * pageSize, curPage * pageSize)
        this.collapse.pageData.total = val.length
      }
    }
  },
  data () {
    return {
      collapse: {
        deHeight: 'calc(100vh - 264px)',
        tableData: [],
        columns: cls,
        pageData: {
          total: 0,
          pageSize: 10,
          curPage: 1,
          event: this.handleCurrentChange
        },
        isLoading: false,
        child: {
          columns: childcls
        }
      },
    }
  },
  mounted () {
    // console.log(this.$parent);
  },
  methods: {
    /** 外层 展示 事件 */
    expand (row) {
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
      this.collapse.tableData[index].pageData = {
        total: this.collapse.tableData[index].trace.length,
        pageSize: 5,
        curPage: 1,
        event: this.innerCurrentChange
      }
      let { pageSize, curPage } = this.collapse.tableData[index].pageData

      this.collapse.tableData[index].showList = this.collapse.tableData[index].trace.slice((curPage - 1) * pageSize, curPage * pageSize)

    },
    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },
    innerCurrentChange (pageIndex, index) {
      let { pageSize } = this.collapse.tableData[index].pageData
      this.collapse.tableData[index].showList = this.collapse.tableData[index].trace.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    },
    handleCurrentChange (pageIndex) {
      this.collapse.pageData.curPage = pageIndex
      // 解决翻页回来下拉不了的问题
      this.tableList.forEach((item)=>{
        item.isOpen = false
      })
      this.collapse.tableData = this.tableList.slice((pageIndex - 1) * this.collapse.pageData.pageSize,
                                                     pageIndex * this.collapse.pageData.pageSize)
    },
  }
}
</script>

<style lang="less" scoped>
.list_pages {
  padding: 60px 16px 0 16px;
  background-color: var(--bg-color-3);
  height: calc(100vh - 110px);
  box-sizing: border-box;
}
</style>
