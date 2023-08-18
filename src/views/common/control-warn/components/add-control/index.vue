<template>
<div class='add_control_wrap'>
  <el-form ref='form' :rules='rules' :model="form" label-position='left' label-width="92px">
    <el-form-item label="所属角色：" prop='roleId'>
      <el-select v-model="form.roleId" @change='changeCRole' placeholder="请选择所属角色">
        <el-option
          v-for='item in roleOptions'
          :key='item.id'
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="布控名称：" prop="name">
      <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="布控级别：" prop='level'>
      <el-select v-model="form.level" placeholder="请选择布控级别">
        <el-option
          v-for='item in levelOptions'
          :key='item.value'
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="布控数据：" prop='dataTypeList'>
      <el-select
        v-model="form.dataTypeList"
        placeholder="请选择布控数据"
        multiple
        collapse-tags
      >
        <el-option
          v-for='(item, index) in dataOptions'
          :key='item.value + index'
          :label="item.label"
          :value="item.value"
          @click.native='changeCData(item, index)'
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="布控时长：" prop="timeSelectFlag" :class='{ "time_select": form.timeSelectFlag === "specific" }'>
      <el-radio-group v-model="form.timeSelectFlag" @input='changeTime'>
        <el-radio :label="'all'">长期有效</el-radio>
        <el-radio :label="'specific'">指定时间</el-radio>
      </el-radio-group>
    </el-form-item>
<!--    <QuickTimeSelect
      ref='timePicket'
      v-if='form.timeSelectFlag === "specific"'
      :pStartTime.sync="specifyTime.timeStart"
      :pEndTime.sync="specifyTime.timeEnd"
      :timeFormat='"yyyy/MM/dd HH:mm:ss"'
      :popperClass='"warn_time_picket"'
      :defaultTime='["00:00:00", "23:00:00"]'
      :typeName='"warnControlTime"'
      @timeChange='timeChange'
    >
      <div
        v-if='isShowError && form.timeSelectFlag === "specific" && (!specifyTime.timeStart || !specifyTime.timeEnd)'
        class='error_tip'
        slot='timeSlot'
      >请选择指定时间</div>
    </QuickTimeSelect>-->
    <el-date-picker
      v-if='form.timeSelectFlag === "specific"'
      v-model="timeValue"
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :value-format='"timestamp"'
      :picker-options='pickerOptions'
      :editable='false'
    >
    </el-date-picker>
    <div
      v-if='isShowError && form.timeSelectFlag === "specific" && (!timeValue || timeValue.length !== 2)'
      class='error_tip'
    >请选择指定时间</div>

    <el-form-item label="布控区域：" prop="regionSelectFlag">
      <el-radio-group v-model="form.regionSelectFlag" class='control_region' @input='changeRegion'>
        <el-radio :label="'all'">全区域</el-radio>
        <el-radio :label="'specific'">指定区域</el-radio>
      </el-radio-group>
      <div
        class='choice_region'
        :class='{ "disabled": form.regionSelectFlag === "all" }'
        @click='toChoice'
      >选择</div>
      <div
        v-if='isShowError && form.regionSelectFlag !== "all" && !resultRegion.length'
        class='error_tip error_region'
      >请选择指定区域</div>
    </el-form-item>
  </el-form>
  <div class='floor'>
    <div class='blank_button' @click='$emit("hideDetail")'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
// import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
import {
  getUserRoleApi,
  getRoleDataApi,
  addControl,
  updateControl
} from '@/api/warnControl.js'
import dayjs from '@/utils/filters'

const CONTROL_LEVEL_OPTIONS = [
  { label: '普通', value: 'normal' },
  { label: '一般', value: 'general' },
  { label: '严重', value: 'serious' },
]

