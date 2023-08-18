<template>
  <!-- 重点人档案 -->
  <div class="keyPersonnelBase">
    <header v-permission="'important_human:list'">
      <PageHeader>
        <template>
          <div class="searchCondition">
            <div class="searchCondition_searchKeys">
              <el-input
                class="input"
                v-model.trim="table.params.searchKey"
                placeholder="请输入姓名/证件号码"
                clearable
                @clear="loadImportantPage"
                @keyup.enter.native="searchEvent"
              >
                <i
                  slot="suffix"
                  style="cursor: pointer"
                  class="el-input__icon el-icon-search"
                  v-debounce.prevent.stop="searchEvent"
                ></i>
              </el-input>
            </div>
          </div>
          <div>
            <!-- <div class="btn el-button btn btn-search el-button--primary" v-debounce="resetEvent">重置</div>
            <el-button type="primary"  class="btn" v-debounce="searchEvent">搜索</el-button> -->
          </div>
        </template>
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
        @clickCard="clickCard"
      >
        <div class='card_btn' slot='cardBtn' slot-scope='{ item }' v-permission="'important_human:trajectory'">
          <i class='iconfont icon-guiji' title="轨迹详情" @click.stop='handleGo(item)'></i>
        </div>
      </CusImagesPager>
    </main>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import { searchPersonFileByPage } from '@/api/allArchives'
import PageHeader from '@/components/BasicComponents/PageHeader'
// import UploadText from '@/components/BasicComponents/UploadText'
// import CusFilter from '@/components/BasicComponents/CusFilter'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import { mapState } from 'vuex'

const includesType = ['拘留人员', '吸毒人员', '重点人员', '自定义人员']
// const categoryList = [
//   {
//     label: '人员类型',
//     prop: 'typeList',
//     list: []
//   }
// ]
export default {
  name: 'keyPersonnelBase',
  components: {
    PageHeader,
    CusImagesPager
    // UploadText,
    // CusFilter
  },
  mixins: [autoTableHeight],
  data () {
    return {
      type: 'keyPersonnelBase',
      table: {
        tableData: [],
        columns: [
          { label: '人物画像', prop: 'avatar', type: 'img' },
          { label: '姓名', prop: 'name'},
          { label: '性别', prop: 'sex'},
          { label: '身份证号', prop: 'cerNumber'},
          { label: '出生日期', prop: 'birthday'},
          { label: '户籍派出所',prop: 'addressPoliceStation'},
          { label: '户籍地', prop: 'address'}
        ],
        pageData: {
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        // 加载条
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 12,
          searchKey: '',
          custom: false,
          personTypeList: ['personDetainee', 'personDrugster', 'personSuspect']
        }
      },
      fd: null,
      typeList: []
      // categoryList: [],
      // UploadText: {
      //   accept: '.jpg',
      //   multiple: false,
      //   imgFile: null
      // },
    }
  },
  computed: {
    ...mapState('Common', {
      tableCurrentPage: 'tableCurrentPage'
    })
  },
  mounted () {
    this.typeList = this.setTypeList()
    // this.categoryList = [...categoryList]
    // 动态添加类型
    // const index = this.categoryList.findIndex(_c => _c.prop === 'typeList')
    // if (index !== -1) {
    //   this.categoryList[index].list = [...this.typeList]
    // }
    this.resetEvent()
  },
  methods: {
    // 点击卡片查看详情
    clickCard (item){
      if(this.$store.state.Common.permissionsArray.includes('important_human:human_detail')){
        this.$store.commit('Common/setTablePage', this.table.params)
        this.$router.push({ name: 'FileDetail', query: { cerNumber: item.cerNumber, label: '重点人档案' } })
      }
    },
    // 查看轨迹
    handleGo (row) {
      // this.$router.push({ name: 'Trajectory', query: { id: row.id, label: '人物档案' } })
      window.open(window.location.origin + '/ol/Trajectory?id=' + row.id + '&label=重点人档案',"_blank")
    },
    setTypeList () {
      return this.$store.state.Dict.personTypeList.filter(_c => includesType.includes(_c.label))
    },
    // 加载重点人员表
    loadImportantPage () {
      let temp = {}
      if (this.tableCurrentPage) {
        temp = this.tableCurrentPage
        this.table.params.pageNum = this.tableCurrentPage.pageNum
        this.table.params.searchKey = this.tableCurrentPage.searchKey
        this.$store.commit('Common/setTablePage', null)
      } else {
        temp = this.table.params
      }
      this.table.isLoading = true
      searchPersonFileByPage(temp)
        .then(res => {
          this.table.isLoading = false
          this.table.tableData = res.content.map(_c => {
            _c.iconUrl = window.location.origin + '/' + _c.avatar
            return _c
          })

          this.table.pageData.total = res.totalSize
          // this.table.pageData.curPage = res.pageNum
        })
        .catch(() => {
          this.table.isLoading = false
        })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val

      // this.initFormData()
      this.loadImportantPage()
    },

    /** ie 不支持 formData set/get 等方法 */
    // initFormData () {
    //   this.fd = null
    //   this.fd = new FormData()
    //   Object.keys(this.table.params).forEach(key => {
    //     this.fd.append(key, this.table.params[key])
    //   })
    //   if (!this.UploadText.imgFile) return
    //   this.fd.append('faceImage', this.UploadText.imgFile)
    // },

    // 操作 查看档案操作
    // getDetailsRow (row) {
    // let obj = {}
    // this.fd.forEach((value, key) => {
    //   obj[key] = value
    // })
    // this.$router.push({ name: 'PersonnelFile', query: { id: row.id, label: '重点人档案' } })
    // this.$router.push({ name: 'FileDetail', query: { id: row.id, label: '重点人档案' } })
    // },
    // 操作 轨迹操作
    // trackDetails (row) {
    // let obj = {}
    // this.fd.forEach((value, key) => {
    //   obj[key] = value
    // })
    // this.$store.commit('Common/setTablePage', obj)
    // this.$router.push({ name: 'Trajectory', query: { id: row.id, label: '重点人档案' } })
    // },

    // UploadChange (file) {
    //   this.UploadText.imgFile = file.raw
    // },

    // 搜索 事件
    searchEvent () {
      this.$nextTick(() => {
        // this.$refs.CusFilter.isShowPanel = false
        // 先清空
        // this.categoryList.forEach(element => {
        //   this.table.params[element.prop] = ''
        // })
        // let typeArr = []
        // 赋值
        // if (this.$refs.CusFilter.checkedList.length) {
        //   this.$refs.CusFilter.checkedList.forEach(element => {
        //     if (element.prop === 'typeList') {
        //       typeArr.push(element.value)
        //     } else {
        //       this.table.params[element.prop] = element.value
        //     }
        //   })
        //   this.table.params['typeList'] = typeArr.join(',')
        // } else {
        //   // 全部为空的时候，那么就传全部的类型，不要传空值
        //   let str = this.typeList.reduce((pre, cur) => {
        //     return cur.value + ',' + pre
        //   }, '')
        //   str = str.slice(0, str.length - 1)
        //   this.table.params['typeList'] = str
        // }
        this.table.pageData.curPage = 1
        this.table.params.pageNum = 1
        // this.initFormData()
        if (!this.table.params.searchKey) {
          this.$messageTip.error('请输入姓名/证件号码！')
          return false
        }
        this.loadImportantPage()
      })
    },

    resetEvent () {
      this.$nextTick(() => {
        // let type = this.setTypeList()
        // if (this.tableCurrentPage && this.tableCurrentPage.typeList) {
        //   type = type.filter(item => this.tableCurrentPage.typeList.includes(item.value))
        // }
        // this.$refs.CusFilter.checkedList = type.map(_c => {
        //   return {
        //     isActive: true,
        //     label: _c.label,
        //     value: _c.value,
        //     prop: 'typeList'
        //   }
        // })
        // this.table.params.typeList = type.map(_c => _c.value).join(',')

        this.table.params.searchKey = ''
        // this.UploadText.imgFile = null

        // if (this.tableCurrentPage) {
        //   for (let key in this.table.params) {
        //     this.table.params[key] = this.tableCurrentPage[key]
        //   }
        //   // if (this.tableCurrentPage.faceImage) {
        //   //   this.UploadText.imgFile = this.tableCurrentPage.faceImage
        //   // }
        //   this.table.pageData.curPage = +this.table.params.pageNum
        //   this.$store.commit('Common/setTablePage', null)
        // } else {
        //   this.table.params.pageNum = 1
        //   this.table.pageData.curPage = 1
        // }
        // this.initFormData()
        this.loadImportantPage()
        // this.$refs.CusFilter.isShowPanel = false
      })
    }
  }
}
</script>

