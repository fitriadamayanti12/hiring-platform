// src/lib/services/candidateService.ts
import { createClient } from '@supabase/supabase-js';
import { Candidate, CreateCandidateInput } from '@/types/candidate';

// Ekspor types
export type { Candidate, CreateCandidateInput };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const candidateService = {
  createCandidate: async (candidateData: CreateCandidateInput): Promise<Candidate> => {
    // Tambahkan field yang di-generate otomatis
    const dataToInsert = {
      ...candidateData,
      status: 'new',
      applied_date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('candidates')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create candidate: ${error.message}`);
    }

    return data;
  },

  getCandidates: async (jobId?: string): Promise<Candidate[]> => {
    let query = supabase
      .from('candidates')
      .select('*')
      .order('applied_date', { ascending: false });

    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch candidates: ${error.message}`);
    }

    return data || [];
  },
};