import { z } from 'zod'
import { PAYMENT_METHOD_OPTIONS } from '@/shared/ui/PaymentMethodSelect'

const invoiceDetailSchema = z.object({
  id: z.uuid({ error: 'Item id must be a valid UUID.' }),
  description: z.string().trim().min(2, 'Item description must be at least 2 characters.').max(200, 'Item description must be 200 characters or fewer.'),
  quantity: z.number().int('Quantity must be an integer.').min(1, 'Quantity must be at least 1.'),
  unitPrice: z.number().min(0, 'Unit price must be zero or higher.'),
})

export const invoiceCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invoice date is required.'),
  clientId: z.uuid({ error: 'Select a valid client.' }),
  fromName: z.string().trim().max(120, 'From name must be 120 characters or fewer.'),
  fromAddress: z.string().trim().max(180, 'From address must be 180 characters or fewer.'),
  fromCity: z.string().trim().max(80, 'From city must be 80 characters or fewer.'),
  fromState: z.string().trim().max(40, 'From state must be 40 characters or fewer.'),
  fromPostalCode: z.string().trim().max(20, 'From postal code must be 20 characters or fewer.'),
  soldName: z.string().trim().max(120, 'Sold name must be 120 characters or fewer.'),
  soldAddress: z.string().trim().max(180, 'Sold address must be 180 characters or fewer.'),
  soldCity: z.string().trim().max(80, 'Sold city must be 80 characters or fewer.'),
  soldState: z.string().trim().max(40, 'Sold state must be 40 characters or fewer.'),
  soldPostalCode: z.string().trim().max(20, 'Sold postal code must be 20 characters or fewer.'),
  paymentMethod: z.enum(PAYMENT_METHOD_OPTIONS, {
    error: 'Payment method is required.',
  }),
  total: z.number().min(0, 'Total must be zero or higher.'),
  taxes: z.number().min(0, 'Taxes must be zero or higher.'),
  amountPaid: z.number().min(0, 'Amount paid must be zero or higher.'),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer.'),
  details: z.array(invoiceDetailSchema).min(1, 'At least one invoice item is required.'),
})

export type InvoiceCreateSchema = z.infer<typeof invoiceCreateSchema>
