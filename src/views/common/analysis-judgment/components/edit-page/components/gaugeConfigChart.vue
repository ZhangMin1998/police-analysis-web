<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">仪表盘</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="gaugeChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">值字段：</div>
              <div class="input_box">
                <el-select v-model="gaugeChartStyle.proportionValue" :key="2" placeholder="请选择" @change="proportionValueChange">
                  <el-option
                    v-for="(item, index) in fieldList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="set_box">
        <div class="basic_set">
          <div class="title">2、样式设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">标题显示：</div>
              <div class="input_box">
                <el-select v-model="gaugeChartStyle.titleStyle.show" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in showOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">图例显示：</div>
              <div class="input_box">
                <el-select v-model="gaugeChartStyle.legendStyle.show" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in showOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">刻度显示：</div>
              <div class="input_box">
                <el-select v-model="gaugeChartStyle.seriesStyle.axisLabel.show" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in showOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">值域范围：</div>
              <div class="input_range_box">
                <el-input v-model="gaugeChartStyle.seriesStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="gaugeChartStyle.seriesStyle.max" type="number" placeholder="请输入"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right_chart_box">
      <div class="chart_box">
        <div class="title">图表预览</div>
        <div class="chart">
          <GuageChart :chartStyle="gaugeChartStyle"></GuageChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GuageChart from '@/components/BasicComponents/Echarts/guageChart.vue'
import { getChartConfig } from '../../../config/config'
import { addWithMaxDecimal } from '@/utils/index'

export default {
  components: {
    GuageChart
  },
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
    editInfo: {
      type: Object
    },
  },
  watch: {
    'gaugeChartStyle.proportionValue': {
      handler (newVal) {
        let name = ''
        this.fieldList.forEach(item => {
          if (item.value === newVal) {
            name = item.label
          }
        })
        this.gaugeChartStyle.seriesStyle.name = name
      }
    }
  },
  data () {
    return {
      addWithMaxDecimal: addWithMaxDecimal,
      gaugeChartStyle: null,
      showOptions: [
        {
          label: '显示',
          value: true
        },
        {
          label: '不显示',
          value: false
        }
      ]
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'GaugeConfigChart') {
      this.gaugeChartStyle = getChartConfig(
        'GaugeConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData,
        this.fieldList
      )
    } else {
      this.gaugeChartStyle = getChartConfig(
        'GaugeConfigChart',
        false,
        '--bg-color-4'
      )
      this.gaugeChartStyle.titleStyle.text = '仪表盘'
    }
    console.log(this.gaugeChartStyle)
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        titleShow: this.gaugeChartStyle.titleStyle.show,
        titleText: this.gaugeChartStyle.titleStyle.text,
        legendShow: this.gaugeChartStyle.legendStyle.show,
        name: this.gaugeChartStyle.seriesStyle.name,
        axisLabelShow: this.gaugeChartStyle.seriesStyle.axisLabel.show,
        min: this.gaugeChartStyle.seriesStyle.min || null,
        max: this.gaugeChartStyle.seriesStyle.max || null,
        valueField: this.gaugeChartStyle.proportionValue
      }
    },

    // 值字段改变
    proportionValueChange (value) {
      this.gaugeChartStyle.chartData = []
      this.gaugeChartStyle.seriesStyle.name = ''

      let numArr = []
      this.listData.forEach(item => {
        numArr.push(Number(item[value]))
      })
      let sum = this.addWithMaxDecimal(numArr)
      if (isNaN(sum)) {
        this.gaugeChartStyle.chartData = []
      } else {
        let name = ''
        this.fieldList.forEach(item => {
          if (item.value === value) {
            name = item.label
          }
        })
        this.gaugeChartStyle.seriesStyle.name = name
        this.gaugeChartStyle.chartData.push({
          // title: {
          //   show: false
          // },
          name,
          value: sum
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.right_box{
  height: 480px;
  margin-left: 24px;
  // background-color: pink;
  display: flex;
  flex: 1;
  .right_set_box{
    width: 451px;
    box-sizing: content-box;
    border-right: 2px solid #38425D;
    color: var(--base-text-color-to-999999);
    font-size: 16px;
    .set_box{
      margin-bottom: 32px;
      .title{
        margin-bottom: 20px;
      }
      .basic_set{
        .title{

        }
        .form{
          .formRow{
            height: 32px;
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            // justify-content: center;
            .label{
              width: 90px;
            }
            .input_box{
              .el-input{
                width: 320px !important;
                height: 32px !important;
                border: 1px solid #515C7C;
                /deep/.el-input__inner{
                  height: 100% !important;
                  font-size: 14px !important;
                  padding: 7px 0 6px 12px !important;
                }
              }
              /deep/.el-select{
                width: 220px;
                .el-input__inner{
                  height: 32px !important;
                  font-size: 14px;
                  padding: 7px 0 6px 12px !important;
                  border: 1px solid #515C7C;
                }
              }
            }
            .input_range_box{
              .el-input{
                width: 100px !important;
                height: 32px !important;
                border: 1px solid #515C7C;
                /deep/.el-input__inner{
                  height: 100% !important;
                  font-size: 14px !important;
                  padding: 7px 0 6px 12px !important;
                }
              }
            }
            /deep/  input::-webkit-outer-spin-button,
            /deep/  input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            /deep/ input[type="number"]{
              -moz-appearance: textfield;
            }
          }
        }
      }
    }
  }
  .right_chart_box{
    .chart_box{
      height: 100%;
      // background: pink;
      margin-left: 16px;
      .title{
        margin-bottom: 16px;
        font-size: 16px;
        color: var(--base-text-color-to-999999);
      }
      .chart{
        // background: pink;
        width: 320px;
        /deep/.chart{
          .BarChart {
            position: absolute;
            right: 0;
            height: 400px;
            width: 320px;
          }
        }
      }
    }
  }
}
</style>
