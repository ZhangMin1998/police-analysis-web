<template>
  <div class="data-board-wrap">
    <div class="title">
      <div class="tip">
        <div class="tip-title">数据看板 -</div>
        <div class="from">{{ defaultChecked[0] }}</div>
      </div>
      <i class="el-icon-s-tools" @click="clickTool" :title="'设置'"></i>
    </div>
    <div
      class="container-wrap"
      v-p-loading="loading"
      :element-loading-background="'--bg-color-2'"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
    >
      <template v-if="url">
        <div class="table-header" :style="{ width: tableWidth }">
          <div class="header_row">
            <div
              class="header_col"
              v-for="item in columnInfoList"
              :key="item.prop"
              :style="{ width: $pxToRem(item.minWidth) }"
            >
              <EllipsisPop
                :content="item.label"
                :width="
                  url === '/configurable/data/search/datacenter/list' ||
                  url === '/populationPermanent/list'
                    ? $pxToRem(item.minWidth.split('px')[0] - 36)
                    : '100%'
                "
              ></EllipsisPop>
            </div>
          </div>
        </div>

        <div class="table-body" v-if="themeChange" :style="{ width: tableWidth }">
          <div class="table" ref="table" v-show="listData.length">
            <div class="body_row" v-for="(item, index) in listData" :key="index">
              <div
                class="body_col"
                v-for="col in columnInfoList"
                :key="col.prop"
                :style="{ width: $pxToRem(col.minWidth), background: item.bgColor }"
              >
                <div v-if='[21, 9].includes(col.entityId)' class='col_image'>
                  <el-image
                    class="el-image"
                    :src="origin + item[col.prop]"
                    :preview-src-list="[ origin + item[col.prop] ]"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      <img :src='$themeColor("--car-default-pic")' alt=''>
                    </div>
                  </el-image>
                </div>
                <EllipsisPop
                  v-else
                  :content="
                    col.renderFun
                      ? col.renderFun(item) + ''
                      : item[col.prop]
                      ? item[col.prop] + ''
                      : '--'
                  "
                  :width="
                    url === '/configurable/data/search/datacenter/list' ||
                    url === '/populationPermanent/list'
                      ? $pxToRem(col.minWidth.split('px')[0] - 36)
                      : '100%'
                  "
                ></EllipsisPop>
              </div>
            </div>
          </div>
          <div class="no_data" v-show="!listData.length">暂无数据</div>
        </div>
      </template>
      <!-- <template v-else>
        <FaceRecognition
          v-if="dataType === 'community_face'"
          :haveHeader="false"
        ></FaceRecognition>
        <VideoControl v-if="dataType === 'community_gate'" :haveHeader="false"></VideoControl>
        <BankBusiness v-if="dataType === 'bank_card'" :haveHeader="false"></BankBusiness>
        <PhoneOperator
          v-if="dataType === 'phone_operator'"
          :haveHeader="false"
        ></PhoneOperator>
      </template> -->
    </div>
    <!--    :disabledData='["FaceRecognition", "VideoControl", "BankBusiness", "phoneOperator"]'-->
    <SelectComponent
      ref="select"
      :max="max"
      :defaultChecked="defaultChecked"
      :tipContent="tipContent"
      @checkedResult="checkedResult"
      @close="close"
      v-show="showSelect"
      title="设置"
    ></SelectComponent>
  </div>
</template>

<script>
import SelectComponent from '../selectComponent'
// import colParamsList from './colInfoList'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
// import VideoControl from '@/views/common/data-center/video-control' //视频
// import BankBusiness from '@/views/common/data-center/bank-business' // 银行
// import PhoneOperator from '@/views/common/data-center/phoneOperator' // 运营商业务
// import FaceRecognition from '../../face-recognition/index' // 人脸抓拍
import { getDataBoardData, getRecordsListApi } from '@/api/dataCenter'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';

