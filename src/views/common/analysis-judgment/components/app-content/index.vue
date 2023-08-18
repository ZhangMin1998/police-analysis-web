<template>
<div class='app_content_wrap'>
  <div class='module_header'>
    <div class='module_left'>
      <slot name='moduleName'>
        <div class='module_name'>{{ moduleInfo.moduleName || '--' }}</div>
      </slot>
    </div>
    <div class='module_right'>
      <template v-if='routeName !== "analysisResult" || (routeName === "analysisResult" && !moduleInfo.runningFlag)'>
        <i
          v-if='!isEmpty && canSwitch && currentType === "chart"'
          class='iconfont icon-a-zu5779'
          title='列表显示'
          @click='handleModule("list")'
        ></i>
        <i
          v-if='!isEmpty && canSwitch && currentType === "list"'
          class='iconfont icon-tubiaoxianshi'
          title='图表显示'
          @click='handleModule("chart")'
        ></i>
      </template>
      <slot name='opera' :moduleType='moduleType'></slot>
    </div>
  </div>
  <div
    v-p-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="--bg-color-3"
    id='ModuleContent'
    class='module_content'
  >
    <template
      v-if='
        routeName === "analysisResult" ?
          (resultData.length && !loading && !moduleInfo.runningFlag && !moduleInfo.errorFlag) || isBinaryTree:
          (resultData.length && !loading && !moduleInfo.errorFlag) || isBinaryTree
      '
    >
      <div
        v-if='moduleType.includes("list") && isRenderTable && !algorithmData'
        class='module_table'
      >
        <TableContent
          :fieldList='resultField'
          :listData='resultData'
          :total='resultCount'
          :iconLink='iconLink'
          :textLink='textLink'
          @iconLinkClick='iconLinkClick'
          @textLinkClick='textLinkClick'
        ></TableContent>
      </div>
      <div
        v-if='moduleType.includes("chart") && isRenderChart && !algorithmData'
        class='module_chart'
      >
        <ChartResult
          :key='chartKey'
          :fieldList='resultField'
          :listData='resultData'
          :chartInfo='{
            "chartType": resultDisplayInfo.displayChartType,
            "chartConfig": JSON.parse(resultDisplayInfo.displayCoordinate)
          }'
          :moduleId='moduleInfo.id'
          @mapClick='mapClick'
        ></ChartResult>
      </div>
      <div v-if='moduleType.includes("detail") && !algorithmData' class='module_detail'>
        <DetailContent
          :colFieldInfo='resultField'
          :listData='resultData'
          :textLink='textLink'
          @textLinkClick='textLinkClick'
        ></DetailContent>
      </div>
      <div v-if='isBinaryTree' class='module_detail'>
        <BinaryTree
          :treeData='algorithmData'
          :treeId='`binaryTree_${moduleInfo.htmlId}`'
        ></BinaryTree>
      </div>
    </template>
    <NoEmpty v-if='routeName === "analysisResult" ? isEmpty && !moduleInfo.runningFlag : isEmpty'></NoEmpty>
    <NoEmpty v-if='moduleInfo.errorFlag' emptyTip='数据异常'></NoEmpty>
    <slot v-if='((!loading && !moduleInfo.operatorFlag) || (moduleInfo.runningFlag && routeName === "analysisResult")) && !moduleInfo.errorFlag' name='noContent'></slot>
  </div>
</div>
</template>

<script>
import TableContent from './tableContent.vue'
import DetailContent from './detailContent.vue'
import ChartResult from '../chart-result/index.vue'
import NoEmpty from '@/components/BasicComponents/NoEmpty/index.vue'
import { getModuleDataApi } from '@/api/analysisJudgment'
import BinaryTree from '../binary-tree/index.vue'
import { countFieldWidth, fieldSort, formatBinaryTreeData, formatTime } from '../../config/config.js'
import { LINK_ICON_OPTIONS } from '../edit-page/config.js'

