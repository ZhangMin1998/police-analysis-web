<template>
  <div class="personCustom">
    <header>
      <PageHeader>
        <!-- 查询条件 -->
        <template>
          <div class="searchCondition" v-permission="'custom_human:list'">
            <div class="searchCondition_searchKeys">
              <el-input
                class="input"
                type="text"
                v-model.trim="params.searchKey"
                placeholder="请输入姓名/证件号码"
                clearable
                @clear="loadImportantPage"
                @keyup.enter.native="handleSearch"
              >
                <i
                  slot="suffix"
                  style="cursor: pointer"
                  class="el-input__icon el-icon-search"
                  v-debounce.prevent.stop="handleSearch"
                ></i>
              </el-input>
            </div>
          </div>
          <!-- 搜索按钮 -->
          <div>
            <!-- <el-button type="primary" class="btn" v-permission="'custom_human:list'" v-debounce="handleSearch">{{ '搜索' }}</el-button> -->
            <div class="btn el-button btn btn-search el-button--primary" @click="headerAdd"  v-permission="'custom_human:add_edit_del_human'">
              新建
            </div>
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
        <div class='card_btn' slot='cardBtn' slot-scope='{ item }'>
          <i class='iconfont icon-bianji' title="编辑" @click.stop='editGraph(item)' v-permission="'custom_human:add_edit_del_human'"></i>
          <i class='iconfont icon-guiji' title="轨迹详情" @click.stop='trackDetails(item)' v-permission="'custom_human:trajectory'"></i>
          <i class='iconfont icon-delete' title="删除" @click.stop='deleteFile(item)' v-permission="'custom_human:add_edit_del_human'"></i>
        </div>
      </CusImagesPager>
    </main>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
