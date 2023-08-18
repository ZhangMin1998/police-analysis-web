import { reactive, onMounted, watch } from '@vue/composition-api'
import { useStore } from "@/store/"

const TABLE_COLUMNS_SITE = map => ([
  {
    label: '设备在线率（7日）',
    prop: 'deviceWeekOnlineRate',
    minWidth: '16%'
  },
  {
    label: '场所类型',
    prop: 'placeType',
    renderFun: function (row) {
      return map[row.placeType]
    },
    minWidth: '8.76%'
  },
  {
    label: '场所数量',
    prop: 'placeAllTotal',
    minWidth: '8.51%'
  },
  {
    label: '在线场所',
    prop: 'placeOnlineTotal',
    minWidth: '8.51%'
  },
  {
    label: '场所在线率（1日）',
    prop: 'placeOneOnlineRate',
    minWidth: '16%'
  },
  {
    label: '离线场所',
    prop: 'placeOffTotal',
    minWidth: '8.51%'
  },
  {
    label: '场所在线率（7日）',
    prop: 'placeWeekOnlineRate',
    minWidth: '16%'
  },
  {
    label: '设备数量',
    prop: 'deviceAllTotal',
    minWidth: '8.51%'
  },
  {
    label: '在线设备',
    prop: 'deviceOnlineTotal',
    minWidth: '8.51%'
  },
  {
    label: '离线设备',
    prop: 'deviceOffTotal',
    minWidth: '8.51%'
  },
  {
    label: '设备在线率（1日）',
    prop: 'deviceOneOnlineRate',
    minWidth: '16%'
  },
])

const TABLE_COLUMNS_DEVICE = map => ([
  {
    label: '设备在线率（7日）',
    prop: 'deviceWeekOnlineRate',
    minWidth: '20%'
  },
  {
    label: '设备类型',
    prop: 'ratio',
    minWidth: '20%',
    renderFun: function (row) {
      return map[row.deviceType]
    }
  },
  {
    label: '设备数量',
    prop: 'deviceAllTotal',
    minWidth: '20%'
  },
  {
    label: '设备在线',
    prop: 'deviceOnlineTotal',
    minWidth: '20%'
  },
  {
    label: '设备在线率（1日）',
    prop: 'deviceOneOnlineRate',
    minWidth: '20%'
  },
])

const TABLE_COLUMNS_VERDOR = () => ([
  {
    label: '设备在线率（7日）',
    prop: 'ratio',
    width: '160',
  },
  {
    label: '安全厂商',
    prop: 'type',
  },
  {
    label: '场所数量',
    prop: 'ratio',
  },
  {
    label: '场所在线',
    prop: 'ratio',
  },
  {
    label: '场所在线率（1日）',
    prop: 'ratio',
    width: '160',
  },
  {
    label: '场所在线率（7日）',
    prop: 'ratio',
    width: '160',
  },
  {
    label: '设备数量',
    prop: 'ratio',
  },
  {
    label: '设备在线',
    prop: 'ratio',
  },
  {
    label: '设备在线率（1日）',
    prop: 'ratio',
    width: '160',
  },
])

export default function useTable (tabType) {
  const store = useStore()
  const deviceTypeListMap = store.getters['Dict/deviceTypeListMap']
  const siteTypeListMap = store.getters['Dict/siteTypeListMap']

  const columnMap = {
    'site': TABLE_COLUMNS_SITE(siteTypeListMap),
    'device': TABLE_COLUMNS_DEVICE(deviceTypeListMap),
    'vendor': TABLE_COLUMNS_VERDOR()
  }

  const table = reactive({
    tableData: [],
    columns: columnMap[tabType.value]
  })

  const formatTableData = (res) => {
    table.tableData = res?.map(_c => {
      _c.placeOffTotal = _c.placeAllTotal - _c.placeOnlineTotal
      _c.deviceOffTotal = _c.deviceAllTotal - _c.deviceOnlineTotal
      return _c
    })
  }

  watch(tabType, val => {
    table.columns = columnMap[val]
    table.tableData.length = 0
  })

  const rowStyle = () => {
    let returnStyle =
      'color:#8799BF;font-size:14px;padding:0px;height:30px'
    return returnStyle
  }

  const headerCellStyle = () => {
    return 'color:#8799BF;font-size:14px;padding:0px;'
  }


  onMounted(() => {

  })
  return {
    table,
    formatTableData,
    rowStyle,
    headerCellStyle
  }
}

