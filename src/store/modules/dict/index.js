// import { getAllEthnicityEnum } from '@/api/allArchives'
// import { queryAreaTypeList } from '@/api/dataCenter'
import { getAllType } from '@/api/config'
import {
  SET_NATION,
  SET_TYPE_LIST,
  SET_SITE_TYPE,
  SET_DEVICE_TYPE,
  SET_ACCESS_TYPE,
  SET_AREA_TYPE_LIST,
  SET_PERSON_TYPE,
  // SET_Relation_TYPE_LIST
} from './mutaion-types'

const FILETER_TYPE = ['name', 'id_num', 'person', 'game', 'unknown_type']

const formatListToMap = list => {
  if (!Array.isArray(list) || list.length == 0) return {}
  return list.reduce(
    (acc, cur) => (!Reflect.has(acc, cur.value) && (acc[cur.value] = cur.label), acc),
    {}
  )
}

const formatListToMapALl = (list, key, val) => {
  if (!Array.isArray(list) || list.length == 0) return {}
  return list.reduce(
    (acc, cur) => (!Reflect.has(acc, cur[key]) && (acc[cur[key]] = cur[val]), acc),
    {}
  )
}

const state = {
  extrTypeList: [], // 项目主要类型列表
  extrRelationTypeList: [], // 项目主要关系类型列表
  nationList: [], // 民族
  extrAreaTypeList: [], //区域类型
  siteTypeList: [], // 场所类型
  deviceTypeList: [], // 设备类型
  accessTypeList: [], //
  personTypeList: [],//人物类型
}

const getters = {
  usefulTypeList: state => state.extrTypeList.filter(type => !FILETER_TYPE.includes(type.typeCode)),
  usefulRelationTypeList: state => state.extrRelationTypeList.filter(type => type.typeCode),
  nationListMap: state => formatListToMap(state.nationList),
  usefulRelationTypeListMap: state => formatListToMapALl(state.extrRelationTypeList,'typeCode', 'typeName'),
  personTypeListMap: state => formatListToMap(state.personTypeList),
  siteTypeListMap: state => formatListToMapALl(state.siteTypeList, 'dictDataCode', 'dictDataValue'),
  accessTypeListMap: state => formatListToMapALl(state.accessTypeList, 'dictDataCode', 'dictDataValue'),
  deviceTypeListMap: state =>
    formatListToMapALl(state.deviceTypeList, 'dictDataCode', 'dictDataValue')
}

const mutations = {
  [SET_NATION] (state, list) {
    state.nationList = list || []
  },
  [SET_TYPE_LIST] (state, list) {
    state.extrTypeList = list?.map(_c => {
      return {
        typeName: _c.CName,
        typeCode: _c.EName,
      }
    }) ?? []
  },
  // [SET_Relation_TYPE_LIST] (state, list) {
  //   state.extrRelationTypeList = list || []
  // },
  [SET_SITE_TYPE] (state, list) {
    state.siteTypeList = list || []
  },
  [SET_DEVICE_TYPE] (state, list) {
    state.deviceTypeList = list || []
  },
  [SET_ACCESS_TYPE] (state, list) {
    state.accessTypeList = list || []
  },
  [SET_PERSON_TYPE] (state, list) {
    state.personTypeList = list || []
  },
  [SET_AREA_TYPE_LIST] (state, list) {
    if (!list) return []
    state.extrAreaTypeList = list?.map(_c => {
      return {
        label: _c.CName,
        value: _c.EName
      }
    })
  }
}

const actions = {
  // async getNationList ({ commit }) {
  //   if (state.nationList.length > 0) return state.nationList // 如果有就不必重复请求
  //   const list = await getAllEthnicityEnum()
  //   commit(SET_NATION, list)
  //   return list
  // },

  // async getExtraTypeList ({ commit }) {
  //   if (state.extrTypeList.length > 0) return state.extrTypeList
  //   let tempList = await queryTypeList()
  //   let list = []
  //   tempList.forEach(item => {
  //     if (item.EName !== "attr_wechat_type" &&
  //       item.EName !== "attr_qq_type" &&
  //       item.EName !== "attr_qq_type" &&
  //       item.EName !== "attr_network_account_type" &&
  //       item.EName !== "attr_dst_v4ip_type" &&
  //       item.EName !== "attr_src_v4ip_type"
  //     ) {
  //       list.push(item)
  //     }
  //   })
  //   commit(SET_TYPE_LIST, list)
  //   return list
  // },

  // async getExtraRelationTypeList ({ commit }) {
  //   if (state.extrRelationTypeList.length > 0) return state.extrRelationTypeList
  //   const list = await getEchartsType()
  //   commit(SET_Relation_TYPE_LIST, list)
  //   return list
  //   // return []
  // },

  async getTypeList ({ commit }) {
    if (state.siteTypeList.length > 0)
      return {
        PlaceType: state.siteTypeList,
        DeviceType: state.deviceTypeList,
        AccessType: state.accessTypeList
      }

    const listObj = await getAllType()
    const map = ['PlaceType', 'DeviceType', 'AccessType']
    commit(SET_SITE_TYPE, listObj[map[0]])
    commit(SET_DEVICE_TYPE, listObj[map[1]])
    commit(SET_ACCESS_TYPE, listObj[map[2]])
    return listObj
  },

  // async getExtraAreaTypeList ({ commit }) {
  //   if (state.extrAreaTypeList?.length > 0) return state.extrAreaTypeList
  //   const list = await queryAreaTypeList()
  //   commit(SET_AREA_TYPE_LIST, list)
  //   return list
  // },

  // async getPersonTypeList ({ commit }) {
  //   if (state.personTypeList?.length > 0) return state.personTypeList
  //   const obj = await getAllPersonTypes()
  //   let list = []
  //   Object.keys(obj).forEach(key => {
  //     list.push({
  //       label: obj[key],
  //       value: key
  //     })
  //   })
  //   commit(SET_PERSON_TYPE, list)
  //   return list
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
