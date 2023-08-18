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
                <el-input v-model.trim="mapChartStyle.titleStyle.text" placeholder="图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">区划字段：</div>
              <div class="input_box">
                <el-select v-model="option.form.zoneParam" :key="option.form.zoneParam" placeholder="请选择" @change="zoneParamChange">
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
              <div class="label">值字段：</div>
              <div class="input_box">
                <el-select v-model="option.form.valueParam" :key="option.form.valueParam" placeholder="请选择" @change="valueParamChange">
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
                <el-select v-model="mapChartStyle.titleStyle.show" placeholder="请选择">
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
              <div class="label">省份：</div>
              <div class="input_box">
                <el-select v-model="option.form.province" placeholder="请选择" disabled>
                  <el-option
                    v-for="(item, index) in provinceOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">地级市：</div>
              <div class="input_box">
                <el-select v-model="mapChartStyle.registerMapName" clearable  placeholder="请选择">
                  <el-option
                    v-for="(item, index) in cityOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="formRow">
              <div class="label">值域区间：</div>
              <div class="input_range_box">
                <el-input v-model="option.form.min" type="number" placeholder="请输入" @change="minChange(option.form.min)"></el-input>
                ~
                <el-input v-model="option.form.max" type="number" placeholder="请输入" @change="maxChange(option.form.max)"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">标签显示：</div>
              <div class="input_box">
                <el-select v-model="mapChartStyle.seriesStyle.labelShow" placeholder="请选择">
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
              <div class="label">标签内容：</div>
              <div class="input_box">
                <el-select v-model="mapChartStyle.seriesStyle.labelFormatter" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in labelContentOption"
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
          <MapChart :chartStyle="mapChartStyle"></MapChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapChart from '@/components/BasicComponents/Echarts/mapChart.vue'

export default {
  components: {
    MapChart
  },
  data () {
    return {
      mapChartStyle: null,
      option: {
        title: '地图',
        form: {
          province: '山东',
          city: '',
          min: 0,
          max: 100000
        },
      },
      provinceOptions: [
        {
          label: '山东',
          value: '山东'
        }
      ],
      cityOptions: [
        {
          label: '威海',
          value: 'wh'
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
      labelContentOption: [
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
    this.mapInit()
  },
  methods: {
    mapInit () {
      this.mapChartStyle = {
        registerMapName: '',
        darkLightMode: 'dark',
        backgroundColor: '--bg-color-4', // 图表背景色
        titleStyle: { // 图表标题样式
          show: true,
          text: '图表名称',
          fontSize: 14,
          color: '--base-text-color-1'
        },
        tooltipStyle: {
          fontSize: 12,
          color: '--base-text-color-1',
          backgroundColor: '--tooltip-bg-262D44-to-f6f8fd'
        },
        visualMapStyle: {
          min: 0,
          max: 10000
        },
        seriesStyle: {
          labelShow: false,
          labelFormatter: '{b}'
        }
      }
    },
    minChange (e) {
      if (e) {
        this.mapChartStyle.visualMapStyle.min = e
      } else {
        this.mapChartStyle.visualMapStyle.min = 0
      }
    },
    maxChange (e) {
      if (e) {
        this.mapChartStyle.visualMapStyle.max = e
      } else {
        this.mapChartStyle.visualMapStyle.max = 100000
      }
    },
    zoneParamChange () {

    },
    valueParamChange () {

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
                  // line-height: 32px !important;
                  font-size: 14px;
                  padding: 7px 0 6px 12px !important;
                  border: 1px solid #515C7C;
                }
                .el-input__suffix{
                  display: flex;
                  align-items: center;
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
          .MapChart{
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
