import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import shipmentsReducer from "./features/shipments/shipments.slice";
import driversReducer from "./features/drivers/drivers.slice";
import dashboardReducer from "./features/dashboard/dashboard.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  shipments: shipmentsReducer,
  drivers: driversReducer,
  dashboard: dashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
