<template>
  <div class="AnalysisForm">
    <div class="Tabs">
      <Tabs v-if="hasPerson" :tabs.sync="tabs" @handleClick="tabsHandleClick"></Tabs>
    </div>

    <!-- 时间控件 -->
    <div
      class="pickTime"
      :style="{
        width: tabs.activeName === 'data' ? '321px' : '100%'
      }"
      v-if="hasTime"
    >
      <div class="key">起止时间</div>
      <div class="val">
        <!-- <TimePicker
          ref="TimePicker"
          :limitLastThreeMonth="true"
          @confirmTime="confirmTime"
        ></TimePicker> -->
        <QuickTimeSelect
          :pStartTime.sync="params.startTime"
          :pEndTime.sync="params.endTime"
          typeName="limit14DaysTime"
          class="quick_time_select"
          startPlaceholder="请选择开始日期"
          endPlaceholder="请选择结束日期"
        ></QuickTimeSelect>
      </div>
    </div>
    <div class="AnalysisForm-height" v-if="tabs.activeName === 'data'" :style="$attrs.height">
      <DataForm ref="DataForm" v-bind="$attrs" />
    </div>

    <!-- 人员选择 -->
    <div class="AnalysisForm-height AnalysisForm-person" v-else>
      <div class="addPersonBtn">
        <el-button type="primary" @click="openSelectDraw(2)">添加人员</el-button>
      </div>

      <!-- 人物选择表格 -->
      <WarnCrowd
        ref="WarnCrowd"
        :cusStyle="{ height: 'calc(100vh - 536px)', padding: 0 }"
        :subHeight="570"
        :personList="personList"
        :idsStr="idsStr"
        :isShow="false"
        @handleDelete="handleDelete"
      ></WarnCrowd>
    </div>

    <!-- 选择人物弹窗 -->
    <drawer
      :drawer.sync="personnelDrawer"
      :cusStyle="{ top: '-16px', height: `${choiceDialogHeight}` }"
      :canTraction="false"
      oldLeft="434px"
      moveLeft="-716px"
    >
      <CusTitle title="防控人群-指定人员选择"></CusTitle>

      <PersonnelTable
        v-if="personnelDrawer.isShow"
        :checkedList="checkedList"
        :cusCheckList="[
          // { color: '#D8B733', label: '拘留人员', isActive: true },
          // { color: '#F03F58', label: '吸毒人员', isActive: false },
          // { color: '#4596E6', label: '重点人员', isActive: false },
          // { color: '#24e2bc', label: '自定义人员', isActive: false },
          { color: '#24e2bc', label: '人物档案', isActive: true }
        ]"
        :tableAtrrs="{
          subHeight: 400,
          pageSize: 20
        }"
        @handleSubmit="handleSubmitPersonnel"
        @handleClose="personnelDrawer.isShow = false"
      ></PersonnelTable>
    </drawer>
  </div>
</template>

