<template>
  <div id="login">
    <div v-if="this.loginSettings.loginVersion">
      <div class="copyright" v-if="this.loginSettings.loginVersion === 'common'">
        © 2003-
        {{ curYear }}
        深圳市广道高新技术股份有限公司.保留所有权利。粤ICP备05110920号-1
      </div>
      <div class="company-info" :class="{ proclass: this.loginSettings.loginVersion === 'pro' }">
        <div class="police_info" v-if="this.loginSettings.loginVersion === 'pro'">
          <img class="police_logo" src="@/assets/img/police-logo.png" alt="" />
          <div class="info_tip">
            <div class="chi_info">
              <div class="loginCity">
                {{ this.loginSettings.loginCity || '荣成' }}
              </div>
              <div class="login_police">
                <img src="@/assets/img/login-police.png" />
              </div>
            </div>
            <div class="eng_info">{{ this.loginSettings.cityPinYin || 'Rongcheng' }} Police</div>
          </div>
        </div>
        <div v-else>
          <img class="info" src="@/assets/img/company-info.png" alt="" />
          <img class="bedeck" src="@/assets/img/login-bg3.png" alt="" />
        </div>
      </div>
      <div class="maintain">
        <img class="pic" src="@/assets/img/maintain.png" alt="" />
        <span class="text" v-if="!maintainData.maintainDesc">
          为进一步提升信息系统的安全稳定性，系统升级维护中，系统功能暂停使用。由此给您带来的不便，敬请谅解！
        </span>
        <span class="text" v-else>
          {{ maintainData.maintainDesc }}
        </span>
        <!-- <div v-if="!maintainData.maintainTime" class="time">2022年6月17日19:00</div>
        <div v-else class="time">{{ maintainData.maintainTime }}</div> -->
      </div>
      <div class="form_bedeck">
        <img src="@/assets/img/login-bedeck.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { getloginSettings } from '@/api/login'
import { pinyin } from 'pinyin-pro'
export default {
  components: {},
  props: {
    maintainData: {
      type: Object,
      default: () => ({ maintainStatus: '', maintainDesc: '', maintainTime: '' })
    }
  },
  data () {
    return {
      curYear: new Date().getFullYear(),
      loginSettings: {
        loginTitle: '',
        loginVersion: '',
        loginCity: '',
        cityPinYin: ''
      }
    }
  },

  created () {
    this.getSettings()
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
      getloginSettings().then(res => {
        if (res.length) {
          res.forEach(item => {
            this.loginSettings[item.key] = item.value
          })
          if (this.loginSettings.loginCity) {
            this.loginSettings.cityPinYin = this.toUpperCase(
              pinyin(this.loginSettings.loginCity, { toneType: 'none' })
            )
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
            .catch(() => {})
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
            letter-spacing: 6px;
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

  .maintain {
    box-sizing: border-box;
    position: absolute;
    background-color: rgba(25, 32, 53, 0.87);
    width: 1076px;
    height: 580px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 64px;
    .pic {
      width: 187px;
      height: 177px;
      margin-top: 144px;
    }
    .text {
      margin-top: 100px;
      font-size: 18px;
      line-height: 40px;
    }
    .time {
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
}
</style>
