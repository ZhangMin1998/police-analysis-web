<template>
  <div class="Person">
    <div class="set-box">

    </div>
    <div class="main-box">
      <Loading :isLoading.sync="isLoading">
        <div class="content" v-if="labelList1.length">
          <div class="title_box">
            <span>户口信息</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList1" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                  <EllipsisPop :content="table.tableData[item.key] ? table.tableData[item.key] : '--'" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="labelList2.length">
          <div class="title_box">
            <span>户籍信息</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList2" :key="index">
                <div class="label2" style="width: 80px;" v-if="item.key === 'household_code'">{{ item.label }}</div>
                <div class="label2" v-else>{{ item.label }}</div>
                <div class="value2">
                  <EllipsisPop :content="table.tableData[item.key] ? table.tableData[item.key] : '--'" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="labelList3.length">
          <div class="title_box">
            <span>监护及家庭关系</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList3" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                  <EllipsisPop :content="table.tableData[item.key]" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="table.columns.length > 1">
          <div class="title_box">
            <span>户口迁移</span>
          </div>
          <div class="cardInfo">
            <template-table
              :isShowPagination="false"
              :tableData="table.moveData"
              :columns="table.columns"

              :pageData="table.pageData"
              :isLoading="table.loading"
              :header-row-style='() => "height: 48px"'
              :header-cell-style="() => 'background-color: rgba(255, 255, 255, .04) !important;color:#8799BF;font-size:16px;font-weight:400'"
              :newRowColor='true'
              @handleCurrentChange="handleCurrentChange"
            ></template-table>
            <!-- <TableGrid
              :haveIndex="true"
              :haveHeader="false"
              :haveFloor="false"
              :data="table.moveData"
              :tableColumns="table.columns"
            ></TableGrid> -->
          </div>
        </div>
        <div class="empty_div" v-if="isEmpty">
          <EmptyData />
        </div>
      </Loading>
    </div>
  </div>
</template>

