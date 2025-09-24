
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import layoutReducer from './layoutSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
