<template>
  <div class="login">
    <!-- Welcome -->
    <div class="welcome">
      <img class="welcome-img" src="/static/img/Login-welcome.png" />
    </div>

    <!-- Logo -->
    <div class="bg2">
      <img src="/static/img/bigScreen-bg-jianbian.png" alt="" width="219" height="264" />
      <div class="bg1">
        <img src="/static/img/Login-suntang.png" alt="" width="160" height="50" />
      </div>
      <div class="bg3">
        <img src="/static/img/bigScreen-bg-yuan.png" alt="" width="142" height="76" />
      </div>
    </div>

    <!-- 登录面板 -->
    <main class="login-panel">
      <h1 class="login-panel-title">
        <div>欢迎登录</div>
        <div>公安多维大数据可视化平台</div>
      </h1>

      <el-form :model="loginForm" ref="loginForm" :rules="loginRules">
        <el-form-item prop="username" style="margin-bottom: 40px !important">
          <el-input
            v-model="loginForm.username"
            name="username"
            placeholder="请输入账号"
            class="lineInput"
          >
            <div slot="prefix" class="el-input__icon">
              <img :src="require('@/assets/img/Login-icon-0.png')" width="16" height="16" /></div
          ></el-input>
        </el-form-item>

        <el-form-item prop="oldPassWord" style="margin-bottom: 50px !important">
          <el-input
            show-password
            v-model="loginForm.oldPassWord"
            placeholder="请输入密码"
            class="lineInput"
            @keyup.enter.native="Login"
          >
            <div slot="prefix" class="el-input__icon">
              <img :src="require('@/assets/img/Login-icon-1.png')" width="16" height="16" />
            </div>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="Login" :loading="loadingBtn" class='login_btn'>{{
            loadingBtn ? '登录中...' : '登录'
          }}</el-button>
        </el-form-item>
      </el-form>
    </main>

    <!-- 商标 -->
    <footer class="banquan">
      © 2003-
      {{ curYear }}
      深圳市广道高新技术股份有限公司.保留所有权利。粤ICP备05110920号-1
    </footer>
  </div>
</template>
<script>
const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  oldPassWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
import { set_PublicKey, encrypt } from '@/utils/jsencrypt.js'
import { randomString, enByDES } from '@/utils/encryp.js'

