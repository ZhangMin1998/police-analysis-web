<template>
  <div class="test">
    <PageHeader> <list-title title="测试配置" /></PageHeader>

    <div class="table-content-wrap">
      <template-table
        :tableData="table.tableData"
        :columns="table.columns"
        :pageData="table.pageData"
        :btnRender="table.btnRender"
        :tableHeight="600"
        :rowHeight="50"
        :isLoading="table.isLoading"
        @handleCurrentChange="handleCurrentChange"
      >
      </template-table>
    </div>

    <div class="pop">
      <el-dialog
        :append-to-body="false"
        :visible="showProgress"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="550px"
        top="33vh"
        :show-close="false"
      >
        <span slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title title="执行任务中..." />
          </div>
        </span>
        <div style="height: 120px">
          <loading-progress-panel @cancelLoading="closeProgress"></loading-progress-panel>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const tableColumn = [
  {
    label: '任务名称',
    prop: 'job_name',
    minWidth: '75%',
    type: 'nor'
  },
  {
    label: '序号',
    type: 'index',
    width: '100'
  }
]
import PageHeader from '@/components/BasicComponents/PageHeader'
// import Loading from '@/components/VisualComponents/Loading'
import TemplateTable from '@/components/VisualComponents/Table'
import { getJob, executeJob } from '@/api/config'
import LoadingProgressPanel from '@/components/VisualComponents/Form/loadingModel'
export default {
  components: {
    // Loading,
    TemplateTable,
    PageHeader,
    LoadingProgressPanel
  },
  data () {
    return {
      showProgress: false,
      table: {
        tableData: [],
        columns: tableColumn,
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0,
          btnRenderWidth: '12%'
        },
        btnRender: [
          {
            label: '执行任务',
            icon: 'icon-xiangqing',
            btnEvent: this.handleEdit,
            alt: '执行任务'
          }
        ],
        isLoading: false,
        params: {
          page_num: 1,
          page_size: 10,
        },
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.table.isLoading = true
      getJob().then((res) => {
        this.table.tableData = res
        this.table.pageData.total = res.length
        this.table.isLoading = false
      })
    },
    handleEdit (data) {
      // this.table.isLoading = true
      this.showProgress = true
      executeJob({ job_id: data.job_id }).then(() => {
        // this.$message.success('执行成功')
      }).finally(() => {
        // this.table.isLoading = false
        this.showProgress = false
        this.$message.success('执行成功')
      })
    },
    handleCurrentChange (val) {
      this.table.params.page_num = val
      this.getTableData()
    },
    // 关闭进度条弹框
    closeProgress () {
      this.showProgress = false
    }
  }
}
</script>

<style lang="less" scoped>
.test {
  // padding: 16px;
  // ::v-deep .el-table__body-wrapper {
  //   background-color: #2c384e;
  // }
  .table-content-wrap {
    padding: 12px 16px 0 16px;
    box-sizing: border-box;
  }
}
</style>
