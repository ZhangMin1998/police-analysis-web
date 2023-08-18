<template>
  <div
    class="item_label"
    :class="formItemBoolean ? 'formItem active' : 'formItem'"
    :style="`width:${$pxToRem(width)}`"
    @mouseout="outStyle"
    @mouseover="selectStyle"
  >
    <div class="timeBox cardBox">
      <el-date-picker
        v-model="startEndTime"
        type="datetimerange"
        :format="timeFormat"
        :value-format="valueFormat"
        :picker-options="pickerOptions"
        :range-separator="rangeSeparator"
        :editable="editable"
        :default-time="defaultTime"
        :start-placeholder="startPlaceholder"
        :end-placeholder="endPlaceholder"
        :popper-class='popperClass'
        @blur="confirmStartEndTime"
        @change="startEndTimeChange"
        align="left"
      >
      </el-date-picker>
      <div class="dateIcon">
        <i class="el-icon-date"></i>
      </div>
    </div>
    <slot name='timeSlot'></slot>
  </div>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    },
    pStartTime: {
      type: [Number, String, Date],
      default: ''
    },
    pEndTime: {
      type: [Number, String, Date],
      default: ''
    },
    limitLastThreeMonth: {
      type: Boolean,
      default: false
    },
    limitFutureThreeMonth: {
      type: Boolean,
      default: false
    },
    isInDatePick: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    typeName: {
      type: String,
      default: ''
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    timeFormat: {
      type: String,
      default: 'yyyy/MM/dd HH:mm'
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    popperClass: {
      type: String,
      default: ''
    },
    defaultTime: {
      type: Array,
      default: () => {
        return ['00:00:00', '23:59:59']
      }
    }
  },
  computed: {
    // startEndTime(){
    //   return [this.pStartTime,this.pEndTime]
    // }
  },
  data () {
    return {
      rangeSeparator: '~',
      startEndTime: [],
      formItemBoolean: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 60000 * (start.getHours() * 60 + start.getMinutes()))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '三日',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '七日',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate (time) {
          // return time.getTime() > Date.now()
          const date = new Date()
          return time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
        }
      },
      choiceDate: ''
    }
  },
  created () {
    if (this.type === 'carAtlas' || this.type === 'logManage') {
      this.pickerOptions = {
        shortcuts: [
          {
            text: '今日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 60000 * (start.getHours() * 60 + start.getMinutes()));
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '三日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '七日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }
        ],
        disabledDate (time) {
          const pre = new Date();
          const date = new Date()
          const preYear = pre.setFullYear(pre.getFullYear() - 1)
          return time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime() || time.getTime() < preYear

          // return time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
        }
      }
    } else if (this.typeName === 'warningHistory') {
      this.pickerOptions = {
        shortcuts: [
          {
            text: '今日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 60000 * (start.getHours() * 60 + start.getMinutes()));
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '三日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '七日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    } else if (this.typeName === 'limit14DaysTime') {
      this.pickerOptions = {}
      this.pickerOptions = {
        onPick: ({ maxDate, minDate }) => {
          // 把选择的第一个日期赋值给一个变量。
          this.choiceDate = minDate.getTime()
          // 如何你选择了两个日期了，就把那个变量置空
          if (maxDate) this.choiceDate = ''
        },
        disabledDate: time => {
          // 如何选择了一个日期
          const date = new Date()
          if (this.choiceDate) {
            // 7天的时间戳
            const one = 14 * 24 * 3600 * 1000
            // 当前日期 - one = 7天之前
            const minTime = this.choiceDate - one
            // 当前日期 + one = 7天之后
            const maxTime = this.choiceDate + one
            return (
              time.getTime() < minTime ||
              time.getTime() > maxTime ||
              // 限制不能选择今天及以后
              time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
            )
          } else {
            // 如果没有选择日期，就要限制不能选择今天及以后
            return time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
          }
        }
      }
    } else if (this.typeName === 'warnControlTime') {
      this.pickerOptions = {}
      this.pickerOptions = {
        disabledDate (time) {
          const date = new Date()
          return time.getTime() < new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59, 59).getTime()
        }
      }
    }

    if (this.limitLastThreeMonth) {
      this.pickerOptions = {}
      this.pickerOptions = {
        disabledDate (time) {
          const pre = new Date();
          const preMonth = pre.setMonth(pre.getMonth() - 3)
          const date = new Date()
          return time.getTime() > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime() || time.getTime() < preMonth
        }
      }
    } else if (this.limitFutureThreeMonth) {
      this.pickerOptions = {}
      this.pickerOptions = {
        disabledDate (time) {
          const date = new Date()
          const preMonth = new Date(date.getFullYear(), date.getMonth() + 3, date.getDate(), 23, 59, 59).getTime()
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 || time.getTime() > preMonth
        }
      }
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   if (this.pStartTime && this.pEndTime) {
    //     this.startEndTime = [this.pStartTime, this.pEndTime]
    //   }
    // })
  },
  watch: {
    pStartTime: {
      handler (newVal) {
        if (!newVal) return
        this.$set(this.startEndTime, 0, newVal)
      },
      immediate: true
    },
    pEndTime: {
      handler (newVal) {
        if (!newVal) return
        this.$set(this.startEndTime, 1, newVal)
      },
      immediate: true
    }
  },
  methods: {
    confirmStartEndTime () {
      if (this.isInDatePick) {
        this.$emit('get-s-e-time', {
          startTime: this.startEndTime[0],
          endTime: this.startEndTime[1]
        })
      }

    },
    outStyle () {
      this.formItemBoolean = false
    },
    selectStyle () {
      this.formItemBoolean = true
    },
    startEndTimeChange (value) {
      if (this.isInDatePick) {
        this.$emit('clear-time', {
          startTime: '',
          endTime: ''
        })
        // if(this.startEndTime) {
        //   this.rangeSeparator = '~'
        // } else {
        //   this.rangeSeparator = ''
        // }
      } else {
        this.$emit('update:pStartTime', value ? value[0] : '')
        this.$emit('update:pEndTime', value ? value[1] : '')
        this.$emit('timeChange', value)
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
}
.closeIcon {
  color: var(--base-text-color-to-999999);
  margin-right: 6px;
}
.formItem {
  border: 1px solid var(--border-color-input);
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
  width: 28px;
  .el-icon-date {
    color: var(--base-text-color-to-999999);
  }
}
.formItem .el-input--prefix /deep/.el-input__inner {
  padding: 0 !important;
}
.formItem .el-input--suffix /deep/.el-input__inner {
  padding: 0 !important;
}
.active {
  border: 1px solid #3d4c75 !important;
}
.el-date-editor /deep/ .el-range-input {
  height: 100%;
  margin: 0;
  text-align: left;
  display: inline-block;
  font-size: 16px;
}
@-moz-document url-prefix(){
@media screen and (min-width: 1024px) and (max-width: 1365px) {
        .el-date-editor .el-range-input{
          font-size: 20px !important;
        }
      }
    }
@media only screen and (min-width: 1346px) and (max-width: 1500px) {
  .item_label {
    width: 264px !important;
    /deep/.el-range-input {
      width: 44% !important;
    }
  }
}
@media only screen and (max-width: 1345px) {
  .item_label {
    width: 256px !important;
    /deep/.el-range-input {
      width: 44% !important;
    }
  }
}
/deep/.el-date-editor {
  .el-range__icon {
    margin-left: 0;
    width: 0;
  }
  .el-range-input {
    &::placeholder {
      font-size: 16px;
      color: var(--input-placehold-color);
      // color: red;
    }
  }
}
</style>
