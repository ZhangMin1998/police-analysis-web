<template>
  <div class="person">
    <div class="personInfo" v-permission="'custom_human:base_info'">
      <!-- 人物头像 -->
      <div class="avatar" v-if="!isEditInfo">
        <ElImage
          :imgSet="{
            src: headerUrl,
            fit:'cover',
            height:130, //width:161,
            errorSrc: 'icon-morenHeader',
            list: [headerUrl]
          }"
        ></ElImage>
        <UploadIcon
          v-if="isEditInfo"
          :UploadImage.sync="UploadImage"
          @handleChange="UploadChange"
        ></UploadIcon>
      </div>
      <div class="upAvatar" v-else>
        <UploadIcon
          :UploadImage.sync="UploadImage"
          @handleChange="UploadChange"
        ></UploadIcon>
      </div>

      <!-- 人物信息 -->
      <div class="cardInfo">
        <el-descriptions :column="5" v-if="!isEditInfo">
          <el-descriptions-item
            labelClassName="lableStyle"
            contentClassName="itemStyle"
            v-for="(item, key) in cardTitle"
            :key="item.id"
            :label="item"
          >
            <Ellipsis :wordsLength="24" :value="personInfo[key] || '--'" />
            <div v-if="key === 'name'">
              <!-- {{ headerInfo[key] || '--' }} -->
              <i :class="['el-icon-edit', { isActive: isEditInfo }]" v-permission="'custom_human:add_edit_del_human'" @click="editPerson"></i>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <div class="baseInfoBox" v-else>
          <person-header
            ref="topPersonInfo"
            v-if="JSON.stringify(personInfo) != '{}'"
            :info="showBaseInfo"
            :inputInfo="personInfo"
            :infoList="labels"
            :isEditable.sync="isEditInfo"
          />
        </div>
        <div class="otherIDBox">
          <div class="otherIDTitle">
            <span>其他证件</span>
            <i :class="['el-icon-plus']" v-permission="'custom_human:add_edit_del_human'" @click="addCertificateShowPop"></i>
          </div>
          <person-certificate
            :list="personInfo.otherCertificatesList"
            :isEditAble="true"
            @handleEdit="handleUpdateCertificate"
            @handleDel="handleDelCertificate"
          ></person-certificate>
        </div>
      </div>
    </div>

    <!-- 重点人信息 -->
    <!-- <div class="importantInfo">
      <div class="title">
        <img src="@/assets/img/icon-penal-important.png" alt="" />
        <span>自定义人信息</span>
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
            <Ellipsis :wordsLength="24" :value="personInfo[key] || '--'" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div> -->
    <!-- 禁毒信息 -->
    <!-- <div class="drugInfo">
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
            <Ellipsis :wordsLength="24" :value="personInfo[key] || '--'" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div> -->
    <!-- 拘留信息 -->
    <!-- <div class="detentionInfo">
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
    </div> -->
    <!-- 其他证件 - 弹窗 - 增删改查  -->
    <pop
      :pop.sync="certificatePop"
      @beforeClose="hideCertificatePop"
      @beforeOpen="showCertificatePop"
    >
      <SingerType :list.sync="certificateFormList" :btns="certificateTypeBtns"> </SingerType>
    </pop>
  </div>
</template>

