<template>
  <!-- <div>{{ fatherHeight }}</div> -->
  <div
    class="loadingModal"
    :style="{ height: fatherHeight + 'px', backgroundColor: backgroundColor }"
    v-if="progressLoading"
  >
    <el-progress
      :style="{ width: '90%', margin: '0 auto', paddingTop: '8px' }"
      type="line"
      :stroke-width="strokeWidth"
      :percentage="percentage"
      :color="colors"
      :show-text="percentage == 100"
      :status="percentage == 100 ? 'success' : undefined"
    ></el-progress>

    <!-- <el-progress
      :style="{ width: '20%', margin: '0 auto', marginTop: `${fatherHeight * 0.3}px` }"
      :type="type" //line/circle/dashboard
      :width="70" //环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
      :text-inside="true" //进度条显示文字内置在进度条内（只在 type=line 时可用）
      :stroke-width="type ? undefined : strokeWidth" //进度条的宽度，单位 px
      :percentage="percentage" //百分比（必填）
      :color="colors" //进度条背景色（会覆盖 status 状态颜色）
      :show-text="showText" //是否显示进度条文字内容
      :status="percentage === 100 ? undefined : 'success'"
    ></el-progress> -->
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    backgroundColor: {
      type: String,
      default: '31, 43, 63',
    },
    strokeWidth: {
      type: Number,
      default: 11,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    // 进度条状态
    // type: {
    //   type: String,
    //   default: () => {
    //     return undefined
    //   },
    // },
    // 显示状态
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      percentage: 0,
      timeStart: 0,
      fatherHeight: 0, // 父级元素高度
      colors: [
        { color: '#1989fa', percentage: 99.9 },
        { color: '#1989fa', percentage: 100 },
      ],
      progressLoading: true,
    }
  },

  computed: {
    ...mapState('SystemSetting', {
      isExporting: 'isExporting',
    }),
  },

  watch: {
    // 监听loading状态控制进度条显示
    loading (value) {
      const that = this
      if (value) {
        that.start()
      } else {
        that.end()
      }
    },
  },

  mounted () {
    this.start()
    this.bus.$on('restetPercentage', () => {
      this.percentage = 0
    })
    this.bus.$on('conPercentage', num => {
      this.percentage = num
    })
    // 获取父级元素的高度，使组件高度与父元素高度相同
    // 相对于父元素定位
    this.$el.parentNode.style.position = 'relative'
  },

  beforeDestroy () {
    if (this.isExporting) {
      this.set_exportingNum(this.percentage)
    }
    this.percentage = 0
    clearInterval(this.timeStart)
    this.bus.$off('conPercentage')
    this.bus.$off('restetPercentage')
  },

  methods: {
    ...mapMutations('SystemSetting', {
      set_exportingNum: 'set_exportingNum',
    }),

    // 进度条开始
    start () {
      const that = this
      that.fatherHeight = this.$el.parentNode.offsetHeight
      that.$nextTick(() => {
        that.progressLoading = true
        that.percentage = 0
        that.timeStart = setInterval(() => {
          if (that.percentage == 99) {
            that.percentage = 99
          } else {
            that.percentage += 1
          }
        }, 1400)
      })
    },
    // 进度条结束
    end () {
      const that = this
      that.percentage = 100
      clearInterval(this.timeStart)
    },
  },
}
</script>
<style>
.loadingModal {
  height: var(height);
  width: 100%;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
}
</style>
