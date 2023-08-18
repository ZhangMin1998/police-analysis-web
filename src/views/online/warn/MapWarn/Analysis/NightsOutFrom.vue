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

        <el-form-item label="周期天数：" prop="periodNum">
          <el-input v-model.number="form.periodNum" placeholder="请输入周期天数"></el-input>
        </el-form-item>

        <el-form-item label="白天出现天数：" prop="dayNum">
          <el-input v-model.number="form.dayNum" placeholder="请输入白天出现天数"></el-input>
        </el-form-item>

        <el-form-item label="夜间出现天数：" prop="nightNum">
          <el-input v-model.number="form.nightNum" placeholder="请输入深夜出现天数"></el-input>
        </el-form-item>

        <div class="timeItem">
          <el-form-item label="白天时间段：">
            <TimePick ref="timePick1" :limitTime="['06:00:00 - 18:00:00']" />

            <span class="police-attention">
              <i class="el-icon-warning-outline"></i>
              如不选择时间，默认为 6:00 - 18:00 持续可用
            </span>
          </el-form-item>
        </div>

        <div class="timeItem">
          <el-form-item label="夜间时间段：">
            <TimePick
              ref="timePick2"
              :isNight="true"
              :limitTime="['18:00:00 - 23:59:59', '00:00:00 - 06:00:00']"
            />

            <span class="police-attention">
              <i class="el-icon-warning-outline"></i>
              如不选择时间，默认为 18:00 - 6:00 持续可用
            </span>
          </el-form-item>
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
          <div class="police-site" v-if="!cursiteList.length">
            <div class="police-btn" @click="dialogOpen">
              <div style="padding-top: 3px">
                <img src="@/assets/img/icon-circle-plus.png" alt="" />
              </div>
              <div>
                <span>添加场所</span>
              </div>
            </div>
            <div>
              <span class="police-site-attention">
                <i class="el-icon-warning-outline"></i>
                如果不添加系统默认所有场景
              </span>
            </div>
          </div>
          <!-- 场所面板 -->
          <site-pannel
            v-if="ID || cursiteList.length"
            @editSite="editSite"
            @delSite="delSite"
            :list="cursiteList"
          />
        </el-form-item>
      </el-form>
      <div class="rule-operator">
        <p-button @click="cancel">取消</p-button>
        <p-button @click="reset">重置</p-button>
        <p-button @click="confirm">确定</p-button>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      custom-class="p-dialog"
      append-to-body
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
      width="86%"
      top="13vh"
      :close-on-click-modal="false"
    >
      <div class="site-wrapper">
        <amap :center="center" :curStyle="curStyle">
          <map-search></map-search>
          <chooseMode v-model="markerMode" />
          <!-- 地图工具栏 -->
          <map-control :list="iconMiniData" />
          <!-- 覆盖物 -->
          <room-overlay
            :list="rootListChoose"
            ref="overlay"
            @trigger="trigger"
            :mode="markerMode"
            :markerCls="calcCls"
          />
        </amap>
      </div>
      <span slot="footer" class="dialog-footer">
        <p-button class="" @click="dialogClose">取 消</p-button>
        <p-button class="" @click="dialogConfirm">确 定</p-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AmapMixins from '@/mixins/amap'
import SitePannel from '_on/warn/MapWarn/site/site-pannel'
import PButton from '@/components/BasicComponents/Button/index'
import MapSearch from '_com/deviceMap/mapSerach'
import roomOverlay from '@/components/Map/OnlineMap/choose-marker/room.vue'
import chooseMode from '@/components/Map/OnlineMap/chooseMode'

import { mapState, mapActions } from 'vuex'
import { NightsOutAdd, NightsOutEdit, NightsOutQuery } from '@/api/warn'

import TimePick from '@/components/BasicComponents/TimePick'

const rules = {
  warnName: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择警报级别', trigger: 'change' }],
  periodNum: [
    { required: true, message: '请输入周期天数', trigger: 'blur' },
    { type: 'number', message: '周期天数必须为数字值' }
  ],
  dayNum: [
    { required: true, message: '请输入白天出现天数', trigger: 'blur' },
    { type: 'number', message: '白天出现天数必须为数字值' }
  ],
  nightNum: [
    { required: true, message: '请输入夜间出现天数', trigger: 'blur' },
    { type: 'number', message: '夜间出现天数必须为数字值' }
  ]
}

