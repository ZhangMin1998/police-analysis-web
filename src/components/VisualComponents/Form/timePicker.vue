<template>
  <div class="form">
    <div class="timeBox">
      <div class="sTime">
        <el-date-picker
          v-model="startTime"
          type="datetime"
          value-format="timestamp"
          placeholder="请选择开始日期"
          format="yyyy/MM/dd HH:mm"
          :clearable="false"
          :editable='false'
          @focus="onfocus"
          @change="sChangeTime"
          :picker-options="pickerOptions0"
        >
        </el-date-picker>
      </div>
      <div>~</div>
      <div class="eTime">
        <el-date-picker
          v-model="endTime"
          type="datetime"
          value-format="timestamp"
          placeholder="请选择结束日期"
          format="yyyy/MM/dd HH:mm"
          :clearable="false"
          :editable='false'
          :picker-options="pickerOptions1"
          @change="eChangeTime"
        >
        </el-date-picker>
      </div>
    </div>

    <i class="el-icon-close" v-show="startTime || endTime" @click="clearTime"></i>
    <i class="el-icon-date"></i>
  </div>
</template>

<script>
import dayjs from '@/utils/filters'
import timeRule from '@/components/BasicComponents/TimeSelect/timeRule'
export default {
  mixins: [timeRule],
  props: {
    // 是否可选择当天
    isCanToday: {
      type: Boolean,
      default: true
    },
    limitThreeMonth: {
      type: Boolean,
      default: false
    },
    isPass: {
      type: Boolean,
      default: true
    },
    latestThreeMonth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      startTime: '',
      endTime: ''
    }
  },
  methods: {
    setTime (prop, value) {
      this[prop] = value
    },
    clearTime () {
      this.startTime = ''
      this.endTime = ''
      this.$emit('clearTime')
    },
    sChangeTime () {
      this.$emit('sChangeTime', this.startTime)
    },
    eChangeTime () {
      this.$emit('eChangeTime', this.endTime)
    },
    onfocus () {
      if (this.endTime && !this.startTime) {
        let endTime = dayjs.filterSS(this.endTime).split(' ')
        this.startTime = new Date(endTime[0] + ' 00:00')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.timeBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 295px;
  & > .sTime {
    width: 42%;
  }
}
.form {
  position: relative;
  .el-icon-close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    &:hover {
      color: #5288d8;
    }
  }
  .el-icon-date {
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
