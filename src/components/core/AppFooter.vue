<template>
  <div class="footer">
    <div class="container">
      <div class="footer__content">
        <span class="footer__copyright">
          © {{ currentYear }} Mini Catalog. Все права защищены.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped lang="scss">
.footer {
  background-color: var(--neutral-900);
  padding: 20px 0;

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__copyright {
    font-size: 14px;
    color: var(--neutral-400);
  }
}
</style>
