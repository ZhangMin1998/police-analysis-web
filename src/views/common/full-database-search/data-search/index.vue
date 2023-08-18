<template>
  <div class="data_search">
    <div class="search-header">
      <Search
        class="search-component"
        :class="{ can_not_search: !typelist.length }"
        placeholderText="请输入身份证号码"
        :searchKey.sync="params.searchKey"
        :btnLoading="table.searchLoading"
        @handleSearch="handleSearch"
      ></Search>
    </div>
    <div class="main-content">
      <div class="left_pannel">
        <div class="tag_list_box" v-if="typelist.length">
          <ul>
            <li v-for="(item, index) in typelist" :key="index">
              <div
                class="label_name"
                :class="{ inactive: item.number === 0, active: activeIndex === index }"
                @click="changeType(item, index)"
              >
                <span>
                  {{ item.label }}
                </span>
                <span class="number"> ({{ item.number }}) </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="no_permission" v-else>暂无权限</div>
      </div>
      <div
        v-loading="isLoading"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
        class="right_search_result"
      >
        <div class="content_list" v-if="typelist.length">
          <!-- 搜索出来有数据 -->
          <div class="conetnt_with_pagination" v-if="table.pageDataList.length">
            <div class="search_item_box">
              <!-- 搜索出来的每一项 -->
              <div class="search-item" v-for="(item, index) in table.pageDataList" :key="index">
                <div class="search-title">
                  <span @click="clickTitle(item)" v-html="item.title"></span>
                </div>
                <div class="search-content">
                  <div class="search_image">
                    <ElImage
                      class="search-image"
                      :imgSet="{
                        src: generateSrcUrl(item),
                        height: 80,
                        width: 63,
                        fit: 'cover',
                        errorSrc: errImg()
                      }"
                    ></ElImage>
                  </div>
                  <div>
                    <div class="describe-item" :class="{ ml15: item.img }">
                      <div class="describe_content" v-html="item.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 展示分页 -->
            <div class="pagination">
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
            </div>
          </div>
          <div v-if="!table.pageDataList.length && !isLoading" class="no_permission_right">
            <div class="no_permission_box">
              <img src="@/assets/img/no-data.png" alt="" />
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="no_permission_right" v-else>
          <div></div>
          <div class="no_permission_box">
            <img src="@/assets/img/no-permission.png" alt="" />
            <div>暂无权限</div>
          </div>
        </div>

        <!-- <div class="export_btn">
          <span class="blank_button" @click="exportEvent">导出</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/views/common/full-database-search/super-search/components/Search'
