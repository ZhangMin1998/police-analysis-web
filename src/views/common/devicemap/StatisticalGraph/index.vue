<template>
  <div class="graph-wrapper" style="height: 100%">
    <PageHeader class="page-header">
      <list-title title="统计模式"></list-title>
      <div>
        <!-- <nav-title title="地图模式" @handleTo="handleTo"></nav-title> -->
        <BackPrevious @click="handleTo"></BackPrevious>
      </div>
    </PageHeader>
    <!-- 统计表 -->
    <section class="graph-container">
      <aside class="left-aside">
        <SiteCount class="bg" />
        <SiteRate
          type="site"
          title="场所在线率统计"
          boxId="siteRate"
          class="bg"
          style="margin-bottom: 16px"
        />
        <SiteRate type="device" title="设备在线率统计" boxId="devRate" class="bg" />
      </aside>
      <main class="main-container">
        <section class="bg" style="position: relative">
          <CardTitle class="title-box" title="场所设备在线率" />
          <el-tabs v-model="tabType" class="type-tab">
            <el-tab-pane label="按场所类型统计" name="site"></el-tab-pane>
            <el-tab-pane label="按设备类型统计" name="device"></el-tab-pane>
            <!-- <el-tab-pane disabled label="按安全厂商统计" name="vendor"></el-tab-pane> -->
          </el-tabs>
          <!-- 搜索表头 -->
          <HeaderForm @submitForm="submitForm" :tabType="tabType" :form="formHeader" />
          <!-- 图表 -->
          <div class="graph-category" id="category"></div>
          <!-- 表格 -->
          <div>
            <!-- <p-button>导出</p-button> -->
            <TemplateTable
              class="chart-table"
              :tableHeight="240"
              :tableData="table.tableData"
              :columns="table.columns"
              :pagination="false"
              v-bind="$attrs"
              :row-style="rowStyle"
              :header-cell-style="headerCellStyle"
              :header-row-style="() => 'height: 32px'"
              :rowHeight="32"
              :isLoading="isLoading"
            />
          </div>
        </section>
      </main>
    </section>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, watch } from '@vue/composition-api'

import PageHeader from '@/components/BasicComponents/PageHeader'
import HeaderForm from './headerForm'
import SiteCount from './graph/siteCount'
import SiteRate from './graph/siteRate'
import CardTitle from './title'
import TemplateTable from '@/components/VisualComponents/Table'

import useTable from './hooks/table'
import useChart from './hooks/useChart'

import { generateSevenDay } from '@/utils/'

import {
  getPlacleTypeStatistics,
  getFactoryStatistics,
  getDeviceTypeStatistics
} from '@/api/equipMap'

export default {
  components: {
    PageHeader,
    HeaderForm,
    TemplateTable,
    SiteCount,
    SiteRate,
    CardTitle
  },
  setup () {
    const URL_POST = {
      site: getPlacleTypeStatistics,
      device: getDeviceTypeStatistics,
      vendor: getFactoryStatistics
    }

    // 项目初始化
    const instance = getCurrentInstance()
    const handleTo = () => {
      instance.proxy.$router.push({
        name: 'devicemap'
      })
    }

    const formHeader = reactive({
      type: '',
      time: generateSevenDay()
    })

    const tabType = ref('site')
    const isLoading = ref(false)

    const { table, formatTableData, rowStyle, headerCellStyle } = useTable(tabType)

    // 表格相关
    const { setChartOption } = useChart(tabType)

    const keyMap = {
      site: 'placeType',
      device: 'deviceType',
      vendor: 'factoryType'
    }

    // 视图内方法
    const submitForm = async form => {
      isLoading.value = true
      const searchForm = {
        [keyMap[tabType.value]]: form.type, // 动态属性
        startTime: new Date(form.time[0]).setHours(0, 0, 0,0),
        endTime: form.time[1]
      }
      if (new Date(searchForm.endTime).toLocaleDateString() === new Date().toLocaleDateString()) {
        searchForm.endTime = new Date().getTime()
      }
      const res = await URL_POST[tabType.value](searchForm)
      formatTableData(res)
      setChartOption(res)

      setTimeout(() => (isLoading.value = false))
    }

    watch(tabType, () => {
      formHeader.type = ''
      submitForm(formHeader)
    })

    return {
      handleTo,
      formHeader,
      submitForm,
      table,
      tabType,
      rowStyle,
      headerCellStyle,
      isLoading
    }
  }
}
</script>

<style lang="less" scoped>
.bg {
  // background-color: var(--table-head-bg-color);
  background-color: var(--bg-color-3);
}
.graph-wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-left: 32px;
  ::v-deep .PageHeader {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .page-header {
    flex-basis: 56px;
  }
  .graph-container {
    overflow: hidden;
    flex: 1;
    display: flex;
    padding: 12px 0;
    box-sizing: border-box;
    .left-aside {
      margin-right: 16px;
      flex-basis: 352px;
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      // overflow-y: auto;
    }
    .main-container {
      flex: 1;
      & > section {
        padding: 16px;
        padding-bottom: 0;
        height: 100%;
        box-sizing: border-box;
      }
      .graph-category {
        height: 380px;
      }
    }
  }
}

.type-tab {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 10px);
}

.chart-table {
  font-size: 14px;
}
</style>
