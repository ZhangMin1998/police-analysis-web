<template>
  <div class="userManagement">
    <div class="left_tree">
      <el-input
        class="input_filter"
        placeholder="请输入部门名称"
        maxlength="30"
        v-model="filterText"
      >
        <i slot="suffix" class='iconfont icon-sousuo'></i>
      </el-input>
      <div
        class="el-tree-box"
        v-p-loading="treeLoading"
        :element-loading-background="'--bg-color-2'"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-tree
          class="filter-tree"
          :data="userTreeData"
          :props="defaultProps"
          @node-click="nodeClick"
          default-expand-all
          node-key="orgId"
          :filter-node-method="filterNode"
          ref="tree"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <!-- <span class="em-tree-text" :title="node.label">{{ node.label }}</span> -->
             <EllipsisPop class="em-tree-text" :content='node.label'></EllipsisPop>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="right_template_table">
      <main class="table-main">
        <div class="main-search-build">
          <div class="search-input">
            <el-input
              v-model="table.params.searchKey"
              placeholder="请输入用户账号/姓名"
              maxlength="30"
              v-on:keyup.enter.native="searchEvent"
              clearable
              @clear="clearSearch"
            >
              <i slot="suffix" class='iconfont icon-sousuo' @click.prevent.stop="searchEvent"></i>
            </el-input>
          </div>
          <div class="addRoleBtn">
            <div
              class="blank_button change_branch mr16"
              v-permission="'user_management:user_transform_department'"
              @click="changeDepartment"
              v-if="!readOnly"
            >
              转部门
            </div>
            <el-button
              type="primary"
              @click="addUser"
              v-permission="'user_management:add_edit_del'"
              v-if="!readOnly"
              >新建</el-button
            >
          </div>
        </div>

        <template-table
          :tableData="table.tableData"
          :columns="table.columns"
          :tableHeight="674"
          :rowHeight="48"
          :btnRender="btnRender"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </main>
    </div>
    <!-- 新建/编辑/转部门 -->
    <pop
      :pop.sync="popData"
      @beforeClose="closeDailog"
      @beforeOpen="openDailog"
      :dataCenterDetail="true"
      class="dialog_one"
    >
      <BuildNewPop
        :popTyle="popData.title"
        :editData="currentRow"
        :popTreeData="popTreeData"
        :checkedList="checkedList"
        :departmentData="currentNodeData"
        @cancleSubmit="cancleSubmit"
        @confirm="confirm"
      ></BuildNewPop>
    </pop>
    <!-- 提示之类的 -->
    <pop
      :pop.sync="popTipsData"
      @beforeClose="closeTipsDailog"
      @beforeOpen="openTipsDailog"
      :dataCenterDetail="true"
    >
      <div class="bulid_department" :class="{ is_tip: popTipsData.key === 'stopOrStart' }">
        <div class="tips">
          <i class="waring-icon" :class="popTipsData.icon"></i>
          <div class="warning_txt">{{ popTipsData.text }}</div>
        </div>
        <div class="table-userInfo" v-if="popTipsData.key === 'add'">
          <template-table
            class="user_table"
            :tableData="infoTable.tableData"
            :columns="infoTable.columns"
            :tableHeight="100"
            :pagination="false"
            :rowHeight="48"
          ></template-table>
        </div>
      </div>
    </pop>
  </div>
</template>

