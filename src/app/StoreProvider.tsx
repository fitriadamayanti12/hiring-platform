// app/StoreProvider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import authReducer from '../lib/store/slices/authSlice';
import jobsReducer from '../lib/store/slices/jobsSlice';
import candidatesReducer from '../lib/store/slices/candidatesSlice';
import applicationsReducer from '../lib/store/slices/applicationsSlice';
import webcamReducer from '../lib/store/slices/webcamSlice';

// Create store function dengan middleware tambahan jika diperlukan
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      jobs: jobsReducer,
      candidates: candidatesReducer,
      applications: applicationsReducer,
      webcam: webcamReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          // Ignore these field paths in all actions
          ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
          // Ignore these paths in the state
          ignoredPaths: ['items.dates'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
  });
};

// Export types untuk typed hooks
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  // Initialize store only once
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}