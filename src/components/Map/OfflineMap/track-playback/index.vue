<template>
<div class='track_playback_wrap'>
  <i
    class='iconfont'
    :class='{
      "icon-a-zu5303": !animating,
      "icon-a-zu5334": animating
    }'
    :title='animating ? "暂停" : "开始"'
    @click='playTrack'
  ></i>
  <i
    class='iconfont icon-a-zu5304'
    @click='restart'
    title='重放'
  ></i>
  <i
    class='iconfont icon-a-zu5330'
    @click='SlowDown'
    :class='{ "disabled": multipleInd === 0 }'
    title='减速'
  ></i>
  <div class='multiple'>{{ multiple + 'X' }}</div>
  <i
    class='iconfont icon-a-zu5331'
    @click='speedUp'
    :class='{ "disabled": multipleInd === multipleList.length - 1 }'
    title='加速'
  ></i>
</div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'TrackPlayback',
  props: {
    // 原轨迹图层的className，非必填参数，用于轨迹回放的时候，隐藏原轨迹线
    pLayerCName: {
      type: String,
      default: ''
    },
    // 如果有原轨迹线的话，为原来轨迹线的id，非必填参数，用于轨迹回放的时候，隐藏原轨迹线
    trackLineId: {
      type: [Number, String],
      default: ''
    },
    // 轨迹点列表, 必传参数
    /**
     * @param 轨迹点列表
     * @param trackPoints
     * [
     *    {经度, 纬度},
     *    {经度, 纬度},
     *    {经度, 纬度}
     * ]
     */
    pTrackPoints: {
      type: Array,
      default: () => []
    },
    // 多少个像素单位取一个经纬度点，可选，默认为15
    pixelLength: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      animating: false, // 轨迹回放开始为true,结束为false
      lngLatList: [], // 存放轨迹线上的轨迹点
      now: null, // 轨迹回放开始记录当前时间
      speed: 30, // 轨迹回放时的速度
      mapStyles: {},
      playMarker: null, // 轨迹回放的点
      playLine: null, // 轨迹回放的轨迹线
      trackBackLayer: null, // 轨迹回放图层
      multipleList: ['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'],
      multipleInd: 2,
      pTrackLine: null,
      moveIndex: 0,
      stopPointList: [] // 点击暂停、加速、减速时，存放已经轨迹回放过的点
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    },
    multiple () {
      return this.multipleList[this.multipleInd]
    }
  },
  mounted () {
    this.mapStyles = {
      'playMarker': new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({ color: '#fff' }),
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 255, 255, 0.27)',
            width: 10
          })
        })
      }),
      'playLine': new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 2,
          color: '#3D6EFF'
        })
      }),
    }
  },
  methods: {
    playTrack () {
      if (this.animating) {
        this.pauseAnimation()
      } else {
        if (this.stopPointList.length) {
          this.animating = true
          this.now = new Date().getTime()
          this.map.on('postcompose', this.moveFeature)
          this.map.render()
        } else {
          this.startAnimation()
        }
      }
    },
    restart () {
      this.stopAnimation()
      this.startAnimation()
    },
    startAnimation () {
      if (this.animating) return
      this.lngLatList = []
      this.moveIndex = 0
      this.stopPointList = []
      let trackLineLen = 0
      let trackLine = null
      if (this.pTrackPoints.length > 1) {
        trackLine = new ol.geom.LineString(this.pTrackPoints)
        trackLineLen = trackLine.getLength()
      }
      if (trackLineLen && trackLine) {
        let pointCount = trackLineLen / (this.map.getView().getResolution() * this.pixelLength)
        for (let i = 1; i < pointCount; i++) {
          this.lngLatList.push(trackLine.getCoordinateAt(i / pointCount))
        }
        this.lngLatList.unshift(this.pTrackPoints[0])
        this.lngLatList.push(this.pTrackPoints[this.pTrackPoints.length - 1])

        this.animating = true
        this.now = new Date().getTime()
        // 隐藏轨迹的线的逻辑
        if (this.pLayerCName && (this.trackLineId || typeof this.trackLineId === 'number')) {  // 播放的时候使原来轨迹线隐藏
          let mapLayers = this.map.getLayers().getArray()
          let trackLayer = mapLayers.find(item => item.className_ === this.pLayerCName)
          if (trackLayer) {
            this.pTrackLine = trackLayer.getSource().getFeatureById(this.trackLineId)
          }
        }
        if (this.pTrackLine) {
          this.pTrackLine.setStyle(
            new ol.style.Style({
              stroke: new ol.style.Stroke({
                width: 2,
                color: 'rgba(255, 255, 255, 0)'
              })
            })
          )
        }
        this.$emit('beforePlay')

        this.playMarker = new ol.Feature({
          geometry: new ol.geom.Point(this.lngLatList[0]),
          type: 'playMarker'
        })
        this.playLine = new ol.Feature({
          geometry: new ol.geom.LineString([this.lngLatList[0]]),
          type: 'playLine'
        })

        this.trackBackLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [this.playMarker, this.playLine]
          }),
          className: 'track-playback',
          style: (feature) => {
            return this.mapStyles[feature.get('type')]
          }
        })
        setTimeout(() => {
          this.map.addLayer(this.trackBackLayer)
          this.map.on('postcompose', this.moveFeature)
          this.map.render()
        }, 100)
      }
    },
    stopAnimation () {
      this.animating = false
      this.moveIndex = 0
      this.stopPointList = []
      this.map.un('postcompose', this.moveFeature)
      this.trackBackLayer && this.map.removeLayer(this.trackBackLayer)
      this.playMarker = null
      this.playLine = null
      this.trackBackLayer = null
      if (this.pTrackLine) {
        this.pTrackLine.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              width: 2,
              color: '#c93e41'
            })
          })
        )
      }
      this.$emit('stopPlay')
    },
    moveFeature (event) {
      let frameState = event.frameState
      if (this.animating) {
        let elapsedTime = frameState.time - this.now
        // 通过增加速度，来获得lineString坐标
        this.moveIndex = Math.round(this.speed * this.multiple * elapsedTime / 1000)

        if (this.moveIndex >= this.lngLatList.length) {
          this.stopAnimation()
          return
        }
        let currentPoint = new ol.geom.Point(this.lngLatList[this.moveIndex])
        let currentLine = new ol.geom.LineString([...this.stopPointList ,...this.lngLatList.slice(0, this.moveIndex + 1)])
        this.playMarker.setGeometry(currentPoint)
        this.playLine.setGeometry(currentLine)
      }
      //继续动画效果
      this.map.render()
    },
    // 暂停轨迹回放
    pauseAnimation () {
      if (this.animating) {
        this.animating = false
        this.map.un('postcompose', this.moveFeature)
        this.stopPointList = [...this.stopPointList, ...this.lngLatList.slice(0, this.moveIndex)]
        this.lngLatList = this.lngLatList.slice(this.moveIndex)
        this.moveIndex = 0
      }
    },
    SlowDown () {
      if (this.multipleInd === 0) return
      this.now = new Date().getTime()
      this.multipleInd -= 1
      this.stopPointList = [...this.stopPointList, ...this.lngLatList.slice(0, this.moveIndex)]
      this.lngLatList = this.lngLatList.slice(this.moveIndex)
    },
    speedUp () {
      if (this.multipleInd === this.multipleList.length - 1) return
      this.now = new Date().getTime()
      this.multipleInd += 1
      this.stopPointList = [...this.stopPointList, ...this.lngLatList.slice(0, this.moveIndex)]
      this.lngLatList = this.lngLatList.slice(this.moveIndex)
    }
  },
  beforeDestroy () {
    this.map.un('postcompose', this.moveFeature)
    this.trackBackLayer && this.map.removeLayer(this.trackBackLayer)
  },
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.track_playback_wrap {
  display: flex;
  padding: 5px 0;
  background: var(--bg-color-3);
  line-height: 1;
  i {
    font-size: 16px;
    color: var(--base-text-color-4);
    padding: 0 8px;
    border-right: 1px solid var(--division);
    cursor: pointer;
    &:last-child {
      border-right: 0;
    }
  }
  .multiple {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    font-size: 12px;
    border-right: 1px solid var(--division);
  }
  .disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
