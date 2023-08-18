import store from '@/store/'
import { lightTheme, darkTheme } from "@/assets/js/variable"

export const debounce = (fn, wait = 500) => {
  return function () {
    clearTimeout(fn.timer)
    fn.timer = setTimeout(fn.bind(this, ...arguments), wait)
  }
}

// 获取加密 key
export function obtainKey () {
  const jsonObj = JSON.parse(sessionStorage.getItem('vuex'))
  return jsonObj?.User?.privateKeyStr
}

// 判断IE11
export function isIE11 () { if ((/Trident\/7\./).test(navigator.userAgent)) return true; else return false; }

// 生成一天的时间
export function generateOneDay () {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24);
  return [start.getTime(), end.getTime()]
}

// 生成 7 天的时间
export function generateSevenDay () {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - (3600 * 1000 * 24) * 7);
  return [start.getTime(), end.getTime()]
}

// 数组分组
export const arrayChunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

// 对象属性筛选
// pick({ ‘a’: 1, ‘b’: ‘2’, ‘c’: 3 }, [‘a’, ‘c’]) -> { ‘a’: 1, ‘c’: 3 }
export const objPick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});

// 返回拥有权限的数组
export function backPermissionsArray (arr) {
  return arr.filter((item) => {
    return store.state.Common.permissionsArray.includes(item.key)
  })
}
// px转rem
export const pxToRem = (val) => {
  let value = val + ''
  if (value.includes('rem')) {
    return value
  }
  if (value.includes('px')) {
    value = value.split('px')[0]
  }
  return (value / 192).toFixed(5) + 'rem'
}

// 大数据分段处理函数
export function UtilHandleBigData (data, callback, pageSize = 100) {
  let totalCount = data.length; // 共多少条
  let currentPageNumber = 1; // 当前页数
  let totalPageNumer = Math.ceil(totalCount / pageSize); //可分多少页,就是分割为多少个小数组

  let handler = () => {
    let start = (currentPageNumber - 1) * pageSize;
    let end = currentPageNumber * pageSize;
    let currentData = data.slice(start, end); // 当前页的数据
    if (typeof callback === "function") {
      callback(currentData, {
        totalCount,
        totalPageNumer,
        currentPageNumber,
        pageSize,
      });
    }
    // console.log(
    //   `共${totalCount}条,共${totalPageNumer}页,当前第${currentPageNumber}条`
    // );
    if (currentPageNumber < totalPageNumer) {
      window.requestAnimationFrame(handler);
    }
    currentPageNumber++;
  };
  handler();
}

export const themeColor = (varColor) => {
  if (store.state.User.theme === 'light') {
    return lightTheme[varColor] || ''
  } else {
    return darkTheme[varColor] || ''
  }
}

// 数字相加求和 解决双精度浮点 精度有限的问题
export const addWithMaxDecimal = (numbers) => {
  // 将所有数字转换为字符串，以便获取小数位数
  const numberStrings = numbers.map(num => num.toString())

  // 找到最大的小数位数
  const maxDecimalLength = Math.max(...numberStrings.map(str => {
    const decimalIndex = str.indexOf('.')
    return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1
  }))

  // 将所有数字相加，并保留最多位小数的长度
  const sum = numbers.reduce((acc, curr) => acc + curr, 0)
  return Number(sum.toFixed(maxDecimalLength))
}
