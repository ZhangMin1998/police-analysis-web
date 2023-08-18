<template>
  <div class="Chart">
    <div class="main_box">
      <div class="diagram_box" v-if="activeChart === 'diagram'">
        <Loading :isLoading.sync="isLoading">
          <Diagram
            ref="charts"
            v-if="chartList.length"
            :id="id"
            :bgColor="chartsBg"
            :chartList="chartList"
            @handleDbClick="handleDbClick"
            @updateData="updateData"
          />
          <div class="empty_div" v-else>
            <EmptyData />
          </div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyData from '@/components/BasicComponents/EmptyData'
import Diagram from '@/views/common/all-archives/personFileDetail/components/Chart/altas'
import Loading from '@/components/VisualComponents/Loading'
import { mapState } from 'vuex'
import { getDeductionSingle,relationEdgeRank } from '@/api/analysis'
import { lightTheme, darkTheme } from "@/assets/js/variable"
// import Drawer from '@/components/BasicComponents/Drawer/newIndex'

export default {
  name: 'Chart',
  components: {
    Loading,
    EmptyData,
    Diagram,
    // Drawer
  },
  props: {
    personInfo: {
      type: Object
    },
    id: {
      type: String,
      default: 'chart'
    },
    // chartList: {
    //   type: Array,
    //   default: () => []
    // },
    // usefulRelationTypeListMap: {
    //   type: Object
    // },
    // usefulRelationTypeList: {
    //   type: Array
    // },
    // mindMapList: {
    //   type: Array,
    //   default: () => []
    // },
  },
  data () {
    return {
      isLoading: false,
      activeChart: 'diagram',
      chartList: [],
      copyChartsList: [],
      moveLeft: '-424px',
      imgWidth: '',
      drawer: {
        isShow: true
      },
      // usefulRelationTypeListMap: {},
      // usefulRelationTypeList: [],
      // iconObj: {},
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
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
    },
    chartsBg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      // console.log(colorObj['--loading-color']);
      return colorObj['--loading-color']
    },
    origin () {
      return window.location.origin + '/'
    }
  },
  async created () {
    this.isLoading = true
    // await this.getNodeTypeList() // 获取对照表
    // await this.getEntityIcon() // 获取实体图标
    await this.obtainGraphData() // 获取图谱数据
    this.isLoading = false
  },
  mounted () {
    // this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    // this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },

  methods: {
    updateData (position) {
      // 去重
      this.copyChartsList[0] = this.copyChartsList[0].filter((item, index) => {
        return this.copyChartsList[0].findIndex(item1 => item1.vid == item.vid) == index
      })
      this.copyChartsList[0].forEach((item, index) => {
        item.x = position[index][0]
        item.y = position[index][1]
      })
    },
    changeChart (item) {
      this.activeChart = item
    },
    // async getNodeTypeList () {
    //   let list = await getNodeType()
    //   list.forEach(item => {
    //     let temp = {}
    //     temp.typeCode = item.entity_type_en_name
    //     temp.typeName = item.entity_type_zh_name
    //     this.usefulRelationTypeList.push(temp)
    //     this.usefulRelationTypeListMap[item.entity_type_en_name] = item.entity_type_zh_name
    //   })
    // },
    // 获取实体的图标
    // async getEntityIcon () {
    //   let list = await getEntityIcon()
    //   this.iconObj = list
    // },
    // 获取关系图谱数据
    async obtainGraphData () {
      let attr_type = ''
      let isNomal = true
      // console.log(this.personInfo.cerTypeName)
      if (this.personInfo.cerTypeName === '身份证') {
        attr_type = 'entity_identity_card_type'
      } else if (this.personInfo.cerTypeName === '护照') {
        attr_type = 'entity_passport_type'
      } else if (this.personInfo.cerTypeName === '港澳通行证') {
        attr_type = 'entity_hk_permit_type'
      } else {
        isNomal = false
      }
      // if (!attr_type) {
      //   return false
      // }

      let RelationObj = {}
      if (isNomal) { // 如果是正常3种证件
        let tempList = [{
          attr_type: attr_type,
          value: this.personInfo.cerNumber
        }]
        RelationObj = await getDeductionSingle({ deduce_condition_list: tempList })
      } else { // 其它未知证件
        this.chartList = []
        return
        // RelationObj = await getDeductionVid({ vid: this.vid })
      }

      if (!RelationObj.edge.length && !RelationObj.vertex.length) { // 无数据
        this.chartList = []
        return
      }
      // console.log(RelationObj)
      const { vertex, edge } = RelationObj
      // 发请求去请求边的次数数据relationEdgeRank
      const newedge = await this.handleEdge(edge)

      this.chartList = [vertex, newedge]
      this.copyChartsList = JSON.parse(JSON.stringify(this.chartList))
      // console.log(this.copyChartsList)
    },
    handleEdge (list) {
      return new Promise(resolve => {
        // let arr = []
        // list.forEach(item => {
        //   arr.push(relationEdgeRank(item))
        // })
        // Promise.all(arr).then(res => {
        //   resolve(res)
        // })
        relationEdgeRank({ edge_data_list:list}).then(res => {
          resolve(res)
        })
      })
    },
    // 双击图谱实体
    handleDbClick (params) {
      let tempList = []
      if (params.cer_type === 'attr_hk_permit_type') {
        tempList.push({
          value: params.cer_number,
          attr_type: 'entity_hk_permit_type'
        })
      } else if (params.cer_type === 'attr_passport_type') {
        tempList.push({
          value: params.cer_number,
          attr_type: 'entity_passport_type'
        })
      } else if (params.cer_type === 'attr_identity_card_type') {
        tempList.push({
          value: params.cer_number,
          attr_type: 'entity_identity_card_type'
        })
      } else if (params.type === 'entity_address_type') {
        tempList.push({
          value: params.vid.slice(20),
          attr_type: 'entity_address_type'
        })
      } else if (params.type === 'entity_network_account_type') {
        tempList.push({
          value: params.app_type + '-' + params.main_prop_val,
          attr_type: 'entity_network_account_type'
        })
      } else {
        tempList.push({
          value: params.main_prop_val,
          attr_type: params.type
        })
      }
      getDeductionSingle({deduce_condition_list: tempList}).then( res => {
        if (!res.edge.length || !res.vertex.length) {
          this.$messageTip.info('该实体无可更新数据')
          return
        } else {
          // console.log(this.copyChartsList)
          // 判断有无新的实体
          let noNewVertex = false
          let vertexList = []
          let oldVertexList = []
          res.vertex.forEach(item => {
            vertexList.push(item.vid)
          })
          this.copyChartsList[0].forEach(item => {
            oldVertexList.push(item.vid)
          })
          noNewVertex = vertexList.every(item => {
            return oldVertexList.includes(item)
          })
          // 判断有无新的边
          let noNewEdge = false
          let edgeList = []
          let oldEdgeList = []
          res.edge.forEach(item => {
            edgeList.push(item.vid)
          })
          this.copyChartsList[1].forEach(item => {
            oldEdgeList.push(item.vid)
          })
          noNewEdge = edgeList.every(item => {
            return oldEdgeList.includes(item)
          })
          // console.log(noNewVertex,noNewEdge)
          // 双击后有新的数据才更新图谱
          if (!noNewVertex || !noNewEdge) { // 有新实体或新关系边就可以添加
            this.copyChartsList[0] = this.copyChartsList[0].concat(res.vertex)
            this.copyChartsList[1] = this.copyChartsList[1].concat(res.edge)
            this.chartList = []
            this.chartList = JSON.parse(JSON.stringify(this.copyChartsList))
            // console.log(this.$refs.child.isShow,this.chartList)
          } else {
            this.$messageTip.info('该实体无可更新数据')
          }
        }
      })
      // }
    },
    // 展开左侧面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
  }
}
</script>

