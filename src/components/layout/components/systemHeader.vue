<template>
  <div class="system_header_wrap">
    <audio
      ref='audio'
      controls='controls'
      style='width: 0; height: 0'
      :src='`${publicPath}static/audio/warning.ogg`'
    ></audio>
    <div class="system_name">
      <span v-if="inWhiteList">公安大数据测试平台</span>
      <span v-else>{{ headerTitle || '' }}</span>
    </div>
    <div class="sys_container">
      <div class="system_tab_wrap" v-if="!inWhiteList">
        <div
          class="system_tab"
          v-for="item in tabList"
          :key="item.name"
          :class="{ active: activeTab.includes(item.name) }"
          @click="tabClick(item.name, item)"
        >
          <div class="tab">{{ item.navTitle }}</div>
        </div>
      </div>

      <div class="system_other_wrap" v-if="!inWhiteList">
        <div class="change_skin">
          <i class="iconfont icon-a-zu5567"  :class="skinIcon" @click="changeSkin" title="切换背景"></i>
        </div>
        <div
          class="system_other"
          v-for="item in otherTabList"
          :key="item.id"
          @click="tabClick(item.id)"
        >
          <div class="other_tab">
            <el-badge
              v-show="jobNum > 0"
              :value="jobNum"
              class="bubble"
              type="warning"
              v-if="item.id === 'task'"
            ></el-badge>
            <i
              :title="item.name"
              :class="['iconfont', item.icon, activeTab.includes(item.id) ? 'active_icon' : '']"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <!-- <RightDrawer
      v-if="Drawer.isShow"
      :drawer.sync="Drawer"
      :cusStyle="{ top: '90px', height: '946px' }"
      width="432px"
      oldRight="32px"
      moveRight="-432px"
      @close="handleClose"
    >
      <Jobs></Jobs>
    </RightDrawer> -->
    <CusElDrawer :Drawer.sync="Drawer" v-if="Drawer.isShow" @handleClose="handleClose">
      <Jobs></Jobs>
    </CusElDrawer>
  </div>
</template>

