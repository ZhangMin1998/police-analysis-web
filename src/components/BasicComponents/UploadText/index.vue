<template>
  <div class="upload-container">
    <el-upload
      :class="[disabledInput ? 'upLoadShowNone' : '']"
      ref="upload"
      class="upload-demo"
      :accept="UploadText.accept"
      :action="UploadUrl()"
      :multiple="UploadText.multiple"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :disabled="disabledInput"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <slot> </slot>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    disabledInput: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    Url: {
      type: String,
      default: '',
    },
    UploadText: {
      type: Object,
    },
  },
  data () {
    return {
      isMoveq: false,
    }
  },
  methods: {
    removedEle () {
      this.isMoveq = false
    },
    moveqEle () {
      this.isMoveq = true
    },
    /**上传到服务器 */
    submitUpload () {
      this.$refs.upload.submit()
    },
    //上传路径
    UploadUrl: function () {
      // return `${process.env.BASE_API}/base/fus/uploadFile`
      return this.Url ? this.Url : '#'
    },

    /**文件上传成功时的钩子 */
    handleSuccess (res, file, fileList) {
      this.$emit('update:fileList', fileList)
    },

    /**文件列表移除文件时的钩子 */
    handleRemove (file, fileList) {
      this.$emit('update:fileList', fileList)
    },

    /**点击文件列表中已上传的文件时的钩子 */
    handlePictureCardPreview (file) {
      console.log('🚀 ~ file: index.vue ~ line 97 ~ handlePictureCardPreview ~ file', file)
      return
      // let contentType = ''
      // if (file.contentType) {
      //   contentType = file.contentType.split('/')[0]
      // } else {
      //   contentType = file.response.body.contentType.split('/')[0]
      // }
      //
      // if (contentType == 'image') {
      //   this.showImg = file.url
      // } else {
      //   window.open(file.url)
      // }
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
    },

    /**文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 */
    handleChange (file) {
      this.clearFiles()
      this.$emit('handleChange', file)
    },
  },
}
</script>

<style lang="less" scoped></style>
