<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: loadBackground || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="el-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else :class="spinner"></i>
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      text: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: '',
      loadBackground: null,
      bgIsColor: false
    }
  },
  mounted () {
    this.bgIsColor = this.isColor(this.background)
    if (this.bgIsColor) {
      this.loadBackground = this.background
    } else {
      this.loadBackground = this.$themeColor(this.background)
      this.bus.$on('theme', this.changeTheme)
    }
  },
  methods: {
    isColor (strColor) {
      if (!strColor) return false
      let reg = /^#[0-9A-F]{6}$/i
      if (reg.test(strColor)) return true
      let s = new Option().style
      s.color = strColor
      return s.color === strColor
    },
    changeTheme () {
      this.loadBackground = this.$themeColor(this.background)
    },
    handleAfterLeave () {
      this.$emit('after-leave')
    },
    setText (text) {
      this.text = text
    },
    setBackground (color) {
      this.background = color
      if (this.bgIsColor) {
        this.loadBackground = this.background
      } else {
        this.loadBackground = this.$themeColor(this.background)
      }
    }
  },
  beforeDestroy () {
    if (this.bgIsColor) return
    this.bus.$off('theme', this.changeTheme)
  }
}
</script>
