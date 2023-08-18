<template>
<div class='add_standard_wrap'>
  <el-form ref='form' :model="form" :rules="rules">
    <el-form-item label="标准：" prop="standardName">
      <el-input v-model.trim="form.standardName" placeholder="请输入" class='stand_input'></el-input>
    </el-form-item>
    <el-form-item label="范围：" prop="standardDescription">
      <el-input v-model.trim="form.standardDescription" placeholder="请输入" maxlength="50" show-word-limit></el-input>
    </el-form-item>
  </el-form>
  <div class='opera_wrap'>
    <div class='opera' @click='addItem'>
      <i class='iconfont icon-tianjia'></i>
      <div class='tip'>添加</div>
    </div>
    <div class='opera' @click='delItem'>
      <i class='iconfont icon-shanchu'></i>
      <div class='tip'>删除</div>
    </div>
  </div>
  <div class='item_table'>
    <div class='item_table_header'>
      <div class='item' :style='{ "width": "17.929%" }'>
        <div class='checkbox' :class='{ "active": isCheckAll }' @click='checkAll'></div>
        <div class='label'>序号</div>
      </div>
      <div
        class='item'
        v-for='(value, key) in tableColumns'
        :key='key'
        :style='{ "width": value.width }'
      >
        <div class='label'>{{ value.label }}</div>
      </div>
    </div>
    <div class='item_table_content' id='table_content'>
      <div :id='`content_row_${index}`' class='content_row' v-for='(item, index) in editorList' :key='index'>
        <div class='content content_index' :style='{ "width": "17.929%" }'>
          <div class='checkbox' :class='{ "active": item.isCheck }' @click='checkItem(item)'></div>
          <div class='value'>{{ index + 1 }}</div>
        </div>
        <div class='content' :style='{ "width": tableColumns.id.width }'>
          <el-input
            v-model="item.standardCode"
            placeholder="请输入"
            :class='{ "is_empty": (item.standardCode === "" && !item.canSubmit) || item.isRepeat }'
            @blur='haveRepeat(item, index)'
          ></el-input>
        </div>
        <div class='content' :style='{ "width": tableColumns.name.width }'>
          <el-input
            v-model="item.standardName"
            placeholder="请输入"
            :class='{ "is_empty": item.standardName === "" && !item.canSubmit }'
          ></el-input>
        </div>
        <div class='content' :style='{ "width": tableColumns.state.width }'>
          <el-input v-model="item.standardDescription" placeholder="请输入"></el-input>
        </div>
      </div>
    </div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='$emit("closeDialog")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import { operaStandardApi } from '@/api/sysSetting'
