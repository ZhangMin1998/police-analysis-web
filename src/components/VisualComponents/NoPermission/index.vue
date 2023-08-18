<template>
  <div class="EmptyData">
    <div class="no_permission_box">
      <img src="@/assets/img/no-permission.png" alt="" />
      <div>暂无权限</div>
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="less" scoped>
.EmptyData {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .no_permission_box {
    text-align: center;
  }
}
</style>
