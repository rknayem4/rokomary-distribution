import Link from "next/link";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Product",
      description: "Register a new product",
      href: "/dashboard/admin/product/add-product",
      icon: "📦",
    },
    {
      title: "Add Employee",
      description: "Create employee account",
      href: "/dashboard/admin/employee/add-employee",
      icon: "👤",
    },
    {
      title: "Manage Products",
      description: "View and update products",
      href: "/dashboard/admin/product",
      icon: "🛍️",
    },
    {
      title: "Manage Employees",
      description: "View and manage employees",
      href: "/dashboard/admin/employee",
      icon: "👥",
    },
  ];

  return (
    <section className="mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quickly access frequently used admin actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl transition group-hover:bg-blue-50">
                {action.icon}
              </div>

              <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                →
              </span>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {action.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;