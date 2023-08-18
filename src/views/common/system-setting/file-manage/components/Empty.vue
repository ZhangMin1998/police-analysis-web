<template>
  <div class="EmptyData">
    <span>字段已全部隐藏，点此</span>
    <span class="set" @click="openSet">配置字段</span>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'

export default {
  setup () {
    const state = reactive({
      count: 0
    })
    const methods = {
      openSet () {
        this.$emit('openSet')
      }
    }

    return {
      ...toRefs(state),
      ...methods
    }
  }
}
</script>

<style lang="less" scoped>
.EmptyData {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .set{
    color: #3d6eff;
    cursor: pointer;
  }
}
</style>
