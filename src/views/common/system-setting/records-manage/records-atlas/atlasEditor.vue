<template>
<div class='atlas_editor_wrap'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='cancelOpera'></OperaHeader>
  <div
    class='wrap_content'
    v-loading="loading"
    :element-loading-text="loadText"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$themeColor('--loading-color-1')"
  >
    <div class='my_charts'>
      <div v-if='typeOptions.length' id='atlasChart' class='atlas_chart'></div>
      <div v-else class='empty'>该数据无实体，不可配置图谱关系</div>
    </div>
    <div class='editor_wrap'>
      <div class='editor_header'>
        <div class='header_item'>
          <div class='label'>节点类型：</div>
          <el-select v-model="nodeInfo.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.entityName"
              :value="item.id"
              @click.native='changeEntity(item)'
            >
            </el-option>
          </el-select>
        </div>
        <div class='header_item'>
          <div class='label'>图标：</div>
          <el-select
            v-model='nodeInfo.icon'
            popper-class='atlas_icon'
            placeholder="请选择"
            @visible-change='hiddenDown'
          >
            <div class='options'>
              <el-option
                v-for='item in iconOptions'
                :key='item.id'
                :label='" "'
                :value='item.id + ""'>
                <img :src='origin + item.iconPath' alt=''>
                <div v-show='showDelIcon' class='del' @click.stop='removeIcon(item)'>
                  <i class='iconfont icon-qingchu' v-if='item.editableFlag'></i>
                </div>
              </el-option>
            </div>
            <div class='opera'>
              <i class='iconfont icon-a-zu4982' @click='importIcon'></i>
              <i class='iconfont icon-delete' @click='delIcon' :class='{ "disabled": !canDeleteIcon}'></i>
              <el-upload
                :action="'#'"
                :http-request="uploadRequest"
                accept='.png,.jpg,.webp'
                :multiple="false"
                :auto-upload="true"
                :on-error="unError"
                :show-file-list="false">
                <div id='upload'>
                </div>
              </el-upload>
            </div>
            <img v-if='nodeInfo.icon && iconObj[nodeInfo.icon]' :src='origin + iconObj[nodeInfo.icon]' alt='' slot='prefix'>
          </el-select>
        </div>
      </div>
      <div class='editor_content'>
        <el-form ref='form' :model="labelObj" label-position='left' :label-width="getWidth()">
          <div class='only_item' v-for='item in currentEntity.only' :key='item.id'>
            <el-form-item :label="item.labelName  + '：'" :prop='item.id + ""' :rules="{required: true, message: `${item.labelName}不能为空`, trigger: 'change'}">
              <el-select v-model="labelObj[item.id]" placeholder="请选择" clearable>
                <el-option v-for='attr in item.srcFieldManages' :key='attr.id' :label="attr.fieldNameCn" :value="attr.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-show='nodeInfo.type && currentEntity.others.length'>
            <div class='other_attr_btn'>
              <div class='btn' @click='handleOther'>
                <i class='iconfont' :class='[showOtherAttr ? "icon-tongyong-Icontubiao-Line-left" : "icon-xiala"]'></i>
                <span>{{ showOtherAttr ? '收起' : '展开' }}</span>
              </div>
            </div>
            <div class='other_attr' v-show='showOtherAttr'>
              <el-form-item v-for='item in currentEntity.others' :key='item.id' :label="item.labelName  + '：'">
                <el-select v-model="labelObj[item.id]" placeholder="请选择" clearable>
                  <el-option v-for='attr in item.srcFieldManages' :key='attr.id' :label="attr.fieldNameCn" :value="attr.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class='add_relation' :class='{ "disabled": !canAddRelation }'>
          <span @click='addRelation'>
            <i class='iconfont icon-tianjia'></i>
            <span>添加关系</span>
          </span>
        </div>
        <div class='relation_wrap'>
          <div class='relation' v-for='(item, index) in relationList' :key='index'>
            <div class='select_wrap'>
              <el-select :ref='`left${index}`' v-model="item.leftNode" placeholder="请选择" @focus='reFocus(item, "right")' @visible-change='(bool) => handleChange(bool, item, "right")'>
                <el-option
                  v-for='(attr, key) in (nodeInfo.parentId ? reParentList : reEntityList)'
                  :key='key'
                  :label="attr.entityName"
                  :value="attr.id"
                  :disabled='attr.isDisabled'
                  @click.native='relAttrClick("left", item, attr, index)'
                >
                  <div class='re_option'>
                    <span>{{ attr.entityName }}</span>
                    <div class='is_current' v-if='attr.id === currentEntityId'>
                      <i class='iconfont icon-a-zu5053'></i>
                      <span>新</span>
                    </div>
                  </div>
                </el-option>
              </el-select>
              <div class='division' :class='{ "to_left": !item.toRight }'>
                <div class='relation_choice'>
                  <el-select v-show='item.showRelation' v-model="item.relation" placeholder="请选择">
                    <el-option v-for='attr in reOptions' :key='attr.id' :label="attr.relationshipName" :value="attr.id" @click.native='choiceRelation(item, attr)'></el-option>
                  </el-select>
                  <el-select v-show='item.showRelation && item.showRelationOp' v-model="item.relationAbo" placeholder="请选择">
                    <el-option v-for='attr in reItemOptions' :key='attr.id' :label="attr.fieldNameCn" :value="attr.id"></el-option>
                  </el-select>
                </div>
              </div>
              <el-select :ref='`right${index}`' v-model="item.rightNode" placeholder="请选择" @focus='reFocus(item, "left")' @visible-change='(bool) => handleChange(bool, item, "left")'>
                <el-option
                  v-for='(attr, key) in (nodeInfo.parentId ? { "current": reAttrList[currentEntityId] } : reEntityList)'
                  :key='key'
                  :label="attr.entityName"
                  :value="attr.id"
                  :disabled='attr.isDisabled'
                  @click.native='relAttrClick("right", item, attr, index)'
                >
                  <div class='re_option'>
                    <span>{{ attr.entityName }}</span>
                    <div class='is_current' v-if='attr.id === currentEntityId'>
                      <i class='iconfont icon-a-zu5053'></i>
                      <span>新</span>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </div>
            <div class='relation_opera'>
              <i class='iconfont icon-a-zu4936' @click='handleReWay(item)' :class='{ "disabled": nodeInfo.parentId || item.noChangeWay }'></i>
              <i class='iconfont icon-shanchu' @click='delRelation(item, index)'></i>
            </div>
          </div>
        </div>
      </div>
      <div class='editor_floor'>
        <div class='blank_button' :class='{"is-disabled": !this.choiceEntity}' @click='delEntity'>删除</div>
        <div class='division'></div>
        <div class='blank_button' @click='cancelOpera'>取消</div>
        <el-button type="primary" @click='submit' :disabled='!nodeInfo.type && !nodeInfo.icon && !currentEntity.only.length'>确定</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import {
  getAtlasIconApi,
  atlasIconUpload,
  delAtlasIcon,
  getAtlasDataApi,
  getAtlasEntityApi,
  getAtlasEntityAttr,
  addAtlasEntity,
  getRelationApi,
  // delAtlasEntityAttr,
  delAtlasEntity,
  // delAtlasRelation
} from '@/api/sysSetting'
import { chartOption } from './chartConfig'
import * as echarts from 'echarts'

