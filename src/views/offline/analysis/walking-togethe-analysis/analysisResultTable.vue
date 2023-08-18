<template>
  <div class="analysisResult">
    <div class="analysisResult_search">
      <div class="item">
        <div class="key">时间：</div>
        <div class="val">{{ info.timeStr }}</div>
      </div>

      <div class="analysisResult_search_auto">
        <div class="item" v-for="(item, index) in attrList" :key="index">
          <div class="key">类型/数值：</div>
          <div class="val">{{ item.typeName }}/{{ item.attr }}</div>
        </div>
      </div>
      <div @click.prevent.stop="getDefaultRound" class="img-icon">
        <img src="@/assets/img/icon-location.png" width="20" height="20" title="查看轨迹" alt="" />
      </div>
    </div>

    <!-- <div
      class="table-content-wrap anaTableN"
      :style="`height:${screenHeight - 405}px;overflow: auto;`"
    > -->
    <div class="table-content-wrap anaTableN">
      <template-table :tableData="tableData" :columns="columns" :tableHeight="getTableHeight()" :rowHeight="38"
        :jumper="false" :btnRender="btnRender" :isShowPagination="false"
        :pageData="{ ...pageData, pageSize: tableParams.page_size }" :isLoading="false"
        @handleCurrentChange="handleCurrentChange"></template-table>
      <div class="totals">总数:{{ pageData.total }}</div>
    </div>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import TemplateTable from '@/components/VisualComponents/Table'
import dayjs from '@/utils/filters'
import { queryPeerTrack } from '@/api/analysis'
import { gps } from '@/utils/resetPosition'
import { queryJobRes } from '@/api/taskManagement'
import { getFeatureOptionsApi } from '@/api/warnControl.js'

