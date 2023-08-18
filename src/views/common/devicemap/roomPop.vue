<template>
  <div class="table">
    <!-- ------------  表格嵌套表格 展开  ------------- -->
    <CollapseTable
      ref="tableRef"
      v-if="!collapse.isLoading"
      :pageData.sync="collapse.pageData"
      :collapse.sync="collapse"
      :tableData.sync="collapse.tableData"
      :isLoading="collapse.isLoading"
      @expand="expand"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryDeviceList, getPlaceDetail } from '@/api/equipMap'
import dayjs from '@/utils/filters'
import CollapseTable from '@/components/BasicComponents/CollapseTable'

const cls = [
  { label: '更新时间', minWidth: '12.76%', prop: 'updateTimeStr' },
  { width: '100', type: 'expand' },
  { label: '场所名称', minWidth: '10.11%', prop: 'placeName' },
  { label: '场所编码', minWidth: '13.3%', prop: 'placeCode' },
  { label: '详细地址', minWidth: '10.64%', prop: 'siteAddress' },
  { label: '场所类型', minWidth: '9.57%', prop: 'placeTypeStr' },
  { label: '经营性质', minWidth: '9.57%', prop: 'accessTypeStr' },
  { label: '在线/总数', minWidth: '9.57%', prop: 'onlineTotal' }
]
const childcls = [
  { label: '更新时间', minWidth: '9.82%', prop: 'updateTimeStr' },
  { label: '设备名称', minWidth: '9.39%', prop: 'deviceName' },
  { label: '设备MAC', minWidth: '10.91%', prop: 'deviceMac' },
  { label: '设备类型', minWidth: '8.19%', prop: 'deviceTypeStr' },
  { label: '设备地址', minWidth: '9.82%', prop: 'deviceAddress' },
  { label: '经度', minWidth: '8.73%', prop: 'longitude' },
  { label: '纬度', minWidth: '8.73%', prop: 'latitude' },
  {
    label: '在线/离线',
    minWidth: '7.64%',
    prop: 'deviceStatus',
    type: 'status',
    statuList: [
      { status: true, color: '3BC022', text: '在线' },
      { status: false, color: 'F63F70', text: '离线' }
    ]
  },
  { label: '安装时间', minWidth: '9.82%', prop: 'createTimeStr' }
]

export default {
  components: {
    CollapseTable
  },
  data () {
    return {
      collapse: {
        tableData: [],
        columns: cls,
        pageData: {
          total: 0,
          pageSize: 5,
          curPage: 1,
          event: this.handleCurrentChange
        },
        isLoading: true,
        child: {
          columns: childcls
        }
      },
      isOpen: false,
      devicePageObj: {},
      siteMapList: {}, // 场所对应设备缓存
      palceParams: {
        placeCodes: '',
        pageNum: 1,
        pageSize: 5
      }
    }
  },

  computed: {
    ...mapState('Map', {
      deviceTypeObj: 'deviceTypeObj',
      placeDataClicked: 'placeDataClicked',
    })
  },

  watch: {
    placeDataClicked: {
      handler (newValue) {
        if (!newValue || Object.keys(newValue).length === 0) return
        this.palceParams.pageNum = 1
        this.collapse.curPage = 1
        this.palceParams.placeCodes = newValue.placeCode
        this.loadPlacePager()
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 加载场所表格分页列表
    loadPlacePager () {
      this.collapse.isLoading = true
      const siteTypeListMap = this.$store.getters['Dict/siteTypeListMap']
      const accessTypeListMap = this.$store.getters['Dict/accessTypeListMap']
      getPlaceDetail(this.palceParams)
        .then(res => {
          this.collapse.tableData = res.content.map(_c => {
            _c.placeTypeStr = siteTypeListMap[_c.placeType]
            _c.accessTypeStr = accessTypeListMap[_c.accessType]
            _c.updateTimeStr = dayjs.filterSS(_c.updateTime)
            _c.pageData = {
              total: 0,
              pageSize: 5,
              curPage: 1,
              event: this.innerCurrentChange
            }
            _c.params = {
              pageNum: 1,
              pageSize: 5,
              place: {
                placeCode: _c.placeCode
              }
            }
            _c.isOpen = false
            return _c
          })
          this.collapse.pageData.total = res.totalSize
        })
        .finally(() => {
          this.collapse.isLoading = false
        })
    },

    /** 外层 展示 事件 */
    expand (row) {
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
      this.$set(this.collapse.tableData[index].params, 'pageNum', 1)
      this.$set(this.collapse.tableData[index].pageData, 'curPage', 1)

      if (this.collapse.tableData[index].isOpen) {
        this.queryChildDevice(index)
      }
    },

    /** 通过 组id 获取 规则 */
    queryChildDevice (index) {
      this.$set(this.collapse.tableData[index], 'isLoading', true)
      queryDeviceList(this.collapse.tableData[index].params)
        .then(res => {
          const list = res.content.map(_c => {
            _c.deviceTypeStr = this.deviceTypeObj[_c.deviceType]
            _c.updateTimeStr = dayjs.filterSS(_c.updateTime)
            _c.createTimeStr = dayjs.filterSS(_c.createTime)
            return _c
          })
          this.$set(this.collapse.tableData[index], 'children', list)
          this.$set(this.collapse.tableData[index].pageData, 'total', res.totalSize)
        })
        .finally(() => {
          this.$set(this.collapse.tableData[index], 'isLoading', false)
        })
    },

    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },

    /** 外层 切换分页 事件 */
    handleCurrentChange (pageIndex) {
      this.palceParams.pageNum = pageIndex
      this.loadPlacePager()
    },

    /** 子 分页 事件 */
    innerCurrentChange (pageIndex, index) {
      this.$set(this.collapse.tableData[index].params, 'pageNum', pageIndex)
      this.queryChildDevice(index)
    }
  }
}
</script>

<style lang="less" scoped></style>
