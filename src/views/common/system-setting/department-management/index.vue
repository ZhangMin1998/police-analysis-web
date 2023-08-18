<template>
  <div class="departmentManagement">
    <div class="left_tree">
      <el-input
        class="input_filter"
        placeholder="请输入部门名称"
        maxlength="30"
        v-model="filterText"
      >
        <i slot="suffix" class="iconfont icon-sousuo"></i>
      </el-input>

      <div
        class="el-tree-box"
        :style="{ height: isAdmin ? 'calc(100vh - 240px)' : 'calc(100vh - 200px)' }"
        v-p-loading="treeLoading"
        :element-loading-background="'--bg-color-2'"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          @node-click="nodeClick"
          default-expand-all
          node-key="orgId"
          :filter-node-method="filterNode"
          ref="tree"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- <span class="em-tree-text" :title="node.label">{{ node.label }}</span> -->
            <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
            <span
              class="operation"
              v-if="!data.readOnly"
              v-permission="'department_management:add_edit_del'"
              @click.stop="operationClick(node, data, $event)"
              >···</span
            >
            <!-- v-if="node.level < 9 && !data.readOnly" -->
          </span>
        </el-tree>
      </div>
      <div
        class="operation_box"
        v-if="operationInfo.show"
        :style="{ left: operationInfo.clientX, top: operationInfo.clientY }"
      >
        <ul>
          <li v-if="nodeLevel < 9" @click="buildTree(currentNodeData)">新增</li>
          <li @click="changDepartmentName(currentNodeData)">重命名</li>
          <li @click="delDepartment(currentNodeData)">删除</li>
        </ul>
      </div>
      <div class="new_build" v-if="isAdmin">
        <el-button type="primary" @click="buildTree">新建</el-button>
      </div>
    </div>
    <div class="right_template_table">
      <div class="build_new_role" v-if="componentStatus === 'build_new'">
        <BuildNew
          :editData="editData"
          :allRoleList="table.tableData"
          :currentDepartmentData="currentNodeData"
          ref="build_new"
        ></BuildNew>
      </div>
      <main class="table-main" v-else-if="componentStatus === 'list'">
        <div class="main-search-build">
          <div class="search-input">
            <el-input
              v-model="table.params.searchKey"
              placeholder="请输入角色名称"
              maxlength="30"
              v-on:keyup.enter.native="searchEvent"
              clearable
              @clear="clearSearch"
            >
              <i slot="suffix" class="iconfont icon-sousuo" @click.prevent.stop="searchEvent"></i>
            </el-input>
          </div>
          <div class="addRoleBtn" v-permission="'department_management:role_edit'">
            <el-button type="primary" v-if="!readOnly" @click="addRole">新建</el-button>
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
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </main>
      <div class="build_new_role" v-if="componentStatus === 'role_detail'">
        <RoleDetail :roleDetailData="roleDetailData"></RoleDetail>
      </div>
    </div>
    <Pop
      :pop.sync="popData"
      @beforeClose="closeDailog"
      @beforeOpen="openDailog"
      :dataCenterDetail="true"
    >
      <!-- 碰撞详情 -->
      <div class="bulid_department">
        <div class="tips" v-if="popData.text">
          <i class="waring-icon el-icon-warning-outline"></i>
          <div class="warning_txt">{{ popData.text }}</div>
        </div>
        <div v-else>
          <div class="wirte_content" v-if="orgInfo.parentName">
            <span class="txt">上级部门：</span>
            <span class="departmentName">{{ orgInfo.parentName }}</span>
          </div>
          <div class="wirte_content">
            <span class="txt">部门名称：</span>
            <div class="input_department_name">
              <el-input placeholder="请输入" maxlength="30" v-model="orgInfo.orgName"></el-input>
            </div>
          </div>
        </div>
        <div class="right formBtn">
          <div class="blank_button" @click="cancleSubmit">取消</div>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </Pop>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { authOrgCreate, authOrgUpdate, authOrgListWithTree, queryUserByOrgId, queryRoleByOrgId, roleUpdateByRoleId } from '@/api/sysSetting'
