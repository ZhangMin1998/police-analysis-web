<template>
  <div class="maintain">
    <div class="form_left">
      <el-form ref="form" :model="maintainForm" label-width="80px">
        <el-form-item label="维护模式：">
          <el-switch
            v-model="maintainForm.isMaintain"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </el-form-item>
        <el-form-item label="维护提示：">
          <el-input
            class="el-textarea"
            type="textarea"
            resize="none"
            :rows="16"
            v-model="maintainForm.maintainDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="submit_btn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
    <div class="pages_right">
      <div class="pages_contain">
        <div class="scale_box">
          <Maintain :maintainData="maintainForm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Maintain from './components/Maintain'
import timeFormat from '@/utils/filters'
import { mapState } from 'vuex'
import { updateGlobalConfig } from '@/api/config'
let time = new Date().getTime()
time = timeFormat.formatDate(time, 'YYYY年MM月DD日 HH:mm')
export default {
  components: {
    Maintain
  },
  computed: {
    ...mapState('User', {
      loginSettings: 'loginSettings',
      loginTitle: 'loginTitle',
      loginVersion: 'loginVersion',
      loginCity: 'loginCity',
      loginMap: 'loginMap',
      isMaintain: 'isMaintain',
      maintainDesc: 'maintainDesc',
      maintainTime: 'maintainTime'
    })
  },
  created () {
    // 回显
    this.setVuexValue()
  },
  data () {
    return {
      maintainForm: {
        isMaintain: false,
        maintainDesc: `为进一步提升信息系统的安全稳定性，系统于${time} - 2023年6月17日19:00，对系统进行停机维护。上述时间段内，系统功能暂停使用。由此给您带来的不便，敬请谅解！`,
        maintainTime: time
      }
    }
  },
  methods: {
    setVuexValue () {
      console.log(this.isMaintain)
      if (this.isMaintain) {
        this.maintainForm.isMaintain = this.isMaintain === 'true'
        this.maintainForm.maintainDesc = this.maintainDesc
        this.maintainForm.maintainTime = this.maintainTime
      }
      console.log(this.maintainForm);
    },
    onSubmit () {
      const loginparams = {
        loginTitle: this.loginTitle,
        loginVersion: this.loginVersion,
        loginCity: this.loginCity,
        loginMap: this.loginMap,
        isMaintain: this.maintainForm.isMaintain,
        maintainDesc: this.maintainForm.maintainDesc,
        maintainTime: this.maintainForm.maintainTime
      }
      const loginSettings = this.formatParams(loginparams, this.loginSettings)
      console.log(loginSettings)
      updateGlobalConfig({
        list: loginSettings,
        type: 'login'
      }).then(res => {
        if (res && this.maintainForm.isMaintain) {
          this.$message.success('系统进入维护状态成功！')
          this.$router.push('/login')
        }else{
          this.$message.success('系统退出维护状态成功！')
          this.$router.push('/login')
        }
      })
    },
    formatParams (objParams, vuexSettings) {
      const globalParamsList = Object.keys(objParams)
      let submitArray = vuexSettings.filter(item => {
        if (item.key in objParams) {
          item.value = objParams[item.key]
        }
        return item.key in objParams
      })
      globalParamsList.forEach(item => {
        let needAdd = submitArray.find(ele => {
          return ele.key === item
        })
        if (!needAdd) {
          submitArray.push({
            key: item,
            value: objParams[item]
          })
        }
      })
      return submitArray
    }
  }
}
</script>

<style lang="less">
.maintain {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--bg-color-1);
  display: flex;
  .form_left {
    flex: 1;
    height: 100%;
    position: relative;
    .submit_btn {
      position: absolute;
      right: 24px;
      bottom: 24px;
    }
    // margin-top: 500px;
    .el-textarea .el-textarea__inner {
      border: 1px solid var(--border-color-1);
      background-color: var(--bg-color-1);
    }
  }
  .pages_right {
    flex: 1;
    .pages_contain {
      margin-top: 120px;
      margin-left: 56px;
      width: 743px;
      height: 417px;
      position: relative;
      .scale_box {
        transform: translate(-589px, -288px) scaleX(743/1920) scaleY(417/960);
        // transform: scale(743/1920);
        position: absolute;
        top: 0;
        left: 0;
      }

      // overflow: hidden;
    }
  }
}
</style>
