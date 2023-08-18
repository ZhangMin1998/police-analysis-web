<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">漏斗图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="funnelChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <!-- <div class="formRow">
              <div class="label">漏斗类型：</div>
              <div class="input_box">
                <el-select v-model="funnelChartStyle.funnelType" key="1" placeholder="请选择" @change="funnelTypeChange">
                  <el-option
                    v-for="(item, index) in funnelTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div> -->
            <div class="formRow">
              <div class="label">类别字段：</div>
              <div class="input_box">
                <el-select v-model="funnelChartStyle.proportionParam" :key="funnelChartStyle.proportionParam" placeholder="请选择" @change="proportionParamChange">
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
                <el-select v-model="funnelChartStyle.proportionValue" :key="2" placeholder="请选择" @change="proportionValueChange">
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
                <el-select v-model="funnelChartStyle.titleStyle.show" placeholder="请选择">
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
                <el-select v-model="funnelChartStyle.legendStyle.show" placeholder="请选择">
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
                <el-select v-model="funnelChartStyle.seriesStyle.labelShow" placeholder="请选择">
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
                <el-select v-model="funnelChartStyle.seriesStyle.labelPosition" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in labelPositionOptions"
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
                <el-input v-model="funnelChartStyle.seriesStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="funnelChartStyle.seriesStyle.max" type="number" placeholder="请输入"></el-input>
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
          <FunnelChart :chartStyle="funnelChartStyle"></FunnelChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FunnelChart from '@/components/BasicComponents/Echarts/funnelChart.vue'
import { getChartConfig } from '../../../config/config'

export default {
  components: {
    FunnelChart
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
      funnelChartStyle: null,
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
      funnelTypeOptions: [
        {
          label: '普通漏斗图',
          value: 'funnel'
        },
        {
          label: '对比漏斗图',
          value: 'funnelCompare'
        }
      ],
      labelPositionOptions: [
        {
          label: '内部',
          value: 'inside'
        },
        {
          label: '外左侧',
          value: 'left'
        },
        {
          label: '外右侧',
          value: 'right'
        },
        {
          label: '内左侧',
          value: 'insideLeft'
        },
        {
          label: '内右侧',
          value: 'insideRight'
        },
        {
          label: '左上侧',
          value: 'leftTop'
        },
        {
          label: '左下侧',
          value: 'leftBottom'
        },
        {
          label: '右上侧',
          value: 'rightTop'
        },
        {
          label: '右下侧',
          value: 'rightBottom'
        }
      ]
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'FunnelConfigChart') {
      this.funnelChartStyle = getChartConfig(
        'FunnelConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData,
        this.fieldList
      )
    } else {
      this.funnelChartStyle = getChartConfig(
        'FunnelConfigChart',
        false,
        '--bg-color-4'
      )
      this.funnelChartStyle.titleStyle.text = '漏斗图'
    }
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        titleShow: this.funnelChartStyle.titleStyle.show,
        titleText: this.funnelChartStyle.titleStyle.text,
        legendShow: this.funnelChartStyle.legendStyle.show,
        labelShow: this.funnelChartStyle.seriesStyle.labelShow,
        labelPosition: this.funnelChartStyle.seriesStyle.labelPosition,
        min: this.funnelChartStyle.seriesStyle.min || null,
        max: this.funnelChartStyle.seriesStyle.max || null,
        labelField: this.funnelChartStyle.proportionParam,
        valueField: this.funnelChartStyle.proportionValue
      }
    },
    /*funnelTypeChange (value) {

    },*/
    // 类别字段改变
    proportionParamChange (value) {
      this.funnelChartStyle.chartData = []
      if (this.funnelChartStyle.proportionValue) {
        this.listData.forEach(item => {
          this.funnelChartStyle.chartData.push({
            name: item[value],
            value: item[this.funnelChartStyle.proportionValue]
          })
        })
      }
    },

    // 值字段改变
    proportionValueChange (value) {
      this.funnelChartStyle.chartData = []
      if (this.funnelChartStyle.proportionParam) {
        this.listData.forEach(item => {
          this.funnelChartStyle.chartData.push({
            name: item[this.funnelChartStyle.proportionParam],
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
