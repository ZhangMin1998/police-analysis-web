<template>
  <div class="personSocial">
    <header v-permission="'normal_human:list'">
      <PageHeader class="PageHeader">
        <div class="searchs_box">
          <el-input
            class="input"
            type="text"
            v-model.trim="params.searchKey"
            @keyup.enter.native="search"
            @clear="getTable"
            placeholder="请输入姓名/证件号码"
            clearable
          >
            <template slot='suffix'>
              <i class='el-icon-search' v-debounce.prevent.stop="search"></i>
            </template>
            <!-- <i
              slot="suffix"
              style="cursor: pointer"
              class="el-input__icon el-icon-search"
              v-debounce.prevent.stop="search"
            ></i> -->
          </el-input>
        </div>
        <div class="opt_btn">
          <div :class="['blank_button', 'button']" v-debounce="exportTable">{{ '导出' }}</div>
          <!-- <el-button type="primary" class="blank_button" v-debounce="exportTable">{{'导出'}}</el-button> -->
        </div>
      </PageHeader>
    </header>
    <main class="table-main">
      <CusImagesPager
        :list="table.tableData"
        :columns="table.columns"
        :pageData="table.pageData"
        :isLoading="table.isLoading"
        :haveTitle="false"
        @handleCurrentChange="handleCurrentChange"
        @clickCard="clickCard"
      >
        <!-- <div
          class="card_btn"
          slot="cardBtn"
          slot-scope="{ item }"
          v-permission="'normal_human:trajectory'"
        >
          <i class='iconfont icon-guiji' title="轨迹详情" @click.stop="handleGo(item)"></i>
        </div> -->
      </CusImagesPager>
    </main>
    <!--    导出-->
    <CusExport
      method="post"
      fileName="人物档案"
      url="/police/person/list/export"
      :exportShow.sync="exportLoading"
      :allCols="allCols"
      :totalData="this.table.pageData.total"
      :params="{ ...params }"
    ></CusExport>
    <!-- 图表 -->
    <Pop
      :pop.sync="pop"
      @beforeClose="closeFDialog"
      :dataCenterDetail="true"
    >
      <div class="content_box">
        <div class="left_box">
          <div class="labelList_box">
            <div class="labelList" v-for="(item, index) in labelList" :key="index">
              <div :class="['item', { isSelected:item.value === isSelected }]" @click="itemClick(item)">{{ item.label }}</div>
            </div>
          </div>
        </div>
        <component :is="activeName"></component>
        <div class="button_box">
          <div class='blank_button' @click="closeFDialog">取消</div>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </Pop>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { mapState } from 'vuex'
import PageHeader from '@/components/BasicComponents/PageHeader'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import CusExport from '@/components/VisualComponents/CusExport'
import { searchPersonFileByPage } from '@/api/allArchives'
import Pop from '@/components/VisualComponents/PopDialog'

import LineConfigChart from './lineConfigChart.vue'
import BarConfigChart from './barConfigChart.vue'
import PieConfigChart from './pieConfigChart.vue'
import MapConfigChart from './mapConfigChart.vue'

