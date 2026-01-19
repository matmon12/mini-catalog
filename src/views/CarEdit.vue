<template>
  <div class="car-edit">
    <h1 class="car-edit__title">Редактировать автомобили</h1>

    <AppSpinner v-if="loading" />

    <AppError
      v-else-if="error"
      :message="error"
      :retry="carsStore.loadCarsList"
    />

    <template v-else>
      <AppAlert
        type="error"
        title="Ошибка при загрузке данных"
        :message="errorExtended"
        :autoclose="3000"
        @dismiss="carsStore.clearErrorExtended"
      />

      <div class="car-edit__list">
        <CarEditCard
          v-for="car in cars"
          :key="car.id"
          :car="car"
          :loading="loadingExtended"
          class="car-edit__item"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCarsStore } from '@/stores/cars'
import { storeToRefs } from 'pinia'

const carsStore = useCarsStore()
const {
  getAllCars: cars,
  loading,
  loadingExtended,
  error,
  errorExtended,
} = storeToRefs(carsStore)

onMounted(() => {
  carsStore.loadCarsList()
})
</script>

<style scoped lang="scss">
.car-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 900px;
  margin: 0 auto;

  &__title {
    font-size: 40px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__item {
    width: 100%;
  }
}
</style>
