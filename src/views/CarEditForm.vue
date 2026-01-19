<template>
  <div class="car-create">
    <h1 class="car-create__title">Редактировать автомобиль</h1>

    <AppSpinner v-if="loading" />

    <AppError v-else-if="error" :message="error" :retry="loadCarData" />

    <template v-else>
      <AppAlert
        type="error"
        title="Ошибка при загрузке данных"
        :message="errorExtended"
        :autoclose="3000"
        @dismiss="carsStore.clearErrorExtended"
      />

      <AppAlert
        type="error"
        title="Ошибка при сохранении данных"
        :message="errorSubmit || errorUpload"
        :autoclose="3000"
        @dismiss="errorSubmit = errorUpload = null"
      />

      <AppAlert
        type="success"
        title="Успешно"
        :message="successSubmit"
        :autoclose="3000"
        @dismiss="successSubmit = null"
      />

      <AppSpinner v-if="loadingSubmit" class="car-create__form-spinner" />

      <form class="car-create__form" @submit="onSubmit">
        <!-- Базовые данные -->
        <CarBaseBlock v-if="car" :car="car" />

        <!-- Изображение -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">Изображение</h2>
          <AppFormItem
            label="Изображение автомобиля (вид с боку)"
            required
            :error="errors.image"
          >
            <AppImageUpload
              v-model="image"
              v-bind="imageAttrs"
              name="image"
              :loading="loadingExtended"
            />
          </AppFormItem>
        </div>

        <!-- Кузов и общие характеристики -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">
            Кузов и общие характеристики
          </h2>
          <div class="car-create__fields">
            <AppFormItem label="Тип кузова" required :error="errors.model_body">
              <AppInput name="model_body" validate :loading="loadingExtended" />
            </AppFormItem>
            <div class="car-create__row">
              <AppFormItem label="Количество дверей">
                <AppInput
                  v-model="optionalFields.model_doors"
                  name="model_doors"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Привод">
                <AppInput
                  v-model="optionalFields.model_drive"
                  name="model_drive"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <AppFormItem label="Вес (кг)">
              <AppInput
                v-model="optionalFields.model_weight_kg"
                name="model_weight_kg"
                type="number"
                :loading="loadingExtended"
              />
            </AppFormItem>
          </div>
        </div>

        <!-- Двигатель -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">Двигатель</h2>
          <div class="car-create__fields">
            <div class="car-create__row">
              <AppFormItem
                label="Объем двигателя (см³)"
                required
                :error="errors.model_engine_cc"
              >
                <AppInput
                  name="model_engine_cc"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem
                label="Тип двигателя"
                required
                :error="errors.model_engine_type"
              >
                <AppInput
                  name="model_engine_type"
                  validate
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <div class="car-create__row">
              <AppFormItem label="Тип топлива">
                <AppInput
                  v-model="optionalFields.model_engine_fuel"
                  name="model_engine_fuel"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Степень сжатия">
                <AppInput
                  v-model="optionalFields.model_engine_compression"
                  name="model_engine_compression"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <div class="car-create__row">
              <AppFormItem label="Мощность при оборотах (об/мин)">
                <AppInput
                  v-model="optionalFields.model_engine_power_rpm"
                  name="model_engine_power_rpm"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Крутящий момент (Н·м)">
                <AppInput
                  v-model="optionalFields.model_engine_torque_nm"
                  name="model_engine_torque_nm"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <AppFormItem label="Крутящий момент при оборотах (об/мин)">
              <AppInput
                v-model="optionalFields.model_engine_torque_rpm"
                name="model_engine_torque_rpm"
                type="number"
                :loading="loadingExtended"
              />
            </AppFormItem>
          </div>
        </div>

        <!-- Габариты -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">Габариты</h2>
          <div class="car-create__fields">
            <div class="car-create__row">
              <AppFormItem
                label="Длина (мм)"
                required
                :error="errors.model_length_mm"
              >
                <AppInput
                  name="model_length_mm"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem
                label="Ширина (мм)"
                required
                :error="errors.model_width_mm"
              >
                <AppInput
                  name="model_width_mm"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <div class="car-create__row">
              <AppFormItem label="Высота (мм)">
                <AppInput
                  v-model="optionalFields.model_height_mm"
                  name="model_height_mm"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Колесная база (мм)">
                <AppInput
                  v-model="optionalFields.model_wheelbase_mm"
                  name="model_wheelbase_mm"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
          </div>
        </div>

        <!-- Расход топлива -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">Расход топлива</h2>
          <div class="car-create__fields">
            <div class="car-create__row">
              <AppFormItem
                label="Расход в городе (л/100км)"
                required
                :error="errors.model_lkm_city"
              >
                <AppInput
                  name="model_lkm_city"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem
                label="Расход на трассе (л/100км)"
                required
                :error="errors.model_lkm_hwy"
              >
                <AppInput
                  name="model_lkm_hwy"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <div class="car-create__row">
              <AppFormItem label="Смешанный расход (л/100км)">
                <AppInput
                  v-model="optionalFields.model_lkm_mixed"
                  name="model_lkm_mixed"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Объем топливного бака (л)">
                <AppInput
                  v-model="optionalFields.model_fuel_cap_l"
                  name="model_fuel_cap_l"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
            <AppFormItem label="Выбросы CO₂ (г/км)">
              <AppInput
                v-model="optionalFields.model_co2"
                name="model_co2"
                type="number"
                :loading="loadingExtended"
              />
            </AppFormItem>
          </div>
        </div>

        <!-- Производительность -->
        <div class="car-create__section">
          <h2 class="car-create__section-title">Производительность</h2>
          <div class="car-create__fields">
            <div class="car-create__row">
              <AppFormItem
                label="Максимальная скорость (км/ч)"
                required
                :error="errors.model_top_speed_kph"
              >
                <AppInput
                  name="model_top_speed_kph"
                  validate
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
              <AppFormItem label="Разгон 0-100 км/ч (сек)">
                <AppInput
                  v-model="optionalFields.model_0_to_100_kph"
                  name="model_0_to_100_kph"
                  type="number"
                  :loading="loadingExtended"
                />
              </AppFormItem>
            </div>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="car-create__section car-create__btns">
          <AppButton
            :disabled="loadingExtended || loadingSubmit"
            type="button"
            label="Сбросить"
            severity="secondary"
            class="car-create__btn car-create__reset"
            @click="handleResetForm"
          />
          <AppButton
            :disabled="!hasChanges || loadingExtended || loadingSubmit"
            type="submit"
            class="car-create__btn car-create__submit"
          >
            <i-svg-spinners:180-ring v-if="loadingSubmit" />
            {{ loadingSubmit ? 'Сохранение...' : 'Сохранить' }}
          </AppButton>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CarExtended } from '@/types'
