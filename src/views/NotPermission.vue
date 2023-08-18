<template>
  <div class="box  flex">
    <div class="img">
      <img :src="require('@/assets/img/NotPermission.png')" alt="" />
    </div>
    <div class="text">暂无查看权限</div>
  </div>
</template>

<script></script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--base-text-color-to-999999);
}
.flex img {
  width: 302px;
  height: 214px;
  margin-bottom: 27px;
}
.box {
  margin: 220px 0 0 -110px;
}
</style>
