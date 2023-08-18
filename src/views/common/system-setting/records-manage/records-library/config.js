// 实体列表表头数据
export const ENTITY_TABLE_LIST = [
  { label: '标签名称', prop: 'labelName', minWidth: '12.83%', haveSlot: true },
  { label: '标准', prop: 'dataStandardId', minWidth: '14.41%', haveSlot: true },
  { label: '描述', prop: 'labelDescription', minWidth: '14.41%' },
  { label: '操作时间', prop: 'updateTime', minWidth: '16.95%',
    renderFun (row) {
      if (!row.updateTime) return '--'
      return new Date(row.updateTime).toLocaleString()
    }
  },
  { label: '操作人', prop: 'operator', minWidth: '8.85%' }
]
// 关系列表表头数据
export const RELATION_TABLE_LIST = [
  { label: '关系名称', prop: 'relationshipName', minWidth: '12.83%' },
  { label: '关系状态', prop: 'reStandardId', minWidth: '14.41%', haveSlot: true },
  // { label: '关系指向', prop: 'startEntityName', minWidth: '11.94%', haveSlot: true },
  { label: '描述', prop: 'relationshipDescription', minWidth: '14.41%' },
  { label: '操作时间', prop: 'updateTime', minWidth: '16.95%',
    renderFun (row) {
      if (!row.updateTime) return '--'
      return new Date(row.updateTime).toLocaleString()
    }
  },
  { label: '操作人', prop: 'operator', minWidth: '8.85%' }
]
// 数据标准列表表头数据
export const STANDARD_TABLE_LIST = [
  { label: '标准', prop: 'standardName', minWidth: '30.83%', haveSlot: true },
  { label: '范围', prop: 'standardDescription', minWidth: '32.41%' },
  { label: '操作时间', prop: 'updateTime', minWidth: '16.95%',
    renderFun (row) {
      if (!row.updateTime) return '--'
      return new Date(row.updateTime).toLocaleString()
    }
  },
  { label: '操作人', prop: 'operator', minWidth: '11.85%' }
]

export function validate (rule, value, callback) {
  if (value) {
    let firstReg = /^[A-Za-z\u4E00-\u9FA5]+$/g
    let otherReg = /^[A-Za-z_\u4E00-\u9FA5\d]+$/g
    let first = value.slice(0, 1)
    let other = value.slice(1)
    if (!firstReg.test(first)) {
      callback(new Error('仅支持填写中文、字母，数字或下划线，且首字符必须填写中文或字母'))
    } else if (other && !otherReg.test(other)) {
      callback(new Error('仅支持填写中文、字母，数字或下划线，且首字符必须填写中文或字母'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
