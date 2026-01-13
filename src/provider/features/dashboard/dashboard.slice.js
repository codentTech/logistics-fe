import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dashboardService from './dashboard.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const initialState = {
  summary: generalState,
};

// Get dashboard summary
export const getSummary = createAsyncThunk(
  'dashboard/getSummary',
  async (_, thunkAPI) => {
    try {
      const response = await dashboardService.getSummary();
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        error_code: error.response?.data?.error_code,
      });
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.summary = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.pending, (state) => {
        // Only set loading to true if we don't have data yet (initial load)
        // For background refreshes, keep isLoading false to avoid blocking UI
        if (!state.summary.data) {
          state.summary.isLoading = true;
        }
        state.summary.isError = false;
        state.summary.message = '';
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.summary.isLoading = false;
        state.summary.isSuccess = true;
        state.summary.data = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.summary.isLoading = false;
        state.summary.isError = true;
        state.summary.message = action.payload?.message || 'Failed to fetch dashboard summary';
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;

