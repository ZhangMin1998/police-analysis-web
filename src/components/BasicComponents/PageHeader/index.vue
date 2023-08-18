<template>
  <div class="PageHeader" :style="$attrs.cusStyle">
    <div class="sides" :class="{ PageHeader_title: $slots.headerTop }">
      <slot name="headerTop"></slot>
    </div>
    <div class="sides PageHeader_main" :class="{ PageHeader_main_content: $slots.default }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  mounted () {
    // console.log(this.$slots);
  },
}
</script>

<style scoped>
.PageHeader {
  position: relative;
  box-sizing: border-box;
  /* margin: 12px 16px 0 16px;
  padding: 12px 16px; */
  /* background-color: #21283E ; */
  background: var(--bg-color-3);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sides {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.PageHeader_title {
  height: 72px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--heared-bg-color);
}
.PageHeader_main_content{
  padding:12px 16px;
  margin-top: 2px;
}
</style>
