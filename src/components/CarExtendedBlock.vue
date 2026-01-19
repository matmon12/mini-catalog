<template>
  <div class="car-extended">
    <h2 class="car-extended__title">
      <component :is="block.icon" />
      {{ block.title }}
    </h2>

    <div v-if="props.loading" class="car-extended__skeleton">
      <AppSkeleton
        v-for="i in 3"
        :key="i"
        class="car-extended__skeleton-item"
      />
    </div>

    <div v-else-if="hasData" class="car-extended__info">
      <template v-for="spec in block.specs" :key="spec.id">
        <div
          v-if="spec.value != null && spec.value !== ''"
          class="car-extended__info-item"
        >
          <span class="car-extended__info-label">{{ spec.label }}</span>
          <span class="car-extended__info-value">
            {{ spec.value }}
            {{ spec.unit ? ` ${spec.unit}` : '' }}
          </span>
        </div>
      </template>
    </div>

    <div v-else class="car-extended__empty">
      <i-fluent:box-search-20-regular class="car-extended__empty-icon" />
      <span class="car-extended__empty-text">Нет данных для отображения</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CarSpec {
  id: number
  label: string
  value?: string | number | null
  unit?: string
}

export interface CarExtendedBlock {
  id: number
  icon: Component
  title: string
  class: string
  specs: CarSpec[]
}

const props = withDefaults(
  defineProps<{
    block: CarExtendedBlock
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

// Проверяем, есть ли хотя бы одно значение для отображения
const hasData = computed(() => {
  return props.block.specs.some(
    (spec) => spec.value != null && spec.value !== '',
  )
})
</script>

<style scoped lang="scss">
.car-extended {
  @include CarBlock;
  display: flex;
  flex-direction: column;

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 20px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__info-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &__info-label {
    font-size: 16px;
    color: var(--neutral-400);
  }

  &__info-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--white);
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-item {
      height: 28px;
      border-radius: var(--border-radius-md);
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 20px 20px 40px 20px;
    color: var(--neutral-400);
    flex-grow: 1;

    &-icon {
      font-size: 60px;
      opacity: 0.5;
    }

    &-text {
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
