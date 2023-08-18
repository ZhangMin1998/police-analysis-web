<template>
  <div class="car-path"></div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    lineType: {
      type: String,
      default: 'line' // 线段样式可选值：line | dash
    },
    lineList: {
      type: Array,
      required: true
    },
    layerClass: {
      // 利用自定义样式区分其他图层的标志
      type: String,
      default: 'car-marker'
    },
    placeNumber: {
      type: String,
      default: '9999'
    }
  },
  inject: ['addOverlay', 'removeOlver'],
  mounted () {
    this.formatData()
    this.renderMarker()
  },
  beforeDestroy () {
    this.curlayer && this.removeOlver(this.curlayer)
  },
  data () {
    return {
      curlayer: null,
      markerList: [],
      pathList: [],
      pathOverlay: []
    }
  },
  computed: {
    map () {
      return this.$store.state.Common.cMap
    }
  },
  watch: {
    list: {
      handler () {
        this.pathOverlay && this.removeOlver(this.pathOverlay)
        this.markerList && this.removeOlver(this.markerList)
        this.formatData()
        this.renderMarker()
      },
    },
    deep: true
  },
  methods: {
    formatData () {
      this.pathList = this.lineList.reduce((acc, v) => {
        acc.push(v.location)
        return acc
      }, [])
    },
    renderMarker () {
      // 如果有图层，则去除之前图层，但是会造成闪烁
      this.markerList = []
      const len = this.list.length
      if (len === 1) {
        this.removeOlver(this.pathOverlay)
      } else {
        // 渲染折线
        // eslint-disable-next-line
        this.pathOverlay = new AMap.Polyline({
          path: this.pathList,
          strokeColor: '#89782d',
          strokeStyle: this.lineType,
          borderWeight: 1, // 线条宽度，默认为 1
          // strokeStyle是dashed时有效
          // strokeDasharray: [10, 5],
          zIndex: 1
        })
        this.addOverlay(this.pathOverlay)
      }
      this.list.forEach((marker, idx) => {
        this.generateMarker(marker, this.calcImage(marker, idx, this.list))
      })
      // 渲染圆
      this.markerList.forEach(marker => this.addOverlay(marker))
    },
    generateMarker (item, cls) {
      // console.log(cls);
      const { location, title } = item
      // const curCotent = {
      //   title: item.title,
      // }
      // eslint-disable-next-line
      const overlay = new AMap.Marker({
        // eslint-disable-next-line
        offset: new AMap.Pixel(-12, -14),
        // anchor:'center', // 设置锚点方位
        position: location,
        content: `<div class='${cls} icon-cicle-marker'">${title}</div>`,
        extData: {
          ...item
        }
      })

      overlay.on('click', e => {
        let curCotent = JSON.parse(JSON.stringify(e.target.getExtData()));
        this.$emit('elementClick', curCotent)
      })

      this.markerList.push(overlay)
    },
    // 根据当前索引来计算当前图片种类 开始 中间 结束
    calcImage (item, index, list) {
      if (item.status === 'activeBy') {
        return 'activeBy'
      }
      if (item.status === 'activeStartAndEnd') {
        return 'activeStartAndEnd'
      }
      if (item.status === 'activeStart') {
        return 'activeStart'
      }
      if (item.status === 'activeEnd') {
        return 'activeEnd'
      }

      if (this.lineList.length > 1 && this.lineList[0].placeId === item.placeId && item.placeId === this.lineList[this.lineList.length - 1].placeId) {
        return 'startAndEnd'
      }
      if (list.length && list[0].placeId === item.placeId) {
        return 'start'
      }
      if (item.placeId === this.lineList[0].placeId) {
        return 'end'
      }
      return 'by'
    },
  }
}
</script>

<style lang="less">
.icon-cicle-marker {
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: aliceblue;
  text-align: center;
}
.start {
  background: url(~img/car-start.png);
}
.by {
  background: url(~img/car-by.png);
}
.end {
  background: url(~img/car-end.png);
}
.startAndEnd {
  background: url(~img/car-start-with-end.png);
}
.activeBy {
  width: 34px;
  height: 34px;
  line-height: 34px;
  background: url(~img/car-active-by.png);
}
.activeStart {
  width: 34px;
  height: 34px;
  line-height: 34px;
  background: url(~img/car-active-start.png);
}
.activeEnd {
  width: 34px;
  height: 34px;
  line-height: 34px;
  background: url(~img/car-active-end.png);
}
.activeStartAndEnd {
  width: 34px;
  height: 34px;
  line-height: 34px;
  background: url(~img/car-active-startandend.png);
}
.clickpop-h {
  margin-top: 0;
  margin-bottom: 6px;
}
</style>
