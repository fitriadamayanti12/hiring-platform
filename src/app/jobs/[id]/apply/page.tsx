// src/app/jobs/[id]/apply/page.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import WebcamWithGesture from "@/components/WebcamWithGesture";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import useAuth

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user: authUser } = useAuth(); // ✅ Gunakan useAuth untuk user

  const jobId = params.id as string;
  const jobs = useSelector((state: any) => state.jobs.jobs);

  // Gunakan user dari auth context, fallback ke Redux
  const user = authUser || useSelector((state: any) => state.auth.user);

  const job = jobs.find((j: any) => j.id === jobId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h1>
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

  // Get form configuration from job with fallback to default fields
  const formConfig = useMemo(() => {
    console.log("Job application form:", job.application_form);

    // Use the form configuration from the job, or fallback to default
    const jobFields = job.application_form?.sections?.[0]?.fields;

    if (jobFields && jobFields.length > 0) {
      console.log("Using job form fields:", jobFields);
      return jobFields;
    }

    // Fallback to default fields based on case study requirements
    console.log("Using default form fields");
    return [
      { key: "full_name", validation: { required: true }, type: "text" },
      { key: "email", validation: { required: true }, type: "email" },
      { key: "phone_number", validation: { required: true }, type: "tel" },
      { key: "linkedin_link", validation: { required: true }, type: "url" },
      { key: "gender", validation: { required: true }, type: "select" },
      { key: "domicile", validation: { required: false }, type: "text" },
      { key: "date_of_birth", validation: { required: false }, type: "date" },
      { key: "photo_profile", validation: { required: true }, type: "image" },
    ];
  }, [job]);

  // Show loading if form config is being determined
  if (!formConfig || formConfig.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  // Initialize form state dengan data user yang sudah login
  const [formData, setFormData] = useState<Record<string, string>>({
    full_name: user.user_metadata?.full_name || "",
    email: user.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldKey]) {
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formConfig.forEach((field: any) => {
      // Only validate if field is required and exists in form config
      if (field.validation?.required && !formData[field.key]) {
        newErrors[field.key] = `${getFieldLabel(field.key)} is required`;
      }

      // Email validation
      if (field.key === "email" && formData[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.key])) {
          newErrors[field.key] = "Please enter a valid email address";
        }
      }

      // URL validation for LinkedIn
      if (field.key === "linkedin_link" && formData[field.key]) {
        try {
          new URL(formData[field.key]);
        } catch {
          newErrors[field.key] = "Please enter a valid URL";
        }
      }

      // Phone number validation
      if (field.key === "phone_number" && formData[field.key]) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(formData[field.key].replace(/\s/g, ""))) {
          newErrors[field.key] = "Please enter a valid phone number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. First, upload photo to Supabase Storage if exists
      let photoUrl = formData.photo_profile || null;

      if (
        formData.photo_profile &&
        formData.photo_profile.startsWith("data:image")
      ) {
        // Convert base64 to blob
        const response = await fetch(formData.photo_profile);
        const blob = await response.blob();

        const fileName = `photo_${Date.now()}_${user.id}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("candidate-photos")
          .upload(fileName, blob, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("candidate-photos")
          .getPublicUrl(uploadData.path);

        photoUrl = urlData.publicUrl;
      }

      // 2. Prepare candidate data for Supabase
      const candidateData = {
        job_id: job.id,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        linkedin_link: formData.linkedin_link,
        gender: formData.gender,
        domicile: formData.domicile,
        date_of_birth: formData.date_of_birth,
        photo_url: photoUrl,
        status: "new",
        applied_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 3. Insert candidate to Supabase
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .insert([candidateData])
        .select()
        .single();

      if (candidateError) {
        console.error("Error creating candidate:", candidateError);
        throw new Error(
          `Failed to submit application: ${candidateError.message}`
        );
      }

      // 4. Dispatch to Redux for local state management (jika diperlukan)
      if (dispatch) {
        dispatch({
          type: "candidates/addCandidate",
          payload: candidate,
        });
      }

      // 5. Redirect to success page
      router.push("/jobs/apply/success");
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrors({
        submit:
          error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (fieldKey: string) => {
    const labels: Record<string, string> = {
      full_name: "Full Name",
      email: "Email Address",
      phone_number: "Phone Number",
      linkedin_link: "LinkedIn Profile URL",
      gender: "Gender",
      domicile: "Domicile",
      date_of_birth: "Date of Birth",
      photo_profile: "Profile Photo",
    };

    return (
      labels[fieldKey] ||
      fieldKey
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || "";
    const error = errors[field.key];
    const isRequired = field.validation?.required;
    const fieldType = field.type || field.key;

    switch (fieldType) {
      case "email":
        return (
          <input
            id={field.key}
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="your.email@example.com"
          />
        );

      case "phone_number":
      case "tel":
        return (
          <input
            id={field.key}
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="+62 812-3456-7890"
          />
        );

      case "linkedin_link":
      case "url":
        return (
          <input
            id={field.key}
            type="url"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        );

      case "gender":
      case "select":
        return (
          <select
            id={field.key}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        );

      case "date_of_birth":
      case "date":
        return (
          <input
            id={field.key}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          />
        );

      case "photo_profile":
      case "file":
      case "image":
        return (
          <div className="space-y-4">
            {formData[field.key] ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden max-w-xs mx-auto border-2 border-green-200">
                  <img
                    src={formData[field.key]}
                    alt="Profile preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Ready
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, [field.key]: "" }));
                      setErrors((prev) => ({ ...prev, [field.key]: "" }));
                    }}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            ) : (
              <WebcamWithGesture
                onCapture={(imageData) => {
                  handleInputChange(field.key, imageData);
                }}
                onError={(error) => {
                  console.error("Webcam error:", error);
                  setErrors((prev) => ({
                    ...prev,
                    [field.key]: error,
                  }));
                }}
              />
            )}

            {/* Fallback file upload */}
            {!formData[field.key] && (
              <div className="text-center border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Or upload existing photo:
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        setErrors((prev) => ({
                          ...prev,
                          [field.key]: "File size must be less than 5MB",
                        }));
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = (e) => {
                        handleInputChange(
                          field.key,
                          e.target?.result as string
                        );
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}

            {errors[field.key] && (
              <p className="text-sm text-red-600 mt-2">{errors[field.key]}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <textarea
            id={field.key}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder={`Enter your ${getFieldLabel(field.key).toLowerCase()}`}
          />
        );

      default:
        return (
          <input
            id={field.key}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder={`Enter your ${getFieldLabel(field.key).toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/jobs/${job.id}`}
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
            Back to Job Details
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply for {job.title}
            </h1>
            <p className="text-gray-600">
              {job.department && (
                <span className="font-medium">
                  Department: {job.department}
                </span>
              )}
              {job.salary_range?.display_text && (
                <span className="ml-4 font-medium">
                  Salary: {job.salary_range.display_text}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Application Form
            </h2>

            <div className="space-y-6">
              {formConfig.map((field: any) => (
                <div key={field.key} id={`field-${field.key}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getFieldLabel(field.key)}
                    {field.validation?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderField(field)}
                  {errors[field.key] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <Link
              href={`/jobs/${job.id}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>

        {/* Required Fields Note */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Fields marked with <span className="text-red-500">*</span> are
            required. The form adapts dynamically based on the job's
            configuration.
          </p>
        </div>
      </div>
    </div>
  );
}
