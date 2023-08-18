<template>
<div class='app_set_wrap'>
  <div class='app_header'>
    <div class='header_left'>
      <img :src='require("@/assets/img/title-header.png")' alt=''>
      <div class='tip'>应用设置</div>
    </div>
    <div class='header_right' @click='toHomePage'>
      <i class='iconfont icon-fanhui'></i>
      <span>返回</span>
    </div>
  </div>
  <div
    v-p-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="'--loading-color-1'"
    class='app_set_container'
  >
    <Tab :tabNav.sync="tabNav" @handleClick="addApp" />
    <div id='contentWrap' class='content' @scroll='scrollRecord'>
<!--      <draggable
        v-model='onlineAppList'
        animation="300"
        class='app_wrap'
      >-->
      <div
        class='app_wrap'
      >
        <div
          v-for='item in onlineAppList'
          :key='item.id'
          class='app_box'
        >
          <AppItem
            :appInfo='item'
          >
            <div
              v-if='item.userId === loginUserId || isAdmin'
              slot='operaLab'
              class='opera_lab'
            >
              <i
                :class='{
                  "iconfont": true,
                  "icon-jinyong": true,
                  "is_disable": item.status === "deactivate"
                }'
                title='停用'
                @click.stop='appDisable(item)'
              ></i>
            </div>
          </AppItem>
        </div>
      </div>
      <div v-if='localAppList.length' class='local_tip'>本地应用</div>
<!--      <draggable
        v-model='localAppList'
        animation="300"
        class='app_wrap'
      >-->
      <div
        class='app_wrap'
      >
        <div
          v-for='(item, index) in localAppList'
          :key='item.id'
          class='app_box'
        >
          <AppItem
            :appInfo='item'
          >
            <div slot='operaLab' class='opera_lab'>
              <i
                class='iconfont icon-gongkai'
                title='公开'
                @click.stop='openApp(item)'
              ></i>
              <i
                :class='{
                  "iconfont": true,
                  "icon-bianji": true,
                  "is_disable": item.appCategory === "import" && item.importType === "URL"
                }'
                title='编辑'
                @click.stop='toEdit(item)'
              ></i>
              <i
                class='iconfont icon-gengduo'
                title='更多'
                @mouseover='mouseOn($event, item, index)'
                @mouseout='mouseOut'
                @click.stop
              ></i>
            </div>
          </AppItem>
        </div>
      </div>
    </div>
  </div>
  <div class='more_dialog' v-show='showDialog' :style='{ "top": operaTop, "left": operaLeft }' @mouseover='dialogMouseOn' @mouseout='mouseOut'>
    <div class='more_opera' @click='updateAppInfo'>设置</div>
    <div class='more_opera' @click='copyApp'>复制</div>
    <div class='more_opera' @click.stop='delApp'>删除</div>
  </div>
  <Pop
    :pop.sync="disableDialog"
    @beforeClose="closeDisablePop"
    @beforeOpen="openDisablePop"
    :dataCenterDetail="true"
  >
    <AppStop
      :appInfo='currentDisApp'
      @closeDialog='closeDisablePop'
    ></AppStop>
  </Pop>
  <Pop
    :pop.sync="addAppDialog"
    dialogClass='add_app_dialog'
    @beforeClose="closeAddAppPop"
    @beforeOpen="openAddAppPop"
    :dataCenterDetail="true"
  >
    <AddApp
      :editInfo='currentUpdateApp'
      @closeDialog='closeAddAppPop'
    ></AddApp>
  </Pop>
  <Pop
    :pop.sync="openAppDialog"
    dialogClass='add_app_dialog'
    @beforeClose="closeOpenAppPop"
    @beforeOpen="openAppPop"
    :dataCenterDetail="true"
  >
    <OpenApp
      :editInfo='currentUpdateApp'
      @closeDialog='closeOpenAppPop'
    ></OpenApp>
  </Pop>
</div>
</template>

<script>
import Tab from '@/components/BasicComponents/Tab'
import AppItem from '../app-item'
// import draggable from 'vuedraggable'
import Pop from '@/components/VisualComponents/PopDialog'
import AppStop from '../app-stop'
import AddApp from '../add-app'
import OpenApp from '../open-app'
import { formatUrlParams } from '../../config/config.js'
import {
  delAppApi,
  copyAppApi
} from '@/api/analysisJudgment'

