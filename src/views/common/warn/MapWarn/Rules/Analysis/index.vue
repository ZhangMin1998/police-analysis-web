<template>
  <div class="Analysis">
    <!-- ------------  操作 新建/批量编辑发送人  ------------- -->

    <el-container>
      <el-header height="40px">
        <Tabs :tabs.sync="tabs" @handleClick="tabsHandleClick"></Tabs>

        <div class="btns-r">
          <div class="p-button" style="margin-right:16px;" @click="send">
            批量编辑发送人
          </div>
          <div class="p-button-blue" @click="add">新建</div>
        </div>
      </el-header>
      <el-main
        ><component :is="tabs.activeName" :ref="tabs.activeName"></component
      ></el-main>
    </el-container>
  </div>
</template>

<script>
import Tabs from '@/components/BasicComponents/CustomTab'
import ManyNights from '@/views/common/warn/MapWarn/Rules/Analysis/ManyNights'
import NightsOut from '@/views/common/warn/MapWarn/Rules/Analysis/NightsOut'
import DeepLive from '@/views/common/warn/MapWarn/Rules/Analysis/DeepLive'

export default {
  components: {
    Tabs,
    ManyNights,
    NightsOut,
    DeepLive
  },
  data () {
    return {
      tabs: {
        list: [
          // {
          //   label: '深居简出',
          //   name: 'DeepLive',
          // },
          {
            label: '频繁夜出',
            name: 'ManyNights'
          },
          {
            label: '昼伏夜出',
            name: 'NightsOut'
          }
        ],
        // activeName: 'DeepLive',
        activeName: 'ManyNights'
      }
    }
  },

  methods: {
    send () {
      this.$nextTick(() => {
        this.$refs[this.tabs.activeName].send()
      })
    },
    add () {
      this.$nextTick(() => {
        this.$refs[this.tabs.activeName].add()
      })
    },
    tabsHandleClick (tab) {
      this.tabs.activeName = tab.name
    }
  }
}
</script>

<style lang="less" scoped>
.Analysis {
  position: relative;
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
  }

  .el-main {
    padding: 16px 0;
  }

  .btns-r {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
