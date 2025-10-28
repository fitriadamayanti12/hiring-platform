// src/redux/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../slices/jobsSlice';
import candidatesReducer from '../slices/candidatesSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    candidates: candidatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;