const TAB_NAV = {
  list: [
    {
      name: '新建应用'
    }
  ]
}

export default {
  name: 'AppSet',
  inject: ['getAppData'],
  components: {
    Tab,
    AppItem,
    AppStop,
    AddApp,
    OpenApp,
    Pop,
    // draggable,
  },
  props: {
    isHomePage: {
      type: Boolean,
      default: false
    },
    // 发布的应用列表
    onlineAppList: {
      type: Array,
      default: () => []
    },
    // 本地的应用列表
    localAppList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      operaTop: '', // 更多弹窗定位
      operaLeft: '',
      operaDialogShow: false,
      noScroll: true,
      editApp: {}, // 更多操作当前操作的app
      tabNav: Object.freeze(TAB_NAV),
      disableDialog: { show: false, title: '停用', width: '500px' },
      addAppDialog: { show: false, title: '新建应用', width: '594px' },
      openAppDialog: { show: false, title: '公开', width: '508px' },
      currentDisApp: null, // 当前停用应用的数据
      currentUpdateApp: null,
      loading: false
    }
  },
  computed: {
    showHomePage: {
      get () {
        return this.isHomePage
      },
      set (value) {
        this.$emit('update:isHomePage', value)
      }
    },
    // 鼠标悬浮显示更多下拉框
    showDialog () {
      return this.noScroll && this.operaDialogShow
    },
    loginUserId () {
      return this.$store.state.User.userInfo.id
    },
    isAdmin () {
      return this.$store.state.User.userInfo['userRoleList'] &&
        this.$store.state.User.userInfo['userRoleList'].some(role => role.roleId === 1)
    }
  },
  created () {
  },
  methods: {
    // 点击返回
    toHomePage () {
      this.showHomePage = true
    },
    // 点击禁用
    appDisable (item) {
      if (item.status === "deactivate") return
      this.currentDisApp = item
      this.openDisablePop()
    },
    // 点击新建应用
    addApp () {
      this.addAppDialog.title = '新建应用'
      this.openAddAppPop()
    },
    // 点击设置
    updateAppInfo () {
      this.currentUpdateApp = this.editApp
      this.addAppDialog.title = '设置'
      this.openAddAppPop()
    },
    // 前往编辑页面
    toEdit (item) {
      if (item.appCategory === "import" && item.importType === "URL") return
      let win = window.open('', item.id + 'edit')
      if (win.location.href === 'about:blank') {
        window.open(
          window.location.origin + '/ol/analysisEdit?appId=' + item.id +
            '&appName=' + item.appName +
            '&type=app',
          item.id + 'edit'
        )
      } else {
        const params = formatUrlParams(win.location.href)
        if (params.type !== 'app') {
          win.location.href = window.location.origin + '/ol/analysisEdit?appId=' + item.id +
            '&appName=' + item.appName +
            '&type=app'
        }
        win.focus()
      }
    },
    // 清除App
    delApp () {
      this.$policeComfirm('应用删除后不可恢复，是否继续操作？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('appId', this.editApp.id)
        delAppApi(params).then(() => {
          this.$message.success('应用删除成功！')
          this.getAppData('local', 'localAppList')
        })
      })
    },
    // 复制App
    copyApp () {
      let params = new FormData()
      params.append('appId', this.editApp.id)
      copyAppApi(params).then(() => {
        this.$message.success('应用复制成功！')
        this.editApp = {}
        this.getAppData('local', 'localAppList')
      })
    },
    // 公开app
    openApp (item) {
      this.currentUpdateApp = item
      this.openAppPop()
    },
    // 更多鼠标移入事件
    mouseOn (e, item, index) {
      if (!this.noScroll) return
      if (this.editApp.id !== item.id) {
        const boxScrollTop = document.getElementById('contentWrap').scrollTop
        const headerTop = this.formatPx(90)
        const offSetHeight = this.formatPx(16)
        let lastRowHeight = 0
        if (this.localAppList.length - index <= this.localAppList.length % 8)
          lastRowHeight = 112 * document.documentElement.style.fontSize.split('px')[0] / 192
        this.operaTop = e.target.offsetTop - boxScrollTop + offSetHeight + headerTop - lastRowHeight + 'px'
        this.operaLeft = e.target.offsetLeft + 'px'
        this.editApp = item
      }
      this.operaDialogShow = true
    },
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    // 更多和弹窗鼠标移出事件
    mouseOut () {
      this.operaDialogShow = false
    },
    // 应用内容滚动事件
    scrollRecord () {
      if (!this.noScroll) return
      this.noScroll = false
      this.operaDialogShow = false
      setTimeout(() => {
        this.noScroll = true
      }, 200)
    },
    // 弹窗鼠标移入事件
    dialogMouseOn () {
      if (!this.noScroll) return
      this.operaDialogShow = true
    },
    openDisablePop () {
      this.disableDialog.show = true
    },
    closeDisablePop (isUpdate) {
      this.disableDialog.show = false
      this.currentDisApp = null
      if (!isUpdate) return
      this.updateData()
    },
    openAddAppPop () {
      this.addAppDialog.show = true
    },
    closeAddAppPop () {
      this.addAppDialog.show = false
      this.currentUpdateApp = null
      this.editApp = {}
    },
    openAppPop () {
      this.openAppDialog.show = true
    },
    closeOpenAppPop (isUpdate) {
      this.openAppDialog.show = false
      this.currentUpdateApp = null
      if (!isUpdate) return
      this.updateData()
    },
    updateData () {
      this.loading = true
      Promise.all([
        this.getAppData('communal', 'onlineAppList'),
        this.getAppData('local', 'localAppList')
      ].map(item => item.catch(() => []))).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.app_set_wrap {
  width: 100%;
  height: 100%;
  .app_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 2px;
    padding: 16px 24px;
    background: var(--bg-color-3);
    .header_left {
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .tip {
        color: var(--base-text-color-1);
        font-size: 18px;
        font-weight: bold;
        line-height: 24px;
      }
    }
    .header_right {
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--primary-menu-text-color);
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: var(--base-text-color-1);
      }
    }
  }
  .app_set_container {
    height: calc(100% - 58px);
    background: var(--bg-color-3);
    .content {
      width: 100%;
      height: calc(100% - 72px);
      // padding: 0 24px;
      padding: 0 24px 40px 24px;
      overflow-y: auto;
      .app_wrap {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .app_box {
          width: calc((100% - 112px) / 8);
          height: 214px;
          margin-right: 16px;
          margin-bottom: 16px;
          &:nth-child(8n) {
            margin-right: 0;
          }
        }
      }
      .opera_lab {
        display: flex;
        justify-content: flex-end;
        i {
          font-size: 16px;
          line-height: 16px;
          color: var(--primary-menu-text-color);
          margin-left: 16px;
          &.is_disable {
            cursor: not-allowed;
            opacity: 0.4;
          }
        }
      }
      .local_tip {
        margin: 16px 0;
        font-size: 18px;
        color: var(--base-text-color-1);
        font-weight: bold;
      }
    }
    /deep/.tab_wrap {
      height: 72px;
      .Tabs {
        position: static;
        float: right;
        padding: 24px 24px 16px;
        .Tabs_item {
          margin-bottom: 0;
        }
      }
    }
  }
  .more_dialog {
    position: fixed;
    min-width: 82px;
    background: var(--datapicker-shijian-xiala-bg-color);
    border: 1px solid var(--border-color-1);
    z-index: 10;
    .more_opera {
      padding: 0 20px;
      line-height: 32px;
      font-size: 14px;
      white-space: nowrap;
      color: var(--base-text-color-2);
      cursor: pointer;
      &:hover {
        background: var(--datapicker-in-range-bg-color);
        color: var(--base-text-color-1);
      }
    }
  }
  /deep/.data_center_detail .el-dialog__wrapper .el-dialog .el-dialog__body {
    padding: 30px 32px 32px !important;
  }
  /deep/.data_center_detail .el-dialog__wrapper .add_app_dialog .el-dialog__body {
    padding: 24px 40px 32px 32px !important;
  }
}
</style>
