<template>
  <div class="new-legend">
    <!-- 定位中心 -->
    <location-box />
    <div class="set-zoom">
      <div>
        <img src="@/assets/img/icon-add-zoom.png" @click="addZoom" alt="" />
      </div>
      <!-- <div class="zoom">{{ this.zoom }}</div> -->
      <div>
        <img src="@/assets/img/icon-reduce.png" @click="reduceZoom" alt="" />
      </div>
    </div>
    <div class="legend-wrapper">
      <div class="title-wrapper">
        <div class="title it">图示</div>
        <img
          width="24"
          height="24"
          :src="require('@/assets/img/' + (isShowLegend ? 'icon-grow.png' : 'icon-open.png'))"
          @click="isShowLegend = !isShowLegend"
        />
      </div>
      <div class="legend-list" v-show="isShowLegend">
        <div class="legend-list-item" v-for="(item, index) in deviceList" :key="index">
          <img :src="require('@/assets/img/icon-tab-small-' + (index + 1) + '.png')" alt="" />
          <div>{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationBox from '@/commons/com/locationMap'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    LocationBox
  },
  data () {
    return {
      isShowLegend: false,
      deviceList: [
        { type: 'wifi', text: '公共场所上网审计（带WIFI探针）' },
        { type: 'wifi', text: '公共场所上网审计（不带WIFI探针）' },
        { type: 'wifi', text: '室外WIFI探针' },
        { type: 'wifi', text: '室外侦码采集' },
        { type: 'wifi', text: '人脸识别摄像头' },
        { type: 'wifi', text: '人脸门禁' },
        { type: 'wifi', text: '车牌识别摄像头' },
        { type: 'wifi', text: '身份证阅读器' },
        { type: 'wifi', text: '场所' },
        { type: 'wifi', text: '其他' }
      ]
    }
  },
  computed: {
    ...mapState('Map', {
      zoom: 'zoom',
      zooms: 'zooms'
    })
  },
  methods: {
    ...mapMutations('Map', {
      setZoom: 'setZoom'
    }),
    addZoom () {
      if (this.zoom == this.zooms[1]) return
      this.setZoom(this.zoom + 1)
    },
    reduceZoom () {
      if (this.zoom == this.zooms[0]) return
      this.setZoom(this.zoom - 1)
    }
  }
}
</script>

<style scoped>
.new-legend {
  position: absolute;
  right: 8px;
  bottom: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.set-zoom {
  width: 58px;
  height: 100px;
  box-sizing: border-box;
  padding: 16px;
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.set-zoom img {
  cursor: pointer;
}
.zoom {
  font-size: 20px;
  color: var(--base-text-color-to-999999);
  text-align: center;
  padding: 5px 0;
  width: 32px;
  border-top: 2px solid #42506a;
  border-bottom: 2px solid #42506a;
  margin: 16px 0;
}
.legend-wrapper {
  width: 208px;
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  padding: 16px;
  padding-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-wrapper img {
  cursor: pointer;
}
.title {
  /* color: #C0D0E7; */
  color: var(--base-text-color-1);
  font-weight: bold;
  font-size: 14px;
}

.legend-list {
  margin-top: 30px;
}
.legend-list-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--base-text-color-to-999999);
  margin-bottom: 20px;
}
.legend-list-item:last-child {
  margin-bottom: 0;
}
.legend-list-item > div {
  margin-left: 16px;
  margin-top: 2px;
  /* text-align: center; */
}
/* .legend-list-item img {
  width: 24px;
  height: 24px;
} */
.it:before {
  position: absolute;
  border-color: transparent transparent var(--base-text-color-to-999999);
  border-style: none solid solid;
  border-width: 0 6px 6px;
  content: '';
  display: block;
  height: 0;
  top: 161px;
  left: -9px;
  width: 24px;
  box-sizing: border-box;
  transform: rotate(90deg);
}
</style>
