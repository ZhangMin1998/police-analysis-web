<template>
  <div class="graph-box">
    <div class="graph-box-main">
      <canvas :id="id" width="200" height="153"></canvas>
    </div>
    <div class="graph-box-aside">
      <div class="text-aside" :style="`border-color:${colors[0]}`">
        <span>{{ countRate.onlineTotal }}</span>
        <span>在线</span>
      </div>
      <div class="text-aside" :style="`border-color:${colors[1]}`">
        <span>{{ countRate.total }}</span>
        <span>总数</span>
      </div>
    </div>
  </div>
</template>

<script>
import usePieChart from '../hooks/usePieChart'

export default {
  props: {
    id: {
      type: String,
      default: 'main-guage'
    },
    countRate: {
      type: Object
    },
    colors: {
      type: Array
    }
  },
  setup (props) {
    usePieChart(props.id, props.countRate)
  }
}
</script>

<style lang="less" scoped>
.graph-box {
  display: flex;
  &-main {
    flex-grow: 2;
    height: 100%;
  }
  &-aside {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .text-aside {
      border-left: 2px solid red;
      padding-left: 12px;
      & > span {
        font-size: 14px;
        display: block;
      }
    }
  }
}
</style>