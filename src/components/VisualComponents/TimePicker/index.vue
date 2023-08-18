<template>
  <div class="form">
    <div class="timeBox">
        <el-date-picker
          v-model="startEndTime"
          format="yyyy/MM/dd HH:mm"
          value-format="timestamp"
          type="datetimerange"
          range-separator="~"
          :editable='true'
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期"
          @change="startEndTimeChange"
          :picker-options="pickerOptions"
          clearable
          >
        </el-date-picker>
    </div>
    <i class="el-icon-date"></i>
  </div>
</template>

<script>
// import dayjs from '@/utils/filters'
export default {
  props: {
    // 是否可选择当天
    // isCanToday: {
    //   type: Boolean,
    //   default: true
    // },
    // 是否限制过去三个月
    limitLastThreeMonth: {
      type: Boolean,
      default: false
    },
    // 是否限制未来三个月
    limitFutureThreeMonth: {
      type: Boolean,
      default: false
    },
    // 是否只能选择未来
    isFuture: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      startEndTime: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    if (this.limitLastThreeMonth) {
      this.pickerOptions = {}
      this.pickerOptions = {
        disabledDate (time) {
          const pre = new Date();
          const preMonth =  pre.setMonth(pre.getMonth() - 3)
          return time.getTime() > Date.now() || time.getTime() < preMonth
        }
      }
    } else if (this.limitFutureThreeMonth) {
      this.pickerOptions = {}
      this.pickerOptions = {
        disabledDate (time) {
          const pre = new Date();
          const preMonth =  pre.setMonth(pre.getMonth() + 3)
          return time.getTime() < Date.now() || time.getTime() > preMonth
        }
      }
    }
  },
  methods: {
    startEndTimeChange (value) {
      console.log(value)
      this.$emit('confirmTime', value)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-icon-time{
  display: none;
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
  .timeBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 295px;
    & > .sTime {
      width: 42%;
    }
  }
}
</style>
