<template>
<div class='records_import_wrap'>
  <ImportList v-if='isShowList === "list"' :haveStartPage='haveStartPage' :listCurrentPage.sync='listCurrentPage' @toAdd='changeStatus'></ImportList>
  <AddAndEditor :row='row' @toList='changeStatus' v-else-if='isShowList === "editor"' :isGetDetail='isGetDetail' :isHandler='isHandler'></AddAndEditor>
  <DataDetail v-else-if='isShowList === "detail"' :row='row' @toList='changeStatus' :isGetDetail='isGetDetail'></DataDetail>
</div>
</template>

<script>
import ImportList from './importList.vue'
import AddAndEditor from './addAndEditor.vue'
import DataDetail from './dataDetail.vue'
import { getRecordsListApi } from '@/api/dataCenter'
export default {
  name: 'RecordsImport',
  components: {
    ImportList,
    AddAndEditor,
    DataDetail
  },
  data () {
    return {
      isShowList: 'list', // 展示的页面
      row: {}, // 当前操作行数据
      haveStartPage: false,
      listCurrentPage: 0,
      isGetDetail: false,
      isHandler: false
    }
  },
  methods: {
    changeStatus (bool, row = {}, startPage = false) {
      if (row.srcNameEn) {
        this.getRecordsDetail(row.srcNameEn, bool, startPage)
        this.isHandler = true
      } else {
        this.row = {}
        this.isHandler = false
        this.isGetDetail = false
      }
      this.isShowList = bool
      this.haveStartPage = startPage
      this.$emit('changeShowTab', bool === 'list' ? true : false)
    },
    getRecordsDetail (id) {
      this.isGetDetail = false
      getRecordsListApi({
        fieldRules: true,
        srcNameEn: id
      }).then(res => {
        this.row = res.content[0] || {}
      }).catch(() => {
        this.row = {}
      }).finally(() => {
        this.isGetDetail = true
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.records_import_wrap {
  height: 100%;
}
</style>
