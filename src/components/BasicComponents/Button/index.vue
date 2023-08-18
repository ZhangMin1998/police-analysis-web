<template>
  <button class="p-button" @click="$emit('click')">
    <div class="p-button-content">
      <slot />
    </div>
  </button>
</template>

<script>
export default {
  name: 'p-button',
}
</script>

<style scoped>
.p-button {
  padding: 6px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 1;
  border-radius: 2px;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.p-button:hover {
  background: #177ddc;
  outline: none;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.p-button-content {
  color: var(--base-text-color-1);
}
</style>
