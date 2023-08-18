<template>
  <div id="applyManage">
    <div class="content-main">
      <el-tabs stretch v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane label="待审批" name="待审批"></el-tab-pane>
        <el-tab-pane label="已重置" name="已重置"></el-tab-pane>
        <el-tab-pane label="全部" name="全部"></el-tab-pane>
      </el-tabs>
      <keep-alive>
        <!-- <component :is="currentTab"></component> -->
        <div class="table-content-wrap">
          <template-table
            :tableData="table.tableData"
            :columns="table.columns"
            :rowHeight="48"
            :tableHeight="674"
            :newRowColor="true"
            :isShowBtn="table.isShowBtn"
            :btnList="table.btnList"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :header-row-style='{ height: $pxToRem(48) }'
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </div>
      </keep-alive>

      <div class="input_box">
        <el-input
          id="el_input"
          style="width:300px;font-size:16px;"
          v-model="table.params.key"
          placeholder="请输入用户账号/姓名"
          v-on:keyup.enter.native="search"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click.prevent.stop="search"
          ></i>
        </el-input>
      </div>

      <Dialog :pop.sync="dialog" @beforeClose="closeDialog" @beforeOpen="openDialog">
        <div v-if="dialog.title ==='重置密码'">
          <div>
            <el-table
              element-loading-background="rgba(25, 32, 53, 1)"
              :data="resetTableData"
              :row-class-name="tableRowStyle"
              :cell-style="iCellStyle"
              :header-cell-style="headerCellStyle"
              :header-row-style="headerRowStyle"
              border
              >
              <el-table-column
                prop="userName"
                label="用户账号"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                v-if="!dialog.isReset"
                label="密码"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button @click.prevent="clickReset(scope.row)" type="text" style="font-size:16px;">重置</el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-if="dialog.isReset"
                align="center"
                prop="newPassword"
                label="密码">
              </el-table-column>
              <el-table-column
                prop="realName"
                label="姓名"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                width="100"
                prop="jobNumber"
                align="center"
                label="警员编号">
              </el-table-column>
            </el-table>
          </div>
          <div style="height:110px;display:flex; align-items: center;">
            <div v-if="dialog.isReset" style="display:flex; align-items: center;justify-content: flex-start;">
              <i class='iconfont icon-xiangqingchenggong'></i>
              <div class='tip_color' style="margin-left:16px;" >
                <div>成功重置密码，请保存好用户信息以防无法登陆。</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dialog.title ==='详情'">
          <div class="main_info">
            <template v-for="(colItem, colIndex) in detailData.columns">
              <div class="main_info_item" :key="colIndex + colItem">
                <div class='label_color'>{{ colItem.label }}：</div>
                <div v-if="colItem.prop === 'status' && detailData.data[colItem.prop] === '已重置'" style="color:#3AB293">
                  {{detailData.data[colItem.prop] === '已重置' ? detailData.data[colItem.prop] : '--'}}
                </div>
                <div class='tip_color' v-else>
                  {{detailData.data[colItem.prop] ? detailData.data[colItem.prop] : '--'}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/BasicComponents/Dialog'
import TemplateTable from './table.vue'
import autoTableHeight from '@/mixins/autoTableHeight'
import dayjs from '@/utils/filters'
import { listApplyByPage, clickApplication, getPassWord} from '@/api/sysSetting'

export default {
  components: {
    Dialog,
    TemplateTable
  },
  mixins: [autoTableHeight],
  data () {
    return {
      currentTab: '待审批',
      // key: '',
      table: {
        tableData: [],
        columns: [
          // {
          //   label: '审批时间',
          //   prop: 'approveTime',
          //   width: '220',
          //   type: 'nor',
          //   renderFun: function (row) {
          //     if (!row.approveTime) return '--'
          //     row.approveTime = parseInt(row.approveTime)
          //     return dayjs.filterSS(row.approveTime)
          //   }
          // },
          {
            label: '审批时间',
            prop: 'approvalTimes',
            minWidth: '15%',
            type: 'nor'
          },
          { label: '序号', type: 'index', width: '100' },
          { label: '用户账号', prop: 'userName', minWidth: '10%', type: 'nor' },
          { label: '姓名', prop: 'realName', minWidth: '10%', type: 'nor' },
          { label: '部门名称', prop: 'departmentName', minWidth: '15%', type: 'nor' },
          { label: '申请事项', prop: 'applicationType', minWidth: '10%', type: 'nor' },
          {
            label: '状态',
            prop: 'status',
            minWidth: '8%',
            type: 'approveReset'
          },
          { label: '申请总次数', prop: 'applicationNumber', minWidth: '10%', type: 'nor' },
          {
            label: '申请时间',
            prop: 'createTimes',
            minWidth: '15%',
            type: 'nor'
          }
        ],
        isShowBtn: true,
        btnList: [
          {
            label: '重置密码',
            btnEvent: this.resetBtn,
            alt: '重置密码'
          },
          {
            label: '详情',
            btnEvent: this.openDetail,
            alt: '详情'
          }
        ],
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 10,
          key: '',
          status: '待审批'
        }
      },
      dialog: {
        show: false,
        title: '',
        width: '500px',
        top: '300px',
        isReset: false
      },
      resetTableData: [],
      detailData: {
        columns: [
          { "label": "用户账号", "prop": "userName" },
          { "label": "密码", "prop": "newPassword" },
          { "label": "部门名称", "prop": "departmentName" },
          { "label": "申请总次数", "prop": "applicationNumber" },
          { "label": "申请时间", "prop": "createTimes" },
          { "label": "姓名", "prop": "realName" },
          { "label": "警员编号", "prop": "jobNumber" },
          { "label": "申请事项", "prop": "applicationType" },
          { "label": "状态", "prop": "status" },
          { "label": "审批时间", "prop": "approvalTimes" }
        ],
        data: {}
      }
    }
  },
  created () {
    this.search()
  },
  methods: {
    headerCellStyle () {
      let returnStyle = {
        "color": "#8799BF",
        "font-size": this.$pxToRem(16),
        "font-weight": 400
      }
      return returnStyle
    },
    headerRowStyle () {
      let returnStyle = {
        "height": this.$pxToRem(48)
      }
      return returnStyle
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    },
    iCellStyle: function () {
      let returnStyle = {
        "color": "#8799BF",
        "font-size": this.$pxToRem(16),
        "padding": 0,
        "height": this.$pxToRem(54)
      }
      return returnStyle
    },
    timeFormat (item) {
      let temp = parseInt(item)
      return dayjs.filterSS(temp)
    },
    handleClick (item) {
      if (item.name === '全部') {
        this.table.params.status = ''
      } else {
        this.table.params.status = item.name
      }
      this.table.params.pageNum = 1
      this.search()
    },
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.search()
    },
    search () {
      this.table.isLoading = true
      listApplyByPage(this.table.params).then(res => {
        this.table.tableData = res.content
        this.table.pageData.total = res.totalSize
      })
        .finally(() => {
          this.table.isLoading = false
        })
    },
    // 重置
    resetBtn (item) {
      this.dialog = {
        show: true,
        title: '重置密码',
        width: '500px',
        top: '300px',
        isReset: false
      }
      this.resetTableData = []
      this.resetTableData.push(item)
    },
    // 点击弹框的重置
    clickReset (item) {
      this.dialog.show = false
      let params = {
        id: item.id
      }
      clickApplication(params).then(() => {
        let params = {
          password: item.applicationPassword
        }
        getPassWord(params).then(res => {
          item.newPassword = res.data
          this.resetTableData = []
          this.resetTableData.push(item)
        }).finally(() => {
          this.dialog.show = false
          this.$nextTick(() => {
            this.dialog = {
              show: true,
              title: '重置密码',
              width: '500px',
              top: '300px',
              isReset: true
            }
          })
          this.search()
        })
      })
    },
    // 查看详情
    openDetail (item) {
      let params = {
        password: item.applicationPassword
      }
      getPassWord(params).then(res => {
        item.newPassword = res.data
        // this.detailData.data = {}
        this.detailData.data = item
      }).finally(() => {
        this.dialog = {
          show: true,
          title: '详情',
          width: '650px',
          top: '300px'
        }
      })
    },
    closeDialog () {
      this.dialog.show = false
      this.detailData.data = {}
    },
    openDialog () {

    }
  }
}
</script>

