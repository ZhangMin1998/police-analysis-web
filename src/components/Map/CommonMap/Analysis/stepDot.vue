<template>
  <div class="analyse">
    <div v-for="(item, index) in list" :key="index" :class='["step_dot", `step_dot${item}`]'>
      <div class="step" :style="index == 0 ? 'padding-top: 16px;' : ''">
        <div class="topline" v-if="index != 0"></div>
        <div class="dot">{{ item }}</div>
        <div class="line"></div>
      </div>

      <div class="step_item">
        <div class="jiao"></div>
        <div class='item'>
          <slot :name="'step_content' + item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'AnalyseSteps',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.analyse {
  display: flex;
  flex-direction: column;
  height: 100%;
  .step_dot {
    display: flex;
    min-height: 62px;
    position: relative;
    margin-bottom: 16px;
    &:last-child .line {
      display: none;
    }
    .step_item {
      overflow: hidden;
      width: 100%;
      // box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.06);
      box-shadow: var(--box-shadow);
      box-sizing: border-box;
      position: relative;
      // background-color: #36445d;
      background-color: var(--bg-color-3);
      padding: 16px 0;
      color: var(--base-text-color-1);
      // color: red;
      font-size: 18px;
      .jiao {
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-right: 10px solid var(--bg-color-3);
        border-bottom: 10px solid transparent;
        position: absolute;
        top: 20px;
        left: -9px;
      }
      .item {
        height: 100%;
      }
    }
  }
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .dot {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #1890ff;
    text-align: center;
    line-height: 24px;
    color: @font-color-3;
    font-size: 14px;
    box-sizing: border-box;
  }
  .topline {
    margin-top: -16px;
    padding-top: 12px;
    margin-bottom: 8px;
    margin-right: 10px;
    width: 2px;
    background-color: #37455e;
    height: 12px;
  }
  .line {
    margin-right: 10px;
    width: 2px;
    background-color: #37455e;
    flex: 1 1 auto;
    margin-top: 8px;
  }
}
</style>
