<template>
  <div class="Layout">
    <header ref="LayoutHeader">
      <layout-header></layout-header>
    </header>

    <main class="mainbox">
      <div class="panel">
        <router-view />
        <div class="panel-footer"></div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LayoutHeader from './LayoutHeader'

export default {
  name: 'Layout',
  components: {
    LayoutHeader
  },

  computed: {
    ...mapState('User', {
      mapLanLonList: 'mapLanLonList'
    })
  },

  watch: {
    mapLanLonList: {
      handler (val) {
        if (!val || val.length === 0) return
        this.$store.state.Map.roomDeviceList = []
        // 循环val 发送请求获取设备  经纬度为高德地图
        val.forEach(element => {
          const list = element.map(_c => {
            return {
              latitude: _c.lat,
              longitude: _c.lng
            }
          })
          this.getDeviceListByLocation(list)
        })
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    ...mapActions('Map', {
      getDeviceListByLocation: 'getDeviceListByLocation'
    })
  }
}
</script>

<style lang="less" scoped>
.Layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #161e31;
}
.mainbox {
  flex: 1;
  padding: 8px, 24px, 24px, 24px;
  box-sizing: border-box;
}
.mainbox .panel {
  position: relative;
  height: 100%;
}

.mainbox .panel::before {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 16px;
  height: 16px;
  border-left: 3px solid rgba(192, 208, 231, 0.7);
  border-top: 3px solid rgba(192, 208, 231, 0.7);
  content: '';
}

.mainbox .panel::after {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 16px;
  height: 16px;
  border-right: 3px solid rgba(192, 208, 231, 0.7);
  border-top: 3px solid rgba(192, 208, 231, 0.7);
  content: '';
}
.mainbox .panel .panel-footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
.mainbox .panel .panel-footer::before {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 16px;
  height: 16px;
  border-right: 3px solid rgba(192, 208, 231, 0.7);
  border-bottom: 3px solid rgba(192, 208, 231, 0.7);
  content: '';
}
.mainbox .panel .panel-footer::after {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 16px;
  height: 16px;
  border-left: 3px solid rgba(192, 208, 231, 0.7);
  border-bottom: 3px solid rgba(192, 208, 231, 0.7);
  content: '';
}
</style>
