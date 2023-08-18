<template>
<div
  class='trigger_list_wrap'
  v-p-loading="loading"
  element-loading-text="触警处理中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--loading-color-1'"
>
  <div class='list_header'>
    <div class='header_left'>
      <img :src='require("@/assets/img/title-header.png")' alt=''>
      <div class='tip'>触警列表</div>
    </div>
    <div class='header_right' @click='$emit("handleTriggerList", false)'>
      <i class='iconfont icon-fanhui'></i>
      <span>返回</span>
    </div>
  </div>
  <div class='list_content'>
    <TableGrid
      ref='tableGrid'
      :tableColumns="tableColumns"
      :haveSearchInput='false'
      :isSearchTime='false'
      :rightBtnList='[]'
      :loadingColor='"--bg-color-3"'
      :url='"/monitor/message/page"'
      :reqMethod='"post"'
      :myPageSize='10'
      :haveIndex='true'
      :noData='imgIsNoData'
      @getSpecialParams="handleBeforeLoad"
      @getDataSuccess='getDataSuccess'
    >
      <div class='search_input' slot='dateLeft'>
        <el-input
          v-model.trim="triggerAttr"
          @keyup.enter.native="searchClick"
          :placeholder="'请输入特征'"
        >
          <template slot="suffix">
            <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
          </template>
        </el-input>
        <ImageSearch
          ref="ImageSearch"
          class="search-component"
          :showSearchBtn="false"
          @isShowUpload="showUpload"
          @getImgUrl="uploadImage"
        ></ImageSearch>
        <el-select
          v-model="searchStatus"
          placeholder="请选择"
          @change='statusChange'
        >
          <el-option
            v-for='item in searchOpt'
            :key='item.value'
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <template slot='triggerTrait' slot-scope='{ row }'>
        <div class='trigger_trait' v-if='row.triggerLabelNameEn === "avatar_url"'>
          <div class='value'>{{ row.triggerTrait + '/' }}</div>
          <el-image
            class="el-image"
            :src="origin + row.triggerAttr"
            :preview-src-list="[ origin + row.triggerAttr ]"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class='iconfont icon-jiazaishibai'></i>
            </div>
          </el-image>
        </div>
        <div class='trigger_trait ellipsis' v-else>
          {{ row.triggerTrait || '--' }}
        </div>
      </template>
      <div class='trigger_record ellipsis' slot='triggerRecord' slot-scope='{ row }' @click='$emit("handleWarnSource", true, row)'>
        {{ row.triggerRecord || '--' }}
      </div>
      <div class='trigger_status' slot='handleStatus' slot-scope='{ row }'>
        <div v-if='!row.flag' class='success_tip ellipsis'>已处理</div>
        <template v-else>
          <div class='switch' @click='handleStatus(row)'></div>
          <el-switch
            v-model="row.flag"
            active-color="#3D6EFF"
          ></el-switch>
        </template>
      </div>
      <div class='trigger_level' slot='controlLevel' slot-scope='{ row }' :class='[row.controlLevel || ""]'>
        {{ levelObj[row.controlLevel] || '--' }}
      </div>
    </TableGrid>
  </div>
</div>
</template>

<script>
import TableGrid from '@/components/VisualComponents/TableGrid'
import ImageSearch from '@/views/common/full-database-search/image-search/components/ImageSearch'
import { updateWarnStatus, handleTriggerRead } from '@/api/warnControl.js'
import { frSearchAll } from '@/api/analysis.js'

const TABLE_COLUMNS = [
  { label: '触警特征', prop: 'triggerTrait', minWidth: '14.29%', haveSlot: true },
  { label: '触警时间', prop: 'triggerTime', minWidth: '9.91%' },
  { label: '触警地址', prop: 'triggerAddress', minWidth: '10.36%' },
  { label: '触警数据', prop: 'triggerRecord', minWidth: '7.19%', haveSlot: true },
  { label: '联系警员', prop: 'triggerPoliceInfo', minWidth: '8.19%' },
  { label: '触警处理', prop: 'handleStatus', minWidth: '6.57%', haveSlot: true },
  { label: '布控名称', prop: 'controlName', minWidth: '7.74%' },
  { label: '布控级别', prop: 'controlLevel', minWidth: '10.52%', haveSlot: true },
]
const LEVEL = {
  'normal': '普通',
  'general': '一般',
  'serious': '严重'
}
const HANDLE_STATUS = [
  { label: '全部', value: 'all' },
  { label: '已处理', value: 'processed' },
  { label: '未处理', value: 'untreated' }
]

