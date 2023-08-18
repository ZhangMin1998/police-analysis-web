<template>
  <div>
    <!-- ------------  操作 新建/批量编辑发送人  ------------- -->
    <el-row class="opt-row" :gutter="10">
      <el-col :xs="8" :sm="10" :md="12" :lg="16" :xl="18"><div class="btns-l"></div></el-col>
      <el-col :xs="16" :sm="14" :md="12" :lg="8" :xl="6"
        ><div class="btns-r">
          <!-- <div class="p-button" style="margin-right: 16px" @click="send">批量编辑发送人</div> -->
          <div
            class="p-button-blue"
            @click="add"
            v-permission="'feature_warning_rules:add_edit_del'"
          >
            新建
          </div>
        </div></el-col
      >
    </el-row>
    <div class="table-content-wrap">
      <template-table
        :tableData="table.tableData"
        :columns="table.columns"
        :tableHeight="tableHeight"
        :rowHeight="rowHeight"
        :btnRender="btnRender"
        :pageData="table.pageData"
        :isLoading="table.isLoading"
        @handleCurrentChange="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      ></template-table>
    </div>

    <!-- 弹窗 =>  发送短信预警  -->
    <!-- <pop :pop.sync="smsPop" @beforeClose="closeSms" @beforeOpen="openSms">
      <SmsPanel ref="sms" :smsType="1" @close="closeSms" @submit="submitSms" />
    </pop> -->
  </div>
</template>

<script>
// import Pop from '@/components/BasicComponents/Dialog'
// import SmsPanel from '@/views/common/warn/MapWarn/Rules/Analysis/components/SmsPanel'
import { queryWarnRulePager, delWarnRuleById } from '@/api/warn'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
import { mapState } from 'vuex'
const columns = [
  {
    label: '启用时间',
    prop: 'time',
    minWidth: '15%',
    renderFun: function (row) {
      if (!row.endTime && !row.startTime) return '不限时期'
      if (row.endTime == row.startTime) {
        return '不限时期'
      } else {
        return row.startTime + ' ~ ' + row.endTime
      }
    }
  },
  // {
  //   label: '发送到手机',
  //   prop: 'outTimestamp',
  //   minWidth: '180',
  //   type: 'nor',
  //   renderFun: function (row) {
  //     if (!row.warnPhoneRelationships) return '--'
  //     if (row.warnPhoneRelationships && row.warnPhoneRelationships.length == 0) return '--'
  //     return row.warnPhoneRelationships
  //       .map(i => {
  //         return i.personName + ' ' + i.mobile
  //       })
  //       .join('；')
  //   }
  // },
  // { width: '80', type: 'selection' },

  { label: '预警名称', prop: 'warningName', minWidth: '10%' },
  {
    label: '警报级别',
    prop: 'warningLevel',
    minWidth: '5%',
    type: 'status',
    statuList: [
      { status: 'EMPHASIS_LEVEL', color: 'F03F58', text: '重点防控' },
      { status: 'MEDIUM_LEVEL', color: 'D8B733', text: '中等防控' },
      { status: 'GENERAL_LEVEL', color: '4596E6', text: '一般防控' }
    ]
  },
  { label: '数据类型', prop: 'dataTypeString', minWidth: '20%' },
  // { label: '预警内容', prop: 'content', minWidth: '180' },
  // { label: '人员类型', prop: 'personTypeName', minWidth: '180' },
  // {
  //   label: '预警场所',
  //   prop: 'placesName',
  //   minWidth: '160',
  //   renderFun: function (row) {
  //     if (row.places != 'all') {
  //       return row.places
  //     } else {
  //       return '全部场所'
  //     }
  //   }
  // },
]

