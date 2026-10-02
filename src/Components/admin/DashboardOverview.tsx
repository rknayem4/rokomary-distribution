"use client";

import { useEffect, useState } from "react";

type OverviewData = {
  products: {
    total: number;
    active: number;
    inactive: number;
  };

  employees: {
    total: number;
    active: number;
    inactive: number;
  };
};

const DashboardOverview = () => {
  const [overview, setOverview] =
    useState<OverviewData | null>(null);

  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${baseUrl}/api/admin/dashboard/overview`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load dashboard overview",
          );
        }

        setOverview(data.overview);
      } catch (error) {
        console.error(
          "Dashboard overview error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Failed to load dashboard overview.
      </div>
    );
  }

  const cards = [
    {
      title: "Total Products",
      value: overview.products.total,
      description: `${overview.products.active} active products`,
      icon: "📦",
    },

    {
      title: "Active Products",
      value: overview.products.active,
      description: `${overview.products.inactive} inactive products`,
      icon: "✅",
    },

    {
      title: "Total Employees",
      value: overview.employees.total,
      description: `${overview.employees.active} active employees`,
      icon: "👥",
    },

    {
      title: "Active Employees",
      value: overview.employees.active,
      description: `${overview.employees.inactive} inactive employees`,
      icon: "🟢",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
              {card.icon}
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;