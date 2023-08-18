<template>
  <div class="search">
    <div class="search-container">
<!--      <el-input-->
<!--        ref="input"-->
<!--        v-model.trim="tempSearch"-->
<!--        placeholder="拖拽照片或选择照片"-->
<!--        @clear="clear"-->
<!--        @input="input"-->
<!--        :maxlength="50"-->
<!--        @focus="clickOpen"-->
<!--      >-->
<!--        &lt;!&ndash; <i slot="suffix" class="el-input__icon el-icon-camera" style="font-size:20px;"></i> &ndash;&gt;-->
<!--        <img slot="suffix" src="@/assets/img/icon-camera.png" style="vertical-align:middle;margin-right:10px;" @click="clickOpen"/>-->
<!--      </el-input>-->
      <div class='img_search' @click='clickOpen' :class='{ "active": isShowUpload }'>
        <div class='placeholder'>{{ placeholder }}</div>
        <i class='iconfont icon-tupiansousuo1' @click="clickOpen"></i>
      </div>
      <!-- 搜索按钮 -->
      <div class="btn-box" v-if='showSearchBtn'>
        <el-button type="primary" class="btn searchBtn" :loading="btnLoading" @click="handleSearch($event)">{{btnLoading?'搜索中':'搜索'}}</el-button>
      </div>
      <div class="search-list" v-if="isShowUpload">
        <div class='division'></div>
        <div class="imageBox">
          <ImageDragUpload ref="ImageDragUpload" :UploadImage.sync="UploadImage" @handleChange="UploadChange"></ImageDragUpload>
        </div>
        <div class="closeButton">
          <i class='iconfont icon-xiangqingguanbi' @click="blur"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageDragUpload from '@/components/BasicComponents/ImageDragUpload'
// import { uploadFacePic } from '@/api/allArchives'
import { getPhotoUrl } from '@/api/superSearch'
export default {
  components: {
    ImageDragUpload
  },
  props: {
    placeholder: {
      type: String,
      default: '拖拽照片或选择照片'
    },
    showSearchBtn: {
      type: Boolean,
      default: true
    },
    searchKey: {
      type: String,
      default: ''
    },
    btnLoading:{
      type:Boolean,
      default:false
    },
    url: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      tempSearch: '',
      searchList: JSON.parse(window.localStorage.getItem('searchList')) || [],
      isShowUpload: false,
      UploadImage: {
        imageUrl: '',
        multiple: false,
        width: 31,
        height: 35,
        imgSize: 10, //单位：Mb
        imgFile: null
      },
      tempUrl: '' //格式化后的图片链接
    }
  },
  watch: {
    searchKey: {
      handler (val) {
        this.tempSearch = val
      },
      immediate: true
    },
    'UploadImage.imageUrl': {
      handler (val) {
        if (!val) {
          this.$emit('getImgUrl', '')
        }
      }
    }
  },
  methods: {
    clickOpen (){
      this.isShowUpload = true
      // var input = document.querySelector(".el-input__inner")
      // input.focus()
      this.$emit('isShowUpload', this.isShowUpload)
    },
    input (val){
      if(!val){
        this.$emit('inputNoData')
      }
    },
    clear (){
      this.$emit('clear')
    },
    down (e) {
      e.preventDefault()
    },
    useCodeBlur () {
      var input = document.querySelector(".el-input__inner")
      input.blur()
    },
    blur () {
      this.isShowUpload = false
      this.$emit('isShowUpload', this.isShowUpload)
    },
    handleSearch (e) {
      // console.log('搜索', e);
      if (e && e.target) {
        if (e.target.parentNode && e.target.parentNode.nodeName === 'BUTTON') {
          e.target.parentNode.blur()
        } else if (e.target.nodeName === 'BUTTON') {
          e.target.blur()
        }
      }
      // if (!this.UploadImage.imageUrl) {
      //   this.$messageTip.error('请先上传人脸照片')
      //   return false
      // } else {
      //   this.$emit('handleSearch', this.tempUrl)
      //   this.UploadImage.imageUrl = ''
      //   this.tempUrl = ''
      // }
      // console.log(this.$refs.ImageDragUpload.loading)
      // if(this.$refs.ImageDragUpload.loading){
      //   this.$messageTip.error('请等待文件上传完毕再进行操作')
      //   return false
      // }
      if (!this.url && !this.UploadImage.imageUrl) {
        this.$messageTip.error('请先上传人脸照片')
        return false
      } else {
        if (!this.UploadImage.imageUrl) {
          this.$emit('handleSearch', this.url)
        } else {
          this.$emit('handleSearch', this.tempUrl)
          this.UploadImage.imageUrl = ''
          this.tempUrl = ''
        }
      }
    },
    UploadChange (file) {
      let url = URL.createObjectURL(file.raw)
      // this.UploadImage.imageUrl = url
      this.UploadImage.imgFile = file.raw
      this.$emit('uploadImage', this.UploadImage)

      let formData = new FormData()
      formData.append('multipartFile', file.raw)
      getPhotoUrl(formData).then((res) => {
        this.$refs.ImageDragUpload.loading = false
        this.UploadImage.imageUrl = url
        this.tempUrl = res
        this.$emit('getImgUrl', this.tempUrl)
      })
    }
  }

}
</script>