export default {
  data () {
    return {
      loadingBtn: false,
      loginForm: {
        username: '',
        password: '',
        oldPassWord: '',
        sessionKey: '' // 随机8为字母
      },
      loginRules: loginRules,
      checked: false,
      curYear: new Date().getFullYear()
    }
  },

  created () {
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
  methods: {
    // 清除缓存变量和 vuex
    clearGlobals () {
      this.$store.state.Map.roomListData = []
      this.$store.state.Map.roomDeviceList = []
      sessionStorage.clear()
      // localStorage.clear()
      localStorage.removeItem('token')
      localStorage.removeItem('curMapWarnCurTab')
      localStorage.removeItem('personId')
    },
    // 初始化 用户配置
    initUserConfig (res) {
      let {
        centerLongitude,
        centerLatitude,
        zoom,
        zooms,
        online,
        applicationName,
        searchCity,
        selectOptions
      } = res.clientConfig

      const cityLatLon = {
        肇庆: [24.24, 112.52, 22.47, 111.21],
        安乡: [29.46, 112.18, 29.08, 110.59],
        威海: [37.35, 122.42, 36.41, 121.11],
        荣成: [38.27, 123.42, 35.45, 121.08]
      }
      let partAttr = {
        partX: 2, //局部访问设备列表
        partY: 2, //局部访问设备列表
        leftX: cityLatLon[searchCity][3],
        rightX: cityLatLon[searchCity][1],
        BottomY: cityLatLon[searchCity][2],
        TopY: cityLatLon[searchCity][0]
      }

      const tempConfig = {
        mapWarnShowList: ['Track', 'Feature'],
        //  mapWarnShowList: ['Track', 'Feature', 'Analysis', 'Area'],
        mapLanLonList: this.mapIntoPart(partAttr),
        centrePos: [centerLongitude, centerLatitude], //中心点

        // TODO:测试用中心点，记得删除
        // centrePos: [112.484848, 23.052101], //端州
        // centrePos: [112.171131, 29.411309], //安乡
        // centrePos: [122.116394,37.509691],//威海

        isOl: online,
        // TODO:在线离线地图，记得删除
        // isOl: false,

        title: applicationName, //标题
        optList: selectOptions, //下拉
        zoom, //层级
        zooms, //层级范围
        searchCity //搜索城市
      }
      // 判断是否是超级管理员
      this.$store.state.User.isAdmin = res.id === 1
      this.$store.commit('User/setSysConfig', tempConfig)
    },

    // 获取区域块list
    mapIntoPart (obj) {
      //区域所在经度/纬度
      //设置经纬度分为多少段
      const { leftX, rightX, BottomY, TopY, partX, partY } = obj

      //计算经纬度相差数量
      const differX = leftX - rightX
      const differY = BottomY - TopY
      //计算经纬度每段间隔多少
      const intervalX = differX / partX
      const intervalY = differY / partY
      // alert(intervalX+":"+intervalY);
      //以上参数设置完毕后，这里是按照从左到右的顺序来确定各个区域的经纬度

      let lX, lTopX, rTopX, rX
      let lY, lTopY, rTopY, rY
      let list = []
      for (var i = 0; i <= partX; i++) {
        for (var j = 0; j <= partY; j++) {
          var arr = new Array() //经纬度坐标数组

          lX = (leftX - intervalX * i).toString()
          lTopX = (leftX - intervalX * i).toString()
          rTopX = (leftX - intervalX * (i + 1)).toString()
          rX = (leftX - intervalX * (i + 1)).toString()

          lY = (BottomY - intervalY * j).toString()
          lTopY = (BottomY - intervalY * (j + 1)).toString()
          rTopY = (BottomY - intervalY * (j + 1)).toString()
          rY = (BottomY - intervalY * j).toString()

          arr.push({
            lng: parseFloat(lX),
            lat: parseFloat(lY)
          })
          arr.push({
            lng: parseFloat(lTopX),
            lat: parseFloat(lTopY)
          })
          arr.push({
            lng: parseFloat(rTopX),
            lat: parseFloat(rTopY)
          })
          arr.push({
            lng: parseFloat(rX),
            lat: parseFloat(rY)
          })
          list.push(arr)
        }
      }
      return list
    },

    /** 登录 */
    Login () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loadingBtn = true
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
              this.loadingBtn = false
              // 初始化配置
              this.initUserConfig(res)
              this.$nextTick(() => {
                this.$router.push({ name: 'bigScreenIndex' })
              })
              // 页面跳转
            })
            .catch(() => {
              this.loadingBtn = false
            })
        }
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 340px;
}

.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('/static/img/bigScreen-bg.png');
  background-size: 100% 100%;

  .banquan {
    color: @font-color-3;
    opacity: 0.6;
    line-height: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 4vh;
  }
  .bg2 {
    position: absolute;
    left: 25%;
    transform: translateX(-100%);
    top: 0;
    .bg1 {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 69px;
    }
    .bg3 {
      position: absolute;
      right: -71px;
      top: 137px;
    }
  }

  .login-panel {
    position: absolute;
    right: 20%;
    top: 50%;
    transform: translate(-0%, -58%);
    padding: 75px 56px 80px 43px;
    box-sizing: border-box;
    box-shadow: 0 0 8px rgba(8, 10, 15);
    background: linear-gradient(40deg, rgba(37, 45, 65, 0) 0%, #161e31 100%);
    .login-panel-title {
      margin-bottom: 50px;
      font-size: 24px;
      font-weight: bold;
      line-height: 36px;
      color: @font-color-3;
      letter-spacing: 2px;
    }
  }
}

.welcome {
  position: absolute;
  left: 20%;
  top: 40%;
  .welcome-img {
    width: 556px;
    height: 165px;
  }
}
.login_btn {
  padding: 8px 36px;
  font-size: 18px;
  color: #34395bff;
  font-weight: bold;
  border-radius: 0;
  background-color: #ffdaa6ff;
  letter-spacing: 4px;
}
</style>
