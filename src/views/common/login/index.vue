<template>
  <div id="login">
    <div v-if="this.loginSettings.loginVersion">
      <div class="copyright" v-if="this.loginSettings.loginVersion === 'common'">
        © 2003-
        {{ curYear }}
        深圳市广道高新技术股份有限公司.保留所有权利。粤ICP备05110920号-1
      </div>
      <div class="company-info" :class="{ 'proclass': this.loginSettings.loginVersion === 'pro' }">
        <div class='police_info' v-if="this.loginSettings.loginVersion === 'pro'">
          <img class="police_logo" src="@/assets/img/police-logo.png" alt="" />
          <div class='info_tip'>
            <div class='chi_info'>
              <div class="loginCity">
                {{ this.loginSettings.loginCity || '荣成' }}
              </div>
              <div class="login_police">
                <img src="@/assets/img/login-police.png">
              </div>
            </div>
            <div class='eng_info'>{{ this.loginSettings.cityPinYin || 'Rongcheng' }} Police</div>
          </div>
        </div>
        <div v-else>
          <img class="info" src="@/assets/img/company-info.png" alt="" />
          <img class="bedeck" src="@/assets/img/login-bg3.png" alt="" />
        </div>
      </div>
      <Dialog :pop.sync="dialog" class="login_dialog" @beforeClose="closeDialog" @beforeOpen="openDialog">
        <div style="display: flex; align-items: center; justify-content: flex-start">
          <i class="iconfont icon-danchuangtishi"></i>
          <div style="margin-left: 16px; color: #c0d0e7">
            <div v-if="dialog.showType === 4">请确认是否提交申请？</div>
            <div v-if="dialog.showType === 1">一周内只能申请三次，请下周再申请。</div>
            <div v-if="dialog.showType === 2">申请重置密码成功，请等待管理员审批。</div>
            <div v-if="dialog.showType === 3">已申请重置密码，请勿重复申请。</div>
          </div>
        </div>
        <div style="float: right; margin-top: 30px" v-if="dialog.showType === 4">
          <el-button class="fouButton" type="primary" @click="closeDialog">否</el-button>
          <el-button class="yesButton" type="primary" @click="yes">是</el-button>
        </div>
      </Dialog>

      <div class="login_panel" v-if="isShowPanel === 1">
        <div class="login_logo">
          <img v-if="this.loginSettings.loginVersion === 'common'" src="@/assets/img/login-logo.png" alt="" />
          <img v-else src="@/assets/img/police-logo.png" alt="" />
          <!-- <div class="system_name">公安多维数据研判平台</div> -->
          <div class="system_name">{{ this.loginSettings.loginTitle || '公安多维数据研判平台' }}</div>
        </div>

        <el-form :model="loginForm" ref="loginForm" :rules="loginRules" :validate-on-rule-change="false" key="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" name="username" placeholder="账号">
              <i slot="suffix" class="iconfont icon-yonghu"></i>
            </el-input>
          </el-form-item>

          <el-form-item prop="oldPassWord" :class="{ is_auth_code: isFiveError }">
            <el-input show-password v-model="loginForm.oldPassWord" placeholder="密码" @keyup.enter.native="Login"
              @blur="isShowPassword = true" @focus="isShowPassword = false">
              <div v-show="loginForm.oldPassWord == '' && isShowPassword" slot="suffix" class="el-input__icon"
                style="cursor: pointer">
                <i class="el-input__icon el-icon-view el-input__clear"></i>
              </div>
            </el-input>
          </el-form-item>

          <el-form-item v-if="isFiveError" prop="kaptchaSessionKey"
            style="margin-bottom: 12px !important; display: flex; justify-content: center">
            <div class="auth-code">
              <el-input v-model="loginForm.kaptchaSessionKey" name="kaptchaSessionKey" placeholder="验证码">
                <i slot="suffix" class="iconfont icon-yanzhengma"></i>
              </el-input>
              <el-image id="verifyImage" :src="origin + imageUrl" fit="cover" @click="uploadImage" alt="验证码"
                title="验证码"></el-image>
            </div>
          </el-form-item>
          <div class="login_btn">
            <div v-if="redWarning" :key="111" class="error_tip">
              <i class="iconfont icon-cuowutishi"></i>
              <span>{{ redWarning }}</span>
            </div>
            <el-button @click="Login" type="primary" :loading="loadingBtn">
              {{ loadingBtn ? '登录中...' : '登录' }}
            </el-button>
          </div>
          <div @click="forgetPassword" class="forget_password">忘记密码？</div>
        </el-form>
      </div>
      <div class="login_panel" v-if="isShowPanel === 2">
        <div class="title_box">
          <div class="title">申请重置密码</div>
          <div class="tip_box">
            <i class="iconfont icon-zhushi"></i>
            <div class="tip">1周内只能提交3次申请，请注意提交次数</div>
          </div>
        </div>
        <el-form :model="resetForm" ref="resetForm" :rules="resetRules" :validate-on-rule-change="false" key="resetForm">
          <el-form-item prop="username">
            <el-input v-model="resetForm.username" name="username" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input v-model="resetForm.realName" name="realName" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item prop="jobNumber">
            <el-input v-model="resetForm.jobNumber" name="jobNumber" placeholder="警员编号"></el-input>
          </el-form-item>
          <div class="apply_password">
            <div class="apply_btn" @click="cancelForm('resetForm')">取消</div>
            <div class="apply_btn apply_submit" @click="submitResetForm('resetForm')">确定</div>
          </div>
        </el-form>
      </div>
      <div class="login_panel" v-if="isShowPanel === 3">
        <div class="title_box">
          <div class="title">设置密码</div>
          <div class="tip_box">
            <i class="iconfont icon-zhushi"></i>
            <div class="tip">首次登陆，请先设置密码</div>
          </div>
        </div>
        <el-form :model="setFirstForm" ref="setFirstForm" :rules="setRules" :validate-on-rule-change="false">
          <el-form-item prop="newPassword">
            <el-input type="password" v-model="setFirstForm.newPassword" name="newPassword" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="setFirstForm.password" name="password"
              @paste.native.capture.prevent="handlePaste" @keyup.enter.native="submitSetPassword('setFirstForm')"
              placeholder="确认密码"></el-input>
          </el-form-item>
          <div class="apply_password">
            <div class="apply_btn" @click="cancelForm('setFirstForm')">取消</div>
            <div class="apply_btn apply_submit" @click="submitSetPassword('setFirstForm')">确定</div>
          </div>
        </el-form>
      </div>
      <div class="maintain" v-if="isShowPanel === 4">
        <img class="pic" src="@/assets/img/maintain.png" alt="">
        <span class="text">
            {{ this.loginSettings.maintainDesc || '系统维护中' }}
        </span>
        <div class="time"> {{ this.loginSettings.maintainTime || new Date() }}</div>
      </div>
      <div class="form_bedeck">
        <img src="@/assets/img/login-bedeck.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import warterMark from "@/utils/waterMark"
