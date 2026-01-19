<template>
  <div class="car-page">
    <!-- Критическая ошибка - показываем вместо контента -->
    <AppSpinner v-if="loading" />

    <AppError v-else-if="error" :message="error" :retry="loadCarData" />

    <!-- Контент страницы -->
    <template v-else>
      <!-- Предупреждение о проблемах с расширенными данными -->
      <AppAlert
        type="error"
        title="Данные не загружены"
        :message="errorExtended"
        :autoclose="3000"
        @dismiss="carsStore.clearErrorExtended"
      />

      <div v-if="car" class="car-page__content">
        <!-- Base info -->
        <CarBaseBlock :car="car" class="car-page__block" />

        <!-- Image -->
        <CarImageBlock
          :image-url="car.extended?.imageUrl"
          :alt="`${car.make} ${car.model}`"
          :loading="loadingExtended"
          class="car-page__block"
        />

        <!-- Extended data -->
        <CarExtendedBlock
          v-for="block in carExtendedBlock"
          :key="block.id"
          :block="block"
          :loading="loadingExtended"
          class="car-page__block"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Car } from '@/types'
import type { CarExtendedBlock } from '@/components/CarExtendedBlock.vue'
import MaterialSymbolsLightAutoTransmission from '~icons/material-symbols-light/auto-transmission'
import MaterialSymbolsLightStraighten from '~icons/material-symbols-light/straighten'
import MaterialSymbolsLightLocalGasStation from '~icons/material-symbols-light/local-gas-station'
import MaterialSymbolsLightSpeed from '~icons/material-symbols-light/speed'
import { useCarsStore } from '@/stores/cars'
import { storeToRefs } from 'pinia'

const props = defineProps<{ id: string }>()
const carsStore = useCarsStore()
const { loading, loadingExtended, error, errorExtended } =
  storeToRefs(carsStore)

const car = computed<Car | null>(() => {
  const carId = Number(props.id)
  return carsStore.getCarById(carId)
})

const carExtendedBlock = computed<CarExtendedBlock[]>(() => {
  const data = car.value?.extended
  return [
    {
      id: 1,
      icon: MaterialSymbolsLightAutoTransmission,
      title: 'Двигатель',
      class: 'car-page__block--engine',
      specs: [
        {
          id: 1_1,
          label: 'Тип кузова',
          value: data?.model_body,
        },
        {
          id: 1_2,
          label: 'Объем двигателя',
          value: data?.model_engine_cc,
          unit: 'см³',
        },
        {
          id: 1_3,
          label: 'Тип двигателя',
          value: data?.model_engine_type,
        },
        {
          id: 1_4,
          label: 'Мощность при об/мин',
          value: data?.model_engine_power_rpm,
        },
        {
          id: 1_5,
          label: 'Крутящий момент',
          value: data?.model_engine_torque_nm,
          unit: 'Н·м',
        },
        {
          id: 1_6,
          label: 'Крутящий момент при об/мин',
          value: data?.model_engine_torque_rpm,
        },
        {
          id: 1_7,
          label: 'Степень сжатия',
          value: data?.model_engine_compression,
        },
        {
          id: 1_8,
          label: 'Топливо',
          value: data?.model_engine_fuel,
        },
        {
          id: 1_9,
          label: 'Привод',
          value: data?.model_drive,
        },
      ],
    },
    {
      id: 2,
      icon: MaterialSymbolsLightStraighten,
      title: 'Габариты',
      class: 'car-page__block--dimensions',
      specs: [
        {
          id: 2_1,
          label: 'Длина',
          value: data?.model_length_mm,
          unit: 'мм',
        },
        {
          id: 2_2,
          label: 'Ширина',
          value: data?.model_width_mm,
          unit: 'мм',
        },
        {
          id: 2_3,
          label: 'Высота',
          value: data?.model_height_mm,
          unit: 'мм',
        },
        {
          id: 2_4,
          label: 'Колесная база',
          value: data?.model_wheelbase_mm,
          unit: 'мм',
        },
        {
          id: 2_5,
          label: 'Вес',
          value: data?.model_weight_kg,
          unit: 'кг',
        },
        {
          id: 2_6,
          label: 'Количество дверей',
          value: data?.model_doors,
        },
      ],
    },
    {
      id: 4,
      icon: MaterialSymbolsLightSpeed,
      title: 'Производительность',
      class: 'car-page__block--performance',
      specs: [
        {
          id: 4_1,
          label: 'Максимальная скорость',
          value: data?.model_top_speed_kph,
          unit: 'км/ч',
        },
        {
          id: 4_2,
          label: 'Разгон до 100 км/ч',
          value: data?.model_0_to_100_kph,
          unit: 'с',
        },
      ],
    },
    {
      id: 3,
      icon: MaterialSymbolsLightLocalGasStation,
      title: 'Расход топлива',
      class: 'car-page__block--fuel',
      specs: [
        {
          id: 3_1,
          label: 'Город',
          value: data?.model_lkm_city,
          unit: 'л/100км',
        },
        {
          id: 3_2,
          label: 'Трасса',
          value: data?.model_lkm_hwy,
          unit: 'л/100км',
        },
        {
          id: 3_3,
          label: 'Смешанный',
          value: data?.model_lkm_mixed,
          unit: 'л/100км',
        },
        {
          id: 3_4,
          label: 'Объем бензобака',
          value: data?.model_fuel_cap_l,
          unit: 'л',
        },
        {
          id: 3_5,
          label: 'Выбросы CO₂',
          value: data?.model_co2,
          unit: 'г/км',
        },
      ],
    },
  ]
})

const loadCarData = () => {
  const carId = Number(props.id)
  carsStore.loadCarById(carId, { redirectOnNotFound: true })
}

onMounted(loadCarData)

watch(() => props.id, loadCarData)
</script>

<style scoped lang="scss">
.car-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    // grid-auto-rows: 50px;
    gap: 24px;
  }

  &__block {
    &:nth-child(1) {
      grid-column: 1;
      grid-row: 1 / span 4;
    }
    &:nth-child(2) {
      grid-column: 2;
      grid-row: 1 / span 6;
    }
    &:nth-child(3) {
      grid-column: 1;
      grid-row: 5 / span 8;
    }
    &:nth-child(4) {
      grid-column: 2;
      grid-row: 7 / span 5;
    }
    &:nth-child(5) {
      grid-column: 1;
      grid-row: 13 / span 3;
    }
    &:nth-child(6) {
      grid-column: 2;
      grid-row: 12 / span 4;
    }
  }
}
</style>
