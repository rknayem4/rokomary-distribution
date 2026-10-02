import Link from "next/link";
import EmployeeTable from "./EmployeeTable";

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

const getEmployees =
  async (): Promise<Employee[]> => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:8000";

      const response =
        await fetch(
          `${baseUrl}/api/employees`,
          {
            cache: "no-store",
          },
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch employees",
        );
      }

      const data =
        await response.json();

      return data.success
        ? data.employees || []
        : [];
    } catch (error) {
      console.error(
        "GET EMPLOYEES ERROR:",
        error,
      );

      return [];
    }
  };

const EmployeePage =
  async () => {
    const employees =
      await getEmployees();

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Employees
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage employee accounts,
                information and status.
              </p>
            </div>

            <Link
              href="/dashboard/admin/employee/add-employee"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Employee
            </Link>

          </div>

          {/* ========================================
              TABLE
          ======================================== */}

          <EmployeeTable
            initialEmployees={
              employees
            }
          />

        </div>
      </div>
    );
  };

export default EmployeePage;