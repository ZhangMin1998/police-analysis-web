<template>
  <div class="ImageSearch">
    <div class="reverse-rotate"></div>
    <div class="rotate"></div>
    <div class="base"></div>
    <div></div>
    <div class="left-brackets"></div>
    <div class="right-brackets"></div>
    <div class="center-bg"></div>
    <!-- <div class="ImageSearch_title">
      <div>
        <img src="@/assets/img/left-arrow.png" alt="" />
      </div>
      <h2>人脸图片查询</h2>
      <div>
        <img src="@/assets/img/right-arrow.png" alt="" />
      </div>
    </div> -->

    <div class="ImageSearch_swapper">
      <ImageDragUpload ref="ImageDragUpload" :UploadImage.sync="UploadImage" @handleChange="UploadChange"></ImageDragUpload>
    </div>

    <div class="ImageSearch_btn">
      <el-button type="primary" class="btn" :loading="btnLoading" @click="search($event)">{{ btnLoading ? '搜索中...' : '搜索' }}</el-button>
    </div>
  </div>
</template>

<script>
import { frSearch } from '@/api/allArchives'
import { uploadFacePic } from '@/api/allArchives'

import ImageDragUpload from '@/components/BasicComponents/ImageDragUpload'

export default {
  name: 'ImageSearch',
  components: {
    ImageDragUpload,
  },
  data () {
    return {
      btnLoading:false,
      // btnList: [
      //   {
      //     text: '搜索',
      //     type: 'button',
      //     loading: false,
      //     event: this.submitUpload
      //   }
      // ],
      UploadImage: {
        imageUrl: '',
        multiple: false,
        width: 30,
        height: 35,
        imgSize: 10, //单位：Mb
        imgFile: null
      },
      tempUrl: '', //格式化后的图片链接
      isSearch: false
    }
  },
  activated () {
    if (this.isSearch && this.tempUrl) {
      this.$router.push({name: 'ImageSearchDetail', params: {id: this.tempUrl}})
    }
  },
  methods: {
    search (e){
      if (e && e.target) {
        if (e.target.parentNode && e.target.parentNode.nodeName === 'BUTTON') {
          e.target.parentNode.blur()
        } else if (e.target.nodeName === 'BUTTON') {
          e.target.blur()
        }
      }
      // console.log(this.$refs.ImageDragUpload.loading)
      // if(this.$refs.ImageDragUpload.loading){
      //   this.$messageTip.error('请等待文件上传完毕再进行操作')
      //   return false
      // }
      if (!this.UploadImage.imageUrl) {
        this.$messageTip.error('请先上传人脸照片')
        return false
      }
      this.btnLoading = true
      setTimeout(()=>{
        this.btnLoading = false
        // sessionStorage.setItem("imgUrl", this.UploadImage.imageUrl)
        this.isSearch = true
        this.$router.push({name: 'ImageSearchDetail', params: {id: this.tempUrl}})
      }, 0)
    },
    UploadChange (file) {
      let url = URL.createObjectURL(file.raw)
      this.UploadImage.imgFile = file.raw
      // this.$emit('uploadImage', this.UploadImage)
      let formData = new FormData()
      formData.append('multipartFile', file.raw)
      uploadFacePic(formData).then((res) => {
        this.$refs.ImageDragUpload.loading = false
        this.UploadImage.imageUrl = url
        this.tempUrl = res
      })

    },

    submitUpload () {
      if (!this.UploadImage.imgFile) {
        this.$messageTip.error('请先上传人脸照片')
        return false
      }
      let reader = new FileReader()
      reader.readAsDataURL(this.UploadImage.imgFile)
      reader.onload = () => {
        this.$nextTick(() => {
          // base64 图片
          this.$store.commit('User/setFaceBase64', reader.result)

          let fd = new FormData()
          fd.append('pageNum', 1)
          fd.append('pageSize', 12)
          fd.append('similarity', '0.6')
          fd.append('faceImage', this.UploadImage.imgFile)
          fd.append('startTime', this.$refs.DatePick.startTime || '')
          fd.append('endTime', this.$refs.DatePick.endTime || '')

          this.btnList[0].loading = '搜索中...'
          frSearch(fd)
            .then(res => {
              if (res.content.length == 0) {
                this.$messageTip.error('该人脸图片未搜索到相关结果！')
                return false
              }

              this.$router.push({
                name: 'ImageSearchDetail',
                query: { id: 1 },
                params: {
                  startTime: this.$refs.DatePick.startTime || '',
                  endTime: this.$refs.DatePick.endTime || ''
                }
              })
            })
            .finally(() => {
              this.btnList[0].loading = false
            })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.p-button {
  padding: 7px 12px;
  line-height: 16px;
}

// 图片搜索
.ImageSearch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: -120px;
  box-sizing: border-box;
  // background: url('~@/assets/img/clue-query-bg.png') no-repeat;
  background-size: 100% 100%;
  height: calc(100vh - 200px);

  .ImageSearch_title {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
    color: #5a97ef;
    h2 {
      padding: 0 20px;
    }
    img {
      vertical-align: middle;
    }
  }
  .ImageSearch_swapper {
    // width: 35vw;
    // background-color: var(--table-pageHeader-bg-color);
    // border: 1px dashed var(--input-placehold-color);
    // border-radius: 10px;
    // padding: 30px 0;
    // box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // box-shadow: 0px 0px 6px #888;
  }
  .ImageSearch_btn{
    z-index: 9999;
    margin-top: 30px;
    .btn{
      width: 120px;
      height: 48px;
      padding: 15px 35px !important;
      font-size: 16px;
      border-radius: 4px !important;
    }
  }
  .rotate {
    width: 623px;
    height: 623px;
    position: absolute;
    top: 146px;
    // top: calc(176 / 1920 * 100%);
    left: 531px;
    // left: calc(531 / 1920 * 100%);
    background: url(~@/assets/img/supersearch-rotate.png);
    background-size: 100% 100%;
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 3s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 3s;
    -webkit-animation: rotate 9s linear infinite;
    -moz-animation: rotate 9s linear infinite;
    -o-animation: rotate 9s linear infinite;
    animation: rotate 9s linear infinite;
  }
  .reverse-rotate {
    width: 90px;
    height: 445px;
    position: absolute;
    top: 230px;
    left: 798px;
    // left: calc(798 / 1920 * 100%);
    background: url(~@/assets/img/supersearch-reverse-rotate.png);
    background-size: 100% 100%;
    animation: circling 9s linear 0s infinite;
  }

  @keyframes circling {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
  .base {
    width: 473px;
    height: 473px;
    position: absolute;
    top: 222px;
    left: 606px;
    // left: calc(606 / 1920 * 100%);
    background: url(~@/assets/img/supersearch-base-bg.png);
    background-size: 100% 100%;
  }
  .left-brackets {
    //  width: 10px;
    // height: 100px;
    position: absolute;
    width: 83px;
    height: 693px;
    top: 112px;
    //  top: 410px;
    // opacity: 0;
    background: url(~@/assets/img/supersearch-left.png);
    background-size: 100% 100%;
    // background-size: contain;
    // background-repeat: no-repeat;
    animation: moveright  0.5s ease-in;
    animation-fill-mode: forwards;
  }
  @keyframes moveright {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-720px);
      width: 83px;
      height: 693px;
      top: 112px;
      // opacity: 1;
    }
  }
  .right-brackets {
    position: absolute;
    width: 83px;
    height: 693px;
    top: 112px;
    // opacity: 0;
    background: url(~@/assets/img/supersearch-right.png);
    background-size: 100% 100%;
    // background-size: contain;
    // background-repeat: no-repeat;
    animation: moveleft  0.5s ease-in;
    animation-fill-mode: forwards;
  }
  @keyframes moveleft {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(720px);
      width: 83px;
      height: 693px;
      top: 112px;
      // opacity: 1;
    }
  }
  .center-bg {
    width: 1100px;
    height: 761px;
    position: absolute;
    top: 77px;
    left: 293px;
    // left: calc(293 / 1920*100%);
    background: url(~@/assets/img/supersearch-arrow.png);
    background-size: 100% 100%;
    animation: shine 0.4s linear;
  }
  @keyframes shine {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .ImageSearch{
    margin-top: -60px;
  }
}
::v-deep .el-button--primary {
  background: var(--active-color) !important;
}
</style>