<script>
import { dataSearchList } from '@/api/allArchives'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import TemplateTable from '@/components/VisualComponents/Table'
// import TableGrid from '@/components/VisualComponents/TableGrid'
import Loading from '@/components/VisualComponents/Loading'
import EmptyData from '@/components/BasicComponents/EmptyData'
const defaultLabel1 = [
  { label: '出生地：', key: 'birth_province'},
  { label: '籍贯：', key: 'native_province'},
  { label: '曾用名：', key: 'previous_name'},
  { label: '身高：', key: 'height'},
  { label: '血型：', key: 'blood_group'},
  { label: '婚姻状况：', key: 'marital_status'},
  { label: '文化程度：', key: 'culture'},
  { label: '宗教信仰：', key: 'faith'},
  { label: '兵役状况：', key: 'military_service '},
  { label: '工作单位：', key: 'company_name'},
  { label: '职业：', key: 'occupation'},
  { label: '手机：', key: 'phone'},
]
const defaultLabel2 = [
  { label: '户口类型：', key: 'city_classify_code'},
  { label: '户号：', key: 'household_code'},
  { label: '与户主关系：', key: 'household_relationship'},
  { label: '社区居委会：', key: 'community_village_committee_code'}
]
const defaultLabel3 = [
  { label: '监护人1：', key: 'guardian1_name'},
  { label: '监护人2：', key: 'guardian2_name'},
  { label: '父亲：', key: 'father_name'},
  { label: '母亲：', key: 'mother_name'},
  { label: '配偶：', key: 'spouse_name'}
]
const defaultColumns = [
  { label: '迁出地', prop: 'emigration_address', minWidth: '220', type: 'nor', },
  // { label: '序号',width: '80', type: 'index' },
  { label: '迁入日期', prop: 'immigration_time', minWidth: '220', type: 'nor', },
  { label: '迁入原因', prop: 'immigration_reason', minWidth: '220', type: 'nor', },
  { label: '迁入地', prop: 'immigration_address', minWidth: '220', type: 'nor', },
  { label: '迁出日期', prop: 'emigration_time', minWidth: '220', type: 'nor', },
  { label: '迁出原因', prop: 'emigration_reason', minWidth: '220', type: 'nor', }
]
export default {
  components: {
    EllipsisPop,
    TemplateTable,
    Loading,
    EmptyData
  },
  data () {
    return {
      isEmpty: false,
      isLoading: false,
      isShowSetting: true,
      labelList1: [],
      labelListData1: {
        birth_province: '山东省荣成市',
        native_province: '山东省荣成市',
        previous_name: '李青',
        height: '174cm',
        blood_group: 'AB型',
        marital_status: '未婚',
        culture: '本科',
        faith: '共产主义',
        military_service: '未服兵役',
        company_name: 'XXXXXX深圳科技有限公司',
        occupation: '人力资源专员'
      },
      labelList2: [],
      labelListData2: {
        city_classify_code: '农业户口',
        household_code: '5501004175',
        household_relationship: '父子',
        community_village_committee_code: '乳山市XX居委会'
      },
      labelList3: [],
      labelListData3: {
        guardian1_name: '孙林汐（888888888888888888）',
        guardian2_name: '江娅楠（888888888888888888）',
        father_name: '温雅琳（888888888888888888）',
        mother_name: '张建国（888888888888888888）',
        spouse_name: '王馨（888888888888888888）'
      },
      table: {
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        loading: false,
        tableData: [
          {
            id: 1,
            emigration_address: '山东省荣城市',
            immigration_address: '山东省荣城市',
            immigration_time: '2022/8/25 10:05:22',
            emigration_time: '2022/8/25 10:05:22',
            immigration_reason: '某某某某',
            emigration_reason: '某某某某',
          },
          {
            id: 2,
            emigration_address: '山东省荣城市',
            immigration_address: '山东省荣城市',
            immigration_time: '2022/8/25 10:05:22',
            emigration_time: '2022/8/25 10:05:22',
            immigration_reason: '某某某某',
            emigration_reason: '某某某某',
          },
          {
            id: 3,
            emigration_address: '山东省荣城市',
            immigration_address: '山东省荣城市',
            immigration_time: '2022/8/25 10:05:22',
            emigration_time: '2022/8/25 10:05:22',
            immigration_reason: '某某某某',
            emigration_reason: '某某某某',
          }
        ],
        moveData: [], // 户口迁移表格数据
        allData: [],
        columns: []
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    showSetting () {
      this.isShowSetting = !this.isShowSetting
    },
    getData () {
      this.isLoading = true
      let mData = {
        cerNumber: this.$route.query.cerNumber,
        tableName: 'population_permanent'
      }
      dataSearchList(mData).then(res => {
        // console.log(res)
        if (res.code === 1) {
          if (!res.header || !res.records.length) {
            this.isEmpty = true
            return
          }
          for (let i = 0; i < res.header.length; i++) {
            defaultLabel1.forEach(item => {
              if (item.key === res.header[i].fieldNameEn) {
                this.labelList1.push(item)
              }
            })
            defaultLabel2.forEach(item => {
              if (item.key === res.header[i].fieldNameEn) {
                this.labelList2.push(item)
              }
            })
            defaultLabel3.forEach(item => {
              if (item.key === res.header[i].fieldNameEn) {
                this.labelList3.push(item)
              }
            })
            defaultColumns.forEach(item => {
              if (item.prop === res.header[i].fieldNameEn) {
                this.table.columns.push(item)
              }
            })
          }
          if (!this.labelList1.length && !this.labelList2.length && !this.labelList3.length && !this.table.columns.length) {
            this.isEmpty = true
            return
          }
          this.table.columns.splice(1,0,{ label: '序号',width: '100', type: 'index' })
          if (res.records.length) {
            this.table.tableData = res.records[0]
            if (!this.table.tableData.guardian1_name && !this.table.tableData.guardian1_identity_card) {
              this.table.tableData.guardian1_name = '--'
            } else {
              this.table.tableData.guardian1_name = (this.table.tableData.guardian1_name ? this.table.tableData.guardian1_name : '--') + ( this.table.tableData.guardian1_identity_card ? '(' + this.table.tableData.guardian1_identity_card + ')' : '(--)')
            }
            if (!this.table.tableData.guardian2_name && !this.table.tableData.guardian2_identity_card) {
              this.table.tableData.guardian2_name = '--'
            } else {
              this.table.tableData.guardian2_name = (this.table.tableData.guardian2_name ? this.table.tableData.guardian2_name : '--') + ( this.table.tableData.guardian2_identity_card ? '(' + this.table.tableData.guardian2_identity_card + ')' : '(--)')
            }
            if (!this.table.tableData.father_name && !this.table.tableData.father_identity_card) {
              this.table.tableData.father_name = '--'
            } else {
              this.table.tableData.father_name = (this.table.tableData.father_name ? this.table.tableData.father_name : '--') + ( this.table.tableData.father_identity_card ? '(' + this.table.tableData.father_identity_card + ')' : '(--)')
            }
            if (!this.table.tableData.mother_name && !this.table.tableData.mother_identity_card) {
              this.table.tableData.mother_name = '--'
            } else {
              this.table.tableData.mother_name = (this.table.tableData.mother_name ? this.table.tableData.mother_name : '--') + ( this.table.tableData.mother_identity_card ? '(' + this.table.tableData.mother_identity_card + ')' : '(--)')
            }
            if (!this.table.tableData.spouse_name && !this.table.tableData.spouse_identity_card) {
              this.table.tableData.spouse_name = '--'
            } else {
              this.table.tableData.spouse_name = (this.table.tableData.spouse_name ? this.table.tableData.spouse_name : '--') + ( this.table.tableData.spouse_identity_card ? '(' + this.table.tableData.spouse_identity_card + ')' : '(--)')
            }
            // this.table.tableData.guardian1_name = (this.table.tableData.guardian1_name ? this.table.tableData.guardian1_name : '--') + ( this.table.tableData.guardian1_identity_card ? '(' + this.table.tableData.guardian1_identity_card + ')' : '(--)')
            // this.table.tableData.guardian2_name = (this.table.tableData.guardian2_name ? this.table.tableData.guardian2_name : '--') + ( this.table.tableData.guardian2_identity_card ? '(' + this.table.tableData.guardian2_identity_card + ')' : '(--)')
            // this.table.tableData.father_name = (this.table.tableData.father_name ? this.table.tableData.father_name : '--') + ( this.table.tableData.father_identity_card ? '(' + this.table.tableData.father_identity_card + ')' : '(--)')
            // this.table.tableData.mother_name = (this.table.tableData.mother_name ? this.table.tableData.mother_name : '--') + ( this.table.tableData.mother_identity_card ? '(' + this.table.tableData.mother_identity_card + ')' : '(--)')
            // this.table.tableData.spouse_name = (this.table.tableData.spouse_name ? this.table.tableData.spouse_name : '--') + ( this.table.tableData.spouse_identity_card ? '(' + this.table.tableData.spouse_identity_card + ')' : '(--)')

            this.table.pageData.total = res.records.length
            res.records.forEach(item => {
              this.table.allData.push({
                immigration_time: item.immigration_time ? item.immigration_time : '--',
                immigration_reason: item.immigration_reason ? item.immigration_reason : '--',
                immigration_address: item.immigration_address ? item.immigration_address : '--',
                emigration_time: item.emigration_time ? item.emigration_time : '--',
                emigration_reason: item.emigration_reason ? item.emigration_reason : '--',
                emigration_address: item.emigration_addres ? item.emigration_addres : '--',
              })
            })
            this.table.moveData = this.table.allData
            // this.table.moveData = this.table.allData.slice(
            //   (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
            //   this.table.pageData.curPage * this.table.pageData.pageSize
            // )
            // console.log(this.table.moveData)
          }
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    handleCurrentChange (val) {
      this.table.moveData = this.table.allData.slice(
        (val - 1) * this.table.pageData.pageSize,
        val * this.table.pageData.pageSize
      )
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .carinfo_main {
    .flex {
      .label {
        width: 120px;
      }
      .label2 {
        width: 140px;
      }
    }
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .carinfo_main {
    .flex {
      .label {
        width: 100px;
      }
      .label2 {
        width: 120px;
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .carinfo_main {
    .flex {
      .label {
        width: 80px;
      }
      .label2 {
        width: 100px;
      }
    }
  }
}
.Person{
  .set-box{
    height: 22px;
    // margin-top: 12px;
  }
  .main-box{
    .content{
      .title_box {
        padding: 8px 8px 0px 8px;
        .el-divider--vertical {
          display: inline-block;
          width: 4px;
          height: 1em;
          margin: 0 0.04167rem 0 0;
          vertical-align: text-bottom;
          position: relative;
        }
        span {
          color: var(--base-text-color-1);
          font-size: 16px;
        }
      }
      .cardInfo{
        width: 100%;
        padding: 16px 8px 0 8px;
        box-sizing: border-box;
        overflow: hidden;
        .carinfo_main {
          font-size: 16px;
          // column-count: 3;
          display: flex;
          flex-wrap: wrap;
          .flex {
            width: 33.3%;
            display: flex;
            margin-bottom: 20px;
            .label {
              color: var(--base-text-color-6);
            }
            .label2 {
              color: var(--base-text-color-6);
            }
            .value {
              // width: 460px;
              color: var(--base-text-color-1);
            }
            .value2 {
              // width: 440px;
              color: var(--base-text-color-1);
            }
          }
        }
      }
    }
    .empty_div{
      height: 70px;
    }
  }
}
/deep/.el-table{
  height: 100% !important;
}
// /deep/ tbody .cell{
//   filter: blur(4px);
// }

</style>
