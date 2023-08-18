<template>
  <div class="userManage_con">
    <!-- <div class="use">
      <div class="all"></div>
      <div>
        <div></div>
      </div>
    </div> -->
    <div class="table">
      <div class="content-main">
        <form-search>
          <template slot="form">
            <div class="flex">
              <el-form class="table_form" @submit.native.prevent>
                <div>
                  <el-form-item style="width: 400px">
                    <el-input
                      v-model="table.params.searchKey"
                      placeholder="请输入关键字"
                      v-on:keyup.enter.native="searchEvent"
                    >
                      <i
                        slot="suffix"
                        style="cursor: pointer"
                        class="el-input__icon el-icon-search"
                        @click.prevent.stop="searchEvent"
                      ></i>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form>
              <div class="right">
                <el-button type="primary" class="submitButton out" @click="add"> 新建</el-button>
              </div>
            </div>
          </template>
        </form-search>

        <div class="table-content-wrap" style="box-sizing: border-box">
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
    </div>
    <!-- 新建 / 编辑 -->
    <div :class="screenHeight > 936 ? 'addFeature' : 'pop'">
      <el-dialog
        :visible="show"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :before-close="closeAddPopEvent"
        width="450px"
        top="16vh"
      >
        <span slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title :title="id ? '修改用户' : '新建用户'" />
          </div>
        </span>
        <div class="modalForm" id="adduser">
          <el-form :rules="rules" ref="form" :model="form" label-width="100px">
            <div v-for="item in formList" :key="item.key">
              <el-form-item
                :label="item.key"
                :prop="item.prop"
                :class="item.prop == 'username' && !id ? 'username' : ''"
              >
                <el-input
                  v-if="item.type == 'input'"
                  v-model="form[item.prop]"
                  :placeholder="`${'请输入' + item.key.substring(0, item.key.length - 1)}`"
                ></el-input>
                <el-select
                  v-else-if="item.type == 'select'"
                  v-model="form[item.prop]"
                  :placeholder="`${'请选择' + item.key.substring(0, item.key.length - 1)}`"
                  style="width: 100%"
                  multiple
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :value="item.id"
                    :label="item.roleName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span
                v-if="item.prop == 'username' && !id"
                style="color: #f56c6c; margin-left: 100px; line-height: 34px"
                >* 初始密码为123456</span
              >
            </div>

            <div class="right formBtn">
              <div class="blank_button mr8" @click="closeAddPopEvent">取消</div>
              <div class="blank_button mr8" @click="resetEvent">重置</div>
              <el-button
                type="primary"
                @click="submitForm"
                :loading="loadingbut"
                >{{ loadingbuttext }}</el-button
              >
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import autoTableHeight from '@/mixins/autoTableHeight'
import FormSearch from '@/components/VisualComponents/Table/formSearch'
import TemplateTable from '@/components/VisualComponents/Table'
import {
  listUserByPage,
  deleteUser,
  onOffUser,
  authorityListRoles,
  addUser,
  setDefaultPass,
  updateUser
} from '@/api/sysSetting'
import dayjs from '@/utils/filters'
const formList = [
  { key: '用户账号：', prop: 'username', type: 'input' },
  { key: '真实姓名：', prop: 'realName', type: 'input' },
  { key: '警员编号：', prop: 'jobNumber', type: 'input' },
  { key: '岗位名称：', prop: 'positionName', type: 'input' },
  { key: '角色分配：', prop: 'roleIds', type: 'select' },
  { key: '手机号码：', prop: 'phone', type: 'input' }
]
const columns = [
  {
    label: '创建时间',
    prop: 'createTime',
    width: '240',
    renderFun: function (row) {
      if (!row.createTime) return '--'
      row.createTime = parseInt(row.createTime)
      return dayjs.filterString(row.createTime)
    }
  },
  { label: '序号', width: '80', type: 'index' },
  { label: '用户账号', prop: 'username', width: '200' },
  { label: '警员编号', prop: 'jobNumber', width: '200' },
  { label: '真实姓名', prop: 'realName', width: '120' },
  { label: '岗位名称', prop: 'positionName', width: '180', type: 'nor' },
  { label: '创建人', prop: 'createBy', minWidth: '180', type: 'nor' },
  {
    label: '状态',
    prop: 'status',
    width: '120',
    type: 'isOpen'
  },
  {
    label: '系统角色',
    prop: 'userRoleList',
    minWidth: '180',
    renderFun: function (row) {
      if (row.userRoleList && !row.userRoleList.length) return '--'
      let list = row.userRoleList.map(item => {
        return item.roleName || ''
      })
      return list.join(';')
    }
  }
]
export default {
  components: {
    TemplateTable,
    FormSearch
  },
  mixins: [autoTableHeight],
  data () {
    let validate = (rule, value, callback) => {
      if (value && value.length == '0') {
        callback(new Error('至少选择一项角色分配'))
      } else {
        callback()
      }
    }
    let validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      row: {}, // 存值 重置按钮
      options: [], // 新建/编辑 -> 下拉分配角色列表
      loadingbut: false,
      loadingbuttext: '确定',
      formList: formList,
      id: '', //id  1. 无值 标识新建  2.有值 标识 编辑
      form: {
        username: '',
        realName: '',
        jobNumber: '',
        positionName: '',
        roleIds: [],
        phone: ''
      },
      show: false, //新增弹窗 -> 显示状态
      rules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        jobNumber: [{ required: true, message: '请输入警员编号', trigger: 'blur' }],
        positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        roleIds: [{ required: true, validator: validate, trigger: 'change' }],
        phone: [{ required: true, validator: validPhone, trigger: 'blur' }]
      },
      table: {
        tableData: [],
        columns: Object.freeze(columns),
        btnRender: [
          {
            label: '编辑',
            type: 'success',
            icon: 'icon-doc-pen',
            btnEvent: this.edit,
            alt: '编辑'
          },
          {
            label: '初始密码',
            type: 'resetPassword',
            icon: 'resetPassword',
            btnEvent: this.resetPassword,
            alt: '初始密码'
          },
          {
            label: '禁用',
            type: 'use',
            btnEvent: this.isUse,
            alt: '启用/禁用',
            iconA: 'sys-use-1',
            iconB: 'sys-use-0'
          },
          {
            label: '删除',
            type: 'rodeLine',
            icon: 'icon-drop',
            btnEvent: this.delete,
            alt: '删除'
          }
        ],

        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0,
          btnRenderWidth: 200
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 10,
          searchKey: ''
        }
      }
    }
  },

  created () {
    Promise.all([authorityListRoles(), listUserByPage(this.table.params)])
      .then(res => {
        this.options = res[0]
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
      this.$policeComfirm(`确定要删除（${row.realName}）用户吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteUser(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            this.loadTable()
          })
        })
        .catch(() => {})
    },

    /** 验证手机号码  */
    isvalidPhone (str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },

    /** 表格 -> 恢复初始密码  */
    resetPassword (row) {
      this.$policeComfirm('确定要恢复初始密码吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          setDefaultPass(row).then(() => {
            this.$messageTip.success('重置成功！')
            this.loadTable()
          })
        })
        .catch(() => {})
    },

    /** 表格 -> 编辑  */
    edit (row) {
      this.id = row.id
      row.roleIds = row.userRoleList.map(item => {
        return item.id
      })
      row.roleIds = Array.from(new Set(row.roleIds))
      this.row = JSON.stringify(row)
      this.form = JSON.parse(JSON.stringify(row))
      // 打开新建弹窗
      this.show = true
      this.$nextTick(function () {
        this.$refs.form.clearValidate()
      })
    },

    /** 表格 -> 启用/禁用 用户  */
    isUse (e) {
      this.$policeComfirm(`确定要${e.status ? '禁用' : '启用'}吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          let userReq = {
            id: e.id,
            status: e.status ? 0 : 1
          }
          onOffUser(userReq).then(() => {
            this.$messageTip.success(e.status ? '禁用成功!' : '启用成功!')
            this.loadTable()
          })
        })
        .catch(() => {})
    },

    /** 表格 -> 搜索  */
    searchEvent () {
      this.table.params.pageNum = 1
      this.table.pageData.curPage = 1
      this.loadTable()
    },

    /** 加载表格数据  */
    loadTable () {
      listUserByPage(this.table.params)
        .then(res => {
          this.table.tableData = res.content
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
        })
    },

    /** 分页切换操作  */
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.loadTable()
    },

    /** 表格 -> 新增  */
    add () {
      this.id = ''
      this.show = true
      this.resetFrom()
    },

    /** 新增/编辑 -> 重置密码  */
    resetFrom () {
      this.form = {
        username: '',
        realName: '',
        jobNumber: '',
        positionName: '',
        roleIds: [],
        phone: ''
      }

      this.$nextTick(function () {
        this.$refs.form.clearValidate()
      })
    },

    /** 关闭 新建/编辑 弹窗  */
    closeAddPopEvent () {
      this.show = false
    },

    /** 提交 新增/编辑 表单  */
    submitForm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let postUrl = this.id ? updateUser : addUser
          postUrl(this.form).then(() => {
            this.$messageTip.success(this.id ? '修改成功!' : '新建成功!')
            this.loadTable()
            this.closeAddPopEvent()
          })
        }
      })
    },

    /** 新增/编辑 重置按钮  */
    resetEvent () {
      // if (this.id) {
      //   this.form = JSON.parse(this.row)
      // } else {
      this.resetFrom()
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.content-main {
  box-sizing: border-box;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.userManage_con {
  margin: 5px;
  box-sizing: border-box;
  .use {
    width: 324px;
    margin-right: 16px;
    background-color: #27344d;
    box-sizing: border-box;
  }
  .table {
    flex: 1 1 auto;
  }
}
.right {
  &.formBtn {
    display: flex;
    justify-content: flex-end;
  }
}
/deep/ .el-form-item {
  margin-bottom: 24px !important;
  width: 350px;
}
#adduser .username {
  margin-bottom: 0 !important;
}
#adduser .username.is-error {
  margin-bottom: 18px !important;
}
</style>
