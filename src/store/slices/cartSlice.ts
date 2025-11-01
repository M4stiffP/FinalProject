import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CartItem {
  color_id: number;
  size: string;
  quantity: number;
  price: number;
  brand?: string;
  model?: string;
  color_name?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  checkoutStatus: 'idle' | 'pending' | 'success' | 'failed';
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  isLoading: false,
  error: null,
  checkoutStatus: 'idle',
};

// Async thunks
export const processCheckout = createAsyncThunk(
  'cart/processCheckout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      
      // Try main checkout endpoint first
      try {
        const response = await api.post('/orders/checkout', { 
          cartItems: state.cart.items 
        });
        return response.data;
      } catch (mainError: any) {
        console.log('Main checkout failed, trying test endpoint...', mainError.message);
        
        // Fallback to test endpoint
        const testResponse = await api.post('/orders/checkout-test', { 
          cartItems: state.cart.items 
        });
        return testResponse.data;
      }
    } catch (error: any) {
      console.error('Both checkout endpoints failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Checkout failed');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => 
          item.color_id === newItem.color_id &&
          item.size === newItem.size
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    removeFromCart: (state, action) => {
      const { color_id, size } = action.payload;
      state.items = state.items.filter(
        item => !(
          item.color_id === color_id &&
          item.size === size
        )
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    updateQuantity: (state, action) => {
      const { color_id, size, quantity } = action.payload;
      const item = state.items.find(
        item => 
          item.color_id === color_id &&
          item.size === size
      );
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            item => !(
              item.color_id === color_id &&
              item.size === size
            )
          );
        } else {
          item.quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetCheckoutStatus: (state) => {
      state.checkoutStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Checkout
      .addCase(processCheckout.pending, (state) => {
        state.isLoading = true;
        state.checkoutStatus = 'pending';
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.checkoutStatus = 'success';
          state.items = []; // Clear cart after successful checkout
          localStorage.removeItem('cart');
        } else {
          state.checkoutStatus = 'failed';
          state.error = action.payload.message;
        }
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.isLoading = false;
        state.checkoutStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  clearError,
  resetCheckoutStatus 
} = cartSlice.actions;

export default cartSlice.reducer;