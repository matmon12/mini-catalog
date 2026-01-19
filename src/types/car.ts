export interface CarBase {
  id: number
  make: string
  model: string
  year: number
  price: number
  model_seats: number
  model_transmission_type: string
  model_engine_power_ps: number
}

export interface CarExtended {
  id?: number
  carId: number
  imageUrl?: string
  imageId?: string
  model_body: string
  model_engine_cc: number
  model_engine_type: string
  model_length_mm: number
  model_width_mm: number
  model_lkm_hwy: number
  model_lkm_city: number
  model_top_speed_kph: number
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

export interface Car extends CarBase {
  extended?: CarExtended
}
