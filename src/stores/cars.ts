import { Car, CarBase, CarExtended } from '@/types'
import { simulateError } from '@/utils'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'

export const useCarsStore = defineStore('cars', () => {
  const route = useRoute()

  // ============================================
  // STATE
  // ============================================
  const carsBase = ref<CarBase[]>([])
  const carsExtended = ref<Map<number, CarExtended>>(new Map())

  const loading = ref<boolean>(false)
  const loadingExtended = ref<boolean>(false)
  const error = ref<string | null>(null)
  const errorExtended = ref<string | null>(null)

  // ============================================
  // COMPUTED
  // ============================================
  /**
   * Получить все автомобили с расширенными данными (если есть в кеше)
   */
  const getAllCars = computed<Car[]>(() => {
    return carsBase.value.map((car) => {
      const extended = carsExtended.value.get(car.id)
      return {
        ...car,
        extended,
      }
    })
  })

  /**
   * Получить автомобиль по ID с расширенными данными (если есть в кеше)
   */
  const getCarById = computed(() => {
    return (id: number): Car | null => {
      const base = carsBase.value.find((car) => car.id === id)
      if (!base) return null

      const extended = carsExtended.value.get(id)

      return {
        ...base,
        extended,
      }
    }
  })

  /**
   * Проверить, загружен ли список базовых данных
   */
  const isBaseDataLoaded = computed(() => carsBase.value.length > 0)

  /**
   * Проверить, есть ли расширенные данные для автомобиля в кеше
   */
  const hasExtendedData = computed(() => {
    return (id: number): boolean => {
      return carsExtended.value.has(id)
    }
  })

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Загрузить базовые данные из JSON с кешированием
   */
  const loadCarsBase = async (): Promise<void> => {
    // Если уже загружены, не делаем повторный запрос
    if (isBaseDataLoaded.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      // Имитируем задержку загрузки и ошибки с сервера
      await simulateError('Не удалось загрузить данные автомобилей')

      const carsData = (await import('@/data/cars.json')).default
      carsBase.value = carsData
    } catch (e) {
      console.error('Ошибка при загрузке данных:', e)
      const errorMessage = e instanceof Error ? e.message : 'Неизвестная ошибка'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Загрузить расширенные данные для всех автомобилей
   */
  const loadCarsExtended = async (): Promise<void> => {
    // Если уже есть данные в кеше, не делаем повторный запрос
    if (carsExtended.value.size > 0) {
      return
    }

    loadingExtended.value = true
    errorExtended.value = null

    try {
      const response = await axios.get<CarExtended[]>(
        'https://83ef7ece9de7dfdb.mokky.dev/cars',
      )

      if (response.data && response.data.length > 0) {
        // Сохраняем в кеш по carId
        response.data.forEach((extended) => {
          if (extended.carId) {
            carsExtended.value.set(extended.carId, extended)
          }
        })
      }
    } catch (e) {
      errorExtended.value =
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      console.error('Ошибка при загрузке дополнительных данных:', e)
    } finally {
      loadingExtended.value = false
    }
  }

  /**
   * Загрузить полный список автомобилей (base + extended)
  //  */
  const loadCarsList = async (): Promise<Car[]> => {
    await loadCarsBase()
    await loadCarsExtended()

    return getAllCars.value
  }

  /**
   * Загрузить базовые данные одного автомобиля по ID
   */
  const loadCarBaseById = async (
    carId: number,
    options?: { redirectOnNotFound?: boolean },
  ): Promise<void> => {
    const { redirectOnNotFound = false } = options || {}

    loading.value = true
    error.value = null

    try {
      // Если данные еще не загружены
      if (!isBaseDataLoaded.value) {
        await simulateError('Не удалось загрузить данные автомобиля')

        const carsData = (await import('@/data/cars.json')).default

        // Обновляем кеш, если еще не загружен
        carsBase.value = carsData
      }

      // если нет автомобиля с данным id
      const carBase = carsBase.value.find((c) => c.id === carId)
      if (!carBase) {
        if (redirectOnNotFound) {
          const pathMatch = route.path.split('/').filter((item) => item !== '')
          router.push({
            name: 'NotFound',
            params: {
              pathMatch,
            },
            query: route.query,
            hash: route.hash,
          })
        }
        throw new Error('Автомобиль с указанным ID не найден')
      }
    } catch (e) {
      console.error('Ошибка при загрузке данных:', e)
      const errorMessage = e instanceof Error ? e.message : 'Неизвестная ошибка'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Загрузить расширенные данные для одного автомобиля
   */
  const loadCarExtended = async (carId: number): Promise<void> => {
    // Если уже есть в кеше, не загружаем
    if (hasExtendedData.value(carId)) {
      return
    }

    loadingExtended.value = true
    errorExtended.value = null

    try {
      const response = await axios.get<CarExtended[]>(
        `https://83ef7ece9de7dfdb.mokky.dev/cars?carId=${carId}`,
        { timeout: 5000 },
      )

      if (response.data && response.data.length > 0) {
        const extended = response.data[0]
        carsExtended.value.set(carId, extended)
      } else {
        throw new Error('Характеристики автомобиля не найдены')
      }
    } catch (e) {
      errorExtended.value =
        e instanceof Error
          ? `Ошибка при загрузке дополнительных данных: ${e.message}`
          : 'Неизвестная ошибка при загрузке дополнительных данных'
      console.error('Ошибка при загрузке расширенных данных:', e)
    } finally {
      loadingExtended.value = false
    }
  }

  /**
   * Загрузить данные одного автомобиля (base + extended)
   */
  const loadCarById = async (
    carId: number,
    options?: { redirectOnNotFound?: boolean },
  ): Promise<Car | null> => {
    await loadCarBaseById(carId, options)
    await loadCarExtended(carId)

    const car = getCarById.value(carId)

    return car
  }

  /**
   * Обновить расширенные данные после редактирования
   */
  const updateCarExtended = (carId: number, extended: CarExtended): void => {
    carsExtended.value.set(carId, extended)
  }

  /**
   * Очистить кеш расширенных данных
   */
  const clearExtendedCache = () => {
    carsExtended.value.clear()
  }

  /**
   * Очистить весь кеш (базовые и расширенные данные)
   */
  const clearAllCache = () => {
    carsBase.value = []
    carsExtended.value.clear()
  }

  /**
   * Очистить ошибку загрузки расширенных данных
   */
  const clearErrorExtended = () => {
    errorExtended.value = null
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    carsBase: readonly(carsBase),
    loading: loading,
    loadingExtended: loadingExtended,
    error,
    errorExtended,

    // Computed
    getAllCars,
    getCarById,
    isBaseDataLoaded,
    hasExtendedData,

    // Actions
    loadCarsBase,
    loadCarExtended,
    loadCarsExtended,
    loadCarById,
    loadCarsList,
    loadCarBaseById,
    updateCarExtended,
    clearExtendedCache,
    clearAllCache,
    clearErrorExtended,
  }
})
