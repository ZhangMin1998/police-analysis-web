import { mapInfo } from '@/config/config.js'
import store from '@/store/'
function forMatter (list) {
  let obj = { zooms: [] }
  list.forEach(item => {
    if (item.key === 'minZoom') {
      obj.zooms[0] = Number(item.value)
    } else if (item.key === 'maxZoom') {
      obj.zooms[1] = Number(item.value)
    } else if (item.key === 'online') {
      obj[item['key']] = JSON.parse(item.value)
    } else {
      obj[item['key']] = item.value
    }
  })
  obj.zoom = Number(obj.defaultZoom)
  return obj
}
// 获取区域块list
function mapIntoPart (obj) {
  //区域所在经度/纬度
  //设置经纬度分为多少段
  const { leftX, rightX, BottomY, TopY, partX, partY } = obj

  //计算经纬度相差数量
  const differX = leftX - rightX
  const differY = BottomY - TopY
  //计算经纬度每段间隔多少
  const intervalX = differX / partX
  const intervalY = differY / partY
  // alert(intervalX+":"+intervalY);
  //以上参数设置完毕后，这里是按照从左到右的顺序来确定各个区域的经纬度

  let lX, lTopX, rTopX, rX
  let lY, lTopY, rTopY, rY
  let list = []
  for (var i = 0; i <= partX; i++) {
    for (var j = 0; j <= partY; j++) {
      var arr = new Array() //经纬度坐标数组

      lX = (leftX - intervalX * i).toString()
      lTopX = (leftX - intervalX * i).toString()
      rTopX = (leftX - intervalX * (i + 1)).toString()
      rX = (leftX - intervalX * (i + 1)).toString()

      lY = (BottomY - intervalY * j).toString()
      lTopY = (BottomY - intervalY * (j + 1)).toString()
      rTopY = (BottomY - intervalY * (j + 1)).toString()
      rY = (BottomY - intervalY * j).toString()

      arr.push({
        lng: parseFloat(lX),
        lat: parseFloat(lY)
      })
      arr.push({
        lng: parseFloat(lTopX),
        lat: parseFloat(lTopY)
      })
      arr.push({
        lng: parseFloat(rTopX),
        lat: parseFloat(rTopY)
      })
      arr.push({
        lng: parseFloat(rX),
        lat: parseFloat(rY)
      })
      list.push(arr)
    }
  }
  return list
}

export function initUserConfig (res) {
  store.commit('User/setGlobalSettings', res.configurationVOList)
  let clientConfig = forMatter(res.configurationVOList)
  // console.log(clientConfig)
  let {
    centerLongitude,
    centerLatitude,
    zoom,
    zooms,
    online,
    applicationName,
    searchCity,
    dataManageIsEdit,
    dataManageTagIsEdit,
    fuzzySearch
    // selectOptions
  } = clientConfig
  let statStage = clientConfig.statStage || 'file_read'
  // const cityLatLon = {
  //   肇庆: [24.24, 112.52, 22.47, 111.21],
  //   安乡: [29.46, 112.18, 29.08, 110.59],
  //   威海: [37.35, 122.42, 36.41, 121.11],
  //   荣成: [38.27, 123.42, 35.45, 121.08]
  // }
  // let partAttr = {
  //   partX: 2, //局部访问设备列表
  //   partY: 2, //局部访问设备列表
  //   leftX: cityLatLon[searchCity][3],
  //   rightX: cityLatLon[searchCity][1],
  //   BottomY: cityLatLon[searchCity][2],
  //   TopY: cityLatLon[searchCity][0]
  // }
  let partAttr = {
    partX: 2, //局部访问设备列表
    partY: 2, //局部访问设备列表
    leftX: mapInfo[searchCity]['searchExtent'][3],
    rightX: mapInfo[searchCity]['searchExtent'][1],
    BottomY: mapInfo[searchCity]['searchExtent'][2],
    TopY: mapInfo[searchCity]['searchExtent'][0]
  }
  const tempConfig = {
    mapWarnShowList: ['Track', 'Feature'],
    mapLanLonList: mapIntoPart(partAttr),
    centrePos: [centerLongitude, centerLatitude], //中心点
    isOl: online,
    title: applicationName, //标题
    zoom, //层级
    zooms, //层级范围
    searchCity, //搜索城市
    statStage: statStage, // 阶段类型
    dataManageIsEdit: dataManageIsEdit, // 数据管理是否可编辑
    dataManageTagIsEdit:dataManageTagIsEdit, // 数据管理实体库是否可编辑
    fuzzySearch:fuzzySearch // 全库搜索是否进行模糊搜索
  }
  if (store.state.User.loginMap && store.state.User.loginMap === 'tiandimap') {
    const tianMapInfo = {
      extent: mapInfo[searchCity]['mapExtent'],
      tilesPath: mapInfo[searchCity]['mapTilesPathName']
    }
    store.commit('User/setTianMapInfo', tianMapInfo)
  } else {
    store.commit('User/setTianMapInfo', {})
  }
  // 判断是否是超级管理员
  store.state.User.isAdmin = res.id === 1 || res.username === 'admin'
  store.commit('User/setSysConfig', tempConfig)
}
