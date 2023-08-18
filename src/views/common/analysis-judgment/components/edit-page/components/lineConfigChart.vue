<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">折线图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="lineChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">X轴：</div>
              <div class="input_box">
                <el-select v-model="lineChartStyle.x" key="1" placeholder="请选择" @change="xChange">
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
              <div class="label">Y轴：</div>
              <div class="input_box">
                <el-select v-model="lineChartStyle.y" :key="2" multiple collapse-tags placeholder="请选择" @change="yChange">
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
                <el-select v-model="lineChartStyle.titleStyle.show" placeholder="请选择">
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
                <el-select v-model="lineChartStyle.legendStyle.show" placeholder="请选择">
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
              <div class="label">X轴范围：</div>
              <div class="input_range_box">
                <el-input v-model="lineChartStyle.xAxisStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="lineChartStyle.xAxisStyle.max" type="number" placeholder="请输入"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">Y轴范围：</div>
              <div class="input_range_box">
                <el-input v-model="lineChartStyle.yAxisStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="lineChartStyle.yAxisStyle.max" type="number" placeholder="请输入"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">警戒值：</div>
              <div class="input_box">
                <el-input v-model="lineChartStyle.warningValue" type="number" placeholder="警戒值"></el-input>
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
          <LineChart :chartStyle="lineChartStyle"></LineChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/BasicComponents/Echarts/lineChart.vue'
import { getChartConfig } from '../../../config/config.js'

export default {
  components: {
    LineChart
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
      lineChartStyle: null,
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
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'LineConfigChart') {
      this.lineChartStyle = getChartConfig(
        'LineConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData,
        this.fieldList
      )
    } else {
      this.lineChartStyle = getChartConfig(
        'LineConfigChart',
        false,
        '--bg-color-4'
      )
      this.lineChartStyle.titleStyle.text = '折线图'
    }
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        x: this.lineChartStyle.x,
        y: this.lineChartStyle.y,
        warningValue: this.lineChartStyle.warningValue || null,
        titleShow: this.lineChartStyle.titleStyle.show,
        titleText: this.lineChartStyle.titleStyle.text,
        legendShow: this.lineChartStyle.legendStyle.show,
        xMin: this.lineChartStyle.xAxisStyle.min || null,
        xMax: this.lineChartStyle.xAxisStyle.max || null,
        yMin: this.lineChartStyle.yAxisStyle.min || null,
        yMax: this.lineChartStyle.yAxisStyle.max || null,
      }
    },
    xChange (value) {
      this.lineChartStyle.xAxisStyle.data = this.listData.map(item => item[value])
    },
    yChange (value) {
      // this.lineChartStyle.y = e
      this.lineChartStyle.chartData = []
      value.forEach(item => {
        const findItem = this.fieldList.find(field => field.value === item)
        const name = findItem ? findItem.label : item
        this.lineChartStyle.chartData.push({
          name,
          data: this.listData.map(info => info[item])
        })
      })
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
                .el-tag.el-tag--info{
                  max-width: 130px;
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
          .LineChart {
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
