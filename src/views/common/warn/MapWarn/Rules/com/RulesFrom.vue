<template>
  <div class="rule-content">
    <loading :isLoading.sync="isLoading">
      <div class="rule-wrapper">
        <div class="step" :style="creatGroup ? 'height: 224px;' : 'height: 190px;'">
          <div class="num">1</div>
          <div class="line"></div>
          <div class="num">2</div>
        </div>
        <div>
          <el-form
            :rules="rules"
            ref="ruleForm"
            class="rule-form"
            :model="form"
            label-width="100px"
          >
            <div class="group">
              <div class="title">新建/选择分组</div>
              <el-form-item label="分组位置：" style="width: 600px">
                <el-select
                  v-model="form.ruleId"
                  placeholder="请选择分组"
                  style="width: 400px; margin-right: 16px"
                  no-data-text="暂无分组"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  >
                  </el-option>
                </el-select>
                <span
                  v-if="!isEdit"
                  class="p-button"
                  @click.prevent="addGroupEvent"
                  style="padding: 9px 10px"
                  >新建分组</span
                >
              </el-form-item>
              <el-form ref="addgroupForm" :model="form" label-width="100px">
                <el-form-item
                  prop="name"
                  v-show="creatGroup"
                  style="width: 680px"
                  :rules="[{ required: true, message: '请输入新建分组名称', trigger: 'blur' }]"
                >
                  <el-input
                    v-model="form.name"
                    placeholder="请输入分组名称"
                    style="width: 400px; margin-right: 16px"
                  ></el-input>
                  <span
                    class="p-button"
                    @click.prevent="creatGroup = false"
                    style="padding: 9px 20px; margin-right: 10px"
                    >取消</span
                  >
                  <span class="p-button" @click.prevent="addGrop" style="padding: 9px 20px"
                    >确定</span
                  >
                </el-form-item>
              </el-form>
              <div class="title">填写预警项</div>
            </div>
            <el-form-item
              label="预警名称："
              class="name"
              prop="warnName"
              style="width: 500px; margin-bottom: 21px !important"
            >
              <el-input
                v-model="form.warnName"
                placeholder="请输入预警名称"
                maxlength="20"
                show-word-limit
                @input="focusRuleName"
              ></el-input>
              <div class="isSameWarnName" v-show="isSameWarnName">
                <i class="el-icon-warning-outline" style="margin-right: 4px"></i>预警名称已存在
              </div>
            </el-form-item>
            <el-form-item label="预警内容：" prop="content" style="width: 500px">
              <el-input
                v-model="form.content"
                placeholder="请输入详情信息"
                maxlength="100"
                show-word-limit
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="警报级别：" prop="level" style="width: 500px">
              <el-select v-model="form.level" placeholder="请选择警报级别" style="width: 100%">
                <el-option
                  v-for="(item, idx) in policeLevel"
                  :key="idx"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="警报类型：" prop="clueType" style="width: 500px">
              <el-select
                v-model="form.clueType"
                placeholder="请选择警报类型"
                style="width: 100%"
                @change="handleChangeType"
              >
                <el-option
                  v-for="(item, idx) in $store.state.Dict.extrTypeList"
                  :key="idx"
                  :value="item.typeCode"
                  :label="item.typeName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" label="预警号码：" style="width: 500px">
              <el-input v-model="form.clueValue" :placeholder="'请输入' + typeName"></el-input>
            </el-form-item>
            <div class="timeItem">
              <el-form-item label="启用时间：">
                <time-select
                  v-if="ready"
                  :width="400"
                  :formItemBoolean="false"
                  @get-s-e-time="getTimeSelect"
                  :isPass="false"
                  :p-start-time="form.startTime"
                  :p-end-time="form.endTime"
                  @clear-time="clearTime"
                  ref="resetTime"
                ></time-select>
              </el-form-item>
              <!-- <span class="police-attention">
              <i class="el-icon-warning-outline"></i>
              如不选择时间，默认为预警规则持续可用
            </span> -->
            </div>
            <div :class="['rule-operator', { disabled: isConfirm }]">
              <div
                class="p-button"
                v-for="(item, index) in buttonList"
                :key="index"
                @click="item.event"
              >
                {{ item.text }}
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </loading>
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import dayjs from '@/utils/filters'
import TimeSelect from '@/components/BasicComponents/TimeSelect'
import validateType from '@/mixins/validateType'

