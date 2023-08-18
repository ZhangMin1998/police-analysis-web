<template>
  <div class="Chart">
    <div class='select_button'>
      <div :class='["common-style", "diagram", {"active": activeChart === "diagram"}]' @click='changeChart("diagram")'>关系图谱</div>
      <div :class='["common-style", "mindMap", {"active": activeChart === "mindMap"}]' @click='changeChart("mindMap")'>思维导图</div>
    </div>
    <div :class='["blank_button", "button"]' @click="exportChart">{{ '导出' }}</div>
    <div class="main_box">
      <div class="diagram_box" v-if="activeChart === 'diagram'">
        <Diagram ref="charts" v-if="chartsList.length" :chartList="chartsList" />
        <div class="empty_div" v-else>
          <EmptyData />
        </div>
      </div>
      <div class="mindMap_box" v-if="activeChart === 'mindMap'">
        <MindMap id="mindMap" v-if="mindMapList" :chartData="mindMapList" />
        <div class="empty_div" v-else>
          <EmptyData />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyData from '@/components/BasicComponents/EmptyData'
import Diagram from '@/views/common/all-archives/person-custom/relation-atlas/Charts'
import MindMap from './mindMap'
import html2canvas from 'html2canvas'

export default {
  name: 'Chart',
  components: {
    EmptyData,
    Diagram,
    MindMap
  },
  props: {
    chartsList: {
      type: Array,
      default: () => []
    },
    mindMapList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      activeChart: 'diagram',
    }
  },
  computed: {

  },
  created () {
    console.log(this.chartsList)
  },

  methods: {
    changeChart (item) {
      this.activeChart = item
    },
    exportChart () {
      let chartId = this.activeChart === 'diagram' ? '#chart' : '#mindmap'
      let imgName = this.activeChart === 'diagram' ? '关系图谱.jpg' : '思维导图.jpg'
      const rect = document.querySelector(chartId).getBoundingClientRect()
      html2canvas(document.querySelector(chartId), {
        width: rect.width,
        height: rect.height
      }).then(function (canvas) {
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const imgData = pageData.replace('image/jpeg', 'image/octet-stream')
        // const imgName = '思维导图.jpg'
        const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = imgData
        save_link.download = imgName
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        save_link.dispatchEvent(event)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Chart {
  overflow: hidden;
  position: relative;
  .select_button {
    position: absolute;
    z-index: 999;
    top: 24px;
    left: 24px;
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.2);
    .common-style {
      padding: 5px 16px;
      color: var(--base-text-color-1);
      font-size: 14px;
      cursor: pointer;
      &.active {
        background: var(--active-color);
        color: @font-color-3;
        border: 1px solid var(--active-color);
      }
      // &:hover {
      //   background-color: var(--active-color);
      // }
    }
    .common-style:last-child {
      border-right: 0px;
    }
  }
  .button{
    z-index: 999;
    position: absolute;
    right: 24px;
    top: 26px;
  }
  .main_box{
    // margin-top: 50px;
    // position: relative;
    // background: pink;
    .diagram_box{
      // position: absolute;
      height: calc(100vh - 250px);
      background-color: rgba(192, 208, 231, 0.05);
      .empty_div {
        height: calc(100vh - 350px);
      }
    }
    .mindMap_box{
      // display: flex;
      // align-items: center;
      // justify-content: center;
      // height: calc(100vh - 250px);
      // background-color: rgba(192, 208, 231, 0.05);
      .empty_div {
        height: calc(100vh - 350px);
      }
    }
  }
}
</style>