<style lang="less" scoped>
.search {
  ::v-deep .el-input {
    //  width: 682px;
    .el-input__suffix {

      display: flex;
      align-items: center;
      .el-icon-circle-close:before {
        content: '×';
        transform: scale(1.5);
        display: inline-block;
        position: absolute;
        top: 0;
        left: -10px;
        color: rgba(152, 167, 185, 0.5);
      }
    }
    .el-input__inner {
      height: 48px;
      line-height: 48px;
      padding-left: 24px;
      border-radius: 0;
      font-size: 20px;
      border-radius: 4px;
      color: var(--base-text-color-1);
      background-color: #26334c !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      &:focus {
        background: rgba(39, 52, 77, 0.39) !important;
        opacity: 0.95;
        border: 2px solid #177ddc !important;
      }
    }
  }
  .search-container {
    position: relative;
    display: flex;
    justify-content: flex-start;
    .img_search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      width: 640px;
      height: 40px;
      padding: 0 16px;
      color: var(--input-placehold-color);
      font-size: 14px;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      //background: #26334c;
      cursor: pointer;
      &.hover {
        border-color: #3D4C75;
      }
      i {
        font-size: 16px;
        color: var(--base-text-color-to-999999);
        margin-left: 16px;
      }
      &.active {
        border-color: var(--active-color);
        border-bottom: 0;
      }
    }
    .btn-box {
      z-index: 12;
      margin-left: -2px;
      .searchBtn {
        width: 120px;
        height: 48px;
        // border-top-right-radius: 4px  !important;
        // border-bottom-right-radius: 4px !important;
        //  overflow: hidden;
        padding: 6px 10px !important;
        font-size: 20px;
        text-align: center;
      }
    }
    .search-list {
      position: absolute;
      top: 46px;
      left: 0;
      z-index: 88;
      // background-color: #1f2a3f;
      opacity: 0.95;
      // background: #232A42 !important;
      background: var(--bg-color-3) !important;
      border: 1px solid var(--active-color);
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-top: 0;
      width: 640px;
      box-sizing: border-box;
      .division {
        height: 0;
        border: 1px solid var(--active-color);
        margin: 0 17px;
      }
      .imageBox{
        padding: 20px 0 0 0;
        display: flex;
        justify-content: center;
      }
      .closeButton{
        padding: 20px 0px 35px 0;
        position: relative;
        i {
          position: absolute;
          right:15px;
          font-size: 24px;
          color: var(--base-text-color-to-999999);
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep .el-button--primary {
  background: var(--active-color) !important;
}
::v-deep .el-upload-dragger {
  // background: rgba(33, 40, 62, 0.64) !important;
  background: var(--supersearch-search-focus-bg) !important;
}
</style>
