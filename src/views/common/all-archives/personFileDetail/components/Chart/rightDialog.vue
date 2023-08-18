<!-- 溯源组件 -->
<template>
  <div class="rightDialog" v-if="rightDialog.show">
    <div slot="title" class="title-box">
      <div class='set'>
        <img :src='require("@/assets/img/set-bg.png")' alt=''>
        <div>{{rightDialog.title}}</div>
      </div>
      <i class="el-icon-close" @click="rightDialog.handleClose()" title="关闭"></i>
    </div>
    <div class="main">
      <!-- <slot></slot> -->
      <div class="title_box">
        <el-divider direction="vertical"></el-divider>
        <span class="title">{{rightDialog.dataSource}}</span>
      </div>
      <div class="main-content">
        <Loading :isLoading.sync="rightDialog.loading">
          <div class="content" v-for="(item, key) in rightDialog.labelList" :key="key">
            <div class="label">
              <EllipsisPop :content="item.fieldNameCn + '：'" :rowNum="1" :width="getWidth()"></EllipsisPop>
            </div>
            <div class="data">
              <EllipsisPop v-if="!isShowImgArray.includes(item.entityLabelId)" :content="rightDialog.listData[item.fieldNameEn]" :rowNum="1" width="220px"></EllipsisPop>
              <el-image
                v-else
                style="width: 150px;"
                :src="origin + rightDialog.listData[item.fieldNameEn] || ''"
                :preview-src-list="rightDialog.listData[item.fieldNameEn] ? [origin + rightDialog.listData[item.fieldNameEn]] : []"
                fit="fill"
              >
                <div slot="error" class="image-slot">
                  <img :src="errImg" />
                </div>
              </el-image>
            </div>
          </div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
export default {
  components: {
    Loading,
    EllipsisPop
  },
  props:{
    rightDialog: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    ...mapState('User', {
      theme: 'theme'
    }),
    ...mapState('Common', {
      isShowImgArray: 'isShowImgArray'
    }),
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic']
    }
  },
  methods:{
    getWidth (){
      return document.body.clientWidth >1300? '80px' : '60px'
    }
  }
}
</script>

<style lang="less" scoped>
.rightDialog {
  position: absolute;
  width: 350px;
  background: var(--car-right-chuangkou-bg);
  padding: 16px;
  box-sizing: border-box;
  z-index: 99999;
  .title-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #3D6EFF;
    .set {
      position: relative;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      color: var(--base-text-color-1);
      font-weight: bold;
      div {
        width: max-content;
        position: absolute;
        bottom: 0;
        margin-left: 10px;
      }
      img {
        width: 65px;
        height: 8px;
        margin-top: 16px;
      }
    }
    i{
      font-size:24px;
      cursor: pointer;
    }
  }
  .main{
    .title_box{
      padding: 12px 10px 12px 0;
      /deep/.el-divider--vertical {
        display: inline-block;
        width: 4px;
        height: 1em;
        margin: 0 0.04167rem 0 0;
        vertical-align: text-bottom;
        position: relative;
      }
      .title {
        font-weight: 400;
        color: var(--base-text-color-1);
        font-size: 16px;
      }
    }
    .main-content {
      height: calc(100vh - 330px);
      overflow: scroll;
      /deep/.content{
        display: flex;
        margin-bottom: 8px;
        .label{
          font-size: 14px;
          .value{
            // color: #8799BF;
            color: var(--base-text-color-to-666666);
          }
        }
        .data{
          font-size: 16px;
          .value{
            // color: #C0D0E7;
            color: var(--base-text-color-1);
          }
        }
      }
      /deep/ img{
        width: 150px;
      }
      /deep/.image-slot {
        background: var(--bg-color-2) !important;
      }
      // /deep/.el-descriptions__body {
      //   background-color: var(--bg-color-2);
      //   .el-descriptions-item__label{
      //     color: var(--base-text-color-to-999999);
      //   }
      //   .el-descriptions-item__content{
      //     color: var(--base-text-color-1);
      //   }
      // }
    }
    @-moz-document url-prefix() {
      @media screen and (min-width: 1024px) and (max-width: 1365px){
          .main-content{
          overflow: auto !important;
        }
      }
    }
  }
}
</style>
