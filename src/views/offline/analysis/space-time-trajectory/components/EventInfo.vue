<template>
  <div class="EventInfo">
    <div class="title_box">
      <el-divider direction="vertical"></el-divider>
      <span>{{eventData.dataTypeStr}}</span>
    </div>
    <div class="main-content">
      <el-descriptions :column="1">
        <el-descriptions-item v-for="(item, key) in labelList" :key="key" :label="item">
          <div v-if="key !=='signConfirm'">{{listData[key]}}</div>
          <div v-else>
            <el-image
              :src="origin + listData[key]"
              :preview-src-list="listData[key] ? [origin + listData[key]] : []"
              fit="fill"
            >
              <div slot="error" class="image-slot">
                --
              </div>
            </el-image>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
const epidemicRegister = {
  name: '姓名',
  sex: '性别',
  nation: '民族',
  birthday: '出生日期',
  cerTypeName: '证件类型',
  cerNumber: '证件号码',
  phone: '手机',
  liveAddress: '居住地址',
  address: '户籍地址',
  status: '状态',
  carNumber: '车牌',
  temperature: '体温',
  registrationPlace: '登记场所',
  placeType: '场所类型',
  siteAddress: '场所地址',
  longitude: '经度',
  latitude: '纬度',
  postalCode: '邮编',
  registrationTime: '登记时间',
  remarks: '备注'
}
const nucleicAcidRecord = {
  name: '姓名',
  sex: '性别',
  birthday: '出生日期',
  cerTypeName: '证件类型',
  cerNumber: '证件号码',
  phone: '手机',
  liveAddress: '居住地址',
  address: '户籍地址',
  isFromEpidemic: '来自风险区',
  srcAddress: '始发地',
  dstAddress: '目的地',
  arrivalTimeStr: '抵达时间',
  personType: '人员分类',
  unitAreaName: '工作城市',
  unitName: '工作单位',
  isControl: '本地管控区',
  result: '检测结果',
  collectTimeStr: '采样时间',
  placeName: '采样场所',
  sampleWindow: '采样窗口',
  testTimeStr: '检测时间',
  testPlaceName: '检测场所',
  registerTimeStr: '首次登记时间',
  dataSource: '数据来源',
  sampleType: '标本类型',
  reagentCode: '试剂编码',
  status: '状态',
  remarks: '备注'
}
const BankBusiness = {
  name: '姓名',
  sex: '性别',
  nation: '民族',
  birthday: '出生日期',
  cerTypeName: '证件类型',
  cerNumber: '证件号码',
  phone: '手机',
  liveAddress: '居住地址',
  placeType: '银行类型',
  placeName: '办理网点',
  placeAddress: '网点地址',
  signConfirm: '签名',
  signDate: '签署日期',
  collectTimeStr: '办理时间',
  monitorName: '断卡行动联系人',
  monitorPhone: '断卡联系人电话',
  longitude: '经度',
  latitude: '纬度',
  remarks: '备注'
}
const phoneOperator = {
  name: '姓名',
  sex: '性别',
  nation: '民族',
  birthday: '出生日期',
  cerTypeName: '证件类型',
  cerNumber: '证件号码',
  phone: '手机',
  address: '户籍地址',
  operator: '运营商',
  placeType: '营业厅类型',
  placeName: '营业厅名称',
  placeAddress: '营业厅地址',
  signConfirm: '签名',
  signDate: '签署日期',
  collectTimeStr: '办理时间',
  longitude: '经度',
  latitude: '纬度',
  remarks: '备注'
}
export default {
  props:{
    eventData: {
      type: Object,
      // default: {}
    },
  },
  data () {
    return {
      labelList: {},
      listData: {
        name: '张可爱',
        sex: '男',
        nation: '汉',
        birthday: '2022/8/8',
        cerTypeName: '身份证',
        cerNumber: 360782199988885555,
        phone: 13277778888,
        liveAddress: '地球亚洲中国澳门特别行政区广东省深圳市龙岗区坂田街道华为技术有限公司111号',
        address: '地球亚洲中国澳门特别行政区广东省深圳市龙岗区坂田街道华为技术有限公司111号',
        status: '进入',
        carNumber: '黑B NB888',
        temperature: '36.6℃',
        registrationPlace: '华润万象城',
        placeType: '商场',
        siteAddress: '地球亚洲中国澳门特别行政区广东省深圳市',
        longitude: 123.456789,
        latitude: 123.456789,
        postalCode: 341415,
        registrationTime: '2021/04/03 15:00:06',
        remarks: '可爱',
        signConfirm: 'image/rongcheng/yhkgzs/2022-08-16/20220816_11375633.jpg'
      }
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  created () {
    // console.log(this.eventData)
  },
  mounted () {
    if (this.eventData.dataTypeStr === '防疫登记') {
      this.labelList = epidemicRegister
    } else if (this.eventData.dataTypeStr === '核酸记录') {
      this.labelList = nucleicAcidRecord
    } else if (this.eventData.dataTypeStr === '银行业务') {
      this.labelList = BankBusiness
    } else if (this.eventData.dataTypeStr === '运营商业务') {
      this.labelList = phoneOperator
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.EventInfo{
  .title_box{
    padding: 12px 10px 12px 0;
    /deep/.el-divider--vertical {
      display: inline-block;
      width: 4px;
      height: 1em;
      margin: 0 0.04167rem 0 0;
      vertical-align: text-bottom;
      position: relative;
    }
    span {
      font-weight: 400;
      color: var(--base-text-color-1);
      font-size: 16px;
    }
  }
  .main-content{
    // overflow: hidden !important;
    overflow-y: scroll;
    height: calc(100vh - 280px);
    width: 400px;
    /deep/.el-descriptions__body {
      // color: var(--base-text-color-to-999999);
      background-color: transparent;
    }
    /deep/.el-descriptions-item{
      padding-bottom: 3px !important;
    }
    /deep/.el-descriptions-item__label{
      width: 60px !important;
      font-size: 14px;
      color: var(--base-text-color-to-999999);
    }
    /deep/.el-descriptions-item__content{
      color: var(--base-text-color-1) !important;
      font-weight: 400;
      font-size: 16px;
    }
  }
}
</style>
