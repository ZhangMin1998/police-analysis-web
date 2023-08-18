<template>
  <div class="sms-record">
     <PageHeader> <list-title title="短信记录" /></PageHeader>

    <div class="table-content-wrap">
      <!-- :tableHeight="((table.pageData.pageSize + 1) * 48) + 1" -->
      <template-table
        :tableData="table.tableData"
        :columns="table.columns"
        :pageData="table.pageData"
        :rowHeight="48"
        :isLoading="table.isLoading"
        :header-row-style='() => "height: 48px"'
        :header-cell-style="() => 'background-color: rgba(255, 255, 255, .04) !important;color:#8799BF;font-size:16px;font-weight:400'"
        :newRowColor='true'
        @handleCurrentChange="handleCurrentChange">
      </template-table>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/BasicComponents/PageHeader'
import { smsRecord } from "@/api/sysSetting"
import { onMounted, reactive,toRefs } from '@vue/composition-api'

import TemplateTable from '@/components/VisualComponents/Table'

const STATUS_MAP = {
  'success': '成功',
  'limit': '限制'
}

export default {
  components: {
    TemplateTable,
    PageHeader
  },
  setup () {
    const tableColumn = [
      {
        label: '发送时间',
        prop: 'send_time',
        minWidth: '20%',
        type: 'nor'
      },
      {
        label: '发送者IMEI',
        prop: 'sender',
        minWidth: '20%',
        type: 'nor'
      },
      {
        label: '接收者',
        prop: 'receiver',
        minWidth: '20%',
        type: 'nor'
      },
      {
        label: '内容',
        prop: 'sms_content',
        minWidth: '20%',
        type: 'nor'
      },
      {
        label: '状态',
        prop: 'status',
        minWidth: '20%',
        type: 'nor',
        renderFun: function (row) {
          return STATUS_MAP[row.status]
        }
      },
    ]

    const state = reactive({
      table:{
        tableData: [],
        columns: tableColumn,
        pageData: {
          curPage: 1,
          pageSize: 15,
          total: 0,
        },
        isLoading: true,
        params: {
          page_num: 1,
          page_size: 15,
        },
      }
    })

    const obtainData = async () => {
      state.table.isLoading = true
      const result = await smsRecord(state.table.params)
      state.table.tableData = result.data_page
      state.table.pageData.total = result.total_size
      state.table.isLoading = false
    }

    const handleCurrentChange = (val) => {
      state.table.params.page_num = val
      obtainData()
    }

    onMounted(() => {
      obtainData()
    })

    return {
      ...toRefs(state),
      handleCurrentChange
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1500px) {
  /deep/.el-table{
    height: 680px !important;
  }
}
.sms-record{
  /* padding: 16px; */
  // overflow-y: auto;
  min-height: calc(100vh - 120px);
}

.table-content-wrap {
  padding: 12px 16px 0 16px;
  box-sizing: border-box;
}
</style>
