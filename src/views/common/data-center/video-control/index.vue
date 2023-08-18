// 视频门禁
<template>
  <div
    id='wrap'
    class='wrap'
    v-p-loading="loading"
    :element-loading-background="'--bg-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      v-if='haveHeader'
      class="data"
      v-show='!loading'
      :showType="'text'"
      :dataType='"community_gate"'
      :tipImgContent='"视频门禁"'
      @changeTotalDataLoad='changeTotalDataLoad'
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-if='haveHeader'
      v-show='!loading'
      :dataType='"community_gate"'
      @changeChartLineLoad='changeChartLineLoad'
    ></TotalDataChartLine>

    <div id='list' class='wrap-list' v-show='!loading'>
      <div class='title' v-if='haveHeader'>
        <span>数据列表 -</span>
        <span>视频门禁</span>
      </div>
      <div>
        <header v-if='haveHeader'>
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs">
              <!-- 搜索表单 -->
              <div>
                <el-input
                  v-model.trim="params.key"
                  @keyup.enter.native="searchEvent"
                  placeholder="请输入姓名/证件号码"
                  clearable
                  class='search_input'
                >
                  <template slot='suffix'>
                    <i class='iconfont icon-sousuo' v-debounce.prevent.stop="searchEvent"></i>
                  </template>
                </el-input>
              </div>
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              <!-- <div>
                <el-select v-model="params.gateType" placeholder="请选择出入状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div> -->
            </div>

            <!-- 搜索按钮 -->
            <div class='opt_btn'>
              <el-button type="primary" class="btn" v-debounce="searchEvent">{{'搜索'}}</el-button>
              <div class='division'></div>
              <div class='blank_button' :loading="exportLoading" @click="exportTable">
                {{ '导出' }}
              </div>
            </div>
          </PageHeader>
        </header>

        <main class="table-main">
          <CusImagesPager
            :list="table.tableData"
            :columns="table.columns"
            :pageData="table.pageData"
            :isLoading="table.isLoading"
            :padding="'16px'"
            :haveTitle='false'
            @handleCurrentChange="handleCurrentChange"
          >
<!--            <div class='card_btn' slot='cardBtn' slot-scope='{ item }'>-->
<!--              <i class='iconfont icon-dangan' @click='handleGo(item)' :title='"查看档案"'></i>-->
<!--            </div>-->
            <!-- <template v-slot:CusImagesPager_title="slotProps">
              <CusTitle
                :title="getNameAndSex(slotProps.item)"
                :curStyle="{ 'margin-bottom': '0px' }"
              ></CusTitle>
            </template> -->
          </CusImagesPager>
        </main>
      </div>
    </div>

    <!--    导出-->
    <CusExport
      method="post"
      fileName="视频门禁"
      url="/police/personGate/export"
      :exportShow.sync="exportLoading"
      :allCols="allCols"
      :totalData='table.pageData.total'
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import { queryVideoControlPager } from '@/api/dataCenter'
import DatePick from '@/views/common/data-center/components/DatePick'
import PageHeader from '@/components/BasicComponents/PageHeader'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
// import exportUtils from '@/utils/exportUtils.js'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import CusExport from '@/components/VisualComponents/CusExport'
import BaseLoadMixins from '../baseLoadMixins'
import fSupSearchMixins from '../fSupSearchMixins'

