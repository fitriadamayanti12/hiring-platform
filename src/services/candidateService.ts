// src/services/candidateService.ts
import { supabase } from '@/lib/supabase'

export interface Candidate {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  linkedin_link?: string;
  domicile?: string;
  gender?: string;
  date_of_birth?: string;
  photo_profile?: string;
  status: 'applied' | 'reviewed' | 'rejected' | 'hired';
  applied_at: string;
  resume_url?: string;
}

export const candidateService = {
  async fetchCandidates(jobId?: string): Promise<Candidate[]> {
    try {
      let query = supabase
        .from('candidates')
        .select('*')
        .order('applied_at', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      throw error;
    }
  },

  async createCandidate(candidateData: Omit<Candidate, 'id' | 'applied_at' | 'status'>): Promise<Candidate> {
    try {
      const candidateWithDefaults = {
        ...candidateData,
        status: 'applied' as const,
        applied_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateWithDefaults])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create candidate:', error);
      throw error;
    }
  },

  async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Candidate> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      throw error;
    }
  },

  async deleteCandidate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      throw error;
    }
  }
};