import {
  queryFeatureListItem,
  addFeature,
  updateFeature,
  queryAllGroup,
  addGroup
} from '@/api/warn'
const rules = {
  warnName: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择警报级别', trigger: 'change' }],
  clueType: [{ required: true, message: '请选择警报类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
}
export default {
  mixins: [validateType],
  components: {
    TimeSelect,
    Loading
  },
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  inject: ['setCurGroupId'],
  data () {
    return {
      typeName: '预警号码',
      isLoading: true,
      isConfirm: false, //分析提交加载中
      groupList: [],
      buttonList: [
        { text: '取消', event: this.cancel },
        { text: '重置', event: this.reset },
        { text: '确定', event: this.confirm }
      ],
      isSameWarnName: false,
      ready: false,
      wordNums: 0,
      rules: rules,
      policeLevel: [
        { label: '轻微预警', value: 1 },
        { label: '一般预警', value: 2 },
        { label: '严重预警', value: 3 }
      ],
      form: {
        warnName: '',
        content: '',
        level: 1,
        startTime: '',
        endTime: '',
        clueType: '',
        clueValue: '',
        ruleId: '',
        name: ''
      },
      resetParms: {}, // 原始对象
      creatGroup: false //新建分组显示
    }
  },

  computed: {
    isEdit () {
      // 是否是编辑模式 返回 true 为编辑  false为新建
      return this.id !== -1
    }
  },

  created () {
    // 新建分组 隐藏
    this.creatGroup = false

    this.init()

    if (this.isEdit) {
      // ready 控制 时间组件重新渲染
      this.ready = false
      this.getDetail()
    } else {
      this.ready = true
      this.reset()
    }
  },

  methods: {
    // 下拉改变时改变提示语
    handleChangeType (value) {
      this.typeName =
        this.$store.state.Dict.extrTypeList.find(_c => _c.typeCode === value)?.typeName ??
        '预警号码'
    },
    /**------------- 初始化 分组以及警报类型------------------ */
    init () {
      queryAllGroup()
        .then(res => {
          this.groupList = [...res]
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    initGroup () {
      return new Promise((resolve, reject) => {
        queryAllGroup()
          .then(res => {
            this.groupList = res
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    focusRuleName () {
      this.isSameWarnName = false
    },

    /**------------- 表单 按钮------------------ */
    /** 表单 取消按钮 */
    cancel () {
      this.$emit('cancel')
    },

    /** 表单 确定按钮 */
    confirm () {
      if (this.form.startTime && !this.form.endTime) {
        this.$messageTip.error('请选择结束时间！')
        return false
      }
      if (!this.form.startTime && this.form.endTime) {
        this.$messageTip.error('请选择开始时间！')
        return false
      }
      if (!this.form.ruleId) {
        this.$messageTip.error('请选择分组位置！')
        return false
      }

      if (!this.validateValue(this.form.clueType, this.form.clueValue)) return

      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // 添加 还是 编辑
          const postUrl = this.isEdit ? updateFeature : addFeature

          const params = JSON.parse(JSON.stringify(this.form))

          params.startTime = params.startTime ? dayjs.filtertoS(params.startTime) : ''
          params.endTime = params.endTime ? dayjs.filtertoS(params.endTime) : ''
          this.isConfirm = true
          this.buttonList[2].text = '提交中...'

          this.setCurGroupId(params.ruleId)
          postUrl(params).then(() => {
            this.isConfirm = false
            this.buttonList[2].text = '确定'

            this.$messageTip.success(this.isEdit ? '修改成功' : '新建成功')

            this.$emit('refresh', this.form.ruleId)
          })
        }
        this.buttonList[2].text = '确定'
        this.isConfirm = false
      })
    },

    /** 表单 重置按钮 */
    reset () {
      if (!this.isEdit) {
        //新建
        this.form = {
          warnName: '',
          content: '',
          level: 1,
          startTime: '',
          endTime: '',
          clueType: '',
          clueValue: '',
          name: ''
        }
        this.$nextTick(() => {
          this.$refs.resetTime.startTime = ''
          this.$refs.resetTime.endTime = ''
        })

        this.clearValidate('ruleForm')
      } else {
        //编辑
        this.form = JSON.parse(JSON.stringify(this.resetParms))
        this.$refs.resetTime.startTime = this.form.startTime
        this.$refs.resetTime.endTime = this.form.endTime
      }
    },

    /**------------- 编辑 状态------------------ */
    /** 表单 编辑赋值 */
    getDetail () {
      queryFeatureListItem(this.id).then(res => {
        if (res.startTime == res.endTime) {
          // 相等为不限时期
          res.startTime = ''
          res.endTime = ''
        } else {
          res.startTime = dayjs.filterTimeToTimestampHS(res.startTime)
          res.endTime = dayjs.filterTimeToTimestampHS(res.endTime)
        }
        this.formatParams(res)
        this.resetParms = JSON.parse(JSON.stringify(this.form))
      })
    },

    /** 表单 参数赋值 */
    formatParams (obj) {
      this.form = obj
      this.ready = true
    },

    /** 表单 清空提示语状态 */
    clearValidate (formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },

    /**------------- 时间组件 ------------------ */

    /** 清空时间 */
    clearTime () {
      this.form.startTime = ''
      this.form.endTime = ''
    },

    /** 赋值时间  */
    getTimeSelect (child) {
      this.form.startTime = child.startTime ? child.startTime : ''
      this.form.endTime = child.endTime ? child.endTime : ''
    },
    /**------------- 分组操作 ------------------ */

    /** 新建分组  */
    addGroupEvent () {
      this.clearValidate('addgroupForm')
      this.creatGroup = true
      this.form.name = ''
    },

    /** 新建分组  */
    async addGroupReq (addParams) {
      await addGroup(addParams).then(res => {
        this.initGroup().then(() => {
          this.form.ruleId = res.id
          this.creatGroup = false
        })
      })
    },

    /** 确认新建分组  */
    addGrop () {
      //新建分组 并创建特征
      // 新建分组
      this.$refs['addgroupForm'].validate(valid => {
        if (valid) {
          let addParams = {
            name: this.form.name,
            warnType: 'CLUE'
          }
          this.addGroupReq(addParams)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .num {
    background-color: #1890ff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
  }
  .line {
    height: 50%;
    margin: 10px 0;
    width: 2px;
    background-color: #42506a;
  }
}
.group {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    color: var(--base-text-color-1);
    padding-bottom: 24px;
    font-size: 18px;
  }
}
.rule-wrapper {
  display: flex;
  padding-left: 32px;
  margin-top: -28px !important;
}

.rule-wrapper /deep/ input {
  color: var(--base-text-color-1);
}

.rule-form {
  padding: 15px 60px 0 16px;
}

.rule-form /deep/ .el-input__inner {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rule-form /deep/ .el-checkbox__inner {
  background: transparent;
}
/* 时间控件样式 */
.rule-form /deep/ .el-date-editor .el-range__icon {
  display: none;
}
.rule-form /deep/.el-date-editor .el-range-input {
  text-align: left;
  width: 39%;
}
.rule-form /deep/.el-date-editor--datetimerange.el-input__inner {
  width: 400px;
}
.rule-form .dateIcon {
  position: absolute;
  right: -43px;
  top: 25%;
}
.rule-form .police-attention {
  position: absolute;
  right: -340px;
  top: 30%;
  color: var(--base-text-color-to-999999);
  font-size: 14px;
  user-select: none;
}
.rule-form .isSameWarnName {
  position: absolute;
  right: -128px;
  top: 0;
  color: #f56c6c;
  font-size: 14px;
  user-select: none;
}
.timeItem {
  position: relative;
  width: 444px;
}
.rule-form /deep/ .el-date-editor .el-range-separator {
  color: var(--base-text-color-1);
}
.rule-form .dateIcon /deep/ .el-icon-date {
  color: var(--base-text-color-1);
}
/* placehold 样式更改 */

.rule-form ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: var(--input-placehold-color);
}
.rule-form :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: var(--input-placehold-color);
}
.rule-form ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: var(--input-placehold-color);
}
.rule-form :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: var(--input-placehold-color);
}
.name /deep/.el-input__inner {
  padding-right: 45px !important;
}
.rule-form /deep/.el-form-item__label {
  color: var(--base-text-color-to-999999) !important;
}
.disabled > div {
  cursor: not-allowed;
  background-color: var(--table-head-bg-color);
  color: #999;
}

.rule-operator {
  .p-button {
    margin-right: 16px;
    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
