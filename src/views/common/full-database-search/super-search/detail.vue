<template>
  <div ref="superSearchDetail" class="superSearchDetail">
    <div class="search-header">
      <Search
        class="search-component"
        :searchKey.sync="params.searchKey"
        :btnLoading="table.searchLoading"
        @handleSearch="handleSearch"
      ></Search>
      <div class="filterBox">
        <div class="filter">
          <newFilter
            :type="type"
            class="newFilter"
            ref="newFilter"
            v-if="showNewFilter"
            :radio="false"
            categoryName="过滤项"
            @startFilter="startFilter"
            :categoryList="categoryList"
            :cusStyle="{ top: '110px' }"
            key="1"
          >
          </newFilter>
          <div class="right-part"></div>
        </div>
      </div>
    </div>

    <main
      ref="mainContent"
      class="main-content"
      v-loading="table.searchLoading"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="main_info">
        <div class="search-list" v-if="table.data.length">
          <!-- 搜索出来的每一项 -->
          <div class="search-item" v-for="(item, index) in table.data" :key="index">
            <div class="search-title">
              <span @click="clickTitle(item)" v-html="item.title"></span>
            </div>
            <div class="search-content">
              <div>
                <ElImage
                  class="search-image"
                  v-if="
                    item.img.indexOf('person') !== -1 ||
                    item.doc_type === 'doc_normal_person_archives_type' ||
                    item.doc_type.indexOf('person') !== -1
                  "
                  :imgSet="{
                    src: generateSrcUrl(item),
                    height: 80,
                    width: 63,
                    fit: 'cover',
                    errorSrc: errImgPerson
                  }"
                ></ElImage>
                <ElImage
                  class="search-image"
                  v-else
                  :imgSet="{
                    src: generateSrcUrl(item),
                    height: 80,
                    width: 142,
                    fit: 'cover',
                    errorSrc: errImgCar
                  }"
                ></ElImage>
              </div>
              <div>
                <div class="describe-item ml15">
                  <span v-for="(item2, index2) in item.summary" :key="index2" v-html="item2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 搜索出来没有数据时 -->
        <div class="no-data-class" v-else>
          <div v-if="table.data.length === 0 && !table.searchLoading">
            <div v-if="showNoData">
              <div>
                提示：抱歉没有找到与"<span style="color: #d4b021">{{ params.searchKey }}</span
                >"相关的内容
              </div>
              <div class="warm-tips">温馨提示：</div>
              <div>1.请检查您的输入是否正确</div>
              <div>2.请检查您的选择的数据类型是否正确</div>
            </div>
          </div>
        </div>
        <!-- 相关搜索 -->
        <!-- <div class="relation-search" v-if="table.relationData.length >= 0">
          <div class="relation-item-box">
            <div class="title" :style="{ opacity: showNoData ? 1 : 0 }">推荐搜索：</div>
            <div class="right-item">
              <div
                class="relation-item"
                @click="relationClick(item)"
                v-for="(item, index) in table.relationData"
                :key="index"
              >
                <Ellipsis :wordsLength="46" :value="item.title || '--'" />
              </div>
            </div>
          </div>
        </div> -->
        <!-- 展示分页 -->
        <div class="pagination">
          <div class="totals" :style="{ opacity: showNoData ? 1 : 0 }">
            总数：{{ table.pageData.total || 0 }}
          </div>
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
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import Search from './components/Search'
import ElImage from '@/components/BasicComponents/ElImage'
import newFilter from '@/components/BasicComponents/FilterItem'
// import Ellipsis from '@/components/BasicComponents/Ellipsis'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { auxiliaryFullTextSearch, getPersonByCertificate, getCorrelation, getDocTypes, getAttrTypeEnum, getDynamicCataloging,fullTextSearch } from '@/api/superSearch'

