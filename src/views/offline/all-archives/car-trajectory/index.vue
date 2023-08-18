<template>
  <div class="All">
    <div class="top_box">
      <div class='set'>
        <img :src='require("@/assets/img/title-header.png")' alt=''>
        <div>车辆轨迹</div>
      </div>
      <div class="back-box" @click.stop="$router.push({ name: 'carFile' })">
        <i class='iconfont icon-fanhui'></i>
        <span>返回</span>
      </div>
    </div>
    <div class="select_box">
      <TabsMapWithList
        :TabList="picArray"
        :activeName="activeChart"
        @clickTab="changeChart"
      ></TabsMapWithList>
    </div>
    <div>
      <CarTrail v-if="activeChart === 'map'" :activeChart='activeChart'></CarTrail>
      <CarTrailTable v-else></CarTrailTable>
    </div>
  </div>
</template>

<script>
import CarTrail from '@/views/offline/all-archives/car-trajectory/carTrail'
import CarTrailTable from '@/views/offline/all-archives/car-trajectory/carTrailTable'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
export default {
  name: 'All',
  components: {
    CarTrail,
    CarTrailTable,
    TabsMapWithList
  },
  computed: {
    picArray () {
      const picArray = [
        {
          label: '地图',
          value: 'map'
        },
        {
          label: '列表',
          value: 'list'
        }
      ]
      return picArray
    }
  },
  data () {
    return {
      activeChart: 'map',
    }
  },
  methods: {
    changeChart (item) {
      this.activeChart = item
    }
  }
}
</script>

<style lang="less" scoped>
.All{
  position: relative;
  .top_box {
    height: 60px;
    position: absolute !important;
    left: 0 !important;
    top: 0px !important;
    z-index: 999;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 24px 0 32px;
    .set {
      display: flex !important;
      color: var(--base-text-color-1);
      font-size: 18px;
      line-height: 24px;
      font-weight: bold;
      align-items: center;
      img {
        margin-right: 5px;
        width: 18px;
        height: 18px;
      }
    }
    .back-box {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 16px;
        color: var(--primary-menu-text-color);
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: var(--base-text-color-1);
      }
    }
  }
  .select_box{
    position:absolute;
    top:55px;
    right:24px;
    z-index:999;
  }
}
</style>

