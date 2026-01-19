<template>
  <div class="app-empty">
    <i-fluent:box-search-20-regular class="app-empty__icon" />
    <p v-if="props.message" class="app-empty__message">{{ props.message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string }>()
</script>

<style scoped lang="scss">
.app-empty {
  background-color: var(--neutral-800);
  padding: 20px;
  border-radius: var(--border-radius-xl);
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 1000;

  &__icon {
    width: 10%;
  }

  &__message {
    font-size: 20px;
  }
}
</style>
