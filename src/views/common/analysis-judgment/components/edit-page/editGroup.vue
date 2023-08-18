<template>
<div class='edit_group_wrap'>
  <div class='fill_item'>
    <div class='label'>列名称：</div>
    <el-input v-model.trim="fillInfo.colName" placeholder="请输入列名称" class='col_name' @change='colNameChange' maxlength='30'></el-input>
    <div v-show='nameError' class='error_tip'>列名称不可为空</div>
  </div>
  <div class='fill_item'>
    <div class='label'>分组列：</div>
    <EditSelect
      class='col_group'
      :modelValue.sync='fillInfo.colGroup'
      :options='fieldOptions'
      @handleItem='changeItem'
      @selectChange='colChange'
    ></EditSelect>
    <div v-show='groupError' class='error_tip'>分组列不可为空</div>
  </div>
  <div class='group_filter'>
    <div class='filter_wrap'>
      <template
        v-if='currentItemType && currentItemType === "number"'
      >
        <div
          v-for='(item, index) in fillInfo.filterList'
          :key='index'
          class='number_rule'
        >
          <div class='filter_item'>
            <el-input v-model.trim="item.groupName" placeholder="请输入分组名称" class='group_name'></el-input>
            <el-input
              v-model.trim="item.leftValue"
              placeholder="请输入"
              :class='{
                "group_flex": true,
                "is_error": item.isError
              }'
              @input='numberInput(item, "leftValue")'
            ></el-input>
            <el-select v-model="item.leftWay" placeholder="请选择" class='number_filter' @change='numberWayChange(item)'>
              <el-option
                v-for='opt in numberOptions'
                :key='opt.value'
                :label='opt.label'
                :value='opt.value'
              ></el-option>
            </el-select>
            <div class='tip'>值</div>
            <el-select v-model="item.rightWay" placeholder="请选择" class='number_filter number_filter_right' @change='numberWayChange(item)'>
              <el-option
                v-for='opt in numberOptions'
                :key='opt.value'
                :label='opt.label'
                :value='opt.value'
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="item.rightValue"
              placeholder="请输入"
              :class='{
                "group_flex": true,
                "is_error": item.isError
              }'
              @input='numberInput(item, "rightValue")'
            ></el-input>
            <i class='iconfont icon-delete' title='删除' @click='delFilterItem(index)'></i>
          </div>
          <div v-show='item.isError' class='number_error'>{{ item.errorMessage }}</div>
        </div>
      </template>
      <template v-else-if='currentItemType && currentItemType === "text"'>
        <div
          v-for='(item, index) in fillInfo.filterList'
          :key='index'
          class='filter_item'>
          <el-input v-model.trim="item.groupName" placeholder="请输入分组名称" class='group_name'></el-input>
          <el-input v-model.trim="item.groupValue" placeholder="请输入" class='group_flex'></el-input>
          <i class='iconfont icon-delete' title='删除' @click='delFilterItem(index)'></i>
        </div>
      </template>
      <template v-else>
        <div
          v-for='(item, index) in fillInfo.filterList'
          :key='index'
          class='filter_item'>
          <el-input v-model.trim="item.groupName" placeholder="请输入分组名称" class='group_name'></el-input>
          <el-date-picker
            class='filter_value'
            v-model="item.groupValue"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format='timestamp'
            prefix-icon='el-icon-date'
            :editable='false'
          >
          </el-date-picker>
          <i class='iconfont icon-delete' title='删除' @click='delFilterItem(index)'></i>
        </div>
      </template>
    </div>
    <div class='add_btn' @click='addFilterItem' :class='{ "is_disabled": !currentItemType }'>
      <i class='iconfont icon-tianjia'></i>
      <div class='name'>添加分组</div>
    </div>
  </div>
  <div class='fill_item'>
    <div class='checkbox' :class='{ "active": fillInfo.otherCheck }' @click='otherClick'></div>
    <div class='label'>未分组的值分到：</div>
    <el-input v-model.trim="fillInfo.otherGroup" placeholder="请输入" class='other_input'></el-input>
    <div v-show='noGroupError' class='error_tip other_error' @change='otherChange'>未分组名称不可为空</div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='closeDialog'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import EditSelect from './editSelect.vue'
