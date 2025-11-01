import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// API instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
interface Product {
  product_id: number;
  brand: string;
  model: string;
  price: number;
  description: string;
  colors?: Color[];
  sizes?: Size[];
}

interface Color {
  color_id: number;
  color_name: string;
  imageUrl: string;
  colortag: string;
  product_id: number;
}

interface Size {
  _id: string;
  color_id: number;
  size: number;
  stock_in: number;
  stock_out: number;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  colors: Color[];
  sizes: Size[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
  };
}

// Initial state
const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  colors: [],
  sizes: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    brand: '',
    minPrice: 0,
    maxPrice: 20000,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: { search?: string; brand?: string; minPrice?: number; maxPrice?: number } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.brand) params.append('brand', filters.brand);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      
      const response = await api.get(`/products?${params}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchProductColors = createAsyncThunk(
  'products/fetchProductColors',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/colors`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch colors');
    }
  }
);

export const fetchProductSizes = createAsyncThunk(
  'products/fetchProductSizes',
  async ({ productId, colorId }: { productId: number; colorId?: number }, { rejectWithValue }) => {
    try {
      const params = colorId ? `?colorId=${colorId}` : '';
      const response = await api.get(`/products/${productId}/sizes${params}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sizes');
    }
  }
);

export const processCheckout = createAsyncThunk(
  'products/processCheckout',
  async (cartItems: any[], { rejectWithValue }) => {
    try {
      const response = await api.post('/orders/checkout', { cartItems });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Checkout failed');
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        brand: '',
        minPrice: 0,
        maxPrice: 20000,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch colors
      .addCase(fetchProductColors.fulfilled, (state, action) => {
        state.colors = action.payload;
      })
      // Fetch sizes
      .addCase(fetchProductSizes.fulfilled, (state, action) => {
        state.sizes = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;