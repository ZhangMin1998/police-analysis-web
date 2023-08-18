<template>
  <div class='atlas_list_wrap'>
    <TableGrid
      :haveHeader='false'
      :haveSearchInput='false'
      :isSearchTime='false'
      :rightBtnList='[]'
      :haveIndex='true'
      :slotOpera='true'
      :tableColumns='tableColumn'
      :btnRenderWidth='"9.23%"'
      :myPageSize='13'
      :startPage='startPage'
      :url='"/configurable/srcData/list"'
      :loadingColor='"--bg-color-3"'
      :reqMethod='"post"'
      @getSpecialParams="handleBeforeLoad"
      @getDataSuccess='getDataSuccess'
    >
      <div slot='graphStandard' slot-scope="{ row }" :class='{ "wait_config": !row.graphStandard }'>
        {{ !row.graphStandard ? '待配置' : '已配置' }}
      </div>
      <div class='opera' slot='opera_btn' slot-scope="{ row }">
        <i
            class='iconfont icon-bianji'
            :class='{ "have_opacity": true }'
            title='编辑'
            v-if="dataManageIsEdit === 'false'"
          ></i>
        <i
          v-else
          class='iconfont icon-bianji'
          :class='{"have_opacity": row.status === "lock"}'
          @click='toEditor(row)'
          title='编辑'
        ></i>
        <i
          class='iconfont icon-xiangqing'
          title='详情'
          @click='$emit("toOpera", "detail", row)'
        ></i>
      </div>
    </TableGrid>
  </div>
</template>

<script>
/* 暂时使用数据导入接口调试页面 */

import TableGrid from '@/components/VisualComponents/TableGrid'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'AtlasList',
  components: {
    TableGrid
  },
  props: {
    listCurrentPage: {
      type: Number,
      default: 0
    }
  },
  data () {
    const TABLE_COLUMNS = [
      { label: '数据名称', prop: 'srcNameCn', minWidth: '18.8%' },
      { label: '状态', prop: 'graphStandard', minWidth: '21.09%', haveSlot: true },
      { label: '操作时间', prop: 'graphUpdateTime', minWidth: '15.83%',
        renderFun (row) {
          if (!row.graphUpdateTime) return '--'
          let date = new Date(row.graphUpdateTime)
          date.setHours(date.getHours() - 14)
          return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
        }
      },
      { label: '操作人', prop: 'graphUpdateOperator', minWidth: '27.74%' }
    ]
    return {
      tableColumn: Object.freeze(TABLE_COLUMNS),
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
      req.data.fieldRules = true
      callback(req)
    },
    getDataSuccess (data, params) {
      if (params.currentPage) {
        this.startPage = params.currentPage
      }
    },
    toEditor (row) {
      if (row.status === 'lock') return
      this.$emit("toOpera", "editor", row)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.atlas_list_wrap {
  height: 100%;
  background: var(--bg-color-3);
  padding: 0 24px 24px;
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
  .wait_config {
    color: var(--record-atlas-color);
  }
}
/deep/.table_loading {
  height: calc(100%);
  .w_table_wrap {
    height: calc(100% - 48px);
  }
}
/deep/.w_table_floor {
  margin-top: 16px;
}
</style>
