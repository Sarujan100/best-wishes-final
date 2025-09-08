import { createAsyncThunk } from '@reduxjs/toolkit';

// Action types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

// Async thunk for fetching categories
export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
); 