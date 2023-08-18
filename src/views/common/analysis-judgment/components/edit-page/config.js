import { pinyin } from 'pinyin-pro'

/* 操作按钮配置 */
export const OPERA_OPTIONS = [
  [
    { name: '汇总', icon: 'icon-huizong', popTitle: '汇总', popWidth: '542px', type: 'aggregate' },
    { name: '算法', icon: 'icon-suanfa', popTitle: '算法', popWidth: document.body.clientWidth<1300? '800px' : '696px', type: 'algorithm' },
  ],
  [
    { name: '分组', icon: 'icon-fenzu', popTitle: '分组', popWidth: '634px', type: 'group' },
    { name: '时间转换', icon: 'icon-shijianzhuanhuan', popTitle: '时间转换', popWidth: '542px', type: 'time_conversion' },
  ],
  [
    { name: '排序', icon: 'icon-paixu', popTitle: '排序', popWidth: '422px', type: 'sort' },
    { name: '过滤', icon: 'icon-shaixuan', popTitle: '过滤', popWidth: '920px', type: 'filter' },
  ],
  [
    { name: '字段设置', icon: 'icon-ziduanshezhi', popTitle: '字段设置', popWidth: '1062px', type: 'field' }
  ],
  [
    { name: '左右合并', icon: 'icon-zuoyouhebing', popTitle: '左右合并', popWidth: '580px', type: 'merge' }
  ],
  [
    { name: '图表', icon: 'icon-tubiao', popTitle: '图表', popWidth: '1066px', type: 'chart' },
    { name: '列表', icon: 'icon-a-zu5779', popTitle: '', popWidth: '', type: 'list' },
    { name: '详情', icon: 'icon-xiangqing1', popTitle: '', popWidth: '', type: 'detail' },
  ],
  [
    { name: '链接', icon: 'icon-lianjie', popTitle: '链接', popWidth: '620px', type: 'link' }
  ],
]

/* 操作类型对应的图标和文本信息 */
export const OPERA_TYPE = {
  'add_datasource': {
    'icon': 'icon-a-zu5741',
    'name': '',
    'editApi': ''
  },
  'aggregate': {
    'icon': 'icon-huizong',
    'name': '汇总',
    'editApi': '/app/modeling/aggregate/find',
    'delApi': '/app/modeling/aggregate/delete',
    'popWidth': '542px'
  },
  'algorithm': {
    'icon': 'icon-suanfa',
    'name': '算法',
    'editApi': '/app/modeling/algorithm/find',
    'delApi': '/app/modeling/algorithm/delete',
    'popWidth': '696px'
  },
  'group': {
    'icon': 'icon-fenzu',
    'name': '分组',
    'editApi': '/app/modeling/group/find',
    'delApi': '/app/modeling/group/delete',
    'popWidth': '634px',
  },
  'time_conversion': {
    'icon': 'icon-shijianzhuanhuan',
    'name': '时间转换',
    'editApi': '/app/modeling/time_conversion/find',
    'delApi': '/app/modeling/time_conversion/delete',
    'popWidth': '542px'
  },
  'sort': {
    'icon': 'icon-paixu',
    'name': '排序',
    'editApi': '/app/modeling/sort/find',
    'delApi': '/app/modeling/sort/delete',
    'popWidth': '422px'
  },
  'filter': {
    'icon': 'icon-shaixuan',
    'name': '过滤',
    'editApi': '/app/modeling/filter/find',
    'delApi': '/app/modeling/filter/delete',
    'popWidth': '920px'
  },
  'field': {
    'icon': 'icon-ziduanshezhi',
    'name': '字段设置',
    'editApi': '/app/modeling/field/find',
    'delApi': '/app/modeling/field/delete',
    'popWidth': '1062px'
  },
  'merge': {
    'icon': 'icon-zuoyouhebing',
    'name': '左右合并',
    'editApi': '/app/modeling/merge/find',
    'delApi': '/app/modeling/merge/delete',
    'popWidth': '580px'
  },
  'chart': {
    'icon': 'icon-tubiao',
    'name': '图表',
    'editApi': '/app/modeling/display/find',
    'delApi': '/app/modeling/display/delete',
    'popWidth': '1066px'
  },
  'list': {
    'icon': 'icon-a-zu5779',
    'delApi': '/app/modeling/display/delete',
    'name': '列表'
  },
  'detail': {
    'icon': 'icon-xiangqing1',
    'delApi': '/app/modeling/display/delete',
    'name': '详情'
  },
  'link': {
    'icon': 'icon-lianjie',
    'name': '链接',
    'editApi': '/app/modeling/link/find',
    'delApi': '/app/modeling/link/delete',
    'popWidth': '620px'
  },
}
/* 链接--图标选择选项配置 */
export const LINK_ICON_OPTIONS = [
  { label: '详情', value: 'detail', icon: 'icon-xiangqing' },
  { label: '档案', value: 'archives', icon: 'icon-dangan' },
  { label: '定位', value: 'orientation', icon: 'icon-guiji' },
]
/* 过滤--过滤方式选项 */
export const FILTER_OPTIONS = {
  'STRING': [
    { label: '属于', value: 'eq', inputType: 'input' },
    { label: '不属于', value: 'ne', inputType: 'input' },
    { label: '包含', value: 'like', inputType: 'input' },
    { label: '不包含', value: 'notLike', inputType: 'input' },
    { label: '为空', value: 'isNull', inputType: null },
    { label: '非空', value: 'isNotNull', inputType: null }
  ],
  'BIGINT': [
    { label: '介于', value: 'between', inputType: 'numberRange' },
    { label: '不介于', value: 'notBetween', inputType: 'numberRange' },
    { label: '=', value: 'eq', inputType: 'input' },
    { label: '!=', value: 'ne', inputType: 'input' },
    { label: '>', value: 'gt', inputType: 'input' },
    { label: '>=', value: 'ge', inputType: 'input' },
    { label: '<', value: 'lt', inputType: 'input' },
    { label: '<=', value: 'le', inputType: 'input' },
    { label: '为空', value: 'isNull', inputType: null },
    { label: '非空', value: 'isNotNull', inputType: null }
  ],
  'TIMESTAMP': [
    { label: '介于', value: 'between', inputType: 'timeDateRange' },
    { label: '不介于', value: 'notBetween', inputType: 'timeDateRange' },
    { label: '=', value: 'eq', inputType: 'timeDate' },
    { label: '!=', value: 'ne', inputType: 'timeDate' },
    { label: '为空', value: 'isNull', inputType: null },
    { label: '非空', value: 'isNotNull', inputType: null }
  ]
}
/* 过滤--过滤条件为介于和不介于时选项 */
export const NUMBER_RANGE_OPTIONS = [
  { label: '<', value: 'less' },
  { label: '<=', value: 'lessOrEqual' }
]

