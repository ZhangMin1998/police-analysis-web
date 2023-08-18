<template>
  <div class="tab-nav">
    <ul class="device-list-nav">
      <li
        v-for="(item, index) in deviceList"
        :key="index"
        @click="toggle(index)"
        :title="item.title"
      >
        <img
          :src="
            require(`@/assets/img/icon-tab-big-${index + 1}${
              isShowDevice && !item.isGrey ? '' : '-g'
            }.png`)
          "
        />
      </li>
    </ul>
    <div class="bottom-site-box" style="cursor: pointer">
      <img
        class="bottom-site"
        :src="require('@/assets/img/icon-tab-big-11' + (isShowDevice ? '-g' : '') + '.png')"
        @click="toggle(-1)"
        alt="场所"
        title="场所"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      deviceList: [
        { type: 'wifi', isGrey: false, title: '公共场所上网审计' },
        { type: 'wifi', isGrey: false, title: '室外WIFI探针' },
        { type: 'wifi', isGrey: false, title: '室外侦码采集' },
        { type: 'wifi', isGrey: false, title: '人脸识别摄像头' },
        { type: 'wifi', isGrey: false, title: '人脸门禁' },
        { type: 'wifi', isGrey: false, title: '车牌识别摄像头' },
        { type: 'wifi', isGrey: false, title: '身份证阅读器' },
        { type: 'wifi', isGrey: false, title: '其他' }
        // { type: 'wifi', isGrey: false, title: '复合图标' },
      ]
    }
  },
  computed: {
    ...mapState('Map', {
      isShowDevice: 'isShowDevice'
    })
  },
  methods: {
    ...mapMutations('Map', {
      toggleDeviceIcon: 'toggleDeviceIcon',
      resetDeviceIcon: 'resetDeviceIcon'
    }),
    resetDeviceList () {
      this.deviceList = this.deviceList.map(i => {
        i.isGrey = false
        return i
      })
      this.resetDeviceIcon()
    },
    toggle (index) {
      if (index == -1) {
        // 场所
        this.$store.state.Map.isShowDevice = false
      } else {
        if (!this.isShowDevice) {
          this.$store.state.Map.isShowDevice = true
        } else {
          this.deviceList[index].isGrey = !this.deviceList[index].isGrey
          this.toggleDeviceIcon(index)
        }
      }
      this.bus.$emit('shiftSelect', index)
    }
  }
}
</script>

<style lang="less" scoped>
.tab-nav {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  .device-list-nav {
    display: flex;
    padding: 16px;
    background: rgba(31, 42, 63, 0.9);
    border-radius: 40px;
    & > li {
      background-size: 100% 100%;
      margin-right: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      & > img {
        width: 48px;
        height: 53px;
      }
    }
  }
  .bottom-site-box {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(31, 42, 63, 0.9);
    border-radius: 50%;
    margin-left: 16px;
    .bottom-site {
      width: 48px;
      height: 53px;
    }
  }
}
</style>
