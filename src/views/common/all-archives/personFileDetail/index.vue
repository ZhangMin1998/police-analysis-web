<template>
  <div class="personFileDetail">
    <!-- tab栏 -->
    <Loading :isLoading.sync="isLoading">
      <div :class="{ 'tab-wrapper': true, 'is-person': true }">
        <div :class="{ 'tabs': true, 'is-trail': isTrailMap}" v-if="tabsArray.length">
          <el-tabs stretch v-model="activeName" @tab-click="tabsHandleClick">
            <el-tab-pane
              v-for="item in tabsArray"
              :label="item.label"
              :name="item.name"
              :key="item.name"
            ></el-tab-pane>
          </el-tabs>
          <div class="right_box">
            <div class="back-box" @click="backToArchives">
              <i class="iconfont icon-fanhui"></i>
              <span>返回</span>
            </div>
            <div v-if="isTrailMap">
              <TabsMapWithList
              :TabList="picArray"
              :activeName="activeChart"
              @clickTab="changeChart"
              ></TabsMapWithList>
            </div>
          </div>
        </div>
        <div class="tabs-container">
          <component
            ref="child"
            :ID="'' + CerNunber"
            :is="activeName"
            :personInfo="personInfo"
            :mindMapList="mindMapList"
            :activeChart="activeChart"
          >
          </component>
        </div>
      </div>
    </Loading>
  </div>
</template>

<script>
import Loading from '@/components/VisualComponents/Loading'
import PersonData from '@/views/common/all-archives/personFileDetail/components/Person/index'
import PersonInfo from '@/views/common/all-archives/personFileDetail/components/PersonInfo/index'
import Chart from '@/views/common/all-archives/personFileDetail/components/Chart/index'
import Trail from '@/views/common/all-archives/personFileDetail/components/Trail/index'
import NoPermission from '@/components/VisualComponents/NoPermission'
import { getPersonFileDetail } from '@/api/allArchives'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
export default {
  components: {
    Loading,
    PersonData,
    PersonInfo,
    Chart,
    Trail,
    NoPermission,
    TabsMapWithList
  },
  data () {
    return {
      isLoading: false,
      copyChartsList: [],
      // chartList: [], // 关系图谱显示
      mindMapList: [], // 思维导图显示
      personInfo: {},
      activeName: 'PersonData',
      // tabsArray: [
      //   {
      //     label: '人物数据',
      //     name: 'PersonData',
      //     key: 'normal_human:human_info'
      //   },
      //   {
      //     label: '图 谱',
      //     name: 'Chart',
      //     key: 'normal_human:atlas'
      //   }
      // ],
      // usefulRelationTypeListMap: {},
      // usefulRelationTypeList: [],
      vid: '',
      // isTrail: false,
      isTrailMap: false,
      activeChart: 'map',
    }
  },
  computed: {
    CerNunber () {
      return this.$route.query.cerNumber
    },
    CerType () {
      return this.$route.query.cerType
    },
    PersonVid () {
      return this.$route.query.personVid || ''
    },
    // NavName () {
    //   return this.$route.query.label || ''
    // },
    tabsArray () {
      const tabsArray = [
        {
          label: '人物数据',
          name: 'PersonData',
          key: 'normal_human:human_data'
        },
        {
          label: '图 谱',
          name: 'Chart',
          key: 'normal_human:atlas'
        },
        {
          label: '轨 迹',
          name: 'Trail',
          key: 'normal_human:human_trajectory'
        },
        {
          label: '人物信息',
          name: 'PersonInfo',
          key: 'normal_human:human_info'
        },
      ]
      return this.$backPermissionsArray(tabsArray)
      // return tabsArray
    },
    picArray () {
      const picArray = [
        {
          label: '地图',
          value: 'map'
        },
        {
          label: '列表',
          value: 'list'
        }
      ]
      return picArray
    }
  },
  async created () {
    this.isLoading = true
    if (this.tabsArray.length) {
      this.activeName = this.tabsArray[0].name
    } else {
      this.activeName = 'NoPermission'
    }
    // 获取基础数据
    await this.obtainInfo()
    this.isLoading = false
  },
  methods: {
    changeChart (item) {
      this.activeChart = item
    },
    tabsHandleClick (tab) {
      this.activeName = tab.name
      if (tab.name === 'Trail') {
        this.isTrailMap = true
      } else {
        this.isTrailMap = false
      }
    },
    backToArchives () {
      this.$router.push({ name: 'personSocial' })
    },
    // 通过身份证获取性别
    getSex (data) {
      if (parseInt(data.substr(16, 1)) % 2 === 1) {
        return "男"
      } else {
        return "女"
      }
    },
    // 通过身份证号获取出生日期
    getBirthday (data) {
      return data.substring(6, 10) + "/" + data.substring(10, 12) + "/" + data.substring(12, 14)
    },
    // 获取信息
    async obtainInfo () {
      const res = await getPersonFileDetail(this.CerNunber,this.CerType,this.PersonVid)
      if (res == null) {
        return false
      }
      this.vid = res.certificateVid
      if (res && res.age) {
        res.age = res.age.toString()
      }
      if (res.cerType === 'attr_identity_card_type') {
        res.sex = this.getSex(res.cerNumber)
      } else {
        if (res.sex === '女') {
          res.sex = '女'
        } else if (res.sex === '男') {
          res.sex = '男'
        } else if (res.sex === 'male') {
          res.sex = '男'
        } else if (res.sex === 'female') {
          res.sex = '女'
        } else {
          res.sex = '--'
        }
      }

      if (res && !res.birthday && res.cerType === 'attr_identity_card_type') {
        res.birthday = this.getBirthday(res.cerNumber)
      }
      this.personInfo = { ...res }
    }
  }
}
</script>

