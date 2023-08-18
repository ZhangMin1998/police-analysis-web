<template>
  <div class='recordsCenter'>
    <HeaderNav :isRecordsCenter='isRecordsCenter'></HeaderNav>
    <DataCenter v-if='isRecordsCenter'></DataCenter>
  </div>
</template>

<script>
import HeaderNav from './header-nav'
import DataCenter from '@/views/common/data-center/all/index'


export default {
  name: 'RecordsCenter',
  components: {
    HeaderNav,
    DataCenter
  },
  props: {
    isRecordsCenter: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='less' scoped>
.recordsCenter {
  background: var(--bg-color-1);
  width: 100%;
  box-sizing: border-box;
  // margin: 0 44px;
  // padding: 30px 28px;
  padding: 12px 22px 33px;
  min-height: calc(100vh - 124px);
  // border: 1px solid #1b8adb;
}
</style>
