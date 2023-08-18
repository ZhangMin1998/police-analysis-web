<template>
  <div class="t-table">
    <div class="content-main">
      <div class="right">
        <el-button type="primary" @click="showPop"> 新建</el-button>
      </div>
      <div class="table-content-wrap">
        <template-table
          :tableData="table.tableData"
          :columns="table.columns"
          :tableHeight="tableHeight"
          :rowHeight="rowHeight"
          :btnRender="table.btnRender"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          @handleCurrentChange="handleCurrentChange"
        ></template-table>
      </div>
    </div>
    <!-- 角色 - 弹窗  -->
    <pop :pop.sync="Pop" @beforeClose="hidePop" @beforeOpen="showPop">
      <div>
        <el-form :rules="rules" ref="roleForm" :model="form" label-width="100px">
          <el-form-item label="角色名称：" prop="roleName" style="width: 500px">
            <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色权限：" style="width: 500px"> </el-form-item>
          <div class="rolePermission">
            <div class="parent">
              <el-form-item label="一级菜单：">
                <div
                  style="
                    border-bottom: 2px solid #3a455c;
                    width: 98%;
                    box-sizing: border-box;
                    padding: 0 12px;
                  "
                >
                  <el-checkbox
                    style="width: 155px; margin-right: 0"
                    v-for="(item) in parentList"
                    v-model="parentId"
                    :label="item.id"
                    :key="item.id"
                    @change="parentHandleChecked(item)"
                    >{{ item.itemName || '' }}</el-checkbox
                  >
                </div>
              </el-form-item>
            </div>
            <div class="children">
              <el-form-item label="二级菜单：">
                <div class="childrenBox">
                  <el-checkbox-group
                    v-model="childrenId"
                    @change="childrenhandleChecked(item)"
                    v-for="(item) in parentList"
                    :key="item.id"
                  >
                    <div style="width: 155px">
                      <el-checkbox
                        v-for="item in item.list"
                        :key="item.id"
                        :label="item.id"
                        name="type"
                        >{{ item.itemName || '' }}</el-checkbox
                      >
                    </div>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="right formBtn">
            <div class="blank_button mr16" @click="hidePop">取消</div>
            <el-button
              type="primary"
              @click="submitForm"
              :loading="loadingbut"
              >{{ loadingbuttext }}</el-button
            >
          </div>
        </el-form>
      </div>
    </pop>
  </div>
</template>

<script>
import TemplateTable from '@/components/VisualComponents/Table'
import Pop from '@/components/BasicComponents/Dialog'
import autoTableHeight from '@/mixins/autoTableHeight'

import {
  listRoleByPage,
  listPermissions,
  deleteRole,
  onOffRole,
  addRole,
  updateRole
} from '@/api/sysSetting'
import dayjs from '@/utils/filters'
const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

