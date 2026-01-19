<template>
  <component
    :is="props.to ? 'router-link' : 'button'"
    v-bind="
      props.to
        ? { to: props.to }
        : { disabled: props.disabled, type: props.type }
    "
    :class="['app-button', `app-button--${props.severity}`]"
  >
    <slot>
      <component :is="icon" v-if="props.label" class="app-button__icon" />
      <span v-if="props.label" class="app-button__label">{{
        props.label
      }}</span>
    </slot>
  </component>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: Component
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
    disabled?: boolean
    severity?: 'primary' | 'secondary'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    label: '',
    icon: undefined,
    to: undefined,
    // disabled: false,
    severity: 'primary',
    type: 'button',
  },
)
</script>

<style scoped lang="scss">
.app-button {
  padding: 10px 17px;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }

  &__icon {
  }

  &__label {
  }
}

.app-button--primary {
  background-color: var(--white);
  color: var(--black);

  &:not(:disabled):hover {
    background-color: var(--neutral-300);
  }
}

.app-button--secondary {
  background-color: var(--neutral-700);
  color: var(--white);

  &:not(:disabled):hover {
    background-color: var(--neutral-600);
  }
}
</style>
