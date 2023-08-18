<template>
<div class='no_coordinate_wrap'>
  <div class='header'>
    <img :src='require("@/assets/img/title-header.png")' alt=''>
    <div class='title'>无坐标触警</div>
    <div class='header-right' title='折叠' @click='$emit("handleNoCoor", true)'></div>
  </div>
  <div class='warn_content'>
    <el-table
      :data='noCoordinateList'
      :row-class-name="tableRowStyle"
      height='100%'
    >
      <el-table-column
        type="index"
        width="48"
        :label="'序号'"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="triggerTrait"
        label="触警特征"
        min-width="24.93%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <div class='trigger_trait' v-if='row.triggerLabelNameEn === "avatar_url"'>
            <div class='value'>{{ row.triggerTrait + '/' }}</div>
            <el-image
              class="el-image"
              :src="origin + row.triggerAttr"
              :preview-src-list="[ origin + row.triggerAttr ]"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <img :src='$themeColor("--person-default-pic")' alt=''>
              </div>
            </el-image>
          </div>
          <span v-else>{{ row.triggerTrait ? row.triggerTrait : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="triggerTime"
        label="时间"
        min-width="22.53%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.triggerTime ? row.triggerTime : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="triggerAddress"
        label="地址"
        min-width="14.11%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.triggerAddress ? row.triggerAddress : '--' }}</span>
        </template>
      </el-table-column>
<!--      min-width="11.90%"-->
      <el-table-column
        prop="triggerRecord"
        label="触警数据"
        width='108'
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <div class='trigger ellipsis' @click='viewSource(row)'>{{ row.triggerRecord ? row.triggerRecord : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="布控名称"
        width='70'
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <div class='name ellipsis' :class='[row.controlInfo.level || ""]'>{{ row.controlInfo.name ? row.controlInfo.name : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width='44'
        :resizable="false"
        class-name="opt"
      >
        <template slot-scope="scope">
          <i class='iconfont icon-xiangqing' @click='showDetail(scope.row)' title='详情'></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
export default {
  name: 'NoCoordinateList',
  props: {
    noCoordinateList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentDataId: null
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  methods: {
    showDetail (row) {
      if (row.id !== this.currentDataId) {
        this.currentDataId = row.id
        this.$emit('handleCDetail', row)
      }
    },
    viewSource (row) {
      this.$emit('handleWarnSource', true, row, true)
    },
    tableRowStyle ({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'double-row'
      }
      return 'odd-row'
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.no_coordinate_wrap {
  width: 692px;
  height: 264px;
  padding: 16px 10px;
  background: var(--bg-color-9);
  z-index: 100;
  .header {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 24px;
    color: var(--base-text-color-1);
    margin-bottom: 16px;
    padding: 0 6px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .header-right {
      position: absolute;
      right: 10px;
      width: 16px;
      height: 16px;
      padding-top: 7px;
      cursor: pointer;
      &::after {
        display: block;
        content: '';
        width: 16px;
        height: 2px;
        background: var(--border-color-2);
      }
    }
  }
  .warn_content {
    height: calc(100% - 40px);
    .trigger {
      color: var(--active-color);
      cursor: pointer;
    }
    .icon-xiangqing {
      font-size: 12px;
      line-height: 16px;
      cursor: pointer;
      color: var(--base-text-color-to-999999);
    }
    /deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr th .cell {
      font-size: 12px;
      line-height: 16px;
      padding: 0 8px;
    }
    @media screen and (max-width: 1500px){
      /deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr th .cell {
      line-height: 18px;
    }
    @-moz-document url-prefix(){
      .el-table .el-table__header-wrapper .el-table__header .has-gutter tr th .cell {
      font-size: 16px !important;
    }
    }
    }
    /deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr .el-table__cell {
      padding: 7px 0;
      line-height: 16px;
    }
    /deep/.el-table__empty-text {
      font-size: 12px;
    }
    /deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell .cell {
      font-size: 12px;
      line-height: 14px;
      padding: 0 8px;
    }
    @media screen and (max-width: 1500px){
        /deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell .cell {
        font-size: 12px;
        line-height: 18px;
        padding: 0 8px;
      }
      @-moz-document url-prefix(){
        .el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell .cell {
      font-size: 14px !important;
    }
    }
    }

    /deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell {
      padding: 7px 0;
      line-height: 16px;
    }
  }
  .name {
    &.general {
      color: #F8BC3C;
    }
    &.normal {
      color: #62ADF4;
    }
    &.serious {
      color: #DD3F48;
    }
  }
}
.trigger_trait {
  display: flex;
  align-items: center;
  /deep/.el-image {
    margin-left: 4px;
    height: 14px;
    .image-slot {
      height: 14px;
    }
    img {
      width: 14px;
      height: 14px;
    }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
</style>
