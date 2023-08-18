<template>
<div class='edit_filter_wrap'>
  <div
    v-for='(item, index) in filterRuleLists'
    :key='index'
    class='filter_item_wrap'
  >
    <div class='filter_item'>
      <div class='index'>{{ index + 1 + '、' }}</div>
      <EditSelect
        class='filter_field'
        :modelValue.sync='item.item'
        :options='filterItem'
        @handleItem='(opt) => changeItem(item, opt)'
        @selectChange='filterItemChange(item)'
      ></EditSelect>
      <!--    过滤方式下拉框-->
      <el-select v-model="item.rule" placeholder="请选择" class='filter_way'>
        <el-option
          v-for='opt in item.filterWayOptions'
          :key='opt.value'
          :label='opt.label'
          :value='opt.value'
          @click.native='wayOptionClick(item, opt)'
        ></el-option>
      </el-select>
<!--      <el-select
        v-if='item.filterType === "select" || !item.rule'
        v-model="item.filterValue"
        placeholder="请选择"
        class='filter_value'
      >
        <el-option
          v-for='opt in item.filterValueOption'
          :key='opt.value'
          :label='opt.label'
          :value='opt.value'
        ></el-option>
      </el-select>-->
      <el-input
        v-if='item.filterType === "input" || !item.rule'
        v-model.trim="item.filterValue"
        placeholder="请输入"
        class='filter_value'
        @input='filterValueInput(item)'
      >
      </el-input>
      <div v-if='item.filterType === "numberRange"' class='number_range'>
        <el-input
          v-model.trim="item.filterValue.leftValue"
          placeholder="请输入"
          :class='{
          "filter_flex": true,
          "is_error": item.filterValue.isError
        }'
          @input='numberInput(item.filterValue, "leftValue")'>
        </el-input>
        <el-select v-model="item.filterValue.leftWay" placeholder="请选择" class='number_filter' @change='numberWayChange(item.filterValue)'>
          <el-option
            v-for='opt in numberOptions'
            :key='opt.value'
            :label='opt.label'
            :value='opt.value'
          ></el-option>
        </el-select>
        <div class='tip'>值</div>
        <el-select v-model="item.filterValue.rightWay" placeholder="请选择" class='number_filter number_filter_right' @change='numberWayChange(item.filterValue)'>
          <el-option
            v-for='opt in numberOptions'
            :key='opt.value'
            :label='opt.label'
            :value='opt.value'
          ></el-option>
        </el-select>
        <el-input
          v-model.trim="item.filterValue.rightValue"
          placeholder='请输入'
          :class='{
          "filter_flex": true,
          "is_error": item.filterValue.isError
        }'
          @input='numberInput(item.filterValue, "rightValue")'>
        </el-input>
      </div>
      <el-date-picker
        v-if='item.filterType === "timeDateRange"'
        class='filter_value'
        v-model="item.filterValue"
        type="datetimerange"
        range-separator="~"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format='timestamp'
        prefix-icon='el-icon-date'
        :editable='false'
      >
      </el-date-picker>
      <el-date-picker
        v-show='item.filterType === "timeDate"'
        class='filter_value'
        v-model="item.filterValue"
        type="datetime"
        placeholder="选择日期时间"
        value-format='timestamp'
        prefix-icon='el-icon-date'
        :editable='false'
      >
      </el-date-picker>
      <el-select v-show='index !== filterRuleLists.length - 1' v-model="item.toNext" placeholder="请选择" class='filter_next'>
        <el-option label='并且' value='and'></el-option>
        <el-option label='或者' value='or'></el-option>
      </el-select>
      <i class='iconfont icon-delete' title='删除' @click='delFilter(index)'></i>
    </div>
    <div v-if='item.filterType === "numberRange" && item.filterValue.isError' class='error_tip'>{{ item.filterValue.errorMessage }}</div>
  </div>
  <div class='add_btn' @click='addFilter'>
    <i class='iconfont icon-tianjia'></i>
    <div class='name'>添加</div>
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
  addModuleFilterApi,
  updateModuleFilterApi
} from '@/api/analysisJudgment'
import {
  FILTER_OPTIONS,
  NUMBER_RANGE_OPTIONS
} from './config.js'

