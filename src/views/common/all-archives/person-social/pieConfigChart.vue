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
                <el-input v-model.trim="pieChartStyle.titleStyle.text" placeholder="图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">饼图类型：</div>
              <div class="input_box">
                <el-select v-model="option.form.pieType" placeholder="请选择" @change="pieTypeChange">
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
              <div class="label">占比字段：</div>
              <div class="input_box">
                <el-select v-model="pieChartStyle.proportionParam" :key="pieChartStyle.proportionParam" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in proportionOptions"
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

export default {
  components: {
    PieChart
  },
  data () {
    return {
      pieChartStyle: null,
      option: {
        title: '饼图',
        form: {
          proportionParam: '', // 占比字段
          pieType: '70%', // 饼图类型 默认基本饼图
          pieLabelContent: '{b}', // 饼图标签内容
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
      pieTypeOption: [
        {
          label: '饼图',
          value: '70%'
        },
        {
          label: '环形图',
          value: ['40%', '70%']
        },
        {
          label: '南丁格尔玫瑰图',
          value: 'radius'
        }
      ],
      proportionOptions: [
        {
          label: '科目',
          value: '科目'
        },
        {
          label: '学历',
          value: '学历'
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
          value: '{b}:{d}'
        },
        {
          label: '数据名（具体值）',
          value: '{b}:{c}'
        }
      ],
    }
  },
  created () {
    this.barLineInit()
  },
  methods: {
    barLineInit () {
      this.pieChartStyle = {
        proportionParam: '',
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
        seriesStyle: {
          radius: '70%',
          roseType: '', // 玫瑰'radius'
          labelShow: true,
          labelPosition: 'outside', // outside/inside/center
          labelFormatter: '{b}'
        }
      }
    },
    pieTypeChange () {
      if (this.option.form.pieType === 'radius') {
        this.pieChartStyle.seriesStyle.roseType = 'radius'
        this.pieChartStyle.seriesStyle.radius = '70%'
      } else {
        this.pieChartStyle.seriesStyle.roseType = ''
        this.pieChartStyle.seriesStyle.radius = this.option.form.pieType
      }
    },
    // pieLabelContentChange () {
    //   this.pieChartStyle.seriesStyle.labelFormatter = this.option.form.pieLabelContent
    // }
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
          .PieChart{
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
