"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ IMPORT useRouter
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react"; // ✅ IMPORT useEffect

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter(); // ✅ ADD useRouter
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state: any) => state.auth.isAuthenticated
    );
    const user = useSelector((state: any) => state.auth.user);

    // ✅ FIX: Handle logout dengan proper redirect
    const handleLogout = () => {
        dispatch({ type: "auth/logout" });
        // Router push dipindahkan ke useEffect karena state change
    };

    // ✅ FIX: Redirect setelah logout success
    useEffect(() => {
        if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    const isActive = (path: string) => {
        return pathname.startsWith(path);
    };

    // Don't show navigation on auth pages
    if (pathname === "/login" || pathname === "/signup") {
        return null;
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

                        {isAuthenticated && (
                            <div className="hidden md:ml-8 md:flex md:space-x-8">
                                {user?.role === "admin" && (
                                    <>
                                        <Link
                                            href="/admin/jobs"
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/admin/jobs")
                                                    ? "border-blue-500 text-gray-900"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            Jobs
                                        </Link>
                                        <Link
                                            href="/admin/candidates"
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/admin/candidates")
                                                    ? "border-blue-500 text-gray-900"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            Candidates
                                        </Link>
                                    </>
                                )}
                                {user?.role === "applicant" && (
                                    <Link
                                        href="/jobs"
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/jobs")
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
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-700 text-sm">
                                    Hello, {user?.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
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
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}