const options = [
  { label: '全部', value: '' },
  { label: '入场', value: 1 },
  { label: '离场', value: 2 }
]

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '门禁图片', prop: 'photoFile' },
      { label: '姓名', prop: 'name' },
      { label: '证件类型', prop: 'cerType' },
      { label: '证件号码', prop: 'cerNumber' },
      { label: '进入时间', prop: 'probeTime' },
      { label: '小区名称', prop: 'communityName' },
      { label: '入口名称', prop: 'deviceName' }
    ]
  }
]
export default {
  components: {
    DatePick,
    PageHeader,
    CusImagesPager,
    TotalData,
    TotalDataChartLine,
    CusExport
  },
  mixins: [BaseLoadMixins, fSupSearchMixins],
  props: {
    haveHeader: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      allCols: Object.freeze(allCols),
      params: {
        pageNum: 1,
        pageSize: 12,
        startTime: '',
        endTime: '',
        key: '',
        gateType: 1
      },
      oldParams: {},
      exportLoading: false,
      searchLoading: false,
      table: {
        columns: [
          { label: '门禁图片', prop: 'photo', type: 'img' },
          { label: '姓名', prop: 'name' },
          { label: '证件类型', prop: 'cerType' },
          { label: '证件号码', prop: 'cerNumber' },
          { label: '进入时间', prop: 'probeTime' },
          { label: '小区名称', prop: 'communityName' },
          { label: '入口名称', prop: 'deviceName' }
          // { label: '出生日期', prop: 'birthday' },
          // { label: '联系方式', prop: 'phone' },
          // { label: '场所名称', prop: 'placeName' },
          // { label: '房屋详情', prop: 'building' },
          // { label: '进入设备', prop: 'deviceName' }
        ],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        // btnRender: [
        //   {
        //     label: '查看档案',
        //     type: 'success',
        //     icon: 'icon-check',
        //     btnEvent: this.handleGo,
        //     alt: '查看档案'
        //   }
        // ],
        // 加载条
        isLoading: true
      }
    }
  },
  watch: {
    loading: {
      handler (newVal) {
        if (!newVal) {
          if (this.$route.query.pathName) {
            this.$nextTick(() => {
              document.getElementById('list').scrollIntoView()
            })
          }
        }
      }
    },
    haveHeader: {
      handler (newVal) {
        if (!newVal) {
          this.changeTotalDataLoad(false)
          this.changeChartLineLoad(false)
        }
      },
      immediate: true
    }
  },
  created () {
    this.options = options
    if (this.$route.query.pathName) {
      this.params.key = this.$route.query.identity || this.$route.query.name || this.$route.query.key
      this.params.startTime = this.$route.query.startTime || ''
      this.params.endTime = this.$route.query.endTime || ''
    }
    // if (this.$route.query.identity) {
    //   this.params.key = this.$route.query.identity
    // } else if (this.$route.query.name) {
    //   this.params.key = this.$route.query.name
    // }
    this.oldParams = { ...this.params }
    this.getTable()
  },

  methods: {
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.exportLoading = true
        // this.exportReq('/police/personGate/export', this.oldParams)
      })
    },
    getNameAndSex (item) {
      if(item.sex && item.name){
        return item.name + '/' + item.sex
      }else if(!item.sex && !item.name){
        return '--' + '/' + '--'
      }else if(item.sex && !item.name){
        return '--' + '/' + item.sex
      }else{
        return item.name + '/' + '--'
      }
    },
    // exportReq (url, params) {
    //   //调用封装方法
    //   exportUtils
    //     .exportMethod({
    //       method: 'post',
    //       url: url,
    //       fileName: '视频门禁',
    //       data: params
    //     })
    //     .finally(() => {
    //       this.exportLoading = false
    //     })
    // },
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        this.params.pageNum = 1
        this.table.pageData.curPage = 1
        this.searchLoading = true

        this.oldParams = { ...this.params }
        this.getTable()
      })
    },
    handleGo (row) {
      if (!row.basePersonId) {
        this.$messageTip.error('该人员未建档！')
        return false
      } else if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
        this.$messageTip.error('暂无权限！')
        return false
      }
      // this.$router.push({
      //   name: 'VideoControlDetail',
      //   query: { id: row.basePersonId, label: '视频门禁' }
      // })
      window.open(window.location.origin + '/ol/PersonFileDetail?cerNumber=' + row.cerNumber + '&label=人物档案',"_blank")
    },
    /** 表格 - 搜索 - 校验 */
    searchRules () {
      if (this.$refs.DatePick) {
        this.params.startTime = this.$refs.DatePick.pick.startTime / 1000 || ''
        this.params.endTime = this.$refs.DatePick.pick.endTime / 1000 || ''
      }

      if (!this.params.startTime && this.params.endTime) {
        this.$messageTip.error('请输入开始时间！')
        return false
      }
      if (this.params.startTime && !this.params.endTime) {
        this.$messageTip.error('请输入结束时间！')
        return false
      }
      return true
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.params.pageNum = val
      this.oldParams.pageNum = val
      this.getTable()
    },

    // 获取 表格数据
    getTable () {
      this.table.isLoading = true
      queryVideoControlPager(this.oldParams)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
          if (this.$route.query.pathName) {
            sessionStorage.setItem('dataCenterSearchKey', this.oldParams.key || '')
            sessionStorage.setItem('dataCenterSearchStart', this.oldParams.startTime || '')
            sessionStorage.setItem('dataCenterSearchEnd', this.oldParams.endTime || '')
          }
        })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.table-searchs {
  display: flex;
  align-items: center;
  > div {
    margin-right: 12px;
  }
}

.table-main {
  //padding: 0px 16px 0 16px;
  box-sizing: border-box;
  padding: 0 8px;
}
/deep/.el-header {
    padding: 0 12px;
    box-sizing: border-box;
    flex-shrink: 0;
}
.wrap-list {
  margin-top: 24px;
  position: relative;
  padding: 16px 16px 24px;
  background: var(--bg-color-2);
  min-height: 60px;
  .title {
    margin-bottom: 24px;
    font-size: 16px;
    font-weight: bold;
    color: var(--base-text-color-to-999999);
    span:nth-child(2) {
      margin-left: 8px;
      font-weight: 400;
    }
  }
}
/deep/.PageHeader {
  margin: 0 8px;
}
/deep/.CusImagesPager {
  min-height: 694px;
  .CusImagesPager-ul {
    margin: 0;
    .CusImagesPager_item {
      background: var(--bg-color-3) !important;
    }
  }
  .CusImagesPager_item_main_info_item {
    line-height: 21px;
  }
}
.division {
  width: 1px;
  height: 24px;
  background: var(--division);
  margin: 0 16px;
}
.opt_btn {
  display: flex;
  align-items: center;
}
/deep/.el-image {
  width: 133px !important;
  height: 167px !important;
  img {
    width: 133px !important;
    height: 167px !important;
  }
}
.card_btn {
  position: absolute;
  top: 24px;
  right: 16px;
  i {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    cursor: pointer;
  }
}
/deep/.CusImagesPager_item {
  position: relative;
}
.search_input {
  width: 416px;
}
/deep/.el-input--suffix {
  .el-input__inner {
    padding-left: 12px;
    padding-right: 32px;
    border-radius: 2px;
    border-color: var(--border-color-input) !important;
    &::placeholder {
      color: var(--input-placehold-color);
      font-size: 16px;
    }
    &:hover {
      border-color: #3D4C75 !important;
    }
  }
  .el-input__suffix {
    right: 12px;
    .icon-sousuo {
      font-size: 16px;
      color: var(--input-placehold-color);
      line-height: 40px;
      cursor: pointer;
    }
  }
}
/deep/.PageHeader .el-input .el-icon-circle-close {
  width: 16px;
  position: absolute;
  right: 18px;
  top: 1px;
  color: var(--input-placehold-color) !important;
}
/deep/.PageHeader .el-icon-circle-close:hover {
  color: var(--active-color) !important;
}
</style>
