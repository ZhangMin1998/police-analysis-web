<template>
  <div class="right_box">
    <div class="right_set_box">
      <div class="set_box">
        <div class="title">轨迹图</div>
        <div class="basic_set">
          <div class="title">1、基本设置</div>
          <div class="form">
            <div class="formRow">
              <div class="label">图表名称：</div>
              <div class="input_box">
                <el-input v-model.trim="option.form.chartTitle" placeholder="请输入图表名称"></el-input>
              </div>
            </div>
            <div class="formRow">
              <div class="label">经度字段：</div>
              <div class="input_box">
                <el-select v-model="option.form.longitudeParam" :key="option.form.longitudeParam" placeholder="请选择" @change="longitudeParamChange">
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
              <div class="label">纬度字段：</div>
              <div class="input_box">
                <el-select v-model="option.form.latitudeParam" :key="option.form.latitudeParam" placeholder="请选择" @change="latitudeParamChange">
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
              <div class="label">弹框字段：</div>
              <div class="input_box">
                <el-select v-model="option.form.popParam" :key="option.form.popParam" placeholder="请选择" @change="popParamChange">
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
                <el-select v-model="option.form.isShowTitle" placeholder="请选择">
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
    </div>
    <div class="right_chart_box">
      <div class="chart_box">
        <div class="title">图表预览</div>
        <div class="chart_wrap">
          <TrackChart ref="TrackChart" :optionForm="option.form" :tracksList="option.tracksList" v-if="isShowMap"></TrackChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackChart from '@/components/BasicComponents/Echarts/trackChart.vue'
import { getChartConfig } from '../../../config/config'

export default {
  components: {
    TrackChart
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
      option: null,
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
      isShowMap: true
    }
  },
  created () {
    if (this.editInfo && this.editInfo.displayChartType === 'TrackConfigChart') {
      this.option = getChartConfig(
        'TrackConfigChart',
        true,
        '--bg-color-4',
        JSON.parse(this.editInfo.displayCoordinate),
        this.listData
      )
    } else {
      this.option = getChartConfig(
        'TrackConfigChart',
        false,
        '--bg-color-4'
      )
      this.option.form.chartTitle = '轨迹图'
      this.option.form.popParam = this.fieldList[0].value
    }
  },
  methods: {
    // 格式化提交的数据
    formatSubmitData () {
      return {
        titleText: this.option.form.chartTitle,
        longitudeParam: this.option.form.longitudeParam,
        latitudeParam: this.option.form.latitudeParam,
        isShowTitle: this.option.form.isShowTitle,
        popParam: this.option.form.popParam
      }
    },
    longitudeParamChange (value) {
      this.option.tracksList = []
      if (this.option.form.latitudeParam) {
        this.listData.forEach(item =>{
          this.option.tracksList.push({
            latitude: item[this.option.form.latitudeParam],
            longitude: item[value],
            location: [item[value], item[this.option.form.latitudeParam]],
            popParam: item[this.option.form.popParam] || item[this.fieldList[0].value]
          })
        })
      }
    },
    latitudeParamChange (value) {
      this.option.tracksList = []
      if (this.option.form.longitudeParam) {
        this.listData.forEach(item =>{
          this.option.tracksList.push({
            latitude: item[value],
            longitude: item[this.option.form.longitudeParam],
            location: [item[this.option.form.longitudeParam], item[value]],
            popParam: item[this.option.form.popParam] || item[this.fieldList[0].value]
          })
        })
      }
    },
    popParamChange (value) {
      this.isShowMap = false
      this.listData.forEach(item =>{
        this.option.tracksList.forEach(e => {
          e.popParam = item[value]
        })
      })
      this.$nextTick(() => {
        this.isShowMap = true
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
      height: 100%;
      // background: pink;
      margin-left: 16px;
      .title{
        margin-bottom: 16px;
        font-size: 16px;
        color: var(--base-text-color-to-999999);
      }
      .chart_wrap{
        // background: pink;
        width: 320px;
        height: calc(100% - 34px);
        /deep/.chart{
          .MapChart{
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
}
</style>
