<template>
<div
  class='import_list_wrap'
  v-loading="loading"
  element-loading-text="同步中"
  element-loading-spinner="el-icon-loading"
>
  <TableGrid
    v-if="loadingdom"
    :haveHeader='false'
    :haveSearchInput='false'
    :isSearchTime='false'
    :rightBtnList='[]'
    :haveIndex='true'
    :slotOpera='true'
    :tableColumns='tableColumn'
    :btnRenderWidth='"9.23%"'
    :myPageSize='12'
    :startPage='haveStartPage ? startPage : 0'
    :url='"/configurable/srcData/list"'
    :loadingColor='"--bg-color-3"'
    :reqMethod='"post"'
    @getSpecialParams="handleBeforeLoad"
    @getDataSuccess='getDataSuccess'
  >
    <div class='start_table' slot='startTable' v-if="!(dataManageIsEdit!=='true')">
      <el-button type="primary" @click='$emit("toAdd", "editor")'>新建</el-button>
    </div>
    <div class='synchronous' slot='syncFlag' slot-scope="{ row }">
      <div class='tip'>{{ row.syncFlag ? '打开' : '关闭' }}</div>
      <div class='switch' @click='changeSyncFlag(row)'></div>
      <el-switch
        v-model="row.syncFlag"
        active-color="#3D6EFF"
      ></el-switch>
    </div>
    <div class='opera' slot='opera_btn' slot-scope="{ row }">
      <i
        class='iconfont icon-bianji'
        :class='{"have_opacity": true}'
        title='编辑'
        v-if="dataManageIsEdit==='false'"
      ></i>
      <i
        v-else
        class='iconfont icon-bianji'
        :class='{"have_opacity": row.status === "lock"}'
        title='编辑'
        @click='toEditor(row)'
      ></i>
      <i
        class='iconfont icon-xiangqing'
        title='详情'
        @click='$emit("toAdd", "detail", row)'
      ></i>
    </div>
  </TableGrid>
</div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
import { recImpChangeFlag } from '@/api/sysSetting'
import { mapState } from 'vuex'

export default {
  name: 'ImportList',
  components: {
    TableGrid
  },
  props: {
    haveStartPage: {
      type: Boolean,
      default: false
    },
    listCurrentPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    const TABLE_COLUMNS = [
      { label: '数据名称', prop: 'srcNameCn', minWidth: '14.13%' },
      { label: '表名称', prop: 'srcNameEn', minWidth: '25.76%' },
      { label: '导入时间', prop: 'createTime', minWidth: '15.83%',
        renderFun (row) {
          if (!row.createTime) return '--'
          return new Date(row.createTime).toLocaleString()
        }
      },
      { label: '操作人', prop: 'createOperator', minWidth: '13.84%' },
      { label: '同步', prop: 'syncFlag', minWidth: '13.9%', haveSlot: true }
    ]
    return {
      tableColumn: Object.freeze(TABLE_COLUMNS),
      loading: false,
      loadingdom: true
    }
  },
  computed: {
    ...mapState('User', {
      dataManageIsEdit:'dataManageIsEdit',
    }),
    startPage: {
      get () {
        return this.listCurrentPage
      },
      set (value) {
        this.$emit('update:listCurrentPage', value)
      }
    }
  },
  methods: {
    // 查询接口前对查询条件的一个添加
    handleBeforeLoad (req, callback) {
      req.data.fieldRules = false
      callback(req)
    },
    toEditor (row) {
      if (row.status === 'lock') return
      this.$emit('toAdd', "editor", row)
    },
    changeSyncFlag (item) {
      this.loading = true
      recImpChangeFlag({
        id: item.id,
        syncFlag: !item.syncFlag
      }).then(() => {
        // if (res) {
        //   item.syncFlag = !item.syncFlag
        // } else {
        //   this.$message.warning('同步失败！')
        // }
        item.syncFlag = !item.syncFlag
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getDataSuccess (data, params) {
      if (params.currentPage) {
        this.startPage = params.currentPage
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.import_list_wrap {
  height: 100%;
  background: var(--bg-color-3);
  padding: 0 24px 24px;
  .start_table {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  .synchronous {
    display: flex;
    .tip {
      color: var(--base-text-color-1);
      font-size: 16px;
      line-height: 21px;
      margin-right: 8px;
    }
    .switch {
      width: 32px;
      height: 21px;
      z-index: 10;
      cursor: pointer;
    }
  }
  .opera {
    i {
      font-size: 16px;
      color: var(--base-text-color-to-999999);
      cursor: pointer;
      margin-right: 8px;
    }
    .have_opacity {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
/deep/.table_loading {
  height: calc(100% - 48px);
  .w_table_wrap {
    height: calc(100% - 48px);
  }
}
/deep/.el-switch {
  position: relative;
  left: -32px;
}
/deep/.w_table_floor {
  margin-top: 16px;
}
</style>