<style lang="less" scoped>
#applyManage{
  /deep/.el-tabs {
    width: 264px;
    // margin-top: 12px;
  }
  /deep/.el-tabs__nav-wrap::after {
    background: #515C7C !important;
    opacity: 0.5;
  }
  @media screen and (min-width: 1024px) and (max-width:1365px){
    /deep/.el-tabs__nav-wrap::after {
      height: 2px;
  }
  }
  .content-main {
    height: 100%;
    background: var(--bg-color-3);
    padding: 16px !important;
    position: relative;

    /deep/.el-tabs__header {
      padding: 0;
      position: relative;
      margin: 0;
    }
    /deep/.el-tabs__active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px !important;
      background-color: var(--active-color);
      z-index: 1;
      transition: transform .3s cubic-bezier(.645,.045,.355,1);
      list-style: none;
    }
    @media screen and (min-width: 1024px) and (max-width:1365px){
      /deep/.el-tabs__active-bar {
        height: 2px !important;
      }
    }
    /deep/#el_input {
      border-bottom: 1px solid var(--border-color-input) !important;
      border-top: 0px !important;
      border-left: 0px !important;
      border-right: 0px !important;
      border-radius: 0;
    }
    /deep/.el-tabs__item {
      padding: 0 !important;
      color: var(--base-text-color-to-999999) !important;
      &:hover{
        color: var(--active-color) !important;
      }
    }
    /deep/.el-tabs__item.is-active {
      color: var(--active-color) !important;
    }
    /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    .input_box{
      position: absolute;
      top:16px;
      right: 16px;
    }
    .table-content-wrap{
      margin-top: 24px;
    }
    .main_info{
      height: 200px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      .main_info_item{
        line-height: 14px;
        margin-top: 20px;
        display: flex;
        .label_color{
          width: 100px;
        }
        @media screen and (min-width: 1024px) and (max-width: 1365px){
          .label_color{
            width: 115px;
          }
        }
      }
    }
  }
}
/deep/.el-table {
  width: 100%;
  // height: 770px;
}
/deep/.el-dialog {
  background-color: var(--bg-color-4);
}
/deep/.el-dialog__header {
    padding: 20px 32px 0 32px !important;
}
/deep/.el-dialog__body {
  padding: 0 25px 25px 32px !important;
}
/deep/.v-modal {
  background: rgba(27,33,50) !important;
}
/deep/.el-table {
  //.odd-row {
  //  background-color: rgba(20, 20, 20, 0.04) !important;
  //  .el-table__cell {
  //    border-bottom: 1px solid var(--table-row-border-bottom-color) !important;
  //  }
  //}
  //.double-row {
  //  background-color: var(--table-head-bg-color) !important;
  //  .el-table__cell {
  //    border-bottom: 1px solid var(--table-row-border-bottom-color) !important;
  //  }
  //}
  .is-leaf {
    //border-right: 0 !important;
    //.cell {
    //  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
    //}
    //&:nth-last-child(2) {
    //  .cell {
    //    border-right: 0 !important;
    //  }
    //}
  }
  .el-table__cell.gutter:last-of-type {
    border-bottom: 0 !important;
  }
}
.icon-xiangqingchenggong {
  font-size: 64px;
  color: #0CBF7E;
}
.tip_color {
  color: var(--base-text-color-1);
}
.label_color {
  color: var(--base-text-color-to-999999);
}
</style>
