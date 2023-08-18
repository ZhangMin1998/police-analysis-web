<!-- 关系推演 -->
<template>
  <div class="deduction-wrapper">
    <drawer
      :drawer.sync="drawer"
      :cusStyle="{ top: '0px', height: 'calc(100vh - 200px)' }"
      :drawerTop="{ width: imgWidth, height: '5px' }"
      width="424px"
      oldLeft="24px"
      :moveLeft="moveLeft"
      @handleClick="DrawerHandleClick"
    >
      <div class="main-content">
        <div class="title-box">数据条件</div>
        <div class="form-box" v-for="(item, index) in inputList" :key="index">
          <div :class="[{ 'input-box-warning': item.warning }]" class="input-box">
            <el-input
              placeholder="请输入准确数值"
              type="number"
              v-model.trim="item.value"
              class="input-with-select"
              v-if="item.inputLabel === '手机'"
            >
              <el-select v-model="item.inputLabel" slot="prepend" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-input>
            <el-input
              placeholder="请输入准确数值"
              type="text"
              v-model.trim="item.value"
              class="input-with-select"
              v-else
            >
              <el-select
                v-model="item.inputLabel"
                slot="prepend"
                placeholder="请选择"
                @change="inputLabelChange(index)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-input>
            <span class="warning">{{ item.warning }}</span>

            <div class="de" v-if="index !== 0" @click="deInput(index)">
              <i class="el-icon-remove-outline"></i>
              <!-- <img width="16" height="16" src="@/assets/img/icon-de.png" /> -->
            </div>
          </div>
          <!-- <div
            :class="[add, { 'add-disable': addIsDisable }]"
            v-if="index === inputList.length - 1"
            @click="addInput()"
          >
            <i class="el-icon-circle-plus-outline"></i>
            <span class="label">添加</span>
          </div> -->
        </div>
        <el-button type="primary" class="btn" v-debounce="submitHandleBtn">
          {{ isSubmiting ? '推演中...' : '推演' }}
        </el-button>
      </div>
    </drawer>
    <div class="relate-box">
      <div class="relate-box-empty" v-if="!chartsList.length">
        <!-- <div class="relate-box-empty" v-if="!isShow"> -->
        <img src="@/assets/img/bg-empty-deduction.png" alt="" />
        <span class="empty-text">请输入数据条件，进行关系推演</span>
      </div>
      <!-- v-show="isShow" -->
      <div class="relate-box-inner" v-else>
        <!-- :bgColor="'#21283E'" -->
        <Charts
          ref="charts"
          v-if="chartsList && chartsList.length"
          :bgColor="chartsBg"
          :chartList="chartsList"
          :moveMuchNode="bigListNode === null"
          :toShowNode="toShowNodeObj"
          @handleDbClick="handleDbClick"
          @updateData="updateData"
        />
      </div>
    </div>
    <div class="big_data_pop" v-if="bigListNode">
      <div class="title">
        <div class="name">
          <!-- <img :src='require("@/assets/img/set-bg.png")' alt=''> -->
          <img :src="getSrcUrl(bigListNode)" alt="" />
          <span>{{ bigListNode.main_prop_val }}</span>
        </div>
        <div class="close_btn">
          <i class="el-icon-close" @click="handleClose" title="关闭"></i>
        </div>
      </div>
      <div class="input_box">
        <el-input
          placeholder="请输入"
          v-model="searchKey"
          @input="searchEvent"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <div class="main_list">
        <div v-if="!showSearchData">
          <div v-for="(item, index) in Object.keys(newNodeObj)" class="data_item_box" :key="index">
            <div class="all" @click="handlePackup(index)">
              <!-- el-icon-arrow-right -->
              <i
                :class="
                  !expandIndexList.includes(index) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                "
              ></i>
              {{ dataTypeObj[item] }}（{{ newNodeObj[item].length }}）
            </div>

            <div class="list_name">
              <template v-if="!expandIndexList.includes(index)">
                <div
                  v-for="(item2, index2) in newNodeObj[item]"
                  class="item_name"
                  :key="index2"
                >
                  <div :class="!hasNode(item2) ? 'text' : ''" v-if="item2.type !== 'entity_person'">
                    {{ iconObj[item2.type].entity_name_cn }}/{{ item2.main_prop_val }}
                  </div>
                  <div :class="!hasNode(item2) ? 'text' : ''" v-else>
                    {{ personTypeObj[item2.cer_type] }}/{{ item2.cer_number }}
                  </div>
                  <div>
                    <i
                      v-if="hasNode(item2)"
                      class="el-icon-view"
                      title="显示"
                      @click="toShowNode(item2)"
                    ></i>
                    <i
                      v-else
                      class="iconfont icon-yincang"
                      title="隐藏"
                      @click="toShowNode(item2)"
                    ></i>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="no_data" v-else>
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import Charts from '@/views/common/analysis/relationship-deduction/Charts'
// import newCharts from '@/views/common/analysis/relationship-deduction/newCharts'
import { getDeductionSingle, getDeductionMulti, relationEdgeRank } from '@/api/analysis'
import { lightTheme, darkTheme } from '@/assets/js/variable'
import { mapState } from 'vuex'
const personTypeObj = {
  attr_passport_type: '护照',
  attr_identity_card_type: '身份证',
  attr_hk_permit_type: '港澳通行证'
}

