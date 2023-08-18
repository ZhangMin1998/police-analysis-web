<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">{{ option.title }}</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="barChartStyle.titleStyle.text" placeholder="图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">X轴：</div>
              <div class="input_box">
                <el-select v-model="option.form.x" key="1" placeholder="请选择" @change="xChange(option.form.x)">
                  <el-option
                    v-for="(item, index) in xOptions"
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
                <el-select v-model="option.form.y" :key="2" multiple collapse-tags placeholder="请选择" @change="yChange(option.form.y)">
                  <el-option
                    v-for="(item, index) in yOptions"
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
                <el-select v-model="barChartStyle.titleStyle.show" placeholder="请选择">
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
                <el-select v-model="barChartStyle.legendStyle.show" placeholder="请选择">
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
                <el-input v-model="option.form.xMin" type="number" placeholder="请输入" @input="xMinChange"></el-input>
                ~
                <el-input v-model="option.form.xMax" type="number" placeholder="请输入" @input="xMaxChange"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">Y轴范围：</div>
              <div class="input_range_box">
                <el-input v-model="option.form.yMin" type="number" placeholder="请输入" @input="yMinChange"></el-input>
                ~
                <el-input v-model="option.form.yMax" type="number" placeholder="请输入" @input="yMaxChange"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">警戒值：</div>
              <div class="input_box">
                <el-input v-model="barChartStyle.warningValue" type="number" placeholder="警戒值"></el-input>
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
          <BarChart :chartStyle="barChartStyle"></BarChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/BasicComponents/Echarts/barChart.vue'

export default {
  components: {
    BarChart
  },
  data () {
    return {
      barChartStyle: null,
      option: {
        title: '柱状图',
        form: {
          x: '', // X轴字段
          y: '', // Y轴字段,
          xMin: null, // X轴最小值
          xMax: null, // X轴最大值
          yMin: null, // Y轴最小值
          yMax: null, // Y轴最大值
          warningValue: null, // 警戒值
        },
      },
      xOptions: [
        {
          label: '星期',
          value: '星期'
        },
        {
          label: '日期',
          value: '日期'
        }
      ],
      yOptions: [
        {
          label: 'English',
          value: 'English'
        },
        {
          label: 'Math',
          value: 'Math'
        }
      ],
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
    this.barLineInit()
  },
  methods: {
    barLineInit () {
      this.barChartStyle = {
        x: null, // X轴
        y: null, // y轴
        warningValue: null, // 警戒值
        darkLightMode: 'dark',
        backgroundColor: '--bg-color-4', // 图表背景色
        titleStyle: { // 图表标题样式
          show: true,
          text: '图表名称',
          fontSize: 14,
          color: '--base-text-color-1'
        },
        legendStyle: { // 图例样式
          show: true,
          fontSize: 12,
          color: '--base-text-color-1',
          top: '10%',
          type: 'plain', // plain/scroll
        },
        tooltipStyle: {
          fontSize: 12,
          color: '--base-text-color-1',
          backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
        },
        dataZoomStyle: {
          show: true,
          type: 'inside', // inside/slider
        },
        xAxisStyle: {
          fontSize: 12,
          color: '--base-text-color-to-999999',
          min: null,
          max: null
        },
        yAxisStyle: {
          position: 'left',
          fontSize: 12,
          color: '--base-text-color-to-999999',
          splitLineType: 'dashed', // solid/dashed/dotted
          splitLineColor: 'rgba(101, 116, 148, 0.24)',
          min: null,
          max: null
        }
      }
    },
    xChange (e) {
      this.barChartStyle.x = e
    },
    yChange (e) {
      this.barChartStyle.y = e
    },
    xMinChange () {
      if (!this.option.form.xMin) {
        this.barChartStyle.xAxisStyle.min = null
      } else {
        this.barChartStyle.xAxisStyle.min = this.option.form.xMin
      }
    },
    xMaxChange () {
      if (!this.option.form.xMax) {
        this.barChartStyle.xAxisStyle.max = null
      } else {
        this.barChartStyle.xAxisStyle.max = this.option.form.xMax
      }
    },
    yMinChange () {
      if (!this.option.form.yMin) {
        this.barChartStyle.yAxisStyle.min = null
      } else {
        this.barChartStyle.yAxisStyle.min = this.option.form.yMin
      }
    },
    yMaxChange () {
      if (!this.option.form.yMax) {
        this.barChartStyle.yAxisStyle.max = null
      } else {
        this.barChartStyle.yAxisStyle.max = this.option.form.yMax
      }
    },
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
            height: 320px;
            width: 320px;
          }
        }
      }
    }
  }
}
</style>
