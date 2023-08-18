<template>
  <div class="device-overlay-pop">
    <template-table
      :tableData="table.tableData"
      :columns="table.columns"
      :tableHeight="total < 5 ? total * 45 + 54 : 270"
      :rowHeight="40"
      :pageData="{ curPage, total, pageSize: params.pageSize }"
      :isLoading="table.isLoading"
      @handleCurrentChange="handleCurrentChange"
      :btnRender="table.btnRender"
    ></template-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryDeviceDetail } from '@/api/equipMap'
import TemplateTable from '@/components/VisualComponents/Table'
import dayjs from '@/utils/filters'

export default {
  components: {
    TemplateTable
  },
  data () {
    return {
      total: 0,
      curPage: 1,
      table: {
        isLoading: true,
        tableData: [],
        columns: [
          {
            label: '更新时间',
            prop: 'warnNum',
            minWidth: '10.64%',
            renderFun: function (row) {
              return dayjs.filterY_M_D_H_M_S(row.updateTime)
            }
          },
          { label: '设备名称', prop: 'deviceName', minWidth: '9.04%' },
          { label: '场所', prop: 'placeName', minWidth: '9.04%' },
          { label: '设备MAC', prop: 'deviceMac', minWidth: '9.57%' },
          { label: '设备类型', prop: 'deviceTypeStr', minWidth: '6.38%' },
          { label: '设备地址', prop: 'deviceAddress', minWidth: '7.98%' },
          { label: '经度', prop: 'longitude', minWidth: '6.38%' },
          { label: '纬度', prop: 'latitude', minWidth: '6.38%' },
          {
            label: '在线/离线',
            prop: 'onLineState',
            minWidth: '6.38%',
            type: 'status',
            statuList: [
              { status: true, color: '3BC022', text: '在线' },
              { status: false, color: 'F63F70', text: '离线' }
            ]
          },
          { label: '厂商', prop: 'factoryCode', minWidth: '6.91%' },
          {
            label: '安装时间',
            prop: 'createTime',
            minWidth: '9.57%',
            renderFun: function (row) {
              return dayjs.filterY_M_D_H_M_S(row.createTime)
            }
          }
        ],
        btnRender: []
      },
      params: {
        pageNum: 1,
        pageSize: 5,
        ids: []
      }
    }
  },
  computed: {
    ...mapState('Map', {
      deviceIdsClicked: 'deviceIdsClicked'
    }),
    ...mapState('Common', {
      RouterList: 'RouterList'
    })
  },
  watch: {
    deviceIdsClicked: {
      handler (val) {
        if (!val || val.length === 0) return
        this.params.ids = val
        this.params.pageNum = 1
        this.curPage = 1
        this.loadTable()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // 操作按钮显示
    this.optShow()
  },

  methods: {
    // 数据中心 无权限  设备详情按钮也隐藏
    optShow () {
      if (this.RouterList && this.RouterList.length > 0) {
        const dataCenter = this.RouterList.find(i => i.itemName == '数据中心')
        if (!dataCenter) return
        // const probeData = dataCenter.children.find(
        //   i => i.name == 'probeData' && i.componentstr != "() => import('@/views/NotPermission')"
        // )
        // if (probeData) {
        //   this.table.btnRender.push({
        //     label: '探针数据',
        //     type: 'success',
        //     icon: 'device-icon1',
        //     btnEvent: this.queryProbe,
        //     alt: '查看WIFI探针',
        //     name: 'probeData'
        //   })
        // }
        // const hotspot = dataCenter.children.find(
        //   i => i.name == 'hotspot' && i.componentstr != "() => import('@/views/NotPermission')"
        // )

        // if (hotspot) {
        //   this.table.btnRender.push({
        //     label: 'WIFI热点',
        //     type: 'rodeLine',
        //     icon: 'icon-WIFIredian',
        //     btnEvent: this.queryHot,
        //     alt: '查看WIFI热点',
        //     name: 'hotspot'
        //   })
        // }
      }
    },

    /** 跳转 -> 探针数据 */
    queryProbe (row) {
      let routeUrl = this.$router.resolve({
        name: 'probeData',
        query: { deviceMac: row.deviceMac, pathName: 'probeData' }
      })
      window.open(routeUrl.href, '_blank')
    },

    /** 跳转 -> WIFI热点 */
    queryHot (row) {
      let routeUrl = this.$router.resolve({
        name: 'hotspot',
        query: { deviceMac: row.deviceMac, pathName: 'hotspot' }
      })
      window.open(routeUrl.href, '_blank')
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.curPage = val
      this.params.pageNum = val
      this.loadTable()
    },

    // 加载分页表格
    loadTable () {
      this.table.isLoading = true
      const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']

      queryDeviceDetail(this.params)
        .then(res => {
          this.table.tableData = res.content.map(_c => {
            _c.deviceTypeStr = deviceTypeListMap[_c.deviceType] || '其他'
            _c.onLineState = dayjs.getOnlineState(_c.updateTime)
            return _c
          })

          this.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
