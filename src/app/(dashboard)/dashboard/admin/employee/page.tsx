import Link from "next/link";
import { getEmployees } from "@/app/lib/actions/employees";
import EmployeeTable from "./EmployeeTable";

const EmployeePage = async () => {
  const data = await getEmployees();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Employee Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your employees, roles, contact information and status.
            </p>
          </div>

          <Link
            href="/dashboard/admin/employee/add-employee"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Employee
          </Link>
        </div>

        {/* Employee Table */}
        <EmployeeTable
          initialEmployees={data?.employees || []}
        />
      </div>
    </div>
  );
};

export default EmployeePage;