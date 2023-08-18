<template>
  <div class="card">
    <div class="title-box">
      <div class='set'>
        <img :src='require("@/assets/img/set-bg.png")' alt=''>
        <div>不动产详情</div>
      </div>
      <i class="el-icon-close" @click="close" title="关闭"></i>
    </div>
    <div class="main">
      <div class="homeInfo">
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>基本信息</span>
        </div>
        <div class="content">
          <el-descriptions :column="4">
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(item, key) in basicInfoLabel"
              :key="key"
              :label="item"
            >
              <Ellipsis :wordsLength="60" :value="basicInfo[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="homeHistory">
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>房屋历史</span>
        </div>
        <div class="content">
          <template-table
            :tableData="table.tableData"
            :columns="table.columns"
            :tableHeight="((table.pageData.pageSize + 1) * 48) + 1"
            :rowHeight="48"
            :pageData="table.pageData"
            :isLoading="table.loading"
            :header-row-style='() => "height: 48px"'
            :header-cell-style="() => 'background-color: rgba(255, 255, 255, .04) !important;color:#8799BF;font-size:16px;font-weight:400'"
            :newRowColor='true'
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import TemplateTable from '@/components/VisualComponents/Table'
import { getHouseDetail } from '@/api/allArchives'

const basicInfoLabel = {
  assetsCode: '不动产证号',
  obligee: '权利人',
  cerNumber: '证件号码',
  houseUsage: '用途',
  houseArea: '面积',
  collectTime: '登记时间',
  houseAddress: '坐落'
}
export default{
  components:{
    Ellipsis,
    TemplateTable
  },
  props:{
    tipContent: {
      type: String,
      default: ''
    },
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      basicInfoLabel: [],
      params: {
        assetsCode: null,
        pageNum: 1,
        pageSize: 10
      },
      table: {
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        loading: false,
        tableData: [],
        columns: [
          {
            label: ' 查封起止时间',
            prop: 'seizureTime',
            minWidth: '20%',
            type: 'nor',
            renderFun: function (row) {
              return row.seizureTime || '--'
            }
          },
          { label: '序号', width: '100', type: 'index' },
          {
            label: ' 抵押债权人',
            prop: 'mortgage',
            minWidth: '10%',
            type: 'nor',
            renderFun: function (row) {
              return row.mortgage || '--'
            }
          },
          {
            label: ' 抵押起止时间',
            prop: 'mortgageTime',
            minWidth: '20%',
            type: 'nor',
            renderFun: function (row) {
              return row.mortgageTime || '--'
            }
          },
          {
            label: ' 查封单位',
            prop: '10%',
            minWidth: '15%',
            type: 'nor',
            renderFun: function (row) {
              return row.seizureUnit || '--'
            }
          }
        ]
      }
    }
  },
  computed: {

  },
  created (){
    this.params.assetsCode = this.basicInfo.assetsCode
    this.basicInfoLabel = basicInfoLabel
    this.getHouseDetail()
  },
  mounted () {
    document.getElementsByClassName("el-descriptions-row")[0].lastChild.lastChild.firstChild.style.width= '40px'
  },
  methods: {
    close (){
      this.$emit('close',false)
    },
    getHouseDetail () {
      this.table.loading = true
      getHouseDetail(this.params).then(res => {
        this.table.tableData = res.content
        this.table.pageData.total = res.totalSize
      }).catch(err => {
        console.log(err)
      }).finally(()=>{
        this.table.loading = false
      })
    },
    handleCurrentChange (val) {
      this.table.pageData.curPage = val
      this.params.pageNum = val
      this.getHouseDetail()
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width:1365px) {
  /deep/.el-descriptions-item__label {
    width: 120px;
  }
}
@media screen and (min-width: 1366px) and (max-width:1919px) {
  /deep/.el-descriptions-item__label {
    width: 90px;
  }
}
@media screen and (min-width: 1920px){
  /deep/.el-descriptions-item__label {
    width: 85px;
  }
}
.card{
  // z-index: 999;
  width: 100%;
  // height: 100%;
  // position: absolute !important;
  top: 0px !important;
  left: 0 !important;
  background: #1B2132 !important;
  opacity: 0.95;
  .title-box{
    flex: none;
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    margin: 0 24px 24px 16px;
    border-bottom: 1px solid var(--active-color);
    box-sizing: border-box;
    .set {
      position: relative;
      height: 24px;
      width: 130px;
      line-height: 24px;
      font-size: 18px;
      color: var(--base-text-color-1);
      font-weight: bold;
      div {
        position: absolute;
        bottom: 0;
        margin-left: 10px;
      }
      img {
        width: 65px;
        height: 8px;
        margin-top: 16px;
      }
    }
    i {
      font-size: 24px;
      cursor: pointer;
    }
  }
  .main{
    // padding: 10px 0;
    .homeInfo {
      margin: 5px 0 10px 0;
      // background: rgba(248, 248, 248, 0.04);
      .title_box{
        padding: 0 10px 0 20px;
        span{
          font-weight: bold;
          color: var(--base-text-color-1);
          font-size:16px;
        }
      }
      .content {
        // background: pink;
        padding: 10px 20px 0 20px;
        /deep/.el-descriptions-item__label {
          font-size: 16px;
          color: var(--base-text-color-to-999999);
        }
        /deep/.defaultValue {
          font-size: 16px;
          color: var(--base-text-color-1);
        }
      }
    }
    .homeHistory {
      margin: 5px 0 0px 0;
      // background: rgba(248, 248, 248, 0.04);
      .title_box{
        padding: 0 10px 10px 20px;
        span{
          font-weight: bold;
          color: var(--base-text-color-1);
          font-size:16px;
        }
      }
      .content {
        // background: pink;
        padding: 0px 20px 10px 20px;
        /deep/.el-descriptions-item__label {
          font-size: 16px;
          color: var(--base-text-color-to-999999);
        }
        /deep/.defaultValue {
          font-size: 16px;
          color: var(--base-text-color-1);
        }
      }
    }
    .el-divider--vertical {
      color: var(--base-text-color-1);
      display: inline-block;
      width: 4px;
      height: 1em;
      margin: 0 8px 0 0;
      vertical-align: text-top;
      position: relative;
    }
  }
}
::v-deep .itemStyle {
  height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
