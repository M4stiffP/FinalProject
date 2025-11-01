import { configureStore } from '@reduxjs/toolkit'
import uiSlice from './slices/uiSlice'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import ordersSlice from './slices/ordersSlice'
import cartSlice from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    products: productsSlice,
    orders: ordersSlice,
    cart: cartSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch