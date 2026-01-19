<template>
  <div class="header">
    <div class="container">
      <div class="header__content">
        <router-link to="/" class="header__logo">
          <i-tabler:car />
          <span>Mini Catalog</span>
        </router-link>

        <nav class="header__nav">
          <AppButton
            :to="{ name: 'CarEdit' }"
            label="Редактировать"
            class="header__btn"
          />
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
  background-color: var(--neutral-900);
  border-bottom: 1px solid var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: var(--z-index-1100);

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    position: relative;
  }

  &__logo {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 35px;
      color: var(--neutral-500);
    }
  }

  &__nav {
    position: absolute;
    right: 0;
    display: flex;
  }
  &__btn {
    font-size: 16px;
  }
}
</style>
