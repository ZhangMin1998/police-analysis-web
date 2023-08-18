<template>
<div class='add_feature_wrap'>
  <el-form ref='form' :rules='rules' :model="form" label-position='left' :label-width="getWidth()">
    <el-form-item label="姓名：" prop="name">
      <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
    </el-form-item>
    <div class='id_card'>
      <el-form-item label="身份证：" prop="cerNumber">
        <el-input v-model.trim="form.cerNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <div class='choice_feature' :class='{ "disabled": !form.cerNumber }' @click='choiceFeature'>选择特征</div>
    </div>
    <div class='feature_bar'>
      <div class='not_change_rem tip'>特征：</div>
      <div :class='{ "feature_value": true, "just_add": !featureList.length }'>
        <div v-for='(item, index) in featureList.filter(feature => feature.type !== "cer_number")' :key='index' class='feature'>
          <el-select v-model="item.type" placeholder="请选择">
            <el-option
              v-for="opt in featureOptions"
              :key="opt.id"
              :label="opt.labelName"
              :value="opt.labelNameEn"
              :disabled='opt.labelNameEn === "avatar_url" ? item.type === "avatar_url" ? false : noChoiceFace : false'
              @click.native='handleFeature(item, opt)'
            >
            </el-option>
          </el-select>
          <div v-if='!(item.type === "avatar_url")' class='feature_inp'>
            <el-input v-model.trim="item.value" placeholder="请输入准确数值" @blur='featInpBlur(item)'></el-input>
            <div v-if='!item.isSatisfy' class='error_tip'>{{ canFastEnToCn[item.type] || '' }}有误</div>
          </div>
          <div class='face_upload' v-else>
            <div class='upload_img'>
              <div
                class='my_img'
                v-for='(img, index) in upLoadImgList'
                :key='index'
              >
                <el-image
                  class="el-image"
                  :src="origin + img"
                  :preview-src-list="[ origin + img ]"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <i class='iconfont icon-jiazaishibai'></i>
                  </div>
                </el-image>
                <div class='delete_icon' @click='delImg(index)'>
                  <i class='iconfont icon-xiangqingguanbi'></i>
                </div>
              </div>
            </div>
            <el-upload
              v-show='upLoadImgList.length < 3'
              drag
              multiple
              action="#"
              accept='.png,.jpg,.webp'
              :disabled='upLoadImgList.length === 3'
              :class='{
                "upload_window": true,
                "disabled": upLoadImgList.length === 3
              }'
              :http-request="uploadRequest"
              :limit='uploadLimit'
              :show-file-list="false"
            >
              <div class='upload_text'>
                <div>请拖拽图片到这里或</div>
                <div>选择文件</div>
              </div>
            </el-upload>
          </div>
          <i class='iconfont icon-shanchu' @click='$emit("delFeatureItem", index)' title='移除'></i>
        </div>
        <div class='add_opera' @click='$emit("addFeature")'>
          <i class='iconfont icon-tianjia'></i>
          <div class='add_tip'>添加</div>
        </div>
      </div>
    </div>
    <el-form-item label="分组：" prop="groupId">
      <el-select v-model="form.groupId" placeholder="请选择分组">
        <el-option
          v-for='item in groupOptions'
          :key='item.id'
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="联系警员：" prop="contactPolice">
      <el-input v-model.trim="form.contactPolice" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="警员手机：" prop="contactPolicePhone">
      <el-input v-model.trim="form.contactPolicePhone" placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='$emit("hideDetail")'>取消</div>
    <el-button type="primary" @click='submit' :disabled='!canSubmit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { getPhotoUrl } from '@/api/superSearch.js'
import { addFeature, updateFeature } from '@/api/warnControl.js'
import { getDeductionSingle } from '@/api/analysis'
import { featureReg } from '../../config.js'

/*const OPTIONS = [
  { label: '手机', value: 'phone' },
  { label: '车牌', value: 'car' },
  { label: '人脸', value: 'face' },
]*/

