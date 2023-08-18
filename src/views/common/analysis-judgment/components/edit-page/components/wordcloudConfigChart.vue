<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">词云图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="wordcloudChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">类别字段：</div>
              <div class="input_box">
                <el-select v-model="wordcloudChartStyle.proportionParam" :key="wordcloudChartStyle.proportionParam" placeholder="请选择" @change="proportionParamChange">
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
                <el-select v-model="wordcloudChartStyle.proportionValue" :key="2" placeholder="请选择" @change="proportionValueChange">
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
                <el-select v-model="wordcloudChartStyle.titleStyle.show" placeholder="请选择">
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
              <div class="label">字体粗细：</div>
              <div class="input_box">
                <el-select v-model="wordcloudChartStyle.seriesStyle.fontWeight" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in fontWeightOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">面积范围：</div>
              <div class="input_range_box">
                <el-input v-model="wordcloudChartStyle.seriesStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="wordcloudChartStyle.seriesStyle.max" type="number" placeholder="请输入"></el-input>
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
          <WordcloudChart :chartStyle="wordcloudChartStyle"></WordcloudChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WordcloudChart from '@/components/BasicComponents/Echarts/wordcloudChart.vue'
import { getChartConfig } from '../../../config/config'

export default {
  components: {
    WordcloudChart
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
      wordcloudChartStyle: null,
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
      fontWeightOptions: [
        {
          label: '加细',
          value: 'lighter'
        },
        {
          label: '普通',
          value: 'normal'
        },
        {
          label: '粗体',
          value: 'bold'
        },
        {
          label: '加粗',
          value: 'bolder'
        }
      ]
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'WordcloudConfigChart') {
      this.wordcloudChartStyle = getChartConfig(
        'WordcloudConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData,
        this.fieldList
      )
    } else {
      this.wordcloudChartStyle = getChartConfig(
        'WordcloudConfigChart',
        false,
        '--bg-color-4'
      )
      this.wordcloudChartStyle.titleStyle.text = '词云图'
    }
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        titleShow: this.wordcloudChartStyle.titleStyle.show,
        titleText: this.wordcloudChartStyle.titleStyle.text,
        fontWeight: this.wordcloudChartStyle.seriesStyle.fontWeight,
        min: this.wordcloudChartStyle.seriesStyle.min || 10,
        max: this.wordcloudChartStyle.seriesStyle.max || 20,
        labelField: this.wordcloudChartStyle.proportionParam,
        valueField: this.wordcloudChartStyle.proportionValue
      }
    },

    // 类别字段改变
    proportionParamChange (value) {
      this.wordcloudChartStyle.chartData = []
      if (this.wordcloudChartStyle.proportionValue) {
        this.listData.forEach(item => {
          this.wordcloudChartStyle.chartData.push({
            name: item[value],
            value: item[this.wordcloudChartStyle.proportionValue]
          })
        })
      }
    },

    // 值字段改变
    proportionValueChange (value) {
      this.wordcloudChartStyle.chartData = []
      if (this.wordcloudChartStyle.proportionParam) {
        this.listData.forEach(item => {
          this.wordcloudChartStyle.chartData.push({
            name: item[this.wordcloudChartStyle.proportionParam],
            value: item[value]
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
          .WordcloudChart {
            position: absolute;
            right: 0;
            height: 420px;
            width: 320px;
          }
        }
      }
    }
  }
}
</style>
