<template>
  <div class="event_detail">
    <header class="event_header">
      <div class="title">
        <span> <span class="strong">偷盗案纪要</span> 危害国家安全罪-背叛国家最</span>
        <img class="edit" src="@/assets/img/icon-edit.png" alt="" />
      </div>
      <img class="cancel" src="@/assets/img/icon-close.png" alt="" />
    </header>
    <main class="main_event">
      <div class="left_time">2003/03/13 12:15:25</div>
      <div class="center_line">
        <div class="circle"></div>
        <div class="line"></div>
      </div>
      <div class="right_event">
        <div><span>发生时间</span><span class="describe">2021/05/13-2021/05/14</span></div>
        <div><span>事件概述</span><span class="describe">2021/05/13-2021/05/14</span></div>
        <div><span>附件</span><span class="describe">谈话录音文件名 05:13 </span></div>
        <div><span>附件</span><span class="describe">谈话录音文件名 05:13 </span></div>
        <div><span>创建人</span><span class="describe">张三丰</span></div>
      </div>
    </main>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.event_detail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 5px 15px 15px 15px;
  border: 1px solid #6d727c;
  .event_header {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      flex: 1;
      vertical-align: middle;
      span {
        .strong {
          color: var(--base-text-color-1);
          margin-right: 15px;
        }
      }
      .edit {
        width: 20px;
        height: 20px;
        margin-left: 20px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    .cancel {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .main_event {
    display: flex;
    // min-height: 20px;
    justify-content: space-between;
    .left_time {
      width: 200px;
    }
    .center_line {
      width: 15px;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .circle {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #177ddc;
      }
      .line {
        width: 2px;
        height: 100%;
        background-color: #6d727c;
        // flex: 0 0 1;
      }
    }
    .right_event {
      flex: 1;
      background: rgba(248, 248, 248, 0.04);
      div{
        span:nth-child(1){
          width: 80px;
        }
        .describe{
          color: var(--base-text-color-1);
        }
      }
    }
  }
}
</style>
