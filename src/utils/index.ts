/* eslint-disable @typescript-eslint/no-explicit-any */
import random from 'random'

export const getImageUrl = (module: string, path: string): string => {
  return new URL(`/src/${module}/assets/images/${path}`, import.meta.url).href
}

export const formattedPrice = (price: number | string): string => {
  return typeof price === 'number' ? price.toLocaleString() : price
}

export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    let i, length, key

    // array
    const arrA = Array.isArray(a)
    const arrB = Array.isArray(b)
    if (arrA && arrB) {
      length = a.length
      if (length !== b.length) return false
      for (i = length; i-- !== 0; ) if (!deepEquals(a[i], b[i])) return false
      return true
    }
    if (arrA !== arrB) return false

    // data
    const dateA = a instanceof Date
    const dateB = b instanceof Date
    if (dateA !== dateB) return false
    if (dateA && dateB) return a.getTime() === b.getTime()

    // regexp
    const regexpA = a instanceof RegExp
    const regexpB = b instanceof RegExp
    if (regexpA !== regexpB) return false
    if (regexpA && regexpB) return a.toString() === b.toString()

    // object
    const keys = Object.keys(a)
    length = keys.length
    if (length !== Object.keys(b).length) return false
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false

    for (i = length; i-- !== 0; ) {
      key = keys[i]
      if (!deepEquals(a[key], b[key])) return false
    }

    return true
  }

  // NaN and false
  return a !== a && b !== b
}

export const normalizeOptionalFields = <T extends number | string>(
  value: T | null | undefined,
  hadValueOnServer: boolean,
): T | undefined | null => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return value.trim() as T
  return hadValueOnServer ? null : undefined
}

export const normalizeEmptyFields = <T extends number | string | File>(
  value: T | null | undefined,
): T | undefined => {
  if (value == null) return undefined
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value
}

export const normalizeObject = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      normalizeEmptyFields(value),
    ]),
  ) as Partial<T>
}

/**
 * Имитирует задержку серверного запроса
 * @param ms - количество миллисекунд задержки (по умолчанию 1000)
 * @returns Promise, который разрешается после указанной задержки
 */
export const delay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Имитирует ошибку серверного запроса с заданной вероятностью
 * @param probability - вероятность ошибки от 0 до 1 (например, 0.3 = 30% шанс ошибки)
 * @param errorMessage - сообщение об ошибке (по умолчанию "Ошибка при загрузке данных")
 * @returns Promise, который выбрасывает ошибку или разрешается
 * @throws Error с указанным сообщением
 */
export async function simulateError(errorMessage: string): Promise<void>
export async function simulateError(
  errorMessage: string,
  probability: number,
  delayMs: number,
): Promise<void>
export async function simulateError(
  errorMessage: string = 'Ошибка при загрузке данных',
  probability: number = 0.3,
  delayMs: number = 1500,
): Promise<void> {
  if (probability <= 0) return

  await delay(delayMs)

  if (random.bernoulli(probability)()) {
    throw new Error(errorMessage)
  }
}
