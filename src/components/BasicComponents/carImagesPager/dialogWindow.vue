<template>
  <div>
    <div v-if="dialogData.show" :class="customClass ? customClass : styleClass">
      <el-dialog
        :visible="dialogData.show"
        :close-on-click-modal="false"
        @close="beforeClose"
        :modal-append-to-body="false"
      >
        <div slot="title" class="title-box">
          <div class='set'>
            <img :src='require("@/assets/img/set-bg.png")' alt=''>
            <div>{{dialogData.title}}</div>
          </div>
        </div>
        <!-- <div class="photo"> -->
          <el-image
            class="el-image"
            :src="origin+ dialogData.data.photo"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <el-image
                :src="errImg(dialogData.data)"
                fit="cover"
              ></el-image>
            </div>
          </el-image>
        <!-- </div> -->
        <div class="main_info">
          <el-descriptions :column="2">
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(item, key) in dialogData.columns"
              :key="key"
              :label="item.label"
            >
              <Ellipsis :wordsLength="24" :value="dialogData.data[item.prop]" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import { lightTheme, darkTheme } from "@/assets/js/variable";
export default {
  components:{
    Ellipsis
  },
  props: {
    dialogData: {
      type: Object,
      default: function () {
        return {
          show: false,
          title: '详情',
          // width: '780px',
          top: '15%',
          colums:[],
          data:{}
        }
      }
    },
    customClass: {
      type: String,
    },
  },
  data () {
    return {
      // imgSet: {
      //   src: '',
      //   width: 723,
      //   height: 260,
      //   errorSrc: 'person-default-0',
      //   list: []
      // }
    }
  },
  mounted (){
    // console.log(this.dialogData.data.id)
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight',
    }),
    styleClass () {
      return this.screenHeight > 936 ? 'addFeature' : 'pop'
    },
    origin () {
      return window.location.origin + '/'
      // return 'http://192.168.1.99:21162/'
    }
  },
  methods: {
    errImg (item) {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      if (item.errorIcon) {
        return require('@/assets/img/' +
          item.errorIcon +
          '.png')
      } else {
        // console.log(colorObj['--car-default-pic']);
        return colorObj['--car-default-pic']
      }
    },
    beforeClose () {
      this.$emit('beforeClose')
    },
    beforeOpen () {
      this.$emit('beforeOpen')
    },
  },
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  /deep/.el-dialog{
    width: 50%;
  }
  /deep/.el-descriptions-item__label{
    width: 0.7rem !important;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  /deep/.el-dialog{
    width: 40%;
  }
  /deep/.el-descriptions-item__label{
    width: 0.5rem !important;
  }
}
@media screen and (min-width: 1920px) {
  /deep/.el-dialog{
    width: 40%;
  }
  /deep/.el-descriptions-item__label{
    width: 96px !important;
  }
}

/deep/.el-image {
  width: 100% !important;
  height: 350px !important;
}
.title-box{
  padding: 0 0 12px 0;
  margin: 0 0 24px 0;
  border-bottom: 1px solid var(--active-color);
  .set {
    position: relative;
    height: 24px;
    width: 100px;
    line-height: 24px;
    font-size: 18px;
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
}
.main_info{
  /deep/.el-descriptions__body{
    margin-top: 14px;
    // background: #27344d;
    background: var(--daochu-bg-color);
    line-height: 16px;
  }
  /deep/.el-descriptions-item__cell {
    padding-bottom: 5px;
  }
  /deep/.el-descriptions-item__label{
    font-size: 16px;
    color: var(--base-text-color-to-999999);
  }
  /deep/.el-descriptions-item__content{
    font-size: 16px;
    color: var(--base-text-color-1);
  }
}
/deep/.el-dialog__body {
  margin-top: -10px;
  max-height: calc(100vh - 300px) !important;
  overflow-y: hidden !important;
  padding: 0px 25px 25px 32px !important;
}
</style>
