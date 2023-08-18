<template>
  <div>
    <div class="align-boths headers">
      <div>
        <list-title title="规则列表"></list-title>
      </div>
      <div @click="navigationToRules">
        <NavigationCard title="预警详情" />
      </div>
    </div>
    <div class="rules">
      <!-- ------------  操作 新建/批量编辑发送人  ------------- -->
      <el-row class="opt-row" :gutter="10">
        <el-col :xs="8" :sm="10" :md="12" :lg="16" :xl="18"><div class="btns-l"></div></el-col>
        <el-col :xs="16" :sm="14" :md="12" :lg="8" :xl="6"
          ><div class="btns-r">
            <div class="p-button" style="margin-right: 16px" @click="send">批量编辑发送人</div>
            <div class="p-button-blue" @click="add">新建</div>
          </div></el-col
        >
      </el-row>
      <div class="table-content-wrap">
        <template-table
          :tableData="table.tableData"
          :columns="table.columns"
          :tableHeight="tableHeight"
          :rowHeight="rowHeight"
          :btnRender="table.btnRender"
          :pageData="table.pageData"
          :isLoading="table.isLoading"
          @handleCurrentChange="handleCurrentChange"
          @handleSelectionChange="handleSelectionChange"
        ></template-table>
      </div>

      <!-- 弹窗 =>  发送短信预警  -->
      <pop :pop.sync="smsPop" @beforeClose="closeSms" @beforeOpen="openSms">
        <SmsPanel ref="sms" :smsType="3" @close="closeSms" @submit="submitSms" />
      </pop>

      <!-- 弹窗 =>  编辑单个特征  -->
      <!-- <pop :pop.sync="featurePop" @beforeClose="hideFeaturePop" @beforeOpen="showFeaturePop">
        <RulesFrom :id="featurePop.id" @cancel="hideFeaturePop" @refresh="refresh"></RulesFrom>
      </pop> -->

      <!-- 弹窗 =>  编辑 组名称  -->
      <pop :pop.sync="pop" @beforeClose="hideFrom" @beforeOpen="showFrom">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="106px">
          <el-form-item label="预警名称：" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入预警名称"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="警报类型：" prop="type">
            <el-select v-model="form.type" placeholder="请选择警报类型" style="width: 100%">
              <el-option
                v-for="(item, idx) in WarnType"
                :key="idx"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="预警数值：" prop="warnNum">
            <el-input v-model.number="form.warnNum" placeholder="请输入预警数值"></el-input>
          </el-form-item>

          <el-form-item label="警报级别：" prop="warnLevel">
            <el-select v-model="form.warnLevel" placeholder="请选择警报级别" style="width: 100%">
              <el-option
                v-for="(item, idx) in WarnLevel"
                :key="idx"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </pop>
    </div>
  </div>
</template>

<script>
import Pop from '@/components/BasicComponents/Dialog'
import SmsPanel from '@/views/common/warn/MapWarn/Rules/Analysis/components/SmsPanel'
import NavigationCard from '@/components/BasicComponents/NavigationCard'

import TemplateTable from '@/components/VisualComponents/Table'

import {
  mobileListPager,
  mobileAddRule,
  mobileEditRule,
  mobileDelRule,
  addMessageUser
} from '@/api/warn'

import autoTableHeight from '@/mixins/autoTableHeight'

const WarnLevel = [
  { label: '轻微预警', value: 1 },
  { label: '一般预警', value: 2 },
  { label: '严重预警', value: 3 }
]

const WarnType = [
  // { label: '聚集预警', value: 1 },
  // { label: '特征预警', value: 2 },
  // { label: '手机预警', value: 3 },
  { label: '一机多号', value: 4 },
  { label: '一机多卡', value: 5 }
]

const rules = {
  name: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择预警类型', trigger: 'change' }],
  warnLevel: [{ required: true, message: '请选择警报级别', trigger: 'change' }],
  warnNum: [
    { required: true, message: '请输入预警数值', trigger: 'blur' },
    { type: 'number', message: '预警数值必须为数字值' }
  ]
}

