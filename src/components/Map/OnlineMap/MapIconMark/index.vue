
<script>
import { mapState } from 'vuex'
// 点标注组件
export default {
  name: 'olMapIcon',
  render () {
    return this.$parent.preventChildrenRender
  },
  props: {
    position: { type: Array },
    icon: { type: String },
    customAttribute: { type: Object },
    zindexList: { type: Object },
    iconSize: { type: Array, default: () =>[24,24] }
  },
  data () {
    return {
      iconLayer: null
    }
  },
  computed: {
    ...mapState('Common', {
      cMap: 'cMap'
    })
  },
  mounted () {
    if (this.cMap) {
      this.MapIconMark()
    } else {
      setTimeout(() => {
        this.MapIconMark()
      }, 500)
    }
  },
  methods: {
    // 单个标注
    MapIconMark () {
      const _that = this
      // 创建 AMap.Icon 实例：
      /* eslint-disable */
      const icon = new AMap.Icon({
        size: new AMap.Size(_that.iconSize[0], _that.iconSize[1]), // 图标尺寸
        image: _that.icon, // Icon的图像
        imageSize: new AMap.Size(_that.iconSize[0], _that.iconSize[1]) // 根据所设置的大小拉伸或压缩图片
      })

      // 将 Icon 实例添加到 marker 上:
      this.iconLayer = new AMap.Marker({
        position: this.position,
        offset: new AMap.Pixel(20, 0),
        icon: icon, // 添加 Icon 实例
        id: _that.customAttribute.id,
        zoom: 13,
        zIndex: _that.zindexList
          ? _that.zindexList[_that.customAttribute[_that.zindexList['prop']]]
          : 800
      })
      /* eslint-enable */
      this.iconLayer.setExtData({ ...this.customAttribute })

      this.iconLayer.on('click', e => {
        this.$emit('handleClickIcon', e, this.customAttribute)
      })
      this.$store.state.Common.cMap?.add(this.iconLayer)
    }
  }
}
</script>
