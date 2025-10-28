"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchJobs, deleteJob, clearError } from "../../../redux/slices/jobsSlice";
import type { Job } from "../../../redux/slices/jobsSlice";

export default function AdminJobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, loading, error } = useAppSelector((state) => state.jobs);
  const [statusFilter, setStatusFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Filter jobs berdasarkan status dan keyword
  const filteredJobs = jobs.filter((job: Job) => {
    const matchesStatus = statusFilter ? job.status === statusFilter : true;
    const matchesKeyword = keywordFilter
      ? job.title.toLowerCase().includes(keywordFilter.toLowerCase()) ||
        job.department.toLowerCase().includes(keywordFilter.toLowerCase())
      : true;
    return matchesStatus && matchesKeyword;
  });

  // Handle delete job
  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteJob(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete job:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-2">
              Manage your job postings and applications
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your job postings and applications
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search jobs by title or department..."
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[300px]"
            />
          </div>

          {/* Create Job Button */}
          <Link
            href="/admin/jobs/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            + Create Job
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Job Stats */}
        {jobs.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((job: Job) => job.status === "active").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((job: Job) => job.status === "draft").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      jobs.filter((job: Job) => job.status === "inactive")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job: Job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    job.status
                  )}`}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm">{job.department}</span>
                </div>

                <div className="flex items-center text-gray-800 font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span className="text-sm">
                    {job.salary_range.display_text}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-xs">
                  {job.list_card?.started_on_text || "Recently created"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deletingId === job.id}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-colors font-medium"
                  >
                    {deletingId === job.id ? "Deleting..." : "Delete"}
                  </button>
                  <Link
                    href={`/admin/candidates?jobId=${job.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Manage Job
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0 ? "No jobs yet" : "No jobs found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {jobs.length === 0
                  ? "Get started by creating your first job posting."
                  : "Try adjusting your filters to find what you're looking for."}
              </p>
              <Link
                href="/admin/jobs/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Create Job
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
