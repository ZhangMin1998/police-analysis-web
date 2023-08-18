<template>
  <div class="systemMonitor">
    <div class="tab-wrapper">
      <div class="tabs">
        <el-tabs stretch v-model="activeName" @tab-click="tabsHandleClick">
            <el-tab-pane
              v-for="item in tabsArray"
              :label="item.label"
              :name="item.name"
              :key="item.name"
            ></el-tab-pane>
          </el-tabs>
      </div>
      <div class="tabs-container">
          <div>
            <component :is="activeName"></component>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import OverView from '@/views/common/config/system-monitor/components/OverView'
import DataMonitor from '@/views/common/config/system-monitor/components/DataMonitor'
export default {
  components: {
    OverView,
    DataMonitor
  },
  data () {
    return {
      activeName: 'OverView',
      tabsArray: [
        {
          label: '总览',
          name: 'OverView',
          key: ''
        },
        {
          label: '数据监控',
          name: 'DataMonitor',
          key: ''
        }
      ]
    }
  },
  created () {

  },
  methods: {
    tabsHandleClick (tab) {
      this.activeName = tab.name
    },
  }
}
</script>

<style lang="less" scoped>
.systemMonitor{
  .tab-wrapper{
    height: 100%;
    padding: 0px 24px 16px 24px;
    margin-bottom: 24px;
    position: relative;
    background: var(--bg-color-1);
    .tabs {
      display: flex;
      /deep/.el-tabs {
        margin-top: 12px;
      }
      /deep/.el-tabs__active-bar {
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 1px !important;
        background-color: @active-color;
        z-index: 1;
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        list-style: none;
      }
      /deep/.el-tabs__header {
        margin: 0 0 16px;
      }
      /deep/.el-tabs__nav {
        white-space: nowrap;
        position: relative;
        transition: transform 0.3s;
        float: left;
        z-index: 2;
        border-bottom: 1px solid @border-color-1;
      }
      /deep/.el-tabs__nav-wrap::after {
        height: 0px !important;
        background-color: #515c7c !important;
      }
      /deep/.el-tabs__item {
        width: 90px;
        padding: 0 !important;
        color: @font-color-2 !important;
        font-size: 16px !important;
        &:hover {
          color: @active-color !important;
        }
      }
      /deep/.el-tabs__item.is-active {
        color: @active-color !important;
        font-size: 16px !important;
      }
      /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
        -webkit-box-shadow: none;
        box-shadow: none;
      }
    }
  }
}
</style>
