<template>
<div
  class='app_result_wrap'
  id='appResult'
  v-p-loading="loading"
  element-loading-text="数据加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="--bg-color-3"
>
  <template v-if='!isEmpty'>
    <PGridLayout
      :layout='resultList'
      :colNum='4'
      :rowHeight='156'
      :isDraggable='false'
      :isResizable='false'
    >
      <AppModuleContent
        slot='itemContent'
        slot-scope='{ info, index }'
        :id='info.htmlId'
        :moduleInfo='info'
        :moduleType='info.moduleType'
        :currentPage='+currentPage'
        @linkSkip='linkSkip'
        @upDateLinkInfo='upDateLinkInfo(index)'
      >
        <template slot='opera'>
          <i
            v-show='!info.runningFlag'
            class='iconfont icon-a-zu6140'
            title='刷新'
            :class='{
              "is_disabled": !info.refreshFlag || info.errorFlag
            }'
            @click='appDevops(info)'
          ></i>
        </template>
        <div v-show='info.runningFlag' class='running_state' slot='noContent'>
          <i class='el-icon-loading'></i>
          <div class='tip'>运行中</div>
        </div>
      </AppModuleContent>
    </PGridLayout>
    <div v-if='openPageInfo.length' class='return' @click='returnLast'>
      <i class='iconfont icon-fanhui'></i>
      <span>返回</span>
    </div>
  </template>
  <NoEmpty v-else-if='!loading && isEmpty'></NoEmpty>
</div>
</template>

<script>
import PGridLayout from '@/components/VisualComponents/GridLayout'
import NoEmpty from '@/components/BasicComponents/NoEmpty/index.vue'
import AppModuleContent from '../app-content'
import {
  getAppPageModulesApi,
  appDevopsApi,
  updateStateApi
} from '@/api/analysisJudgment'
import { mapState } from 'vuex'

export default {
  name: 'AppResult',
  components: {
    PGridLayout,
    AppModuleContent,
    NoEmpty
  },
  data () {
    return {
      runningList: [], // 运行中的模块
      appInfo: {}, // app的信息
      resultList: [], // 应用数据
      openPageInfo: [], // 打开页面和链接到页面的信息，用于点击返回配置页面数据
      currentPage: null,
      loading: false,
      time: null,
    }
  },
  watch: {
    'runningList.length': {
      handler (newVal) {
        if (newVal) {
          if (this.time) return
          this.time = setInterval(() => {
            this.updateModuleState()
          }, 10000)
        } else {
          clearInterval(this.time)
          this.time = null
        }
      }
    }
  },
  computed: {
    ...mapState('User', {
      userInfo: 'userInfo',
    }),
    isEmpty () {
      return !this.appInfo.homePageId || !this.resultList.length
    }
  },
  created () {
    this.loading = true
    document.title = this.$route.query.appName || ''
    this.appInfo = this.$route.query
  },
  mounted () {
    if (this.appInfo.homePageId) {
      this.currentPage = this.appInfo.homePageId
      this.getPageModules(this.currentPage).then(() => {
        if (this.appInfo.focusModule && this.resultList.some(item => item.id === +this.appInfo.focusModule)) {
          this.$nextTick(() => {
            document.getElementById(`result${this.appInfo.focusModule}`).scrollIntoView()
          })
        }
      })
    } else {
      this.loading = false
    }
  },
  methods: {
    // 运行
    appDevops (info) {
      if (!info.refreshFlag || info.errorFlag) return
      appDevopsApi({
        record_id: info.maxRecordId,
        operator: this.userInfo.username
      }).then(() => {
        info.runningFlag = true
        this.runningList.push(info.id)
      })
    },
    // 获取页面的模块信息
    getPageModules (pageId, isLink, linkParam) {
      return new Promise((resolve, reject) => {
        this.resultList = []
        this.runningList = []
        getAppPageModulesApi({
          appId: this.appInfo.appId,
          pageId
        }).then(res => {
          let result = res || []
          result.forEach(item => {
            const coordinateInfo = item.containerCoordinate.split(',')
            this.resultList.push({
              ...item,
              i: item.id + '',
              moduleName: item.containerName,
              x: +coordinateInfo[0],
              y: +coordinateInfo[1],
              w: +coordinateInfo[2],
              h: +coordinateInfo[3],
              htmlId: `result${item.id}`,
              isLink: isLink ? item.id === isLink : false,
              linkParams: item.id === isLink ? linkParam : [],
              runningFlag: item.runningFlag
            })
            if (item.runningFlag) this.runningList.push(item.id)
          })
          resolve()
        }).catch(() => {
          reject()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    updateModuleState () {
      let params = new FormData()
      params.append('containerIdList', this.runningList)
      updateStateApi(params).then(res => {
        let result = res || {}
        let updateList = []
        this.runningList.forEach(module => {
          if (result[module]) {
            updateList.push(module)
          } else {
            let ind = this.resultList.findIndex(item => item.id === module)
            ind !== -1 && (this.resultList[ind].runningFlag = false)
          }
        })
        this.runningList = updateList
      })
    },
    // 链接跳转
    linkSkip (linkInfo, needLocal = true) {
      if (linkInfo.errorFlag) {
        this.$message.error(linkInfo.errorMsg)
        return
      }
      let positionFun = () => {
        let ind = this.resultList.findIndex(item => item.id === linkInfo.linkContainerId)
        if (ind > -1) {
          const result = this.resultList[ind]
          result.linkParams = linkInfo.matchInfo
          result.isLink = true
          needLocal && this.$nextTick(() => {
            document.getElementById(result.htmlId).scrollIntoView()
          })
        }
      }
      if (+linkInfo.linkPageId === +this.currentPage) {
        positionFun()
        return
      }
      this.loading = true
      this.getPageModules(linkInfo.linkPageId, linkInfo.linkContainerId, linkInfo.matchInfo).then(() => {
        this.openPageInfo.push(this.currentPage)
        this.currentPage = linkInfo.linkPageId
        needLocal && this.$nextTick(() => {
          document.getElementById(`result${linkInfo.linkContainerId}`).scrollIntoView()
        })
      })
    },
    // 链接成功之后清空模块链接信息
    upDateLinkInfo (ind) {
      let value = this.resultList[ind]
      value.linkParams = []
      value.isLink = false
    },
    // 点击返回
    returnLast () {
      const lastPageId = this.openPageInfo.slice(-1)[0]
      this.openPageInfo = this.openPageInfo.slice(0, -1)
      this.currentPage = lastPageId
      this.loading = true
      this.getPageModules(lastPageId).finally(() => {
        this.$nextTick(() => {
          document.getElementById('appResult').scrollTo({
            top: 0
          })
        })
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.time)
    this.time = null
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.app_result_wrap {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  overflow-y: auto;
  .return {
    position: fixed;
    top: 16px;
    right: 32px;
    cursor: pointer;
  }
  i {
    font-size: 16px;
    color: var(--primary-menu-text-color);
    margin-right: 8px;
  }
  span {
    float: right;
    font-size: 14px;
    font-weight: bold;
    color: var(--base-text-color-1);
  }
  .icon-a-zu6140 {
    &.is_disabled {
      cursor: not-allowed !important;
      opacity: 0.4;
    }
  }
}
/deep/.module_content {
  .running_state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    i {
      font-size: 16px;
    }
    .tip {
      margin: 3px 0;
      font-size: 14px;
      line-height: 16px;
      color: var(--base-text-color-to-666666);
    }
  }
}
</style>