<style lang="less"  scoped>
@media screen and (min-width: 1024px) and (max-width:1365px) {
  .table-main {
    margin-bottom: 24px;
  }
  /deep/.CusImagesPager_item_main_info{
    .label{
      width: 136px !important;
    }
    .item-value{
      overflow: hidden;
    }
  }
}
@media screen and (min-width: 1366px) and (max-width:1919px) {
  .table-main {
    margin-bottom: 24px;
  }
  /deep/.CusImagesPager_item_main_info{
    .label{
      width: 102px !important;
    }
    .item-value{
      overflow: hidden;
    }
  }
}
@media screen and (min-width: 1920px){
  .table-main {
    // height: 750px;
    min-height: calc(100vh - 180px);
  }
  /deep/.CusImagesPager_item_main_info{
    .label{
      width: 80px !important;
    }
    .item-value{
      overflow: hidden;
    }
  }
}
.keyPersonnelBase {
  min-height: calc(100vh - 100px);
  .PageHeader {
    margin: 0;
    background-color: var(--bg-color-1);
    .searchCondition {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      > div {
        margin-right: 12px;
        &:last-child {
          margin-right: 0;
        }
      }
      .searchCondition_searchKeys {
        .input{
          width: 400px;
          font-size: 16px;
        }
      }
      .p-button.isActive {
        background: #177ddc;
        color: white;
      }
    }
  }
  .table-main {
    margin-top: 2px;
    background: var(--bg-color-1);
    padding: 0px 24px 0 24px;
    box-sizing: border-box;
    .card_btn {
      display: flex;
      position: absolute;
      top: 16px;
      right: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--base-text-color-to-999999);
      }
    }
  }
  /deep/.CusImagesPager {
    min-height: calc(100vh - 270px) !important;
    // height: 677px;
  }
  /deep/.CusImagesPager_item {
    background: var(--bg-color-2) !important;
    position: relative;
    cursor: pointer;
  }
  /deep/.CusImagesPager_item_main{
    padding: 16px 16px 10px 16px !important;
  }
  /deep/.el-image {
    width: 133px !important;
    height: 167px !important;
    img {
      width: 133px !important;
      height: 167px !important;
    }
  }
  /deep/.pagination {
    margin-top: 43px !important;
  }
}
.table-content-wrap {
  padding: 0 16px;
}
</style>
