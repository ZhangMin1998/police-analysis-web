<template>
<div class='sys_con_left'>
  <div
    class='tab'
    v-for="(item, index) in curRoute['navList']"
    :key='index'
    @click='AtabNav(item)'
  >
    <div class='tab-icon' :class='{active: activeLeftIdx === index}'>
      <i class='iconfont' :class='[item.normalImg, activeLeftIdx === index ? "active" : ""]'></i>
    </div>
    <div class='tab-tip' :class='{active: activeLeftIdx === index}'>{{ item.title }}</div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import whiteList from '@/config/whiteList'
import { saveLog } from '@/api/login'
import config from '@/config/config.js'

export default {
  data () {
    return {
      whiteList
    }
  },
  mounted () {
    // let tabItemDivArr = document.querySelectorAll('.tab-item')
    // console.log(tabItemDivArr);
    // tabItemDivArr.forEach((item)=>{
    //   let imgDiv = item.querySelector('.el-image')
    //   console.log(imgDiv);
    //   let elImageInnerDiv = imgDiv.querySelector('img')
    //   console.log(elImageInnerDiv);
    // })
  },
  computed: {
    ...mapState('Common', {
      RouterList: 'RouterList'
    }),

    curRoute () {
      // 这里用于区别有没有登录，没有登录也可以访问directViews下的页面，直接返回其中的navlist
      if (this.whiteList.includes(this.$route.name)) {
        return this.$route.matched[0].meta
      } else {
        if (config.dependBackendRouter) {
          // 获取后端路由左侧导航栏
          let matchRoute
          if(this.$route.fullPath.includes('/config')|| this.$route.fullPath.includes('/deduce')){
            matchRoute = this.$route.matched[0].meta
          }else{
            matchRoute = this.RouterList.filter(route => this.$route.meta.parentId == route.id)
            matchRoute = matchRoute[0].meta
          }
          return matchRoute
        } else {
          // 获取前端路由左侧导航栏
          const matchRoute = this.RouterList.filter(pRoute => {
            if(pRoute.children && pRoute.children.length){
              let tempCRoute = pRoute.children.filter(route => {
                return route.path == this.$route.path
              });
              if(tempCRoute.length){
                return pRoute
              }
            }
          })
          return matchRoute[0].meta

        }
      }

    },

    // defaultImg () {
    //   return this.$store.state.User.leftMenuIcon
    // },

    /**
     * 判断左侧导航是否高亮
     * */
    activeLeftIdx () {
      let { name } = this.$route

      let belong = this.$route.meta.belong
      const list = this.curRoute.navList

      if (this.$route.query?.label) {
        belong = this.$route.query.label
      }

      let index = list.findIndex(_c => {
        return _c.pathName === name || _c.title == belong
      })

      // 如果找不到，说明是左侧子级下的页面
      if (index === -1) {
        const { meta } = this.$route
        name = meta.belong
        index = list.findIndex(_c => _c.pathName === name)
        return index
      }
      return index
    }

  },

  methods: {
    showImg (index, activeIdx) {
      const imgStatus = activeIdx === index ? 'activeImg' : 'normalImg'
      // console.log(this.curRoute['navList'][index][imgStatus]);
      return this.curRoute['navList'][index][imgStatus]
    },
    mouseoverEvent (imgDiv) {
      console.log(imgDiv.src);
    },
    AtabNav (item) {
      this.$store.commit('Common/setTablePage', null)
      let firstArray = ['设备地图', '全库搜索', '数据中心', '全息档案', '分析研判', '防控预警']
      for (let i = 0; i < this.RouterList.length; i++) {
        if (firstArray.indexOf(this.RouterList[i].itemName) !== -1) {
          for (let j = 0; j < this.RouterList[i].children.length; j++) {
            if (item.pathName === this.RouterList[i].children[j].name) {
              let params = {
                menuMark: 'menuMark',
                itemName: ''
              }
              params.itemName = this.RouterList[i].children[j].meta.parentName + '-' + item.title
              let tempArray = ['全库搜索', '分析研判'] // 需要发saveLog请求的一级菜单集合
              if (tempArray.indexOf(this.RouterList[i].children[j].meta.parentName) !== -1) {
                saveLog(params)
                  .then(() => {
                  })
                  .finally(() => { })
              }
            }
          }
        }
      }
      if (this.$route.name === item.pathName) {
        this.$store.state.Common.permission = false
        setTimeout(() => {
          this.$store.state.Common.permission = true
        }, 0)
      } else {
        // 跳转路由
        this.$router.push({ name: item.pathName })
      }
    }
  }
}
</script>

<style lang='less' scoped>
.sys_con_left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: none;
  width: 128px;
  height: 100%;
  overflow-y: auto;
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 22px;
    cursor: pointer;
    color: #4D597F;
    &:hover {
      color: var(--active-color);
    }
    .tab-icon {
      position: relative;
      display: flex;
      justify-content: center;
      width: 56px;
      height: 56px;
      background-image: url('~@/assets/img/sys-left-bg.png');
      background-size: 100% 100%;
      margin-bottom: 5px;
      .iconfont {
        font-size: 32px;
        margin-top: 4px;
        &.active {
          color: var(--active-color);
        }
      }
      &.active {
        background-image: url('~@/assets/img/sys-left-active.png');
        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 56px;
          height: 56px;
          background-image: url('~@/assets/img/sys-left-an.png');
          animation: up 1.5s infinite;
        }
      }
    }
    .tab-tip {
      font-size: 14px;
      font-weight: bold;
      line-height: 19px;
      &.active {
        color: var(--active-color);
      }
    }
  }
}
@keyframes up {
  from {
    top: 0;
  }
  to {
    top: -12px;
  }
}
</style>
