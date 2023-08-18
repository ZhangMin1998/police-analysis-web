<template>
  <div class="PersonInfo">
    <!-- 基本信息 -->
    <div class="base_box">
      <div class="baseInfo_title">
        <span>基本信息</span>
      </div>
      <div class="baseInfo">
        <div class="headPic">
          <el-image :src="headerUrl" :preview-src-list="personInfo.avatar ? [headerUrl] : []" fit="cover">
            <div slot="error" class="image-slot">
              <img :src="errImg" />
            </div>
          </el-image>
        </div>

        <div class="cardInfo">
          <div class="cardInfo_main">
            <div class="flex" v-for="(item, index) in personInfoLabel" :key="index">
              <div class="label">{{ item }}</div>
              <div class="value">
                <EllipsisPop :content="personInfo[index]" :rowNum="2"></EllipsisPop>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 人物特征 -->
    <div class="base_box">
      <div class="baseInfo_title">
        <span>人物特征</span>
      </div>
      <div class="main_box">
        <Chart :personInfo="personInfo" id="chart1"></Chart>
      </div>
    </div>

    <!-- 人际关系 -->
    <div class="base_box">
      <div class="baseInfo_title">
        <div>人际关系</div>
        <div class="blank_button" @click="toDeduction">关系推演</div>
      </div>
      <div class="main_box">
        <Chart :personInfo="personInfo" id="chart2"></Chart>
      </div>
    </div>

    <!-- 人物轨迹热力图 -->
    <div class="base_box">
      <div class="baseInfo_title">
        <span>人物轨迹热力图</span>
      </div>
      <div class="main_box">
        <Trail :activeChart="activeChart" :personInfo="personInfo"></Trail>
        <div class="changeChart">
          <TabsMapWithList :TabList="picArray" :activeName="activeChart" @clickTab="changeChart"></TabsMapWithList>
        </div>
      </div>
    </div>
    <!-- <div style="height:10px"></div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import EllipsisPop from '@/components/BasicComponents/EllipsisPop'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import Chart from '@/views/common/all-archives/personFileDetail/components/PersonInfo/Chart'
import Trail from '@/views/common/all-archives/personFileDetail/components/Trail/index'
// import { getNodeType } from '@/api/analysis'
export default {
  components: {
    EllipsisPop,
    TabsMapWithList,
    Chart,
    Trail
  },
  props: {
    personInfo: {
      type: Object
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic']
    },
    headerUrl () {
      return window.location.origin + '/' + this.personInfo.avatar
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
  watch: {
    personInfo: {
      handler (newVal) {
        if (newVal) {
          if (newVal.cerTypeName === '身份证' || newVal.cerTypeName === '护照' || newVal.cerTypeName === '港澳通行证') {
            this.personInfoLabel.cerNumber = newVal.cerTypeName + '：'
          } else {
            this.personInfoLabel.cerNumber = '未知证件：'
          }
        }
      }
    }
  },
  data () {
    return {
      personInfoLabel: {
        name: '姓名：',
        sex: '性别：',
        nation: '民族：',
        birthday: '出生日期：',
        age: '年龄：',
        cerNumber: '身份证：',
        address: '户籍地址：'
      },
      activeChart: 'map',
      // iconObj: {},
      // usefulRelationTypeListMap: {},
      // usefulRelationTypeList: [],
    }
  },
  async created () {
    // await this.getEntityIcon() // 获取实体图标
    // await this.getNodeTypeList() // 获取对照表
    // console.log(this.personInfo)
    if (this.personInfo.cerTypeName === '身份证' || this.personInfo.cerTypeName === '护照' || this.personInfo.cerTypeName === '港澳通行证') {
      this.personInfoLabel.cerNumber = this.personInfo.cerTypeName + '：'
    } else {
      this.personInfoLabel.cerNumber = '未知证件：'
    }
  },
  // beforeDestroy(){
  //   window.removeAllPending()
  // },
  methods: {
    // 获取实体的图标
    // async getEntityIcon () {
    //   let list = await getEntityIcon()
    //   this.iconObj = list
    // },
    // async getNodeTypeList () {
    //   let list = await getNodeType()
    //   list.forEach(item => {
    //     let temp = {}
    //     temp.typeCode = item.entity_type_en_name
    //     temp.typeName = item.entity_type_zh_name
    //     this.usefulRelationTypeList.push(temp)
    //     this.usefulRelationTypeListMap[item.entity_type_en_name] = item.entity_type_zh_name
    //   })
    // },
    changeChart (item) {
      this.activeChart = item
    },
    // 跳转到关系推演
    toDeduction () {
      window.open(window.location.origin + '/ol/deduce?cerNumber=' + this.personInfo.cerNumber + '&cerType=' + this.personInfo.cerType)
      // this.$router.push({name: 'deduction', query:{cerNumber: this.personInfo.cerNumber,cerType: this.personInfo.cerType}})
    }
  }
}
</script>

<style lang="less" scoped>
.PersonInfo {
  padding-bottom: 10px;

  .base_box {
    background: var(--bg-color-2);
    margin: 0 24px 24px 24px;

    .baseInfo_title {
      margin: 0 16px;
      height: 48px;
      border-bottom: 1px solid var(--border-color-4);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .baseInfo {
    padding: 16px 0 0 0;
    background: var(--bg-color-2);
    display: flex;
    justify-content: space-between;

    .headPic {
      padding: 0 0 0 16px;

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

    .cardInfo {
      width: 100%;
      padding: 0 16px 0 16px;
      box-sizing: border-box;
      overflow: hidden;

      .cardInfo_main {
        font-size: 16px;
        // column-count: 3;
        display: flex;
        flex-wrap: wrap;

        .flex {
          width: 33.3%;
          display: flex;
          margin-bottom: 20px;

          .label {
            width: 97px;
            color: var(--base-text-color-to-999999);
          }

          .value {
            // width: 410px;
            color: var(--base-text-color-1);
          }
        }

        @-moz-document url-prefix() {
          @media screen and (min-width: 1024px) and (max-width: 1365px) {
            .flex {
              line-height: 1.5 !important;
            }
          }
        }
      }
    }
  }

  .main_box {
    position: relative;
    padding: 16px 16px;

    .changeChart {
      position: absolute;
      top: 60px;
      right: 30px;
    }
  }
}

/deep/.rightDialog {
  right: 24px;
  top: 90px;
  background-color: var(--bg-color-1) !important;
}
</style>
