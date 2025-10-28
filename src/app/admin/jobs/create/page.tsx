"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createJob } from "@/redux/slices/jobsSlice";
import type { Job } from "@/redux/slices/jobsSlice";

// Field configuration options
const FORM_FIELDS = [
  { key: "full_name", label: "Full Name", type: "text" },
  { key: "photo_profile", label: "Photo Profile", type: "file" },
  { key: "gender", label: "Gender", type: "select" },
  { key: "domicile", label: "Domicile", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone_number", label: "Phone Number", type: "tel" },
  { key: "linkedin_link", label: "LinkedIn Profile", type: "url" },
  { key: "date_of_birth", label: "Date of Birth", type: "date" },
];

export default function CreateJobPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Safe access to Redux state dengan default values
  const jobsState = useAppSelector((state) => state.jobs);
  const operationLoading = jobsState?.operationLoading ?? {
    create: false,
    update: false,
    delete: false,
  };
  const error = jobsState?.error;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    status: "draft" as "active" | "inactive" | "draft",
    salary_min: "",
    salary_max: "",
    currency: "IDR",
  });

  // Field configuration state
  const [fieldConfig, setFieldConfig] = useState(
    FORM_FIELDS.map((field) => ({
      ...field,
      required: field.key === "full_name" || field.key === "email",
    }))
  );

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleFieldConfigChange = (fieldKey: string, required: boolean) => {
    setFieldConfig((prev) =>
      prev.map((field) =>
        field.key === fieldKey ? { ...field, required } : field
      )
    );
  };

  const getStatusLabel = (required: boolean): string => {
    return required ? "Mandatory" : "Optional";
  };

  const getStatusColor = (required: boolean): string => {
    return required
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim() || !formData.department.trim()) {
      setFormError("Please fill in all required fields");
      return;
    }

    // Create new job object for Supabase
    const newJobData: Omit<Job, "id"> = {
      title: formData.title.trim(),
      // slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: formData.status,
      department: formData.department.trim(),
      description: formData.description.trim() || undefined,
      salary_range: {
        min: parseInt(formData.salary_min) || 0,
        max: parseInt(formData.salary_max) || 0,
        currency: formData.currency,
        display_text:
          formData.salary_min && formData.salary_max
            ? `Rp${parseInt(formData.salary_min).toLocaleString(
                "id-ID"
              )} - Rp${parseInt(formData.salary_max).toLocaleString("id-ID")}`
            : "Negotiable",
      },
      application_form: {
        sections: [
          {
            title: "Minimum Profile Information Required",
            fields: fieldConfig
              .filter((field) => field.required !== false)
              .map((field) => ({
                key: field.key,
                validation: { required: field.required },
              })),
          },
        ],
      },
      list_card: {
        badge:
          formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
        started_on_text: `started on ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`,
        cta: "Manage Job",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Dispatch the createJob async thunk
      const result = await dispatch(createJob(newJobData)).unwrap();

      // Redirect to jobs list on success
      router.push("/admin/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);
      setFormError("Failed to create job. Please try again.");
    }
  };

  // Safe access untuk loading state
  const isCreating = operationLoading?.create ?? false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/jobs"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Jobs
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Job
              </h1>
              <p className="text-gray-600 mt-2">
                Fill in the job details and configure application requirements
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(error || formError) && (
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
              <span className="text-red-800">{error || formError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Job Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Frontend Developer"
                  required
                  disabled={isCreating}
                />
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Engineering"
                  required
                  disabled={isCreating}
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isCreating}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isCreating}
                >
                  <option value="IDR">IDR (Rupiah)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (Min)
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum salary"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (Max)
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Maximum salary"
                  disabled={isCreating}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  disabled={isCreating}
                />
              </div>
            </div>
          </div>

          {/* Application Form Configuration Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Application Form Configuration
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Configure required fields
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Set which fields applicants must fill out. Click on field status
                to toggle between Mandatory and Optional.
              </p>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Field Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fieldConfig.map((field) => (
                      <tr key={field.key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {field.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {field.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleFieldConfigChange(
                                field.key,
                                !field.required
                              )
                            }
                            disabled={isCreating}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                              isCreating
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:opacity-80"
                            } ${getStatusColor(field.required)}`}
                          >
                            {getStatusLabel(field.required)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Configuration Guide
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          <strong>Mandatory</strong>: Applicants must fill this
                          field
                        </li>
                        <li>
                          <strong>Optional</strong>: Applicants can skip this
                          field
                        </li>
                        <li>
                          Fields marked as Optional won't be shown to applicants
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link
              href="/admin/jobs"
              className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium ${
                isCreating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              onClick={(e) => isCreating && e.preventDefault()}
            >
              Cancel
            </Link>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (isCreating) return;
                  setFormData({
                    title: "",
                    department: "",
                    description: "",
                    status: "draft",
                    salary_min: "",
                    salary_max: "",
                    currency: "IDR",
                  });
                  setFieldConfig(
                    FORM_FIELDS.map((field) => ({
                      ...field,
                      required:
                        field.key === "full_name" || field.key === "email",
                    }))
                  );
                  setFormError(null);
                }}
                disabled={isCreating}
                className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium ${
                  isCreating
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isCreating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Job...
                  </>
                ) : (
                  "Create Job"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
