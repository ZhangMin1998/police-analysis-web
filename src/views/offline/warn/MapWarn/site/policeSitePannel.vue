<template>
  <div class="police-site-pannel my-scroll">
    <div class="police-site-item" v-for="(item, idx) in siteList" :key="idx">
      <span class="header">{{ item.placeName }}</span>
      <span class="content" :title="item.siteAddress">{{ item.siteAddress }}</span>
    </div>
    <div class="operator" v-if="showOp">
      <img @click="editSite" src="@/assets/img/icon-doc-pen.png" alt="" />
      <img @click="delSite" src="@/assets/img/icon-drop.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    siteList: {
      type: [Object, Array],
    },
    showOp: {
      // 是否展示操作按钮
      type: Boolean,
      default: true,
    },
  },
  methods: {
    delSite () {
      this.$emit('delSite')
    },
    editSite () {
      this.$emit('editSite')
    },
  },
}
</script>

<style lang="less" scoped>
.police-site-pannel {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 20px;
  padding: 16px;
  width: 338px;
  height: 275px;
  color: var(--base-text-color-1);
  background: @cur-bg;
  opacity: @cur-opacity;
  line-height: 22px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px; /* 纵向滚动条*/
    height: 5px; /* 横向滚动条 */
    background-color: #222a3f;
  }

  /*定义滚动条轨道 内阴影*/
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    background-color: #222a3f;
  }

  /*定义滑块 内阴影*/
  &::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0);
    background-color: #363f58;
  }
  .police-site-item {
    margin-bottom: 24px;
    .header {
      line-height: 25px;
      display: block;
      font-weight: bold;
      font-size: 18px;
      margin: 0 0 4px;
    }
    .content {
      line-height: 22px;
      // font-size: 16px;
    }
  }
  .operator {
    position: absolute;
    top: 16px;
    right: 8px;
    & > img {
      &:first-child {
        margin-right: 6px;
      }
      cursor: pointer;
    }
  }
}
</style>