export default {
  name: 'Deduction',
  components: {
    Drawer,
    Charts
    // newCharts
  },
  data () {
    return {
      toShowNodeObj: {},
      moveLeft: '-424px',
      imgWidth: '',
      drawer: {
        isShow: true //控制左侧的开关
      },
      inputList: [
        {
          inputLabel: '身份证',
          value: '',
          warning: ''
          // attr_type: '',
          // inputValue: '',
        }
      ],
      deduce_condition_list: [],
      options: [
        { value: 'entity_identity_card_type', label: '身份证' },
        { value: 'entity_phone_card', label: '手机' },
        { value: 'entity_car', label: '车牌' },
        { value: 'entity_assets_house', label: '不动产证号' },
        { value: 'entity_hk_permit_type', label: '港澳通行证' },
        { value: 'entity_passport_type', label: '护照' }
      ],
      add: 'add',
      addIsDisable: false,
      isSubmiting: false,
      chartsList: [], // 关系图谱数据
      copyChartsList: [],
      isShow: false, // 是否显示默认空图片,
      times: 0,
      bigListNode: null,
      searchKey: '',
      expandIndexList: [],
      newNodeObj: {},
      copyNewNodeObj: {},
      newNodeArr: [],
      newRelationArr: [],
      showSearchData: false,
      personTypeObj: personTypeObj
      // usefulRelationTypeListMap: {},
      // usefulRelationTypeList: [],
    }
  },
  computed: {
    ...mapState('Common', {
      iconObj: 'iconObj',
      dataTypeObj: 'dataTypeObj'
    }),
    ...mapState('User', {
      theme: 'theme'
    }),
    chartsBg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      // console.log(colorObj['--loading-color']);
      // return colorObj['--loading-color']
      return colorObj['--bg-deduction-chart']
    }
  },
  watch: {
    inputList: {
      handler (val) {
        if (val.length === 10) {
          this.addIsDisable = true
        } else {
          this.addIsDisable = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created () {
    if (this.$route.query.cerNumber && this.$route.query.cerType) {
      this.inputList[0].value = this.$route.query.cerNumber
      if (this.$route.query.cerType === 'attr_identity_card_type') {
        this.inputList[0].inputLabel = 'entity_identity_card_type'
      } else if (this.$route.query.cerType === 'attr_hk_permit_type') {
        this.inputList[0].inputLabel = 'entity_hk_permit_type'
      } else if (this.$route.query.cerType === 'attr_passport_type') {
        this.inputList[0].inputLabel = 'entity_passport_type'
      }
      this.submitHandleBtn()
    }
  },
  mounted () {
    this.moveLeft = document.getElementsByClassName('DrawerWrapper')[0].offsetWidth * -1 + 'px'
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },
  methods: {
    getSrcUrl (_c) {
      const url = window.location.origin + '/' + this.iconObj[_c.type]['icon_path']
      return url
    },
    handleClose () {
      this.bigListNode = null
    },
    updateData (position) {
      // 去重
      this.copyChartsList[0] = this.copyChartsList[0].filter((item, index) => {
        return this.copyChartsList[0].findIndex(item1 => item1.vid == item.vid) == index
      })
      this.copyChartsList[0].forEach((item, index) => {
        // console.log(index);
        item.x = position[index][0]
        item.y = position[index][1]
        item.fixed = true
      })
      // console.log('节点',this.copyChartsList[0]);
      // console.log('关系',this.copyChartsList[1]);
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
    // 展开面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },
    // 增加输入框
    addInput () {
      if (this.inputList.length >= 10) {
        return false
      }
      this.inputList.push({
        inputLabel: '身份证',
        value: '',
        // inputValue: '',
        warning: ''
      })
    },
    // 删除输入框
    deInput (index) {
      this.inputList.splice(index, 1)
    },
    inputLabelChange (index) {
      // this.inputList[index].value = ''
      this.inputList[index].warning = ''
    },
    // 表单验证
    formValidate () {
      this.inputList.forEach(item => {
        if (item.inputLabel === '身份证' || item.inputLabel === 'entity_identity_card_type') {
          let reg = /^[A-Z0-9]+$/
          if (!reg.test(item.value)) item.warning = '请输入18位由数字或大写字母组成的身份证号'
          else if (item.value.length !== 18)
            item.warning = '请输入18位由数字或大写字母组成的身份证号'
          else item.warning = ''
        } else if (item.inputLabel === 'entity_phone_card' && item.value.length !== 11) {
          item.warning = '请输入11位由纯数字组成的手机号'
        } else if (item.inputLabel === 'entity_car' && item.value === '') {
          item.warning = '填写不能为空'
        } else if (item.inputLabel === 'entity_assets_house' && item.value === '') {
          item.warning = '填写不能为空'
        } else if (item.inputLabel === 'entity_hk_permit_type') {
          let reg = /^[A-Z0-9]+$/
          if (!reg.test(item.value)) item.warning = '请输入9位由数字或大写字母组成的港澳通行证号'
          else if (item.value.length !== 9)
            item.warning = '请输入9位由数字或大写字母组成的港澳通行证号'
          else item.warning = ''
        } else if (item.inputLabel === 'entity_passport_type') {
          let reg = /^[A-Z0-9]+$/
          if (!reg.test(item.value)) item.warning = '请输入9位由数字或大写字母组成的护照号'
          else if (item.value.length !== 9) item.warning = '请输入9位由数字或大写字母组成的护照号'
          else item.warning = ''
        } else item.warning = ''
      })
      this.$forceUpdate()
    },
    submitHandleBtn () {
      this.times = 0
      // console.log(this.inputList)
      // this.$nextTick(() => {
      this.formValidate()
      // console.log(this.inputList)
      let next = true
      this.handleClose()
      this.inputList.forEach(item => {
        // console.log(item)
        if (item.warning) {
          next = false
        }
      })
      // console.log('是否下一步', next,this.inputList)
      if (next) {
        this.inputList.map(item => {
          delete item.warning
        })
        this.deduce_condition_list = JSON.parse(JSON.stringify(this.inputList))
        this.deduce_condition_list.forEach(item => {
          if (item.inputLabel === '身份证') {
            item.attr_type = 'entity_identity_card_type'
          } else {
            item.attr_type = item.inputLabel
          }
          delete item.inputLabel
        })
        // 这里把上一次的echarts的状态清空
        //
        this.getChartData(this.deduce_condition_list)
      }
      // })
    },
    // 发送请求  只有一个条件的情况下
    // eslint-disable-next-line
    async handleSingleReq(list) {
      // console.log(list)
      let res = await getDeductionSingle({ deduce_condition_list: list })
      if (res.vertex.length) {
        return res
      }
    },
    // 发送请求  多个条件情况下
    async handleMultiReq (list) {
      let res = await getDeductionMulti({ deduce_condition_list: list })
      // console.log(res)
      if (res.vertex.length) {
        return res
      } else {
        return await this.handleSingleReq(list)
      }
    },
    async getChartData (list) {
      this.isSubmiting = true
      let temp = []
      let tempArr = () => {
        this.inputList.forEach(item => {
          let check = temp.every(e => {
            return JSON.stringify(item) !== JSON.stringify(e)
          })
          check ? temp.push(item) : ''
        })
        return temp
      }
      // console.log(tempArr().length) // 数据条件去重后的个数
      let res
      if (tempArr().length === 1) {
        // console.log('单个')
        res = await this.handleSingleReq(list)
      } else {
        // console.log('多个')
        res = await this.handleMultiReq(list)
      }
      // console.log(res.vertex)
      const { vertex, edge } = res
      // 发请求去请求边的次数数据relationEdgeRank
      // edge.forEach((item)=>{
      //   relationEdgeRank(item).then((res)=>{
      //     item.rank = res.rank
      //   }).finally(()=>{
      //     this.copyChartsList = [vertex, edge]
      //     this.chartsList = JSON.parse(JSON.stringify(this.copyChartsList))
      //   })
      // })
      // 第一次请求也要把所有的边数据量请求回来再渲染，不然会突然闪一下
      let alledge = await this.handleEdge(edge)

      this.copyChartsList = [vertex, alledge]
      this.chartsList = JSON.parse(JSON.stringify(this.copyChartsList))
      // this.isShow = false
      this.$nextTick(() => {
        this.isShow = true
        this.isSubmiting = false
      })
    },
    // 双击实体
    handleDbClick (params) {
      // 如果是双击的线
      this.bigListNode = null
      this.searchKey = ''
      this.expandIndexList = []
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
      } else if (params.cer_type === 'attr_identity_card_type' || params.type === 'entity_person') {
        tempList.push({
          value: params.cer_number,
          attr_type: 'entity_identity_card_type'
        })
      } else if (params.type === 'entity_network_account') {
        tempList.push({
          value: params.app_type + '-' + params.main_prop_val,
          attr_type: 'entity_network_account'
        })
      } else {
        tempList.push({
          value: params.main_prop_val,
          attr_type: params.type
        })
      }
      // console.log(this.$refs.charts.myChart.hideLoading());
      getDeductionSingle({ deduce_condition_list: tempList })
        .then(async res => {
          // console.log(res)
          if (!res.edge.length || !res.vertex.length) {
            // console.log(res)
            this.$refs.charts.myChart.hideLoading()
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
            // 双击后有新的数据才更新图谱
            if (!noNewVertex || !noNewEdge) {
              this.newNodeArr = res.vertex.filter(
                item => !this.copyChartsList[0].some(ele => ele.vid === item.vid)
              )
              this.newRelationArr = res.edge.filter(
                item => !this.copyChartsList[1].some(ele => ele.vid === item.vid)
              )
              // 新增的节点超过多少个，代表为大数据量，大数据走大数据的
              if (this.newNodeArr.length >= 10) {
                this.bigListNode = params
                // 这里进行数据的清洗以及分类
                this.newNodeObj = this.formatNodeData(this.newNodeArr, this.newRelationArr)
                console.log(this.newNodeObj)
                this.copyNewNodeObj = JSON.parse(JSON.stringify(this.newNodeObj))
                this.$refs.charts.myChart.hideLoading()
              } else {
                // 这里处理小数据的
                let edge = await this.handleEdge(res.edge)
                res.edge = edge
                this.copyChartsList[0] = this.copyChartsList[0].concat(res.vertex)
                this.copyChartsList[1] = this.copyChartsList[1].concat(res.edge)
                this.chartsList = JSON.parse(JSON.stringify(this.copyChartsList))
                this.$refs.charts.myChart.hideLoading()
                this.isShow = false
                this.$nextTick(() => {
                  this.isShow = true
                })
              }
            } else {
              this.$refs.charts.myChart.hideLoading()
              this.$messageTip.info('该实体无可更新数据')
            }
          }
        })
        .catch(() => {
          this.$refs.charts.myChart.hideLoading()
        })
      // }
    },
    // 过滤重复数据，分类剩余数据
    formatNodeData (newNodeArr, newRelationArr) {
      let obj = {}
      newRelationArr.forEach(item => {
        let key = this.bigListNode.vid === item.src ? item.dst : item.src
        if (obj[item.data_source]) {
          newNodeArr.forEach(item2 => {
            if (item2.vid === key) {
              obj[item.data_source].push(item2)
            }
          })
        } else {
          let arr2 = newNodeArr.filter(item2 => {
            return item2.vid === key
          })
          if (arr2.length) {
            obj[item.data_source] = arr2
          }
        }
      })
      return obj
    },
    searchEvent () {
      this.expandIndexList = []
      this.newNodeObj = JSON.parse(JSON.stringify(this.copyNewNodeObj))
      const special = Object.keys(this.personTypeObj)
      for (const key in this.newNodeObj) {
        this.newNodeObj[key] = this.newNodeObj[key].filter(item => {
          return (
            item.main_prop_val.includes(this.searchKey) ||
            this.iconObj[item.type]['entity_name_cn'].includes(this.searchKey) ||
            item.cer_number?.includes(this.searchKey) ||
            (special.includes(item.cer_type) && this.personTypeObj[item.cer_type].includes(this.searchKey))
          )
        })
        if (!this.newNodeObj[key].length) {
          delete this.newNodeObj[key]
        }
      }
      // console.log(JSON.stringify(this.newNodeObj) )
      this.showSearchData = JSON.stringify(this.newNodeObj) === '{}'
    },
    handlePackup (index) {
      let itemIndex = this.expandIndexList.indexOf(index)
      if (itemIndex !== -1) {
        this.expandIndexList.splice(itemIndex, 1)
      } else {
        this.expandIndexList.push(index)
      }
    },
    hasNode (item) {
      const itemIndex = this.copyChartsList[0].findIndex(ele => {
        return ele.vid === item.vid
      })
      return itemIndex === -1
    },
    async toShowNode (item) {
      const itemIndex = this.copyChartsList[0].findIndex(ele => {
        return ele.vid === item.vid
      })
      // 关系
      const edge = this.newRelationArr.filter(ele => {
        return ele.src === item.vid || ele.dst === item.vid
      })
      if (itemIndex === -1) {
        // 没有的话，就直接把这个实体加入进去
        // 先去请求正确的边的数量
        let rightNumberEdge = await this.handleEdge(edge)
        this.copyChartsList[0] = this.copyChartsList[0].concat(item)
        this.copyChartsList[1] = this.copyChartsList[1].concat(rightNumberEdge)
        // console.log('toShowNode', item)
        // this.toShowNodeObj = item
      } else {
        this.copyChartsList[0].splice(itemIndex, 1)
        // this.toShowNodeObj = item
      }
      this.toShowNodeObj = item
      this.$refs.charts.clickListNode(item)
      this.chartsList = JSON.parse(JSON.stringify(this.copyChartsList))
      // console.log(this.chartsList)
    },
    handleEdge (list) {
      return new Promise(resolve => {
        relationEdgeRank({ edge_data_list: list }).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .input-box {
    margin-bottom: 30px;
  }
  .add {
    margin-top: 40px;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .input-box {
    margin-bottom: 18px;
  }
  .add {
    margin-top: 22px;
  }
}
@media screen and (min-width: 1920px) {
  .input-box {
    margin-bottom: 16px;
  }
  .add {
    margin-top: 22px;
  }
}
.deduction-wrapper {
  background: var(--bg-color-3);
  min-height: calc(100vh - 100px);
  /deep/.DrawerWrapper {
    height: calc(100vh - 140px) !important;
  }
  .main-content {
    .title-box {
      margin-bottom: 16px;
      font-size: 16px;
      // color: #c0d0e7;
      color: var(--base-text-color-1);
      font-weight: bold;
    }
    .form-box {
      .input-box {
        position: relative;
        // margin-bottom: 24px;
        display: flex;
        align-items: center;
        /deep/.el-input .el-input--suffix .el-input__inner {
          // 设置label内容样式
          border: 0 !important;
          color: var(--base-text-color-to-999999) !important;
          line-height: 7 !important;
          font-size: 16px !important;
        }
        /deep/.el-input-group .el-input__inner {
          align-self: center !important;
          border: 0 !important;
          // color: var(--input-placehold-color) !important;
          color: var(--base-text-color-to-999999) !important;
          font-size: 16px !important;
        }
        /deep/.el-input .el-input--suffix {
          width: 125px;
          border-right: 0;
        }
        /deep/.el-input-group--prepend {
          // 输入框
          width: 368px !important;
          box-sizing: border-box !important;
          // border: 1px solid rgba(81, 92, 124, 0.4) !important;
          border: 1px solid var(--border-color-input) !important;
          border-radius: 2px !important;
          line-height: 16px !important;
          .el-input__inner::-webkit-input-placeholder {
            // 设置value placeholder样式
            font-size: 16px !important;
            color: var(--input-placehold-color) !important;
          }
        }
        /deep/ .el-input--suffix .el-input__inner::-webkit-input-placeholder {
          // 设置label placeholder样式
          color: var(--base-text-color-to-999999) !important;
          font-size: 16px !important;
        }
        /deep/.el-scrollbar .el-scrollbar__wrap {
          border: none !important;
          background-color: #232a42 !important;
        }
        /deep/.el-icon-arrow-up:before {
          color: var(--base-text-color-to-999999) !important;
        }
        .de {
          cursor: pointer;
          margin-left: 8px;
          color: #3d6eff;
          i {
            font-size: 16px;
          }
        }
        .warning {
          position: absolute;
          top: 44px;
          color: #f56c6c;
          font-size: 5px !important;
        }
      }
      .input-box-warning {
        /deep/.el-input-group--prepend {
          // 输入框
          border: 1px solid #f56c6c !important;
          width: 368px !important;
          box-sizing: border-box !important;
          border-radius: 2px !important;
          line-height: 16px !important;
          .el-input__inner::-webkit-input-placeholder {
            // 设置value placeholder样式
            font-size: 16px !important;
            color: var(--input-placehold-color) !important;
          }
        }
      }
      .add {
        display: flex;
        align-items: center;
        // margin-top: 19px;
        cursor: pointer;
        color: #3d6eff;
        i {
          font-size: 16px;
        }
        .label {
          margin-left: 3px;
          font-size: 14px;
        }
      }
      .add-disable {
        color: #434b5f;
      }
    }
    .btn {
      margin-top: 20px;
      float: right;
    }
  }
  /deep/.DrawerWrapper {
    // background: #192035;
    // background: var(--bg-color-2);
    background: var(--car-right-chuangkou-hearder-bg);
    box-shadow: var(--box-shadow);
  }
  /deep/.DrawerContainer .icon-con {
    // background: #192035;
    // background: var(--bg-color-2);
    background: var(--car-right-chuangkou-hearder-bg);
    box-shadow: 1px -1px 12px 0px rgba(1, 47, 142, 0.08);
  }

  .relate-box {
    height: calc(100vh - 100px);
    flex: 1;
    &-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 100px);
      // height: 100%;
      text-align: center;
      .empty-text {
        margin-top: 8px;
        font-size: 16px;
        color: var(--base-text-color-to-999999);
      }
    }
    &-inner {
      height: 100%;
      overflow: hidden;
    }
    // .relate-box-inner {
    //   padding-left: 450px;
    // }
  }
  .big_data_pop {
    box-sizing: border-box;
    padding: 16px 0;
    height: calc(100% - 80px);
    position: absolute;
    width: 424px;
    background-color: var(--bg-color-7);
    right: 56px;
    top: 24px;
    box-shadow: 1px -1px 12px 0px rgba(1, 47, 142, 0.08);
    .title {
      padding: 0 16px;
      height: 36px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #3d6eff;
      .name {
        padding-left: 14px;
        display: flex;
        align-items: center;
        background-image: url('~@/assets/img/set-bg.png');
        background-repeat: no-repeat;
        background-position: left 80%;
        img {
          width: 24px;
          height: 24px;
        }
      }

      .close_btn {
        i {
          cursor: pointer;
          font-size: 24px;
        }
      }
    }
    .input_box {
      padding: 0 16px;
      margin-top: 10px;
      ::v-deep .el-input {
        .el-input__inner {
          border-top: none;
          border-left: none;
          border-right: none;
        }
      }
    }
    .main_list {
      padding: 0 16px;
      height: calc(100% - 75px);
      overflow: scroll;
      .no_data {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .data_item_box {
        margin-top: 24px;
        .all {
          cursor: pointer;
        }

        .list_name {
          .item_name {
            padding-left: 20px;
            margin: 12px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .text {
              color: var(--base-text-color-1);
            }
            i {
              cursor: pointer;
            }
            .el-icon-view {
              font-size: 16px;
              color: var(--active-color);
            }
            .icon-yincang {
              font-size: 15px;
              color: var(--active-color);
            }
          }
        }
      }
    }
  }
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}
/deep/.chart {
  /* height: 100%; */
  height: calc(100vh - 100px);
  user-select: text !important;
}
</style>
