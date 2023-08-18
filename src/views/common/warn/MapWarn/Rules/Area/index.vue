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
import Stay from '@/views/common/warn/MapWarn/Rules/Area/Stay'

export default {
  components: {
    Tabs,
    Stay
  },
  data () {
    return {
      tabs: {
        list: [
          {
            label: '逗留',
            name: 'Stay'
          }
          // {
          //   label: '昼伏夜出',
          //   name: 'nightsOut',
          // },
        ],
        activeName: 'Stay'
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
