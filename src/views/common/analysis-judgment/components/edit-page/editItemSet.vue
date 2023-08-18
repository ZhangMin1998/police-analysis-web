<template>
<div class='edit_item_set_wrap'>
  <el-checkbox
    :indeterminate="isIndeterminate"
    v-model="checkAll"
    @change="handleCheckAllChange"
  >{{ dataSourceName }}</el-checkbox>
  <el-checkbox-group v-model="checkedLists" @change='handleChange'>
    <el-checkbox v-for="item in allItemList" :label="item.fieldNameEn" :key="item.fieldNameEn">
      <div class='item_info'>
        <i :class='[ "iconfont", typeIcon[item.fieldType] || "" ]' @click.prevent='showType(item)'></i>
        <div class='label'>{{ item.label }}</div>
        <div v-if='item.showTypeOpera' class='type_select'>
          <div
            v-for='type in typeOptions'
            :key='type.value'
            :class='{ "type_item": true, "active": type.value === item.fieldType }'
            @click.prevent='changeFieldType(item, type)'
          >
            <i :class='[ "iconfont", type.icon ]'></i>
            <div class='type_label'>{{ type.label }}</div>
          </div>
        </div>
      </div>
    </el-checkbox>
  </el-checkbox-group>
  <div class='floor'>
    <div class='blank_button' @click='closeDialog'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import {
  addModuleFieldApi,
  updateModuleFieldApi
} from '@/api/analysisJudgment'

const TYPE_OPTIONS = [
  { icon: 'icon-a-zu5742', label: '文本', value: 'STRING' },
  { icon: 'icon-a-zu5757', label: '数值', value: 'BIGINT' },
  { icon: 'icon-a-zu5759', label: '时间', value: 'TIMESTAMP' },
]
const TYPE_ICON = {
  'STRING': 'icon-a-zu5742',
  'BIGINT': 'icon-a-zu5757',
  'TIMESTAMP': 'icon-a-zu5759'
}

export default {
  name: 'EditItemSet',
  inject: [
    'successOpera',
    'closeDialog',
    'editModuleInfo'
  ],
  props: {
    dataSourceName: {
      type: String,
      default: ''
    },
    canEditField: {
      type: Array,
      default: () => []
    },
    operaPerRecordId: {
      type: Number
    },
    editInfo: {
      type: Array
    }
  },
  data () {
    return {
      allItemList: [], // 全部的可以选择的字段信息数组
      checkedLists: [], // 当前设置选择的字段数组
      checkAll: false, // 是否全选
      typeOptions: Object.freeze(TYPE_OPTIONS),
      typeIcon: Object.freeze(TYPE_ICON)
    }
  },
  computed: {
    isIndeterminate () {
      return !!this.checkedLists.length && this.checkedLists.length < this.allItemList.length
    }
  },
  created () {
    this.allItemList = this.canEditField.map(item => {
      return {
        ...item,
        showTypeOpera: false
      }
    })
    if (this.editInfo) {
      this.editInfo.forEach(item => {
        let findIndex = this.allItemList.findIndex(value => value.fieldNameEn === item.fieldNameEn)
        findIndex > -1 && (this.allItemList[findIndex].fieldType = item.fieldType)
        if (item.display) {
          if (findIndex > -1) this.checkedLists.push(this.allItemList[findIndex].fieldNameEn)
        }
      })
    } else {
      this.checkedLists = this.allItemList.map(item => item.fieldNameEn)
    }
    this.checkAll = this.checkedLists.length === this.allItemList.length
  },
  methods: {
    showType (item) {
      const itemShow = item.showTypeOpera
      this.allItemList.forEach(value => {
        value.showTypeOpera = false
      })
      item.showTypeOpera = !itemShow
    },
    // 切换全选选择框时
    handleCheckAllChange (val) {
      this.checkedLists = val ? this.allItemList.map(item => item.fieldNameEn) : []
    },
    // 切换选择项时
    handleChange (value) {
      this.checkAll = value.length === this.allItemList.length
    },
    // 修改字段类型
    changeFieldType (item, type) {
      if (item.fieldType !== type.value) {
        item.fieldType = type.value
      }
      item.showTypeOpera = false
    },
    submit () {
      if (!this.checkedLists.length) {
        this.$message.error('至少选择一个字段！')
        return
      }
      let paramsList = []
      this.allItemList.forEach(item => {
        let value = {
          display: this.checkedLists.includes(item.fieldNameEn),
          fieldNameEn: item.fieldNameEn,
          fieldType: item.fieldType,
        }
        if (this.editInfo && this.editInfo.length) {
          let findItem = this.editInfo.find(find => find.fieldNameEn === item.fieldNameEn)
          findItem && (value['id'] = findItem.id)
        }
        paramsList.push(value)
      })
      let requestApi = addModuleFieldApi
      let successTip = '添加'
      let params = {
        containerId: +this.editModuleInfo.i,
        list: paramsList,
        perRecordId: this.operaPerRecordId
      }
      if (this.editInfo && this.editInfo.length) {
        params.recordId = this.editInfo[0].recordId
        requestApi = updateModuleFieldApi
        successTip = '编辑'
      }
      requestApi(params).then(() => {
        this.$message.success(`${successTip}字段设置成功！`)
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
.edit_item_set_wrap {
  width: 100%;
  height: 100%;
  /deep/.el-checkbox {
    display: flex;
    align-items: center;
    .el-checkbox__input {
      height: 16px;
      line-height: 16px;
    }
    .el-checkbox__label {
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-to-666666);
    }
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      &::before {
        top: 6px;
      }
      &::after {
        top: 2px;
        left: 5px;
      }
    }
  }
  /deep/.el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    margin-left: 24px;
    .el-checkbox {
      margin-right: 40px;
      margin-bottom: 16px;
    }
    .item_info {
      position: relative;
      display: flex;
      align-items: center;
      .label {
        font-size: 14px;
        line-height: 19px;
        margin-left: 4px;
      }
      .type_select {
        position: absolute;
        top: 24px;
        left: -12px;
        min-width: 160px;
        background: var(--bg-color-8);
        box-shadow: 0 0 6px 1px var(--app-Filter-box-shadow);
        padding: 10px 0;
        border-radius: 2px;
        z-index: 10;
        .type_item {
          display: flex;
          align-items: center;
          height: 32px;
          padding: 0 16px;
          font-size: 14px;
          color: var(--base-text-color-1);
          i {
            font-size: 14px;
            margin-right: 4px;
          }
          .icon-a-zu5742 {
            color: #2CB5E8;
          }
          .icon-a-zu5757 {
            color: #27CC91;
          }
          .icon-a-zu5759 {
            color: #F8BC3C;
          }
          &.active,
          &:hover {
            background: var(--datapicker-in-range-bg-color);
          }
        }
      }
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 86px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
.icon-a-zu5742 {
  color: #2CB5E8;
}
.icon-a-zu5757 {
  color: #27CC91;
}
.icon-a-zu5759 {
  color: #F8BC3C;
}
</style>