export default {
  name: 'TriggerList',
  components: {
    TableGrid,
    ImageSearch
  },
  props: {
    canFastEnToCn: {
      type: Object,
      default: () => {}
    },
    dataEnToCn: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      triggerAttr: '',
      tableColumns: Object.freeze(TABLE_COLUMNS),
      levelObj: Object.freeze(LEVEL),
      searchOpt: Object.freeze(HANDLE_STATUS),
      loading: false,
      isShowUpload: false,
      searchImgList: [],
      uploadImgPath: '',
      searchStatus: 'all'
    }
  },
  watch: {
    isShowUpload: {
      handler (val) {
        if (val) {
          document.addEventListener('click', this.bodyClick)
        } else {
          document.removeEventListener('click', this.bodyClick)
        }
      }
    },
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    imgIsNoData () {
      return !!this.uploadImgPath && !this.searchImgList.length
    }
  },
  mounted () {
    this.bus.$emit('hiddenWarnList', false)
  },
  methods: {
    statusChange () {
      this.$nextTick(() => {
        this.$refs.tableGrid.searchClick()
      })
    },
    bodyClick (e) {
      this.$nextTick(() => {
        let search = document.querySelector('.search-list')
        let imgSearch = document.querySelector('.img_search')
        if (!search.contains(e.target) && !imgSearch.contains(e.target)) {
          if(this.$refs.ImageSearch &&
            this.$refs.ImageSearch.$refs.ImageDragUpload &&
            this.$refs.ImageSearch.$refs.ImageDragUpload.loading
          ) return
          this.$refs.ImageSearch.blur()
        }
      })
    },
    showUpload (bool) {
      this.isShowUpload = bool
    },
    uploadImage (item) {
      this.uploadImgPath = item
      this.searchImgList = []
      if (!this.uploadImgPath) {
        this.$nextTick(() => {
          this.$refs.tableGrid.searchClick()
          this.$refs.ImageSearch.blur()
        })
        return
      }
      let formData = new FormData()
      formData.append('faceImageUrl', this.uploadImgPath)
      frSearchAll(formData).then(res => {
        let result = res || []
        result.forEach(item => {
          this.searchImgList.push(item.faceSmallUrl)
        })
        this.$nextTick(() => {
          this.$refs.tableGrid.searchClick()
          this.$refs.ImageSearch.blur()
        })
      })
    },
    // 查询接口前对查询条件的一个添加
    handleBeforeLoad (req, callback) {
      req.data.triggerAttr = this.triggerAttr
      req.data.triggerAttrFaceList = this.searchImgList
      if (this.searchStatus !== 'all') req.data.handleStatus = this.searchStatus
      callback(req)
    },
    getDataSuccess (data, params, callback) {
      let unReadList = data.filter(item => item.readStatus === 'unread').map(item => item.id)
      if (unReadList.length) {
        let params = new FormData()
        params.append('messageIdList', unReadList)
        handleTriggerRead(params)
      }
      data.forEach(item => {
        item.triggerTrait = item.triggerLabelNameEn === 'avatar_url' && this.canFastEnToCn[item.triggerLabelNameEn] ?
          this.canFastEnToCn[item.triggerLabelNameEn] :
          item.triggerLabelNameEn && this.canFastEnToCn[item.triggerLabelNameEn] ?
            `${this.canFastEnToCn[item.triggerLabelNameEn]}/${item.triggerAttr || ""}` :
            `${item.triggerAttr || ""}`
        item.triggerRecord = this.dataEnToCn[item.triggerDataSource] || ''
        item.triggerPoliceInfo = (item.contactPolice ? item.contactPolice + '/' : '') + (item.contactPolicePhone || '')
        item.controlName = item.configVO.name
        item.controlLevel = item.configVO.level
        item.flag = item.handleStatus === 'untreated'
      })
      callback(data)
    },
    searchClick () {
      this.$nextTick(() => {
        this.$refs.tableGrid.searchClick()
      })
    },
    handleStatus (row) {
      if (!row.flag) return
      this.loading = true
      updateWarnStatus({
        messageId: row.id
      }).then(() => {
        this.$message.success('处理成功！')
        this.bus.$emit('updateList', row.id)
        this.$nextTick(() => {
          this.$refs.tableGrid.refresh()
        })
      }).catch(() => {
        this.$message.error('处理失败！')
      }).finally(() => {
        this.loading = false
      })
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyClick)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.trigger_list_wrap {
  width: 100%;
  height: 100%;
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
.trigger_record {
  color: var(--active-color);
  cursor: pointer;
}
.trigger_status {
  position: relative;
  .switch {
    position: absolute;
    left: 0;
    width: 32px;
    height: 21px;
    z-index: 10;
    cursor: pointer;
  }
}
.trigger_level {
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
.trigger_trait {
  display: flex;
  align-items: center;
  /deep/.el-image {
    margin-left: 4px;
    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 36px;
      background: var(--warn-error-image-bg);
      color: var(--base-text-color-2);
      i {
        font-size: 16px;
      }
    }
    img {
      width: 30px;
      height: 36px;
    }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.search_input {
  display: flex;
}
/deep/.w_table_wrap .el-table .el-table__body-wrapper .el-table__row .el-table__cell:first-child .cell {
  padding-left: 32px;
}
/deep/.el-table .el-table__body-wrapper .el-table__body tbody tr .el-table__cell {
  padding: 10px 0 9px;
  height: 56px;
}
::v-deep .search-container {
  .img_search {
    background: transparent !important;
    .placeholder {
      font-size: 16px;
    }
  }
  .search-list {
    top: 39px !important;
    .division {
      border-color: var(--active-color) !important;
    }
  }
}
.search-component {
  margin-right: 16px;
}
/deep/.search {
  .img_search {
    width: 416px !important;
  }
  .search-list {
    width: 416px !important;
  }
  .upload-demo {
    width: 384px !important;
  }
}
/deep/.el-select {
  width: 220px;
  .el-input {
    width: 220px !important;
  }
}
/deep/.w_table_floor {
  margin-top: 16px;
}
/deep/.w_table_wrap {
  height: calc(100% - 48px);
}
/deep/.el-input {
  .el-input__inner {
    &:focus {
      border-color: var(--active-color);
    }
  }
}
</style>
