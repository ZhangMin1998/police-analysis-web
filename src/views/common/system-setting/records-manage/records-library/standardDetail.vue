<template>
<div class='standard_detail_wrap'>
  <div class='item'>
    <div class='label'>标准：</div>
    <el-select v-model="standardId" placeholder="请选择">
      <el-option
        v-for="(value, key) in detailData"
        :key="key"
        :label="value.standardName"
        :value="key">
      </el-option>
    </el-select>

<!--    <div
      class='value'
    >{{ detail.standardName || '&#45;&#45;' }}</div>-->
  </div>
  <div class='item'>
    <div class='label'>范围：</div>
    <div class='value'>{{ detail.standardDescription || '--' }}</div>
  </div>
  <el-table
    :data='detail.dataStandardRules || []'
    :height='`calc(100% - ${$pxToRem(70)})`'
  >
    <el-table-column
      prop="standardCode"
      label="代码"
      min-width="30.05%"
      :show-overflow-tooltip="true"
      :resizable="true"
    >
      <span slot-scope='{ row }'>{{ row.standardCode || '--' }}</span>
    </el-table-column>
    <el-table-column
      prop="standardName"
      label="名称"
      min-width="35.17%"
      :show-overflow-tooltip="true"
      :resizable="true"
    >
      <span slot-scope='{ row }'>{{ row.standardName || '--' }}</span>
    </el-table-column>
    <el-table-column
      prop="standardDescription"
      label="说明"
      min-width="34.78%"
      :show-overflow-tooltip="true"
      :resizable="true"
    >
      <span slot-scope='{ row }'>{{ row.standardDescription || '--' }}</span>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: 'StandardDetail',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      standardId: ''
    }
  },
  computed: {
    detail () {
      return this.detailData[this.standardId] || {}
    }
  },
  mounted () {
    let detailKey = Object.keys(this.detailData)
    if (detailKey.length) {
      this.standardId = detailKey[0]
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.standard_detail_wrap {
  height: 694px;
  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 21px;
    color: var(--base-text-color-1);
    margin-bottom: 12px;
    .label {
      flex: none;
      color: var(--base-text-color-to-666666);
    }
    .value {
      flex: 1;
    }
  }
  /deep/.el-table {
    margin-top: 16px;
  }
  /deep/.el-input {
    height: 32px;
    line-height: 32px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
