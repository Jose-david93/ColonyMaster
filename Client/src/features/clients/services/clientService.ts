import type {
  Client,
  ClientApiPayload,
  ClientCreateDto,
  ClientCreateInput,
  ClientUpdateDto,
  ClientUpdateInput,
  ClientsListApiResponse,
} from '@/features/clients/model/clientTypes'
import { apiGet, apiPost, apiPut } from '@/shared/api/httpClient'

const CLIENTS_API = '/api/Clients'

function toClient(raw: ClientApiPayload): Client {
  return {
    id: raw.id ?? crypto.randomUUID(),
    clientName: raw.clientName ?? '',
    address: raw.address ?? '',
    city: raw.city ?? '',
    state: raw.state ?? '',
    postalCode: raw.postalCode ?? '',
    sin: raw.sin ?? '',
    initialConsecutive: raw.initialConsecutive ?? 0,
    nextConsecutive: raw.nextConsecutive ?? 0,
    isActive: raw.isActive ?? true,
  }
}

function toNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function toClientCreateDto(input: ClientCreateInput): ClientCreateDto {
  return {
    clientName: toNullableString(input.clientName),
    address: toNullableString(input.address),
    city: toNullableString(input.city),
    state: toNullableString(input.state),
    postalCode: toNullableString(input.postalCode),
    sin: toNullableString(input.sin),
    initialConsecutive: input.initialConsecutive,
    nextConsecutive: input.nextConsecutive,
  }
}

function toClientUpdateDto(input: ClientUpdateInput): ClientUpdateDto {
  return {
    id: input.id,
    clientName: toNullableString(input.clientName),
    address: toNullableString(input.address),
    city: toNullableString(input.city),
    state: toNullableString(input.state),
    postalCode: toNullableString(input.postalCode),
    sin: toNullableString(input.sin),
    isActive: input.isActive,
  }
}

/**
 * Retrieves all clients from the backend API.
 */
export async function getClients(includeInactive = false): Promise<Client[]> {
  const payload = await apiGet<ClientApiPayload[] | ClientsListApiResponse>(CLIENTS_API, {
    includeInactive,
  })

  if (!payload) {
    return []
  }

  const rawClients = Array.isArray(payload) ? payload : payload.items ?? []
  return rawClients.map(toClient)
}

/**
 * Creates a new client in the backend API.
 */
export async function createClient(input: ClientCreateInput): Promise<Client> {
  const payload = await apiPost<ClientCreateDto, ClientApiPayload>(
    CLIENTS_API,
    toClientCreateDto(input),
  )

  if (!payload) {
    return {
      id: crypto.randomUUID(),
      ...input,
      isActive: true,
    }
  }

  return toClient({ ...payload, ...input, id: payload.id ?? crypto.randomUUID() })
}

/**
 * Retrieves a client by id from the backend API.
 */
export async function getClientById(id: string): Promise<Client> {
  const payload = await apiGet<ClientApiPayload>(`${CLIENTS_API}/${id}`)

  if (!payload) {
    throw new Error('Unable to load client detail.')
  }

  return toClient(payload)
}

/**
 * Updates an existing client in the backend API.
 */
export async function updateClient(input: ClientUpdateInput): Promise<void> {
  await apiPut<ClientUpdateDto, ClientApiPayload>(
    `${CLIENTS_API}/${input.id}`,
    toClientUpdateDto(input),
  )
}
