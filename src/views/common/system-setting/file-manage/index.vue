<template>
  <div class="fileManage">
    <div class="topTitle">
      <div class="title-box">
        人物信息
      </div>
    </div>
    <div class="personInfo">
      <div class="headPic">
        <img :src="require('@/assets/img/' + headerImage + '.png')"/>
      </div>

      <div class="cardInfo">
        <div class="carinfo_main">
          <div class="flex" v-for="(item, index) in personInfo" :key="index">
            <div class="label">{{ item.label }}</div>
            <div class="value">
              <EllipsisPop :content="item.value" :rowNum="2"></EllipsisPop>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-box">
      <div class="list-box" v-for="(item, index) in list" :key="index">
        <div :class="item.isShow ? 'title-box open-title-box' : 'title-box'" @click="openList(item)">
          <div class="title">
            <span>{{item.title}}</span>
            <span class="total" v-if="item.total">{{'(' + item.total + ')'}}</span>
          </div>
          <!-- <i class='iconfont icon-xiala' v-if="!item.isShow"></i> -->
          <i class="el-icon-arrow-down" v-if="!item.isShow"></i>
          <i class="el-icon-arrow-up" v-else></i>
        </div>
        <el-collapse-transition>
          <div class="content-box" v-if="item.isShow">
            <component
            :is="item.component"
            :value="item.value"
            >
            </component>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import Person from './components/Person'
import TableComponent from './components/tableComponent'
import { mapState } from 'vuex'
import { saveLog } from '@/api/login'
import { lightTheme, darkTheme } from "@/assets/js/variable"
export default {
  components: {
    EllipsisPop,
    Person,
    TableComponent
  },
  computed: {
    headerUrl () {
      return window.location.origin + '/' + this.personInfo.avatar
    },
    ...mapState('Common', {
      dataCenterAllList: 'dataCenterAllList'
    }),
    ...mapState('User', {
      theme: 'theme'
    }),
    headerImage () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    }
  },
  data () {
    return {
      typelist: [],
      avatar: '',
      personInfo: [
        { label: '姓名：', value: '某某某'},
        { label: '性别：', value: '某'},
        { label: '民族：', value: '某'},
        { label: '出生日期：', value: '2020/01/01'},
        { label: '年龄：', value: '20'},
        { label: '身份证：', value: '888888888888888888'},
        // { label: '居住地址：', value: '某某某某某某某某某某某某某某某某某某某某'},
        { label: '户籍地址：', value: '某某某某某某某某某某某某某某某某某某某某'}
      ],
      list: []
    }
  },
  created () {
    saveLog({
      menuMark: 'menuMark',
      itemName: '系统管理-档案管理-查询'
    }).then(() => {
    }).finally(() => {})

    this.getList()

    // this.list = [
    //   { title: '常住人口', component: 'Person', isShow: false},
    //   { title: '复工复产', component: 'TableComponent', isShow: false, total: 10},
    // ]
  },
  methods: {
    getList () {
      this.typelist = JSON.parse(JSON.stringify(this.dataCenterAllList)).filter(item => {
        return item.personArchivesFlag
      })
      // console.log(this.typelist)
      this.typelist.forEach(item => {
        if ( item.label !== '常住人口') {
          this.list.push({
            title: item.label,
            value: item.value,
            component: 'TableComponent',
            isShow: false,
            total: 5
          })
        } else {
          this.list.unshift({
            title: item.label,
            value: item.value,
            component: 'Person',
            isShow: false
          })
        }
      })
      console.log(this.list)
    },
    openList (item) {
      item.isShow = !item.isShow
    }
  }
}
</script>

<style lang="less" scoped>
.fileManage{
  background: var(--bg-color-1);
  overflow-y: scroll;
  min-height: calc(100vh - 100px);
  padding: 14px 24px 15px 24px;
  margin-bottom: 24px;
  .topTitle{
    margin: 0px 0 16px 0;
    .title-box{
      width: 104px;
      height: 40px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #3D6EFF;
      border-bottom: 1px solid #3D6EFF;
    }
  }
  .personInfo {
    background: var(--bg-color-2);
    display: flex;
    justify-content: space-between;
    .headPic {
      padding: 16px 0 16px 16px;
      img {
        width: 81px;
        height: 102px;
      }
      // /deep/ .el-image {
      //   display: block;
      //   width: 81px;
      //   height: 102px;
      //   img {
      //     width: 81px;
      //     height: 102px;
      //   }
      // }
      // /deep/.image-slot {
      //   background: var(--bg-color-2) !important;
      // }
    }
    .cardInfo{
      width: 100%;
      padding: 16px 16px 5px 16px;
      box-sizing: border-box;
      overflow: hidden;
      .carinfo_main {
        font-size: 16px;
        // column-count: 3;
        display: flex;
        flex-wrap: wrap;
        .flex {
          width: 33.3%;
          display: flex;
          margin-bottom: 20px;
          .label {
            width: 80px;
            color: var(--base-text-color-to-999999);
          }
          @media screen and (min-width: 1024px) and (max-width: 1365px){
            .label {
             width: 96px;
          }
          }
          .value {
            // width: 440px;
            user-select: none;
            color: var(--base-text-color-1);
            filter: blur(4px);
          }
        }
      }
    }
  }
  .main-box{
    margin-top: 16px;
    .list-box{
      margin-bottom: 2px;
      background: var(--bg-color-2);
      .title-box{
        margin: 0 16px;
        height: 48px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title{
          font-weight: 400;
          .total{
            margin-left: 10px;
          }
        }
        i{
          font-size: 16px;
        }
      }
      .open-title-box{
        border-bottom: 1px solid #38425D;
      }
      .content-box{
        // height: 100px;
        padding: 0 16px 10px 16px;
        background: var(--bg-color-2);
      }
    }
  }
}
@media screen and (min-width: 1024px) and (max-width: 1365px){
  .fileManage{
    min-height: calc(100vh - 170px);
  }
}
</style>
