import { z } from 'zod'

export const clientCreateSchema = z
  .object({
    clientName: z.string().trim().min(2, 'Client name must be at least 2 characters.').max(120, 'Client name must be 120 characters or fewer.'),
    address: z.string().trim().min(3, 'Address must be at least 3 characters.').max(180, 'Address must be 180 characters or fewer.'),
    city: z.string().trim().min(2, 'City must be at least 2 characters.').max(80, 'City must be 80 characters or fewer.'),
    state: z.string().trim().min(2, 'State must be at least 2 characters.').max(40, 'State must be 40 characters or fewer.'),
    postalCode: z.string().trim().min(3, 'Postal code must be at least 3 characters.').max(20, 'Postal code must be 20 characters or fewer.'),
    initialConsecutive: z.number().int('Initial consecutive must be an integer.').min(0, 'Initial consecutive must be zero or higher.'),
    nextConsecutive: z.number().int('Next consecutive must be an integer.').min(0, 'Next consecutive must be zero or higher.'),
    isActive: z.boolean(),
  })
  .refine((value) => value.nextConsecutive >= value.initialConsecutive, {
    message: 'Next consecutive must be greater than or equal to initial consecutive.',
    path: ['nextConsecutive'],
  })

export type ClientCreateSchema = z.infer<typeof clientCreateSchema>