<script>
import { saveLog } from '@/api/login'
import whiteList from '@/config/whiteList'
import CusElDrawer from '@/components/BasicComponents/CusElDrawer'
// import RightDrawer from '@/components/BasicComponents/Drawer/rightDrawer'
import Jobs from '@/components/layout/newJobs'
// import Jobs from '@/components/layout/jobs'
import clickout from '@/directives/clickout'
import { mapActions, mapMutations, mapState } from 'vuex'
import { initTheme } from '@/assets/js/theme'
export default {
  name: 'SystemHeader',
  directives: {
    clickout
  },
  components: {
    CusElDrawer,
    Jobs,
    // RightDrawer
  },
  data () {
    const SYS_OTHER_BTN = [
      { id: 'task', name: '任务管理', icon: 'icon-renwubiao' },
      { id: 'departmentManagement', name: '系统设置', icon: 'icon-shezhi' },
      { id: 'logout', name: '退出系统', icon: 'icon-tuichu' }
    ]
    return {
      // form: {
      //   search_type: '',
      //   search_items: ''
      // },
      optionList: [],
      publicPath: process.env.BASE_URL,
      Drawer: {
        isShow: false,
        title: '任务管理',
        size: '24.1%'
      },
      headerTitle: '',
      tabList: [],
      theme: true,
      skinIcon:'icon-a-zu5567',
      otherTabList: Object.freeze(SYS_OTHER_BTN),
      sysRouteName: 'departmentManagement',
      isSearchNav: false, // 是否找到对应的路由，找到则高亮
      activeTab: [],
    }
  },
  created () {
    this.sysRouteName = this.getSysRouteName()
    this.headerTitle = this.$store.state.User.title
    document.title = this.headerTitle
    this.tabList = this.$store.state.User.headerList
    this.getTasks()
  },
  mounted () {
    this.theme = this.sysTheme === 'dark'
    this.skinIcon = this.sysTheme === 'dark' ? 'icon-a-zu5567' : 'icon-a-zu5565'
    const curName = this.$route.meta.parentName || '设备地图'
    if (!curName) return
    this.tabList.forEach((nav) => {
      if (curName.includes(nav.navTitle)) {
        this.activeTab.push(nav.name)
      }
    })
    this.otherTabList.forEach((nav) => {
      if (curName.includes(nav.name)) {
        this.activeTab.push(nav.id)
      }
    })
    this.bus.$on('newWarning', this.playAudio)
    // console.log(this.tabList);
    // console.log(this.activeTab);
  },
  computed: {
    ...mapState('User', { sysTheme: 'theme' }),
    inWhiteList () {
      return whiteList.includes(this.$route.name)
    },
    ...mapState('DataCenter', {
      jobNum: 'jobNum',
      jobPanelShow: 'jobPanelShow'
    }),
  },
  watch: {
    jobPanelShow (newValue) {
      this.Drawer.isShow = newValue
    },
    '$route.query.warnType' () {
      const curName = this.$route.meta.parentName || '设备地图'
      if (!curName) return
      this.tabList.forEach((nav) => {
        if (curName.includes(nav.navTitle)) {
          this.activeTab=[nav.name]
        }
      })
    },
    '$route.name': {
      handler (newVal) {
        if (newVal !== 'departmentManagement' && !this.tabList.find(tab => tab.name === newVal)) return
        let isTask = this.activeTab.includes('task')
        this.activeTab = []
        this.activeTab.push(newVal)
        isTask && this.activeTab.push('task')
      }
    }
  },
  methods: {
    ...mapMutations('DataCenter', {
      setJobPanelShow: 'setJobPanelShow'
    }),
    ...mapActions('DataCenter', {
      getTasks: 'getTasks'
    }),
    ...mapMutations('User', {
      setTheme: 'setTheme'
    }),
    changeSkin () {
      this.skinIcon = this.skinIcon === 'icon-a-zu5567' ? 'icon-a-zu5565' : 'icon-a-zu5567'
      this.theme = this.skinIcon === 'icon-a-zu5567' ? true : false
      localStorage.setItem('theme', this.theme ? 'dark' : 'light')
      this.setTheme(this.theme ? 'dark' : 'light')
      initTheme(this.theme)
      this.bus.$emit('theme')
    },
    playAudio () {
      this.$nextTick(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      })
    },
    handleClickOut () {
      let index = this.activeTab.findIndex(item => item === 'task')
      if (index > -1) {
        this.activeTab.splice(index, 1)
      }
    },
    tabClick (active, item) {
      localStorage.removeItem('recordImportName')
      if (active === 'task') {
        this.activeTab.push(active)
        this.setJobPanelShow(true)
      }
      if (active === 'task') {
        this.setJobPanelShow(true)
      } else if (active === 'departmentManagement') {
        this.$router.push({
          name: this.sysRouteName
        })
      } else if (active === 'logout') {
        this.$store.dispatch('Common/LoginOut').then(() => {
          sessionStorage.clear()
          this.$router.push({ path: '/ol/login' })
        })
      } else {
        this.$store.commit('Common/setTablePage', null)
        this.$router.push({ name: active })
        let firstArray = ['设备地图', '全库搜索', '分析研判'] // 需要发saveLog请求的一级菜单集合
        if (firstArray.indexOf(item.navTitle) !== -1) {
          let params = {
            menuMark: 'menuMark',
            itemName: ''
          }
          if (!item.secondtitle) {
            params.itemName = item.navTitle
          } else {
            params.itemName = item.navTitle + '-' + item.secondtitle.title
          }
          saveLog(params)
            .then(() => {
            })
            .finally(() => { })
        }
      }
      // console.log(this.activeTab);
    },
    getSysRouteName () {
      let item = this.$store.state.Common.RouterList.find(i => {
        return i.itemName == '系统设置'
      })
      // if (!item || item.children || item.children.length === 0) return 'departmentManagement'
      // return item.children[0].name
      if (item && item.children && item.children.length) {
        return item.children[0].name
      }
    },
    handleClose () {
      this.activeTab = this.activeTab.filter(item => item !== 'task')
      this.setJobPanelShow(false)
    },
  },
  beforeDestroy () {
    this.bus.$off('newWarning')
  }
}
</script>

<style lang='less' scoped>
.system_header_wrap {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  padding: 16px 0 25px 32px;
  background-image: var(--sys-header-bg);
  // background-image: url(~@/assets/img/sys-header-bg-light.png);
  background-size: 100% 100%;
  background-color: var(--heared-bg-color);
  .system_name {
    width: 28%;
    span {
      color: var(--title-text-color);
      font-size: 26px;
      line-height: 35px;
    }
  }
  .sys_container {
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    width: 72%;
    padding: 10px 32px 0 84px;

    .system_tab_wrap {
      display: flex;
      flex: 1;
      color: var(--primary-menu-text-color);
      .system_tab {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin-right: 7%;
        font-size: 18px;
        font-weight: bold;
        line-height: 24px;
        cursor: pointer;
        &:hover {
          color: var(--active-color);
        }
        .tab {
          padding: 0 8px;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        &.active {
          color: var(--active-color);
          &::after {
            content: '';
            display: block;
            height: 5px;
            background-image: var(--system-tab-active-line);
            background-size: 100% 100%;
          }
        }
      }
      .system_tab:last-child {
        margin-right: 0;
      }
    }
    .system_other_wrap {
      display: flex;
      box-sizing: border-box;
      padding-top: 5px;
      flex: none;
      .change_skin{
        cursor: pointer;
      }
      .system_other {
        width: 16px;
        height: 16px;
        margin-left: 16px;
        cursor: pointer;
        .other_tab {
          position: relative;
          .bubble {
            position: absolute;
            top: -5px;
            right: -12px;
          }
          i {
            font-size: 16px;
            color: var(--base-text-color-to-999999);
            &.active_icon {
              color: var(--active-color);
            }
          }
        }
      }
    }
  }
}
</style>
