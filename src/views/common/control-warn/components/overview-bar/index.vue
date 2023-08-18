<template>
<div class='overview_bar_wrap'>
  <div class='shrink_btn' @click='isShow = !isShow' :class='{ "is_hide": !isShow }'>
    <i v-show='isShow' class='iconfont icon-shouqi' title='折叠'></i>
<!--    <i v-show='!isShow' class='iconfont icon-shouqi hide_icon'></i>-->
    <div class='put_away' v-show='!isShow'>
      <div class='tip'>统计图表</div>
      <i class='iconfont icon-shouqi hide_icon' title='展开'></i>
    </div>
  </div>
  <div class='bar_content' v-show='isShow'>
    <WeekWarn></WeekWarn>
    <TodayWarn></TodayWarn>
    <ControlPandect></ControlPandect>
  </div>

</div>
</template>

<script>
import WeekWarn from './weekWarn.vue'
import TodayWarn from './todayWarn.vue'
import ControlPandect from './controlPandect.vue'
export default {
  name: 'OverviewBar',
  components: {
    WeekWarn,
    TodayWarn,
    ControlPandect
  },
  data () {
    return {
      isShow: true
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.overview_bar_wrap {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 20;
  .shrink_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: -34px;
    width: 34px;
    height: 48px;
    background: var(--bg-color-9);
    cursor: pointer;
    &.is_hide {
      right: -142px;
      width: auto;
      height: auto;
    }
    i {
      font-size: 24px;
      line-height: 24px;
      color: var(--base-text-color-to-666666);
    }
    .hide_icon {
      transform: rotate(180deg);
    }
    .put_away {
      display: flex;
      flex-wrap: nowrap;
      padding: 16px;
      .tip {
        font-size: 18px;
        line-height: 24px;
        margin-right: 16px;
        white-space: nowrap;
        color: var(--base-text-color-1);
      }
    }
  }
  @media screen and (min-width: 1365px){
    .bar_content {
      width: 380px;
      height: 624px;
      background: var(--bg-color-9);
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1365px){
    .bar_content {
      width: 500px;
      height: 821px;
      background: var(--bg-color-9);
    }
  }

}

</style>
