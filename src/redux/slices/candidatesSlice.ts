// src/redux/slices/candidatesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { candidateService, Candidate } from '@/services/candidateService';

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
}

const initialState: CandidatesState = {
  candidates: [],
  loading: false,
  error: null,
};

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (jobId?: string, { rejectWithValue }) => {
    try {
      const candidates = await candidateService.fetchCandidates(jobId);
      return candidates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch candidates');
    }
  }
);

export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (candidateData: Omit<Candidate, 'id' | 'applied_at' | 'status'>, { rejectWithValue }) => {
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
      .addCase(fetchCandidates.fulfilled, (state, action: PayloadAction<Candidate[]>) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.candidates.unshift(action.payload);
      });
  },
});

export const { clearError } = candidatesSlice.actions;
export default candidatesSlice.reducer;