<script>
import Tabs from '@/components/BasicComponents/CustomTab'
import validateType from '@/mixins/validateType'
import DataForm from '@/views/offline/analysis/components/AnalysisForm/DataForm'
import WarnCrowd from '@/views/common/warn/components/WarnCrowd'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import PersonnelTable from '@/views/common/warn/components/PersonnelTable'
// import TimePicker from '@/components/VisualComponents/Form/timePicker'
// import TimePicker from '@/components/VisualComponents/TimePicker'
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
export default {
  components: {
    DataForm,
    WarnCrowd,
    Drawer,
    PersonnelTable,
    // TimePicker,
    QuickTimeSelect,
    Tabs
  },

  props: {
    hasTime: {
      type: Boolean,
      default: true
    },
    hasPersonTab: {
      type: Boolean,
      default: true
    }
  },

  mixins: [validateType],

  data () {
    return {
      tabs: {
        list: [
          {
            label: '数据分析',
            name: 'data'
          },
          {
            label: '人员分析',
            name: 'person'
          }
        ],
        activeName: 'data'
      },
      params: {
        startTime: '',
        endTime: ''
      },
      idsStr: '',
      personList: [],
      personnelDrawer: {
        isShow: false
      },
      checkedList: []
    }
  },

  created () {
    if (!this.hasPersonTab) {
      this.tabs.list = [
        {
          label: '数据分析',
          name: 'data'
        }
      ]
    }
  },
  mounted () {
    let clickTask = JSON.parse(localStorage.getItem('clickTask'))
    if (this.$route.query && clickTask && this.$route.query?.id === clickTask?.id.toString()) {
      // console.log(1111);
      // console.log(clickTask);
      // this.$refs.TimePicker.startTime = clickTask.start_time
      this.params.startTime = clickTask.start_time
      // this.$refs.TimePicker.endTime = clickTask.end_time
      this.params.endTime = clickTask.end_time
    }
  },
  computed: {
    hasPerson () {
      const person = this.$store.state.Common.RouterList.find(_c => _c.itemName === '全息档案')
      return person
    },
    choiceDialogHeight () {
      return this.$pxToRem(document.documentElement.clientHeight - 139)
    }
  },

  methods: {
    // tab 切换
    tabsHandleClick (tab) {
      // 切换清空
      this.$nextTick(() => {
        if (tab.name === 'person') {
          this.$refs.DataForm.form.list = [{ data: '', type: '' }]
        } else {
          this.checkedList = []
          this.idsStr = ''
        }

        this.tabs.activeName = tab.name
      })
    },
    // confirmTime (val) {
    //   if (val === null) {
    //     this.params.startTime = ''
    //     this.params.endTime = ''
    //   } else {
    //     this.params.startTime = val[0]
    //     this.params.endTime = val[1]
    //   }
    // },

    // 时间赋值
    // clearTime () {
    //   this.params.startTime = ''
    //   this.params.endTime = ''
    // },
    // 开始时间
    // sChangeTime (e) {
    //   this.params.startTime = e
    // },
    // 结束时间
    // eChangeTime (e) {
    //   this.params.endTime = e
    // },

    // 隐藏 人员表格  获取ids 生成分页表
    handleSubmitPersonnel (selectionList) {
      this.checkedList = [...selectionList]
      this.personList = [...selectionList]
      // this.idsStr = selectionList.map(i => i.certificateNumber).join(',')
      this.personnelDrawer.isShow = false
    },

    // 展示人物选择弹窗
    openSelectDraw () {
      this.personnelDrawer.isShow = true
    },

    // 删除指定人员
    handleDelete (cerNumber) {
      const index = this.checkedList.findIndex(_c => _c.cerNumber === cerNumber)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }
    },

    formatParams (type) {
      this.$nextTick(() => {
        let fd = null
        fd = new FormData()

        if (this.tabs.activeName === 'person') {
          if (this.hasTime && !this.$route.query.attrValue) {
            if (!(this.params.startTime && this.params.endTime)) {
              if (!this.params.startTime) {
                this.$messageTip.error('请选择开始时间！')
                this.$emit('updateLoading', false)
                return false
              }
              if (!this.params.endTime) {
                this.$messageTip.error('请选择结束时间！')
                this.$emit('updateLoading', false)
                return false
              }
              this.$emit('updateLoading', false)
              return false
            }

            for (const key in this.params) {
              fd.append(key, this.params[key])
            }
          }

          if (!this.checkedList.length) {
            this.$messageTip.error('请选择分析人员！')
            this.$emit('updateLoading', false)
            return false
          }
          // console.log(this.checkedList)
          this.checkedList.forEach((item, i) => {
            // fd.append(`neo4jTypeDtoList[${i}].attrTypeValue`, item.certificateNumber)
            // fd.append(`neo4jTypeDtoList[${i}].attrTypeCode`, 'attr_identity_card_type')
            fd.append(`attrs[${i}].attrValue`, item.cerNumber)
            fd.append(`attrs[${i}].attrType`, item.cerType)
          })
          this.$emit('handleReq', fd, this.checkedList)
        } else {
          const { list, imgFile, isImage, file } = this.$refs.DataForm.form
          // const attrList = list.filter(_c => _c.data)
          const attrList = list
          // console.log(attrList);
          if (this.formRule(attrList)) {
            this.bus.$emit('haveValue', true)
            if (this.hasTime) {
              for (const key in this.params) {
                fd.append(key, this.params[key])
              }
            }

            if (type === 'deduction') { // 关系推演
              if (isImage) { // 人脸图片
                fd.append('imgFile', imgFile)
                attrList.forEach((item, i) => {
                  fd.append(`neo4jTypeDtoList[${i}].attrTypeValue`, item.data)
                  fd.append(`neo4jTypeDtoList[${i}].attrTypeCode`, item.type)
                })
                this.$emit('handleReq', fd, attrList)
              } else {
                attrList.forEach((item, i) => {
                  fd.append(`neo4jTypeDtoList[${i}].attrTypeValue`, item.data)
                  fd.append(`neo4jTypeDtoList[${i}].attrTypeCode`, item.type)
                })

                // 返回表单形式
                this.$emit('handleReq', fd, attrList)
              }
            } else {
              if (isImage) { // 人脸图片
                fd.append('file', file)
                attrList.forEach((item, i) => {
                  fd.append(`attrs[${i}].attrValue`, item.data)
                  fd.append(`attrs[${i}].attrType`, item.type)
                })

                let param = {
                  startTime: this.params.startTime,
                  endTime: this.params.endTime,
                  faceImageUrl: file
                }
                this.$emit('clickAnalysis', param, fd)
              } else {
                attrList.forEach((item, i) => {
                  fd.append(`attrs[${i}].attrValue`, item.data)
                  fd.append(`attrs[${i}].attrType`, item.type)
                })


                // 返回表单形式
                this.$emit('handleReq', fd, attrList)
              }
            }
          }
        }
      })
    },

    formRule (attrList) {
      // if (!this.hasTime) return true
      const { list, file } = this.$refs.DataForm.form
      if (this.hasTime && !(this.params.startTime && this.params.endTime) && !this.$route.query.attrValue) {
        if (!this.params.startTime) {
          this.$messageTip.error('请选择开始时间！')
          this.$emit('updateLoading', false)
          return false
        }
        if (!this.params.endTime) {
          this.$messageTip.error('请选择结束时间！')
          this.$emit('updateLoading', false)
          return false
        }
      }
      if (!list[0].data && list[0].type !== 'attr_face_image_type') {
        this.$messageTip.error('请输入准确数值！')
        this.$emit('updateLoading', false)
        return false
      } else if (!file && list[0].type === 'attr_face_image_type') {
        this.$messageTip.error('请上传人脸图片！')
        this.$emit('updateLoading', false)
        return false
      }

      // 校验
      let isReturnflag = true
      attrList.forEach(element => {
        isReturnflag = this.validateValue(element.type, element.data)
      })
      return isReturnflag
    }
  }
}
</script>