import { useForm } from 'vee-validate'
import type { InvalidSubmissionContext } from 'vee-validate'
import { object, string, number, mixed } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import axios from 'axios'
import { useCarsStore } from '@/stores/cars'
import { storeToRefs } from 'pinia'
import { deepEquals, normalizeOptionalFields, normalizeObject } from '@/utils'

const props = defineProps<{ id: string }>()

const carsStore = useCarsStore()

// Получаем реактивные данные из store
const { loading, loadingExtended, error, errorExtended } =
  storeToRefs(carsStore)

// Получаем автомобиль из store по ID
const car = computed(() => {
  const carId = Number(props.id)
  return carsStore.getCarById(carId)
})

// ============================================
// ТИПЫ ДАННЫХ
// ============================================

interface CarFormValidatedFields {
  image: File | string | null
  model_body: string
  model_engine_cc: number
  model_engine_type: string
  model_length_mm: number
  model_width_mm: number
  model_lkm_hwy: number
  model_lkm_city: number
  model_top_speed_kph: number
}

interface CarFormOptionalFields {
  model_engine_power_rpm?: number | null
  model_engine_torque_nm?: number | null
  model_engine_torque_rpm?: number | null
  model_engine_compression?: number | null
  model_engine_fuel?: string | null
  model_drive?: string | null
  model_doors?: number | null
  model_weight_kg?: number | null
  model_height_mm?: number | null
  model_wheelbase_mm?: number | null
  model_lkm_mixed?: number | null
  model_fuel_cap_l?: number | null
  model_co2?: number | null
  model_0_to_100_kph?: number | null
}

// ============================================
// НАЧАЛЬНЫЕ ЗНАЧЕНИЯ
// ============================================

const initialValidatedFields: Partial<CarFormValidatedFields> = {
  image: null,
  model_body: undefined,
  model_engine_cc: undefined,
  model_engine_type: undefined,
  model_length_mm: 10000,
  model_width_mm: undefined,
  model_lkm_hwy: undefined,
  model_lkm_city: 20,
  model_top_speed_kph: undefined,
}

