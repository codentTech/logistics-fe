import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import driversService from './drivers.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const initialState = {
  list: [],
  current: null,
  locations: {},
  ...generalState,
};

// Get all drivers
export const getAllDrivers = createAsyncThunk(
  'drivers/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await driversService.getAllDrivers(params);
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

// Get driver by ID
export const getDriverById = createAsyncThunk(
  'drivers/getById',
  async (driverId, thunkAPI) => {
    try {
      const response = await driversService.getDriverById(driverId);
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

export const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    reset: (state) => {
      state.list = [];
      state.current = null;
      state.locations = {};
      Object.assign(state, generalState);
    },
    setCurrentDriver: (state, action) => {
      state.current = action.payload;
    },
    clearCurrentDriver: (state) => {
      state.current = null;
    },
    updateDriverLocation: (state, action) => {
      const { driverId, location } = action.payload;
      if (driverId && location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        state.locations = {
          ...state.locations,
          [driverId]: {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp || new Date().toISOString(),
          },
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all drivers
      .addCase(getAllDrivers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAllDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.list = action.payload;
      })
      .addCase(getAllDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to fetch drivers';
      })
      // Get driver by ID
      .addCase(getDriverById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getDriverById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.current = action.payload;
      })
      .addCase(getDriverById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to fetch driver';
      });
  },
});

export const { reset, setCurrentDriver, clearCurrentDriver, updateDriverLocation } =
  driversSlice.actions;
export default driversSlice.reducer;

