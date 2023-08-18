<template>
<div class='add_app_wrap'>
  <div class='fill_item'>
    <div class='label label_line'>应用名称：</div>
    <el-input v-model.trim="fillInfo.appName" placeholder="请输入应用名称" class='app_name' maxlength='30' @input='appNameInput'></el-input>
    <div v-if='haveError && !fillInfo.appName' class='error_tip'>应用名称不可为空</div>
  </div>
  <div class='fill_item' v-if="editInfo && editInfo.id && editInfo.importType === 'URL'">
    <div class='label label_line'>应用URL：</div>
    <el-input v-model.trim="fillInfo.importUrl" placeholder="请输入应用URL" class='app_name' maxlength='120' @input='urlInput'></el-input>
    <div v-if='(haveError && !fillInfo.importUrl || !rightUrl)' class='error_tip'>
      {{ !rightUrl ? 'URL错误' : '应用URL不可为空' }}
    </div>
  </div>
  <div class='fill_item'>
    <div class='label'>应用图标：</div>
    <div class='app_icon_grid'>
      <div class='app_icon'>
        <div
          class='icon_box'
          v-for='item in iconInfo'
          :key='item'
          :class='{ "icon_box": true, "active_icon": item === fillInfo.appIcon }'
          @click='handleAppIcon(item)'
        >
          <i :class='[ "iconfont", item ]'></i>
        </div>
      </div>
    </div>
  </div>
  <div v-if='!(editInfo && editInfo.id)' class='fill_item'>
    <div class='label'>应用类别：</div>
    <el-radio-group v-model="fillInfo.appType" @input='handleAppType'>
      <el-radio label="devise">设计应用</el-radio>
      <el-radio label="import">导入应用</el-radio>
    </el-radio-group>
  </div>
  <div v-if='!(editInfo && editInfo.id)' v-show='fillInfo.appType === "import"'>
    <div class='fill_item'>
      <el-radio-group v-model="fillInfo.appImportType" class='app_type'>
        <el-radio label="URL">方式1/URL链接：</el-radio>
<!--        <el-radio label="JSON">方式2/已有脚本：</el-radio>-->
      </el-radio-group>
    </div>
    <div class='fill_item' v-show='fillInfo.appImportType === "URL"'>
      <el-input v-model.trim="fillInfo.importUrl" placeholder="请输入URL链接" class='app_import_type' @input='urlInput'></el-input>
      <div v-if='(haveError && !fillInfo.importUrl) || !rightUrl' class='error_tip'>
        {{ !rightUrl ? 'URL错误' : 'URL链接不可为空' }}
      </div>
    </div>
<!--    <div class='fill_item' v-show='fillInfo.appImportType === "JSON"'>
      <div class='script_item'>
        <el-input v-model.trim="fillInfo.importUrl" placeholder="请选择文件" disabled></el-input>
        <div class='blank_button' @click='uploadImport'>上传</div>
&lt;!&ndash;        accept='.sql'&ndash;&gt;
        <el-upload
          :action="'#'"
          :http-request="uploadRequest"
          :multiple="false"
          :auto-upload="true"
          :on-error="unError"
          :show-file-list="false">
          <div id='upload'>
          </div>
        </el-upload>
      </div>
      <div v-if='haveError && !fillInfo.importUrl' class='error_tip'>脚本不可为空</div>
    </div>-->
  </div>
  <div class='floor'>
    <div
      :class='{
        "blank_button": true,
        "is-disabled": loading
      }'
      @click='$emit("closeDialog")'
    >取消</div>
    <el-button
      type="primary"
      :disabled='loading'
      @click='submit'
    >{{ loading ? editInfo ? '设置中...' : '新建中...' : '确定' }}</el-button>
  </div>
</div>
</template>

<script>
import { addAppApi, updateAppApi, uploadFileApi } from '@/api/analysisJudgment'
import { ICON_INFO } from '../../config/config.js'

