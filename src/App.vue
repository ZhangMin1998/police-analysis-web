<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import warterMark from "@/utils/waterMark"
import socket from '@/mixins/socket'
// import DevicePixelRatio from '@/utils/devicePixelRatio.js';
import { mapMutations, mapState } from 'vuex'
// import { authorityById } from '@/api/sysSetting'
export default {
  name: 'App',
  mixins: [socket],
  computed: {
    ...mapState('User', {
      userInfo: 'userInfo',
    }),
  },
  /**
   * 监听id 已登录开启消息  退出关闭消息
   */
  watch: {
    // personId (newValue) {
    //   console.log(newValue)
    //   if (newValue) {
    //     const hastoken = window.location.search.indexOf('token')
    //     if (hastoken) {
    //       setTimeout(() => {
    //         this.queryInfo()
    //       }, 1000)
    //     } else {
    //       this.queryInfo()
    //     }
    //     // this.initWebSocket()
    //   } else {
    //     // this.disconnect()
    //     // warterMark.set(' ')
    //   }
    // },
  },
  data () {
    return {
      // personInfo: ''
    }
  },
  created () {
    // new DevicePixelRatio().init();
    const loading = document.getElementById('loading')
    loading && document.body.removeChild(loading)
    document.title = '大数据实战平台'
    if (localStorage.getItem('personId')) {
      this.$store.state.Common.personId = localStorage.getItem('personId')
    }
    this.setTheme(localStorage.getItem('theme') || 'dark')
  },

  mounted () {
    this.bus.$on('theme', () => {
      if (this.userInfo.realName && this.userInfo.jobNumber) {
        const personInfo = this.userInfo.realName + ' ' + this.userInfo.jobNumber
        warterMark.set(personInfo)
      }

    })
  },
  beforeDestory () {
    this.bus.$off('theme')
  },
  methods: {
    ...mapMutations('User', {
      setTheme: 'setTheme'
    }),
    // queryInfo () {
    //   authorityById(localStorage.getItem('personId')).then(res => {
    //     if (res) {
    //       this.personInfo = res.realName + ' ' + res.jobNumber
    //       warterMark.set(this.personInfo)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less">
@import url('./assets/css/common.less');

body {
  // background-color: #1B2132;
  // 防止 加滚动条抖动
  overflow-y: hidden;
}

#app {
  background: var(--heared-bg-color);
  height: 100vh;
  width: 100%;
  // width: 100vw;
  // background-image: url('~@/assets/img/bg.png');
  //background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.container {
  min-height: calc(100vh - 104px);
  position: relative;
  overflow: hidden;
  // margin: 0 24px;
  margin-right: 32px;
}

.other {
  margin-left: 155px;
  width: calc(100% - 155px);
}

// .el-dialog,
//.el-pager li {
//  background-color: #202a3e !important;
//}

.p-dialog .el-dialog__header {
  display: none;
}

.p-dialog .el-dialog__body {
  padding: 0;
}</style>
