<template>
<div
  class='tag_table_wrap'
>
  <div class='table_wrap' v-show='showComponent !== "trail"'>
    <div class='add' v-if="dataManageTagIsEdit==='true'">
      <el-button type="primary" @click='showDialog' :disabled='canEditor'>新建</el-button>
    </div>
    <div class='entity_table'>
      <TableGrid
        :key='timeKey'
        :class='{ "s_table_height": showComponent === "standard" }'
        :haveHeader='false'
        :haveSearchInput='false'
        :isSearchTime='false'
        :haveFloor='showComponent === "standard"'
        :rightBtnList='[]'
        :haveIndex='true'
        :slotOpera='dataManageTagIsEdit==="true" ? true : false'
        :pageMyself='showComponent === "standard"'
        :tableColumns='tableColumn'
        :btnRenderWidth='"9.23%"'
        :myPageSize='10'
        :data='tableList'
        :dataTotal='tableList.length'
        :loadingColor='"--bg-color-3"'
      >
        <!--      数据标准-->
        <div v-if='showComponent === "standard"' class='standard ellipsis' slot='standardName' slot-scope='{ row }'>
          <span @click='showStandard(row.id, true)'>{{ row.standardName }}</span>
        </div>
        <!--      实体-->
        <div v-if='showComponent === "entity"' class='name' slot='labelName' slot-scope='{ row }'>
          <span>{{ row.labelName }}</span>
          <i v-if='row.mainLabel' class='iconfont icon-a-duobianxing5'></i>
        </div>
        <div v-if='showComponent === "entity"' class='standard ellipsis' slot='dataStandardId' slot-scope='{ row }'>
          <span v-if='row.dataStandardId && row.dataStandardId.length' @click='showStandard(row.standardObj)'>
            {{ row.standardLabel }}
<!--            {{ standardAttrDe[row.dataStandardId] ?
            standardAttrDe[row.dataStandardId].standardName ?
              standardAttrDe[row.dataStandardId].standardName : '&#45;&#45;' : '&#45;&#45;' }}-->
          </span>
          <span v-else class='no_standard'>--</span>
        </div>
        <!--      关系-->
        <div v-if='showComponent === "relation"' class='standard ellipsis' slot='reStandardId' slot-scope='{ row }'>
          <span v-if='row.reStandardId.length' @click='showStandard(row.standardObj)'>
            {{ row.standardLabel }}
<!--            {{ standardAttrDe[row.reStandardId] ?
            standardAttrDe[row.reStandardId].standardName ?
              standardAttrDe[row.reStandardId].standardName : '&#45;&#45;' : '&#45;&#45;' }}-->
          </span>
          <span v-else class='no_standard'>--</span>
        </div>
