import dayjs from '@/utils/filters'
export default {
  data () {
    return {
      pickerOptions0: {
        disabledDate: time => {
          if (this.isPass) {
            //只可选择过去时间
            if (this.limitThreeMonth) {
              if (this.endTime != '') {
                let currentTime = dayjs.getDate(this.endTime)
                return (
                  time.getTime() > Date.now() ||
                  time.getTime() > this.endTime ||
                  time.getTime() < dayjs.subtractTime(currentTime)
                )
              } else {
                // 不能选择今天
                if (!this.isCanToday) {
                  return time.getTime() > Date.now() - 8.64e7
                }

                return time.getTime() > Date.now()
              }
            } else {
              // 最近三个月
              if (this.latestThreeMonth) {
                let currentTime = Date.now()
                if (this.endTime != '') {
                  return (
                    time.getTime() > Date.now() ||
                    time.getTime() > this.endTime ||
                    time.getTime() < dayjs.subtractTime(currentTime)
                  )
                } else {
                  return (
                    time.getTime() > Date.now() - 8.64e7 ||
                    time.getTime() < dayjs.subtractTime(currentTime)
                  )
                }
              }

              // 结束时间已输入
              if (this.endTime != '') {
                return time.getTime() > Date.now() || time.getTime() > this.endTime
              } else {
                // 不能选择今天
                if (!this.isCanToday) {
                  return time.getTime() > Date.now() - 8.64e7
                }

                return time.getTime() > Date.now()
              }
            }
          } else {
            //只可选择未来时间
            if (this.endTime == '') return time.getTime() < Date.now() - 8.64e7
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > this.endTime
          }
        },
        selectableRange: ''
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.isPass) {
            //只可选择过去时间
            if (this.limitThreeMonth) {
              if (this.startTime != '') {
                let currentTime = dayjs.getDate(this.startTime)
                // 不能选择今天
                if (!this.isCanToday) {
                  return (
                    time.getTime() < this.startTime - 8.63e7 ||
                    time.getTime() >= Date.now() - 8.64e7 ||
                    time.getTime() > dayjs.addTime(currentTime)
                  )
                }

                return (
                  time.getTime() < this.startTime ||
                  time.getTime() >= Date.now() ||
                  time.getTime() > dayjs.addTime(currentTime)
                )
              } else {
                // 不能选择今天
                if (!this.isCanToday) {
                  return time.getTime() < this.startTime || time.getTime() > Date.now() - 8.64e7
                }

                return time.getTime() < this.startTime || time.getTime() > Date.now()
              }
            } else {
              // 最近三个月
              if (this.latestThreeMonth) {
                let currentTime = Date.now()
                if (this.startTime != '') {
                  if (!this.isCanToday) {
                    return (
                      time.getTime() < this.startTime - 8.63e7 ||
                      time.getTime() >= Date.now() - 8.64e7 ||
                      time.getTime() < dayjs.subtractTime(currentTime)
                    )
                  }
                  return (
                    time.getTime() < this.startTime - 8.63e7 ||
                    time.getTime() >= Date.now() ||
                    time.getTime() < dayjs.subtractTime(currentTime)
                  )
                } else {
                  if (!this.isCanToday) {
                    return (
                      time.getTime() < this.startTime ||
                      time.getTime() > Date.now() - 8.64e7 ||
                      time.getTime() < dayjs.subtractTime(currentTime)
                    )
                  }
                  return (
                    time.getTime() < this.startTime ||
                    time.getTime() ||
                    time.getTime() < dayjs.subtractTime(currentTime)
                  )
                }
              }

              if (this.startTime != '') {
                // let currentTime = dayjs.getDate(this.startTime)
                if (!this.isCanToday) {
                  return (
                    time.getTime() < this.startTime - 8.63e7 ||
                    time.getTime() >= Date.now() - 8.64e7
                  )
                }
                return time.getTime() < this.startTime - 8.63e7 || time.getTime() >= Date.now()
              } else {
                if (!this.isCanToday) {
                  return time.getTime() > Date.now() - 8.64e7
                }
                return time.getTime() > Date.now()
              }
            }
          } else {
            //只可选择未来时间
            if (this.startTime == '') return time.getTime() < Date.now() - 8.64e7
            let startTime = dayjs.filterSS(this.startTime)
            let nowDate = dayjs.filterSS(Date.now())
            if (startTime.split(' ')[0] == nowDate.split(' ')[0]) {
              return time.getTime() < this.startTime - 8.64e7
            } else {
              return time.getTime() < this.startTime - 4.64e7
            }
          }
        },
        selectableRange: ''
      },
      endTime: '',
      startTime: '',
      defaultTime: '00:00:00',
      flag: false,
      flag1: false,
    }
  },
  watch: {
    startTime: {
      handler (newValue) {
        if (!newValue) return

        if (this.endTime && newValue > this.endTime) {
          this.startTime = this.endTime
          newValue = this.endTime
        }
        // 确定默认选择 今日时间，不允许今日时间则 为前一日时间
        let time = new Date().getTime() - 24 * 60 * 60 * 1000
        let yesterday = new Date(time)
        if (!this.isCanToday && this.isPass) {
          // // 确定默认选择 今日时间，不允许今日时间则 为前一日时间
          // var time = new Date().getTime() - 24 * 60 * 60 * 1000
          // var yesterday = new Date(time)
          yesterday =
            yesterday.getFullYear() +
            '/' +
            (yesterday.getMonth() + 1) +
            '/' +
            yesterday.getDate() +
            ' 23:59:59'
          if (newValue > dayjs.filterTimeToTimestampHS(yesterday)) {
            newValue = dayjs.filterTimeToTimestampHS(yesterday)
            this.startTime = dayjs.filterTimeToTimestampHS(yesterday)
          }
        }

        let endTimeStr = dayjs.filterY_M_D_H_M_S(this.endTime)
        let newStartTimeStr = dayjs.filterY_M_D_H_M_S(newValue)
        let nowTimeStr = dayjs.filterY_M_D_H_M_S(Date.now())

        if (this.isPass) {
          this.pickerOptions0.selectableRange = this.isPassStartTime(
            newStartTimeStr,
            endTimeStr,
            nowTimeStr
          )
        } else {
          this.pickerOptions0.selectableRange = this.isNotPassStartTime(
            newStartTimeStr,
            endTimeStr,
            nowTimeStr
          )
        }
        // 确定默认选择 今日时间，不允许今日时间则 为前一日时间
        // var time = new Date().getTime() - 24 * 60 * 60 * 1000
        // var yesterday = new Date(time)
        yesterday =
          yesterday.getFullYear() +
          '/' +
          (yesterday.getMonth() + 1) +
          '/' +
          yesterday.getDate() +
          ' 23:59:59'
        if (!this.isCanToday && newValue > dayjs.filterTimeToTimestampHS(yesterday)) {
          this.startTime = dayjs.filterTimeToTimestampHS(yesterday)
        }
      }
    },
    endTime: {
      handler (newValue) {
        if (!newValue) return

        if (this.limitThreeMonth && this.startTime && newValue > dayjs.addTime(this.startTime)) {
          this.endTime = dayjs.addTime(this.startTime)
          newValue = dayjs.addTime(this.startTime)
        }
        let time = new Date().getTime() - 24 * 60 * 60 * 1000
        let yesterday = new Date(time)
        if (!this.isCanToday && this.isPass)
          // 确定默认选择 今日时间，不允许今日时间则 为前一日时间
        //   var time = new Date().getTime() - 24 * 60 * 60 * 1000
        // var yesterday = new Date(time)
        yesterday =
          yesterday.getFullYear() +
          '/' +
          (yesterday.getMonth() + 1) +
          '/' +
          yesterday.getDate() +
          ' 23:59:59'
        if (newValue > dayjs.filterTimeToTimestampHS(yesterday)) {
          newValue = dayjs.filterTimeToTimestampHS(yesterday)
          this.endTime = dayjs.filterTimeToTimestampHS(yesterday)
        }

        let newEndTimeStr = dayjs.filterY_M_D_H_M_S(newValue)
        let startTimeStr = dayjs.filterY_M_D_H_M_S(this.startTime)
        let nowTimeStr = dayjs.filterY_M_D_H_M_S(Date.now())
        if (newValue < this.startTime) {
          this.endTime = this.startTime
        }
        if (this.isPass) {
          this.pickerOptions1.selectableRange = this.isPassEndTime(
            startTimeStr,
            newEndTimeStr,
            nowTimeStr
          )
        } else {
          this.pickerOptions1.selectableRange = this.isNotPassEndTime(
            startTimeStr,
            newEndTimeStr,
            nowTimeStr
          )
        }

        // 确定默认选择 今日时间，不允许今日时间则 为前一日时间
        // var time = new Date().getTime() - 24 * 60 * 60 * 1000
        // var yesterday = new Date(time)
        yesterday =
          yesterday.getFullYear() +
          '/' +
          (yesterday.getMonth() + 1) +
          '/' +
          yesterday.getDate() +
          ' 23:59:59'
        if (!this.isCanToday && newValue > dayjs.filterTimeToTimestampHS(yesterday)) {
          this.endTime = dayjs.filterTimeToTimestampHS(yesterday)
        }
      }
    }
  },
  created () {
    this.startTime = this.pStartTime || ''
    this.endTime = this.pEndTime || ''
    if (this.isPass) {
      if (this.endTime && this.startTime == '') {
        let endTime = dayjs.filterSS(this.endTime).split(' ')
        this.defaultTime = new Date(endTime[0] + ' 00:00')
      }
    } else {
      let nowDateList = dayjs.filterSS(Date.now()).split(' ')
      let endTime = dayjs.filterSS(this.endTime).split(' ')
      let startTime = dayjs.filterSS(this.startTime).split(' ')
      if (nowDateList[0] == endTime[0] || nowDateList[0] == startTime[0]) {
        let nowDate = dayjs.filterY_M_D_H_M_S(Date.now())
        this.defaultTime = nowDate.split(' ')[1]
      } else {
        this.defaultTime = '00:00:00'
      }
    }
  },
  methods: {
    // 过去开始时间
    isPassStartTime (newStartTimeStr, endTimeStr, nowTimeStr) {
      nowTimeStr = endTimeStr ? endTimeStr : nowTimeStr
      let newStartTimeList = newStartTimeStr.split(' ')
      // let endTimeList = endTimeStr.split(' ')
      let nowTimeList = nowTimeStr.split(' ')
      let st = '00:00:00'
      let et = ''

      // 选择的开始时间==今天的时间/结束时间
      if (nowTimeList[0] == newStartTimeList[0]) {
        et = nowTimeList[1]
      } else {
        et = '23:59:59'
      }
      return st + '-' + et
    },
    // 过去结束时间
    isPassEndTime (startTimeStr, newEndTimeStr, nowTimeStr) {
      let st = '00:00:00'
      let et = '23:59:59'
      let startTimeList = startTimeStr.split(' ')
      let newEndTimeList = newEndTimeStr.split(' ')
      let nowTimeList = nowTimeStr.split(' ')

      // 如果开始时间==结束时间
      if (newEndTimeList[0] == startTimeList[0]) {
        st = startTimeStr ? startTimeList[1] : '00:00:00'
      }
      // 如果结束时间==今天
      if (nowTimeList[0] == newEndTimeList[0]) {
        et = nowTimeList[1]
      }
      return st + '-' + et
    },
    // 未来开始时间
    isNotPassStartTime (newStartTimeStr, endTimeStr, nowTimeStr) {
      let st = '00:00:00'
      let et = '23:59:59'
      let newStartTimeList = newStartTimeStr.split(' ')
      let endTimeList = endTimeStr.split(' ')
      let nowTimeList = nowTimeStr.split(' ')

      // 新开始时间日期==今天日期
      if (newStartTimeList[0] == nowTimeList[0]) {
        this.flag1 = true

        if (
          newStartTimeList[1].split(':')[0] <= nowTimeList[1].split(':')[0] &&
          newStartTimeList[1].split(':')[1] < nowTimeList[1].split(':')[1]
        ) {
          this.startTime = dayjs.filterTimeToTimestampHS(Date.now())
        }
        // 判断 开始时间是否小于当前时间 不可小于当前时间，小于时改变开始时间为当前时间
        if (endTimeStr && newStartTimeList[0] == endTimeList[0]) {
          et = endTimeList[1]
        } else {
          et = '23:59:59'
        }
        st = nowTimeList[1] //同一天 可选择日期为开始-结束
      } else {
        // 当单击时间为当天 flag=true 第二次选择时间将时间强制修改为时间00:00时分
        if (this.flag1) {
          this.flag1 = false
          let t = newStartTimeList[0] + ' 00:00:00'
          // 将t转为时间戳
          t = dayjs.filterTimeToTimestampHS(t)
          this.startTime = t
        }
        st = '00:00:00' //非今日 可选择日期为00:00:00-结束
        // 已输入结束时间 结束和开始同一天 则是开始-结束
      }
      if (endTimeStr && endTimeList[0] == newStartTimeList[0]) {
        et = endTimeList[1]
        this.pickerOptions1.selectableRange = newStartTimeList[1] + '-' + endTimeList[1]
      }
      return st + '-' + et
    },
    // 未来结束时间
    isNotPassEndTime (startTimeStr, newEndTimeStr, nowTimeStr) {
      let st = '00:00:00'
      let et = '23:59:59'
      let startTimeList = startTimeStr.split(' ')
      let newEndTimeList = newEndTimeStr.split(' ')
      let nowTimeList = nowTimeStr.split(' ')
      if (newEndTimeList[0] == nowTimeList[0]) {
        this.flag = true
        if (
          newEndTimeList[1].split(':')[0] <= nowTimeList[1].split(':')[0] &&
          newEndTimeList[1].split(':')[1] < nowTimeList[1].split(':')[1]
        ) {
          this.endTime = dayjs.filterTimeToTimestampHS(Date.now())
        }

        if (startTimeStr && startTimeList[0] == newEndTimeList[0]) {
          st = startTimeList[1]
        } else {
          st = nowTimeList[1]
        }
        et = '23:59:59'
        return st + '-' + et
      } else {
        if (this.flag) {
          this.flag = false
          let t = newEndTimeList[0] + ' 00:00:00'
          t = dayjs.filterTimeToTimestampHS(t)
          this.endTime = t
        }
      }
      // 开始时间==结束时间
      if (startTimeList[0] == newEndTimeList[0]) {
        if (startTimeStr) {
          st = startTimeList[1]
        } else {
          st = '00:00:00'
        }
        this.pickerOptions0.selectableRange = startTimeList[1] + '-' + newEndTimeList[1]
        et = '23:59:59'
      }
      return st + '-' + et
    }
  }
}
