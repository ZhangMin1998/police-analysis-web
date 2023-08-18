<template>
<div
  class='wrap'
  v-p-loading="loading"
  element-loading-text="数据正在加载中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--bg-color-3'"
>
  <totalPerson v-show='!loading' :dataTotal='dataTotal'></totalPerson>
  <div class='echarts_total' v-show='!loading'>
    <PersonTotal ref='region' :regionData='regionData'></PersonTotal>
    <MenWomenTotal ref='menWomen' :menWomenData='menWomenData'></MenWomenTotal>
    <EducateTotal ref='educate' :educateData='educateData'></EducateTotal>
  </div>
  <div id='list' class='wrap-list' v-show='!loading'>
    <div class='title'>
      <span>数据列表 -</span>
      <span>常住人口</span>
    </div>
    <div class='wrap_table'>
      <TableGrid
        :isSearchTime='false'
        :inputPlaceholder='"请输入姓名/身份证/户号"'
        :tableColumns='columns'
        :exportFileName='"常住人口"'
        :exportColumns='exportColumns'
        :url='"/populationPermanent/list"'
        :tableHeight='$pxToRem(776)'
        :exportUrl='"/police/warning/populationPermanent/export"'
        @getSpecialParams='handleBeforeLoad'
        @getDataSuccess='getDataSuccess'
      ></TableGrid>
    </div>
  </div>
</div>
</template>

