<template>
  <div class="Person">
    <div class="set-box">
      <div class="set">
        <span v-if="!isShowSetting">设置</span>
        <!-- <i class='iconfont icon-shezhi' v-if="!item.isShow"></i> -->
        <i class='iconfont icon-shezhi' :title='"设置"' @click="showSetting" v-if="isShowSetting"></i>
        <i class="el-icon-close" :title='"关闭"' @click="showSetting" v-else></i>
      </div>
    </div>
    <div class="main-box">
      <div class="content-box" v-if="isShowSetting">
        <div class="content" v-if="labelList1.length">
          <div class="title_box">
            <!-- <el-divider direction="vertical"></el-divider> -->
            <span>户口信息</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList1" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                  <EllipsisPop :content="labelListData1[item.key]" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="labelList2.length">
          <div class="title_box">
            <!-- <el-divider direction="vertical"></el-divider> -->
            <span>户籍信息</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList2" :key="index">
                <div class="label2">{{ item.label }}</div>
                <div class="value2">
                  <EllipsisPop :content="labelListData2[item.key]" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="labelList3.length">
          <div class="title_box">
            <!-- <el-divider direction="vertical"></el-divider> -->
            <span>监护及家庭关系</span>
          </div>
          <div class="cardInfo">
            <div class="carinfo_main">
              <div class="flex" v-for="(item, index) in labelList3" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="value">
                  <EllipsisPop :content="labelListData3[item.key]" :rowNum="2"></EllipsisPop>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" v-if="table.columns.length > 1">
          <div class="title_box">
            <!-- <el-divider direction="vertical"></el-divider> -->
            <span>户口迁移</span>
          </div>
          <div class="cardInfo">
            <template-table
              :isShowPagination="false"
              :tableData="table.tableData"
              :columns="table.columns"

              :pageData="table.pageData"
              :isLoading="table.loading"
              :newRowColor='true'
            ></template-table>
            <!-- <TableGrid
              :haveIndex="true"
              :haveHeader="false"
              :haveFloor="false"
              :data="table.tableData"
              :tableColumns="table.columns"
            ></TableGrid> -->
          </div>
        </div>
        <div class="empty_div" v-if="isEmpty">
          <EmptyData @openSet="openSet" />
        </div>
      </div>
      <div class="set-box" v-else>
        <div class="select-box">
          <el-checkbox v-model="checkAll1" @change="handleAllChange(1)">户口信息</el-checkbox>
          <div class="select">
            <draggable :list="checkList1" @end="dragEnd">
                <el-checkbox v-for="item in checkList1" v-model="item.value" :key="item.label" @change="handleSingleChange(1)">{{item.label}}</el-checkbox>
              </draggable>
          </div>
        </div>
        <div class="select-box">
          <el-checkbox v-model="checkAll2" @change="handleAllChange(2)">户籍信息</el-checkbox>
          <div class="select">
            <draggable :list="checkList2" @end="dragEnd">
              <el-checkbox v-for="item in checkList2" v-model="item.value" :key="item.label" @change="handleSingleChange(2)">{{item.label}}</el-checkbox>
            </draggable>
          </div>
        </div>
        <div class="select-box">
          <el-checkbox v-model="checkAll3" @change="handleAllChange(3)">监护及家庭关系</el-checkbox>
          <div class="select">
            <draggable :list="checkList3" @end="dragEnd">
              <el-checkbox v-for="item in checkList3" v-model="item.value" :key="item.label" @change="handleSingleChange(3)">{{item.label}}</el-checkbox>
            </draggable>
          </div>
        </div>
        <div class="select-box">
          <el-checkbox v-model="checkAll4" @change="handleAllChange(4)">户口迁移</el-checkbox>
            <div class="selects">
              <draggable :list="checkList4" @end="dragEnd">
                <el-checkbox v-for="item in checkList4" v-model="item.value" :key="item.label" @change="handleSingleChange(4)">{{item.label}}</el-checkbox>
              </draggable>
            </div>
        </div>
        <div class="button-box">
          <div class="btn">
            <div class='blank_button' @click="cancel">取消</div>
            <el-button type="primary" :disabled="isDisabled" @click="yes">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import TemplateTable from '@/components/VisualComponents/Table'
