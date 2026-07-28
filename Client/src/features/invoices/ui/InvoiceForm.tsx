import { useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Client } from '@/features/clients/model/clientTypes'
import { getClients } from '@/features/clients/services/clientService'
import { EMPTY_GUID } from '@/features/invoices/model/invoiceTypes'
import { Button } from '@/shared/ui/Button'
import { CurrencyInput } from '@/shared/ui/CurrencyInput'
import { Input } from '@/shared/ui/Input'
import { PaymentMethodSelect } from '@/shared/ui/PaymentMethodSelect'
import { invoiceCreateSchema, type InvoiceCreateSchema } from '@/features/invoices/schemas/invoiceSchema'

interface InvoiceFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<InvoiceCreateSchema>
  invoiceNumber?: string
  selectedClientDisplay?: string
  isSubmitting: boolean
  onSubmit: (value: InvoiceCreateSchema) => Promise<void>
  onCancel: () => void
}

function buildFormValues(initialValues?: Partial<InvoiceCreateSchema>): InvoiceCreateSchema {
  return {
    date: initialValues?.date ?? '',
    clientId: initialValues?.clientId ?? '',
    fromName: initialValues?.fromName ?? '',
    fromAddress: initialValues?.fromAddress ?? '',
    fromCity: initialValues?.fromCity ?? '',
    fromState: initialValues?.fromState ?? '',
    fromPostalCode: initialValues?.fromPostalCode ?? '',
    soldName: initialValues?.soldName ?? '',
    soldAddress: initialValues?.soldAddress ?? '',
    soldCity: initialValues?.soldCity ?? '',
    soldState: initialValues?.soldState ?? '',
    soldPostalCode: initialValues?.soldPostalCode ?? '',
    paymentMethod: initialValues?.paymentMethod ?? 'Cash',
    total: initialValues?.total ?? 0,
    taxes: initialValues?.taxes ?? 0,
    amountPaid: initialValues?.amountPaid ?? 0,
    notes: initialValues?.notes ?? '',
    details: initialValues?.details ?? [
      {
        id: EMPTY_GUID,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ],
  }
}

/**
 * Renders the invoice creation form with dynamic detail items.
 */
export function InvoiceForm({
  mode,
  initialValues,
  invoiceNumber = '',
  selectedClientDisplay = '',
  isSubmitting,
  onSubmit,
  onCancel,
}: InvoiceFormProps): ReactElement {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [clientsError, setClientsError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceCreateSchema>({
    resolver: zodResolver(invoiceCreateSchema),
    mode: 'onBlur',
    defaultValues: buildFormValues(initialValues),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
    keyName: 'fieldKey',
  })

  const isEditMode = mode === 'edit'

  const selectedClientId = watch('clientId')
  const detailValues = useWatch({
    control,
    name: 'details',
  })

  const calculatedTotal = useMemo(() => {
    const rawTotal = (detailValues ?? []).reduce((acc, detail) => {
      const quantity = Number.isFinite(detail.quantity) ? detail.quantity : 0
      const unitPrice = Number.isFinite(detail.unitPrice) ? detail.unitPrice : 0
      return acc + quantity * unitPrice
    }, 0)

    return Math.round(rawTotal * 100) / 100
  }, [detailValues])

  const selectedClient = useMemo(() => {
    if (!selectedClientId) {
      return null
    }

    return clients.find((client) => client.id === selectedClientId) ?? null
  }, [clients, selectedClientId])

  useEffect(() => {
    reset(buildFormValues(initialValues))
  }, [initialValues, reset])

  useEffect(() => {
    let isMounted = true

    const loadClients = async (): Promise<void> => {
      setIsLoadingClients(true)
      setClientsError(null)

      try {
        const list = await getClients(true)

        if (!isMounted) {
          return
        }

        setClients(list)
      } catch {
        if (!isMounted) {
          return
        }

        setClientsError('Unable to load clients. Please try again.')
      } finally {
        if (isMounted) {
          setIsLoadingClients(false)
        }
      }
    }

    void loadClients()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedClient) {
      return
    }

    setValue('fromName', selectedClient.clientName)
    setValue('fromAddress', selectedClient.address)
    setValue('fromCity', selectedClient.city)
    setValue('fromState', selectedClient.state)
    setValue('fromPostalCode', selectedClient.postalCode)
  }, [selectedClient, setValue])

  useEffect(() => {
    setValue('total', calculatedTotal, { shouldValidate: true })
  }, [calculatedTotal, setValue])

  const submitHandler = async (value: InvoiceCreateSchema): Promise<void> => {
    await onSubmit(value)

    if (!isEditMode) {
      reset(buildFormValues())
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Invoice date"
          id="date"
          type="date"
          disabled={isSubmitting}
          error={errors.date?.message}
          {...register('date')}
        />
        {isEditMode ? (
          <Input
            label="Client"
            id="selectedClientDisplay"
            value={selectedClientDisplay}
            disabled
            readOnly
          />
        ) : (
          <label htmlFor="clientId" className="block">
            <span className="mb-1 block text-sm font-medium text-brand-ink">Client</span>
            <select
              id="clientId"
              disabled={isSubmitting || isLoadingClients}
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-mist"
              {...register('clientId')}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.clientName} - {client.city}, {client.state}
                </option>
              ))}
            </select>
            {errors.clientId?.message ? <span className="mt-1 block text-xs text-red-600">{errors.clientId.message}</span> : null}
            {clientsError ? <span className="mt-1 block text-xs text-red-600">{clientsError}</span> : null}
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={isEditMode ? 'Invoice number' : 'Invoice consecutive'}
          id={isEditMode ? 'invoiceNumber' : 'invoiceConsecutive'}
          value={isEditMode ? invoiceNumber : selectedClient ? String(selectedClient.nextConsecutive) : ''}
          disabled
          readOnly
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="From name" id="fromName" disabled={isSubmitting} error={errors.fromName?.message} {...register('fromName')} />
        <Input label="From address" id="fromAddress" disabled={isSubmitting} error={errors.fromAddress?.message} {...register('fromAddress')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="From city" id="fromCity" disabled={isSubmitting} error={errors.fromCity?.message} {...register('fromCity')} />
        <Input label="From state" id="fromState" disabled={isSubmitting} error={errors.fromState?.message} {...register('fromState')} />
        <Input label="From postal code" id="fromPostalCode" disabled={isSubmitting} error={errors.fromPostalCode?.message} {...register('fromPostalCode')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Sold name" id="soldName" disabled={isSubmitting} error={errors.soldName?.message} {...register('soldName')} />
        <Input label="Sold address" id="soldAddress" disabled={isSubmitting} error={errors.soldAddress?.message} {...register('soldAddress')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Sold city" id="soldCity" disabled={isSubmitting} error={errors.soldCity?.message} {...register('soldCity')} />
        <Input label="Sold state" id="soldState" disabled={isSubmitting} error={errors.soldState?.message} {...register('soldState')} />
        <Input label="Sold postal code" id="soldPostalCode" disabled={isSubmitting} error={errors.soldPostalCode?.message} {...register('soldPostalCode')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <PaymentMethodSelect
              id="paymentMethod"
              label="Payment method"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSubmitting}
              error={errors.paymentMethod?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="amountPaid"
          render={({ field }) => (
            <CurrencyInput
              id="amountPaid"
              label="Amount paid"
              value={field.value ?? 0}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSubmitting}
              error={errors.amountPaid?.message}
            />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="total"
          render={({ field }) => (
            <CurrencyInput
              id="total"
              label="Total"
              value={field.value ?? 0}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled
              readOnly
              error={errors.total?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="taxes"
          render={({ field }) => (
            <CurrencyInput
              id="taxes"
              label="Taxes"
              value={field.value ?? 0}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isSubmitting}
              error={errors.taxes?.message}
            />
          )}
        />
      </div>

      <label htmlFor="notes" className="block">
        <span className="mb-1 block text-sm font-medium text-brand-ink">Notes</span>
        <textarea
          id="notes"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-brand-border px-3 py-2 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-steel/60 focus:outline-none focus:ring-2 focus:ring-brand-mist"
          {...register('notes')}
        />
        {errors.notes?.message ? <span className="mt-1 block text-xs text-red-600">{errors.notes.message}</span> : null}
      </label>

      <section className="rounded-xl border border-brand-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-ink">Invoice items</h3>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() =>
              append({
                id: EMPTY_GUID,
                description: '',
                quantity: 1,
                unitPrice: 0,
              })
            }
          >
            Add item
          </Button>
        </div>

        {errors.details?.message ? <p className="mb-2 text-xs text-red-600">{errors.details.message}</p> : null}

        <div className="grid gap-3">
          {fields.map((field, index) => (
            <div key={field.fieldKey} className="rounded-xl border border-brand-border bg-brand-paper p-3">
              <input type="hidden" {...register(`details.${index}.id` as const)} />
              <div className="grid gap-3 sm:grid-cols-5">
                <div className="sm:col-span-3">
                  <Input
                    label="Description"
                    id={`details-${index}-description`}
                    disabled={isSubmitting}
                    error={errors.details?.[index]?.description?.message}
                    {...register(`details.${index}.description` as const)}
                  />
                </div>
                <Input
                  label="Qty"
                  id={`details-${index}-quantity`}
                  type="number"
                  min={1}
                  step={1}
                  disabled={isSubmitting}
                  error={errors.details?.[index]?.quantity?.message}
                  {...register(`details.${index}.quantity` as const, {
                    valueAsNumber: true,
                    setValueAs: (value) => {
                      const parsed = Number.parseInt(String(value), 10)

                      if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
                        return 1
                      }

                      return Math.max(1, parsed)
                    },
                  })}
                />
                <Controller
                  control={control}
                  name={`details.${index}.unitPrice` as const}
                  render={({ field }) => (
                    <CurrencyInput
                      id={`details-${index}-unitPrice`}
                      label="Unit price"
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      error={errors.details?.[index]?.unitPrice?.message}
                    />
                  )}
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting || fields.length === 1}
                  onClick={() => remove(index)}
                >
                  Remove item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save changes' : 'Create invoice'}
        </Button>
      </div>
    </form>
  )
}