export default {
  components: {
    TemplateTable,
    Pop
  },
  mixins: [autoTableHeight],
  data () {
    return {
      Pop: {
        show: false,
        title: '新建角色',
        width: '70%',
        top: '100px'
      },
      topMenuIds: [],
      editId: '',
      loadingbut: false,
      loadingbuttext: '确定',
      rules: rules,
      parentList: [],
      parentId: [],
      childrenId: [],
      form: {
        roleName: '',
        menuIds: []
      },
      table: {
        tableData: [],
        columns: [
          {
            label: '权限用户数',
            prop: 'userNum',
            width: '100',
            type: 'nor'
          },
          { label: '序号', type: 'index', width: '80' },
          { label: '角色名称', prop: 'roleName', width: '220', type: 'nor' },

          {
            label: '创建时间',
            prop: 'createTime',
            width: '240',
            type: 'nor',
            renderFun: function (row) {
              if (!row.createTime) return '--'
              row.createTime = parseInt(row.createTime)
              return dayjs.filterSS(row.createTime)
            }
          },

          {
            label: '创建人',
            prop: 'createBy',
            width: '220',
            type: 'nor'
          },
          {
            label: '权限管理',
            prop: 'menuLists',
            minWidth: '180',
            type: 'nor',
            renderFun: function (row) {
              if (!row.menuList) return '--'
              if (row.menuList && !row.menuList.length) return '--'
              let arr = []
              row.menuList.forEach(element => {
                if (element && !element.hidden && element.parentId != 0) {
                  arr.push(element.itemName)
                }
              })
              return arr.join('；')
            }
          },
          {
            label: '状态',
            prop: 'status',
            width: '100',
            type: 'isOpen'
          }
        ],
        btnRender: [
          {
            label: '编辑',
            type: 'success',
            icon: 'icon-bianji',
            btnEvent: this.edit,
            alt: '编辑'
          },
          {
            label: '删除',
            type: 'rodeLine',
            icon: 'icon-delete',
            btnEvent: this.delete,
            alt: '删除'
          }
          // {
          //   label: '禁用',
          //   type: 'use',
          //   btnEvent: this.isUse,
          //   alt: '启用/禁用',
          //   iconA: 'sys-use-1',
          //   iconB: 'sys-use-0',
          // },
        ],
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },

  watch: {
    editId (val) {
      if (val) {
        this.Pop.title = '编辑角色'
      } else {
        this.Pop.title = '新建角色'
      }
    }
  },
  created () {
    Promise.all([listPermissions(), listRoleByPage(this.table.params)])
      .then(res => {
        // console.log(res);
        this.parentList = this.formatTree(res[0])
        this.table.tableData = res[1].content
        this.table.pageData.total = res[1].totalSize
      })
      .finally(() => {
        this.table.isLoading = false
      })
  },

  methods: {
    // 删除操作
    delete (row) {
      this.$policeComfirm(`确定要删除（${row.roleName}）角色吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteRole(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            this.loadImportantPage()
          })
        })
        .catch(() => {})
    },
    /**  ------------------  关系图 - 弹窗--------------------- */
    hidePop () {
      this.editId = ''
      this.form.roleName = ''
      this.parentId = []
      this.childrenId = []

      this.Pop.show = false
    },

    showPop () {
      this.Pop.show = true
    },
    /** 处理 树菜单 hidden 为true时 */
    formatTree (resList) {
      resList.forEach(element => {
        this.addTopMenuId(element.id)
      })

      // const firstMenu = resList.filter(element => {
      //   this.addTopMenuId(element.id)
      //   return element.hidden === 'false' || !element.hidden
      // })

      const firstMenu = resList.filter(element => {
        return element.hidden === 'false' || !element.hidden || element.itemName === '系统设置'
      })

      return firstMenu.map(element => {
        element.list =
          element.list &&
          element.list.filter(ele => {
            if (ele.hidden && ele.hidden !== 'false') {
              this.addTopMenuId(ele.id)
            }
            return ele.hidden === 'false' || !ele.hidden
          })
        return element
      })
    },

    addTopMenuId (id) {
      this.topMenuIds.push(id)
    },
    /** 树菜单 -> 一级菜单那  全选/全不选 */
    parentHandleChecked (i) {
      let allIdArr = i.list.map(ele => {
        return ele.id
      })

      this.childrenId.sort((a, b) => {
        return a - b
      })

      if (this.parentId.includes(i.id)) {
        // 包含 true 全选 false 取消全选
        this.parentId.push(i.id)
        this.parentId = Array.from(new Set(this.parentId))
        // 全选
        allIdArr.forEach(element => {
          this.childrenId.push(element)
        })
        this.childrenId = Array.from(new Set(this.childrenId))
      } else {
        // 取消全选
        let index = this.parentId.findIndex(item => item == i.id)
        if (index != -1) {
          this.parentId.splice(index, 1)
        }
        this.childrenId = this.childrenId.filter(item => !allIdArr.some(ele => ele === item))
      }
      // this.parentList[idx].isIndeterminate = false
    },

    /** 树菜单 -> 二级菜单 */
    childrenhandleChecked (i) {
      this.parentId.push(i.id)
      this.parentId = Array.from(new Set(this.parentId))
      let allIdArr = i.list.map(ele => {
        return ele.id
      })
      let checkedCount = this.getInclude1(allIdArr, this.childrenId).length

      // this.parentList[idx].isIndeterminate = checkedCount > 0 && checkedCount < allIdArr.length

      if (checkedCount == 0) {
        let index = this.parentId.findIndex(item => {
          return item == i.id
        })
        if (index != -1) {
          this.parentId.splice(index, 1)
        }
      } else if (checkedCount == allIdArr.length) {
        this.parentId.push(i.id)
        this.parentId = Array.from(new Set(this.parentId))
      }
    },

    /** arr2 是否包含arr1 */
    getInclude1 (arr1, arr2) {
      let temp = []
      for (const item of arr2) {
        arr1.find(i => i === item) ? temp.push(item) : ''
      }
      return temp
    },

    /** 打开编辑弹窗 */
    edit (row) {
      this.editId = row.id
      this.showPop()
      this.parentId = [...this.topMenuIds]
      row.menuList = row.menuList.filter(i => i)
      let list = row.menuList.filter(i => i.hidden != true && i.hidden != 'true')
      this.childrenId = list.map(i => {
        return i ? i.id : ''
      })

      this.parentId = Array.from(new Set(this.parentId))
      this.form.roleName = row.roleName
    },

    /** 表格 -> 禁用/启用 */
    isUse (e) {
      this.$policeComfirm(`确定要${e.status ? '禁用' : '启用'}吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          let role = {
            id: e.id,
            status: e.status ? 0 : 1
          }
          onOffRole(role).then(() => {
            this.$messageTip.success(e.status ? '禁用成功!' : '启用成功!')
            this.loadImportantPage()
          })
        })
        .catch(() => {})
    },

    /** 新增/编辑 提交表单 */
    submitForm () {
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          this.form.menuIds = this.childrenId.concat(this.topMenuIds)

          this.form.menuIds = Array.from(new Set(this.form.menuIds))

          if (this.editId) {
            this.form.id = this.editId
          }

          let postUrl = this.editId ? updateRole : addRole

          postUrl(this.form).then(() => {
            this.$messageTip.success(this.editId ? '修改成功!' : '添加成功!')
            this.hidePop()
            this.loadImportantPage()
          })
        }
      })
    },

    /** 加载分页表格 */
    loadImportantPage () {
      listRoleByPage(this.table.params)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
        })
    },

    /** 表格 -> 分页切换操作 */
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.loadImportantPage()
    }
  }
}
</script>

<style lang="less" scoped>
.t-table {
  box-sizing: border-box;
}
.content-main {
  padding: 16px !important;
}
.right {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0 24px 0;
  box-sizing: border-box;
  &.formBtn {
    padding: 24px 24px;
    box-sizing: border-box;
  }
}
.rolePermission {
  margin-left: 24px;
  box-sizing: border-box;
  background-color: rgba(47, 59, 83, 0.3);
  padding: 16px 0px;
  width: 95.5%;
  overflow: auto;
  .childrenBox {
    display: flex;
    width: 98%;
    height: 300px;
    box-sizing: border-box;
    padding: 0 12px;
  }
}
.parent /deep/.el-form-item__content {
  white-space: nowrap !important;
}
</style>
