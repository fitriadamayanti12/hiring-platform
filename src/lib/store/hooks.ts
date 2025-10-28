import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// Simple type definitions
export type RootState = {
  jobs: any;
  candidates: any;
  applications: any;
  webcam: any;
};

export type AppDispatch = any;
export type AppStore = any;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();