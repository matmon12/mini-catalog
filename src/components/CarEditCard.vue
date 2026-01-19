<template>
  <div class="car-edit-card">
    <!-- Изображение слева -->
    <div class="car-edit-card__image-wrapper">
      <AppSkeleton
        v-if="props.loading || (car.extended?.imageId && !loadedImage)"
        class="car-edit-card__image-loading"
      />
      <img
        v-if="car.extended?.imageUrl"
        :src="car.extended.imageUrl"
        :alt="`${car.make} ${car.model}`"
        :class="[
          'car-edit-card__image',
          { 'car-edit-card__image--hidden': !loadedImage },
        ]"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <i-ph:image
        v-else-if="!props.loading"
        class="car-edit-card__image-placeholder"
      />
    </div>

    <!-- Основная информация -->
    <div class="car-edit-card__content">
      <div class="car-edit-card__title-wrapper">
        <h3 class="car-edit-card__title">{{ car.make }} {{ car.model }}</h3>
        <div class="car-edit-card__year">{{ car.year }}</div>
      </div>

      <div class="car-edit-card__specs">
        <div class="car-edit-card__spec">
          <i-material-symbols-light:auto-transmission-outline />
          <span>{{ car.model_transmission_type }}</span>
        </div>
        <div class="car-edit-card__spec">
          <i-fluent:person-20-regular />
          <span>{{ car.model_seats }} мест</span>
        </div>
        <div class="car-edit-card__spec">
          <i-ph:engine />
          <span>{{ car.model_engine_power_ps }} л.с.</span>
        </div>
      </div>
    </div>

    <div class="car-edit-card__right">
      <div class="car-edit-card__price">
        <span>$</span>{{ formattedPrice(car.price) }}
      </div>

      <!-- Кнопка редактирования -->
      <div class="car-edit-card__actions">
        <AppButton
          :to="{ name: 'CarEditForm', params: { id: car.id } }"
          :icon="IGravityUiPencil"
          label="Редактировать"
          class="car-edit-card__button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Car } from '@/types'
import { formattedPrice } from '@/utils'
import IGravityUiPencil from '~icons/gravity-ui/pencil'

const props = withDefaults(defineProps<{ car: Car; loading?: boolean }>(), {
  loading: false,
})

const loadedImage = ref(false)

watch(
  () => props.car.extended?.imageUrl,
  () => {
    loadedImage.value = false
  },
)

const handleImageLoad = () => {
  loadedImage.value = true
}

const handleImageError = () => {
  loadedImage.value = true
}
</script>

<style scoped lang="scss">
.car-edit-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-radius: var(--border-radius-xl);
  background-color: var(--neutral-800);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &__image-loading {
    height: 100%;
    background-color: transparent;
  }

  &__image-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 200px;
    height: 120px;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    background-color: var(--neutral-900);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    width: 90%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;

    &--hidden {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
  }

  &__image-placeholder {
    font-size: 50px;
    color: rgba(255, 255, 255, 0.2);
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--white);
    @include TextOverflow(1);
  }

  &__year {
    flex-shrink: 0;
    font-size: 13px;
    padding: 4px 10px;
    border-radius: var(--border-radius-full);
    background-color: var(--neutral-700);
    font-weight: 500;
    color: var(--neutral-300);
    white-space: nowrap;
  }

  &__price {
    flex-shrink: 0;
    font-size: 30px;
    font-weight: 500;
    line-height: 1;
    color: var(--white);
    display: flex;
    align-items: baseline;
    gap: 4px;
    span {
      color: var(--neutral-500);
      font-size: 22px;
      margin-left: 4px;
    }
  }

  &__specs {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__spec {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--border-radius-lg);
    background-color: var(--neutral-900);
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 13px;
    color: var(--neutral-300);
    white-space: nowrap;

    svg {
      flex-shrink: 0;
      font-size: 16px;
      color: var(--neutral-400);
    }
  }

  &__actions {
    flex-shrink: 0;
  }

  &__button {
    padding: 12px 17px;
  }

  &__right {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-end;
    justify-content: space-between;
    margin-right: 10px;
  }
}
</style>
