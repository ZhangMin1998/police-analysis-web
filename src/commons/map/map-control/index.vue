<template>
  <div class="new-legend">
    <!-- 定位中心 -->
    <div class="locbox" @click="toLocation">
      <i class="el-icon-aim"></i>
    </div>
    <!-- <location-box /> -->
    <div class="set-zoom">
      <div>
        <img src="@/assets/img/icon-add-zoom.png" @click="addZoom" alt="" />
      </div>
      <div>
        <img src="@/assets/img/icon-reduce.png" @click="reduceZoom" alt="" />
      </div>
    </div>

    <div
      class="legend-wrapper"
      v-if="list && list.length > 0"
      @click="isShowLegend = !isShowLegend"
    >
      <div class="title-wrapper">
        <div class="title it">图示</div>
        <img
          width="24"
          height="24"
          :src="require('@/assets/img/' + (isShowLegend ? 'icon-grow.png' : 'icon-open.png'))"
        />
      </div>
      <div class="legend-list" v-show="isShowLegend">
        <div class="legend-list-item" v-for="(item, index) in list" :key="index">
          <div class="icon">
            <img :src="require(`@/assets/img/${item.url}`)" width="24" height="24" alt="" />
          </div>
          <div class="words">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
const { _isOl } = require('@/config/user.js')

export default {
  props: {
    list: {
      type: Array,
      defeault: () => []
    }
  },
  data () {
    return {
      isShowLegend: false
    }
  },

  computed: {
    ...mapState('User', {
      zoom: 'zoom',
      zooms: 'zooms'
    }),
    ...mapState('Ol', {
      map: 'oMap'
    })
  },
  watch: {
    map (val) {
      // console.log(val);
      if (!val) return
      if (!_isOl()) {
        // console.log(this.map.off);
        // 优化时注释了这部分代码，目前来看没有任何影响
        // this.map.off('moveend')
        this.offlineEvent()
      }
    }
  },
  beforeDestroy () {
    this.setZoom(this.zoom)
  },
  methods: {
    ...mapMutations('User', {
      setZoom: 'setZoom'
    }),
    toLocation () {
      if (_isOl()) {
        this.bus.$emit('handleCenter', this.$store.state.User.centrePos, 13)
      } else {
        this.bus.$emit('setViewCenter', {
          position: this.$store.state.User.centrePos,
          zoom: 14,
          isMark: false,
          isPos: false
        })
      }
    },
    addZoom () {
      if (this.zoom == this.zooms[1]) return
      this.setZoom(this.zoom + 1)
    },
    reduceZoom () {
      if (this.zoom == this.zooms[0]) return
      this.setZoom(this.zoom - 1)
    },
    offlineEvent () {
      // console.log('offlineEvent');
      this.map?.on('moveend', () => {
        const zoom = this.map?.getView().getZoom()
        // console.log(zoom);
        this.setZoom(zoom)
      })
    }
  }
}
</script>

<style scoped>
.new-legend {
  position: absolute;
  right: 24px;
  bottom: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.locbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  margin-bottom: 8px;
  /* line-height: 50px; */
  /* text-align: center; */
  font-size: 16px;
  cursor: pointer;
}
.locbox:hover {
  color: #438fdc;
}
.set-zoom {
  width: 26px;
  height: 56px;
  /* box-sizing: border-box; */
  /* padding: 16px; */
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
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
  /* width: 86px; */
  /* background: #202b3f; */
  background: var(--zuoxifenxi-right-top-zhanshifangshi-bg);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  opacity: 0.87;
  padding: 13px 12px 11px 16px;
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
  /* margin-left: 17px; */
  margin-right: 13px;
  /* color: #c0d0e7; */
  color: var(--base-text-color-1);
  font-weight: bold;
  font-size: 14px;
  position: relative;
}

.legend-list {
  margin-top: 12px;
}
.legend-list-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--base-text-color-to-999999);
  margin-bottom: 12px;
}
.legend-list-item .words {
  flex: 1 1 auto;
}
.legend-list-item:last-child {
  margin-bottom: 0;
}
.legend-list-item > div {
  margin-left: 10px;
  margin-top: 2px;
}
.legend-list-item .icon {
  width: 24px;
  height: 24px;
}
.legend-list-item .icon img {
  width: auto;
  height: auto;
  width: 24px;
  height: 24px;
}
.it:before {
  position: absolute;
  border-color: transparent transparent var(--base-text-color-to-999999);
  border-style: none solid solid;
  border-width: 0 6px 6px;
  content: '';
  display: block;
  height: 0;
  top: 5px;
  left: -25px;
  width: 24px;
  box-sizing: border-box;
  transform: rotate(90deg);
}
</style>