export default {
  name: 'AtlasEditor',
  components: {
    OperaHeader
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: true,
      loadText: '数据加载中',
      breadcrumbList: [
        { tabName: '数据图谱', canOpera: true }
      ],
      nodeInfo: {
        type: '',
        icon: '',
        parentId: null
      },
      typeOptions: [],
      entityAttr: {}, // 全部实体对应的属性字段
      iconOptions: [],
      iconObj: {}, // 图标id对应的图片地址
      relationList: [], // 编辑时，关系列表
      showDelIcon: false,
      showOtherAttr: false,
      currentEntity: {
        only: [],
        others: []
      }, // 编辑时，当前实体属性对应可选的字段
      labelObj: {}, // 编辑时，实体对应的属性值
      dataEntity: [], // 当前实体数据
      reAttrList: {}, // 添加关系时可选的实体
      reOptions: [], // 可选择的关系
      reItemOptions: [], // 添加关系中，关系关联的可选字段
      chartsData: [],
      chartsLinks: [],
      chartsCategories: [],
      myChart: null,
      currentEntityId: '', // 当前编辑实体的id
      choiceEntity: null, // 点击图谱实体时，实体的id
      entityToIcon: {},
      successIcon: false,
      delRelList: [],
      mountLoadStop: 0,
      submitLoadStop: 0,
      successEntity: false,
      reParentList: {}
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    // 添加关系按钮是否可以点击
    canAddRelation () {
      // let list = this.currentEntity.only.map(item => item.id)
      // let num = 0
      // list.forEach(item => {
      //   if (this.labelObj[item]) {
      //     num += 1
      //   }
      // })
      // return this.nodeInfo.type && list.length > 0 && num === list.length && this.dataEntity.length >= 1
      if (this.nodeInfo.parentId) {
        return this.nodeInfo.type && Object.keys(this.reParentList).length
      } else {
        return this.nodeInfo.type && Object.keys(this.reEntityList).length > 1
      }
    },
    canDeleteIcon () {
      return this.iconOptions.some(item => item.editableFlag)
    },
    reEntityList () {
      if (this.nodeInfo.type && !this.nodeInfo.parentId) {
        let obj = {}
        for (let key in this.reAttrList) {
          if (this.reAttrList[key]['parentId']) {
            if (+this.reAttrList[key]['parentId'] === +this.nodeInfo.type) {
              obj[key] = this.reAttrList[key]
            }
          } else {
            obj[key] = this.reAttrList[key]
          }
        }
        return obj
      } else {
        return this.reAttrList
      }
    },
    currentChildEntity () {
      if (this.nodeInfo.type && !this.nodeInfo.parentId) {
        let list = []
        for (let key in this.reEntityList) {
          if (this.reEntityList[key]['parentId']) {
            if (+this.reEntityList[key]['parentId'] === +this.nodeInfo.type) {
              list.push(this.reEntityList[key].id)
            }
          }
        }
        return list
      } else {
        return []
      }
    }
  },
  watch: {
    submitLoadStop: {
      handler (newVal) {
        if (newVal === 2) {
          this.loading = false
          this.submitLoadStop = 0
        }
      }
    },
    'nodeInfo.parentId': {
      handler (newVal) {
        if (newVal) {
          let obj = {}
          for (let key in this.reAttrList) {
            if (this.reAttrList[key].entityId === this.nodeInfo.parentId) {
              obj[key] = this.reAttrList[key]
            }
          }
          this.reParentList = obj
        } else {
          this.reParentList = {}
        }
      }
    }
  },
  created () {
    this.breadcrumbList = [
      ...this.breadcrumbList,
      ...[
        { tabName: this.row.srcNameCn || '' },
        { tabName: '编辑' }
      ]
    ]
  },
  mounted () {
    this.getAtlasIcon(true)
    this.getRelation()
    if (this.row.id) {
      const unWatch = this.$watch('successIcon', () => {
        this.getAtlasData(this.row.id, true)
        unWatch()
      })
      const unGetEntity = this.$watch('successEntity', () => {
        const unMountLoad = this.$watch('mountLoadStop', (newVal) => {
          if (newVal === this.typeOptions.length + 4) {
            this.loading = false
            this.loadText = '提交中'
            unMountLoad()
          }
        })
        unGetEntity()
      })
      this.getAtlasEntity(this.row.id)
      this.reItemOptions = this.row.fileRules || []
    }
    this.bus.$on('theme', this.changeTheme)
  },
  methods: {
    changeTheme () {
      if (this.myChart) {
        let {
          tooltip,
          legend,
          series
        } = this.myChart.getOption()
        legend[0].textStyle.color = this.$themeColor('--base-text-color-to-666666')
        tooltip[0].backgroundColor = this.$themeColor('--tooltip-bg-262D44-to-f6f8fd')
        tooltip[0].textStyle.color = this.$themeColor('--base-text-color-to-666666')
        series[0].lineStyle.color = this.$themeColor('--base-text-color-to-999999')
        series[0].label.color = this.$themeColor('--base-text-color-1')
        series[0].edgeLabel.color = this.$themeColor('--base-text-color-to-666666')
        const option = { ...this.myChart.getOption(), tooltip, legend, series }
        this.myChart.setOption(option)
      }
    },
    getWidth (){
      return document.body.clientWidth > 1300 ? '86px' : '66px'
    },
    handleReWay (item) {
      if (this.nodeInfo.parentId || item.noChangeWay) return
      item.toRight = !item.toRight
    },
    getRelation () {
      getRelationApi().then(res => {
        this.reOptions = res || []
      }).finally(() => {
        this.mountLoadStop += 1
      })
    },
    getAtlasEntity (id) {
      getAtlasEntityApi({
        srcId: id
      }).then(res => {
        this.typeOptions = res || []
        this.mountLoadStop += 1
        this.successEntity = true
        this.typeOptions.forEach(item => {
          getAtlasEntityAttr({
            entityId: item.id,
            srcId: id
          }).then(result => {
            let endResult = result || []
            this.entityAttr[item.id] = {
              only: [],
              others: []
            }
            endResult.forEach(attr => {
              if (attr.mainLabel) {
                this.entityAttr[item.id]['only'].push(attr)
              } else {
                this.entityAttr[item.id]['others'].push(attr)
              }
            })
          }).finally(() => {
            this.mountLoadStop += 1
          })
        })
      }).catch(() => {
        this.mountLoadStop += 1
        this.successEntity = true
      })
    },
    changeEntity (data, fromChart = false) {
      this.labelObj = {}
      this.showOtherAttr = false
      this.currentEntityId = ''
      this.relationList = []
      if (!fromChart) {
        this.choiceEntity = null
      }
      if (this.entityToIcon[this.nodeInfo.type] && this.iconObj[this.entityToIcon[this.nodeInfo.type] + '']) {
        this.nodeInfo.icon = this.entityToIcon[this.nodeInfo.type] + ''
      } else {
        this.nodeInfo.icon = ''
      }
      this.nodeInfo.parentId = data.fatherEntityId || data.parentId || null
      if (this.entityAttr[this.nodeInfo.type]) {
        let result = this.entityAttr[this.nodeInfo.type]
        result.only.forEach(item => {
          this.$set(this.labelObj, item.id, '')
        })
        result.others.forEach(item => {
          this.$set(this.labelObj, item.id, '')
        })
        this.currentEntity = result
      } else {
        this.currentEntity = {
          only: [],
          others: []
        }
      }
      if (!this.choiceEntity) {
        let index = this.typeOptions.findIndex(item => +item.id === +this.nodeInfo.type)
        if (index > -1) {
          this.$set(this.reAttrList, 'current', {
            id: 'current',
            entityId: this.nodeInfo.type,
            entityName: this.typeOptions[index].entityName,
            isDisabled: false
          })
          this.currentEntityId = 'current'
        }
      }
    },
    // 获取图标
    getAtlasIcon (isFromMount = false, updateChart = false) {
      this.iconOptions = []
      this.iconObj = {}
      getAtlasIconApi().then(res => {
        this.iconOptions = res || []
        this.iconOptions.forEach(item => {
          // item['iconPath'] = item['iconPath'].replace('/var/filecenter', '')
          this.iconObj[item.id + ''] = item.iconPath
        })
        if (updateChart) {
          this.myChart = null
          this.initCharts()
        }
      }).finally(() => {
        if (!isFromMount) {
          this.submitLoadStop += 1
        }
        this.mountLoadStop += 1
        this.successIcon = true
        if (!this.canDeleteIcon) {
          this.showDelIcon = false
        }
      })
    },
    // 点击导入图标按钮的时候
    importIcon () {
      document.getElementById('upload').click()
    },
    // 删除图标
    removeIcon (item) {
      if (!item.editableFlag) return
      this.loading = true
      delAtlasIcon({
        id: item.id
      }).then(() => {
        this.$message.success('删除成功！')
        if (this.nodeInfo.icon === item.id) {
          this.nodeInfo.icon = ''
        }
        let entityId = null
        for (let key in this.entityToIcon) {
          if (+this.entityToIcon[key] === item.id) {
            entityId = +key
            delete this.entityToIcon[key]
          }
        }
        if (entityId) {
          this.chartsData.forEach(item => {
            if (item.entityId === entityId) {
              item.symbol = 'image://' + require(`@/assets/img/atlis-default.png`)
            }
          })
        }
        this.submitLoadStop += 1
        this.getAtlasIcon(false, true)
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取已有实体的数据
    getAtlasData (id, isFromMount = false) {
      this.myChart = null
      this.dataEntity = []
      this.chartsData = []
      this.chartsCategories = []
      this.chartsLinks = []
      getAtlasDataApi({
        srcId: id
      }).then(res => {
        this.dataEntity = res || []
        this.dataEntity.forEach(item => {
          let categoryInd = this.chartsCategories.findIndex(category => category.id === item.entityId)
          if (categoryInd === -1) {
            this.chartsCategories.push({
              name: item.entityName,
              id: item.entityId
            })
          }
        })
        this.dataEntity.forEach(item => {
          let onlyLabelItem = null
          let onlyLabelName = null
          item.graphEntityLabelMappings && (onlyLabelItem = item.graphEntityLabelMappings.find(onlyLabel => onlyLabel.mainLabel))
          onlyLabelItem && onlyLabelItem.srcFieldManage && (onlyLabelName = onlyLabelItem.srcFieldManage.fieldNameCn)
          this.$set(this.reAttrList, item.id, {
            id: item.id,
            entityId: item.entityId,
            entityName: onlyLabelName ? `${item.entityName}（${onlyLabelName}）` : item.entityName,
            isDisabled: false,
            parentId: item.fatherEntityId || null
          })
          if (!this.entityToIcon[item.entityId]) {
            this.entityToIcon[item.entityId] = item.iconId
          }
          let symbol = this.iconObj[this.entityToIcon[item.entityId + '']] ? this.origin + this.iconObj[this.entityToIcon[item.entityId + '']] : require(`@/assets/img/atlis-default.png`)
          this.chartsData.push({
            id: item.id + '',
            name: item.id,
            category: this.chartsCategories.findIndex(category => category.name === item.entityName),
            symbolSize: 38,
            symbol: 'image://' + symbol,
            entityId: item.entityId,
            entityName: item.entityName,
            labelList: item.graphEntityLabelMappings || [],
            relationList: item.graphRelationshipMappings || [],
            parentId: item.fatherEntityId || null
          })
          if (item.graphRelationshipMappings) {
            item.graphRelationshipMappings.forEach(relation => {
              this.chartsLinks.push({
                source: relation.startEntityMappingId + '',
                target: relation.endEntityMappingId + '',
                ...relation
              })
            })
          }
        })
        this.initCharts()
      }).finally(() => {
        if (!isFromMount) {
          this.submitLoadStop += 1
        }
        this.mountLoadStop += 1
      })
    },
    initCharts () {
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('atlasChart'))
        this.myChart.on('click', params => {
          if (params.dataType === 'node') {
            this.nodeInfo = {
              type: params.data.entityId,
              icon: '',
              parentId: params.data.parentId || null
            }
            this.labelObj = {}
            this.relationList = []
            this.currentEntityId = ''
            if ('current' in this.reAttrList) {
              delete this.reAttrList['current']
            }
            this.choiceEntity = params.data
            this.changeEntity(params.data, true)
            params.data.labelList.forEach(item => {
              this.labelObj[item.entityLabelId] = item.srcFieldId
            })
            params.data.relationList.forEach(item => {
              this.relationList.push(
                {
                  leftNode: item.startEntityMappingId || '',
                  rightNode: item.endEntityMappingId || '',
                  toRight: true,
                  relation: item.relationshipId || '',
                  relationAbo: item.srcFieldId || '',
                  showRelation: item.relationshipId || false,
                  showRelationOp: item.srcFieldId || false,
                  id: item.id,
                  noChangeWay: this.currentChildEntity.includes(item.endEntityMappingId)
                }
              )
            })
            this.currentEntityId = params.data.name
            this.delRelList = []
          }
        })
        this.myChart.getZr().on('click', params => {
          if (!params.target && this.choiceEntity) {
            this.nodeInfo = {
              type: '',
              icon: '',
              parentId: null
            }
            this.relationList = []
            this.showOtherAttr = false
            this.currentEntity = {
              only: [],
              others: []
            }
            this.labelObj = {}
            this.choiceEntity = null
            this.currentEntityId = ''
            this.delRelList = []
          }
        })
        this.myChart.on('mouseover', (params) => {
          if (params.dataType === 'node') {
            let { tooltip } = this.myChart.getOption()
            if (params.data.labelList.length) {
              tooltip[0].show = true
            } else {
              tooltip[0].show = false
            }
            const option = { ...this.myChart.getOption(), tooltip }
            this.myChart.setOption(option)
          }
        })

        let option = chartOption
        option.series[0].categories = this.chartsCategories
        option.series[0].links = this.chartsLinks
        option.series[0].data = this.chartsData
        option.legend[0].data = this.chartsCategories.map(item => {
          let icon = this.iconObj[this.entityToIcon[item.id]] ? this.origin + this.iconObj[this.entityToIcon[item.id]] : require(`@/assets/img/atlis-default.png`)
          return {
            name: item.name,
            icon: 'image://' + icon
          }
        })
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option)
      }
    },
    // 上传图标
    uploadRequest (file) {
      let uploadFile = new FormData()
      uploadFile.append('file', file.file)
      this.loading = true
      atlasIconUpload(uploadFile).then(() => {
        this.submitLoadStop += 1
        this.getAtlasIcon()
      }).catch(() => {
        this.loading = false
      })
    },
    // 图标上传失败
    unError (fileList) {
      this.$message.error(fileList[0].msg)
    },
    // 页面头部点击返回的时候
    cancelOpera () {
      this.$emit("toList", "list", {})
    },
    // 点击删除按钮图标的时候
    delIcon () {
      if (!this.canDeleteIcon) return
      this.showDelIcon = !this.showDelIcon
    },
    // 图标下拉框隐藏的时候
    hiddenDown (bool) {
      if (!bool) {
        this.showDelIcon = false
      }
    },
    handleOther () {
      this.showOtherAttr = !this.showOtherAttr
    },
    addRelation () {
      if (!this.canAddRelation) return
      this.relationList.push(
        {
          leftNode: '',
          rightNode: '',
          toRight: true,
          relation: '',
          relationAbo: '',
          showRelation: false,
          showRelationOp: false
        }
      )
    },
    delRelation (item, index) {
      this.$policeComfirm('确定删除该实体关系吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (this.choiceEntity && item.id) {
          this.delRelList.push({
            startEntityMappingId: item.leftNode,
            endEntityMappingId: item.rightNode,
            relationshipId: item.relation,
            srcFieldId: item.relationAbo,
            id: item.id,
            deleteFlag: true
          })
        }
        this.relationList.splice(index, 1)
      })
    },
    relAttrClick (way, item, attr, ind) {
      if (attr.isDisabled) return
      let other = way === 'left' ? 'right' : 'left'
      if (item[`${way}Node`] !== this.currentEntityId && this.currentEntityId) {
        item[`${other}Node`] = this.currentEntityId
      }
      if (item.leftNode && item.rightNode) {
        item.showRelation = true
        if (!this.nodeInfo.parentId) {
          if (item.leftNode === this.currentEntityId) {
            if (this.currentChildEntity.includes(item.rightNode)) {
              this.$set(item, 'noChangeWay', true)
              item.toRight = true
            } else {
              this.$set(item, 'noChangeWay', false)
            }
          } else {
            if (this.currentChildEntity.includes(item.leftNode)) {
              this.$set(item, 'noChangeWay', true)
              item.toRight = false
            } else {
              this.$set(item, 'noChangeWay', false)
            }
          }
        }
      }
      if (this.$refs[way + ind]) {
        this.$refs[way + ind][0].blur()
      }
    },
    choiceRelation (item, attr) {
      if (attr.dataStandardId && attr.dataStandardId.length) {
        item.showRelationOp = true
      } else {
        item.showRelationOp = false
        item.relationAbo = ''
      }
    },
    reFocus (item, way) {
      if (item[`${way}Node`]) {
        this.reAttrList[item[`${way}Node`]].isDisabled = true
      }
    },
    handleChange (bool, item, way) {
      if (bool) return
      if (item[`${way}Node`]) {
        this.reAttrList[item[`${way}Node`]].isDisabled = false
      }
    },
    // 删除实体
    delEntity () {
      if (!this.choiceEntity) return
      this.$policeComfirm('确定删除该实体吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        delAtlasEntity({
          id: +this.choiceEntity.id
        }).then(() => {
          this.$message.success('删除成功！')
          this.submitLoadStop += 1
          this.clearData()
          this.getAtlasData(this.row.id)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // let isRepeatFun = (item) => {
          //   if ((this.choiceEntity && +this.choiceEntity.id !== +item.id) || !this.choiceEntity) {
          //     this.$policeComfirm('该实体已存在！', {
          //       haveFloor: false
          //     })
          //     return true
          //   }
          //   return false
          // }
          // for (let ind = 0; ind < this.dataEntity.length; ind++) {
          //   if (this.dataEntity[ind].entityId === +this.nodeInfo.type) {
          //     if (this.currentEntity.only.length) {
          //       let repeatLength = 0
          //       this.currentEntity.only.forEach(current => {
          //         let index = this.dataEntity[ind].graphEntityLabelMappings.findIndex(label => label.entityLabelId === current.id)
          //
          //         if (index > -1) {
          //           if (+this.dataEntity[ind].graphEntityLabelMappings[index].srcFieldId === +this.labelObj[current.id]) repeatLength += 1
          //         }
          //       })
          //       if (repeatLength === this.currentEntity.only.length) {
          //         let result = isRepeatFun(this.dataEntity[ind])
          //         if (result) return
          //       }
          //     } else if (this.currentEntity.others.length) {
          //       let repeatLength = 0
          //       let noLength = 0
          //       let filterList = this.dataEntity[ind].graphEntityLabelMappings.filter(label => !label.mainLabel)
          //       this.currentEntity.others.forEach(current => {
          //         let index = filterList.findIndex(label => label.entityLabelId === current.id)
          //         if (index > -1) {
          //           if (+filterList[index].srcFieldId === +this.labelObj[current.id]) repeatLength += 1
          //         } else {
          //           if (this.labelObj[current.id]) {
          //             noLength += 1
          //           }
          //         }
          //       })
          //       if (repeatLength === filterList.length && !noLength) {
          //         let result = isRepeatFun(this.dataEntity[ind])
          //         if (result) return
          //       }
          //       if (!this.dataEntity[ind].graphEntityLabelMappings.length && !noLength) {
          //         let result = isRepeatFun(this.dataEntity[ind])
          //         if (result) return
          //       }
          //     }
          //   }
          // }
          if (this.relationList.some(item => !item.leftNode || !item.rightNode || !item.relation)) {
            this.$policeComfirm('请将关系信息补充完整！', {
              haveFloor: false
            })
            return
          }
          this.loading = true
          let params = {
            entityId: this.nodeInfo.type,
            srcId: this.row.id,
            iconId: +this.nodeInfo.icon,
            labelList: [],
            relationshipList: []
          }
          let way = 'insert'
          // let delList = []
          if (this.choiceEntity) {
            way = 'update'
            params.id = this.choiceEntity.name

            for (let key in this.labelObj) {
              let obj = {
                entityLabelId: +key,
                srcFieldId: this.labelObj[key]
              }
              let ind = this.choiceEntity.labelList.findIndex(item => +item.entityLabelId === +key)
              if (ind > -1) {
                if (this.choiceEntity.labelList[ind].srcFieldId !== this.labelObj[key]) {
                  if (this.labelObj[key]) {
                    obj.id = this.choiceEntity.labelList[ind].id
                    obj.deleteFlag = false
                  } else {
                    obj.id = this.choiceEntity.labelList[ind].id
                    obj.deleteFlag = true
                    // delList.push(this.choiceEntity.labelList[ind].id)
                  }
                  params.labelList.push(obj)
                }
              } else {
                if (obj['srcFieldId']) {
                  params.labelList.push(obj)
                }
              }
            }
          } else {
            for (let key in this.labelObj) {
              if (this.labelObj[key]) {
                params.labelList.push({
                  entityLabelId: key,
                  srcFieldId: this.labelObj[key]
                })
              }
            }
          }
          this.relationList.forEach(item => {
            if (item.leftNode && item.rightNode && item.relation) {
              let startEntityMappingId
              let endEntityMappingId
              let formatData = (compare) => {
                if (item.toRight) {
                  startEntityMappingId = item.leftNode === compare ? null : item.leftNode
                  endEntityMappingId = item.rightNode === compare ? null : item.rightNode
                } else {
                  startEntityMappingId = item.rightNode  === compare ? null : item.rightNode
                  endEntityMappingId = item.leftNode  === compare ? null : item.leftNode
                }
              }
              formatData('current')
              let obj = {
                startEntityMappingId,
                endEntityMappingId,
                relationshipId: item.relation,
                srcFieldId: item.relationAbo || null
              }
              // 更新
              if (item.id) {
                let ind = this.choiceEntity.relationList.findIndex(relation => relation.id === item.id)
                let isUpdate = false
                if (ind > -1) {
                  for (let key in obj) {
                    if (obj[key] !== this.choiceEntity.relationList[ind][key]) {
                      isUpdate = true
                    }
                  }
                }
                if (isUpdate) {
                  formatData(this.currentEntityId)
                  obj['startEntityMappingId'] = startEntityMappingId
                  obj['endEntityMappingId'] = endEntityMappingId
                  obj['id'] = item.id
                  obj.deleteFlag = false
                  params.relationshipList.push(obj)
                }
              } else {
                if (this.choiceEntity) {
                  formatData(this.currentEntityId)
                  obj['startEntityMappingId'] = startEntityMappingId
                  obj['endEntityMappingId'] = endEntityMappingId
                }
                params.relationshipList.push(obj)
              }
            }
          })
          if (way === 'update') {
            params.relationshipList = [...params.relationshipList, ...this.delRelList]
            // if (delList.length) {
            //   delList.forEach(item => {
            //     delAtlasEntityAttr({
            //       id: item
            //     })
            //   })
            // }
            // if (this.delRelList.length) {
            //   this.delRelList.forEach(item => {
            //     delAtlasRelation({
            //       id: item
            //     })
            //   })
            // }
          }
          addAtlasEntity(params, way).then(() => {
            this.$message.success('提交成功！')
            this.submitLoadStop +=1
            this.entityToIcon[params.entityId] = params.iconId
            this.clearData()
            this.getAtlasData(this.row.id)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    clearData () {
      this.nodeInfo = {
        type: '',
        icon: '',
        parentId: null
      }
      this.relationList = []
      this.showOtherAttr = false
      this.currentEntity = {
        only: [],
        others: []
      }
      this.labelObj = {}
      this.reAttrList = {}
      this.choiceEntity = null
      this.currentEntityId = ''
      this.delRelList = []
      this.entityToIcon = {}
    }
  },
  beforeDestroy () {
    this.bus.$off('theme', this.changeTheme)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.atlas_editor_wrap {
  height: 100%;
  .wrap_content {
    display: flex;
    height: calc(100% - 52px);
    padding: 24px 24px 32px;
    background: var(--bg-color-3);
    margin-top: 1px;
    .my_charts {
      flex: 1;
      .atlas_chart {
        width: 100%;
        height: 100%;
      }
      .empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--base-text-color-1);
      }
    }
    .editor_wrap {
      display: flex;
      flex-direction: column;
      position: relative;
      flex: none;
      width: 504px;
      padding: 16px 0;
      background: var(--bg-color-7);
      box-shadow: var(--box-shadow);
      height: 100%;
      &::before {
        position: absolute;
        left: 0;
        display: block;
        content: '';
        width: 504px;
        height: 6px;
        top: -6px;
        background-image: var(--drawer-top-bg);
        background-size: 100% 100%;
      }
      /deep/.el-select {
        .el-input {
          line-height: 30px;
        }
        .el-input__inner {
          font-size: 14px;
          height: 32px;
          line-height: 30px;
          &::placeholder {
            font-size: 14px;
          }
        }
        .el-input__suffix {
          line-height: 30px;
          height: 32px;
          .el-input__icon {
            line-height: 30px;
          }
        }
      }
      .editor_header {
        flex: none;
        display: flex;
        padding-bottom: 12px;
        border-bottom: 1px solid 	rgba(81, 92, 124, .16);
        margin: 0 16px;
        .header_item {
          display: flex;
          align-items: center;
          margin-right: 24px;
          font-size: 16px;
          line-height: 32px;
          color: var(--base-text-color-to-666666);
          &:last-child {
            margin-right: 0;
            /deep/.el-select {
              width: 152px;
            }
          }
          .label {
            flex: none;
            margin-right: 12px;
          }
          /deep/.el-select {
            width: 144px;
            //.el-input {
            //  line-height: 30px;
            //}
            //.el-input__inner {
            //  font-size: 14px;
            //  &::placeholder {
            //    font-size: 14px;
            //  }
            //}
            //.el-input__suffix {
            //  line-height: 30px;
            //  height: 32px;
            //  .el-input__icon {
            //    line-height: 30px;
            //  }
            //}
            .el-input__prefix {
              line-height: 30px;
              left: 12px;
              img {
                width: 16px;
                height: 16px;
                margin-top: 8px;
              }
            }
          }
        }
      }
      .editor_content {
        flex: 1;
        overflow-y: auto;
        padding: 12px 16px;
        /deep/.el-form {
          padding-left: 8px;
          .el-form-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px !important;
            .el-form-item__error {
              padding-top: 0;
              color: @font-color-4;
            }
            .el-form-item__label {
              position: relative;
              font-size: 16px;
              line-height: 21px;
              &::before {
                position: absolute;
                left: -12px;
                color: @font-color-4;
              }
            }
            .el-form-item__content {
              line-height: 30px;
              margin-left: 0 !important;
              flex: 1;
              .el-select {
                width: 100%;
              }
            }
            .el-input {
              line-height: 30px;
              .el-input__inner {
                height: 32px;
                line-height: 30px;
                //border: 1px solid rgba(81, 92, 124, .4);
                border-radius: 2px;
                padding: 0 12px;
                font-size: 14px;
                //&:hover {
                //  border-color: #3D4C75;
                //}
                &::placeholder {
                  font-size: 14px;
                }
              }
            }
          }
        }
        .other_attr_btn {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
          font-size: 14px;
          line-height: 19px;
          color: var(--active-color);
          .btn {
            cursor: pointer;
          }
          i {
            font-size: 16px;
            margin-right: 8px;
          }
        }
        .other_attr {
          margin-top: 16px;
        }
        .add_relation {
          font-size: 14px;
          line-height: 19px;
          color: var(--active-color);
          margin: 24px 0 16px;
          span {
            cursor: pointer;
          }
          i {
            margin-right: 8px;
          }
          &.disabled {
            color: #434B5F;
            span {
              cursor: not-allowed;
            }
          }
        }
        .relation_wrap {
          .relation {
            display: flex;
            align-items: center;
            margin-top: 32px;
            .select_wrap {
              flex: 1;
              display: flex;
              align-items: center;
              /deep/.el-select {
                width: 104px;
              }
              .division {
                position: relative;
                flex: 1;
                height: 1px;
                background:	rgba(81, 92, 124, .5);
                margin: 0 8px;
                .relation_choice {
                  position: absolute;
                  top: -32px;
                  display: flex;
                  /deep/.el-select {
                    flex: 1;
                    width: auto;
                    &:first-child {
                      margin-right: 4px;
                    }
                    .el-input {
                      line-height: 22px;
                    }
                    .el-input__inner {
                      font-size: 12px;
                      height: 24px;
                      &::placeholder {
                        font-size: 12px;
                      }
                    }
                    .el-input__suffix {
                      line-height: 22px;
                      height: 24px;
                      .el-input__icon {
                        line-height: 22px;
                      }
                    }
                  }
                }
                &::after {
                  position: absolute;
                  top: -3px;
                  right: 0;
                  display: block;
                  content: '';
                  width: 0;
                  height: 0;
                  border-style: solid;
                  border-width: 4px 0 4px 16px;
                  border-color: transparent transparent transparent rgba(81, 92, 124);
                }
                &.to_left {
                  &::after {
                    left: 0;
                    border-width: 4px 16px 4px 0;
                    border-color: transparent rgba(81, 92, 124) transparent transparent;
                  }
                }
              }
            }
            .relation_opera {
              flex: none;
              margin-left: 12px;
              font-size: 14px;
              line-height: 1;
              color: var(--active-color);
              i {
                cursor: pointer;
                &:first-child {
                  margin-right: 12px;
                }
                &.disabled {
                  color: #434B5F;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
      .editor_floor {
        flex: none;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 16px;
        .blank_button {
          margin-right: 16px;
        }
        .division {
          margin-right: 16px;
          width: 1px;
          height: 24px;
          background: var(--table-row-border-bottom-color);
        }
      }
    }
  }
}
.opera {
  div {
    height: 0;
  }
  .icon-delete {
    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
.re_option {
  display: flex;
  justify-content: space-between;
  .is_current {
    position: relative;
    color: @font-color-2;
    span {
      position: absolute;
      font-size: 8px;
      left: 2px;
    }
  }
}
/deep/.el-icon-circle-close {
  margin-top: 0 !important;
}
</style>
