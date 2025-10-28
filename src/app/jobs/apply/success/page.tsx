"use client";
import Link from "next/link";

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
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
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying. Your application has been successfully
          submitted and is now under review. We'll contact you if your profile
          matches our requirements.
        </p>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What's Next?
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li className="flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5"
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
              <span>
                We'll review your application within 3-5 business days
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5"
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
              <span>You may be contacted for an initial screening call</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5"
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
              <span>Check your email regularly for updates</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/jobs"
            className="w-full block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse More Jobs
          </Link>
          <Link
            href="/"
            className="w-full block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