<script>
// import EmptyData from '@/components/BasicComponents/EmptyData'
import PersonHeader from '@/views/common/all-archives/person-custom/person-detail-custom/components/EditPerson/person-header'
import PersonCertificate from '@/views/common/all-archives/person-custom/person-detail-custom/components/EditPerson/PersonCertificate'
import {
  sexOption,
  cultureOption,
  maritalStatusOption
} from '@/views/common/all-archives/components/dynamic-form/form-data'
import {
  updateCertificate,
  addCertificate,
  deleteCertificate,
  getCertificateType,
  uploadFacePic
} from '@/api/allArchives'
import Pop from '@/components/BasicComponents/Dialog'
import Ellipsis from '@/components/BasicComponents/Ellipsis'
import UploadIcon from '@/components/BasicComponents/UploadIcon'
import SingerType from '@/components/BasicComponents/SingerType'
import ElImage from '@/components/BasicComponents/ElImage'
const cardTitle = {
  name: '姓名',
  cerNumber: '身份证号',
  birthday: '出生日期',
  sex: '性别',
  country: '国籍',
  maritalStatus: '婚姻状况',
  culture: '文化程度',
  liveAddress: '现居住地址',
  address: '户籍地址'
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
      personText: '人员类型'
    }
  }
]
const labels = [
  {
    label: '姓名',
    prop: 'name',
    isUnAllow: true,
    type: 'input'
  },
  {
    label: '身份证号',
    prop: 'cerNumber',
    isUnAllow: true,
    type: 'input'
  },
  {
    label: '出生日期',
    prop: 'birthday',
    isUnAllow: true,
    type: 'date'
  },
  {
    label: '性别',
    prop: 'sex',
    isUnAllow: true,
    type: 'select',
    option: sexOption
  },

  {
    label: '国籍',
    prop: 'country',
    type: 'input'
  },
  {
    label: '婚姻状况',
    prop: 'maritalStatus',
    type: 'select',
    option: maritalStatusOption
  },
  {
    label: '文化程度',
    prop: 'culture',
    type: 'select',
    option: cultureOption
  },
  {
    label: '现居住地址',
    prop: 'liveAddress',
    type: 'input'
  },
  {
    label: '户籍地址',
    prop: 'address',
    type: 'input'
  }
]
export default {
  name: 'Person',
  components: {
    ElImage,
    // EmptyData,
    PersonHeader,
    PersonCertificate,
    Pop,
    SingerType,
    UploadIcon,
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
    personInfo: {
      type: Object
    }
  },
  data () {
    return {
      cardTitle: {},
      importantInfo: {},
      drugInfo: [],
      isEditInfo: false,
      labels: labels,
      isActiveIndex: -1,
      updateCertificateId: '',
      certificatePop: {
        show: false,
        title: '新增证件',
        width: '450px',
        top: '180px'
      },
      UploadImage: {
        imageUrl: '',
        accept: '.jpg',
        multiple: false,
        width: 161,
        height: 225,
        imgFile: null
      },
      certificateTypeBtns: [
        { text: '取消', btnEvent: this.hideCertificatePop, type: 'normal' },
        {
          isLoading: false,
          isLoadingText: '提交中...',
          text: '确定',
          btnEvent: this.submitCertificate,
          type: 'normal'
        }
      ],
      certificateFormList: [
        {
          prop: 'cerTypeName',
          type: 'select',
          options: [],
          title: '证件类型',
          value: ''
        },
        { prop: 'cerNumber', type: 'input', title: '证件数值', value: '' }
      ]
    }
  },
  computed: {
    headerUrl () {
      return window.location.origin + '/' + this.personInfo.avatar
    },
    showBaseInfo () {
      const tempObj = JSON.parse(JSON.stringify(this.personInfo))
      // 人员类型转义
      const personTypeListMap = this.$store.getters['Dict/personTypeListMap']
      tempObj.personType = personTypeListMap[tempObj.personType]

      tempObj.culture = tempObj.cultureDes
      tempObj.maritalStatus = tempObj.maritalStatusDes
      return tempObj
    },
    ID () {
      return this.$route.query.id || this.$route.params.id
    }
  },
  created () {
    this.cardTitle = cardTitle
    this.importantInfo = importantInfo
    this.drugInfo = drugInfo
    this.queryCertificateType()
  },
  watch: {
    'personInfo.avatar': {
      handler (val) {
        if (val) {
          this.UploadImage.imageUrl = window.location.origin + '/' + val
        } else {
          this.UploadImage.imageUrl = ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    UploadChange (file) {
      let url = URL.createObjectURL(file.raw)
      this.UploadImage.imageUrl = url
      this.UploadImage.imgFile = file.raw
      let formData = new FormData()
      formData.append('multipartFile', file.raw)
      uploadFacePic(formData).then(res => {
        this.$set(this.personInfo, 'avatar', res)
      })
    },
    /**  ------------------  其他证件 - 弹窗 --------------------- */
    /** 证件 - 查询数据 */
    queryAllCertificate () {
      // 更新父组件的certificateList来传递给子组件
      // this.$parent.queryAllCertificate()
      // 更新父组件的headerInfo来传递给子组件,原因可能是身份证更改了
      this.$parent.obtainInfo()
    },

    /** 证件 - 弹窗 -  渲染类型的数据 */
    queryCertificateType () {
      getCertificateType().then(res => {
        let list = res.map(i => {
          return {
            label: i.cerName,
            value: i.code,
            id: i.id
          }
        })
        this.certificateFormList[0].options = list
      })
    },

    /** 证件 - 新增时弹出弹框 */
    addCertificateShowPop () {
      this.certificateFormList.forEach(element => {
        element.value = ''
      })
      this.certificateFormList[0].isDisable = false
      this.showCertificatePop()
    },
    /** 证件 - 删除 */
    handleDelCertificate (item) {
      this.$policeComfirm('确定要删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteCertificate(item.id).then(() => {
            this.$messageTip.success('删除成功！')
            this.queryAllCertificate()
          })
        })
        .catch(() => {})
    },

    /** 证件 - 编辑 */
    handleUpdateCertificate (item) {
      this.updateCertificateId = item.id
      this.certificatePop.title = '编辑证件'
      this.certificateFormList[0].isDisable = true
      this.certificateFormList.forEach(element => {
        element.value = item[element.prop] || ''
      })

      this.showCertificatePop()
    },

    /** 证件 - 关闭弹窗 */
    hideCertificatePop () {
      this.updateCertificateId = ''
      this.certificatePop.title = '新建证件'
      this.certificatePop.show = false
    },

    /** 证件 - 显示弹窗 */
    showCertificatePop () {
      this.certificatePop.show = true
    },

    /** 证件 - 真实身份新增证件/修改证件 表单提交 */
    submitCertificate () {
      let url = addCertificate

      let params = {}
      this.certificateFormList.forEach(element => {
        params[element.prop] = element.value
      })
      params.personId = this.ID

      if (this.updateCertificateId) {
        url = updateCertificate
        params.id = this.updateCertificateId
      }

      if (!params.cerTypeName) {
        this.$messageTip.error('证件类型不能为空！')
        return
      }
      if (!params.cerNumber) {
        this.$messageTip.error('证件内容不能为空！')
        return
      }

      this.certificateTypeBtns[1].isLoading = true
      url(params)
        .then(() => {
          this.$messageTip.success(params.id ? '修改成功！' : '新建成功！')
          this.queryAllCertificate()
          this.hideCertificatePop()
        })
        .finally(() => {
          this.certificateTypeBtns[1].isLoading = false
        })
    },
    showPop (item) {
      this.$emit('showPop', item)
    },
    editPerson () {
      this.isEditInfo = !this.isEditInfo
    }
  }
}
</script>

