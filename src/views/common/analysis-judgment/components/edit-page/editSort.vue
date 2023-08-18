<template>
<div class='edit_sort_wrap'>
  <div class='tip'>排序规则：</div>
  <div class='rules_wrap'>
    <div
      v-for='(item, index) in rulesList'
      :key='index'
      class='rule_item'
    >
      <EditSelect
        :modelValue.sync='item.sortItem'
        :options='sortOptions'
        @visibleChange='(bool) => visibleChange(item, bool)'
      ></EditSelect>
      <el-select v-model="item.type" placeholder="请选择" class='sort_type'>
        <el-option
          v-for='opt in sortType'
          :key='opt.value'
          :label='opt.label'
          :value='opt.value'
        ></el-option>
      </el-select>
      <i class='iconfont icon-delete' title='删除' @click='delRule(index)'></i>
    </div>
  </div>
  <div class='add_btn' @click='addRule'>
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
  addModuleSortApi,
  updateModuleSortApi
} from '@/api/analysisJudgment'

const SORT_TYPE = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' }
]

export default {
  name: 'EditSort',
  components: {
    EditSelect
  },
  inject: [
    'successOpera',
    'closeDialog',
    'editModuleInfo'
  ],
  props: {
    // 编辑时的信息
    editInfo: {
      type: Array
    },
    canEditField: {
      type: Array,
      default: () => []
    },
    operaPerRecordId: {
      type: Number
    }
  },
  data () {
    return {
      sortOptions: [], // 排序字段选项（text：文本，number：数字，time：时间）
      sortType: Object.freeze(SORT_TYPE), // 规则选项
      rulesList: []
    }
  },
  mounted () {
    this.sortOptions = this.canEditField.map(item => {
      if (item.type) {
        return {
          ...item,
          disabled: false
        }
      }
    })
    if (this.editInfo && this.editInfo.length) {
      this.editInfo.forEach(item => {
        this.rulesList.push({
          id: item.id,
          sortItem: item.sortField,
          type: item.sortType
        })
      })
    } else {
      this.rulesList.push({ sortItem: '', type: 'asc' })
    }
  },
  methods: {
    // 添加排序规则
    addRule () {
      this.rulesList.push({
        sortItem: '',
        type: 'asc'
      })
    },
    // 删除排序规则
    delRule (ind) {
      this.rulesList.splice(ind, 1)
    },
    // 字段选择框下拉显示时
    visibleChange (item, bool) {
      if (!bool || !this.rulesList.some(rule => rule.sortItem)) return
      this.sortOptions.forEach(opt => {
        opt.disabled = false
      })
      this.rulesList.forEach(rule => {
        if (rule.sortItem && rule.sortItem !== item.sortItem) {
          const ind = this.sortOptions.findIndex(opt => opt.value === rule.sortItem)
          ind > -1 && (this.sortOptions[ind].disabled = true)
        }
      })
    },
    submit () {
      let paramList = []
      this.rulesList.forEach((item, index) => {
        if (item.sortItem) {
          let value = {
            sortField: item.sortItem,
            sortType: item.type,
            sortIndex: index + 1
          }
          if (item.id) value.id = item.id
          paramList.push(value)
        }
      })
      if (!paramList.length) {
        this.closeDialog()
        return
      }
      let requestApi = addModuleSortApi
      let successTip = '添加'
      let params = {
        containerId: +this.editModuleInfo.i,
        list: paramList,
        perRecordId: this.operaPerRecordId
      }
      if (this.editInfo && this.editInfo.length) {
        params['recordId'] = this.editInfo[0].recordId
        requestApi = updateModuleSortApi
        successTip = '编辑'
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}排序成功！`)
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
.edit_sort_wrap {
  width: 100%;
  height: 100%;
  .tip {
    font-size: 16px;
    line-height: 21px;
    color: var(--base-text-color-to-666666);
    white-space: nowrap;
    margin-bottom: 16px;
  }
  .rules_wrap {
    width: 100%;
    padding-right: 8px;
    .rule_item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      /deep/.el-input {
        height: 32px;
        line-height: 32px;
        .el-input__inner {
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
      }
      .sort_type {
        flex: none;
        width: 94px;
        margin-right: 8px;
        .el-input {
          width: 100%;
        }
      }
      i {
        width: 16px;
        font-size: 16px;
        line-height: 16px;
        color: var(--base-text-color-to-666666);
        cursor: pointer;
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
</style>
