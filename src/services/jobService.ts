// src/services/jobService.ts
import { supabase } from '@/lib/supabase'

export interface Job {
  id: string;
  title: string;
  department: string;
  status: "active" | "inactive" | "draft";
  description?: string;
  salary_range: {
    display_text: string;
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
}

export const jobService = {
  async fetchJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  },

  async fetchJob(id: string): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch job:', error);
      throw error;
    }
  },

  async createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create job:', error);
      throw error;
    }
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  },

  async deleteJob(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw error;
    }
  }
};