export default {
  name: 'EditFilter',
  inject: [
    'closeDialog',
    'editModuleInfo',
    'successOpera'
  ],
  components: {
    EditSelect,
  },
  props: {
    canEditField: {
      type: Array,
      default: () => []
    },
    // 编辑过滤信息
    editInfo: {
      type: Array
    },
    operaPerRecordId: {
      type: Number
    }
  },
  data () {
    return {
      filterItem: [], // 可以过滤的字段
      numberOptions: Object.freeze(NUMBER_RANGE_OPTIONS), // 字段类型为数字且过滤方式为介于和不介于时，数值范围下拉框选项
      filterRuleLists: [], // 过滤规则列表
      fieldTypeObj: {}, // 可选字段类型对象
    }
  },
  created () {
    this.filterItem = this.canEditField.filter(item => item.type)
    this.filterItem.forEach(item => {
      this.fieldTypeObj[item.fieldNameEn] = item.fieldType
    })
    if (this.editInfo) {
      this.editInfo.forEach((item, ind) => {
        const itemType = this.fieldTypeObj[item.filterField] || ''
        const filterWayOptions = FILTER_OPTIONS[itemType] || []
        const filterWay = filterWayOptions.find(find => find.value === item.filterCondition)
        const filterType = filterWay.inputType
        let filterValue
        if (filterType === 'numberRange') {
          const range = item.filterContent.slice(1, -1).split(',')
          filterValue = {
            leftValue: range[0],
            leftWay: item.filterContent.slice(0, 1) === '[' ? 'lessOrEqual' : 'less',
            rightValue: range[1],
            rightWay: item.filterContent.slice(-1) === ']' ? 'lessOrEqual' : 'less',
            isError: false,
            errorMessage: ''
          }
        } else if (filterType === 'timeDateRange') {
          filterValue = item.filterContent.slice(1, -1).split(',')
        } else {
          filterValue = item.filterContent
        }
        let value = {
          id: item.id,
          item: item.filterField,
          itemType,
          filterWayOptions,
          filterType,
          filterValue,
          rule: item.filterCondition,
          oldRule: item.filterCondition,
          toNext: ind === this.editInfo.length -1 ? 'and' : item.logicType
        }
        this.filterRuleLists.push(value)
      })
    } else {
      this.filterRuleLists.push({
        item: '',
        itemType: '',
        rule: '',
        oldRule: '',
        filterValue: '',
        filterType: '',
        filterWayOptions: [], // 当前过滤字段过滤方式下拉选项
        toNext: 'and'
      })
    }
  },
  methods: {
    // 添加过滤条件
    addFilter () {
      this.filterRuleLists.push({
        item: '',
        itemType: '',
        rule: '',
        oldRule: '',
        filterValue: '',
        filterType: '',
        filterWayOptions: [],
        toNext: 'and'
      })
    },
    // 删除过滤条件
    delFilter (ind) {
      this.filterRuleLists.splice(ind, 1)
    },
    // 过滤字段选项点击时
    changeItem (item, opt) {
      item.filterWayOptions = FILTER_OPTIONS[opt.fieldType] || []
      if (item.itemType !== this.fieldTypeObj[item.item]) {
        item.itemType = this.fieldTypeObj[item.item]
        item.rule = item.filterWayOptions[0].value
        item.oldRule = ''
        item.filterType = ''
        this.wayOptionClick(item, item.filterWayOptions[0])
      }
    },
    // 切换过滤字段时
    filterItemChange (item) {
      item.filterValue = ''
      // item.filterValueOption = []
    },
    // 切换过滤方式
    wayOptionClick (item, opt) {
      if (item.rule === item.oldRule) return
      item['filterType'] = opt.inputType
      item['oldRule'] = item.rule
      if (item.filterType === 'numberRange') {
        this.$set(item, 'filterValue', {
          leftValue: '',
          leftWay: 'less',
          rightValue: '',
          rightWay: 'less',
          isError: false,
          errorMessage: ''
        })
      } else {
        item.filterValue = ''
      }
    },
    // 当过滤列为数字时 过滤数值发生改变时
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
    // 当过滤列为数字时 过滤下拉发生改变时
    numberWayChange (item) {
      if (!item.leftValue || !item.rightValue || +item.leftValue !== +item.rightValue) return
      if ( item.leftWay !== 'lessOrEqual' || item.rightWay !== 'lessOrEqual') {
        item.isError = true
        item.errorMessage = '前后值相等，请将操作符改为“<=”'
      } else {
        item.isError = false
        item.errorMessage = ''
      }
    },
    // 过滤内容输入框输入时
    filterValueInput (item) {
      if (item.itemType !== 'BIGINT') return
      item.filterValue = item.filterValue.replace(/[^\d]/g,'')
    },
    submit () {
      const defaultRule = ['eq', 'ne', 'like', 'notLike', 'gt', 'ge', 'lt', 'le']
      for (let i = 0; i < this.filterRuleLists.length; i++) {
        const value = this.filterRuleLists[i]
        if (
          (!value.rule || !value.item) ||
          (i !== this.filterRuleLists.length - 1 && !value.toNext) ||
          (defaultRule.includes(value.rule) && !value.filterValue) ||
          (value.filterType === 'numberRange' && (value.filterValue.isError || (!value.filterValue.leftValue || !value.filterValue.rightValue))) ||
          (value.filterType === 'timeDateRange' && !value.filterValue.length)
        ) {
          this.$message.error('请将过滤信息补充完整！')
          return
        }
      }
      let list = []
      let requestApi = addModuleFilterApi
      let successTip = '添加'
      this.filterRuleLists.forEach((item, index) => {
        let filterContent = ''
        if (item.filterType === 'numberRange') {
          filterContent = this.formatNumberRange(item.filterValue)
        } else if (item.filterType === 'timeDateRange') {
          filterContent = `[${item.filterValue[0]},${item.filterValue[1]}]`
        } else {
          filterContent = item.filterValue
        }
        let value = {
          filterCondition: item.rule,
          filterContent,
          filterField: item.item,
          filterIndex: index + 1,
          logicType: ''
        }
        if (item.id) value.id = item.id
        if (index !== this.filterRuleLists.length - 1) value.logicType = item.toNext
        list.push(value)
      })
      let params = {
        containerId: +this.editModuleInfo.i,
        perRecordId: this.operaPerRecordId,
        list
      }
      if (this.editInfo && this.editInfo.length) {
        params['recordId'] = this.editInfo[0].recordId
        requestApi = updateModuleFilterApi
        successTip = '编辑'
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}过滤成功！`)
        this.successOpera()
      })
    },
    // 当过滤条件为数字范围时，格式化结果
    formatNumberRange (value) {
      const left = value.leftWay === 'less' ? '(' : '['
      const right = value.rightWay === 'less' ? ')' : ']'
      return `${left}${value.leftValue},${value.rightValue}${right}`
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: content-box;
}
.edit_filter_wrap {
  width: 100%;
  height: 100%;
  .filter_item {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 12px;
    .index {
      flex: none;
      width: 30px;
      font-size: 14px;
      color: var(--base-text-color-to-666666);
    }
    /deep/.el-input {
      height: 32px;
      line-height: 32px;
    }
    /deep/.el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      border-color: var(--border-color-input);
      &::placeholder {
        font-size: 14px;
      }
      &:hover {
        border-color: var(--border-color-input-hover);
      }
    }
    /deep/.el-select {
      .el-input {
        width: 100%;
      }
      .el-input__inner {
        padding: 0 30px 0 12px;
      }
    }
    /deep/.el-date-editor {
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
    .filter_way {
      width: 94px;
      margin-right: 12px;
    }
    .filter_next {
      width: 94px;
      margin-right: 8px;
    }
    .filter_value {
      width: 350px;
      margin-right: 12px;
    }
    .filter_field {
      width: 220px;
      margin-right: 12px;
    }
    .number_range {
      display: flex;
      align-items: center;
      width: 350px;
      margin-right: 12px;
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
      .filter_flex {
        flex: 1;
      }
      .is_error {
        /deep/.el-input__inner {
          border-color: var(--border-color-input-error) !important;
          color: #FF106E !important;
        }
      }
    }
    .icon-delete {
      font-size: 16px;
      line-height: 16px;
      color: var(--base-text-color-to-666666);
      cursor: pointer;
    }
  }
  .add_btn {
    width: 52px;
    font-size: 14px;
    line-height: 19px;
    color: var(--active-color);
    cursor: pointer;
    white-space: nowrap;
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
    margin-top: 32px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
.error_tip {
  margin-top: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 14px;
  color: @font-color-4;
}
</style>
