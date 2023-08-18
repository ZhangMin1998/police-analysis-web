<template>
  <div class="person">
    <div class="personInfo">
      <!-- 人物头像 -->
      <div class="headPic">
        <ElImage
          :imgSet="{
            src: headerUrl,
            fit:'cover',
            width:161,
            errorSrc: 'icon-morenHeader',
            list: [headerUrl]
          }"
        ></ElImage>
      </div>

      <!-- 人物信息 -->
      <div class="cardInfo">
        <el-descriptions :column="5">
          <el-descriptions-item
            labelClassName="lableStyle"
            contentClassName="itemStyle"
            v-for="(item, key) in cardTitle"
            :key="item.id"
            :label="item"
          >
            <Ellipsis :wordsLength="24" :value="headerInfo[key] || '--'" />
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="其他证件" :column="5">
          <el-descriptions-item
            v-for="(item, idx) in certificateList"
            :key="idx"
            :label="item.label"
          >
            <Ellipsis :wordsLength="24" :value="item.value" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 重点人信息 -->
    <!-- <div class="importantInfo" v-permission="$route.query.label==='重点人档案'? 'important_human:human_info' : 'normal_human:human_info'"> -->
    <div class="importantInfo" v-if="$route.query.label!=='人物档案' && headerInfo.personType!=='自定义人员'">
      <div class="title">
        <img src="@/assets/img/icon-penal-important.png" alt="" />
        <span>{{$route.query.label==='重点人档案'?'重点人信息':'社会人信息'}}</span>
      </div>
      <div class="content">
        <el-descriptions :column="4">
          <el-descriptions-item
            labelClassName="lableStyle"
            contentClassName="itemStyle"
            v-for="(item, key) in importantInfo"
            :key="key"
            :label="item"
          >
            <Ellipsis :wordsLength="24" :value="suspects[key]" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- 禁毒信息 -->
    <!-- <div class="drugInfo" v-permission="$route.query.label==='重点人档案'? 'important_human:drug_control' : 'normal_human:drug_control'"> -->
    <div class="drugInfo" v-if="$route.query.label!=='人物档案'&& headerInfo.personType!=='自定义人员'">
      <div class="title">
        <img src="@/assets/img/icon-penal-poison.png" alt="" />
        <span>禁毒信息</span>
      </div>
      <div class="content">
        <el-descriptions v-for="(item, idx) in drugInfo" :key="idx" :column="5" :title="item.label">
          <el-descriptions-item
            labelClassName="lableStyle"
            contentClassName="itemStyle"
            v-for="(val, key) in item.list"
            :key="key"
            :label="val"
          >
            <Ellipsis :wordsLength="24" :value="headerInfo[key]" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- 拘留信息 -->
    <!-- <div class="detentionInfo" v-permission="$route.query.label==='重点人档案'? 'important_human:human_detention_info' : 'normal_human:human_detention_info'"> -->
    <div class="detentionInfo" v-if="$route.query.label!=='人物档案'&& headerInfo.personType!=='自定义人员'" >
      <div class="title">
        <img src="@/assets/img/icon-penal-colony.png" alt="" />
        <span>拘留所信息</span>
      </div>
      <div class="detentionCards" v-if="detentionFacilityList.length">
        <div
          class="card"
          @click="showPop(item)"
          v-for="(item, idx) in detentionFacilityList"
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
      <div class="empty_div" v-else>
        <EmptyData />
      </div>
    </div>
  </div>
</template>

<script>
import EmptyData from '@/components/BasicComponents/EmptyData'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import ElImage from '@/components/BasicComponents/ElImage'
const cardTitle = {
  name: '姓名',
  pinyinName: '姓名拼音',
  idCardNumber: '身份证号',
  birthday: '出生日期',
  sex: '性别',
  nation: '国籍',
  nationReconDes: '民族',
  maritalStatus: '婚姻状况',
  culture: '文化程度',
  houseAddr: '户籍地',
  housePoliceStation: '户籍地派出所',
  detailAddr: '户籍地详址'
}

const importantInfo = {
  personSn: '人员编号',
  currHousePolistat: '现住地派出所',
  createTime: '创建时间',
  inBaseTime: '入库时间'
}

const drugInfo = [
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
    ElImage,
    EmptyData,
    Ellipsis
  },
  props: {
    certificateList: {
      type: Array
    },
    detentionFacilityList: {
      type: Array
    },
    headerInfo: {
      type: Object
    },
    suspects: {
      type: Object
    }
  },
  data () {
    return {
      cardTitle: {},
      importantInfo: {},
      drugInfo: []
    }
  },
  computed: {
    headerUrl () {
      // return 'http://192.168.1.182:9141/' + this.headerInfo.imageUrl
      return window.location.origin + '/' + this.headerInfo.imageUrl
    }
  },
  created () {
    this.cardTitle = cardTitle
    this.importantInfo = importantInfo
    this.drugInfo = drugInfo
  },

  methods: {
    showPop (item) {
      this.$emit('showPop', item)
    }
  }
}
</script>

<style lang="less" scoped>
.personInfo {
  display: flex;
  justify-content: space-between;
  .cardInfo {
    // height: 199px;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(248, 248, 248, 0.04);
  }
}
.cardTitle {
  margin-bottom: 10px;
}
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

.importantInfo {
  margin: 16px 0;
  background: rgba(248, 248, 248, 0.04);
}
.drugInfo {
  margin-bottom: 20px;
  background: rgba(248, 248, 248, 0.04);
}

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
  .cardDate {
    margin: 15px 0 10px 0;
  }
}
.content {
  padding: 10px;
}
.headPic {
  margin-right: 16px;
}
::v-deep .el-image {
    display: block;
}
.detentionCards {
  display: flex;
  padding: 10px 0;
}

.title {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 21px;
  padding: 10px;
  color: var(--base-text-color-1);
  font-weight: bold;
  box-sizing: border-box;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  img {
    margin-right: 8px;
  }
}
.empty_div {
  height: 100px;
  background-color: rgba(248, 248, 248, 0.04);
}
::v-deep .itemStyle {
  height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .lableStyle {
  white-space: nowrap;
}
</style>
