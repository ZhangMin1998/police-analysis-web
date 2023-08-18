import dayjs from '@/utils/filters'
export default {
  // 复工复产
  'epidemic_resumework': {
    url: '/dataCenter/dataList',
    isWarning: true,
    getMethod: 'get',
    colList: [
      { label: '姓名', prop: 'name', minWidth: '8.73%' },
      {
        label: '性别', prop: 'gender', minWidth: '6.02%',
        renderFun: function (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '证件号码', prop: 'cerNumber', minWidth: '14.54%' },
      { label: '手机', prop: 'phone', minWidth: '10.6%' },
      { label: '居住地址', prop: 'liveAddress', minWidth: '18.5%' },
      { label: '出行方式', prop: 'tripMode', minWidth: '8.29%' },
      { label: '前往地点', prop: 'resumeworkAddress', minWidth: '19.75%' },
      { label: '登记时间', prop: 'collectTime', minWidth: '13.57%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterSS(row.collectTime)
        }
      }
    ]
  },
  // wifi
  'probe_wifi': {
    url: '/dataCenter/dataList',
    isWarning: true,
    getMethod: 'get',
    colList: [
      {
        label: '采集时间',
        prop: 'collectTime',
        minWidth: '15.17%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterExactS(row.collectTime)
        }
      },
      { label: '场所', prop: 'placeName', minWidth: '10.93%' },
      { label: '热点名称', prop: 'ssid', minWidth: '9.94%' },
      { label: 'MAC', prop: 'mac', minWidth: '15.77%' },
      { label: '设备', prop: 'deviceName', minWidth: '10.68%' },
      { label: '经度', prop: 'longitude', minWidth: '12.38%' },
      { label: '纬度', prop: 'latitude', minWidth: '12.4%' },
      { label: '设备厂商', prop: 'factoryName', minWidth: '12.73%',
        renderFun (row) {
          if (!row.factoryName) return '--'
          return row.factoryName
        }
      }
    ]
  },
  // 探针数据
  'probe_mac': {
    url: '/dataCenter/dataList',
    isWarning: true,
    getMethod: 'get',
    colList: [
      {
        label: '采集时间',
        prop: 'collectTime',
        minWidth: '16.875%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterExactS(row.collectTime)
        }
      },
      { label: '场所', prop: 'placeName', minWidth: '13.75%' },
      { label: 'MAC', prop: 'mac', minWidth: '17.73%' },
      { label: '设备', prop: 'deviceName', minWidth: '11.87%' },
      { label: '经度', prop: 'longitude', minWidth: '13.75%' },
      { label: '纬度', prop: 'latitude', minWidth: '13.295%' },
      { label: '设备厂商', prop: 'factoryName', minWidth: '12.73%',
        renderFun (row) {
          if (!row.factoryName) return '--'
          return row.factoryName
        }
      },
    ]
  },
  // 审计数据
  'net_web': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '场所名称', prop: 'placeName', minWidth: '20.64%' },
      { label: '设备名称', prop: 'deviceName', minWidth: '19.64%' },
      { label: '终端MAC', prop: 'mac', minWidth: '15.5%' },
      { label: '目的IP', prop: 'dstVA4ip', minWidth: '15.5%' },
      { label: '操作类型', prop: 'webType', minWidth: '13.79%',
        renderFun: function () {
          return '网页类型'
        }
      },
      { label: '采集时间', prop: 'collectTime', minWidth: '14.93%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          return dayjs.filterExactS(row.collectTime)
        }
      }
    ]
  },
  // 电围数据
  'probe_phone': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '采集时间', prop: 'collectTime', minWidth: '11.56%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collect_time = parseInt(row.collectTime)
          return dayjs.filterExactS(row.collectTime)
        }
      },
      { label: '场所', prop: 'placeName', minWidth: '10.1%' },
      { label: '手机', prop: 'phone', minWidth: '8.69%' },
      { label: 'IMSI', prop: 'imsi', minWidth: '10.85%' },
      { label: 'IMEI', prop: 'imei', minWidth: '10.85%' },
      { label: 'MAC', prop: 'mac', minWidth: '10.85%' },
      { label: '运营商', prop: 'station', minWidth: '8%',
        renderFun: function (row) {
          if (row.station) {
            return row.station
          } else {
            if (!row.imsi) return '--'
            //00 02 07是中国移动，01是中国联通，03是中国电信。
            const ChinaMobile = ['46000', '46002', '46007']
            const ChinaUnicom = '46001'
            const ChinaTelecom = '46003'
            if (row.imsi === ChinaUnicom) {
              return '中国联通'
            } else if (row.imsi === ChinaTelecom) {
              return '中国电信'
            } else if (ChinaMobile.includes(row.imsi)) {
              return '中国移动'
            } else {
              return '--'
            }
          }
        }
      },
      { label: '设备', prop: 'deviceName', minWidth: '5.8%' },
      { label: '经度', prop: 'longitude', minWidth: '7.39%' },
      { label: '纬度', prop: 'latitude', minWidth: '7.39%' },
      { label: '设备厂商', prop: 'factoryName', minWidth: '8.52%',
        renderFun (row) {
          if (!row.factoryName) return '--'
          return row.factoryName
        }
      }
    ]
  },
  // 停车记录
  'community_car': {
    url: '/dc_car/pager',
    isWarning: false,
    getMethod: 'post',
    colList: [
      { label: '入场时间', prop: 'inTimestamp', minWidth: '17.375%',
        renderFun: function (row) {
          const time = row.inTimestamp
          if (!time) return '--'
          return dayjs.filterString(time)
        }
      },
      { label: '出场时间', prop: 'outTimestamp', minWidth: '17.575%',
        renderFun: function (row) {
          const time = row.outTimestamp
          if (!time) return '--'
          return dayjs.filterString(time)
        }
      },
      { label: '停车场', prop: 'parkPlaceName', minWidth: '22.34%' },
      { label: '车牌', prop: 'carNumber', minWidth: '15.57%' },
      { label: '经度', prop: 'longitude', minWidth: '13.57%',
        renderFun: function (row) {
          if (row.inTimestamp) {
            return row.inLongitude || '--'
          } else if (row.outTimestamp) {
            return row.outLongitude || '--'
          } else {
            return '--'
          }
        }
      },
      { label: '纬度', prop: 'latitude', minWidth: '13.57%',
        renderFun: function (row) {
          if (row.inTimestamp) {
            return row.inLatitude || '--'
          } else if (row.outTimestamp) {
            return row.outLatitude || '--'
          } else {
            return '--'
          }
        }
      }
    ]
  },
  // 网吧数据
  'police_netbar': {
    url: '/dc_netBar/pager',
    isWarning: false,
    getMethod: 'post',
    colList: [
      { label: '上机时间', prop: 'onTimestamp', minWidth: '12.56%',
        renderFun: function (row) {
          if (!row.onTimestamp) return '--'
          row.onTimestamp = parseInt(row.onTimestamp)
          return dayjs.filterString(row.onTimestamp)
        }
      },
      { label: '网吧名称', prop: 'netBarName', minWidth: '14.31%' },
      { label: '姓名', prop: 'realName', minWidth: '10.22%' },
      { label: '证件类型', prop: 'idCardType', minWidth: '10%' },
      { label: '证件号码', prop: 'idCardNumber', minWidth: '16.3%' },
      { label: '经度', prop: 'longitude', minWidth: '9.43%' },
      { label: '纬度', prop: 'latitude', minWidth: '8.75%' },
      { label: '网吧地址', prop: 'address', minWidth: '18.43%' }
    ]
  },
  // 防疫数据
  'police_antiepidemic': {
    url: '/epidemic/pager',
    isWarning: false,
    getMethod: 'get',
    colList: [
      { label: '姓名', prop: 'name', minWidth: '13.1%' },
      { label: '性别', prop: 'sex', minWidth: '8.07%', },
      { label: '证件类型', prop: 'certificationType', minWidth: '14.35%' },
      { label: '证件号码', prop: 'certificationCode', minWidth: '19.76%' },
      { label: '籍贯', prop: 'houseAddr', minWidth: '13.3%' },
      { label: '手机', prop: 'phone', minWidth: '15.36%' },
      { label: '创建时间', prop: 'captureTime', minWidth: '17.06%' }
    ]
  },
  // 旅业数据
  'police_hotel': {
    url: '/dc_travel/pager',
    isWarning: false,
    getMethod: 'post',
    colList: [
      { label: '入住时间', prop: 'inTimestamp', minWidth: '12.56%',
        renderFun: function (row) {
          if (!row.inTimestamp) return '--'
          row.inTimestamp = parseInt(row.inTimestamp)
          return dayjs.filterString(row.inTimestamp)
        }
      },
      { label: '酒店名称', prop: 'hotelName', minWidth: '12.01%' },
      { label: '入住房号', prop: 'inRoomNumber', minWidth: '9.1%' },
      { label: '姓名', prop: 'realName', minWidth: '8.3%' },
      { label: '证件类型', prop: 'idCardType', minWidth: '7.39%' },
      { label: '证件号码', prop: 'cerNumber', minWidth: '14.03%' },
      { label: '经度', prop: 'longitude', minWidth: '9.43%' },
      { label: '纬度', prop: 'latitude', minWidth: '8.75%' },
      { label: '旅店地址', prop: 'resiAddr', minWidth: '18.43%' }
    ]
  },
  // 核酸记录
  'epidemic_nucleate': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '姓名', prop: 'name', minWidth: '7.73%' },
      { label: '性别', prop: 'gender', minWidth: '6.02%',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '证件号码', prop: 'cerNumber', minWidth: '13.81%' },
      { label: '手机', prop: 'phone', minWidth: '11.6%' },
      { label: '来自风险区', prop: 'isFromEpidemic', minWidth: '10.57%',
        renderFun (row) {
          if (!row.isFromEpidemic) return '--'
          if (row.isFromEpidemic === 'true' || row.isFromEpidemic === true) {
            return '是'
          } else if (row.isFromEpidemic === 'false' || row.isFromEpidemic === false) {
            return '否'
          } else {
            return '--'
          }
        }
      },
      { label: '本地管控区', prop: 'isControl', minWidth: '10.79%',
        renderFun (row) {
          if (!row.isControl) return '--'
          if (row.isControl === 'true' || row.isControl === true) {
            return '是'
          } else if (row.isControl === 'false' || row.isControl === false) {
            return '否'
          } else {
            return '--'
          }
        }
      },
      { label: '采样场所', prop: 'placeName', minWidth: '17.61%' },
      { label: '检测时间', prop: 'testTime', minWidth: '14.03%',
        renderFun (row) {
          if (!row.testTime) return '--'
          row.testTime = parseInt(row.testTime)
          return dayjs.filterString(row.testTime)
        }
      },
      { label: '检测结果', prop: 'result', minWidth: '7.84%',
        renderFun (row) {
          if (!row.isControl) return '--'
          if (row.result === 'positive') {
            return '阳性'
          } else if (row.result === 'negative') {
            return '阴性'
          } else if (row.result === 'testing') {
            return '检测中'
          } else {
            return '--'
          }
        }
      }
    ]
  },
  'epidemic_register': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '姓名', prop: 'name', minWidth: '7.27%' },
      { label: '性别', prop: 'gender', minWidth: '7.48%',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '证件号码', prop: 'cerNumber', minWidth: '12.9%' },
      { label: '手机', prop: 'phone', minWidth: '9.15%' },
      { label: '车牌', prop: 'carLicense', minWidth: '8.07%' },
      { label: '登记场所', prop: 'placeName', minWidth: '13.16%' },
      { label: '场所地址', prop: 'placeAddress', minWidth: '15.63%' },
      { label: '体温', prop: 'temperature', minWidth: '6.23%',
        renderFun: function (row) {
          if (!row.temperature) return '--'
          return row.temperature + '℃'
        }
      },
      { label: '登记时间', prop: 'collectTime', minWidth: '12.95%',
        renderFun: function (row) {
          if (!row.collectTime) {
            return '--'
          }
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      },
      { label: '状态', prop: 'passStatus', minWidth: '7.16%',
        renderFun: (row) => {
          if (!row.passStatus) return '--'
          return row.passStatus === 'in' ? '进入' : row.passStatus === 'out' ? '离开' : '--'
        }
      }
    ]
  },
  // 手机卡信息
  'phone_sim': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '办理人姓名', prop: 'name', minWidth: '12.56%' },
      { label: '办理人手机', prop: 'phone', minWidth: '13.07%' },
      { label: '运营商', prop: 'operator', minWidth: '12.11%',
        renderFun: (row) => {
          if (!row.operator) return '--'
          return row.operator === 'CMCC'
            ? '移动' : row.operator === 'CUCC'
              ? '联通' : row.operator === 'CTCC'
                ? '电信' : '--'
        }
      },
      { label: 'IMSI', prop: 'imsi', minWidth: '17.2%' },
      { label: 'SIM', prop: 'sim', minWidth: '17.86%' },
      { label: '办理时间', prop: 'collectTime', minWidth: '17.39%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      },
      { label: '状态', prop: 'status', minWidth: '9.81%' }
    ]
  },
  // 不动产
  'assets_house': {
    url: '/dataCenter/dataList',
    getMethod: 'get',
    isWarning: true,
    colList: [
      { label: '权利人', prop: 'obligee', minWidth: '9.8%' },
      { label: '证件号码', prop: 'cerNumber', minWidth: '15.45%' },
      { label: '不动产证号', prop: 'assetsCode', minWidth: '17%' },
      { label: '坐落', prop: 'houseAddress', minWidth: '21.3%' },
      { label: '用途', prop: 'houseUsage', minWidth: '10.05%' },
      { label: '面积', prop: 'houseArea', minWidth: '11.71%',
        renderFun: function (row) {
          if (!row.houseArea) return '--'
          return row.houseArea
        }
      },
      { label: '登记时间', prop: 'collectTime', minWidth: '14.69%',
        renderFun: function (row) {
          if (!row.collectTime) return '--'
          row.collectTime = parseInt(row.collectTime)
          return dayjs.filterString(row.collectTime)
        }
      }
    ]
  },
  'population_permanent': {
    url: '/populationPermanent/list',
    getMethod: 'get',
    isWarning: true,
    listWidth: '21400',
    colList: [
      { label: '姓名', prop: 'name', minWidth: '200px' },
      { label: '姓名拼音', prop: 'name_pinyin', minWidth: '200px' },
      { label: '姓', prop: 'surname', minWidth: '200px' },
      { label: '名', prop: 'first_name', minWidth: '200px' },
      { label: '性别', prop: 'gender', minWidth: '200px',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '民族', prop: 'nation', minWidth: '200px' },
      { label: '出生日期', prop: 'birthday', minWidth: '200px' },
      { label: '曾用名', prop: 'previous_name', minWidth: '200px' },
      { label: '身份证', prop: 'cer_number', minWidth: '200px' },
      { label: '联系电话', prop: 'phone', minWidth: '200px' },

      { label: '籍贯-国家（地区）', prop: 'native_country', minWidth: '200px' },
      { label: '籍贯-省市县（区）', prop: 'native_province', minWidth: '200px' },
      { label: '籍贯-区划内详细地址', prop: 'native_address', minWidth: '200px' },

      { label: '户籍地址-省市县（区）', prop: 'registered_province', minWidth: '300px' },
      { label: '户籍地址-区划内详细地址', prop: 'registered_address', minWidth: '300px' },
      { label: '户籍地址地址编码', prop: 'registered_address_code', minWidth: '200px' },
      { label: '户籍地址人户一致标识', prop: 'registered_consistency', minWidth: '200px' },
      { label: '地市编码', prop: 'province_code', minWidth: '200px' },
      { label: '地市单位', prop: 'province_precode', minWidth: '200px' },
      { label: '乡镇街道代码', prop: 'street_code', minWidth: '200px' },

      { label: '身高', prop: 'height', minWidth: '200px' },
      { label: '户口', prop: 'household_code', minWidth: '200px' },
      { label: '兵役状况', prop: 'military_service', minWidth: '200px' },
      { label: '婚姻状况', prop: 'marital_status', minWidth: '200px'},

      { label: '出生地-国家（地区）', prop: 'birth_country', minWidth: '200px' },
      { label: '出生地-省市县（区）', prop: 'birth_province', minWidth: '200px' },
      { label: '出生地-区划内详细地址', prop: 'birth_address', minWidth: '240px' },
      { label: '出生时间', prop: 'birth_time', minWidth: '200px' },
      { label: '血型', prop: 'blood_group', minWidth: '200px' },
      { label: '居民身份证情况住址', prop: 'cer_address', minWidth: '200px' },
      { label: '持有居民身份证情况签发机关公安机关名称', prop: 'cer_police_name', minWidth: '360px' },
      { label: '持有居民身份证情况有效期起始日期', prop: 'cer_validity_start_time', minWidth: '300px' },
      { label: '持有居民身份证情况有效期截止日期', prop: 'cer_validity_end_time', minWidth: '300px' },
      { label: '城乡分类代码', prop: 'city_classify_code', minWidth: '200px' },
      { label: '社区居村委', prop: 'community_village_committee_code', minWidth: '200px' },
      { label: '单位名称', prop: 'company_name', minWidth: '200px' },
      { label: '单位编码', prop: 'company_code', minWidth: '200px' },
      { label: '职业', prop: 'occupation', minWidth: '200px' },
      { label: '职业类别', prop: 'occupation_classification', minWidth: '200px' },
      { label: '文化程度', prop: 'culture', minWidth: '200px' },
      { label: '数据归属单位名称', prop: 'data_from_company_name', minWidth: '200px' },
      { label: '数据归属单位代码', prop: 'data_from_company_code', minWidth: '200px' },
      { label: '死亡原因', prop: 'death_reason', minWidth: '200px' },
      { label: '死亡日期', prop: 'death_time', minWidth: '200px' },
      { label: '离开本市情况去往地国家（地区）', prop: 'emigration_to_country', minWidth: '300px' },
      { label: '离开本市情况去往地省市县（区）', prop: 'emigration_city', minWidth: '300px' },
      { label: '离开本市情况去往地区划内详细地址', prop: 'emigration_address', minWidth: '300px' },
      { label: '离开本市情况迁移（流动）原因', prop: 'emigration_reason', minWidth: '300px' },
      { label: '离开本市情况迁（流）出日期', prop: 'emigration_time', minWidth: '300px' },
      { label: '宗教信仰', prop: 'faith', minWidth: '200px' },
      { label: '父亲姓名', prop: 'father_name', minWidth: '200px' },
      { label: '父亲证件种类', prop: 'father_cer_type', minWidth: '200px' },
      { label: '父亲证件号码', prop: 'father_cer_number', minWidth: '200px' },
      { label: '父亲外文姓', prop: 'father_foreign_surname', minWidth: '200px' },
      { label: '父亲外文名', prop: 'father_foreign_first_name', minWidth: '200px' },
      { label: '父亲公民身份号码', prop: 'father_identity_card', minWidth: '200px' },

      { label: '母亲姓名', prop: 'mother_name', minWidth: '200px' },
      { label: '母亲证件种类', prop: 'mother_cer_type', minWidth: '200px' },
      { label: '母亲证件号码', prop: 'mother_cer_number', minWidth: '200px' },
      { label: '母亲外文姓', prop: 'mother_foreign_surname', minWidth: '200px' },
      { label: '母亲外文名', prop: 'mother_foreign_first_name', minWidth: '200px' },
      { label: '母亲公民身份号码', prop: 'mother_identity_card', minWidth: '200px' },

      { label: '配偶姓名', prop: 'spouse_name', minWidth: '200px' },
      { label: '配偶证件种类', prop: 'spouse_cer_type', minWidth: '200px' },
      { label: '配偶证件号码', prop: 'spouse_cer_number', minWidth: '200px' },
      { label: '配偶外文姓', prop: 'spouse_foreign_surname', minWidth: '200px' },
      { label: '配偶外文名', prop: 'spouse_foreign_first_name', minWidth: '200px' },
      { label: '配偶公民身份号码', prop: 'spouse_identity_card', minWidth: '200px' },


      { label: '监护人一姓名', prop: 'guardian1_name', minWidth: '200px' },
      { label: '监护人一证件种类', prop: 'guardian1_cer_type', minWidth: '200px' },
      { label: '监护人一证件号码', prop: 'guardian1_cer_number', minWidth: '200px' },
      { label: '监护人一外文姓', prop: 'guardian1_foreign_surname', minWidth: '200px' },
      { label: '监护人一外文名', prop: 'guardian1_foreign_first_name', minWidth: '200px' },
      { label: '监护人一公民身份号码', prop: 'guardian1_identity_card', minWidth: '200px' },
      { label: '监护人一联系电话', prop: 'guardian1_phone', minWidth: '200px' },
      { label: '监护人一监护关系', prop: 'guardian1_relationship', minWidth: '200px' },

      { label: '监护人二姓名', prop: 'guardian2_name', minWidth: '200px' },
      { label: '监护人二证件种类', prop: 'guardian2_cer_type', minWidth: '200px' },
      { label: '监护人二证件号码', prop: 'guardian2_cer_number', minWidth: '200px' },
      { label: '监护人二外文姓', prop: 'guardian2_foreign_surname', minWidth: '200px' },
      { label: '监护人二外文名', prop: 'guardian2_foreign_first_name', minWidth: '200px' },
      { label: '监护人二公民身份号码', prop: 'guardian2_identity_card', minWidth: '200px' },
      { label: '监护人二联系电话', prop: 'guardian2_phone', minWidth: '200px' },
      { label: '监护人二监护关系', prop: 'guardian2_relationship', minWidth: '200px' },
      { label: '与户主关系', prop: 'household_relationship', minWidth: '200px' },

      { label: '来本市情况来自地国家（地区）', prop: 'immigration_from_country', minWidth: '300px' },
      { label: '来本市情况来自地省市县（区）', prop: 'immigration_city', minWidth: '300px' },
      { label: '来本市情况来自地区划内详细地址', prop: 'immigration_address', minWidth: '300px' },
      { label: '来本市情况迁移（流动）原因', prop: 'immigration_reason', minWidth: '300px' },
      { label: '来本市情况迁（流）入日期', prop: 'immigration_time', minWidth: '300px' },
      { label: '注销时间', prop: 'logout_time', minWidth: '200px' },
      { label: '注销更新时间', prop: 'logout_update_time', minWidth: '200px' },
      { label: '维护时间', prop: 'maintenance_time', minWidth: '200px' },
      { label: '人口状态', prop: 'population_status', minWidth: '200px' },
      { label: '人口编码', prop: 'population_code', minWidth: '200px' },
      { label: '人口信息级别', prop: 'population_information_level', minWidth: '200px' },
      { label: '人口管理注销类别代码', prop: 'population_logout_code', minWidth: '200px' },
      { label: '数据创建时间', prop: 'src_create_time', minWidth: '200px' },
      { label: '数据更新时间', prop: 'src_update_time', minWidth: '200px' }
    ]
  }
}