export default {
  name: 'AddControl',
  /*components: {
    QuickTimeSelect
  },*/
  props: {
    resultRegion: {
      type: Array,
      default: () => []
    },
    isNoIn: {
      type: Boolean,
      default: true
    },
    editInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          const date = new Date()
          return time.getTime() < new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59, 59).getTime()
        }
      },
      timeValue: [],
      levelOptions: Object.freeze(CONTROL_LEVEL_OPTIONS),
      form: {
        name: '',
        level: 'normal',
        dataTypeList: [],
        regionSelectFlag: 'all',
        roleId: null,
        dataTypeSelectFlag: 'all',
        regionAccessType: '',
        timeSelectFlag: 'all'
      },
      specifyTime: {
        timeStart: '',
        timeEnd: ''
      },
      isShowError: false,
      roleOptions: [],
      dataOptions: [],
      rules: {
        dataTypeList: [
          { required: true, message: '布控数据不可为空', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '所属角色不可为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '布控名称不可为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form.dataTypeList': {
      handler (newVal) {
        if (newVal.includes('all')) {
          this.form.dataTypeSelectFlag = 'all'
        } else {
          this.form.dataTypeSelectFlag = 'specific'
        }
      }
    },
    isNoIn: {
      handler (newVal) {
        if (newVal) {
          this.form.regionAccessType = 'inner'
        } else {
          this.form.regionAccessType = 'outer'
        }
      },
      immediate: true
    }
  },
  created () {
    if (this.editInfo.id) {
      for (let key in this.form) {
        if (this.editInfo[key] && key !== 'roleId') {
          this.form[key] = this.editInfo[key]
        }
      }
      if (this.form.timeSelectFlag !== 'all') {
        if (this.editInfo.timeStart) {
          // this.specifyTime.timeStart = new Date(this.editInfo.timeStart).getTime()
          this.timeValue[0] = new Date(this.editInfo.timeStart).getTime()
        }
        if (this.editInfo.timeEnd) {
          // this.specifyTime.timeEnd = new Date(this.editInfo.timeEnd).getTime()
          if (new Date(this.editInfo.timeEnd).getHours() === 0) {
            this.timeValue[1] = new Date(this.editInfo.timeEnd).getTime() - 24 * 60 * 60 * 1000
          } else {
            this.timeValue[1] = new Date(this.editInfo.timeEnd).getTime()
          }
        }
      }
      if (this.form.dataTypeSelectFlag === 'all') {
        this.form.dataTypeList = ['all']
      }
      // if (this.form.roleId) {
      //   this.getRoleData(this.form.roleId, true)
      // }
    }
  },
  mounted () {
    this.getUserRole()
  },
  methods: {
    // 查询用户的所有角色
    getUserRole () {
      getUserRoleApi().then(res => {
        this.roleOptions = res || []
        if (this.roleOptions.length > 0) {
          if (!this.editInfo.id) {
            this.form.roleId = this.roleOptions[0].id
            this.getRoleData(this.form.roleId)
          } else {
            if (this.roleOptions.some(item => item.id === this.editInfo.roleId)) this.form.roleId = this.editInfo.roleId
            this.getRoleData(this.editInfo.roleId, true)
          }
        }
      })
    },
    // 获取角色对应的布控数据
    getRoleData (id, isCreat = false) {
      getRoleDataApi({
        roleId: id
      }).then(res => {
        this.dataOptions = res || []
        this.dataOptions = this.dataOptions.map(item => {
          return { label: item.srcNameCn, value: item.srcNameEn }
        })
        if (this.dataOptions.length) {
          this.dataOptions.unshift({
            label: '全部数据',
            value: 'all',
            // disabled: false
          })
          if (!isCreat) {
            this.form.dataTypeList = ['all']
          }
        }
      })
    },
    // 布控数据选项点击时
    changeCData (item, index) {
      if (item.disabled) return
      if (index === 0 && item.value === 'all' && this.form.dataTypeList.includes('all')) {
        // this.dataOptions.forEach(opt => {
        //   opt.disabled = true
        // })
        // this.dataOptions[0].disabled = false
        this.form.dataTypeList = ['all']
      } else {
        this.form.dataTypeList = this.form.dataTypeList.filter(type => type !== 'all')
        // if (this.dataOptions.some(opt => opt.disabled)) {
        //   this.dataOptions.forEach(opt => {
        //     opt.disabled = false
        //   })
        // }
      }
    },
    // 布控数据删除已选的tag标签时
    /*removeDataTag (value) {
      if (value === 'all' && this.dataOptions.some(opt => opt.disabled)) {
        this.dataOptions.forEach(opt => {
          opt.disabled = false
        })
      }
    },*/
    changeCRole (value) {
      this.form.dataTypeList = []
      this.getRoleData(value)
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.timeSelectFlag !== 'all') {
            /*if (!this.specifyTime.timeStart || !this.specifyTime.timeEnd) {
              this.isShowError = true
              return
            }*/
            if (!this.timeValue || this.timeValue.length !== 2) {
              this.isShowError = true
              return
            }
          }
          if (this.form.regionSelectFlag !== 'all' && !this.resultRegion.length) {
            this.isShowError = true
            return
          }
          let params = JSON.parse(JSON.stringify(this.form))
          let api = addControl
          let message = '新建'
          if (params.dataTypeSelectFlag === 'all') {
            params.dataTypeList = []
          }
          params.regionRangeList = []
          if (params.regionSelectFlag !== 'all') {
            this.resultRegion.forEach(item => {
              let result = []
              item.pointlist.forEach(point => {
                result.push({
                  x: point[0],
                  y: point[1]
                })
              })
              params.regionRangeList.push(result)
            })
          }
          if (params.timeSelectFlag !== 'all') {
            params.timeStart = dayjs.filterString(new Date(this.timeValue[0]).setHours(0, 0, 0))
            params.timeEnd = dayjs.filterString(new Date(this.timeValue[1]).setHours(24, 0, 0))
          } else {
            params.timeStart = ''
            params.timeEnd = ''
          }
          if (this.editInfo.id) {
            params.id = this.editInfo.id
            api = updateControl
            message = '修改'
          }
          api(params).then(() => {
            this.$message.success(message + '成功！')
            this.$emit('hideDetail')
            this.$emit('refreshTable')
          })
        }
      })
    },
    toChoice () {
      if (this.form.regionSelectFlag === 'all') return
      this.$emit('changeStatus', true)
    },
    changeRegion (value) {
      this.$emit('updateRegionInfo', value)
      if (value === 'all') {
        this.isShowError = false
      }
    },
    changeTime (value) {
      if (value === 'all') {
        // this.specifyTime.timeStart = ''
        // this.specifyTime.timeEnd = ''
        this.timeValue = []
        this.isShowError = false
      }
    },
    /*timeChange (value) {
      this.specifyTime.timeStart = new Date(value[0]).setMinutes(0, 0, 0)
      this.specifyTime.timeEnd = new Date(value[1]).setMinutes(0, 0, 0)
    }*/
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.add_control_wrap {
  /deep/.el-form {
    .formItem {
      width: 100% !important;
      height: 32px;
      line-height: 30px;
      margin-bottom: 12px;
      .error_tip {
        font-size: 12px;
        line-height: 16px;
        color: #FF106E;
      }
    }
    .el-date-editor {
      height: 32px;
      line-height: 30px;
      .el-range-separator {
        line-height: 26px;
      }
      .el-range__close-icon {
        line-height: 26px;
      }
    }
    .el-form-item {
      margin-bottom: 12px;
      .el-form-item__label {
        font-size: 16px;
        line-height: 32px;
        &::before {
          display: none;
        }
      }
      .el-form-item__content {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 30px;
        .el-select {
          width: 100%;
        }
        .el-form-item__error {
          color: #FF106E;
          padding-top: 0;
        }
      }
      .el-input {
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
          &:focus {
            border-color: var(--active-color);
          }
        }
        .el-input__suffix {
          height: 30px;
        }
      }
      .el-radio-group {
        display: flex;
        align-items: center;
        .el-radio {
          display: flex;
          align-items: center;
          color: var(--base-text-color-1);
          margin-right: 24px;
        }
        .el-radio__label {
          font-size: 16px;
          line-height: 32px;
          padding-left: 8px;
        }
        .el-radio__inner::after {
          background: var(--active-color);
        }
      }
      .control_region {
        .el-radio {
          margin-right: 38px;
        }
      }
      .el-radio:last-child {
        margin-right: 0;
      }
      .choice_region {
        font-size: 16px;
        line-height: 21px;
        margin-left: 16px;
        color: var(--active-color);
        cursor: pointer;
        &.disabled {
          color: #434B5F;
          cursor: not-allowed;
        }
      }
      .error_tip {
        position: absolute;
        top: 21px;
        font-size: 12px;
        color: #FF106E;
      }
    }
    .time_select {
      margin-bottom: 6px;
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
/deep/.el-date-editor .el-range__icon {
  font-size: 16px;
  line-height: 24px;
}
/deep/.el-date-editor .el-range-input {
  font-size: 14px;
  color: var(--base-text-color-1);
}
.error_tip {
  font-size: 12px;
  line-height: 16px;
  color: #FF106E;
}
.error_region {
  margin-top: 4px;
}
</style>