export default {
  name: 'AddApp',
  inject: ['getAppData'],
  props: {
    editInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      iconInfo: Object.freeze(ICON_INFO), // 应用图标数组
      fillInfo: {
        appType: 'devise',
        appName: '应用1',
        appIcon: 'icon-a-zu5999',
        appImportType: 'URL',
        importUrl: ''
      }, // 新建应用信息
      haveError: false,
      loading: false,
      rightUrl: true
    }
  },
  created () {
    if (this.editInfo) {
      this.fillInfo.appName = this.editInfo.appName
      this.fillInfo.appIcon = this.editInfo.appIcon
      this.fillInfo.appType = this.editInfo.appCategory
      this.fillInfo.appImportType = this.editInfo.importType || ''
      this.fillInfo.importUrl = this.editInfo.importUrl || ''
    }
  },
  methods: {
    // 选择应用类别
    handleAppType (value) {
      if (value === 'devise') {
        this.fillInfo.appImportType = 'URL'
        this.fillInfo.importUrl = ''
        this.haveError = false
      }
    },
    // 选择应用图标
    handleAppIcon (value) {
      this.fillInfo.appIcon = value
    },
    // 应用名称输入
    appNameInput (value) {
      // this.fillInfo.appName = value.replace(/[^a-zA-Z\d\u4E00-\u9FA5]/g, '')
      if (
        this.haveError &&
        value &&
        (this.fillInfo.appType === 'devise' || (this.fillInfo.appType === 'import' && this.fillInfo.importUrl))
      ) this.haveError = false
    },
    // URL链接输入
    urlInput (value) {
      if (/^suntang/.test(value)) {
        this.rightUrl = true
        return
      }
      // eslint-disable-next-line
      const exp = /^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._/\+~#=]{2,256}(\.[a-z]{2,6})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      this.rightUrl = exp.test(value)
      if (this.haveError && value && this.fillInfo.appName) this.haveError = false
    },
    uploadImport () {
      document.getElementById('upload').click()
    },
    // 上传文件调用接口
    uploadRequest (file) {
      const type = file.file.type === 'text/csv' ? 'csv' : 'setting'
      let uploadFile = new FormData()
      uploadFile.append('multipartFile', file.file)
      uploadFile.append('type', type)
      uploadFileApi(uploadFile).then(() => {
        // res && this.$emit('addUploadImg', res)
      })
    },
    unError (fileList) {
      this.$message.error(fileList[0].msg)
    },
    submit () {
      if (this.fillInfo.appType === 'import' && !this.rightUrl) return
      if (!this.fillInfo.appName || (this.fillInfo.appType === 'import' && !this.fillInfo.importUrl)) {
        this.haveError = true
        return
      }
      this.loading = true
      let requestApi = addAppApi
      let successMessage = '新建'
      let params = {
        appName: this.fillInfo.appName,
        appIcon: this.fillInfo.appIcon,
        appCategory: this.fillInfo.appType
      }
      if (this.fillInfo.appType === 'import') {
        params['importType'] = this.fillInfo.appImportType
        params['importUrl'] = this.fillInfo.importUrl
      }
      if (this.editInfo) {
        params['id'] = this.editInfo.id
        requestApi = updateAppApi
        successMessage = '设置'
      }
      requestApi(params).then(res => {
        this.loading = false
        this.$message.success(`应用${successMessage}成功！`)
        if (!this.editInfo && this.fillInfo.appType === 'devise') {
          window.open(window.location.origin + '/ol/analysisEdit?appId=' + res + '&appName=' + this.fillInfo.appName)
        }
        this.getAppData('local', 'localAppList', true)
        this.$emit('closeDialog')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.add_app_wrap {
  width: 100%;
  .fill_item {
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 12px;
    .label {
      flex: none;
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
      margin-right: 12px;
      &.label_line {
        line-height: 32px;
      }
    }
    .script_item {
      flex: 1;
      display: flex;
      margin-left: 92px;
      /deep/.el-input {
        margin-right: 16px;
        .el-input__inner {
          cursor: pointer;
        }
      }
      .blank_button {
        white-space: nowrap;
      }
    }
    .app_name {
      width: 260px;
    }
    .app_type {
      margin-left: 92px;
    }
    .app_import_type {
      margin-left: 92px;
    }
    .app_icon_grid {
      width: 100%;
      height: 146px;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      .app_icon {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        width: 100%;
        max-height: 146px;
        padding: 8px;
        overflow-y: auto;
        .icon_box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(100% / 8);
          height: 52px;
          i {
            font-size: 40px;
            color: var(--primary-menu-text-color);
          }
          &.active_icon {
            background-color: var(--datapicker-in-range-bg-color);
          }
        }
      }
    }
    .error_tip {
      position: absolute;
      bottom: -12px;
      left: 92px;
      font-size: 12px;
      line-height: 12px;
      color: @font-color-4;
    }
    /deep/.el-radio-group {
      display: flex;
      .el-radio {
        display: flex;
        align-items: center;
        color: var(--base-text-color-1);
        margin-right: 16px;
        .el-radio__label {
          font-size: 16px;
          line-height: 21px;
          padding-left: 8px;
        }
        .el-radio__inner {
          width: 16px;
          height: 16px;
          border-color: var(--base-text-color-to-666666);
          &:hover {
            border-color: var(--active-color);
          }
          &::after {
            background-color: var(--active-color);
          }
        }
        .el-radio__input.is-checked .el-radio__inner {
          border-color: var(--active-color);
        }
      }
    }
    /deep/.el-input {
      height: 32px;
      line-height: 32px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        border-color: var(--border-color-input);
        font-size: 14px;
        &:hover {
          border-color: var(--border-color-input-hover);
        }
      }
      .el-input__suffix {
        height: 30px;
      }
    }
  }
  /deep/.el-radio__input.is-disabled .el-radio__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background: transparent;
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
</style>
