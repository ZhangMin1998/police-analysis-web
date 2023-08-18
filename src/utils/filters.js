import dayjs from 'dayjs'

export default {
  filterY: function (value) {
    if (!value) return ''
    return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
  },
  /**
   * 时间戳 -> 年/月/日 时：分:秒
   * @param {时间戳 单位毫秒} value
   */
  filterSS: function (value) {
    if (!value) return ''
    if (typeof value == 'string') {
      value = parseInt(value)
    }
    return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
  },
  /**
   * 时间戳 -> 年/月/日 时：分
   * @param {时间戳 单位秒} value
   */
  filterS: function (value) {
    if (!value) return ''
    value = parseInt(value) * 1000
    return dayjs(value).format('YYYY/MM/DD HH:mm')
  },
   /**
   * 时间戳 -> 年/月/日 时：分
   * @param {时间戳 单位秒} value
   */
    filterExactS: function (value) {
      if (!value) return ''
      value = parseInt(value) * 1000
      return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
    },
  /**
   * 时间戳 -> 年/月/日 时：分
   * @param {时间戳 单位毫秒} value
   */
  filterSSS: function (value) {
    if (!value) return ''
    value = parseInt(value)
    return dayjs(value).format('YYYY/MM/DD HH:mm')
  },
  /**
   * 时间戳 -> 年/月/日 时：分:秒
   * @param {年月日 string} value
   */
  filterString: function (value) {
    if (!value) return ''
    if (typeof value == 'string') {
      value = new Date(value)
    }
    return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
  },
  /**
   * 时间戳 -> 年/月/日 时：分：秒
   * @param {时间戳 单位毫秒} value
   */
  filterY_M_D_H_M_S: function (value) {
    if (!value) return ''
    return dayjs(parseInt(value)).format('YYYY/MM/DD HH:mm:ss')
  },
  /**
   * 时间戳 -> 年-月-日 时：分：秒
   * @param {时间戳 单位毫秒} value
   */
  filtertoS: function (value) {
    if (!value) return ''
    return dayjs(parseInt(value)).format('YYYY-MM-DD HH:mm:ss')
  },
  formatDate: function (value,Format) {
    // 'YYYY-MM-DD'
    if (!value) return ''
    return dayjs(parseInt(value)).format(Format)
  },
  // ->毫秒时间戳
  filterTimeToTimestampHS: function (value) {
    if (!value) return ''
    return dayjs(value).valueOf()
  },
  filterTwoY_M_D_H_M_S: function (value1, value2) {
    if (!value1 && !value2) return ''
    return (
      dayjs(value1).format('YYYY/MM/DD HH:mm:ss') +
      '~' +
      dayjs(value2).format('YYYY/MM/DD HH:mm:ss')
    )
  },
  /**
   * 时间戳2>时间戳1  返回年
   * @param {时间戳1} value1
   * @param {时间戳2} value2
   */
  getDiffVal: function (value1, value2) {
    if (!value1 && !value2) return ''
    const date1 = dayjs(value1)
    const date2 = dayjs(value2)
    let year = date1.diff(date2, 'year')
    return year
  },
  // 解析传入的一个 Unix 时间戳
  getDate: function (tem) {
    if (!tem) return ''
    return dayjs(parseInt(tem))
  },
  // 解析传入的一个 Unix 时间戳
  getHour: function (tem) {
    if (!tem) return ''
    return dayjs().hour(parseInt(tem))
  },
  getMinute: function (tem) {
    if (!tem) return ''
    return dayjs().minute(parseInt(tem))
  },
  addTime: function (date) {
    if (!date) return ''
    return dayjs(date).add(3, 'month')
  },
  subtractTime: function (date) {
    if (!date) return ''
    return dayjs(date).subtract(3, 'month')
  },
  // 通过 在线时间是否实在24小时内 来判断设备的在线/离线状态 在线返回true 离线返回false 参数 传入更新时间 单位时间戳毫秒
  getOnlineState: function (date) {
    if (!date) return ''
    let yestadayT = dayjs(dayjs(Date.now()).subtract(1, 'day')).valueOf()
    return date >= yestadayT ? true : false
  },
  /**
   * 时间戳 -> 时：分:秒
   * @param { 毫秒时间戳} value
   */
  filterHMS: function (value) {
    if (!value) return ''
    if (typeof value == 'string') {
      value = parseInt(value)
    }
    let h = dayjs(value).hour()
    let m = dayjs(value).minute()
    let s = dayjs(value).second()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  },
  /**
   * 时间戳 -> 时：分
   * @param { 年/月/日 时：分：秒} value
   */
  filterHM: function (value) {
    if (!value) return ''
    let h = dayjs(value).hour()
    let m = dayjs(value).minute()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  },

  /**
   * 获取当前时间戳 -> 时
   */
  getCurHour: function (value) {
    return value ? dayjs(value).hour() : dayjs().hour()
  },

  /**
   * 获取今天日期 年/月/日
   */
  getToday: function () {
    return dayjs().format('YYYY/MM/DD')
  },

  /**
   * 获取昨天日期 年/月/日
   */
  getYesterday: function () {
    return dayjs(dayjs().subtract(1, 'day')).format('YYYY/MM/DD')
  },

  /**
   * 获取前天日期 年/月/日
   */
  getBeforeYesterday: function () {
    return dayjs(dayjs().subtract(2, 'day')).format('YYYY/MM/DD')
  },

  /**
   * 年/月/日 时：分转为时间戳
   */
  toUnix: function (Date) {
    return dayjs(Date).valueOf()
  },

  /**
   * 减时间换算
   */
  getSubtractTime: function (obj) {
    if (obj.date && obj.Format === 'Unix') {
      const date = dayjs(obj.date).subtract(obj.num, obj.unit).format('YYYY-MM-DD')
      return dayjs(date).valueOf()
    }

    if (obj.date) {
      return dayjs(obj.date).subtract(obj.num, obj.unit).format(obj.Format || 'YYYY-MM-DD')
    }

    return dayjs().subtract(obj.num, obj.unit).format(obj.Format || 'YYYY-MM-DD')

  }
}
