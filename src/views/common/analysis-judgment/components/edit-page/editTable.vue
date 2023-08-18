<template>
<div class='edit_table_wrap'>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowStyle"
    :key='tableKey'
  >
    <el-table-column
      v-for='(item, index) in oldTableColumns'
      :key='newTableColumns[index].fieldNameEn'
      :prop="newTableColumns[index].fieldNameEn"
      :min-width='newTableColumns[index].fieldWidth + 78'
      :show-overflow-tooltip="true"
      :resizable="true"
      class-name='col_item'
    >
      <div slot='header' class='edit_header' slot-scope="scope">
        <i :class='[ "iconfont", typeIcon[newTableColumns[index].fieldType] ? typeIcon[newTableColumns[index].fieldType] : "" ]'></i>
        <el-input v-model.trim="newTableColumns[index].fieldNameCn" @blur='colNameChange(newTableColumns[index], scope)' maxlength='30'></el-input>
      </div>
      <template slot-scope="{ row }">
        <div class='value' :class='{ "is_link": linkInfo.text.includes(newTableColumns[index].fieldNameEn) }'>
          {{
            newTableColumns[index].fieldType === 'BIGINT' && typeof row[newTableColumns[index].fieldNameEn] === 'number' ?
              row[newTableColumns[index].fieldNameEn] : row[newTableColumns[index].fieldNameEn] || '--'
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="linkInfo.icon.length"
      label="操作"
      :width="operaWidth"
      :resizable="false"
    >
      <template>
        <div class='opera_btn'>
          <i
            v-for="(btnItem, btnIndex) in linkInfo.icon"
            :key="btnIndex"
            class="iconfont"
            :class="[btnItem.icon]"
            :title="btnItem.label"
          ></i>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div v-if='tableData.length' class="table_pagination">
    <div class="total">总数： {{ total }}</div>
    <el-pagination
      :total="listData.length"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      background
      layout="prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</div>
</template>

<script>
import Sortable from 'sortablejs'
import {
  changeFieldSortApi,
  changeFieldNameApi
} from '@/api/analysisJudgment'

const TYPE_ICON = {
  'STRING': 'icon-a-zu5742',
  'BIGINT': 'icon-a-zu5757',
  'TIMESTAMP': 'icon-a-zu5759'
}

export default {
  name: 'EditTable',
  inject: ['editModuleInfo'],
  props: {
    // 字段列表
    fieldList: {
      type: Array,
      default: () => []
    },
    // 列表数据
    listData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    // 链接信息
    linkInfo: {
      type: Object,
      default: () => {
        return {
          icon: [],
          text: []
        }
      }
    },
    recordList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      oldTableColumns: [],
      newTableColumns: [],
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示的条数
      tableData: [],
      tableKey: new Date().getTime(),
      typeIcon: Object.freeze(TYPE_ICON),
      operaWidth: 72
    }
  },
  watch: {
    fieldList: {
      handler (newVal) {
        this.tableKey = new Date().getTime()
        this.$nextTick(() => {
          this.columnDrop()
        })
        this.oldTableColumns = JSON.parse(JSON.stringify(newVal))
        this.newTableColumns = JSON.parse(JSON.stringify(newVal))
        this.newTableColumns.forEach(item => {
          item.oldFieldName = item.fieldNameCn
        })
      },
      immediate: true
    },
    currentPage: {
      handler () {
        this.setTableData()
      }
    },
    listData: {
      handler () {
        this.currentPage = 1
        this.setTableData()
      }
    },
    'linkInfo.icon.length': {
      handler (newVal) {
        if (newVal <= 2) this.operaWidth = this.formatPx(72)
        else this.operaWidth = this.formatPx(36 + newVal * 24)
      },
      immediate: true
    }
  },
  mounted () {
    this.columnDrop()
    this.setTableData()
  },
  methods: {
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    // 列进行拖拽方法
    columnDrop () {
      const wrapperTr = document.querySelector('.edit_table_wrap .el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        draggable: '.col_item',
        animation: 180,
        delay: 0,
        onEnd: evt => {
          if (evt.oldIndex === evt.newIndex) return
          let beforeIndex = evt.oldIndex
          let afterIndex = evt.newIndex
          if (evt.oldIndex > evt.newIndex) {
            beforeIndex = evt.newIndex
            afterIndex = evt.oldIndex
          }
          const oldItem = this.newTableColumns[evt.oldIndex]
          this.newTableColumns.splice(evt.oldIndex, 1)
          this.newTableColumns.splice(evt.newIndex, 0, oldItem)
          const changeList = this.newTableColumns.slice(beforeIndex, afterIndex + 1)
          let list = []
          changeList.forEach((item, index) => {
            list.push({
              fieldNameEn: item.fieldNameEn,
              fieldSort: beforeIndex + index
            })
          })
          changeFieldSortApi({
            containerId: +this.editModuleInfo.i,
            list: list,
            recordId: this.recordList.slice(-1)[0].id
          }).then(() => {
            this.tableKey = new Date().getTime()
            this.$message.success('字段顺序修改成功！')
            this.$nextTick(() => {
              this.columnDrop()
            })
          }).catch(() => {
            this.newTableColumns.splice(evt.newIndex, 1)
            this.newTableColumns.splice(evt.oldIndex, 0, oldItem)
          })
        }
      })
    },
    colNameChange (item) {
      if (item.fieldNameCn === item.oldFieldName) return
      if (!item.fieldNameCn) {
        item.fieldNameCn = item.oldFieldName
      } else {
        let params = new FormData()
        params.append('containerId', +this.editModuleInfo.i)
        params.append('fieldNameEn', item.fieldNameEn)
        params.append('newFieldNameCn', item.fieldNameCn)
        params.append('recordId', this.recordList.slice(-1)[0].id)
        changeFieldNameApi(params).then(() => {
          this.$message.success('字段名修改成功！')
          item.oldFieldName = item.fieldNameCn
          let newColInd = this.oldTableColumns.findIndex(col => col.fieldNameEn === item.fieldNameEn)
          if (newColInd === -1) return
          this.oldTableColumns[newColInd].fieldNameCn = item.fieldNameCn
          this.$emit('getCanEditParam', this.recordList.slice(-1)[0].id)
        }).catch(() => {
          item.fieldNameCn = item.oldFieldName
        })
      }
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    },
    setTableData () {
      this.tableData = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.listData.forEach((item, index) => {
        if (index >= start && index < end) {
          this.tableData.push(item)
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
//::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//  height: 5px !important; /* 横向滚动条 */
//}
.edit_table_wrap {
  width: 100%;
  height: 100%;
  /deep/.el-table {
    height: calc(100% - 42px);
  }
  /deep/.el-table__body-wrapper {
    height: calc(100% - 48px);
    overflow-y: auto;
  }
  /deep/.el-table__cell {
    font-weight: 400;
  }
  .edit_header {
    display: flex;
    align-items: center;
    height: 21px;
    line-height: 21px;
    i {
      font-size: 16px;
      margin-right: 8px;
    }
    .icon-a-zu5742 {
      color: #2CB5E8;
    }
    .icon-a-zu5757 {
      color: #27CC91;
    }
    .icon-a-zu5759 {
      color: #F8BC3C;
    }
    /deep/.el-input {
      .el-input__inner {
        height: 21px;
        line-height: 21px;
        border: 0;
        padding: 0;
        color: var(--base-text-color-to-666666);
      }
    }
  }
  .opera_btn {
    i {
      font-size: 16px;
      color: var(--base-text-color-to-999999);
      margin-right: 8px;
    }
  }
  .value {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  .is_link {
    color: var(--active-color);
  }
  .table_pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    .total {
      font-size: 16px;
      color: var(--base-text-color-to-666666);
    }
  }
  /deep/.el-table__empty-block {
    width: 1535px !important;
  }
}
</style>