export default {
  name: 'DataBoard',
  inject: ['fromImport'],
  components: {
    SelectComponent,
    // FaceRecognition,
    // VideoControl,
    // BankBusiness,
    // PhoneOperator,
    EllipsisPop
  },
  data () {
    return {
      max: 1,
      showSelect: false,
      tipContent: '您可以选择 1 种数据显示在数据看板上。',
      defaultChecked: [], // 数据看板，数据来源默认显示探针数据
      dataType: '', // 数据类型
      columnInfoList: [], // 滚动列表列信息数组
      listData: [], // 滚动列表的数据
      addList: [], // 待滚动的数据
      time: null, // 滚动定时器
      url: '', // 获取滚动列表数据的接口
      getMethod: '', // 获取滚动列表数据的请求方式
      getNewTime: null, // 获取新数据的定时器
      isWarn: true,
      listWidth: '',
      themeChange: true,
      fromImportParams: {},
      loading: false
      // scrollDom: null,
      // selectBottom: '', // 选择弹出窗确定按钮定位
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    tableWidth () {
      if (this.url === "/configurable/data/search/datacenter/list") {
        return this.$pxToRem(this.columnInfoList.length * this.columnInfoList[0].minWidth.split("px")[0])
      } else if (this.url === '/populationPermanent/list') {
        return this.$pxToRem(this.listWidth)
      } else {
        return '100%'
      }
    },
    origin () {
      return window.location.origin + '/'
    }
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        // console.log(this.listData);
        this.listData.forEach((item, index) => {
          if (index % 2 === 0) {
            item.bgColor = colorObj['--table-head-bg-color']
          } else {
            item.bgColor = colorObj['--bg-color-2']
          }
        })
        // this.getData(this.url, this.dataType,15, true)
        // 更改颜色
        // this.themeChange = false
        // this.$nextTick(()=>{
        //   this.themeChange = true
        // })
        // setTimeout(()=>{
        //   this.themeChange = true
        // },800)

        // console.log(val);
      },
      // immediate: true
    },
    dataType: {
      handler (newVal) {
        if (newVal) {
          let params
          let fun = () => {
            if (params) {
              this.loading = true
              this.columnInfoList = params.colList
              this.url = params.url
              this.isWarn = params.isWarning
              this.getMethod = params.getMethod
              this.listWidth = params.listWidth || ''
            }
            this.getData(this.url, newVal, 15, true)
          }
          if (this.fromImport.includes(newVal) && !this.fromImportParams[newVal]) {
            this.loading = true
            getRecordsListApi({
              fieldRules: true,
              srcNameEn: newVal
            }).then(res => {
              let result = res.content[0] || {}
              let colList = []
              let minWidth = '160px'
              this.fromImportParams[result.srcNameEn] = {}
              this.fromImportParams[result.srcNameEn]['url'] = '/configurable/data/search/datacenter/list'
              this.fromImportParams[result.srcNameEn]['getMethod'] = 'post'
              this.fromImportParams[result.srcNameEn]['isWarning'] = false
              // if (Object.keys(item.fileRules).length < 11) {
              //   minWidth = (1774 / Object.keys(item.fileRules).length) + 'px'
              // }
              if (result.fileRules.length < 11) {
                minWidth = (1774 / result.fileRules.length) + 'px'
              }
              result.fileRules.forEach(rules => {
                colList.push({
                  label: rules.fieldNameCn,
                  prop: rules.fieldNameEn,
                  minWidth: minWidth,
                  entityId: rules.entityLabelId
                })
              })
              this.fromImportParams[result.srcNameEn]['colList'] = colList
              params = this.fromImportParams[newVal]
              fun()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // params = colParamsList[newVal] || this.fromImportParams[newVal]
            params =  this.fromImportParams[newVal]
            fun()
          }
          // let params = colParamsList[newVal] || this.fromImport[newVal]
        }
      }
    },
    'addList.length': {
      handler (newVal) {
        if (newVal <= 3) {
          if (!this.getNewTime && this.url && this.dataType) {
            this.getNewTime = setInterval(() => {
              this.getData(this.url, this.dataType)
            }, 10000)
          }
        } else if (newVal > 3) {
          clearInterval(this.getNewTime)
          this.getNewTime = null
        }
        if (newVal > 0) {
          if (!this.time) {
            this.setListData()
          }
        } else {
          clearInterval(this.time)
          this.time = null
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.$refs.select) return
      let data = this.$refs.select.getStartData()
      if (!data.length) return
      this.defaultChecked = []
      this.defaultChecked.push(data[0].title)
      this.$refs.select.checkedArray = [data[0].title]
      this.dataType = data[0].dataType
    })
    // this.scrollDom = document.getElementById('container-wrap')
    // this.scrollDom.addEventListener('scroll', this.getScrollItem)
  },
  methods: {
    // getScrollItem () {
    //   let bottom = (this.scrollDom.scrollHeight - document.documentElement.clientHeight + 90 - this.scrollDom.scrollTop) + ''
    //   this.selectBottom = bottom > 400 ? '400' : bottom
    // },
    // 选择点击确定
    checkedResult (item) {
      if (item.value[0] === this.dataType) { // 如果没有改变选中值就不查询
        return
      }
      clearInterval(this.getNewTime)
      this.getNewTime = null
      this.addList = []
      this.columnInfoList = []
      this.listData = []
      this.url = ''
      if (item.label.length && item.value.length) {
        this.defaultChecked = JSON.parse(JSON.stringify(item.label))
        this.dataType = JSON.parse(JSON.stringify(item.value[0]))
      } else {
        this.defaultChecked = []
        this.dataType = ''
      }
    },
    // 滚动定时器
    setListData () {
      this.time = setInterval(() => {
        let colorObj = this.theme === 'light' ? lightTheme : darkTheme
        let bgColor = ''
        this.listData.length % 2 === 0 ? bgColor = colorObj['--bg-color-2'] : bgColor = colorObj['--table-head-bg-color']
        if (this.addList.length) {
          let addData = this.addList[this.addList.length - 1]
          this.addList.pop()
          this.listData.unshift({
            ...addData,
            bgColor: bgColor
          })
        }
        this.animationFun()
      }, 2000)
    },
    // 初始化数据时，列表行的背景色
    startDataBg (list) {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      list.forEach((item, index) => {
        if (index % 2 === 0) {
          // item.bgColor = 'rgba(255, 255, 255, 0.04)'
          item.bgColor = colorObj['--table-head-bg-color']
        } else {
          // item.bgColor = '#192035'
          item.bgColor = colorObj['--bg-color-2']
        }
      })
      return list
    },
    // 获取数据
    getData (url, dataType, pageSize = 10, isAdd = false) {
      if (url && dataType) {
        let params = {}
        if (url === '/dataCenter/dataList') {
          params['dataType'] = dataType + '_type'
        }
        if (url === '/configurable/data/search/datacenter/list') {
          params['tableName'] = dataType
        } else {
          params['pageNum'] = 1
          params['pageSize'] = pageSize
        }
        getDataBoardData(url, this.isWarn, this.getMethod, params).then(res => {
          let result = []
          if (url === '/configurable/data/search/datacenter/list') {
            result = res.slice(0, 15)
          } else {
            result = res.content
          }
          if (isAdd) {
            let listData = []
            if (result.length > 10) {
              listData = result.slice(-10)
              this.addList = result.slice(0, -10)
            } else {
              listData = result
              if (!this.getNewTime && this.url && this.dataType) {
                this.getNewTime = setInterval(() => {
                  this.getData(this.url, this.dataType)
                }, 10000)
              }
            }
            this.listData = this.startDataBg(listData)
          } else {
            if (!this.listData.length) {
              let listData = []
              if (result.length > 10) {
                listData = result.slice(-10)
                this.addList = result.slice(0, -10)
              } else {
                listData = result
              }
              this.listData = this.startDataBg(listData)
            } else {
              if (result.length) {
                let compare = [...this.addList, ...this.listData.slice(0, 15)]
                let fun = (origin, contrast) => {
                  let fnOrigin = JSON.parse(JSON.stringify(origin))
                  let fnContrast = JSON.parse(JSON.stringify(contrast))
                  delete fnOrigin.bgColor
                  delete fnContrast.bgColor
                  for (let key in fnOrigin) {
                    if (fnOrigin[key] + '' !== fnContrast[key] + '') return '1'
                  }
                  return '0'
                }
                result.forEach(item => {
                  let resultArr = []
                  compare.forEach(info => {
                    resultArr.push(fun(item, info))
                  })
                  let end = resultArr.some(info => info === '0')
                  if (!end) {
                    this.addList.unshift(item)
                  }
                })
              }
            }
            // let compare = ''
            // if (this.addList.length) {
            //   if (this.addList[0].createTime) {
            //     compare = new Date(this.addList[0].createTime).getTime()
            //   }
            // } else if (this.listData.length) {
            //   if (this.listData[0].createTime) {
            //     compare = new Date(this.listData[0].createTime).getTime()
            //   }
            // }
            // if (compare) {
            //   let newData = res.content.filter(item => {
            //     return item.createTime && new Date(item.createTime).getTime() > compare
            //   })
            //   this.addList = [...newData, ...this.addList]
            // } else {
            //   if (!this.listData.length) {
            //     if (res.content.length > 1) {
            //       this.listData = res.content.slice(-1)
            //       this.addList = res.content.slice(0, -1)
            //     } else {
            //       this.listData = res.content
            //     }
            //   }
            // }
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    animationFun () {
      this.$nextTick(() => {
        this.$refs.table.style.animation = 'down 1s linear'
        setTimeout(() => {
          this.$refs.table.style.animation = ''
        }, 1000)
      })
    },
    clickTool () {
      this.showSelect = true
    },
    close (bool) {
      this.showSelect = bool
    }
  },
  beforeDestroy () {
    // if (this.scrollDom) {
    //   this.scrollDom.removeEventListener('scroll', this.getScrollItem)
    // }
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
    if (this.getNewTime) {
      clearInterval(this.getNewTime)
      this.getNewTime = null
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.data-board-wrap {
  position: relative;
  padding: 16px;
  background: var(--bg-color-2);
  margin-top: 24px;
  min-height: 60px;
  //.card {
  //  margin-top: 20px;
  //}
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 24px;
    .tip {
      color: var(--base-text-color-to-999999);
      display: flex;
      .tip-title {
        font-weight: bold;
        margin-right: 6px;
      }
    }
    i {
      cursor: pointer;
    }
  }
  .container-wrap {
     // 荣成特异性更改
    // &::-webkit-scrollbar {
    // height: 16px !important; /* 横向滚动条 */
    // }
    width: 100%;
    min-height: 750px;
    font-size: 16px;
    line-height: 16px;
    overflow-x: auto;
    .table-header {
      box-sizing: border-box;
      width: 100%;
      height: 48px;
      padding: 16px 0;
      background: var(--table-head-bg-color);
      border-bottom: 1px solid var(--table-row-border-bottom-color);
      .header_row {
        display: flex;
        .header_col {
          padding: 0 18px;
          border-right: 1px solid var(--table-row-border-bottom-color);
          color: var(--base-text-color-to-999999);
          font-size: 16px;
          /deep/.value_box {
            .value {
              color: var(--base-text-color-to-999999) !important;
            }
          }
          &:first-child {
            padding-left: 32px;
          }
          &:last-child {
            border-right: 0;
          }
        }
      }
    }
    .table-body {
      width: 100%;
      height: 720px;
      overflow-y: hidden;
      color: var(--base-text-color-1);
      .no_data {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100vw - 146px);
        height: 100%;
        color: var(--base-text-color-to-999999);
      }
      .table {
        width: 100%;
        transform: translateY(-48px);
        animation: down 1s linear;
        animation-fill-mode: forwards;
        .body_row {
          display: flex;
          //padding: 14px 0;
          //border-bottom: 1px solid var(--base-text-color-to-999999);
          &:hover {
            .body_col {
              background: rgba(64, 73, 102, 0.4) !important;
            }
          }
          .body_col {
            padding: 14px 18px;
            color: var(--base-text-color-1);
            font-size: 16px;
            line-height: 19px;
            border-right: 1px solid transparent;
            border-bottom: 1px solid var(--table-row-border-bottom-color);
            .col_image {
              height: 19px;
            }
            &:first-child {
              padding-left: 32px;
            }
            &:last-child {
              border-right: 0;
            }
          }
        }
      }
    }
    @media screen and (min-width: 1024px) and (max-width: 1365px){
      .table-body{
        overflow: hidden;
      }
    }

    @keyframes down {
      from {
        transform: translateY(-40px);
      }
      to {
        transform: translateY(0px);
      }
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1365px){
  .container-wrap{
    line-height: 20px;
  }
}
}

/deep/.wrap {
  padding: 0;
  min-height: 0;
  .table-main {
    padding: 0 8px;
  }
}
/deep/.wrap-list {
  margin-top: 0;
  padding: 0;
  background: transparent;
}
/deep/.el-image {
  height: 19px;
  img {
    width: 19px;
    aspect-ratio: 1 / 1;
  }
}
</style>
