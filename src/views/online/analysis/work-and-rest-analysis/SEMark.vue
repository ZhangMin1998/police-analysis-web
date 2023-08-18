<template>
  <div>
    <div :class="`yuan  s`">
      {{ probetimes }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Array,
      validator: value => value.length === 2
    },
    id: {
      type: [String, Number]
    },
    probetimes: {
      type: [String, Number]
    }
  },

  inject: ['addOverlay'],

  data () {
    return {
      overlay: {},
      curHover: -1
    }
  },

  mounted () {
    this.createMaker()
  },

  methods: {
    createMaker () {
      if (this.position) {
        const pos = this.position.map(_c => parseFloat(_c)).filter(_c => !isNaN(_c))
        if (pos.length !== 2) return
        /* eslint-disable */
        let icon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-9, -3)
        })
        this.overlay = new AMap.Marker({
          position: this.position,
          icon: icon,
          zIndex: 0
        })
        var content = `<div class = 'point'>${this.probetimes}</div>`
        this.overlay.setLabel({
          offset: new AMap.Pixel(3, -10), //设置文本标注偏移量
          content: content, //设置文本标注内容
          direction: 'top' //设置文本标注方位
        })
        /* eslint-enable */
        this.addOverlay(this.overlay)
      }
    }
  }
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
