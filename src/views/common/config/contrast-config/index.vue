<template>
  <div class="test">
    <span slot="title" class="dialog-title">
      <div class="rule-content">
        <list-title title="配置匹配" />
      </div>
    </span>

    <div class="table-content-wrap">
      <TableGrid
        :tableColumns="columns"
        :haveHeader='false'
        :haveFloor='false'
        :stripe='false'
        :url='"/autotest/config_compare/compare"'
        :spanMethod='spanMethod'
        @getSpecialParams="handleBeforeLoad"
        @getDataSuccess="loadSuccess"
      >
        <template slot='the_compare_result' slot-scope='{ row }'>
          <div :class='["result", row.the_compare_result ? "green" : "red"]'>{{ row.the_compare_result }}</div>
        </template>
      </TableGrid>
    </div>
  </div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
export default {
  name: 'ContrastConfig',
  components: {
    TableGrid
  },
  data () {
    const COLUMNS = [
      { label: '模块', prop: 'module', width: 140 },
      { label: '配置名称', prop: 'conf_name', minWidth: 200 },
      { label: 'Python配置', prop: 'origin_python', minWidth: 240 },
      { label: 'Java配置', prop: 'origin_java', minWidth: 240 },
      { label: '对比结果', prop: 'the_compare_result', minWidth: 120, haveSlot: true }
    ]
    return {
      columns: COLUMNS,
      moduleObj: {}
    }
  },
  methods: {
    handleBeforeLoad (req, callback) {
      req.py = true
      callback(req)
    },
    loadSuccess (data, params, callback) {
      let arr = []
      data.forEach(item => {
        // item.module_conf?.forEach(conf => {
        //   conf['module'] = item.module
        //   arr.push(conf)
        // })
        if (item.module_conf && item.module_conf.length) {
          item.module_conf[0].module = item.module
          this.$set(this.moduleObj, item.module, item.module_conf.length)
          arr = [...arr, ...item.module_conf]
        }
      })
      callback(arr)
    },
    spanMethod ({ row, columnIndex }) {
      if (columnIndex === 0) {
        if (row.module && this.moduleObj[row.module]) {
          return {
            rowspan: this.moduleObj[row.module],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }

        // if (row.module === 'project') {
        //   return {
        //     rowspan: 3,
        //     colspan: 1
        //   }
        // } else {
        //   return {
        //     rowspan: 0,
        //     colspan: 0
        //   }
        // }
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.test {
  padding: 16px 16px 0;
  height: calc(100% - 32px);
  margin-bottom: 32px;
  background: var(--bg-color-5);
  // ::v-deep .el-table__body-wrapper {
  //   background-color: #2c384e;
  // }
  .table-content-wrap {
    margin-top: 20px;
    height: calc(100% - 52px);
  }
}
/deep/.el-table {
  height: calc(100vh - 216px);
  .el-table__body-wrapper {
    height: calc(100vh - 264px);
    overflow-y: auto;
  }
}
.result {
  &.red {
    color: #D5565E;
  }
  &.green {
    color: #3AB293;
  }
}
/deep/.table_loading {
  height: 100%;
  .w_table_wrap {
    height: 100%;
  }
}
</style>
