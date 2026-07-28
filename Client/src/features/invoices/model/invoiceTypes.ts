export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

export interface InvoiceDetail {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  clientId: string
  clientName: string
  paymentMethod: string
  total: number
  taxes: number
  amountPaid: number
  notes: string
  fromName: string
  fromAddress: string
  fromCity: string
  fromState: string
  fromPostalCode: string
  soldName: string
  soldAddress: string
  soldCity: string
  soldState: string
  soldPostalCode: string
  details: InvoiceDetail[]
}

export interface InvoiceCreateDetailInput {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceUpdateDetailInput {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceCreateInput {
  date: string
  clientId: string
  fromName: string
  fromAddress: string
  fromCity: string
  fromState: string
  fromPostalCode: string
  soldName: string
  soldAddress: string
  soldCity: string
  soldState: string
  soldPostalCode: string
  paymentMethod: string
  total: number
  taxes: number
  amountPaid: number
  notes: string
  details: InvoiceCreateDetailInput[]
}

export interface InvoiceUpdateInput {
  id: string
  date: string
  fromName: string
  fromAddress: string
  fromCity: string
  fromState: string
  fromPostalCode: string
  soldName: string
  soldAddress: string
  soldCity: string
  soldState: string
  soldPostalCode: string
  paymentMethod: string
  total: number
  taxes: number
  amountPaid: number
  notes: string
  details: InvoiceUpdateDetailInput[]
}

export interface InvoiceDetailDto {
  id: string
  description: string | null
  quantity: number
  unitPrice: number
}

export interface InvoiceCreateDto {
  date: string
  clientId: string
  fromName: string | null
  fromAddress: string | null
  fromCity: string | null
  fromState: string | null
  fromPostalCode: string | null
  soldName: string | null
  soldAddress: string | null
  soldCity: string | null
  soldState: string | null
  soldPostalCode: string | null
  paymentMethod: string | null
  total: number
  taxes: number
  amountPaid: number
  notes: string | null
  details: InvoiceDetailDto[]
}

export interface InvoiceUpdateDto {
  id: string
  date: string
  fromName: string | null
  fromAddress: string | null
  fromCity: string | null
  fromState: string | null
  fromPostalCode: string | null
  soldName: string | null
  soldAddress: string | null
  soldCity: string | null
  soldState: string | null
  soldPostalCode: string | null
  paymentMethod: string | null
  total: number
  taxes: number
  amountPaid: number
  notes: string | null
  details: InvoiceDetailDto[]
}

export interface InvoiceDetailApiPayload {
  id?: string
  description?: string | null
  quantity?: number | null
  unitPrice?: number | null
}

export interface InvoiceApiPayload {
  id?: string
  consecutiveNumber?: string | number | null
  invoiceNumber?: string | number | null
  number?: string | number | null
  consecutive?: string | number | null
  invoiceConsecutive?: string | number | null
  date?: string | null
  clientId?: string | null
  clientName?: string | null
  paymentMethod?: string | null
  total?: number | null
  taxes?: number | null
  amountPaid?: number | null
  notes?: string | null
  fromName?: string | null
  fromAddress?: string | null
  fromCity?: string | null
  fromState?: string | null
  fromPostalCode?: string | null
  soldName?: string | null
  soldAddress?: string | null
  soldCity?: string | null
  soldState?: string | null
  soldPostalCode?: string | null
  details?: InvoiceDetailApiPayload[] | null
}

export interface InvoicesListApiResponse {
  items?: InvoiceApiPayload[]
}