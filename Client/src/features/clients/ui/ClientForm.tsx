import { useEffect } from 'react'
import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { clientCreateSchema, type ClientCreateSchema } from '@/features/clients/schemas/clientSchema'

interface ClientFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<ClientCreateSchema>
  isSubmitting: boolean
  onSubmit: (value: ClientCreateSchema) => Promise<void>
  onCancel: () => void
}

function buildFormValues(initialValues?: Partial<ClientCreateSchema>): ClientCreateSchema {
  return {
    clientName: initialValues?.clientName ?? '',
    address: initialValues?.address ?? '',
    city: initialValues?.city ?? '',
    state: initialValues?.state ?? '',
    postalCode: initialValues?.postalCode ?? '',
    initialConsecutive: initialValues?.initialConsecutive ?? 0,
    nextConsecutive: initialValues?.nextConsecutive ?? 0,
    isActive: initialValues?.isActive ?? true,
  }
}

/**
 * Renders the client creation form with Zod validation.
 */
export function ClientForm({
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ClientFormProps): ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClientCreateSchema>({
    resolver: zodResolver(clientCreateSchema),
    mode: 'onBlur',
    defaultValues: buildFormValues(initialValues),
  })

  const isEditMode = mode === 'edit'
  const isActive = watch('isActive')

  useEffect(() => {
    reset(buildFormValues(initialValues))
  }, [initialValues, reset])

  const submitHandler = async (value: ClientCreateSchema): Promise<void> => {
    await onSubmit(value)

    if (!isEditMode) {
      reset(buildFormValues())
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submitHandler)} noValidate>
      <Input label="Client name" id="clientName" disabled={isSubmitting} error={errors.clientName?.message} {...register('clientName')} />
      <Input label="Address" id="address" disabled={isSubmitting} error={errors.address?.message} {...register('address')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="City" id="city" disabled={isSubmitting} error={errors.city?.message} {...register('city')} />
        <Input label="State" id="state" disabled={isSubmitting} error={errors.state?.message} {...register('state')} />
      </div>
      <Input label="Postal code" id="postalCode" disabled={isSubmitting} error={errors.postalCode?.message} {...register('postalCode')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Initial consecutive"
            id="initialConsecutive"
            type="number"
            min={0}
            disabled={isSubmitting || isEditMode}
            className={isEditMode ? 'cursor-not-allowed bg-brand-paper text-brand-steel' : undefined}
            error={errors.initialConsecutive?.message}
            {...register('initialConsecutive', { valueAsNumber: true })}
          />
        </div>
        <div>
          <Input
            label="Next consecutive"
            id="nextConsecutive"
            type="number"
            min={0}
            disabled={isSubmitting || isEditMode}
            className={isEditMode ? 'cursor-not-allowed bg-brand-paper text-brand-steel' : undefined}
            error={errors.nextConsecutive?.message}
            {...register('nextConsecutive', { valueAsNumber: true })}
          />
        </div>
      </div>
      {isEditMode ? (
        <label className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink">
          <input
            type="checkbox"
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-brand-border text-brand-ink focus:ring-brand-mist"
            {...register('isActive')}
          />
          <span>{isActive ? 'Is active' : 'Is inactive'}</span>
        </label>
      ) : null}
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save changes' : 'Create client'}
        </Button>
      </div>
    </form>
  )
}
