<template>
  <div
    id="wrap"
    class="wrap"
    v-p-loading="loading"
    :element-loading-background="'--bg-color-3'"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <TotalData
      v-if="haveHeader"
      class="data"
      v-show="!loading"
      :showType="'text'"
      :dataType="'community_face'"
      :tipImgContent="'人脸抓拍'"
      @changeTotalDataLoad="changeTotalDataLoad"
    ></TotalData>

    <!--    数据统计-->
    <TotalDataChartLine
      v-if="haveHeader"
      v-show="!loading"
      :dataType="'community_face'"
      @changeChartLineLoad="changeChartLineLoad"
    ></TotalDataChartLine>

    <div class="wrap-list" v-if="!loading">
      <div class="title" v-if="haveHeader">
        <span>数据列表 -</span>
        <span>人脸抓拍</span>
      </div>
      <div>
        <header v-if="haveHeader">
          <PageHeader>
            <!-- 搜索表单 -->
            <div class="table-searchs">
              <ImageSearch
                ref="ImageSearch"
                class="search-component"
                :showSearchBtn="false"
                @isShowUpload="showUpload"
                @getImgUrl="uploadImage"
              >
              </ImageSearch>
              <!-- 时间搜索控件 -->
              <DatePick :isShowTimeType="false" ref="DatePick"></DatePick>
              <!-- 搜索表单 -->
              <!--              <div style="width: 250px">-->
              <!--                <el-input-->
              <!--                  v-model.trim="params.placeOrDeviceName"-->
              <!--                  @keyup.enter.native="searchEvent"-->
              <!--                  placeholder="请输入场所名称/设备名称"-->
              <!--                  clearable-->
              <!--                >-->
              <!--                </el-input>-->
              <!--              </div>-->
              <!-- <div>
                <el-input v-model.trim="params.deviceeName" placeholder="请输入设备名称" clearable>
                </el-input>
              </div> -->
            </div>

            <!-- 搜索按钮 -->
            <div class="opt_btn">
              <el-button type="primary" class="btn" v-debounce="searchEvent">{{
                '搜索'
              }}</el-button>
              <div class="division"></div>
              <div class="blank_button" :loading="exportLoading" @click="exportTable">
                {{ '导出' }}
              </div>
            </div>
          </PageHeader>
        </header>

        <main class="table-main">
          <CusImagesPager
            :list="table.tableData"
            :columns="table.columns"
            :pageData="{ curPage, pageSize: params.pageSize, total }"
            :isLoading="table.isLoading"
            :padding="'16px'"
            :haveTitle="false"
            @handleCurrentChange="handleCurrentChange"
          ></CusImagesPager>
        </main>
      </div>
    </div>

    <pop :pop.sync="pop" @beforeClose="hideDetail" @beforeOpen="showDetail">
      <div class="photos">
        <div class="left_photo">
          <ElImage :imgSet.sync="imgSet"></ElImage>
        </div>

        <div class="right_photo">
          <ElImage :imgSet.sync="catchImgSet"></ElImage>
        </div>
      </div>
    </pop>

    <!--    导出-->
    <CusExport
      method="post"
      fileName="人脸抓拍"
      url="/police/faceSnap/export"
      :exportShow.sync="exportLoading"
      :allCols="allCols"
      :totalData="total"
      :params="{ ...oldParams }"
    ></CusExport>
  </div>
</template>

<script>
import { queryFaceSnapPager } from '@/api/dataCenter'
import PageHeader from '@/components/BasicComponents/PageHeader'
import DatePick from '@/views/common/data-center/components/DatePick'
import Pop from '@/components/VisualComponents/PopDialog'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import ElImage from '@/components/BasicComponents/ElImage'
import TotalData from '@/views/common/data-center/components/total-data'
import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import CusExport from '@/components/VisualComponents/CusExport'
import BaseLoadMixins from '../baseLoadMixins'
import ImageSearch from '@/views/common/full-database-search/image-search/components/ImageSearch'
const columns = [
  { prop: 'photo', type: 'img' },
  { label: '性别', prop: 'sex' },
  { label: '年龄', prop: 'age' },
  { label: '配饰', prop: 'wearItems' },
  { label: '采集时间', prop: 'passtime' },
  { label: '场所', prop: 'placeName' },
  { label: '设备', prop: 'deviceName' },
  { label: '经度', prop: 'longitude' },
  { label: '纬度', prop: 'latitude' },
  { label: '设备厂商', prop: 'factoryName' }
]

