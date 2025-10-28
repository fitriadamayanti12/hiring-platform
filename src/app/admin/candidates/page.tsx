// src/app/admin/candidates/page.tsx - SERVER COMPONENT
import { Suspense } from 'react';
import CandidateManagementClient from './CandidateManagementClient';

interface CandidatesPageProps {
  searchParams: {
    jobId?: string;
    status?: string;
  };
}

export default function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const { jobId, status } = searchParams;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Candidate Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage job applicants and review their profiles
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/jobs"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Jobs
              </a>
            </div>
          </div>
        </div>

        <Suspense fallback={
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        }>
          <CandidateManagementClient 
            jobId={jobId}
            status={status}
          />
        </Suspense>
      </div>
    </div>
  );
}