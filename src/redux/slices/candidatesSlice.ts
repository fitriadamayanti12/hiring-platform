// src/redux/slices/candidatesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { candidateService } from '@/services/candidateService';
import { Candidate } from '@/types/candidate';

interface CandidatesState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  filters: {
    status: string;
    keyword: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: CandidatesState = {
  candidates: [],
  currentCandidate: null,
  filters: {
    status: '',
    keyword: '',
  },
  loading: false,
  error: null,
};

// Async thunks dengan tipe yang eksplisit
export const fetchCandidates = createAsyncThunk<
  Candidate[], // Return type
  string | undefined, // Args type (jobId bisa undefined)
  { rejectValue: string } // Reject type
>(
  'candidates/fetchCandidates',
  async (jobId, { rejectWithValue }) => {
    try {
      const candidates = await candidateService.getCandidates(jobId);
      return candidates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch candidates');
    }
  }
);

export const createCandidate = createAsyncThunk<
  Candidate, // Return type
  any, // Args type (gunakan any sementara, atau sesuaikan dengan CreateCandidateInput)
  { rejectValue: string } // Reject type
>(
  'candidates/createCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      const newCandidate = await candidateService.createCandidate(candidateData);
      return newCandidate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create candidate');
    }
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.candidates = action.payload;
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.currentCandidate = action.payload;
    },
    updateCandidateStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.id);
      if (candidate) {
        candidate.status = action.payload.status;
      }
      if (state.currentCandidate && state.currentCandidate.id === action.payload.id) {
        state.currentCandidate.status = action.payload.status;
      }
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setKeywordFilter: (state, action: PayloadAction<string>) => {
      state.filters.keyword = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.candidates.push(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});

export const { 
  setCandidates, 
  setCurrentCandidate, 
  updateCandidateStatus,
  setStatusFilter,
  setKeywordFilter,
  clearError 
} = candidatesSlice.actions;

export default candidatesSlice.reducer;