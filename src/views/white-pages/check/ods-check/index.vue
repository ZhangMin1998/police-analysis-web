<template>
  <div class="odscheck">
    <header>
      <PageHeader>
        <template>
          <main>
            <div class="company-type">
              <span>厂商列表：</span>
              <span
                class="item_check"
                :class="{ active: currentCompanyIndex === index }"
                v-for="(item, index) in companyList"
                :key="item.value"
                @click="companyClick(item, index)"
                >{{ item.value }}</span
              >
            </div>
          </main>
        </template>
      </PageHeader>
    </header>
    <main class="table-main">
      <div  class="ods-check">
         <el-button type="primary" @click="odsCheck">校验</el-button>
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
            <list-title title="数据校验中..." />
          </div>
        </span>
        <div style="height:120px;">
          <loading-progress-panel @cancelLoading="closeProgress"></loading-progress-panel>
        </div>
      </el-dialog>
    </div>
      <Loading :isLoading.sync="infoLoading">
        <el-table border :data="tableData" style="width: 100%" :height="700">
          <el-table-column resizable type="index" label="序号" width="100"> </el-table-column>
          <el-table-column resizable prop="table" label="表名"> </el-table-column>
          <el-table-column resizable prop="info" v-if="tableData[0] && tableData[0].info" label="校验结果" width="250"></el-table-column>
        </el-table>
      </Loading>
    </main>
  </div>
</template>

<script>
import PageHeader from '@/components/BasicComponents/PageHeader'
import { searchCompanyList, checkodsAll,checktranceAll, getodslist } from '@/api/check'
import Loading from '@/components/VisualComponents/Loading'
import LoadingProgressPanel from '@/components/VisualComponents/Form/loadingModel'
export default {
  data () {
    return {
      companyList: [], // 公司列表
      tableData: [],
      company: '', // 用户点击的当前公司
      currentCompanyIndex: 0, // 公司列表的高亮
      infoLoading: false, // loading,
      showProgress: false
    }
  },
  components: {
    PageHeader,
    Loading,
    LoadingProgressPanel
  },
  created () {
    this.getCompanyList()
  },
  methods: {
    getCompanyList () {
      this.changeLoading(true)
      searchCompanyList().then((res) => {
        let data = res.map((item) => {
          return { label: item, value: item }
        })
        this.companyList = data
        this.company = data[0].value
        this.searchEvent()
      })
    },
    odsCheck (){
      this.showProgress = true
      Promise.all([checkodsAll({ company: this.company }),checktranceAll({ company: this.company })]).then((res)=>{

        let tempArr = res[0].concat(res[1])
        this.tableData.forEach((item)=>{
          tempArr.forEach((_c)=>{
            if(_c.table === item.table){
              item.info = _c.info
            }
          })
        })
      }).finally(()=>{
        this.showProgress = false
      })
    },
    searchEvent () {
      this.changeLoading(true)
      getodslist().then((res) => {
        this.tableData = this.formatData(res)
      }).finally(()=>{
        this.changeLoading(false)
      })
    },
    formatData (data){
      let tempArr = []
      data.forEach((item)=>{
        let tempObj = {}
        tempObj.table = item
        tempObj.info = ''
        tempArr.push(tempObj)
      })
      return tempArr
    },
    // 公司点击事件
    companyClick (item, index) {
      this.currentCompanyIndex = index
      this.company = item.value
      this.searchEvent()
    },
    changeLoading (Boolean) {
      this.infoLoading = Boolean
    },
    closeProgress (){
      this.showProgress = false
    }
  }
}
</script>

<style lang="less" scoped>
.odscheck {
  height: calc(100vh - 104px);
  overflow: scroll;
  .item_check {
    cursor: pointer;
    margin: 0 18px;
  }
  .table-main {
    padding: 12px 16px 0 16px;
    box-sizing: border-box;
    // height: 725px;
    // height: calc(100vh - 220px);
    position: relative;
    .ods-check{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 12px;
    }
  }

  .error-color {
    color: rgb(168, 79, 79);
  }
  .active {
    color: #d4b021;
  }
  ::v-deep .el-table__body-wrapper {
    background-color: #2c384e;
  }
  ::v-deep .name-wrapper.el-popover__reference {
    width: 14px;
    text-align: center;
  }
}
</style>
