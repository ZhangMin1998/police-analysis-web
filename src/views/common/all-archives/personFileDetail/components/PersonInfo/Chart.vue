<template>
  <div class="Chart">
    <div class="main_box">
      <div class="diagram_box" v-if="activeChart === 'diagram'">
        <div class="drawer">
          <drawer
            :drawer.sync="drawer"
            :cusStyle="{ top: '10px' }"
            :drawerTop="{ width: imgWidth, height: '5px' }"
            width="424px"
            oldLeft="-5px"
            :moveLeft="moveLeft"
            @handleClick="DrawerHandleClick"
          >
            <div class="main_box">
              <div
                class="content_box"
                v-for="(item, index) in labelList"
                :key="index"
                @click="clickLabel(index)"
              >
                <div :class="['content', { selected: item[0].isSelect }]">
                  <div class="icon">
                    <img :src="origin + iconObj[item[0].value]['icon_path']" alt="" />
                  </div>
                  <div class="info_box">
                    <div v-for="(e, i) in item" :key="i">
                      <div class="info" v-if="!e.isIcon">
                        <div class="label">
                          <!-- {{e.label + '：'}} -->
                          <EllipsisPop
                            :content="e.label + '：'"
                            :rowNum="1"
                            width="100px"
                          ></EllipsisPop>
                        </div>
                        <div
                          class="value"
                          v-if="e.label_en === 'avatar_url' || e.label_en === 'car_image'"
                        >
                          <el-image :src="origin + e.value" fit="cover">
                            <div slot="error" class="image-slot">
                              <img :src="errImg" />
                            </div>
                          </el-image>
                        </div>
                        <div class="value" v-else>
                          <!-- {{e.value}} -->
                          <EllipsisPop :content="e.value" :rowNum="1" width="230px"></EllipsisPop>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="total">
              <span>总数：</span>
              <span>{{ labelList.length }}</span>
            </div>
          </drawer>
        </div>
        <Loading :isLoading.sync="isLoading">
          <Diagram
            ref="charts"
            v-if="chartList.length"
            :id="id"
            :isAsyncLoadData="id !== 'chart1' ? true : false"
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
import { getDeductionSingle, relationEdgeRank } from '@/api/analysis'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'

