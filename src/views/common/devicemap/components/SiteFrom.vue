<template tag="not_change_rem">
  <div id="siteFrom">
    <div class="header">
      {{ title }}
    </div>
    <div>
      <el-form :rules="rules" ref="ruleForm" class="rule-form" :model="form" label-width="58px">
        <el-form-item class="not_change_rem" label="地址：" prop="siteAddress">
          <el-input
            v-model="form.siteAddress"
            placeholder="请输入详情地址"
            maxlength="20"
            show-word-limit
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item class="not_change_rem" label="经度：" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="not_change_rem" label="纬度：" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入经度" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div class="rule-operator">
        <p-button @click="del">删除</p-button>
        <p-button @click="confirm">确定</p-button>
      </div>
    </div>
  </div>
</template>

<script>
import PButton from '@/components/BasicComponents/Button/index'
const rules = {
  siteAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
  latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
}

export default {
  components: {
    PButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    parentLocation: {
      type: Array,
      default: () => [],
    },
  },

  inject: ['placeform', 'clearPlaceform'],

  data () {
    return {
      form: {
        siteAddress: '',
        longitude: '',
        latitude: '',
      },
      rules: rules,
    }
  },
  watch: {
    parentLocation (newValue) {
      if (!newValue) return
      this.form.longitude = this.parentLocation[0] || ''
      this.form.latitude = this.parentLocation[1] || ''
      this.form.siteAddress = ''
    },
  },

  created () {
    this.form.longitude = this.parentLocation[0] || ''
    this.form.latitude = this.parentLocation[1] || ''

    let newplaceform = JSON.parse(JSON.stringify(this.placeform))

    if (newplaceform.deviceAddress || newplaceform.siteAddress) {
      this.form.siteAddress = newplaceform.deviceAddress || newplaceform.siteAddress
    }
  },

  methods: {
    del () {
      this.form = {
        siteAddress: '',
        longitude: '',
        latitude: '',
      }
      this.clearPlaceform()
      this.$emit('delSite')
    },

    confirm () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          this.$emit('confirmSite', params)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.rule-form .el-form-item.not_change_rem {
  width: 300px;
  margin-bottom: 24px !important;
}
#siteFrom {
  padding: 10px;
  .header {
    color: var(--base-text-color-1);
    font-size: 18px;
    margin-bottom: 16px;
    line-height: 22px;
  }
}
.rule-form ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: var(--base-text-color-to-999999);
}
.rule-form :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: var(--base-text-color-to-999999);
}
.rule-form ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: var(--base-text-color-to-999999);
}
.rule-form :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: var(--base-text-color-to-999999);
}
</style>
