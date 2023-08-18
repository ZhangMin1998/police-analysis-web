<template>
  <div class="carFile">
    <header v-permission="'car_archive:list'">
      <PageHeader class="searchHeader">
        <div class="searchCondition">
          <div class="searchCondition_searchKeys">
            <el-input
              class="input"
              type="text"
              v-model.trim="params.carNumber"
              @keyup.enter.native="handleSearch"
              @clear="clearEvent"
              placeholder="请输入车牌"
              clearable
            >
              <i
                slot="suffix"
                style="cursor: pointer"
                class="el-input__icon el-icon-search"
                v-debounce.prevent.stop="handleSearch"
              ></i>
            </el-input>
          </div>
        </div>
      </PageHeader>
    </header>
    <main class="table-main">
      <CarImagesPager
        :list="table.tableData"
        :columns="table.columns"
        :btnRender="table.tableData.btnRender"
        :pageData="table.pageData"
        :isLoading="table.isLoading"
        @handleCurrentChange="handleCurrentChange"
        @openDetail="openDetail"
        @openCarAtlas="openCarAtlas"
        @openCarTrail="openCarTrail"
      >
      </CarImagesPager>
    </main>

    <DialogWindow :dialogData.sync="dialogData" @beforeClose="hideDetail" @beforeOpen="showDetail">
    </DialogWindow>
  </div>
</template>

<script>
import { getInfoByCarNumber } from '@/api/allArchives'
import PageHeader from '@/components/BasicComponents/PageHeader'
import CarImagesPager from '@/components/BasicComponents/carImagesPager'
import DialogWindow from '@/components/BasicComponents/carImagesPager/dialogWindow'
import { mapState } from 'vuex'

