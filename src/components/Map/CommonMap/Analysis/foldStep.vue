<template>
  <div class="space_container">
    <div>
      <div class="step_dot" v-for="(item, index) in list" :key="index">
        <div class="step" :style="index == 0 ? 'padding-top: 16px;' : ''">
          <div class="topline" v-if="index != 0"></div>
          <div class="dot">{{ index + 1 }}</div>
          <div class="line"></div>
        </div>

        <div class="step_item">
          <div class="jiao"></div>
          <div>
            <div
              :class="`step_title ${item.isChecked ? 'isChecked' : ''}`"
              @click="expend(item, index)"
            >
              <div>{{ item.title }}</div>

              <!-- 按钮 -->
              <slot :name="'btn' + index">
                <div>
                  <i :class="`el-icon-arrow-right ${item.isChecked ? 'isActive' : ''}`"></i>
                </div>
              </slot>
            </div>
            <div v-show="item.isChecked">
              <slot :name="'step_content' + index"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    expend (item, index) {
      if (item.isCanExpend) {
        this.$emit('expend', index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step_dot {
  display: flex;
  max-height: 62px;
  position: relative;
  margin-bottom: 16px;
  &:last-child .line {
    display: none;
  }
  .step_item {
    flex: 1 1 auto;
    // box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.06);
    box-shadow: var(--box-shadow);
    box-sizing: border-box;
    position: relative;
    // background-color: #36445d;
    background-color: var(--bg-color-3);
    padding: 16px 0;
    color: var(--base-text-color-1);
    // color: red;
    font-size: 18px;
    .step_title {
      padding: 0 16px;
      line-height: 30px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      cursor: pointer;
      .el-icon-arrow-right {
        transition: transform 0.3s;
        &.isActive {
          transform: rotate(90deg);
        }
      }
      &.isChecked {
        color: rgb(212, 176, 33);
        font-weight: 600;
      }
      &:hover {
        color: rgb(212, 176, 33);
        font-weight: 600;
      }
    }
    .jiao {
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 10px solid var(--bg-color-3);
      border-bottom: 10px solid transparent;
      position: absolute;
      top: 20px;
      left: -9px;
    }
  }
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dot {
  margin-right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #1890ff;
  text-align: center;
  line-height: 24px;
  color: @font-color-3;
  font-size: 14px;
  box-sizing: border-box;
}
.topline {
  margin-top: -16px;
  padding-top: 12px;
  margin-bottom: 8px;
  margin-right: 10px;
  width: 2px;
  background-color: #37455e;
  height: 12px;
}
.line {
  margin-right: 10px;
  width: 2px;
  background-color: #37455e;
  flex: 1 1 auto;
  margin-top: 8px;
}
</style>
