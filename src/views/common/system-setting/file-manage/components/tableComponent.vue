<template>
  <div class="TableCom">
    <div class="set-box">
      <div class="set">
        <span v-if="!isShowSetting">设置</span>
        <i class='iconfont icon-shezhi' :title='"设置"' @click="showSetting" v-if="isShowSetting"></i>
        <i class="el-icon-close" :title='"关闭"' @click="showSetting" v-if="!isShowSetting"></i>
      </div>
    </div>
    <!-- <div>{{column}}</div> -->
    <div class="main-box">
      <div class="cardInfo" v-if="isShowSetting">
        <Loading :isLoading.sync="isLoading" :loadingBg='loadingBg'>
          <div v-if="table.columns.length">
            <template-table
              :isShowPagination="true"
              :tableData="table.tableData"
              :columns="table.columns"

              :pageData="table.pageData"
              :isLoading="false"
              :newRowColor='true'
            ></template-table>
            <!-- <TableGrid
              :haveIndex="true"
              :haveHeader="false"
              :haveFloor="true"
              :data="table.tableData"
              :tableColumns="table.columns"
              :dataTotal="5"
            ></TableGrid> -->
          </div>
          <div class="empty_div" v-else>
            <EmptyData @openSet="openSet"/>
          </div>
        </Loading>
      </div>
      <div class="cardInfo" v-else>
        <div class="select-box">
          <el-checkbox v-model="checkAll" @change="handleAllChange()">全部</el-checkbox>
          <div class="select">
            <draggable :list="checkList" @end="dragEnd">
                <el-checkbox v-for="item in checkList" v-model="item.value" :key="item.label" @change="handleSingleChange()">{{item.label}}</el-checkbox>
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
import TemplateTable from '@/components/VisualComponents/Table'
// import TableGrid from '@/components/VisualComponents/TableGrid'
import EmptyData from './Empty.vue'
import Loading from '@/components/VisualComponents/Loading'
import { getColumnList, updateCheckList } from '@/api/sysSetting'
import { mapState } from 'vuex'
export default {
  components: {
    TemplateTable,
    EmptyData,
    draggable,
    Loading
  },
  props:{
    value: {
      type: String
    }
    // columns: {
    //   type: Array,
    //   default: () => []
    // },
  },
  data () {
    return {
      isDisabled: false, // 确定按钮的禁用状态
      isLoading: false,
      checkAll: true,
      checkList: [
        // { label: '姓名', value: true},
        // { label: '性别', value: true},
        // { label: '身份证', value: true},
        // { label: '手机', value: true},
        // { label: '居住地址', value: true}
      ],
      defaultCheclList: [],
      isShowSetting: true,
      rowHeight: 52,
      table: {
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 5
        },
        tableData: [
          {
            defaultValue: '某某某某某'
          },
        ],
        columns: []
      }
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    loadingBg () {
      if (this.theme === 'light') {
        return '#f1f2f5'
      } else {
        return '#192035'
      }
    }
  },
  created () {
    this.getColumns()
    for(let i = 0; i < 4; i++) {
      this.table.tableData.push(this.table.tableData[0])
    }
  },
  methods: {
    openSet () {
      this.showSetting()
    },
    showSetting () {
      this.isShowSetting = !this.isShowSetting
    },
    getColumns () {
      this.isLoading = true
      getColumnList({tableName: this.value}).then(res => {
        // console.log('***************', res)
        res.forEach(item => {
          if (item.archivesStatus === 'disappear') {
            this.checkAll = false
          }
          this.checkList.push({
            label: item.fieldNameCn,
            value: item.archivesStatus === 'display' ? true : false,
            id: item.id
          })
          this.defaultCheclList.push({ // 存下初始状态，取消后赋值
            label: item.fieldNameCn,
            value: item.archivesStatus === 'display' ? true : false,
            id: item.id
          })
          if (item.archivesStatus === 'display') {
            if (item.attrType === 'transformation_picture_multiple' || item.attrType === 'transformation_picture') {
              this.rowHeight = 80
              this.table.columns.push({
                label: item.fieldNameCn,
                prop: item.fieldNameEn,
                minWidth: '220',
                type: 'img',
                haveSlot: true
              })
            } else {
              this.table.columns.push({
                label: item.fieldNameCn,
                prop: 'defaultValue',
                minWidth: '220',
                type: 'nor'
              })
            }
          }
        })
        if (this.table.columns.length) {
          let temp = this.table.columns.pop()
          this.table.columns.splice(0,0,temp)
          this.table.columns.splice(1,0,{ label: '序号',width: '80', type: 'index' })
        }
        this.isLoading = false
      })
    },
    dragEnd () {

    },
    handleAllChange () {
      if (this.checkAll) {
        this.checkList.forEach(item => {
          item.value = true
        })
      } else {
        this.checkList.forEach(item => {
          item.value = false
        })
      }
    },
    handleSingleChange () {
      this.checkAll = this.checkList.every(item => {
        return item.value === true
      })
    },
    cancel () {
      this.checkList = []
      this.checkList = this.defaultCheclList
      this.showSetting()
    },
    yes () {
      // console.log(this.checkList)
      this.isDisabled = true
      let mData = {
        tableName: this.value,
        list: []
      }
      this.checkList.forEach(item => {
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
      // console.log(mData)
      updateCheckList(mData).then(res => {
        // console.log(res)
        if (res) {
          this.$messageTip.success('提交成功！')
          this.checkList = []
          this.defaultCheclList = []
          this.table.columns = []
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showSetting()
        this.getColumns()
        this.isDisabled = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.TableCom{
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
    .cardInfo{
      // width: 100%;
      padding: 16px 8px 0 8px;
      box-sizing: border-box;
      overflow: hidden;
      .select-box{
        // margin-bottom: 28px;
        .select{
          margin-left: 24px;
          .el-checkbox{
            margin-top: 16px;
          }
        }
      }
      .button-box{
        // flex: none;
        // margin: 0 24px 24px 0;
        margin-top: 12px;
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
    .empty_div{
      height: 70px;
    }
  }
}
/deep/.el-table{
  height: 100% !important;
}
/deep/.is-scrolling-left {
  height: 100% !important;
}
/deep/ tbody .cell{
  filter: blur(4px);
  user-select: none;
}
///deep/.el-checkbox__input.is-checked+.el-checkbox__label {
//  color: #C0D0E7 !important;
//}
</style>
