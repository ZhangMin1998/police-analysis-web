<template>
  <div class="tab-nav">
    <ul class="device-list-nav">
      <li v-for="(item, index) in deviceList" :key="index" @click="toggle(index)">
        <img
          :src="
            require(`@/assets/img/${item.url}${isShowDevice && !item.isGrey ? '' : '-g'}.png`)
          "
          :title="item.text"
          :alt="item.text"
        />
      </li>
      <!-- <li
        class="MapSwitchType-li"
        v-for="(item, index) in typeList"
        :key="index + '_' + item.value"
        @click="handleClick(item.value)"
      >
        <img
          class="MapSwitchType-li-img"
          :src="require(`@/assets/img/${item.url}${checked.includes(item.value) ? '' : '-g'}.png`)"
          :title="item.text"
          :alt="item.text"
        />
      </li> -->
    </ul>
    <div style="cursor: pointer" v-show="showroom">
      <img
        :src="require('@/assets/img/icon-tab-room' + (isShowDevice ? '-grey' : '') + '.png')"
        @click="toggle(-1)"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    showroom: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      deviceList: []
    }
  },
  computed: {
    ...mapState('Map', {
      isShowDevice: 'isShowDevice',
    }),
    ...mapState('User', {
      theme: 'theme'
    })
  },
  watch: {
    theme: {
      handler (val) {
        if (val === 'light') {
          this.deviceList = [
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-1-light', text: '公共场所上网审计', value: 1 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-3-light', text: '室外WIFI探针', value: 3 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-4-light', text: '室外侦码采集', value: 4 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-5-light', text: '人脸识别摄像头', value: 5 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-6-light', text: '人脸门禁', value: 6 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-7-light', text: '车牌识别摄像头', value: 7 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-8-light', text: '身份证阅读器', value: 8 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-9-light', text: '其他', value: 9 },
          ]
        } else {
          this.deviceList = [
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-1', text: '公共场所上网审计', value: 1 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-3', text: '室外WIFI探针', value: 3 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-4', text: '室外侦码采集', value: 4 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-5', text: '人脸识别摄像头', value: 5 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-6', text: '人脸门禁', value: 6 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-7', text: '车牌识别摄像头', value: 7 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-8', text: '身份证阅读器', value: 8 },
            { type: 'wifi', isGrey: false, url: 'icon-tab-big-9', text: '其他', value: 9 },
          ]
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('Map', {
      toggleDeviceIcon: 'toggleDeviceIcon',
      resetDeviceIcon: 'resetDeviceIcon',
    }),
    resetDeviceList () {
      this.deviceList = this.deviceList.map(i => {
        i.isGrey = false
        return i
      })
      this.resetDeviceIcon()
    },
    toggle (index) {
      // console.log(index);
      if (index == -1) {
        this.$store.state.Map.isShowDevice = false
      } else {
        // 不显示Device
        if (!this.isShowDevice) {
          this.$store.state.Map.isShowDevice = true
          // 显示Device
        } else {
          this.deviceList[index].isGrey = !this.deviceList[index].isGrey
          this.toggleDeviceIcon(index)
        }
      }
      this.$emit('toggleDeviceType')
      this.bus.$emit('shiftSelect', index)
      // 关闭 信息窗体
      this.$store.state.Map.isCloseLable = true
      // 关闭 搜索窗体
      this.bus.$emit('closeBox')
    },
  },
}
</script>

<style scoped>
.tab-nav {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
}
ul {
  display: flex;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
}
ul li {
  /* background: url("@/assets/img/icon-bg.png") no-repeat; */
  background-size: 100% 100%;
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
ul li:last-child {
  margin-right: 0;
}
ul li img {
  width: 48px;
  height: 48px;
}
.tab-nav > div {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-left: 16px;
}
</style>
