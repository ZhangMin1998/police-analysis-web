<template>
  <div class="total_component_wrap">
    <div class="box-wrap">
      <div class="box-content" v-for="(item, index) in list" :key="index">
        <div class="content">
          <!-- <div class='division'></div> -->
          <div class="content-item">
            <div class="num">
              <WAutoAddNumber ref='WAutoAddNumber' from='0' :to='item.value' :haveSeparator="true"></WAutoAddNumber>
            </div>
            <div class="name">
              <span>{{item.name}}</span>
              <div :class="[true ? 'greenlight' : 'redlight']"></div>
              <!-- <img src="@/assets/img/car-start.png"/> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 源数据ODS -->
    <TotalDataChartLine class="linecharts" :dataType="'all'" :isPython="true" :wrapTitle="'源数据、ODS'" :dataStageList="['file_read','ods_read']" @changeChartLineLoad="changeChartLineLoad" height="355px"
        width="1706px"></TotalDataChartLine>

    <!-- 轨迹 -->
    <TotalDataChartLine class="linecharts" :dataType="'all'" :isPython="true" :wrapTitle="'轨迹'" :dataStageList="['trace_read']" @changeChartLineLoad="changeChartLineLoad" height="355px"
        width="1706px"></TotalDataChartLine>

    <!-- 图谱 ES -->
    <TotalDataChartLine class="linecharts mb24" :dataType="'all'" :isPython="true" :wrapTitle="'图谱'" :dataStageList="['graph_read']" @changeChartLineLoad="changeChartLineLoad" height="410px"
        width="1706px"></TotalDataChartLine>
    <!-- 表格一 -->
    <Table :url="tableUrl1" :columns="columns1"></Table>

    <!-- 表格二 -->
    <Table :url="tableUrl2" :columns="columns2"></Table>
  </div>
</template>

<script>
import WAutoAddNumber from '@/components/VisualComponents/AutoAddNum'
// import Chart from '@/views/common/config/system-monitor/components/Chart'
import TotalDataChartLine from '@/views/common/config/system-monitor/components/Chart'
import BaseLoadMixins from '@/views/common/data-center/baseLoadMixins'
import Table from '@/views/common/config/system-monitor/components/Table'
export default {
  name: 'Overview',
  mixins: [BaseLoadMixins],
  components: {
    WAutoAddNumber,
    TotalDataChartLine,
    // Chart,
    Table
  },
  data () {
    return {
      list: [
        {
          value: 8758972490,
          name: '源数据'
        },
        {
          value: 3184789,
          name: 'ODS'
        },
        {
          value: 3184789,
          name: '轨迹'
        },
        {
          value: 565456151,
          name: '图谱'
        },{
          value: 666666,
          name: 'ES'
        }
      ],
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
      tableUrl1: '/configurable/srcData/list',
      columns1: [
        { label: '数据名称', prop: 'srcNameCn', minWidth: '15%' },
        { label: '源数据', prop: 'syncFlag', minWidth: '15%', haveSlot: true },
        { label: 'ODS', prop: 'syncFlag', minWidth: '15%', haveSlot: true },
        { label: '轨迹', prop: 'syncFlag', minWidth: '15%', haveSlot: true },
        { label: '图谱', prop: 'syncFlag', minWidth: '15%', haveSlot: true },
        { label: 'ES', prop: 'oneLight', minWidth: '15%', haveSlot: true }
      ],
      tableUrl2: '/configurable/srcData/list',
      columns2: [
        { label: '图谱初始化', prop: 'onlyLight', minWidth: '20%', haveSlot: true },
        { label: '实体', prop: 'srcNameCn', minWidth: '20%' },
        { label: '运行', prop: 'onlyLight', minWidth: '20%', haveSlot: true },
        { label: '图谱', prop: 'updateOperator', minWidth: '20%'},
        { label: 'ES', prop: 'updateOperator', minWidth: '20%'}
      ],
      color1: ['#0075FF','#00D1FF'],
      color2: ['#00D1FF'],
      color3: ['#00D1FF','#9600FA'],
    }
  }
}
</script>

<style lang="less" scoped>
.total_component_wrap{
  margin-bottom: 24px;
  .box-wrap{
    display: flex;
    // background: @bg-color-2;
    margin-bottom: 20px;
    .box-content{
      flex: 1;
      margin-right: 24px;
      .content{
        display: flex;
        align-items: center;
        padding: 24px 24px;
        background: var(--bg-color-2);
        .content-item{
          .num{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 16px;
            white-space: nowrap;
            color: var(--base-text-color-1);
          }
          .name{
            display: flex;
            align-items: center;
            .redlight{
              margin-left: 24px;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #FF106E;
            }
            .greenlight{
              margin-left: 24px;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #0CBF7E;
            }
          }
        }
      }
      .content:last-child{
        margin-right: 0;
      }
    }
    .box-content:last-child {
      margin-right: 0;
    }
  }
  .linecharts{
    margin-top: 24px
  }
  .mb24{
    margin-bottom: 24px;
  }
}
</style>