const docType = [
  {
    label: '数据来源',
    prop: 'docType',
    list: []
  }
]
const attrType = [
  {
    label: '类型选择',
    prop: 'attrType',
    list: []
  }
]
export default {
  name: 'superSearchDetail',
  components: {
    ElImage,
    Search,
    // Ellipsis,
    newFilter
  },
  created () {
    if (this.$route.query.searchKey) {
      this.params.searchKey = this.$route.query.searchKey
    }
    // let a = gps.bd_84(121.551987,36.927209)
    // console.log(a);
  },
  mounted () {
    // 获取只能查询的类型数据
    this.getAllType()
  },
  data () {
    return {
      type: 'superSearchDetail',
      docType: docType,
      attrType: attrType,
      categoryList: [],
      allTypeList: [], // 数据类型
      allDocTypeList: [], // 数据类型
      searchParams: {  //点击搜索之后备份的搜索参数，解决更改了参数，再点击页码，搜索的问题
        pageSize: 10,
      },
      params: { // 搜索参数
        pageNum: 1,
        pageSize: 15,
        docType: '',
        searchKey: '',
        attrType: '',
      },
      table: {  // 搜索结果
        searchLoading: false,
        data: [],
        relationData: [],
        pageData: {
          curPage: 1,
          pageSize: 15,
          total: 0
        }
      },
      showNewFilter: true,
      firstTimeDocType: '',
      firstTimeAttrType: '',
      showNoData: false,
      firstTableData: [],
      // fuzzySearch:'true'
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme',
      fuzzySearch:'fuzzySearch'
    }),
    errImgPerson () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    },
    errImgCar () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--car-default-pic-name']
    }
  },
  methods: {
    // 过滤器方法
    startFilter (item) {
      // console.log(item);
      let docTypeObject = item.filter(_c => {
        return _c.title === '数据来源'
      })
      let attrTypeObject = item.filter(_c => {
        return _c.title === '类型选择'
      })
      this.params.docType = docTypeObject.length ? docTypeObject[0].value : this.firstTimeDocType
      this.params.attrType = attrTypeObject.length ? attrTypeObject[0].value : this.firstTimeAttrType
      this.params.pageNum = 1
      this.table.pageData.curPage = 1
      // this.table.data = []
      this.searchList(this.params)
      // setTimeout(() => {
      //   this.searchRealation(this.params)
      // }, 500)

    },
    generateSrcUrl (item) {
      return window.location.origin + '/' + item.img
    },
    // 相关搜索的点击
    relationClick (data) {
      try {
        this.params.searchKey = data.attr_value
        let attrType = this.getActiveArr([data.attr_type], this.allTypeList, 'CName', 'EName', true)
        this.attrType = [
          {
            label: '类型选择',
            prop: 'attrType',
            canChangeWay: true,
            isRadio: false,
            list: attrType
          }
        ]
        this.$set(this.categoryList, 1, this.attrType[0])
        let docType = this.getActiveArr([data.doc_type], this.allDocTypeList, 'CName', 'EName', true)
        this.docType = [
          {
            label: '数据来源',
            prop: 'docType',
            canChangeWay: true,
            isRadio: false,
            list: docType
          }
        ]
        this.$set(this.categoryList, 0, this.docType[0])
        this.$refs.newFilter.labelList = this.categoryList
        this.$nextTick(() => {
          this.$refs.newFilter.startFilter()
        })
      } catch (err) {
        console.log(err);
        console.log('当前数据的数据类型超过当前数据分类已有类型,无法自动识别分类');
        this.categoryList = []
        this.searchList({ ...this.params })

      }
    },
    getParmeter (variable, url) {
      let query = url.split('?')[1];
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return '';
    },
    // 标题点击事件跳转
    clickTitle (item) {
      console.log(item);
      if (item.url.indexOf('humanArchives') !== -1 && item.url.indexOf('carFile') === -1) {
        // 处理人物档案的跳转
        let cerNumber = this.getParmeter('cer_number', item.url)
        if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
          this.$messageTip.error('暂无人物详情权限！')
          return false
        }
        // 处理跳转到人物档案
        getPersonByCertificate({ cerNumber, cerType: item.attr_type }).then((res) => {
          if (!res) {
            this.$message.error('未找到该档案')
            return
          }
          window.open(window.location.origin + '/ol/PersonFileDetail?cerNumber=' + cerNumber + '&cerType=' + item.attr_type + '&label=人物档案')
        })
        // window.open(window.location.origin + '/ol/PersonFileDetail?cerNumber=' + cerNumber + '&label=人物档案')
        // getPersonInfoByCer({ cerType, cerNumber }).then((res) => {
        //   if (!res || !res.personType) {
        //     this.$message.error('未找到该档案')
        //     return
        //   }
        //   let keyPersonArr = ['personDetainee', 'personDrugster', 'personSuspect', 'personTemporary']
        //   if (keyPersonArr.includes(res.personType)) {
        //     if (!this.$store.state.Common.permissionsArray.includes('important_human:human_detail')) {
        //       this.$messageTip.error('暂无权限！')
        //       return false
        //     }
        //     // 跳转自定义档案
        //     window.open(window.location.origin + '/ol/FileDetail?id=' + res.id + '&label=重点人档案')
        //   } else if (res.personType.indexOf('personNormal') !== -1) {
        //     if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
        //       this.$messageTip.error('暂无权限！')
        //       return false
        //     }
        //     window.open(window.location.origin + '/ol/FileDetail?id=' + res.id + '&label=人物档案')
        //   } else {
        //     if (!this.$store.state.Common.permissionsArray.includes('custom_human:human_detail')) {
        //       this.$messageTip.error('暂无权限！')
        //       return false
        //     }
        //     window.open(window.location.origin + '/ol/personCustomDetail?id=' + res.id + '&label=自定义档案')
        //   }
        // })
      } else if (item.url.indexOf('humanArchives') !== -1 && item.url.indexOf('carFile') !== -1) {
        // 跳转车辆档案
        let url = this.getParmeter('type', item.url)
        // console.log(url);
        window.open(window.location.origin + '/' + 'ol/' + url + '?carNumber=' + item.attr_value)
      } else if (item.url.indexOf('getOneNodeListMap') !== -1) {
        // 处理跳转到关系推演,另开窗口打开
        window.open(window.location.origin + '/' + 'ol/deduction?attrType=' + item.attr_type + '&attrValue=' + item.attr_value)
      } else if (item.url.indexOf('datacenter') !== -1) {
        let url = item.url.split('=')[1]
        //处理跳转到数据中心,另开窗口打开,数据中心要跳转的太多了，而且每个条件都能查询,需要分多种情况
        let searchKey = item.attr_type.split('_')[1]
        let routeUrl = this.$router.resolve({
          name: url,
          query: {
            [searchKey]: item.attr_value,
            pathName: url
          }
        })
        sessionStorage.setItem('pathName', url)
        window.open(routeUrl.href)
        // window.open(window.location.origin + '/' + 'ol/' + url + '?' + searchKey + '=' + item.attr_value + '&' + 'pathName=' + url)
      } else if (item.url.indexOf('devicemap') !== -1) {
        //处理跳转到设备地图,另开窗口打开
        let url = item.url.split('=')[1]
        window.open(window.location.origin + '/' + 'ol/' + url + '?device=' + item.attr_value)
      }
    },
    // 获取全部的数据类型，
    getAllType () {
      this.changeLoading(true)
      // ---------------------------整合数据来源的数组-------------------
      getAttrTypeEnum().then((res) => {
        this.allTypeList = res
      })

      // ---------------------------合类型选择的数组--------------------------
      getDocTypes().then((res) => {
        this.allDocTypeList = res
        // this.setSearchType()
        setTimeout(() => {
          this.showNoData = true
          this.handleSearch()
        }, 200)
      })
    },
    // 前端高亮关键字
    highLight (text, highLightStr) {
      for (let i = 0; i < highLightStr.length; i++) {
        var pattern = new RegExp(highLightStr[i], 'ig');
        let temparr = pattern.exec(text)
        console.log(temparr);
      }
    },
    // loading显示状态
    changeLoading (boolean) {
      this.table.searchLoading = boolean
    },
    // 获取当前可选种类的数据，拼接成 ， 号拼接的参数
    getAllparams (Arr, value) {
      let tempStr = Arr.reduce((prev, item) => {
        return prev + ',' + item[value]
      }, '')
      tempStr = tempStr.slice(1)
      return tempStr
    },
    // 点击搜索的搜索事件，包括内容搜索和相关内容的搜索
    handleSearch () {
      if (!this.params.searchKey) {
        this.$message.info('请输入搜索条件')
      } else {
        this.table.pageData.curPage = 1
        this.changeLoading(true)
        this.$refs.newFilter.checkedList = []
        this.params.docType = ''
        this.params.attrType = ''
        this.params.pageNum = 1
        this.oldSearchKey = this.params.searchKey
        this.searchList(this.params)
        setTimeout(() => {
          getDynamicCataloging(this.params).then((res) => {
            // format过滤数组中没有的筛选项
            if (res) {
              this.formatRes(res)
              this.setSearchType(res)
            }
          })
          // this.searchRealation(this.params)
        }, 700)
      }
    },
    formatRes (data) {
      data.attrType = data.attrType.filter((item) => {
        return this.allTypeList.find((ele) => { return ele.EName === item })
      })
      data.docType = data.docType.filter((item) => {
        return this.allDocTypeList.find((ele) => { return ele.EName === item })
      })
    },
    // 将返回结果有哪些类型，再动态的显示回过滤器上
    setSearchType (res) {
      let attrType = this.getActiveArr(res.attrType, this.allTypeList, 'CName', 'EName', false)
      this.attrType = [
        {
          label: '类型选择',
          prop: 'attrType',
          canChangeWay: true,
          isRadio: false,
          list: attrType
        }
      ]
      this.$set(this.categoryList, 1, this.attrType[0])
      let docType = this.getActiveArr(res.docType, this.allDocTypeList, 'CName', 'EName', false)
      this.docType = [
        {
          label: '数据来源',
          prop: 'docType',
          canChangeWay: true,
          isRadio: false,
          list: docType
        }
      ]
      this.$set(this.categoryList, 0, this.docType[0])
      // 静默刷新解决vue检测不到的问题
      this.showNewFilter = false
      this.$nextTick(() => {
        this.showNewFilter = true
      })
      // console.log(this.categoryList);
    },
    // 内容搜索
    searchList (params,firstPageNotSearch) {
      this.changeLoading(true)
      this.table.data = []
      // console.log(params);
      if(this.fuzzySearch === 'true'){
        if (firstPageNotSearch && this.firstTableData.length && params.pageNum === 1) {
          setTimeout(() => {
            this.table.data = [...this.firstTableData]
            this.changeLoading(false)
          }, 500)
          return
        }
      }
      if (this.diffCondition(params)) {
        auxiliaryFullTextSearch(params).then(res => {
          if (res) {
            this.table.data = [...res.content]
            this.table.pageData.total = res.totalSize
            this.changeLoading(false)
          }else{
            this.table.pageData.total = 0
          }
        }).finally(()=>{
          this.changeLoading(false)
        })
      }else{
        if(this.fuzzySearch !== 'true'){
          this.$message.info('请输入搜索内容')
        }
      }
      if(this.fuzzySearch === 'true'){
        fullTextSearch(params)
          .then(res => {
            if (res) {
              if (params.pageNum === 1) {
                let tempArr = this.getExclude(this.table.data, res.content)
                this.table.data = [...this.table.data, ...tempArr]
                this.firstTableData = JSON.parse(JSON.stringify(this.table.data))
              } else {
                this.table.data = [...res.content]
              }
              this.table.pageData.total = res.totalSize
              this.changeLoading(false)
              document.getElementById('sys_container').scrollTop = 0

              if (res.pageNum > res.totalPages) {
                params.pageNum = res.totalPages
                this.searchList(params)
              }
            } else {
              this.table.data = []
              this.changeLoading(false)
              this.table.pageData.total = 0
            }
          }).catch((err) => {
            console.log(err);
          })
          .finally(() => {
          })
      }
    },
    diffCondition (params){
      return this.fuzzySearch === 'true' ? (params.pageNum === 1 && params.searchKey) : params.searchKey
    },
    getExclude (arr1, arr2) {
      let temp = arr2.filter(item => !arr1.some(ele => ele.id === item.id))
      return temp
    },
    // 拼凑成数组
    getActiveArr (data, allTypeList, label, value, boolean) {
      return data.map((item) => {
        if (item) {
          let arr = allTypeList.filter((item2) => {
            return item2[value] === item
          })
          return {
            isActive: boolean,
            label: arr[0][label],
            value: arr[0][value]
          }
        }

      })
    },
    // 相关内容的搜索
    searchRealation (params) {
      this.table.relationData = []
      getCorrelation(params).then((res) => {
        if (res) {
          this.table.relationData = [...res.content]
        } else {
          this.table.relationData = []
        }
      })
    },
    // 页码改变事件，使用参数为 点击搜索后的参数副本
    handleCurrentChange (pageIndex) {
      this.params.pageNum = pageIndex
      if (!this.params.searchKey) {
        this.$message.error('请输入搜索条件')
        return
      }
      if (this.oldSearchKey === this.params.searchKey) {
        this.searchList(this.params, 'firstPageNotSearch')
      } else {
        this.searchList(this.params)
      }

    },
  }

}
</script>

