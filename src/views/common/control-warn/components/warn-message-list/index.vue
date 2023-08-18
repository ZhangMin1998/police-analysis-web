<template>
<div :class='["warn_message_wrap", !show ? "hide" : ""]'>
  <div class='show_state' v-show='show'>
    <div class='header'>
      <div class='header_left'>
        <img :src='require("@/assets/img/title-header.png")' alt=''>
        <div class='title'>触警列表</div>
        <div class='trigger_num' v-show='triggerNum'>{{ triggerNum }}</div>
        <div class='warn_all' @click='showTrigger'>全部</div>
      </div>
      <div class='header-right' @click='handleShow(false)' title='折叠'></div>
    </div>
    <div class='list_content'>
      <div class="table-header">
        <div class="header_row not_change_rem">
          <div
            class="header_col have_border"
            v-for="item in columnInfoList.slice(0, 3)"
            :key="item.prop"
            :style="{ 'min-width': item.width }"
          >
            <EllipsisPop
              :content="item.label"
              :popperClass='"warn_touch_list"'
              :width="'100%'"
            ></EllipsisPop>
          </div>
        </div>
        <div class="header_row">
          <div
            class="header_col"
            v-for="item in columnInfoList.slice(3)"
            :key="item.prop"
            :style="{ 'width': item.width + 'px' }"
          >
            <EllipsisPop
              :content="item.label"
              :popperClass='"warn_touch_list"'
              :width="'100%'"
            ></EllipsisPop>
          </div>
        </div>
      </div>

      <div class="table-body">
        <div class='table_scroll' ref="table" v-show="listData.length">
          <div class="table not_change_rem">
            <div class="body_row" v-for="(item, index) in listData" :key="index">
              <div
                class='body_col'
                :style="{ 'min-width': '44.44%', background: item.bgColor }"
              >
                <div class='trigger_trait' v-if='item.triggerLabelNameEn === "avatar_url"'>
                  <div class='value'>{{ item.triggerTrait + '/' }}</div>
                  <el-image
                    class="el-image"
                    :src="origin + item.triggerAttr"
                    :preview-src-list="[ origin + item.triggerAttr ]"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      <img :src='$themeColor("--person-default-pic")' alt=''>
                    </div>
                  </el-image>
                </div>
                <EllipsisPop
                  v-else
                  :content="item.triggerTrait"
                  :popperClass='"warn_touch_list"'
                  :width="'100%'"
                ></EllipsisPop>
              </div>

              <div
                class="body_col"
                v-for="col in columnInfoList.slice(0, 3).filter(nomal => !nomal.isSpecial)"
                :key="col.prop"
                :style="{ 'min-width': col.width, background: item.bgColor }"
              >
                <EllipsisPop
                  :content="
                    col.renderFun
                      ? col.renderFun(item) + ''
                      : item[col.prop]
                      ? item[col.prop] + ''
                      : '--'
                  "
                  :width="'100%'"
                  :popperClass='"warn_touch_list"'
                ></EllipsisPop>
              </div>

            </div>
          </div>

          <div class="table">
            <div class="body_row" v-for="(item, index) in listData" :key="index">
              <div
                class='body_col record'
                :style="{ 'width': 108 + 'px', background: item.bgColor }"
                @click='viewSource(item)'
              >
                <EllipsisPop
                  :content="item.triggerRecord"
                  :popperClass='"warn_touch_list"'
                  :width="'100%'"
                ></EllipsisPop>
              </div>

              <div
                class='body_col'
                :style="{ 'width': 70 + 'px', background: item.bgColor }"
                :class='[item.level]'
              >
                <EllipsisPop
                  :content="item.name"
                  :popperClass='"warn_touch_list"'
                  :width="'100%'"
                ></EllipsisPop>
              </div>

              <div
                class='body_col'
                :style="{ 'width': 44 + 'px', background: item.bgColor }"
              >
                <i class='iconfont icon-xiangqing' @click='toWarnControl(item)' title='详情'></i>
              </div>

            </div>
          </div>
        </div>
        <div class="no_data" v-show="!listData.length">暂无数据</div>
      </div>

    </div>
  </div>
  <div class='hide_state' v-show='!show' @click='handleShow(true)'>
    <i class='iconfont icon-a-zu5560'></i>
    <div class='hide_num' v-show='triggerNum'>{{ triggerNum }}</div>
  </div>
</div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { getCurrentTriggerList, handleTriggerRead, getFeatureOptionsApi } from '@/api/warnControl.js'
import { lightTheme, darkTheme } from "@/assets/js/variable"
import { mapState } from 'vuex'

