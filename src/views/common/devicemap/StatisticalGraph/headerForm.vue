<template>
  <el-form :model="form" :inline="true" class="header-search">
    <!-- <el-form-item v-if="tabType == 'site'">
      <el-select v-model="form.type" placeholder="场所类型" @change="handleSelect">
        <el-option
          v-for="item in siteTypeList"
          :key="item.dictDataCode"
          :label="item.dictDataValue"
          :value="item.dictDataCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-else-if="tabType == 'device'">
      <el-select v-model="form.type" placeholder="设备类型" @change="handleSelect">
        <el-option
          v-for="item in deviceTypeList"
          :key="item.dictDataCode"
          :label="item.dictDataValue"
          :value="item.dictDataCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-else>
      <el-select v-model="form.type" placeholder="安全厂商" @change="handleSelect">
        <el-option
          v-for="item in siteTypeList"
          :key="item.dictDataCode"
          :label="item.dictDataValue"
          :value="item.dictDataCode"
        >
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item>
      <el-select v-model="form.area" placeholder="统计区域">
        <el-option
          v-for="item in areaList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item>
      <CustomDatePicker :value.sync="timeValue" @changeValue="changeValue" :clearable="false" />
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import CustomDatePicker from '@/components/BasicComponents/CustomDatePicker/'
import { generateSevenDay } from '@/utils/'

export default {
  props: {
    tabType: {
      type: String,
      required: true
    },
    form: {
      type: Object
    }
  },
  components: {
    CustomDatePicker
  },
  data () {
    return {
      areaList: [{ label: '全部', value: '1' }],
      timeValue: generateSevenDay()
    }
  },
  computed: {
    ...mapState('Dict', {
      siteTypeList: 'siteTypeList',
      deviceTypeList: 'deviceTypeList'
    })
  },
  methods: {
    searchForm () {
      this.$emit('submitForm', this.form)
    },
    async changeValue (value) {
      this.form.time = value
      this.searchForm()
    },
    handleSelect (value) {
      this.form.type = value
      this.searchForm()
    }
  },
  mounted () {
    if (this.timeValue.length !== 2) return
    this.searchForm()
  }
}
</script>

<style lang="less" scoped>
.header-search {
  text-align: center;
  margin: 36px 0 10px;
}
</style>
