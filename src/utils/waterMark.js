'use strict'

let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')// 创建一个画布
  can.width = 220 // 设置宽度
  can.height = 220 // 高度

  let cans = can.getContext('2d')
  cans.rotate(30 * Math.PI / 180) // 水印内容旋转角度    0 水平
  cans.font = '12px Microsoft YaHei-Regular Microsoft YaHei'  // 字体大小
  cans.textAlign = 'left' // 设置文本内容的当前对齐方式
  cans.textBaseline = 'Middle' // 设置在绘制文本时使用的当前文本基线
  cans.fillStyle = '#C0D0E7' // 水印的颜色
  // cans.globalAlpha = 0.06 // 透明度
  if (localStorage.getItem('theme') === 'light') {
    cans.globalAlpha = 0.4 // 透明度
  } else {
    cans.globalAlpha = 0.06 // 透明度
  }
  cans.fillText(str, can.width / 2, can.height / 2) // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  // cans.fillText(str1, can.width / 3, can.height / 2.5) // 根据需求可添加多行水印，在方法中添加str1

  let div = document.createElement('div')
  div.id = id
  div.style.transform = 'rotate(-45deg)'
  div.style.display = 'flex'
  div.style.pointerEvents = 'none'
  div.style.top = '-700px'
  div.style.left = '-100px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = '3000px'
  div.style.height = '3000px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark
