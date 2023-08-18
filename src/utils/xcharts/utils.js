// 对象深度合并
export function deepMerge (obj1, obj2) {
  let key
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    obj1[key] =
      obj1[key] && obj1[key].toString() === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key])
  }
  return obj1
}

// 数据生成
export const MockData = {
  array (len, slice = -2) {
    if (Array.isArray(slice)) {
      const [min, max] = slice
      return Array.from(
        { length: len },
        () => Math.floor(Math.random() * (max - min + 1)) + min
      )
    } else {
      /* eslint-disable */
      return Array.from({ length: len }, (_, index) => {
        return Number(
          Math.random()
            .toString()
            .slice(slice)
        )
      })
      /* eslint-enable */
    }
  },
  date (len, type) {
    return Array.from({ length: len }, (_, index) => {
      let temp = ''
      switch (type.toLocaleLowerCase()) {
        case 'day':
          temp = Number(index + 1) + '日'
          break
        case 'month':
          temp = Number(index + 1) + '月'
          break
        case 'week':
          temp = '第' + Number(index + 1) + '周'
          break
        default:
          '20' + Number(index + 1) + '年'
          break
      }
      return temp
    })
  },
  dateTime (start, dates) {
    var base = +new Date(start)
    var oneDay = 24 * 3600 * dates
    var date = []
    for (var i = 1; i < dates; i++) {
      var now = new Date((base += oneDay))
      date.push(
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
      )
    }
    return date
  },
  getBeforeDate (paramsDay, format) {
    var today = new Date();
    var dateArr = []
    for (var i = paramsDay - 1; i >= 0; i--) {
      var newDate = new Date(today.getTime() - i * 1000 * 60 * 60 * 24)
      var year = newDate.getFullYear()
      var month = (parseInt(newDate.getMonth()) + 1) > 9 ? (parseInt(newDate.getMonth()) + 1) : "0" + (parseInt(newDate.getMonth()) + 1)
      var day = (newDate.getDate()) > 9 ? newDate.getDate() : "0" + newDate.getDate()
      var fullDate = format === 'MM/DD' ? `${month}-${day}` : `${year}-${month}-${day}`
      dateArr.push(fullDate)
    }
    return dateArr
  },
  /**
   * 获取1天24小时数组
   * @param {*} step  step = 间隔的分钟 默认一小时
   * @returns
   */
  getDayHours (step = 60) {
    var date = new Date()
    date.setHours('00')    // 时分秒设置从零点开始
    date.setSeconds('00')
    date.setUTCMinutes('00')
    var timeArr = [];
    var slotNum = 24 * 60 / step   // 算出多少个间隔
    for (var f = 0; f < slotNum; f++) {   //  stepM * f = 24H*60M
      var time = new Date(Number(date.getTime()) + Number(step * 60 * 1000 * f))  // 获取：零点的时间 + 每次递增的时间
      var hour = '', sec = '';
      time.getHours() < 10 ? hour = '0' + time.getHours() : hour = time.getHours()  // 获取小时
      time.getMinutes() < 10 ? sec = '0' + time.getMinutes() : sec = time.getMinutes()   // 获取分钟
      timeArr.push(hour + ':' + sec)
    }
    return timeArr
  },

  /**
   * 对象值转数组
   * @param {*} obj 对象
   * @returns
   */
  objectToArray (obj) {
    let list = []
    Object.keys(obj).forEach(key => {
      list.push({
        key: key,
        value: obj[key] + ''
      })
    })
    const resList = list.sort(function (a, b) {
      return a['key'] - b['key'];
    }).map(_c => _c.value)
    return resList
  }
}
