<template>
  <div class="selector" :style="sizeStyle">
    <div class="title" ref="div">{{ title }}</div>
    <i
      :class="[
        'el-icon-arrow-down',
        'el-icon--right',
        isClicked ? (isDropDown ? 'icon_down' : 'icon_up') : '',
      ]"
      @click="openPop"
    ></i>
    <div class="drop-down-pop" :style="'top:' + height" v-if="isDropDown">
      <div
        class="drop-down-pop-item"
        v-for="(item, index) in popList"
        :key="item.typeCode"
        @click.stop="handleSelectClick(item, index)"
      >
        {{ item.typeName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDropDown: false,
      isClicked: false,
    }
  },
  props: {
    title: {
      type: String,
      default: '请选择类型',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: '62px',
    },
    //下拉选择框列表
    popList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    sizeStyle () {
      return `width:${this.width};height:${this.height};`
    },
  },
  methods: {
    openPop () {
      this.isClicked = true
      this.isDropDown = !this.isDropDown
    },
    handleSelectClick (item, index) {
      this.isDropDown = false
      this.$emit('handleSelect', item, index)
    },
  },
}
</script>

<style scoped>
.selector {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  color: #666;
  font-size: 16px;
  box-sizing: border-box;
  min-width: 132px;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 5px;
  min-width: 40px;
  padding-left: 54px;
  box-sizing: border-box;
  font-size: 20px;
  color: var(--base-text-color-1);
}
.drop-down-pop {
  width: 100%;
  position: absolute;
  left: 0;
  font-size: 16px;
  z-index: 99999;
  background: #202b3f;
  box-shadow: 0px 0px 4px 0px rgba(154, 154, 154, 0.5);
  text-align: left;
  padding-bottom: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.drop-down-pop-item {
  height: 32px;
  line-height: 32px;
  color: var(--base-text-color-to-999999);
  text-align: center;
  font-size: 20px;
}
.drop-down-pop-item:hover {
  background-color: #42506a;
  color: var(--base-text-color-1);
}
.el-icon-arrow-down {
  color: #666;
}
.el-icon--right {
  margin-left: 0;
}
</style>
