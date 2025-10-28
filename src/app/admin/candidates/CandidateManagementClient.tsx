// src/app/admin/candidates/CandidateManagementClient.tsx - CLIENT COMPONENT
"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// ✅ Type Definitions
interface Candidate {
  id: string;
  application_id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  linkedin_link: string;
  gender: string;
  domicile: string;
  date_of_birth: string;
  photo_url: string;
  status: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
  applications?: {
    job_title: string;
  };
}

interface Job {
  id: string;
  title: string;
  department: string;
  status: string;
  salary_range?: {
    display_text: string;
  };
}

interface ColumnConfig {
  [key: string]: {
    label: string;
    defaultWidth: number;
  };
}

interface TableConfig {
  columnOrder: string[];
  columnSizes: { [key: string]: number };
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  pageSize: number;
}

interface CandidateManagementClientProps {
  jobId?: string;
  status?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CandidateManagementClient({ jobId, status }: CandidateManagementClientProps) {
  // State untuk data dari Supabase
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get jobs from Redux store (untuk info job)
  const jobs = useSelector((state: any) => state.jobs.jobs);

  // Get current job details if jobId is provided
  const currentJob = useMemo(() => {
    if (!jobId) return null;
    return jobs.find((job: Job) => job.id === jobId);
  }, [jobId, jobs]);

  // Fetch candidates dari Supabase
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('candidates')
          .select(`
            *,
            applications (
              job_title
            )
          `);

        // Filter by jobId jika ada
        if (jobId) {
          query = query.eq('job_id', jobId);
        }

        // Filter by status jika ada
        if (status) {
          query = query.eq('status', status);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(`Failed to fetch candidates: ${supabaseError.message}`);
        }

        setCandidates(data || []);
      } catch (err: any) {
        console.error('Error fetching candidates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId, status]);

  // Table configuration
  const tableConfig: TableConfig = {
    columnOrder: [
      "full_name",
      "email",
      "phone_number",
      "gender",
      "linkedin_link",
      "domicile",
      "applied_date",
    ],
    columnSizes: {},
    sortBy: "applied_date",
    sortDirection: "desc",
    currentPage: 1,
    pageSize: 10,
  };

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [localTableConfig, setLocalTableConfig] = useState<TableConfig>(tableConfig);

  // Handle column resize
  const handleResizeStart = (columnKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(columnKey);

    const startX = e.clientX;
    const startWidth = localTableConfig.columnSizes[columnKey] || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColumn) return;

      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));

      setLocalTableConfig(prev => ({
        ...prev,
        columnSizes: {
          ...prev.columnSizes,
          [columnKey]: newWidth
        }
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle column reorder
  const handleDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumn) return;

    const newOrder = [...localTableConfig.columnOrder];
    const fromIndex = newOrder.indexOf(draggedColumn);
    const toIndex = newOrder.indexOf(targetColumn);

    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedColumn);

    setLocalTableConfig(prev => ({
      ...prev,
      columnOrder: newOrder
    }));
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const newSortDirection =
      localTableConfig.sortBy === columnKey && localTableConfig.sortDirection === "asc"
        ? "desc"
        : "asc";

    setLocalTableConfig(prev => ({
      ...prev,
      sortBy: columnKey,
      sortDirection: newSortDirection
    }));
  };

