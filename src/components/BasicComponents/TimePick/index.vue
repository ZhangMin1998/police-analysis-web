<template>
  <div class="TimePick ">
    <el-time-picker
      placeholder="起始时间"
      v-model="startTime"
      :clearable="false"
      prefix-icon="el-icon"
      :editable="false"
      format="HH:mm"
      value-format="HH:mm"
      :picker-options="{
        selectableRange: limitTime,
      }"
    >
    </el-time-picker>

    <div class="separated">~</div>

    <el-time-picker
      placeholder="结束时间"
      v-model="endTime"
      prefix-icon="el-icon"
      :clearable="false"
      format="HH:mm"
      value-format="HH:mm"
      :editable="false"
      :picker-options="{
        selectableRange: limitTime,
      }"
      @change="change"
    >
    </el-time-picker>
  </div>
</template>

<script>
export default {
  props: {
    limitTime: {
      type: Array,
      default: () => {
        return ['00:00:00 - 23:59:59']
      },
    },
    isNight: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      startTime: '',
      endTime: '',
    }
  },
  methods: {
    change (newEndTime) {
      const newEndTimeList = newEndTime.split(':')
      const startTimeList = this.startTime.split(':')

      if (startTimeList[0] > 10 && newEndTimeList[0] < 10) {
        return
      }

      if (this.startTime && newEndTime < this.startTime) {
        this.endTime = this.startTime
      }
      if (this.isNight) {
        if (startTimeList[0] < 10 && newEndTimeList[0] > 10) {
          this.endTime = '06:00'
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.TimePick {
  display: flex;
  .separated {
    margin: 0 16px;
    color: var(--base-text-color-1);
    font-size: 20px;
  }
  /deep/.el-date-editor {
    text-align: center;
  }
}
/deep/.el-input__inner::placeholder {
  text-align: center !important;
}
</style>