export default {
  components: {
    NavigationCard,
    Pop,
    SmsPanel,
    TemplateTable
  },
  mixins: [autoTableHeight],

  data () {
    return {
      subHeight: 320,
      WarnLevel: WarnLevel,
      WarnType: WarnType,
      rules: rules,
      table: {
        columns: [
          {
            label: '发送到手机',
            prop: 'outTimestamp',
            minWidth: '210',
            type: 'nor',
            renderFun: function (row) {
              if (!row.warnPhoneRelationships) return '--'
              if (row.warnPhoneRelationships && row.warnPhoneRelationships.length == 0) return '--'
              return row.warnPhoneRelationships
                .map(i => {
                  return i.personName + ' ' + i.mobile
                })
                .join('；')
            }
          },
          { width: '80', type: 'selection' },
          { label: '预警名称', prop: 'name', minWidth: '150', type: 'nor' },
          {
            label: '预警类型',
            prop: 'WarnType',
            minWidth: '140',
            type: 'nor',
            renderFun: function (row) {
              if (!row.type) return '--'
              let item = WarnType.find(i => i.value == row.type)
              return item ? item.label : '--'
            }
          },
          { label: '预警数值', prop: 'warnNum', minWidth: '150', type: 'nor' },
          {
            label: '警报级别',
            prop: 'warnLevel',
            minWidth: '140',
            type: 'nor',
            renderFun: function (row) {
              if (!row.warnLevel) return '--'
              let item = WarnLevel.find(i => i.value == row.warnLevel)
              return item.label
            }
          }
        ],

        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        btnRender: [
          {
            label: '发送预警',
            type: 'rodeLine',
            icon: 'icon-sms',
            btnEvent: this.childSend,
            alt: '发送预警'
          },
          {
            label: '编辑',
            type: 'success',
            icon: 'icon-doc-pen',
            btnEvent: this.edit,
            alt: '编辑'
          },
          {
            label: '删除',
            type: 'rodeLine',
            icon: 'icon-drop',
            btnEvent: this.delete,
            alt: '删除'
          }
        ],
        // 加载条
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 10
        }
      },
      smsPop: {
        show: false,
        title: '发送预警',
        width: '879px',
        top: '180px',
        isBatch: false //.isBatch 批量 发送  else  单个发送
      },
      pop: {
        show: false,
        title: '新建规则',
        width: '600px',
        top: '220px',
        btn: [
          { text: '取消', event: this.hideFrom, type: 'nor' },
          { text: '重置', event: this.resetForm, type: 'nor' },
          { text: '确定', event: this.submit, type: 'nor' }
        ]
      },

      form: {
        id: null,
        name: '',
        type: 4,
        warnLevel: 1,
        warnNum: ''
      },
      defaultForm: {},

      selectionList: [], //多选 idList

      singleList: []
    }
  },

  created () {
    this.queryListPager()
  },

  methods: {
    /** 查询 规则表格分页 */
    queryListPager () {
      this.table.isLoading = true
      mobileListPager(this.table.params)
        .then(res => {
          this.table.tableData = [...res.content]
          this.table.pageData.total = res.totalSize
          this.table.isLoading = false
        })
        .catch(() => {
          this.table.isLoading = false
        })
    },

    /** 返回上一页 */
    navigationToRules () {
      this.$router.go(-1)
    },

    /** 表格多选 */
    handleSelectionChange (selected) {
      this.selectionList = selected.map(i => i.id)
    },

    /** 显示 编辑 弹窗 */
    hideFrom () {
      this.pop.show = false
    },

    /** 显示 编辑 弹窗 */
    showFrom () {
      this.pop.show = true
    },

    resetForm () {
      // if (this.form.id) {
      //   this.form = { ...this.defaultForm }
      // } else {
      this.form = {
        id: null,
        name: '',
        type: 4,
        warnLevel: 1,
        warnNum: ''
      }
      // }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },

    /** 提交 编辑表单 */
    add () {
      this.pop.title = '新建规则'
      this.form.id = null
      this.showFrom()
      this.resetForm()
    },

    submit () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const postUrl = this.form.id ? mobileEditRule : mobileAddRule
          if (!this.form.id) {
            delete this.form.id
          }
          postUrl(this.form)
            .then(() => {
              this.$messageTip.success(this.form.id ? '修改成功！' : '新建成功！')
              this.table.params.pageNum = 1
              this.table.pageData.curPage = 1
              this.queryListPager()
              this.hideFrom()
            })
            .catch(() => {})
        }
      })
    },

    /** 编辑规则 */
    edit (row) {
      this.pop.title = '编辑规则'
      this.showFrom()
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })

      let { id, type, warnLevel, warnNum, name } = row

      this.defaultForm = { id, type, warnLevel, warnNum, name }
      this.form = { ...this.defaultForm }
    },

    /** 删除规则 */
    delete (row) {
      this.$policeComfirm('确定要删除此规则吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          // 删除组
          mobileDelRule(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000,
              customClass: 'messageBox'
            })
            this.queryListPager()
          })
        })
        .catch(() => {})
    },

    /** 外层 切换分页 事件 */
    handleCurrentChange (pageIndex) {
      this.table.isLoading = true
      this.table.params.pageNum = pageIndex
      this.queryListPager()
    },

    /** ---------------- 短信预警 ----------------  */
    /** 提交 发送短信 */
    submitSms (list) {
      this.$refs.sms.setLoadingbut(true)

      addMessageUser({
        ruleIdList: this.smsPop.isBatch ? this.selectionList : this.singleList,
        userIdList: list,
        warnType: 3
      })
        .then(() => {
          this.$refs.sms.setLoadingbut(false)
          // this.smsPop.isBatch 批量 发送  else  单个发送
          if (this.smsPop.isBatch) {
            this.$messageTip.success('发送成功！')
            this.queryListPager()
          } else {
            this.$messageTip.success('修改成功！')
            this.queryListPager()
          }

          this.closeSms()
        })
        .catch(() => {
          this.$refs.sms.setLoadingbut(false)
        })
    },

    /** 关闭 发送预警 */
    closeSms () {
      this.smsPop.show = false
    },

    /** 打开 发送预警 */
    openSms () {
      this.smsPop.show = true
    },

    /** 批量编辑发送人信息 */
    send () {
      if (this.selectionList.length == 0) {
        this.$messageTip.error('至少选择一项预警规则')
        return false
      }
      this.smsPop.isBatch = true
      this.openSms()
    },

    /** 子 打开 短信通知弹窗 */
    childSend (row) {
      this.smsPop.isBatch = false
      this.singleList = [row.id]
      // 单个发送消息
      this.openSms()

      this.$nextTick(() => {
        if (row && row.warnCluePhones) {
          this.$refs.sms.value = row.warnCluePhones.map(i => {
            return i.userId
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.opt-row {
  margin-bottom: 16px;
  .btns-l {
    min-height: 40px;
  }

  .btns-r {
    display: flex;
    justify-content: flex-end;
  }
}
.rules {
  padding: 16px 10px;
}
.align-boths {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headers {
  height: 70px;
  background-color: var(--table-head-bg-color);
  padding: 0 16px;
  box-sizing: border-box;
}

/deep/.el-form-item {
  margin-bottom: 24px !important;
  width: 520px !important;
}
</style>
