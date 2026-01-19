<template>
  <AppSkeleton v-if="props.loading" class="app-input__skeleton" />

  <div
    v-else
    :class="['app-input__wrapper', { 'is--invalid': isInvalid }, attrs.class]"
    @click="inputRef?.focus()"
  >
    <component :is="props.icon" class="app-input__icon"/>

    <input
      :id="inputId"
      ref="inputRef"
      v-model="inputValue"
      :placeholder="props.placeholder"
      :type="props.type"
      :name="props.name"
      v-bind="filteredAttrs"
      class="app-input"
      v-on="validationListeners"
    />

    <div v-if="showControls" class="app-input__controls">
      <button v-if="showClear" class="app-input__btn" @click="onClear">
        <i-fluent:dismiss-circle-24-regular />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component, InputHTMLAttributes } from 'vue'
import { useField } from 'vee-validate'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    placeholder?: string
    clearable?: boolean
    type?: string
    name?: string
    invalid?: boolean
    validate?: boolean
    loading?: boolean
    icon?: Component
  }>(),
  {
    placeholder: 'Введите текст...',
    clearable: true,
    type: 'text',
    name: '',
    invalid: false,
    validate: false,
    loading: false,
    icon: undefined,
  },
)

const modelValue = defineModel<string | number | undefined | null>()
const inputRef = ref<HTMLInputElement | null>(null)
const attrs = useAttrs() as InputHTMLAttributes
const injectId = inject<string | undefined>('formItemId', undefined)
const notifyIdUsed = inject<(() => void) | undefined>(
  'formItemIdUsed',
  undefined,
)

// Уведомляем об использовании ID родительский компонент
if (injectId && notifyIdUsed) {
  notifyIdUsed()
}

const filteredAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, class: _, ...rest } = attrs

  if (props.type === 'number' && !('step' in attrs)) {
    return { ...rest, step: 'any' }
  }

  return rest
})

const inputId = computed<string | undefined>(
  () => attrs.id || injectId || undefined,
)

const showControls = computed<boolean>(() => showClear.value)
const showClear = computed<boolean>(
  () => props.clearable && inputValue.value != null && inputValue.value !== '',
)
const isInvalid = computed<boolean>(
  () => props.invalid || (hasValidation.value ? !!errorMessage.value : false),
)
const hasValidation = computed<boolean>(() => props.validate && !!props.name)

// VALIDATION
const validationResult = hasValidation.value
  ? useField<string | number | undefined | null>(() => props.name, undefined, {
      validateOnValueUpdate: false,
      syncVModel: true,
    })
  : null

const errorMessage = computed(() => validationResult?.errorMessage.value)
const handleChange = validationResult?.handleChange
const resetField = validationResult?.resetField
const value = computed(() => validationResult?.value.value)

// значения инпута в режиме валидации и без
const inputValue = computed<string | number | undefined | null>({
  get: () => (hasValidation.value ? value.value : modelValue.value),
  set: (newValue) => {
    let normalizedValue = newValue
    if (props.type === 'number' && (newValue === '' || newValue === null)) {
      normalizedValue = undefined
    }
    if (hasValidation.value && validationResult?.value) {
      validationResult.value.value = normalizedValue
    } else {
      modelValue.value = normalizedValue
    }
  },
})

// агрессивная валидация если невалидно
const validationListeners = computed(() => {
  if (hasValidation.value && handleChange) {
    return {
      input: (evt: Event) => handleChange(evt, !!errorMessage.value),
    }
  }
  return {}
})

const onClear = (e: MouseEvent) => {
  e.stopPropagation()

  const clearValue = props.type === 'number' ? undefined : ''
  if (hasValidation.value && resetField) {
    resetField({ value: clearValue })
  } else {
    modelValue.value = clearValue
  }
}
</script>

<style scoped lang="scss">
.app-input {
  width: 100%;
  color: var(--white);
  font-size: 16px;

  &::placeholder {
    color: var(--neutral-400);
  }

  // Скрытие стрелок для input[type="number"]
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      display: none;
      margin: 0;
    }
  }

  &__wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background-color: var(--neutral-900);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: border-color 0.3s ease;
    cursor: text;

    &:has(input:focus) {
      border-color: rgba(255, 255, 255, 0.5);
    }

    &.is--invalid {
      border-color: var(--red-400);

      input::placeholder {
        color: var(--red-300);
      }
    }

    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    color: var(--neutral-400);
    cursor: pointer;
    transition: color 0.2s ease;

    svg {
      font-size: 16px;
    }

    &:hover {
      color: var(--white);
    }
  }

  &__skeleton {
    height: 40px;
    border-radius: var(--border-radius-lg);
  }

  &__icon {
    width: 20px;
    margin-right: 10px;
  }
}
</style>
