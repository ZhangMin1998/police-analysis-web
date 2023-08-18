<template>
<div class='control_list_wrap'>
  <div class='content' v-show='!isChoiceRegion && !isDetail'>
    <div class='list_header'>
      <div class='header_left'>
        <img :src='require("@/assets/img/title-header.png")' alt=''>
        <div class='tip'>布控设置</div>
      </div>
      <div class='header_right' @click='$emit("toControlMap")'>
        <i class='iconfont icon-fanhui'></i>
        <span>返回</span>
      </div>
    </div>
    <div
      class='list_content'
    >
      <TableGrid
        :key='refreshKey'
        ref='tableGrid'
        :tableColumns="tableColumns"
        :btnRender="btnRender"
        :haveSearchInput='false'
        :isSearchTime='false'
        :rightBtnList='[]'
        :loadingColor='"--bg-color-3"'
        :url='"/monitor/config/list"'
        :reqMethod='"post"'
        :myPageSize='11'
        @getSpecialParams="handleBeforeLoad"
        @getDataSuccess='getDataSuccess'
      >
        <div class='new_control' slot='rightBtn'>
          <el-button type="primary" @click='addControl'>新建</el-button>
        </div>
        <div class='search_input' slot='dateLeft'>
          <el-input
            v-model.trim="controlName"
            @keyup.enter.native="searchClick"
            :placeholder="'请输入布控名称'"
          >
            <template slot="suffix">
              <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
            </template>
          </el-input>
        </div>
        <!--        编码-->
        <div class='code ellipsis' slot='id' slot-scope="{ row }">{{ ((row.code || '') + (row.id || '')) || '--' }}</div>
<!--        布控级别-->
        <div class='level' slot='level' slot-scope="{ row }" :class='[row.level || ""]'>
          {{ levelObj[row.level] || '--' }}
        </div>
<!--        布控数据-->
        <div class='control_data ellipsis' slot='dataTypeSelectFlag' slot-scope="{ row }">
          {{ formatControlData(row) }}
        </div>
<!--        布控时间-->
        <div class='control_time ellipsis' slot='timeSelectFlag' slot-scope="{ row }">
          {{ formatControlTime(row) }}
        </div>
<!--        布控区域-->
        <div class='control_region ellipsis' slot='regionSelectFlag' slot-scope="{ row }">
          {{ formatControlRegion(row) }}
        </div>
        <template slot='status' slot-scope="{ row }">
          <div class='status_expire' v-if='row.status === "expired"'>已过期</div>
          <div class='status_expire' v-else-if='row.status === "reserved"'>已预约</div>
          <div class='status_conduct' v-else-if='row.status === "enable" || row.status === "disable"'>
            <div class='status_name'>{{
                row.status === "enable" ?
                  '布控中' :
                  row.status === "disable" ?
                    '已停止' : ''
              }}</div>
            <div class='status_switch'>
              <div class='switch' @click='handleStatus(row)'></div>
              <el-switch
                v-model="row.switchFlag"
                active-color="#3D6EFF"
              ></el-switch>
            </div>
          </div>
        </template>
      </TableGrid>
    </div>

    <pop
      :pop.sync="pop"
      @beforeClose="hideDetail"
      @beforeOpen="showDetail"
      :dataCenterDetail="true"
    >
      <AddControl
        :resultRegion='resultRegion'
        :isNoIn='isNoIn'
        :editInfo='editInfo'
        @changeStatus='changeStatus'
        @updateRegionInfo='updateRegionInfo'
        @hideDetail='hideDetail'
        @refreshTable='refreshTable'
      ></AddControl>
    </pop>
  </div>
  <div class='content' v-if='isChoiceRegion'>
    <ControlRegion
      ref='region'
      :isNoIn='isNoIn'
      :regionLists='regionLists'
      :tabTip='pop.title'
      @noIn='noIn'
      @noOut='noOut'
      @selectEnd='selectEnd'
      @changeStatus='changeStatus'
      @delRegion='delRegion'
    ></ControlRegion>
  </div>

  <div class='content' v-if='isDetail'>
    <FeatureSet :editInfo='editInfo' @toControlList='toControlList'></FeatureSet>
  </div>

</div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
import Pop from '@/components/VisualComponents/PopDialog'
import AddControl from '../add-control'
import ControlRegion from '../control-region'
import FeatureSet from '../feature-set'
import { updateControlStatus, delControlApi } from '@/api/warnControl.js'
import Mixins from '../../mixins.js'

const TABLE_COLUMNS = [
  { label: '编码', prop: 'id', minWidth: '8.29%', haveSlot: true },
  { label: '布控名称', prop: 'name', minWidth: '10.91%' },
  { label: '布控级别', prop: 'level', minWidth: '7.36%', haveSlot: true },
  { label: '布控数据', prop: 'dataTypeSelectFlag', minWidth: '7.19%', haveSlot: true },
  { label: '布控时间', prop: 'timeSelectFlag', minWidth: '12.19%', haveSlot: true },
  { label: '布控区域', prop: 'regionSelectFlag', minWidth: '8.57%', haveSlot: true },
  { label: '布控特征数', prop: 'featuresCount', minWidth: '7.74%' },
  { label: '修改人', prop: 'updateOperator', minWidth: '12.52%' },
  { label: '修改时间', prop: 'updateTime', minWidth: '10.17%',
    renderFun (row) {
      if (!row.updateTime) return '--'
      return new Date(row.updateTime).toLocaleString()
    }
  },
  { label: '布控状态', prop: 'status', minWidth: '8.13%', haveSlot: true },
]

