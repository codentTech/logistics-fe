import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import shipmentsService from './shipments.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const initialState = {
  shipments: {
    list: [],
    current: null,
    ...generalState,
  },
  create: generalState,
  assignDriver: generalState,
  updateStatus: generalState,
  cancelByCustomer: generalState,
  cancelByDriver: generalState,
};

// Get all shipments
export const getAllShipments = createAsyncThunk(
  'shipments/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await shipmentsService.getAllShipments(params);
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

// Get shipment by ID
export const getShipmentById = createAsyncThunk(
  'shipments/getById',
  async (shipmentId, thunkAPI) => {
    try {
      const response = await shipmentsService.getShipmentById(shipmentId);
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

// Create shipment
export const createShipment = createAsyncThunk(
  'shipments/create',
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await shipmentsService.createShipment(payload);
      if (response.success) {
        if (successCallBack) {
          successCallBack(response.data);
        }
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

// Assign driver
export const assignDriver = createAsyncThunk(
  'shipments/assignDriver',
  async ({ shipmentId, driverId, successCallBack }, thunkAPI) => {
    try {
      const response = await shipmentsService.assignDriver(shipmentId, driverId);
      if (response.success) {
        if (successCallBack) {
          successCallBack(response.data);
        }
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

// Update status
export const updateStatus = createAsyncThunk(
  'shipments/updateStatus',
  async ({ shipmentId, status, successCallBack }, thunkAPI) => {
    try {
      const response = await shipmentsService.updateStatus(shipmentId, status);
      if (response.success) {
        if (successCallBack) {
          successCallBack(response.data);
        }
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

// Cancel by customer
export const cancelByCustomer = createAsyncThunk(
  'shipments/cancelByCustomer',
  async ({ shipmentId, successCallBack }, thunkAPI) => {
    try {
      const response = await shipmentsService.cancelByCustomer(shipmentId);
      if (response.success) {
        if (successCallBack) {
          successCallBack(response.data);
        }
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

// Cancel by driver
export const cancelByDriver = createAsyncThunk(
  'shipments/cancelByDriver',
  async ({ shipmentId, successCallBack }, thunkAPI) => {
    try {
      const response = await shipmentsService.cancelByDriver(shipmentId);
      if (response.success) {
        if (successCallBack) {
          successCallBack(response.data);
        }
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

export const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    reset: (state) => {
      state.create = generalState;
      state.assignDriver = generalState;
      state.updateStatus = generalState;
      state.cancelByCustomer = generalState;
      state.cancelByDriver = generalState;
    },
    setCurrentShipment: (state, action) => {
      state.shipments.current = action.payload;
    },
    clearCurrentShipment: (state) => {
      state.shipments.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all shipments
      .addCase(getAllShipments.pending, (state) => {
        state.shipments.isLoading = true;
        state.shipments.isError = false;
        state.shipments.message = '';
      })
      .addCase(getAllShipments.fulfilled, (state, action) => {
        state.shipments.isLoading = false;
        state.shipments.isSuccess = true;
        state.shipments.list = action.payload;
      })
      .addCase(getAllShipments.rejected, (state, action) => {
        state.shipments.isLoading = false;
        state.shipments.isError = true;
        state.shipments.message = action.payload?.message || 'Failed to fetch shipments';
      })
      // Get shipment by ID
      .addCase(getShipmentById.pending, (state) => {
        state.shipments.isLoading = true;
        state.shipments.isError = false;
        state.shipments.message = '';
      })
      .addCase(getShipmentById.fulfilled, (state, action) => {
        state.shipments.isLoading = false;
        state.shipments.isSuccess = true;
        state.shipments.current = action.payload;
      })
      .addCase(getShipmentById.rejected, (state, action) => {
        state.shipments.isLoading = false;
        state.shipments.isError = true;
        state.shipments.message = action.payload?.message || 'Failed to fetch shipment';
      })
      // Create shipment
      .addCase(createShipment.pending, (state) => {
        state.create.isLoading = true;
        state.create.isError = false;
        state.create.message = '';
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
        // Add to list
        state.shipments.list = [action.payload, ...state.shipments.list];
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.message = action.payload?.message || 'Failed to create shipment';
      })
      // Assign driver
      .addCase(assignDriver.pending, (state) => {
        state.assignDriver.isLoading = true;
        state.assignDriver.isError = false;
        state.assignDriver.message = '';
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        state.assignDriver.isLoading = false;
        state.assignDriver.isSuccess = true;
        state.assignDriver.data = action.payload;
        // Update in list
        const index = state.shipments.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shipments.list[index] = action.payload;
        }
        // Update current if it's the same shipment
        if (state.shipments.current?.id === action.payload.id) {
          state.shipments.current = action.payload;
        }
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.assignDriver.isLoading = false;
        state.assignDriver.isError = true;
        state.assignDriver.message = action.payload?.message || 'Failed to assign driver';
      })
      // Update status
      .addCase(updateStatus.pending, (state) => {
        state.updateStatus.isLoading = true;
        state.updateStatus.isError = false;
        state.updateStatus.message = '';
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.updateStatus.isLoading = false;
        state.updateStatus.isSuccess = true;
        state.updateStatus.data = action.payload;
        // Update in list
        const index = state.shipments.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shipments.list[index] = action.payload;
        }
        // Update current if it's the same shipment
        if (state.shipments.current?.id === action.payload.id) {
          state.shipments.current = action.payload;
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.updateStatus.isLoading = false;
        state.updateStatus.isError = true;
        state.updateStatus.message = action.payload?.message || 'Failed to update status';
      })
      // Cancel by customer
      .addCase(cancelByCustomer.pending, (state) => {
        state.cancelByCustomer.isLoading = true;
        state.cancelByCustomer.isError = false;
        state.cancelByCustomer.message = '';
      })
      .addCase(cancelByCustomer.fulfilled, (state, action) => {
        state.cancelByCustomer.isLoading = false;
        state.cancelByCustomer.isSuccess = true;
        state.cancelByCustomer.data = action.payload;
        // Update in list
        const index = state.shipments.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shipments.list[index] = action.payload;
        }
        // Update current if it's the same shipment
        if (state.shipments.current?.id === action.payload.id) {
          state.shipments.current = action.payload;
        }
      })
      .addCase(cancelByCustomer.rejected, (state, action) => {
        state.cancelByCustomer.isLoading = false;
        state.cancelByCustomer.isError = true;
        state.cancelByCustomer.message = action.payload?.message || 'Failed to cancel shipment';
      })
      // Cancel by driver
      .addCase(cancelByDriver.pending, (state) => {
        state.cancelByDriver.isLoading = true;
        state.cancelByDriver.isError = false;
        state.cancelByDriver.message = '';
      })
      .addCase(cancelByDriver.fulfilled, (state, action) => {
        state.cancelByDriver.isLoading = false;
        state.cancelByDriver.isSuccess = true;
        state.cancelByDriver.data = action.payload;
        // Update in list
        const index = state.shipments.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shipments.list[index] = action.payload;
        }
        // Update current if it's the same shipment
        if (state.shipments.current?.id === action.payload.id) {
          state.shipments.current = action.payload;
        }
      })
      .addCase(cancelByDriver.rejected, (state, action) => {
        state.cancelByDriver.isLoading = false;
        state.cancelByDriver.isError = true;
        state.cancelByDriver.message = action.payload?.message || 'Failed to cancel shipment';
      });
  },
});

export const { reset, setCurrentShipment, clearCurrentShipment } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;

