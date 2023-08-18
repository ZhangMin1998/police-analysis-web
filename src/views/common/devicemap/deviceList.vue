<template>
  <div class="device_wrap">
    <PageHeader>
      <list-title title="设备列表"></list-title>
      <div>
        <!-- <nav-title title="地图模式" @handleTo="handleTo"></nav-title> -->
        <BackPrevious @click="handleTo"></BackPrevious>
      </div>
    </PageHeader>
    <div class="search-filter" v-permission="'devicelist:search'">
      <FilterPanel ref="filterPanelRef" @filterSearch="filterSearch"></FilterPanel>
    </div>

    <div class="device-list">
      <div class="right" v-if="isAdmin" :style="`${isAdmin ? 'margin-top:54px;' : ''}`">
        <el-button type="primary" class="btn" @click="addPlace"> 新建场所</el-button>
      </div>
      <div
        class="table"
        :style="`${
          isAdmin
            ? `height:${screenHeight - 345}px`
            : `margin-top:${$pxToRem(80)}; height:${screenHeight - 315}px`
        }`"
      >
      <!-- <div class="table" :style="`${isAdmin ? '' : `margin-top:${$pxToRem(80)};`}`"> -->
        <el-table
          :data="tableData"
          :fit="true"
          stripe
          style="width: 100%"
          @expand-change="expand"
          :cell-style="bigcellStyle"
          border
        >
          <el-table-column type="expand" prop="children" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.children"
                :cell-style="cellStyle"
                :fit="true"
                stripe
                border
                style="width: 100%"
                v-loading="scope.row.loading"
                element-loading-text="正在加载中"
                element-loading-spinner="el-icon-loading"
                class="table_loading"
              >
                <el-table-column type="index" min-width="2.21%"> </el-table-column>
                <template v-for="(item, index) in roomDeviceColumnList">
                  <el-table-column
                    :show-overflow-tooltip="true"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :key="'ttt' + index"
                  >
                    <template slot-scope="scope">
                      {{ scope.row[item.prop] || '--' }}
                    </template>
                  </el-table-column>
                </template>
                <!-- 展示操作按钮 -->
                <el-table-column
                  v-if="isAdmin && btnRenderT && btnRenderT.length"
                  align="right"
                  label="操作"
                  min-width="9%"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-for="(btnItem, btnIndex) in btnRenderT"
                      :key="btnIndex"
                      @click.native.prevent="btnItem.btnEvent(scope.row)"
                      type="text"
                      size="small"
                    >
                      <img
                        style="width: 20px; height: 20px"
                        :src="
                          require('@/assets/img/' +
                            (btnItem.type == 'use'
                              ? scope.row.status
                                ? btnItem.iconA
                                : btnItem.iconB
                              : btnItem.icon) +
                            '.png')
                        "
                        :alt="btnItem.alt"
                        :title="btnItem.alt"
                      />
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <div class="total">总数:{{ scope.row.children.totalSize || 0 }}</div>
                <el-pagination
                  v-show="scope.row.children.totalSize > 5"
                  background
                  layout="prev, pager, next"
                  :total="scope.row.children.totalSize"
                  :page-size="5"
                  @current-change="devicePageChange($event, scope.row, scope.$index)"
                >
                </el-pagination>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" width="60"> </el-table-column>
          <template v-for="(item, index) in roomColumnList">
            <el-table-column
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.minWidth"
              :width="item.width"
              :key="index"
            >
              <template slot-scope="scope">
                {{ scope.row[item.prop] || '--' }}
              </template>
            </el-table-column>
          </template>
          <!-- 展示操作按钮 -->
          <el-table-column
            v-if="isAdmin && btnRender && btnRender.length"
            align="center"
            label="操作"
            min-width="10%"
          >
            <template slot-scope="scope">
              <el-button
                v-for="(btnItem, btnIndex) in btnRender"
                :key="btnIndex"
                @click.native.prevent="btnItem.btnEvent(scope.row)"
                type="text"
                size="small"
              >
                <img
                  style="width: 20px; height: 20px"
                  :src="
                    require('@/assets/img/' +
                      (btnItem.type == 'use'
                        ? scope.row.status
                          ? btnItem.iconA
                          : btnItem.iconB
                        : btnItem.icon) +
                      '.png')
                  "
                  :alt="btnItem.alt"
                  :title="btnItem.alt"
                />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageBlock pagination" v-show="roomListData.totalSize >= 1">
        <div class="totals">
          场所总数：{{ roomListData.totalSize ? roomListData.totalSize : 0 }}
        </div>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          @current-change="currentPageChange"
          :page-size="params.pageSize"
          :total="roomListData.totalSize"
          :current-page.sync="params.pageNum"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FilterPanel from '@/views/common/devicemap/components/FilterPanel'
import PageHeader from '@/components/BasicComponents/PageHeader'

import { queryCurrentRoomDeviceList, placeFilterPage, queryDevicePlace } from '@/api/equipMap'
import { placeDeleteReq, deviceDeleteReq } from '@/api/config'

const { _isOl } = require('@/config/user.js')

import dayjs from '@/utils/filters'

export default {
  components: {
    FilterPanel,
    PageHeader
  },

  data () {
    return {
      roomListData: {},
      tableData: [],
      curPlaceIdx: -1,
      curLngLatList: [], // 当页坐标集合
      btnRender: [
        {
          label: '详情',
          type: 'success',
          icon: 'icon-doc-add',
          btnEvent: this.deviceAdd,
          alt: '新增设备'
        },
        {
          label: '详情',
          type: 'success',
          icon: 'icon-doc-pen',
          btnEvent: this.placeUpdate,
          alt: '编辑场所'
        },
        {
          label: '详情',
          type: 'success',
          icon: 'icon-drop',
          btnEvent: this.placeDel,
          alt: '删除场所'
        }
      ],
      btnRenderT: [
        {
          label: '详情',
          type: 'success',
          icon: 'icon-doc-pen',
          btnEvent: this.deviceUpdate,
          alt: '编辑设备'
        },
        {
          label: '详情',
          type: 'success',
          icon: 'icon-drop',
          btnEvent: this.deviceDel,
          alt: '删除设备'
        }
      ],
      params: {
        pageNum: 1,
        pageSize: 10
      },
      deviceParams: {
        place: { placeCode: '' },
        pageSize: 5,
        pageNum: 1
      },
    }
  },

  computed: {
    ...mapState('Map', {
      roomColumnList: 'roomColumnList',
      roomDeviceColumnList: 'roomDeviceColumnList'
    }),
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),

    isAdmin () {
      // this.params.pageSize = this.$route.name === 'deviceManage' ? 9 : 10
      return this.$route.name === 'deviceManage'
    },

    tableHeight () {
      return this.isAdmin ? this.screenHeight - 365 : this.screenHeight - 335
    },

    rowHeight () {
      return this.tableHeight / 12
    }
  },
  watch: {
    '$route.name': {
      handler () {
        this.params.pageSize = this.$route.name === 'deviceManage' ? 9 : 10
      },
      immediate: true
    }
  },
  created () {
    if (!_isOl()) {
      this.$store.state.Map.roomColumnList = this.roomColumnList.filter(i => {
        return i.label != '所在区域'
      })
    }
    if (this.$route.query.device) {
      this.params.searchKey = this.$route.query.device
    }
    this.getRoomListData()
  },
  mounted () {
    // document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳转"
  },

  methods: {
    handleTo () {
      this.$router.push({
        name: 'devicemap'
      })
    },
    // --------------------------------- 设备 --------------------------------------

    /** 修改设备 跳转页面 */
    deviceUpdate (e) {
      this.$router.push({ name: 'editDevice', query: { id: e.id } })
    },

    /** 删除设备 */
    deviceDel (e) {
      this.$policeComfirm('删除此设备信息将不再接收此设备信息数据。确定要删除此设备信息吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deviceDeleteReq(e.id)
          .then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000,
              customClass: 'messageBox'
            })

            this.curPlaceIdx = this.tableData.findIndex(i => e.placeId == i.id)
            this.deviceParams.place.placeCode = e.placeCode
            this.getDeviceList()
          })
          .catch(() => { })
      })
    },

    /** 新增设备 跳转页面 */
    deviceAdd (e) {
      this.$router.push({ name: 'addDevice', query: { placeid: e.id } })
    },

    // --------------------------------- 场所 --------------------------------------

    /** 修改场所 跳转页面 */
    placeUpdate (e) {
      this.$router.push({ name: 'editPlace', query: { id: e.id } })
    },

    /** 删除场所*/
    placeDel (e) {
      this.$policeComfirm('删除此场所，将会删除场所下的所有设备 ?', {
        confirmButtonText: '明白',
        // cancelButtonText: '取消',
        showCancelButton: false
      })
        .then(() => {
          this.$policeComfirm('确定要删除此场所吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            placeDeleteReq(e.id)
              .then(() => {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000,
                  customClass: 'messageBox'
                })
                this.getRoomListData()
              })
              .catch(() => { })
          })
        })
        .catch(() => { })
    },

    /** 新增场所 跳转页面 */
    addPlace () {
      this.$router.push({ name: 'addPlace' })
    },

    /** 筛选 搜索表格 */
    filterSearch (params) {
      let newParams = { ...params }
      if (newParams.onLineStatus) {
        if (newParams.onLineStatus.length == 1) {
          newParams.onLineStatus = newParams.onLineStatus[0]
          this.deviceParams.onLineStatus = newParams.onLineStatus
        } else {
          delete newParams.onLineStatus
          delete this.deviceParams.onLineStatus
        }
      }

      this.params = { ...newParams, pageNum: 1, pageSize: this.params.pageSize }

      this.deviceParams.deviceType = params.deviceTypes
      this.deviceParams.searchKey = params.searchKey

      this.getRoomListData()
      this.$nextTick(() => {
        if (this.$refs && this.$refs.filterPanelRef) {
          this.$refs.filterPanelRef.closeFilter()
        }
      })
    },

    /** 场所分页搜索 表格 */
    getRoomListData () {
      placeFilterPage(this.params)
        .then(res => {
          console.log(res)
          this.clearAddress()

          const siteTypeListMap = this.$store.getters['Dict/siteTypeListMap']
          const accessTypeListMap = this.$store.getters['Dict/accessTypeListMap']
          this.roomListData = res

          this.tableData = this.roomListData.content.map(item => {
            item.online = `${item.deviceOnline ? item.deviceOnline : 0}/${item.deviceTotal ? item.deviceTotal : 0}`
            item.updateTime = dayjs.filterY_M_D_H_M_S(item.updateTime)
            // placeType 场所名称 accessType 经营性质
            item.onlineTotal = item.deviceOnline + '/' + item.deviceTotal
            item.placeType = siteTypeListMap[item.placeType]
            item.accessType = accessTypeListMap[item.accessType]
            this.curLngLatList.push([item.longitude, item.latitude])
            this.$set(item, 'children', [])
            return item
          })
          console.log(this.tableData)
          this.lnglatTransformAdress(this.curLngLatList)
        })
        .catch(() => { })
    },

    /** 场所分页 */
    currentPageChange (currentPage) {
      this.params.pageNum = currentPage
      this.getRoomListData()
    },

    /** 设备分页 */
    devicePageChange (pageNum, row, index) {
      this.curPlaceIdx = index
      this.deviceParams.pageNum = pageNum
      this.deviceParams.place.placeCode = row.placeCode
      this.getDeviceList()
    },

    /** 场所展开 查询设备 */
    expand (row, expandedRows) {
      if (!row) return
      if (expandedRows.length === 0) return
      this.curPlaceIdx = this.tableData.findIndex(i => row.id == i.id)
      this.deviceParams.place.placeCode = row.placeCode
      this.deviceParams.pageNum = 1
      if (row.children.length === 0) {
        row.loading = true
      }
      this.getDeviceList(row)
    },

    /** 场所展开 查询设备 */
    getDeviceList (row) {
      queryDevicePlace({
        placeCode: this.deviceParams.place.placeCode
      })
        .then(placeRes => {
          let siteAddress = placeRes.siteAddress
          const deviceTypeListMap = this.$store.getters['Dict/deviceTypeListMap']
          if (row) {
            row.loading = false
          }
          // 保存场所地址 再去查询设备列表
          queryCurrentRoomDeviceList(this.deviceParams)
            .then(res => {
              if (res.content && res.content.length > 0) {
                res.content.forEach(item => {
                  if (!item.factory) {
                    item.factory = '--'
                  }
                })
                res.content = res.content.map(item => {
                  item.siteAddress = item.deviceAddress || siteAddress
                  item.createTime = dayjs.filterY_M_D_H_M_S(item.createTime)
                  item.updateTime = dayjs.filterY_M_D_H_M_S(item.updateTime)

                  if (item.deviceType) {
                    item.type = deviceTypeListMap[item.deviceType] || '其他'
                  }

                  item.dataStatusName = item.deviceStatus == 1 ? '在线' : '离线'
                  return item
                })

                if (this.curPlaceIdx != -1) {
                  this.$set(this.tableData[this.curPlaceIdx], 'children', res.content)
                  this.tableData[this.curPlaceIdx].children.totalPages = res.totalPages
                  // this.tableData[this.curPlaceIdx].children.totalPages = res.totalSize / this.params.pageSize
                  this.tableData[this.curPlaceIdx].children.totalSize = res.totalSize
                }
              } else {
                if (this.curPlaceIdx != -1) {
                  this.$set(this.tableData[this.curPlaceIdx], 'children', [])
                  this.tableData[this.curPlaceIdx].children.totalPages = 0
                  this.tableData[this.curPlaceIdx].children.totalSize = 0
                }
              }

              this.curPlaceIdx = -1
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    /** 表格样式 */
    bigcellStyle () {
      let str = 'height:' + this.rowHeight + 'px;'
      return str
    },

    /** 表格样式 */
    cellStyle (row) {
      let str = ''
      if (row.columnIndex == 3) {
        // 在线/离线
        if (row.row.deviceStatus == 1) {
          str = 'color:#3BC022;'
        } else {
          str = 'color:#F63F70;'
        }
      }
      return str
    },

    /** 根据经纬度获取详细地址 */
    lnglatTransformAdress (pos) {
      this.initGeocoder() //
      this.geocoder.getAddress(pos, (status, result) => {
        if (result.info === 'OK') {
          // addressComponent.province省 addressComponent.district区
          const detailList = result.regeocodes.map(_c => _c.formattedAddress)
          const provinceList = result.regeocodes.map(
            _c =>
              _c.addressComponent.province + _c.addressComponent.city + _c.addressComponent.district
          )
          this.tableData.forEach((item, index) => {
            this.$set(item, 'detailAddress', detailList[index])
            this.$set(item, 'province', provinceList[index])
          })
        } else {
          this.tableData.forEach((item) => {
            this.$set(item, 'detailAddress', '--')
            this.$set(item, 'province', '--')
          })
        }
      })
    },

    /** 初始化 Geocoder */
    initGeocoder () {
      /* eslint-disable */
      this.geocoder = new AMap.Geocoder({
        /* eslint-enable */
        city: '肇庆市', //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      })
    },

    /** 清空地址相关数据 */
    clearAddress () {
      this.curLngLatList = []
    }
  }
}
</script>

<style lang="less" scoped>
.device-list {
  //padding: 0px 16px;
  box-sizing: border-box;
  // background: var(--quyufangkong-table-bg);
  background: var(--bg-color-3);
  padding:16px;
  .table {
    overflow: auto;
  }
  .table::-webkit-scrollbar {
    width: 0;
  }
}

.device-list/deep/ .el-table,
.device-list /deep/ .el-table th,
.device-list /deep/ .el-table__expanded-cell {
  background: transparent;
  font-size: 16px;
  color: var(--base-text-color-1);
}
.device-list /deep/ .el-table__expanded-cell {
  // background: #1f2b3f !important;
  background: var(--expand-table-bg-color) !important;
}
.device-list /deep/ .el-table th {
  color: var(--base-text-color-to-999999);
}
// .device-list /deep/ .el-table tr {
//   background: var(--table-head-bg-color) !important;
//   height: 54px;
// }
.device-list /deep/ .el-table tr td,
.device-list /deep/ .el-table tr th {
  border-bottom: none;
  text-align: left;
  height: 54px;
  padding: 0;
  box-sizing: border-box;
}

.device-list /deep/ .el-table__row--striped,
.device-list /deep/ .el-table__row--striped td {
  background: var(--table-head-bg-color) !important;
}
.device-list /deep/ .el-table::before {
  height: 0;
}
.device-list /deep/ .el-table__expanded-cell {
  padding-left: 48px !important;
  box-sizing: border-box;
}
.device-list /deep/ .el-table__expanded-cell .el-table__row,
.device-list /deep/ .el-table__expanded-cell tr,
.device-list /deep/ .el-table__expanded-cell tr td,
.device-list /deep/ .el-table__expanded-cell tr th {
  height: 40px;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}

.device-list /deep/ .el-table .el-button {
  padding:  0 !important;
}

.right {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 16px 0;
  box-sizing: border-box;
  .btn {
    padding: 10px 20px;
    border: none;
    color: @font-color-3;
    background-color: #177ddc;
    &:hover {
      background-color: ragb(255, 255, 255, 0.2);
    }
  }
}
.search-filter {
  position: absolute;
  left: 0px;
  top: 67px;
  width: 100%;
  padding: 0px 32px;
  box-sizing: border-box;
  z-index: 2000;
}
.device_wrap {
  padding-left: 32px;
  ::v-deep .PageHeader {
    margin: 0;
  }
  ::v-deep .filter-header-wrapper {
    margin: 0;
  }
  ::v-deep .selectPanel {
    margin: 0;
  }
}
/deep/ .pagination .el-input__inner {
  border: 1px solid rgba(53, 62, 91, 0.64) !important;
}
</style>