// import TemplateTable from '@/components/VisualComponents/Table'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import { searchPersonFileByPage, deleteCustomPerson } from '@/api/allArchives'
// import dayjs from 'dayjs'
import PageHeader from '@/components/BasicComponents/PageHeader'
import { mapState } from 'vuex'
// const cols = [
//   { label: '姓名', prop: 'name', minWidth: '120' },
//   { label: '性别', prop: 'sex', width: '120' },
//   {
//     label: '出生日期',
//     prop: 'birthday',
//     minWidth: '170',
//     renderFun: function (row) {
//       if (!row.birthday) return '--'
//       return dayjs(row.birthday).format('YYYY-MM-DD')
//     }
//   },
//   { label: '身份证号', prop: 'cerNumber', minWidth: '240' },
//   { label: '创建时间', prop: 'createTime', minWidth: '200' },
//   { label: '人物画像', prop: 'iconUrl', width: '140', type: 'img' },
//   // {
//   //   label: '创建人',
//   //   prop: 'createName',
//   //   width: '180',
//   //   renderFun: function (row) {
//   //     return row.createName || '--'
//   //   }
//   // }
// ]
export default {
  name: 'personCustom',
  components: {
    CusImagesPager,
    PageHeader
  },
  mixins: [autoTableHeight],
  data () {
    return {
      rowNum: 6.7,
      UploadText: {
        accept: '.jpg',
        multiple: false,
        imgFile: null
      },
      table: {
        tableData: [],
        columns: [
          { label: '人物画像', prop: 'avatar', type: 'img' },
          { label: '姓名', prop: 'name'},
          { label: '性别', prop: 'sex'},
          { label: '身份证号', prop: 'cerNumber'},
          { label: '出生日期', prop: 'birthday'},
          { label: '创建时间',prop: 'createTime'}
        ],
        // btnRender: ,
        pageData: {
          btnRenderWidth: 200,
          curPage: 1,
          pageSize: 12,
          total: 0
        },
        // 加载条
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 12,
          searchKey: ''
        }
      },
      params: {
        pageNum: 1,
        pageSize: 12,
        searchKey: '',
        // typeList: ''
        custom: true,
        personTypeList: ['personCustom']
      }
    }
  },
  computed: {
    'btnRender' () {
      const btnList = [
        {
          label: '详情',
          type: 'success',
          icon: 'icon-check',
          btnEvent: this.getDetailsRow,
          alt: '查看档案',
          key:'normal_human:human_detail'
        },
        {
          label: '编辑',
          type: 'success',
          icon: 'icon-doc-pen',
          btnEvent: this.editGraph,
          alt: '编辑',
          key:'normal_human:edit_person'
        },
        {
          label: '轨迹',
          type: 'rodeLine',
          icon: 'icon-location',
          btnEvent: this.trackDetails,
          alt: '查看轨迹',
          key:'normal_human:trajectory'
        },
        {
          label: '删除',
          type: 'success',
          icon: 'icon-drop',
          btnEvent: this.deleteFile,
          alt: '删除',
          key:'normal_human:del_person'
        }
      ]
      // return btnList
      return this.$backPermissionsArray(btnList)
    },
    ...mapState('Common', {
      tableCurrentPage: 'tableCurrentPage'
    })
  },
  created () {
    // this.params.typeList = this.$store.state.Dict.personTypeList.find(
    //   _c => _c.label === '自定义人员'
    // ).value
    if (this.tableCurrentPage) {
      for (let key in this.params) {
        this.params[key] = this.tableCurrentPage[key]
      }
      for (let key in this.table.params) {
        this.table.params[key] = this.tableCurrentPage[key]
      }
      this.table.pageData.curPage = +this.params.pageNum
      this.$store.commit('Common/setTablePage', null)
    }
    this.loadImportantPage()
  },

  methods: {
    trackDetails (row) {
      this.$store.commit('Common/setTablePage', this.params)
      this.$router.push({ name: 'Trajectory', query: { id: row.id, label: '自定义档案' } })
    },
    deleteFile (row) {
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteCustomPerson({ id: row.id }).then(() => {
            this.$messageTip.success('删除成功！')
            this.loadImportantPage()
          })
        })
        .catch(() => { })
    },
    /** 新建 */
    headerAdd () {
      this.$router.push({ name: 'Relation', query: { label: '自定义档案' } })
    }, // 加载搜索多选框

    // 加载自定义人员表
    loadImportantPage () {
      this.table.isLoading = true
      // let fd = null
      // fd = new FormData()
      // Object.keys(this.params).forEach(key => {
      //   fd.append(key, this.params[key])
      // })

      searchPersonFileByPage(this.params)
        .then(res => {
          this.table.isLoading = false
          this.table.tableData = res.content.map(_c => {
            _c.iconUrl = window.location.origin + '/' + _c.avatar
            return _c
          })

          this.table.pageData.total = res.totalSize
        })
        .catch(() => {
          this.table.isLoading = false
        })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.params.pageNum = val

      this.loadImportantPage()
    },

    // 操作 查看档案操作
    // getDetailsRow(row) {
    //   this.$store.commit('Common/setTablePage', this.params)
    //   this.$router.push({ name: 'personCustomDetail', query: { id: row.id, label: '自定义档案' } })
    //   // this.$router.push({ name: 'FileDetail', query: { id: row.id , label:'自定义档案'} })
    // },

    // 编辑关系图
    editGraph (row) {
      this.$store.commit('Common/setTablePage', this.params)
      this.$router.push({ name: 'Relation', query: { id: row.canvas, label: '自定义档案' } })
    },

    /** 筛选 搜索表格 */
    handleSearch () {
      this.table.pageData.curPage = 1
      this.params.pageNum = 1
      this.table.params.searchKey = this.params.searchKey
      if (!this.params.searchKey) {
        this.$messageTip.error('请输入姓名/证件号码！')
        return false
      }
      this.loadImportantPage()
    },
    // 点击卡片查看详情
    clickCard (row){
      if(this.$store.state.Common.permissionsArray.includes('custom_human:human_detail')){
        this.$store.commit('Common/setTablePage', this.params)
        this.$router.push({ name: 'personCustomDetail', query: { id: row.id, label: '自定义档案' } })
      }
    },
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width:1365px) {
  .table-main {
    margin-bottom: 24px;
  }
}
@media screen and (min-width: 1366px) and (max-width:1919px) {
  .table-main {
    margin-bottom: 24px;
  }
}
@media screen and (min-width: 1920px){
  .table-main {
    height: 750px;
  }
}
.personCustom {
  min-height: calc(100vh - 100px);
  .PageHeader {
    margin: 0;
    background: var(--bg-color-1);
    .searchCondition {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      // padding-top: 12px;
      > div {
        margin-right: 12px;
        &:last-child {
          margin-right: 0;
        }
      }
      .searchCondition_searchKeys {
        .input{
          font-size:16px;
          width:400px;
        }
      }
    }
  }
  .table-main {
    margin-top: 2px;
    padding: 0px 24px 0 24px;
    background: var(--bg-color-1);
    box-sizing: border-box;
    .card_btn {
      display: flex;
      position: absolute;
      bottom: 16px;
      right: 16px;
      i {
        font-size: 16px;
        color: var(--base-text-color-to-999999);
        cursor: pointer;
        margin-left: 16px;
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
    padding: 16px 16px !important;
  }
  // /deep/.CusImagesPager_item_main_info_item .label{
  //   width: 70px !important;
  // }
  /deep/.el-image {
    width: 133px !important;
    height: 167px !important;
    img {
      width: 133px !important;
      height: 167px !important;
    }
  }
}
</style>
