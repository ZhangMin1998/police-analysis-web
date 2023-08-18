<template>
  <div class="TrailTable">
    <div class="header">
      <div class="header_left">
        <el-input
          v-model.trim="params.placeAddress"
          @keyup.enter.native="searchClick"
          placeholder="请输入地址"
          clearable
        >
          <template slot='suffix'>
            <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchClick"></i>
          </template>
        </el-input>
        <DatePick
          :isShowTimeType="false"
          ref="DatePick"
          @getTimeSelect="getTimeSelect"
          @clearTime="clearTime"
        ></DatePick>
        <slot name="headerLeft"></slot>
      </div>
      <div class="header_right">
        <div class="blank_button" @click="searchClick">搜索</div>
      </div>
    </div>
    <div class="main_box">
      <!-- <Loading :isLoading.sync="aaa"> -->
        <div v-if="!isEmpty">
          <template-table
            :isShowPagination="true"
            :tableData="table.tableData"
            :columns="table.columns"
            :tableHeight="((table.tableData.length + 1) * 48) + 1"
            :rowHeight="48"
            :pageData="table.pageData"
            :isLoading="isLoading"
            :btnRender="table.btnList"
            :header-row-style='() => "height: 48px"'
            :header-cell-style="() => 'background-color: rgba(255, 255, 255, .04) !important;color:#8799BF;font-size:16px;font-weight:400'"
            :newRowColor='true'
            @handleCurrentChange="handleCurrentChange"
          ></template-table>
        </div>
        <div class="empty_div" v-else>
          <EmptyData />
        </div>
      <!-- </Loading> -->
      <!-- 溯源弹框 -->
      <RightDialog ref="RightDialog" :rightDialog="rightDialogInfo"></RightDialog>
    </div>
  </div>
</template>

<script>
import DatePick from '@/views/common/data-center/components/DatePick'
// import Loading from '@/components/VisualComponents/Loading'
import TemplateTable from '@/components/VisualComponents/Table'
import EmptyData from '@/components/BasicComponents/EmptyData'
import RightDialog from '@/views/common/all-archives/personFileDetail/components/Chart/rightDialog'
import { getPersonTrack, getTrackSource } from '@/api/allArchives'
import dayjs from '@/utils/filters'
import { mapState } from 'vuex'

