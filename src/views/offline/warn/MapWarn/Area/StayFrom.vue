<template>
  <div class="rule-wrapper">
    <div class="rule-content">
      <list-title :title="ID ? '修改预警' : '新建预警'" />
      <el-form :rules="rules" ref="ruleForm" class="rule-form" :model="form" label-width="112px">
        <el-form-item label="预警名称：" class="name" prop="warnName">
          <el-input
            v-model="form.warnName"
            placeholder="请输入预警名称"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="逗留时长：" prop="stayDuration">
          <el-input v-model.number="form.stayDuration" placeholder="请输入逗留时长"></el-input>
        </el-form-item>

        <div class="timeItem">
          <el-form-item label="逗留时间段：">
            <TimePick ref="timePick" />
          </el-form-item>

          <span class="police-attention">
            <i class="el-icon-warning-outline"></i>
            如不选择时间，默认为预警规则持续可用
          </span>
        </div>

        <el-form-item label="警报级别：" prop="level">
          <el-select v-model="form.level" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(item, idx) in policeLevel"
              :key="idx"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择场所：" style="margin-bottom: 0">
          <!-- TODO： 目前只支持选一个 -->
          <police-site v-show="cursiteList <= 1" @addSite="addSite" ref="policeSite" />
          <!-- 如果全部场所则显示 -->
          <!-- 非全部场所 -->
          <PoliceSitePannel
            v-if="ID && cursiteList.length === 0"
            :siteList="emptySite"
            :showOp="false"
          />
          <template v-else>
            <PoliceSitePannel
              v-for="(item, idx) in cursiteList"
              :key="idx"
              :siteList="item"
              @delSite="delSite(idx)"
              @editSite="editSite(item, idx)"
            />
          </template>
        </el-form-item>
      </el-form>
      <div class="rule-operator">
        <p-button @click="cancel">取消</p-button>
        <p-button @click="reset">重置</p-button>
        <p-button @click="confirm">确定</p-button>
      </div>
    </div>
  </div>
</template>

<script>
import PButton from '@/components/BasicComponents/Button/index'
import TimePick from '@/components/BasicComponents/TimePick'
import PoliceSite from '_off/warn/MapWarn/site/policeSite'
import PoliceSitePannel from '_off/warn/MapWarn/site/policeSitePannel'
import { mapState, mapActions, mapMutations } from 'vuex'
import { StayAdd, StayEdit, StayQuery } from '@/api/warn'

const rules = {
  warnName: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择警报级别', trigger: 'change' }],
  stayDuration: [
    { required: true, message: '请输入逗留时长', trigger: 'blur' },
    { type: 'number', message: '逗留时长必须为数字值' }
  ]
}

