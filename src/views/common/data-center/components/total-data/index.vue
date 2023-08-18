<template>
  <div class='total-data-wrap'>
    <div class='text'>
      <div class='common-style'>
        <div class='title'>数据总量</div>
        <div class='total' v-if="showType === 'text'">
          <div class='tip_img'>
            <div class='tip_img_content' v-html="tipImgTextContent"></div>
          </div>
<!--          <img :src='require(`@/assets/img/`+ dataType + `.png`)' alt=''>-->
          <div class='total-data'>
            <div class='num'>
              <WAutoAddNumber ref='totalRef' from='0' :to='total.num' :formatter='total.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
              <span>{{ total.unit }}</span>
            </div>
            <div class='tip'>数据总量</div>
          </div>
          <div class='total-data'>
            <div class='num'>
              <WAutoAddNumber from='0' :to='yesterdayTotal.num' :formatter='yesterdayTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
              <span>{{ yesterdayTotal.unit }}</span>
            </div>
            <div class='tip'>昨日新增</div>
          </div>
        </div>
        <div class='chart' v-else>
          <div class='all'>
            <div class='item-wrap'>
              <div class='num'>
                <WAutoAddNumber ref='totalRef' from='0' :to='total.num' :formatter='total.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
                <span>{{ total.unit }}</span>
              </div>
              <div class='all-tip'>数据总量</div>
              <img :src='require(`@/assets/img/all-data-img-1.png`)' alt=''>
            </div>
            <div class='item-wrap'>
              <div class='num'>
                <WAutoAddNumber from='0' :to='yesterdayTotal.num' :formatter='yesterdayTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
                <span>{{ yesterdayTotal.unit }}</span>
              </div>
              <div class='all-tip'>昨日总量</div>
              <img :src='require(`@/assets/img/all-data-img.png`)' alt=''>
            </div>
          </div>
        </div>
      </div>
      <div class='common-style today-data'>
        <div class='title' :class='["title", showType === "chart" ? "chart_title" : ""]'>今日新增数据</div>
        <div class='total' v-if="showType === 'text'">
          <img :src='require(`@/assets/img/today-data-img.png`)' alt=''>
          <div class='total-data'>
            <div class='num'>
              <WAutoAddNumber ref='todayRef' from='0' :to='todayTotal.num' :formatter='todayTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
              <span>{{ todayTotal.unit }}</span>
            </div>
            <div class='tip'>今日新增</div>
          </div>
          <div class='total-data'>
            <div class='num'>
              <WAutoAddNumber ref='currentRef' from='0' :to='currentHourTotal.num' :formatter='currentHourTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
              <span>{{ currentHourTotal.unit }}</span>
            </div>
            <div class='tip'>{{ `${ nowHour }时~${ nowHour + 1 }时` }}</div>
          </div>
        </div>
        <div class='chart' v-else>
          <div class='today'>
            <WProgress
              class='today-add'
              :percentage='todayPercentage'
              :animationName='"todayAdd" + nowHour'
              :innerColor='"#45A2FF"'
            >
              <div class='tip' slot='tipInfo'>
                <div class='tip-name'>今日新增</div>
                <div class='num'>
                  <WAutoAddNumber ref='todayRef' from='0' :to='todayTotal.num' :formatter='todayTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
                  <span>{{ todayTotal.unit }}</span>
                </div>
              </div>
            </WProgress>
            <WProgress
              :percentage='currentPercentage'
              :animationName='"realTime" + nowHour'
              :innerColor='"#0075FF"'
            >
              <div class='tip' slot='tipInfo'>
                <div class='tip-name'>{{ `${ nowHour }时~${ nowHour + 1 }时` }}</div>
                <div class='num'>
                  <WAutoAddNumber ref='currentRef' from='0' :to='currentHourTotal.num' :formatter='currentHourTotal.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
                  <span>{{ currentHourTotal.unit }}</span>
                </div>
              </div>
            </WProgress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WProgress from '@/components/VisualComponents/ProgressWithAnimation'
import WAutoAddNumber from '@/components/VisualComponents/AutoAddNum'
import {
  getDataBoard,

  /*getTodayTotalApi,
  getCurrentTotalApi,
  getYesterdayTotalApi,
  getTotalApi*/
} from '@/api/dataCenter'
import { mapState } from 'vuex'

