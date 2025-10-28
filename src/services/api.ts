// src/services/api.ts
const API_BASE = "http://localhost:3001";

// Generic fetch helper
const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  // Jobs
  getJobs: () => fetchAPI("/jobs"),
  getJob: (id: string) => fetchAPI(`/jobs/${id}`),
  createJob: (jobData: any) =>
    fetchAPI("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
  updateJob: (id: string, jobData: any) =>
    fetchAPI(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    }),

  // Candidates
  getCandidates: () => fetchAPI("/candidates"),
  getCandidate: (id: string) => fetchAPI(`/candidates/${id}`),
  createCandidate: (candidateData: any) =>
    fetchAPI("/candidates", {
      method: "POST",
      body: JSON.stringify(candidateData),
    }),

  // Applications
  getApplications: () => fetchAPI("/applications"),
  createApplication: (applicationData: any) =>
    fetchAPI("/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    }),
};