import {
  addModuleGroupApi,
  updateModuleGroupApi
} from '@/api/analysisJudgment'
import { toPinYin } from './config.js'

const NUMBER_RANGE_OPTIONS = [
  { label: '<', value: 'less' },
  { label: '<=', value: 'lessOrEqual' }
]

export default {
  name: 'EditGroup',
  inject: ['closeDialog', 'editModuleInfo', 'successOpera'],
  props: {
    canEditField: {
      type: Array,
      default: () => []
    },
    // 编辑的信息
    editInfo: {
      type: Object
    },
    operaPerRecordId: {
      type: Number
    }
  },
  components: {
    EditSelect
  },
  data () {
    return {
      fillInfo: {
        colName: '',
        colGroup: '',
        otherGroup: '其他',
        otherCheck: false,
        filterList: []
      },
      fieldOptions: [], // 排序字段选项（text：文本，number：数字，time：时间）
      currentItemType: '', // 当前分组列字段的类型
      currentItemFieldType: '',
      numberOptions: Object.freeze(NUMBER_RANGE_OPTIONS), // 字段类型为数字且过滤方式为介于和不介于时，数值范围下拉框选项
      nameError: false,
      groupError: false,
      noGroupError: false
    }
  },
  mounted () {
    this.fieldOptions = this.canEditField.filter(item => item.type)
    if (this.editInfo) {
      this.fillInfo.colName = this.editInfo.groupFieldCn
      this.fillInfo.colGroup = this.editInfo.groupColumn
      this.fillInfo.otherGroup = this.editInfo.ungroupedName
      this.fillInfo.otherCheck = this.editInfo.ungroupedSelect === 'select'
      this.currentItemFieldType = this.editInfo.groupColumnType
      if (this.currentItemFieldType === 'STRING') {
        this.currentItemType = 'text'
      } else if (this.currentItemFieldType === 'BIGINT') {
        this.currentItemType = 'number'
      } else if (this.currentItemFieldType === 'TIMESTAMP') {
        this.currentItemType = 'time'
      }
      if (this.currentItemType === 'number') {
        this.editInfo.list.forEach(item => {
          const value = item.groupContent.slice(1, -1).split(',')
          this.fillInfo.filterList.push({
            groupName: item.groupName,
            groupId: item.groupId,
            id: item.id,
            leftWay: item.groupContent.slice(0, 1) === '[' ? 'lessOrEqual' : 'less',
            leftValue: value[0],
            rightWay: item.groupContent.slice(-1) === ']' ? 'lessOrEqual' : 'less',
            rightValue: value[1],
            isError: false,
            errorMessage: ''
          })
        })
      } else if (this.currentItemType === 'text') {
        this.editInfo.list.forEach(item => {
          this.fillInfo.filterList.push({
            groupName: item.groupName,
            groupValue: item.groupContent,
            groupId: item.groupId,
            id: item.id
          })
        })
      } else if (this.currentItemType === 'time') {
        this.editInfo.list.forEach(item => {
          this.fillInfo.filterList.push({
            groupName: item.groupName,
            groupValue: item.groupContent.slice(1, -1).split(','),
            groupId: item.groupId,
            id: item.id
          })
        })
      }
    }
  },
  methods: {
    // 列名称修改
    colNameChange (value) {
      this.nameError = !value
    },
    // 未分组名称修改
    otherChange (value) {
      this.noGroupError = !value
    },
    // 分组列选项点击时
    changeItem (opt) {
      this.currentItemType = opt.type
      this.currentItemFieldType = opt.fieldType
    },
    // 分组列更改时
    colChange () {
      this.groupError = !this.fillInfo.colGroup
      this.fillInfo.filterList = []
    },
    // 添加分组
    addFilterItem () {
      if (!this.currentItemType) return
      if (this.currentItemType === 'number') {
        this.fillInfo.filterList.push({
          groupName: '',
          leftValue: '',
          leftWay: 'less',
          rightWay: 'less',
          rightValue: '',
          isError: false,
          errorMessage: ''
        })
      } else {
        this.fillInfo.filterList.push({
          groupName: '',
          groupValue: ''
        })
      }
    },
    // 删除分组
    delFilterItem (ind) {
      this.fillInfo.filterList.splice(ind, 1)
    },
    // 未分组的值是否分到统一的分组
    otherClick () {
      this.fillInfo.otherCheck = !this.fillInfo.otherCheck
    },
    // 当分组列为数字时 分组数值发生改变时
    numberInput (item, value) {
      item[value] = item[value].length && item[value][0] === '-' ?
        item[value][0] + item[value].slice(1).replace(/\D*(\d*(?:\.\d{0,2})?).*$/g,'$1') :
        item[value].replace(/\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')
      if (item.leftValue === '-' || item.rightValue === '-') {
        item.isError = true
        return
      } else {
        item.isError = false
        item.errorMessage = ''
      }
      if (!item.leftValue || !item.rightValue) {
        item.isError = false
        return
      }
      item.isError = +item.leftValue > +item.rightValue
      if (item.isError) {
        item.errorMessage = '请保证前面的数值小于/等于后面的数值'
        return
      }
      if (
        +item.leftValue === +item.rightValue &&
        (item.leftWay !== 'lessOrEqual' || item.rightWay !== 'lessOrEqual')
      ) {
        item.isError = true
        item.errorMessage = '前后值相等，请将操作符改为“<=”'
      } else {
        item.isError = false
        item.errorMessage = ''
      }
    },
    // 当分组列为数字时 分组下拉发生改变时
    numberWayChange (item) {
      if (!item.leftValue || !item.rightValue || +item.leftValue !== +item.rightValue) return
      if (item.leftWay !== 'lessOrEqual' || item.rightWay !== 'lessOrEqual') {
        item.isError = true
        item.errorMessage = '前后值相等，请将操作符改为“<=”'
      } else {
        item.isError = false
        item.errorMessage = ''
      }
    },
    submit () {
      if (!this.fillInfo.colName) {
        this.nameError = true
        return
      }
      if (!this.fillInfo.colGroup) {
        this.groupError = true
        return
      }
      if (this.fillInfo.otherCheck && !this.fillInfo.otherGroup) {
        this.noGroupError = true
        return
      }
      if (this.currentItemType === 'number' && this.fillInfo.filterList.some(item => item.isError)) {
        this.$message.error('分组信息有误！')
        return
      }
      if (!this.fillInfo.otherCheck && !this.fillInfo.filterList.length) {
        this.$message.error('请添加分组！')
        return
      }
      const submitGroup = this.currentItemType === 'number' ?
        this.fillInfo.filterList.filter(item => item.groupName && item.leftValue && item.rightValue) :
        this.fillInfo.filterList.filter(item => item.groupName && item.groupValue)
      if (!this.fillInfo.otherCheck && !submitGroup.length) {
        this.$message.error('请补充分组信息！')
        return
      }
      let requestApi = addModuleGroupApi
      let successTip = '添加'
      let params = {
        containerId: +this.editModuleInfo.i,
        groupColumn: this.fillInfo.colGroup,
        groupColumnType: this.currentItemFieldType,
        groupFieldCn: this.fillInfo.colName,
        ungroupedName: this.fillInfo.otherGroup,
        ungroupedSelect: this.fillInfo.otherCheck ? 'select' : 'unselect',
        perRecordId: this.operaPerRecordId
      }
      if (this.currentItemType === 'number') {
        params['list'] = this.formatNumberList(submitGroup)
      } else if (this.currentItemType === 'text') {
        params['list'] = this.formatTextList(submitGroup)
      } else {
        params['list'] = this.formatTimeList(submitGroup)
      }
      if (this.editInfo) {
        params['id'] = this.editInfo.id
        params['groupFieldEn'] = this.editInfo.groupFieldEn
        params['recordId'] = this.editInfo.recordId
        requestApi = updateModuleGroupApi
        successTip = '编辑'
      } else {
        params['groupFieldEn'] = toPinYin(this.fillInfo.colName)
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}分组成功！`)
        this.successOpera()
      })
    },
    // 当分组字段为数字时 分组规则列表格式化
    formatNumberList (list) {
      return list.map(item => {
        const left = item.leftWay === 'less' ? '(' : '['
        const right = item.rightWay === 'less' ? ')' : ']'
        let result = {
          groupName: item.groupName,
          groupContent: `${left}${item.leftValue},${item.rightValue}${right}`
        }
        if (item.groupId && item.id) {
          result['groupId'] = item.groupId
          result['id'] = item.id
        }
        return result
      })
    },
    // 当分组字段为文本时 分组规则列表格式化
    formatTextList (list) {
      return list.map(item => {
        let result = {
          groupName: item.groupName,
          groupContent: item.groupValue
        }
        if (item.groupId && item.id) {
          result['groupId'] = item.groupId
          result['id'] = item.id
        }
        return result
      })
    },
    // 当分组字段为时间时 分组规则列表格式化
    formatTimeList (list) {
      return list.map(item => {
        let result = {
          groupName: item.groupName,
          groupContent: `[${item.groupValue[0]},${item.groupValue[1]}]`
        }
        if (item.groupId && item.id) {
          result['groupId'] = item.groupId
          result['id'] = item.id
        }
        return result
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_group_wrap {
  width: 100%;
  height: 100%;
  .fill_item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    .label {
      flex: none;
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
      white-space: nowrap;
      margin-right: 12px;
    }
    .col_name {
      width: 320px;
    }
    .col_group {
      width: 220px;
    }
    .other_input {
      width: 80px;
    }
    .checkbox {
      flex: none;
      position: relative;
      width: 16px;
      height: 16px;
      border: 1px solid var(--checkbox-border);
      border-radius: 2px;
      margin-right: 6px;
      cursor: pointer;
      &.active {
        background: var(--active-color);
        border: 1px solid var(--active-color);
        &::after {
          content: '';
          box-sizing: content-box;
          border: 1px solid #FFFFFF;
          border-left: 0;
          border-top: 0;
          height: 7px;
          width: 3px;
          transform: rotate(45deg) scaleY(1);
          position: absolute;
          top: 2px;
          left: 5px;
        }
      }
    }
    .error_tip {
      position: absolute;
      bottom: -12px;
      left: 76px;
      font-size: 12px;
      line-height: 12px;
      color: @font-color-4;
    }
    .other_error {
      left: 162px;
    }
  }
  .group_filter {
    width: 100%;
    height: 270px;
    padding: 16px 0;
    border: 1px solid var(--border-color-input);
    border-radius: 2px;
    margin-bottom: 12px;
    .filter_wrap {
      height: calc(100% - 31px);
      overflow-y: auto;
      padding: 0 16px;
      .filter_item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .group_name {
          flex: none;
          width: 150px;
          margin-right: 12px;
        }
        .number_filter {
          flex: none;
          width: 64px;
          margin-left: 12px;
        }
        .number_filter_right {
          margin-left: 0;
          margin-right: 12px;
        }
        .tip {
          flex: none;
          width: 38px;
          font-size: 14px;
          color: var(--base-text-color-to-666666);
          text-align: center;
        }
        i {
          flex: none;
          font-size: 16px;
          color: var(--base-text-color-to-666666);
          margin-left: 8px;
          cursor: pointer;
        }
        .group_flex {
          flex: 1;
        }
        .is_error {
          /deep/.el-input__inner {
            border-color: var(--border-color-input-error) !important;
            color: #FF106E !important;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .number_rule {
        margin-bottom: 12px;
        .filter_item {
          margin-bottom: 0;
        }
        .number_error {
          margin-top: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 14px;
          color: @font-color-4;
        }
      }
    }
    .add_btn {
      width: 52px;
      font-size: 14px;
      line-height: 19px;
      color: var(--active-color);
      cursor: pointer;
      white-space: nowrap;
      margin-top: 12px;
      margin-left: 16px;
      i {
        font-size: 16px;
        margin-right: 8px;
        float: left;
      }
      &.is_disabled {
        color: var(--base-text-color-9);
        cursor: not-allowed;
      }
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
/deep/.el-date-editor {
  height: 32px;
  line-height: 32px;
  .el-input__icon {
    font-size: 14px;
    line-height: 32px;
    color: var(--base-text-color-to-666666);
  }
  .el-icon-circle-close {
    margin-top: 0;
    font-size: 14px;
  }
}
/deep/.el-range-editor.el-input__inner {
  padding: 0 12px;
  box-sizing: border-box;
  .el-icon-date {
    position: absolute;
    right: 0px;
  }
  .el-range-input {
    font-size: 14px;
    color: var(--base-text-color-1);
    &::placeholder {
      font-size: 14px;
    }
  }
}
</style>
