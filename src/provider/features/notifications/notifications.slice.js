import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import notificationsService from './notifications.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null,
};

const initialState = {
  notifications: [],
  total: 0,
  unreadCount: 0,
  list: generalState,
  unreadCountState: generalState,
  markAsRead: generalState,
  markAllAsRead: generalState,
};

// Get all notifications
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (params, thunkAPI) => {
    try {
      const response = await notificationsService.getNotifications(params);
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

// Get unread count
export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.getUnreadCount();
      if (response.success) {
        return response.data.count;
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

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, thunkAPI) => {
    try {
      const response = await notificationsService.markAsRead(notificationId);
      if (response.success) {
        return { notificationId, notification: response.data };
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

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.markAllAsRead();
      if (response.success) {
        return true;
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

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Add notification to the beginning of the list
      state.notifications.unshift(action.payload);
      // Increment unread count if notification is unread
      if (action.payload.status === 'UNREAD') {
        state.unreadCount += 1;
      }
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        const oldStatus = state.notifications[index].status;
        state.notifications[index] = action.payload;
        // Update unread count if status changed
        if (oldStatus === 'UNREAD' && action.payload.status === 'READ') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (oldStatus === 'READ' && action.payload.status === 'UNREAD') {
          state.unreadCount += 1;
        }
      }
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    reset: (state) => {
      state.notifications = [];
      state.total = 0;
      state.unreadCount = 0;
      state.list = generalState;
      state.unreadCountState = generalState;
      state.markAsRead = generalState;
      state.markAllAsRead = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.list.isLoading = true;
        state.list.isError = false;
        state.list.isSuccess = false;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.list.isLoading = false;
        state.list.isSuccess = true;
        // Filter out invalid/empty notifications
        const allNotifications = action.payload?.notifications || [];
        state.notifications = allNotifications.filter((notification) => {
          return (
            notification &&
            typeof notification === 'object' &&
            notification.id &&
            (notification.title || notification.message)
          );
        });
        state.total = action.payload?.total || 0;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.list.isLoading = false;
        state.list.isError = true;
        state.list.message = action.payload?.message || 'Failed to fetch notifications';
      })
      // Get unread count
      .addCase(getUnreadCount.pending, (state) => {
        state.unreadCountState.isLoading = true;
        state.unreadCountState.isError = false;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCountState.isLoading = false;
        state.unreadCountState.isSuccess = true;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.unreadCountState.isLoading = false;
        state.unreadCountState.isError = true;
        state.unreadCountState.message = action.payload?.message || 'Failed to fetch unread count';
      })
      // Mark as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markAsRead.isLoading = true;
        state.markAsRead.isError = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markAsRead.isLoading = false;
        state.markAsRead.isSuccess = true;
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.notificationId
        );
        if (index !== -1) {
          state.notifications[index] = action.payload.notification;
          if (action.payload.notification.status === 'READ') {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markAsRead.isLoading = false;
        state.markAsRead.isError = true;
        state.markAsRead.message = action.payload?.message || 'Failed to mark notification as read';
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.markAllAsRead.isLoading = true;
        state.markAllAsRead.isError = false;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.markAllAsRead.isLoading = false;
        state.markAllAsRead.isSuccess = true;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          status: 'READ',
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.markAllAsRead.isLoading = false;
        state.markAllAsRead.isError = true;
        state.markAllAsRead.message = action.payload?.message || 'Failed to mark all as read';
      });
  },
});

export const {
  addNotification,
  updateNotification,
  incrementUnreadCount,
  decrementUnreadCount,
  reset,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

