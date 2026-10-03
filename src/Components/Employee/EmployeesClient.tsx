"use client";

import { useEffect, useState } from "react";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import EmployeeCard, { Employee } from "./EmaployeeCard";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

type EmployeeStatus = "active" | "inactive" | "all";

interface EmployeePagination {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

interface EmployeesClientProps {
  initialEmployees: Employee[];
  pagination: EmployeePagination;
}

const EmployeesClient = ({
  initialEmployees,
  pagination: initialPagination,
}: EmployeesClientProps) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const [pagination, setPagination] =
    useState<EmployeePagination>(initialPagination);

  const [search, setSearch] = useState<string>("");

  // IMPORTANT: default active
  const [status, setStatus] = useState<EmployeeStatus>("active");

  const [loading, setLoading] = useState<boolean>(false);

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async (
    page: number = 1,
    currentSearch: string = search,
    currentStatus: EmployeeStatus = status,
  ): Promise<void> => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("search", currentSearch.trim());

      params.set("status", currentStatus);

      params.set("page", String(page));

      params.set("limit", "12");

      const url = `${BACKEND_URL}/api/public/employees?${params.toString()}`;

      console.log("Employee API:", url);

      const response = await fetch(url, {
        cache: "no-store",
      });

      const data = await response.json();

      console.log("Employee response:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load employees");
      }

      setEmployees(data.employees || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("FETCH EMPLOYEES ERROR:", error);

      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1, search, status);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusChange = (newStatus: EmployeeStatus): void => {
    setStatus(newStatus);

    fetchEmployees(1, search, newStatus);
  };

  return (
    <section className="min-h-screen bg-slate-50">
      {/* Header */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Team
          </p>

          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Meet Our Employees
          </h1>

          <p className="mt-3 text-slate-500">
            Get to know the people behind Rokomary Distribution.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search + Filter */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as EmployeeStatus)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="active">Active Employees</option>

              <option value="inactive">Inactive Employees</option>

              <option value="all">All Employees</option>
            </select>
          </div>
        </div>

        {/* Result */}

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading
              ? "Loading..."
              : `${pagination?.totalEmployees || 0} employees found`}
          </p>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
            {status === "active"
              ? "Active"
              : status === "inactive"
                ? "Inactive"
                : "All Employees"}
          </span>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          /* Empty */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Search size={30} className="mx-auto text-slate-300" />

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No employee found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or status.
            </p>
          </div>
        ) : (
          /* Employee Grid */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {employees.map((employee: Employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        )}

        {/* Pagination */}

        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchEmployees(pagination.currentPage - 1)}
              className="flex items-center gap-1 rounded-xl border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              {pagination.currentPage}
            </span>

            <span className="text-sm text-slate-400">of</span>

            <span className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">
              {pagination.totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchEmployees(pagination.currentPage + 1)}
              className="flex items-center gap-1 rounded-xl border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployeesClient;
