// import { useStore } from '@/store/'
// const store = useStore()
// const theme = store.state.User.theme
// const TEXT_FILL = new ol.style.Fill({ color: '#fff' })
// const BOX_FILL = new ol.style.Fill({ color: 'rgba(69, 150, 230, 0.35)' })
// const BOX_STROKE = new ol.style.Stroke({
//   color: '#3399CC',
//   width: 1.25
// })

const imgW = 24
// const imgH = 24
const COMPOSITETYPE = 99


const colorMap = {
  1: '#e64545',
  2: '#e6457b',
  3: '#7b45e6',
  4: '#5c5ce6',
  5: '#3dcccc',
  6: '#36b336',
  7: '#e6cb45',
  8: '#e67b45',
  9: '#4596e6',
  10: '#4596e6',
  11: '#4596e6',
  99: '#9faecc', // 置灰
}

const bgColorMap = {
  1: 'rgba(230, 69, 69, 0.3)',
  2: 'rgba(230, 69, 123, 0.3)',
  3: 'rgba(123, 69, 230, 0.3)',
  4: 'rgba(92, 92, 230, 0.3)',
  5: 'rgba(61, 204, 204, 0.3)',
  6: 'rgba(54, 179, 54, 0.3)',
  7: 'rgba(230, 203, 69, 0.3)',
  8: 'rgba(230, 123, 69, 0.3)',
  9: 'rgba(21, 148, 244, 0.3)',
  10: 'rgba(21, 148, 244, 0.3)',
  11: 'rgba(21, 148, 244, 0.3)',
  99: 'rgba(159,174,204,0.3)', // 置灰
}


/**
 * 如果有相同的类型就返回相同类型，不然则返回复合类型，示例如下：
 * [1,1,1,1,1] => 1, [1,2,3,4] => compositeType
 * @param {Array} list 类型列表 number[]
 * @param {Number} compositeType 复合类型的默认值
 * @returns
 */
function judgeType (list, compositeType = 10) {
  if (list.length < 1) return false

  const baseType = list[0]
  for (let i = 1; i < list.length; i++) {
    if (list[i] !== baseType) return compositeType
  }
  return baseType
}


// 提前生成对应的 canvas，但是会影响主线程
const bufferCanvas = {}
const imgTypeIndexs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
imgTypeIndexs.map((type) => {
  const flag = true
  // const key = `${type}${flag ? '' : '-g'}`
  const key = `${localStorage.getItem('theme') === 'light' ? '-light' : ''}-${type}${flag ? '' : '-g'}`
  bufferCanvas[key] = generateCanvas(type, flag)
})

imgTypeIndexs.map((type) => {
  const flag = false
  // const key = `${type}${flag ? '' : '-g'}`
  const key = `${localStorage.getItem('theme') === 'light' ? '-light' : ''}-${type}${flag ? '' : '-g'}`
  bufferCanvas[key] = generateCanvas(type, flag)
})


function generateCanvas (type, online) {
  const curCanvas = document.createElement('canvas')
  const ctx = curCanvas.getContext('2d')
  const image = new Image()
  const imgUrl = judgeImgUrl(type, online)
  image.src = require(`@/assets/img/${imgUrl}`)
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 24, 24)
  }
  return curCanvas
}

function generateBufferCanvas (type, online) {
  // const key = `${type}${online ? '' : '-g'}`
  const key = `${localStorage.getItem('theme') === 'light' ? '-light' : ''}-${type}${online ? '' : '-g'}`
  if (bufferCanvas[key]) {
    return bufferCanvas[key]
  }
  bufferCanvas[key] = generateCanvas(type, online)
  return bufferCanvas[key]
}

/**
 * 圆角矩形
 * @param {object} context 画笔上下文
 * @param {object} config 配置
 */
function drawRadius (context, config) {
  const { x, y, w, h, r } = config
  context.beginPath()
  context.moveTo(x + r, y)
  context.arcTo(x + w, y, x + w, y + h, r)
  context.arcTo(x + w, y + h, x, y + h, r)
  context.arcTo(x, y + h, x, y, r)
  context.arcTo(x, y, x + w, y, r)
  context.closePath()
  context.stroke()
  context.fill()
}


function judgeImgUrl (type, online) {
  // return `icon-tab-small-${type}${online ? '' : '-g'}.png`
  return `icon-tab-small${localStorage.getItem('theme') === 'light' ? '-light' : ''}-${type}${online ? '' : '-g'}.png`
}

// 对象池 4 -> 4 + 4 =  8 => 1000
export function generateCanvasCustom (text, featureList) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const textW = context.measureText(text).width
  canvas.width = 80 + textW + imgW
  canvas.height = imgW
  const isOnline = featureList.some(_c => _c.online) // 影响图片置灰和边框
  const curType = judgeType(featureList.map(_c => _c.otype)) || '10'
  const config = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    r: 12
  }
  context.drawImage(generateBufferCanvas(curType, isOnline), 0, 0)
  context.fillStyle = isOnline ? bgColorMap[curType] : bgColorMap[COMPOSITETYPE]
  context.strokeStyle = isOnline ? colorMap[curType] : colorMap[COMPOSITETYPE]
  drawRadius(context, config)
  return canvas
}
