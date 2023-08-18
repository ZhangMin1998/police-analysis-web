<template>
  <div class="carAtlas">
    <header>
      <div class="title-box">
        <div class="set">
          <img :src="require('@/assets/img/title-header.png')" alt="" />
          <div>车辆图集</div>
        </div>
        <div class="back-box" @click="$router.go(-1)">
          <i class="iconfont icon-fanhui"></i>
          <span>返回</span>
        </div>
      </div>
    </header>
    <main class="table-main">
      <div class="titlePanel">
        <div class="label">车牌：</div>
        <div class="value">
          {{ $route.query.carNumber || '--' }}
        </div>
      </div>
      <div class="picks">
        <QuickTimeSelect
          :type="type"
          :pStartTime.sync="condition.startTime"
          :pEndTime.sync="condition.endTime"
          @timeChange="timeChange"
        ></QuickTimeSelect>
      </div>
      <CarAtlasPager
        :list="table.tableData"
        :columns="table.columns"
        :pageData="table.pageData"
        :isLoading="table.isLoading"
        @handleCurrentChange="handleCurrentChange"
      >
      </CarAtlasPager>
    </main>
  </div>
</template>

<script>
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
import { getCarAtlas } from '@/api/allArchives'
import CarAtlasPager from '@/components/BasicComponents/carImagesPager/carAtlasPager'
// import PageHeader from '@/components/BasicComponents/PageHeader'
// import BackPrevious from '@/components/VisualComponents/BackPrevious/index.vue'

export default {
  name: 'carAtlas',
  components: {
    CarAtlasPager,
    // PageHeader,
    QuickTimeSelect,
    // BackPrevious
  },
  data () {
    return {
      type: "carAtlas",
      params: {
        cerNumber: this.$route.query.cerNumber
      },
      titlePanel: {},
      table: {
        columns: [
          { "prop": "image", "type": "img", "show": true },
          { "label": "场所", "prop": "placeName", "show": true },
          { "label": "进场时间", "prop": "time", "inOut": "IN", "show": true },
          // { "label": "出场时间", "prop": "time", "inOut":"OUT"}
        ],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        isLoading: true
      },
      condition: {
        carNumber: '',
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 12
      }
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    // 初始化默认查询
    initialize () {
      const start = new Date();
      let startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      let endTime = Date.now()
      this.condition.startTime = startTime
      this.condition.endTime = endTime
      this.condition.carNumber = this.$route.query.carNumber
      this.getTable()

      // getInfoById(this.params).then(res => {
      //   console.log(res)
      //   // this.titlePanel = JSON.parse(JSON.stringify(res))
      //   return res.carNumber
      // }).then(() => {
      //   this.getTable()
      // })
    },

    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      getCarAtlas(this.condition).then(res => {
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
      this.condition.carNumber = this.$route.query.carNumber
      this.getTable()
    },
    timeChange () {
      if (!this.searchRules()) return
      this.getTable()
    },
    // carAtlasDate (item) {
    //   this.condition.startTime = item.startTime
    //   this.condition.endTime = item.endTime
    //   if (!this.searchRules()) return
    //   this.getTable()
    // },
    //  校验查询参数
    searchRules () {
      if (this.condition.endTime - this.condition.startTime > 7776000000) {
        this.$messageTip.error('起止时间不能超过90个自然日！')
        return false
      }
      return true
    },
    reback () {
      this.$router.push({ name: 'carFile' })
    }
  }
}
</script>

<style lang="less"  scoped>
.carAtlas {
  height: calc(100vh - 100px);
  .title-box {
    height: 60px;
    background: var(--bg-color-1);
    flex: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 24px;
    box-sizing: border-box;
    .set {
      display: flex;
      color: var(--base-text-color-1);
      font-size: 18px;
      line-height: 24px;
      font-weight: bold;
      align-items: center;
      img {
        margin-right: 5px;
        width: 18px;
        height: 18px;
      }
    }
    .back-box {
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--primary-menu-text-color);
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: var(--base-text-color-1);
      }
    }
  }

  .table-main {
    background: var(--bg-color-3);
    overflow: hidden;
    margin-top: 2px;
    padding: 0px 24px;
    box-sizing: border-box;
    .titlePanel {
      display: flex;
      align-items: center;
      width: 100%;
      height: 46px;
      box-sizing: border-box;
      font-size: 16px;
      .label {
        color: var(--base-text-color-to-999999);
      }
      .value {
        font-weight: 400;
        color: var(--base-text-color-1);
      }
    }
    .picks {
      display: flex;
    }
    /deep/.colItem-label {
      width: 80px;
    }
    /deep/.el-image {
      height: 135px;
      width: 240px;
    }
  }
}
/deep/.pagination {
  margin-top: 29px !important;
}
/deep/.carAtlasPager {
  min-height: calc(100vh - 370px) !important;
}
// /deep/ .carAtlasPager_item{

// }
</style>
