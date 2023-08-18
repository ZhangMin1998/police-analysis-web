<template>
  <div class="Person">
    <div class="personInfo">
      <div class="headPic">
        <el-image
          :src="headerUrl"
          :preview-src-list="personInfo.avatar ? [headerUrl] : []"
          fit="cover"
        >
          <div slot="error" class="image-slot">
            <img :src="errImg" />
          </div>
        </el-image>
      </div>

      <div class="cardInfo">
        <div class="carinfo_main">
          <div class="flex" v-for="(item, index) in personInfoLabel" :key="index">
            <div class="label">{{ item }}</div>
            <div class="value">
              <EllipsisPop :content="personInfo[index]" :rowNum="2"></EllipsisPop>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-box">
      <div class="list-box" v-for="(item, index) in list" :key="index">
        <div :class="item.isShow ? 'title-box open-title-box' : 'title-box'" @click="openList(item)">
          <div class="title" :class="{haveValue: item.total}">
            <span>{{item.title}}</span>
            <span class="total" v-if="item.title !== '常住人口'">{{'(' + item.total + ')'}}</span>
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
              :total="item.total"
              @updateTotal="updateTotal"
            >
            </component>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { getTotalCount, getOtherTotalCount } from '@/api/allArchives'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import ResidentPopulation from '@/views/common/all-archives/personFileDetail/components/Person/ResidentPopulation'
import TableComponent from '@/views/common/all-archives/personFileDetail/components/Person/TableComponent'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
export default {
  components: {
    // EmptyData,
    // Ellipsis,
    EllipsisPop,
    ResidentPopulation,
    TableComponent
  },
  props: {
    // headerInfo: {
    //   type: Object
    // },
    personInfo: {
      type: Object
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    headerUrl () {
      // return 'http://192.168.1.99:21162/' + this.personInfo.avatar
      return window.location.origin + '/' + this.personInfo.avatar
    },
    ...mapState('Common', {
      dataCenterAllList: 'dataCenterAllList'
    }),
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic']
    },
  },
  watch: {
    personInfo: {
      handler (newVal) {
        // console.log(newVal)
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
      typelist: [],
      personInfoLabel: {
        name: '姓名：',
        sex: '性别：',
        nation: '民族：',
        birthday: '出生日期：',
        age: '年龄：',
        cerNumber: '身份证：',
        // liveAddress: '居住地址：',
        address: '户籍地址：'
      },
      list: [],
      resumeWorkColumns: [], // 复工复产
      BankBusinessColumns: [], // 银行业务
    }
  },
  created () {
    if (this.personInfo.cerTypeName === '身份证' || this.personInfo.cerTypeName === '护照' || this.personInfo.cerTypeName === '港澳通行证') {
      this.personInfoLabel.cerNumber = this.personInfo.cerTypeName + '：'
    } else {
      this.personInfoLabel.cerNumber = '未知证件：'
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    requestPromiseAll (array, requestUrl) {
      const promise = array.map(v => {
        return new Promise((resolve, reject) => {
          requestUrl(v)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      })
      return promise
    },
    getList () {
      this.dataCenterAllList.forEach(item => {
        if (item.personArchivesFlag) {
          this.typelist.push(item)
        }
      })
      // console.log(this.typelist)
      this.typelist.forEach(item => {
        if (item.label !== '常住人口') {
          this.list.push({
            title: item.label,
            value: item.value,
            component: 'TableComponent',
            isShow: false,
            total: 0
          })
        } else {
          this.list.unshift({
            title: item.label,
            value: item.value,
            component: 'ResidentPopulation',
            isShow: false,
          })
        }
      })
      // console.log('list+++++',this.list)
      this.list.forEach(item => {
        if (item.value !== 'population_permanent') {
          getTotalCount({ cerNumber: this.$route.query.cerNumber, tableName: item.value }).then(res => {
            // console.log(res)
            if (res.code === 1) {
              // code为1一般情况
              item.total = res.total
            } else if (res.code === 0) {
              // code为0为有多个身份证的情况
              Promise.all(this.requestPromiseAll(res.field, getOtherTotalCount)).then(res => {
                // console.log(res)
                item.total = res.reduce((pre, cur) => {
                  pre += cur.total
                  return pre
                }, 0)
              })
            }
          })
        }
      })
    },
    updateTotal (e) {
      // console.log('重新查询总数')
      getTotalCount({ cerNumber: this.$route.query.cerNumber, tableName: e }).then(res => {
        // console.log(res)
        if (res.code === 1) {
          // code为1一般情况
          this.list.forEach(item => {
            if (item.value === e) {
              item.total = res.total
            }
          })
        } else if (res.code === 0) {
          // code为0为有多个身份证的情况
          Promise.all(this.requestPromiseAll(res.field, getOtherTotalCount)).then(res => {
            // console.log(res)
            this.list.forEach(item => {
              if (item.value === e) {
                item.total = res.reduce((pre, cur) => {
                  pre += cur.total
                  return pre
                }, 0)
              }
            })
          })
        }
      })
    },
    openList (item) {
      item.isShow = !item.isShow
    },
  }
}
</script>

<style lang="less" scoped>
.Person{
  padding: 0 24px 15px 24px;
  .personInfo {
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
    .cardInfo {
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
            width: 100px;
            color: var(--base-text-color-to-999999);
          }
          .value {
            width: 410px;
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
  .main-box {
    margin-top: 16px;
    .list-box {
      margin-bottom: 2px;
      background: var(--bg-color-2);
      .title-box {
        margin: 0 16px;
        height: 48px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-weight: 400;
          color: var(--base-text-color-to-666666);
          .total {
            margin-left: 10px;
          }
        }
        .haveValue{
          color: var(--base-text-color-5);
        }
        i{
          font-size: 16px;
        }
      }
      .open-title-box {
        border-bottom: 1px solid var(--border-color-4);
      }
      .content-box {
        min-height: 100px;
        padding: 0 16px 10px 16px;
        background: var(--bg-color-2);
      }
    }
  }
}
</style>
