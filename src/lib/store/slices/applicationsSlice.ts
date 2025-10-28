import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicant: any;
  formData: Record<string, string>;
  appliedDate: string;
  status: 'submitted' | 'reviewed' | 'accepted' | 'rejected';
}

export interface ApplicationsState {
  applications: Application[];
  currentApplication: Record<string, any>;
  submittedApplications: string[];
  errors: Record<string, string>;
}

const initialState: ApplicationsState = {
  applications: [],
  currentApplication: {},
  submittedApplications: [],
  errors: {},
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    updateApplicationField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      state.currentApplication[action.payload.field] = action.payload.value;
    },
    setApplicationErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    clearApplicationErrors: (state) => {
      state.errors = {};
    },
    submitApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
      state.submittedApplications.push(action.payload.id);
      state.currentApplication = {};
    },
    resetApplication: (state) => {
      state.currentApplication = {};
      state.errors = {};
    },
  },
});

export const {
  updateApplicationField,
  setApplicationErrors,
  clearApplicationErrors,
  submitApplication,
  resetApplication,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;