<template>
<div class='records_manage_wrap'>
  <div class='tabs_header' v-show='showTab'>
    <div
      class='tab_item'
      :class='{ "active": activeTab === "recordsImport" }'
      @click='tabsClick("recordsImport")'>数据导入</div>
    <div
      class='tab_item'
      :class='{ "active": activeTab === "recordsTrail" }'
      @click='tabsClick("recordsTrail")'>数据轨迹</div>
    <div
      class='tab_item'
      :class='{ "active": activeTab === "recordsAtlas" }'
      @click='tabsClick("recordsAtlas")'>数据图谱</div>
    <div
      class='tab_item'
      :class='{ "active": activeTab === "tagLibrary" }'
      @click='tabsClick("tagLibrary")'>标签库</div>
  </div>
  <div
    class='manage_content'
    :class='{ "covered_with": !showTab }'
  >
    <RecordsImport v-if='activeTab === "recordsImport"' @changeShowTab='changeShowTab'></RecordsImport>
    <RecordsTrail v-if='activeTab === "recordsTrail"' @changeShowTab='changeShowTab'></RecordsTrail>
    <RecordsAtlas v-if='activeTab === "recordsAtlas"' @changeShowTab='changeShowTab'></RecordsAtlas>
    <RecordsLibrary v-if='activeTab === "tagLibrary"'></RecordsLibrary>
  </div>
</div>
</template>

<script>
import RecordsImport from './records-import/index.vue'
import RecordsTrail from './records-trail/index.vue'
import RecordsAtlas from './records-atlas/index.vue'
import RecordsLibrary from './records-library/index.vue'
export default {
  name: 'RecordsManage',
  components: {
    RecordsImport,
    RecordsTrail,
    RecordsAtlas,
    RecordsLibrary
  },
  data () {
    return {
      activeTab: 'recordsImport',
      showTab: true,
      loading: false
    }
  },
  created () {
    if (sessionStorage.getItem('dataManageActTab')) {
      this.activeTab = sessionStorage.getItem('dataManageActTab')
    } else {
      sessionStorage.setItem('dataManageActTab', this.activeTab)
    }
  },
  methods: {
    tabsClick (tab) {
      this.activeTab = tab
      sessionStorage.setItem('dataManageActTab', this.activeTab)
    },
    changeShowTab (bool) {
      this.showTab = bool
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('dataManageActTab')
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.records_manage_wrap {
  display: flex;
  flex-direction: column;
  height: calc(100% - 32px);
  margin-bottom: 32px;
  .tabs_header {
    display: flex;
    flex: none;
    background: var(--bg-color-3);
    padding: 16px 24px 16px;
    .tab_item {
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
      padding: 8px 20px;
      border-bottom: 1px solid rgba(81, 92, 124, .5);
      cursor: pointer;
      &.active {
        color: var(--active-color);
        border-bottom: 2px solid var(--active-color);
      }
    }
  }
  .manage_content {
    flex: 1;
    height: calc(100% - 71px);
  }
  .covered_with {
    height: 100%;
  }
}
</style>
