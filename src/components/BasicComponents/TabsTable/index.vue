<template>
  <div class="TabsTable">
    <el-container>
      <el-header height="40px">
        <Tabs :tabs.sync="tabData" @handleClick="handleClickTab"></Tabs>

        <div class="btns-r">
          <slot name="btns"></slot>
        </div>
      </el-header>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Tabs from '@/components/BasicComponents/CustomTab'
import { useTabEffect } from '@/hooks/Tab/useTab'

export default {
  name: 'TabsTable',
  components: {
    Tabs
  },
  props: {
    tabList: {
      type: Array,
      default: () => []
    }
  },
  setup (prop, context) {
    // tab 菜单
    const { tabs, handleClickTab, setActive } = useTabEffect(
      prop.tabList,
      () => {
        context.emit('tabsHandleClick', tabs)
      }
    )

    const tabData = tabs

    return {
      handleClickTab,
      tabData,
      setActive
    }
  }
}
</script>

<style lang="less" scoped>
.TabsTable {
  position: relative;
  .btns-r {
    position: absolute;
    right: 16px;
    top: 16px;
    display: flex;
    align-items: center;
  }
}
</style>
