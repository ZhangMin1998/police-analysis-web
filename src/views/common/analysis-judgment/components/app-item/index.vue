<template>
<div class='app_item_wrap' @click='toAppResult'>
  <div class='app_icon'>
    <i :class='appIconClass'></i>
  </div>
  <EllipsisPop class='app_name' :content='appInfo.appName'></EllipsisPop>
<!--  <div class='app_name'>{{ appInfo.appName }}</div>-->
  <div class='app_slot'>
    <slot name='operaLab'></slot>
  </div>
</div>
</template>

<script>
import { formatUrlParams } from '../../config/config.js'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'

export default {
  name: 'AppItem',
  components: {
    EllipsisPop
  },
  props: {
    appInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    appIconClass () {
      if (this.appInfo.appIcon) return 'iconfont ' + this.appInfo.appIcon
      return 'iconfont'
    }
  },
  methods: {
    toAppResult () {
      if (this.appInfo.appCategory === 'devise') {
        let win = window.open('', this.appInfo.id + 'result')
        if (win.location.href === 'about:blank') {
          window.open(
            window.location.origin + '/ol/analysisResult?appId=' + this.appInfo.id +
              '&homePageId=' + (this.appInfo.homePageId || '') +
              '&appName=' + this.appInfo.appName +
              '&type=app',
            this.appInfo.id + 'result'
          )
        } else {
          const params = formatUrlParams(win.location.href)
          if (params.type !== 'app') {
            win.location.href = window.location.origin + '/ol/analysisResult?appId=' + this.appInfo.id +
              '&homePageId=' + (this.appInfo.homePageId || '') +
              '&appName=' + this.appInfo.appName +
              '&type=app'
          }
          win.focus()
        }
      } else if (this.appInfo.appCategory === 'import' && this.appInfo.importType === 'URL') {
        if (/^suntang/.test(this.appInfo.importUrl)) {
          window.open(window.location.origin + this.appInfo.importUrl.slice(7))
        } else {
          window.open(this.appInfo.importUrl)
          // window.open('http://localhost:8080/ol/deduce/WorkAndRest')
          // window.open('http://localhost:8080/ol/deduce/queryTimeTrack')
          // window.open('http://localhost:8080/ol/deduce/peerAnalysis')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.app_item_wrap {
  //position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px;
  background-image: var(--analysis-app-box);
  background-size: 100% 100%;
  color: var(--base-text-color-1);
  cursor: pointer;
  .app_icon {
    padding-top: 22px;
    padding-bottom: 42px;
    text-align: center;
    i {
      font-size: 64px;
      color: var(--base-text-color-1-to-666666);
    }
  }
  .app_name {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    line-height: 21px;
    text-align: center;
  }
  .app_slot {
    width: calc(100% - 16px);
    margin-top: 16px;
    //position: absolute;
    bottom: 22px;
  }
}
</style>
