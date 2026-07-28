import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/store/rootReducer'
import type { AppDispatch } from '@/app/store/store'

/**
 * Typed dispatch hook for app actions and thunks.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * Typed selector hook for app state.
 */
export const useAppSelector = useSelector.withTypes<RootState>()