export default {
  name: 'carFile',
  components: {
    CarImagesPager,
    DialogWindow,
    PageHeader
  },
  data () {
    return {
      isShowIcon: true,
      searchLoading: false,
      // exportLoading: false,
      params: {
        pageNum: 1,
        pageSize: 12,
        carNumber: ''
      },
      table: {
        columns: [
          { "prop": "photo", "type": "img" },
          { "label": "车牌", "prop": "carNumber" },
          // { "label": "车主", "prop": "personName" },
          // { "label": "证件类型", "prop": "cerTypeName" },
          // { "label": "证件号码", "prop": "cerNumber" },
          { "label": "属地", "prop": "attribution" },
          // { "label": "品牌", "prop": "carBrand" }
        ],
        allData: [],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        // btnRender: [
        //   {
        //     label: "详情",
        //     type: "success",
        //     icon: "icon-detail-1",
        //     btnEvent: this.openDetail,
        //     alt: "详情",
        //     show: true
        //   },
        //   {
        //     label: "车辆图集",
        //     type: "success",
        //     icon: "icon-photos-1",
        //     btnEvent: this.openCarAtlas,
        //     alt: "车辆图集",
        //     show: true
        //   },
        //   {
        //     label: "车辆图集",
        //     type: "success",
        //     icon: "icon-photos-0",
        //     // btnEvent: this.openCarAtlas,
        //     alt: "车辆图集",
        //     show: false
        //   },
        //   {
        //     label: "车辆轨迹",
        //     type: "success",
        //     icon: "icon-location-1",
        //     btnEvent: this.openCarTrail,
        //     alt: "车辆轨迹",
        //     show:true
        //   },
        //   {
        //     label: "车辆轨迹",
        //     type: "success",
        //     icon: "icon-location-0",
        //     // btnEvent: this.openCarTrail,
        //     alt: "车辆轨迹",
        //     show: false
        //   }
        // ],
        isLoading: true
      },
      dialogData: {
        show: false,
        title: '详情',
        width: '780px',
        top: '770px',
        columns: [
          // { "prop": "photo", "type": "img" },
          { "label": "车牌", "prop": "carNumber" },
          { "label": "车主", "prop": "personName" },
          { "label": "证件类型", "prop": "cerTypeName" },
          { "label": "证件号码", "prop": "cerNumber" },
          { "label": "属地", "prop": "attribution" },
          { "label": "品牌", "prop": "carBrand" },
          { "label": "车牌类型", "prop": "licenseType" },
          { "label": "车辆系列", "prop": "series" },
          { "label": "车辆型号", "prop": "carModel" },
          { "label": "车辆类型", "prop": "carType" },
          { "label": "车辆颜色", "prop": "carColor" },
          { "label": "所属单位", "prop": "affiliatedUnit" },
          { "label": "出厂日期", "prop": "releaseDate" },
          { "label": "发动机号", "prop": "engineNumber" },
          { "label": "车架号", "prop": "vin" },
          { "label": "营运类型", "prop": "operatingType" },
          { "label": "发证机关", "prop": "licenceIssuing" },
          { "label": "发动机排量", "prop": "engineCapacity" }
        ],
        data: {}
      }
    }
  },
  computed: {
    ...mapState('Common', {
      tableCurrentPage: 'tableCurrentPage'
    })
  },
  created () {
    if (this.$route.query.carNumber) {
      this.params.carNumber = this.$route.query.carNumber
    }
    if (this.tableCurrentPage) {
      for (let key in this.params) {
        this.params[key] = this.tableCurrentPage[key]
      }
      this.table.pageData.curPage = +this.params.pageNum
      this.$store.commit('Common/setTablePage', null)
    }
    this.getTable()
  },

  methods: {
    clearEvent () {
      this.$router.push({ name: 'carFile' })
      this.getTable()
    },
    // 查询
    handleSearch () {
      // if (this.params.carNumber.length < 3 || this.params.carNumber.length > 8) {
      //   this.$messageTip.error('车牌只能输入3~8个字符！')
      //   return false
      // }
      this.getTable()
    },
    // 获取 表格数据
    async getTable () {
      this.table.isLoading = true
      let res = await getInfoByCarNumber(this.params)
      this.table.allData = JSON.parse(JSON.stringify(res.content))
      this.table.pageData.total = res.totalSize

      // let carNumbers = []
      // res.content.map(item => {
      //   carNumbers.push(item.carNumber)
      // })
      // let result = await getCountByCarNumber({carNumbers: carNumbers.toString()})
      // // console.log(result)
      // for (let key in result) {
      //   this.table.allData.map(item => {
      //     if (item.carNumber === key) {
      //       if (result[key] > 0) {
      //         item.haveData = true
      //       } else {
      //         item.haveData = false
      //       }
      //     }
      //   })
      // }
      this.table.allData.map(item => {
        item.haveData = true
      })

      // 前端分页 先取前12条
      this.table.tableData = this.table.allData.slice(
        (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
        this.table.pageData.curPage * this.table.pageData.pageSize
      )
      // console.log(this.table.tableData)

      this.table.isLoading = false
      this.searchLoading = false
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.params.pageNum = val
      this.table.pageData.curPage = val
      // this.getTable()
      this.table.tableData = this.table.allData.slice(
        (val - 1) * this.table.pageData.pageSize,
        val * this.table.pageData.pageSize
      )
    },
    // 查看详情
    openDetail (item) {
      this.dialogData.data = JSON.parse(JSON.stringify(item))
      this.showDetail()
    },
    // 前往车辆图集
    openCarAtlas (item) {
      this.$store.commit('Common/setTablePage', this.params)
      this.$router.push({ name: 'carAtlas', query: { carNumber: item.carNumber, label: '车辆档案' } })
    },
    // 前往车辆轨迹
    openCarTrail (item) {
      // console.log(item)
      this.$store.commit('Common/setTablePage', this.params)
      this.$router.push({ name: 'carTrail', query: { id: item.id, carNumber: item.carNumber, cerNumber: item.cerNumber, photo: item.photo, personName: item.personName, cerTypeName: item.cerTypeName, label: '车辆档案' } })
    },
    hideDetail () {
      this.dialogData.show = false
    },

    showDetail () {
      this.dialogData.show = true
    },
  }
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 1365px) {
  /deep/.CusImagesPager-ul {
    > li {
      width: calc((100% - 50px) / 4) !important;
      margin-right: 16px !important;
      padding-top: 32px !important;
      .el-image {
        width: 100% !important;
      }
    }
    > li:nth-child(4n) {
      margin-right: 0 !important;
    }
  }
  /deep/.CusImagesPager_item {
    .CusImagesPager_item_main {
      padding: 5px 5px 0 5px;
      .CusImagesPager_item_main_info {
        line-height: 32px;
        .CusImagesPager_item_main_info_item {
          .colItem-label {
            width: 120px !important;
            font-size: 12px;
          }
          .value {
            font-size: 12px;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .table-main {
    min-height: calc(100vh - 180px);
  }
}
@media screen and (min-width: 1920px) {
  /deep/.CusImagesPager_item {
    height: 262px;
    .CusImagesPager_item_main {
      padding: 16px 14px 0 14px;
      .CusImagesPager_item_main_info {
        line-height: 22px;
        .CusImagesPager_item_main_info_item {
          .colItem-label {
            width: 45px !important;
          }
        }
      }
    }
  }
  .table-main {
    min-height: calc(100vh - 180px);
  }
}
.carFile {
  min-height: calc(100vh - 110px);
  .searchHeader {
    position: relative;
    box-sizing: border-box;
    // padding: 12px 16px;
    margin: 0;
    background-color: var(--bg-color-3);
    box-sizing: border-box;
    .searchCondition {
      display: flex;
      align-items: center;
      .searchCondition_searchKeys {
        display: flex;
        align-items: center;
        .input {
          font-size: 16px;
          width: 400px;
        }
      }
    }
  }
  .table-main {
    margin-top: 2px;
    padding: 0px 24px 0 24px;
    box-sizing: border-box;
    background: var(--bg-color-3);
    /deep/.el-image {
      height: 153px;
      width: 272px;
    }
  }
}
/deep/.CusImagesPager {
  min-height: calc(100vh - 250px) !important;
}
::v-deep .empty_div {
  height: calc(100vh - 250px) !important;
}
</style>
