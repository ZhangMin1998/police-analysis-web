<template>
  <div class="WarnCrowd" :style="$attrs.cusStyle">
    <div class="radio_item" v-if="isShow">
      <div>选择人员：</div>
      <el-radio-group v-model="radio" @change="handleChange">
        <span @click="handleChange(2)">
          <el-radio :label="2">指定人员</el-radio>
        </span>
      </el-radio-group>
    </div>

    <div class="radio_item">指定人员列表</div>

    <div class="table_box">
      <div class="table-content-wrap anaTableN">
        <template-table
          :tableData="tableData"
          :columns="columns"
          :tableHeight="'calc(100% - 46px)'"
          :rowHeight="rowHeight"
          :pageData="{
            total,
            curPage,
            pageSize: params.pageSize,
            btnRenderWidth: 60
          }"
          :isLoading="tableLoading"
          :btnRender="btnRender"
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </div>
    </div>

    <div class="WarnCrowd-footer"><slot></slot></div>
  </div>
</template>

<script>
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'

// import { queryPersonListByPersonIds } from '@/api/warn'
// import TrackVue from '../MapWarn/History/Track.vue'
const columns = [
  // { label: '类型', prop: 'personTypeName', minWidth: '90' },
  { label: '证件号码', prop: 'cerNumber' },
  { label: '姓名', prop: 'name', minWidth: '90' },
  { label: '证件类型', prop: 'cerTypeName', minWidth: '80' }

]
Object.freeze(columns)
export default {
  name: 'WarnCrowd',
  components: {
    TemplateTable
  },
  mixins: [autoTableHeight],
  props: {
    idsStr: {
      type: String,
      default: ''
    },
    subHeight: {
      type: Number,
      default: 590
    },
    isShow: { //选择人员单选框不显示
      type: Boolean,
      default: true
    },
    personList: {
      type: Array,
      default: () => []
    },
    warnPersonList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      radio: 2,
      params: {
        pageNum: 1,
        pageSize: 1000,
        personIds: ''
      },
      curPage: 1,
      total: 0,
      columns: columns,
      tableLoading: false,
      tableData: [],
      rowNum: 20,
      btnRender: [
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-delete',
          btnEvent: this.delete,
          alt: '删除'
        }
      ],
      personIdList: []
    }
  },

  watch: {
    personList: {
      handler: function (newValue) {
        // console.log(newValue)
        if (!newValue.length) {
          this.tableData = []
          this.total = 0
        } else {
          let mData = []
          newValue.forEach(item => {
            let obj = {
              cerType: item.cerType, // 后台没有返回这种类型，直接写死，因为是选人的
              cerTypeName: item.cerTypeName,
              cerNumber: item.cerNumber,
              name:item.name
            }
            mData.push(obj)
          })
          this.loadTable(mData)
        }
      },
      immediate: true, //关键
      deep: true
    },
    warnPersonList: {
      handler: function (newValue) {
        if (!newValue.length) {
          this.tableData = []
          this.total = 0
        } else {
          let mData = []
          newValue.forEach(item => {
            let obj = {
              cerNumber: item.cerNumber,
            }
            mData.push(obj)
          })
          // console.log(6666)
          this.loadTable(mData)
        }
      },
      immediate: true, //关键
      deep: true
    }
  },

  methods: {
    loadTable (mData) {
      this.tableData = [...mData]
      this.$emit('selectPerson', this.tableData)
      this.total = mData.length
      // this.tableLoading = true
      // queryPersonListByPersonIds(mData)
      //   .then(res => {
      //     this.tableData = [...res.content]
      //     this.$emit('selectPerson', this.tableData)
      //     this.total = res.totalSize
      //   })
      //   .finally(() => {
      //     this.tableLoading = false
      //   })
    },
    // 单选框切换
    handleChange (e) {
      this.$emit('selectPersonnel', e)
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getList()
    },
    delete (row) {
      const index = this.tableData.findIndex(_c => _c.cerNumber === row.cerNumber)
      if (index !== -1) {
        this.tableLoading = true
        this.tableData.splice(index, 1)
        this.total = this.tableData.length || 0
        setTimeout(() => {
          this.tableLoading = false
        }, 200)

        this.$emit('handleDelete', row.cerNumber)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .WarnCrowd {
    height: calc(100vh - 510px);
  }
  /deep/ .table-wrapper {
    width: max-content !important;
    overflow-x: auto !important;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .WarnCrowd {
    height: calc(100vh - 460px);
  }
}
@media screen and (min-width: 1920px) {
  .WarnCrowd {
    height: calc(100vh - 460px);
    width: 348px !important;
  }
}
.WarnCrowd {
  position: relative;
  // height: calc(100vh - 460px);
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  .radio_item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    margin-bottom: 14px;
  }
  .table_box{
    overflow:scroll;
    //width: 330px !important;
    height: calc(100% - 42px);
    .table-content-wrap {
      height: 100%;
      /deep/.table-wrapper {
        height: 100%;
      }
    }
  }
}

/deep/.table-wrapper .el-table thead tr {
  height: 32px !important;
}

.WarnCrowd-footer {
  position: absolute;
  right: 16px;
  bottom: 16px;
}
</style>