import { set_PublicKey, encrypt } from '@/utils/jsencrypt.js'
import { randomString, enByDES } from '@/utils/encryp.js'
import { getSysMenu, getVerifyImage, setFirstPassword, resetPassword, getloginSettings } from '@/api/login'
import { pinyin } from 'pinyin-pro'
import Dialog from '@/components/BasicComponents/Dialog'
import { initUserConfig } from '@/views/common/login/login.js'


const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  oldPassWord: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  kaptchaSessionKey: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const resetRules = {
  username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  jobNumber: [{ required: true, message: '请输入警员编号', trigger: 'blur' }]
}

export default {
  components: {
    Dialog
  },
  data () {
    let reg = /^[^\u4e00-\u9fa5 ]{8,16}$/
    var validatePass = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入8-16位的数字、字母或字符'));
        }

      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次确认密码'));
      } else if (value !== this.setFirstForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback()
      }
    };
    return {
      loadingBtn: false,
      loginRules: loginRules,
      resetRules: resetRules,
      loginForm: {
        username: '',
        password: '',
        oldPassWord: '',
        sessionKey: '', // 随机8为字母
        kaptchaSessionKey: '',
        imageUrl: '',
        type: 'web'
      },
      resetForm: {
        username: '',
        realName: '',
        jobNumber: ''
      },
      tempPassword: '',
      setFirstForm: {
        newPassword: '',
        password: '',
        id: null
      },
      setRules: {
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        password: [{ validator: validatePass2, trigger: 'blur' }]
      },
      isShowPassword: true,
      curYear: new Date().getFullYear(),
      imageUrl: '',
      isShowPanel: 1, // 显示哪类表单
      isFiveError: false, //是否显示验证码
      dialog: {
        show: false,
        title: '提示',
        width: '500px',
        top: '300px',
        showType: 1
      },
      redWarning: '',
      loginSettings: {
        loginTitle: '',
        loginVersion: '',
        loginCity: '',
        cityPinYin: '',
        isMaintain:'',
        maintainDesc:'',
        maintainTime:''
      }
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  watch: {
    '$store.state.Common.passwordErrorTimes': function (newval) {
      if (Number(newval) > 3) {
        this.isFiveError = true
        this.uploadImage()
      }
    },
  },

  created () {
    this.getSettings()
    // 清除缓存
    this.clearGlobals()
    this.$store.commit('Common/LogoutSys')

    this.loginForm.sessionKey = randomString(false, 8)
    /** 1. 保存随机码 用于解密 */
    localStorage.setItem(
      'PrivateKey',
      enByDES(this.loginForm.sessionKey, this.$store.state.User.privateKeyStr)
    )

    /** 2. 获取公钥 用于加密 */
    this.obtainPbKey()
  },
  mounted () {
    warterMark.set(' ')
  },
  methods: {
    getSettings () {
      // 如果300ms请求都没回来，那么直接去缓存里读取上一次的。防止请求太慢导致页面出不来
      setTimeout(() => {
        if (!this.loginSettings.loginTitle) {
          let loginSettings = JSON.parse(window.localStorage.getItem('loginSettings'))
          this.loginSettings = { ...loginSettings }
        }
      }, 300)
      getloginSettings().then((res) => {
        if (res.length) {
          res.forEach((item) => {
            this.loginSettings[item.key] = item.value
          })
          if (this.loginSettings.loginCity) {
            this.loginSettings.cityPinYin = this.toUpperCase(pinyin(this.loginSettings.loginCity, { toneType: 'none' }))
          }
          window.localStorage.setItem('loginSettings', JSON.stringify(this.loginSettings))
          // 存配置数组
          this.$store.commit('User/setLoginSettings', res)
          // 存单个的配置
          this.$store.commit('User/setSysConfig', this.loginSettings)
        } else {
          this.$policeComfirm('系统还未初始化，请先进行初始化操作', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
            .then(() => {
              this.$router.push('/ol/initial')
            })
            .catch(() => { })
        }

      })
    },
    toUpperCase (str) {
      // 将字符串以空格分割成数组
      let arr = str.split(' ')
      // 对数组内容进行处理
      arr = arr.map(item => item[0].toUpperCase() + item.substr(1).toLowerCase())
      // 将处理后的数组以空格分割转换为字符串
      return arr.join('')
    },
    handlePaste () { },
    // 清除缓存变量和 vuex
    clearGlobals () {
      this.$store.state.Map.roomListData = []
      this.$store.state.Map.roomDeviceList = []
      sessionStorage.clear()
      // localStorage.clear()
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('curMapWarnCurTab')
      localStorage.removeItem('personId')
    },
    /** 登录 */
    Login () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loadingBtn = true
          this.tempPassword = this.CalcuMD5(this.loginForm.oldPassWord)
          this.loginForm.password = this.CalcuMD5(this.loginForm.oldPassWord)

          /** 3. 登录参数 加上key:8位随机码  转为字符串 在进行rsa加密*/
          let loginParams = JSON.parse(JSON.stringify(this.loginForm))
          delete loginParams.oldPassWord
          this.$store
            .dispatch(
              'Common/Login',
              localStorage.getItem('encOpen') == 'true'
                ? encrypt(JSON.stringify(loginParams))
                : loginParams
            )
            .then(res => {
              console.log(this.loginSettings.isMaintain);
              if(this.loginSettings.isMaintain ==='true' && res.username !== 'admin'){
                this.isShowPanel = 4
                return
              }
              // 初始化配置
              initUserConfig(res)
              // 保存用户信息
              this.$store.commit('User/setUserInfo', res)
              if (res.firstLogin) {
                this.setFirstForm.id = res.id
                this.$router.push({ name: 'login' })
                this.isShowPanel = 3
              } else {
                // this.loadingBtn = false
                this.switchRouter(res)
              }
            })
            .catch(err => {
              console.log(err)
              if (err.toString().split(':')[1].trim() === '账号或者密码错误' || err.toString().split(':')[1].trim() === '验证码有误！') {
                this.redWarning = err.toString().split(':')[1]
              }
              this.loadingBtn = false
            })
        }
      })
    },
    switchRouter (userInfo) {
      // 解决初始化时没有初始化设备地图又固定跳转到设备地图的问题，解决设备地图没有权限还跳转设备地图的问题
      getSysMenu()
        .then((res) => {
          // console.log(res);
          let pushName
          let defaultJump = res.menuList.filter((item) => {
            return item.itemName === '全库搜索' && !item.hidden
          })
          if (defaultJump.length) {
            // 系统初始化之后有全库搜索这个大菜单(且状态为显示)，则默认跳转到全库搜索
            if (defaultJump[0].list.length) {
              pushName = defaultJump[0].list[0].pathName
            } else {
              pushName = 'NotPermission' + defaultJump[0].id
            }
          } else {
            // 初始化后没有全库搜索,则跳转到第一个大菜单
            try {
              res.menuList.forEach((item) => {
                if (!item.hidden && item.list.length !== 0) {
                  // 跳转到系统初始化后有菜单的第一个大菜单
                  pushName = item.list[0].pathName
                  throw new Error('break')
                } else if (!item.hidden && item.list.length === 0) {
                  // 这里处理权限被禁止后，如果有设备地图，那么就跳转到设备地图的无权限页面
                  if (item.itemName === '设备地图') {
                    pushName = item.urlPath.split('/')[1]
                  } else {
                    // 这里处理权限被禁止后，如果没有设备地图，那么进入第一个大菜单的无权限页面
                    pushName = 'NotPermission' + item.id
                  }
                  throw new Error('break')
                }
              })
              this.loadingBtn = false
            } catch (err) {
              console.log(err);
            }
          }

          // this.$router.push({ name: pushName })
          this.$nextTick(() => {
            // 登录成功回到原来的界面
            const _redirect = this.$route.query.redirect
            if (_redirect) {
              this.$router.push(_redirect)
            } else {
              this.$router.push({ name: pushName })
            }
            let localUserWarnShow = JSON.parse(localStorage.getItem('localUserWarnShow')) || {}
            if (!localUserWarnShow[userInfo.username]) {
              localUserWarnShow[userInfo.username] = 'show'
              localStorage.setItem('localUserWarnShow', JSON.stringify(localUserWarnShow))
            }
          })
        }).catch(() => {
          this.loadingBtn = false
        })
    },
    CalcuMD5 (pwd) {
      // pwd = pwd.toUpperCase();
      pwd = this.$md5(pwd)
      return pwd
    },
    obtainPbKey () {
      this.$store.dispatch('Common/obtainKey').then(res => {
        localStorage.setItem('encOpen', res.encOpen)
        set_PublicKey(res.publicKey)
      })
    },
    // 获取验证码图片
    uploadImage () {
      getVerifyImage().then(res => {
        this.imageUrl = ''
        this.imageUrl = res
        this.loginForm.imageUrl = ''
        this.loginForm.imageUrl = this.imageUrl
      }).finally(() => {

      })
      // this.$nextTick(()=>{
      // this.imageUrl = 'http://192.168.7.51:8080/police/login/oauth/kaptcha?t=' + new Date().getTime()
      // })
    },
    // 点击忘记密码
    forgetPassword () {
      this.$refs['loginForm'].resetFields()
      this.isShowPanel = 2
      this.resetForm = {
        username: '',
        realName: '',
        jobNumber: ''
      }
    },
    // 确定申请重置密码
    submitResetForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialog.show = true
          this.dialog.showType = 4
        }
      })
    },
    yes () {
      this.dialog.show = false
      resetPassword(this.resetForm).then(res => {
        if (res.code === 1 && res.msg === 'success') {
          this.cancelForm('resetForm')
          this.resetForm.jobNumber = ''
          this.dialog.show = true
          this.dialog.showType = Number(res.data.status)
        } else {
          this.$messageTip.error(res.msg)
        }
      }).finally(() => { })
    },
    // 取消申请重置或设置密码
    cancelForm (formName) {
      this.$refs[formName].resetFields()
      this.isShowPanel = 1
      this.loadingBtn = false
    },
    // 确定首次登录设置密码
    submitSetPassword (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            id: this.setFirstForm.id,
            password: this.CalcuMD5(this.setFirstForm.password),
            oldPassword: this.tempPassword
          }
          setFirstPassword(params).then(res => {
            this.$messageTip.success('修改成功!')
            // this.cancelForm('setFirstForm')
            let params = {
              id: res.data.id,
              username: res.data.username,
              token: res.data.token
            }
            this.$store.commit('Common/LoginSys', params)
          }).finally(() => {
            this.loadingBtn = false
            // this.$router.push({ name: 'devicemap' })
            this.switchRouter()
          })
        }
      })
    },
    openDialog () {

    },
    closeDialog () {
      this.dialog.show = false
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 100vw;
  height: 100vh;
  background-image: url('/static/img/login-bg0.png');
  background-size: 100% 100%;
  position: relative;

  .bew {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--base-text-color-to-999999);

    div {
      cursor: pointer;
    }

    .el-checkbox {
      color: var(--base-text-color-to-999999) !important;
    }
  }

  .copyright {
    position: absolute;
    left: 50%;
    bottom: 38px;
    transform: translateX(-50%);
    color: #657494;
    font-size: 16px;
    line-height: 21px;
  }

  .company-info {
    position: absolute;
    left: 250px;
    display: flex;
    justify-content: center;
    font-size: 26px;
    color: #fff;
    width: 220px;
    height: 274px;
    line-height: 150px;
    background-image: url('~@/assets/img/company-bg.png');
    background-size: 100% 100%;

    .police_info {
      display: flex;
      padding-top: 58px;
      height: 56px;

      img {
        width: 66px;
        height: 56px;
        margin-right: 10px;
      }

      .info_tip {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 1;
        padding: 4px 0;

        .chi_info {
          display: flex;

          .loginCity {
            font-size: 24px;
            color: #f4f6f6;
            letter-spacing: 6px
          }

          // text-shadow: 0px 2px 3px white;
          .login_police {
            width: 70px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              object-fit: contain;
              width: 100%;
            }
          }

          // font-weight: bold;
        }

        .eng_info {
          font-size: 12px;
          letter-spacing: 1px;
          text-align: center;
          color: #f4f6f6;
          // text-shadow: 0px 2px 3px white;
        }
      }
    }

    .info {
      width: 112px;
      height: 32px;
      margin-top: 70px;
    }

    .bedeck {
      position: absolute;
      top: 136px;
      right: -71px;
      width: 142px;
      height: 74px;
    }
  }

  .proclass {
    width: auto;
    padding: 0 12px;
  }

  .cancelButton {
    width: 130px;
    height: 40px;
    color: #1890ff;
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 2px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }

  .button {
    width: 130px;
    height: 40px;
    color: @font-color-3;
    background-color: rgba(24, 144, 255, 0.8) !important;
    border: none !important;
    border-radius: 0 !important;

    &:hover {
      background-color: #1890ff !important;
    }
  }

  .login_panel {
    position: absolute;
    background-color: rgba(25, 32, 53, 0.87);
    padding: 60px 42px;
    right: 370px;
    top: 50%;
    transform: translate(-0%, -58%);
    z-index: 10;

    .login_logo {
      display: flex;
      align-items: center;
      margin-bottom: 78px;
      padding: 0 6px;

      img {
        width: 75px;
        height: 64px;
        margin-right: 5px;
      }

      .system_name {
        font-size: 24px;
        letter-spacing: 4px;
        color: @font-color-3;
      }
    }

    .title_box {
      box-sizing: border-box;
      padding: 22px 6px 76px;

      .title {
        font-size: 24px;
        letter-spacing: 4px;
        color: @font-color-3;
        line-height: 24px;
        margin-bottom: 13px;
      }

      .tip_box {
        display: flex;
        align-items: center;
        font-size: 16px;
        // color: var(--active-color);
        color: #3d6eff;

        i {
          line-height: 16px;
          margin-right: 8px;
        }

        .tip {
          line-height: 21px;
          // color: var(--base-text-color-1);
          color: #c0d0e7;
        }
      }
    }

    /deep/.el-form {
      .el-form-item {
        margin-bottom: 55px !important;

        &.is_auth_code {
          margin-bottom: 41px !important;
        }

        .el-form-item__content {
          line-height: 33px;

          .auth-code {
            display: flex;
            align-items: flex-end;

            .el-input {
              flex: 1;
              width: auto;
              padding: 0;
            }

            .el-image {
              flex: none;
              margin-left: 26px;
              width: 114px;
              height: 48px;
            }
          }

          .el-input {
            padding: 0 6px;
            width: 364px;

            .el-input__inner {
              color: #c0d0e7;
              font-size: 16px;
              height: 34px;
              line-height: 33px;
              border: 0;
              border-bottom: 1px solid rgba(81, 92, 124, 0.5) !important;
              padding-left: 12px;

              &::placeholder {
                color: #657494;
                // color: var(--input-placehold-color);
              }
            }
            // @media screen and (min-width: 1024px) and (max-width: 1365px) {
            //   @-moz-document url-prefix(){
            //     .el-input__inner{
            //       font-size: 26px !important;
            //     }
            //   }
            // }
          }

          .el-form-item__error {
            padding-left: 6px;
          }
        }
      }

      .login_btn {
        position: relative;
        width: 100%;
        margin-top: 72px;

        .el-button {
          width: 100%;
          border-color: #3D6EFF;
          background: #3D6EFF !important;
          padding: 0px 24px !important;
          font-size: 20px;
          line-height: 46px;

          &:hover {
            background-color: #1890ff !important;
          }
        }
      }

      .forget_password {
        float: right;
        margin-top: 13px;
        margin-right: 8px;
        font-size: 16px;
        line-height: 21px;
        color: #657494;
        cursor: pointer;
      }

      .apply_password {
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        margin-top: 72px;
        margin-bottom: 2px;

        .apply_btn {
          padding: 13px 48px;
          font-size: 20px;
          line-height: 20px;
          // color: var(--base-text-color-1);
          color: #c0d0e7;
          border-radius: 2px;
          border: 1px solid #515c7c;
          cursor: pointer;

          &:hover {
            background-color: rgba(255, 255, 255, 0.2) !important;
          }
        }

        .apply_submit {
          background: #3D6EFF;
          border-color: #3D6EFF;
          color: @font-color-3;
          margin-left: 16px;

          &:hover {
            background-color: #1890ff !important;
          }
        }
      }
    }
  }
  .maintain{
    box-sizing: border-box;
    position: absolute;
    background-color: rgba(25, 32, 53, 0.87);
    width: 1076px;
    height: 580px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 64px;
    .pic{
      width: 187px;
      height: 177px;
      margin-top: 144px;
    }
    .text{
      margin-top: 100px;
      font-size: 18px;
      line-height: 40px;
    }
    .time{
      width: 100%;
      text-align: right;
      margin-top: 40px;
    }
  }

  .form_bedeck {
    position: absolute;
    bottom: 17%;
    right: 495px;
    z-index: 1;

    img {
      width: 210px;
      height: 74px;
    }
  }

  /deep/.title-box {
    border-bottom: 1px solid #3D6EFF;

    .set {
      color: #C0D0E7;
    }
  }

  .fouButton {
    color: #C0D0E7;
    width: 80px;
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }

  .yesButton {
    width: 80px;
    border-color: #3D6EFF;
    background: #3D6EFF !important;

    &:hover {
      background-color: #1890ff !important;
    }
  }
}

.icon-danchuangtishi {
  font-size: 64px;
  color: #3D6EFF;
}

.error_tip {
  display: flex;
  align-items: center;
  color: @font-color-4;
  position: absolute;
  top: -28px;

  .icon-cuowutishi {
    font-size: 16px;
    line-height: 16px;
  }

  span {
    font-size: 14px;
    line-height: 16px;
    margin-left: 8px;
  }
}

.icon-yanzhengma {
  font-size: 16px;
  color: var(--base-text-color-to-999999);
}

.icon-yonghu {
  font-size: 16px;
  color: #657494;
  margin-right: 4px;
}

/deep/.el-icon-view {
  font-size: 16px;
  color: #657494;
}

.login_dialog {
  ::v-deep .addFeature .el-dialog {
    background-color: rgba(39, 52, 77, 0.95) !important;
  }
}
</style>