<script>
import { authOrgListWithTree, queryUserByOrgId, updateByUserId, listTreeWithRole, getAllRoleByUserId } from '@/api/sysSetting'
import { mapState, mapMutations } from 'vuex'
import Pop from '@/components/VisualComponents/PopDialog'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
import BuildNewPop from './components/buildNewPop'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  components: {
    Pop,
    TemplateTable,
    BuildNewPop,
    EllipsisPop
  },
  mixins: [autoTableHeight],
  watch: {
    filterText (val) {
      console.log(val);
      this.$refs.tree.filter(val);
    },
    readOnly: {
      handler (val) {
        if (this.permissionsArray.includes('user_management:user_use_or_stop') && !val) {
          this.table.columns = [
            {
              label: '状态',
              prop: 'status',
              minWidth: '10%',
              type: 'aside-switch',
              activeText: '启用',
              inactiveText: '禁用',
              onValue: 'enable',
              offValue: 'disable',
              event: row => {
                this.stopOrContinue(row)
              }
            },
            { label: '选择框', type: 'selection' },
            { label: '序号', width: '80', type: 'index' },
            { label: '用户账号', prop: 'username', minWidth: '8%', type: 'nor' },
            { label: '姓名', prop: 'realName', minWidth: '12%', type: 'nor' },
            { label: '警员编号', prop: 'jobNumber', minWidth: '8%', type: 'nor' },
            { label: '角色名称', prop: 'roleName', minWidth: '10%', type: 'nor' },
            { label: '部门名称', prop: 'orgName', minWidth: '10%', type: 'nor' },
            { label: '手机', prop: 'mobile', minWidth: '11%', type: 'nor' },
            { label: '创建人', prop: 'createBy', minWidth: '8%', type: 'nor' },
            { label: '创建时间', prop: 'createTime', minWidth: '14%', type: 'nor' }
          ]
        } else {
          this.table.columns = [
            { label: '创建时间', prop: 'createTime', minWidth: '14%', type: 'nor' },
            { label: '选择框', type: 'selection' },
            { label: '序号', width: '80', type: 'index' },
            { label: '用户账号', minWidth: '8%', prop: 'username', type: 'nor' },
            { label: '姓名', prop: 'realName', minWidth: '12%', type: 'nor' },
            { label: '警员编号', prop: 'jobNumber', minWidth: '8%', type: 'nor' },
            { label: '角色名称', prop: 'roleName', minWidth: '10%', type: 'nor' },
            { label: '部门名称', prop: 'orgName', minWidth: '10%', type: 'nor' },
            { label: '手机', prop: 'mobile', minWidth: '11%', type: 'nor' },
            { label: '创建人', prop: 'createBy', minWidth: '8%', type: 'nor' }
          ]
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('User', {
      loginUserInfo: 'userInfo'
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray'
    }),
    ...mapState('SystemSetting', {
      organizationalTreeList: 'organizationalTreeList',
      departmentTreeWithRoleList: 'departmentTreeWithRoleList'
    }),
    btnRender () {
      let btnRender = [
        {
          label: '编辑',
          type: 'resetPassword',
          icon: 'icon-bianji',
          btnEvent: this.editUser,
          alt: '编辑',
          key: 'user_management:add_edit_del'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-delete',
          btnEvent: this.deleteUser,
          alt: '删除',
          key: 'user_management:add_edit_del'
        }
      ]
      if (this.readOnly) {
        btnRender = []
      }
      return this.$backPermissionsArray(btnRender)
    }
  },
  data () {
    return {
      popData: { show: false, title: '新建', width: '846px', text: '', key: '' },
      popTipsData: { show: false, title: '提示', width: '640px', text: '', icon: 'el-icon-circle-check', key: '' },
      filterText: '',
      userTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      popTreeData: [],
      searchKey: '',
      currentRow: {},
      currentNodeData: '',
      checkedList: [],
      userInfo: {
        "id": 0,
        "status": "string"
      },
      treeLoading: false,
      table: {
        tableData: [],
        columns: [],
        pageData: {
          curPage: 1,
          pageSize: 13,
          total: 0,
          btnRenderWidth: '8%'
        },
        // 加载条
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 13,
          orgId: '',
          searchKey: ''
        }
      },
      infoTable: {
        tableData: [],
        columns: [
          { label: '警员编号', prop: 'jobNumber', type: 'nor' },
          { label: '用户账号', prop: 'username', type: 'nor' },
          { label: '密码', prop: 'passWord', type: 'nor' },
          { label: '姓名', prop: 'realName', type: 'nor' },
        ]
      },
      readOnly: true
    };
  },
  mounted () {
    // if (this.organizationalTreeList.length) {
    //   this.handlerData(this.organizationalTreeList)
    // } else {
    //   this.queryDepartmentTree()
    // }
    this.queryDepartmentTree()
    // if (this.departmentTreeWithRoleList.length) {
    //   this.popTreeData = this.departmentTreeWithRoleList
    // } else {
    //   this.getDepartmentTreeWithRole()
    // }
    this.getDepartmentTreeWithRole()
  },
  methods: {
    ...mapMutations('SystemSetting', {
      setOrganizationalTreeList: 'set_organizationalTreeList',
      setDepartmentTreeWithRoleList: 'set_departmentTreeWithRoleList'
    }),
    getDepartmentTreeWithRole () {
      listTreeWithRole().then((res) => {
        // console.log(res);
        this.forMatData(res)
        this.setDepartmentTreeWithRoleList(res)
        this.popTreeData = res
      })
    },
    forMatData (arr) {
      // console.log(arr);
      arr.forEach((item) => {
        if (item.treeType === 'org') {
          item.disabled = true
        }
        if (item.children && item.children.length) {
          this.forMatData(item.children)
        }
      })
      // return this.deal(arr, item => item.treeType === 'org' && item.children && item.children.length || item.treeType === 'role')
    },
    deal (nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return [];
      }

      const newChildren = [];
      for (const node of nodes) {
        if (predicate(node)) {
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node);
          node.children = this.deal(node.children, predicate);
        } else {
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          // newChildren.push(...this.deal(node.children, predicate));
        }
      }
      return newChildren;
    },
    stopOrContinue (row) {
      // console.log(row);
      row.status = row.status === 'disable' ? 'enable' : 'disable'
      this.currentRow = row
      // 用户禁用或者启用前，看是否有角色，没有的话，先提示让用户选好角色
      if (row.orgName === "未分配分组") {
        this.popTipsData.show = true
        this.popTipsData.icon = 'el-icon-warning-outline'
        this.popTipsData.key = 'stopOrStart'
        this.popTipsData.width = '558px'
        this.popTipsData.text = '如需禁用/启用，请在编辑时选择好该用户的角色名称'
        return
      }

      // 在这里先判断是不是自己的账号，是自己的账号则无权去动

      if (row.status === 'enable') {
        // 停用时提示
        // this.popData.show = true
        // this.popData.title = '提示'
        // this.popData.key = '停用'
        // this.popData.text = '停用后，该角色的权限将不能使用，但数据扔保留,您确定要禁用该角色吗？'
        this.arrageParams('disable')
        updateByUserId(this.userInfo.id, this.userInfo).then((res) => {
          console.log(res);
          if (res.code === 1) {
            this.$message.success('该用户禁用成功')
            this.nodeClick(this.currentNodeData, false)
          } else {
            this.$message.success(res.msg)
            // row.status = row.status === 'disable' ? 'enable' : 'disable'
          }
        })
      } else {
        // 启用时直接调接口启用
        this.arrageParams('enable')
        updateByUserId(this.userInfo.id, this.userInfo).then((res) => {
          console.log(res);
          if (res.code === 1) {
            this.$message.success('该用户启用成功')
            this.nodeClick(this.currentNodeData, false)
          } else {
            this.$message.success(res.msg)
            // row.status = row.status === 'disable' ? 'enable' : 'disable'
          }
        })
      }
    },
    closeTipsDailog () {
      if (this.popTipsData.key === 'add') {
        this.popData.show = false
        this.nodeClick(this.currentNodeData)
      }
      //  else if (this.popTipsData.key === 'stopOrStart') {
      //   this.currentRow.status = this.currentRow.status === 'enable' ? 'disable' : 'enable'
      // }
      this.popTipsData.show = false
    },
    openTipsDailog () {
      this.popTipsData.show = true
    },
    cancleaTipsSubmit () {
      // if (this.popTipsData.key === 'stopOrStart') {
      //   this.currentRow.status = this.currentRow.status === 'enable' ? 'disable' : 'enable'
      // }
      this.popTipsData.show = false
    },
    confirmTips () {
      // if (this.popTipsData.key === 'delete') {
      //   this.arrageParams('delete')
      //   updateByUserId(this.userInfo.id, this.userInfo).then((res) => {
      //     console.log(res);
      //     this.$message.success('删除成功')
      //     this.nodeClick(this.currentNodeData)
      //     this.popTipsData.show = false
      //   })
      // } else if (this.popTipsData.key === 'stopOrStart') {
      //   // this.currentRow.status = this.currentRow.status === 'enable' ? 'disable' : 'enable'
      //   this.popTipsData.show = false
      // }
      this.popTipsData.show = false
    },
    arrageParams (status) {
      this.userInfo.id = this.currentRow.userId
      this.userInfo.status = status
    },
    queryDepartmentTree () {
      this.treeLoading = true
      authOrgListWithTree().then((res) => {
        // console.log(res);
        if (res.length) {
          res.forEach((item, index, arr) => {
            if (item.orgName === '未分配分组' || item.createBy == 'unknow') {
              item.readOnly = false
              arr.splice(index, 1)
              arr.push(item)
            }
          })
        }
        this.setOrganizationalTreeList(res)
        this.handlerData(res)
      })
    },
    handlerData (res) {
      this.userTreeData = res
      this.treeLoading = false
      if (res.length > 0) {
        //'nextTick()' 下次dom更新时触发回调函数
        //默认点击
        this.$nextTick().then(() => {
          const firstNode = document.querySelector('.el-tree-node')
          firstNode.click();
        })
      }
    },
    changeDepartment () {
      // console.log(1111111);
      if (this.checkedList.length) {
        this.currentRow = {}
        this.popData.title = "转部门"
        this.popData.show = true
      } else {
        this.$message.info('请先选择人员再进行转部门')
      }

    },
    handleSelectionChange (rowList) {
      this.checkedList = rowList
    },
    editUser (row) {
      this.currentRow = row
      getAllRoleByUserId({ userId: row.userId }).then((res) => {
        let tempArr = res.reduce((pre, cur) => {
          pre.push('role-' + cur.id)
          return pre
        }, [])
        this.currentRow.treeId = tempArr
        this.popData.title = "编辑"
        this.popData.show = true
      })

    },
    deleteUser (row) {
      if (this.loginUserInfo.username === row.username) {
        this.$message.error('抱歉，您无法对自己的账号进行删除操作')
        return
      }
      // 不能删除自己
      this.currentRow = row
      // this.popTipsData.show = true
      // this.popTipsData.icon = 'el-icon-warning-outline'
      // this.popTipsData.key = 'delete'
      // this.popTipsData.text = '删除后，该用户将无法登陆，并对数据永久删除，您确定要删除该用户信息吗？'

      this.$policeComfirm('删除后，该用户将无法登陆，并对数据永久删除，您确定要删除该用户信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.arrageParams('delete')
        updateByUserId(this.userInfo.id, this.userInfo).then((res) => {
          console.log(res);
          this.$message.success('删除成功')
          this.nodeClick(this.currentNodeData)
          this.popTipsData.show = false
        })
      })
    },
    closeDailog () {
      this.popData.show = false
    },
    cancleSubmit () {
      this.popData.show = false
    },
    confirm (userInfo, type) {
      this.popData.show = false
      if (type === 'add') {
        this.popData.show = true
        this.popTipsData.text = '成功新建用户，以下是用户信息，请保存以防无法登陆'
        this.popTipsData.key = 'add'
        this.popTipsData.icon = 'el-icon-circle-check'
        this.infoTable.tableData = [userInfo]
        this.popTipsData.show = true
      } else {
        this.nodeClick(this.currentNodeData, false)
      }
    },
    openDailog () { },
    addUser () {
      this.currentRow = {}
      this.popData.title = '新建'
      this.popData.width = '880px'
      this.popData.show = true
      // this.popTipsData.text = '成功新建用户，以下是用户信息，请保存以防无法登陆'
      // this.popTipsData.show = true
    },
    searchEvent () {
      queryUserByOrgId(this.table.params).then((res) => {
        this.table.tableData = res.content
        this.table.pageData.total = res.totalSize
      })
    },
    clearSearch () {
      this.table.params.searchKey = ''
      this.searchEvent()
    },
    nodeClick (info, keepSearchParam) {
      // console.log(info);
      // console.log(!keepSearchParam===false);
      this.currentNodeData = info
      this.table.isLoading = true
      this.table.params.orgId = info.orgId
      this.readOnly = info.readOnly
      if (keepSearchParam) {
        this.table.params.searchKey = ''
      }
      this.table.params.pageNum = 1
      // this.operationInfo.show = false
      queryUserByOrgId(this.table.params).then((res) => {
        this.table.isLoading = false
        this.table.tableData = res.content
        this.table.pageData.curPage = res.pageNum
        this.table.pageData.total = res.totalSize
      })
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.searchEvent()
    }
  },
}
</script>