const allCols = [
  {
    label: '事件项',
    list: [
      { label: '头像', prop: 'photoFile' },
      { label: '性别', prop: 'sex' },
      { label: '年龄', prop: 'age' },
      { label: '配饰', prop: 'wearItems' },
      { label: '采集时间', prop: 'passtime' },
      { label: '场所', prop: 'placeName' },
      { label: '设备', prop: 'deviceName' },
      { label: '经度', prop: 'longitude' },
      { label: '纬度', prop: 'latitude' },
      { label: '设备厂商', prop: 'factoryName' }
    ]
  }
]
export default {
  name: 'FaceRecognition',
  components: {
    DatePick,
    PageHeader,
    Pop,
    CusImagesPager,
    ElImage,
    TotalData,
    TotalDataChartLine,
    CusExport,
    ImageSearch
  },
  mixins: [BaseLoadMixins],
  props: {
    haveHeader: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      allCols: Object.freeze(allCols),
      isShowUpload: false,
      catchImgSet: {
        src: '',
        width: 462,
        height: 260,
        errorSrc: 'person-default-0',
        list: []
      },
      imgSet: {
        src: '',
        width: 194,
        height: 260,
        errorSrc: 'person-default-1',
        list: []
      },
      pop: { show: false, title: '查看原片', width: '720px', top: '180px' },
      total: 0,
      curPage: 1,
      params: {
        // deviceName: '',
        // placeName: '',
        placeOrDeviceName: '',
        pageNum: 1,
        pageSize: 12,
        startTime: '',
        endTime: ''
      },
      oldParams: {},
      searchLoading: false,
      exportLoading: false,
      table: {
        columns: [],
        tableData: [],
        // btnRender: [
        //   {
        //     label: '查看图片',
        //     type: 'success',
        //     icon: 'icon-look',
        //     btnEvent: this.handlePicture,
        //     alt: '查看图片'
        //   }
        // ],
        // 加载条
        isLoading: false
      },
      pathName: ''
    }
  },
  watch: {
    isShowUpload: {
      handler (val) {
        if (val) {
          document.addEventListener('click', this.bodyClick)
        } else {
          document.removeEventListener('click', this.bodyClick)
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
    this.table.columns = columns
    this.oldParams = { ...this.params }
    this.getTable()
  },

  methods: {
    bodyClick (e) {
      this.$nextTick(() => {
        let search = document.querySelector('.search-list')
        let imgSearch = document.querySelector('.img_search')
        if (!search.contains(e.target) && !imgSearch.contains(e.target)) {
          if(this.$refs.ImageSearch.$refs.ImageDragUpload.loading){return}
          this.$refs.ImageSearch.blur()
        }
      })
    },
    uploadImage (item) {
      this.pathName = item
    },
    showUpload (bool) {
      this.isShowUpload = bool
    },
    // 导出表格
    exportTable () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        // this.exportReq('/police/faceSnap/export', this.oldParams)
        this.exportLoading = true
      })
    },
    // exportReq(url, params) {
    //   //调用封装方法
    //   exportUtils
    //     .exportMethod({
    //       method: 'post',
    //       url: url,
    //       fileName: '人脸抓拍',
    //       data: params
    //     })
    //     .finally(() => {
    //       this.exportLoading = false
    //     })
    // },

    // 查看原图
    // handlePicture (row) {
    //   this.catchImgSet.src = window.location.origin + '/' + row.secenesPhoto
    //   this.imgSet.src = window.location.origin + '/' + row.photo
    //   this.showDetail()
    // },
    // 筛选条件搜索
    searchEvent () {
      this.$nextTick(() => {
        if (!this.searchRules()) return
        if(this.$refs.ImageSearch.$refs.ImageDragUpload && this.$refs.ImageSearch.$refs.ImageDragUpload.loading){
          this.$messageTip.error('请等待文件上传完毕再进行操作')
          return
        }
        this.params.pageNum = 1
        this.curPage = 1
        this.searchLoading = true
        this.params.pathName = this.pathName
        this.oldParams = { ...this.params }
        this.getTable()
      })
    },

    /** 表格 - 搜索 - 校验 */
    searchRules () {
      if (this.$refs.DatePick) {
        this.params.startTime = this.$refs.DatePick.pick.startTime || ''
        this.params.endTime = this.$refs.DatePick.pick.endTime || ''
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

    hideDetail () {
      this.pop.show = false
    },

    showDetail () {
      this.pop.show = true
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

      queryFaceSnapPager(this.oldParams)
        .then(res => {
          this.table.tableData = res.content
          this.table.tableData.forEach(item => {
            if (item.wearItems === 'true') {
              item.wearItems = '有配饰'
            } else if (item.wearItems === 'false') {
              item.wearItems = '无配饰'
            }
          })
          this.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyClick)
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
  padding: 0 8px;
  box-sizing: border-box;
}

.photos {
  display: flex;
  justify-content: space-between;
  .left_photo {
    height: 260px;
  }
  .right_photo {
    height: 260px;
  }
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
  min-height: 940px;
  .CusImagesPager-ul {
    margin: 0;
    .CusImagesPager_item {
      background: var(--bg-color-1) !important;
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
::v-deep .search-container {
  .img_search {
    background: transparent !important;
    .placeholder {
      font-size: 16px;
    }
  }
  .search-list {
    top: 39px !important;
    .division {
      border-color: var(--active-color) !important;
    }
  }
}
</style>