// import TableGrid from '@/components/VisualComponents/TableGrid'
import { getColumnList, updateCheckList } from '@/api/sysSetting'
import EmptyData from './Empty.vue'

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
  { label: '手机：', key: 'phone'}
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
    draggable,
    EllipsisPop,
    TemplateTable,
    // TableGrid,
    EmptyData
  },
  data () {
    return {
      isEmpty: false,
      isDisabled: false, // 确定按钮的禁用状态
      checkAll1: true,
      checkList1: [],
      defaultCheckList1: [],// 存下初始状态，取消后赋值
      checkAll2: true,
      checkList2: [],
      defaultCheckList2: [],// 存下初始状态，取消后赋值
      checkAll3: true,
      checkList3: [],
      defaultCheckList3: [],// 存下初始状态，取消后赋值
      checkAll4: true,
      checkList4: [],
      defaultCheckList4: [],// 存下初始状态，取消后赋值

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
        occupation: '人力资源专员',
        phone: '13888888888'
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
        columns: []
      },
      allColumns: [], // 全部的字段
    }
  },
  created () {
    this.getColumns()
  },
  methods: {
    getColumns () {
      getColumnList({tableName: 'population_permanent'}).then(res => {
        this.allColumns = res
        this.labelList1 = []
        this.labelList2 = []
        this.labelList3= []
        this.table.columns = []
        this.checkList1 = []
        this.checkList2 = []
        this.checkList3 = []
        this.checkList4 = []
        this.defaultCheckList1 = []
        this.defaultCheckList2 = []
        this.defaultCheckList3 = []
        this.defaultCheckList4 = []
        // this.isEmpty = res.every(item => {
        //   return item.archivesStatus === 'disappear'
        // })
        for (let i = 0; i < res.length; i++) {
          defaultLabel1.forEach(item => {
            if (item.key === res[i].fieldNameEn && res[i].archivesStatus === 'display') {
              this.labelList1.push(item)
            }
            if (item.key === res[i].fieldNameEn) {
              this.checkList1.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
              // 存下初始状态，取消后赋值
              this.defaultCheckList1.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
            }
          })
          defaultLabel2.forEach(item => {
            if (item.key === res[i].fieldNameEn && res[i].archivesStatus === 'display') {
              this.labelList2.push(item)
            }
            if (item.key === res[i].fieldNameEn) {
              this.checkList2.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
              // 存下初始状态，取消后赋值
              // this.defaultCheckList2 = JSON.parse(JSON.stringify(this.checkList2))
              this.defaultCheckList2.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
            }
          })
          defaultLabel3.forEach(item => {
            if (item.key === res[i].fieldNameEn && res[i].archivesStatus === 'display') {
              this.labelList3.push(item)
            }
            if (item.key === res[i].fieldNameEn) {
              this.checkList3.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
              this.defaultCheckList3.push({
                label: item.label.substring(0, item.label.length - 1),
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
            }
          })
          defaultColumns.forEach(item => {
            if (item.prop === res[i].fieldNameEn && res[i].archivesStatus === 'display') {
              this.table.columns.push(item)
            }
            if (item.prop === res[i].fieldNameEn) {
              this.checkList4.push({
                label: item.label,
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
              this.defaultCheckList4.push({
                label: item.label,
                value: res[i].archivesStatus === 'display' ? true : false,
                id: res[i].id
              })
            }
          })
        }
        if (!this.labelList1.length && !this.labelList2.length && !this.labelList3.length && !this.table.columns.length) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        this.table.columns.splice(1,0,{ label: '序号',width: '80', type: 'index' })

        this.checkAll1 = this.checkList1.every(item => {
          return item.value === true
        })
        this.checkAll2 = this.checkList2.every(item => {
          return item.value === true
        })
        this.checkAll3 = this.checkList3.every(item => {
          return item.value === true
        })
        this.checkAll4 = this.checkList4.every(item => {
          return item.value === true
        })
      })
    },
    showSetting () {
      this.isShowSetting = !this.isShowSetting
    },
    handleAllChange (index) {
      if (index === 1) {
        if (this.checkAll1) {
          this.$nextTick(() => {
            this.checkList1.forEach(item => {
              item.value = true
            })
          })
        } else {
          this.$nextTick(() => {
            this.checkList1.forEach(item => {
              item.value = false
            })
          })
        }
        // console.log(this.checkList1)
      } else if (index === 2) {
        if (this.checkAll2) {
          this.$nextTick(() => {
            this.checkList2.forEach(item => {
              item.value = true
            })
          })
        } else {
          this.$nextTick(() => {
            this.checkList2.forEach(item => {
              item.value = false
            })
          })
        }
      } else if (index === 3) {
        if (this.checkAll3) {
          this.$nextTick(() => {
            this.checkList3.forEach(item => {
              item.value = true
            })
          })
        } else {
          this.$nextTick(() => {
            this.checkList3.forEach(item => {
              item.value = false
            })
          })
        }
      } else if (index === 4) {
        if (this.checkAll4) {
          this.$nextTick(() => {
            this.checkList4.forEach(item => {
              item.value = true
            })
          })
        } else {
          this.$nextTick(() => {
            this.checkList4.forEach(item => {
              item.value = false
            })
          })
        }
      }
    },
    handleSingleChange (index) {
      if (index === 1) {
        // console.log(value, this.checkList1)
        this.checkAll1 = this.checkList1.every(item => {
          return item.value === true
        })
        // console.log(this.checkList1)
      } else if (index === 2) {
        this.checkAll2 = this.checkList2.every(item => {
          return item.value === true
        })
      } else if (index === 3) {
        this.checkAll3 = this.checkList3.every(item => {
          return item.value === true
        })
      } else if (index === 4) {
        this.checkAll4 = this.checkList4.every(item => {
          return item.value === true
        })
      }
    },
    dragEnd () { // 拖拽结束事件
      // console.log(a,b,c)
      console.log(this.checkList1)
    },
    cancel () {
      // this.showSetting()
      this.checkList1 = []
      this.checkList2 = []
      this.checkList3 = []
      this.checkList4 = []
      this.checkList1 = JSON.parse(JSON.stringify(this.defaultCheckList1))
      this.checkList2 = JSON.parse(JSON.stringify(this.defaultCheckList2))
      this.checkList3 = JSON.parse(JSON.stringify(this.defaultCheckList3))
      this.checkList4 = JSON.parse(JSON.stringify(this.defaultCheckList4))
      this.showSetting()
    },
    yes () {
      console.log(this.checkList3)
      this.isDisabled = true
      let mData = {
        tableName: 'population_permanent',
        list: []
      }
      // 添加默认要传的字段
      this.allColumns.forEach(item => {
        if (item.fieldNameEn === "cer_number") { // 证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "name") { // 姓名
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "gender") { // 性别
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "nation") { // 民族
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "birth_time") { // 出生日期
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "guardian1_identity_card") { // 监护人1证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "guardian2_identity_card") { // 监护人2证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "father_identity_card") { // 父亲证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "mother_identity_card") { // 母亲证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else if (item.fieldNameEn === "spouse_identity_card") { // 母亲证件号码
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        }
      })

      this.checkList1.forEach(item => {
        if (item.value) {
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else {
          mData.list.push({
            id: item.id,
            archivesStatus: 'disappear'
          })
        }
      })
      this.checkList2.forEach(item => {
        if (item.value) {
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else {
          mData.list.push({
            id: item.id,
            archivesStatus: 'disappear'
          })
        }
      })
      this.checkList3.forEach(item => {
        if (item.value) {
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else {
          mData.list.push({
            id: item.id,
            archivesStatus: 'disappear'
          })
        }
      })
      this.checkList4.forEach(item => {
        if (item.value) {
          mData.list.push({
            id: item.id,
            archivesStatus: 'display'
          })
        } else {
          mData.list.push({
            id: item.id,
            archivesStatus: 'disappear'
          })
        }
      })
      updateCheckList(mData).then(res => {
        if (res) {
          this.$messageTip.success('提交成功！')
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showSetting()
        this.getColumns()
        this.isDisabled = false
      })
      this.getColumns()
    },
    openSet () {
      this.showSetting()
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
    height: 24px;
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    .set{
      width: 100%;
      span{
        margin-left: 8px;
        color: var(--base-text-color-1);
        float: left;
      }
      i{
        float: right;
        font-size: 16px;
        cursor:pointer
      }
    }
  }
  .main-box{
    .content-box{
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
                color: @font-color-2;
              }
              .label2 {
                color: @font-color-2;
              }
              .value {
                // width: 460px;
                color: @font-color-1;
                filter: blur(4px);
                user-select: none;
              }
              .value2 {
                // width: 440px;
                color: @font-color-1;
                filter: blur(4px);
                user-select: none;
              }
            }
          }
        }
      }
    }
    /deep/.el-table{
      height: 100% !important;
    }
    .empty_div{
      height: 70px;
    }
    .set-box{
      height: 100%;
      margin: 16px 8px;
      display: block;
      .select-box{
        margin-bottom: 28px;
        .select{
          width: calc(100vw - 300px);
          display: flex;
          flex-wrap: wrap;
          .el-checkbox{
            width: 400px;
            margin-left: 24px;
            margin-top: 16px;
          }
        }
        .selects{
          margin-left: 24px;
          .el-checkbox{
            margin-top: 16px;
          }
        }
      }
      .button-box{
        // flex: none;
        // margin: 0 24px 24px 0;
        .btn {
          display: flex;
          justify-content: flex-end;
          .blank_button {
            display: inline;
            margin-right: 16px;
          }
        }
        &.is_position {
          position: absolute;
          right: 0;
        }
        ::v-deep .el-button--primary {
          background: var(--active-color) !important;
          border: 0;
          &:hover {
            background: #5281FD !important;
            border-color: #5281FD !important;
          }
        }
      }
    }
  }
}
/deep/ tbody .cell{
  filter: blur(4px);
  user-select: none;
}
// /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
//   border-color: rgba(192, 208, 231,0.2) !important;
//   cursor: not-allowed;
// }
///deep/.el-checkbox__input.is-checked+.el-checkbox__label {
//  color: #C0D0E7 !important;
//}

</style>
