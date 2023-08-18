<template>
  <div :class="`sign ${isClick ? '' : 'disable'}`" @click="handleClick">
    <div class="icon">
      <img
        :src="require(`@/assets/img/icon-0-space${isClick ? '-a' : ''}.png`)"
        alt=""
      />
    </div>
    <div>{{ text }}</div>
  </div>
</template>

<script>
import ImgUrl from '@/assets/img/icon-map-pin.png'
const { _isOl } = require('@/config/user.js')
export default {
  name: 'MouseChoose',
  inject: ['mapRightMenu', 'mapClick'],
  props: {
    text: {
      type: String,
      default: '标记案发地点'
    },
    isClick: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      flag: false,
      img: null
    }
  },
  computed: {
    map () {
      return this.$store.state.Ol.oMap
    }
  },
  methods: {
    handleClick () {
      if (this.flag) {
        this.flag = false
        return
      }
      if (!this.isClick) return false
      this.flag = true
    },
    // 右键事件相关
    rightEvent () {
      if (_isOl()) {
        this.mapRightMenu(() => {
          if (!this.flag) return
          this.flag = false
          this.hideImg(this.img)
        })

        this.mapClick(e => {
          this.pinClick(e)
        })
        return
      } else {
        // 功能：右键取消标注
        window.document.oncontextmenu = e => {
          e.preventDefault() //  阻止右键菜单弹窗出现
          if (!this.flag) return
          this.flag = false
          this.hideImg(this.img)
          return false
        }
        const map = this.$store.state.Ol.oMap
        this.map.on('singleclick', e => {
          let pixel = map.getEventPixel(e.originalEvent)
          let pos = map.getCoordinateFromPixel(pixel)
          // debugger
          if (!this.flag) return
          this.$emit('pinMap', pos)
          this.hideImg(this.img)
          this.flag = false
        })
      }
    },
    moveEvent (e) {
      let pageX = e.pageX
      let pageY = e.pageY

      this.img.style.left = pageX - 12 + 'px'
      this.img.style.top = pageY - 24 + 'px'
    },
    pinClick (e) {
      if (!this.flag) return
      this.$emit('pinMap', e.lnglat)
      this.hideImg(this.img)
      this.flag = false
    },
    createImg () {
      this.img = document.createElement('img')
      // this.img.style.display = 'none'
      this.img.src = ImgUrl
      this.img.style.position = 'absolute'
      this.img.style.left = '-999px'
      this.img.style.top = '-999px'
      this.img.style.zIndex = '2500'
      document.querySelector('#app').appendChild(this.img)
    },
    hideImg (img) {
      img.style.left = '-100px'
      img.style.top = '-100px'
    }
  },
  mounted () {
    this.createImg()
    // 鼠标移动事件
    window.addEventListener('mousemove', e => {
      if (!this.flag) return
      this.moveEvent(e)
    })

    setTimeout(() => {
      this.rightEvent()
    }, 1000)
  },
  beforeDestroy () {
    document.querySelector('#app > img').remove()

    window.document.oncontextmenu = function () {
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.sign {
  position: absolute;
  z-index: 999;
  right: 430px;
  top: 16px;
  line-height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-items: center;
  color: var(--base-text-color-to-999999);
  font-size: 16px;
  padding: 0px 12px;
  // background-color: #27344d;
  // background-color: var(--bg-color-2);
  background: var(--car-right-chuangkou-hearder-bg);
  &.disable {
    cursor: not-allowed;
  }
  &:hover {
    color: #5288d8;
  }
  .icon {
    margin-right: 8px;
    width: 24px;
    height: 30px;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
.opera_map_search {
  background-color: #27344d;
  padding: 12px 16px;
  position: relative;
}
</style>
