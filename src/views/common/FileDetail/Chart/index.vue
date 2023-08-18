<template>
  <div class="Chart">
    <!-- <div class="select_button"> -->
    <!-- <div :class='["common-style", "diagram", {"active": activeChart === "diagram"}]' @click='changeChart("diagram")' v-if="getPermission('relation')">关系图谱</div>
      <div :class='["common-style", "mindMap", {"active": activeChart === "mindMap"}]' @click='changeChart("mindMap")' v-if="getPermission('mind')">思维导图</div> -->
    <!-- <div
        v-for="item in picArray"
        :class="['common-style', item.value, { active: activeChart === item.value }]"
        @click="changeChart(item.value)"
        :key="item.label"
      >
        {{ item.label }}
      </div> -->
    <!-- </div> -->
    <div :class="['blank_button', 'button']" @click="exportChart">{{ '导出' }}</div>
    <div class="main_box">
      <div class="diagram_box" v-if="activeChart === 'diagram'">
        <Diagram ref="charts" v-if="chartList" :bgColor="'#192035'" :chartList="chartList" :usefulRelationTypeListMap="usefulRelationTypeListMap" :usefulRelationTypeList="usefulRelationTypeList" :iconObj="iconObj" @handleDbClick="handleDbClick"/>
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
import Diagram from '@/views/common/analysis/relationship-deduction/Charts/index'
import MindMap from './mindMap'
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import * as echarts from 'echarts'
// import { getDeductionSingle, getDeductionMulti, getNodeType, getEntityIcon } from '@/api/analysis'

export default {
  name: 'Chart',
  components: {
    EmptyData,
    Diagram,
    MindMap
  },
  props: {
    chartList: {
      type: Array,
      default: () => []
    },
    usefulRelationTypeListMap: {
      type: Object
    },
    usefulRelationTypeList: {
      type: Array
    },
    mindMapList: {
      type: Array,
      default: () => []
    },
    iconObj: {
      type: Object
    },
  },
  data () {
    return {
      activeChart: 'diagram',
      // chartList: [],
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    chartsBg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      // console.log(colorObj['--loading-color']);
      return colorObj['--loading-color']
    },
    ...mapState('Common', {
      permissionsArray: 'permissionsArray'
    }),
    picArray () {
      if (this.$route.query.label === '重点人档案') {
        const picArray = [
          {
            label: '关系图谱',
            value: 'diagram',
            key: 'important_human:relationship_atlas'
          },
          // {
          //   label: '思维导图',
          //   value: 'mindMap',
          //   key: 'important_human:mind_map'
          // }
        ]
        return this.$backPermissionsArray(picArray)
      } else if (this.$route.query.label === '人物档案') {
        const picArray = [
          {
            label: '关系图谱',
            value: 'diagram',
            key: 'normal_human:relationship_atlas'
          },
          {
            label: '思维导图',
            value: 'mindMap',
            key: 'normal_human:mind_map'
          }
        ]
        return this.$backPermissionsArray(picArray)
      } else {
        const picArray = [
          {
            label: '关系图谱',
            value: 'diagram',
            key: 'custom_human:relationship_atlas'
          },
          {
            label: '思维导图',
            value: 'mindMap',
            key: 'custom_human:mind_map'
          }
        ]
        return this.$backPermissionsArray(picArray)
      }
    }
  },
  created () {
    // if (this.picArray.length) {
    //   this.activeChart = this.picArray[0].value
    // } else {
    //   this.activeChart = ''
    // }
  },

  methods: {
    // getPermission (type) {
    //   console.log(this.$route.query.label);
    //   if (this.$route.query.label === '重点人档案') {
    //     return true
    //   } else if (this.$route.query.label === '人物档案') {
    //     if (type === 'relation') {
    //       return this.permissionsArray.includes('normal_human:relationship_atlas1')
    //     } else {
    //       return this.permissionsArray.includes('normal_human:mind_map')
    //     }
    //   } else if (this.$route.query.label === '自定义档案') {
    //     if (type === 'relation') {
    //       return this.permissionsArray.includes('custom_human:relationship_atlas')
    //     } else {
    //       return this.permissionsArray.includes('custom_human:mind_map')
    //     }

    //   }
    // },
    changeChart (item) {
      this.activeChart = item
    },
    echartsExport () {
      let chart = document.getElementById('chart')
      let option = echarts.getInstanceByDom(document.querySelector('#chart')).getOption()
      option.series[0].zoom = 1
      option.series[0].center = null
      // option.series[0].force.friction = 0.3
      let exportDom = document.createElement('div')
      exportDom.id = 'exportChart'
      exportDom.style.display = 'none'
      exportDom.style.width = chart.clientWidth + 'px'
      exportDom.style.height = chart.clientHeight + 'px'
      document.body.appendChild(exportDom)
      let exportChart = echarts.init(document.getElementById('exportChart'))
      exportChart.setOption(option)
      let picInfo = exportChart.getDataURL({
        type: 'png',
        pixelRatio: 1,
        backgroundColor: 'white'
      })
      const elink = document.createElement('a')
      elink.download = '关系图谱'
      elink.style.display = 'none'
      elink.href = picInfo
      document.body.appendChild(elink)
      setTimeout(() => {

      })
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
      document.body.removeChild(exportDom)
    },
    exportChart () {
      // if (this.activeChart === 'diagram') {
      //   this.echartsExport()
      //   return
      // }
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
    },
    // 图谱双击事件
    handleDbClick (params) {
      this.$emit('handleDbClick',params)
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
    // right: 24px;
    // cursor: pointer;
    display: flex;
    border: 1px solid var(--border-color-input);
    .common-style {
      padding: 5px 16px;
      color: var(--base-text-color-1);
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: var(--active-color);
      }
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
  .button {
    z-index: 999;
    // display: flex;
    position: absolute;
    right: 24px;
    top: 26px;
  }
  .main_box {
    // margin-top: 50px;
    // position: relative;
    // background: pink;
    .diagram_box {
      // position: absolute;
      height: calc(100vh - 250px);
      background-color: rgba(192, 208, 231, 0.05);
      .empty_div {
        height: calc(100vh - 350px);
      }
    }
    .mindMap_box {
      .empty_div {
        height: calc(100vh - 350px);
      }
    }
  }
}
</style>