export default {
  name: 'AddFeature',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    featureList: {
      type: Array,
      default: () => []
    },
    tabList: {
      type: Array,
      default: () => []
    },
    upLoadImgList: {
      type: Array,
      default: () => []
    },
    controlId: {
      type: [String, Number]
    },
    featureOptions: {
      type: Array,
      default: () => []
    },
    canFastType: {
      type: Object,
      default: () => {}
    },
    editId: {
      type: Number
    },
    oldSearchList: {
      type: Array,
      default: () => []
    },
    oldSearchIdCard: {
      default: null
    },
    canFastEnToCn: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      groupOptions: [],
      // oldSearchIdCard: null,
      uploadLimit: 3,
      rules: {
        cerNumber: [
          { pattern: /^[0-9]{17}[0-9Xx]$/, message: '身份证号码有误', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    canSubmit () {
      return this.form.cerNumber || this.featureList.some(item => item.type && item.value) || this.featureList.some(item => item.type === "avatar_url")
    },
    noChoiceFace () {
      return this.featureList.some(item => item.type === 'avatar_url')
    },
    haveFeatVError () {
      return this.featureList.some(item => item.needReg && !item.isSatisfy)
    }
  },
  mounted () {
    this.groupOptions = this.tabList.filter(item => item.id)
    this.groupOptions.unshift({
      id: 'all',
      label: '全部'
    })
  },
  methods: {
    featInpBlur (item) {
      if (item['needReg'] && item['regRule'] && item.value) {
        item['isSatisfy'] = item['regRule'].test(item.value)
      } else {
        item['isSatisfy'] = true
      }
    },
    handleFeature (item, opt) {
      if (opt.labelNameEn === "avatar_url") return
      if (featureReg[opt.labelNameEn]) {
        item['needReg'] = true
        item['regRule'] = featureReg[opt.labelNameEn]
        if (item.value) {
          item['isSatisfy'] = item['regRule'].test(item.value)
        } else {
          item['isSatisfy'] = true
        }
      } else {
        item['needReg'] = false
        item['regRule'] = null
        item['isSatisfy'] = true
      }
    },
    delImg (ind) {
      this.$emit('delImg', ind)
      this.uploadLimit += 1
    },
    submit () {
      if (!this.controlId || this.haveFeatVError) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form))
          let featureIdCard = []
          let message = '添加'
          let api = addFeature
          params.configId = this.controlId
          if (!params.groupId || params.groupId === 'all') params.groupId = ''
          if (this.editId) {
            params.id = this.editId
            featureIdCard = this.featureList.filter(item => item.type === 'cer_number')
            message = '修改'
            api = updateFeature
          }
          params.featuresList = []
          this.featureList.filter(item => item.type !== 'cer_number').forEach(item => {
            if (item.type && item.value) {
              let data = {
                features: item.value,
                labelNameEn: item.type,
                monitorDataType: 'trace'
              }
              if (this.editId && item.id) {
                data.id = item.id
              }
              params.featuresList.push(data)
            }
            if (item.type === 'avatar_url') {
              this.upLoadImgList.forEach(img => {
                params.featuresList.push({
                  labelNameEn: item.type,
                  features: img,
                  monitorDataType: 'face'
                })
              })
            }
          })
          if (this.form.cerNumber) {
            let data = {
              features: this.form.cerNumber,
              labelNameEn: 'cer_number',
              monitorDataType: 'trace'
            }
            if (this.editId && featureIdCard.length) data.id = featureIdCard[0].id
            params.featuresList.push(data)
          }
          api(params).then(() => {
            this.$message.success(`${message}成功！`)
            this.$emit('refreshTable')
            this.$emit('hideDetail')
          }).catch(() => {
            this.$message.error(`${message}失败！`)
          })
        }
      })
    },
    choiceFeature () {
      if (!this.form.cerNumber) return
      if (this.oldSearchIdCard && this.oldSearchIdCard === this.form.cerNumber) {
        if (this.oldSearchList.length && this.oldSearchList[0].children.some(item => item.children.length)) {
          this.$emit('showFDialog')
        } else {
          this.$message.warning('特征内容为空，请检查后重试！')
        }
        return
      }
      // this.oldSearchList = []
      getDeductionSingle({
        deduce_condition_list: [
          { attr_type: 'entity_identity_card_type', value: this.form.cerNumber }
        ]
      }).then(res => {
        let result = res.vertex || []
        let canFastList = Object.keys(this.canFastType)
        let treeId = 2
        let fastList = [
          {
            treeId: 1,
            label: this.form.name ? `${this.form.name}/${this.form.cerNumber || ''}` : this.form.cerNumber || '',
            disabled: true,
            children: []
          }
        ]
        let listTypeIndex = {}
        for (let key in this.canFastType) {
          fastList[0].children.push({
            treeId: treeId,
            label: this.canFastType[key]['name'],
            disabled: true,
            children: [],
            type: key
          })
          listTypeIndex[key] = fastList[0].children.length - 1
          treeId++
        }
        result.forEach(item => {
          // 处理肖像
          if (canFastList.includes('entity_person') &&
            item.type === 'entity_person' &&
            item.cer_number === this.form.cerNumber &&
            item.avatar_url
          ) {
            fastList[0].children[listTypeIndex['entity_person']].children.push({
              treeId: treeId,
              label: item.avatar_url,
              type: 'entity_person',
              isValue: true,
              disabled: this.upLoadImgList.length >= 3
            })
            treeId++
          }
          if (item.type !== 'entity_person' && canFastList.includes(item.type)) {
            fastList[0].children[listTypeIndex[item.type]].children.push({
              treeId: treeId,
              label: item.main_prop_val,
              type: item.type,
              isValue: true
            })
            treeId++
          }
        })
        if (fastList[0].children.some(item => item.children.length)) {
          // this.oldSearchList = fastList
          // this.oldSearchIdCard = this.form.cerNumber
          this.$emit('handleChoiceFTree', fastList)
          this.$emit('showFDialog')
        } else {
          this.$emit('handleChoiceFTree')
          this.$message.warning('特征内容为空，请检查后重试！')
        }
      })
    },
    uploadRequest (file) {
      let uploadFile = new FormData()
      uploadFile.append('multipartFile', file.file)
      getPhotoUrl(uploadFile).then(res => {
        res && this.$emit('addUploadImg', res)
      }).catch(() => {
        this.uploadLimit += 1
      })
    },

    beforeUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt5M
    },
    getWidth (){
      return window.screen.width > 1365 ? '82px' : '70px'
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.add_feature_wrap {
  /deep/.el-form {
    .el-form-item {
      margin-bottom: 12px;
      .el-form-item__label {
        font-size: 16px;
        line-height: 32px;
      }
      .el-form-item__content {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 32px;
      }
      .el-input {
        width: 260px;
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
          &:focus {
            border-color: var(--active-color);
          }
        }
        .el-input__suffix {
          height: 30px;
        }
      }
      .el-select {
        .el-input__inner {
          padding: 0 26px 0 12px;
        }
      }
    }
  }
  .id_card {
    display: flex;
    .choice_feature {
      font-size: 16px;
      line-height: 32px;
      color: var(--active-color);
      cursor: pointer;
      margin-left: 8px;
      white-space: nowrap;
      &.disabled {
        color: #434B5F;
        cursor: not-allowed;
      }
    }
  }
  .feature_bar {
    display: flex;
    margin-bottom: 24px;
    .tip {
      flex: none;
      font-size: 16px;
      line-height: 32px;
      color: var(--base-text-color-to-666666);
    }
    .not_change_rem.tip{
      width: 82px;
    }
    @media screen and (min-width: 1024px) and (max-width: 1365px){
      .not_change_rem.tip{
        width: 70px;
      }
    }
    .feature_value {
      flex: 1;
      &.just_add {
        display: flex;
        align-items: center;
      }
      .feature {
        display: flex;
        margin-bottom: 12px;
        position: relative;
        .feature_inp {
          position: relative;
          .error_tip {
            position: absolute;
            bottom: -12px;
            font-size: 12px;
            line-height: 12px;
            color: @font-color-4;
          }
        }
        .face_upload {
          display: flex;
          .upload_img {
            display: flex;
            .my_img {
              position: relative;
              &:hover .delete_icon {
                display: flex;
              }
            }
            /deep/.el-image {
              margin-right: 8px;
              .image-slot {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 123px;
                height: 154px;
                background: var(--warn-error-image-bg);
                font-size: 24px !important;
                color: var(--base-text-color-2);
                i {
                  font-size: 24px;
                }
              }
              img {
                width: 123px;
                height: 154px;
              }
            }
            img {
              width: 123px;
              height: 154px;
            }
            .delete_icon {
              display: none;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: 0;
              left: 0;
              width: 123px;
              height: 154px;
              background: var(--loading-color-1);
              z-index: 10;
              i {
                font-size: 24px;
              }
            }
          }
        }
        .upload_window {
          width: 123px;
          height: 154px;
          &.disabled {
            /deep/.el-upload-dragger {
              cursor: not-allowed;
            }
          }
          /deep/.el-upload {
            width: 100%;
          }
          /deep/.el-upload-dragger {
            height: 154px;
            border-color: rgba(61, 110, 255, 0.56);
            border-radius: 0;
          }
          .upload_text {
            font-size: 12px;
            line-height: 16px;
            color: var(--active-color);
            div:first-child {
              color: var(--base-text-color-to-666666);
              margin-bottom: 8px;
            }
          }
          @media screen and (min-width: 1024px) and (max-width: 1365px){
            .upload_text{
              line-height: 20px;
            }
          }
        }
        .icon-shanchu {
          position: absolute;
          right: -20px;
          font-size: 16px;
          line-height: 32px;
          color: var(--active-color);
          cursor: pointer;
        }
        /deep/.el-input {
          flex: 1;
          .el-input__inner {
            padding: 0 12px;
          }
        }
        /deep/.el-select {
          width: 138px;
          margin-right: 16px;
          .el-input__inner {
            padding: 0 26px 0 12px;
          }
        }
        /deep/.el-input__inner {
          height: 32px;
          line-height: 30px;
        }
        /deep/.el-icon-circle-close {
          margin-top: 0;
          line-height: 32px;
        }
      }
      .add_opera {
        display: flex;
        width: 52px;
        font-size: 14px;
        line-height: 19px;
        color: var(--active-color);
        cursor: pointer;
        white-space: nowrap;
        i {
          font-size: 16px;
          margin-right: 8px;
        }
      }
    }
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
/deep/.el-form-item__error {
  padding-top: 0;
  line-height: 12px;
  color: @font-color-4;
}
</style>
