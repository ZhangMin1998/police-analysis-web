<template>
<div class='data_detail_wrap'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='$emit("toList", "list", {}, true)'></OperaHeader>
  <div class='wrap_content'>
    <div class='data_base_info'>
      <div class='info'>
        <div class='label'>数据名称：</div>
        <div class='value'>{{ row.srcNameCn || '--' }}</div>
      </div>
      <div class='info'>
        <div class='label'>表名称：</div>
        <div class='value'>{{ row.srcNameEn || '--' }}</div>
      </div>
      <div class='info'>
        <div class='label'>文件格式：</div>
        <div class='value'>{{ row.fileType || '--' }}</div>
      </div>
    </div>
    <el-table
      :data='detailData'
      :height='`calc(100% - ${$pxToRem(37)})`'
    >
      <el-table-column
        type="index"
        width='120'
        :label="'序号'"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="fieldNameCn"
        label="中文名"
        min-width="23.949%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="fieldNameEn"
        label="字段名"
        min-width="26.109%"
        :show-overflow-tooltip="true"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        label="类型"
        min-width="30%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.entityLabelId ?
            entityObj[+row.entityLabelId] ?
              `${entityObj[+row.entityLabelId]['entity']}：${entityObj[+row.entityLabelId]['typeCn']}` :
              '其他：STRING' :
            '其他：' + (typeObj[row.attrType] || row.attrType || '--') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="timePartition"
        label="时间分区"
        min-width="10%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.timePartition ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="partitionRange"
        label="时间分区类型"
        min-width="15%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ timeRangeOptions[row.partitionRange] || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hashPartition"
        label="哈希分区"
        min-width="10%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.hashPartition ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="partitionNumber"
        label="哈希分区数"
        min-width="15%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.partitionNumber || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mainField"
        label="主键"
        min-width="10%"
        :show-overflow-tooltip="true"
        :resizable="true"
      >
        <template slot-scope="{ row }">
          <i class='iconfont icon-yuechi' v-if='row.mainField'></i>
        </template>
      </el-table-column>
    </el-table>
<!--    <div class='total'>总数：{{ detailData.length }}</div>-->
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import { getRecImpType } from '@/api/sysSetting'
export default {
  name: 'DataDetail',
  components: {
    OperaHeader
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    isGetDetail: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const TIME_RANGE = {
      day: '天',
      week: '周',
      month: '月',
      season: '季度',
      halfOfYear: '半年',
      year: '年'
    }
    return {
      detailData: [],
      typeObj: {},
      breadcrumbList: [
        { tabName: '数据导入', canOpera: true }
      ],
      entityObj: {},
      timeRangeOptions: Object.freeze(TIME_RANGE)
    }
  },
  watch: {
    isGetDetail: {
      handler (newVal) {
        if (newVal && this.row.fileRules) {
          this.detailData = Object.values(this.row.fileRules) || []
          this.breadcrumbList = [
            ...this.breadcrumbList,
            ...[
              { tabName: this.row.srcNameCn || '' },
              { tabName: '详情' }
            ]
          ]
        }
      }
    }
  },
  created () {
    this.getType()
  },
  methods: {
    getType () {
      getRecImpType({}, '.data_detail_wrap').then(res => {
        let result = res || {}
        for (let key in result) {
          if (key + '' === '其他') {
            result[key].forEach(item => {
              this.$set(this.typeObj, item.typeEn, item.typeCn)
            })
          } else {
            result[key].forEach(item => {
              this.$set(this.entityObj, +item.entityLabelId, { typeCn: item.typeCn, entity: key })
            })
          }
        }
        // if (result['其他']) {
        //   result['其他'].forEach(item => {
        //     this.$set(this.typeObj, item.typeEn, item.typeCn)
        //     // this.typeObj[item.typeEn] = item.typeCn
        //   })
        // }
      })
    },
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.data_detail_wrap {
  height: 100%;
  .wrap_content {
    height: calc(100% - 52px);
    padding: 24px;
    background: var(--bg-color-3);
    margin-top: 1px;
    .data_base_info {
      display: flex;
      margin-bottom: 16px;
      .info {
        display: flex;
        font-size: 16px;
        line-height: 21px;
        color: var(--base-text-color-to-999999);
        margin-right: 80px;
        .value {
          color: var(--base-text-color-1);
        }
      }
    }
    .icon-yuechi {
      font-size: 16px;
      color: var(--active-color);
    }
    //.total {
    //  font-size: 16px;
    //  color: @font-color-2;
    //  line-height: 21px;
    //  margin-top: 16px;
    //}
  }
}
/deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr .el-table__cell:first-child .cell,
/deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell:first-child .cell {
  padding-left: 24px;
}
</style>