export default {
  name: 'Chart',
  components: {
    Loading,
    EmptyData,
    Diagram,
    Drawer,
    EllipsisPop
  },
  props: {
    personInfo: {
      type: Object
    },
    id: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      isLoading: false,
      activeChart: 'diagram',
      chartList: [],
      copyChartsList: [], // 给双击用的
      moveLeft: '-424px',
      imgWidth: '',
      drawer: {
        isShow: true
      },
      labelList: [],
      selected: false,
      searchPersonObj: {
        cerNumber: '',
        vid: ''
      }
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray',
      iconObj: 'iconObj',
      usefulRelationTypeListMap: 'usefulRelationTypeListMap',
      usefulRelationTypeList: 'usefulRelationTypeList'
    }),
    chartsBg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--loading-color']
    },
    origin () {
      return window.location.origin + '/'
    },
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic']
    },
  },
  async created () {
    this.isLoading = true
    // await this.getNodeTypeList() // 获取对照表
    // await this.getEntityIcon() // 获取实体图标
    await this.obtainGraphData() // 获取图谱数据
    this.isLoading = false
  },
  mounted () {
    this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },

  methods: {
    updateData (position) {
      this.copyChartsList[0] = this.copyChartsList[0].filter((item, index) => {
        return this.copyChartsList[0].findIndex(item1 => item1.vid == item.vid) == index
      })
      this.copyChartsList[0].forEach((item, index) => {
        item.x = position[index][0]
        item.y = position[index][1]
        item.fixed = true
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

      let RelationObj = {}
      if (isNomal) { // 如果是正常3种证件
        // let tempList = [{
        //   attr_type: attr_type,
        //   value: this.personInfo.cerNumber
        // }]
        // RelationObj = await getDeductionSingle({ deduce_condition_list: tempList })
        if (this.id === 'chart1') { // 人-物图谱
          let tempList = [{
            attr_type: attr_type,
            value: this.personInfo.cerNumber
          }]
          RelationObj = await getDeductionSingle({ deduce_condition_list: tempList })
        } else { // 获取人际关系图谱数据
          // 一次性请求所有数据,需要时打开这里即可
          // let tempList = {
          //   deduce_condition_list: [{
          //     attr_type: attr_type,
          //     value: this.personInfo.cerNumber,
          //   }],
          //   layer: 2
          // }
          // RelationObj = await getInterPersonal(tempList)
          // 异步请求,关闭时注释这里即可
          let tempList = {
            deduce_condition_list: [{
              attr_type: attr_type,
              value: this.personInfo.cerNumber,
            }]
          }
          RelationObj = await getDeductionSingle(tempList)
        }
      } else { // 其它未知证件
        this.chartList = []
        return
      }

      if (!RelationObj.edge.length && !RelationObj.vertex.length) { // 无数据
        this.chartList = []
        return
      }

      let { vertex, edge } = RelationObj
      // 发请求去请求边的次数数据relationEdgeRank
      // console.log(edge)
      const newedge = await this.handleEdge(edge)
      // console.log(newedge)
      edge = newedge
      let leftChartList = []
      if (this.id === 'chart1') { // 人物图谱
        let temp = [vertex, edge]
        let vertexResult = []
        let edgeResult = []
        temp[0].forEach(item => {
          if (item.type !== 'entity_person' || item.cer_number === this.personInfo.cerNumber) {
            vertexResult.push(item)
          }
        })
        this.chartList.push(vertexResult)
        temp[1].forEach(item => {
          if (!(item.dst.split('-')[0] === 'entity_person' && item.src.split('-')[0] === 'entity_person')) {
            edgeResult.push(item)
          }
        })
        this.chartList.push(edgeResult)
        leftChartList = JSON.parse(JSON.stringify(vertexResult))
        this.copyChartsList = JSON.parse(JSON.stringify(this.chartList))
      } else { // 人-人图谱
        this.chartList = [vertex, edge]
        this.AdjustOrder()
        this.copyChartsList = JSON.parse(JSON.stringify(this.chartList))
        let temp = [vertex, edge]
        temp[0].forEach(item => {
          if (item.type === 'entity_person') {
            leftChartList.push(item)
          }
        })
      }
      this.searchPersonObj.cerNumber = vertex[0].cerNumber
      this.searchPersonObj.vid = vertex[0].vid
      //第一次格式化左边窗口数据生成this.labelList
      this.formatLeftChartList(leftChartList, edge)
      //第二次格式化this.labelList左边窗口数据变为可用数据
      this.formatLabelList()
      // 刚才只是获取人际关系的第一层数据，现在根据返回的数据去获取第二层数据,如果不需要异步，则注释这里即可
      if (this.id !== 'chart1') {
        this.getSecondData(vertex)
      }
    },
    getSecondData (nodeList) {
      if (nodeList.length) {
        nodeList.forEach(async (item, index) => {
          let tempList = {
            deduce_condition_list: [{
              attr_type: item.type,
              value: item.vid.split('-')[1]
            }]
          }
          setTimeout(async () => {
            let { vertex, edge } = await getDeductionSingle(tempList)
            // 这里去除重复的节点和关系再加入到之前的那些节点和关系中去
            const noRepeatVertex = this.getInclude(this.chartList[0], vertex.filter((item)=>item.type === 'entity_person'))
            let noRepeatEdge = this.getInclude(this.chartList[1], edge)
            noRepeatEdge  = await this.handleEdge(noRepeatEdge)
            let leftChartList = vertex.filter((item)=> item.type === 'entity_person')
            leftChartList = this.getInclude(this.chartList[0], leftChartList)
            this.copyChartsList[0] = this.copyChartsList[0].concat(noRepeatVertex)
            this.copyChartsList[1] = this.copyChartsList[1].concat(noRepeatEdge)
            this.chartList = JSON.parse(JSON.stringify(this.copyChartsList))
            this.formatLeftChartList(leftChartList, edge)
            //第二次格式化this.labelList左边窗口数据变为可用数据
            //  console.log(this.labelList)
            this.formatLabelList()
            // 调整顺序this.labelList第一个元素节点的顺序
            this.AdjustOrder()
            // console.log(leftChartList)
          }, index * 500)
        })
      }
    },
    AdjustOrder () {
      const nodeList = this.chartList[0]
      let peopleList = nodeList.filter(item => item.type === 'entity_person')
      let thingList = nodeList.filter(item => item.type !== 'entity_person')
      let newVertexList = peopleList.concat(thingList)
      this.chartList = [newVertexList, this.chartList[1]]
    },
    getInclude (arr1, arr2) {
      let temp = arr2.filter(item => !arr1.some(ele => ele.vid === item.vid))
      return temp
    },
    formatLabelList () {
      this.labelList.forEach(list => {
        if (list[0].isIcon && list[0].value === 'entity_person') {
          list.forEach(item => {
            if (item.label === '证件类型') {
              if (item.value === 'attr_identity_card_type') {
                item.value = '身份证'
              } else if (item.value === 'attr_hk_permit_type') {
                item.value = '港澳通行证'
              } else if (item.value === 'attr_passport_type') {
                item.value = '护照'
              }
            }
            else if (item.label === '性别') {
              item.value = item.value === 'female' ? '女' : '男'
            }

          })
          let isIdCard = list.some(item => {
            return item.value === '身份证'
          })
          let isSex = list.some(item => {
            return item.label === '性别'
          })
          if (isIdCard && isSex) { // 如果是身份证和有性别项
            let cerNumber
            list.forEach(item => {
              if (item.label === '证件号码') {
                cerNumber = item.value
              } else if (item.label === '性别') {
                if (parseInt(cerNumber.substr(16, 1)) % 2 === 1) {
                  item.value = '男'
                } else {
                  item.value = '女'
                }
              }
            })
          }
        }
      })
    },
    formatLeftChartList (leftChartList, edge) {
      leftChartList.forEach(item => {
        let temp = []
        temp.push({
          value: item.type,
          isIcon: true,
          isSelect: false
        })
        for (let key in item) {
          this.iconObj[item.type].fields.forEach(e => {
            if (key === e.label_name_en && item[key]) {
              if (key.indexOf('_image') !== -1) {
                temp.push({
                  label: e.label_name_cn,
                  label_en: e.label_name_en,
                  value: item[key],
                  isImage: true
                })
              } else {
                temp.push({
                  label: e.label_name_cn,
                  label_en: e.label_name_en,
                  value: item[key],
                  isImage: false
                })
              }
            }
          })
        }
        let nameIndex = temp.findIndex(item => {
          return item.label === '姓名'
        })
        if (nameIndex !== -1) {
          let toIndex = 1 // 把姓名移到下标为1 的位置
          let element = temp.splice(nameIndex, 1)[0] // 找出姓名Obj
          temp.splice(toIndex, 0, element) // 插入

          // 有姓名字段的时候 后面添加（关系）
          let isSelf = temp.some(item => {
            return item.value === this.searchPersonObj.cer_number
          })
          if (!isSelf) { // 如果是本人 就不用在姓名后面添加（关系）
            let cerNumber
            temp.forEach(item => {
              if (item.label === '证件号码') {
                cerNumber = item.value
              }
            })
            let tempVid = 'entity_person-' + cerNumber
            let tempObj = {}
            edge.forEach(item => {
              if ((item.dst === this.searchPersonObj.vid && item.src === tempVid) || (item.src === this.searchPersonObj.vid && item.dst === tempVid)) {
                tempObj.relationship = item.relationship
                tempObj.type = item.type
              }
            })
            if (Object.keys(tempObj).length) {
              temp.forEach(item => {
                if (item.label === '姓名') {
                  item.value = item.value + '（' + tempObj.relationship + '）'
                }
              })
            }
          }
        }
        this.labelList.push(temp)
      })
    },
    handleEdge (list) {
      return new Promise((resolve) => {
        // let arr = []
        // list.forEach((item) => {
        //   arr.push(relationEdgeRank(item))
        // })
        // Promise.all(arr).then((res)=>{
        //   resolve(res)
        // })
        relationEdgeRank({ edge_data_list:list}).then(res => {
          resolve(res)
        })
      })
    },
    // 双击图谱实体
    handleDbClick (params) {
      if (this.id === 'chart1' || this.id === 'chart2') return false // 图谱禁止双击
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
      } else if (params.type === 'entity_address') {
        tempList.push({
          value: params.vid.slice(20),
          attr_type: 'entity_address_type'
        })
      } else if (params.type === 'entity_network_account') {
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
      getDeductionSingle({ deduce_condition_list: tempList }).then(res => {
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
    // 点击左侧信息
    clickLabel (index) {
      this.labelList.forEach(item => {
        item[0].isSelect = false
      })
      this.labelList[index][0].isSelect = true
      this.$refs.charts.switchHigh(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.Chart {
  // padding: 0 24px 15px 24px;
  padding: 0 0px 15px 0px;
  overflow: hidden;
  position: relative;
  .main_box {
    .diagram_box {
      position: relative;
      height: calc(100vh - 210px);
      background-color: rgba(192, 208, 231, 0.05);
      .empty_div {
        height: calc(100vh - 210px);
      }
      .drawer {
        position: absolute;
        /deep/.DrawerWrapper {
          height: calc(100vh - 220px);
          background: var(--bg-color-3);
          box-shadow: var(--box-shadow);
        }
        /deep/.icon-con {
          background: var(--bg-color-3);
          box-shadow: var(--box-shadow);
        }
        .main_box {
          // display: flex;
          overflow-y: scroll;
          height: calc(100vh - 300px);
          background: var(--bg-color-2);
          .content_box {
            margin-top: 12px;
            cursor: pointer;
            .content {
              padding: 12px 0 0 0;
              display: flex;
              .icon {
                margin: 0 10px;
                img {
                  width: 18px;
                  height: 18px;
                }
              }
              .info_box {
                .info {
                  display: flex;
                  margin-bottom: 8px;
                  /deep/.el-popover__reference {
                    color: var(--base-text-color-to-666666) !important;
                  }
                  .label {
                    width: 100px;
                  }
                  .value {
                    /deep/ .el-image {
                      display: block;
                      width: 81px;
                      height: 102px;
                      img {
                        width: 81px;
                        height: 102px;
                      }
                    }
                    /deep/.image-slot {
                      background: var(--bg-color-2) !important;
                    }
                  }
                }
              }
            }
            .selected {
              background: var(--bg-leftDrawer-click);
            }
          }
        }
        .total {
          position: absolute;
          bottom: 10px;
        }
      }
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
    user-select: text !important;
  }
}
</style>
