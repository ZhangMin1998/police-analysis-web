<template>
  <div class="event">
    <div class="event_container" v-if="!showpop">
      <div class="every_event" @click="showDetail">
        <header class="event_title">
          <div class="title">偷盗案纪要</div>
          <img class="img" src="@/assets/img/icon-drop.png" alt="" />
        </header>
        <div class="event_type"><span>事件类型:</span><span>盗窃</span></div>
        <div class="event_type"><span>录入时间:</span><span>2019/07/15 12:59:00</span></div>
      </div>
      <div class="every_event special">
        <img class="add_img" src="@/assets/img/icon-add-zoom.png" alt="">
      </div>
      <div class="every_event transparent">
      </div>
      <div class="every_event transparent">
      </div>
      <div class="every_event transparent">
      </div>
      <div class="every_event transparent">
      </div>
    </div>
    <!-- 详情弹框 -->
    <EventDetail v-if="showpop"/>
  </div>
</template>


<script>
import EventDetail from './EventDetail'
export default {
  components:{
    EventDetail
  },
  data (){
    return {
      showpop:false
    }
  },
  methods:{
    showDetail (){
      this.showpop = true
    }
  }

}
</script>

<style lang="less" scoped>
.event {
  position: relative;
  height: calc(100vh - 233px);
  .event_container {
    height: calc(100vh - 233px);
    background: rgba(248, 248, 248, 0.04);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 0 15px;
    .every_event {
      border: 1px solid #6d727c;
      width: 19%;
      box-sizing: border-box;
      cursor: pointer;
      margin-top: 10px;
      height: 120px;
      padding: 15px;
      background-color: #323a4e;
      .event_title {
        display: flex;
        justify-content: space-between;
        .title {
          color: var(--base-text-color-1);
        }
        .img {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
      .event_type {
        margin-top: 13px;
        height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span:nth-child(2) {
          color: var(--base-text-color-1);
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .special{
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .add_img{
          width: 40px;
          height: 40px;
        }
    }
    .transparent{
      border: transparent;
      background-color: transparent;
    }
  }

}
</style>
