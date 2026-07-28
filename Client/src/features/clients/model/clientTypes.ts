export interface Client {
  id: string
  clientName: string
  address: string
  city: string
  state: string
  postalCode: string
  initialConsecutive: number
  nextConsecutive: number
  isActive: boolean
}

export interface ClientCreateInput {
  clientName: string
  address: string
  city: string
  state: string
  postalCode: string
  initialConsecutive: number
  nextConsecutive: number
}

export interface ClientUpdateInput {
  id: string
  clientName: string
  address: string
  city: string
  state: string
  postalCode: string
  isActive: boolean
}

export interface ClientCreateDto {
  clientName: string | null
  address: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  initialConsecutive: number
  nextConsecutive: number
}

export interface ClientUpdateDto {
  id: string
  clientName: string | null
  address: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  isActive: boolean
}

export interface ClientApiPayload {
  id?: string
  clientName?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  initialConsecutive?: number | null
  nextConsecutive?: number | null
  isActive?: boolean | null
}

export interface ClientsListApiResponse {
  items?: ClientApiPayload[]
}
