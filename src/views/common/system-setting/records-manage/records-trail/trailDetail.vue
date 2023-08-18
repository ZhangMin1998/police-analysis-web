<template>
<div class='trail_detail_wrap'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='$emit("toList", "list", {})'></OperaHeader>
  <div
    class='detail_table'
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$themeColor('--loading-color-1')"
  >
    <el-table
      :data='detailData'
      :height='"100%"'
    >
      <el-table-column
        type="index"
        width='120'
        :label="'序号'"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="personName"
        label="人/物"
        min-width="14.05%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="image"
        label="图片"
        min-width="13%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="timeName"
        label="时间"
        min-width="14.05%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="placeName"
        label="地点"
        min-width="25.48%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        min-width="13%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="latitude"
        label="纬度"
        min-width="13%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import { getTrailDetail } from '@/api/sysSetting'
export default {
  name: 'TrailDetail',
  components: {
    OperaHeader
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      breadcrumbList: [
        { tabName: '数据轨迹', canOpera: true }
      ],
      detailData: [],
      loading: true
    }
  },
  created () {
    this.breadcrumbList = [
      ...this.breadcrumbList,
      ...[
        { tabName: this.row.srcNameCn || '' },
        { tabName: '详情' }
      ]
    ]
  },
  mounted () {
    if (this.row.id) {
      this.getData(this.row.id)
    } else {
      this.loading = false
    }
  },
  methods: {
    getData (id) {
      getTrailDetail({
        srcId: id
      }).then(res => {
        this.detailData = res || []
        this.detailData.forEach(item => {
          item['personName'] = item.attrField?.fieldNameCn || '--'
          item['timeName'] = item.timeField?.fieldNameCn || '--'
          item['placeName'] = item.placeField?.fieldNameCn || '--'
          item['longitude'] = item.longitudeField?.fieldNameCn || '--'
          item['latitude'] = item.latitudeField?.fieldNameCn || '--'
          item['image'] = item.imageField?.fieldNameCn || '--'
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.trail_detail_wrap {
  height: 100%;
  .detail_table {
    height: calc(100% - 52px);
    padding: 24px;
    background: var(--bg-color-3);
    margin-top: 1px;
  }
}
/deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr .el-table__cell:first-child .cell,
/deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell:first-child .cell {
  padding-left: 24px;
}
</style>