<script>
import totalPerson from './components/totalPerson'
import TableGrid from '@/components/VisualComponents/TableGrid'
import PersonTotal from './components/personTotal'
import MenWomenTotal from './components/menWomenTotal'
import EducateTotal from './components/educateTotal'
import { getLivePerson } from '@/api/dataCenter'
export default {
  name: 'LivePerson',
  components: {
    totalPerson,
    TableGrid,
    PersonTotal,
    MenWomenTotal,
    EducateTotal
  },
  data () {
    const TABLE_COLUMNS = [
      { label: '姓名', prop: 'name' },
      { label: '姓名拼音', prop: 'name_pinyin' },
      { label: '姓', prop: 'surname' },
      { label: '名', prop: 'first_name' },
      { label: '性别', prop: 'gender',
        renderFun (row) {
          if (!row.gender) return '--'
          return row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--'
        }
      },
      { label: '民族', prop: 'nation' },
      { label: '出生日期', prop: 'birthday' },
      { label: '曾用名', prop: 'previous_name' },
      { label: '身份证', prop: 'cer_number' },
      { label: '联系电话', prop: 'phone' },

      { label: '籍贯-国家（地区）', prop: 'native_country' },
      { label: '籍贯-省市县（区）', prop: 'native_province' },
      { label: '籍贯-区划内详细地址', prop: 'native_address' },

      { label: '户籍地址-省市县（区）', prop: 'registered_province' },
      { label: '户籍地址-区划内详细地址', prop: 'registered_address' },
      { label: '户籍地址地址编码', prop: 'registered_address_code' },
      { label: '户籍地址人户一致标识', prop: 'registered_consistency' },
      { label: '地市编码', prop: 'province_code' },
      { label: '地市单位', prop: 'province_precode' },
      { label: '乡镇街道代码', prop: 'street_code' },

      { label: '身高', prop: 'height' },
      // { label: '户口类型', prop: 'household_type' },
      { label: '户口', prop: 'household_code' },
      { label: '兵役状况', prop: 'military_service' },
      { label: '婚姻状况', prop: 'marital_status'},
      // { label: '工作单位', prop: 'company_name' },

      { label: '出生地-国家（地区）', prop: 'birth_country' },
      { label: '出生地-省市县（区）', prop: 'birth_province' },
      { label: '出生地-区划内详细地址', prop: 'birth_address' },
      { label: '出生时间', prop: 'birth_time' },
      { label: '血型', prop: 'blood_group' },
      { label: '居民身份证情况住址', prop: 'cer_address' },
      { label: '持有居民身份证情况签发机关公安机关名称', prop: 'cer_police_name' },
      { label: '持有居民身份证情况有效期起始日期', prop: 'cer_validity_start_time' },
      { label: '持有居民身份证情况有效期截止日期', prop: 'cer_validity_end_time' },
      { label: '城乡分类代码', prop: 'city_classify_code' },
      { label: '社区居村委', prop: 'community_village_committee_code' },
      { label: '单位名称', prop: 'company_name' },
      { label: '单位编码', prop: 'company_code' },
      { label: '职业', prop: 'occupation' },
      { label: '职业类别', prop: 'occupation_classification' },
      { label: '文化程度', prop: 'culture' },
      { label: '数据归属单位名称', prop: 'data_from_company_name' },
      { label: '数据归属单位代码', prop: 'data_from_company_code' },
      { label: '死亡原因', prop: 'death_reason' },
      { label: '死亡日期', prop: 'death_time' },
      { label: '离开本市情况去往地国家（地区）', prop: 'emigration_to_country' },
      { label: '离开本市情况去往地省市县（区）', prop: 'emigration_city' },
      { label: '离开本市情况去往地区划内详细地址', prop: 'emigration_address' },
      { label: '离开本市情况迁移（流动）原因', prop: 'emigration_reason' },
      { label: '离开本市情况迁（流）出日期', prop: 'emigration_time' },
      { label: '宗教信仰', prop: 'faith' },
      { label: '父亲姓名', prop: 'father_name' },
      { label: '父亲证件种类', prop: 'father_cer_type' },
      { label: '父亲证件号码', prop: 'father_cer_number' },
      { label: '父亲外文姓', prop: 'father_foreign_surname' },
      { label: '父亲外文名', prop: 'father_foreign_first_name' },
      { label: '父亲公民身份号码', prop: 'father_identity_card' },

      { label: '母亲姓名', prop: 'mother_name' },
      { label: '母亲证件种类', prop: 'mother_cer_type' },
      { label: '母亲证件号码', prop: 'mother_cer_number' },
      { label: '母亲外文姓', prop: 'mother_foreign_surname' },
      { label: '母亲外文名', prop: 'mother_foreign_first_name' },
      { label: '母亲公民身份号码', prop: 'mother_identity_card' },

      { label: '配偶姓名', prop: 'spouse_name' },
      { label: '配偶证件种类', prop: 'spouse_cer_type' },
      { label: '配偶证件号码', prop: 'spouse_cer_number' },
      { label: '配偶外文姓', prop: 'spouse_foreign_surname' },
      { label: '配偶外文名', prop: 'spouse_foreign_first_name' },
      { label: '配偶公民身份号码', prop: 'spouse_identity_card' },


      { label: '监护人一姓名', prop: 'guardian1_name' },
      { label: '监护人一证件种类', prop: 'guardian1_cer_type' },
      { label: '监护人一证件号码', prop: 'guardian1_cer_number' },
      { label: '监护人一外文姓', prop: 'guardian1_foreign_surname' },
      { label: '监护人一外文名', prop: 'guardian1_foreign_first_name' },
      { label: '监护人一公民身份号码', prop: 'guardian1_identity_card' },
      { label: '监护人一联系电话', prop: 'guardian1_phone' },
      { label: '监护人一监护关系', prop: 'guardian1_relationship' },

      { label: '监护人二姓名', prop: 'guardian2_name' },
      { label: '监护人二证件种类', prop: 'guardian2_cer_type' },
      { label: '监护人二证件号码', prop: 'guardian2_cer_number' },
      { label: '监护人二外文姓', prop: 'guardian2_foreign_surname' },
      { label: '监护人二外文名', prop: 'guardian2_foreign_first_name' },
      { label: '监护人二公民身份号码', prop: 'guardian2_identity_card' },
      { label: '监护人二联系电话', prop: 'guardian2_phone' },
      { label: '监护人二监护关系', prop: 'guardian2_relationship' },
      { label: '与户主关系', prop: 'household_relationship' },

      { label: '来本市情况来自地国家（地区）', prop: 'immigration_from_country' },
      { label: '来本市情况来自地省市县（区）', prop: 'immigration_city' },
      { label: '来本市情况来自地区划内详细地址', prop: 'immigration_address' },
      { label: '来本市情况迁移（流动）原因', prop: 'immigration_reason' },
      { label: '来本市情况迁（流）入日期', prop: 'immigration_time' },
      { label: '注销时间', prop: 'logout_time' },
      { label: '注销更新时间', prop: 'logout_update_time' },
      { label: '维护时间', prop: 'maintenance_time' },
      { label: '人口状态', prop: 'population_status' },
      { label: '人口编码', prop: 'population_code' },
      { label: '人口信息级别', prop: 'population_information_level' },
      { label: '人口管理注销类别代码', prop: 'population_logout_code' },
      { label: '数据创建时间', prop: 'src_create_time' },
      { label: '数据更新时间', prop: 'src_update_time' }
    ]
    const EXPORT_COLUMNS = [
      {
        label: '事件项',
        list: [
          { label: '姓名', prop: 'name' },
          { label: '姓名拼音', prop: 'name_pinyin' },
          { label: '姓', prop: 'surname' },
          { label: '名', prop: 'first_name' },
          { label: '性别', prop: 'gender' },
          { label: '民族', prop: 'nation' },
          { label: '出生日期', prop: 'birthday' },
          { label: '曾用名', prop: 'previous_name' },
          { label: '身份证', prop: 'cer_number' },
          { label: '联系电话', prop: 'phone' },

          { label: '籍贯-国家（地区）', prop: 'native_country' },
          { label: '籍贯-省市县（区）', prop: 'native_province' },
          { label: '籍贯-区划内详细地址', prop: 'native_address' },

          { label: '户籍地址-省市县（区）', prop: 'registered_province' },
          { label: '户籍地址-区划内详细地址', prop: 'registered_address' },
          { label: '户籍地址地址编码', prop: 'registered_address_code' },
          { label: '户籍地址人户一致标识', prop: 'registered_consistency' },
          { label: '地市编码', prop: 'province_code' },
          { label: '地市单位', prop: 'province_precode' },
          { label: '乡镇街道代码', prop: 'street_code' },

          { label: '身高', prop: 'height' },
          { label: '户口', prop: 'household_code' },
          { label: '兵役状况', prop: 'military_service' },
          { label: '婚姻状况', prop: 'marital_status' },

          { label: '出生地-国家（地区）', prop: 'birth_country' },
          { label: '出生地-省市县（区）', prop: 'birth_province' },
          { label: '出生地-区划内详细地址', prop: 'birth_address' },
          { label: '出生时间', prop: 'birth_time' },
          { label: '血型', prop: 'blood_group' },
          { label: '居民身份证情况住址', prop: 'cer_address' },
          { label: '持有居民身份证情况签发机关公安机关名称', prop: 'cer_police_name' },
          { label: '持有居民身份证情况有效期起始日期', prop: 'cer_validity_start_time' },
          { label: '持有居民身份证情况有效期截止日期', prop: 'cer_validity_end_time' },
          { label: '城乡分类代码', prop: 'city_classify_code' },
          { label: '社区居村委', prop: 'community_village_committee_code' },
          { label: '单位名称', prop: 'company_name' },
          { label: '单位编码', prop: 'company_code' },
          { label: '职业', prop: 'occupation' },
          { label: '职业类别', prop: 'occupation_classification' },
          { label: '文化程度', prop: 'culture' },
          { label: '数据归属单位名称', prop: 'data_from_company_name' },
          { label: '数据归属单位代码', prop: 'data_from_company_code' },
          { label: '死亡原因', prop: 'death_reason' },
          { label: '死亡日期', prop: 'death_time' },
          { label: '离开本市情况去往地国家（地区）', prop: 'emigration_to_country' },
          { label: '离开本市情况去往地省市县（区）', prop: 'emigration_city' },
          { label: '离开本市情况去往地区划内详细地址', prop: 'emigration_address' },
          { label: '离开本市情况迁移（流动）原因', prop: 'emigration_reason' },
          { label: '离开本市情况迁（流）出日期', prop: 'emigration_time' },
          { label: '宗教信仰', prop: 'faith' },
          { label: '父亲姓名', prop: 'father_name' },
          { label: '父亲证件种类', prop: 'father_cer_type' },
          { label: '父亲证件号码', prop: 'father_cer_number' },
          { label: '父亲外文姓', prop: 'father_foreign_surname' },
          { label: '父亲外文名', prop: 'father_foreign_first_name' },
          { label: '父亲公民身份号码', prop: 'father_identity_card' },

          { label: '母亲姓名', prop: 'mother_name' },
          { label: '母亲证件种类', prop: 'mother_cer_type' },
          { label: '母亲证件号码', prop: 'mother_cer_number' },
          { label: '母亲外文姓', prop: 'mother_foreign_surname' },
          { label: '母亲外文名', prop: 'mother_foreign_first_name' },
          { label: '母亲公民身份号码', prop: 'mother_identity_card' },

          { label: '配偶姓名', prop: 'spouse_name' },
          { label: '配偶证件种类', prop: 'spouse_cer_type' },
          { label: '配偶证件号码', prop: 'spouse_cer_number' },
          { label: '配偶外文姓', prop: 'spouse_foreign_surname' },
          { label: '配偶外文名', prop: 'spouse_foreign_first_name' },
          { label: '配偶公民身份号码', prop: 'spouse_identity_card' },

          { label: '监护人一姓名', prop: 'guardian1_name' },
          { label: '监护人一证件种类', prop: 'guardian1_cer_type' },
          { label: '监护人一证件号码', prop: 'guardian1_cer_number' },
          { label: '监护人一外文姓', prop: 'guardian1_foreign_surname' },
          { label: '监护人一外文名', prop: 'guardian1_foreign_first_name' },
          { label: '监护人一公民身份号码', prop: 'guardian1_identity_card' },
          { label: '监护人一联系电话', prop: 'guardian1_phone' },
          { label: '监护人一监护关系', prop: 'guardian1_relationship' },

          { label: '监护人二姓名', prop: 'guardian2_name' },
          { label: '监护人二证件种类', prop: 'guardian2_cer_type' },
          { label: '监护人二证件号码', prop: 'guardian2_cer_number' },
          { label: '监护人二外文姓', prop: 'guardian2_foreign_surname' },
          { label: '监护人二外文名', prop: 'guardian2_foreign_first_name' },
          { label: '监护人二公民身份号码', prop: 'guardian2_identity_card' },
          { label: '监护人二联系电话', prop: 'guardian2_phone' },
          { label: '监护人二监护关系', prop: 'guardian2_relationship' },
          { label: '与户主关系', prop: 'household_relationship' },

          { label: '来本市情况来自地国家（地区）', prop: 'immigration_from_country' },
          { label: '来本市情况来自地省市县（区）', prop: 'immigration_city' },
          { label: '来本市情况来自地区划内详细地址', prop: 'immigration_address' },
          { label: '来本市情况迁移（流动）原因', prop: 'immigration_reason' },
          { label: '来本市情况迁（流）入日期', prop: 'immigration_time' },
          { label: '注销时间', prop: 'logout_time' },
          { label: '注销更新时间', prop: 'logout_update_time' },
          { label: '维护时间', prop: 'maintenance_time' },
          { label: '人口状态', prop: 'population_status' },
          { label: '人口编码', prop: 'population_code' },
          { label: '人口信息级别', prop: 'population_information_level' },
          { label: '人口管理注销类别代码', prop: 'population_logout_code' },
          { label: '数据创建时间', prop: 'src_create_time' },
          { label: '数据更新时间', prop: 'src_update_time' }
        ]
      }
    ]
    return {
      loading: true,
      columns: TABLE_COLUMNS,
      exportColumns: Object.freeze(EXPORT_COLUMNS),
      educateData: {},
      regionData: {},
      menWomenData: {},
      dataTotal: {
        total: {
          num: 0,
          unit: '人',
          isLong: true
        },
        familyTotal: {
          num: 0,
          unit: '户',
          isLong: true
        },
        rural: {
          num: 0,
          unit: '人',
          isLong: true
        },
        city: {
          num: 0,
          unit: '人',
          isLong: true
        }
      }
    }
  },
  created () {
    this.getChartsData()
  },
  mounted () {
    let fontSize = 16 * document.documentElement.style.fontSize.split('px')[0] / 192
    this.columns.forEach(item => {
      if (item.prop === 'cer_number') {
        item['minWidth'] = fontSize * (item['label'].length + 10)
      } else {
        item['minWidth'] = fontSize * (item['label'].length + 5)
      }
    })
  },
  methods: {
    getChartsData () {
      this.loading = true
      getLivePerson().then(res => {
        this.educateData = res.culture || {}
        this.regionData = res.province_code || {}
        this.menWomenData = res.age_and_sex || {}
        this.addUnit(res.total['人口总数'] + '', 'total')
        this.addUnit(res.total['户口总数'] + '', 'familyTotal', '户')
        this.addUnit(res.total['城镇人口'] + '', 'city')
        this.addUnit(res.total['乡村人口'] + '', 'rural')
        this.loading = false
        this.$nextTick(() => {
          this.$refs.region.init()
          this.$refs.menWomen.init()
          this.$refs.educate.init()
        })
      }).catch(() => {
        this.loading = false
      })

      // 仅开发时使用
      /*this.educateData = {
        '研究生及以上': 9000,
        '其他': 8000,
        '高中': 7000,
        '本科': 5000,
        '中专': 4000,
        '大专': 3000,
        '初中及以下': 1000
      }
      this.regionData = {
        '环翠区': 13231,
        '乳山市': 3342342,
        '荣成市': 41434341,
        '文登区': 11113333
      }
      this.menWomenData = {
        '0-1岁': {
          '男': 200000,
          '女': 1000000
        },
        '1-4岁': {
          '男': 2000000,
          '女': 1000000
        },
        '5-9岁': {
          '男': 15845127,
          '女': 1000000
        },
        '10-14岁': {
          '男': 2000000,
          '女': 1000000
        },
        '15-19岁': {
          '男': 2000000,
          '女': 1000000
        },
        '20-24岁': {
          '男': 2000000,
          '女': 1000000
        },
        '25-29岁': {
          '男': 2000000,
          '女': 1000000
        },
        '30-34岁': {
          '男': 2000000,
          '女': 1000000
        },
        '35-39岁': {
          '男': 2000000,
          '女': 1000000
        },
        '40-44岁': {
          '男': 2000000,
          '女': 1000000
        },
        '45-49岁': {
          '男': 2000000,
          '女': 1000000
        },
        '50-54岁': {
          '男': 2000000,
          '女': 1000000
        },
        '55-59岁': {
          '男': 2000000,
          '女': 1000000
        },
        '60-64岁': {
          '男': 2000000,
          '女': 1000000
        },
        '65-69岁': {
          '男': 2000000,
          '女': 1000000
        },
        '70-74岁': {
          '男': 2000000,
          '女': 1000000
        },
        '75-79岁': {
          '男': 2000000,
          '女': 1000000
        },
        '80-84岁': {
          '男': 2000000,
          '女': 1000000
        },
        '85-89岁': {
          '男': 2000000,
          '女': 1000000
        },
        '90-94岁': {
          '男': 2000000,
          '女': 1000000
        },
        '95-99岁': {
          '男': 2000000,
          '女': 1000000
        },
        '100+岁': {
          '男': 2000000,
          '女': 1000000
        },
      }
      this.$nextTick(() => {
        this.$refs.region.init()
        this.$refs.menWomen.init()
        this.$refs.educate.init()
      })*/
    },
    addUnit (num, name, place = '人') {
      let changeNum = +num
      let unit = place
      if (num.length >= 13) {
        changeNum = num / 1000000000000
        unit = '万亿' + place
      } else if (num.length >= 9) {
        changeNum = num / 100000000
        unit = '亿' + place
      } else if (num.length >= 5) {
        changeNum = num / 10000
        unit = '万' + place
      } else {
        this.dataTotal[name]['isLong'] = false
      }
      this.dataTotal[name]['num'] = changeNum
      this.dataTotal[name]['unit'] = unit
    },
    handleBeforeLoad (req, callback) {
      req.warning = true
      callback(req)
    },
    getDataSuccess (data, params, callback) {
      data.forEach(item => {
        if (item.city_classify_code) {
          if (+item.city_classify_code[0] === 1) {
            item.household_type = '城镇户籍'
          } else if (+item.city_classify_code[0] === 2) {
            item.household_type = '农村户籍'
          } else {
            item.household_type = '--'
          }
        } else {
          item.household_type = '--'
        }
        callback(data)
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '../common-style';
div {
  box-sizing: border-box;
}
.wrap_table {
  height: 924px;
  padding: 0 8px;
}
.echarts_total {
  display: flex;
}
/deep/.el-table__empty-block {
  width: calc(100vw - 156px) !important;
}
</style>