<style lang="less" scoped>
.AnalysisForm {
  height: calc(100vh - 340px);
  padding: 0px 12px;
  box-sizing: border-box;
  overflow-y: hidden;
  .Tabs {
    margin-bottom: 24px;
  }
  .pickTime {
    width: 321px;
    padding: 10px 12px 4px 12px;
    margin-bottom: 16px;
    border: 1px solid var(--border-color-input);
    box-sizing: border-box;
    &:hover {
      // border: 1px solid #5288d8;
      border: 1px solid var(--active-color);
    }
    .key {
      color: var(--base-text-color-to-999999);
    }
    .val {
      ::v-deep .quick_time_select {
        width: 100% !important;
        border: none;
        &.active {
          border: none !important;
        }
        .el-input__inner {
          padding: 0;
        }
        .el-range-input {
          // color: red !important;
          width: 41%;
          &::placeholder {
            // color: #c0d0e7 !important;
            color: var(--base-text-color-1-to-666666);
            font-size: 14px;
          }
        }
        .el-range-separator{
          line-height: inherit;
        }
        .dateIcon {
          width: auto;
          .el-icon-date {
            color: var(--base-text-color-1);
          }
        }
      }
    }
  }

  .AnalysisForm-height {
    height: calc(100vh - 465px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .AnalysisForm-person {
    overflow: hidden;
    .addPersonBtn {
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
    }
  }
}
/deep/.btns{
  min-width: 500px !important;
}
</style>
