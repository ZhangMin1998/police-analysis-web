import dayjs from '@/utils/filters'

let recordToEnObj = {}
export default {
  methods: {
    getDataToEn (obj) {
      recordToEnObj = obj
    },
    // 格式化布控时间的内容
    formatControlTime (row) {
      if (!row.timeSelectFlag) return '--'
      if (row.timeSelectFlag === 'all') return '长期有效'
      if (row.timeStart && row.timeEnd) {
        let startTime = dayjs.formatDate(new Date(row.timeStart).getTime(), 'YYYY-MM-DD')
        let endTime
        if (new Date(row.timeEnd).getHours() === 0) {
          endTime = dayjs.formatDate(new Date(row.timeEnd).getTime() - 24 * 60 * 60 * 1000, 'YYYY-MM-DD')
        } else {
          endTime = dayjs.formatDate(new Date(row.timeEnd).getTime(), 'YYYY-MM-DD')
        }
        return startTime + '~' + endTime
      }
      return '--'
    },
    // 格式化布控区域显示的内容
    formatControlRegion (row) {
      if (!row.regionSelectFlag) return '--'
      if (row.regionSelectFlag === 'all') return '全区域'
      if (row.regionAccessType) {
        if (row.regionAccessType === 'inner') {
          return '指定区域-进入'
        } else if (row.regionAccessType === 'outer') {
          return '指定区域-离开'
        }
        return '指定区域'
      }
      return '--'
    },
    // 格式化布控数据的内容
    formatControlData (row) {
      if (!row.dataTypeSelectFlag) return '--'
      if (row.dataTypeSelectFlag === 'all') return '全部数据'
      let result = []
      if (row.dataTypeList) {
        row.dataTypeList.forEach(item => {
          if (recordToEnObj[item]) {
            result.push(recordToEnObj[item])
          }
        })
      }
      return result.join('，')
    },
  }
}