const COLUMN = [
  { label: '触警特征', prop: 'triggerTrait', width: '44.44%', isSpecial: true },
  { label: '时间', prop: 'triggerTime', width: '37.77%' },
  { label: '地址', prop: 'triggerAddress', width: '17.79%' },
  { label: '触警数据', prop: 'triggerRecord', width: '108', isSpecial: true, noChange: true },
  { label: '布控名称', prop: 'name', width: '70', isSpecial: true, noChange: true },
  { label: '操作', prop: 'opt', width: '44', isSpecial: true, noChange: true },
]

export default {
  name: 'WarnMessage',
  components: {
    EllipsisPop
  },
  data () {
    return {
      show: true,
      columnInfoList: Object.freeze(COLUMN),
      listData: [], // 滚动列表的数据
      getNewTime: null,
      animationTime: null,
      addList: [],
      recordObj: {},
      canFastEnToCn: {},
      triggerNum: null
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme',
      userInfo: 'userInfo'
    }),
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    }),
    origin () {
      return window.location.origin + '/'
    }
  },
  watch: {
    theme: {
      handler (val) {
        let colorObj = val === 'light' ? lightTheme : darkTheme
        this.listData.forEach((item, index) => {
          if (index % 2 === 0) {
            item.bgColor = colorObj['--table-head-bg-color']
          } else {
            item.bgColor = colorObj['--warn-touch-list-bg']
          }
        })
      }
    },
    'addList.length': {
      handler (newVal) {
        if (newVal > 0) {
          if (!this.animationTime) {
            this.setListData()
          }
        } else {
          clearInterval(this.animationTime)
          this.animationTime = null
        }
      }
    },
    dataTypeList: {
      handler (newVal) {
        let result = newVal || []
        result.forEach(item => {
          this.recordObj[item.srcNameEn] = item.srcNameCn
        })
      },
      immediate: true
    },
    show: {
      handler (newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            let dom = document.getElementById('messageList')
            dom.className = 'warn_message_list to_right'
          })
        }
      },
    }
  },
  mounted () {
    this.bus.$on('hiddenWarnList', this.handleShow)
    this.getFeatureOptions()
    let localUserWarnShow = JSON.parse(localStorage.getItem('localUserWarnShow')) || {}
    if (localUserWarnShow[this.userInfo.username]) {
      if (localUserWarnShow[this.userInfo.username] === 'show') {
        this.show = true
      } else {
        this.show = false
      }
    }
    // 处理从客户端跳转到网页端
    if (window.location.search && window.location.search.startsWith('?token')) {
      let item = window.location.search.split('&')[1].split('=')[1]
      item = JSON.parse(decodeURIComponent(item))
      this.toWarnControl(item)
      // console.log(JSON.parse(decodeURI(item)))
      // let id = Number(window.location.search.split('&')[1].split('=')[1])
      // let params = {
      //   createTime: ''
      // }
      // if (this.listData.length && this.listData[0].createTime) {
      //   params.createTime = new Date(this.listData[0].createTime).getTime()
      // }
      // let tempList = []
      // getCurrentTriggerList(params).then(res => {
      //   tempList = res ? res.list : []
      // }).finally(() => {
      //   // console.log(tempList, id)
      //   tempList.forEach(item => {
      //     if (item.id === id) {
      //       this.toWarnControl(item)
      //     }
      //   })
      // })
    }
  },
  methods: {
    // ...mapMutations('Common', {
    //   setDataTypeFormList: 'setDataTypeFormList'
    // }),
    getFeatureOptions () {
      getFeatureOptionsApi().then(res => {
        let result = res || []
        result.forEach(item => {
          if (item.labelNameEn) this.canFastEnToCn[item.labelNameEn] = item.labelName || ''
        })
        // console.log(result)
        // this.bus.$emit('dataTypeList',result)
        // this.setDataTypeFormList(result)
      }).finally(() => {
        this.getList(true)
        this.getNewTime = setInterval(() => {
          this.getList()
        }, 30000)
        this.bus.$on('updateList', this.updateList)
      })
    },
    getList (isMount = false) {
      let params = {
        createTime: ''
      }
      if (this.listData.length && this.listData[0].createTime) {
        params.createTime = new Date(this.listData[0].createTime).getTime()
      }
      getCurrentTriggerList(params).then(res => {
        let result = res || {}
        let resultList = result.list || []
        this.triggerNum = result.untreatedCount ? result.untreatedCount > 99 ? '99+' : result.untreatedCount : null
        resultList.forEach(item => {
          item.triggerRecord = this.recordObj[item.triggerDataSource] || ''
          item.name = item.configVO.name || ''
          item.level = item.configVO.level || ''
          item.triggerTrait = item.triggerLabelNameEn === 'avatar_url' && this.canFastEnToCn[item.triggerLabelNameEn] ?
            this.canFastEnToCn[item.triggerLabelNameEn] :
            item.triggerLabelNameEn && this.canFastEnToCn[item.triggerLabelNameEn] ?
              `${this.canFastEnToCn[item.triggerLabelNameEn]}/${item.triggerAttr || ""}` :
              `${item.triggerAttr || ""}`
        })
        if (isMount) {
          this.listData = this.startDataBg(resultList)
        } else {
          if (result.updateListStatus) {
            this.addList = [...resultList, ...this.addList]
          }
        }
        let unReadList = resultList.filter(item => item.readStatus === 'unread').map(item => item.id)
        if (unReadList.length) {
          let params = new FormData()
          params.append('messageIdList', unReadList)
          handleTriggerRead(params)
        }
      })
    },
    handleShow (bool) {
      let localUserWarnShow = JSON.parse(localStorage.getItem('localUserWarnShow')) || {}
      if (bool) {
        this.$nextTick(() => {
          let dom = document.getElementById('messageList')
          dom.className = 'warn_message_list to_left'
          this.show = true
          localUserWarnShow[this.userInfo.username] = 'show'
          localStorage.setItem('localUserWarnShow', JSON.stringify(localUserWarnShow))
        })
      } else {
        this.show = false
        localUserWarnShow[this.userInfo.username] = 'hidden'
        localStorage.setItem('localUserWarnShow', JSON.stringify(localUserWarnShow))
      }
    },
    showTrigger () {
      if (this.$route.name === 'controlWarn') {
        this.bus.$emit('showAllTrigger', true)
      } else {
        this.$router.push({
          name: 'controlWarn',
          query: {
            showAllTrigger: true,
            warnType: '防控预警'
          }
        })
      }
    },
    updateList (id) {
      if (this.getNewTime) {
        clearInterval(this.getNewTime)
        this.getNewTime = null
      }
      this.addList = this.addList.filter(item => item.id !== id)
      this.listData = this.listData.filter(item => item.id !== id)
      this.getList()
      this.getNewTime = setInterval(() => {
        this.getList()
      }, 30000)
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
          item.bgColor = colorObj['--warn-touch-list-bg']
        }
      })
      return list
    },
    // 滚动定时器
    setListData () {
      this.animationTime = setInterval(() => {
        let colorObj = this.theme === 'light' ? lightTheme : darkTheme
        let bgColor = ''
        this.listData.length % 2 === 0 ? bgColor = colorObj['--warn-touch-list-bg'] : bgColor = colorObj['--table-head-bg-color']
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
    animationFun () {
      this.$nextTick(() => {
        this.$refs.table.style.animation = 'down 1s linear'
        setTimeout(() => {
          this.$refs.table.style.animation = ''
        }, 1000)
      })
    },
    toWarnControl (item) {
      if (this.$route.name === 'controlWarn') {
        this.bus.$emit('showTriggerInfo', item, true)
      } else {
        this.$router.push({
          name: 'controlWarn',
          query: {
            goalInfo: item.id,
            warnType: '防控预警'
          }
        })
      }
    },
    viewSource (item) {
      if (this.$route.name === 'controlWarn') {
        this.bus.$emit('showWarn', true, item, true)
      } else {
        this.$router.push({
          name: 'controlWarn',
          query: {
            warnType: '防控预警',
            viewSourceInfo: item
          }
        })
      }
    },
  },
  beforeDestroy () {
    if (this.animationTime) {
      clearInterval(this.animationTime)
      this.animationTime = null
    }
    if (this.getNewTime) {
      clearInterval(this.getNewTime)
      this.getNewTime = null
    }
    this.bus.$off('updateList', this.updateList)
    this.bus.$off('hiddenWarnList', this.handleShow)
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.warn_message_wrap {
  padding: 16px 10px;
  background: var(--warn-touch-list-bg);
  box-shadow: var(--warn-trigger-box-shadow);
  z-index: 9999;
  &.hide {
    border-radius: 50%;
  }
  .show_state {
    width: 672px;
    height: 232px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 6px;
      padding-right: 10px;
      font-size: 18px;
      line-height: 24px;
      color: var(--base-text-color-1);
      margin-bottom: 16px;
      .header_left {
        display: flex;
        align-items: center;
        position: relative;
        .trigger_num {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: -8px;
          left: 94px;
          width: auto;
          height: auto;
          padding: 0 4px;
          font-size: 12px;
          color: #FFFFFF;
          background-image: url("~@/assets/img/warn-trigger-info.png");
          background-size: 100% 100%;
        }
        img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
        .warn_all {
          color: var(--active-color);
          margin-left: 32px;
          cursor: pointer;
        }
      }
      .header-right {
        width: 16px;
        height: 16px;
        padding-top: 7px;
        cursor: pointer;
        &::after {
          display: block;
          content: '';
          width: 16px;
          height: 2px;
          background: var(--border-color-2);
        }
      }
    }
    .list_content {
      height: calc(100% - 40px);
      .table-header {
        display: flex;
        width: 100%;
        height: 32px;
        padding: 8px 0;
        background: var(--table-head-bg-color);
        border-bottom: 1px solid var(--table-row-border-bottom-color);
        .header_row {
          display: flex;
          height: 100%;
          .header_col {
            padding: 0 8px;
            border-right: 1px solid var(--table-row-border-bottom-color);
            color: var(--base-text-color-to-999999);
            font-size: 12px;
            line-height: 15px;
            /deep/.value_box {
              .value {
                color: var(--base-text-color-to-999999) !important;
              }
            }
            &:last-child {
              border-right: 0;
            }
            &.have_border {
              border-right: 1px solid var(--table-row-border-bottom-color);
            }
          }
          @media screen and (min-width: 1024px) and (max-width: 1365px)  {
            .header_col{
              line-height: 20px;
            }
            @-moz-document url-prefix(){
              .header_col{
                font-size: 16px !important;
              }
            }
          }
        }
        .not_change_rem {
          width: calc(100% - 222px);
        }
      }

      .table-body {
        display: flex;
        width: 100%;
        height: 155px;
        overflow-y: hidden;
        color: var(--base-text-color-1);
        .no_data {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: var(--base-text-color-to-999999);
          font-size: 12px;
        }
        .table_scroll {
          display: flex;
          width: 100%;
          transform: translateY(-31px);
          animation: down 1s linear;
          animation-fill-mode: forwards;
        }
        .table {
          //width: 100%;
          //transform: translateY(-31px);
          //animation: down 1s linear;
          //animation-fill-mode: forwards;
          .body_row {
            height: 31px;
            display: flex;
            //padding: 14px 0;
            //border-bottom: 1px solid var(--base-text-color-to-999999);
            &:hover {
              .body_col {
                background: rgba(64, 73, 102, 0.4) !important;
              }
            }
            .body_col {
              padding: 8px 8px;
              color: var(--base-text-color-1);
              font-size: 12px;
              line-height: 14px;
              border-right: 1px solid transparent;
              border-bottom: 1px solid var(--table-row-border-bottom-color);
              .icon-xiangqing {
                font-size: 12px;
                color: var(--base-text-color-to-999999);
                cursor: pointer;
              }
              &:last-child {
                border-right: 0;
              }
              &.record {
                cursor: pointer;
                /deep/.value {
                  color: var(--active-color);
                }
              }
              &.general {
                /deep/.value {
                  color: #F8BC3C;
                }
              }
              &.normal {
                /deep/.value {
                  color: #62ADF4;
                }
              }
              &.serious {
                /deep/.value {
                  color: #DD3F48;
                }
              }
            }
            @media screen and (max-width: 1500px) {
              .body_col {
                line-height: 18px;
              }
              @-moz-document url-prefix(){
              .body_col{
                font-size: 14px !important;
              }
            }
            }
          }
        }
        .not_change_rem {
          width: calc(100% - 222px);
        }
      }
      @keyframes down {
        from {
          transform: translateY(-32px);
        }
        to {
          transform: translateY(0px);
        }
      }
    }
  }
  .hide_state {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 6px;
    font-size: 18px;
    line-height: 24px;
    color: var(--base-text-color-1);
    cursor: pointer;
    .icon-a-zu5560 {
      font-size: 30px;
      line-height: 30px;
      color: var(--base-text-color-to-666666);
    }
    .hide_num {
      position: absolute;
      top: -4px;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #FF106E;
      font-size: 12px;
    }
    /*&::after {
      display: block;
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid var(--border-color-input);
      margin-left: 20px;
    }*/
  }
}
.trigger_trait {
  display: flex;
  align-items: center;
  /deep/.el-image {
    height: 14px;
    margin-left: 4px;
    .image-slot {
      height: 14px;
    }
    img {
      width: 14px;
      height: 14px;
    }
  }
}
@media screen and (min-width: 1280px) and (max-width: 1360px) {
  .show_state {
    height: 250px !important;
  }
  .table-header {
    height: 35px !important;
  }
  .table-body {
    height: 170px !important;
  }
  .body_row {
    height: 34px !important;
  }
}
</style>
