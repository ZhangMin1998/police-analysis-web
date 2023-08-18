<template>
  <div class="CusScreenBox_bg">
    <div class="CusScreenBox_title">
      <header>{{ title }}</header>
    </div>
    <div class="boxfoot"></div>

    <div><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: 'CusScreenBox',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.CusScreenBox_bg {
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 0 0.2rem 0.4rem 0.15rem;
  background: var(--table-head-bg-color) url('~@/assets/BScreen/line.png');
  background-size: 100% auto;
  position: relative;
  margin-bottom: 0.15rem;
  z-index: 10;
}
.CusScreenBox_bg:before,
.boxfoot:before {
  border-left: 2px solid #02a6b5;
  left: 0;
}
.CusScreenBox_bg:before,
.CusScreenBox_bg:after {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  content: '';
  border-top: 2px solid #02a6b5;
  top: 0;
}
.CusScreenBox_bg:after,
.boxfoot:after {
  border-right: 2px solid #02a6b5;
  right: 0;
}
.boxfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}
.boxfoot:before,
.boxfoot:after {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  content: '';
  border-bottom: 2px solid #02a6b5;
  bottom: 0;
}
.CusScreenBox_title {
  font-size: 1.1rem;
  color: #fff;
  text-align: center;
  line-height: 3rem;
  letter-spacing: 0.15rem;
}
</style>
