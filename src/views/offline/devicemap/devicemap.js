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
import img11 from '@/assets/img/icon-tab-small-11.png'

export const imgMap = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
  9: img10,
  11: img11
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
      acc[cur[type]] = objPick(cur, ['type', 'otype', 'index', 'allCount', 'onlineCount', 'ids'])
    }
    return acc
  }, {})
  const flatArr = Object.values(reObj)
  const chunkArr = arrayChunk(flatArr, interval)
  return chunkArr
}
