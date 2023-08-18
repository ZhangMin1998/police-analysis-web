<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">饼图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="pieChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">饼图类型：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.pieType" placeholder="请选择" @change="pieTypeChange">
                  <el-option
                    v-for="(item, index) in pieTypeOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">类别字段：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.proportionParam" :key="pieChartStyle.proportionParam" placeholder="请选择" @change="proportionParamChange">
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
            <div class="formRow">
              <div class="label">值字段：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.proportionValue" :key="pieChartStyle.proportionValue" placeholder="请选择" @change="proportionValueChange">
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
                <el-select v-model="pieChartStyle.titleStyle.show" placeholder="请选择">
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
                <el-select v-model="pieChartStyle.legendStyle.show" placeholder="请选择">
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
              <div class="label">标签显示：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.seriesStyle.labelShow" placeholder="请选择">
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
              <div class="label">标签位置：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.seriesStyle.labelPosition" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in pieLabelPositionOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">标签内容：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.seriesStyle.labelFormatter" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in pieLabelContentOption"
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
    </div>
    <div class="right_chart_box">
      <div class="chart_box">
        <div class="title">图表预览</div>
        <div class="chart">
          <PieChart :chartStyle="pieChartStyle"></PieChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/BasicComponents/Echarts/pieChart.vue'
import { getChartConfig } from '../../../config/config'

export default {
  components: {
    PieChart
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
  data () {
    return {
      pieChartStyle: null,
      /*option: {
        title: '饼图',
        form: {
          proportionParam: '', // 占比字段
          pieType: '70%', // 饼图类型 默认基本饼图
          pieLabelContent: '{b}', // 饼图标签内容
        },
      },*/
      showOptions: [
        {
          label: '显示',
          value: true
        },
        {
          label: '不显示',
          value: false
        }
      ],
      pieTypeOption: [
        {
          label: '饼图',
          value: 'pie'
        },
        {
          label: '环形图',
          value: 'loop'
        },
        {
          label: '南丁格尔玫瑰图',
          value: 'radius'
        }
      ],
      pieLabelPositionOption: [
        {
          label: '外侧',
          value: 'outside'
        },
        {
          label: '内侧',
          value: 'inside'
        },
        {
          label: '中心',
          value: 'center'
        }
      ],
      pieLabelContentOption: [
        {
          label: '数据名',
          value: '{b}'
        },
        {
          label: '数据名（百分比）',
          value: '{b}:{d}%'
        },
        {
          label: '数据名（具体值）',
          value: '{b}:{c}'
        }
      ],
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'PieConfigChart') {
      this.pieChartStyle = getChartConfig(
        'PieConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData
      )
    } else {
      this.pieChartStyle = getChartConfig(
        'PieConfigChart',
        false,
        '--bg-color-4'
      )
      this.pieChartStyle.titleStyle.text = '饼图'
    }
    this.pieTypeChange(this.pieChartStyle.pieType)
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        titleText: this.pieChartStyle.titleStyle.text,
        pieType: this.pieChartStyle.pieType,
        seriesRadius: this.pieChartStyle.seriesStyle.radius,
        seriesRoseType: this.pieChartStyle.seriesStyle.roseType,
        labelField: this.pieChartStyle.proportionParam,
        valueField: this.pieChartStyle.proportionValue,
        titleShow: this.pieChartStyle.titleStyle.show,
        legendShow: this.pieChartStyle.legendStyle.show,
        labelShow: this.pieChartStyle.seriesStyle.labelShow,
        labelPosition: this.pieChartStyle.seriesStyle.labelPosition,
        labelFormatter: this.pieChartStyle.seriesStyle.labelFormatter
      }
    },
    pieTypeChange (value) {
      if (value === 'radius') {
        this.pieChartStyle.seriesStyle.roseType = 'radius'
        this.pieChartStyle.seriesStyle.radius = '70%'
      } else if (value === 'pie') {
        this.pieChartStyle.seriesStyle.roseType = ''
        this.pieChartStyle.seriesStyle.radius = '70%'
      } else if (value === 'loop') {
        this.pieChartStyle.seriesStyle.roseType = ''
        this.pieChartStyle.seriesStyle.radius = ['40%', '70%']
      }
      /*if (this.option.form.pieType === 'radius') {
        this.pieChartStyle.seriesStyle.roseType = 'radius'
        this.pieChartStyle.seriesStyle.radius = '70%'
      } else {
        this.pieChartStyle.seriesStyle.roseType = ''
        this.pieChartStyle.seriesStyle.radius = this.option.form.pieType
      }*/
    },
    proportionValueChange (value) {
      this.pieChartStyle.chartData = []
      if (this.pieChartStyle.proportionParam) {
        this.listData.forEach(item => {
          this.pieChartStyle.chartData.push({
            name: item[this.pieChartStyle.proportionParam],
            value: item[value]
          })
        })
      }
    },
    proportionParamChange (value) {
      this.pieChartStyle.chartData = []
      if (this.pieChartStyle.proportionValue) {
        this.listData.forEach(item => {
          this.pieChartStyle.chartData.push({
            name: item[value],
            value: item[this.pieChartStyle.proportionValue]
          })
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
          .PieChart{
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
