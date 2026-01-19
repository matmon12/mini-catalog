<template>
  <div class="car-image">
    <AppSkeleton
      v-if="props.loading || (imageUrl && !loadedImage)"
      class="car-image__skeleton"
    />
    <div
      v-if="imageUrl"
      :class="[
        'car-image__wrapper',
        { 'car-image__wrapper--hidden': !loadedImage },
      ]"
    >
      <img
        :src="props.imageUrl"
        :alt="alt"
        class="car-image__img"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>
    <i-ph:image v-else-if="!props.loading" class="car-image__placeholder" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    imageUrl?: string
    alt: string
    loading?: boolean
  }>(),
  {
    imageUrl: undefined,
    loading: false,
  },
)

const loadedImage = ref(false)

watch(
  () => props.imageUrl,
  () => (loadedImage.value = false),
)

const handleImageLoad = () => {
  loadedImage.value = true
}

const handleImageError = () => {
  loadedImage.value = true
}
</script>

<style scoped lang="scss">
.car-image {
  @include CarBlock;
  position: relative;

  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;

    &--hidden {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
  }

  &__skeleton {
    height: 100%;
    border-radius: var(--border-radius-xl);
  }

  &__img {
    width: 90%;
    height: 100%;
    max-height: 300px;
    object-fit: cover;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))
      drop-shadow(0 16px 32px rgba(0, 0, 0, 0.4))
      drop-shadow(0 24px 48px rgba(0, 0, 0, 0.3));
  }

  &__placeholder {
    height: 100%;
    display: block;
    font-size: 100px;
    color: rgba(255, 255, 255, 0.2);
    margin: auto;
  }
}
</style>
