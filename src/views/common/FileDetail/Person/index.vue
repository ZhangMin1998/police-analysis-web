<template>
  <div class="person">
    <div v-if="!isShowSetting">
      <div
        class="personInfo"
        v-permission="
          $route.query.label === '重点人档案'
            ? 'important_human:base_info'
            : 'normal_human:base_info'
        "
      >
        <!-- 人物头像 -->
        <div class="headPic">
          <el-image
            :src="headerUrl"
            :preview-src-list="personInfo.avatar ? [headerUrl] : []"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <img
                :src="
                  require('@/assets/img/' +
                    ('icon-morenHeader') +
                    '.png')
                "
              />
            </div>
          </el-image>
        </div>

        <!-- 人物信息 -->
        <div class="cardInfo" v-if="$route.query.label === '人物档案'">
          <div class="carinfo_main">
            <div class="flex" v-for="(item, index) in personInfoLabel" :key="index">
              <div class="key">{{ item }}</div>
              <div class="val">
                <EllipsisPop :content="personInfo[index]" :rowNum="2"></EllipsisPop>
              </div>
            </div>
          </div>
        </div>

        <div class="cardInfo2" v-if="$route.query.label === '重点人档案'">
          <div class="carinfo_main">
            <div class="flex" v-for="(item, index) in personInfoLabel" :key="index">
              <div class="key">{{ item }}</div>
              <div class="val">
                <EllipsisPop :content="personInfo[index]" :rowNum="2"></EllipsisPop>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 更多信息 -->
      <div
        class="moreInfo"
        v-permission="'normal_human:more_info'"
        v-if="($route.query.label === '人物档案' && personInfo.company) || personInfo.bankCard"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>更多信息</span>
        </div>
        <div class="content">
          <el-descriptions :column="4">
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(item, key) in moreInfo"
              :key="key"
              :label="item"
            >
              <Ellipsis :wordsLength="60" :value="personInfo[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 其它证件 -->
      <div
        class="moreInfo"
        v-permission="'normal_human:other_card'"
        v-if="personInfo.otherCertificatesList"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>其它证件</span>
        </div>
        <div class="content">
          <el-descriptions :column="4">
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(item, key) in personInfo.otherCertificatesList"
              :key="key"
              :label="item.cerTypeName"
            >
              <Ellipsis :wordsLength="24" :value="item.cerNumber" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 不动产信息 -->
      <div
        class="homeInfo"
        v-permission="'normal_human:real_estate_info'"
        v-if="$route.query.label === '人物档案' && personInfo.assetsHouseVoList"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>不动产信息</span>
        </div>
        <div class="content1">
          <CusImagesPager
            :list="personInfo.assetsHouseVoList"
            :columns="homeTable.columns"
            :padding="'16px'"
            :haveTitle="false"
            @clickCard="clickCard"
          >
          </CusImagesPager>
        </div>
      </div>

      <!-- 车辆信息 -->
      <div
        class="homeInfo"
        v-permission="'normal_human:car_archives'"
        v-if="$route.query.label === '人物档案' && personInfo.carInfoVoList"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>车辆信息</span>
        </div>
        <div class="content1">
          <CarAtlasPager
            :list="personInfo.carInfoVoList"
            :columns="carTable.columns"
            @toCarFile="toCarFile"
          >
          </CarAtlasPager>
        </div>
        <!-- <div class="empty_div" v-else>
          <EmptyData />
        </div> -->
      </div>

      <!-- 虚拟账号 -->
      <div
        class="virAccount"
        v-permission="'normal_human:virtual_account'"
        v-if="personInfo.virtualAccountVoList && $route.query.label === '人物档案'"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>虚拟账号</span>
        </div>
        <div class="content">
          <span v-for="(item, key) in personInfo.virtualAccountVoList" :key="key">
            {{ item.virtualAccountValue + '(' + item.virtualAccountType + ')' + ' ;' }}
          </span>
        </div>
      </div>

      <!-- 重点人信息 -->
      <div
        class="moreInfo"
        v-permission="'important_human:human_info'"
        v-if="$route.query.label === '重点人档案' && personInfo.suspects"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>重点人信息</span>
        </div>
        <div class="content">
          <el-descriptions :column="4">
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(item, key) in importantLabel"
              :key="key"
              :label="item"
            >
              <Ellipsis :wordsLength="24" :value="personInfo.suspects[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 禁毒信息 -->
      <div
        class="moreInfo"
        v-permission="'important_human:drug_control'"
        v-if="$route.query.label === '重点人档案' && personInfo.banDrugsInfo"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>禁毒信息</span>
        </div>
        <div class="content">
          <el-descriptions
            v-for="(item, idx) in drugLabel"
            :key="idx"
            :column="5"
            :title="item.label"
          >
            <el-descriptions-item
              labelClassName="lableStyle"
              contentClassName="itemStyle"
              v-for="(val, key) in item.list"
              :key="key"
              :label="val"
            >
              <Ellipsis :wordsLength="24" :value="personInfo.banDrugsInfo[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 拘留信息 -->
      <div
        class="moreInfo"
        v-permission="'important_human:human_detention_info'"
        v-if="$route.query.label === '重点人档案' && personInfo.detentionPersonInfos"
      >
        <div class="title_box">
          <el-divider direction="vertical"></el-divider>
          <span>拘留所信息</span>
        </div>
        <div class="detentionCards">
          <div
            class="card"
            @click="showPop(item)"
            v-for="(item, idx) in personInfo.detentionPersonInfos"
            :key="idx"
          >
            <div class="cardTitle">
              <span class="icon_police">入所编号</span>
              <span class="placeName">拘留所</span>
            </div>
            <div style="color: #c0d0e7">{{ item.detentionSn }}</div>
            <div class="cardDate">
              <span>入所日期</span>
            </div>
            <div style="color: #c0d0e7">{{ item.inStatTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <HouseDetail :basicInfo="basicInfo" @close="close" v-if="isShowSetting" />
  </div>
</template>

<script>
// import EmptyData from '@/components/BasicComponents/EmptyData'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import CusImagesPager from '@/components/BasicComponents/CusImagesPager'
import CarAtlasPager from '@/components/BasicComponents/carImagesPager/carAtlasPager'
import HouseDetail from './houseDetail'

const keyPointLabel = {
  name: '姓名：',
  birthday: '出生日期：',
  nation: '民族：',
  address: '户籍地：',
  pinyinName: '姓名拼音：',
  sex: '性别：',
  maritalStatus: '婚姻状况：',
  addressPoliceStation: '户籍地派出所：',
  cerNumber: '身份证号：',
  country: '国籍：',
  culture: '文化程度：',
  // detailAddr: '户籍地详址：'
}
// const socialLabel = {
//   name: '姓名',
//   sex: '性别',
//   nationReconDes: '民族',
//   birthday: '出生日期',
//   nation: '证件类型',
//   idCardNumber: '证件号码',
//   phone: '手机',
//   houseAddr: '居住地址',
//   detailAddr: '户籍地址'
// }
const socialLabel = {
  name: '姓名：',
  birthday: '出生日期：',
  phone: '手机：',
  sex: '性别：',
  cerTypeName: '证件类型：',
  liveAddress: '居住地址：',
  nation: '民族：',
  cerNumber: '证件号码：',
  address: '户籍地址：'
}
const moreInfo = {
  company: '工作单位',
  bankCard: '银行卡',
}
const otherCertificates = {
  HK: '港澳通行证',
  passport: '护照',

}
const importantLabel = {
  personSn: '人员编号',
  currHousePolistat: '现住地派出所',
  createTime: '创建时间',
  inBaseTime: '入库时间'
}
const drugLabel = [
  {
    label: '特征信息',
    list: {
      drugAddictSn: '人员编号',
      nickName: '绰号',
      height: '身高',
      fingerMark: '指纹编号',
      dnaCode: 'DNA编号'
    }
  },
  {
    label: '位置信息',
    list: {
      houseAddr: '居住地(现住址)',
      currHousePolistat: '居住地(现住址)派出所',
      houseAddrDetailAddr: '居住地(现住址)详址'
    }
  },
  {
    label: '其他信息',
    list: {
      recordUnit: '录入单位',
      jobUnit: '工作单位',
      jobInfo: '从业情况',
      jobStatus: '就业情况',
      personFlag: '人员标识',
      personType: '人员类型'
    }
  }
]
export default {
  name: 'Person',
  components: {
    // EmptyData,
    Ellipsis,
    CusImagesPager,
    CarAtlasPager,
    HouseDetail,
    EllipsisPop
  },
  props: {
    headerInfo: {
      type: Object
    },
    personInfo: {
      type: Object
    }
  },
  data () {
    return {
      isShowSetting: false,
      basicInfo: {},
      personInfoLabel: {},
      moreInfo: {},
      drugLabel: {},
      importantLabel: {},
      otherCertificates: {},
      homeTable: {
        columns: [
          { label: '不动产证号', prop: 'assetsCode' },
          { label: '用途', prop: 'houseUsage' },
          { label: '面积', prop: 'houseArea' },
          { label: '登记时间', prop: 'collectTime' },
          { label: '坐落', prop: 'houseAddress' }
        ]
      },
      carTable: {
        columns: [
          // { prop: "image", type: "img",show:true},
          // { label: '车牌', prop: 'carNumber' },
          { "prop": "photo", "type": "img", "show": false, "inOut": "IN" },
          { "label": "车牌", "prop": "carNumber", "show": true, "inOut": "IN" },
          // { label: '数据来源', prop: 'dataSources' }
        ]
      },
      virAccountLabel: {
        QQ: 'QQ',
        wechat: '微信',
        Qtalk: 'Qtalk',
        cf: '穿越火线'
      },
      virAccount: []
    }
  },
  computed: {
    headerUrl () {
      // return 'http://192.168.1.99:21162/' + this.personInfo.avatar
      return window.location.origin + '/' + this.personInfo.avatar
    },
    showBaseInfo () {
      if (this.$route.query.label === '重点人档案' && this.$store.state.Common.permissionsArray.includes('important_human:human_info')) {
        return true
      } else if (this.$route.query.label === '人物档案' && this.$store.state.Common.permissionsArray.includes('normal_human:base_info')) {
        return true
      }else{
        return true
      }
    }
  },
  watch: {
    'isShowSetting': {
      handler (newVal) {
        this.$emit('isDisable', newVal)
      },
      immediate: true
    }
  },
  created () {
    if (this.$route.query.label === '人物档案') {
      this.personInfoLabel = socialLabel
    } else {
      this.personInfoLabel = keyPointLabel
    }

    this.moreInfo = moreInfo
    this.drugLabel = drugLabel
    this.otherCertificates = otherCertificates
    this.importantLabel = importantLabel
    this.virAccount = [
      {
        QQ: '204674509',
        wechat: '204674509',
        Qtalk: '204674509',
        cf: '204674509',
      }
    ]
  },

  methods: {
    clickCard (row) {
      this.basicInfo = row
      this.isShowSetting = true
    },
    close () {
      this.isShowSetting = false
    },
    toCarFile (row) {
      window.open(window.location.origin + '/ol/carFile?carNumber=' + row.carNumber, "_blank")
    },
    showPop (item) {
      this.$emit('showPop', item)
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  // .headPic {
  //   width: 10%;
  // }
  .cardInfo .carinfo_main .flex {
    .key {
      width: 120px;
    }
    .val {
      width: 360px;
    }
  }
  .cardInfo2 .carinfo_main .flex {
    .key {
      width: 160px;
    }
    // .val {
    //   width: 300px;
    // }
  }
  /deep/.CusImagesPager_item_main_info {
    margin: 0 !important;
    line-height: 1.5;
    flex: 1;
    .label {
      font-size: 12px !important;
      width: 135px !important;
    }
    .item-value {
      // overflow: hidden;
      .value{
        overflow: hidden;
      }
    }
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  // .headPic {
  //   width: 10%;
  // }
  .cardInfo .carinfo_main .flex {
    .key {
      width: 90px;
    }
    .val {
      width: 410px;
    }
  }
  .cardInfo2 .carinfo_main .flex {
    .key {
      width: 120px;
    }
    .val {
      width: 410px;
    }
  }
  /deep/.CusImagesPager_item_main_info {
    margin: 0 !important;
    line-height: 1.5;
    flex: 1;
    .label {
      font-size: 16px !important;
      width: 100px !important;
    }
    .item-value {
      // overflow: hidden;
      .value{
        overflow: hidden;
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  // .headPic {
    // width: 6%;
    // width: 97px;
  // }
  .cardInfo .carinfo_main .flex {
    .key {
      width: 90px;
    }
    .val {
      width: 410px;
    }
  }
  .cardInfo2 .carinfo_main .flex {
    .key {
      width: 115px;
    }
    .val {
      width: 410px;
    }
  }
  /deep/.CusImagesPager_item_main_info {
    margin: 0 !important;
    line-height: 1.5;
    flex: 1;
    .label {
      font-size: 16px !important;
      width: 100px !important;
    }
    .item-value {
      overflow: hidden;
      .value{
        overflow: hidden;
      }
    }
  }
}
.person {
  position: relative;
  .personInfo {
    margin-bottom: 12px;
    background: var(--bg-color-2);
    display: flex;
    justify-content: space-between;
    .headPic {
      padding: 16px 0 16px 16px;
      /deep/ .el-image {
        display: block;
        width: 81px;
        height: 102px;
        img {
          width: 81px;
          height: 102px;
        }
      }
      /deep/.image-slot {
        background: var(--bg-color-2) !important;
      }
    }
    .cardInfo, .cardInfo2 {
      width: 100%;
      padding: 16px 16px 5px 16px;
      box-sizing: border-box;
      overflow: hidden;
      .carinfo_main {
        font-size: 16px;
        column-count: 3;
        .flex {
          display: flex;
          margin-bottom: 20px;
          .key {
            color: var(--base-text-color-to-999999);
          }
          .val {
            color: var(--base-text-color-1);
            // word-break: break-all;
          }
        }
      }
    }
  }
  .moreInfo {
    margin: 0;
    // background: rgba(248, 248, 248, 0.04);
    .title_box {
      padding: 12px 10px 12px 0;
      span {
        font-weight: bold;
        color: var(--base-text-color-1);
        font-size: 16px;
      }
    }
    .detentionCards {
      // background: pink;
      display: flex;
      padding: 10px 0;
      .card {
        width: 280px;
        height: 158px;
        box-sizing: border-box;
        padding: 21px 0 17px 16px;
        margin-right: 13px;
        background-image: url('~@/assets/img/drugbgc.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        line-height: 22px;
        cursor: pointer;
        .cardTitle {
          margin-bottom: 10px;
          .icon_police {
            margin-right: 20px;
          }
          .placeName {
            display: inline-block;
            width: 60px;
            height: 24px;
            line-height: 22px;
            margin-right: 32px;
            padding-left: 8px;
            font-size: 12px;
            color: #fff;
            background: linear-gradient(91deg, #177ddc 0%, rgba(23, 125, 220, 0.14) 100%);
            opacity: 1;
          }
        }
        .cardDate {
          margin: 15px 0 10px 0;
        }
      }
    }
  }
  .homeInfo {
    // margin: 0 0 12px 0;
    // background: rgba(248, 248, 248, 0.04);
    .title_box {
      padding: 12px 10px 12px 0;
      span {
        font-weight: bold;
        color: var(--base-text-color-1);
        font-size: 16px;
      }
    }
  }
  .virAccount {
    line-height: 24px;
    margin: 0;
    padding-bottom: 10px;
    // background: rgba(248, 248, 248, 0.04);
    .title_box {
      padding: 10px 10px 10px 0;
      span {
        font-weight: bold;
        color: var(--base-text-color-1);
        font-size: 16px;
      }
    }
    .content {
      font-size: 16px;
      color: var(--base-text-color-to-999999);
    }
  }

  .content {
    padding: 0px 10px 0 12px;
  }
  /deep/.el-descriptions-item__label {
    font-size: 16px;
    color: var(--base-text-color-to-999999);
  }
  /deep/.defaultValue {
    font-size: 16px;
    color: var(--base-text-color-1);
  }
}
/deep/.el-descriptions-item__container {
  font-size: 16px;
}

.empty_div {
  margin-top: 15px;
  height: 100px;
  background-color: var(--bg-color-2);
}
::v-deep .itemStyle {
  height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-divider--vertical {
  color: var(--base-text-color-1);
  display: inline-block;
  width: 4px;
  height: 1em;
  margin: 0 8px 0 0;
  vertical-align: text-top;
  position: relative;
}
/deep/.CusImagesPager-ul > li {
  width: calc((100% - 48px) / 4);
  margin-right: 16px;
  margin-bottom: 16px;
  padding-top: 0px !important;
  > li:nth-child(6n) {
    margin-right: 0;
  }
}
/deep/.CusImagesPager_item {
  background: var(--bg-color-2) !important;
}
/deep/.CusImagesPager_item_main {
  padding: 16px 16px !important;
  // text-overflow:ellipsis !important;
}
/deep/.carAtlasPager-ul {
  margin-top: -16px;
}
/deep/.carAtlasPager-ul > li {
  width: 15.8%;
  margin-right: 1%;
  padding-top: 16px !important;
}
/deep/.carAtlasPage > div {
  position: relative;
  width: 100%;
  min-height: 0;
}
/deep/.carAtlasPager_item {
  background: var(--bg-color-2) !important;
}
/deep/.carAtlasPager_item_main {
  padding: 15px 15px 15px 15px;
  .el-image {
    display: block;
    height: 135px !important;
  }
}
/deep/.colItem-label {
  font-size: 16px;
  width: 50px;
}
</style>