const initialOptionalFields: CarFormOptionalFields = {
  model_engine_power_rpm: undefined,
  model_engine_torque_nm: undefined,
  model_engine_torque_rpm: undefined,
  model_engine_compression: undefined,
  model_engine_fuel: undefined,
  model_drive: undefined,
  model_doors: undefined,
  model_weight_kg: undefined,
  model_height_mm: undefined,
  model_wheelbase_mm: undefined,
  model_lkm_mixed: undefined,
  model_fuel_cap_l: undefined,
  model_co2: undefined,
  model_0_to_100_kph: undefined,
}

// ============================================
// ВАЛИДАЦИЯ
// ============================================

const validationSchema = toTypedSchema(
  object({
    image: mixed<File>()
      .nullable()
      .test('is-file', 'Необходимо загрузить изображение', (value) => {
        return value !== null && value !== undefined
      }),
    model_body: string().required('Тип кузова обязателен для заполнения'),
    model_engine_cc: number()
      .required('Объем двигателя обязателен для заполнения')
      .typeError('Объем двигателя должен быть числом')
      .min(500, 'Объем двигателя должен быть не менее 500 см³')
      .max(10000, 'Объем двигателя не может быть больше 10000 см³'),
    model_engine_type: string().required(
      'Тип двигателя обязателен для заполнения',
    ),
    model_length_mm: number()
      .required('Длина обязательна для заполнения')
      .typeError('Длина должна быть числом')
      .min(1000, 'Длина должна быть не менее 1000 мм')
      .max(10000, 'Длина не может быть больше 10000 мм'),
    model_width_mm: number()
      .required('Ширина обязательна для заполнения')
      .typeError('Ширина должна быть числом')
      .min(1000, 'Ширина должна быть не менее 1000 мм')
      .max(3000, 'Ширина не может быть больше 3000 мм'),
    model_lkm_hwy: number()
      .required('Расход на трассе обязателен для заполнения')
      .typeError('Расход на трассе должен быть числом')
      .min(1, 'Расход на трассе должен быть не менее 1 л/100км')
      .max(50, 'Расход на трассе не может быть больше 50 л/100км'),
    model_lkm_city: number()
      .required('Расход в городе обязателен для заполнения')
      .typeError('Расход в городе должен быть числом')
      .min(1, 'Расход в городе должен быть не менее 1 л/100км')
      .max(50, 'Расход в городе не может быть больше 50 л/100км'),
    model_top_speed_kph: number()
      .required('Максимальная скорость обязательна для заполнения')
      .typeError('Максимальная скорость должна быть числом')
      .min(50, 'Максимальная скорость должна быть не менее 50 км/ч')
      .max(500, 'Максимальная скорость не может быть больше 500 км/ч'),
  }),
)

const { handleSubmit, resetForm, errors, defineField, values } =
  useForm<CarFormValidatedFields>({
    validationSchema: validationSchema,
    initialValues: initialValidatedFields,
  })

// ============================================
// ВАЛИДИРУЕМЫЕ И НЕВАЛИДИРУЕМЫЕ ПОЛЯ
// ============================================

const [image, imageAttrs] = defineField('image', (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  }
})

const optionalFields = ref<CarFormOptionalFields>(
  structuredClone(initialOptionalFields),
)

const hasChanges = computed<boolean>(() => {
  type NormalizedFormData = Partial<CarFormValidatedFields> &
    CarFormOptionalFields

  const newValues: NormalizedFormData = {
    ...normalizeObject(values),
    ...normalizeObject(optionalFields.value),
  }

  let oldValues: NormalizedFormData
  if (car.value?.extended) {
    const extended = car.value.extended
    const extendedForCompare = {
      image: extended.imageUrl,
      model_body: extended.model_body,
      model_engine_cc: extended.model_engine_cc,
      model_engine_type: extended.model_engine_type,
      model_length_mm: extended.model_length_mm,
      model_width_mm: extended.model_width_mm,
      model_lkm_hwy: extended.model_lkm_hwy,
      model_lkm_city: extended.model_lkm_city,
      model_top_speed_kph: extended.model_top_speed_kph,
      model_engine_power_rpm: extended.model_engine_power_rpm,
      model_engine_torque_nm: extended.model_engine_torque_nm,
      model_engine_torque_rpm: extended.model_engine_torque_rpm,
      model_engine_compression: extended.model_engine_compression,
      model_engine_fuel: extended.model_engine_fuel,
      model_drive: extended.model_drive,
      model_doors: extended.model_doors,
      model_weight_kg: extended.model_weight_kg,
      model_wheelbase_mm: extended.model_wheelbase_mm,
      model_height_mm: extended.model_height_mm,
      model_lkm_mixed: extended.model_lkm_mixed,
      model_fuel_cap_l: extended.model_fuel_cap_l,
      model_co2: extended.model_co2,
      model_0_to_100_kph: extended.model_0_to_100_kph,
    }
    oldValues = normalizeObject(extendedForCompare)
  } else {
    oldValues = {
      ...normalizeObject(initialValidatedFields),
      ...normalizeObject(initialOptionalFields),
    }
  }

  return !deepEquals(newValues, oldValues)
})

