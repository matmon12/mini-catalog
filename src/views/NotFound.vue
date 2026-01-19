<template>
  <div class="not-found">
    <i-tabler:error-404 class="not-found__icon" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.not-found {
  background-color: var(--neutral-800);
  padding: 20px;
  border-radius: var(--border-radius-xl);
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  &__icon {
    width: 280px;
    color: var(--neutral-400);
    filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.7));
  }
}
</style>
