import { judgeType, clusterColorMap, clusterBgColorMap, COMPOSITETYPE, judgeImgUrl } from '@/commons/config'
import { useStore } from '@/store/'

const store = useStore()
export const CIRCLE_ZOOM = 17

// 生成设备聚合
export function generateFeatureStyle (context) {
  // const _m= context.marker
  // const _m_id = _m._amap_id
  // 首先要判断是场所还是 设备，只有设备才显示 在线离线比
  let parentHtml
  const curZoom = store.state.User.zoom

  if (curZoom <= CIRCLE_ZOOM) {
    parentHtml = document.createElement('div')
    const count = context.markers.length
    parentHtml.className = 'amap-device-circle-cluster'
    parentHtml.innerText = count
    const size = calcSize(count) + 'px'
    parentHtml.style.width = size
    parentHtml.style.lineHeight = size
  } else {
    const listData = context.markers.map(item => item.getExtData())
    // let cateMarkerHtml
    const onCount = listData.reduce((acc, cur) => acc + cur.online , 0) // 在线数量
    const isOnline = onCount > 0 // 是否在线
    const markerType = judgeType(listData.map(_c => _c.type)) // 聚合类型
    // 绘制外层
    parentHtml = document.createElement('div') // 父元素
    parentHtml.style.borderColor = isOnline ? clusterColorMap[markerType] : clusterColorMap[COMPOSITETYPE]
    parentHtml.style.backgroundColor = isOnline ? clusterBgColorMap[markerType] : clusterBgColorMap[COMPOSITETYPE]
    parentHtml.className = 'amap-device-cluster'
    const img = document.createElement('img')
    // 绘制左边图片
    const imgUrl = judgeImgUrl(markerType, isOnline)
    img.src = require(`@/assets/img/${imgUrl}`)
    img.width = '24'
    img.height=  '24'
    img.borderRadius = '50%'
    parentHtml.appendChild(img)
    // 绘制右边
    const div = document.createElement('div')
    div.innerHTML = `${onCount} / ${context.count}`
    div.className = 'amap-device-cluster-text'
    parentHtml.appendChild(div)
    // cateMarkerHtml && parentHtml.appendChild(cateMarkerHtml)
    // styleCache.set(_m_id, parentHtml)
  }
  return parentHtml
}


// 生成场所聚合
export function generateClusterStyle (context, styleCache) {
  const _m= context.marker
  const _m_id = _m._amap_id
  let parentHtml
  const isHasId = styleCache.get(_m_id)
  if (isHasId) {
    parentHtml = isHasId
  } else {
    // const listData = context.markers.map(item => item.getExtData())
    parentHtml = document.createElement('div')
    const count = context.markers.length
    const size = calcSize(count) + 'px'
    parentHtml.className = 'amap-custom-cluster'
    parentHtml.innerText = count
    parentHtml.style.width = size
    parentHtml.style.lineHeight = size
    styleCache.set(_m_id, parentHtml)
  }
  return parentHtml
}

/**
 * 设备聚合 - 设备选择高亮功能
 * @param {Object} context 聚合对象
 * @param {Map} styleCache 缓存聚合对象
 * @returns Dom 节点
 */
export function generateFeatureChooseStyle (context) {
  // const _m= context.marker
  // 首先要判断是场所还是 设备，只有设备才显示 在线离线比
  let parentHtml
  const curZoom = store.state.User.zoom
  if (curZoom <= CIRCLE_ZOOM) {
    parentHtml = document.createElement('div')
    const count = context.markers.length
    parentHtml.className = 'amap-device-circle-cluster'
    parentHtml.innerText = count
    const size = calcSize(count) + 'px'
    parentHtml.style.width = size
    parentHtml.style.lineHeight = size
  }
  else {
    const listData = context.markers.map(item => item.getExtData())
    // let cateMarkerHtml
    const activeCount = listData.reduce((acc, cur) => acc + cur.isActive , 0) // 激活数量
    const isHighlight = activeCount > 0 // 是否在线
    const markerType = judgeType(listData.map(_c => _c.otype)) // 聚合类型
    // 绘制外层
    parentHtml = document.createElement('div') // 父元素
    parentHtml.style.borderColor = isHighlight ? clusterColorMap[markerType] : clusterColorMap[COMPOSITETYPE]
    parentHtml.style.backgroundColor = isHighlight ? clusterBgColorMap[markerType] : clusterBgColorMap[COMPOSITETYPE]
    parentHtml.className = 'amap-device-cluster'
    const img = document.createElement('img')
    // 绘制左边图片
    const imgUrl = judgeImgUrl(markerType, isHighlight)
    img.src = require(`@/assets/img/${imgUrl}`)
    img.width = '24'
    img.height=  '24'
    img.borderRadius = '50%'
    parentHtml.appendChild(img)
    // 绘制右边
    const div = document.createElement('div')
    div.innerHTML = `${activeCount} / ${context.count}`
    div.className = 'amap-device-cluster-text'
    parentHtml.appendChild(div)
  }
    // cateMarkerHtml && parentHtml.appendChild(cateMarkerHtml)
    // styleCache.set(_m_id, parentHtml)

  return parentHtml
}

/**
 * 根据聚合点个数来计算聚合大小
 * @param {number} count 标注个数
 * @returns string 聚合大小
 */
function calcSize (count) {
  if (count < 100) return '48'
  if (count < 1000) return '64'
  return '80'
}