export default {
  components: {
    PButton,
    PoliceSite,
    PoliceSitePannel,
    TimePick
  },
  data () {
    return {
      ready: false,
      rules: rules,
      policeLevel: [
        { label: '轻微预警', value: 1 },
        { label: '一般预警', value: 2 },
        { label: '严重预警', value: 3 }
      ],

      form: {
        warnName: '',
        level: 1,
        stayDuration: '',
        startTime: '',
        endTime: '',
        places: 'all'
      },
      resetParms: {}, // 原始对象
      cursiteList: [], // 当前场所列表
      siteMode: true, // 场所模式  true是新增  false是编辑
      emptySite: [{ placeName: '所有场所', siteAddress: '' }], // 编辑状态：空场所展示的数据
      // 地图变量
      operateList: [] // 操作时的高亮标注列表
    }
  },
  computed: {
    ...mapState('Map', {
      roomListData: 'roomListData'
    }),
    ID () {
      // 是否是编辑模式
      return this.$route.params.id || this.$route.query.id
    },
    selectedSiteID () {
      return this.cursiteList.flat().map(_c => _c.placeCode)
    }
  },
  created () {
    // TODO: 记得取消
    this.getRoomList()
    this.getDeviceList()
    this.ID && this.getDetail(this.ID)
    if (this.ID) {
      this.ready = false
    } else {
      this.ready = true
    }
  },

  methods: {
    ...mapActions('Map', {
      getRoomList: 'getRoomList',
      getDeviceList: 'getDeviceList'
    }),
    ...mapMutations('Map', {
      updateRoomList: 'updateRoomList'
    }),

    cancel () {
      this.$router.push({ name: 'Rules' })
    },
    reset () {
      // if (!this.ID) {
      //新建
      this.form = {
        warnName: '',
        level: 1,
        stayDuration: '',
        startTime: '',
        endTime: '',
        places: 'all'
      }

      this.clearValidate('ruleForm')
      // } else {
      //   //编辑 重置
      //   this.form = JSON.parse(JSON.stringify(this.resetParms))
      // }
    },

    confirm () {
      this.$nextTick(() => {
        this.form.startTime = this.$refs.timePick.startTime
        this.form.endTime = this.$refs.timePick.endTime

        if (!this.form.startTime) {
          this.form.startTime = '00:00'
        }

        if (!this.form.endTime) {
          this.form.endTime = '23:59'
        }

        if (
          this.form.endTime.split(':')[0] - this.form.startTime.split(':')[0] <
          this.form.stayDuration
        ) {
          this.$messageTip.error('逗留时长不可大于逗留时间段')
          return
        }

        // 添加 还是 编辑
        const postUrl = this.ID ? StayEdit : StayAdd
        const placesSites = this.cursiteList
          .flat()
          .map(_c => _c.placeCode)
          .join(',')
        this.form.places = placesSites ? placesSites : 'all'
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.form))
            postUrl(params)
              .then(() => {
                this.$message({
                  message: this.ID ? '修改成功' : '新建成功',
                  type: 'success',
                  duration: 1500,
                  customClass: 'messageBox'
                })
                setTimeout(() => {
                  this.$router.push({ name: 'Rules' })
                }, 500)
              })
              .catch(() => {})
          }
        })
      })
    },
    // 获取详情
    getDetail (editId) {
      StayQuery(editId).then(res => {
        this.$nextTick(() => {
          this.$refs.timePick.startTime = res.startTime || ''
          this.$refs.timePick.endTime = res.endTime || ''
        })

        this.formatParams(res)
        this.resetParms = JSON.parse(JSON.stringify(res))
        this.transformPlace()
      })
    },
    formatParams (obj) {
      this.form = obj
      this.ready = true
    },
    transformPlace () {
      if (this.form.places === 'all') {
        this.form.places = ''
        return
      }
      // const places = this.form.places.split(',')
      const re = []

      this.cursiteList = re
    },
    // 清除验证
    clearValidate (formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    // 删除场所
    delSite (idx) {
      this.cursiteList.splice(idx, 1)
    },
    // 编辑场所
    editSite (item, idx) {
      console.log('🚀 ~ file: StayFrom.vue ~ line 255 ~ editSite ~ item, idx', item, idx)
      // -1则是编辑
      if (idx !== -1) {
        this.siteMode = false // 将模式设置为编辑
        this.cursiteList[idx] = item

        this.roomListData.forEach((item, index) => {
          if (this.selectedSiteID.includes(item.placeCode)) {
            this.updateRoomList({ idx: index, flag: true })
          }
        })
        this.$refs['policeSite'].dialogVisible = true
        // this.$forceUpdate()
      }
    },

    // 添加场所变化
    addSite (siteInfo) {
      if (this.siteMode) {
        // 新增模式
        this.cursiteList.push([...siteInfo])
      } else {
        this.cursiteList = [siteInfo]
      }
      this.$nextTick(() => {
        this.siteMode = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rule-wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.rule-wrapper /deep/ input {
  color: var(--base-text-color-1);
}

.rule-content {
  display: 1;
}

.rule-form {
  padding: 12px 60px 0 60px;
}

.rule-form /deep/ .el-input__inner {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rule-form /deep/ .el-checkbox__inner {
  background: transparent;
}

.rule-operator {
  flex-basis: 60px;
  text-align: right;
  position: absolute;
  right: 60px;
  bottom: 15px;
}

.rule-operator /deep/ .p-button {
  margin-right: 16px;
}
/* 时间控件样式 */
.rule-form /deep/ .el-date-editor .el-range__icon {
  display: none;
}
.rule-form /deep/.el-date-editor .el-range-input {
  text-align: center;
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

.police-site {
  display: flex;
  align-items: center;
  .police-btn {
    display: flex;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
    color: #177ddc;
    width: 80px;
    justify-content: space-between;
  }
  .police-site-attention {
    color: var(--base-text-color-to-999999);
    font-size: 14px;
    user-select: none;
  }
}

/deep/.el-form-item {
  width: 500px !important;
}
/deep/.el-dialog {
  height: calc(100vh - 200px);
}
/deep/.el-dialog__body {
  padding: 0 !important;
}

/deep/.rule-form .el-form-item {
  margin-bottom: 24px !important;
}
</style>
