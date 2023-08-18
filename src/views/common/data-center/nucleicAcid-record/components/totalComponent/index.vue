<template>
<div class='total_component_wrap'>
  <div class='box_wrap'>
    <div class='box_title'>昨日数据</div>
    <div class='box_content'>
      <div class='content_item content_one'>
        <div class='item'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='yesTAdd.num' :formatter='yesTAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ yesTAdd.unit }}</span>
          </div>
          <div class='tip'>昨日新增</div>
        </div>
        <div class='division'></div>
        <div class='item'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='yesTControlAdd.num' :formatter='yesTControlAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ yesTControlAdd.unit }}</span>
          </div>
          <div class='tip'>本地新增</div>
        </div>
        <div class='item item_one'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='yesTFromAdd.num' :formatter='yesTFromAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ yesTFromAdd.unit }}</span>
          </div>
          <div class='tip'>风险区新增</div>
        </div>
      </div>
      <div class='division'></div>
      <div class='content_item content_two'>
        <div class='item item_two'>
          <div class='num num_one'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='yesTFromPerson.num' :formatter='yesTFromPerson.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ yesTFromPerson.unit }}</span>
          </div>
          <div class='tip'>来自风险区人数</div>
        </div>
        <div class='item item_three'>
          <div class='num num_one'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='yesTTestPerson.num' :formatter='yesTTestPerson.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ yesTTestPerson.unit }}</span>
          </div>
          <div class='tip'>昨日检测人次</div>
        </div>
      </div>
    </div>
  </div>

  <div class='box_wrap'>
    <div class='box_title'>今日数据</div>
    <div class='box_content'>
      <div class='content_item content_one'>
        <div class='item'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='todAdd.num' :formatter='todAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ todAdd.unit }}</span>
          </div>
          <div class='tip'>今日新增</div>
        </div>
        <div class='division'></div>
        <div class='item'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='todControlAdd.num' :formatter='todControlAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ todControlAdd.unit }}</span>
          </div>
          <div class='tip'>本地新增</div>
        </div>
        <div class='item item_one'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='todFromAdd.num' :formatter='todFromAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ todFromAdd.unit }}</span>
          </div>
          <div class='tip'>风险区新增</div>
        </div>
      </div>
      <div class='division'></div>
      <div class='content_item content_two'>
        <div class='item item_two'>
          <div class='num num_one'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='todFromPerson.num' :formatter='todFromPerson.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ todFromPerson.unit }}</span>
          </div>
          <div class='tip'>来自风险区人数</div>
        </div>
        <div class='item item_three'>
          <div class='num num_one'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='todTestPerson.num' :formatter='todTestPerson.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ todTestPerson.unit }}</span>
          </div>
          <div class='tip'>今日检测人次</div>
        </div>
      </div>
    </div>
  </div>

  <div class='box_wrap'>
    <div class='box_title'>数据总量</div>
    <div class='box_content box_content_one'>
      <div class='content_item content_three'>
        <div class='item item_five'>
          <div class='num'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='allAdd.num' :formatter='allAdd.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ allAdd.unit }}</span>
          </div>
          <div class='tip'>累计新增</div>
        </div>
        <div class='item item_four'>
          <div class='num num_one'>
            <WAutoAddNumber ref='yesterdayRef' from='0' :to='allTestPerson.num' :formatter='allTestPerson.isLong ? cutOutNum : noDecimal'></WAutoAddNumber>
            <span>{{ allTestPerson.unit }}</span>
          </div>
          <div class='tip'>累计检测人次</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WAutoAddNumber from '@/components/VisualComponents/AutoAddNum'
