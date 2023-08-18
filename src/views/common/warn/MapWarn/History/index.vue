<template>
  <div class='history_wrap'>
    <PageHeader
      ><template v-slot:headerTop>
        <list-title class="headerTop" title="历史预警"></list-title>

<!--        <div @click="$router.push({ name: 'MapWarn' })">-->
<!--          <nav-title title="防控预警"></nav-title></div>-->
    </template>
    </PageHeader>
    <div class='history_content'>
      <div class='tab'>
        <Tabs :tabs.sync="tabs" @handleClick="handleClick"></Tabs>
      </div>
      <div
        class="table-main"
        v-p-loading="isLoading"
        :element-loading-background="'--bg-color-3'"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <component :is="tabs.activeName"></component>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSelect from '@/components/BasicComponents/TimeSelect'
import Tabs from '@/components/BasicComponents/CustomTab'

import Track from '@/views/common/warn/MapWarn/History/Track'
import Feature from '@/views/common/warn/MapWarn/History/Feature'
import Analysis from '@/views/common/warn/MapWarn/History/Analysis'
import Area from '@/views/common/warn/MapWarn/History/Area'
import PageHeader from '@/components/BasicComponents/PageHeader'
// import Loading from '@/components/VisualComponents/Form/Loading'
// import Loading from '@/components/VisualComponents/Loading'
export default {
  components: {
    Tabs,
    Track,
    Feature,
    Analysis,
    Area,
    TimeSelect,
    PageHeader,
    // Loading
  },
  data () {
    return {
      params: {
        startTime: '',
        endTime: '',
        deviceName: ''
      },
      // activeName: 'Track',
      isLoading: false,
      tabs: {
        list: [
          {
            label: '聚集预警',
            name: 'Track',
            key: 'warning_history:crowd _warning_rules'
          },
          {
            label: '特征预警',
            name: 'Feature',
            key: 'warning_history:feature_warning_rules'
          }
          // {
          //   label: '作息预警',
          //   name: 'Analysis',
          // },
          // {
          //   label: '区域预警',
          //   name: 'Area',
          // }
        ],
        activeName: 'Track'
      }
    }
  },

  watch: {
    'tabs.activeName': {
      handler () {
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
        }, 800)
      }
    },
    '$route.query.warnType' (val){
      let switchRoute = this.tabs.list.filter((item)=>{
        return item.label === val
      })
      if(switchRoute.length){
        this.tabs.activeName = switchRoute[0].name
      }
    }
  },

  created () {
    this.tabs.list = this.setPermissisonArray()
    this.tabs.list = this.tabs.list.filter(item =>
      this.$store.state.User.mapWarnShowList.includes(item.name)
    )
    this.tabs.activeName = this.tabs.list[0].name
    // 如果是从预警进来的，且有navList，则展示对应的页面
    if(this.$route.query.warnType){
      let switchRoute = this.tabs.list.filter((item)=>{
        return item.label === this.$route.query.warnType
      })
      if(switchRoute.length){
        this.tabs.activeName = switchRoute[0].name
      }
    }
  },

  methods: {
    setPermissisonArray () {
      return this.$backPermissionsArray(this.tabs.list)
    },
    handleClick (tab) {
      this.tabs.activeName = tab.name
    }
  }
}
</script>

<style lang="less" scoped>
.history_wrap {
  height: 100%;
  background-color: var(--bg-color-3);
}
.table-main {
  //padding: 0 20px;
  padding: 0 16px;

  box-sizing: border-box;
  height: calc(100% - 62px);
}
.history_content {
  background: var(--bg-color-3);
  padding: 0 16px;
  margin-top: 1px;
  height: calc(100% - 57px);
  .tab {
    margin-bottom: 11px;
  }
}
/deep/.PageHeader {
  margin: 0;
  .PageHeader_title {
    height: 56px;
  }
}
</style>
