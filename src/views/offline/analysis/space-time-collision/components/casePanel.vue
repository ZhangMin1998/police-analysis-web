<template>
  <div>
    <div class="_con casepanel" @click="activeIndex = -1">
      <NoticePanel :width="434" :left="false">
        <template v-slot:stepDot>
          <div class='case_info'>
            <div class="item time_">
              <div>案发点信息</div>
              <div class="close" @click.prevent.stop="handleCancel">
                <i class="el-icon-close"></i>
              </div>
            </div>
            <el-form
              class="caseForm"
              ref="form"
              :model="form"
              :rules="rules"
            >
              <div
                :class="`item form_item ${activeIndex == 1 ? 'active' : ''}`"
                @click.prevent.stop="activeEvent(1)"
              >
                <div class="key">时间</div>
                <div class="val time_">
                  <el-form-item prop="caseTime" style="width: 100%">
                    <el-date-picker
                      style="width:95%"
                      class="pickertime"
                      v-model="form.caseTime"
                      type="datetime"
                      placeholder="选择日期"
                      :picker-options="pickerOptions0"
                      :editable='false'
                      value-format="yyyy-MM-dd HH:mm"
                      format="yyyy-MM-dd HH:mm"
                    >
                    </el-date-picker>
                    <i class="el-icon-date"></i>
                  </el-form-item>
                </div>
              </div>
              <div
                :class="`item form_item ${activeIndex == 2 ? 'active' : ''}`"
                @click.prevent.stop="activeEvent(2)"
              >
                <div class="key">地点描述</div>
                <div>
                  <el-form-item prop="caseName" style="width: 100%">
                    <el-input
                      type="text"
                      placeholder="请输入"
                      v-model="form.caseName"
                      maxlength="20"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="item">选择场所</div>

              <div class="item">
                <ChooseMode v-model="selectMode" @change="seleceModeChange" />
              </div>
              <div class="item placeList" :style="`min-height:80px;height:${screenHeight - 720}px;`">
                <el-checkbox-group v-model="placeIdList" @change="handleChecked">
                  <el-checkbox
                    @change="handleSingleChecked(item, $event)"
                    v-for="(item, idx) in checkPlaceList"
                    :style="checkPlaceList.length - 1 == idx ? '' : 'margin-bottom:4px'"
                    :key="item.placeId"
                    :label="item.placeId"
                    name="type"
                  >{{ item.placeName }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
              <div class="item">选择调用数据时间段</div>
              <div
                :class="`item form_item ${activeIndex == 3 ? 'active' : ''}`"
                @click.prevent.stop="activeEvent(3)"
              >
                <div class="key">时间区间</div>
                <div class="qujian">
                  <el-form-item prop="timeArea" style="width: 100%">
                    <el-time-picker
                      is-range
                      v-model="form.timeArea"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      format="HH:mm"
                      value-format="HH:mm"
                    >
                    </el-time-picker>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <div class="btns">
              <div
                :class="['p-button', { disable: item.isLoading }]"
                v-for="(item, index) in buttonList"
                :key="index"
                @click="item.event"
              >
                {{ item.isLoading ? '提交中...' : item.text }}
              </div>
            </div>
          </div>
        </template>
      </NoticePanel>
    </div>

    <!-- ------------------  进度条  ----------------- -->
    <!-- <ProgressBox
      title="数据分析中..."
      @beforeClose="closeProgress"
      :show.sync="showProgress"
    /> -->
  </div>
</template>

<script>
const rules = {
  caseName: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  timeArea: [{ required: true, message: '请选择时间区域', trigger: 'change' }],
  caseTime: [{ required: true, message: '请选择案发点日期', trigger: 'change' }]
}
import { mapState } from 'vuex'
import dayjs from '@/utils/filters'
import NoticePanel from '@/components/Map/CommonMap/Analysis/noticePanel'
import ChooseMode from '@/components/Map/CommonMap/Analysis/choosePlace'
import { addCase, getCase, updateCase } from '@/api/analysis'

// import ProgressBox from '@/components/VisualComponents/Form/progressBox'
export default {
  components: {
    NoticePanel,
    ChooseMode,
    // ProgressBox
  },

  inject: ['HighlightDevice'],

  props: {
    list: {
      // 渲染的标注
      type: Array,
      default: () => []
    },
    editId: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      showProgress: false,
      form: {
        time: '', // 日期
        timeArea: [], // 时间区域
        startTime: '',
        endTime: '',
        caseName: '',
        placeList: [], //已选择多选框场所列表
        longitude: '',
        latitude: '',
        caseTime: ''
      },
      placeIdList: [], //
      checkPlaceList: [], //多选框所有场所列表
      rules: rules,
      buttonList: [
        { text: '取消', event: this.handleCancel },
        { text: '确定', event: this.submit, isLoading: false }
      ],
      activeIndex: -1,
      selectMode: 1, // 1 单选 2 框选
      pickerOptions0: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
        selectableRange: ''
      }
      // pickerOptions1: {
      //   selectableRange: ['09:30:00 - 12:00:00', '14:30:00 - 18:30:00'],
      // },
    }
  },

  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),
    getTime () {
      return this.form.time
    }
  },
  watch: {
    editId (newValue) {
      if (!newValue) return
      this.resetEdit()
    },
    getTime: {
      handler (newValue) {
        if (!newValue) return
        let nowTimeStr = dayjs.filtertoS(Date.now())
        let newTimeList = newValue.split(' ')
        let nowTimeList = nowTimeStr.split(' ')

        let st = '00:00:00'
        let et = ''
        // 选择的开始时间==今天的时间/结束时间
        if (nowTimeList[0] == newTimeList[0]) {
          et = nowTimeList[1]
        } else {
          et = '23:59:59'
        }
        this.pickerOptions0.selectableRange = st + ' - ' + et
      }
    }
  },
  created () {
    if (this.editId) {
      this.resetEdit()
    } else {
      this.resetAdd()
    }
  },
  beforeDestroy () {
    this.selectMode = 1
  },

  methods: {
    delCheckBox (e) {
      let index = this.checkPlaceList.findIndex(item => item.placeId == e.id)
      this.checkPlaceList.splice(index, 1)
    },
    addCheckBox (e) {
      let idx = this.checkPlaceList.findIndex(item => item.placeId == e.id)
      let curId
      if (idx == -1) {
        // 找不到则加入到选中列表中
        this.checkPlaceList.push({ placeId: e.id, placeName: e.name })
        curId = e.id
      } else {
        // 找得到则去掉
        this.checkPlaceList.splice(idx, 1)
        // curId = this.checkPlaceList[idx].placeId
      }
      // if (this.placeIdList.includes(curId)) return
      this.placeIdList.push(curId)
    },
    resetAdd () {
      if (!this.list && !this.list.length) return false
      this.form.longitude = this.list[this.list.length - 1][0]
      this.form.latitude = this.list[this.list.length - 1][1]
      this.form.timeArea[0] = dayjs.filterY('2020-9-24 00:00:00')
      this.form.timeArea[1] = dayjs.filterY('2020-9-24 23:59:59')
    },
    resetEdit () {
      getCase(this.editId)
        .then(res => {
          res.timeArea = []
          res.timeArea[0] = dayjs.filterY(res.time + ' ' + res.startTime + ':00')
          res.timeArea[1] = dayjs.filterY(res.time + ' ' + res.endTime + ':00')
          if (res.placeList && res.placeList.length) {
            this.placeIdList = res.placeList.map(item => {
              return item.placeId
            })
          }
          // this.HighlightDevice(this.placeIdList)
          this.checkPlaceList = res.placeList
          this.form = res
        })
        .catch(() => {})
    },
    activeEvent (index) {
      this.activeIndex = index
    },

    // 多选框 change
    handleChecked () {
      this.$emit('handleChecked', this.placeIdList)
    },
    // 单个点击  作用范围：在线地图
    handleSingleChecked (value, status) {
      this.$emit('handleSingleChecked', { status, id: [value.placeId] })
    },

    handleCancel () {
      this.$emit('beforeCloseCase', this.editId)
    },

    submit () {
      this.form.id = this.editId || ''
      this.form.personId = localStorage.getItem('personId')
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!this.placeIdList.length) {
            this.$messageTip.error('请至少选择一个场所！')
            return false
          }

          this.form.time = this.form.caseTime.split(' ')[0]
          this.form.startTime = this.form.timeArea[0]
          this.form.endTime = this.form.timeArea[1]
          if (this.form.startTime.length > 6) {
            this.form.startTime = dayjs.filterHM(this.form.startTime)
            this.form.endTime = dayjs.filterHM(this.form.endTime)
          }
          //编辑
          // this.form.placeList = []
          this.form.placeList = []
          this.checkPlaceList.forEach(item => {
            this.placeIdList.forEach(element => {
              if (item.placeId == element) {
                this.form.placeList.push(item)
              }
            })
          })
          this.req()
        }
      })
    },

    openProgressBox () {
      this.showProgress = true
    },

    req () {
      let requireStr = this.editId ? updateCase : addCase
      requireStr(this.form)
        .then(res => {
          // 安乡版需求
          // if (res && typeof res != 'object') {
          //   res = JSON.parse(res)
          //
          //   if (res.code === '2') {
          //     this.form.id = res.data.id
          //     window.setTimeout(() => {
          //       this.req()
          //     }, 10000)
          //     return false
          //   }
          // }
          if (res && res.code && +res.code === 2) {
            this.form.id = res.data.id
            window.setTimeout(() => {
              this.req()
            }, 10000)
            return false
          }
          this.$messageTip.success(this.editId ? '修改成功！' : '新建成功！')
          this.closeProgress()

          // 关闭新建弹窗
          this.$emit('beforeCloseCase', this.editId ? this.editId : 1)
          this.$store.dispatch('analysisJudgement/queryCase')
        })
        .catch(() => {
          this.closeProgress()
        })
    },
    // 选择模式的变化
    seleceModeChange (val) {
      this.$emit('selectModeChange', val)
    },
    /**
     * 关闭进度条 弹窗
     */
    closeProgress () {
      // 取消 显示搜索信息
      this.showProgress = false
      this.buttonList[1].isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
._con {
  height: 100%;
  position: absolute;
  right: 428px;
  top: 0;
  z-index: 1000;
  font-size: 18px;
  color: var(--base-text-color-1);
  .item {
    margin-bottom: 16px;
    &.form_item {
      border: 1px solid var(--border-color-input);
      padding: 10px 12px 4px 12px;
      margin-bottom: 24px;
      /deep/.el-input__inner {
        border: none;
        padding: 0;
      }
      /deep/.el-input__prefix {
        .el-input__icon {
          display: none;
        }
      }
      &:hover {
        border: 1px solid #5288d8;
      }
      .key {
        color: var(--base-text-color-to-999999);
      }
    }
    &.active {
      border: 1px solid #5288d8;
    }
  }
  .time_ {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pickertime {
      flex: 1 1 auto;
    }
  }
  .qujian {
    display: flex;
    align-items: center;
  }
  .placeList,
  .caseForm {
    overflow: auto;
  }
}
.close {
  font-size: 24px;
}
.close:hover {
  color: #5288d8;
}
.disable {
  cursor: not-allowed;
}

.btns {
  display: flex;
  justify-content: flex-end;
  div:first-child {
    margin-right: 16px;
  }
}
.case_info {
  display: flex;
  flex-direction: column;
  height: 100%;
  .caseForm {
    flex: 1;
  }
}
.casepanel {
  /deep/.el-form-item__error {
    top: 115%;
  }
}
</style>