  // Get sorted candidates
  const sortedCandidates = useMemo(() => {
    if (!localTableConfig.sortBy) return candidates;

    return [...candidates].sort((a, b) => {
      const aValue = a[localTableConfig.sortBy as keyof Candidate] || "";
      const bValue = b[localTableConfig.sortBy as keyof Candidate] || "";

      if (localTableConfig.sortDirection === "asc") {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });
  }, [candidates, localTableConfig.sortBy, localTableConfig.sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedCandidates.length / localTableConfig.pageSize);
  const startIndex = (localTableConfig.currentPage - 1) * localTableConfig.pageSize;
  const paginatedCandidates = sortedCandidates.slice(
    startIndex,
    startIndex + localTableConfig.pageSize
  );

  const handlePageChange = (newPage: number) => {
    setLocalTableConfig(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Column configuration
  const columnConfig: ColumnConfig = {
    full_name: { label: "Full Name", defaultWidth: 200 },
    email: { label: "Email", defaultWidth: 250 },
    phone_number: { label: "Phone", defaultWidth: 150 },
    gender: { label: "Gender", defaultWidth: 100 },
    linkedin_link: { label: "LinkedIn", defaultWidth: 200 },
    domicile: { label: "Domicile", defaultWidth: 150 },
    applied_date: { label: "Applied Date", defaultWidth: 150 },
    status: { label: "Status", defaultWidth: 120 },
  };

  // Safe column access function
  const getColumnConfig = (columnKey: string) => {
    return columnConfig[columnKey] || { label: columnKey, defaultWidth: 150 };
  };

  // Format date untuk display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get candidate value untuk kolom
  const getCandidateValue = (candidate: Candidate, columnKey: string): string => {
    const value = candidate[columnKey as keyof Candidate];
    if (columnKey === 'applied_date') {
      return formatDate(String(value));
    }
    return value ? String(value) : "-";
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Candidates</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Job Info Banner jika sedang filter */}
      {currentJob && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">
                {currentJob.title}
              </h3>
              <p className="text-blue-600 text-sm">
                {currentJob.department} •{" "}
                {currentJob.salary_range?.display_text ||
                  "Salary not specified"}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentJob.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {currentJob.status}
              </span>
              <p className="text-blue-600 text-sm mt-1">
                {candidates.length} candidate(s) applied
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter jika ada */}
      {status && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Status: {status}
            <button 
              onClick={() => window.location.href = `/admin/candidates${jobId ? `?jobId=${jobId}` : ''}`}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {localTableConfig.columnOrder.map((columnKey) => {
                  const column = getColumnConfig(columnKey);
                  const width =
                    localTableConfig.columnSizes[columnKey] || column.defaultWidth;
                  const isSortActive = localTableConfig.sortBy === columnKey;

                  return (
                    <th
                      key={columnKey}
                      draggable
                      onDragStart={() => handleDragStart(columnKey)}
                      onDragOver={(e) => handleDragOver(e, columnKey)}
                      onDragEnd={handleDragEnd}
                      style={{ width: `${width}px`, minWidth: "100px" }}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-move relative group select-none border-r border-gray-200 last:border-r-0"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleSort(columnKey)}
                          className="flex items-center space-x-1 hover:text-gray-700 focus:outline-none"
                        >
                          <span>{column.label}</span>
                          {isSortActive && (
                            <span className="text-gray-400">
                              {localTableConfig.sortDirection === "asc"
                                ? "↑"
                                : "↓"}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Resize Handle */}
                      <div
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-gray-300 hover:bg-blue-400 group-hover:bg-gray-400 transition-colors"
                        onMouseDown={(e) => handleResizeStart(columnKey, e)}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCandidates.map((candidate: Candidate, index: number) => (
                <tr
                  key={candidate.id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {localTableConfig.columnOrder.map((columnKey) => {
                    const column = getColumnConfig(columnKey);
                    const width =
                      localTableConfig.columnSizes[columnKey] ||
                      column.defaultWidth;
                    const value = getCandidateValue(candidate, columnKey);

                    return (
                      <td
                        key={columnKey}
                        style={{ width: `${width}px` }}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
                      >
                        {columnKey === "linkedin_link" && value && value !== "-" ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            View Profile
                          </a>
                        ) : columnKey === "status" ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              value === "new"
                                ? "bg-blue-100 text-blue-800"
                                : value === "reviewed"
                                ? "bg-yellow-100 text-yellow-800"
                                : value === "accepted"
                                ? "bg-green-100 text-green-800"
                                : value === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {value}
                          </span>
                        ) : (
                          <span className={value === "-" ? "text-gray-400" : ""}>
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {candidates.length === 0 && (
          <div className="text-center py-12 border-t border-gray-200">
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
              {currentJob
                ? `No candidates for ${currentJob.title}`
                : "No candidates yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentJob
                ? "Candidates will appear here when they apply to this job posting."
                : "Candidates will appear here when they apply to your job postings."}
            </p>
            {currentJob && (
              <Link
                href="/admin/candidates"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Candidates
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {candidates.length > 0 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    startIndex + localTableConfig.pageSize,
                    sortedCandidates.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{sortedCandidates.length}</span>{" "}
                candidates
                {currentJob && (
                  <span className="text-blue-600">
                    {" "}
                    for {currentJob.title}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handlePageChange(localTableConfig.currentPage - 1)
                  }
                  disabled={localTableConfig.currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (localTableConfig.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (localTableConfig.currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = localTableConfig.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border rounded-md min-w-[40px] ${
                          pageNum === localTableConfig.currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(localTableConfig.currentPage + 1)
                  }
                  disabled={localTableConfig.currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Stats */}
      {candidates.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              {candidates.length} {currentJob ? "filtered" : "total"}{" "}
              candidates
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              {candidates.filter(candidate => candidate.status === 'new').length} new candidates
            </span>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              Page {localTableConfig.currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Table Controls
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <strong>Drag column headers</strong> to reorder columns
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <strong>Drag the right edge</strong> of column headers to
                resize
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <strong>Click column headers</strong> to sort
                ascending/descending
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <strong>Use pagination</strong> to navigate through candidates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}