export default {
  name: 'TrailTable',
  components: {
    // TableGrid,
    TemplateTable,
    EmptyData,
    DatePick,
    // Loading,
    RightDialog
  },
  computed: {
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    ID () {
      return this.$route.query.id
    },
    CerNunber () {
      return this.$route.query.cerNumber
    },
    CerType () {
      return this.$route.query.cerType
    },
    PersonVid () {
      return this.$route.query.personVid || ''
    },
    origin () {
      return window.location.origin + '/'
    }
  },
  data () {
    return {
      defaultQueryObj:{
        key:''
      },
      params: {
        placeAddress: '',
        startTime: '',
        endTime: '',
        attr: '',
        entityLabelName: ''
      },
      table: {
        pageData: {
          curPage: 1,
          pageSize: 11,
          total: 0
        },
        allData: [],
        tableData: [],
        columns: [
          { label: '数据来源', prop: 'dataSource', minWidth: '10%', type: 'nor' },
          { label: '序号', type: 'index', width: '100' },
          { label: '时间',
            prop: 'collectTime',
            minWidth: '10%',
            type: 'nor',
            renderFun: function (row) {
              if (!row.collectTime) return '--'
              return dayjs.filterString(row.collectTime)
            }
          },
          { label: '场所', prop: 'placeName', minWidth: '10%', type: 'nor' },
          { label: '地址', prop: 'placeAddress', minWidth: '10%', type: 'nor' },
          { label: '经纬度',
            prop: 'latitude',
            minWidth: '10%',
            type: 'nor',
            renderFun: function (row) {
              if (!row.latitude || !row.longitude) return '--'
              return row.longitude + '°E,' + row.latitude + '°N'
            }
          }
        ],
        btnList: [
          {
            label: '操作',
            icon: 'icon-xiangqing',
            btnEvent: this.openDetail,
            alt: '溯源'
          }
        ],
      },
      isLoading: false,
      isEmpty: false,
      rightDialogInfo: {
        title: '溯源',
        show: false,
        handleClose: this.handleClose,
        loading: false,
        dataSource: '',
        listData: [],
        labelList: [],
      },
    }
  },
  create () {

  },
  mounted () {
    this.setDefaultTime()
    this.searchClick()
  },
  methods: {
    // 设置默认时间
    setDefaultTime () {
      const start = new Date();
      let startTime = start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      let endTime = Date.now()
      this.$refs.DatePick.pick.startTime = startTime
      this.$refs.DatePick.pick.endTime = endTime
    },
    getTimeSelect (time) {
      this.params.startTime = time.startTime
      this.params.endTime = time.endTime
    },
    clearTime () {
      this.params.startTime = ''
      this.params.endTime = ''
    },
    searchClick () {
      this.isLoading = true
      this.params.attr = this.CerNunber
      this.params.entityLabelName = 'cer_number'
      this.params.startTime = this.$refs.DatePick.pick.startTime
      this.params.endTime = this.$refs.DatePick.pick.endTime

      // console.log(this.params)

      this.table.tableData = []
      getPersonTrack(this.params).then(res => {
        // console.log(res)
        if (!res.data.length|| res.code !== 1) {
          this.table.tableData = []
          this.table.pageData.total = res.data.length
          return
        } else {
          this.table.allData = res.data
          this.table.pageData.total = res.data.length
          // 前端分页 先取前10条
          this.table.tableData = this.table.allData.slice(
            (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
            this.table.pageData.curPage * this.table.pageData.pageSize
          )
          // 数据来源格式化
          this.table.allData.forEach(item => {
            let type = ''
            this.dataTypeList.forEach(e => {
              if (e.srcNameEn === item.srcName) {
                type = e.srcNameCn
              }
            })
            item.dataSource = type
          })
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    handleCurrentChange (val) {
      this.table.tableData = this.table.allData.slice(
        (val - 1) * this.table.pageData.pageSize,
        val * this.table.pageData.pageSize
      )
    },
    // 溯源查询
    openDetail (row) {
      // console.log(row)
      this.rightDialogInfo.loading = true
      this.rightDialogInfo.listData = []
      this.rightDialogInfo.labelList = []
      this.rightDialogInfo.dataSource = row.dataSource
      this.rightDialogInfo.show = true
      let params = {
        attr: row.attr,
        collectTime: row.collectTime,
        // collectTime: 1657157667,
        srcName: row.srcName,
        placeAddress: row.placeAddress,
        srcFieldName: row.srcFieldName,
        longitude: row.longitude,
        latitude: row.latitude,
        odsHash: row.odsHash
      }
      getTrackSource(params).then(res => { // 溯源接口
        // console.log(res)
        this.rightDialogInfo.listData = res.data
        res.fieldList.forEach(item => {
          if (item.archivesStatus === 'display') {
            this.rightDialogInfo.labelList.push(item)
          }
        })
      }).finally(() =>{
        this.rightDialogInfo.loading = false
      })
    },
    handleClose (row) {
      console.log(row)
      this.rightDialogInfo.show = false
    },
  }
}
</script>

<style lang="less" scoped>
.TrailTable{
  padding: 70px 24px 15px 24px;
  .header{
    display: flex;
    justify-content: space-between;
    padding: 12px 0 12px 0;
    .header_left {
      display: flex;
      align-items: center;
      flex: 1;
      /deep/.el-input--suffix {
        // .el-input__inner {
        //   padding-left: 12px;
        //   padding-right: 32px;
        //   border-radius: 2px;
        //   border-color: @border-color-1 !important;
        //   &::placeholder {
        //     color: #657494;
        //     font-size: 16px;
        //   }
        //   &:hover {
        //     border-color: #3D4C75 !important;
        //   }
        // }
        .el-input__suffix {
          right: 12px;
          .icon-sousuo {
            font-size: 16px;
            // color: #657494;
            line-height: 40px;
            cursor: pointer;
          }
          .el-icon-circle-close {
            width: 16px;
            font-size: 16px !important;
            position: absolute;
            right: 18px;
            top: 1px;
            color: #657494 !important;
          }
          .el-icon-circle-close:hover {
            color: @active-color !important;
          }
        }
      }
      /deep/.el-input {
        width: 416px;
        margin-right: 16px;
      }
    }
    .header_right {
      display: flex;
      align-items: center;
      flex: none;
      .btn {
        padding: 5px 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        line-height: 20px;
        font-size: 14px;
        color: @font-color-1;
        cursor: pointer;
      }
      .primary {
        background: #177ddc;
        color: @font-color-3;
        border-color: transparent;
      }
    }
  }
  .main_box{
    .empty_div{
      height: 600px;
    }
    ::v-deep .el-table {
      height: 600px !important;
      .el-table__header-wrapper {
        .has-gutter {
          tr {
            height: 48px !important;
          }
          th {
            font-weight: 400;
            line-height: 22px;
            .cell {
              padding: 0 16px !important;
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-table__cell {
          .cell {
            padding: 0 16px !important;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1365px) {
    .main_box {
      .empty_div {
        height: 960px;
      }
      ::v-deep .el-table {
        height: 960px !important;
      }
    }
  }
  /deep/.el-icon-circle-close {
    margin-top: 0 !important;
  }
  .rightDialog {
    right: 24px;
    top: 90px;
    background-color: var(--bg-color-2);
  }
}
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .TrailTable{
    padding: 85px 24px 15px 24px;
  }
}
</style>
