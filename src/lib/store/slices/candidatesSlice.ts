// src/lib/store/slices/candidatesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, CreateCandidateInput } from '@/types/candidate';

// Mock service - sesuaikan dengan service yang sebenarnya
const candidateService = {
  createCandidate: async (candidateData: CreateCandidateInput): Promise<Candidate> => {
    // Simulasi API call - ganti dengan service Supabase yang sebenarnya
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `cand_${Date.now()}`,
          ...candidateData,
          status: 'new',
          applied_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }, 500);
    });
  },
};

// ✅ FIX: Gunakan CreateCandidateInput yang sesuai
export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (candidateData: CreateCandidateInput, { rejectWithValue }) => {
    try {
      const newCandidate = await candidateService.createCandidate(candidateData);
      return newCandidate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create candidate');
    }
  }
);

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  tableConfig: {
    columnOrder: string[];
    columnSizes: { [key: string]: number };
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    currentPage: number;
    pageSize: number;
  };
}

const initialState: CandidatesState = {
  candidates: [],
  loading: false,
  error: null,
  tableConfig: {
    columnOrder: [
      'full_name',
      'email',
      'phone_number',
      'gender',
      'linkedin_link',
      'domicile',
      'applied_date',
    ],
    columnSizes: {},
    sortBy: 'applied_date',
    sortDirection: 'desc',
    currentPage: 1,
    pageSize: 10,
  },
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      const index = state.candidates.findIndex(candidate => candidate.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload.updates };
      }
    },
    deleteCandidate: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter(candidate => candidate.id !== action.payload);
    },
    setCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.candidates = action.payload;
    },
    // Table configuration actions
    reorderColumns: (state, action: PayloadAction<string[]>) => {
      state.tableConfig.columnOrder = action.payload;
    },
    resizeColumn: (state, action: PayloadAction<{ columnId: string; width: number }>) => {
      state.tableConfig.columnSizes[action.payload.columnId] = action.payload.width;
    },
    setSort: (state, action: PayloadAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>) => {
      state.tableConfig.sortBy = action.payload.sortBy;
      state.tableConfig.sortDirection = action.payload.sortDirection;
    },
    setPagination: (state, action: PayloadAction<{ currentPage: number; pageSize: number }>) => {
      state.tableConfig.currentPage = action.payload.currentPage;
      state.tableConfig.pageSize = action.payload.pageSize;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.push(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  setCandidates,
  reorderColumns,
  resizeColumn,
  setSort,
  setPagination,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;