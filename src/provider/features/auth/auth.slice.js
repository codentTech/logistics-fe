import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser, removeUser } from "@/common/utils/users.util";
import authService from "./auth.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

// Get user from localStorage
const user = getUser();
const initialState = {
  isCreatorMode: null,
  sidebarToggleItem: false,
  logoutLoader: false,
  login: generalState,
  logout: generalState,
};

// Login user - OpsCore format
export const login = createAsyncThunk(
  "auth/login",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await authService.login(payload);
      if (response.success && response.token) {
        if (successCallBack) {
          successCallBack(response.user);
        }
        return { user: response.user, token: response.token };
      }
      return thunkAPI.rejectWithValue({
        message: response.message || 'Login failed',
        error_code: response.error_code,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message || 'Login failed',
        error_code: error.response?.data?.error_code,
      });
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await authService.logout();
    removeUser();
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue({
      message: response.message || 'Logout failed',
    });
  } catch (error) {
    removeUser();
    return thunkAPI.rejectWithValue({
      message: error.message || 'Logout failed',
    });
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsCreatorModeMode: (state, action) => {
      state.isCreatorMode = action.payload;
    },
    setSidebarToggleItem: (state, action) => {
      state.sidebarToggleItem = action.payload;
    },
    setLogoutLoader: (state, action) => {
      state.logoutLoader = action.payload;
    },
    reset: (state) => {
      state.login = generalState;
      state.logout = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.message = "";
        state.login.isError = false;
        state.login.isSuccess = false;
        state.login.data = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false;
        state.login.isSuccess = true;
        state.login.data = action.payload;
        state.login.message = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.login.message = action.payload?.message || 'Login failed';
        state.login.isLoading = false;
        state.login.isError = true;
        state.login.data = null;
      })
      .addCase(logout.pending, (state) => {
        state.logout.isLoading = true;
        state.logout.message = "";
        state.logout.isError = false;
        state.logout.isSuccess = false;
        state.logout.data = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.logout.isLoading = false;
        state.logout.isSuccess = true;
        state.logout.data = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logout.message = action.payload?.message || 'Logout failed';
        state.logout.isLoading = false;
        state.logout.isError = true;
        state.logout.data = null;
      });
  },
});

export const { reset, setIsCreatorModeMode, setSidebarToggleItem, setLogoutLoader } =
  authSlice.actions;

export default authSlice.reducer;
