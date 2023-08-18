<template tag="not_change_rem">
  <div class="rule-wrapper">
    <div class="rule-content">
      <list-title :title="ID ? '修改设备' : '新建设备'" />

      <el-form :rules="rules" ref="ruleForm" class="rule-form" :model="form" label-width="100px">
        <el-form-item label="设备名称：" class="name" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>

        <!-- <el-form-item label="设备编号：" class="name" prop="placeCode">
          <el-input v-model="form.placeCode" placeholder="请输入设备编号"></el-input>
        </el-form-item> -->

        <el-form-item label="设备MAC：" class="name" prop="deviceMac">
          <el-input v-model="form.deviceMac" placeholder="请输入设备MAC"></el-input>
        </el-form-item>

        <el-form-item label="设备类型：" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 100%;">
            <el-option
              v-for="(item, idx) in DeviceType"
              :key="idx"
              :value="item.dictDataCode"
              :label="item.dictDataValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="厂商名称：" class="name" prop="factoryCode">
          <el-input v-model="form.factoryCode" placeholder="请输入厂商名称"></el-input>
        </el-form-item>

        <el-form-item label="选择设备位置：" style="margin-bottom:0;">
          <Site />
        </el-form-item>

        <el-form-item class="p" v-if="this.form.deviceAddress">
          <div>地址：{{ this.form.deviceAddress }}</div>
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
import { queryDevicePlace } from '@/api/equipMap'
import { getAllType, deviceInsert, deviceUpdate, deviceGetById } from '@/api/config'
import PButton from '@/components/BasicComponents/Button/index'
import { _pos } from '@/config/user.js'

const rules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  // placeCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  deviceMac: [{ required: true, message: '请输入设备MAC', trigger: 'blur' }],
  factoryCode: [{ required: true, message: '请输入厂商名称', trigger: 'blur' }]
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
      DeviceType: [],
      wordNums: 0,
      rules: rules,
      form: {
        deviceName: '',
        // placeCode: '',
        deviceType: '',
        longitude: '',
        latitude: '',
        deviceAddress: '',
        deviceMac: '',
        factoryCode: '',
        _GdPos: []
      },
      resetParms: {} // 原始对象
    }
  },

  computed: {
    ID () {
      // 是否是编辑模式
      return this.$route.params.id || this.$route.query.id
    },
    placeID () {
      return this.$route.params.placeid || this.$route.query.placeid
    }
  },

  mounted () {
    this.form.placeId = this.placeID

    this.queryTypeList()
    this.ID && this.getDetail(this.ID)
  },

  methods: {
    clearPlaceform () {
      this.form.longitude = ''
      this.form.latitude = ''
      this.form.deviceAddress = ''
      this.form._GdPos = []
    },
    getSite (res) {
      queryDevicePlace({
        placeCode: res.placeCode
      }).then(placeRes => {
        this.resetParms.deviceAddress = placeRes.siteAddress
        this.form.deviceAddress = placeRes.siteAddress
      })
    },
    getDetail (id) {
      deviceGetById(id)
        .then(res => {
          console.log(res);
          Object.keys(this.form).forEach(key => {
            this.form[key] = res[key] + ''
          })
          this.placeId = res.placeId || ''
          this.form._GdPos = _pos(this.form.longitude, this.form.latitude)
          this.resetParms = JSON.parse(JSON.stringify(this.form))
          if (!res.deviceAddress) {
            this.getSite(res)
          }
        })
        .catch(() => {})
    },

    /** 获取下拉列表数据*/
    queryTypeList () {
      getAllType()
        .then(res => {
          this.DeviceType = res.DeviceType
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
        deviceName: '',
        // placeCode: '',
        deviceType: '',
        longitude: '',
        latitude: '',
        deviceAddress: '',
        deviceMac: '',
        factoryCode: '',
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

      this.form.deviceAddress = siteParams.siteAddress
    },

    /** 提交表单  */
    confirm () {
      if (this.loading) return
      // 添加 还是 编辑
      const postUrl = this.ID ? deviceUpdate : deviceInsert

      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!this.form.deviceAddress) {
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