<style lang="less" scoped>
.userManagement {
  height: calc(100vh - 104px);
  display: flex;
  .left_tree {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    width: 20%;
    background-color: var(--bg-color-2);
    padding: 16px 0 20px;
    box-shadow: 0px -1px 12px 1px var(--box-shadow-color);
    .el-tree-box {
      height: calc(100vh - 200px);
      overflow-y: auto;
    }
    .input_filter {
      margin: 0 20px 27px;
      width: calc(100% - 40px);
      .el-icon-search {
        color: var(--base-text-color-to-999999);
      }
    }
    ::v-deep .el-input {
      .el-input__inner {
        border: 0 !important;
        border-bottom: 1px solid rgba(81, 92, 124,0.5) !important;
        border-radius: 0;
        padding-left: 0;
        padding-right: 30px;
        &::placeholder {
          color: var(--input-placehold-color);
          font-size: 16px;
        }
      }
      // .el-input__inner:focus {
      //   border-bottom: 1px solid #5288d8 !important;
      // }
    }
    .custom-tree-node {
      display: flex;
      flex: 1;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding-right: 20px;
      padding-left: 2px;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
      .em-tree-text {
        display: inline-block; //block一样
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
      }
    }
    .operation {
      cursor: pointer;
      // padding: 0 8px;
      float: right;
    }
    .operation_box {
      position: fixed;
      // left: 395px;
      // top: 152px;
      z-index: 888888888888888;
      ul {
        background-color: var(--datapicker-shijian-xiala-bg-color);
        box-shadow: 0px -1px 16px 1px var(--box-shadow-color);
        text-align: center;
        li {
          width: 118px;
          height: 32px;
          line-height: 32px;
          color: var(--base-text-color-2);
          cursor: pointer;
        }
        li:hover {
          background-color: var(--datapicker-in-range-bg-color);
          color: var(--base-text-color-1);
        }
      }
    }
    .new_build {
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 20px;
      .el-button {
        width: 100%;
      }
    }
  }
  .right_template_table {
    height: 100%;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    background-color: var(--bg-color-3);
    .table-main {
      .main-search-build {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .search-input {
          width: 400px;
          i {
            margin-right: 5px;
          }
        }
        .addRoleBtn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .change_branch {
            padding: 6px 12px;
          }
        }
      }
    }
    ::v-deep .el-table {
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

    .build_new_role {
      width: 100%;
      height: 100%;
    }
  }
}
.bulid_department {
  // height: 200px;
  box-sizing: border-box;
  padding: 8px 12px 0 4px;
  &.is_tip {
    padding-top: 26px;
    padding-bottom: 30px;
  }
  // display: flex;
  // align-items: center;
  .tips {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .waring-icon {
      display: inline-block;
      font-size: 64px;
    }
    .el-icon-circle-check {
      color: #0cbf7e;
    }
    .el-icon-warning-outline {
      color: var(--active-color);
    }
    .warning_txt {
      padding-left: 15px;
      color: var(--base-text-color-1);
    }
  }
  .table-userInfo {
    margin-top: 20px;
    padding-bottom: 30px;
    .user_table {
      ::v-deep .el-table {
        .el-table__header-wrapper {
          tr {
            height: 48px !important;
            .cell {
              font-weight: 400;
            }
          }
        }
        //width: 400px;
        .el-table__body-wrapper {
          .el-table__body {
            border-top: 1px solid #3e4a60;
            border-bottom: 1px solid #3e4a60;
            .shuangRow {
              background-color: #26334c !important;
            }
          }
        }
      }
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    padding: 8px 0 24px 0;
    box-sizing: border-box;
    &.formBtn {
      padding: 24px 0 24px 24px;
      box-sizing: border-box;
    }
    .submitButton {
      padding: 8px 20px;
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: inline-block;
      color: @font-color-3;
      &.out {
        background-color: #177ddc;
        &:hover {
          background-color: rgb(80, 147, 223);
        }
      }
      &.cancle {
        margin-right: 8px;
        border-radius: 4px;
        cursor: pointer;
      }
      &:hover {
        background-color: #177ddc;
      }
    }
  }
}
.left_tree {
  ::v-deep .el-tree-node__content {
    .el-icon-caret-right {
      margin-left: 12px;
    }
  }
}
::v-deep .el-input {
  .el-input__suffix {
    top: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.icon-sousuo {
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  cursor: pointer;
}
</style>
