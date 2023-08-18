<template>
  <div class="newChart">
    <div ref="newChart" style="height:calc(100vh - 110px);">
        <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick">
          <!-- <div slot="bottomPanel" style="border-top:#efefef solid 1px;height:60px;line-height: 60px;text-align: center;font-size: 18px;background-color: #ffffff;">
            这里是底部插槽 slot="bottomPanel",可以自定义这里的内容
          </div> -->
          <!-- <div slot="node" slot-scope="{node}" @mouseover="showNodeTips(node, $event)" @mouseout="hideNodeTips(node, $event)">
            <span>666</span>
          </div> -->
          <div slot="node" slot-scope="{node}" @mouseover="showNodeTips(node, $event)" @mouseout="hideNodeTips(node, $event)">
            <div>
              <el-image :src="node.data.img" fit="cover" style="width:40px;height:40px;"></el-image>
            </div>
            <div style="color: #c0d0e7;font-size: 16px;position: absolute;width: 100%;height:25px;line-height: 25px;margin-top:5px;text-align: center;">
              {{ node.data.text }}
            </div>
          </div>
        </RelationGraph>
     </div>
     <div v-if="isShowNodeTipsPanel" class="tipsPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">节点名称：{{currentNode.text}}</div>
      <div class="c-node-menu-item">id:{{currentNode.text}}</div>
      <!-- <div class="c-node-menu-item">图标:{{currentNode.data.myicon}}</div> -->
    </div>
  </div>
</template>

<script>
import RelationGraph from 'relation-graph'
// import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'

