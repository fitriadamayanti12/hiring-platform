// components/Layout/Navigation.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      pathname !== "/login" &&
      pathname !== "/signup"
    ) {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  // Don't show navigation on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Hiring Platform
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Hiring Platform
              </span>
            </Link>

            {user && (
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {/* Admin access */}
                {user.role === "admin" && (
                  <>
                    <Link
                      href="/admin/jobs"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive("/admin/jobs")
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Jobs
                    </Link>
                    <Link
                      href="/admin/candidates"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive("/admin/candidates")
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Candidates
                    </Link>
                  </>
                )}

                {/* Applicant access */}
                {user.role === "applicant" && (
                  <Link
                    href="/jobs"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive("/jobs")
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Find Jobs
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm">
                  {user.role === "admin" ? "Admin" : "Applicant"}: {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              !isLoading && (
                <>
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {user && (
          <div className="md:hidden pb-3">
            <div className="flex space-x-4">
              {/* Admin access */}
              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin/jobs"
                    className={`text-sm font-medium ${
                      isActive("/admin/jobs")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link
                    href="/admin/candidates"
                    className={`text-sm font-medium ${
                      isActive("/admin/candidates")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Candidates
                  </Link>
                </>
              )}

              {/* Applicant access */}
              {user.role === "applicant" && (
                <Link
                  href="/jobs"
                  className={`text-sm font-medium ${
                    isActive("/jobs")
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Find Jobs
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