const allCols = [
  {
    label: '导出项',
    list: [
      { label: '头像', prop: 'avatarFile' },
      { label: '姓名', prop: 'name' },
      { label: '性别', prop: 'sex' },
      { label: '证件类型', prop: 'cerTypeName' },
      { label: '证件号码', prop: 'cerNumber' },
      // { label: '手机', prop: 'mobilePhoneList' },
      { label: '户籍地址', prop: 'address' }
    ]
  }
]
export default {
  components: {
    PageHeader,
    CusImagesPager,
    CusExport,
    Pop,
    LineConfigChart,
    BarConfigChart,
    PieConfigChart,
    MapConfigChart
  },
  mixins: [autoTableHeight],
  data () {
    return {
      allCols: Object.freeze(allCols),
      exportLoading: false,
      params: {
        pageNum: 1,
        pageSize: 12,
        searchKey: '',
        custom: false,
        personTypeList: ['personNormal']
      },
      table: {
        columns: [
          { label: '人脸图片', prop: 'avatar', type: 'img' },
          { label: '姓名', prop: 'name' },
          { label: '性别', prop: 'sex' },
          { label: '年龄', prop: 'age' },
          // { label: '证件类型', prop: 'cerTypeName' },
          { label: '证件号码', prop: 'cerNumber', judge: 'cerTypeName'},
          // { label: '手机', prop: 'phone' },
          { label: '户籍地址', prop: 'address' }
        ],
        allData: [],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        isLoading: true
      },
      pop: {
        show: false,
        title: '图表',
        width: '1066px',
        top: '200px'
      },
      labelList: [
        {
          label: '折线图',
          value: 1
        },
        {
          label: '柱状图',
          value: 2
        },
        {
          label: '饼图',
          value: 3
        },
        {
          label: '地图',
          value: 4
        }
      ],
      isSelected: 1,
      activeName: 'LineConfigChart'
    }
  },
  computed: {
    ...mapState('Common', {
      tableCurrentPage: 'tableCurrentPage'
    })
  },
  created () {
    this.getTable()
  },

  methods: {
    // 点击卡片查看详情
    clickCard (item) {
      if (this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
        this.$store.commit('Common/setTablePage', this.params)
        this.$router.push({ name: 'PersonFileDetail', query: { cerNumber: item.cerNumber, cerType: item.cerType, personVid: item.personVid , label: '人物档案' } })
      }else{
        this.$message.info('暂无档案详情权限')
      }
    },
    // 搜索
    search () {
      if (!this.params.searchKey) {
        this.$messageTip.error('请输入姓名/证件号码！')
        return false
      }
      this.params.pageNum = 1
      this.getTable()
      // this.loadImportantPage()
    },
    // 分页切换操作
    handleCurrentChange (val) {
      // console.log(val)
      this.params.pageNum = val
      this.table.pageData.curPage = val
      // this.getTable()
      this.table.tableData = this.table.allData.slice(
        (val - 1) * this.table.pageData.pageSize,
        val * this.table.pageData.pageSize
      )
    },
    // 获取卡片数据
    getTable () {
      let temp = {}
      if (this.tableCurrentPage) {
        temp = this.tableCurrentPage
        this.params.pageNum = this.tableCurrentPage.pageNum
        this.params.searchKey = this.tableCurrentPage.searchKey
        this.$store.commit('Common/setTablePage', null)
      } else {
        temp = this.params
      }
      this.table.isLoading = true
      searchPersonFileByPage(temp).then(res => {
        res.content.forEach(item => {
          if (item.age) {
            item.age = item.age.toString()
          }
          if (!item.sex && item.cerType === 'attr_identity_card_type') {
            item.sex = this.getSex(item.cerNumber)
          }
        })
        this.table.allData = JSON.parse(JSON.stringify(res.content))
        // this.table.tableData = res.content
        this.table.pageData.curPage = this.params.pageNum
        this.table.pageData.total = res.totalSize
        // 前端分页 先取前12条
        this.table.tableData = this.table.allData.slice(
          (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
          this.table.pageData.curPage * this.table.pageData.pageSize
        )
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.table.isLoading = false
      })
    },
    // 通过身份证获取性别
    getSex (data) {
      if (parseInt(data.substr(16, 1)) % 2 === 1) {
        return "男"
      } else {
        return "女"
      }
    },
    // 导出
    exportTable () {
      this.exportLoading = true
      // this.pop.show = true
    },
    // 查看轨迹
    handleGo (row) {
      // this.$router.push({ name: 'Trajectory', query: { id: row.id, label: '人物档案' } })
      // this.$store.commit('Common/setTablePage', this.params.pageNum)
      window.open(window.location.origin + '/ol/Trajectory?id=' + row.id + '&cerType=' + row.cerType + '&personVid='+ row.personVid  + '&cerNumber=' + row.cerNumber + '&label=人物档案', "_blank")
    },
    // 关闭弹框
    closeFDialog () {
      this.pop.show = false
      this.activeName = 'LineConfigChart'
    },
    itemClick (item) {
      this.isSelected = item.value
      if (item.value === 1) {
        this.activeName = 'LineConfigChart'
      } else if (item.value === 2) {
        this.activeName = 'BarConfigChart'
      } else if (item.value === 3) {
        this.activeName = 'PieConfigChart'
      } else if (item.value === 4) {
        this.activeName = 'MapConfigChart'
      } else {
        this.activeName = ''
      }
    },
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .table-main {
    margin-bottom: 24px;
  }
  /deep/.CusImagesPager_item_main {
    height: 240px;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .table-main {
    margin-bottom: 24px;
  }
}
@media screen and (min-width: 1920px) {
  .table-main {
    // height: 750px;
    min-height: calc(100vh - 180px);
  }
  /deep/.value {
    line-height: 21px;
  }
}
.personSocial {
  min-height: calc(100vh - 100px);
  .PageHeader {
    position: relative;
    margin: 0 !important;
    // padding: 12px 16px;
    background-color: var(--bg-color-3);
    box-sizing: border-box;
    .searchs_box {
      display: flex;
      align-items: center;
      // .input {
      //   font-size: 16px;
      //   width: 400px;
      // }
      /deep/.el-input {
        width: 400px;
        // margin-right: 16px;
      }
      /deep/.el-input__suffix {
        right: 5px;
        .el-icon-search {
          font-size: 16px;
          // color: #657494;
          line-height: 40px;
          cursor: pointer;
        }
        .icon-sousuo {
          font-size: 16px;
          // color: #657494;
          line-height: 40px;
          cursor: pointer;
        }
        .el-icon-circle-close {
          width: 16px;
          font-size: 16px !important;
          position: absolute;
          right: 24px;
          // top: 1px;
          color: #657494 !important;
        }
        .el-icon-circle-close:hover {
          color: @active-color !important;
        }
      }
    }
  }
  .table-main {
    margin-top: 2px;
    // padding: 0px 24px 0 24px;
    box-sizing: border-box;
    background: var(--bg-color-3);
    .card_btn {
      display: flex;
      position: absolute;
      top: 16px;
      right: 12px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      .icon-guiji {
        font-size: 16px;
      }
    }
  }
  /deep/.CusImagesPager {
    min-height: calc(100vh - 244px) !important;
    padding: 0 2px;
    // height: 677px;
  }
  /deep/.CusImagesPager_item {
    // min-height: 219px;
    background: var(--bg-color-2) !important;
    position: relative;
    cursor: pointer;
    box-shadow: 1px -1px 12px 1px rgba(1, 47, 142, 0.08);
  }
  /deep/.CusImagesPager_item_main {
    padding: 16px 16px 10px 16px !important;
  }
  /deep/.CusImagesPager_item_main_info_item {
    display: flex;
  }
  /deep/ .CusImagesPager_item_main_info_item:last-child {
    height: 0.24rem !important;
  }
  // /deep/.CusImagesPager_item_main_info_item .label {
  //   width: 70px !important;
  // }
  /deep/.el-image {
    width: 133px !important;
    height: 167px !important;
    img {
      width: 133px !important;
      height: 167px !important;
    }
  }
  /deep/.pagination{
    padding: 0 16px;
  }
}
.table-content-wrap {
  padding: 0 16px;
}
// /deep/.data_center_detail .el-dialog__wrapper .el-dialog{
//   top: 200px !important;
// }
.content_box{
  position: relative;
  height: 536px;
  display: flex;
  .left_box{
    width: 180px;
    height: 100%;
    background-color: var(--bg-color-2);
    .labelList_box{
      padding-top: 16px;
      .labelList{
        .item{
          cursor: pointer;
          font-size: 16px;
          color: var(--base-text-color-1);
          padding: 7px 0 6px 23px;
        }
        .item:hover{
          background: var(--bg-leftDrawer-click);
        }
        .isSelected {
          background: var(--bg-leftDrawer-click);
        }
      }
    }
  }
  .button_box{
    position: absolute;
    right: 0px;
    bottom: 0px;
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
</style>
