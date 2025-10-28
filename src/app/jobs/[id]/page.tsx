"use client";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const jobs = useSelector((state: any) => state.jobs.jobs);
  const job = jobs.find((j: any) => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist.
          </p>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-500">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (job.status !== "active") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Available
          </h1>
          <p className="text-gray-600 mb-4">
            This job is no longer accepting applications.
          </p>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-500">
            Browse Other Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/jobs"
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-xl text-gray-600 mt-2">{job.department}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
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
                <span className="font-semibold">
                  {job.salary_range.display_text}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {job.list_card?.started_on_text || "Recently posted"}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Remote Friendly</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link
                href={`/jobs/${job.id}/apply`}
                className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {/* Requirements & Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>3+ years of relevant experience</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Strong communication skills</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Bachelor's degree or equivalent</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What We Offer
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Flexible working hours</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Health insurance benefits</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Professional development opportunities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Ready to Apply?
          </h3>
          <p className="text-blue-700 mb-4">
            Join our team and take the next step in your career journey.
          </p>
          <Link
            href={`/jobs/${job.id}/apply`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Apply for this Position
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