export default {
  name: 'AddStandard',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const TABLE_COLUMNS = {
      id: { label: '代码', width: '24.357%' },
      name: { label: '名称', width: '27.357%' },
      state: { label: '说明', width: '30.357%' }
    }
    return {
      form: {
        standardName: '',
        standardDescription: ''
      },
      rules: {
        standardName: [
          { required: true, message: '请输入标准', trigger: 'blur' },
        ],
      },
      tableColumns: Object.freeze(TABLE_COLUMNS),
      editorList: [
        {
          standardCode: '',
          standardName: '',
          standardDescription: '',
          isCheck: false,
          canSubmit: true,
          isRepeat: false,
          oldCode: ''
        }
      ], // 表格数据
      codeValueObj: {}
    }
  },
  computed: {
    // 是否选中全部
    isCheckAll () {
      return this.editorList.length && this.editorList.every(item => item.isCheck)
    },
  },
  created () {
    if (this.row && this.row.id) {
      this.editorList = []
      for (let key in this.form) {
        this.form[key] = this.row[key] || ''
      }
      this.row.dataStandardRules.forEach((item, index) => {
        this.editorList.push({
          standardCode: item.standardCode || '',
          standardName: item.standardName || '',
          standardDescription: item.standardDescription || '',
          isCheck: false,
          canSubmit: true,
          isRepeat: false,
          oldCode: item.standardCode || '',
        })
        this.codeValueObj[item.standardCode] = [index]
      })
    }
  },
  methods: {
    haveRepeat (item, ind) {
      if (item.oldCode === item.standardCode) return
      if (item.oldCode) {
        let filterInd = this.codeValueObj[item.oldCode].findIndex(code => code === ind)
        filterInd > -1 && this.codeValueObj[item.oldCode].splice(filterInd, 1)
        if (this.codeValueObj[item.oldCode].length === 1) {
          this.editorList[this.codeValueObj[item.oldCode][0]].isRepeat = false
        }
      }
      if (item.standardCode) {
        if (this.codeValueObj[item.standardCode]) {
          this.codeValueObj[item.standardCode].push(ind)
          this.codeValueObj[item.standardCode].length > 1 ?
            this.codeValueObj[item.standardCode].forEach(repeatInd => {
              this.editorList[repeatInd].isRepeat = true
            }) : item.isRepeat = false
        } else {
          this.codeValueObj[item.standardCode] = [ind]
          item.isRepeat = false
        }
      } else {
        item.isRepeat = false
      }
      item.oldCode = item.standardCode
    },
    // 全选
    checkAll () {
      let check = !this.isCheckAll
      this.editorList.forEach(item => {
        item.isCheck = check
      })
    },
    // 当行数据的选择
    checkItem (item) {
      item.isCheck = !item.isCheck
    },
    // 提交
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.editorList.length) {
            this.$policeComfirm('表不可为空！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          let noWriteNum = 0
          this.editorList.forEach(item => {
            if (!item.standardCode || !item.standardName) {
              item.canSubmit = false
              noWriteNum += 1
            } else {
              item.canSubmit = true
            }
          })
          if (noWriteNum > 0) {
            this.$policeComfirm('请将表信息补充完整！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          if (this.editorList.some(repeat => repeat.isRepeat)) {
            this.$policeComfirm('代码出现重复，请修改后重新提交！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            return
          }
          let detail = []
          this.editorList.forEach(item => {
            detail.push({
              standardCode: item.standardCode,
              standardName: item.standardName,
              standardDescription: item.standardDescription || ''
            })
          })
          let params = {
            dataStandardName: this.form.standardName,
            dataStandardDescription: this.form.standardDescription,
            dataStandardRuleEditParams: detail
          }
          let way = 'insert'
          if (this.row && this.row.id) {
            params['id'] = this.row.id
            way = 'update'
          }
          operaStandardApi(params, way).then(() => {
            this.$message.success(way === 'insert' ? '新建成功！' : '修改成功！')
            this.$emit('closeDialog')
            this.$emit('getStandardList')
          })
        }
      })
    },
    // 添加字段
    addItem () {
      this.editorList.push({
        standardCode: '',
        standardName: '',
        standardDescription: '',
        isCheck: false,
        canSubmit: true,
        isRepeat: false,
        oldCode: ''
      })
      if (document.getElementById('table_content').scrollHeight > document.getElementById('table_content').clientHeight) {
        this.$nextTick(() => {
          document.getElementById(`content_row_${this.editorList.length - 1}`).scrollIntoView()
        })
      }
    },
    // 删除字段
    delItem () {
      if (this.isCheckAll) {
        this.editorList = []
        this.codeValueObj = {}
      } else if (this.editorList.some(item => item.isCheck)) {
        let repeatValue = []
        this.codeValueObj = {}
        this.editorList = this.editorList.filter(item => !item.isCheck)
        this.editorList.forEach((item, index) => {
          item.isRepeat = false
          if (item.standardCode) {
            if (this.codeValueObj[item.standardCode]) {
              this.codeValueObj[item.standardCode].push(index)
              repeatValue.findIndex(repeat => repeat === item.standardCode) === -1 && repeatValue.push(item.standardCode)
            } else {
              this.codeValueObj[item.standardCode] = [index]
            }
          }
        })
        repeatValue.forEach(item => {
          this.codeValueObj[item].forEach(code => {
            this.editorList[code].isRepeat = true
          })
        })
      } else {
        this.$message.warning('请选择字段！')
      }
    },
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.add_standard_wrap {
  height: 711px;
  /deep/.el-form {
    padding-left: 12px;
    .el-form-item {
      display: flex;
      margin-bottom: 12px !important;
      .el-form-item__error {
        padding-top: 0;
        color: @font-color-4;
      }
      .el-form-item__label {
        position: relative;
        font-size: 16px;
        line-height: 32px;
        &::before {
          position: absolute;
          left: -12px;
          color: @font-color-4;
        }
      }
      .el-form-item__content {
        flex: 1;
        line-height: 30px;
        .el-select {
          width: 166px;
        }
      }
      .el-input__count {
        font-size: 14px;
        color: var(--base-text-color-to-666666);
        line-height: 14px;
        .el-input__count-inner {
          background: transparent;
        }
      }
      .stand_input {
        width: 386px;
      }
    }
  }
  .opera_wrap {
    display: flex;
    margin: 16px 0;
    .opera {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 19px;
      color: var(--active-color);
      margin-right: 24px;
      cursor: pointer;
      i {
        font-size: 16px;
        margin-right: 8px;
      }
    }
  }
  .item_table {
    width: 100%;
    height: calc(100% - 183px);
    .item_table_header {
      width: 100%;
      display: flex;
      padding: 12px 6px;
      background: var(--table-head-bg-color);
      flex: none;
      .item {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 24px;
        color: var(--base-text-color-to-999999);
        padding: 0 18px;
        border-right: 1px solid var(--table-row-border-bottom-color);
        &:last-child {
          border-right: 0;
        }
      }
    }
    .item_table_content {
      flex: 1;
      height: calc(100% - 48px);
      overflow-y: auto;
      .content_row {
        display: flex;
        padding: 8px 6px 7px;
        //background: rgba(20, 20, 20, 0.04);
        border-bottom: 1px solid var(--table-row-border-bottom-color);
        .content {
          display: flex;
          align-items: center;
          padding: 0 18px;
          font-size: 16px;
          line-height: 30px;
          color: var(--base-text-color-1);
        }
        .content_index {
          padding: 0 18px;
        }
      }
    }
    .checkbox {
      position: relative;
      width: 16px;
      height: 16px;
      border: 1px solid var(--checkbox-border);
      border-radius: 2px;
      margin-right: 12px;
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
  }
  /deep/.el-input {
    .el-input__inner {
      height: 32px;
      line-height: 30px;
      border: 1px solid rgba(81, 92, 124, .4);
      border-radius: 2px;
      padding: 0 12px;
      font-size: 14px;
      &:hover {
        border-color: #3D4C75;
      }
      &::placeholder {
        font-size: 14px;
      }
    }
    &.is_empty {
      .el-input__inner {
        border-color: rgba(255, 16, 110, .4) !important;
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
</style>