<style lang="less" scoped>
.Chart {
  padding: 0 24px 15px 24px;
  // padding: 0 0px 15px 0px;
  overflow: hidden;
  position: relative;
  // .select_button {
  //   position: absolute;
  //   z-index: 999;
  //   top: 24px;
  //   left: 24px;
  //   // right: 24px;
  //   // cursor: pointer;
  //   display: flex;
  //   border: 1px solid @border-color-1;
  //   .common-style {
  //     padding: 5px 16px;
  //     color: @font-color-1;
  //     font-size: 14px;
  //     cursor: pointer;
  //     &:hover {
  //       color: @active-color;
  //     }
  //     &.active {
  //       background: @active-color;
  //       color: @font-color-3;
  //       border: 1px solid @active-color;
  //     }
  //     // &:hover {
  //     //   background-color: @active-color;
  //     // }
  //   }
  //   .common-style:last-child {
  //     border-right: 0px;
  //   }
  // }
  // .button {
  //   z-index: 999;
  //   // display: flex;
  //   position: absolute;
  //   right: 24px;
  //   top: 26px;
  // }
  .main_box {
    .diagram_box {
      position: relative;
      height: calc(100vh - 210px);
      background-color: rgba(192, 208, 231, 0.05);
      .empty_div {
        height: calc(100vh - 210px);
      }
      .drawer{
        position: absolute;
        /deep/.DrawerWrapper{
          height: calc(100vh - 220px);
          background: var(--bg-color-3);
          box-shadow: var(--box-shadow);
        }
        /deep/.icon-con{
          background: var(--bg-color-3);
          box-shadow: var(--box-shadow);
        }
        .main_box{
          // display: flex;
          overflow-y: scroll;
          height: calc(100vh - 300px);
          background: var(--bg-color-2);
          .content{
            margin-top: 12px;
            cursor: pointer;
          }
        }
        .total{
          position: absolute;
          bottom: 10px;
        }
      }
      // .title_box{
      //   padding: 12px 10px 12px 0;
      //   /deep/.el-divider--vertical {
      //     display: inline-block;
      //     width: 4px;
      //     height: 1em;
      //     margin: 0 0.04167rem 0 0;
      //     vertical-align: text-bottom;
      //     position: relative;
      //   }
      //   span {
      //     font-weight: 400;
      //     color: #c0d0e7;
      //     font-size: 16px;
      //   }
      // }
      // .main-content{
      //   overflow-y: scroll;
      //   height: calc(100vh - 280px);
      //   // width: 400px;
      //   width: 100px;
      //   /deep/.el-descriptions__body {
      //     // color: #8799BF;
      //     background-color: transparent;
      //   }
      //   /deep/.el-descriptions-item{
      //     padding-bottom: 3px !important;
      //   }
      //   /deep/.el-descriptions-item__label{
      //     width: 60px !important;
      //     font-size: 14px;
      //     color: #8799BF;
      //   }
      //   /deep/.el-descriptions-item__content{
      //     color: #C0D0E7 !important;
      //     font-weight: 400;
      //     font-size: 16px;
      //   }
      // }
    }
    .rightDialog {
      right: 32px;
      top: 32px;
      height: calc(100vh - 280px);
    }
  }
  /deep/.chart {
    /* height: 100%; */
    height: calc(100vh - 200px);
    user-select:text !important;
  }
}
</style>
