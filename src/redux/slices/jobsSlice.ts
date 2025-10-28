// src/redux/slices/jobsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobService } from '@/services/jobService';

export interface Job {
  id: string;
  title: string;
  department: string;
  status: "active" | "inactive" | "draft";
  description?: string;
  salary_range: {
    display_text: string;
    min?: number;
    max?: number;
    currency?: string;
  };
  list_card?: {
    badge: string;
    started_on_text: string;
    cta: string;
  };
  application_form?: {
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
  created_at?: string;
  updated_at?: string;
  slug?: string;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  currentJob: Job | null;
  operationLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  currentJob: null,
  operationLoading: {
    create: false,
    update: false,
    delete: false,
  },
};

// Enhanced async thunks with better error handling
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching jobs from Supabase...');
      const jobs = await jobService.fetchJobs();
      console.log('✅ Jobs fetched successfully:', jobs?.length || 0, 'jobs');
      return jobs;
    } catch (error: any) {
      console.error('❌ Error fetching jobs:', error);
      const errorMessage = error?.message || 'Failed to fetch jobs';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching job by ID:', id);
      const job = await jobService.fetchJob(id);
      console.log('✅ Job fetched successfully:', job?.title);
      return job;
    } catch (error: any) {
      console.error('❌ Error fetching job:', error);
      const errorMessage = error?.message || 'Failed to fetch job';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Omit<Job, 'id'>, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating job with data:', jobData);
      const newJob = await jobService.createJob(jobData);
      console.log('✅ Job created successfully:', newJob);
      return newJob;
    } catch (error: any) {
      console.error('❌ Error creating job:', error);
      
      // Enhanced error message extraction
      let errorMessage = 'Failed to create job';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      console.error('📋 Extracted error message:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }: { id: string; jobData: Partial<Job> }, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating job:', id, jobData);
      const updatedJob = await jobService.updateJob(id, jobData);
      console.log('✅ Job updated successfully:', updatedJob);
      return updatedJob;
    } catch (error: any) {
      console.error('❌ Error updating job:', error);
      const errorMessage = error?.message || 'Failed to update job';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting job:', id);
      await jobService.deleteJob(id);
      console.log('✅ Job deleted successfully');
      return id;
    } catch (error: any) {
      console.error('❌ Error deleting job:', error);
      const errorMessage = error?.message || 'Failed to delete job';
      return rejectWithValue(errorMessage);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    setCurrentJob: (state, action: PayloadAction<Job>) => {
      state.currentJob = action.payload;
    },
    resetOperationLoading: (state) => {
      state.operationLoading = {
        create: false,
        update: false,
        delete: false,
      };
    },
    // Add manual job for fallback/offline support
    addJobManually: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Fetching jobs...');
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
        console.log('✅ Jobs fetched and stored in state');
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('❌ Jobs fetch failed:', action.payload);
      })
      
      // Fetch Job By ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Fetching job by ID...');
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.currentJob = action.payload;
        console.log('✅ Job by ID fetched successfully');
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('❌ Job by ID fetch failed:', action.payload);
      })
      
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.operationLoading.create = true;
        state.error = null;
        console.log('⏳ Creating job...');
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.operationLoading.create = false;
        state.jobs.unshift(action.payload); // Add to beginning of list
        state.currentJob = action.payload;
        console.log('✅ Job created and added to state');
      })
      .addCase(createJob.rejected, (state, action) => {
        state.operationLoading.create = false;
        state.error = action.payload as string;
        console.error('❌ Job creation failed:', action.payload);
      })
      
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.operationLoading.update = true;
        state.error = null;
        console.log('⏳ Updating job...');
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.operationLoading.update = false;
        
        // Update in jobs array
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        
        // Update current job if it's the one being updated
        if (state.currentJob && state.currentJob.id === action.payload.id) {
          state.currentJob = action.payload;
        }
        
        console.log('✅ Job updated in state');
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.operationLoading.update = false;
        state.error = action.payload as string;
        console.error('❌ Job update failed:', action.payload);
      })
      
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.operationLoading.delete = true;
        state.error = null;
        console.log('⏳ Deleting job...');
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.operationLoading.delete = false;
        
        // Remove from jobs array
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        
        // Clear current job if it's the one being deleted
        if (state.currentJob && state.currentJob.id === action.payload) {
          state.currentJob = null;
        }
        
        console.log('✅ Job deleted from state');
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.operationLoading.delete = false;
        state.error = action.payload as string;
        console.error('❌ Job deletion failed:', action.payload);
      });
  },
});

export const { 
  clearError, 
  clearCurrentJob, 
  setCurrentJob,
  resetOperationLoading,
  addJobManually 
} = jobsSlice.actions;

export default jobsSlice.reducer;