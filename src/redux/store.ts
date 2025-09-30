import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filtersSlice";
import naviagtionPathReducer from "./navigationPathSlice";
import layoutReducer from "./layoutSlice";
import notificationsReducer from "./notificationsSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    navigationPath: naviagtionPathReducer,
    layout: layoutReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