// ============================================
// ОБРАБОТЧИКИ
// ============================================

const handleErrors = ({ errors }: InvalidSubmissionContext) => {
  const firstError = Object.keys(initialValidatedFields).find(
    (field) => errors[field],
  )

  if (firstError) {
    const el = document.querySelector(`[name="${firstError}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    if (el instanceof HTMLInputElement) {
      el.focus()
    }
  }
}

const handleResetForm = () => {
  // сброс валидируемых полей
  resetForm({ values: initialValidatedFields })

  // сброс не валидируемых полей
  optionalFields.value = structuredClone(initialOptionalFields)
}

// ============================================
// ОТПРАВКА ДАННЫХ
// ============================================
const loadingSubmit = ref<boolean>(false)
const errorSubmit = ref<string | null>(null)
const errorUpload = ref<string | null>(null)
const successSubmit = ref<string | null>(null)

const onSubmit = handleSubmit(async (validatedValues) => {
  if (!car.value) return

  loadingSubmit.value = true
  errorSubmit.value = null
  errorUpload.value = null
  successSubmit.value = null

  try {
    let imageUrl = car.value.extended?.imageUrl
    let imageId = car.value.extended?.imageId

    if (validatedValues.image instanceof File) {
      const imageData = await uploadFile(validatedValues.image)
      if (imageData) {
        imageUrl = imageData.url
        imageId = imageData.id
      }
    }

    const data: CarExtended = {
      id: car.value.extended?.id,
      carId: car.value.id,
      ...(imageUrl && { imageUrl }),
      ...(imageId && { imageId }),
      model_body: validatedValues.model_body,
      model_engine_cc: validatedValues.model_engine_cc,
      model_engine_type: validatedValues.model_engine_type,
      model_length_mm: validatedValues.model_length_mm,
      model_width_mm: validatedValues.model_width_mm,
      model_lkm_hwy: validatedValues.model_lkm_hwy,
      model_lkm_city: validatedValues.model_lkm_city,
      model_top_speed_kph: validatedValues.model_top_speed_kph,

      model_engine_power_rpm: normalizeOptionalFields(
        optionalFields.value.model_engine_power_rpm,
        car.value.extended?.model_engine_power_rpm != null,
      ),
      model_engine_torque_nm: normalizeOptionalFields(
        optionalFields.value.model_engine_torque_nm,
        car.value.extended?.model_engine_torque_nm != null,
      ),
      model_engine_torque_rpm: normalizeOptionalFields(
        optionalFields.value.model_engine_torque_rpm,
        car.value.extended?.model_engine_torque_rpm != null,
      ),
      model_engine_compression: normalizeOptionalFields(
        optionalFields.value.model_engine_compression,
        car.value.extended?.model_engine_compression != null,
      ),
      model_engine_fuel: normalizeOptionalFields(
        optionalFields.value.model_engine_fuel,
        car.value.extended?.model_engine_fuel != null,
      ),
      model_drive: normalizeOptionalFields(
        optionalFields.value.model_drive,
        car.value.extended?.model_drive != null,
      ),
      model_doors: normalizeOptionalFields(
        optionalFields.value.model_doors,
        car.value.extended?.model_doors != null,
      ),
      model_weight_kg: normalizeOptionalFields(
        optionalFields.value.model_weight_kg,
        car.value.extended?.model_weight_kg != null,
      ),
      model_wheelbase_mm: normalizeOptionalFields(
        optionalFields.value.model_wheelbase_mm,
        car.value.extended?.model_wheelbase_mm != null,
      ),
      model_height_mm: normalizeOptionalFields(
        optionalFields.value.model_height_mm,
        car.value.extended?.model_height_mm != null,
      ),
      model_lkm_mixed: normalizeOptionalFields(
        optionalFields.value.model_lkm_mixed,
        car.value.extended?.model_lkm_mixed != null,
      ),
      model_fuel_cap_l: normalizeOptionalFields(
        optionalFields.value.model_fuel_cap_l,
        car.value.extended?.model_fuel_cap_l != null,
      ),
      model_co2: normalizeOptionalFields(
        optionalFields.value.model_co2,
        car.value.extended?.model_co2 != null,
      ),
      model_0_to_100_kph: normalizeOptionalFields(
        optionalFields.value.model_0_to_100_kph,
        car.value.extended?.model_0_to_100_kph != null,
      ),
    }

    if (!deepEquals(data, car.value.extended)) {
      await updateCar(data)

      if (
        imageId &&
        car.value.extended?.imageId &&
        imageId !== car.value.extended.imageId
      ) {
        await deleteImage(car.value.extended.imageId)
      }

      // Обновляем данные в store
      const carId = Number(props.id)
      carsStore.updateCarExtended(carId, data)

      successSubmit.value = 'Данные успешно обновлены'
    } else {
      throw new Error('Нет изменений')
    }
  } catch (e) {
    errorSubmit.value = e instanceof Error ? e.message : 'Неизвестная ошибка'
    console.error('Ошибка при отправке данных:', e)
  } finally {
    loadingSubmit.value = false
  }
}, handleErrors)

const uploadFile = async (
  image: File,
): Promise<{ url: string; id: string } | null> => {
  const formData = new FormData()
  formData.append('file', image)

  try {
    const response = await axios.post(
      'https://83ef7ece9de7dfdb.mokky.dev/uploads',
      formData,
    )

    return {
      url: response.data.url,
      id: response.data.id,
    }
  } catch (e) {
    errorUpload.value = 'Ошибка при загрузке изображения'
    console.error('Ошибка при загрузке изображения:', e)
    return null
  }
}

const deleteImage = async (imageId: string) => {
  try {
    await axios.delete(`https://83ef7ece9de7dfdb.mokky.dev/uploads/${imageId}`)
  } catch (e) {
    console.error('Ошибка при удалении изображения:', e)
  }
}

const updateCar = async (data: CarExtended) => {
  try {
    await axios.patch(
      `https://83ef7ece9de7dfdb.mokky.dev/cars/${car.value?.extended?.id}`,
      data,
    )
  } catch (e) {
    // Если запись не найдена (404), создаем новую (POST)
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      try {
        await axios.post(`https://83ef7ece9de7dfdb.mokky.dev/cars`, data)
      } catch (createError) {
        console.error('Ошибка при создании данных об автомобиле:', createError)
        throw createError
      }
    } else {
      console.error('Ошибка при обновлении данных об автомобиле:', e)
      throw e
    }
  }
}

