<template>
  <div class="progress-wrapper">
    <div class="progress-bar" :style="`${colorAll}`">
      <div class="progress" :style="`${colorAdd}${progressWidth}`"></div>
    </div>
    <div class="progress-cate">
      <div class="cate-box">
        <span class="cate-all square" :style="colorAdd"></span>
        <span class="cate-text">{{ cates[0] }} </span>
        <span>{{ datas[0] }} </span>
      </div>
      <div class="cate-box">
        <span class="cate-add square" :style="colorAll"></span>
        <span class="cate-text">{{ cates[1] }} </span>
        <span>{{ datas[1] }} </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      required: true
    },
    colors: {
      type: Array,
      required: true
    },
    cates: {
      type: Array,
      required: true
    }
  },
  computed: {
    colorAll () {
      return `background-color: ${this.colors[0]};`
    },
    colorAdd () {
      return `background-color: ${this.colors[1]};`
    },
    progressWidth () {
      return (
        'width:' +
        parseFloat((this.datas[0] - this.datas[1]) / this.datas[0]).toFixed(2) * 100 +
        '%'
      )
    }
  }
}
</script>

<style lang="less" scoped>
.progress-wrapper {
  padding: 0 28px;
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: limegreen;
    border-radius: 3px;
    .progress {
      // width: 50%;
      height: 100%;
      /* 内层背景色即进度达到的颜色 */
      background-color: #e46a70;
      border-radius: 3px;
    }
  }
  .progress-cate {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    .square {
      display: inline-block;
      width: 10px;
      height: 10px;
    }
    .cate-text {
      margin-left: 4px;
      margin-right: 10px;
    }
  }
}
</style>
