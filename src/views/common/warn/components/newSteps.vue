<template>
  <div class="space_container">
    <div class="step_box" v-for="(item, index) in list" :key="index">
      <div class="step-top">
        <div class="step">
          <div class="dot">{{ index + 1 }}</div>
        </div>

        <div class="step_item">
          <div class="step_title" @click="expend(item, index)">
            <div>{{ item.title }}</div>

            <slot :name="'btn' + index">
              <div>
                <i
                  :class="
                    `el-icon-arrow-up ${item.isChecked ? 'isActive' : 'el-icon-arrow-down'}`
                  "
                ></i>
              </div>
            </slot>
          </div>
        </div>
      </div>

      <div v-show="item.isChecked" style="min-height: calc(100vh - 270px);">
        <slot :name="'step_content' + index"></slot>
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
      // if (item.isCanExpend) {
      this.$emit('expend', index)
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.space_container{
  .step_box {
    position: relative;
    margin-bottom: 24px;
    .step-top{
      display: flex;
      align-items: center;
      // margin-bottom: 16px;
      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        .dot {
          margin-right: 8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #3D6EFF;
          text-align: center;
          line-height: 18px;
          color: #ffffff;
          font-size: 12px;
          box-sizing: border-box;
        }
      }
      .step_item {
        flex: 1;
        // box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.06);
        // box-sizing: border-box;
        position: relative;
        // background-color: #36445d;
        // padding: 16px 0;
        color: var(--base-text-color-1);
        font-size: 16px;
        .step_title {
          // padding: 0 16px;
          line-height: 16px;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: bold;
          box-sizing: border-box;
          cursor: pointer;
          .el-icon-arrow-right {
            transition: transform 0.3s;
            &.isActive {
              transform: rotate(0deg);
            }
          }
        }
      }
    }
  }
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
  flex: 1;
  margin-top: 8px;
}
</style>
