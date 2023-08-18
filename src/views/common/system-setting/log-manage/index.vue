<template>
  <!-- 日志记录 -->
  <div class="t-table">
    <div class="content-main">
      <header>
        <div class="PageHeader">
          <div class="searchCondition">
            <!-- <DatePick :isShowTimeType="false" ref="DatePick"></DatePick> -->
            <div style="width: 400px">
              <QuickTimeSelect
                :type="type"
                :pStartTime.sync="condition.startTime"
                :pEndTime.sync="condition.endTime"
              ></QuickTimeSelect>
            </div>
            <div class="searchCondition_searchKeys">
              <span style="color: #8799bf" class="width80">用户账号：</span>
              <el-input
                v-model="condition.userName"
                style="width: 200px"
                placeholder="请输入"
                clearable
                @keyup.enter.native="searchEvent"
              ></el-input>
            </div>
            <div class="searchCondition_searchKeys">
              <span style="color: #8799bf" class="width50">姓名：</span>
              <el-input
                v-model="condition.realName"
                style="width: 200px"
                placeholder="请输入"
                clearable
                @keyup.enter.native="searchEvent"
              ></el-input>
            </div>
            <div class="searchCondition_searchKeys">
              <span style="color: #8799bf" class="width80">警员编号：</span>
              <el-input
                v-model="condition.jobNumber"
                style="width: 200px"
                placeholder="请输入"
                clearable
                @keyup.enter.native="searchEvent"
              ></el-input>
            </div>
            <div class="searchCondition_searchKeys">
              <span style="color: #8799bf" class="width80">IP地址：</span>
              <el-input
                v-model="condition.srcIp"
                style="width: 200px"
                placeholder="请输入"
                clearable
                @keyup.enter.native="searchEvent"
              ></el-input>
            </div>
            <div style="width: 200px; margin-right: 0px">
              <el-button
                class="search-button"
                type="primary"
                @click="searchEvent"

                > 搜索</el-button
              >
            </div>
          </div>
        </div>
      </header>
      <div class="table-content-wrap">
        <template-table
          :tableData="table.tableData"
          :columns="table.columns"
          tableHeight="calc(100vh - 280px)"
          :rowHeight="rowHeight"
          :btnRender="table.btnRender"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          :loadingBg='"--bg-color-3"'
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </div>
    </div>
  </div>
</template>

<script>
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
import autoTableHeight from '@/mixins/autoTableHeight'
import TemplateTable from '@/components/VisualComponents/Table'
import { statisticsLog } from '@/api/sysSetting'
export default {
  components: {
    TemplateTable,
    QuickTimeSelect
  },
  mixins: [autoTableHeight],
  data () {
    return {
      type: 'logManage',
      searchLoading: false,
      condition: {
        userName: '',
        realName: '',
        jobNumber: '',
        srcIp: '',
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null
      },
      table: {
        tableData: [],
        columns: [
          { label: 'IP地址', prop: 'srcIp', minWidth: '10%', type: 'nor' },
          { label: '序号', width: '104', type: 'index' },
          {
            label: '记录时间',
            prop: 'recordTime',
            minWidth: '15%',
            type: 'nor'
            // renderFun: function(row) {
            //   if (!row.createTime) return '--'
            //   row.createTime = parseInt(row.createTime)
            //   return dayjs.filterString(row.createTime * 1000)
            // }
          },
          { label: '用户账号', prop: 'userName', minWidth: '10%', type: 'nor' },
          { label: '姓名', prop: 'realName', minWidth: '10%', type: 'nor' },
          { label: '警员编号', prop: 'jobNumber', minWidth: '10%', type: 'nor' },
          { label: '操作行为', prop: 'optHehavior', minWidth: '15%', type: 'nor' },
          {
            label: '操作目标',
            prop: 'paramsName',
            minWidth: '12%',
            type: 'nor',
            renderFun: function (row) {
              if (!row.paramsName) return '--'
              return row.paramsName
            }
          }
        ],
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0,
        },
        // 加载条
        isLoading: true
        // params: {
        //   pageNum: 1,
        //   pageSize: 10,
        //   startTime: '',
        //   endTime: '',
        //   searchKey: '',
        // }
      },
    }
  },

  created () {
    statisticsLog(this.condition).then(res => {
      this.table.tableData = res.content
      this.table.pageData.total = res.totalSize
    })
      .finally(() => {
        this.table.isLoading = false
      })
  },

  methods: {
    // 筛选条件搜索
    searchEvent () {

      this.condition.pageNum = 1
      this.table.pageData.curPage = this.condition.pageNum
      this.loadTable()
    },
    // 时间控件
    // getTimeSelect(child) {
    //   this.table.params.startTime = child.startTime ? child.startTime : ''
    //   this.table.params.endTime = child.endTime ? child.endTime : ''
    // },
    // clearTime() {
    //   this.table.params.startTime = ''
    //   this.table.params.endTime = ''
    // },
    // 加载表格数据
    loadTable () {
      this.table.isLoading = true
      // 开始结束日期 秒单位时间戳
      // if (this.table.params.startTime && this.table.params.startTime.toString().length > 11) {
      //   this.table.params.startTime = this.table.params.startTime / 1000
      // }
      // if (this.table.params.endTime && this.table.params.endTime.toString().length > 11) {
      //   this.table.params.endTime = this.table.params.endTime / 1000
      // }
      // if (this.table.params.startTime && !this.table.params.endTime) {
      //   this.$messageTip.error('请输入结束时间！')
      //   return false
      // }
      // if (!this.table.params.startTime && this.table.params.endTime) {
      //   this.$messageTip.error('请输入结束时间！')
      //   return false
      // }
      // const startTime = this.$refs.DatePick.pick.startTime
      // const endTime = this.$refs.DatePick.pick.endTime

      // this.condition.startTime = startTime ? startTime : null
      // this.condition.endTime = endTime ? endTime : null

      statisticsLog(this.condition)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
        })
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.condition.pageNum = val
      this.loadTable()
    },
  },
}
</script>

<style lang="less" scoped>
.content-main {
  //margin: 5px;
  box-sizing: border-box;
  height: 100%;
  header {
    height: 64px;
  }
  .PageHeader {
    position: relative;
    box-sizing: border-box;
    overflow: auto;
    // margin: 12px 16px 0 16px;
    padding: 12px 16px;
    // background-color: var(--table-head-bg-color);
    background: var(--bg-color-3);
    .searchCondition {
      display: flex;
      align-items: center;
      // box-sizing: border-box;
      > div {
        margin-right: 16px;
      }
      div:last-child {
        margin-right: 0;
      }
      .searchCondition_searchKeys {
        // width: 440px;
        display: flex;
        align-items: center;
        .width80 {
          width: 80px;
        }
        @media only screen and (min-width: 1180px) and (max-width: 1450px) {
          .width80 {
            width: 100px;
          }
        }
        .width50 {
          width: 70px;
        }
      }
      .search-button {
        float: right;
        border-radius: 2px !important;
      }
    }
  }
  .table-content-wrap {
    height: calc(100% - 65px);
    margin-top: 1px;
    background: var(--bg-color-3);
    box-sizing: border-box;
    padding: 14px 16px;
  }
}
.el-icon-search {
  cursor: pointer;
  &:hover {
    color: #177ddc;
  }
}
.t-table {
  height: calc(100% - 32px);
  margin-bottom: 32px;
  //min-height: calc(100vh - 110px);
  //background: var(--bg-color-3);
  box-sizing: border-box;
}
/deep/.pagination {
  padding: 0 10px !important;
}
</style>
