<template>
  <!-- 时间选择器 -》 可选择类型 今天/昨天/前天 快捷方式 -->
  <div class="picks">
    <!-- 选择时间类型 -->
    <div class="pick-type" v-if="isShowTimeType">
      <el-select v-model="dateType" placeholder="请选择" @change="handleTypeChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 时间区间类型 -->
    <div class="time-pick" v-if="dateType !== 3">
      <div style="width: 140px">
        <el-select v-model="startHour" placeholder="请选择开始时间" @change="handleStartChange">
          <el-option
            v-for="item in startTimesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="split">~</div>
      <div style="width: 140px">
        <el-select v-model="endHour" placeholder="请选择结束时间" @change="handleEndChange">
          <el-option
            v-for="item in endTimesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 日历类型 -->
    <QuickTimeSelect
      v-else
      :typeName="typeName"
      :isInDatePick="true"
      :width="350"
      ref="resetTime"
      :p-start-time="pick.startTime"
      :p-end-time="pick.endTime"
      :limitThreeMonth="true"
      @get-s-e-time="getTimeSelect"
      @clear-time="clearTime"
    ></QuickTimeSelect>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch, getCurrentInstance } from '@vue/composition-api'
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
// import TimeSelect from '@/components/BasicComponents/TimeSelect/index'
import dayjs from '@/utils/filters'
export default {
  name: 'DatePick',
  components: {
    QuickTimeSelect,
    // TimeSelect
  },
  props: {
    isShowTimeType: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const { proxy } = getCurrentInstance()

    const state = reactive({
      typeName: props.type,
      options: [
        {
          label: '今天',
          value: 0
        },
        {
          label: '昨天',
          value: 1
        },
        {
          label: '前天',
          value: 2
        },
        {
          label: '自定义',
          value: 3
        }
      ],
      dateType: 3,
      typeStr: {},
      startTimesOptions: [],
      endTimesOptions: [],
      startHour: '',
      endHour: '',
      nowTime: '',
      pick: {
        startTime: '',
        endTime: ''
      },
      startTime: '',
      endTime: ''
    })

    watch(
      () => state.dateType,
      newValue => {
        if (newValue === 3) {
          state.startTime = state.pick.startTime
          state.endTime = state.pick.endTime
        } else {
          state.startTime = formatToUnix(joinToDate(state.startHour))
          state.endTime = formatToUnix(joinToDate(state.endHour))
        }
      }
    )

    watch(
      () => state.startHour,
      newValue => {
        state.startTime = formatToUnix(joinToDate(newValue))
      }
    )

    watch(
      () => state.endHour,
      newValue => {
        state.endTime = formatToUnix(joinToDate(newValue))
      }
    )

    watch(
      () => state.pick.startTime,
      newValue => {
        state.startTime = newValue
      }
    )

    watch(
      () => state.pick.endTime,
      newValue => {
        state.endTime = newValue
      }
    )

    const joinToDate = hour => {
      return state.typeStr[state.dateType] + ' ' + hour
    }

    const formatToUnix = date => {
      return dayjs.toUnix(date)
    }

    const getTimeSelect = child => {
      state.pick.startTime = child.startTime || ''
      state.pick.endTime = child.endTime || ''
      setTimeout(() => {
        context.emit('getTimeSelect', state.pick)
      }, 0)
    }

    const clearTime = () => {
      proxy.$nextTick(() => {
        if (proxy.$refs.resetTime) {
          proxy.$refs.resetTime.startTime = ''
          proxy.$refs.resetTime.endTime = ''
        }
      })
      state.pick.startTime = ''
      state.pick.endTime = ''
      state.startTime = ''
      state.endTime = ''
      setTimeout(() => {
        context.emit('clearTime', state.pick)
      }, 0)
    }

    // 处理今日结束时间
    const formatTimes = (st, et) => {
      let list = []
      // 今天
      if (state.dateType === 0) {
        const nowHour = dayjs.getCurHour()
        // const nowTime = state.nowTime

        list = fomatHours(st, et && et.length > 2 ? nowHour : et || nowHour)
        // if ((nowTime !== nowHour + ':00' && !et) || (et && et.length > 2))
        //   list.push({
        //     label: nowTime,
        //     value: nowTime
        //   })
      } else {
        // 非今日
        list = fomatHours(st || 0, et || 24)
      }
      return list
    }

    // 循环结束时间
    const fomatHours = (min = 0, max = 24) => {
      let list = []
      min = parseInt(min)
      max = parseInt(max)
      for (let i = min; i <= max; i++) {
        list.push({
          label: (i < 10 ? '0' + i : i) + ':00',
          value: (i < 10 ? '0' + i : i) + ':00'
        })
      }
      return list
    }

    const handleStartChange = startTime => {
      const startHour = startTime.split(':')[0]

      state.endTimesOptions = formatTimes(startHour)
    }

    const handleEndChange = endTime => {
      let endHour = endTime.split(':')[0]
      if (endTime.split(':')[1] > 0) {
        endHour = endTime
      }
      state.startTimesOptions = formatTimes(0, endHour)
    }

    const handleTypeChange = () => {
      refreshTimeSelect()
    }

    const refreshTimeSelect = () => {
      if (state.dateType === 0) {
        // state.nowTime = dayjs.filterHM(new Date())
        state.startHour = '00:00'

        // state.endHour = state.nowTime
        state.endHour = dayjs.getCurHour() + ':00'
      } else {
        state.startHour = '00:00'
        state.endHour = '24:00'
      }

      state.startTimesOptions = formatTimes()
      state.endTimesOptions = formatTimes()
    }

    onMounted(() => {
      // 更新下拉时间区域
      refreshTimeSelect()

      state.typeStr = {
        0: dayjs.getToday(),
        1: dayjs.getYesterday(),
        2: dayjs.getBeforeYesterday()
      }
    })

    return {
      ...toRefs(state),
      clearTime,
      getTimeSelect,
      handleStartChange,
      handleEndChange,
      handleTypeChange
    }
  }
}
</script>

<style lang="less" scoped>
.picks {
  display: flex;
  .pick-type {
    margin-right: 12px;
    width: 160px;
    ::v-deep .el-select .el-input .el-input__inner{
      border: 1px solid var(--border-color-input);
    }
  }
  .time-pick {
    display: flex;
    align-items: center;
    .split {
      margin: 0 10px;
    }
  }
  /deep/.el-select {
    .el-input__inner {
      height: 40px;
      line-height: 38px;
    }
  }
}
</style>
