<template>
  <div class="total_person_wrap">
    <div class="text">
      <div class="common-style">
        <div class="title">数据总量</div>
        <div class="total">
          <div class="tip_img">常住人口</div>
          <div class="total-data">
            <div class="num">
              <WAutoAddNumber
                ref="totalRef"
                from="0"
                :to="dataTotal.total.num"
                :formatter="dataTotal.total.isLong ? cutOutNum : noDecimal"
              ></WAutoAddNumber>
              <span>{{ dataTotal.total.unit }}</span>
            </div>
            <div class="tip">人口总数</div>
          </div>
          <div class="total-data">
            <div class="num">
              <WAutoAddNumber
                from="0"
                :to="dataTotal.familyTotal.num"
                :formatter="dataTotal.familyTotal.isLong ? cutOutNum : noDecimal"
              ></WAutoAddNumber>
              <span>{{ dataTotal.familyTotal.unit }}</span>
            </div>
            <div class="tip">户口总数</div>
          </div>
        </div>
      </div>
      <div class="common-style">
        <div class="title">城乡人口</div>
        <div class="total">
          <img :src="require(`@/assets/img/today-data-img.png`)" alt="" />
          <div class="total-data">
            <div class="num">
              <WAutoAddNumber
                ref="totalRef"
                from="0"
                :to="dataTotal.city.num"
                :formatter="dataTotal.city.isLong ? cutOutNum : noDecimal"
              ></WAutoAddNumber>
              <span>{{ dataTotal.city.unit }}</span>
            </div>
            <div class="tip">城镇人口</div>
          </div>
          <div class="total-data">
            <div class="num">
              <WAutoAddNumber
                from="0"
                :to="dataTotal.rural.num"
                :formatter="dataTotal.rural.isLong ? cutOutNum : noDecimal"
              ></WAutoAddNumber>
              <span>{{ dataTotal.rural.unit }}</span>
            </div>
            <div class="tip">乡村人口</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WAutoAddNumber from '@/components/VisualComponents/AutoAddNum'
export default {
  name: 'totalPerson',
  components: {
    WAutoAddNumber
  },
  props: {
    dataTotal: {
      type: Object,
      default: () => {
        return {
          total: {
            num: 0,
            unit: '人',
            isLong: true
          },
          familyTotal: {
            num: 0,
            unit: '户',
            isLong: true
          },
          rural: {
            num: 0,
            unit: '人',
            isLong: true
          },
          city: {
            num: 0,
            unit: '人',
            isLong: true
          }
        }
      }
    }
  },
  methods: {
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
.total_person_wrap {
  margin-bottom: 24px;
  .text {
    display: flex;
    .common-style {
      box-sizing: border-box;
      margin-right: 24px;
      background: var(--bg-color-2);
      flex: 1;
      padding: 16px 16px;
      color: #ffffff;
      .title {
        color: var(--base-text-color-to-999999);
        font-size: 16px;
        font-weight: bold;
      }
      .total {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 94%;
        margin-left: 6%;
        margin-top: -16px;
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
            color: #c0d0e7;
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--base-text-color-1);
          }
          .tip {
            font-size: 16px;
            color: var(--base-text-color-to-999999);
            color: var(--base-text-color-1);
          }
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.tip_img {
  width: 86px;
  height: 86px;
  background-image: url('~@/assets/img/records-total-bg.png');
  background-size: 100% 100%;
  font-size: 14px;
  line-height: 86px;
  text-align: center;
  color: #47d6dc;
}
</style>
