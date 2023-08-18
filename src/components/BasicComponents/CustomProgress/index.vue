<template>
  <div class="CustomProgress">
    <div class="my-align-boths item">
      <div class="my-row ">
        <div>{{ index }}.</div>
        <div>{{ val }}</div>
      </div>
      <div class="value">{{ numbers }}</div>
    </div>

    <div>
      <div class="bg">
        <div
          class="my-progress"
          :style="{ width: (numbers / progress.maxNumbers) * 100 + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Object,
    },
    index: {
      type: [String, Number],
    },
    val: {
      type: [String, Number],
    },
    numbers: {
      type: [String, Number],
    },
  },
}
</script>

<style lang="less" scoped>
.my-row {
  display: flex;
}
.my-align-boths {
  display: flex;
  justify-content: space-between;
}

.CustomProgress {
  padding: 0 15px;
  font-size: var(--base-text-color-1);
  letter-spacing: 2.5px;
  .item {
    margin-bottom: 10px;
    line-height: 22px;
  }
  .value {
    font-size: 20px;
  }
  .bg {
    background-color: rgba(255, 255, 255, 0.1);
    width: 100%;
    height: 16px;
    position: relative;
    .my-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #177ddc 0%, #17cfdc 100%, #177ddc 100%);
    }
  }
}
</style>
