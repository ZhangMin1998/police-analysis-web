const { gps } = require('@/utils/resetPosition.js')
// const globalVals = JSON.parse(sessionStorage.getItem('vuex'))
function _isOl () {
  // console.log('useStore', useStore)
  // JSON.parse(sessionStorage.getItem('vuex'))
  const re = JSON.parse(sessionStorage.getItem('vuex'))?.User?.isOl
  return re
}

const _pos = function (...args) {
  if (_isOl()) {
    // if (args.length > 1) {
    //   const _gpsbd = gps.bd_decrypt
    //   return _gpsbd.bind(gps)(args[0], args[1])
    // }
    return [...args]
  } else {
    // TODO: 临时修改
    // return offlinebd(...args)
    if (args.length > 1) {
      // 高德转离线
      const _gpsbd = gps.gcj_decrypt
      const re = _gpsbd.bind(gps)(args[0], args[1])
      return re
    }
    // return [...args]
  }
}

module.exports = {
  _pos,
  _isOl
}
