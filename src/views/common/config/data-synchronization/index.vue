<template>
  <div class="test">
    <PageHeader> <list-title title="测试配置" /></PageHeader>

    <div class="table-content-wrap">
      <template-table
        :tableData="table.tableData"
        :columns="table.columns"
        :pageData="table.pageData"
        :btnRender="table.btnRender"
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
import { graphScanNebula, graphScanDeadLetterHandle, graphScanNebulaCar, graphScanDeadLetterHandleCar } from '@/api/config'
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
      // getJob().then((res) => {
      this.table.tableData = [
        // {
        //   job_id: 'startScan',
        //   job_name: 'Nebula全量写入ES-人物档案'
        // },
        {
          job_id: '',
          job_name: '死信队列检查-人物档案'
        },
        //  {
        //   job_id: 'startScan',
        //   job_name: 'Nebula全量写入ES-车辆档案'
        // },
        {
          job_id: '',
          job_name: '死信队列检查-车辆档案'
        }
      ]
      this.table.pageData.total = 1
      this.table.isLoading = false
      // })
    },
    handleEdit (data) {
      console.log(data);
      if (data.job_name === 'Nebula全量写入ES-人物档案') {
        graphScanNebula({ job_id: data.job_id }).then((res) => {
          // if (res[0].result === 'success') {
          //   this.$message.success(res[0].msg)
          // } else {
          //   this.$message.info(res[0].msg)
          // }
          this.handleSuccess(res)
        }).catch((err) => {
          console.log(err);
          this.$message.success('执行失败')
        })
      } else if (data.job_name === '死信队列检查-人物档案') {
        graphScanDeadLetterHandle().then((res) => {
          // if (res[0].result === 'success') {
          //   this.$message.success(res[0].msg)
          // } else {
          //   this.$message.info(res[0].msg)
          // }
          this.handleSuccess(res)
        }).catch((err) => {
          console.log(err);
          this.$message.success('执行失败')
        })
      } else if (data.job_name === 'Nebula全量写入ES-车辆档案') {
        graphScanNebulaCar({ job_id: data.job_id }).then((res) => {
          // if (res[0].result === 'success') {
          //   this.$message.success(res[0].msg)
          // } else {
          //   this.$message.info(res[0].msg)
          // }
          this.handleSuccess(res)
        }).catch((err) => {
          console.log(err);
          this.$message.success('执行失败')
        })
      } else if (data.job_name === '死信队列检查-车辆档案') {
        graphScanDeadLetterHandleCar().then((res) => {
          // if (res[0].result === 'success') {
          //   this.$message.success(res[0].msg)
          // } else {
          //   this.$message.info(res[0].msg)
          // }
          this.handleSuccess(res)
        }).catch((err) => {
          console.log(err);
          this.$message.success('执行失败')
        })
      }
    },
    handleSuccess (res) {
      if (res[0].result === 'success') {
        this.$message.success(res[0].msg)
      } else {
        this.$message.info(res[0].msg)
      }
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