// import {queryAllSitePlace } from '@/api/equipMap'
import Pop from '@/components/VisualComponents/PopDialog'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
import BuildNew from './components/buildNew.vue'
import RoleDetail from './components/roleDetail.vue'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  components: {
    Pop,
    TemplateTable,
    BuildNew,
    RoleDetail,
    EllipsisPop
  },
  mixins: [autoTableHeight],
  data () {
    return {
      popData: { show: false, title: '新建', width: '494px', text: '', key: '' },
      operationInfo: {
        show: false,
        clientX: 0,
        clientY: 0
      },
      orgInfo: {
        orgId: 0,
        orgName: "",
        parentId: 0,
        status: true,
        parentName: ''
      },
      componentStatus: 'list',
      currentNodeData: '',
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      currentRow: '',
      roleInfo: {
        "id": 0,
        "status": "string"
      },
      treeLoading: false,
      editData: {},
      roleDetailData: {},
      readOnly: true,
      nodeLevel: '',
      table: {
        tableData: [],
        columns: [],
        pageData: {
          curPage: 1,
          pageSize: 13,
          total: 0,
          btnRenderWidth: '12%'
        },
        // 加载条
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 13,
          orgId: '',
          searchKey: ''
        }
      }
    };
  },
  computed: {
    ...mapState('User', {
      isAdmin: 'isAdmin'
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray'
    }),
    ...mapState('SystemSetting', {
      organizationalTreeList: 'organizationalTreeList'
    }),
    btnRender () {
      let btnRender = [
        {
          label: '查看',
          type: 'success',
          icon: 'icon-xiangqing',
          btnEvent: this.viewRole,
          alt: '查看',
          key: 'department_management:role_edit'
        },
        {
          label: '编辑',
          type: 'resetPassword',
          icon: 'icon-bianji',
          btnEvent: this.editRole,
          alt: '编辑',
          key: 'department_management:role_edit'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-delete',
          btnEvent: this.deleteRole,
          alt: '删除',
          key: 'department_management:role_edit'
        }
      ]
      if (this.readOnly) {
        btnRender = [{
          label: '查看',
          type: 'success',
          icon: 'icon-xiangqing',
          btnEvent: this.viewRole,
          alt: '查看',
          key: 'department_management:role_edit'
        }]
      }
      return this.$backPermissionsArray(btnRender)
    }

  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    readOnly: {
      handler (val) {
        if (this.permissionsArray.includes('department_management:role_use_or_stop') && !val) {
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
            { label: '序号', width: '80', type: 'index' },
            { label: '角色名称', prop: 'roleName', minWidth: '13%', type: 'nor' },
            { label: '创建人', prop: 'createBy', minWidth: '13%', type: 'nor' },
            { label: '创建时间', prop: 'createTime', minWidth: '16%', type: 'nor' },
            {
              label: '用户数量', prop: 'userNum', minWidth: '8%', type: 'nor', renderFun: (row) => {
                return String(row.userNum)
              }
            },
          ]
        } else {
          this.table.columns = [
            {
              label: '用户数量', prop: 'userNum', minWidth: '8%', type: 'nor', renderFun: (row) => {
                return String(row.userNum)
              }
            },
            { label: '序号', width: '80', type: 'index' },
            { label: '角色名称', prop: 'roleName', minWidth: '13%', type: 'nor' },
            { label: '创建人', prop: 'createBy', minWidth: '13%', type: 'nor' },
            { label: '创建时间', prop: 'createTime', minWidth: '20%', type: 'nor' },

          ]
        }
      },
      immediate: true
    }
  },
  created () {
    // 权限处理
  },
  mounted () {
    document.addEventListener('click', this.bodyClick)
    // if (this.organizationalTreeList.length) {
    //   this.handlerData(this.organizationalTreeList)
    // } else {
    //   this.queryDepartmentTree()
    // }
    this.queryDepartmentTree()
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyClick)
  },
  methods: {
    ...mapMutations('SystemSetting', {
      setOrganizationalTreeList: 'set_organizationalTreeList'
    }),
    editRole (row) {
      this.editData = row
      this.componentStatus = 'build_new'
    },
    viewRole (row) {
      this.roleDetailData = row
      this.componentStatus = 'role_detail'
      // console.log('查看角色');
    },
    searchEvent () {
      // this.table.isLoading = true
      queryRoleByOrgId(this.table.params, { loading: true, loadingDom: '.right_template_table' }).then((res) => {
        // this.table.isLoading = false
        this.table.tableData = res.content
        this.table.pageData.curPage = res.pageNum
        this.table.pageData.total = res.totalSize
      })
    },
    clearSearch () {
      this.table.params.searchKey = ''
      this.searchEvent()
    },
    deleteRole (row) {
      this.currentRow = row
      this.$policeComfirm('删除后此角色信息将被清除，您确认要删除该角色信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.arrageParams('delete')
        roleUpdateByRoleId(this.roleInfo.id, this.roleInfo).then(() => {
          this.closeDailog()
          this.backToOriginTreeStatus()
          this.$message.success('该角色信息删除成功。')
        })
      })
    },
    addRole () {
      this.componentStatus = 'build_new'
    },
    stopOrContinue (row) {
      row.status = row.status === 'disable' ? 'enable' : 'disable'
      this.currentRow = row
      if (row.status === 'enable') {
        // 停用时提示
        this.popData.show = true
        this.popData.title = '提示'
        this.popData.key = '停用'
        this.popData.text = '停用后，该角色的权限将不能使用，但数据仍保留,您确定要禁用该角色吗？'
      } else {
        // 启用时直接调接口启用
        this.arrageParams('enable')
        roleUpdateByRoleId(this.roleInfo.id, this.roleInfo).then(() => {
          this.closeDailog()
          this.$message.success('该角色启用成功')
          this.backToOriginTreeStatus()
        })
      }
    },
    bodyClick (e) {
      let cusFilterDiv = document.querySelector('.operation_box')
      if (cusFilterDiv && !cusFilterDiv.contains(e.target)) {
        this.operationInfo.show = false
      }
    },
    /** 表格 -> 分页切换操作 */
    handleCurrentChange (val) {
      // console.log(val);
      this.table.params.pageNum = val
      // this.loadImportantPage()
      this.nodeClick(this.currentNodeData, '', '', 'pageNumChange')
    },
    handlerData (res, backCurrent) {
      this.data = res
      this.treeLoading = false
      if (res.length > 0) {

        //'nextTick()' 下次dom更新时触发回调函数
        //默认点击
        this.$nextTick().then(() => {
          if (backCurrent) {
            // 回到更改状态前的选中
            this.$refs.tree.setCurrentKey(this.currentNodeData !== '' ? this.currentNodeData.orgId : this.data[0].orgId)
            setTimeout(() => {
              let a = document.querySelector(".is-current")
              a.firstChild.click()
            }, 200)
          } else {
            // 默认选中第一个
            const firstNode = document.querySelector('.el-tree-node')
            firstNode.click();
          }

          if (this.filterText) {
            this.$refs.tree.filter(this.filterText);
          }
        })
      }
    },
    queryDepartmentTree (backCurrent) {
      this.treeLoading = true
      authOrgListWithTree().then((res) => {
        if (res.length) {
          res.forEach((item, index, arr) => {
            if (item.orgName === '未分配分组' || item.createBy == 'unknow') {
              arr.splice(index, 1)
              arr.push(item)
            }
          })
        }
        this.setOrganizationalTreeList(res)
        this.handlerData(res, backCurrent)

      })
    },
    backToOriginTreeStatus () {
      this.$refs.tree.setCurrentKey(this.currentNodeData !== '' ? this.currentNodeData.orgId : this.data[0].orgId)
      this.$nextTick(() => {
        document.querySelector(".is-current").firstChild.click()
      })
    },
    changDepartmentName (curNodeData) {
      this.operationInfo.show = false
      // this.currentNodeData = curNodeData
      this.orgInfo.orgName = curNodeData.orgName
      this.orgInfo.orgId = curNodeData.orgId
      this.orgInfo.parentId = curNodeData.parentId
      this.orgInfo.parentName = curNodeData.parentName
      this.orgInfo.status = true
      this.popData.title = '重命名'
      this.popData.show = true
    },
    delDepartment (curNodeData) {
      this.operationInfo.show = false
      this.orgInfo.orgName = curNodeData.orgName
      this.orgInfo.orgId = curNodeData.orgId
      this.orgInfo.parentId = curNodeData.parentId
      this.orgInfo.status = false
      if (curNodeData.children && curNodeData.children.length !== 0) {
        this.$policeComfirm('你想删除的部门有子集部门，请先将部门下的子集部门转移或删除后，再进行此操作。', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        // this.popData.title = '提示'
        // this.popData.key = '删除部门'
        // this.popData.show = true
        // this.popData.text = '你想删除的部门有子集部门，请先将部门下的子集部门转移或删除后，再进行此操作。'
        return
      }
      queryUserByOrgId({ orgId: curNodeData.orgId }).then((res) => {
        if (res.content.length !== 0) {
          this.$policeComfirm('你想删除的部门有留存人员，请先将部门下的人员转移或删除后，再进行此操作。', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          // this.popData.title = '提示'
          // this.popData.key = '删除部门'
          // this.popData.show = true
          // this.popData.text = '你想删除的部门有留存人员，请先将部门下的人员转移或删除后，再进行此操作。'
          return
        } else {
          this.$policeComfirm('此操作将删除该部门, 是否继续?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            authOrgUpdate(this.orgInfo).then(() => {
              this.popData.show = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.queryDepartmentTree()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      })

    },
    confirm () {
      if (!this.orgInfo.orgName && !this.popData.key) {
        this.$message.info('请输入部门名称')
        return
      }
      // 新建部门时
      if (this.popData.title === '新建') {
        // console.log(this.orgInfo);
        authOrgCreate(this.orgInfo).then(() => {
          // console.log(res);
          this.popData.show = false
          this.resetpopData()
          this.queryDepartmentTree()
        })
      } else if (this.popData.title === '重命名') {
        console.log(this.orgInfo);
        authOrgUpdate(this.orgInfo).then(() => {
          this.popData.show = false
          this.resetpopData()
          this.queryDepartmentTree('backCurrent')
          // this.backToOriginTreeStatus()
        })
      } else if (this.popData.title === '提示' && this.popData.key === '停用') {
        this.arrageParams('disable')
        roleUpdateByRoleId(this.roleInfo.id, this.roleInfo).then(() => {
          this.closeDailog()
          this.backToOriginTreeStatus()
          this.$message.success('该角色禁用成功')
        })
      }
    },
    arrageParams (status) {
      this.roleInfo.id = this.currentRow.id
      this.roleInfo.status = status
    },
    closeDailog () {
      this.resetpopData()
      this.popData.text = ''
      this.popData.key = ''
      this.popData.show = false
    },
    cancleSubmit () {
      this.closeDailog()
    },
    resetpopData () {
      this.orgInfo = {
        orgId: 0,
        orgName: "",
        parentId: 0,
        status: true,
        parentName: ''
      }
    },
    openDailog () {
      this.popData.show = true
    },
    buildTree (curNodeData) {
      if (curNodeData.orgName) {
        this.operationInfo.show = false
        this.orgInfo.parentName = curNodeData.orgName
        this.orgInfo.parentId = curNodeData.orgId
        this.orgInfo.orgName = ''
      } else {
        delete this.orgInfo.orgId
        delete this.orgInfo.status
      }
      this.popData.title = '新建'
      this.popData.show = true
    },
    nodeClick (info, node, cur, type) {
      this.componentStatus = 'list'
      this.currentNodeData = info
      this.table.isLoading = true
      this.table.params.searchKey = ''
      this.table.params.orgId = info.orgId
      // console.log(info);
      this.readOnly = info.readOnly
      if (!type) {
        this.table.params.pageNum = 1
      }
      this.operationInfo.show = false
      queryRoleByOrgId(this.table.params).then((res) => {
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
    operationClick (node, data, e) {
      this.componentStatus = 'list'
      this.currentNodeData = data
      this.nodeLevel = node.level
      let rect = e.target.getBoundingClientRect()
      // console.log(rect);
      this.operationInfo.clientX = rect.x - 20 + 'px'
      if (e.clientY + 96 <= document.body.clientHeight) {
        this.operationInfo.clientY = rect.y + 15 + 'px'
      } else {
        this.operationInfo.clientY = rect.y -100 + 'px'
      }
      this.operationInfo.show = true
    },
  },
}
</script>

<style lang="less" scoped>
.departmentManagement {
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
      // height: calc(100vh - 240px);
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
        border-bottom: 1px solid rgba(81, 92, 124, 0.5) !important;
        border-radius: 2px;
        padding-left: 0;
        padding-right: 30px;
        &::placeholder {
          color: var(--input-placehold-color);
          font-size: 16px;
        }
      }
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
      float: right;
    }
    .operation_box {
      position: fixed;
      border: 1px solid var(--border-color-1);
      z-index: 888888888888888;
      ul {
        background-color: var(--datapicker-shijian-xiala-bg-color);
        box-shadow: 0px -1px 16px 1px var(--box-shadow-color);
        text-align: center;
        li {
          width: 85px;
          height: 32px;
          line-height: 32px;
          color: var(--base-text-color-2);
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          // padding-left: 38px;
          box-sizing: border-box;
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
      }
      .addRoleBtn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
  box-sizing: border-box;
  padding: 34px 12px 0 4px;
  .wirte_content {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .input_department_name {
      ::v-deep .el-input {
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
          // border-radius: 0 !important;
        }
      }
    }
    .txt {
      display: inline-block;
      width: 90px;
      color: var(--base-text-color-to-999999);
      font-size: 14px;
    }
    @media only screen and (min-width: 900px) and (max-width: 1280px) {
      .txt {
        width: 100px;
      }
    }
    .input_department_name {
      flex: 1;
    }
    .departmentName {
      color: var(--base-text-color-1);
    }
  }
  .tips {
    display: flex;
    align-items: center;
    .waring-icon {
      display: inline-block;
      color: #177ddb;
      font-size: 64px;
    }
    .warning_txt {
      padding-left: 15px;
      color: var(--base-text-color-1);
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    //padding: 8px 0 24px 0;
    box-sizing: border-box;
    margin-top: 54px;
    &.formBtn {
      box-sizing: border-box;
    }
    .blank_button {
      margin-right: 16px;
      padding-top: 7px;
      padding-bottom: 7px;
    }
    .submitButton {
      padding: 8px 20px;
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: inline-block;
      color: var(--white-color-to-333333);
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