import { mapState } from 'vuex'
const columns = [
  {
    label: '关联度(权重)',
    prop: 'percent',
    width: '98',
    renderFun: function (row) {
      if (row.percent) {
        return row.percent + '%'
      } else {
        return '--'
      }
    }
  },
  {
    label: '数值',
    prop: 'attr',
    width: '163',
    renderFun: function (row) {
      if (row.attr) {
        return row.attr
      } else {
        return '无此档案'
      }
    }
  }
]
export default {
  components: {
    TemplateTable
  },
  mixins: [autoTableHeight],
  props: {
    tableParams: {
      type: Object,
      default: () => { }
    },
    isSubmiting: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      info: { timeStr: '' },
      subHeight: 455,
      tableData: [],
      columns: Object.freeze(columns),
      btnRender: [
        {
          label: '轨迹',
          type: 'rodeLine',
          icon: 'icon-guiji',
          btnEvent: this.getRowRodeLine,
          alt: '查看轨迹'
        }
      ],
      pageData: {
        curPage: 1,
        total: 0,
        btnRenderWidth: 60,
        pagerCount: 5
      },
      isLoading: true,
      trackList: [],
      trackListMap: [],
      showTrack: true,
      dashAttr: -1,
      haveValue: false,
      onlyWorkOnceTime: true,
      typeList: [] // 对照表
    }
  },

  computed: {
    ...mapState('Common', {
      dataTypeFormList: 'dataTypeFormList'
    }),
    attrList () {
      if (this.$route.query?.keyList && !this.haveValue) {
        // console.log(this.$route.query.keyList)
        const keyList = JSON.parse(this.$route.query.keyList)
          .filter(_c => _c.ename !== 'end_time' && _c.ename !== 'start_time')
          .map(_c => {
            return { typeName: _c.cname, attr: _c.value }
          })
        return keyList
      }
      if (!this.tableParams.attrs) return []
      // console.log(this.tableParams.attrs)
      const attrs = JSON.parse(JSON.stringify(this.tableParams.attrs))
      // console.log(2222, attrs)
      // console.log(this.dataTypeFormList)
      const list =
        attrs.map(ele => {
          ele.typeName = this.dataTypeFormList.find(
            _c => _c.labelNameEn === ele.attr_type
          ).labelName
          return ele
        }) ?? []
      return list
    },
    isCancel () {
      //加入任务则取消轮循
      return !this.isSubmiting
    }
  },

  watch: {
    tableParams: {
      handler (val) {
        // console.log('val', val)
        if (!val || JSON.stringify(val) === '{"page_size":200}') return
        this.getTable(val)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.bus.$on('haveValue', (e) => {
      this.haveValue = e
    })
    getFeatureOptionsApi().then(res => {
      let result = res || []
      result.forEach(item => {
        if (!item.isFile) {
          this.typeList.push(item)
        }
      })
    }).catch(err => {
      console.log(err)
    }).finally(() => {
    })
  },

  mounted () {
    if (this.$route.query?.id) {
      this.getTable({
        page_num: 1,
        page_size: 200,
        id: this.$route.query.id
      })
    }
  },

  methods: {
    getTableHeight () {
      return document.body.scrollWidth > 1300 ? 'calc(70vh - 150px)' : 'calc(70vh - 30px)'
    },
    getTable (params, isPageChange) {
      // console.log(params, isPageChange, 'getTable')
      // console.log('每次都执行')
      // 下面这句代码 this.isCancel不知道在哪里被修改了，得找到，看一下逻辑
      // console.log(this.isCancel);
      // console.log(!this.$route.query.id);
      this.tableData = []
      if (!isPageChange) {
        // console.log('里面的',this.isCancel && !this.$route.query.id);
        // console.log('isCancel',this.isCancel)
        // console.log('isSubmiting',this.isSubmiting);
        // this.$parent.expend({ isCanExpend: true }, 0)
        if (this.isCancel && !this.$route.query.id) return
      }
      // if(!this.$route.query.id){return}
      // console.log('执行了');
      // if(this.isCancel){return}
      const Url = (this.$route.query.id && !this.haveValue) ? queryJobRes : queryPeerTrack
      Url(params).then(res => {
        // console.log('Url(params).then', res);
        // console.log(typeof res);
        // 为字符串继续轮询
        // if (typeof res === 'string') {
        //   setTimeout(() => {
        //     this.getTable(params)
        //   }, 5000)
        //   return false
        // }
        if (res.code === 2) {
          setTimeout(() => {
            this.getTable(params)
          }, 5000)
          return false
        }
        this.isLoading = false
        this.pageData.total = res?.total_size ?? 0
        // console.log(this.pageData);
        if (!res || res.length === 0) {
          this.$messageTip.error('未查询到相关结果！')
          return false
        }
        let id = 0
        this.tableData =
          res?.data_page?.map(_c => {
            _c.id = id++
            _c.isOpen = false
            _c.showList = _c.trace
            _c.trace = _c.trace.map(ele => {
              ele.id = id++
              let positionObj = {}
              if (this.$store.state.User.online) {
                positionObj = {
                  longitude: ele.longitude,
                  latitude: ele.latitude
                }
              } else {
                // 高德地图 =》 离线地图经纬度
                positionObj = gps.GcjWGSConversion({
                  Lon: ele.longitude,
                  Lat: ele.latitude,
                  type: 1
                })
              }
              ele.LongitudeAndLatitude = ele.longitude && ele.latitude ? ele.longitude + '°E,' + ele.latitude + '°N' : '--'
              ele.time = dayjs.filterSS(ele.time_list[0])
              return {
                id: ele.id,
                title: ele.address,
                location: [positionObj.longitude, positionObj.latitude],
                timeList: ele.time_list.map(timeEle => dayjs.filterSS(timeEle)),
                LongitudeAndLatitude: ele.LongitudeAndLatitude,
                time: ele.time
              }
            })
            return _c
          }) ?? []
        // console.log(this.tableData);
        this.$emit('tableData', this.tableData)
        if (params.page_num > 1) return
        this.$nextTick(() => {
          // console.log('22222222222222这里执行了');
          this.$parent.expend({ isCanExpend: true }, 1)
          this.$emit('update:isSubmiting', false)
          // console.log(this.$parent.isSubmiting);
          // this.$parent.isSubmiting = false
        })
        if (res.main_trace?.trace?.length > 0 ?? false) {
          const endIndex = res.main_trace.trace.length - 1
          const traceEndIndex = res.main_trace.trace[endIndex].time_list.length - 1
          this.info.timeStr =
            dayjs.filterSS(res.main_trace.trace[0].time_list[0]) +
            ' ~ ' +
            dayjs.filterSS(res.main_trace.trace[endIndex].time_list[traceEndIndex])
          this.trackList = res.main_trace.trace.map(ele => {
            let positionObj = {}
            if (this.$store.state.User.online) {
              positionObj = {
                longitude: ele.longitude,
                latitude: ele.latitude
              }
            } else {
              // 高德地图 =》 离线地图经纬度
              positionObj = gps.GcjWGSConversion({
                Lon: ele.longitude,
                Lat: ele.latitude,
                type: 1
              })
            }
            return {
              title: ele.address,
              location: [positionObj.longitude, positionObj.latitude],
              timeList: ele.time_list.map(timeEle => dayjs.filterSS(timeEle))
            }
          })
          // 地图显示点
          this.trackListMap = this.trackList.filter((item) => {
            return item.location[0] && item.location[1]
          })
          //只在刚进来的时候会画一次图，其他时候不画
          if (this.onlyWorkOnceTime) {
            this.getDefaultRound()
            this.onlyWorkOnceTime = false
          }
        } else {
          this.info.timeStr = '--'
        }
      })
    },

    // 实线轨迹
    getDefaultRound () {
      if (this.showTrack) {
        if (this.trackListMap && this.trackListMap.length) {
          this.bus.$emit('setViewCenter', {
            position: this.trackListMap[0].location,
            zoom: 12,
            isMark: false
          })
        } else {
          this.$message.info('该轨迹没有经纬度坐标，无法在地图显示')
        }
        this.$emit('toggleMainTrackList', this.trackListMap)
        // 根据经纬度点 定位中心点
        this.showTrack = false
      } else {
        if (!this.trackListMap.length) {
          this.$message.info('该轨迹没有经纬度坐标，无法在地图显示')
        }
        this.$emit('toggleMainTrackList', [])
        this.showTrack = true
      }
    },

    // 虚线轨迹
    getRowRodeLine (e) {
      // 筛选出有坐标的地图点，否则地图会会黑屏报错
      let dashTracksListMap = e.trace.filter((item) => {
        return item.location[0] && item.location[1]
      })
      if (this.dashAttr === e.attr) {
        // 轨迹隐藏
        this.$emit('toggleDashTrackList', [])
        if (!dashTracksListMap.length) {
          this.$message.info('该轨迹没有经纬度坐标，无法在地图显示')
        }
        this.dashAttr = -1
        return
      }
      // 轨迹生成
      if (dashTracksListMap.length) {
        // 设置中心点
        this.bus.$emit('setViewCenter', {
          position: dashTracksListMap[0].location,
          zoom: 12,
          isMark: false
        })
      } else {
        this.$message.info('该轨迹没有经纬度坐标，无法在地图显示')
      }
      this.$emit('toggleDashTrackList', dashTracksListMap)
      this.dashAttr = e.attr
    },

    // 分页切换操作
    handleCurrentChange (val) {
      if (this.$route.query.id) {
        this.getTable({
          page_size: 200,
          page_num: val,
          id: this.$route.query.id
        })
        return false
      }
      const params = { ...this.tableParams, page_num: val }
      this.getTable(params, true)
    }
  }
}
</script>

<style lang="less" scoped>
.analysisResult {
  margin-top: 10px;
  padding: 0 6px 0 12px;
  box-sizing: border-box;
  height: calc(100vh - 325px);

  .analysisResult_search {
    position: relative;

    .item {
      display: flex;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 24px;

      .key {
        color: var(--base-text-color-to-999999);
      }

      .val {
        flex: 1;
        color: var(--base-text-color-1);
      }
    }

    .analysisResult_search_auto {
      max-height: 40px;
      overflow: auto;
    }

    .img-icon {
      position: absolute;
      right: 16px;
      top: 0;
      cursor: pointer;
    }
  }

  .table-content-wrap {
    height: 90%;
    overflow: scroll;

    .totals {
      margin-top: 16px;
      color: var(--base-text-color-to-999999);
      font-size: 16px;
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1365px){
    .table-content-wrap {
      height: 93%;
    }
  }
}

/deep/.anaTableN .el-table .el-table__fixed-right .el-table__fixed-body-wrapper {
  top: 54px !important;
}
</style>
