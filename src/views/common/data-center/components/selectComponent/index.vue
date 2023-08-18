<template>
  <div class="card">
    <div class="title-box">
      <div class="set">
        <img :src="require('@/assets/img/set-bg.png')" alt="" />
        <div>设置</div>
      </div>
      <i class="el-icon-close" @click="close" title="关闭"></i>
    </div>
    <div class="main">
      <div class="main-tips">
        <i class="iconfont icon-zhushi"></i>
        <span class="tipContent">{{ tipContent }}</span>
      </div>
      <div class="main-checkbox">
        <el-checkbox-group v-model="checkedArray" :max="max">
          <el-checkbox
            v-for="(item, index) in curRoute"
            :label="item.title"
            :key="index"
            :disabled="item.disabled"
            >{{ item.title }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <div class="button-box" :class="{ is_position: selectBottom }" :style="{ bottom: btnBottom }">
      <div class="btn">
        <div class="blank_button" @click="cancel">取消</div>
        <el-button type="primary" @click="yes">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import whiteList from '@/config/whiteList'
import config from '@/config/config.js'
export default {
  inject: ['choicePanel'],
  props: {
    max: {
      type: Number,
      default: null
    },
    tipContent: {
      type: String,
      default: ''
    },
    defaultChecked: {
      type: Array,
      default: () => []
    },
    disabledData: {
      type: Array,
      default: () => []
    },
    selectBottom: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      whiteList,
      checkedArray: [],
      curRoute: []
    }
  },
  computed: {
    ...mapState('Common', {
      RouterList: 'RouterList'
    }),
    btnBottom () {
      return this.$pxToRem(+this.selectBottom)
    },
    // curRoute () {
    //   if (this.whiteList.includes(this.$route.name)) {
    //     let routeList = this.$route.matched[0].meta
    //     routeList.forEach(item => {
    //       if (this.disabledData.some(name => item.pathName + '' === name + '')) {
    //         item.disabled = true
    //       } else {
    //         item.disabled = false
    //       }
    //     })
    //     return routeList
    //   } else {
    //     // const matchRoute = this.RouterList.filter(route => this.$route.meta.parentId == route.id)
    //     let matchRoute
    //     if (config.dependBackendRouter) {
    //       matchRoute = this.RouterList.filter(route => this.$route.meta.parentId == route.id)
    //       // return matchRoute[0].meta
    //     }else {
    //       matchRoute = this.RouterList.filter(pRoute => {
    //         if(pRoute.children && pRoute.children.length){
    //           let tempCRoute = pRoute.children.filter(route => {
    //             return route.path == this.$route.path
    //           });
    //           if(tempCRoute.length){
    //             return pRoute
    //           }
    //         }
    //       })
    //     }
    //     let routeList = matchRoute[0].meta.navList.slice(1)
    //     routeList.forEach(item => {
    //       if (this.disabledData.some(name => item.pathName + '' === name + '')) {
    //         item.disabled = true
    //       } else {
    //         item.disabled = false
    //       }
    //     })
    //     this.$store.commit('DataCenter/setRouteList', routeList)
    //     return routeList
    //   }
    // }
  },
  created () {
    if (this.whiteList.includes(this.$route.name)) {
      let routeList = this.$route.matched[0].meta
      routeList.forEach(item => {
        if (this.disabledData.some(name => item.pathName + '' === name + '')) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
      this.curRoute = routeList
    } else {
      // const matchRoute = this.RouterList.filter(route => this.$route.meta.parentId == route.id)
      let matchRoute
      if (config.dependBackendRouter) {
        matchRoute = this.RouterList.filter(route => this.$route.meta.parentId == route.id)
        // return matchRoute[0].meta
      } else {
        matchRoute = this.RouterList.filter(pRoute => {
          if (pRoute.children && pRoute.children.length) {
            let tempCRoute = pRoute.children.filter(route => {
              return route.path == this.$route.path
            })
            if (tempCRoute.length) {
              return pRoute
            }
          }
        })
      }
      let routeList = matchRoute[0].meta.navList.slice(1)
      routeList.forEach(item => {
        if (this.disabledData.some(name => item.pathName + '' === name + '')) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
      this.$store.commit('DataCenter/setRouteList', routeList)
      this.curRoute = routeList
    }
    this.checkedArray = JSON.parse(JSON.stringify(this.defaultChecked))
  },
  methods: {
    close () {
      this.$emit('close', false)
    },
    cancel () {
      this.$emit('close', false)
    },
    yes () {
      if (!this.checkedArray.length) {
        this.$messageTip.error('请至少选择一种数据')
        return
      }
      let result = {
        label: [],
        value: []
      }
      result['label'] = JSON.parse(JSON.stringify(this.checkedArray))
      this.checkedArray.forEach(item => {
        result['value'].push(this.choicePanel['TITLE_TO_TYPE'][item])
      })
      this.$emit('checkedResult', result)
      this.$emit('close', false)
    },
    getStartData () {
      if (this.max) {
        if (this.max >= this.curRoute.length) {
          let dataList = JSON.parse(JSON.stringify(this.curRoute))
          dataList.forEach(item => {
            item['dataType'] = this.choicePanel['TITLE_TO_TYPE'][item.title]
          })
          return dataList
        } else {
          // return this.curRoute.slice(0, this.max)
          // 默认展示复工复产的数据看板
          const showWhich = this.curRoute.filter((item) => {
            return item.title === '复工复产'
          })
          if (showWhich.length) {
            showWhich[0]['dataType'] = this.choicePanel['TITLE_TO_TYPE'][showWhich[0].title]
            return showWhich
          } else {
            let dataList = this.curRoute.slice(0, this.max)
            dataList.forEach(item => {
              item['dataType'] = this.choicePanel['TITLE_TO_TYPE'][item.title]
            })
            return dataList
          }
        }
      }
      return this.curRoute
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: flex;
  flex-direction: column;
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute !important;
  top: 0px !important;
  left: 0 !important;
  background: var(--daochu-bg-color) !important;
  .title-box {
    flex: none;
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    margin: 0 24px 0 16px;
    border-bottom: 1px solid var(--active-color);
    box-sizing: border-box;
    i {
      color: var(--border-color-input);
    }
    .set {
      position: relative;
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      color: var(--base-text-color-1);
      font-weight: bold;
      div {
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
    i {
      font-size: 24px;
      cursor: pointer;
    }
  }
  .main {
    //flex: 1;
    margin: 16px 24px 16px 16px;
    .main-tips {
      display: flex;
      align-items: center;
      font-size: 16px;
      margin-bottom: 8px;
      .tipContent {
        margin-left: 8px;
        line-height: 1;
        color: var(--base-text-color-to-999999);
      }
      .icon-zhushi {
        font-size: 16px;
        color: var(--active-color);
      }
    }
    .main-checkbox {
      display: flex;
      /deep/.el-checkbox__label {
        display: inline-block;
        padding-left: 10px;
        line-height: 19px;
        font-size: 16px;
        //width: 72px;
        margin-top: 24px;
      }
      /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
        border-color: var(--checkbox-normal-color) !important;
        cursor: not-allowed;
      }
      /deep/.el-checkbox__input.is-disabled + span.el-checkbox__label {
        color: var(--checkbox-normal-color) !important;
      }
    }
  }
  .button-box {
    flex: none;
    margin: 0 24px 24px 0;
    .btn {
      display: flex;
      justify-content: flex-end;
    }
    &.is_position {
      position: absolute;
      right: 0;
    }
    .blank_button {
      margin-right: 16px;
    }
  }
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--base-text-color-1);
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background: var(--active-color) !important;
  border: 0 !important;
  &::after {
    top: 2px;
    left: 5px;
    border-color: #ffffff !important;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1439px) {
  .main-checkbox {
    /deep/.el-checkbox__label {
      width: 0.55rem !important;
    }
  }
}
@media screen and (min-width: 1440px) {
  .main-checkbox {
    /deep/.el-checkbox__label {
      width: 0.48rem;
    }
  }
}
</style>