export default {
  name: 'totalData',
  components: {
    WProgress,
    WAutoAddNumber
  },
  props: {
    // 数据统计展示的方式，chart：图标展示；text：文字
    showType: {
      type: String,
      default: 'chart'
    },
    dataType: {
      type: String,
      default: ''
    },
    tipImgContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      time: null,
      nowHour: new Date().getHours(),
      todayTotal: {
        num: 0,
        unit: '条',
        isLong: true
      }, // 今日新增数据
      currentHourTotal: {
        num: 0,
        unit: '条',
        isLong: true
      }, // 当前小时内新增数据
      yesterdayTotal: {
        num: 0,
        unit: '条',
        isLong: true
      }, // 昨日新增数据
      total: {
        num: 0,
        unit: '条',
        isLong: true
      }, // 数据总量
      todayPercentage: 0, // 今日数据百分比          暂时先写死，等后台
      currentPercentage: 0, // 当前小时数据百分比      暂时先写死，等后台
      tipImgTextContent:''
    }
  },
  computed: {
    ...mapState('User', {
      statStage: 'statStage'
    })
  },
  created () {
    this.handelTextShow()
    this.time = setInterval(() => {
      this.nowHour = new Date().getHours()
    }, 1000)
  },
  mounted () {
    this.$emit('changeTotalDataLoad', true)
    this.getTotalData()
  },
  watch: {
    nowHour: {
      handler () {
        // 时间改变，调用接口，获取新的小时数据
        if (document.styleSheets[0].rules.length > 1) {
          for (let i = 0; i < document.styleSheets[0].rules.length - 1; i++) {
            document.styleSheets[0].deleteRule(i)
          }
        }
        this.getTotalData(true)
      }
    },
    /*dataType: {
      async handler (newVal) {
        if (newVal) {
          this.$emit('changeTotalDataLoad', true)
          this.reSetData()
          await this.getTotal()
          await this.getYesterdayTotal()
          await this.getTodayTotal()
          await this.getCurrentTotal()
        }
      },
      immediate: true
    }*/
  },
  methods: {
    handelTextShow (){
      var regExpression = /[\u4E00-\u9FA5]/
      let isChinese = regExpression.test(this.tipImgContent)
      if(isChinese && this.tipImgContent.length === 4 && window.screen.width < 1600){
        const a  = this.tipImgContent.substr(0,2)
        const b = this.tipImgContent.substr(2,this.tipImgContent.length + 1)
        this.tipImgTextContent = a + '<br />' + b
      }else{
        this.tipImgTextContent = this.tipImgContent
      }
    },
    getTotalData (isUpCurrent = false) {
      getDataBoard({
        dataType: this.dataType,
        dataStage: this.statStage
      }).then(res => {
        let result = res || {}
        if (isUpCurrent) {
          'currentHourTotal' in result && this.addUnit(result.currentHourTotal + '', 'currentHourTotal')
        } else {
          'currentHourTotal' in result && this.addUnit(result.currentHourTotal + '', 'currentHourTotal')
          'todayTotal' in result && this.addUnit(result.todayTotal + '', 'todayTotal')
          'total' in result && this.addUnit(result.total + '', 'total')
          'yesterdayTotal' in result && this.addUnit(result.yesterdayTotal + '', 'yesterdayTotal')
        }
        let todayPercent = Math.trunc((result.todayTotal / result.lastWeekTodayTotal) * 100)
        let currentPercent = Math.trunc((result.currentHourTotal / result.lastWeekCurrentHourTotal) * 100)
        this.todayPercentage = todayPercent >= 100 ? 99 : todayPercent
        this.currentPercentage = currentPercent >= 100 ? 99 : currentPercent
      }).finally(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },

    // 获取今日数据总量
    /*reSetData () {
      this.todayTotal = {
        num: 0,
        unit: '条',
        isLong: true
      }
      this.currentHourTotal = {
        num: 0,
        unit: '条',
        isLong: true
      }
      this.yesterdayTotal = {
        num: 0,
        unit: '条',
        isLong: true
      }
      this.total = {
        num: 0,
        unit: '条',
        isLong: true
      }
      this.todayPercentage = 0
      this.currentPercentage = 0
    },*/
    /*getTodayTotal () {
      getTodayTotalApi({ dataType: this.dataType }).then(res => {
        // this.todayTotal = this.addUnit(res.hourStat + '')
        this.addUnit(res.hourStat + '', 'todayTotal')
        this.todayPercentage = res.percent * 100
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    // 获取当前小时内的数据量
    /*getCurrentTotal () {
      getCurrentTotalApi({ dataType: this.dataType }).then(res => {
        // this.currentHourTotal = this.addUnit(res.hourStat + '')
        this.addUnit(res.hourStat + '', 'currentHourTotal')
        this.currentPercentage = res.percent * 100
        this.$emit('changeTotalDataLoad', false)
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    // 获取昨日新增数据总量
    /*getYesterdayTotal () {
      getYesterdayTotalApi({ dataType: this.dataType }).then(res => {
        // this.yesterdayTotal = this.addUnit(res + '')
        this.addUnit(res ? res + '' : '0', 'yesterdayTotal')
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    // 获取总数据量
    /*getTotal () {
      getTotalApi({ dataType: this.dataType }).then(res => {
        // this.total = this.addUnit(res + '')
        this.addUnit(res ? res + '' : '0', 'total')
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    addUnit (num, name) {
      let changeNum = +num
      let unit = '条'
      if (num.length >= 13) {
        changeNum = num / 1000000000000
        unit = '万亿条'
      } else if (num.length >= 9) {
        changeNum = num / 100000000
        unit = '亿条'
      } else if (num.length >= 5) {
        changeNum = num / 10000
        unit = '万条'
      } else {
        this[name]['isLong'] = false
      }
      this[name]['num'] = changeNum
      this[name]['unit'] = unit
    },
    cutOutNum (num) {
      let changeNum = (num + '').split('.')
      let decimal = ''
      if (changeNum[1]) {
        decimal = changeNum[1].slice(0, 2) === '00' ? '' : changeNum[1].slice(1, 2) === '0' ? '.' + changeNum[1].slice(0, 1) : '.' + changeNum[1].slice(0, 2)
      }
      return changeNum[0] + decimal
    },
    noDecimal (num) {
      let changeNum = (num + '').split('.')
      return changeNum[0]
    }
  },
  beforeDestroy () {
    if (!this.time) return
    clearInterval(this.time)
  }
}
</script>

<style lang='less' scoped>
.total-data-wrap {
  margin-bottom: 24px;
  .text {
    display: flex;
    .common-style {
      box-sizing: border-box;
      margin-right: 24px;
      background: var(--bg-color-2);
      flex: 1;
      padding: 16px 16px;
      color: @font-color-3;
      .title {
        color: var(--base-text-color-to-999999);
        font-size: 16px;
        font-weight: bold;
      }
      .chart_title {
        margin-bottom: 20px;
      }
      .total {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 94%;
        margin-left: 6%;
        margin-top: -16px;
        .tip_img {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 86px;
          height: 86px;
          background-image: url("~@/assets/img/records-total-bg.png");
          background-size: 100% 100%;
          font-size: 14px;
          line-height: 20px;
          color: #47D6DC;
          .tip_img_content {
            margin: 0 14px;
          }
        }
        /*padding: 16px 0px 16px;*/
        img {
          width: 86px;
          height: 86px;
        }
        .total-data {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-wrap: nowrap;
          width: 130px;
          .num {
            display: flex;
            font-size: 20px;
            color: var(--base-text-color-1);
            font-weight: bold;
            margin-bottom: 8px;
          }
          .tip {
            font-size: 16px;
            color: var(--base-text-color-to-999999);
          }
        }
      }
      .chart {
        padding: 0 8px;
        .all {
          display: flex;
          justify-content: space-evenly;
          margin-bottom: 2px;
          margin-top: -16px;
          .item-wrap {
            text-align: center;
            .num {
              display: flex;
              justify-content: center;
              font-size: 20px;
              color: var(--base-text-color-1);
              font-weight: bold;
              margin-bottom: 4px;
              width: 130px;
            }
            .all-tip {
              font-size: 16px;
              color: var(--base-text-color-to-999999);
              margin-bottom: 8px;
            }
            img {
              width: 87px;
              height: 24px;
              margin-bottom: 2px;
            }
          }
        }
        .today {
          display: flex;
          margin-bottom: 4px;
          .today-add {
            margin-right: 40px;
          }
          .tip {
            display: flex;
            font-size: 16px;
            .tip-name {
              color: var(--base-text-color-to-999999);
              width: 96px;
              white-space: nowrap;
            }
            .num {
              display: flex;
              color: var(--base-text-color-1);
            }
          }
        }
      }
    }
    .chart_style {
      padding-bottom: 16px;
      padding-top: 24px;
    }
    .today-data {
      margin-right: 0;
    }
  }
}
</style>
