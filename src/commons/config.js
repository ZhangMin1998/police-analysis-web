import { arrayChunk, objPick } from '@/utils/index'

import img1 from '@/assets/img/icon-tab-small-1.png'
import img2 from '@/assets/img/icon-tab-small-2.png'
import img3 from '@/assets/img/icon-tab-small-3.png'
import img4 from '@/assets/img/icon-tab-small-4.png'
import img5 from '@/assets/img/icon-tab-small-5.png'
import img6 from '@/assets/img/icon-tab-small-6.png'
import img7 from '@/assets/img/icon-tab-small-7.png'
import img8 from '@/assets/img/icon-tab-small-8.png'
import img10 from '@/assets/img/icon-tab-small-10.png'

import { useStore } from '@/store/'
const store = useStore()
const theme = store.state.User.theme

export const COMPOSITETYPE = 99

export const imgMap = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
  9: img10
}

export function judgeImgUrl (type, online) {
  return `icon-tab-small${theme === 'light' ? '-light' : ''}-${type}${online ? '' : '-g'}.png`
}

export const clusterColorMap = {
  1: '#e64545',
  2: '#e6457b',
  3: '#7b45e6',
  4: '#5c5ce6',
  5: '#3dcccc',
  6: '#36b336',
  7: '#e6cb45',
  8: '#e67b45',
  10: '#4596e6',
  99: '#9faecc', // 置灰
}

export const clusterBgColorMap = {
  1: 'rgba(230, 69, 69, 0.3)',
  2: 'rgba(230, 69, 123, 0.3)',
  3: 'rgba(123, 69, 230, 0.3)',
  4: 'rgba(92, 92, 230, 0.3)',
  5: 'rgba(61, 204, 204, 0.3)',
  6: 'rgba(54, 179, 54, 0.3)',
  7: 'rgba(230, 203, 69, 0.3)',
  8: 'rgba(230, 123, 69, 0.3)',
  10: 'rgba(21, 148, 244, 0.3)',
  99: 'rgba(159,174,204,0.3)', // 置灰
}

export function judgeType (list, compositeType = 10) {
  if (list.length < 1) return false

  const baseType = list[0]
  for (let i = 1; i < list.length; i++) {
    if (list[i] !== baseType) return compositeType
  }
  return baseType
}

export const formatUniqueList = (list, type, interval = 4) => {
  const reObj = list.reduce((acc, cur) => {
    if (Reflect.has(acc, cur[type])) {
      const curItem = acc[cur[type]]
      curItem.onlineCount += cur.online ? 1 : 0
      curItem.allCount += 1
      curItem.ids.push(cur.id)
    } else {
      cur.allCount = 1
      cur.onlineCount = cur.online ? 1 : 0
      cur.ids = [cur.id]
      acc[cur[type]] = objPick(cur, ['otype', 'index', 'allCount', 'onlineCount', 'ids'])
    }
    return acc
  }, {})
  const flatArr = Object.values(reObj)
  const chunkArr = arrayChunk(flatArr, interval)
  return chunkArr
}

// export const iconList = [
//   { title: '设备', active: 'img/icon-tab-1.png', inactive: 'img/icon-tab-grey-1.png', type: 1, isActive: true },
//   { title: '设备', active: 'img/icon-tab-2.png', inactive: 'img/icon-tab-grey-2.png', type: 2, isActive: true },
//   { title: '设备', active: 'img/icon-tab-3.png', inactive: 'img/icon-tab-grey-3.png', type: 3, isActive: true },
//   { title: '设备', active: 'img/icon-tab-4.png', inactive: 'img/icon-tab-grey-4.png', type: 4, isActive: true },
//   { title: '设备', active: 'img/icon-tab-5.png', inactive: 'img/icon-tab-grey-5.png', type: 5, isActive: true },
//   { title: '设备', active: 'img/icon-tab-6.png', inactive: 'img/icon-tab-grey-6.png', type: 6, isActive: true },
//   { title: '设备', active: 'img/icon-tab-7.png', inactive: 'img/icon-tab-grey-7.png', type: 7, isActive: true },
//   { title: '设备', active: 'img/icon-tab-8.png', inactive: 'img/icon-tab-grey-8.png', type: 8, isActive: true },
// ]

// export const siteIconList = [
//   { title: '场所', active: 'img/icon-tab-room.png', inactive: 'img/icon-tab-room-grey.png', type: 9, isActive: false },
// ]