export default {
  name: 'AppModuleContent',
  components: {
    TableContent,
    DetailContent,
    ChartResult,
    NoEmpty,
    BinaryTree
  },
  props: {
    // 模块信息
    moduleInfo: {
      type: Object,
      default: () => {}
    },
    // 当前应用页面的id
    currentPage: {
      type: Number
    }
    // 模块展示的类型，值为table,chart,detail
    /*moduleType: {
      type: Array,
      default: () => []
    }*/
  },
  data () {
    return {
      currentType: '',
      moduleType: [], // 模块展示的类型，值为table,chart,detail
      resultField: [], // 数据结果展示的字段
      resultData: [], // 数据结果
      resultCount: 0,
      allLinkInfo: {},
      iconLink: [], // 图标链接信息
      textLink: [], // 文字链接信息
      textLinkId: {}, // 文字链接对应字段的链接Id
      resultDisplayInfo: null, // 查询数据结果的展示方式信息，用于图表显示
      chartKey: new Date().getTime(),
      loading: false,
      linkFieldId: {}, // 链接字段对应的链接Id
      algorithmData: null
    }
  },
  computed: {
    // 是否可以切换图表或者列表模式
    canSwitch () {
      return this.moduleType.includes('list') && this.moduleType.includes('chart')
    },
    // 是否渲染列表
    isRenderTable () {
      return !this.canSwitch || (this.canSwitch && this.currentType === "list")
    },
    // 是否渲染图表
    isRenderChart () {
      return !this.canSwitch || (this.canSwitch && this.currentType === "chart")
    },
    routeName () {
      return this.$route.name
    },
    isEmpty () {
      if (this.routeName === 'analysisResult') {
        return !this.loading && !this.resultData.length && !this.moduleInfo.errorFlag && !this.isBinaryTree
      } else {
        return !this.loading && this.moduleInfo.operatorFlag && !this.resultData.length && !this.moduleInfo.errorFlag && !this.isBinaryTree
      }
    },
    // 是否是决策树算法
    isBinaryTree () {
      const algorithmType = ['decision_tree','random_forest']
      return this.moduleInfo.algorithmFlag && algorithmType.includes(this.moduleInfo.algorithmType) && this.algorithmData && this.algorithmData.nodes.length && !this.moduleInfo.runningFlag
    }
  },
  watch: {
    'moduleInfo.i': {
      handler (newVal) {
        if (!newVal || !this.moduleInfo.operatorFlag || this.moduleInfo.isLink || this.moduleInfo.errorFlag) return
        this.getData(newVal)
      },
      immediate: true,
    },
    'moduleInfo.operatorFlag': {
      handler (newVal) {
        if (!this.moduleInfo.i || !newVal || this.moduleInfo.errorFlag) return
        this.getData(this.moduleInfo.i)
      }
    },
    'moduleInfo.isLink': {
      handler (newVal) {
        if (!newVal || !this.moduleInfo.i || !this.moduleInfo.operatorFlag || this.moduleInfo.errorFlag) return
        this.getData(this.moduleInfo.i, true)
      },
      immediate: true
    },
    'moduleInfo.runningFlag': {
      handler (newVal) {
        if (!newVal) {
          this.getData(this.moduleInfo.i)
        }
      }
    },
    'moduleInfo.errorFlag': {
      handler (newVal) {
        if (!newVal) {
          this.getData(this.moduleInfo.i)
        }
      }
    },
  },
  methods: {
    // 编辑时，盒子大小发生改变且展示类型为图表时
    moduleResize () {
      if (this.moduleType.includes("chart") && this.isRenderChart) {
        this.chartKey = new Date().getTime()
      }
    },
    // 获取模块的数据
    getData (moduleId, reSet) {
      this.loading = true
      this.initializeData()
      getModuleDataApi({
        containerId: +moduleId,
        recordId: null,
        state: this.$route.name === 'analysisEdit' ? 'incomplete' : 'completed',
        conditionList: this.moduleInfo.linkParams || []
      }).then(res => {
        let result = res || {}
        let timeField = []
        let data = result.dataVOList || []
        this.resultDisplayInfo = result.displayVO
        result.dataStr && (this.algorithmData = formatBinaryTreeData(JSON.parse(result.dataStr)))
        // result.dataStr && (this.algorithmData = formatBinaryTreeData(testInfo))
        const fieldList = fieldSort(result.fieldVOList || [])
        const linkList = result.linkVOs || []
        if (reSet) {
          this.$emit('upDateLinkInfo')
          if (data.length && linkList.length) {
            const currentPageLink = linkList.filter(item => item.linkPageId === this.currentPage)
            currentPageLink.forEach(item => {
              let linkJumpInfo = this.formatLinkInfo(item, data[0])
              this.$emit('linkSkip', linkJumpInfo, false)
            })
          }
        }
        // const mode = result.displayVO && result.displayVO.displayType ? result.displayVO.displayType : 'list'
        if (!result.displayVO || (result.displayVO && result.displayVO.displayType === 'list')) {
          this.moduleType = ['list']
          this.currentType = 'list'
        } else if (result.displayVO && result.displayVO.displayType === 'detail') {
          this.moduleType = ['detail']
        } else if (result.displayVO && result.displayVO.displayType === 'chart') {
          this.moduleType = ['list', 'chart']
          this.currentType = 'chart'
        }
        this.resultField = countFieldWidth(fieldList)

        this.resultField.forEach(field => {
          if (field.fieldType === 'TIMESTAMP') timeField.push(field.fieldNameEn)
        })
        if (timeField.length) {
          data.forEach(item => {
            timeField.forEach(field => {
              item[field] && (item[field] = formatTime(item[field]))
            })
          })
        }
        this.resultData = data
        this.resultCount = result.dataVOCount || 0
        linkList.forEach(link => {
          this.allLinkInfo[link.id + ''] = link
          if (link.keyType === 'icon') {
            const iconInfo = LINK_ICON_OPTIONS.find(item => item.value === link.keyIcon)
            this.iconLink.push({
              label: iconInfo.label,
              icon: iconInfo.icon,
              linkId: link.id + ''
            })
          } else {
            link.list && link.list.forEach(item => {
              this.textLink.push(item.currentField)
              this.textLinkId[item.currentField] = item.linkId
            })
          }
          link.list && link.list.forEach(item => {
            item.currentField && (this.linkFieldId[`${item.currentField}_${link.keyType}`] = link.id)
          })
        })
      }).catch(() => {
        this.initializeData()
        if (reSet) {
          this.$emit('upDateLinkInfo')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 图标链接点击事件
    iconLinkClick (linkId, rowInfo) {
      const linkInfo = this.allLinkInfo[linkId]
      if (!linkInfo) return
      let result = this.formatLinkInfo(linkInfo, rowInfo)
      this.$emit('linkSkip', result)
    },
    // 文字链接点击事件
    textLinkClick (field, rowInfo) {
      const linkId = this.textLinkId[field]
      if (!linkId) return
      const linkInfo = this.allLinkInfo[linkId]
      if (!linkInfo) return
      let result = this.formatLinkInfo(linkInfo, rowInfo)
      this.$emit('linkSkip', result)
    },
    formatLinkInfo (linkInfo, rowInfo) {
      let info = {
        linkPageId: linkInfo.linkPageId,
        linkContainerId: linkInfo.linkContainerId,
        errorFlag: linkInfo.errorFlag,
        errorMsg: linkInfo.errorMsg,
        matchInfo: []
      }
      let ruleList = linkInfo.list || []
      ruleList.forEach(item => {
        let keyValue = item.linkFieldType === 'TIMESTAMP' && rowInfo[item.currentField] ?
          new Date(rowInfo[item.currentField]).getTime() :
          rowInfo[item.currentField]
        info.matchInfo.push({
          field: item.linkField,
          fieldType: item.linkFieldType,
          key: keyValue || ''
        })
      })
      return info
    },
    mapClick (info) {
      if (!info.zoneFieldEn) return
      let linkId = null
      if (this.linkFieldId[`${info.zoneFieldEn}_text`]) {
        linkId = this.linkFieldId[`${info.zoneFieldEn}_text`]
      } else if (this.linkFieldId[`${info.zoneFieldEn}_icon`]) {
        linkId = this.linkFieldId[`${info.zoneFieldEn}_icon`]
      }
      if (!linkId) return
      let findData = this.resultData.find(item => item[info.zoneFieldEn] === info.name)
      if (!findData) return
      this.iconLinkClick(linkId, findData)
    },
    handleModule (type) {
      this.currentType = type
    },
    initializeData () {
      this.moduleType = []
      this.currentType = ''
      this.resultField = []
      this.resultData = []
      this.resultCount = 0
      this.allLinkInfo = {}
      this.iconLink = []
      this.textLink = []
      this.textLinkId = {}
      this.linkFieldId = {}
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.app_content_wrap {
  width: 100%;
  height: 100%;
  background: var(--bg-color-3);
  .module_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px 16px 16px;
    .module_left {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
    }
    .module_right {
      display: flex;
      i {
        font-size: 16px;
        line-height: 16px;
        color: var(--base-text-color-to-666666);
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
  .module_content {
    height: calc(100% - 61px);
    padding: 0 24px 0 16px;
    overflow-y: auto;
    //&::-webkit-scrollbar {
    //  height: 5px !important; /* 横向滚动条 */
    //}
    .module_table,
    .module_detail,
    .module_chart {
      height: 100%;
    }
    .module_table {
      /deep/.table_loading {
        height: 100%;
      }
    }
  }
  @media screen and (min-width: 1024px) and (max-width:1365px){
    .module_content {
      overflow: hidden;
    }
  }
}
</style>