<!--        <div v-if='showComponent === "relation"' class='relation_to' slot='startEntityName' slot-scope='{ row }'>-->
<!--          <span>{{ row.startEntityName }}</span>-->
<!--          <i class='el-icon-right'></i>-->
<!--          <span>{{ row.endEntityName }}</span>-->
<!--        </div>-->


        <div class='opera' slot='opera_btn' slot-scope="{ row, index }">
          <i
            class='iconfont icon-bianji'
            @click='editorAttr(row, index)'
            :class='{"have_opacity": canEditor || (showComponent !== "entity" && !row.editableFlag)}'
            title='编辑'
          ></i>
          <i
            class='iconfont icon-delete'
            :class='{
              "have_opacity": canEditor ||
               (showComponent === "entity" && index === 0) ||
                (showComponent !== "entity" && !row.editableFlag) ||
                 (showComponent === "standard" && usedStandardList.includes(row.id))
            }'
            title='删除'
            @click='deleteAttr(row, index)'
          ></i>
        </div>
      </TableGrid>
    </div>
  </div>
  <div class='table_wrap' v-show='showComponent === "trail"'>
    <TrailAttrTable
      v-show='activeTrailId === "attr"'
      :tableList.sync='trailData["attr"]'
      :entityAttrObj='entityAttrObj'
      @getTrailList='getTrailList'
    ></TrailAttrTable>
    <el-table
      v-show='activeTrailId !== "attr"'
      height='100%'
      :data='trailList'
    >
      <el-table-column
        type="index"
        width="120"
        :label="'序号'"
        :resizable="true"
      ></el-table-column>
      <el-table-column
        prop="entityId"
        label="实体"
        min-width="63.24%"
        :show-overflow-tooltip="true"
        :resizable="true"
        class-name='entity_item'
      >
        <template slot-scope="{ row }">
          <div>{{
              entityAttrObj[row.entityId + ''] ?
                entityAttrObj[row.entityId + '']['entityName'] ?
                  entityAttrObj[row.entityId + '']['entityName'] : '--' : '--' }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <pop
    :pop.sync="pop"
    @beforeClose="closeDialog"
    :dataCenterDetail="true"
    :class='{ "s_body_padding": showComponent === "standard" }'
  >
<!--    实体属性弹窗-->
    <EntityOperaAttr
      v-if='showComponent === "entity"'
      @closeDialog='closeDialog'
      @getEntityList='getEntityList'
      @getUseStandard='getUseStandard'
      :row='row'
      :standardList='standardList'
      :activeEntityId='activeEntityId'
      :entityAttrLength='tableList.length'
      :standardAttrDe='standardAttrDe'
    ></EntityOperaAttr>
<!--    数据标准弹窗-->
    <AddStandard v-if='showComponent === "standard"' @closeDialog='closeDialog' @getStandardList='getStandardList' :row='row'></AddStandard>
<!--    关系弹窗-->
    <AddRelation
      v-if='showComponent === "relation"'
      @closeDialog='closeDialog'
      @getRelation='getRelation'
      @getUseStandard='getUseStandard'
      :row='row'
      :standardList='standardList'
      :standardAttrDe='standardAttrDe'
    ></AddRelation>
  </pop>
  <pop
    :pop.sync="standardPop"
    @beforeClose="closeStandard"
    :dataCenterDetail="true"
    class='standard_dialog'
  >
    <div
      class='standard_box'
      v-p-loading="detailLoad"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="'--bg-color-4'"
    >
      <StandardDetail
        v-show='!detailLoad'
        :detailData='standardDeData'
      ></StandardDetail>
    </div>
  </pop>
</div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
import Pop from '@/components/VisualComponents/PopDialog'
import AddStandard from './addStandard.vue'
import EntityOperaAttr from './entityOperaAttr.vue'
import AddRelation from './addRelation.vue'
import StandardDetail from './standardDetail.vue'
import TrailAttrTable from './trailAttrTable.vue'
import { mapState } from 'vuex'

import {
  getEntityListApi,
  getStandardListApi,
  delStandardApi,
  delEntityAttr,
  getRelationApi,
  delRelation,
  getTrailApi,
  getUseStandardApi
} from '@/api/sysSetting'
import { ENTITY_TABLE_LIST, RELATION_TABLE_LIST, STANDARD_TABLE_LIST } from './config.js'

export default {
  name: 'TagTable',
  components: {
    TableGrid,
    Pop,
    AddStandard,
    EntityOperaAttr,
    AddRelation,
    StandardDetail,
    TrailAttrTable
  },
  props: {
    showComponent: {
      type: String,
      default: 'entity'
    }, // 当前显示的数据类型（实体、关系、数据标准）
    activeEntityId: {
      type: String,
      default: ''
    }, // 当前选中的实体的id
    activeTrailId: {
      type: String,
      default: ''
    }, // 当前选中的数据轨迹的id
    loading: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      timeKey: new Date().getTime(),
      pop: { show: false, title: '新建', width: '542px' },
      standardPop: { show: false, title: '详情', width: '806px' },
      row: {},
      tableColumn: [], // 当前选中数据，表格显示的列信息
      showTypeName: '', // 弹窗标题
      standardList: [], // 数据标准的数据列表
      standardAttrDe: {}, // 数据标准id为key对象
      standardDeData: {}, // 数据标准详情数据
      entityLabelList: [], // 实体树的数据
      entityAttrObj: {}, // 实体数据对象
      relationList: [], // 关系的表格数据
      mountStopLoad: 0, // 初始话的时候，什么时候停止loading
      trailData: {
        'attr': [],
        'time': [],
        'place': []
      }, // 数据轨迹的子级项的数据
      usedStandardList: [],
      detailLoad: false
    }
  },
  computed: {
    ...mapState('User', {
      dataManageTagIsEdit:'dataManageTagIsEdit',
    }),
    // 实体、关系、数据标准的列表
    tableList () {
      if (this.showComponent === 'entity') {
        return this.entityAttrObj[this.activeEntityId] ?
          this.entityAttrObj[this.activeEntityId].graphEntityLabelManages ?
            this.entityAttrObj[this.activeEntityId].graphEntityLabelManages || [] : [] : []
      } else if (this.showComponent === 'standard') {
        return this.standardList
      } else if (this.showComponent === 'relation') {
        return this.relationList
      } else {
        return []
      }
    },
    canEditor () {
      if (this.showComponent === 'entity') {
        return this.entityAttrObj[this.activeEntityId] ? !this.entityAttrObj[this.activeEntityId].editableFlag : false
      }
      return false
    },
    trailList () {
      if (this.trailData[this.activeTrailId] && this.activeTrailId !== 'attr') {
        return this.trailData[this.activeTrailId]
      } else {
        return []
      }
    },
    mountLoading: {
      get () {
        return this.loading
      },
      set (value) {
        this.$emit('update:loading', value)
      }
    }
  },
  watch: {
    showComponent: {
      handler (newVal) {
        this.timeKey = new Date().getTime()
        if (newVal === 'entity') {
          this.tableColumn = ENTITY_TABLE_LIST
          this.pop.width = '542px'
          this.showTypeName = '实体'
        } else if (newVal === 'standard') {
          this.tableColumn = STANDARD_TABLE_LIST
          this.pop.width = '856px'
          this.showTypeName = '标准'
        } else if (newVal === 'relation') {
          this.tableColumn = RELATION_TABLE_LIST
          this.pop.width = '542px'
          this.showTypeName = '关系'
        } else {
          this.tableColumn = []
          this.showTypeName = ''
        }
      },
      immediate: true
    },
    mountStopLoad: {
      handler (newVal) {
        if (newVal === 7) {
          this.mountLoading = false
        }
      }
    }
  },
  mounted () {
    this.getStandardList(true)
    this.getUseStandard(true)
    for (let key in this.trailData) {
      this.getTrailList(key, true)
    }
  },
  methods: {
    getUseStandard (fromMount = false) {
      getUseStandardApi().then(res => {
        this.usedStandardList = res || []
      }).finally(() => {
        if (fromMount) {
          this.mountStopLoad += 1
        }
      })
    },
    // 获取实体的列表数据
    getEntityList (fromMount = false, delEntity = false, delStandard = false) {
      this.entityLabelList = []
      this.entityAttrObj = {}
      getEntityListApi({}, !fromMount).then(res => {
        let list = res || []
        list.forEach(item => {
          let data = {
            level: 3,
            sign: 'entity',
            showOpera: false,
            label: item.entityName,
            editor: item.editableFlag ? ['add', 'rename', 'del'] : null,
            id: item.id + '',
            haveDetail: true,
            parentLabel: '实体'
          }
          if (item.editableFlag) {
            data['children'] = []
            data['showChild'] = true
            if (item.graphEntityManageVos) {
              item.graphEntityManageVos.forEach(child => {
                data['children'].push({
                  level: 4,
                  sign: 'entity',
                  showOpera: false,
                  label: child.entityName,
                  editor: item.editableFlag ? ['rename', 'del'] : null,
                  id: child.id + '',
                  haveDetail: true,
                  parentLabel: item.entityName
                })
                this.$set(this.entityAttrObj, child.id + '', child)
              })
            }
          } else {
            if (item.graphEntityManageVos) {
              data['children'] = []
              data['showChild'] = true
              item.graphEntityManageVos.forEach(child => {
                data['children'].push({
                  level: 4,
                  sign: 'entity',
                  showOpera: false,
                  label: child.entityName,
                  editor: item.editableFlag ? ['rename', 'del'] : null,
                  id: child.id + '',
                  haveDetail: true,
                  parentLabel: item.entityName
                })
                this.$set(this.entityAttrObj, child.id + '', child)
              })
            }
          }

          item.graphEntityLabelManages.forEach(entity => {
            entity['standardLabel'] = ''
            entity['standardObj'] = {}
            entity.dataStandardId?.forEach((standard, ind) => {
              if (this.standardAttrDe[standard]) {
                let standardValue = this.standardAttrDe[standard].standardName
                entity['standardLabel'] += `${standardValue}${ind === entity.dataStandardId.length - 1 ? '' : '、'}`
                entity['standardObj'][standard + ''] = this.standardAttrDe[standard] || {}
              }
            })
          })

          this.entityLabelList.push(data)
          this.$set(this.entityAttrObj, item.id + '', item)
        })
      }).finally(() => {
        this.$emit('getEntityData', this.entityLabelList)
        if (fromMount) {
          this.mountStopLoad += 1
        }
        if (delEntity) {
          this.getTrailList('attr')
        }
        if (delStandard) {
          this.getRelation()
        }
      })
    },
    // 获取关系列表的数据
    getRelation (fromMount = false) {
      this.relationList = []
      getRelationApi({}, !fromMount).then(res => {
        this.relationList = res || []
        this.relationList.forEach(item => {
          item.reStandardId = item.dataStandardId || []
          // item.relationSName = item.dataStandard?.standardName || '--'
          item['standardLabel'] = ''
          item['standardObj'] = {}
          item.reStandardId.forEach((standard, ind) => {
            if (this.standardAttrDe[standard]) {
              let standardValue = this.standardAttrDe[standard].standardName
              item['standardLabel'] += `${standardValue}${ind === item.reStandardId.length - 1 ? '' : '、'}`
              item['standardObj'][standard + ''] = this.standardAttrDe[standard] || {}
            }
          })
          // item.startEntityName = item.startEntity?.entityName || '--'
          // item.endEntityName = item.endEntity?.entityName || '--'
        })
      }).finally(() => {
        if (fromMount) {
          this.mountStopLoad += 1
        }
      })
    },
    // 获取数据标准的列表数据
    getStandardList (fromMount = false, delStandard = false) {
      this.standardList = []
      this.standardAttrDe = {}
      getStandardListApi({}, !fromMount).then(res => {
        this.standardList = res || []
        this.standardList.forEach(item => {
          this.standardAttrDe[item.id] = item || {}
        })
      }).finally(() => {
        if (fromMount) {
          this.mountStopLoad += 1
          this.getEntityList(true)
          this.getRelation(true)
        }
        if (delStandard) {
          this.getEntityList(false, false, true)
        }
      })
    },
    // 获取数据轨迹的数据
    getTrailList (type, fromMount = false) {
      this.trailData[type] = []
      getTrailApi(
        {
          elementType: type
        },
        !fromMount
      ).then(res => {
        this.trailData[type] = res || []
        if (type === 'attr') {
          this.trailData[type].forEach(item => {
            this.$set(item, 'isEdit', false)
            this.$set(item, 'editEntityId', '')
          })
        }
      }).finally(() => {
        if (fromMount) {
          this.mountStopLoad += 1
        }
      })
    },
    closeDialog () {
      this.pop.show = false
      this.pop.title = '新建'
      this.row = {}
    },
    showDialog () {
      this.pop.show = true
    },
    closeStandard () {
      this.standardPop.show = false
      this.standardDeData = {}
    },
    showStandard (standardDetail, isStandard) {
      let result = {}
      if (isStandard) {
        result[standardDetail + ''] = this.standardAttrDe[standardDetail] || {}
      } else {
        result = standardDetail
      }
      this.standardDeData = result
      this.detailLoad = true
      this.standardPop.show = true
      setTimeout(() => {
        this.detailLoad = false
      }, 300)
    },
    editorAttr (row, index) {
      if (this.canEditor || (this.showComponent !== "entity" && !row.editableFlag)) return
      this.row = {
        ...row,
        index
      }
      this.pop.title = '编辑'
      this.showDialog()
    },
    deleteAttr (row, index) {
      if (
        this.canEditor ||
        (this.showComponent === "entity" && index === 0) ||
        (this.showComponent !== "entity" && !row.editableFlag) ||
        (this.showComponent === "standard" && this.usedStandardList.includes(row.id))
      ) return
      this.$policeComfirm(`您确定要删除该${this.showTypeName}吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (this.showComponent === 'standard') {
          delStandardApi({
            id: row.id
          }).then(() => {
            this.$message.success('删除成功！')
            this.getStandardList(false, true)
          })
        } else if (this.showComponent === 'entity') {
          delEntityAttr({
            id: row.id,
            entityId: row.entityId
          }).then(() => {
            this.$message.success('删除成功！')
            this.getEntityList()
          })
        } else if (this.showComponent === 'relation') {
          delRelation({
            id: row.id
          }).then(() => {
            this.$message.success('删除成功！')
            this.getRelation()
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.tag_table_wrap {
  height: 100%;
  .add {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  .table_wrap {
    height: 100%;
  }
  .entity_table {
    height: calc(100% - 48px);
  }
  .standard {
    width: 100%;
    span {
      cursor: pointer;
      color: var(--active-color);
    }
    .no_standard {
      color: var(--base-text-color-1);
      cursor: default;
    }
  }
  .name {
    i {
      margin-left: 8px;
    }
  }
  /deep/.data_center_detail {
    .el-dialog__wrapper {
      .el-dialog {
        position: relative;
        .el-dialog__header {
          margin: 0 16px;
          padding-bottom: 17px;
        }
        .el-dialog__body {
          padding: 30px 32px 32px 44px !important;
        }
      }
    }
  }
  .s_body_padding {
    /deep/.data_center_detail {
      .el-dialog__wrapper {
        .el-dialog {
          .el-dialog__body {
            padding: 24px 32px 32px !important;
          }
        }
      }
    }
  }
  .standard_dialog {
    /deep/.data_center_detail {
      .el-dialog__wrapper {
        .el-dialog {
          .el-dialog__body {
            height: 750px;
            padding-top: 24px !important;
          }
        }
      }
    }
  }
}
/deep/.table_loading {
  height: 100%;
  .w_table_wrap {
    height: 100%;
  }
}
.s_table_height {
  /deep/.w_table_wrap {
    height: calc(100% - 40px);
  }
}
/deep/.w_table_floor {
  margin-top: 8px;
}
.opera {
  i {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
    cursor: pointer;
    margin-right: 8px;
  }
  .have_opacity {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
// 超出文本长度省略号展示
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  word-break: break-all;
}
.standard_box {
  height: 100%;
}
</style>
