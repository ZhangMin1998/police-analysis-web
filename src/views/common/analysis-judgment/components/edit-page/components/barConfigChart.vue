<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">柱状图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="barChartStyle.titleStyle.text" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">图表方向：</div>
              <div class="input_box">
                <el-select v-model="barChartStyle.barDirection" key="1" placeholder="请选择" @change='handleDirection'>
                  <el-option
                    v-for="(item, index) in barDirection"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">X轴：</div>
              <div class="input_box">
                <el-select
                  v-model="barChartStyle.x"
                  :multiple='barChartStyle.barDirection === "crosswise"'
                  :collapse-tags='barChartStyle.barDirection === "crosswise"'
                  :key='xKey'
                  placeholder="请选择"
                  @change="xChange"
                >
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
                <el-select
                  v-model="barChartStyle.y"
                  :key='yKey'
                  :multiple='barChartStyle.barDirection !== "crosswise"'
                  :collapse-tags='barChartStyle.barDirection !== "crosswise"'
                  placeholder="请选择"
                  @change="yChange"
                >
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
                <el-input v-model="barChartStyle.xAxisStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="barChartStyle.xAxisStyle.max" type="number" placeholder="请输入"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">Y轴范围：</div>
              <div class="input_range_box">
                <el-input v-model="barChartStyle.yAxisStyle.min" type="number" placeholder="请输入"></el-input>
                ~
                <el-input v-model="barChartStyle.yAxisStyle.max" type="number" placeholder="请输入"></el-input>
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
import { getChartConfig } from '../../../config/config'

export default {
  components: {
    BarChart
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
      barChartStyle: null,
      xKey: new Date().getTime(),
      yKey: new Date().getTime(),
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
      barDirection: Object.freeze([
        { label: '纵向', value: 'portrait' },
        { label: '横向', value: 'crosswise' }
      ])
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'BarConfigChart') {
      this.barChartStyle = getChartConfig(
        'BarConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData,
        this.fieldList
      )
    } else {
      this.barChartStyle = getChartConfig(
        'BarConfigChart',
        false,
        '--bg-color-4'
      )
      this.barChartStyle.titleStyle.text = '柱状图'
    }
  },
  methods: {
    /*barLineInit () {
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
          max: null,
          data: null // x轴字段
        },
        yAxisStyle: {
          position: 'left',
          fontSize: 12,
          color: '--base-text-color-to-999999',
          splitLineType: 'dashed', // solid/dashed/dotted
          splitLineColor: 'rgba(101, 116, 148, 0.24)',
          min: null,
          max: null
        },
        chartData: []
      }
    },*/
    // 格式化提交的数据
    formatSubmitData () {
      return {
        barDirection: this.barChartStyle.barDirection,
        x: this.barChartStyle.x,
        y: this.barChartStyle.y,
        warningValue: this.barChartStyle.warningValue || null,
        titleShow: this.barChartStyle.titleStyle.show,
        titleText: this.barChartStyle.titleStyle.text,
        legendShow: this.barChartStyle.legendStyle.show,
        xMin: this.barChartStyle.xAxisStyle.min || null,
        xMax: this.barChartStyle.xAxisStyle.max || null,
        yMin: this.barChartStyle.yAxisStyle.min || null,
        yMax: this.barChartStyle.yAxisStyle.max || null,
      }
    },
    handleDirection () {
      this.barChartStyle.x = null
      this.barChartStyle.y = null
      this.xKey = new Date().getTime()
      this.yKey = new Date().getTime()
      this.barChartStyle.chartData = []
      this.barChartStyle.xAxisStyle.data = null
      this.barChartStyle.yAxisStyle.data = null
    },
    categoryChange (value, axisName) {
      this.barChartStyle[axisName].data = this.listData.map(item => item[value])
    },
    valueChange (value) {
      this.barChartStyle.chartData = []
      value.forEach(item => {
        const findItem = this.fieldList.find(field => field.value === item)
        const name = findItem ? findItem.label : item
        this.barChartStyle.chartData.push({
          name,
          data: this.listData.map(info => info[item])
        })
      })
    },
    xChange (value) {
      if (this.barChartStyle.barDirection === 'crosswise') {
        this.valueChange(value)
      } else {
        this.categoryChange(value, 'xAxisStyle')
      }
    },
    yChange (value) {
      if (this.barChartStyle.barDirection === 'crosswise') {
        this.categoryChange(value, 'yAxisStyle')
      } else {
        this.valueChange(value)
      }

      // 现在先写死
      /*this.barChartStyle.y.forEach(item => {
        if (item.includes('English')) {
          this.barChartStyle.chartData.push({
            name: 'English',
            data: [120, 132, 101, 134, 96, 88, 136]
          })
        } else if (item.includes('Math')) {
          this.barChartStyle.chartData.push({
            name: 'Math',
            data: [120, 112, 91, 134, 80, 130, 110]
          })
        }
      })*/
    },
    /*xMinChange () {
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
    },*/
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
