<template>
  <div class="pannel-wrapper">
    <ul class="pannel">
      <li
        class="pannel-item"
        v-for="(item, idx) in list"
        :key="idx"
        @click="clickPannel(item, idx)"
      >
        <div class="pannel-icon">
          <!-- <img src="" alt=""> -->
          {{ idx + 1 }}
        </div>
        <div class="pannel-content">
          <div class="pannel-content-header">
            {{ item.factory }}
          </div>
          <div class="pannel-content-main" :title="item.placeName">
            {{ item.placeName }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    clickPannel (item) {
      const position = [item.longitude, item.latitude]
      this.bus.$emit('handleCenter', position)
    }
  }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 5px; /* 纵向滚动条*/
  height: 5px; /* 横向滚动条 */
  background-color: #222a3f;
}

/*定义滚动条轨道 内阴影*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #222a3f;
}

/*定义滑块 内阴影*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.4);
  background-color: #363f58;
}

.pannel-wrapper {
  position: absolute;
  top: 46px;
  left: 100px;
  padding: 16px;
  background: @cur-bg;
  opacity: @cur-opacity;
  color: var(--base-text-color-1);
  width: 270px;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  cursor: default;
  .pannel {
    &-item {
      margin-bottom: 16px;
      display: flex;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--base-text-color-1);
      &:last-child {
        border: none;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
    &-icon {
      flex-basis: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-content {
      flex: 1 1 auto;

      &-header {
        font-size: 18px;
      }
      &-main {
      }
    }
  }
}

// @cur-bg: #283247;
// @cur-opacity: 0.95;
// var(--base-text-color-1): #C0D0E7;
// @borderColor: #202B3F;
</style>