<style lang="less" scoped>
.personInfo {
  display: flex;
  justify-content: space-between;
  background: var(--bg-color-2) ;
  .avatar {
    padding: 16px 0 16px 16px;
    // width: 113px;
  }
  .upAvatar{
    padding: 16px 0 16px 16px;
    ::v-deep .upload-container {
      margin-bottom: 0;
      div {
        margin-right: 0 !important;
      }
    }
  }
  .cardInfo {
    width: 100%;
    min-height: 162px;
    padding: 16px;
    box-sizing: border-box;
    // background: rgba(248, 248, 248, 0.04);
    overflow: auto;
    .otherIDBox {
      .otherIDTitle {
        color: var(--base-text-color-1);
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 2px;
      }
    }
  }
  .importantInfo {
    margin: 16px 0;
    background: rgba(248, 248, 248, 0.04);
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
    .content {
      padding: 10px;
    }
  }
  .drugInfo {
    margin-bottom: 20px;
    background: rgba(248, 248, 248, 0.04);
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
    .content {
      padding: 10px;
    }
  }
  .detentionInfo{
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
    .detentionCards {
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
    .empty_div {
      height: 100px;
      background-color: rgba(248, 248, 248, 0.04);
    }
  }
}

.el-icon-edit,
.el-icon-plus {
  cursor: pointer;
  margin-left: 16px;
  &:hover {
    color: #409eff;
  }
  &.isActive {
    color: #409eff;
  }
}

::v-deep .el-image {
  display: block;
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
