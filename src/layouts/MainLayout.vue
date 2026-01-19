<template>
  <div class="main-layout">
    <AppHeader />
    <main>
      <div class="container main-layout__content">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.main-layout__content {
  padding-top: 25px;
  padding-bottom: 25px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
