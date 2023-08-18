<template>
  <div
    v-if="loadingdom"
    v-loading="isLoading"
    :element-loading-background="loadingColorthme"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <slot></slot>
  </div>
</template>

<script>
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    loadingBg: {
      type: String
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    loadingColorthme () {
      if (this.loadingBg) {
        console.log(this.loadingBg)
        return this.loadingBg
      } else {
        let colorObj = this.theme === 'light' ? lightTheme : darkTheme
        /* eslint-disable */
        this.loadingdom = false
        this.$nextTick(() => {
          this.loadingdom = true
        })
        /* eslint-enable */
        // console.log(colorObj['--loading-color']);
        return colorObj['--loading-color']
      }
    }
  },
  data () {
    return {
      loadingdom: true
    }
  }
}
</script>

<style lang="less" scoped>
.el-loading-parent--relative {
  height: 100% !important;
}
</style>
