<template>
  <div>
    <div
      :class="`yuan  ${probetimes > 1000 ? 'l' : probetimes > 100 ? 'm' : 's'}`"
      @mouseenter="mouseenter(index)"
      @mouseleave="mouseLeave"
      @click="handleClickMarker"
    >
      {{ probetimes }}
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    position: {
      type: Array,
      validator: value => value.length === 2,
    },
    id: {
      type: [String, Number],
    },
    probetimes: {
      type: [String, Number],
    },
    index: {
      type: [String, Number],
    },

    NormalMarkitem: {
      type: Object,
      default: () => {},
    },
  },

  inject: ['addOverlay'],

  data () {
    return {
      overlay: {},
      curHover: -1,
    }
  },

  mounted () {
    this.createMaker()
  },

  methods: {
    mouseenter (idx) {
      this.curHover = idx
    },
    handleClickMarker () {
      this.$emit('clickMarker', this.NormalMarkitem)
    },
    mouseLeave () {
      this.curHover = -1
    },
    createMaker () {
      if (this.position) {
        const pos = this.position.map(_c => parseFloat(_c)).filter(_c => !isNaN(_c))
        if (pos.length !== 2) return
        /* eslint-disable */
        this.overlay = new AMap.Marker({
          position: this.position,
          content: this.$el,
        })
        /* eslint-enable */
        this.addOverlay(this.overlay)
      }
    },
  },
}
</script>

<style scoped>
/* // 高德地图lable */
#container /deep/ .amap-marker-label {
  padding: 6px 10px;
  color: var(--base-text-color-1);
  font-size: 14px;
  border-radius: 2px;
  background: rgba(53, 67, 92);
  border: none;
}

#container /deep/ .amap-marker-label :after {
  position: absolute;
  content: ' ';
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  width: 0;
  height: 0;
  border: 8px solid rgba(53, 67, 92);
  border-color: rgba(53, 67, 92) transparent transparent transparent;
  z-index: 111;
}
#container /deep/.yuan {
  background-color: #4596e6;
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
  text-align: center;
}
#container /deep/.l {
  width: 64px;
  height: 64px;
  line-height: 64px;
}
#container /deep/.m {
  width: 48px;
  height: 48px;
  line-height: 48px;
}
#container /deep/.s {
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
