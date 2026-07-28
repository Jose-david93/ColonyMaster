import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(64, 'Password must be 64 characters or fewer.'),
})

export type LoginSchema = z.infer<typeof loginSchema>
