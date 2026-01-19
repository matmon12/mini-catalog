<template>
  <div class="car-base">
    <div class="car-base__hero">
      <div class="car-base__title-wrapper">
        <h1 class="car-base__title">{{ `${car.make} ${car.model}` }}</h1>
        <div class="car-base__year">{{ car.year }}</div>
      </div>

      <div class="car-base__price-hero">
        <span class="car-base__price-currency">$</span>
        <span class="car-base__price">{{ formattedPrice(car.price) }}</span>
      </div>
    </div>

    <div class="car-base__specs">
      <div
        v-for="spec in carBaseData"
        :key="spec.id"
        class="car-base__spec-card"
      >
        <div class="car-base__spec-icon-wrapper">
          <component :is="spec.icon" class="car-base__spec-icon" />
        </div>
        <div class="car-base__spec-content">
          <span class="car-base__spec-value">
            {{ spec.value }}
          </span>
          <span class="car-base__spec-label">{{ spec.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formattedPrice } from '@/utils'
import MaterialSymbolsAutoTransmission from '~icons/material-symbols/auto-transmission'
import FluentPerson32Filled from '~icons/fluent/person-32-filled'
import LineMdEngineFilled from '~icons/line-md/engine-filled'
import type { CarBase } from '@/types'

const props = defineProps<{ car: CarBase }>()

interface CarBaseData {
  id: number
  icon: Component
  label: string
  value?: string | number
}

const carBaseData = computed<CarBaseData[]>(() => [
  {
    id: 1,
    icon: MaterialSymbolsAutoTransmission,
    label: 'Коробка передач',
    value: props.car.model_transmission_type,
  },
  {
    id: 3,
    icon: LineMdEngineFilled,
    label: 'Мощность',
    value: props.car.model_engine_power_ps,
  },
  {
    id: 2,
    icon: FluentPerson32Filled,
    label: 'Мест',
    value: props.car.model_seats,
  },
])
</script>

<style scoped lang="scss">
.car-base {
  @include CarBlock;

  &__hero {
    margin-bottom: 32px;
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__year {
    font-size: 16px;
    padding: 8px 16px;
    border-radius: var(--border-radius-full);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    color: var(--neutral-300);
    white-space: nowrap;
  }

  &__title {
    font-size: 36px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--white);
    text-shadow: 0 8px 8px rgba(0, 0, 0, 1);
  }

  &__price-hero {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  &__price {
    font-size: 56px;
    font-weight: 600;
    line-height: 1;
    color: var(--white);
    text-shadow: 0 4px 12px rgba(0, 0, 0, 1);
  }

  &__price-currency {
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    color: var(--neutral-500);
  }

  &__specs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }

  &__spec-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px 16px;
    border-radius: var(--border-radius-3xl);
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
    text-align: center;
  }

  &__spec-icon-wrapper {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-full);
    background-color: var(--white);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  &__spec-icon {
    font-size: 28px;
    color: var(--black);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
  }

  &__spec-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__spec-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
  }

  &__spec-label {
    font-size: 11px;
    color: var(--neutral-500);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 500;
    line-height: 1.3;
  }
}
</style>
