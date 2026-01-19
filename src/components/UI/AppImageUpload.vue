<template>
  <AppSkeleton v-if="props.loading" class="app-image-upload__skeleton" />

  <div v-else class="app-image-upload">
    <input
      ref="fileInputRef"
      type="file"
      :accept="formatImage"
      class="app-image-upload__input"
      @change="handleFileChange"
    />

    <!-- Отображение ошибки -->
    <div v-if="error" class="app-image-upload__error">
      {{ error }}
    </div>

    <!-- Если изображение не выбрано -->
    <div
      v-if="!displayImageUrl"
      ref="dropZoneRef"
      :class="['app-image-upload__placeholder', { 'is--over': isOverDropZone }]"
      @click="triggerFileInput"
    >
      <i-ion:cloud-upload-outline />
      <div class="app-image-upload__text">
        <p v-if="!props.placeholder">
          Перетащите изображение сюда или <span>нажмите для загрузки</span>.
        </p>
        <p v-else>
          {{ props.placeholder }}
        </p>
      </div>
    </div>

    <!-- Предпросмотр изображения (для File или URL) -->
    <div v-else class="app-image-upload__preview">
      <div class="app-image-upload__image-wrapper">
        <i-svg-spinners:bars-rotate-fade
          v-if="!loadedImage"
          class="app-image-upload__image-loading"
        />
        <img
          :src="displayImageUrl"
          :alt="fileName"
          :class="[
            'app-image-upload__image',
            { 'app-image-upload__image--hidden': !loadedImage },
          ]"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>
      <div class="app-image-upload__footer">
        <div class="app-image-upload__info">
          <span class="app-image-upload__name">{{ fileName }}</span>
          <span class="app-image-upload__size">
            {{ formatFileSize(fileSize) }}
          </span>
        </div>
        <button
          type="button"
          class="app-image-upload__remove"
          :disabled="!loadedImage"
          @click="removeFile"
        >
          <i-ion:close-outline />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    format?: 'all' | 'png' | 'jpeg'
    maxSize?: number
    loading?: boolean
  }>(),
  {
    placeholder: undefined,
    format: 'all',
    maxSize: 2 * 1024 * 1024, // 2 МБ
    loading: false,
  },
)
const modelValue = defineModel<File | null | string>()
const fileInputRef = ref<HTMLInputElement | null>(null)
const dropZoneRef = useTemplateRef<HTMLElement>('dropZoneRef')
const previewUrl = ref<string | null>(null)
const error = ref<string | null>(null)
const loadedImage = ref<boolean>(false)

const formatImage = computed<string>(
  () => `image/${props.format === 'all' ? '*' : props.format}`,
)

// URL для отображения изображения (previewUrl для File или modelValue для URL)
const displayImageUrl = computed<string | null>(() => {
  if (typeof modelValue.value === 'string') {
    return modelValue.value
  }
  return previewUrl.value
})

const fileName = computed<string | undefined>(() => {
  if (modelValue.value instanceof File) {
    return modelValue.value.name
  }
  return undefined
})

const fileSize = computed<number | undefined>(() => {
  if (modelValue.value instanceof File) {
    return modelValue.value.size
  }
  return undefined
})

// Обработка выбора файла (input)
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (file) {
    processFile(file)
  }
}

// Получение сообщения об ошибке для конкретного формата
const getFormatErrorMessage = (): string => {
  if (props.format === 'all') {
    return 'Неподдерживаемый тип файла. Выберите изображение.'
  }
  if (props.format === 'jpeg') {
    return 'Недопустимый формат изображения. Допустимые форматы: jpeg, jpg.'
  }
  return `Недопустимый формат изображения. Допустимый формат: ${props.format}.`
}

// Проверка формата файла
const isValidFormat = (file: File): boolean => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Неподдерживаемый тип файла. Выберите изображение.'
    return false
  }

  if (props.format === 'all') return true

  if (props.format === 'jpeg') {
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      return true
    }
    error.value = getFormatErrorMessage()
    return false
  }

  if (file.type === `image/${props.format}`) {
    return true
  }

  error.value = getFormatErrorMessage()
  return false
}

const isValidSize = (file: File): boolean => {
  if (file.size > props.maxSize) {
    error.value = `Файл слишком большой (${formatFileSize(file.size)}). Максимальный размер: ${formatFileSize(props.maxSize)}.`
    return false
  }
  return true
}

const processFile = (file: File) => {
  error.value = null

  if (!isValidFormat(file)) {
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    return
  }

  if (!isValidSize(file)) {
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    return
  }

  modelValue.value = file

  // Создаем предпросмотр изображения
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Открытие диалога выбора файла
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Удаление выбранного файла
const removeFile = () => {
  previewUrl.value = null
  modelValue.value = null
  error.value = null

  // Очищаем input для возможности повторного выбора того же файла
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// очистка если модель была удалена
watch(
  () => modelValue.value,
  () => {
    if (!modelValue.value) {
      removeFile()
    }
  },
)

// Форматирование размера файла
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Обработка выбора файла (drop)
const onImageDrop = (files: File[] | null) => {
  const file = files?.[0] || null

  if (file) {
    processFile(file)
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: onImageDrop,
  multiple: false,
})

// Обработка предзагрузки изображения
const handleImageError = () => {
  loadedImage.value = true
}

const handleImageLoad = () => {
  loadedImage.value = true
}

watch(
  () => displayImageUrl.value,
  () => {
    loadedImage.value = false
  },
)
</script>

<style scoped lang="scss">
.app-image-upload {
  width: 100%;
  height: 300px;
  position: relative;
  background-color: var(--neutral-900);
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
    appearance: none;
    pointer-events: none;
  }

  &__placeholder {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    cursor: pointer;
    border: 2px dashed #9dd1ec;
    border-radius: var(--border-radius-lg);
    background-color: var(--neutral-900);

    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;

    &:hover {
      border-color: #3cbbff;
    }

    svg {
      font-size: 60px;
    }

    &.is--over {
      border-color: #3cbbff;
      background-color: rgba(103, 202, 255, 0.1);
    }
  }

  &__text {
    font-size: 16px;
    color: var(--white);
    max-width: 80%;
    text-align: center;
    line-height: 1.5;

    span {
      color: #9dd1ec;
    }
  }

  &__error {
    padding: 12px;
    margin-bottom: 12px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: var(--border-radius-lg);
    color: #ef4444;
    font-size: 14px;
  }

  &__preview {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    background-color: var(--neutral-800);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.3s ease;
  }

  &__image--hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__image-loading {
    font-size: 40px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-size: 18px;
    line-height: 1;
    @include TextOverflow(1);
  }

  &__size {
    color: var(--neutral-500);
  }

  &__remove {
    background-color: var(--red-400);
    color: var(--black);
    padding: 5px;
    width: 40px;
    height: 40px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-lg);
    transition: background-color 0.3s ease;

    :deep(svg path) {
      stroke-width: 40px;
    }

    &:not(:disabled):hover {
      background-color: var(--red-300);
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  &__skeleton {
    width: 100%;
    height: 300px;
    border-radius: var(--border-radius-xl);
  }
}
</style>
