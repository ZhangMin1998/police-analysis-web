<template>
  <div class="disposition">
    <PageHeader> <list-title title="配置校验" /></PageHeader>

    <div class="table-main">
      <template-table
        :tableData="table.tableData"
        :columns="table.columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :isLoading="table.isLoading"
        :pagination="false"
      >
      </template-table>
    </div>
  </div>
</template>

<script>
import { compareResult } from '@/api/sysSetting'
import PageHeader from '@/components/BasicComponents/PageHeader'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
const tableColumn = [
  {
    label: '比对结果',
    prop: 'compare_result',
    minWidth: '80',
    type: 'status',
    statuList: [
      { status: true, color: '3BC022', text: '✔' },
      { status: false, color: 'F63F70', text: 'X' }
    ]
  },
  {
    label: '配置名',
    prop: 'config_name',
    minWidth: '240'
  },
  {
    label: 'Java',
    prop: 'java',
    minWidth: '240'
  },
  {
    label: 'Python',
    prop: 'python',
    minWidth: '240'
  },

]

export default {
  components: {
    TemplateTable,
    PageHeader
  },
  mixins: [autoTableHeight],
  data () {
    return {
      subHeight: 220,
      table: {
        tableData: [],
        columns: Object.freeze(tableColumn),
        isLoading: true,
        params: {
          page_num: 1,
          page_size: 1000000
        }
      }
    }
  },
  mounted () {
    this.obtainData()
  },
  methods: {
    async obtainData () {
      this.table.isLoading = true
      const result = await compareResult(this.table.params)
      this.table.tableData = result
      this.table.isLoading = false
    }
  }
}
</script>

<style scoped>
.table-main {
  padding: 12px 16px 0 16px;
  box-sizing: border-box;
}
</style>
