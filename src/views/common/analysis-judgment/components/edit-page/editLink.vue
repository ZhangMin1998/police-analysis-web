<template>
<div
  class='edit_link_wrap'
  v-p-loading="loading"
  element-loading-text="数据加载中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--bg-color-4'"
>
  <div class='link_page_opera'>
    <div class='link_opera' @click='addLink'>
      <i class='iconfont icon-tianjia'></i>
      <div class='tip'>添加</div>
    </div>
    <div
      :class='{
        "is_disabled": linksInfo.length === 1,
        "link_opera": true
      }'
      @click='delLink'
    >
      <i class='iconfont icon-shanchu'></i>
      <div class='tip'>删除</div>
    </div>
  </div>
  <el-tabs v-model='activeLink'>
    <el-tab-pane
      v-for='item in linksInfo'
      :key='item.linkKey'
      :label="item.linkName"
      :name="item.linkKey"
    >
      <!--      按键类型-->
      <div class='fill_item fill_type'>
        <div class='label'>链接类型：</div>
        <el-radio-group v-model="item.type">
          <el-radio label="icon" :disabled='iconTypeDisabled'>图标链接</el-radio>
          <el-radio label="text">文字链接</el-radio>
        </el-radio-group>
      </div>
      <!--      图标选择-->
      <div v-show='item.type === "icon"' class='fill_item'>
        <div class='label'>图标选择：</div>
        <EditSelect
          class='icon_select'
          :modelValue.sync='item.icon'
          :options='iconOptions'
        ></EditSelect>
        <div v-if='item.isError && !item.icon' class='error_tip'>图标选择不可为空</div>
      </div>
      <div class='match_title'>筛选匹配：</div>
      <div class='match_item'>
        <div class='current_info'>
          <div class='label'>当前页面：</div>
          <div class='info'>{{ currentPageInfo.pageName }}</div>
        </div>
        <div class='fill_item'>
          <div class='label'>匹配页面：</div>
          <el-select v-model="item.matchPage" placeholder="请选择" class='match_select' @change='(value) => matchPageChange(value, item)'>
            <el-option
              v-for="opt in matchPages"
              :key="opt.id"
              :label="opt.pageName"
              :value="opt.id">
            </el-option>
          </el-select>
          <div v-if='item.isError && !item.matchPage' class='error_tip'>匹配页面不可为空</div>
        </div>
      </div>
      <div class='match_item'>
        <div class='current_info'>
          <div class='label'>当前容器：</div>
          <div class='info'>{{ editModuleInfo.moduleName }}</div>
        </div>
        <div class='fill_item'>
          <div class='label'>匹配容器：</div>
          <el-select v-model="item.matchModule" placeholder="请选择" class='match_select' @change='(value) => matchModuleChange(value, item)'>
            <el-option
              v-for="opt in item.matchPageModuleOptions"
              :key="opt.id"
              :label="opt.containerName"
              :value="opt.id">
            </el-option>
          </el-select>
          <div v-if='item.isError && !item.matchModule' class='error_tip'>匹配容器不可为空</div>
        </div>
      </div>
      <div class='match_item_tip'>
        <div class='tip'>当前字段：</div>
        <div class='tip'>匹配字段：</div>
      </div>
      <div v-for='(match, index) in item.matchInfo' :key='index' class='col_info'>
        <div
          :class='{
            "field_select": true,
            "is_error": (item.isError && !match.current) || (match.current && match.match && match.currentType !== match.matchType)
          }'
        >
          <EditSelect
            :modelValue.sync='match.current'
            :options='currentModuleItem'
            @handleItem='(opt) => changeItem(opt, match, "currentType")'
          ></EditSelect>
        </div>
        <div class='division'>=</div>
        <div
          :class='{
            "field_select": true,
            "is_error": (item.isError && !match.match) || (match.current && match.match && match.currentType !== match.matchType)
          }'
        >
          <EditSelect
            :modelValue.sync='match.match'
            :options='item.matchModuleOptions'
            @handleItem='(opt) => changeItem(opt, match, "matchType")'
          ></EditSelect>
        </div>
        <i class='iconfont icon-delete' title='删除' @click='delMatchItem(item, index)'></i>
      </div>
      <div class='add_btn' @click='addMatchItem(item)'>
        <i class='iconfont icon-tianjia'></i>
        <div class='name'>添加</div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div class='floor'>
    <div class='blank_button' @click='closeDialog'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import EditSelect from './editSelect.vue'
