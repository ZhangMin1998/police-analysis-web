<template>
  <div>
    <div class="person-info">
      <div class="person-info-header">
        <div>
          {{ dataObj.realName }}
        </div>
        <div class="person-info-header-type" v-show="dataObj.isHighFrequency">高频人员</div>
      </div>
      <div class="person-info-main">
        <div class="person-info-main-icon">
          <ElImage
            :imgSet="{
              src: dataObj.headPicUrl,
              width: 72,
              height: 96,
              errorSrc: errImg(),
              list: []
            }"
          ></ElImage>
        </div>
        <div class="person-info-main-card">
          <div class="person-info-main-card-id">
            <!-- {{ dataObj.idCardType }}/{{ dataObj.cerNumber }} -->
            <!--  -->
            <EllipsisPop
              :content="dataObj.idCardType + '/' + dataObj.cerNumber" :rowNum="2"
            ></EllipsisPop>
          </div>
          <div>
            入住频次：<span class="val">{{ dataObj.checkInFrequency }}</span>
          </div>
          <div>
            单日最高频次：<span class="val"> {{ dataObj.maxDailyFrequency }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="person-track">
      <div class="person-track-info">
        <div>{{ inAndOut.inTime1 }} {{ inAndOut.inTime2 ? ' — ' + inAndOut.inTime2 : '' }}</div>
        <div>
          {{ inAndOut.inAddress1 }} {{ inAndOut.inAddress2 ? ' — ' + inAndOut.inAddress2 : '' }}
        </div>
        <div :class="['arrow', { isHidden: !isTrack }]" @click="isTrack = !isTrack">
          <i class="el-icon-arrow-up"></i>
        </div>
      </div>

      <div :class="['person-track-main', { isHidden: !isTrack }]">
        <TimeLineItem
          v-for="(activity, index) in tracksList"
          :key="index"
          :timestamp="activity.date1"
          placement="left"
        >
          <div>地址信息{{ activity.address }}</div>
          <div v-for="(timeItem, timeIndex) in activity.timeList2" :key="timeIndex">
            {{ timeItem }}
          </div>
        </TimeLineItem>
      </div>
    </div>
  </div>
</template>

<script>
import ElImage from '@/components/BasicComponents/ElImage'
import TimeLineItem from '@/components/BasicComponents/CusTImelineItem'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
export default {
  components: {
    ElImage,
    TimeLineItem,
    EllipsisPop
  },
  props: {
    dataObj: { type: Object },
    inAndOut: { type: Object },
    tracksList: { type: Array }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    })
  },
  data () {
    return {
      reverse: true,
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ],

      isTrack: true
    }
  },
  methods:{
    errImg () {
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic-name']
    },
  }
}
</script>

<style lang="less" scoped>
.person-info {
  color: var(--base-text-color-1);
  margin-bottom: 16px;
  .person-info-header {
    display: flex;
    box-sizing: border-box;
    padding: 8px 16px;
    // color: #fff;
    color: var(--base-text-color-1);
    // background-color: rgba(135, 153, 191, 0.4);
    .person-info-header-type {
      padding: 4px 24px 4px 8px;
      margin-left: 40px;
      box-sizing: border-box;
      font-size: 14px;
      // background: linear-gradient(90deg, #f03f58 0%, rgba(227, 61, 86, 0.14) 100%);
    }
  }
  .person-info-main {
    display: flex;
    box-sizing: border-box;
    padding: 16px 12px;
    // background-color: rgba(66, 80, 106, 0.38);
    background-color: var(--car-right-chuangkou-bg);
    box-shadow: var(--box-shadow);
    .person-info-main-icon {
      margin-right: 8px;
    }
    .person-info-main-card {
      color: var(--base-text-color-to-999999);
      line-height: 28px;
      overflow: hidden;
      .person-info-main-card-id {
        color: var(--base-text-color-1);
        margin-bottom: 6px;
      }
      .val {
        color: var(--base-text-color-1);
      }
    }
  }
}

.person-track {
  height: calc(100vh - 420px);
  padding: 16px 0px;
  box-sizing: border-box;
  // background-color: rgba(66, 80, 106, 0.38);
  // overflow: auto;
  .person-track-info {
    position: relative;
    padding: 12px;
    margin-bottom: 8px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 24px;
    color: var(--base-text-color-1);
    // background-color: rgba(135, 153, 191, 0.2);
    background-color: var(--car-right-chuangkou-bg);
    box-shadow: var(--box-shadow);
    .arrow {
      position: absolute;
      right: 16px;
      bottom: 5px;
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
      &.isHidden {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); /* Opera */
      }
    }
  }
  .person-track-main {
    height: 80%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 26px;
    color: var(--base-text-color-1);
    // background-color: rgba(135, 153, 191, 0.2);
    background-color: var(--car-right-chuangkou-bg);
    box-shadow: var(--box-shadow);
    opacity: 1;
    transition: opacity 0.5s linear;
    &.isHidden {
      opacity: 0;
    }
  }
}
</style>>
