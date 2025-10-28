// src/lib/store/slices/jobsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '@/services/jobService';

export interface Job {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'inactive' | 'draft';
  department: string;
  salary_range: {
    min: number;
    max: number;
    currency: string;
    display_text: string;
  };
  description: string;
  application_form: {
    sections: Array<{
      title: string;
      fields: Array<{
        key: string;
        validation: {
          required: boolean;
        };
      }>;
    }>;
  };
  list_card?: {
    badge: string;
    started_on_text: string;
    cta: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  validation: {
    required: boolean;
  };
}

// Type untuk create job (tanpa auto-generated fields)
export type CreateJobInput = Omit<Job, 'id' | 'created_at' | 'updated_at'>;

// Type untuk update job
export type UpdateJobInput = Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  filters: {
    status: string;
    keyword: string;
  };
  loading: boolean;
  error: string | null;
}

// Initial state tanpa mock data - akan diambil dari API
const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  filters: {
    status: '',
    keyword: '',
  },
  loading: false,
  error: null,
};

// Async thunks untuk API calls
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const jobs = await jobService.fetchJobs();
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: CreateJobInput, { rejectWithValue }) => { // ✅ FIX: Use CreateJobInput type
    try {
      const newJob = await jobService.createJob(jobData);
      return newJob;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }: { id: string; jobData: UpdateJobInput }, { rejectWithValue }) => { // ✅ FIX: Use UpdateJobInput type
    try {
      const updatedJob = await jobService.updateJob(id, jobData);
      return updatedJob;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setKeywordFilter: (state, action: PayloadAction<string>) => {
      state.filters.keyword = action.payload;
    },
    updateFieldConfig: (state, action: PayloadAction<{ fieldKey: string; required: boolean }>) => {
      if (state.currentJob) {
        const field = state.currentJob.application_form.sections[0].fields.find(
          f => f.key === action.payload.fieldKey
        );
        if (field) {
          field.validation.required = action.payload.required;
        }
      }
    },
    setFormConfiguration: (state, action: PayloadAction<FormFieldConfig[]>) => {
      if (state.currentJob) {
        state.currentJob.application_form.sections[0].fields = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob && state.currentJob.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setJobs, 
  addJob, 
  deleteJob,
  setCurrentJob, 
  setStatusFilter, 
  setKeywordFilter,
  updateFieldConfig,
  setFormConfiguration,
  clearError,
} = jobsSlice.actions;

export default jobsSlice.reducer;