import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { login } from '@/features/auth/model/authThunks'
import { selectAuthError, selectAuthIsLoading } from '@/features/auth/model/authSelectors'
import { loginSchema, type LoginSchema } from '@/features/auth/schemas/loginSchema'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

/**
 * Renders and handles the login form workflow.
 */
export function LoginForm(): ReactElement {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector(selectAuthIsLoading)
  const authError = useAppSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginSchema): Promise<void> => {
    await dispatch(login(data)).unwrap()
    navigate('/invoices', { replace: true })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      {authError ? <p className="text-sm text-red-700">{authError}</p> : null}

      <Button type="submit" disabled={isLoading} className="w-full justify-center">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