/* 算法--算法类别 */
export const ALG_OPTIONS = [
  { label: '聚类算法', value: 'kmeans', formLabelLength: 6 },
  { label: '决策树算法', value: 'decision_tree', formLabelLength: 5 },
  { label: '随机森林算法', value: 'random_forest', formLabelLength: 5 },
]

/* 算法--表单配置 */
export const ALG_FORM_INFO = {
  'kmeans': {
    tip: '数据量大于100万时，将随机选取100万条数据进行计算',
    formItem: [
      {
        label: '特征名称',
        prop: 'features',
        defaultValue: '',
        formType: 'input',
        placeholder: '请输入',
        isAddField: true
      },
      {
        label: '分组名称',
        prop: 'prediction',
        defaultValue: '',
        formType: 'input',
        placeholder: '请输入',
        isAddField: true
      },
      {
        label: '特征字段',
        prop: 'feature_columns',
        defaultValue: '',
        formType: 'select',
        placeholder: '请选择',
        multiple: true,
        fieldType: 'BIGINT'
      },
      {
        label: '簇数',
        prop: 'k',
        defaultValue: '',
        formType: 'input',
        placeholder: '请输入'
      },
      {
        label: '最大迭代数',
        prop: 'maxIter',
        defaultValue: '',
        formType: 'input',
        placeholder: '推荐20以上'
      },
    ],
    formRule: {
      'features': [
        { required: true, message: '特征名称不可为空', trigger: 'blur' },
      ],
      'prediction': [
        { required: true, message: '分组名称不可为空', trigger: 'blur' },
      ],
      'feature_columns': [
        { required: true, message: '特征字段不可为空', trigger: 'blur' },
      ],
      'k': [
        { required: true, message: '簇数不可为空', trigger: 'blur' },
        { pattern: /^[1-9]\d*$/, message: '簇数有误', trigger: 'blur' }
      ],
      'maxIter': [
        { required: true, message: '最大迭代数不可为空', trigger: 'blur' },
        { pattern: /^[1-9]\d*$/, message: '最大迭代数有误', trigger: 'blur' }
      ]
    }
  },
  'decision_tree': {
    tip: '数据量大于100万时，将随机选取100万条数据进行计算。结果字段数据范围为0~99，其他数据将被删除',
    formItem: [
      {
        label: '特征字段',
        prop: 'feature_columns',
        defaultValue: '',
        formType: 'select',
        placeholder: '请选择',
        multiple: true,
        fieldType: 'BIGINT'
      },
      {
        label: '结果字段',
        prop: 'label_column',
        defaultValue: '',
        formType: 'select',
        placeholder: '请选择',
        fieldType: 'BIGINT'
      },
      {
        label: '算法类型',
        prop: 'decision_type',
        defaultValue: '',
        formType: 'select',
        normal: true,
        placeholder: '请选择',
        fieldType: 'BIGINT',
        options: [
          { label: 'classification', value: 'classification' },
          { label: 'regression', value: 'regression' }
        ]
      },
    ],
    formRule: {
      'feature_columns': [
        { required: true, message: '特征字段不可为空', trigger: 'blur' },
      ],
      'label_column': [
        { required: true, message: '结果字段不可为空', trigger: 'blur' },
      ],
      'decision_type': [
        { required: true, message: '算法类型不可为空', trigger: 'blur' },
      ]
    }
  },
  'random_forest': {
    tip: '数据量大于100万时，将随机选取100万条数据进行计算。结果字段数据范围为0~99，其他数据将被删除',
    formItem: [
      {
        label: '特征字段',
        prop: 'feature_columns',
        defaultValue: '',
        formType: 'select',
        placeholder: '请选择',
        multiple: true,
        fieldType: 'BIGINT'
      },
      {
        label: '结果字段',
        prop: 'label_column',
        defaultValue: '',
        formType: 'select',
        placeholder: '请选择',
        fieldType: 'BIGINT'
      }
    ],
    formRule: {
      'feature_columns': [
        { required: true, message: '特征字段不可为空', trigger: 'blur' },
      ],
      'label_column': [
        { required: true, message: '结果字段不可为空', trigger: 'blur' },
      ]
    }
  }
}

// 中文转换拼音
export function toPinYin (value) {
  let result = value.replace(/[\u4E00-\u9FA5]/g, (match) => {
    return `&转${pinyin(match, { toneType: 'none' })}&转`
  }).split('&转').filter(item => item)
  return result.join('_')
}