const LEVEL = {
  'normal': '普通',
  'general': '一般',
  'serious': '严重'
}

export default {
  name: 'ControlList',
  mixins: [Mixins],
  components: {
    TableGrid,
    Pop,
    AddControl,
    ControlRegion,
    FeatureSet
  },
  data () {
    return {
      tableColumns: Object.freeze(TABLE_COLUMNS),
      levelObj: Object.freeze(LEVEL),
      pop: { show: false, title: '新建规则', width: '416px' },
      btnRender: [
        {
          label: '特征设置',
          icon: 'icon-a-zu3119',
          btnEvent: this.setFeature,
          alt: '特征设置'
        },
        {
          label: '编辑',
          icon: 'icon-bianji',
          btnEvent: this.editControl,
          alt: '编辑'
        },
        {
          label: '删除',
          icon: 'icon-delete',
          btnEvent: this.delControl,
          alt: '删除'
        }
      ],
      isChoiceRegion: false, // 是否在选择指定区域
      isNoIn: true, // 指定区域是否禁止进入
      regionLists: [], // 指定区域已经框选的区域
      resultRegion: [],
      // activeRegion: '', // 指定区域当前选中的区域
      editInfo: {}, // 编辑或者查看特征设置时，操作行的数据
      isDetail: false, // 是否展示特征设置页面
      regionId: 0,
      controlName: '',
      refreshKey: new Date().getTime(),
      editRegionList: []
    }
  },
  methods: {
    // 查询接口前对查询条件的一个添加
    handleBeforeLoad (req, callback) {
      req.data.nameLike = this.controlName
      callback(req)
    },
    getDataSuccess (data, params, callback) {
      data.forEach(item => {
        if (item.status === 'enable') {
          item.switchFlag = true
        } else {
          item.switchFlag = false
        }
      })
      callback(data)
    },
    searchClick () {
      this.$nextTick(() => {
        this.$refs.tableGrid.searchClick()
      })
    },
    // 设置特征
    setFeature (row) {
      this.editInfo = row
      this.isDetail = true
    },
    // 编辑布控规则
    editControl (row) {
      this.pop.title = '编辑规则'
      this.editInfo = row
      if (this.editInfo.regionAccessType === 'inner') {
        this.isNoIn = true
      } else if (this.editInfo.regionAccessType === 'outer') {
        this.isNoIn = false
      }
      if (this.editInfo.regionSelectFlag === 'specific' && this.editInfo.regionRange) {
        this.formatEditRegion(this.editInfo.regionRange)
      }
      this.showDetail()
    },
    // 删除布控规则
    delControl (row) {
      this.$policeComfirm('确定删除该布控规则吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('configId', row.id)
        delControlApi(params).then(() => {
          this.$message.success('删除成功！')
          this.refreshKey = new Date().getTime()
        }).catch(() => {
          this.$message.error('删除失败！')
        })
      })
    },
    formatEditRegion (list) {
      let regionList = JSON.parse(list)
      regionList.forEach(item => {
        let region = item.replace(/[(]|[)]/g, '').split(',')
        let pointList = []
        // let
        region.forEach((point, index) => {
          if (index % 2 === 0) {
            pointList.push([point, region[index + 1]])
          }
        })
        this.regionLists.push({
          pointlist: pointList || [],
          fillColor: 'rgba(240, 63, 88, 0.16)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
          elementName: 'control-region', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
          lineColor: 'rgba(240, 63, 88, 1)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
          lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
          // lineDash: this.isNoIn ? null : [5], // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
          className: 'map-polygon' + this.regionId, // 图层的class String, 非必须，默认为 'map-polygon'
          id: this.regionId + '',
          isEdit: true
        })
        this.regionId++
      })
      this.resultRegion = JSON.parse(JSON.stringify(this.regionLists))
    },
    // 新建规则
    addControl () {
      this.pop.title = '新建规则'
      this.showDetail()
    },
    // 特征设置返回
    toControlList () {
      this.isDetail = false
      this.editInfo = {}
      this.$nextTick(() => {
        this.$refs.tableGrid.refresh()
      })
    },
    showDetail () {
      this.pop.show = true
    },
    hideDetail () {
      this.pop.show = false
      this.editInfo = {}
      this.editRegionList = []
      this.isNoIn = true
      this.regionLists = []
      this.resultRegion = []
    },
    // 布控区域切换成全区域时
    updateRegionInfo (value) {
      if (value === 'all') {
        this.isNoIn = true
        if (this.editInfo.id) {
          this.resultRegion = this.resultRegion.filter(item => item.isEdit)
          this.resultRegion = [...this.resultRegion, ...this.editRegionList]
          this.regionLists = JSON.parse(JSON.stringify(this.resultRegion))
        } else {
          this.regionLists = []
          this.resultRegion = []
        }
      }
      if ((this.editInfo.id) && value === 'specific') {
        if (this.editInfo.regionAccessType === 'inner') {
          this.isNoIn = true
        } else if (this.editInfo.regionAccessType === 'outer') {
          this.isNoIn = false
        }
      }
    },
    changeStatus (bool, isCancel = false) {
      this.isChoiceRegion = bool
      if (!bool && !isCancel) {
        this.resultRegion = JSON.parse(JSON.stringify(this.regionLists))
      }
      if (isCancel) {
        this.regionLists = JSON.parse(JSON.stringify(this.resultRegion))
        if (!this.regionLists.length) {
          this.isNoIn = true
        }
      }
    },
    // 指定区域选择禁止进入时
    noIn () {
      this.isNoIn = true
      /*if (this.activeRegion) {
        this.regionLists[+this.activeRegion].lineDash = null
      }*/
    },
    // 指定区域选择禁止离开时
    noOut () {
      this.isNoIn = false
      /*if (this.activeRegion) {
        this.regionLists[+this.activeRegion].lineDash = [5]
      }*/
    },
    // 当前选中的指定区域
    /*setActRegion (id) {
      this.activeRegion = ''
      let actIndex = null
      if (id) {
        actIndex = this.regionLists.findIndex(item => item.id === id)
      }
      if (id && actIndex > -1) {
        this.activeRegion = actIndex + ''
        this.regionLists.forEach((item, index) => {
          index === +this.activeRegion ? item.lineWidth = 2 : item.lineWidth = 1
        })
        if (this.regionLists[+this.activeRegion].lineDash) {
          this.isNoIn = false
        } else {
          this.isNoIn = true
        }
      }
    },*/
    // 删除指定区域
    delRegion (index) {
      let activeIndex = this.regionLists.findIndex(item => item.id === index)
      if (activeIndex > -1) {
        if (this.editInfo.id && this.regionLists[activeIndex].isEdit) {
          this.editRegionList.push(this.regionLists[activeIndex])
        }
        this.regionLists.splice(activeIndex, 1)
      }
    },
    // 指定区域绘制结束时
    selectEnd (list) {
      this.regionLists.push({
        pointlist: list || [],
        fillColor: 'rgba(240, 63, 88, 0.16)', // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        elementName: 'control-region', // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
        lineColor: 'rgba(240, 63, 88, 1)', // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 1, // 多边形线条宽度 Number，非必须，默认为 2
        // lineDash: this.isNoIn ? null : [5], // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: 'map-polygon' + this.regionId, // 图层的class String, 非必须，默认为 'map-polygon'
        id: this.regionId + ''
      })
      this.regionId++
    },
    refreshTable () {
      this.refreshKey = new Date().getTime()
    },
    // 修改布控规则的状态
    handleStatus (row) {
      let params = new FormData()
      params.append('configId', row.id)
      params.append('status', row.switchFlag ? 'disable' : 'enable')
      updateControlStatus(params).then(() => {
        this.$message.success('修改成功！')
        this.refreshKey = new Date().getTime()
      }).catch(() => {
        this.$message.error('修改失败！')
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.control_list_wrap {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
  }
  .list_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1px;
    padding: 16px 24px;
    background: var(--bg-color-3);
    .header_left {
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .tip {
        color: var(--base-text-color-1);
        font-size: 18px;
        font-weight: bold;
        line-height: 24px;
      }
    }
    .header_right {
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--primary-menu-text-color);
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: var(--base-text-color-1);
      }
    }
  }
  .list_content {
    height: calc(100% - 57px);
    background: var(--bg-color-3);
    /deep/.w_table {
      .w_table_grid_header {
        background: transparent;
        padding-top: 24px;
        padding-bottom: 0;
      }
      .table_loading {
        height: calc(100% - 96px);
        padding: 0 24px 16px;
      }
    }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.icon-sousuo {
  font-size: 16px;
  color: var(--input-placehold-color);
  line-height: 40px;
  cursor: pointer;
}
.level {
  width: 64px;
  padding-left: 6px;
  &.normal {
    background: linear-gradient(91deg, #62ADF4 0%, rgba(98, 173, 244, 0.07) 100%);
  }
  &.general {
    background: linear-gradient(91deg, #F8BC3C 0%, rgba(248, 188, 60, 0.07) 100%);
  }
  &.serious {
    background: linear-gradient(91deg, #DD3F48 0%, rgba(221, 63, 72, 0.07) 100%);
  }
}
.status_conduct {
  display: flex;
  align-items: center;
  .status_name {
    margin-right: 8px;
  }
  .status_switch {
    position: relative;
    .switch {
      position: absolute;
      left: 0;
      width: 34px;
      height: 20px;
      cursor: pointer;
      z-index: 10;
    }
  }
}
/deep/.data_center_detail {
  .el-dialog__wrapper .el-dialog .el-dialog__body {
    padding: 24px 32px 32px !important;
  }
}
</style>
