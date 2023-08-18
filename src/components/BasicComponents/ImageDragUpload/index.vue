<template>
  <div class="upload-container">
    <div
    v-loading="loading"
      v-if="
        (UploadImage.multiple && UploadImage.imageUrl.length !== UploadImage.limit) ||
        !UploadImage.multiple
      "
    >
      <el-upload
        :style="{
          width: UploadImage.width + 'vw',
          height: UploadImage.height + 'vh'
        }"
        :class="[disabledInput ? 'upLoadShowNone' : '']"
        ref="upload"
        drag
        class="upload-demo"
        :action="UploadUrl()"
        :multiple="UploadImage.multiple"
        :on-success="handleSuccess"
        :disabled="disabledInput"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="onChange"
      >
        <!-- :accept="UploadImage.accept" -->
        <div
          class="imageBox"
          v-if="UploadImage.imageUrl && !UploadImage.multiple"
        >
          <el-image
            fit="contain"
            :src="UploadImage.imageUrl"
            class="avatar"
            :style="{
              width: UploadImage.width + 'vw',
              height: UploadImage.height + 'vh'
            }"
          ></el-image>
          <div
            class="mask"
            :style="{
              width: UploadImage.width + 'vw',
              height: UploadImage.height + 'vh'
            }"
          >
            <i class="el-icon-plus avatar-uploader-icon deleteIcon" @click.stop="deleteImage"></i>
          </div>
        </div>

        <div class="titleText" v-else>
          <!-- <div><i class="el-icon-plus avatar-uploader-icon"></i></div> -->
          <div class="div1">
            请拖拽图片到这里 或
            <span style="color: #3d6eff">选择文件</span>
          </div>
          <div class="div2">支持上传png/jpg/jpeg/bmp文件，且不超过10MB</div>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    disabledInput: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    Url: {
      type: String,
      default: ''
    },
    UploadImage: {
      type: Object
    }
  },
  data () {
    return {
      curIndex: -1,
      loading: false
    }
  },
  methods: {
    deleteImage () {
      this.UploadImage.imageUrl = ''
    },
    // removedEle () {
    //   this.curIndex = -1
    // },
    // moveqEle (index) {
    //   this.curIndex = index
    // },
    // //上传到服务器
    // submitUpload () {
    //   this.$refs.upload.submit()
    // },
    //上传路径
    UploadUrl: function () {
      // return `${process.env.BASE_API}/base/fus/uploadFile`
      return this.Url ? this.Url : '#'
    },

    //文件上传成功时的钩子
    handleSuccess (res, file, fileList) {
      this.$emit('update:fileList', fileList)
    },

    //文件列表移除文件时的钩子
    // handleRemove (url) {
    //   this.$emit('remove', url)
    // },

    //点击文件列表中已上传的文件时的钩子
    // handlePictureCardPreview (url) {
    //   window.open(url)
    // },
    clearFiles () {
      this.$refs.upload.clearFiles()
    },

    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange (file) {
      this.loading = true
      let fileType = extension(file.name)
      function extension (filename) {
        var r = /.+\.(.+)$/.exec(filename)
        return r ? r[1] : null
      }
      // let fileType = file.raw.name.split('.')[1]
      let fileSize = file.raw.size

      if (fileSize / 1024 / 1024 > this.UploadImage.imgSize) {
        this.$message({
          message: "文件大小不可以超过" + this.UploadImage.imgSize + "M",
          type: 'warning'
        });
        this.loading = false
        return false;
      }
      if (!(fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp')) {
        this.$message({
          message: '上传的文件只能是png、jpg、jpeg或bmp',
          type: 'warning'
        });
        this.loading = false
        return false;
      }
      this.clearFiles()
      this.$emit('handleChange', file)
    }
  }
}
</script>

<style lang="less" scoped>
//@media screen and (min-width: 1024px) and (max-width:1365px) {
//  .titleText {
//    .div1{
//      font-size:14px;
//      color:var(--base-text-color-1);
//    }
//    .div2{
//      margin-top:16px;
//      font-size:9px;
//      color:var(--base-text-color-to-999999);
//    }
//  }
//}
//@media screen and (min-width: 1366px) and (max-width:1919px) {
//  .titleText {
//    .div1{
//      font-size:18px;
//      color:var(--base-text-color-1);
//    }
//    .div2{
//      margin-top:16px;
//      font-size:14px;
//      color:var(--base-text-color-to-999999);
//    }
//  }
//}
//@media screen and (min-width: 1920px){
//  .titleText {
//    .div1{
//      font-size:24px;
//      color:var(--base-text-color-1);
//    }
//    .div2{
//      margin-top:16px;
//      font-size:16px;
//      color:var(--base-text-color-to-999999);
//    }
//  }
//}
.div1 {
  font-size: 18px;
  color: var(--base-text-color-1);
  line-height: 24px;
  margin-bottom: 16px;
}
.div2 {
  font-size: 14px;
  line-height: 19px;
  color: var(--base-text-color-to-999999);
}
.upload-demo.upLoadShowNone {
  cursor: not-allowed;
  div {
    cursor: not-allowed;
  }
}

.upload-container {
  display: flex;
  // margin-bottom: 36px;
  // > div {
  // margin-right: 16px;
  // }
  .upload-demo {
    background-color: var(--table-pageHeader-bg-color) !important;
    position: relative;
    background-color: transparent;
    border: 1px dashed rgba(61, 110, 255, 0.56);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .imageBox {
      position: relative;
      .avatar {
        border-radius: 5px;
        margin-top: 3px;
      }
      .mask {
        position: absolute;
        top: 3px;
        left: 0;
        background: rgba(40, 50, 71, 0.45);
        opacity: 0;
        .deleteIcon {
          color: #8897bf;
          font-size: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          &:hover {
            color: #1b8adb;
          }
        }
      }
      &:hover .mask {
        opacity: 1;
      }
    }
    /deep/.el-upload-dragger {
      position: absolute;
      top: 0;
      left: 0;
      border: 0;
      height: 100% !important;
    }
  }
}
</style>