export default {
  name: 'newChart',
  components: {
    RelationGraph
  },
  props: {
    chartList: {
      type: Array
    }
  },
  data () {
    return {
      isShowNodeTipsPanel: false,
      nodeMenuPanelPosition: { x: 0, y: 0 },
      currentNode: {},
      graphOptions: {
        defaultLineColor: '#515c7c',
        allowShowMiniToolBar: true, // 是否显示工具栏
        allowSwitchLineShape: true,// 是否在工具栏中显示切换线条形状的按钮
        allowSwitchJunctionPoint: true,// 是否在工具栏中显示切换连接点位置的按钮
        allowShowMiniView: true, // 是否显示缩略图
        isMoveByParentNode: true, // 是否在拖动节点后让子节点跟随
        defaultJunctionPoint: 'border',
        defaultLineWidth: 2, // 默认的线条粗细
        moveToCenterWhenResize: false, // 当图谱的大小发生变化时，是否重新让图谱的内容看起来居中
        // 布局方式
        layouts: [
          {
            "label": "关系图",
            "layoutName": "center",
            "layoutClassName": "seeks-layout-center",
            "distance_coefficient": 1
          },
          {
            "label": "树图",
            "layoutName": "tree",
            "layoutClassName": "seeks-layout-center",
            "defaultJunctionPoint": "border",
            "defaultNodeShape": 0,
            // "defaultLineShape": 1, // 默认的线条样式（1:直线/2:样式2/3:样式3/4:折线/5:样式5/6:样式6）
          }
          // {
          //   'label': '布局2',
          //   'layoutName': 'tree',
          //   'layoutClassName': 'seeks-layout-center',
          //   useLayoutStyleOptions: true,
          //   'from': 'top',
          //   'defaultNodeWidth': '30',
          //   'defaultNodeHeight': '100',
          //   'defaultJunctionPoint': 'tb',
          //   'defaultNodeShape': 1,
          //   'defaultLineShape': 4,
          //   'defaultNodeBorderWidth': 0,
          //   'defaultLineColor': 'rgba(0, 186, 189, 1)',
          //   'defaultNodeColor': 'rgba(0, 206, 209, 1)',
          //   'min_per_width': 40,
          //   'max_per_width': 70,
          //   'min_per_height': 200
          // },
          // {
          //   'label': '布局3',
          //   'layoutName': 'tree',
          //   'layoutClassName': 'seeks-layout-center',
          //   useLayoutStyleOptions: true,
          //   'from': 'left',
          //   'defaultNodeWidth': '100',
          //   'defaultNodeHeight': '30',
          //   'defaultJunctionPoint': 'lr',
          //   'defaultNodeShape': 1,
          //   'defaultLineShape': 3,
          //   'defaultNodeBorderWidth': 0,
          //   'defaultLineColor': '#cccccc',
          //   'defaultNodeColor': '#43a2f1',
          //   'min_per_width': 200,
          //   'max_per_width': 400,
          //   'min_per_height': 40,
          //   'max_per_height': 70
          // }
        ]
      },
      chartData: {}
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    ...mapState('Common', {
      iconObj: 'iconObj',
      usefulRelationTypeListMap: 'usefulRelationTypeListMap',
      usefulRelationTypeList: 'usefulRelationTypeList'
    }),
    ...mapState('User', {
      theme: 'theme'
    }),
    // defaultLineColor () {
    //   let colorObj = this.theme === 'light' ? lightTheme : darkTheme
    //   return colorObj['--bg-deduction-line']
    // }
    // ...mapState('User', {
    //   theme: 'theme'
    // }),
    // chartsBg () {
    //   let colorObj = this.theme === 'light' ? lightTheme : darkTheme
    //   // console.log(colorObj['--loading-color']);
    //   // return colorObj['--loading-color']
    //   return colorObj['--bg-deduction-chart']
    // }
  },
  // watch: {
  //   chartList: {
  //     handler (val) {
  //       console.log(val)
  //       this.showSeeksGraph()
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  async created () {
    // console.log(this.iconObj)
    console.log(this.chartList)
    this.chartData.rootId =this.chartList[0][0].vid
    this.chartData.nodes = this.chartList[0]
    this.chartData.links = this.chartList[1]
    this.chartData.nodes.forEach(item => {
      item.data = {
        text: item.main_prop_val,
        id: item.vid,
        img: this.origin + this.iconObj[item.type]['icon_path']
      }
      item.text = item.main_prop_val
      item.id = item.vid
      // item.html = `
      // <div class="c-my-node" style="background-image: url(${this.origin + this.iconObj[item.type]['icon_path']});">
      //   <div class="c-node-name">${item.text}</div>
      // </div>`
    })
    this.chartData.links.forEach(item => {
      item.text = item.data_source
      item.from = item.src
      item.to = item.dst
      item.id = item.vid
    })
    // this.chartData = {
    //   rootId: 'entity_certificate_type-888888199991000002',
    //   nodes:[
    //     {
    //       avatar_url: "",
    //       birthday: "1996-09-22",
    //       cer_number: "888888199991000002",
    //       cer_type: "attr_identity_card_type",
    //       create_time: 1670921612,
    //       gender: "未知的性别",
    //       text: "王膀铿迷合牯",
    //       name: "王膀铿迷合牯",
    //       name_pinyin: "",
    //       nation: "",
    //       registered_address: "珊窨新邃啬",
    //       status: null,
    //       type: "entity_certificate_type",
    //       update_time: 1670921612,
    //       icon_path: "image/entityicon/entity_person_attr_type.png",
    //       id: "entity_certificate_type-888888199991000002",
    //       // html: `
    //       //   <div class="c-my-node" style="background-image: url(http://localhost:8080/image/entityicon/entity_person_attr_type.png);">
    //       //     <div class="c-node-name">侯亮平</div>
    //       //   </div>`
    //     }, {
    //       "create_time": 1670921612,
    //       "imsi": "",
    //       "text": "15669750260",
    //       "phone": "15669750260",
    //       "status": null,
    //       "type": "entity_phone_card_type",
    //       "update_time": 1670921612,
    //       "id": "entity_phone_card_type-15669750260"
    //     }, {
    //       "create_time": 1670913275,
    //       "imsi": "",
    //       "text": "15103348868",
    //       "phone": "15103348868",
    //       "status": null,
    //       "type": "entity_phone_card_type",
    //       "update_time": 1670913275,
    //       "id": "entity_phone_card_type-15103348868"
    //     }, {
    //       "company": "怿卫与傍尽",
    //       "company_address": "笔艹镶雅咋",
    //       "create_time": 1670913275,
    //       "latitude": "",
    //       "longitude": "",
    //       "text": "怿卫与傍尽",
    //       "status": null,
    //       "type": "entity_company_type",
    //       "update_time": 1670913275,
    //       "id": "entity_company_type-e5b5c34ba8a49119d44f0d2bc674ad41"
    //     }, {
    //       "address": "西藏自治区海口市涪城六安街S座 531890",
    //       "city": "",
    //       "community": "",
    //       "create_time": 1670897842,
    //       "district": "",
    //       "latitude": "",
    //       "longitude": "",
    //       "text": "西藏自治区海口市涪城六安街S座 531890",
    //       "province": "",
    //       "status": null,
    //       "street": "",
    //       "type": "entity_address_type",
    //       "update_time": 1670897842,
    //       "id": "entity_address_type-9f1cef56cc37e1c2e809a3faafb22ccf"
    //     }, {
    //       "address": "福建省惠州县合川邱路R座 871672",
    //       "city": null,
    //       "community": null,
    //       "create_time": 1670902180,
    //       "district": null,
    //       "latitude": null,
    //       "longitude": null,
    //       "text": "福建省惠州县合川邱路R座 871672",
    //       "province": null,
    //       "status": null,
    //       "street": null,
    //       "type": "entity_address_type",
    //       "update_time": 1670902180,
    //       "id": "entity_address_type-bca76ff8b5020b1d06470a39c1164011"
    //     }, {
    //       "company": "萏胝鸳蟑疤",
    //       "company_address": "箢险叟耦砷",
    //       "create_time": 1670921612,
    //       "latitude": "",
    //       "longitude": "",
    //       "text": "萏胝鸳蟑疤",
    //       "status": null,
    //       "type": "entity_company_type",
    //       "update_time": 1670921612,
    //       "id": "entity_company_type-be18ad528ac3b70b87ee014b2d52ce3d"
    //     }
    //   ],
    //   links: [
    //     {
    //       "data_source": "引号核酸",
    //       "to": "entity_phone_card_type-15669750260",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_asset",
    //       "id": "edge_person_asset-entity_certificate_type-888888199991000002-entity_phone_card_type-15669750260-0"
    //     }, {
    //       "data_source": "引号核酸",
    //       "to": "entity_phone_card_type-15103348868",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_asset",
    //       "id": "edge_person_asset-entity_certificate_type-888888199991000002-entity_phone_card_type-15103348868-0"
    //     }, {
    //       "data_source": "引号核酸",
    //       "to": "entity_company_type-e5b5c34ba8a49119d44f0d2bc674ad41",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_attr",
    //       "id": "edge_person_attr-entity_certificate_type-888888199991000002-entity_company_type-e5b5c34ba8a49119d44f0d2bc674ad41-0"
    //     }, {
    //       "data_source": "引号核酸",
    //       "to": "entity_address_type-9f1cef56cc37e1c2e809a3faafb22ccf",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_attr",
    //       "id": "edge_person_attr-entity_certificate_type-888888199991000002-entity_address_type-9f1cef56cc37e1c2e809a3faafb22ccf-0"
    //     }, {
    //       "data_source": "引号核酸",
    //       "to": "entity_address_type-bca76ff8b5020b1d06470a39c1164011",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_attr",
    //       "id": "edge_person_attr-entity_certificate_type-888888199991000002-entity_address_type-bca76ff8b5020b1d06470a39c1164011-0"
    //     }, {
    //       "data_source": "引号核酸",
    //       "to": "entity_company_type-be18ad528ac3b70b87ee014b2d52ce3d",
    //       "relationship": null,
    //       "from": "entity_certificate_type-888888199991000002",
    //       "type": "edge_person_attr",
    //       "id": "edge_person_attr-entity_certificate_type-888888199991000002-entity_company_type-be18ad528ac3b70b87ee014b2d52ce3d-0"
    //     },
    //     {
    //       "data_source": "引号核酸",
    //       "to": "entity_company_type-be18ad528ac3b70b87ee014b2d52ce3d",
    //       "relationship": null,
    //       "from": "entity_phone_card_type-15103348868",
    //       "type": "edge_person_attr",
    //       "id": "edge_person_attr-entity_certificate_type-888888199991000002-entity_company_type-be18ad528ac3b70b87ee014b2d52ce3d-0"
    //     }
    //   ]
    // },
    // this.chartData.nodes.forEach(item => {
    //   item.html = `
    //   <div class="c-my-node" style="background-image: url(${this.origin + this.iconObj[item.type]['icon_path']});">
    //     <div class="c-node-name">${item.text}</div>
    //   </div>`
    // })
  },
  mounted () {
    this.showSeeksGraph()
  },
  methods: {
    showSeeksGraph () {
      // console.log(this.chartData)
      this.$refs.seeksRelationGraph.setJsonData(this.chartData, () => {
        // console.log(seeksRGGraph)
      })
    },
    onNodeClick (nodeObject) {
      // console.log('onNodeClick:', nodeObject,$event)
      this.$emit('newHandleDbClick', nodeObject.id)
    },
    onLineClick () {
      // console.log('onLineClick:', lineObject,$event)
    },
    showNodeTips (nodeObject, $event) {
      this.currentNode = nodeObject
      var _base_position = this.$refs.newChart.getBoundingClientRect()
      // console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeTipsPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x + 10
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y + 10
    },
    hideNodeTips () {
      this.isShowNodeTipsPanel = false
    },
    // 单击拓展
    add (addObj) {
      // console.log(addObj,999)
      addObj.nodes.forEach(item => {
        item.data = {
          text:item.main_prop_val,
          id:item.id,
          img:this.origin + this.iconObj[item.type]['icon_path']
        }
        item.text = item.main_prop_val
        item.id = item.vid
        // item.html = `
        // <div class="c-my-node" style="background-image: url(${this.origin + this.iconObj[item.type]['icon_path']});">
        //   <div class="c-node-name">${item.text}</div>
        // </div>`
      })
      addObj.links.forEach(item => {
        item.text = item.data_source
        item.from = item.src
        item.to = item.dst
        item.id = item.vid
      })
      // console.log(addObj)
      // var __graph_json_data = {
      //   rootId: 'entity_car_type-粤D10499',
      //   nodes: [
      //     // { id: '3', name: '节点-3'},
      //     { id: '71', text: '节点-71'},
      //     { id: '72', text: '节点-72'},
      //     { id: '73', text: '节点-73'},
      //   ],
      //   links: [
      //     { from: 'entity_car_type-粤D10499', to: '71', text: '投资' },
      //     { from: 'entity_car_type-粤D10499', to: '72', text: '投资' },
      //     { from: 'entity_car_type-粤D10499', to: '73', text: '投资' },
      //     { from: '73', to: 'entity_address_type-11c08aba2f11f1ef9eaddc217f23aaeb', text: '投资' }
      //   ]
      // }
      this.$refs.seeksRelationGraph.appendJsonData(addObj, () => {
        // console.log(seeksRGGraph)
        // 这些写上当图谱初始化完成后需要执行的代码
      })
    }
  }
}
</script>

<style lang="less" scoped>
.newChart{
  /deep/.c-mini-graph{
    height: 100px;
    width: 100px;
    position: absolute;
    right: 60px !important;
    margin-top: 100px;
    z-index: 999;
  }
  /deep/.rel-map{
    background: var(--bg-deduction-chart);
  }
  /deep/.rel-nodediv .rel-node-peel .rel-node {
    background-color: transparent !important;
    border: 0 !important;
  }
  /deep/.rel-nodediv .rel-node-shape-0 {
    width: 100% !important;
    height: 100% !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }
  /deep/.c-my-node{
    background-position: center center;
    background-size: 100%;
    border:transparent solid 1px;
    // border:#c0d0e7 solid 1px;
    height:60px; // 80
    width:60px;
    border-radius: 40px;
  }
  /deep/.c-node-name{
    color:#c0d0e7;
    // width:max-content; // 160
    margin-left:10px; // -40
    // text-align:center;
    margin-top:65px; // 85
  }
  .tipsPanel{
    position: absolute;
    z-index: 999;
    padding:10px;
    background-color: var(--tooltip-bg-262D44-to-f6f8fd);
    border: var(--tooltip-bg-262D44-to-f6f8fd) solid 1px;
    box-shadow: 0px 0px 8px #cccccc;
  }
}
</style>
