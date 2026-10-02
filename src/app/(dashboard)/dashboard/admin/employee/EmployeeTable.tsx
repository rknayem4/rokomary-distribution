"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Employee = {
  _id: string;
  userId: string;

  name: string;
  email: string;

  profilePhoto?: string;

  designation?: string;
  role?: string;
  department?: string;

  phone?: string;
  alternatePhone?: string;

  address?: string;
  joiningDate?: string;

  status: "active" | "inactive";

  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  initialEmployees: Employee[];
};

const EmployeeTable = ({ initialEmployees }: Props) => {
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

  // ========================================
  // FETCH EMPLOYEES
  // ========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      const queryString = params.toString();

      const res = await fetch(
        `${baseUrl}/api/employees${
          queryString ? `?${queryString}` : ""
        }`,
      );

      const data = await res.json();

      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Fetch employees error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH DEBOUNCE
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, status]);

  // ========================================
  // CHANGE STATUS
  // ========================================

  const handleStatusChange = async (
    employee: Employee,
  ) => {
    const newStatus =
      employee.status === "active"
        ? "inactive"
        : "active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus === "active"
          ? "activate"
          : "deactivate"
      } ${employee.name}?`,
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${baseUrl}/api/employees/${employee._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update status",
        );
      }

      setEmployees((previousEmployees) =>
        previousEmployees.map((item) =>
          item._id === employee._id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Update employee status error:",
        error,
      );

      alert("Failed to update employee status.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ========================================
          SEARCH / FILTER
      ======================================== */}

      <div className="border-b border-gray-200 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email, phone, designation..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status */}
          <div className="w-full md:w-48">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="border-b border-gray-100 px-5 py-3 text-sm text-gray-500">
          Loading employees...
        </div>
      )}

      {/* ========================================
          TABLE
      ======================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-left">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Employee
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Designation
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Department
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr
                  key={employee._id}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Photo */}
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
                        {employee.profilePhoto ? (
                          <Image
                            src={
                              employee.profilePhoto
                            }
                            alt={employee.name}
                            fill
                            sizes="44px"
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

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {employee.name}
                        </p>

                        <p className="truncate text-sm text-gray-500">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Designation */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {employee.designation ||
                        "Not specified"}
                    </p>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600">
                      {employee.department ||
                        "Not specified"}
                    </p>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {employee.phone || "N/A"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(employee)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {employee.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/employee/${employee._id}/edit`}
                      className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center"
                >
                  <div className="mx-auto max-w-sm">
                    <div className="mb-3 text-4xl">
                      👥
                    </div>

                    <h3 className="font-semibold text-gray-900">
                      No employees found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or
                      status filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {employees.length}
          </span>{" "}
          employee
          {employees.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default EmployeeTable;