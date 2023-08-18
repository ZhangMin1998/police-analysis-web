<template>
<div class='analysis_wrap'>
  <div
    v-p-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="'--bg-color-3'"
    class='home_page'
    v-show='isHomePage'
  >
    <Tab :tabNav.sync="tabNav" @handleClick="toAppSet" />
    <div class='wrap_content'>
      <div
        class='app_box'
        v-for='item in allAppList'
        :key='item.id'
      >
        <AppItem
          :appInfo='item'
        ></AppItem>
      </div>
    </div>
  </div>
  <AppSet
    v-if='!isHomePage'
    :isHomePage.sync='isHomePage'
    :onlineAppList='onlineAppList'
    :localAppList='localAppList'
  ></AppSet>
</div>
</template>

<script>
import AppItem from './components/app-item'
import AppSet from './components/app-set'
import Tab from '@/components/BasicComponents/Tab'
import { getAppListApi } from '@/api/analysisJudgment'

const TAB_NAV = {
  list: [
    {
      name: '应用设置'
    }
  ]
}

export default {
  name: 'AnalysisJudgment',
  components: {
    AppItem,
    AppSet,
    Tab
  },
  provide () {
    return {
      getAppData: this.getAppData
    }
  },
  data () {
    return {
      tabNav: Object.freeze(TAB_NAV),
      onlineAppList: [
        // { id: 1, icon: 'icon-a-zu5741', name: '聚集分析' },
        // { id: 2, icon: 'icon-a-zu5759', name: '涉黄分析' },
        // { id: 3, icon: 'icon-changsuo', name: '聚众吸毒' },

      ], // 发布的应用列表
      localAppList: [
        // { id: 14, icon: 'icon-a-zu5741', name: '时空碰撞' },
        // { id: 15, icon: 'icon-a-zu5759', name: '时空轨迹' },
        // { id: 16, icon: 'icon-changsuo', name: '一机多卡' },
        // { id: 10, icon: 'icon-a-zu5741', name: '聚集分析' },
        // { id: 27, icon: 'icon-a-zu5759', name: '涉黄分析' },
        // { id: 34, icon: 'icon-changsuo', name: '聚众吸毒' },
        // { id: 11, icon: 'icon-a-zu5741', name: '聚集分析' },
        // { id: 21, icon: 'icon-a-zu5759', name: '涉黄分析' },
        // { id: 31, icon: 'icon-changsuo', name: '聚众吸毒' },
      ], // 本地的应用列表
      isHomePage: true, // 是否显示分析研判首页
      loading: true
    }
  },
  mounted () {
    Promise.all([
      this.getAppData('communal', 'onlineAppList'),
      this.getAppData('local', 'localAppList')
    ].map(item => item.catch(() => []))).then(() => {
      this.loading = false
    })
  },
  computed: {
    // 发布、本地的应用列表
    allAppList () {
      return [...this.onlineAppList, ...this.localAppList]
    }
  },
  methods: {
    // 获取应用列表
    getAppData (type, listName, isLoad) {
      return new Promise((resolve, reject) => {
        getAppListApi({
          type: type
        }, isLoad).then(res => {
          this[listName] = res || []
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 点击应用设置方法
    toAppSet () {
      this.isHomePage = false
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.analysis_wrap {
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  margin: 0 0 32px 32px;
  .home_page {
    width: 100%;
    height: 100%;
    background: var(--bg-color-3);
    .wrap_content {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      max-height: calc(100% - 72px);
      padding: 0 24px;
      overflow-y: auto;
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
}
</style>
