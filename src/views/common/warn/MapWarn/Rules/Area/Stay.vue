<template>
  <div>
    <div class="table-content-wrap">
      <template-table
        :tableData="table.tableData"
        v-if="isCreated"
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
      <SmsPanel ref="sms" :smsType="9" @close="closeSms" @submit="submitSms" />
    </pop>
  </div>
</template>

<script>
import Pop from '@/components/BasicComponents/Dialog'
import SmsPanel from '@/views/common/warn/MapWarn/Rules/Analysis/components/SmsPanel'
import { StayPager, StayDel, addMessageUser } from '@/api/warn'
import TemplateTable from '@/components/VisualComponents/Table'
import autoTableHeight from '@/mixins/autoTableHeight'
export default {
  components: {
    TemplateTable,
    SmsPanel,
    Pop
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
        columns: [
          {
            label: '发送到手机',
            prop: 'outTimestamp',
            minWidth: '180',
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

          {
            label: '预警名称',
            prop: 'warnName',
            minWidth: '180',
            type: 'nor'
          },

          {
            label: '逗留时长（小时）',
            prop: 'stayDuration',
            minWidth: '180',
            type: 'nor'
          },
          {
            label: '逗留时间段',
            prop: 'time',
            minWidth: '220',
            type: 'nor',
            renderFun: function (row) {
              if (!row.endTime && !row.startTime) return '--'
              return row.startTime + ' ~ ' + row.endTime
            }
          },
          {
            label: '警报级别',
            prop: 'level',
            minWidth: '140',
            type: 'state'
          },
          {
            label: '预警场所',
            prop: 'placeNames',
            minWidth: '160',
            type: 'nor'
          }
        ],
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
            icon: 'icon-bianji',
            btnEvent: this.edit,
            alt: '编辑'
          },
          {
            label: '删除',
            type: 'rodeLine',
            icon: 'icon-delete',
            btnEvent: this.delete,
            alt: '删除'
          }
        ],
        pageData: {
          pageSize: 6,
          total: 0
        },
        // 加载条
        isLoading: true,
        params: {
          pageNum: 1,
          pageSize: 6
        }
      },
      isCreated: false
    }
  },

  created () {
    this.getList()
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
    },

    /** 提交 发送短信 */
    submitSms (list) {
      this.$refs.sms.setLoadingbut(true)

      addMessageUser({
        ruleIdList: this.smsPop.isBatch ? this.selectionList : this.singleList,
        userIdList: list,
        warnType: 9
      })
        .then(() => {
          this.$refs.sms.setLoadingbut(false)
          // this.smsPop.isBatch 批量 发送  else  单个发送
          if (this.smsPop.isBatch) {
            this.$messageTip.success('发送成功！')
            this.getList()
          } else {
            this.$messageTip.success('修改成功！')
            this.getList()
          }

          this.closeSms()
        })
        .catch(() => {
          this.$refs.sms.setLoadingbut(false)
        })
    },

    getList () {
      this.table.isLoading = true
      StayPager(this.table.params)
        .then(res => {
          this.table.isLoading = false
          this.table.tableData = [...res.content]
          this.table.pageData.total = res.totalSize
          this.isCreated = true
        })
        .catch(() => {
          this.table.isLoading = false
          this.isCreated = true
        })
    },
    // 分页切换操作
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.getList()
    },
    // 编辑操作
    edit (row) {
      this.$router.push({ name: 'editStayFrom', query: { id: row.id } })
    },
    // 删除操作
    delete (row) {
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          StayDel(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },

    /** 新建按钮 */
    add () {
      this.$router.push({ name: 'StayFrom' })
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
