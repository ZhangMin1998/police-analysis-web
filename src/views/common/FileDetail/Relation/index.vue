<template>
  <div class="relation">
    <el-tabs tab-position="left" class="tabBtn">
      <!-- 真实身份 -->
      <el-tab-pane v-if="hasPermission('important_human:human_relation_real')">
        <!-- 左边tab栏 -->
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">真实身份</span>
          </div>
          <div class="tabs-des">人物特征/车辆/手机号/银行卡/信用卡</div>
        </div>
        <!-- 人物特征 -->
        <div
          class="empty_div"
          v-if="Object.keys(personInfo).length == 0 && relationList.length === 0"
        >
          <EmptyData />
        </div>
        <div v-else>
          <el-descriptions v-for="(item, idx) in relationMsg" :key="idx">
            <div slot="title" class="slotIcon">
              <img :src="require('@/assets/img/icon_person.png')" />
              {{ item.label }}
            </div>
            <el-descriptions-item v-for="(val, key) in item.list" :label="val" :key="val + key">{{
              personInfo[key] || '--'
            }}</el-descriptions-item>
          </el-descriptions>

          <div
            class="relationList"
            v-for="(relationItem, relationIndex) in relationList"
            :key="relationItem.typeName + '_' + relationIndex"
          >
            <div class="relationList-infoItem">
              <img
                class="relationList-infoItem-icon"
                :src="require('@/assets/img/' + typeIconMap[relationItem.typeCode] + '.png')"
              />
              {{ relationItem.typeName }}
            </div>
            <div class="relationList-infoContent">
              <div
                v-for="(listItem, listIndex) in relationItem.list"
                :key="listItem.index + '_' + listIndex"
              >
                {{ listItem.index }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 虚拟账号 -->
      <el-tab-pane v-if="hasPermission('important_human:human_virtual_account')">
        <!-- 左边tab栏 -->
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">虚拟账号</span>
          </div>

          <div class="tabs-des">微信/QQ/MAC地址/虚拟账号</div>
        </div>

        <div class="empty_div" v-if="accountList.length === 0">
          <EmptyData />
        </div>

        <div
          class="relationList"
          v-for="(accountItem, accountIndex) in accountList"
          :key="accountItem.typeName + '_' + accountIndex"
        >
          <div class="relationList-infoItem">
            <img
              class="relationList-infoItem-icon"
              :src="require('@/assets/img/' + typeIconMap[accountItem.typeCode] + '.png')"
            />
            {{ accountItem.typeName }}
          </div>
          <div class="relationList-infoContent">
            <div
              v-for="(listItem, listIndex) in accountItem.list"
              :key="listItem.index + '_' + listIndex"
            >
              {{ listItem.index }}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 虚拟痕迹 -->
      <!-- <el-tab-pane>
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">虚拟痕迹</span>
          </div>
          <div class="tabs-des">搜索关键字/BOSS言论</div>
        </div>

        <div class="empty_div" v-if="Object.keys(traceList).length == 0">
          <EmptyData />
        </div>
        <div v-else>
          <div class="relationList" v-for="(val, key) in traceList" :key="val + key">
            <div class="infoItem">{{ key }}</div>
            <div class="infoContent" v-for="(item, idx) in val" :key="idx">
              {{ idx }} ({{ item }}次)
            </div>
          </div>
        </div>
      </el-tab-pane> -->
      <!-- 人物图集 -->
      <el-tab-pane v-if="hasPermission('important_human:human_pics')">
        <div slot="label" style="padding: 0 8px">
          <div class="tabsTitle">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <span class="tabName">人物图集</span>
          </div>
          <div class="tabs-des">设备采集人脸照片</div>
        </div>

        <div class="empty_div" v-if="!isHasImg">
          <EmptyData />
        </div>

        <div class="PageHeader-search" v-else>
          <PageHeader :cusStyle="{ margin: 0 }">
            <div class="table-searchs">
              <DatePick ref="DatePick"></DatePick>

              <div>
                <el-input
                  v-model.trim="searchParams.key"
                  placeholder="请输入场所名称"
                  clearable
                  @keyup.enter.native="searchPic"
                ></el-input>
              </div>
            </div>

            <!-- 搜索按钮 -->
            <div>
              <el-button type="primary" class="btn" @click="searchPic" :loading="searchLoading">{{
                searchLoading ? '搜索中' : '搜索'
              }}</el-button>
            </div>
          </PageHeader>
        </div>

        <div v-if="Object.keys(picList).length > 0 && isHasImg">
          <div class="relationList" v-for="(val, key) in Object.keys(picList)" :key="val + key">
            <div class="relationList-time">{{ val }}</div>
            <div class="infoContent">
              <div class="img_item" v-for="(_val, _key) in picList[val]" :key="_val + _key">
                <ElImage
                  :imgSet="{
                    src: baseUrl + _key,
                    height: 189,
                    errorSrc: 'icon-morenHeader'
                  }"
                ></ElImage>
              </div>
            </div>
          </div>
        </div>
        <div class="empty_div" v-else-if="Object.keys(picList).length === 0 && isHasImg">
          <EmptyData />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DatePick from '@/views/common/data-center/components/DatePick'
import EmptyData from '@/components/BasicComponents/EmptyData'
import ElImage from '@/components/BasicComponents/ElImage'
import PageHeader from '@/components/BasicComponents/PageHeader'

import { queryPersonInfoType, queryPersonImgLists } from '@/api/allArchives'

