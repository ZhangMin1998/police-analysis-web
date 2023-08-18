<template>
<div class='grid_layout_wrap'>
  <GridLayout
    :layout.sync='layout'
    :colNum="colNum"
    :rowHeight='formatRowHeight'
    :margin='[marginCol, marginRow]'
    :isDraggable='isDraggable'
    :isResizable='isResizable'
    :useCssTransforms='useCssTransforms'
    :verticalCompact='verticalCompact'
  >
    <GridItem
      v-for='(item, index) in layout'
      :key='item.i'
      :x='item.x'
      :y='item.y'
      :w='item.w'
      :h='item.h'
      :i='item.i'
      :dragAllowFrom='dragAllowFrom'
      @resize="resizeEvent"
      @move="moveEvent"
      @resized="resizedEvent"
      @container-resized="containerResizedEvent"
      @moved="movedEvent"
    >
      <slot name='itemContent' :info='item' :index='index'></slot>
    </GridItem>
  </GridLayout>
</div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'PGridLayout',
  props: {
    // 数据源。值必须为 Array，其数据项为 Object。 每条数据项必须有 i, x, y, w 和 h 属性
    layout: {
      type: Array,
      require: true,
      validate (value) {
        return value.every(item =>
          item.hasOwnProperty.call('x') &&
          item.hasOwnProperty.call('y') &&
          item.hasOwnProperty.call('w') &&
          item.hasOwnProperty.call('h') &&
          item.hasOwnProperty.call('i')
        )
      }
    },
    colNum: {
      type: Number,
      default: 12
    },
    // UI图在1920*1080下盒子的高度
    rowHeight: {
      type: Number,
      default: 206
    },
    // UI图在1920*1080下盒子跟盒子纵向之间的距离
    marginRow: {
      type: Number,
      default: 16
    },
    // UI图在1920*1080下盒子跟盒子横向之间的距离
    marginCol: {
      type: Number,
      default: 16
    },
    // 是否可以拖拽
    isDraggable: {
      type: Boolean,
      default: true
    },
    // 是否可以调整大小
    isResizable: {
      type: Boolean,
      default: true
    },
    // 标识是否使用CSS属性 transition-property: transform
    useCssTransforms: {
      type: Boolean,
      default: true
    },
    // 标识布局是否垂直压缩
    verticalCompact: {
      type: Boolean,
      default: true
    },
    dragAllowFrom: {
      type: String,
      default: null
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data () {
    return {
      formatRowHeight: null, // 自适应后对应的盒子的大小
      formatMarginRow: null, // 自适应后盒子跟盒子纵向之间的距离
      formatMarginCol: null, // 自适应后盒子跟盒子横向之间的距离
    }
  },
  created () {
    this.formatRowHeight = this.formatPx(this.rowHeight)
    this.formatMarginRow = this.formatPx(this.marginRow)
    this.formatMarginCol = this.formatPx(this.marginCol)
  },
  methods: {
    formatPx (num) {
      return num * document.documentElement.style.fontSize.split('px')[0] / 192
    },
    // 移动时的事件
    moveEvent (i, newX, newY) {
      this.$emit('moveEvent', i, newX, newY)
    },
    // 调整大小时的事件
    resizeEvent (i, newH, newW, newHPx, newWPx) {
      this.$emit('resizeEvent', i, newH, newW, newHPx, newWPx)
    },
    // 移动后的事件
    movedEvent (i, newX, newY) {
      this.$emit('movedEvent', i, newX, newY)
    },
    // 调整大小后的事件
    resizedEvent (i, newH, newW, newHPx, newWPx) {
      this.$emit('resizedEvent', i, newH, newW, newHPx, newWPx)
    },
    // 栅格元素/栅格容器更改大小的事件（浏览器窗口或其他）
    containerResizedEvent (i, newH, newW, newHPx, newWPx) {
      this.$emit('containerResizedEvent', i, newH, newW, newHPx, newWPx)
    },
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.grid_layout_wrap {
  width: 100%;
  height: 100%;
}
</style>
