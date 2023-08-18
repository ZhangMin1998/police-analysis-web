<template>
  <div class="system_wrap">
    <template v-if='layoutName === "app-result"'>
      <div class='app_result_header'>
        <EllipsisPop class='app_name' :content='appName'></EllipsisPop>
<!--        <div class='app_name'>{{ appName }}</div>-->
      </div>
      <div class='app_result_container'>
        <router-view></router-view>
      </div>
    </template>
    <template v-else-if='layoutName === "blank"'>
      <router-view></router-view>
    </template>
    <template v-else>
      <div class="header_wrap" v-show='!isFullScreen'>
        <SystemHeader></SystemHeader>
      </div>
      <div
        class="container_wrap"
        :class='{ "full_screen": isFullScreen }'
      >
        <SystemContainerLeft v-if="!isHidden && !isRecordsCenter"></SystemContainerLeft>
        <div class="sys_container" id="sys_container" :class="{ no_padding: noPadding() }">
          <template v-if="permission">
            <keep-alive :include="kInclude">
              <router-view v-if="!isRecordsCenter"></router-view>
              <div v-else class="container-wrap" id="container-wrap">
                <div class="list" v-if="permission">
                  <RecordsCenter :isRecordsCenter="isRecordsCenter"></RecordsCenter>
                </div>
                <NotPermission v-else></NotPermission>
              </div>
            </keep-alive>
          </template>
          <template v-else>
            <NotPermission></NotPermission>
          </template>
        </div>
      </div>
      <div v-if='isControlList' class='warn_message_list' id='messageList'>
        <WarnMessage></WarnMessage>
      </div>
    </template>
<!--    <template v-else>-->
<!--      <div class="container-wrap" id="container-wrap">-->
<!--        <div class="list" v-if="permission">-->
<!--          <RecordsCenter :isRecordsCenter="isRecordsCenter"></RecordsCenter>-->
<!--        </div>-->
<!--        <NotPermission v-else></NotPermission>-->
<!--      </div>-->
<!--    </template>-->
  </div>
</template>

<script>
// import HeadNav from '@/components/layout/header'
// import LeftNav from './left-nav'
import SystemHeader from './components/systemHeader'
import NotPermission from '@/views/NotPermission'
import { mapState, mapMutations, mapActions } from 'vuex'
import SystemContainerLeft from './components/systemCLeft'
import RecordsCenter from './components/records-center'
import dataCenterRoutePath from './dataCenterRouter'
import WarnMessage from '@/views/common/control-warn/components/warn-message-list/index.vue'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'

import { kInclude } from '../../config/config.js'

export default {
  name: 'NewLayout',
  components: {
    SystemHeader,
    NotPermission,
    SystemContainerLeft,
    RecordsCenter,
    WarnMessage,
    EllipsisPop
  },
  data () {
    return {
      kInclude: kInclude
    }
  },
  created () {
    this.updateScreenHeight(`${document.documentElement.clientHeight}`)
    this.updateScreenWidth(`${document.documentElement.clientWidth}`)
  },
  mounted () {
    this.$nextTick(() => {
      window.onresize = () => {
        window.screenHeight = window.innerHeight
        window.screenWidth = window.innerWidth
        this.updateScreenHeight(window.screenHeight)
        this.updateScreenWidth(window.screenWidth)
      }
    })
  },

  computed: {
    permission () {
      return this.$store.state.Common.permission
    },
    isHidden () {
      return this.$route.meta.hidden
    },
    layoutName () {
      return this.$route.meta.layout
    },
    appName () {
      return this.$route.query.appName || ''
    },
    isRecordsCenter () {
      return dataCenterRoutePath.includes(this.$route.path)
    },
    pathName () {
      return this.$route.name
    },
    ...mapState('User', {
      mapLanLonList: 'mapLanLonList'
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray',
      isFullScreen: 'isFullScreen'
    }),
    isControlList () {
      return this.permissionsArray.includes('control:control')
    }
  },
  watch: {
    mapLanLonList: {
      handler (val) {
        if (!val || val.length === 0) return
        this.$store.state.Map.roomDeviceList = []
        // 循环val 发送请求获取设备  经纬度为高德地图
        val.forEach(element => {
          const list = element.map(_c => {
            return {
              latitude: _c.lat,
              longitude: _c.lng
            }
          })
          this.getDeviceListByLocation(list)
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions('Map', {
      getDeviceListByLocation: 'getDeviceListByLocation'
    }),
    ...mapMutations('analysisJudgement', {
      updateScreenHeight: 'updateScreenHeight',
      updateScreenWidth: 'updateScreenWidth'
    }),
    noPadding () {
      if ((this.pathName === "devicemap" && this.$route.meta.title) || this.isRecordsCenter || this.pathName === 'controlWarn') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang='less' scoped>
.system_wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .header_wrap {
    width: 100%;
    height: 90px;
    margin-right: 16px;
  }
  .container_wrap {
    display: flex;
    width: 100%;
    height: calc(100% - 90px);
    &.full_screen {
      height: 100%;
    }
    .sys_container {
      position: relative;
      flex: 1;
      height: 100%;
      padding-right: 32px;
      overflow: auto;
      &.no_padding {
        padding-right: 0;
      }
      /deep/.box {
        margin-left: 32px;
      }
    }
  }
}
.container-wrap {
  padding: 0 32px;
  height: 100%;
  overflow-y: auto;
  // background-color: var(--bg-color-1);
  //animation-direction: ;
}
.warn_message_list {
  position: fixed;
  right: 56px;
  bottom: 56px;
  z-index: 9999;
  &.to_right {
    animation: hide 0.5s linear;
    animation-fill-mode: forwards;
  }
  &.to_left {
    animation: show 0.5s linear;
    animation-fill-mode: forwards;
  }
  @keyframes hide {
    from {
      right: 56px;
    }
    to {
      right: -30px;
    }
  }
  @keyframes show {
    from {
      right: -30px;
    }
    to {
      right: 56px;
    }
  }
}
.app_result_header {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 78px;
  background-image: var(--analysis-result-header);
  background-size: 100% 100%;
  font-size: 18px;
  color: var(--base-text-color-5);
  font-weight: bold;
  .app_name {
    width: 400px !important;
    text-align: center;
    margin-top: 20px;
  }
}
.app_result_container {
  height: calc(100% - 78px);
}
</style>