// ============================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ============================================

const loadCarData = async () => {
  const carId = Number(props.id)
  await carsStore.loadCarById(carId, { redirectOnNotFound: true })

  // при перезагрузке страницы
  if (!car.value?.extended) {
    handleResetForm()
  }
}

const populateForm = () => {
  if (!car.value?.extended) return

  const extended = car.value.extended

  resetForm({
    values: {
      image: extended.imageUrl || null,
      model_body: extended.model_body,
      model_engine_cc: extended.model_engine_cc,
      model_engine_type: extended.model_engine_type,
      model_length_mm: extended.model_length_mm,
      model_width_mm: extended.model_width_mm,
      model_lkm_hwy: extended.model_lkm_hwy,
      model_lkm_city: extended.model_lkm_city,
      model_top_speed_kph: extended.model_top_speed_kph,
    },
  })

  optionalFields.value = {
    model_engine_power_rpm: extended.model_engine_power_rpm,
    model_engine_torque_nm: extended.model_engine_torque_nm,
    model_engine_torque_rpm: extended.model_engine_torque_rpm,
    model_engine_compression: extended.model_engine_compression,
    model_engine_fuel: extended.model_engine_fuel,
    model_drive: extended.model_drive,
    model_doors: extended.model_doors,
    model_weight_kg: extended.model_weight_kg,
    model_wheelbase_mm: extended.model_wheelbase_mm,
    model_height_mm: extended.model_height_mm,
    model_lkm_mixed: extended.model_lkm_mixed,
    model_fuel_cap_l: extended.model_fuel_cap_l,
    model_co2: extended.model_co2,
    model_0_to_100_kph: extended.model_0_to_100_kph,
  }
}

onMounted(() => {
  loadCarData()
})

watch(
  () => props.id,
  () => {
    loadCarData()
  },
)

// Автоматическое заполнение формы при загрузке и изменении расширенных данных
watch(
  () => car.value?.extended,
  () => {
    if (car.value?.extended) {
      populateForm()
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.car-create {
  width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;

  &__title {
    font-size: 40px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    position: relative;
  }

  &__form-spinner {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    background-color: var(--neutral-800);
    border-radius: var(--border-radius-xl);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--white);
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  &__btns {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