<style lang="less" scoped>
.superSearchDetail {
  box-sizing: border-box;
  height: calc(100% - 24px);
  .search-header {
    position: relative;
    height: 111px;
    padding-left: 16px;
    background: var(--bg-color-3);
    margin-bottom: 2px;
    .filterBox {
      height: 52px;
      line-height: 32px;
      .filter {
        display: flex;
        .right-part {
          flex: 1;
        }
      }
      .newFilter {
        margin-top: 10px;
      }
      ::v-deep .newFilter {
        height: 40px;
        // margin-bottom: 5px;
      }
    }
  }
  .main-content {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: var(--bg-color-3);
    padding-bottom: 12px;
    padding-right: 16px;
    min-height: calc(100% - 111px);
    box-sizing: border-box;
    .main_info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .search-list {
      flex: 1;
      .search-item {
        padding: 24px 0px 0px 24px;
        &:first-child {
          padding-top: 16px;
        }
        .search-title {
          font-size: 16px;
          max-width: 700px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // color: #fff;
          color: var(--C0D0E7-to-blue-color);
          span {
            display: inline-block;
            cursor: pointer;
            border-bottom: 1px solid var(--active-color);
            &:hover {
              // color: cornflowerblue;
              // color: var(--active-color);
              color: var(--supersearch-active-color);
            }
          }
        }
        .search-content {
          padding-top: 12px;
          display: flex;
          justify-content: flex-start;
          ::v-deep .el-image {
            min-width: auto !important;
          }
          .describe-item {
            font-size: 16px;
            // color: var(--base-text-color-to-999999);
            color: var(--base-text-color-to-333333);
            display: flex;
            line-height: 26px;
            flex-direction: column;
            span {
              // height: 21px;
              // line-height: 21px;
              margin-bottom: 8px;
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
          .ml15 {
            margin-left: 15px;
          }
        }
      }
    }

    .no-data-class {
      padding: 15px 16px 15px 16px;
      height: calc(100vh - 385px);
      box-sizing: border-box;
      font-size: 16px;
      div {
        margin: 10px 0;
      }
      .warm-tips {
        margin-top: 25px;
      }
    }
    @media screen and (min-width: 1024px) and (max-width: 1365px){
      .no-data-class {
        height: calc(100vh - 300px);
      }
    }
    .relation-search {
      margin-top: 22px;
      padding-left: 16px;
      .relation-item-box {
        display: flex;
        justify-content: space-between;
        .title {
          width: 125px;
          font-size: 16px;
          margin-right: 44px;
          margin-top: 16px;
        }
        .right-item {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          .relation-item {
            cursor: pointer;
            box-sizing: border-box;
            font-size: 14px;
            // width: 369px;
            width: 24%;
            height: 32px;
            line-height: 32px;
            padding: 0 16px;
            margin-right: 12px;
            // margin-right: 16px;
            margin-top: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: var(--supersearch-tuijian-bg);
            &:hover {
              ::v-deep .defaultValue {
                color: var(--active-color);
              }
            }
            &:last-child {
              margin-right: 0;
            }
          }
          @media (min-width: 967px) and (max-width: 1270px) {
            .relation-item {
              width: 48%;
            }
          }
          @media (min-width: 1270px) and (max-width: 1567px) {
            .relation-item {
              width: 32%;
            }
          }
          @media (min-width: 1567px) {
            .relation-item {
              width: 24%;
            }
          }
        }
      }
    }
    .pagination {
      padding-left: 16px;
    }
  }
  ::v-deep .search-component {
    padding-top: 16px;
    .el-input {
      width: 640px;
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
        width: 640px;
        line-height: 40px;
        padding-left: 16px;
        font-size: 16px;
        color: var(--base-text-color-1);
        // background-color: var(--bg-color-3) !important;
        border: 1px solid var(--border-color-input) !important;
        border-radius: 0;
        &:hover {
          border: 1px solid #3d4c75 !important;
        }
        &:focus {
          border: 1px solid var(--active-color) !important;
          // background: rgba(35, 42, 66, 0.95) !important;
          background: var(--supersearch-search-focus-bg) !important;
          // background: #232A42 !important;
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
        z-index: 888888;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        // background-color: rgba(35, 42, 66, 0.95);
        background-color: var(--supersearch-search-focus-bg);
        border: 1px solid var(--active-color);
        border-top: 0;
        width: 638px;
        ul {
          // z-index: 99999999999999;
          li {
            height: 36px;
            line-height: 36px;
            padding: 0 16px;
          }
          .tip {
            font-size: 14px;
            color: var(--base-text-color-to-999999);
            div {
              border-top: 1px solid rgba(255, 255, 255, 0.06);
            }
          }
          .search-item {
            cursor: pointer;
            font-size: 16px;
            color: var(--base-text-color-1);
            &:hover {
              background-color: var(--search-input-hover-bg);
            }
          }
        }
      }
    }
  }
}
</style>
