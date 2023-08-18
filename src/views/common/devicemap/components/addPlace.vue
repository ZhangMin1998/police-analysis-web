<template tag="not_change_rem">
  <div class="rule-wrapper">
    <div class="rule-content">
      <list-title :title="ID ? '修改场所' : '新建场所'" />
      <el-form :rules="rules" ref="ruleForm" class="rule-form" :model="form" label-width="100px">
        <el-form-item label="场所名称：" class="name" prop="placeName">
          <el-input
            v-model="form.placeName"
            placeholder="请输入场所名称"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="场所编号：" class="name" prop="placeCode">
          <el-input
            v-model="form.placeCode"
            placeholder="请输入14位场所编号"
            maxlength="14"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="场所类型：" prop="placeType">
          <el-select v-model="form.placeType" placeholder="请选择场所类型" style="width: 100%;">
            <el-option
              v-for="(item, idx) in PlaceType"
              :key="idx"
              :value="item.dictDataCode"
              :label="item.dictDataValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="经营性质：" prop="accessType">
          <el-select v-model="form.accessType" placeholder="请选择经营性质" style="width: 100%;">
            <el-option
              v-for="(item, idx) in AccessType"
              :key="idx"
              :value="item.dictDataCode"
              :label="item.dictDataValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择场所：" style="margin-bottom:0;">
          <Site />
        </el-form-item>

        <el-form-item class="p" v-if="this.form.siteAddress">
          <div>地址：{{ this.form.siteAddress }}</div>
          <div>经度：{{ this.form.longitude }}</div>
          <div>纬度：{{ this.form.latitude }}</div>
        </el-form-item>
      </el-form>
      <div class="rule-operator">
        <p-button @click="cancel">取消</p-button>
        <p-button @click="reset">重置</p-button>
        <p-button @click="confirm">{{ loading ? '提交中' : '确定' }}</p-button>
      </div>
    </div>
  </div>
</template>

<script>
import Site from '@/views/common/devicemap/components/SelectSite'
import { getAllType, placeInsert, placeUpdate } from '@/api/config'
import { queryDevicePlace } from '@/api/equipMap'
import PButton from '@/components/BasicComponents/Button/index'
import { _pos } from '@/config/user.js'

const rules = {
  placeName: [{ required: true, message: '请输入场所名称', trigger: 'blur' }],
  placeCode: [{ required: true, message: '请输入14位的场所编号', trigger: 'blur' },{min:14,max:14, message: '请输入14位的场所编号', trigger: 'blur'}],
  placeType: [{ required: true, message: '请选择场所类型', trigger: 'change' }],
  accessType: [{ required: true, message: '请选择经营性质', trigger: 'change' }]
}

export default {
  components: {
    Site,
    PButton
  },

  provide: function () {
    return {
      placeform: this.form,
      setParams: this.setParams,
      clearPlaceform: this.clearPlaceform
    }
  },

  data () {
    return {
      loading: false,
      PlaceType: [],
      AccessType: [],
      wordNums: 0,
      rules: rules,
      form: {
        placeName: '',
        placeCode: '',
        placeType: '',
        accessType: '',
        longitude: '',
        latitude: '',
        siteAddress: '',
        _GdPos: []
      },
      resetParms: {} // 原始对象
    }
  },

  computed: {
    ID () {
      // 是否是编辑模式
      return this.$route.params.id || this.$route.query.id
    }
  },

  mounted () {
    this.queryTypeList()
    this.ID && this.getDetail(this.ID)
  },

  methods: {
    clearPlaceform () {
      this.form.longitude = ''
      this.form.latitude = ''
      this.form.siteAddress = ''
      this.form._GdPos = []
    },

    getDetail (id) {
      queryDevicePlace({ id: id })
        .then(res => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = res[key] + ''
          })
          this.form._GdPos = _pos(this.form.longitude, this.form.latitude)
          this.resetParms = JSON.parse(JSON.stringify(this.form))
        })
        .catch(() => {})
    },

    /** 获取下拉列表数据*/
    queryTypeList () {
      getAllType()
        .then(res => {
          this.PlaceType = res.PlaceType
          this.AccessType = res.AccessType
        })
        .catch(() => {})
    },

    /** 取消返回 设备列表页面 */
    cancel () {
      this.$router.push({ name: 'deviceManage' })
    },

    /** 表单重置 新建为空  编辑为赋值 */
    reset () {
      // if (!this.ID) {
      this.form = {
        placeName: '',
        placeCode: '',
        placeType: '',
        accessType: '',
        longitude: '',
        latitude: '',
        siteAddress: '',
        _GdPos: []
      }
      // } else {
      //   this.form = JSON.parse(JSON.stringify(this.resetParms))
      // }
      /** 清空校验提示语 */
      this.clearValidate('ruleForm')
    },

    setParams (siteParams) {
      this.form._GdPos = [siteParams.longitude, siteParams.latitude]

      this.form.longitude = JSON.parse(JSON.stringify(siteParams.longitude))
      this.form.latitude = JSON.parse(JSON.stringify(siteParams.latitude))

      this.form.siteAddress = siteParams.siteAddress
    },

    /** 提交表单  */
    confirm () {
      if (this.loading) return
      // 添加 还是 编辑
      const postUrl = this.ID ? placeUpdate : placeInsert

      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!this.form.siteAddress) {
            this.$messageTip.error('请选择位置')
            return false
          }

          if (this.ID) {
            this.form.id = this.ID
          }

          [this.form.longitude, this.form.latitude] = _pos(this.form.longitude, this.form.latitude)
          const params = JSON.parse(JSON.stringify(this.form))

          postUrl(params)
            .then(() => {
              this.loading = false
              this.$message({
                message: this.ID ? '修改成功' : '新建成功',
                type: 'success',
                duration: 1500,
                customClass: 'messageBox'
              })
              setTimeout(() => {
                this.$router.push({ name: 'deviceManage' })
              }, 500)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    /** 清空校验提示语 */
    clearValidate (formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>

<style scoped>
.rule-form .el-form-item {
  margin-bottom: 24px !important;
  width: 500px;
}
.rule-wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.rule-wrapper >>> input {
  color: var(--base-text-color-1);
}

.rule-content {
  display: 1;
}

.rule-form {
  padding: 12px 60px 0 60px;
}

.rule-form >>> .el-input__inner {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rule-form >>> .el-checkbox__inner {
  background: transparent;
}

.rule-operator {
  flex-basis: 60px;
  text-align: right;
  position: absolute;
  right: 60px;
  bottom: 15px;
}

.rule-operator >>> .p-button {
  margin-right: 16px;
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

.p {
  color: var(--base-text-color-1);
  font-size: 16px;
  line-height: 20px;
}
</style>
