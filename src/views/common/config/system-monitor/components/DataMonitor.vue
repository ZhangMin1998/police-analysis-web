<template>
  <div class="DataMonitor">
    <div class="left">
      <div class="select_box">
        <div :class="['select', { selected: currentIndex === index }]" v-for="(item, index) in list" :key="index"
          @click="nodeClick(item, index)">
          <div class="name">{{ item.data_name_cn }}</div>
          <div class="warning" v-if="item.red_cnt !== 0">
            <i class='iconfont icon-jinggaotishi' title=""></i>
            <div>{{ item.red_cnt }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 表格 -->
      <Table :haveIndex="false" :tableData="tableData" :columns="columns"></Table>

      <!-- 源数据ODS -->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true" :wrapTitle="'源数据、ODS'"
        :dataStageList="['file_read', 'ods_read']" @changeChartLineLoad="changeChartLineLoad" height="355px"
        width="1508px"></TotalDataChartLine>
      <!-- 轨迹 -->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true" :wrapTitle="'轨迹'"
        :dataStageList="['trace_read']" @changeChartLineLoad="changeChartLineLoad" height="355px" width="1508px">
      </TotalDataChartLine>
      <!-- 图谱 ES -->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true" :wrapTitle="'图谱'"
        :dataStageList="['graph_read']" @changeChartLineLoad="changeChartLineLoad" height="355px" width="1508px">
      </TotalDataChartLine>
      <!-- 源数据ODS-队列 -->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true"
        contorlRequsetUrl="queue" :wrapTitle="'队列：源数据、ODS'" :dataStageList="['file_read', 'ods_read']"
        @changeChartLineLoad="changeChartLineLoad" height="355px" width="1508px"></TotalDataChartLine>
      <!-- 轨迹 -队列-->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true"
        contorlRequsetUrl="queue" :wrapTitle="'队列：轨迹'" :dataStageList="['trace_read']"
        @changeChartLineLoad="changeChartLineLoad" height="355px" width="1508px">
      </TotalDataChartLine>
      <!-- 图谱 ES -队列-->
      <TotalDataChartLine class="linecharts" v-if="dataType" :dataType="dataType" :isPython="true"
        contorlRequsetUrl="queue" :wrapTitle="'队列：图谱'" :dataStageList="['graph_read']"
        @changeChartLineLoad="changeChartLineLoad" height="355px" width="1508px">
      </TotalDataChartLine>
    </div>
  </div>
</template>

<script>
import TotalDataChartLine from '@/views/common/config/system-monitor/components/Chart'
import Table from '@/views/common/config/system-monitor/components/Table'
// import TotalDataChartLine from '@/views/common/data-center/components/total-data-chart-line'
import BaseLoadMixins from '@/views/common/data-center/baseLoadMixins'
// getChartsList
import { getmonitoringDataType, getSingleDataList } from '@/api/config'
export default {
  mixins: [BaseLoadMixins],
  components: {
    TotalDataChartLine,
    Table,
    // TotalDataChartLine,
  },
  data () {
    return {
      tableData: [],
      list: [],
      currentIndex: 0,
      dataType: '',
      chartSeries1: [
        {
          name: '',
          type: 'line',
          areaStyle: {
            color: 'rgba(0,117,255,0.04)'
          },
          emphasis: {
            focus: 'series'
          },
          data: [],
          smooth: true
        },
        {
          name: '',
          type: 'line',
          areaStyle: {
            color: 'rgba(0,209,255,0.04)'
          },
          emphasis: {
            focus: 'series'
          },
          data: [],
          smooth: true
        }
      ],
      chartSeries2: [
        {
          type: 'line',
          areaStyle: {
            color: 'rgba(0,209,255,0.04)'
          },
          emphasis: {
            focus: 'series'
          },
          data: [],
          smooth: true
        }
      ],
      chartSeries3: [
        {
          name: '',
          type: 'line',
          // areaStyle: {
          //   color: 'rgba(64, 122, 195,0.3)'
          // },
          emphasis: {
            focus: 'series'
          },
          data: [],
          smooth: true
        },
        {
          name: '',
          type: 'line',
          // areaStyle: {
          //   color: 'rgba(97, 194, 150,0.5)'
          // },
          emphasis: {
            focus: 'series'
          },
          data: [],
          smooth: true
        }
      ],
      columns: [
        { label: '类型', prop: 'data_type', minWidth: '20%' },
        { label: '数据量', prop: 'data_num', minWidth: '20%' },
        { label: '连接', prop: 'conn', minWidth: '20%', haveSlot: true },
        { label: '运行', prop: 'running', minWidth: '20%', haveSlot: true }
      ],
      color1: ['#0075FF', '#00D1FF'],
      color2: ['#00D1FF'],
      color3: ['#00D1FF', '#9600FA'],
    }
  },
  watch: {
    dataType (value) {
      if (value) {
        this.getRunningList(value)
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    async getDataList () {
      const res = await getmonitoringDataType()
      this.list = res
      this.dataType = this.list[0].data_name
    },
    async getRunningList (data_type) {
      const data = await getSingleDataList({ data_type })
      this.tableData = data
    },
    nodeClick (row, index) {
      this.dataType = ''
      this.currentIndex = index
      this.$nextTick(() => {
        this.dataType = row.data_name
      })
    }
  }
}
</script>

<style lang="less" scoped>
.DataMonitor {
  display: flex;

  .left {
    position: relative;
    box-sizing: border-box;
    width: 180px;
    margin-right: 24px;
    padding: 16px 0;
    background-color: var(--bg-color-2);

    .select_box {
      .select {
        display: flex;
        padding: 10px 12px 10px 20px;
        cursor: pointer;

        .name {
          width: 120px;
          color: var(--base-text-color-1);
        }

        .warning {
          display: flex;
          color: #ff106e;

          // i{
          // margin-right: 8px;
          // }
          div {
            width: 20px;
            margin-left: 8px;
          }
        }
      }

      :hover {
        background: var(--search-input-hover-bg);
      }

      .selected {
        background: var(--search-input-hover-bg);
      }
    }
  }

  .right {
    flex: 1;

    .linecharts {
      margin-top: 24px;
    }
  }

  /deep/.card:last-child {
    margin-bottom: 0;
  }
}</style>