import ElImage from '@/components/BasicComponents/ElImage'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import {
  dataSearchList,
  dataSearchCount,
  dataSearchAuxiliaryList,
  dataSearchAuxiliaryCount,
  getPersonByCertificate
} from '@/api/superSearch'
// import jiashuju from './data.js'
export default {
  name: 'DataSearch',
  components: {
    Search,
    ElImage
  },
  data () {
    return {
      params: {
        // 搜索参数
        tableName: '',
        searchKey: ''
      },
      oldSearchKey: '',
      table: {
        // 搜索结果
        searchLoading: false,
        AllDataList: [],
        pageDataList: [],
        pageData: {
          curPage: 1,
          pageSize: 15,
          total: 0
        }
      },
      activeIndex: 0,
      isLoading: false,
      typelist: [],
      subTypelist: []
    }
  },

  computed: {
    ...mapState('User', {
      theme: 'theme',
    }),
    ...mapState('Common', {
      dataCenterAllList: 'dataCenterAllList',
      RouterList: 'RouterList'
    })
  },
  created () {
    this.typelist = JSON.parse(JSON.stringify(this.dataCenterAllList))
    this.typelist.unshift({
      label: "全部",
      value: "all"
    })
    this.typelist.forEach(item => {
      item.number = 0
    })
    this.subTypelist = JSON.parse(JSON.stringify(this.typelist))
    this.getSearchType()
  },
  methods: {
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    },
    getSearchType () {
      // 实现浏览器缓存搜索的类型
      let searchType = window.localStorage.getItem('searchType_data_search')
      if (!this.typelist.length) {
        return
      }
      if (searchType) {
        // console.log(searchType);
        let activeIndex = this.typelist.findIndex(item => {
          return item.label === searchType
        })
        if (activeIndex !== -1) {
          this.activeIndex = activeIndex
          this.params.tableName = this.typelist[activeIndex].value
        } else {
          this.params.tableName = this.typelist[0].value
        }
      } else {
        this.params.tableName = this.typelist[0].value
      }
    },
    handleSearch (not_search_count,keepNumber) {
      if (!this.typelist.length) {
        return
      }
      if (!this.params.searchKey) {
        // 没有输入条件时不进行搜索，展示所有都为空
        this.typelist = JSON.parse(JSON.stringify(this.subTypelist))
        this.table.pageDataList = []
        return
      }
      // 这里要取消执行所有count接口的请求，否则快速切换的时候会导致左侧数字闪动问题
      try {
        if (window.cancelCount.length) {
          window.cancelCount.forEach((item) => {
            item()
          })
          window.cancelCount = []
        }
      }
      catch (err) {
        console.log(err);
      }
      if(!keepNumber){
        this.resetNumber()
      }
      this.cancelDataSearch()
      this.oldSearchKey = JSON.parse(JSON.stringify(this.params.searchKey))
      this.isLoading = true
      this.table.pageData.curPage = 1
      this.table.pageDataList = []
      // 先调用查询各数据数量的接口
      if (!not_search_count) {
        this.searchCountList()
      }
      if (this.params.tableName === 'all') {
        // 当搜索条件为全部时，搜索所有的数据类型
        this.handleSearchALLTypeData()
      } else {
        // 搜索条件为其他数据时，仅搜索该数据
        this.searchDataList()
      }
    },
    resetNumber (){
      this.typelist.forEach((item)=>{
        item.number = 0
      })
    },
    cancelDataSearch () {
      try {
        if (window.cancelDataEvent.length) {
          window.cancelDataEvent.forEach((item) => {
            item()
          })
          window.cancelDataEvent = []
        }
      }
      catch (err) {
        console.log(err);
      }
    },
    searchDataList () {
      dataSearchList(this.params).then(res => {
        // console.log(res);
        if (res.code === 1) {
          // code为1正常返回情况
          this.isLoading = false
          if (res.records.length === 0) {
            this.table.pageDataList = []
            return
          }
          this.formatData(res.records)
          this.table.AllDataList = [...res.records]
          // 前端分页
          this.table.pageDataList = this.table.AllDataList.slice(
            (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
            this.table.pageData.curPage * this.table.pageData.pageSize
          )
          this.table.pageData.total = res.total

          document.getElementById('sys_container').scrollTop = 0
        } else if (res.code === 0) {
          // code为0为有多个身份证的情况
          Promise.all(this.requestPromiseAll(res.field, dataSearchAuxiliaryList)).then(res => {
            this.isLoading = false
            let tempdata = res.reduce(
              (obj, cur) => {
                obj.total += cur.total
                obj.list.push(...cur.records)
                return obj
              },
              { total: 0, list: [] }
            )

            if (tempdata.list.length === 0) {
              this.table.pageDataList = []
              return
            }
            this.formatData(tempdata.list)
            this.table.pageData.total = tempdata.total
            this.table.AllDataList = tempdata.list
            this.table.pageDataList = this.table.AllDataList.slice(
              (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
              this.table.pageData.curPage * this.table.pageData.pageSize
            )
            document.getElementById('sys_container').scrollTop = 0
          })
        }
      })
    },
    searchCountList () {
      this.typelist[0].number = 0
      this.typelist.forEach((item, index) => {
        if (item.value !== 'all') {
          dataSearchCount({ searchKey: this.params.searchKey, tableName: item.value }).then(res => {
            if (res.code === 1) {
              // code为1正常返回情况
              item.number = res.total
              this.typelist[0].number += res.total
              this.$set(this.typelist, index, item)
            } else if (res.code === 0) {
              // code为0为有多个身份证的情况
              Promise.all(this.requestPromiseAll(res.field, dataSearchAuxiliaryCount)).then(res => {
                item.number = res.reduce((pre, cur) => {
                  pre += cur.total
                  return pre
                }, 0)
                this.typelist[0].number += item.number
                this.$set(this.typelist, index, item)
              })
            }
          })
        }
      })
    },
    handleSearchALLTypeData () {
      this.table.AllDataList = []
      // this.typelist[0].number = 0
      this.typelist.forEach((item) => {
        if (item.value !== 'all') {
          dataSearchList({ searchKey: this.params.searchKey, tableName: item.value }).then(res => {
            if (res.code === 1) {
              setTimeout(() => { this.isLoading = false }, 1800)
              if (res.records.length === 0) {
                return
              }
              this.formatData(res.records)
              this.table.AllDataList.push(...res.records)
              this.typelist[0].number = this.table.AllDataList.length
              // 前端分页
              this.table.pageData.total = this.table.AllDataList.length
              let { curPage, pageSize } = this.table.pageData
              this.table.pageDataList = this.table.AllDataList.slice((curPage - 1) * pageSize, curPage * pageSize)
            } else if (res.code === 0) {
              // code为0为有多个身份证的情况
              Promise.all(this.requestPromiseAll(res.field, dataSearchAuxiliaryList)).then(res => {
                setTimeout(() => { this.isLoading = false }, 1800)
                let tempdata = res.reduce(
                  (obj, cur) => {
                    obj.total += cur.total
                    obj.list.push(...cur.records)
                    return obj
                  },
                  { total: 0, list: [] }
                )
                if (tempdata.list.length === 0) {
                  return
                }
                this.formatData(tempdata.list)
                this.table.AllDataList.push(...tempdata.list)
                this.typelist[0].number = this.table.AllDataList.length
                // 前端分页
                this.table.pageData.total = this.table.AllDataList.length
                let { curPage, pageSize } = this.table.pageData
                this.table.pageDataList = this.table.AllDataList.slice(
                  (curPage - 1) * pageSize,
                  curPage * pageSize
                )
                document.getElementById('sys_container').scrollTop = 0
              })
            }
          })
        }
      })
    },
    formatData (data) {
      data.forEach(item => {
        item.content = item.content
          .split(this.params.searchKey)
          .join("<span style='color:#e81a6f'>" + this.params.searchKey + '</span>')
        let reg = /href=/g
        item.content = item.content.replace(reg, 'href=' + window.location.origin + '/')
        item.title = item.title
          .split(this.params.searchKey)
          .join("<span style='color:#e81a6f'>" + this.params.searchKey + '</span>')
      })
    },
    requestPromiseAll (array, requestUrl) {
      const promise = array.map(v => {
        return new Promise((resolve, reject) => {
          requestUrl(v)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      })
      return promise
    },
    changeType (item, index) {
      this.activeIndex = index
      this.params.tableName = item.value
      // this.table.pageData.curPage = 1
      window.localStorage.setItem('searchType_data_search', item.label)
      if (item.value === 'all') {
        this.isLoading = true
        this.cancelDataSearch()
        this.handleSearchALLTypeData()
      } else {
        this.oldSearchKey === this.params.searchKey
          ? this.handleSearch('not_search_count',true)
          : this.handleSearch('',true)
      }
    },
    generateSrcUrl (item) {
      return window.location.origin + '/' + item.avatar
    },
    clickTitle (item) {
      if (item.dataType === 'attr_identity_card_type') {
        // 跳转人物档案
        if (!this.$store.state.Common.permissionsArray.includes('normal_human:human_detail')) {
          this.$messageTip.error('暂无人物详情权限！')
          return false
        }
        getPersonByCertificate({ cerNumber: item.cerNumber }).then((res) => {
          if (!res) {
            this.$message.error('未找到该档案')
            return
          }
          window.open(window.location.origin + '/ol/PersonFileDetail?cerNumber=' + item.cerNumber + '&cerType=' + '&label=人物档案')
        })
      } else if (item.dataType === 'attr_car_license_type') {
        let value = item.title.split('>')[1].split('<')[0]
        // 跳转车辆档案
        window.open(window.location.origin + '/' + 'ol/carFile' + '?carNumber=' + value)
      } else {
        // 其他的不进行跳转且不提示的
        return
      }



    },
    handleCurrentChange (pageIndex) {
      if (this.oldSearchKey === this.params.searchKey) {
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
          this.table.pageDataList = this.table.AllDataList.slice(
            (pageIndex - 1) * this.table.pageData.pageSize,
            pageIndex * this.table.pageData.pageSize
          )
          document.getElementById('sys_container').scrollTop = 0
        }, 500)
      } else {
        // 不同条件的话，直接页码就是1
        // this.table.pageData.curPage = 1
        this.handleSearch('',true)
      }
    },
    exportEvent () {
      console.log('daochu')
    }
  }
}
</script>

<style lang="less" scoped>
.data_search {
  box-sizing: border-box;
  height: calc(100% - 24px);
  .loading_dom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background-color: red;
    z-index: 1000;
  }
  .search-header {
    position: relative;
    height: 72px;
    padding-left: 16px;
    background: var(--bg-color-3);
    margin-bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-content {
    display: flex;
    justify-content: flex-start;
    position: relative;
    box-sizing: border-box;
    .left_pannel {
      width: 440px;
      min-height: calc(100vh - 190px);
      background-color: var(--bg-color-3);
      margin-right: 1px;
      padding: 24px;
      box-sizing: border-box;
      .tag_list_box {
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            flex: 50%;
            margin-bottom: 16px;
            .label_name {
              color: var(--base-text-color-5);
              display: inline-block;
              height: 28px;
              border-bottom: 2px solid transparent;
              padding-right: 10px;
              cursor: pointer;
              &.inactive {
                color: var(--data-search-inactive);
              }
              &.active {
                color: var(--active-color);
                border-bottom: 2px solid var(--active-color);
              }
            }
            .number {
              margin-left: 8px;
            }
          }
        }
      }
      .no_permission {
        box-sizing: border-box;
        height: 100%;
        text-align: center;
        padding-top: 280px;
      }
    }
    .right_search_result {
      position: relative;
      flex: 1;
      min-height: calc(100vh - 190px);
      background-color: var(--bg-color-3);
      box-sizing: border-box;
      padding: 24px 24px 24px 31px;
      .content_list {
        // margin-top: 36px;
        padding-top: 36px;
        height: 100%;
        box-sizing: border-box;
        .conetnt_with_pagination {
          display: flex;
          flex-direction: column;
          height: 100%;
          .search_item_box {
            flex: 1;
          }
        }
        .search-item {
          padding: 24px 0px 0px 0px;
          &:first-child {
            padding-top: 16px;
          }
          .search-title {
            font-size: 16px;
            max-width: 700px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--C0D0E7-to-blue-color);
            span {
              display: inline-block;
              cursor: pointer;
              border-bottom: 1px solid var(--active-color);
              &:hover {
                // color: var(--active-color);
                color: var(--supersearch-active-color);
              }
            }
          }
          .search-content {
            padding-top: 12px;
            display: flex;
            justify-content: flex-start;
            .search_image {
              margin-right: 8px;
            }
            // ::v-deep .el-image {
            //   min-width: auto !important;
            // }
            .describe-item {
              font-size: 16px;
              // color: var(--base-text-color-to-999999);
              color: var(--base-text-color-to-333333);
              display: flex;
              flex-direction: column;
              .describe_content {
                // height: 21px;
                word-break: break-all; /* 文本行的任意字内断开 */
                line-height: 26px;
                margin-bottom: 8px;
                &:last-child {
                  margin-bottom: 0;
                }
                a {
                  color: green !important;
                  background-color: #fff;
                }
                a:link {
                  color: green !important;
                  background-color: #fff;
                }
              }
            }
            .ml15 {
              margin-left: 15px;
            }
          }
        }
        .pagination {
          margin-top: 100px;
        }
      }
      .no_permission_right {
        display: flex;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
        padding-top: 240px;
        .no_permission_box {
          text-align: center;
        }
      }
      .export_btn {
        position: absolute;
        right: 24px;
        top: 24px;
      }
    }
    @media screen and (min-width: 1024px) and (max-width: 1365px){
      .right_search_result{
        margin-left: 1px;
      }
    }
  }
  ::v-deep .search-component {
    // padding-top: 16px;
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
        border: 1px solid var(--border-color-input) !important;
        border-radius: 0;
        &:hover {
          border: 1px solid #3d4c75 !important;
        }
        &:focus {
          border: 1px solid var(--active-color) !important;
          // border-bottom: 1px solid transparent !important;
          background: var(--bg-color-1) !important;
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
        background-color: var(--bg-color-1);
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
              // background-color: #2e3754;
              background-color: var(--search-input-hover-bg);
            }
          }
        }
      }
    }
  }
  ::v-deep .can_not_search {
    .searchBtn {
      color: #8388a0;
      background: #3f4462 !important;
      border: 1px solid #3f4462 !important;
    }
  }
}
</style>

<style>
.describe_content a {
  color: var(--active-color);
}
</style>
