import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebcamState {
  isCameraActive: boolean;
  capturedImage: string | null;
  currentPose: number;
  isDetecting: boolean;
}

const initialState: WebcamState = {
  isCameraActive: false,
  capturedImage: null,
  currentPose: 0,
  isDetecting: false,
};

const webcamSlice = createSlice({
  name: 'webcam',
  initialState,
  reducers: {
    startCamera: (state) => {
      state.isCameraActive = true;
    },
    stopCamera: (state) => {
      state.isCameraActive = false;
    },
    setCapturedImage: (state, action: PayloadAction<string>) => {
      state.capturedImage = action.payload;
    },
    setCurrentPose: (state, action: PayloadAction<number>) => {
      state.currentPose = action.payload;
    },
    startDetection: (state) => {
      state.isDetecting = true;
    },
    stopDetection: (state) => {
      state.isDetecting = false;
    },
    resetWebcam: (state) => {
      state.isCameraActive = false;
      state.capturedImage = null;
      state.currentPose = 0;
      state.isDetecting = false;
    },
  },
});

export const {
  startCamera,
  stopCamera,
  setCapturedImage,
  setCurrentPose,
  startDetection,
  stopDetection,
  resetWebcam,
} = webcamSlice.actions;

export default webcamSlice.reducer;