import {
  getAppPageModulesApi,
  addModuleLinkApi,
  updateModuleLinkApi,
  getRecordApi,
  getCanEditFieldApi
} from '@/api/analysisJudgment'
import { LINK_ICON_OPTIONS } from './config.js'
import { pinyin } from 'pinyin-pro'

export default {
  name: 'EditLink',
  components: {
    EditSelect
  },
  inject: ['successOpera', 'closeDialog', 'editModuleInfo'],
  props: {
    currentMode: {
      type: String,
      default: ''
    },
    // 当前页面信息和其他页面信息
    pageInfo: {
      type: Object
    },
    // 编辑时的相关信息
    editInfo: {
      type: Array
    },
    operaPerRecordId: {
      type: Number
    },
  },
  data () {
    return {
      activeLink: '', // 当前激活的链接
      iconOptions: Object.freeze(LINK_ICON_OPTIONS), // 图标选择选项
      linksInfo: [], // 链接信息
      defaultLinkType: '', // 默认按键类型
      currentModuleItem: [], // 当前容器展示的字段
      matchModuleObj: {}, // 匹配页面对应匹配容器可选项
      matchFieldObj: {}, // 匹配容器对应可选字段
      linkNameList: [], // 链接名称
      fieldObj: {}, // 字段对应类型
      loading: false
    }
  },
  computed: {
    iconTypeDisabled () {
      return this.currentMode === 'detail'
    },
    // 当前编辑页的页面信息
    currentPageInfo () {
      return this.pageInfo.page.currentPageInfo
    },
    // 匹配页面选项(根据匹配页面选项获取匹配容器的信息)
    matchPages () {
      return this.pageInfo.page.pageList
    },
    // 全部链接已经匹配的字段
    /*linkCurrentField () {
      if (!this.linksInfo.length) return []
      let result = []
      this.linksInfo.forEach(item => {
        item.matchInfo.forEach(match => {
          if (match.current) result.push(match.current)
        })
      })
      return [...new Set(result)]
    }*/
  },
  created () {
    if (this.currentMode === 'list') {
      this.defaultLinkType = 'icon'
    } else {
      this.defaultLinkType = 'text'
    }
    this.currentModuleItem = this.pageInfo.canEditField.filter(item => item.type)
    this.currentModuleItem.forEach(item => {
      this.fieldObj[item.fieldNameEn] = item.fieldType
    })
    if (this.editInfo) {
      this.loading = true
      let getDataList = []
      let errorLink = []
      let successLink = []
      let errorPage = []
      let errorModule = []
      this.editInfo.forEach(item => {
        if (this.matchPages.findIndex(page => page.id === item.linkPageId) === -1) {
          errorLink.push(item.name)
          errorPage.push(item.id)
        } else {
          successLink.push(item)
          getDataList.push(this.getAppPageMData(item.linkPageId))
        }
      })
      Promise.all(getDataList.map(module => module.catch(() => []))).then(res => {
        let getFieldList = []
        res.forEach((item, index) => {
          if (item.findIndex(module => module.id === successLink[index].linkContainerId) === -1) {
            errorLink.push(successLink[index].name)
            errorModule.push(successLink[index].linkContainerId)
          } else {
            getFieldList.push(this.getMatchModuleField(successLink[index].linkContainerId, '', false))
          }
        })
        Promise.all(getFieldList.map(field => field.catch(() => []))).then(() => {
          this.editInfo.forEach(item => {
            let value = {
              id: item.id,
              linkName: item.name,
              linkKey: item.id + '',
              type: item.keyType,
              icon: item.keyIcon,
              matchPage: errorPage.includes(item.id) ? '' : item.linkPageId,
              matchModule: errorPage.includes(item.id) || errorModule.includes(item.linkContainerId) ? '' : item.linkContainerId,
              isError: false,
              matchPageModuleOptions: this.matchModuleObj[item.linkPageId] || [],
              matchModuleOptions: this.matchFieldObj[item.linkContainerId] || []
            }
            value.matchInfo = []
            item.list.forEach(match => {
              let matchLink = this.matchFieldObj[item.linkContainerId] && this.matchFieldObj[item.linkContainerId].find(field => field.fieldNameEn === match.linkField)
              value.matchInfo.push({
                id: match.id,
                linkId: match.linkId,
                current: match.currentField,
                match: errorPage.includes(item.id) || errorModule.includes(item.linkContainerId) ? '' : matchLink ? match.linkField : '',
                currentType: this.fieldObj[match.currentField] || '',
                matchType: errorPage.includes(item.id) || errorModule.includes(item.linkContainerId) ? '' : matchLink ? this.fieldObj[match.linkField] || '' : ''
              })
            })
            this.linksInfo.push(value)
          })
          this.activeLink = this.linksInfo[0].linkKey
          this.loading = false
        })
      })
    } else {
      this.linksInfo.push({
        linkKey: 'link1',
        linkName: '链接1',
        type: this.defaultLinkType,
        icon: 'detail',
        matchPage: '',
        matchModule: '',
        matchInfo: [
          { current: '', match: '', currentType: '', matchType: '' }
        ],
        isError: false,
        matchPageModuleOptions: [],
        matchModuleOptions: []
      })
      this.linkNameList = ['链接1']
      this.activeLink = this.linksInfo[0].linkKey
    }
  },
  methods: {
    // 添加链接
    addLink () {
      let linkName = null
      const getPageName = (defaultNum) => {
        let name = '链接' + defaultNum
        if (this.linkNameList.includes(name)) {
          getPageName(defaultNum + 1)
        } else {
          linkName = name
        }
      }
      getPageName(this.linksInfo.length + 1)
      this.linksInfo.push({
        linkKey: pinyin(linkName, { toneType: 'none', type: 'array' }).join('_'),
        linkName: linkName,
        type: this.defaultLinkType,
        icon: 'detail',
        matchPage: '',
        matchModule: '',
        matchInfo: [
          { current: '', match: '', currentType: '', matchType: '' }
        ],
        isError: false,
        matchPageModuleOptions: [],
        matchModuleOptions: []
      })
      this.linkNameList.push(linkName)
    },
    // 删除链接
    delLink () {
      if (this.linksInfo.length < 2) return
      let currentLink = this.linksInfo.findIndex(item => item.linkKey === this.activeLink)
      this.$policeComfirm(`链接删除后不可恢复，是否继续操作？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.linksInfo.splice(currentLink, 1)
        if (this.linksInfo[currentLink]) {
          this.activeLink = this.linksInfo[currentLink].linkKey
        } else {
          this.activeLink = this.linksInfo[0].linkKey
        }
      })
    },
    // 添加链接字段匹配
    addMatchItem (item) {
      item.matchInfo.push({ current: '', match: '', currentType: '', matchType: '' })
    },
    // 删除链接字段匹配
    delMatchItem (item, ind) {
      item.matchInfo.splice(ind, 1)
    },
    // 当前字段和匹配字段更改时
    changeItem (opt, item, way) {
      item[way] = opt.fieldType
    },
    // 匹配页面更改时
    matchPageChange (value, item) {
      item.matchModule = ''
      item.matchInfo = [
        { current: '', match: '', currentType: '', matchType: '' }
      ]
      item.matchModuleOptions = []
      if (!this.matchModuleObj[value]) {
        this.getAppPageMData(value).then(() => {
          item.matchPageModuleOptions = this.matchModuleObj[value] || []
        })
      } else {
        item.matchPageModuleOptions = this.matchModuleObj[value]
      }
    },
    getAppPageMData (pageId) {
      return new Promise((resolve, reject) => {
        getAppPageModulesApi({
          appId: this.$route.query.appId,
          pageId: pageId
        }).then(res => {
          let result = res || []
          const algorithmType = ['decision_tree','random_forest']
          result = result.filter(item => !item.algorithmFlag && !algorithmType.includes(item.algorithmType))
          if (pageId === this.currentPageInfo.pageId) {
            result = result.filter(item => item.id !== +this.editModuleInfo.i)
          }
          this.matchModuleObj[pageId] = result
          resolve(result)
        }).catch(() => {
          reject([])
        })
      })
    },
    // 匹配容器更改时
    matchModuleChange (value, item) {
      item.matchInfo = [
        { current: '', match: '', currentType: '', matchType: '' }
      ]
      item.matchModuleOptions = []
      if (!this.matchFieldObj[value]) {
        this.getMatchModuleRecord(value, item)
      } else {
        item.matchModuleOptions = this.matchFieldObj[value]
      }
    },
    // 获取匹配容器的操作记录
    getMatchModuleRecord (moduleId, item) {
      getRecordApi({
        containerId: moduleId
      }).then(res => {
        let result = (res || []).filter(item => item.status === 'normal')
        if (result.length) this.getMatchModuleField(moduleId, result[result.length - 1].id, item)
      })
    },
    // 获取匹配容器可选字段
    getMatchModuleField (moduleId, recordId, item) {
      return new Promise((resolve, reject) => {
        getCanEditFieldApi({
          containerId: moduleId,
          recordId: recordId
        }).then(res => {
          let result = res || []
          result.forEach(item => {
            this.fieldObj[item.fieldNameEn] = item.fieldType
            item.label = item.fieldNameCn
            item.value = item.fieldNameEn
            item.type = ''
            item.icon = ''
            if (item.fieldType === 'STRING') {
              item.type = 'text'
              item.icon = 'icon-a-zu5742'
            } else if (item.fieldType === 'BIGINT') {
              item.type = 'number'
              item.icon = 'icon-a-zu5757'
            } else if (item.fieldType === 'TIMESTAMP') {
              item.type = 'time'
              item.icon = 'icon-a-zu5759'
            }
          })
          this.matchFieldObj[moduleId] = result
          if (item) item.matchModuleOptions = this.matchFieldObj[moduleId]
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    submit () {
      let errorNum = 0
      let noMatch = []
      for (let i = 0; i < this.linksInfo.length; i++) {
        if (
          (this.linksInfo[i].type === 'icon' && !this.linksInfo[i].icon) ||
          (!this.linksInfo[i].matchPage) ||
          (!this.linksInfo[i].matchModule) ||
          (this.linksInfo[i].matchInfo.some(item => !item.current || !item.match)) ||
          (this.linksInfo[i].matchInfo.some(item => item.current && item.match && item.currentType !== item.matchType))
        ) {
          this.linksInfo[i].isError = true
          errorNum += 1
          continue
        }
        if (!this.linksInfo[i].matchInfo.length) {
          this.linksInfo[i].isError = true
          noMatch.push(`“${this.linksInfo[i].linkName}”`)
        }
      }
      if (errorNum) return
      if (noMatch.length) {
        this.$message.error(`链接${noMatch.join('，')}未添加匹配字段！`)
        return
      }
      let list = []
      this.linksInfo.forEach(item => {
        let matchList = []
        let value = {
          keyType: item.type,
          keyIcon: item.type === 'icon' ? item.icon : '',
          linkPageId: item.matchPage,
          linkContainerId: item.matchModule,
          name: item.linkName
        }
        item.matchInfo.forEach(match =>  {
          let matchValue = {
            currentField: match.current,
            linkField: match.match
          }
          if (match.id && match.linkId) {
            matchValue['id'] = match.id
            matchValue['linkId'] = match.linkId
          }
          matchList.push(matchValue)
        })
        value.list = matchList
        if (item.id) value.id = item.id
        list.push(value)
      })
      let requestApi = addModuleLinkApi
      let successTip = '添加'
      let params = {
        containerId: +this.editModuleInfo.i,
        perRecordId: this.operaPerRecordId,
        list
      }
      if (this.editInfo && this.editInfo.length) {
        params.recordId = this.editInfo[0].recordId
        requestApi = updateModuleLinkApi
        successTip = '编辑'
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}链接成功！`)
        this.successOpera()
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_link_wrap {
  position: relative;
  width: 100%;
  min-height: 422px;
  .link_page_opera {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 128px;
    height: 30px;
    right: 0;
    border-bottom: 1px solid rgba(81, 92, 124, .5);
    .link_opera {
      font-size: 14px;
      line-height: 30px;
      color: var(--active-color);
      cursor: pointer;
      i {
        font-size: 16px;
        margin-right: 8px;
        color: var(--active-color);
      }
      .tip {
        float: right;
      }
      &.is_disabled {
        color: var(--base-text-color-9);
        cursor: not-allowed;
        i {
          color: var(--base-text-color-9);
        }
      }
    }
  }
  /deep/.el-tabs {
    .el-tabs__header {
      width: calc(100% - 128px);
      margin-bottom: 12px;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      padding: 0 12px 8px;
      text-align: center;
      font-size: 16px;
      height: 30px;
      line-height: 21px;
      &.is-active {
        color: var(--active-color);
        border-bottom: 1px solid var(--active-color);
      }
      &:hover {
        color: var(--active-color);
      }
    }
  }
  .fill_item {
    position: relative;
    display: flex;
    //align-items: center;
    width: 100%;
    .label {
      flex: none;
      font-size: 16px;
      line-height: 32px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
      margin-right: 12px;
    }
    .error_tip {
      position: absolute;
      bottom: -14px;
      left: 92px;
      font-size: 12px;
      line-height: 12px;
      color: @font-color-4;
    }
    /deep/.el-radio-group {
      display: flex;
      .el-radio {
        display: flex;
        align-items: center;
        color: var(--base-text-color-1);
        margin-right: 24px;
        .el-radio__label {
          font-size: 16px;
          line-height: 21px;
          padding-left: 8px;
        }
        .el-radio__inner {
          width: 16px;
          height: 16px;
          border-color: var(--base-text-color-to-666666);
          &:hover {
            border-color: var(--active-color);
          }
          &::after {
            background-color: var(--active-color);
          }
        }
        .el-radio__input.is-checked .el-radio__inner {
          border-color: var(--active-color);
        }
      }
    }
    /deep/.el-input {
      height: 32px;
      line-height: 32px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        border-color: var(--border-color-input);
        font-size: 14px;
        &:hover {
          border-color: var(--border-color-input-hover);
        }
      }
      .el-input__suffix {
        height: 30px;
      }
    }
    .icon_select {
      width: 220px;
    }
    .match_select {
      width: 148px;
    }
  }
  .fill_type {
    margin-bottom: 16px;
  }
  .match_title {
    font-size: 16px;
    line-height: 21px;
    margin-top: 24px;
    margin-bottom: 16px;
    color: var(--base-text-color-to-666666);
  }
  .match_item {
    display: flex;
    flex-wrap: nowrap;
    //align-items: center;
    padding: 0 8px 0 16px;
    margin-bottom: 12px;
    .current_info {
      display: flex;
      flex: 1;
      font-size: 16px;
      line-height: 32px;
      white-space: nowrap;
      .label {
        margin-right: 12px;
      }
      .info {
        float: right;
        color: var(--base-text-color-1);
        white-space: pre-wrap;
      }
    }
    .fill_item {
      flex: 1;
    }
  }
  .match_item_tip {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    padding: 0 8px 0 16px;
    margin-bottom: 18px;
    margin-top: 18px;
    .tip {
      flex: 1;
      color: var(--base-text-color-to-666666);
    }
  }
  .col_info {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 8px 0 16px;
    margin-bottom: 12px;
    .field_select {
      flex: 1;
      margin-right: 0;
      &.is_error {
        /deep/.el-select {
          .el-input__inner {
            border-color: var(--border-color-input-error) !important;
            color: #FF106E;
          }
        }
      }
    }
    /*/deep/.sort_item {
      flex: 1;
      margin-right: 0;
    }*/
    .division {
      flex: none;
      font-size: 12px;
      margin: 0 8px;
      color: var(--base-text-color-to-666666);
    }
    i {
      flex: none;
      font-size: 16px;
      line-height: 16px;
      margin-left: 8px;
      cursor: pointer;
      color: var(--base-text-color-to-666666);
    }
  }
  .add_btn {
    width: 52px;
    font-size: 14px;
    line-height: 19px;
    color: var(--active-color);
    cursor: pointer;
    white-space: nowrap;
    padding: 0 8px 0 16px;
    i {
      font-size: 16px;
      color: var(--active-color);
      margin-right: 8px;
      float: left;
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
/deep/.el-select {
  .el-input__inner {
    padding-right: 30px !important;
  }
}
</style>
