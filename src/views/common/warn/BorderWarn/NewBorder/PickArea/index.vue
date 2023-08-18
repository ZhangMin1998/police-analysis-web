<template>
  <div class="PickArea">
    <ul class="PickArea_icon">
      <li @click="changeDrawer">
        <div>
          <i :class="['el-icon-edit-outline', { isActive: isActive }]"></i>
        </div>
        <div>绘制工具</div>
      </li>
      <li>
        <div><i class="el-icon-warning-outline"></i></div>
        <div>点击工具即可在地图上绘出范围。</div>
      </li>
    </ul>

    <div class="table-content-wrap anaTableN" v-show="deviceList.length">
      <template-table
        class="address_table"
        :tableData="deviceList"
        :columns="columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :jumper="false"
        :pageData="{
          curPage: pagerParams.curPage,
          pageSize: pagerParams.pageSize,
          total: pagerParams.total,
          btnRenderWidth: 50,
          pagerCount:5
        }"
        :isLoading="pagerParams.isLoading"
        @handleCurrentChange="handleCurrentChange"
      ></template-table>
    </div>

    <div class="footer"><CusButton :btnList="btnList"></CusButton></div>
  </div>
</template>

<script>
import CusButton from '@/components/BasicComponents/CusButton'
import autoTableHeight from '@/mixins/autoTableHeight'
import TemplateTable from '@/components/VisualComponents/Table'

const columns = [
  {
    label: '设备类型',
    prop: 'deviceTypeStr',
    minWidth: '50'
  },
  { label: '设备名称', prop: 'deviceName', minWidth: '50' },
  { label: '场所', prop: 'placeName', minWidth: '50' },
  { label: '地址', prop: 'placeAddress', minWidth: '50' }
]
export default {
  name: 'PickArea',
  mixins: [autoTableHeight],
  components: { CusButton, TemplateTable },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    btnList: {
      type: Array,
      default: () => []
    },
    deviceList: {
      type: Array,
      default: () => []
    },
    pagerParams: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      columns: [],
      subHeight: 640
      // btnRender: [
      //   {
      //     label: '删除',
      //     type: 'success',
      //     icon: 'icon-drop',
      //     btnEvent: this.handleDel,
      //     alt: '删除'
      //   }
      // ]
    }
  },
  created () {
    this.columns = [...columns]
  },
  methods: {
    // 删除
    handleDel (row) {
      console.log('🚀 ~ file: index.vue ~ line 83 ~ handleDel ~ row', row)
    },
    // 改变画多边形状态
    changeDrawer () {
      this.$emit('changeDrawer')
    },
    // 分页
    handleCurrentChange (curPageNum) {
      this.$emit('handleCurrentChange', curPageNum)
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1000px) and (max-width: 1365px) {
  .PickArea {
    height: calc(100vh - 510px);
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .PickArea {
    height: calc(100vh - 460px);
  }
}
@media screen and (min-width: 1920px) {
  .PickArea {
    height: calc(100vh - 460px);
  }
}

.PickArea {
  // height: calc(100vh - 460px);
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  overflow-y: auto;
  .PickArea_icon {
    & > li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      i {
        margin-right: 6px;
        &.el-icon-edit-outline {
          cursor: pointer;
          &.isActive,
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
  ::v-deep .address_table{
    .el-table .el-table__header-wrapper .el-table__header .has-gutter tr .el-table__cell .cell{
      padding-left: 12px;
    }
    .el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell .cell{
      padding-left: 12px;
    }
  }
}

.footer {
  position: absolute;
  right: 16px;
  bottom: 24px;
}
</style>
