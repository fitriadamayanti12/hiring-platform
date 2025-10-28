import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from '@/services/candidateService';

export interface CandidateAttribute {
  key: string;
  label: string;
  value: string;
  order: number;
}

export interface Candidate {
  id: string;
  jobId?: string;
  jobTitle?: string;
  applicant?: any;
  formData?: Record<string, string>;
  attributes: CandidateAttribute[];
  applied_date?: string;
  status?: string;
}

interface TableConfig {
  columnOrder: string[];
  columnSizes: { [key: string]: number };
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
}

export interface CandidatesState {
  candidates: Candidate[];
  tableConfig: TableConfig;
  loading: boolean;
  error: string | null;
}

const initialState: CandidatesState = {
  candidates: [], // Data akan diambil dari API
  tableConfig: {
    columnOrder: ['full_name', 'email', 'phone', 'gender', 'linkedin_link', 'domicile', 'applied_date'],
    columnSizes: {
      full_name: 200,
      email: 250,
      phone: 150,
      gender: 100,
      linkedin_link: 200,
      domicile: 150,
      applied_date: 150,
    },
    sortBy: 'applied_date',
    sortDirection: 'desc',
    currentPage: 1,
    pageSize: 10,
  },
  loading: false,
  error: null,
};

// Async thunks untuk API calls
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      const candidates = await candidateService.fetchCandidates();
      return candidates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch candidates');
    }
  }
);

export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (candidateData: Omit<Candidate, 'id'>, { rejectWithValue }) => {
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
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    resizeColumn: (state, action: PayloadAction<{ columnId: string; width: number }>) => {
      const { columnId, width } = action.payload;
      state.tableConfig.columnSizes[columnId] = width;
    },
    reorderColumns: (state, action: PayloadAction<string[]>) => {
      state.tableConfig.columnOrder = action.payload;
    },
    setSort: (state, action: PayloadAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>) => {
      state.tableConfig.sortBy = action.payload.sortBy;
      state.tableConfig.sortDirection = action.payload.sortDirection;
    },
    setPagination: (state, action: PayloadAction<{ currentPage: number; pageSize: number }>) => {
      state.tableConfig.currentPage = action.payload.currentPage;
      state.tableConfig.pageSize = action.payload.pageSize;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action untuk submit application (kompatibel dengan kode existing)
    submitApplication: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
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
        state.error = action.payload as string;
      })
      // Create Candidate
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
  setCandidates, 
  addCandidate, 
  resizeColumn, 
  reorderColumns, 
  setSort, 
  setPagination,
  clearError,
  submitApplication,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;