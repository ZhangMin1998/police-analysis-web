<template>
  <div ref="imageSearchDetail" class="imageSearchDetail">
    <div class="search-header">
      <ImageSearch
        ref="ImageSearch"
        class="search-component"
        :searchKey.sync="params.searchKey"
        @inputNoData="inputNoData"
        @clear="clear"
        :btnLoading="table.searchLoading"
        @handleSearch="handleSearch"
        @isShowUpload="showUpload"
        @uploadImage="uploadImage"
      ></ImageSearch>
      <div class="imageBox">
        <div style="height: 100px">
          <el-image
            v-if="url"
            :src="origin + this.url"
            style="width: 180px; height: 100px"
            fit="contain"
          ></el-image>
        </div>
      </div>
    </div>

    <main ref="mainContent" class="main-content">
      <!-- <Loading :isLoading.sync="table.searchLoading"> -->
      <div class="filterBox">
        <div class="filter">
          <FilterComponent
            :type="type"
            class="filterComponent"
            ref="filterComponent"
            :radio="true"
            :isShowClose="isShowClose"
            :dataSource="dataSource"
            categoryName="过滤项"
            :categoryList="categoryList"
            :cusStyle="{ top: '50px' }"
            key="1"
            @starFilter="starFilter"
          >
          </FilterComponent>
          <div class="right-part"></div>
        </div>
      </div>
      <div>
        <ImagesPager
          :list="table.tableData"
          :columns1="table.columns1"
          :columns2="table.columns2"
          :columns3="table.columns3"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          :isShowLongbox="isShowLongbox"
          @handleCurrentChange="handleCurrentChange"
        >
          <template v-slot:newCusImagesPager_title="slotProps">
            <CusTitle
              :title="slotProps.item"
              :curStyle="{ 'margin-bottom': '0px' }"
              :isShowImg="false"
            ></CusTitle>
          </template>
        </ImagesPager>
        <!-- 展示分页 -->
        <!-- <div class="pagination">
          <div class="totals">总数：{{ table.pageData.total || 0 }}</div>
          <el-pagination
            background
            layout="prev, pager, next,jumper"
            @current-change="handleCurrentChange"
            :page-size="table.pageData.pageSize"
            :pager-count="table.pageData.pagerCount ? table.pageData.pagerCount : 7"
            :total="table.pageData.total"
            :current-page.sync="table.pageData.curPage"
          >
          </el-pagination>
        </div> -->
      </div>
      <!-- </Loading> -->
    </main>
  </div>
</template>

<script>

import ImagesPager from './components/ImagePager.vue'
import ImageSearch from '@/views/common/full-database-search/image-search/components/ImageSearch'
import FilterComponent from '@/components/BasicComponents/FilterComponent'
import { getImageData, getDataTypes } from '@/api/superSearch'
import { mapState } from 'vuex'