export default {
  components: {
    TemplateTable,
    // SmsPanel,
    // Pop
  },
  mixins: [autoTableHeight],
  data () {
    return {
      subHeight: 500,
      singleList: [],
      selectionList: [],
      smsPop: {
        show: false,
        title: '发送预警',
        width: '879px',
        top: '180px',
        isBatch: false //.isBatch 批量 发送  else  单个发送
      },
      table: {
        tableData: [],
        columns: Object.freeze(columns),
        btnRender: [
          // {
          //   label: '发送预警',
          //   type: 'rodeLine',
          //   icon: 'icon-sms',
          //   btnEvent: this.childSend,
          //   alt: '发送预警'
          // },
          // {
          //   label: '编辑',
          //   type: 'success',
          //   icon: 'icon-doc-pen',
          //   btnEvent: this.edit,
          //   alt: '编辑'
          // },
          // {
          //   label: '删除',
          //   type: 'rodeLine',
          //   icon: 'icon-drop',
          //   btnEvent: this.delete,
          //   alt: '删除'
          // }
        ],
        pageData: {
          pageSize: 7,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 7
        }
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    btnRender () {
      const btnRender = [
        {
          label: '编辑',
          type: 'success',
          icon: 'icon-bianji',
          btnEvent: this.edit,
          alt: '编辑',
          key: 'feature_warning_rules:add_edit_del'
        },
        {
          label: '删除',
          type: 'rodeLine',
          icon: 'icon-delete',
          btnEvent: this.delete,
          alt: '删除',
          key: 'feature_warning_rules:add_edit_del'
        }
      ]
      return this.$backPermissionsArray(btnRender)
    }
  },
  methods: {
    /** 表格多选 */
    handleSelectionChange (selected) {
      this.selectionList = selected.map(i => i.id)
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
    // childSend(row) {
    //   this.smsPop.isBatch = false
    //   this.singleList = [row.id]
    //   // 单个发送消息
    //   this.openSms()

    //   this.$nextTick(() => {
    //     if (row && row.warnCluePhones) {
    //       this.$refs.sms.value = row.warnCluePhones.map(i => {
    //         return i.userId
    //       })
    //     }
    //   })
    // },

    /** 提交 发送短信 */
    // submitSms(list) {
    //   this.$refs.sms.setLoadingbut(true)

    //   addMessageUser({
    //     ruleIdList: this.smsPop.isBatch ? this.selectionList : this.singleList,
    //     userIdList: list,
    //     warnType: 1
    //   })
    //     .then(res => {
    //       this.$refs.sms.setLoadingbut(false)
    //       // this.smsPop.isBatch 批量 发送  else  单个发送
    //       if (this.smsPop.isBatch) {
    //         this.$messageTip.success('发送成功！')
    //         this.getList()
    //       } else {
    //         this.$messageTip.success('修改成功！')
    //         this.getList()
    //       }

    //       this.closeSms()
    //     })
    //     .catch(err => {
    //       this.$refs.sms.setLoadingbut(false)
    //     })
    // },

    getList () {
      this.table.isLoading = true
      queryWarnRulePager({ ...this.table.params, warningType: 'warningClue' })
        .then(res => {
          res.content.forEach(item => {
            let tempArr = []
            if (item.dataTypeList) {
              item.dataTypeList.forEach(i => {
                this.dataTypeList.forEach(e => {
                  if (e.srcNameEn === i) {
                    tempArr.push(e.srcNameCn)
                  }
                })
              })
            }
            item.dataTypeString = tempArr.join(';')
          })
          this.table.tableData = [...res.content]
          this.table.pageData.total = res.totalSize
        })
        .finally(() => {
          this.table.isLoading = false
        })
    },

    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getList()
    },
    // 编辑操作
    edit (row) {
      this.$router.push({ name: 'FeatureRuleForm', query: { id: row.id } })
    },
    // 删除操作
    delete (row) {
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          delWarnRuleById(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            this.getList()
          })
        })
        .catch(() => { })
    },

    /** 新建按钮 */
    add () {
      this.$router.push({ name: 'FeatureRuleForm' })
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
</style>
