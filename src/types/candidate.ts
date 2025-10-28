// src/types/candidate.ts
export interface Candidate {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  linkedin_link?: string;
  gender?: string;
  domicile?: string;
  date_of_birth?: string;
  photo_url?: string;
  status: string;
  applied_date: string; // Changed from applied_at
  created_at?: string;
  updated_at?: string;
  application_id?: string;
}

// Type untuk create candidate - sesuai dengan yang diharapkan service
export type CreateCandidateInput = Omit<Candidate, 'id' | 'status' | 'applied_date' | 'created_at' | 'updated_at'>;