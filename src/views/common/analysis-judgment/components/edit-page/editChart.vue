<template>
  <div class="content_box">
    <div class="left_box">
      <div class="labelList_box">
        <div class="labelList" v-for="(item, index) in labelList" :key="index">
          <div :class="['item', { isSelected: item.value === activeName }]" @click="itemClick(item)">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <component
      :is="activeName"
      :ref='activeName'
      :fieldList='fieldList'
      :listData='listData'
      :editInfo='editInfo'
    ></component>
    <div class="button_box">
      <div class='blank_button' @click='closeDialog'>取消</div>
      <el-button type="primary" @click='submit'>确定</el-button>
    </div>
  </div>
  </template>

<script>
import LineConfigChart from './components/lineConfigChart.vue'
import BarConfigChart from './components/barConfigChart.vue'
import PieConfigChart from './components/pieConfigChart.vue'
import MapConfigChart from './components/mapConfigChart.vue'
import TrackConfigChart from './components/trackConfigChart.vue'
import FunnelConfigChart from './components/funnelConfigChart.vue'
import GaugeConfigChart from './components/gaugeConfigChart.vue'
import WordcloudConfigChart from './components/wordcloudConfigChart'
import {
  addModuleModeApi,
  updateModuleModeApi
} from '@/api/analysisJudgment'

// const TEST = [
//   { label: '姓名', value: 'name', type: 'text', icon: 'icon-a-zu5742' },
//   { label: '身份证', value: 'id', type: 'number', icon: 'icon-a-zu5757' },
//   { label: '时间', value: 'time', type: 'time', icon: 'icon-a-zu5759' },
// ]

export default {
  name: 'EditChart',
  components: {
    LineConfigChart,
    BarConfigChart,
    PieConfigChart,
    MapConfigChart,
    TrackConfigChart,
    FunnelConfigChart,
    GaugeConfigChart,
    WordcloudConfigChart
  },
  inject: ['closeDialog', 'editModuleInfo', 'successOpera'],
  props: {
    // 可选择的字段
    fieldList: {
      type: Array,
      default: () => []
    },
    // 数据列表
    listData: {
      type: Array,
      default: () => []
    },
    operaPerRecordId: {
      type: Number
    },
    // 编辑信息
    editInfo: {
      type: Object
    },
  },
  data () {
    return {
      activeName: 'LineConfigChart',
      labelList: [
        {
          label: '折线图',
          value: 'LineConfigChart'
        },
        {
          label: '柱状图',
          value: 'BarConfigChart'
        },
        {
          label: '饼图',
          value: 'PieConfigChart'
        },
        {
          label: '地图',
          value: 'MapConfigChart'
        },
        {
          label: '轨迹图',
          value: 'TrackConfigChart'
        },
        {
          label: '漏斗图',
          value: 'FunnelConfigChart'
        },
        {
          label: '仪表盘',
          value: 'GaugeConfigChart'
        },
        {
          label: '词云图',
          value: 'WordcloudConfigChart'
        }
      ],
    }
  },
  mounted () {
    if (this.editInfo) {
      this.activeName = this.editInfo.displayChartType
    }
  },
  methods: {
    itemClick (item) {
      this.activeName = item.value
      /*if (item.value === 1) {
        this.activeName = 'LineConfigChart'
      } else if (item.value === 2) {
        this.activeName = 'BarConfigChart'
      } else if (item.value === 3) {
        this.activeName = 'PieConfigChart'
      } else if (item.value === 4) {
        this.activeName = 'MapConfigChart'
      } else if (item.value === 5) {
        this.activeName = 'TrackConfigChart'
      } else {
        this.activeName = ''
      }*/
    },
    submit () {
      let configChart = this.$refs[this.activeName] && this.$refs[this.activeName].formatSubmitData()
      let requestApi = addModuleModeApi
      let successTip = '添加'
      let params = {
        containerId: +this.editModuleInfo.i,
        displayChartType: this.activeName,
        displayCoordinate: JSON.stringify(configChart),
        displayType: 'chart',
        perRecordId: this.operaPerRecordId
      }
      if (this.editInfo) {
        requestApi = updateModuleModeApi
        successTip = '编辑'
        params.id = this.editInfo.id
        params.recordId = this.editInfo.recordId
      }
      requestApi(params, true).then(() => {
        this.$message.success(`${successTip}图表成功！`)
        this.successOpera()
      })
      // this.closeDialog()
    }
  }
}
</script>

<style lang='less' scoped>
  div {
    box-sizing: border-box;
  }
  .content_box{
    position: relative;
    height: 536px;
    display: flex;
    .left_box{
      width: 180px;
      height: 100%;
      background-color: var(--bg-color-2);
      .labelList_box{
        padding-top: 16px;
        .labelList{
          .item{
            cursor: pointer;
            font-size: 16px;
            color: var(--base-text-color-1);
            padding: 7px 0 6px 23px;
          }
          .item:hover{
            background: var(--bg-leftDrawer-click);
          }
          .isSelected {
            background: var(--bg-leftDrawer-click);
          }
        }
      }
    }
    .button_box{
      position: absolute;
      right: 0px;
      bottom: 0px;
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
      .blank_button {
        margin-right: 16px;
      }
    }
  }
  // .edit_chart_wrap {
  //   width: 100%;
  //   height: 100%;


  //   .floor {
  //     display: flex;
  //     justify-content: flex-end;
  //     margin-top: 32px;
  //     .blank_button {
  //       margin-right: 16px;
  //     }
  //   }
  // }
</style>
