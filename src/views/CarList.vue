<template>
  <div class="car-list">
    <h1 class="car-list__title">Список автомобилей</h1>

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

      <AppInput
        v-model="searchQuery"
        placeholder="Поиск по марке и модели"
        class="car-list__search"
        :icon="TablerSearch"
      />

      <div v-if="filteredCars.length" v-auto-animate class="car-list__items">
        <CarCard
          v-for="car in filteredCars"
          :key="car.id"
          :car="car"
          :loading="loadingExtended"
          class="car-list__item"
        />
      </div>

      <AppEmpty v-else message="Совпадений не найдено" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Car } from '@/types'
import TablerSearch from '~icons/tabler/search'
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

const searchQuery = ref<string>('')

const filteredCars = computed<Car[]>(() => {
  if (!searchQuery.value.trim()) {
    return cars.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return cars.value.filter((car) => {
    const makeMatch = car.make.toLowerCase().includes(query)
    const modelMatch = car.model.toLowerCase().includes(query)

    return makeMatch || modelMatch
  })
})

onMounted(() => {
  carsStore.loadCarsList()
})
</script>

<style scoped lang="scss">
.car-list {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 40px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  &__item {
    width: 100%;
  }

  &__search {
    margin-bottom: 24px;
    padding: 15px 15px;
    border-radius: var(--border-radius-xl);
  }
}
</style>