<style lang="less" scoped>
.personFileDetail {
  // background: var(--bg-color-1);
  // min-height: calc(100vh - 100px);
  // overflow-y: scroll;
  .tab-wrapper {
    min-height: calc(100vh - 114px);
    // padding: 0 24px 15px 24px;
    margin-bottom: 24px;
    position: relative;
    background: var(--bg-color-1);
    // height: calc(100vh - 104px);
    .tabs {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0px 24px 0px 24px;
      .right_box{
        z-index: 9999;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .back-box {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          cursor: pointer;
          i {
            font-size: 16px;
            color: var(--base-text-color-1);
            margin-right: 8px;
          }
          span {
            font-size: 14px;
            font-weight: bold;
            color: var(--base-text-color-1);
          }
        }
        // .select_button {
        //   display: flex;
        //   border: 1px solid @border-color-1;
        //   .common-style {
        //     padding: 3px 10px;
        //     color: @font-color-1;
        //     font-size: 14px;
        //     cursor: pointer;
        //     &:hover {
        //       color: @active-color;
        //     }
        //     &.active {
        //       background: @active-color;
        //       color: @font-color-3;
        //       border: 1px solid @active-color;
        //     }
        //   }
        //   .common-style:last-child {
        //     border-right: 0px;
        //   }
        // }
      }

      // margin-top: 2px;
      /deep/.el-tabs {
        // width: 208px;
        margin-top: 12px;
      }
      /deep/.el-tabs__active-bar {
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 1px !important;
        background-color: var(--active-color);
        z-index: 1;
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        list-style: none;
      }
      /deep/.el-tabs__nav {
        white-space: nowrap;
        position: relative;
        transition: transform 0.3s;
        float: left;
        z-index: 2;
        border-bottom: 1px solid var(--border-color-input);
      }
      /deep/.el-tabs__nav-wrap::after {
        height: 0px !important;
        background-color: #515c7c !important;
      }
      /deep/.el-tabs__item {
        width: 104px;
        padding: 0 !important;
        color: var(--base-text-color-to-999999) !important;
        font-size: 16px !important;
        &:hover {
          color: var(--active-color) !important;
        }
      }
      /deep/.el-tabs__item.is-active {
        color: var(--active-color) !important;
        font-size: 16px !important;
      }
      /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
        -webkit-box-shadow: none;
        box-shadow: none;
      }
    }
    .is-trail{
      position: absolute;
    }
    .tabs-container {
      min-height: calc(100vh - 250px);
    }
  }
}
</style>
