import { mapState} from 'vuex'
import MarkerPop from '@/components/Map/CommonMap/MarkerPop'
import { imgMap as imgSrcMap } from '@/views/offline/devicemap/devicemap'

export default {
  components: {
    MarkerPop
  },
  data () {
    return {
      clusterObj: {
        list: [],
        position: [],
        curIds: []
      },
      MarkerPopRef: null,
      MarkerPopTimer: null,
      imgSrcMap: imgSrcMap
    }
  },
  computed: {
    ...mapState('User', {
      zoom: 'zoom',
    }),
  },
  watch: {
    zoom () {
      this.handleClickOut()
    }
  },
  methods: {
    handleClickOut () {
      if (this.MarkerPopTimer) return;
      this.$refs['MarkerPopRef']?.refresh(undefined)
    },
    clickDeviceCate (item) {
      // 如果 ids 和 当前展开的 ids 相等，则不做处理
      // 这里注释了，这代码没有考虑到位，就是同一种，先点击一次，关闭弹框，再点击，弹框出不来
      // const isSame = (this.clusterObj.curIds + '') === (item.ids + '')
      // console.log(isSame);
      // if (isSame) return;
      this.$emit('clickDeviceCate', item)
      this.clusterObj.curIds = item.ids
    },
    generateImg (item) {
      const type = item.otype == 11 ? 1 : item.otype
      return require(`@/assets/img/${this.imgMap[item.onlineCount !== 0 ? type : type + '' + type]}`)
    }
  }
}
