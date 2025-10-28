"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchJobs } from "@/redux/slices/jobsSlice";
import type { Job } from "@/redux/slices/jobsSlice";

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, loading, error } = useAppSelector((state) => state.jobs);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Fetch jobs on component mount
  useEffect(() => {
    console.log("🔄 Fetching jobs for user page...");
    dispatch(fetchJobs());
  }, [dispatch]);

  // Filter active jobs only with safe access
  const activeJobs = useMemo(() => {
    console.log("📊 Raw jobs:", jobs);
    const filtered = jobs.filter((job: Job) => {
      // Pastikan job memiliki status dan statusnya adalah 'active'
      const isActive = job.status?.toLowerCase() === "active";
      console.log(
        `Job: ${job.title}, Status: ${job.status}, Is Active: ${isActive}`
      );
      return isActive;
    });
    console.log("✅ Active jobs:", filtered);
    return filtered;
  }, [jobs]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = activeJobs
      .map((job: Job) => job.department)
      .filter(Boolean)
      .filter((dept): dept is string => dept !== undefined && dept !== null);
    return [...new Set(depts)];
  }, [activeJobs]);

  // Filter jobs based on search and department
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job: Job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || job.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [activeJobs, searchTerm, selectedDepartment]);

  // Debug useEffect
  useEffect(() => {
    console.log("🔍 Debug Info:", {
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      filteredJobs: filteredJobs.length,
      searchTerm,
      selectedDepartment,
    });
  }, [jobs, activeJobs, filteredJobs, searchTerm, selectedDepartment]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Your Dream Job
              </h1>
              <p className="text-gray-600 mt-2">
                Discover opportunities that match your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Jobs
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by job title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map((dept: string) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} of{" "}
                {activeJobs.length} active jobs
              </p>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job: Job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
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
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center text-gray-800 font-medium mb-4">
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
                  <span>
                    {job.salary_range?.display_text || "Salary not specified"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description || "No description available"}
                </p>

                {/* Status Badge untuk debugging */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.status || "unknown"}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  View Details
                </Link>
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeJobs.length === 0
                  ? "No active jobs available"
                  : "No jobs found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeJobs.length === 0
                  ? "There are no active job postings at the moment. Please check back later."
                  : "Try adjusting your search criteria to find more opportunities."}
              </p>

              {/* Debug Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Debug: Total jobs in system: {jobs.length} | Active jobs:{" "}
                  {activeJobs.length} | Filtered jobs: {filteredJobs.length}
                </p>
              </div>

              {activeJobs.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
