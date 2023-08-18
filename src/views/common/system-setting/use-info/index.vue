<template>
  <div class="user_container" id="user_container">
    <div class="box">
      <div class="user_header">
        <div @click="status = 0">
          <el-avatar :size="64" :src="circleUrl"></el-avatar>
        </div>
        <div :class="status == 1 ? 'isActive' : ''" @click="status = 1" v-permission="'useInfo:edit_account'">
          <i class="el-icon-edit-outline"></i>
          <span>修改账号</span>
        </div>
        <div :class="status == 2 ? 'isActive' : ''" @click="status = 2" v-permission="'useInfo:edit_password'">
          <i class="el-icon-edit-outline"></i>
          <span>修改密码</span>
        </div>
      </div>
      <div class="user_info">
        <template v-if="status == 0">
          <div v-for="(item) in keyList" :key="item.key" class="info_item">
            <span class="key">{{ item.key }}</span>

            <el-popover
              placement="top-start"
              v-if="form[item.prop] ? (form[item.prop].trim().length > 21 ? true : false) : false"
              width="200"
              trigger="hover"
              :content="form[item.prop] ? form[item.prop].toString() : '--'"
            >
              <span slot="reference">
                {{ form[item.prop] ? form[item.prop] : '--' | ellipsis(21) }}
              </span>
            </el-popover>
            <span v-else>{{ form[item.prop] ? form[item.prop].trim() : '--' }}</span>
          </div>
        </template>
        <template v-else-if="status == 1">
          <div class="modalForm">
            <el-form :rules="rules" ref="roleForm" :model="form" label-width="150px">
              <el-form-item label="用户账号：">
                <div>{{ form['username'] }}</div>
              </el-form-item>
              <el-form-item
                :label="item.key"
                :prop="item.prop"
                v-for="(item, idx) in inputList"
                :key="idx"
              >
                <el-input
                  v-model="form[item.prop]"
                  :placeholder="`请输入${item.key.substring(0, item.key.length - 1)}`"
                ></el-input>
              </el-form-item>
              <el-form-item label="系统角色：">
                <el-popover
                  placement="top-start"
                  v-if="
                    form['roleStr'] ? (form['roleStr'].trim().length > 25 ? true : false) : false
                  "
                  width="200"
                  trigger="hover"
                  :content="form['roleStr'] ? form['roleStr'].toString() : '--'"
                >
                  <div slot="reference">
                    {{ form['roleStr'] ? form['roleStr'] : '--' | ellipsis(25) }}
                  </div>
                </el-popover>
                <div v-else>
                  {{ form['roleStr'] ? form['roleStr'].trim() : '--' }}
                </div>
              </el-form-item>
              <div class="right">
                <div class="blank_button mr16" @click="cancel('roleForm')">取消</div>
                <el-button
                  type="primary"
                  class="submitButton"
                  @click="submitForm('roleForm')"
                  :loading="loadingbut"
                  >{{ loadingbuttext }}</el-button
                >
              </div>
            </el-form>
          </div>
        </template>
        <template v-else-if="status == 2">
          <div class="modalForm">
            <el-form
              :rules="passwordRules"
              ref="passwordForm"
              :model="passwordForm"
              label-width="150px"
            >
              <el-form-item
                :label="item.key"
                :prop="item.prop"
                v-for="(item, idx) in passwordList"
                :key="idx"
              >
                <el-input
                  v-model="passwordForm[item.prop]"
                  type="password"
                  @paste.native.capture.prevent="handlePaste(item.prop, $event)"
                  :placeholder="`${
                    item.key == '确认密码：'
                      ? '请再输入一次新密码'
                      : '请输入' + item.key.substring(0, item.key.length - 1)
                  }`"
                ></el-input>
              </el-form-item>
              <div class="right">
                <div class="blank_button mr16" @click="cancel('passwordForm')">取消</div>
                <el-button
                  type="primary"
                  class="submitButton"
                  @click="submitForm('passwordForm')"
                  :loading="loadingbut"
                  >{{ loadingbuttext }}</el-button
                >
              </div>
            </el-form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  authorityById,
  upCurrentUser,
  alter_password
} from '@/api/sysSetting'
const inputList = [
  { key: '警员编号：', prop: 'jobNumber' },
  { key: '真实姓名：', prop: 'realName' },
  { key: '岗位名称：', prop: 'positionName' }
]
const passwordList = [
  { key: '原密码：', prop: 'oldPassword' },
  { key: '新密码：', prop: 'newPassword' },
  { key: '确认密码：', prop: 'confirmPassword' }
]
const keyList = [
  { key: '用户账号：', prop: 'username' },
  { key: '警员编号：', prop: 'jobNumber' },
  { key: '真实姓名：', prop: 'realName' },
  { key: '岗位名称：', prop: 'positionName' },
  { key: '系统角色：', prop: 'roleStr' }
]
const rules = {
  jobNumber: [{ required: true, message: '请输入警员编号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
}

export default {
  data () {
    return {
      data: {},
      circleUrl:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      keyList: keyList,
      status: 0, //0:显示 1修改账号 2修改密码
      rules: rules,
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            required: true,
            pattern: /^[^\u4e00-\u9fa5 ]{8,16}$/,
            message: '只允许输入8-16位的数字、字符或字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            required: true,
            pattern: /^[^\u4e00-\u9fa5 ]{8,16}$/,
            message: '只允许输入8-16位的数字、字符或字符',
            trigger: 'blur'
          }
        ]
      },
      loadingbut: false,
      loadingbuttext: '确定',
      form: {},
      inputList: inputList,
      passwordList: passwordList,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordParams: {}
    }
  },

  watch: {
    status () {
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      if (this.$refs['passwordForm']) {
        this.$refs['passwordForm'].resetFields()
      }
      if (this.$refs['roleForm']) {
        this.$refs['roleForm'].resetFields()
      }
    }
  },

  created () {
    this.queryInfo()
  },

  methods: {
    submitForm (formName) {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$messageTip.error('两次输入密码不一致!')
        return false
      }
      let reqUrl = upCurrentUser
      if (formName == 'passwordForm') {
        this.passwordParams.password = this.CalcuMD5(
          this.passwordForm.newPassword
        )
        this.passwordParams.oldPassword = this.CalcuMD5(
          this.passwordForm.oldPassword
        )
        reqUrl = alter_password
      }
      this.form.userId = localStorage.getItem('personId')
      this.$refs[formName].validate(valid => {
        if (valid) {
          reqUrl(
            formName == 'passwordForm' ? this.passwordParams : this.form
          ).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            setTimeout(() => {
              this.cancel(formName)
            }, 500)
          })
        }
      })
    },
    handlePaste (key, e) {
      if (key !== 'confirmPassword') {
        var clip = e.clipboardData.getData('Text');
        this.passwordForm[key] = clip;
      }
    },

    queryInfo () {
      authorityById(localStorage.getItem('personId')).then(res => {
        if (res.id == '1') {
          res.roleStr = '超级管理员'
        } else {
          let arr = res.userRoleList.map(item => {
            return item.roleName
          })
          res.roleStr = arr.join('；')
        }
        this.form = res
        this.data = res
      })
    },

    cancel (formName) {
      if (formName == 'passwordForm') {
        this.$refs[formName].resetFields()
      } else {
        this.queryInfo()
      }
      this.status = 0
    },
    CalcuMD5 (pwd) {
      // pwd = pwd.toUpperCase();
      pwd = this.$md5(pwd)
      return pwd
    }
  }
}
</script>

<style lang="less" scoped>
.user_container {
  letter-spacing: 4px;
  width: 100%;
  height: calc(100vh - 104px);
  display: flex;
  justify-content: center;
  align-content: center;
  color: var(--base-text-color-1);
  padding-right: 6.5%;
  box-sizing: border-box;
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 800px;
  }
  .user_header {
    display: flex;
    align-items: center;
    margin-left: 200px;
    margin-bottom: 40px;
    div {
      cursor: pointer;
      &.isActive {
        color: var(--active-color);
      }
      &:hover {
        color: var(--active-color);
      }
      i {
        margin-right: 4px;
      }
      margin-right: 24px;
      &:first-child {
        margin-right: 35px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .user_info {
    margin-left: 200px;
    .key {
      color: var(--base-text-color-to-999999);
      margin-right: 23px;
      width: 120px;
    }
    .info_item {
      margin-bottom: 40px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
.right {
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  .blank_button {
    letter-spacing: 0px;
  }
}
/deep/ .el-form-item {
  margin-bottom: 40px !important;
  width: 100%;
}
</style>
