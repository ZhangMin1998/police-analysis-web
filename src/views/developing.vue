<template>
    <div class="box  flex">
      <div class="img">
        <img :src="require('@/assets/img/wait.png')" alt="" />
      </div>
      <div class="text">此模块待开发中.....</div>
    </div>
</template>

<script>

</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--base-text-color-1);
}
.flex img {
  width: 250px;
  height: 250px;
}
.box {
  margin: 220px 0 0 -110px;
}
</style>
