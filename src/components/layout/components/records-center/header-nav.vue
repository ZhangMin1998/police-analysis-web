<template>
  <div class="headerNav">
    <!-- 超过14个菜单就变更导航方式 -->
    <div class='page_choice' v-if="curRoute['navList'].length > 14">
      <div class='page_info'>
        <div class='tip' @click='changeData'>
          <span>页面选择</span>
          <i class='el-icon-arrow-down' v-if='!showDataDialog'></i>
          <i class='el-icon-arrow-up' v-else></i>
        </div>
        <div class='choice_name' @click='changeData'>{{ nowDataName }}</div>
      </div>
      <transition name="el-zoom-in-top">
        <div class='all_page' v-show='showDataDialog'>
          <div class='left' v-if='allPageInfo.length'>
            <span @click='jumpTo(allPageInfo[0])' :class='{active: allPageInfo[0].title === nowDataName}'>{{ allPageInfo[0].title }}</span>
          </div>
          <div class='right'>
            <div class='other_page' v-for='(item, index) in otherPageInfo' :key='item.pathName + index'>
              <span @click='jumpTo(item)' :class='{active: item.title === nowDataName}'>{{ item.title }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <el-tabs v-model="currentTab" @tab-click="AtabNav" v-else>
      <el-tab-pane
        :label="item.title"
        :name="`${item.title},${item.pathName}`"
        v-for="(item, index) in curRoute['navList']"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import whiteList from '@/config/whiteList'
import config from '@/config/config.js'
export default {
  name: 'header-nav',
  data () {
    return {
      whiteList,
      currentTab: '',
      curRoute: {},
      categoryList: [],
      showDataDialog: false,
      nowDataName: '',
    }
  },
  watch: {
    '$route': {
      handler () {
        if (this.whiteList.includes(this.$route.name)) {
          this.curRoute = this.$route.matched[0].meta
          if (this.$route.name !== 'from-record-import') {
            this.nowDataName = this.$route.meta.title
            this.currentTab = `${this.$route.meta.title},${this.$route.name}`
          }
          // this.$route.query.pathName ? this.currentTab = this.$route.query.pathName : this.currentTab = this.$route.name
        } else {

          if (config.dependBackendRouter) {
            const matchRoute = this.RouterList.filter(route => this.$route.meta.parentId === route.id)
            this.curRoute = matchRoute[0].meta

          } else {
            const matchRoute = this.RouterList.filter(pRoute => {
              if (pRoute.children && pRoute.children.length) {
                let tempCRoute = pRoute.children.filter(route => {
                  return route.path == this.$route.path
                });
                if (tempCRoute.length) {
                  return pRoute
                }
              }
            })
            this.curRoute = matchRoute[0].meta
          }
          if (this.$route.name !== 'from-record-import') {
            this.nowDataName = this.$route.meta.title
            this.currentTab = `${this.$route.meta.title},${this.$route.name}`
          }
          // this.$route.query.pathName ? this.currentTab = this.$route.query.pathName : this.currentTab = this.$route.name
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('Common', {
      RouterList: 'RouterList'
    }),
    allPageInfo () {
      let list = this.curRoute?.navList.filter(item => item.pathName === 'dataCenterAll')
      return list
    },
    otherPageInfo () {
      let list = this.curRoute?.navList.filter(item => item.pathName !== 'dataCenterAll')
      return list
    }
  },
  created () {
    this.categoryList = JSON.parse(JSON.stringify(this.curRoute.navList))
  },
  mounted () {
    if (this.$route.name === 'from-record-import' && localStorage.getItem('recordImportName')) {
      this.nowDataName = localStorage.getItem('recordImportName')
      this.currentTab = `${localStorage.getItem('recordImportName')},${this.$route.name}`
    } else {
      this.nowDataName = this.$route.meta.title
      this.currentTab = `${this.$route.meta.title},${this.$route.name}`
    }
    if (this.$route.name === 'from-record-import') {
      this.$store.commit('DataCenter/setActiveLabTitle', this.nowDataName)
    }
    document.addEventListener('click', this.bodyClick)
  },
  methods: {
    AtabNav (item) {
      let routeInfo = item.paneName.split(',')
      if (routeInfo[1] === 'from-record-import') {
        this.$store.commit('DataCenter/setActiveLabTitle', routeInfo[0])
        localStorage.setItem('recordImportName', routeInfo[0])
      }
      this.$router.push({ name: routeInfo[1] })
    },
    jumpTo (item) {
      if (item.pathName === 'from-record-import') {
        this.nowDataName = item.title
        this.$store.commit('DataCenter/setActiveLabTitle', this.nowDataName)
        localStorage.setItem('recordImportName', this.nowDataName)
      }
      this.showDataDialog = false
      this.$router.push({ name: item.pathName })
    },
    changeData () {
      this.showDataDialog = !this.showDataDialog
    },
    bodyClick (e) {
      // 点击页面其他地方，关闭过滤选择器
      let newFilterDiv = document.querySelector('.page_choice')
      if (newFilterDiv && !newFilterDiv.contains(e.target)) {
        this.showDataDialog = false
      }
    }
  },
  destroyed () {
    document.removeEventListener('click', this.bodyClick)
  }
}
</script>

<style lang='less' scoped>
.headerNav {
  width: 100%;
  margin-bottom: 10px;
  .page_choice {
    position: relative;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 14px;
    font-size: 16px;
    .page_info {
      display: flex;
      line-height: 22px;
      .tip {
        margin-right: 24px;
        cursor: pointer;
        color: var(--base-text-color-1);
        span {
          margin-right: 16px;
        }
      }
      .choice_name {
        color: var(--active-color);
        cursor: pointer;
      }
    }
    .all_page {
      display: flex;
      position: absolute;
      top: 52px;
      left: -22px;
      width: calc(100% - 4px);
      background: var(--xuanzeqi-bg-color);
      box-shadow: var(--box-shadow);
      // background: var(--daochu-bg-color);
      padding: 30px 24px 16px;
      line-height: 22px;
      z-index: 10;
      .left {
        width: 72px;
        margin-right: 24px;
        span {
          cursor: pointer;
          white-space: nowrap;
          &:hover {
            color: var(--active-color);
          }
          &.active {
            color: var(--active-color);
          }
        }
      }
      .right {
        display: flex;
        flex-wrap: wrap;
        .other_page {
          width: 110px;
          margin-right: 12px;
          margin-bottom: 24px;
          span {
            white-space: nowrap;
            cursor: pointer;
            &:hover {
              color: var(--active-color);
            }
            &.active {
              color: var(--active-color);
            }
          }
        }
      }
    }
  }
  .filterBox {
    height: 32px;
    line-height: 32px;
    .filter {
      display: flex;
      .right-part {
        flex: 1;
      }
    }
    .filterComponent {
      margin-top: 10px;
    }
  }
}
/deep/.el-tabs__active-bar {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 1px !important;
  background-color: var(--active-color);
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  list-style: none;
}
/deep/.el-tabs__nav {
  white-space: nowrap;
  position: relative;
  transition: transform 0.3s;
  float: left;
  z-index: 2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
/deep/.el-tabs__nav-wrap::after {
  // width: 60%;
  height: 0px !important;
  background-color: rgba(255, 255, 255, 0.2) !important;
}
/deep/.el-tabs__item {
  color: var(--base-text-color-to-999999) !important;
  font-size: 16px !important;
  &:hover {
    color: var(--active-color) !important;
  }
}
/deep/.el-tabs__item.is-active {
  color: var(--active-color) !important;
  font-size: 16px !important;
}
/deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