import {
  getDataBoard,
  getNucleicTotalData,
  /*getTodayTotalApi,
  getYesterdayTotalApi,
  getTotalApi*/
} from '@/api/dataCenter'
import { mapState } from 'vuex'
export default {
  name: 'TotalComponent',
  components: {
    WAutoAddNumber
  },
  data () {
    return {
      yesTAdd: { num: 0, unit: '', isLong: true },
      yesTControlAdd: { num: 0, unit: '', isLong: true },
      yesTFromAdd: { num: 0, unit: '', isLong: true },
      yesTFromPerson: { num: 0, unit: '', isLong: true },
      yesTTestPerson: { num: 0, unit: '', isLong: true },

      todAdd: { num: 0, unit: '', isLong: true },
      todControlAdd: { num: 0, unit: '', isLong: true },
      todFromAdd: { num: 0, unit: '', isLong: true },
      todFromPerson: { num: 0, unit: '', isLong: true },
      todTestPerson: { num: 0, unit: '', isLong: true },
      allAdd: { num: 0, unit: '', isLong: true },
      allTestPerson: { num: 0, unit: '', isLong: true }
    }
  },
  computed: {
    ...mapState('User', {
      statStage: 'statStage'
    })
  },
  async mounted () {
    this.$emit('changeTotalDataLoad', true)
    await this.getData()
    await this.getTotalData()
  },
  methods: {
    getData () {
      getNucleicTotalData().then(res => {
        if (res.today) {
          this.addUnit(res.today.positive, 'todAdd')
          this.addUnit(res.today.isControl, 'todControlAdd')
          this.addUnit(res.today.fromEpidemic, 'todFromAdd')
          this.addUnit(res.today.fromEpidemicTotal, 'todFromPerson')
        }
        if (res.yesterday) {
          this.addUnit(res.yesterday.positive, 'yesTAdd')
          this.addUnit(res.yesterday.isControl, 'yesTControlAdd')
          this.addUnit(res.yesterday.fromEpidemic, 'yesTFromAdd')
          this.addUnit(res.yesterday.fromEpidemicTotal, 'yesTFromPerson')
        }
        if (res.total) {
          this.addUnit(res.total.positive, 'allAdd')
        }
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },
    /*getTodTotalData () {
      getTodayTotalApi({ dataType: 'epidemic_nucleate_type' }).then(res => {
        this.addUnit(res.hourStat, 'todTestPerson')
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    /*getYesTotalData () {
      getYesterdayTotalApi({ dataType: 'epidemic_nucleate_type' }).then(res => {
        this.addUnit(res, 'yesTTestPerson')
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    /*getAllTotalData () {
      getTotalApi({ dataType: 'epidemic_nucleate_type' }).then(res => {
        this.addUnit(res, 'allTestPerson')
        this.$emit('changeTotalDataLoad', false)
      }).catch(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },*/
    getTotalData () {
      getDataBoard({
        dataType: 'epidemic_nucleate',
        dataStage: this.statStage
      }).then(res => {
        let result = res || {}
        'todayTotal' in result && this.addUnit(result.todayTotal, 'todTestPerson')
        'yesterdayTotal' in result && this.addUnit(result.yesterdayTotal, 'yesTTestPerson')
        'total' in result && this.addUnit(result.total, 'allTestPerson')
      }).finally(() => {
        this.$emit('changeTotalDataLoad', false)
      })
    },

    addUnit (num, name) {
      let changeNum
      let unit = ''
      if (num) {
        changeNum = +num
        if (num.length >= 9) {
          changeNum = num / 100000000
          unit = '亿'
        } else if ((num + '').length >= 5) {
          changeNum = num / 10000
          unit = '万'
        } else {
          this[name]['isLong'] = false
        }
      } else {
        changeNum = 0
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
  }
}
</script>

<style lang='less' scoped>
.total_component_wrap {
  display: flex;
  margin-bottom: 24px;
  width: 100%;
  .box_wrap {
    box-sizing: border-box;
    background: var(--bg-color-2);
    margin-right: 1.33%;
    padding: 16px 0.89%;
    color: var(--base-text-color-to-999999);
    font-size: 16px;
    width: 39.9%;
    .box_title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .box_content {
      display: flex;
      align-items: center;
      padding: 0 14px;
      width: 100%;
      box-sizing: border-box;
      white-space: nowrap;
      .content_item {
        display: flex;
        align-items: center;
        .item {
          width: 32.2%;
          .num {
            display: flex;
            width: 100%;
            font-size: 20px;
            color: @font-color-4;
            font-weight: bold;
            margin-bottom: 8px;
            white-space: nowrap;
          }
          .num_one {
            color: var(--base-text-color-1);
          }
        }
        .division {
          width: 1px;
          height: 32px;
          background: rgba(101, 116, 148, .45);
          margin: 0 6.5%;
        }
        .item_one {
          width: 29.5%;
          margin-left: 6.5%;
        }
        .item_two {
          width: 50%;
          margin-right: 10.3%;
        }
        .item_three {
          width: 43%;
        }
        .item_four {
          width: 48.8%;
          margin-left: 11.5%;
        }
        .item_five {
          width: 42.8%;
        }
      }
      .content_one {
        width: 49.3%;
      }
      .content_two {
        width: 36%;
      }
      .content_three {
        width: 100%;
      }
      .division {
        width: 1px;
        height: 50px;
        background: rgba(101, 116, 148, .45);
        margin: 0 7.2%;
      }
    }
    .box_content_one {
      padding: 0 11.1%;
    }
  }
  .box_wrap:last-child {
    width: 17.6%;
    margin-right: 0;
  }
}
</style>
