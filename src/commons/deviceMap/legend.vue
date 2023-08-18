<template>
  <div>
    <div class="legend-wrapper">
      <div class="title it">图示</div>
      <div class="legend-list">
        <div class="legend-list-item" v-for="(item, index) in deviceList" :key="index">
          <img :src="require('@/assets/img/icon-' + (index + 1) + '.png')" alt="" />
          <div>{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      deviceList: [
        { type: 'wifi', text: '公共场所上网审计（带WIFI探针）' },
        { type: 'wifi', text: '公共场所上网审计（不带WIFI探针）' },
        { type: 'wifi', text: '室外WIFI探针' },
        { type: 'wifi', text: '室外侦码采集' },
        { type: 'wifi', text: '人脸识别摄像头' },
        { type: 'wifi', text: '人脸门禁' },
        { type: 'wifi', text: '车牌识别摄像头' },
        { type: 'wifi', text: '身份证阅读器' },
        { type: 'wifi', text: '其他' }
      ]
    }
  },
  props: {}
}
</script>

<style scoped>
.legend-wrapper {
  width: 208px;
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  position: absolute;
  right: 8px;
  bottom: 16px;
  z-index: 1;
  padding: 16px;
  padding-top: 10px;
  box-sizing: border-box;
}

.title {
  /* color: #c0d0e7; */
  color: var(--base-text-color-1);
  font-weight: bold;
  font-size: 14px;
}

.legend-list {
  margin-top: 10px;
}
.legend-list-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--base-text-color-to-999999);
  margin-bottom: 8px;
}
.legend-list-item:last-child {
  margin-bottom: 0;
}
.legend-list-item > div {
  margin-left: 8px;
  margin-top: 2px;
  /* text-align: center; */
}
.legend-list-item img {
  width: 32px;
  height: 32px;
}
.it:before {
  position: absolute;
  border-color: transparent transparent var(--base-text-color-to-999999);
  border-style: none solid solid;
  border-width: 0 6px 6px;
  content: '';
  display: block;
  height: 0;
  top: 161px;
  left: -11px;
  width: 24px;
  box-sizing: border-box;
  transform: rotate(90deg);
}
</style>
