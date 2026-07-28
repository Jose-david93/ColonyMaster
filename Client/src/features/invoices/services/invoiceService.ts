import type {
  InvoiceCreateDto,
  InvoiceCreateInput,
  InvoiceUpdateDto,
  InvoiceUpdateInput,
  Invoice,
  InvoiceApiPayload,
  InvoiceDetail,
  InvoiceDetailApiPayload,
  InvoicesListApiResponse,
} from '@/features/invoices/model/invoiceTypes'
import { apiDownload, apiGet, apiPost, apiPut } from '@/shared/api/httpClient'

const INVOICES_API = '/api/Invoices'

function toInvoiceDetail(raw: InvoiceDetailApiPayload): InvoiceDetail {
  return {
    id: raw.id ?? crypto.randomUUID(),
    description: raw.description ?? '',
    quantity: raw.quantity ?? 0,
    unitPrice: raw.unitPrice ?? 0,
  }
}

function toInvoice(raw: InvoiceApiPayload, clientId: string): Invoice {
  const rawInvoiceNumber =
    raw.consecutiveNumber ?? raw.invoiceNumber ?? raw.number ?? raw.consecutive ?? raw.invoiceConsecutive

  return {
    id: raw.id ?? crypto.randomUUID(),
    invoiceNumber: rawInvoiceNumber == null ? '' : String(rawInvoiceNumber),
    date: raw.date ?? '',
    clientId: raw.clientId ?? clientId,
    clientName: raw.clientName ?? '',
    paymentMethod: raw.paymentMethod ?? '',
    total: raw.total ?? 0,
    taxes: raw.taxes ?? 0,
    amountPaid: raw.amountPaid ?? 0,
    notes: raw.notes ?? '',
    fromName: raw.fromName ?? '',
    fromAddress: raw.fromAddress ?? '',
    fromCity: raw.fromCity ?? '',
    fromState: raw.fromState ?? '',
    fromPostalCode: raw.fromPostalCode ?? '',
    fromSIN: raw.fromSIN ?? '',
    soldName: raw.soldName ?? '',
    soldAddress: raw.soldAddress ?? '',
    soldCity: raw.soldCity ?? '',
    soldState: raw.soldState ?? '',
    soldPostalCode: raw.soldPostalCode ?? '',
    soldSIN: raw.soldSIN ?? '',
    details: (raw.details ?? []).map(toInvoiceDetail),
  }
}

/**
 * Retrieves invoices associated with a client id.
 */
export async function getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
  const payload = await apiGet<InvoiceApiPayload[] | InvoicesListApiResponse>(
    `${INVOICES_API}/by-client/${clientId}`,
  )

  if (!payload) {
    return []
  }

  const rawInvoices = Array.isArray(payload) ? payload : payload.items ?? []
  return rawInvoices.map((invoice) => toInvoice(invoice, clientId))
}

/**
 * Retrieves all invoices from the backend API.
 */
export async function getInvoices(): Promise<Invoice[]> {
  const payload = await apiGet<InvoiceApiPayload[] | InvoicesListApiResponse>(INVOICES_API)

  if (!payload) {
    return []
  }

  const rawInvoices = Array.isArray(payload) ? payload : payload.items ?? []
  return rawInvoices.map((invoice) => toInvoice(invoice, invoice.clientId ?? ''))
}

/**
 * Retrieves invoice detail by id from the backend API.
 */
export async function getInvoiceById(id: string): Promise<Invoice> {
  const payload = await apiGet<InvoiceApiPayload>(`${INVOICES_API}/${id}`)

  if (!payload) {
    throw new Error('Unable to load invoice detail.')
  }

  return toInvoice(payload, payload.clientId ?? '')
}

function toNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function toMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function toApiDateTime(value: string): string {
  const normalized = value.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T00:00:00`
  }

  return normalized
}

function toInvoiceCreateDto(input: InvoiceCreateInput): InvoiceCreateDto {
  return {
    date: toApiDateTime(input.date),
    clientId: input.clientId,
    fromName: toNullableString(input.fromName),
    fromAddress: toNullableString(input.fromAddress),
    fromCity: toNullableString(input.fromCity),
    fromState: toNullableString(input.fromState),
    fromPostalCode: toNullableString(input.fromPostalCode),
    fromSIN: toNullableString(input.fromSIN),
    soldName: toNullableString(input.soldName),
    soldAddress: toNullableString(input.soldAddress),
    soldCity: toNullableString(input.soldCity),
    soldState: toNullableString(input.soldState),
    soldPostalCode: toNullableString(input.soldPostalCode),
    soldSIN: toNullableString(input.soldSIN),
    paymentMethod: toNullableString(input.paymentMethod),
    total: toMoney(input.total),
    taxes: toMoney(input.taxes),
    amountPaid: toMoney(input.amountPaid),
    notes: toNullableString(input.notes),
    details: input.details.map((detail) => ({
      id: detail.id,
      description: toNullableString(detail.description),
      quantity: detail.quantity,
      unitPrice: toMoney(detail.unitPrice),
    })),
  }
}

/**
 * Creates a new invoice in the backend API.
 */
export async function createInvoice(input: InvoiceCreateInput): Promise<void> {
  await apiPost<InvoiceCreateDto, InvoiceApiPayload>(INVOICES_API, toInvoiceCreateDto(input))
}

function toInvoiceUpdateDto(input: InvoiceUpdateInput): InvoiceUpdateDto {
  return {
    id: input.id,
    date: toApiDateTime(input.date),
    fromName: toNullableString(input.fromName),
    fromAddress: toNullableString(input.fromAddress),
    fromCity: toNullableString(input.fromCity),
    fromState: toNullableString(input.fromState),
    fromPostalCode: toNullableString(input.fromPostalCode),
    fromSIN: toNullableString(input.fromSIN),
    soldName: toNullableString(input.soldName),
    soldAddress: toNullableString(input.soldAddress),
    soldCity: toNullableString(input.soldCity),
    soldState: toNullableString(input.soldState),
    soldPostalCode: toNullableString(input.soldPostalCode),
    soldSIN: toNullableString(input.soldSIN),
    paymentMethod: toNullableString(input.paymentMethod),
    total: toMoney(input.total),
    taxes: toMoney(input.taxes),
    amountPaid: toMoney(input.amountPaid),
    notes: toNullableString(input.notes),
    details: input.details.map((detail) => ({
      id: detail.id,
      description: toNullableString(detail.description),
      quantity: detail.quantity,
      unitPrice: toMoney(detail.unitPrice),
    })),
  }
}

/**
 * Updates an existing invoice in the backend API.
 */
export async function updateInvoice(input: InvoiceUpdateInput): Promise<void> {
  await apiPut<InvoiceUpdateDto, InvoiceApiPayload>(
    `${INVOICES_API}/${input.id}`,
    toInvoiceUpdateDto(input),
  )
}

/**
 * Downloads the invoice PDF file for the provided invoice id.
 */
export async function downloadInvoicePdf(invoiceId: string): Promise<void> {
  const { blob, fileName } = await apiDownload(`/api/Print/invoice/${invoiceId}`)
  const downloadUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = downloadUrl
  anchor.download = fileName ?? `invoice-${invoiceId}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(downloadUrl)
}