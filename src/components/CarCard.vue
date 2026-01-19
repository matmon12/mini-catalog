<template>
  <router-link :to="{ name: 'CarPage', params: { id: car.id } }">
    <div class="car-card">
      <div class="car-card__header">
        <h2 class="car-card__title">{{ car.make }} {{ car.model }}</h2>
        <div class="car-card__year">{{ car.year }}</div>
      </div>

      <div class="car-card__image-wrapper">
        <i-svg-spinners:bars-rotate-fade
          v-if="props.loading || (car.extended?.imageUrl && !loadedImage)"
          class="car-card__image-loading"
        />
        <img
          v-if="car.extended?.imageUrl"
          :src="car.extended.imageUrl"
          :alt="`${car.make} ${car.model}`"
          :class="[
            'car-card__image',
            { 'car-card__image--hidden': !loadedImage },
          ]"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        <i-ph:image
          v-else-if="!props.loading"
          class="car-card__image-placeholder"
        />
      </div>

      <div class="car-card__specs">
        <div class="car-card__spec">
          <i-material-symbols-light:auto-transmission-outline />
          <span>{{ car.model_transmission_type }}</span>
        </div>
        <div class="car-card__spec">
          <i-fluent:person-20-regular />
          <span>{{ car.model_seats }}</span>
        </div>
        <div class="car-card__spec">
          <i-ph:engine />
          <span>{{ car.model_engine_power_ps }}</span>
        </div>
      </div>

      <div class="car-card__footer">
        <div class="car-card__price">
          {{ formattedPrice(car.price) }}<span>$</span>
        </div>
        <button class="car-card__button">
          <i-gravity-ui:arrow-right />
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Car } from '@/types'
import { formattedPrice } from '@/utils'

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
.car-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-3xl);
  display: flex;
  flex-direction: column;
  height: 400px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    180deg,
    #1a1a1a 0%,
    #1e1e1e 20%,
    #171717 50%,
    #0f0f0f 80%,
    #0a0a0a 100%
  );
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 150%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0.12) 20%,
      rgba(255, 255, 255, 0.06) 40%,
      rgba(255, 255, 255, 0.02) 60%,
      transparent 80%
    );
    pointer-events: none;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    min-height: 72px;
    flex-shrink: 0;
  }

  &__title {
    font-size: 26px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--white);
    text-shadow: 0 8px 8px rgba(0, 0, 0, 1);
    @include TextOverflow(2, 10px);
  }

  &__year {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: var(--border-radius-full);
    background-color: var(--neutral-700);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    font-weight: 500;
    color: var(--neutral-300);
    white-space: nowrap;
  }

  &__image-loading {
    font-size: 30px;
  }

  &__image-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    max-height: 200px;
    object-fit: cover;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))
      drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))
      drop-shadow(0 16px 32px rgba(0, 0, 0, 0.3));
    transform: opacity 0.3s ease;

    &--hidden {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
  }

  &__image-placeholder {
    width: 35%;
    color: rgba(255, 255, 255, 0.2);
  }

  &__specs {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  &__spec {
    background-color: var(--neutral-700);
    padding: 8px 12px;
    border-radius: var(--border-radius-full);
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    white-space: nowrap;

    svg {
      flex-shrink: 0;
      font-size: 14px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__price {
    font-size: 28px;
    font-weight: 500;
    line-height: 1;
    span {
      color: var(--neutral-600);
      font-size: 20px;
      margin-left: 5px;
    }
  }

  &__button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--white);
    color: var(--black);
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
