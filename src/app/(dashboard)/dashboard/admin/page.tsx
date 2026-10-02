import DashboardOverview from "@/Components/admin/DashboardOverview";
import QuickActions from "@/Components/admin/QuickActions";
import RecentActivities from "@/Components/admin/RecentActivities";
import RecentEmployees from "@/Components/admin/RecentEmployees";
import RecentProducts from "@/Components/admin/RecentProducts";

const AdminDashboardPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here is your business overview.
          </p>
        </div>

        {/* Overview */}
        <DashboardOverview />
        <QuickActions />
        <RecentProducts />
        <RecentEmployees />
        <RecentActivities />
      </div>
    </main>
  );
};

export default AdminDashboardPage;