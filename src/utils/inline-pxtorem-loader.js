/* eslint-disable */
// js渲染的无法转
const loaderUtils = require('loader-utils')
// 默认参数
let defaultOptions = {
  rootValue: 192,
  unitPrecision: 5,
  minPixelValue: 1
}
const pxReg = /(\d+)px/g
const templateReg = /<template>([\s\S]+)<\/template>/g
const targetUnit = 'rem'
module.exports = function (source) {
  const options = loaderUtils.getOptions(this)
  const configs = Object.assign({}, defaultOptions, options)
  let matchSource = ''
  if (templateReg.test(source)) {
    matchSource = source.match(templateReg)[0]
  }
  if (pxReg.test(matchSource)) {
    let result = matchSource.replace(pxReg, pxToRem(configs.rootValue, configs.minPixelValue, configs.unitPrecision))
    return source.replace(templateReg, result)
  } else {
    return source
  }
}
function pxToRem (rootValue, minPixelValue, unitPrecision) {
  return function ($0, $1) {
    if (!$1) return
    let pixels = parseFloat($1)
    if (pixels <= minPixelValue) return
    return (pixels / rootValue).toFixed(unitPrecision) + targetUnit
  }
}
