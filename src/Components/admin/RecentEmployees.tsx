"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Employee = {
  _id: string;
  userId?: string;

  name: string;
  email: string;

  profilePhoto?: string;

  designation?: string;
  role?: string;
  department?: string;

  phone?: string;

  status: "active" | "inactive";

  createdAt?: string;
};

const RecentEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

  useEffect(() => {
    const fetchRecentEmployees = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${baseUrl}/api/admin/dashboard/recent-employees`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load recent employees",
          );
        }

        setEmployees(data.employees || []);
      } catch (error) {
        console.error(
          "Recent employees error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEmployees();
  }, [baseUrl]);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-900">
            Recent Employees
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Recently registered employees
          </p>
        </div>

        <Link
          href="/dashboard/admin/employee"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3 p-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && employees.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-4xl">👥</div>

          <p className="mt-3 font-semibold text-gray-900">
            No employees found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add your first employee to see them here.
          </p>
        </div>
      )}

      {/* Employees */}
      {!loading && employees.length > 0 && (
        <div className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
            >
              {/* Profile Photo */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                {employee.profilePhoto ? (
                  <Image
                    src={employee.profilePhoto}
                    alt={employee.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
                    {employee.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Employee Information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {employee.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {employee.designation ||
                    employee.role ||
                    "Employee"}
                </p>

                {employee.department && (
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {employee.department}
                  </p>
                )}
              </div>

              {/* Joining Date */}
              <div className="hidden text-right sm:block">
                <p className="text-xs text-gray-400">
                  Joined
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {formatDate(employee.createdAt)}
                </p>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    employee.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employee.status === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentEmployees;