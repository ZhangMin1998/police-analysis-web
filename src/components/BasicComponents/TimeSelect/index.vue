<template>
  <div
    :class="formItemBoolean ? 'formItem active' : 'formItem'"
    :style="'width:' + width + 'px;'"
    @mouseout="outStyle"
    @mouseover="selectStyle"
  >
    <div class="timeBox cardBox">
      <div class="startTime">
        <el-date-picker
          v-model="startTime"
          type="datetime"
          value-format="timestamp"
          placeholder="请选择开始日期"
          format="yyyy/MM/dd HH:mm"
          :default-time="defaultTime"
          :clearable="false"
          :editable='false'
          :picker-options="pickerOptions0"
          @blur="confirmStartTime"
        >
        </el-date-picker>
      </div>
      <div class="range">~</div>
      <div class="endTime">
        <el-date-picker
          v-model="endTime"
          type="datetime"
          value-format="timestamp"
          placeholder="请选择结束日期"
          format="yyyy/MM/dd HH:mm"
          :default-time="defaultTime"
          :clearable="false"
          :editable='false'
          :picker-options="pickerOptions1"
          @blur="confirmStartTime"
        >
        </el-date-picker>
      </div>
      <div class="dateIcon closeIcon" v-show="startTime || endTime">
        <i class="el-icon-close" @click.prevent.stop="clearTime"></i>
      </div>
      <div class="dateIcon">
        <i class="el-icon-date"></i>
      </div>
    </div>
  </div>
</template>

<script>
import timeRule from '@/components/BasicComponents/TimeSelect/timeRule'
export default {
  mixins: [timeRule],
  props: {
    // 是否可选择当天
    isCanToday: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 400
    },
    isPass: {
      type: Boolean,
      default: true
    },
    pStartTime: {
      type: [Number, String],
      default: ''
    },
    pEndTime: {
      type: [Number, String],
      default: ''
    },
    limitThreeMonth: {
      type: Boolean,
      default: false
    },
    latestThreeMonth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formItemBoolean: false
    }
  },
  methods: {
    confirmStartTime () {
      this.$emit('get-s-e-time', {
        startTime: this.startTime,
        endTime: this.endTime
      })
    },
    outStyle () {
      this.formItemBoolean = false
    },
    selectStyle () {
      this.formItemBoolean = true
    },
    clearTime () {
      this.$emit('clear-time', {
        startTime: '',
        endTime: ''
      })
      this.startTime = ''
      this.endTime = ''
    }
  }
}
</script>

<style scoped>
.timeBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.closeIcon {
  color: var(--base-text-color-to-999999);
  margin-right: 6px;
}
.closeIcon:hover {
  color: var(--active-color);
  cursor: pointer;
}
.formItem {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  color: var(--base-text-color-1);
  width: 319px;
  height: 40px;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 16px;
  position: relative;
  /* padding-left: 6px; */
}
.formItem .el-date-editor--datetimerange.el-input,
.formItem .el-date-editor--datetimerange.el-input__inner {
  width: 100%;
  padding-left: 0 !important;
}
.formItem /deep/ .el-input__inner {
  border: none !important;
  cursor: pointer !important;
  text-align: center !important;
}
.range {
  width: 12px;
}
.startTime {
  flex: 1 1 auto;
}
.endTime {
  flex: 1 1 auto;
}
.formItem .el-date-editor.el-input,
.formItem .el-date-editor.el-input__inner {
  width: 100% !important;
}
.dateIcon {
  width: 24px;
}
.formItem .el-input--prefix /deep/.el-input__inner {
  padding: 0 !important;
}
.formItem .el-input--suffix /deep/.el-input__inner {
  padding: 0 !important;
}
.active {
  border: 1px solid #3D4C75 !important;
}
</style>