export default {
  mixins: [AmapMixins],
  components: {
    PButton,
    SitePannel,
    MapSearch,
    roomOverlay,
    chooseMode,
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
        periodNum: '',
        dayNum: '',
        nightNum: '',
        dayStartTime: '',
        dayEndTime: '',
        nightStartTime: '',
        nightEndTime: '',
        places: 'all'
      },
      resetParms: {}, // 原始对象
      cursiteList: [], // 当前场所列表
      siteMode: true, // 场所模式  true是新增  false是编辑
      emptySite: [{ placeName: '所有场所', siteAddress: '' }], // 编辑状态：空场所展示的数据
      // 弹窗变量
      dialogVisible: false, // 弹窗显隐变量
      // 地图变量
      iconMiniData: [{ type: '', text: '场所', url: 'icon-tab-room.png' }],
      curStyle: 'height: calc( 100vh - 200px )',
      markerMode: 1, // 单选 1 框选 2
      operateList: [] // 操作时的高亮标注列表
    }
  },
  computed: {
    ...mapState('Map', {
      rootListChoose: 'rootListChoose'
    }),

    ID () {
      return this.$route.query.id || this.$route.params.id
    }
  },
  created () {
    // TODO: 记得取消
    this.getRoomList()
    this.ID && this.getDetail(this.ID)
    if (this.ID) {
      this.ready = false
    } else {
      this.ready = true
    }
  },

  methods: {
    ...mapActions('Map', {
      getRoomList: 'getRoomList'
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
        periodNum: '',
        dayNum: '',
        nightNum: '',
        dayStartTime: '',
        dayEndTime: '',
        nightStartTime: '',
        nightEndTime: '',
        places: 'all'
      }

      this.clearValidate('ruleForm')
      // } else {
      //   //编辑 重置
      //   this.form = { ...this.resetParms }
      // }
    },

    confirm () {
      this.$nextTick(() => {
        this.form.dayStartTime = this.$refs.timePick1.startTime
        this.form.dayEndTime = this.$refs.timePick1.endTime

        this.form.nightStartTime = this.$refs.timePick2.startTime
        this.form.nightEndTime = this.$refs.timePick2.endTime

        if (!this.form.dayStartTime) {
          this.form.dayStartTime = '6:00'
        }
        if (!this.form.dayEndTime) {
          this.form.dayEndTime = '18:00'
        }
        if (!this.form.nightStartTime) {
          this.form.nightStartTime = '18:00'
        }
        if (!this.form.nightEndTime) {
          this.form.nightEndTime = '6:00'
        }

        // 添加 还是 编辑
        const postUrl = this.ID ? NightsOutEdit : NightsOutAdd
        const placesSites = this.cursiteList
          .flat()
          .map(_c => _c.placeCode)
          .join(',')
        this.form.places = placesSites ? placesSites : 'all'
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            const params = { ...this.form }
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
      NightsOutQuery(editId).then(res => {
        this.$nextTick(() => {
          this.$refs.timePick1.startTime = res.dayStartTime
          this.$refs.timePick1.endTime = res.dayEndTime

          this.$refs.timePick2.startTime = res.nightStartTime
          this.$refs.timePick2.endTime = res.nightEndTime
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
      const places = this.form.places.split(',')
      const re = []
      this.rootListChoose.forEach((item) => {
        const code = item.placeCode
        if (places.includes(code)) {
          re.push({
            placeCode: item.placeCode,
            placeName: item.placeName,
            siteAddress: item.siteAddress,
            isActive: true
          })
          // this.updateRoomList({ idx, flag: true })
        }
      })
      this.cursiteList = re
    },
    // 清除验证
    clearValidate (formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    // 删除场所
    delSite () {
      // this.cursiteList.splice(idx, 1)
      this.cursiteList = []
      this.operateList = []
    },
    // 编辑场所
    editSite () {
      // -1则是编辑
      this.operateList = JSON.parse(JSON.stringify(this.cursiteList))
      this.dialogVisible = true
      this.refreshMarker(this.operateList)
    },
    dialogOpen () {
      this.dialogVisible = true
      this.refreshMarker(this.cursiteList)
    },
    // 弹窗关闭
    dialogClose () {
      this.dialogVisible = false
      this.refreshMarker(this.cursiteList)
    },
    // 弹窗确认
    // 这里 confirm 才对 list 赋值
    dialogConfirm () {
      this.dialogVisible = false
      this.cursiteList = JSON.parse(JSON.stringify(this.operateList))
    },
    // 计算marker 样式
    calcCls ({ isActive }) {
      return isActive ? 'icon-tab-room-active marker-img' : 'icon-tab-room-normal marker-img'
    },
    // 操作 marker 的回调
    trigger (markerData) {
      const { isActive, placeCode, placeName, siteAddress } = markerData
      const temp = {
        isActive,
        placeCode,
        placeName,
        siteAddress
      }
      if (markerData.isActive) {
        this.operateList.push(temp)
      } else {
        const idx = this.operateList.findIndex(site => site === placeCode)
        this.operateList.splice(idx, 1)
      }
    },
    /**
     * 刷新标注高亮状态
     * list 高亮的标注
     */
    refreshMarker (list) {
      const ids = list.map(site => site.placeCode)
      this.$nextTick(() => {
        this.$refs['overlay'].accordIDRender(ids)
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
  right: -380px;
  top: 2%;
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
</style>
