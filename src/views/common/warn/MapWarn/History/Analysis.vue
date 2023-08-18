<template>
  <div>
    <div class="table-content-wrap my">
      <template-table
        :tableData="table.tableData"
        v-if="isCreated"
        :columns="table.columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :btnRender="table.btnRender"
        :pageData="table.pageData"
        :isLoading="table.isLoading"
        @handleCurrentChange="handleCurrentChange"
      ></template-table>
    </div>
  </div>
</template>

<script>
import { AnalysisHistoryPager } from '@/api/warn'
import TemplateTable from '@/components/VisualComponents/Table'
import dayjs from '@/utils/filters'
import autoTableHeight from '@/mixins/autoTableHeight'

const typeStr = {
  RECLUSIVE: '深居简出预警',
  FREQUENT: '频繁夜出预警',
  VESPERTINE: '昼伏夜出预警'
}

export default {
  components: {
    TemplateTable
  },
  mixins: [autoTableHeight],
  data () {
    return {
      subHeight: 280,
      isCreated: false,
      table: {
        tableData: [],
        columns: [
          {
            label: '预警时间',
            prop: 'probeTime',
            minWidth: '210',
            renderFun: function (row) {
              if (!row.probeTime) return '--'
              return dayjs.filterSS(row.probeTime)
            }
          },
          { label: '预警名称', prop: 'warnName', minWidth: '140' },
          {
            label: '预警类别',
            prop: 'warnType',
            minWidth: '100',
            type: 'nor',
            renderFun: function (row) {
              if (!row.warnType) return '--'
              return typeStr[row.warnType]
            }
          },
          { label: '预警类型', prop: 'warnAttrCode', minWidth: '100' },
          { label: '预警号码', prop: 'warnAttrValue', minWidth: '140' },
          { label: '警报级别', prop: 'warnLevel', minWidth: '140', type: 'state' },
          { label: '预警场所', prop: 'placeName', minWidth: '180' },
          { label: '场所详址', prop: 'siteAddress', minWidth: '180' }
        ],
        pageData: {
          pageSize: 10,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      AnalysisHistoryPager(this.table.params)
        .then(res => {
          this.table.isLoading = false
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
          this.isCreated = true
        })
        .catch(() => {
          this.table.isLoading = false
          this.isCreated = true
        })
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.my /deep/.pagination {
  margin-top: 0 !important;
}
</style>
