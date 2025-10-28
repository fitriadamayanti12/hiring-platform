'use client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import authReducer from '../lib/store/slices/authSlice';
import jobsReducer from '../lib/store/slices/jobsSlice';
import candidatesReducer from '../lib/store/slices/candidatesSlice';
import applicationsReducer from '../lib/store/slices/applicationsSlice';
import webcamReducer from '../lib/store/slices/webcamSlice';

// Create store
const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    candidates: candidatesReducer,
    applications: applicationsReducer,
    webcam: webcamReducer,
  },
});

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}