const relationMsg = [
  {
    label: '人物特征',
    list: {
      height: '身高',
      cerNumber: '身份证号',
      dnaCode: 'DNA编号',
      fingerMark: '指纹编号'
    }
  }
]
import { typeIconMap } from '@/views/common/all-archives/person-custom/relation-atlas/Charts/mock.js'
export default {
  name: 'Relation',
  components: {
    DatePick,
    EmptyData,
    ElImage,
    PageHeader
  },
  props: {
    ID: { type: String }
  },
  data () {
    return {
      isHasImg: false,
      searchLoading: false,
      relationMsg: Object.freeze(relationMsg),
      searchParams: {},
      relationList: [],
      personInfo: {},
      accountList: [],
      traceList: {},
      picList: {},
      typeIconMap: Object.freeze(typeIconMap)
    }
  },
  computed: {
    baseUrl () {
      return window.location.origin + '/'
    }
  },
  created () {
    this.getInfoAssociate()
  },
  methods: {
    hasPermission (permission){
      return this.$store.state.Common.permissionsArray.includes(permission)
    },
    searchPic () {
      this.$nextTick(() => {
        this.searchParams.startTime = this.$refs.DatePick.startTime || ''
        this.searchParams.endTime = this.$refs.DatePick.endTime || ''

        if (!this.searchParams.startTime && this.searchParams.endTime) {
          this.$messageTip.error('请输入开始时间！')
          return false
        }
        if (this.searchParams.startTime && !this.searchParams.endTime) {
          this.$messageTip.error('请输入结束时间！')
          return false
        }

        this.searchLoading = true

        // 查找图片信息
        queryPersonImgLists(this.ID, this.searchParams)
          .then(res => {
            if (!res || JSON.stringify(res) === '{}') {
              this.picList = {}
              return
            }

            this.picList = { ...res }
          })
          .finally(() => {
            this.searchLoading = false
          })
      })
    },
    formatIdentityList (mapObj) {
      let list = []
      Object.keys(mapObj).forEach(val => {
        if (!mapObj[val] || mapObj[val].length === 0) return
        const obj = {
          typeCode: mapObj[val][0].typeCode,
          typeName: this.$store.getters['Dict/usefulRelationTypeListMap'][mapObj[val][0].typeCode],
          list: mapObj[val]
        }
        list.push(obj)
      })
      return list
    },
    //获取关联信息
    getInfoAssociate () {
      queryPersonInfoType(this.ID, { mark: 'real_identity' }).then(res => {
        if (!res || JSON.stringify(res.map) === '{}') return
        this.relationList = this.formatIdentityList(res.map)
        this.personInfo = { ...res.personFeatureVo }
      })
      queryPersonInfoType(this.ID, { mark: 'virtual_account' }).then(res => {
        if (!res) return
        this.accountList = this.formatIdentityList(res.map)
      })

      queryPersonImgLists(this.ID).then(res => {
        if (!res || JSON.stringify(res) === '{}') {
          this.isHasImg = false
          return
        }

        this.isHasImg = true
        this.picList = { ...res }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.relation{
  .tabBtn {
    text-align: left;
    .tabsTitle {
      display: flex;
      align-items: center;
      height: 32px;
      .circle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
        width: 12px;
        height: 12px;
        border: 2px solid var(--base-text-color-1);
        border-radius: 50%;
        .inner {
          width: 4px;
          height: 4px;
          background-color: var(--base-text-color-1);
          border-radius: 50%;
        }
      }
    }
    .tabs-des {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 110px;
      color: var(--base-text-color-to-999999);
      font-size: 14px;
      white-space: normal;
    }
    /deep/ .el-tabs__item {
      padding: 0 !important;
      width: 194px;
      height: 160px;
      background: url('~@/assets/img/file_detail_tab.png') no-repeat;
      background-size: 100% 100%;
    }
    /deep/ .el-tabs__item.is-active {
      color: #fff !important;
      font-weight: normal !important;
      background: url('~@/assets/img/tab_active.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}

.infoItem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
}

.slotIcon {
  display: flex;
  align-items: center;
  margin: 17px 0;
  color: var(--base-text-color-to-999999);
  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  margin: 0;
}

.relationList {
  padding: 16px 0;
  &-time {
    margin-bottom: 12px;
  }
  .infoContent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    color: var(--base-text-color-1);
    .img_item {
      margin-right: 24px;
    }
  }
}
.relationMsg /deep/.el-tabs__content {
  padding: 15px;
}

/deep/ .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
/deep/ .el-tabs--left .el-tabs__nav.is-left {
  overflow: auto;
  height: calc(100vh - 249px);
  float: none;
}

/deep/.el-tabs__active-bar {
  background-color: transparent;
}
/deep/.el-tabs__item,
/deep/.is-left {
  margin-bottom: 16px;
}
/deep/.is-left:last-child {
  margin-bottom: 0px;
}

/deep/.el-tabs__nav-next,
/deep/.el-tabs__nav-prev {
  display: none;
}

/deep/.el-tabs__nav-wrap,
/deep/.is-scrollable,
/deep/.is-left {
  padding: 0 !important;
}
/deep/.el-tabs__content {
  position: relative;
  height: calc(100vh - 249px);
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
  // background: rgba(248, 248, 248, 0.04);
  background: var(--bg-color-2);
}

.empty_div {
  height: calc(100vh - 350px);
}

.table-searchs {
  display: flex;
  align-items: center;
  > div {
    margin-right: 12px;
  }
}

.relationList-infoContent {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--base-text-color-1);
  > div {
    width: 25%;
  }
}

.relationList-infoItem {
  display: flex;
  align-items: center;
  padding: 12px 0;
  &-icon {
    margin-right: 10px;
  }
}
</style>
