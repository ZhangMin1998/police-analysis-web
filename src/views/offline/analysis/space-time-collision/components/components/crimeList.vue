<template>
  <div class="case" :style="`height:${screenHeight - 440}px;`">
    <div
      :class="`list ${curIdx == index ? 'isActive' : ''}`"
      @click.prevent.stop="clickCrime(item, index)"
      v-for="(item, index) in list"
      :key="item.id"
      :id="'idx' + index"
    >
      <div class="borbtm">
        <div class="dot">{{ index + 1 }}</div>
        <div class="case_content">
          <div class="be">
            <div class="time">{{ item.caseTime }}</div>
            <div class="opr">
              <div
                class="btn"
                v-for="(btnItem, btnIndex) in btnRender"
                :key="`${item.id}_${btnIndex}`"
                @click.stop.prevent="btnItem.btnEvent(item.id)"
              >
                <img
                  width="16"
                  height="16"
                  :src="require('@/assets/img/' + btnItem.icon + '.png')"
                  :alt="btnItem.alt"
                  :title="btnItem.alt"
                />
              </div>
            </div>
          </div>
          <div class="title">{{ item.caseName }}</div>
          <div class="be place">
            <div class="places">
              <div
                class="placeItem"
                v-for="deviceitem in item.deviceList"
                :key="deviceitem.deviceId"
              >
                {{ deviceitem.deviceName }}
              </div>
            </div>
            <div class="time_section">{{ item.startTime }}~{{ item.endTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    btnRender: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      curIdx: -1
    }
  },
  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    })
  },
  mounted () {
    this.bus.$on('scoll', index => {
      this.goAnchor('idx' + index)
      this.curIdx = index
    })
  },
  beforeDestroy () {
    this.bus.$off('scoll')
  },
  methods: {
    // 标签滚动
    goAnchor (selector) {
      if (!document.getElementById(selector)) return ''
      this.$el.querySelector('#' + selector).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'start' // 上边框与视窗顶部平齐。默认值
      })
    },
    clickCrime (item, index) {
      this.curIdx = index
      this.$emit('clickCrime', item)
    },
    removeIsActive () {
      this.curIdx = -1
    }
  }
}
</script>

<style lang="less" scoped>
.opr {
  display: flex;
}
.be {
  display: flex;
  justify-content: space-between;
}
.case {
  overflow: auto;
  .list {
    cursor: pointer;
    padding: 0 16px;
    padding-top: 16px;
    &:hover {
      // background-color: #3b4964;
      background-color: var(--car-right-chuangkou-hearder-bg);
      color: var(--base-text-color-1);
    }
    .borbtm {
      display: flex;
      padding-bottom: 16px;
      border-bottom: 2px solid #465369;
    }

    &.isActive {
      // background-color: #3b4964;
      background-color: var(--car-right-chuangkou-hearder-bg);
      color: var(--base-text-color-1);
    }
    .dot {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      background: #e64545;
      border: 2px solid rgba(255, 255, 255, 0.2);
      text-align: center;
      line-height: 19px;
      color: @font-color-3;
      font-size: 12px;
      box-sizing: border-box;
    }
    .case_content {
      flex: 1;
      font-size: 16px;
      color: var(--base-text-color-1);
      padding-top: 4px;
      .opr {
        div {
          margin-right: 8px;
          &:last-child {
            margin-right: 0px;
          }
        }
      }
      .title {
        line-height: 32px;
      }
      .place {
        color: var(--base-text-color-to-999999);
        font-size: 14px;
        line-height: 24px;
        .places {
          display: flex;
          flex-wrap: wrap;
          margin-right: 14px;
          word-wrap: break-word;
          width: 80%;
          .placeItem {
            margin-right: 14px;
          }
        }
      }
    }
  }
}
</style>