export default {
  name: 'ImageSearchDetail',
  components: {
    FilterComponent,
    ImageSearch,
    ImagesPager
  },
  created () {
    if (this.$route.params.id) {
      sessionStorage.setItem('imgUrl', this.$route.params.id)
    }
    this.getTable(sessionStorage.getItem('imgUrl'))
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    })
  },
  watch: {
    isShowUpload: {
      handler (val) {
        if (val) {
          document.addEventListener('click', this.bodyClick)
        } else {
          document.removeEventListener('click', this.bodyClick)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      categoryList: [
        {
          label: '性别',
          prop: 'sex',
          list: [
            {
              title: '性别',
              label: '男',
              value: '男',
            },
            {
              title: '性别',
              label: '女',
              value: '女',
            }
          ]
        },
        {
          label: '穿戴',
          prop: 'isWear',
          list: [
            {
              title: '穿戴',
              label: '有',
              value: true
            },
            {
              title: '穿戴',
              label: '无',
              value: false
            }
          ]
        }
      ],
      dataSource: [
        {
          label: '数据来源66',
          prop: 'dataSource',
          list: [
            // {
            //   title: '数据来源',
            //   label: '人脸抓拍',
            //   value: ['人脸抓拍'],
            // },
            // {
            //   title: '数据来源',
            //   label: '视频门禁',
            //   value: ['视频门禁'],
            // },
            // {
            //   title: '数据来源',
            //   label: '人物档案',
            //   value: ['人物档案'],
            // },
            // {
            //   title: '数据来源',
            //   label: '银行业务',
            //   value: ['银行业务'],
            // },
            // {
            //   title: '数据来源',
            //   label: '运营商业务',
            //   value: ['运营商业务'],
            // }
          ]
        }
      ],
      url: '',
      isShowUpload: false,
      isShowLongbox: false,
      uploadImageFile: {},
      table: {
        columns1: [
          { "prop": "faceSmallUrl", "type": "img" },
          { "label": "相似度", "prop": "similarity" },
          { "label": "性别", "prop": "faceGender" },
          { "label": "穿戴", "prop": "wear" },
          { "label": "采集时间", "prop": "probeTime" },
          { "label": "场所", "prop": "placeName" }
        ],
        columns2: [
          { "prop": "faceSmallUrl", "type": "img" },
          { "label": "相似度", "prop": "similarity" },
          { "label": "穿戴", "prop": "wear" },
          { "label": "采集时间", "prop": "probeTime" },
          { "label": "地址", "prop": "placeName" },
          { "label": "姓名", "prop": "userName" },
          { "label": "性别", "prop": "faceGender" },
          { "label": "证件号码", "prop": "cerNumber" },
          // { "label": "联系方式", "prop": "phone" },
          // { "label": "人员类型", "prop": "personType" }
        ],
        columns3: [
          { "prop": "photo", "type": "img" },
          { "label": "相似度", "prop": "similarity" },
          { "label": "姓名", "prop": "userName" },
          { "label": "性别", "prop": "faceGender" },
          { "label": "证件号码", "prop": "cerNumber" },
          { "label": "联系方式", "prop": "phone" },
        ],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 24,
          total: 0
        },
        isLoading: false
      },
      isShowClose: true,
      type: 'imageSearchDetail',
      params: { // 不使用过滤时的搜索参数
        pageNum: 1,
        pageSize: 24,
        faceImageUrl: ''
      },
      filterParams: {// 使用过滤时的搜索参数
        pageNum: 1,
        pageSize: 24,
        // faceImageUrl: '',
        startTime: '',
        endTime: '',
        dataSources: '',
        wear: '',
        faceGender: ''
      }
    }
  },
  mounted () {
    // this.getDataTypes()
  },
  methods: {
    getDataTypes () {
      getDataTypes().then((res) => {
        this.fomatData(res)
        this.dataSource[0].list = res
      })
    },
    fomatData (data) {
      if (data.length) {
        data.forEach(item => {
          item.title = this.dataSource[0].label
          item.label = item.codeName
          item.value = [item.codeName]
        });
      }
    },
    showUpload (e) {
      this.isShowUpload = e
    },
    uploadImage (item) {
      this.uploadImageFile = item
    },
    bodyClick (e) {
      let div1 = document.querySelector('.search-list')
      let div2 = document.querySelector('.img_search')
      if (!div1.contains(e.target) && !div2.contains(e.target)) {
        if(this.$refs.ImageSearch.$refs.ImageDragUpload.loading){return}
        this.$refs.ImageSearch.blur()
      }
    },
    starFilter (array) {
      if (array.length) {
        this.filterParams = {
          pageNum: 1,
          pageSize: 24,
          startTime: '',
          endTime: '',
          dataSources: '',
          wear: '',
          faceGender: ''
        }
        array.map(item => {
          if (item.title === '性别') {
            this.filterParams.faceGender = item.value
          } else if (item.title === '穿戴') {
            this.filterParams.wear = item.value
          } else if (item.title === '数据来源') {
            this.filterParams.dataSources = item.value
          } else if (item.title === '时间') {
            this.filterParams.startTime = item.startTime
            this.filterParams.endTime = item.endTime
          }
        })
      } else {
        this.filterParams = {
          pageNum: 1,
          pageSize: 24,
          startTime: '',
          endTime: '',
          dataSources: '',
          wear: '',
          faceGender: ''
        }
      }

      this.table.isLoading = true
      let formdata = new FormData()
      formdata.append('faceImageUrl', this.params.faceImageUrl)
      formdata.append('pageNum', this.filterParams.pageNum)
      formdata.append('pageSize', this.filterParams.pageSize)
      formdata.append('startTime', this.filterParams.startTime)
      formdata.append('endTime', this.filterParams.endTime)
      formdata.append('dataSources', this.filterParams.dataSources)
      formdata.append('wear', this.filterParams.wear)
      formdata.append('faceGender', this.filterParams.faceGender)
      getImageData(formdata).then(res => {
        // 防止后台返回 null
        if(!res.content){res.content = []}
        let result = res.content.every(array => {
          return array.dataSources === '视频门禁'
        })
        this.isShowLongbox = result
        this.table.tableData = res.content
        this.table.pageData.total = res.totalSize
      })
        .finally(() => {
          this.table.isLoading = false
          this.searchLoading = false
        })
    },
    getTable (temp) {
      this.url = temp
      this.table.isLoading = true
      this.params.faceImageUrl = temp
      let formdata = new FormData()
      formdata.append('faceImageUrl', temp)
      formdata.append('pageNum', this.params.pageNum)
      formdata.append('pageSize', this.params.pageSize)
      getImageData(formdata).then(res => {
        // console.log(res)
        if (!res) {
          this.table.tableData = []
          this.table.pageData.total = 0
        } else {
          res.content.forEach(item => {
            this.dataTypeList.forEach(e => {
              if (e.srcNameEn === item.dataSources) {
                item.dataSourcesCn = e.srcNameCn
              }
            })
          })
          let result = res.content.every(item => {
            return item.dataSources === '视频门禁'
          })
          this.isShowLongbox = result
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        }
      }).finally(() => {
        this.table.isLoading = false
        this.searchLoading = false
      })
    },
    generateSrcUrl (item) {
      return window.location.origin + '/' + item.img
    },
    inputNoData () {
      // this.setSearchType()
    },
    clear () {
      // this.setSearchType()
    },
    // 点击搜索
    handleSearch (temp) {
      sessionStorage.setItem('imgUrl', temp)
      this.$refs.filterComponent.clearCheckedList()
      this.url = temp
      this.params.faceImageUrl = temp
      this.getTable(temp)
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.pageData.pageNum = val

      this.table.isLoading = true
      let formdata = new FormData()
      formdata.append('faceImageUrl', this.params.faceImageUrl)
      formdata.append('pageNum', val)
      formdata.append('pageSize', this.filterParams.pageSize)
      formdata.append('startTime', this.filterParams.startTime)
      formdata.append('endTime', this.filterParams.endTime)
      formdata.append('dataSources', this.filterParams.dataSources)
      formdata.append('wear', this.filterParams.wear)
      formdata.append('faceGender', this.filterParams.faceGender)
      getImageData(formdata).then(res => {
        let result = res.content.every(item => {
          return item.dataSources === '视频门禁'
        })
        this.isShowLongbox = result
        this.table.tableData = res.content
        this.table.pageData.total = res.totalSize
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
.imageSearchDetail {
  box-sizing: border-box;
  .search-header {
    position: relative;
    // height: 190px;
    padding-left: 16px;
    background: var(--bg-color-3);
    margin-bottom: 2px;
    .imageBox {
      padding: 15px 0;
    }
  }
  .main-content {
    position: relative;
    background-color: var(--bg-color-3);
    padding: 0px 16px 12px 16px;
    margin-bottom: 24px;
    .filterBox {
      height: 32px;
      line-height: 32px;
      .filter {
        display: flex;
        .right-part {
          flex: 1;
        }
      }
      .filterComponent {
        margin-top: 10px;
      }
      ::v-deep .filterComponent {
        // height: 50px;
        // margin-bottom: 5px;
      }
    }
    // .pagination {
    //   padding-left: 16px;
    // }
  }
  ::v-deep .search-component {
    padding-top: 16px;
    .el-input {
      width: 33vw;
      .el-input__suffix {
        display: flex;
        align-items: center;
        .el-icon-circle-close:before {
          content: '×';
          transform: scale(1.5);
          display: inline-block;
          position: absolute;
          top: -1px;
          left: -8px;
          color: rgba(152, 167, 185, 0.5);
        }
      }
      .el-input__inner {
        height: 40px;
        width: 100%;
        line-height: 40px;
        padding-left: 16px;
        border-radius: 0;
        font-size: 16px;
        color: var(--base-text-color-1);
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 2px;
        &:focus {
          border: 1px solid #177ddc !important;
          border-bottom: 1px solid transparent !important;
        }
      }
    }
    .search-container {
      position: relative;
      display: flex;
      justify-content: flex-start;
      .btn-box {
        margin-left: 16px;
        z-index: 12;
        overflow: hidden;
        .searchBtn {
          border-radius: 2px !important;
          width: 96px;
          height: 40px;
          font-size: 16px;
          text-align: center;
        }
      }
      .search-list {
        position: absolute;
        top: 39px;
        left: 0;
        z-index: 88;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        // background-color: #232a42;
        border: 1px solid var(--active-color);
        border-top: 0;
        opacity: 0.95;
        // width: 638px;
      }
    }
  }
}
.el-image {
  background-color: var(--bg-color-1) !important;
}
/deep/.pagination{
  margin-top: 120px !important;
  // height: 100px !important;
}
</style>
